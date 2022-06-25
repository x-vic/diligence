import { useRef, useState } from 'react'

// 用于双向绑定
export const useModel = (initValue = '') => {
  const value = useRef(initValue)
  return {
    value,
    handler: (e) => {
      value.current = e.target.value
    },
  }
}
