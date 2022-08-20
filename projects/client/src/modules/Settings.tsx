import {
  useLayoutObservableState,
  useLayoutSubscription,
  useObservable,
  useObservableCallback,
  useObservableEagerState,
  useObservableState,
  useSubscription,
} from 'observable-hooks'
import React, { useRef, useState } from 'react'
import {
  concat,
  concatAll,
  concatMap,
  interval,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
  throttle,
  throttleTime,
} from 'rxjs'
import { taskConfig } from '../config'

export default function Settings() {
  const ulRef = useRef(null)
  const index = +localStorage.getItem('optionIndex') ?? 0
  const [y, setY] = useState(200 - index * 40)
  // 1. 定义原始事件流
  const [handleTouchStart, start$] = useObservableCallback((e$) => e$)
  const [handleTouchMove, move$] = useObservableCallback((e$) => e$)
  const [handleTouchEnd, end$] = useObservableCallback((e$) => e$)
  // 2. 转换流，避免闭包影响
  const y$ = useObservable(() =>
    start$.pipe(
      map(({ touches: [{ pageY }] }) => {
        // 拿到原来的值
        const attr = ulRef.current.style.transform as string
        const y = +attr.slice(11, attr.length - 3)
        return pageY - y
      }),
      switchMap((y: number) =>
        move$.pipe(
          takeUntil(end$),
          // 计算偏移量
          map(({ touches: [{ pageY }] }) => pageY - y),
          // 防止越界
          map((y) => {
            const min = -40 * (taskConfig.length - 6)
            const max = 40 * 5
            if (y > max) return max
            if (y < min) return min
            return y
          })
        )
      )
    )
  )
  // 3. 处理滑动
  useSubscription(y$, setY)
  // 4. 保证格子落在正中央、计算选中的是哪个
  useSubscription(end$, () => {
    const finalY = Math.round(y / 40) * 40
    // 计算位置
    setY(finalY)
    // 计算属于哪个 item
    const index = (-finalY + 200) / (400 / 10)
    localStorage.setItem('optionIndex', String(index))
    console.log('555', taskConfig[index])
  })
  return (
    <main className="p-[12px]">
      <h2>设置每日学习任务</h2>
      <article className="h-[280px] flex relative justify-center items-center bg-gray-200 overflow-hidden">
        <div className="h-[40px] w-[100%] rounded mx-[16px] bg-gray-300"></div>
        <ul
          ref={ulRef}
          className="absolute w-[100%] opacity-40"
          style={{ transform: `translateY(${y}px)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {taskConfig.map((item) => (
            <li
              className="flex px-[16px] justify-center items-center h-[40px] w-[100%]"
              key={item.add}
            >
              复习：{item.review}
              <span className="w-[10%]"></span>
              新学：{item.add}
            </li>
          ))}
        </ul>
      </article>
    </main>
  )
}
