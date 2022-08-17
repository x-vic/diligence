import { useMachine } from '@xstate/react'
import { useActor } from '@xstate/react'
import classNames from 'classnames'
import React from 'react'
import { INote } from 'storage'
import { ITask, TasksContext, TasksEvents } from '../fsm/tasks.machine'
import { toggleMachine } from '../fsm/toggle.machine'

export default function TaskItem({
  note,
  isError = false,
}: {
  note: INote
  isError: boolean
}) {
  const [state, send] = useMachine(toggleMachine)
  return (
    <li
      key={note.title}
      className={classNames('mb-[12px] shadow-md p-[16px] rounded bg-gray-50', {
        'text-red-400': isError,
      })}
    >
      <header
        className="text-[18px] font-medium"
        onClick={() => send('TOGGLE')}
      >
        {note.title}
      </header>
      {state.matches('show') && (
        <article className="mb-[8px]">{note.content}</article>
      )}
    </li>
  )
}
