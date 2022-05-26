import cn from 'classnames'
import React, { MouseEventHandler, useCallback, useContext } from 'react'

export enum ToastTypes {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
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
    <div className="vic_toast" onClick={handleWrapperClick}>
      <div
        className={cn([
          'vic_toast-content',
          { 'gray-400': type === ToastTypes.info },
          { 'indigo-400': type === ToastTypes.success },
          { 'yellow-400': type === ToastTypes.warning },
          { 'red-500': type === ToastTypes.error },
        ])}
      >
        {text}
        <span onClick={hide}>&times;</span>
      </div>
    </div>
  )
}
