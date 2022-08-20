import dayjs, { Dayjs } from 'dayjs'
import { Progress } from './domain/GroupSequence'
import { INote } from './domain/Note'
import { getRecords } from './records'

export interface DiligenceRecord {
  date: Dayjs
  isCurrentMonth: Progress
  isCurrent: Progress
  completed: Progress
  tasks: { note: INote; oneTimesPass: boolean }[]
}

export async function getDays(
  date: Dayjs = dayjs()
): Promise<DiligenceRecord[]> {
  const now = dayjs().startOf('day')
  const start = dayjs(date).startOf('month').startOf('week')
  // endOf 得到的是最终的时间
  const end = dayjs(date).endOf('month').endOf('week')
  const dates = []
  for (let curr = start; curr.isBefore(end); curr = curr.add(1, 'day')) {
    dates.push(curr)
  }
  const records = await getRecords(dates)
  // console.log(dates)
  const res = []
  for (let i = 0; i < dates.length; i++) {
    const curr = dates[i]
    // console.log('curr', curr)
    const record = records[i]
    // 是否已过去
    const isCurrent = curr.isBefore(now)
      ? Progress.fulfill
      : curr.isSame(now)
      ? Progress.underway
      : Progress.idle
    // 是否是本月
    // console.log('444', curr.month(), now.month())
    const isCurrentMonth =
      curr.month() < dayjs(date).month()
        ? Progress.fulfill
        : curr.month() === dayjs(date).month()
        ? Progress.underway
        : Progress.idle
    // dayjs(date).month() === curr.month()
    // 是否打卡，以及当天学习记录
    const completed = record?.completed ?? Progress.idle
    const tasks = record?.tasks ?? []
    res.push({
      date: curr,
      isCurrentMonth,
      isCurrent,
      completed,
      tasks,
    })
  }
  // console.log('res', res)
  return res
}
