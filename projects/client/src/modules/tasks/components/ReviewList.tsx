import React from 'react'
import { ITask } from 'src/stateMachine/tasks.machine'

export default function ReviewList({
  list,
  nextGroup,
}: {
  list: ITask[]
  nextGroup: Function
}) {
  return (
    <>
      <ul className="mt-[12px] w-[100%] flex flex-1 flex-col">
        {list.map(({ note }) => (
          <li key={note.title}>
            {note.title}
            <br />
            {note.content}
          </li>
        ))}
      </ul>
      <button
        className="sticky bottom-0 w-[96%] h-[40px] leading-[40px] text-center bg-yellow-200 rounded-[20px] mb-[20px]"
        // @ts-ignore
        onClick={nextGroup}
      >
        下一组
      </button>
    </>
  )
}
