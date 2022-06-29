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
  content: string | JSX.Element
  hide: MouseEventHandler<HTMLSpanElement>
  resolveRef: Ref<Function>
  closeOnClick?: boolean
  beforeConfirm?: Function
}

export default function Dialog({
  title,
  content,
  resolveRef,
  closeOnClick = false,
  hide,
  beforeConfirm = () => true,
}: DialogProps) {
  const handleConfirm = useCallback(async (e) => {
    if (!(await beforeConfirm())) return
    // @ts-ignore
    resolveRef.current()
    hide(e)
  }, [])
  const handleWrapperClick = useCallback((e) => {
    if (!closeOnClick) return
    hide(e)
  }, [])
  return (
    <div className="vic_dialog" onClick={handleWrapperClick}>
      <div className="vic_dialog-content">
        <div className="vic_dialog-header">
          <span className="vic_dialog-title">{title}</span>
          <span onClick={hide} className="vic_dialog-close">
            &times;
          </span>
        </div>
        <div className="vic_dialog-body">{content}</div>
        <footer className="vic_dialog-footer">
          <button onClick={handleConfirm} className="vic_dialog-footer-confirm">
            确定
          </button>
          <button onClick={hide} className="vic_dialog-footer-cancel">
            取消
          </button>
        </footer>
      </div>
    </div>
  )
}
