import React, { useCallback, useState } from 'react'
import { Group } from '../domain/Group'
import { download, readFileAsText, textToFile } from '../utils'

import { addGroups, exportAll } from '../db'

// readAll(ObjectStores.groupSequences)

export default function Admin() {
  const [file, setFile] = useState(null)
  const handleChange = useCallback(async (e) => {
    const file: File = e.target.files[0]
    if (!file) return
    setFile(file)
    const res = await readFileAsText(file)
    const group = Group.fromJson(file.name.split('.')?.[0] ?? 'unnamed', res)
    // console.log('group', group)
    setFile(null)
    // todo 存入本地数据库 1. 给组生成 id； 2. 生成笔记； 3. 建立 组 ID ==> [笔记 id] 的关联
    addGroups(group)
  }, [])
  // 导出数据为 JSON 文件
  const handleExport = useCallback(async () => {
    // 读取数据库中的所有数据，整理成 JSON 对象
    const json = await exportAll()
    const url = (await textToFile(json)) as string
    download(url)
  }, [])
  // 恢复所有数据
  const handleRecover = useCallback(async () => {}, [])
  return (
    <main className="flex flex-col items-center">
      {/* 笔记组列表 */}
      {/* 导入笔记 */}
      <label
        htmlFor="uploadId"
        className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
      >
        上传文件{file?.name ? `（${file?.name}）` : ''}
      </label>
      <input
        id="uploadId"
        type="file"
        accept="application/docx,application/json"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={handleExport}
        className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
      >
        导出数据
      </button>
      <button
        onClick={handleRecover}
        className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
      >
        恢复数据
      </button>
    </main>
  )
}
