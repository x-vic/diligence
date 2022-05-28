import React, { MouseEventHandler } from 'react'
import { createRoot, Root } from 'react-dom/client'
import Toast, { ToastTypes } from './Toast'
export { ToastTypes } from './Toast'
export default Toast

export interface ToastParams {
  type: ToastTypes
  text: string
  closeOnClick?: boolean
  duration?: number
  hide?: MouseEventHandler<HTMLDivElement>
}

const toastContainer = document.createElement('div')

export const useToast = () => {
  let root: Root
  const show = (toastProps: ToastParams) => {
    const { duration } = toastProps
    root = createRoot(toastContainer)
    root.render(<Toast {...toastProps} hide={hide} />)
    document.body.appendChild(toastContainer)
    setTimeout(hide, duration ?? 3000)
  }
  const hide = () => {
    // @ts-ignore
    if (!root?._internalRoot) return
    root.unmount()
    document.body.removeChild(toastContainer)
  }
  return {
    show,
    hide,
  }
}
