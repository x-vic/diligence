import dayjs from 'dayjs'
import { db } from './Diligence'
import { Bool } from './domain/Note'

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
  // 判断整体是否已完成
  const completed =
    _completed ?? jobCursor >= jobs.length ? Bool.true : Bool.false
  db.records.bulkPut([{ date: today, completed, tasks }])
}

// 获取一天的记录（默认取今天）
export const getOneDayRecords = async (
  date = dayjs().startOf('day').format('YYYY-MM-DD')
) => {
  const record = await db.records.get(date)
  console.log('getOneDayRecords', record)
  if (record) return record
  throw `没有今日记录`
}

// 获取所有记录
export const getRecords = async () => {
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
