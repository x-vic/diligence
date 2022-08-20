import classNames from 'classnames'
import dayjs, { Dayjs } from 'dayjs'
import { useObservableState } from 'observable-hooks'
import React, { useState } from 'react'
import {
  interval,
  of,
  from,
  switchMap,
  tap,
  startWith,
  map,
  Observable,
  filter,
} from 'rxjs'
import Prev from 'src/assets/svg/arrow-left-bold.svg'
import Next from 'src/assets/svg/arrow-right-bold.svg'
import { DiligenceRecord, getDays, getOneDayRecords, Progress } from 'storage'

// type Hehe = [{ records: DiligenceRecord[], currentMonth: Dayjs }, (Dayjs) => void]

export default function Calender() {
  const [{ records, currentMonth }, onChangeMonth]: [
    { records: DiligenceRecord[]; currentMonth: Dayjs },
    (Dayjs) => void
  ] = useObservableState(
    (input$) =>
      input$.pipe(
        startWith(dayjs()),
        switchMap((date) =>
          from(getDays(date as Dayjs)).pipe(
            map((records) => ({
              records,
              currentMonth: date,
            }))
          )
        )
      ),
    { records: [], currentMonth: dayjs() }
  )
  // 获取每日记录
  const [dayRecords, getDayRecords] = useObservableState(
    (date$: Observable<{ date: Dayjs; completed: Progress }>) =>
      date$.pipe(
        // 过滤掉没有数据的日期
        filter(({ completed }) => completed !== Progress.idle),
        switchMap(({ date }) => from(getOneDayRecords(date)))
      )
  )
  console.log('dayRecords', dayRecords)
  // console.log('records', records)
  return (
    <main className="w-full h-full p-[8px]">
      <ul className="w-[100%] pb-[10px] grid grid-cols-7 place-content-start place-items-center gap-[5px] bg-gray-100 shadow-lg">
        {/* 头部 */}
        <>
          <li className="col-span-1">
            {/* @ts-ignore */}
            <Prev
              width={18}
              height={18}
              colour="#000"
              onClick={() => onChangeMonth(currentMonth.subtract(1, 'M'))}
            />
          </li>
          <li className="col-start-3 col-span-3 inline-grid h-[40px] place-items-center">
            {currentMonth?.format('YYYY-MM')}
          </li>
          <li className="col-start-7 col-span-1">
            {/* @ts-ignore */}
            <Next
              width={18}
              height={18}
              colour="#000"
              onClick={() => onChangeMonth(currentMonth.add(1, 'M'))}
            />
          </li>
        </>
        {/* 星期 */}
        <>
          {['SUN', 'MON', 'TUE', 'WEN', 'THU', 'FRI', 'SAT'].map((day) => (
            <li
              className="text-gray-500 text-[12px] inline-grid h-[30px] place-items-center"
              key={day}
            >
              {day}
            </li>
          ))}
        </>
        {/* 日历 */}
        <>
          {records?.map(({ date, completed, isCurrentMonth, isCurrent }) => (
            <li
              className="text-gray-800 text-[12px] inline-grid h-[40px] place-items-center"
              key={date.format('YYYY-MM-DD')}
              onClick={() => getDayRecords({ date, completed })}
            >
              <span
                className={classNames(
                  'w-[30px] h-[30px] inline-grid place-content-center place-items-center bg-blend-difference',
                  {
                    'rounded-[15px]': isCurrent !== Progress.idle,
                    // 未打卡：边框
                    'border-blue-600 border-[1px]':
                      completed !== Progress.fulfill,
                    // 不属于这个月：降低透明度
                    'opacity-60': isCurrentMonth !== Progress.underway,
                    // 已完成：蓝色
                    'bg-blue-600': completed === Progress.fulfill,
                    // 未来：透明
                    'bg-transparent border-none': date.isAfter(dayjs()),
                  }
                )}
              >
                {date.date()}
              </span>
            </li>
          ))}
        </>
      </ul>
    </main>
  )
}
