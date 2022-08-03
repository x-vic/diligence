import Dexie from 'dexie'
import { IGroupSequence } from './domain/GroupSequence'
import { INote } from './domain/Note'

export interface IGroups {
  id: number
  name: string
  notes: number[]
}

export class Diligence extends Dexie {
  groupSequence!: Dexie.Table<IGroupSequence, number>
  // groups!: Dexie.Table<IGroups, number>
  notes!: Dexie.Table<INote, number>
  persiet!: Dexie.Table<Object, string>

  constructor() {
    super('diligence')
    var db = this
    this.version(1).stores({
      groupSequence: '&name',
      // groups: 'id, &name',
      notes:
        '&title, &content, groupName, progress, completed, degree, errorTimes, *tags, *remark, [groupName+progress], [lastReview+lastTimes+errorTimes]',
      // , *tags, *remark, completed, degree, progress, created, lastReview, lastTimes, errorTimes
      persiet: '&date',
    })
  }
}

export var db = new Diligence()
