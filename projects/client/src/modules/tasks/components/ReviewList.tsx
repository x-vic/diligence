import classNames from 'classnames'
import React, { useMemo } from 'react'
import { groupBy } from '../../../utils'
import { ITask } from '../fsm/tasks.machine'
import TaskItem from './TaskItem'

export default function ReviewList({
  list,
  nextGroup,
}: {
  list: ITask[]
  nextGroup: Function
}) {
  const { failTasks, passTasks } = useMemo(
    () => groupBy(list, (task) => (task.isError ? 'failTasks' : 'passTasks')),
    [list]
  )
  // console.log('failTasks, passTasks', failTasks, passTasks)
  return (
    <main className="w-11/12 h-[100%] flex flex-col">
      <ul className="mt-[16px] w-[100%] flex flex-1 flex-col">
        {list.map(({ isError, note }) => (
          <TaskItem note={note} isError={isError} key={note.title} />
        ))}
      </ul>
      <button
        className="sticky bottom-0 w-[100%] h-[40px] leading-[40px] text-center bg-yellow-200 rounded-[20px] mb-[20px]"
        // @ts-ignore
        onClick={nextGroup}
      >
        下一组
      </button>
    </main>
  )
}
