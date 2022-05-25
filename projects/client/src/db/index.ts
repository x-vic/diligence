import {
  add,
  createObjectStore,
  findById,
  getLastIndex,
  init,
  ObjectStores,
  update,
} from 'storage'
import { Group } from '../domain/Group'

export async function initObjectStores() {
  await init()
  const objectStore = await createObjectStore(
    ObjectStores.groupSequences,
    'id',
    [['name', true]]
  )
  await createObjectStore(ObjectStores.groups, 'id', [['name', true]])
  await createObjectStore(ObjectStores.notes, 'id', [
    ['title', true],
    ['content', true],
  ])
  objectStore &&
    (objectStore.transaction.oncomplete = (event) => {
      // 将数据保存到新创建的对象仓库
      add(ObjectStores.groupSequences, {
        id: 0,
        name: ObjectStores.groupSequences,
        sequences: [],
      })
    })
}

export const addGroups = async (data: Group) => {
  const groups = Array.isArray(data) ? data : [data]
  for (const group of groups) {
    const { name: groupName, notes } = group
    // 添加 groupID 进排序
    const lastGroupIndex = (await getLastIndex(ObjectStores.groups)) as number
    const groupId = lastGroupIndex + 1
    const notesIndex = []
    let lastNoteIndex = (await getLastIndex(ObjectStores.notes)) as number
    // 添加笔记
    for (const note of notes) {
      if (!note.id) note.id = ++lastNoteIndex
      await add(ObjectStores.notes, note)
      notesIndex.push(lastNoteIndex)
    }
    // 添加组
    await add(ObjectStores.groups, {
      id: groupId,
      name: groupName,
      notesIndex,
    })
    // 维护组的顺序
    const res = await findById(ObjectStores.groupSequences, 0)
    // @ts-ignore
    res.sequences.push(groupId)
    await update(ObjectStores.groupSequences, res)
  }
}
