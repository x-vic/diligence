import React from 'react'

interface Prop {
  max: number
  value: number
  buffer?: number
}

export default function Process({ max, value, buffer = 0 }: Prop) {
  return (
    <main className="relative w-[100%] h-[8px]">
      <div className="absolute w-[100%] h-[8px] rounded-[4px] bg-gray-200"></div>
      <div
        className="absolute h-[8px] rounded-[4px] bg-gray-300"
        style={{ width: `${(buffer / max) * 100}%` }}
      ></div>
      <div
        className="absolute h-[8px] rounded-[4px] bg-blue-400"
        style={{ width: `${(value / max) * 100}%` }}
      ></div>
    </main>
  )
}
