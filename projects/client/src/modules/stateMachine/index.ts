import { assign, createMachine } from 'xstate'
import { Note } from 'storage/src/domain/Note'

interface Context {
  tasks: number[]
  currentIndex: number
}

type Event =
  | { type: 'start' }
  | { type: 'choose' }
  | { type: 'next' }
  | { type: 'oneMore' } // 再来一次
  | { type: 'back' } // 回到上一条

createMachine<Context, Event>({
  id: 'task',
  initial: 'waiting',
  context: {
    tasks: [1, 2, 3],
    currentIndex: 0,
  },
  states: {
    waiting: {
      on: {
        start: {
          target: 'underway',
        },
      },
    },
    underway: {
      type: 'compound',
      initial: 'question',
      states: {
        question: {
          on: {
            choose: {
              target: 'answer',
            },
          },
        },
        answer: {
          on: {
            // 一个事件，两个目标，通过守卫来控制具体转移到哪个状态
            next: [
              {
                target: 'question',
                cond: (ctx) => ctx.tasks.length > ctx.currentIndex + 1,
              },
              // 由子状态转换到父状态
              { target: '#task.completed' },
            ],
          },
          // 一旦离开，当前索引 +1
          exit: [
            assign((ctx, e) => {
              return {
                currentIndex: ctx.currentIndex + 1,
              }
            }),
          ],
        },
        // 小结状态
        summary: {},
      },
    },
    completed: {
      on: {
        oneMore: {
          target: 'underway',
          actions: [
            assign((ctx) => {
              return {
                tasks: [...ctx.tasks, 4, 5],
              }
            }),
          ],
        },
      },
    },
  },
})
