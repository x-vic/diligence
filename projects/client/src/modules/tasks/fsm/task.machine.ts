import { INote, Progress } from 'storage'
import { sendParent, EventFrom, ContextFrom, StateFrom } from 'xstate'
import { createModel } from 'xstate/lib/model'
import { ITask } from './tasks.machine'

const taskModel = createModel(
  {
    index: 0,
  },
  {
    events: {
      KNOW: (index: number) => ({ index }),
      TIP: (index: number) => ({ index }),
      EASY: (index: number) => ({ index }),
      UNEASY: (index: number) => ({ index }),
      ERROR: (index: number) => ({ index }),
      UNKNOW: (index: number) => ({ index }),
      NEXT: (index: number) => ({ index }),
      // CHANGE: (value: string) => ({ value }),
    },
  }
)

type TodoEvents = EventFrom<typeof taskModel>[keyof EventFrom<typeof taskModel>]

export const createTaskMachine = (index: number) => {
  return taskModel.createMachine({
    id: 'todo',
    initial: 'question',
    context: {
      index,
    },
    states: {
      question: {
        // 问题
        // entry() {
        //   // sendParent({ type: 'UPDATE:CURSOR' })
        // },
        on: {
          KNOW: {
            target: 'detail',
            actions: [
              sendParent((ctx) => ({ type: 'TASK.KNOW', index: ctx.index })),
            ],
          },
        },
      },
      // 详情（复合节点）
      detail: {
        // 一旦进入详情，就将改笔记标记为进行中
        entry: [
          sendParent((ctx) => ({
            type: 'CHANGE:STATUS',
            index: ctx.index,
            status: Progress.underway,
          })),
        ],
        // 出发 next 事件
        exit: [sendParent({ type: 'UPDATE:CURSOR' })],
        on: {
          NEXT: {
            target: 'question',
            actions: [sendParent((ctx) => ({ type: 'TASK.NEXT' }))],
          },
        },
      },
      completed: {}, // 完成
    },
    // 任何状态都可以做的事情
    on: {
      TIP: {
        target: 'detail',
        internal: true, // 指定内部转换，防止触发 进入和离开 事件
        actions: [
          sendParent((ctx) => ({ type: 'TASK.TIP', index: ctx.index })),
        ],
      },
      EASY: {
        target: 'detail',
        internal: true,
        actions: sendParent((ctx) => ({ type: 'MARK.EASY', index: ctx.index })),
      },
      // UNEASY: {
      //   target: 'question',
      // },
      // ERROR: {
      //   target: 'question',
      // },
    },
  })
}

// export type TaskState = StateFrom<typeof taskModel>
export type TaskContext = ContextFrom<typeof taskModel>
export type TaskEvent = EventFrom<typeof taskModel>
