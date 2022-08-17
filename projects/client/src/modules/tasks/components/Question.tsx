import { useActor } from '@xstate/react'
import classNames from 'classnames'
import React, { useMemo } from 'react'
import { createTaskMachine, TaskEvent } from '../fsm/task.machine'
import { StateFrom } from 'xstate'
import { TaskProps } from './Task'

export default function Question({ sequence, index }: TaskProps) {
  const task = sequence[index]
  const {
    note: { title, lastReview },
  } = task
  const [state, send] = useActor<
    TaskEvent,
    StateFrom<ReturnType<typeof createTaskMachine>>
  >(task.ref)

  const interval = useMemo(() => {
    if (lastReview === 0) return 0
    return Math.round((Date.now() - lastReview) / (24 * 60 * 60 * 1000))
  }, [])
  return (
    <>
      <h3 className="w-11/12 flex justify-between items-center text-gray-500">
        <button
          className={classNames(
            'h-[18px] leading-[18px] px-[4px] border-[1px] rounded-[8px] text-[12px]',
            interval > 0 ? 'visible' : 'invisible'
          )}
        >
          {interval}天前学过
        </button>
        <button
          className="h-[20px] leading-[20px] bg-gray-100 rounded-[10px] text-[12px]"
          onClick={() => send('EASY')}
        >
          标记为太简单
        </button>
      </h3>
      {/* 展示题目 */}
      <main className="w-[100%] flex-1 flex flex-col items-center">
        <h1 className="text-[24px] mt-[20px]">{title}</h1>
      </main>
      <footer className="sticky bottom-0 w-full flex flex-col items-center justify-between">
        <button
          className="w-[96%] h-[40px] leading-[40px] text-center bg-red-200 rounded-[20px] mb-[16px]"
          onClick={() => send({ type: 'TIP', index })}
        >
          不认识
        </button>
        <button
          className="w-[96%] h-[40px] leading-[40px] text-center bg-yellow-200 rounded-[20px] mb-[20px]"
          onClick={() => send({ type: 'KNOW', index })}
        >
          认识
        </button>
      </footer>
    </>
  )
}
