export async function readFileAsText(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = (e) => {
      // @ts-ignore
      res(e.currentTarget.result)
    }
    reader.onabort = reader.onerror = (e) => {
      rej(e)
    }
  })
}

export const textToFile = (constent: Record<string, Object>) =>
  new Promise((resolve, reject) => {
    const obj = constent
    const str = JSON.stringify(obj, null, '  ')
    const file = new Blob([str], { type: 'application/json' })
    const reader = new FileReader()
    reader.readAsDataURL(file)
    // reader 读取文件成功的回调
    reader.onload = (e) => {
      resolve(reader.result)
    }
    reader.onerror = (e) => {
      reject(e)
    }
  })

export async function download(link: string) {
  let DownloadLink = document.createElement('a')
  // @ts-ignore
  DownloadLink.style = 'display: none' // 创建一个隐藏的a标签
  // @ts-ignore
  DownloadLink.download = 'notes.json'
  // @ts-ignore
  DownloadLink.href = link
  document.body.appendChild(DownloadLink)
  DownloadLink.click() // 触发a标签的click事件
  document.body.removeChild(DownloadLink)
}
