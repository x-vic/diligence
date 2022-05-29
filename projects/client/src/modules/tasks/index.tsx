import React from 'react'

export default function () {
  return (
    <article className="w-full h-full flex flex-col items-center">
      {/* 题目部分 */}
      <section className="w-full h-full flex flex-col items-center">
        <header className="flex py-[8px] items-center justify-around">
          <div className="flex flex-col items-center justify-around">
            <span>今日复习</span>
            <span>12/234</span>
          </div>
          <div className="flex flex-col items-center justify-around">
            <span>今日新知识</span>
            <span>12/234</span>
          </div>
          <div className="flex flex-col items-center justify-around">
            <span>复习时长</span>
            <span>34min</span>
          </div>
        </header>
        <progress className="w-full h-[6px] rounded-full" value={12} max={24} />
        <div className="flex-1 text-[24px]">题目在这儿</div>
        <div className="w-full flex flex-col items-center justify-between">
          <button className="w-11/12 h-[40px] leading-[40px] text-center bg-yellow-200 rounded-[20px] my-[8px]">
            认识
          </button>
          <button className="w-11/12 h-[40px] leading-[40px] text-center bg-red-200 rounded-[20px] my-[8px]">
            不认识
          </button>
        </div>
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
