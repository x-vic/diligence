import cn from 'classnames'
import React, { MouseEventHandler, useCallback, useContext } from 'react'

export enum ToastTypes {
  info,
  success,
  warning,
  error,
}

export interface ToastProps {
  type: ToastTypes
  text: string
  hide: MouseEventHandler<HTMLDivElement>
  closeOnClick?: boolean
}

export default function Toast({
  type,
  text,
  closeOnClick = false,
  hide,
}: ToastProps) {
  const handleWrapperClick = useCallback((e) => {
    if (!closeOnClick) return
    hide(e)
  }, [])
  return (
    <div
      className="fixed inset-0 flex flex-col items-center"
      onClick={handleWrapperClick}
    >
      <div
        className={cn([
          'w-[100vw] h-[36px] flex items-center justify-center text-gray-100',
          { 'bg-gray-400': type === ToastTypes.info },
          { 'bg-indigo-400': type === ToastTypes.success },
          { 'bg-yellow-400': type === ToastTypes.warning },
          { 'bg-red-500': type === ToastTypes.error },
        ])}
      >
        {text}
        <span
          onClick={hide}
          className="absolute right-0 flex items-center justify-center w-[28px] h-[36px] text-[22px] text-gray-50"
        >
          &times;
        </span>
      </div>
    </div>
  )
}
