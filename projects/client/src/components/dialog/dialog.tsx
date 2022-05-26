import cn from 'classnames'
import React, { MouseEventHandler, Ref, useCallback, useContext } from 'react'

export enum DialogTypes {
  info,
  success,
  warning,
  error,
}

export interface DialogProps {
  title: string
  text: string
  hide: MouseEventHandler<HTMLSpanElement>
  resolveRef: Ref<Function>
  closeOnClick?: boolean
}

export default function Dialog({
  title,
  text,
  resolveRef,
  closeOnClick = false,
  hide,
}: DialogProps) {
  const handleConfirm = useCallback((e) => {
    // @ts-ignore
    resolveRef.current()
    hide(e)
  }, [])
  const handleWrapperClick = useCallback((e) => {
    if (!closeOnClick) return
    hide(e)
  }, [])
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500 bg-opacity-40"
      onClick={handleWrapperClick}
    >
      <div className="w-11/12 bg-white rounded-[10px] flex flex-col items-center">
        <div
          className={cn([
            'relative w-[100%] h-[36px] flex items-center justify-center text-gray-600 text-[20px]',
          ])}
        >
          <span className="font-medium">{title}</span>
          <span
            onClick={hide}
            className="absolute right-0 flex items-center justify-center w-[28px] h-[36px] text-[22px] text-gray-500"
          >
            &times;
          </span>
        </div>
        <div className="w-[90%] mb-[12px]">{text}</div>
        <footer className="flex items-center w-full h-[40px] divide-x divide-gray-400 ">
          <button
            onClick={handleConfirm}
            className="flex-1 text-indigo-600 h-full"
          >
            确定
          </button>
          <button onClick={hide} className="flex-1">
            取消
          </button>
        </footer>
      </div>
    </div>
  )
}
