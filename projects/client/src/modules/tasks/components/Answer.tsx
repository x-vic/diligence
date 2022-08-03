import { useActor } from '@xstate/react'
import classNames from 'classnames'
import React, { useEffect } from 'react'
import { createTaskMachine, TaskEvent } from 'src/stateMachine/task.machine'
import { StateFrom } from 'xstate'
import { TaskProps } from './Task'

export default function Answer({ sequence, index }: TaskProps) {
  const task = sequence[index]
  const {
    isError,
    note: { title, content },
  } = task

  useEffect(() => {
    console.log('task', task)
  })
  const [state, send] = useActor<
    TaskEvent,
    StateFrom<ReturnType<typeof createTaskMachine>>
  >(task.ref)
  return (
    <>
      <h3 className="w-11/12 flex flex-row-reverse justify-between items-center pt-[4px] text-gray-500">
        {isError ? (
          <button
            className="h-[20px] leading-[20px] px-[2px] bg-gray-100 rounded-[10px] text-[12px]"
            onClick={() => send('EASY')}
          >
            简单
          </button>
        ) : (
          <button
            className="h-[20px] leading-[20px] px-[2px] bg-gray-100 rounded-[10px] text-[12px]"
            onClick={() => send('TIP')}
          >
            不认识
          </button>
        )}
      </h3>
      {/* 展示题目 */}
      <main className="w-[100%] flex-1 flex flex-col">
        <h1
          className={classNames(
            'text-[24px] mt-[8px] mb-[12px]',
            isError ? 'text-red-500' : 'text-green-400'
          )}
        >
          {title}
        </h1>
        <p className="text-gray-900">{content}</p>
      </main>
      <footer className="sticky bottom-0 w-full flex flex-col items-center justify-between">
        <button
          className="w-[96%] h-[40px] leading-[40px] text-center bg-blue-300 rounded-[20px] mb-[20px]"
          onClick={() => send({ type: 'NEXT', index })}
        >
          下一个
        </button>
      </footer>
    </>
  )
}
