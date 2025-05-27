// server.ts
import 'dotenv/config' // Загружаем .env
import express from 'express'
import cors from 'cors'
import http from 'http'
import { corsEnv } from './config/index.js'
import authRouter from './routes/auth.route.js'
import workerRouter from './routes/worker.route.js'
import workplaceRouter from './routes/workplace.route.js'
import scheduleRouter from './routes/schedule.route.js'

const PORT = Number(process.env.PORT) || 3000
const allowedOrigins = [corsEnv.clientOrigin]

export async function bootstrap() {
  const app = express()
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          console.log('CORS blocked for origin:', origin)
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true,
    })
  )
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/api', authRouter)
  app.use('/api', workerRouter)
  app.use('/api', workplaceRouter)
  app.use('/api', scheduleRouter)

  const httpServer = http.createServer(app)

  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`)
    next()
  })

  httpServer.on('error', (err) => {
    console.error('[Server] Error:', err)
  })

  process.on('uncaughtException', (err) => {
    console.error('[Process] Uncaught Exception:', err)
  })

  process.on('unhandledRejection', (reason, promise) => {
    console.error(
      '[Process] Unhandled Rejection at:',
      promise,
      'reason:',
      reason
    )
  })

  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP & WS server listening on port ${PORT}`)
  })
}
