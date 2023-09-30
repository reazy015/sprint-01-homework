import dotenv from 'dotenv'
import {MongoClient} from 'mongodb'

dotenv.config()

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/<db-name>'

const client = new MongoClient(db_url)
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
