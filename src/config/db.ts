import { Pool } from 'pg'
import { dbEnv } from './index.js'

export const pool = new Pool({
  user: dbEnv.user,
  host: dbEnv.host,
  database: dbEnv.name,
  password: dbEnv.password,
  port: dbEnv.port,
})
