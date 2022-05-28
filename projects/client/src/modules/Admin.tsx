import React, { useCallback, useState } from 'react'
import { Group } from '../domain/Group'
import { download, readFileAsText, textToFile } from '../utils'

import { ToastTypes, useDialog, useToast } from 'vicui'
import 'vicui/dist/index.css'
import { addGroup, exportAll, recover } from 'storage'

export default function Admin() {
  const [groupFile, setGroupFile] = useState(null)
  const [recoverFile, setRecoverFile] = useState(null)
  const { show: showToast } = useToast()
  const { show: showDialog } = useDialog()

  const handleAddGroup = async (e) => {
    const file: File = e.target.files[0]
    if (!file) return
    setGroupFile(file)
    const res = await readFileAsText(file)
    const group = Group.fromJson(file.name.split('.')?.[0] ?? 'unnamed', res)
    // 手动清空 value 值，否则第二次不会出发 change 事件
    e.target.value = null
    setGroupFile(null)
    // todo 存入本地数据库 1. 给组生成 id； 2. 生成笔记； 3. 建立 组 ID ==> [笔记 id] 的关联
    addGroup(group.name, group.notes)
  }

  // 导出数据为 JSON 文件
  const handleExport = useCallback(async () => {
    // 读取数据库中的所有数据，整理成 JSON 对象
    const json = await exportAll()
    const url = (await textToFile(json)) as string
    download(url)
  }, [])

  const handleRecover = async (e) => {
    await showDialog({
      title: '恢复数据',
      text: '恢复数据之前会先清空现有数据，您确定吗？',
    })
    const file: File = e.target.files[0]
    if (!file) return
    setRecoverFile(file)
    const jsonStr = await readFileAsText(file)
    // 手动清空 value 值，否则第二次不会出发 change 事件
    e.target.value = null
    setRecoverFile(null)
    const res = await recover(JSON.parse(jsonStr)).catch(() => false)
    if (res) {
      showToast({
        type: ToastTypes.success,
        text: '恢复数据成功',
        duration: 2000,
      })
    }
  }

  return (
    <main className="flex flex-col items-center">
      {/* 笔记组列表 */}
      {/* 导入笔记 */}
      <label
        htmlFor="uploadId"
        className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
      >
        上传文件{groupFile?.name ? `（${groupFile?.name}）` : ''}
      </label>
      <input
        id="uploadId"
        type="file"
        accept="application/docx,application/json"
        className="hidden"
        onChange={handleAddGroup}
      />
      <button
        onClick={handleExport}
        className="w-11/12 h-[40px] leading-[40px] text-center bg-red-200 rounded-[20px] my-[8px]"
      >
        导出数据
      </button>
      {/* <button
        onClick={handleRecover}
        className="w-11/12 h-[40px] leading-[40px] text-center bg-yellow-200 rounded-[20px] my-[8px]"
      >
        恢复数据
      </button> */}
      {/* <Dialog text="heheh" hide={() => {}} /> */}
      <label
        htmlFor="recoverId"
        className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
      >
        恢复数据
      </label>
      <input
        id="recoverId"
        type="file"
        accept="application/docx,application/json"
        className="hidden"
        onChange={handleRecover}
      />
    </main>
  )
}
