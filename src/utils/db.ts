import { openDB } from 'idb'

const DB_NAME = 'gps-tracking-db'
const STORE_NAME = 'gps-data'

export const getDB = () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        })
      }
    },
  })
}

export const saveGPSData = async (data: any) => {
  const db = await getDB()
  await db.add(STORE_NAME, data)
}

export const getAllGPSData = async () => {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

export const clearGPSData = async () => {
  const db = await getDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  await tx.store.clear()
  await tx.done
}
