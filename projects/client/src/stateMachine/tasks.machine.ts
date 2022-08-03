import { createMachine, spawn, ActorRef, EventFrom, ContextFrom } from 'xstate'
import {
  getPersiet,
  INote,
  ITasks,
  Note,
  persiet,
  Progress,
  updataNote,
} from 'storage'
import { createTaskMachine } from './task.machine'
import { assign } from '@xstate/immer'
import { getTasks } from 'storage'

export type ITask = {
  note: INote
  progress: Progress // 今日是否已完成
  leftTimes: number // 剩余次数
  isError: boolean // 展示详情的时候判断有没有错
  ref: ActorRef<any>
}

type PromiseEvent<T> = {
  type: 'promise'
  data: T
}

interface Events {
  INIT: { tasks: ITasks } // 初始化 tasks
  ONEMORETIME: {} // 再来一组
  'TASK.KNOW': { index: number } // 标记为认识
  'TASK.TIP': { index: number } // 提示
  'CHANGE:STATUS': { index: number; status: Progress }
  'UPDATE:CURSOR': { index: number } // 更新游标
  'MARK.UNKNOW': { index: number } // 标记为不认识
  'MARK.EASY': { index: number } // 标记为简单
  'MARK.UNEASY': { index: number } // 标记为不简单（简单的反向操作）
  'TASK.NEXT': { index: number } // 下一个
  CONTINUE: {}
  PREV: {} // 上一个
  TIMMING: {} // 计时
}

type GenEvents<E extends Record<keyof Events, Record<string, any>>> = {
  [K in keyof E]: {
    type: K
  } & E[K]
}

type TasksEvents = GenEvents<Events>
type TaskEvent<K extends keyof Events> = TasksEvents[K]
type Send<K extends keyof Events> = (eventName: K, payload: Events[K]) => void

// type Event<Type extends string> = Events<{}>[Type]

const initialContext = {
  currentTask: 0,
  tasks: {
    add: [],
    review: [],
  } as ITasks, // 原始返回的任务
  sequence: [] as ITask[],
  jobs: [] as number[], // 今日任务
  jobCursor: 0, // 每次进入问题时更新游标
  records: [] as number[], // 之前记过的
  pastTime: 0, // 学习时长
}

type TasksContext = typeof initialContext

