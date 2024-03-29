import { Progress } from './GroupSequence'

export enum Bool {
  false = 0,
  true = 1,
}

export interface INote {
  completed: Bool // 是否为简单知识
  degree: number // 掌握程度
  progress: Progress // 是否在进行中
  created: number // 创建时间
  remark: string[] // 标记 / 评论
  lastReview: number // 上次复习的时间
  lastTimes: number // 上次是第几次
  errorTimes: number // 累计错误的次数
  tags: string[]
  title: string
  content: string
  groupName: string
}

export class Note implements INote {
  // public id: number
  public completed: Bool = Bool.false // 是否为简单知识
  public degree: number = 0 // 掌握程度
  public progress: Progress = Progress.idle // 是否在进行中
  public created: number = Date.now() // 创建时间
  public lastReview: number = 0 // 上次复习时间
  public lastTimes: number = 0 // 上次是第几次
  public errorTimes: number = 0
  public groupName: string
  public remark: string[] = [] // 标记 / 评论
  public tags: string[] = []
  constructor(public title: string, public content: string) {}

  // 原始数据可能有很多缺失，这里可以补齐
  static fromJsonObj({
    title,
    content,
    completed,
    degree,
    progress,
    created,
    lastReview,
    lastTimes,
    errorTimes,
    groupName,
    remark,
    tags,
  }: Partial<INote>): Note {
    const note = new Note(title, content)
    completed && (note.completed = completed)
    degree && (note.degree = degree)
    progress && (note.progress = progress)
    lastReview && (note.lastReview = lastReview)
    lastTimes && (note.lastTimes = lastTimes)
    errorTimes && (note.created = errorTimes)
    created && (note.created = created)
    groupName && (note.groupName = groupName)
    if (remark) {
      const remarks = Array.isArray(remark) ? remark : [remark]
      note.remark = remarks
    }
    if (tags) {
      const _tags = Array.isArray(tags) ? tags : [tags]
      note.tags = _tags
    }
    return note
  }
}
