import { useActor } from '@xstate/react'
import React from 'react'
import { Interpreter } from 'xstate'
import { ITask, TasksContext, TasksEvents } from '../fsm/tasks.machine'

export default function Completed({
  interpreter,
}: {
  interpreter: Interpreter<TasksContext>
}) {
  const [state, send] = useActor(interpreter)
  return (
    <>
      <h1 className="size-[18px]">今日任务已完成！</h1>
      {/* <ul className="mt-[12px] w-[100%] flex flex-1 flex-col">
        {state.context.sequence.map(({ note }) => (
          <li key={note.title}>
            {note.title}
            <br />
            {note.content}
          </li>
        ))}
      </ul> */}
      <button
        className="sticky bottom-0 w-[96%] h-[40px] leading-[40px] text-center bg-yellow-200 rounded-[20px] mb-[20px]"
        onClick={() => send('ONEMORETIME')}
      >
        再来一组
      </button>
    </>
  )
}