export const tasksMachine = createMachine(
  {
    id: 'todos',
    context: initialContext,
    initial: 'idle',
    states: {
      idle: {
        // 未完成
        always: [
          {
            target: 'start',
            cond: (ctx) => !ctx.sequence.length,
          },
        ],
      },
      start: {
        invoke: {
          src: (ctx) => getPersiet(),
          onDone: [
            {
              target: 'completed',
              actions: 'recoverTasks',
              cond: 'isOver',
            },
            {
              target: 'ready',
              actions: 'recoverTasks',
            },
          ],
          onError: {
            target: 'loading',
            actions: () => {
              console.log('恢复失败')
            },
          },
        },
      },
      loading: {
        invoke: {
          src: () => getTasks(1, 1),
          onDone: {
            target: 'ready',
            // 将页面发射过来的数据放到 tasks 中
            actions: [
              assign<TasksContext>((ctx, { data }: PromiseEvent<ITasks>) => {
                // 当再添加一组的时候，所有序号都以之前的长度往后递推
                const prevlen = ctx.sequence.length
                ctx.tasks.add.push(...data.add)
                ctx.tasks.review.push(...data.review)
                ctx.sequence.push(
                  ...data.all.map((note, i) => ({
                    note,
                    progress: Progress.idle,
                    isError: false,
                    leftTimes: 1, // 一开始，需要记忆的次数为 1 次
                    ref: spawn(createTaskMachine(i + prevlen)),
                  }))
                )
                ctx.jobs.push(...data.all.map((_, i) => i + prevlen))
              }),
              'persiet',
            ],
          },
          // todo
          onError: {},
        },
      },
      ready: {
        invoke: {
          id: 'timer',
          src: (ctx, e) => (callback, onReceive) => {
            const id = setInterval(() => callback('TIMMING'), 36000)
            // 执行清理
            return () => clearInterval(id)
          },
        },
      },
      // 完成 7 个就进行一次回顾
      lookback: {
        // 离开的时候清空 look Back
        exit: assign<TasksContext>((ctx) => {
          ctx.records.length = 0
        }),
        on: {
          CONTINUE: [
            {
              target: 'completed',
              actions: ['persiet'],
              cond: 'isOver',
            },
            {
              target: 'ready',
            },
          ],
        },
      },
      // 整体完成
      completed: {
        on: {
          ONEMORETIME: {
            target: 'loading',
          },
        },
      },
    },
    on: {
      'UPDATE:CURSOR': {
        actions: [
          assign<TasksContext>((ctx) => {
            const index = ctx.jobs[ctx.jobCursor]
            if (!ctx.records.includes(index)) {
              ctx.records.push(index)
            }
            ctx.jobCursor++
          }),
          'persiet',
          (ctx) => {
            console.log('ctx', ctx)
          },
        ],
      },
      'TASK.KNOW': {
        actions: [
          // 1. 正确次数+1； 2. 进行中状态
          assign<TasksContext, TaskEvent<'TASK.KNOW'>>((ctx, { index }) => {
            const task = ctx.sequence[index]
            task.leftTimes--
            task.isError = false
            // 列表后面没有要回顾的相同笔记，意味着第一次就正确
            if (!ctx.jobs.slice(ctx.jobCursor + 1).includes(index)) {
              task.progress = Progress.fulfill
            }
            // 处理 note
            task.note.lastReview = Date.now()
            task.note.lastTimes++
          }),
          'updataNote',
        ],
      },
      'TASK.TIP': {
        actions: [
          // 提示了，说明还不会 1. 标记错误状态；2. 添加 3 个回顾
          assign<TasksContext, TaskEvent<'TASK.TIP'>>((ctx, { index }) => {
            const jobs = ctx.jobs
            let cursor = ctx.jobCursor
            let needTimes = 4 - ctx.sequence[index].leftTimes
            while (needTimes--) {
              // 将要插入的位置
              cursor += 4
              const position = Math.min(jobs.length, cursor)
              jobs.splice(position, 0, index)
            }
            const task = ctx.sequence[index]
            task.leftTimes = 3
            task.isError = true
            // 处理 note
            task.note.lastReview = Date.now()
            task.note.lastTimes++
            task.note.errorTimes++
          }),
          'updataNote',
        ],
      },
      // 更改任务状态
      'CHANGE:STATUS': {
        actions: assign<TasksContext, TaskEvent<'CHANGE:STATUS'>>(
          (ctx, { index, status }) => {
            if (ctx.sequence[index].progress === Progress.idle) {
              ctx.sequence[index].progress = status
            }
          }
        ),
      },
      // 下一个
      'TASK.NEXT': [
        // 下面通过守卫，转移到不同的状态中去
        // 7 个一组的回顾
        {
          target: 'lookback',
          cond: 'shouldLookback',
        },
        // 完成
        {
          target: 'completed',
          cond: 'isOver',
        },
      ],
      // 标记为简单
      // 1. 笔记标记为已完成； 2. task 标记为已完成、没有错误
      'MARK.EASY': {
        actions: [
          // todo 更改数据库状态
          // task 标记
          assign<TasksContext, TaskEvent<'MARK.EASY'>>((ctx, { index }) => {
            const task = ctx.sequence[index]
            task.progress = Progress.fulfill
            task.isError = false
            task.note.progress = 1
          }),
          'updataNote',
          'persiet',
        ],
      },
      // 计时
      TIMMING: {
        actions: assign<TasksContext>((ctx) => {
          ctx.pastTime += 36000
        }),
      },
    },
  },
  {
    actions: {
      // 更新 note 到数据库
      updataNote(ctx, e) {
        const { note } = ctx.sequence[ctx.jobs[ctx.jobCursor]]
        updataNote(note)
      },
      // persiet 将 ctx 同步到数据库中
      persiet(ctx) {
        persiet({
          ...ctx,
          sequence: ctx.sequence.map(({ ref, ...rest }) => rest),
        })
      },
      // 从本地恢复数据
      recoverTasks: assign<TasksContext>(
        (ctx, { data }: PromiseEvent<{ date: string; ctx: TasksContext }>) => {
          // actor 不能存储到 indexDb 中，所以要重新创建
          data.ctx.sequence.forEach((task, i) => {
            task.ref = spawn(createTaskMachine(i))
          })
          Object.assign(ctx, data.ctx)
        }
      ),
    },
    guards: {
      // 有待回顾的内容 && (已完成 || 长度达到设定)
      shouldLookback: (ctx) =>
        ctx.records.length &&
        (ctx.jobCursor >= ctx.jobs.length || ctx.records.length >= 2),
      isOver: (ctx, { data }) => {
        // 当从本地恢复数据的时候，也需要判断是否已完成
        if (data?.ctx) return data.ctx.jobCursor >= data.ctx.jobs.length
        return ctx.jobCursor >= ctx.jobs.length
      },
    },
  }
)
