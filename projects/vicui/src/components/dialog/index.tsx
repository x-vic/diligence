import React, { MouseEventHandler, useRef } from 'react'
import { createRoot, Root } from 'react-dom/client'
import Dialog from './dialog'
export type { DialogProps, DialogTypes } from './dialog'

export default Dialog

export interface DialogParams {
  title: string
  text: string
  closeOnClick?: boolean
  hide?: MouseEventHandler<HTMLDivElement>
}

const DialogContainer = document.createElement('div')

export const useDialog = () => {
  let root: Root
  const resolveRef = useRef(null)
  const rejectRef = useRef(null)
  const show = (DialogProps: DialogParams) =>
    new Promise((resolve, reject) => {
      root = createRoot(DialogContainer)
      root.render(
        <Dialog {...DialogProps} hide={hide} resolveRef={resolveRef} />
      )
      document.body.appendChild(DialogContainer)
      resolveRef.current = resolve
      rejectRef.current = reject
    })
  const hide = () => {
    // @ts-ignore
    if (!root?._internalRoot) return
    root.unmount()
    document.body.removeChild(DialogContainer)
    rejectRef.current()
  }
  return {
    show,
    hide,
  }
}
