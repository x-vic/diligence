import React from 'react'
import Question from './Question'
import Answer from './Answer'
import { ITask } from 'src/stateMachine/tasks.machine'
import { useActor } from '@xstate/react'
import { StateFrom } from 'xstate'
import { createTaskMachine, TaskEvent } from 'src/stateMachine/task.machine'

export interface TaskProps {
  sequence: ITask[]
  index: number
}

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : T

export default function Tasks({ sequence, index }: TaskProps) {
  const task = sequence[index]
  const [state, send] = useActor<
    TaskEvent,
    StateFrom<ReturnType<typeof createTaskMachine>>
  >(task.ref)

  return (
    <article className="w-[96%] h-[100%] flex flex-col items-center">
      {state.matches('question') ? (
        <Question {...{ sequence, index }} />
      ) : (
        <Answer {...{ sequence, index }} />
      )}
    </article>
  )
}
