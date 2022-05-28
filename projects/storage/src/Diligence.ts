import Dexie from 'dexie'

export interface IGroupSequence {
  id: number
  name: 'groupSequences'
  sequence: number[]
}

export interface IGroups {
  id: number
  name: string
  notes: number[]
}

export interface INotes {
  id: number
  completed: boolean // 是否为简单知识
  degree: number // 掌握程度
  progress: boolean // 是否在进行中
  created: number // 创建时间
  remark: string[] // 标记 / 评论
  lastReview: number // 上次复习的时间
  lastTimes: number // 上次是第几次
  errorTimes: number // 累计错误的次数
  tags: string[]
  title: string
  content: string
}

export class Diligence extends Dexie {
  groupSequence!: Dexie.Table<IGroupSequence, number>
  groups!: Dexie.Table<IGroups, number>
  notes!: Dexie.Table<INotes, number>

  constructor() {
    super('diligence')
    var db = this
    this.version(1).stores({
      groupSequence: 'id, &name',
      groups: 'id, &name',
      notes: 'id, &title, &content',
      // , *tags, *remark, completed, degree, progress, created, lastReview, lastTimes, errorTimes
    })
  }
}

export var db = new Diligence()
