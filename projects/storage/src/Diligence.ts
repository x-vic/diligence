import Dexie from 'dexie'
import { IGroupSequence } from './domain/GroupSequence'
import { Bool, INote } from './domain/Note'

export interface IGroups {
  id: number
  name: string
  notes: number[]
}

export interface IRecord {
  date: string
  completed: Bool
  tasks: any[]
}

export class Diligence extends Dexie {
  groupSequence!: Dexie.Table<IGroupSequence, number>
  // groups!: Dexie.Table<IGroups, number>
  notes!: Dexie.Table<INote, number>
  records!: Dexie.Table<Object, string>

  constructor() {
    super('diligence')
    var db = this
    this.version(4).stores({
      groupSequence: '&name',
      // groups: 'id, &name',
      notes:
        '&title, &content, groupName, progress, completed, degree, errorTimes, tags, remark, [groupName+progress], [groupName+completed], [lastReview+lastTimes+errorTimes], [progress+completed]',
      // , *tags, *remark, completed, degree, progress, created, lastReview, lastTimes, errorTimes
      records: '&date, completed, tasks',
    })
  }
}

export var db = new Diligence()
