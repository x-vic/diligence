import { db, IGroups, INotes } from './Diligence'

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

type GetGroupIds = number | ((ids: number[]) => number[])
export const updateGroupsOrder = async (getGroupIds: GetGroupIds) => {
  // 获得之前的排序
  let res = await db.groupSequence.toCollection().first()
  // 第一次走这段逻辑
  if (!res)
    res = {
      id: 0,
      name: 'groupSequences',
      sequence: [],
    }
  let sequence = res.sequence
  if (typeof getGroupIds === 'number') {
    sequence.push(getGroupIds)
  } else {
    sequence = getGroupIds(sequence)
  }
  res.sequence = Array.from(new Set(sequence))
  // 更新 sequence
  return db.groupSequence.put(res)
}

// 添加一个笔记组
export const addGroup = async (groupName: string, notes: Partial<INotes>[]) => {
  const groupId = await getLastId('groups')
  let noteId = await getLastId('notes')
  console.log('groupId, noteId', groupId, noteId)

  const group = { id: groupId, name: groupName, notes: [] }
  const newNotes = []
  // 生成笔记
  for (const note of notes) {
    if (!note.id) note.id = noteId
    newNotes.push(note)
    group.notes.push(noteId)
    noteId++
  }
  // 入库
  return Promise.all([
    db.notes.bulkPut(newNotes),
    db.groups.put(group),
    updateGroupsOrder(groupId),
  ])
}

// 导出全部数据
export const exportAll = async () => {
  const res = {
    groupSequence: await db.groupSequence.toCollection().toArray(),
    groups: await db.groups.toCollection().toArray(),
    notes: await db.notes.toCollection().toArray(),
  }
  return res
}

// 恢复全部数据
export const recover = async (data) => {
  const { groupSequence, groups, notes } = data
  // 删除所有数据
  await Promise.all([
    db.groupSequence.toCollection().delete(),
    db.groups.toCollection().delete(),
    db.notes.toCollection().delete(),
  ])
  // 添加数据
  return Promise.all([
    db.notes.bulkPut(notes),
    db.groups.bulkPut(groups),
    db.groupSequence.bulkPut(groupSequence),
  ])
}
;(async function run() {
  // const res = await getLastId('groupSequences')
  // const res = await updateGroupsOrder(7)
  // const res = await addGroup('hehe', [
  //   { title: '西方现代思想2', content: '我的天啊2。。。。。。。。。。。。。' },
  //   { title: '经济学讲义2', content: '我的地啊2。。。。。。。。。。。。。' },
  // ])
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
  // console.log('resres', res)
})

// updateGroupsOrder((ids) => ids)
