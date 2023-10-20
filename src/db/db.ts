import {MongoClient} from 'mongodb'
import {SETTINGS} from '../shared/configs'

const DB_URL = SETTINGS.DB_URL

const client = new MongoClient(DB_URL)
export const db = client.db()

export const rundb = async () => {
  try {
    await client.connect()
    console.log('DB connected')
  } catch (e) {
    console.log('DB connection error')
    await client.close()
  }
}
