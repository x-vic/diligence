import dayjs, { Dayjs } from 'dayjs'
import { DiligenceRecord } from './calender'
import { db, Diligence } from './Diligence'
import { Progress } from './domain/GroupSequence'
import { Bool, INote } from './domain/Note'

// 存储今日记录
export const setRecord = async (
  { sequence, jobCursor, jobs },
  _completed?: boolean
) => {
  const today = dayjs().startOf('day').format('YYYY-MM-DD')
  const tasks = sequence.map(({ note, oneTimesPass }) => ({
    note,
    oneTimesPass,
  }))
  // todo 已经完成的不能逆转
  const record = (await db.records.get(today)) as DiligenceRecord
  let completed = record?.completed ?? Progress.underway
  // console.log('record', record)
  // debugger
  if (!record || record?.completed !== Progress.fulfill) {
    //   debugger
    // 判断整体是否已完成
    completed =
      _completed ?? jobCursor >= jobs.length ? Progress.fulfill : Progress.idle
  }
  db.records.bulkPut([{ date: today, completed, tasks }])
}

// 获取一天的记录（默认取今天）
export const getOneDayRecords = async (date: Dayjs = dayjs()) => {
  const record = await db.records.get(date.startOf('day').format('YYYY-MM-DD'))
  console.log('getOneDayRecords', record)
  if (record) return record
  throw `没有今日记录`
}

// 获取多个日期的记录
export const getRecords = async (dates: Array<string | Dayjs> = []) => {
  const records = await db.records.bulkGet(
    dates.map((date) => dayjs(date).format('YYYY-MM-DD'))
  )
  return records as Array<
    | undefined
    | {
        completed: Progress
        date: string
        tasks: Array<{ note: INote; oneTimesPass: boolean }>
      }
  >
}

// 获取所有学习过的笔记
export const getAllNotes = async () => {
  // 拿到今天的毫秒数
  const today = dayjs().startOf('day').valueOf()
  const records = await db.notes
    // .where('lastReview')
    // .belowOrEqual(today)
    .filter((note) => note.lastReview !== 0)
    .reverse()
    .sortBy('lastReview')
  console.log('getRecords', records)
  if (records) return records
  throw `没有记录`
}
