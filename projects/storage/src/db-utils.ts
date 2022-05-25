import { dataBase, ObjectStores } from './config'

let db, objectStore

export const init = () =>
  new Promise((resolve, reject) => {
    if (db) resolve(db)
    const request = window.indexedDB.open(dataBase)
    request.onupgradeneeded = (event) => {
      // @ts-ignore
      db = event.target.result
      resolve(db)
    }
    request.onsuccess = (e) => {
      // @ts-ignore
      db = e.target.result
      resolve(db)
    }
    request.onerror = (e) => {
      reject(db)
    }
  })

// 创建 objectStore
export const createObjectStore = async (
  name: ObjectStores,
  keyPath: string = 'id',
  indexes: [string, boolean][] = []
) => {
  await init()
  if (!db.objectStoreNames.contains(name)) {
    objectStore = db.createObjectStore(name, {
      keyPath: keyPath,
    })
    indexes.forEach(([key, unique]) => {
      objectStore.createIndex(key, key, { unique })
    })
    return objectStore
  } else {
    // throw `${name} 已经存在！`
  }
}

// 获取 objectStore
export const getDb = () => db

// 添加
export const add = (name: ObjectStores, data: any) =>
  new Promise((resolve, reject) => {
    let request = db.transaction([name], 'readwrite').objectStore(name)
    request = request.add(data)
    request.onerror = (event) => {
      reject(event)
    }
    request.onsuccess = (event) => {
      console.log('event', event)
      resolve('数据写入成功')
    }
  })

// 获取最后的 index
export const getLastIndex = (name: ObjectStores) =>
  new Promise((resolve, reject) => {
    const store = db.transaction(name).objectStore(name)
    const result = store.openCursor()
    result.onsuccess = (event) => {
      let lastId = -1
      const cursor = event.target.result
      if (cursor) {
        lastId = cursor.value.id
        cursor.continue()
      } else {
        resolve(lastId)
      }
    }
    result.onerror = (event) => {
      reject(event)
    }
  })

// 读所有数据，最后返回列表
export const readAll = (name: ObjectStores) =>
  new Promise((resolve, reject) => {
    const store = db.transaction(name).objectStore(name)
    const result = store.openCursor()
    result.onsuccess = (event) => {
      const res = []
      const cursor = event.target.result
      if (cursor) {
        res.push(cursor.value)
        cursor.continue()
      } else {
        resolve(res)
      }
    }
    result.onerror = (event) => {
      reject(event)
    }
  })

// 更新，支持批量
export const update = (name: ObjectStores, data: any) =>
  new Promise((resolve, reject) => {
    const request = db.transaction([name], 'readwrite').objectStore(name)
    const datas = Array.isArray(data) ? data : [data]
    datas.forEach((data) => request.put(data))
    request.onsuccess = (event) => {
      resolve('数据修改成功')
    }
    request.onerror = (event) => {
      reject(event)
    }
  })

// 通过索引删除数据，支持批量
export const removeByIndex = (objectStore: ObjectStores, id: any) =>
  new Promise((resolve, reject) => {
    const request = db
      .transaction([objectStore], 'readwrite')
      .objectStore(objectStore)
    const ids = Array.isArray(id) ? id : [id]
    ids.forEach((id) => request.delete(id))
    request.onsuccess = (event) => {
      resolve('数据删除成功')
    }
    request.onerror = (event) => {
      reject(event)
    }
  })

// 通过主键查找
export const findById = (objectStoreName: ObjectStores, id: number) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStoreName])
    const objectStore = transaction.objectStore(objectStoreName)
    const request = objectStore.get(id)

    request.onerror = (event) => {
      reject(event)
    }

    request.onsuccess = (event) => {
      if (request.result) {
        resolve(request.result)
      } else {
        reject('未获得数据记录')
      }
    }
  })

// 通过索引查询
export const findByIndex = (
  objectStore: ObjectStores,
  indexName: string,
  index: string | number
) =>
  new Promise((resolve, reject) => {
    const transaction = db.transaction([objectStore], 'readonly')
    const store = transaction.objectStore(objectStore)
    const index = store.index(indexName)
    const request = index.get(index)
    request.onsuccess = function (e) {
      const result = e.target.result
      if (result) {
        resolve(result)
      } else {
        reject('没有找到该数据')
      }
    }
    request.onerror = (event) => {
      reject(event)
    }
  })
