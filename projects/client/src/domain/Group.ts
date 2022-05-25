import { Note } from './Note'

export class Group {
  public completed: false
  public created: number = Date.now()
  public notes: Note[] = []
  constructor(public name: string) {}

  static fromJson(name: string, jsonStr: string): Group {
    const group = new Group(name)
    let notes: Note[]
    try {
      notes = JSON.parse(jsonStr)
      group.notes = notes.map((note) => Note.fromJsonObj(note))
      return group
    } catch (e) {
      console.error(`解析 json 为 notes 出现问题`, e)
      throw e
    }
  }
}
