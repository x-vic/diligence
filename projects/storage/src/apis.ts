import { db } from './Diligence'
import { IGroup, Progress } from './domain/GroupSequence'
import { Bool, INote, Note } from './domain/Note'

// 获取最新可用的 ID
export const getLastId = async (tableName: string): Promise<number> => {
  const res = await db[tableName]
    .toCollection()
    .last()
    .catch(() => ({
      id: null,
    }))
  return res?.id ? res.id + 1 : 0
}

type GetGroupNames =
  | string
  | ((names: { name: string; progress: Progress }[]) => IGroup[])

export const updateGroupsOrder = async (getGroupNames: GetGroupNames) => {
  // 获得之前的排序
  let res = await db.groupSequence.toCollection().first()
  // 第一次走这段逻辑
  if (!res)
    res = {
      name: 'groupSequences',
      sequence: [],
    }
  let sequence = res.sequence
  if (typeof getGroupNames === 'string') {
    sequence.push({ name: getGroupNames, progress: Progress.idle })
  } else {
    sequence = getGroupNames(sequence)
  }
  res.sequence = Array.from(new Set(sequence))
  // 更新 sequence
  return db.groupSequence.put(res)
}

// 添加一个笔记组
export const addGroup = async (groupName: string, notes: Partial<INote>[]) => {
  const newNotes = notes.map((note) => ({
    ...Note.fromJsonObj(note),
    groupName,
  }))
  // 添加笔记
  await db.notes.bulkPut(newNotes)
  // 更新笔记本组
  await updateGroupsOrder(groupName)
}

// 导出全部数据
export const exportAll = async () => {
  const res = {
    groupSequence: await db.groupSequence.toCollection().toArray(),
    notes: await db.notes.toCollection().toArray(),
  }
  return res
}

// 恢复全部数据
export const recover = async (data) => {
  const { groupSequence, notes } = data
  // 删除所有数据
  await Promise.all([
    db.groupSequence.toCollection().delete(),
    db.notes.toCollection().delete(),
  ])
  // 添加数据
  return Promise.all([
    db.notes.bulkPut(notes.map((note) => Note.fromJsonObj(note))),
    db.groupSequence.bulkPut(groupSequence),
  ])
}

// 获取当日任（获取 n 个任务）
// 1. 一旦被标记一次错误，掌握程度直接变为 0
// 2. 根据**上次记忆时间**和**上次是第几次**记忆，调整优先级（上次记忆的时间越短，越需要尽快记忆）
// 3. 一旦被标记为简单，则变成完成状态
// 4. 记录错误的次数
export const getTasks = async (
  review: number = 0,
  add: number,
  total = review + add
) => {
  const res = {
    review: [],
    add: [],
    get length() {
      return this.review.length + this.add.length
    },
  }
  // 找到需要复习的记录
  // 进行中的  + 上次记忆的时间 & 第几次 & 错误的次数
  const reviewNotes = await db.notes
    .where({
      progress: Progress.underway,
    })
    .sortBy('[lastReview+lastTimes+errorTimes]')
  // .limit()

  // 真正需要复习的数量
  const realReview = Math.min(review, reviewNotes.length)
  // 添加复习的笔记
  res.review.push(...reviewNotes.splice(0, realReview))

  // 找新增
  // 取出笔记本组
  const groups = await db.groupSequence.toCollection().first()
  const underwayIndex = groups.sequence.findIndex(
    ({ progress }) => progress === Progress.underway
  )
  const startIndex =
    underwayIndex === -1
      ? groups.sequence.find(({ progress }) => progress === Progress.idle)
      : underwayIndex

  for (let i = 0; i < groups.sequence.length; i++) {
    if (i < startIndex || res.length >= total) continue
    // 获取 idle 的笔记
    const groupName = groups.sequence[i].name
    const notes = await db.notes
      .where({ groupName, progress: Progress.idle })
      .limit(total - res.length)
      .toArray()
    res.add.push(...notes)
  }
  console.log('tasks', res)

  return res

  // 找到新增的记录
  // 还未开始 & 未完成  +  按照组别排序来找
}
;(async function run() {
  getTasks(5, 12)
  // const res = await getLastId('groupSequences')
  // const res = await updateGroupsOrder(7)
  // const res = await addGroup('haha', [
  //   { title: '666', content: '666', completed: 1 },
  // ])
  // console.log('resres', res)
  // const res = await exportAll()
  // const res = await recover({
  //   groupSequence: [
  //     {
  //       id: 0,
  //       name: 'groupSequences',
  //       sequence: [0],
  //     },
  //   ],
  //   groups: [
  //     {
  //       id: 0,
  //       name: 'hehe',
  //       notes: [0, 1],
  //     },
  //   ],
  //   notes: [
  //     {
  //       title: '西方现代思想2',
  //       content: '我的天啊2。。。。。。。。。。。。。',
  //       id: 0,
  //     },
  //     {
  //       title: '经济学讲义2',
  //       content: '我的地啊2。。。。。。。。。。。。。',
  //       id: 1,
  //     },
  //   ],
  // })
})()

// updateGroupsOrder((ids) => ids)
