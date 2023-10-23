import dotenv from 'dotenv'

dotenv.config()

export const SETTINGS = {
  PORT: process.env.PORT || 5000,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/<db-name>',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  SECRET_KEY: process.env.SECRET_KEY || 'localhost_secret_key',
}
