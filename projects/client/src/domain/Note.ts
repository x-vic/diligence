interface INote {
  completed: boolean // 是否为简单知识
  degree: number // 掌握程度
  progress: boolean // 是否在进行中
  created: number // 创建时间
  remark: string[] // 标记 / 评论
  title: string
  content: string
}

export class Note implements INote {
  public id: number
  public completed: boolean = false // 是否为简单知识
  public degree: number = 0 // 掌握程度
  public progress: boolean = false // 是否在进行中
  public created: number = Date.now() // 创建时间
  public remark: string[] = [] // 标记 / 评论
  constructor(public title: string, public content: string) {}

  static fromJsonObj({
    title,
    content,
    completed,
    degree,
    progress,
    created,
    remark,
  }: INote): Note {
    const note = new Note(title, content)
    completed && (note.completed = completed)
    degree && (note.degree = degree)
    progress && (note.progress = progress)
    created && (note.created = created)
    if (remark) {
      const remarks = Array.isArray(remark) ? remark : [remark]
      note.remark = remarks
    }
    return note
  }
}
