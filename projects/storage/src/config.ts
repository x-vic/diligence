export const dataBase = 'diligence'

export enum ObjectStores {
  // 存储笔记组的顺序
  groupSequences = 'groupSequences',
  // 存储 { 笔记组 id ==> [笔记集合] }
  groups = 'groups',
  // 存储所有的笔记
  notes = 'notes',
}
