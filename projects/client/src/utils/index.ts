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
