import React, { useEffect, useMemo } from 'react'
import { useMachine } from '@xstate/react'
import { getTasks, Progress } from 'storage'
import { ITask, tasksMachine } from '../../stateMachine/tasks.machine'
import Task from './components/Task'
import ReviewList from './components/ReviewList'
import MyProgress from '../../components/progress'

const persistedTasksMachine = tasksMachine.withConfig(
  {
    actions: {
      persist: (context) => {
        // 任务信息存储到本地
        // try {
        //   localStorage.setItem('todos-xstate', JSON.stringify(context.todos));
        // } catch (e) {
        //   console.error(e);
        // }
      },
    },
  }
  // 这里本来可以自动初始化，但是好像不支持异步取数据放到 ctx 中，所以作罢
)

export default function () {
  const [state, send] = useMachine(persistedTasksMachine, { devTools: true })
  const { jobs, sequence, tasks, jobCursor, records, pastTime } = state.context
  // useEffect(() => {
  //   getTasks(10, 6).then(res => {
  //     // console.log('res', res)
  //     // send 之后会触发更新，在下一次更新中才能拿到更新后的 state
  //     send({ type: 'INIT', tasks: res })
  //   })
  // }, [])
  useEffect(() => {
    // console.log('records', records)
    // console.log('state', state.value)
    // console.clear()
    // console.log('ctx', state.context)
    // console.log('jobCursor', jobCursor)
    // console.log('jobs', jobs)
    // console.log('sequence', sequence)
    // console.log('records.map(i => sequence[i])', records)
    // console.log('state', state)
    // console.log('jobs, sequence, tasks, jobCursor', jobs, sequence, tasks, jobCursor)
  })

  const isReady = ['ready', 'lookback'].some(state.matches)

  // 计算复习的数据
  const [reviewDone, reviewTotal] = useMemo(() => {
    const total = tasks.review.length
    if (total === 0) return [0, 0]
    let done = 0
    for (let i = 0; i < total; i++) {
      if (sequence[i].progress === Progress.fulfill) done++
    }
    return [done, total]
  }, [jobCursor])
  const [addDone, addTotal] = useMemo(() => {
    const total = tasks.add.length
    if (total === 0) return [0, 0]
    let done = 0
    for (let i = tasks.review.length; i < total; i++) {
      if (sequence[i].progress === Progress.fulfill) done++
    }
    return [done, total]
  }, [sequence])
  const [done, total] = useMemo(
    () => [reviewDone + addDone, reviewTotal + addTotal],
    [sequence]
  )

  return (
    <article className="w-full h-full flex flex-col items-center">
      {/* 题目部分 */}
      <section className="w-full h-full flex flex-col items-center">
        <header className="w-[100%] flex py-[8px] items-center justify-around">
          <div className="flex flex-col items-center justify-around">
            <span>今日复习</span>
            <span>
              {reviewDone} / {reviewTotal}
            </span>
          </div>
          <div className="flex flex-col items-center justify-around">
            <span>今日新知识</span>
            <span>
              {addDone} / {addTotal}
            </span>
          </div>
          <div className="flex flex-col items-center justify-around">
            <span>精进时长</span>
            <span>{(pastTime / 1000 / 60) | 0}min</span>
          </div>
        </header>
        <MyProgress value={done} max={total} />
        {state.matches('ready') && (
          <Task sequence={sequence} index={jobs[jobCursor]} />
        )}
        {state.matches('lookback') && (
          <ReviewList
            list={records.map((i) => sequence[i])}
            nextGroup={() => send({ type: 'CONTINUE' })}
          />
        )}
        {state.matches('completed') && (
          <h1 onClick={() => send('ONEMORETIME')}>完成啦！</h1>
        )}
        {/* <div className="flex-1 text-[24px]">
          {
            isReady && tasks.all.map(task => <p key={task.title}>{ task.title }</p >)
          }
        </div> */}
        {/* <div className="w-full flex flex-col items-center justify-between">
          <button className="w-11/12 h-[40px] leading-[40px] text-center bg-yellow-200 rounded-[20px] my-[8px]">
            认识
          </button>
          <button className="w-11/12 h-[40px] leading-[40px] text-center bg-red-200 rounded-[20px] my-[8px]">
            不认识
          </button>
        </div> */}
      </section>
      {/* 详细页面部分 */}
      {/* <section className="w-full flex flex-col items-center">
        <button className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]">
          下一个
        </button>
      </section> */}
    </article>
  )
}
