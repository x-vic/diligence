import React, { useCallback, useState } from 'react'
import { Group } from '../domain/Group'
import { readFileAsText } from '../utils'

// @ts-ignore
import { init, add, update, readAll } from 'storage'

init()
setTimeout(readAll, 2000)

export default function Admin() {
  const [file, setFile] = useState(null)
  const handleChange = useCallback(async e => {
    const file: File = e.target.files[0]
    setFile(file)
    const res = await readFileAsText(file)
    const group = Group.fromJson(file.name.split('.')?.[0] ?? 'unnamed', res)
    console.log('group', group)
    setFile(null)
    // todo 存入本地数据库
  }, [])
  return <main className="flex flex-col items-center">
    {/* 笔记组列表 */}
    {/* 导入笔记 */}
    <label 
      htmlFor='uploadId'
      className="w-11/12 h-[40px] leading-[40px] text-center bg-indigo-200 rounded-[20px] my-[8px]"
    >上传文件{ file?.name ? `（${file?.name}）` : '' }</label>
    <input
      id="uploadId"
      type="file"
      accept="application/docx,application/json"
      className="hidden"
      onChange={handleChange}
    />
  </main>
}