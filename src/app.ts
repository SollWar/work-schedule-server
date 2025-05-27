// server.ts
import 'dotenv/config' // Загружаем .env
import express from 'express'
import cors from 'cors'
import http from 'http'
import https from 'https'
import { Server, Namespace } from 'socket.io'
import fs from 'fs'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import { corsEnv } from './config/index.js'
import { MainSocketHandler } from './sockets/main.socket.js'
import { ChatSocketHandler } from './sockets/chat.socket.js'
import { VoiceSocketHandler } from './sockets/voice.socket.js'
import path from 'path'
// import { ChatSocketHandler } from './sockets/chat.socket.js';
// import { NotificationService } from './services/notification.service.js';
// import { LogUserEvents } from './handlers/logUserEvents.handler.js';

const keyPath = path.join('./localhost+2-key.pem')
const certPath = path.join('./localhost+2.pem')
const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
}

const PORT = Number(process.env.PORT) || 3000
const allowedOrigins = [corsEnv.clientOrigin]

export async function bootstrap() {
  // 1) Настраиваем Express
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
  // app.use(sessionMiddleware); // если нужен

  // HTTP-роуты
  app.use('/api', authRouter)
  app.use('/api', userRouter)

  // централизованный обработчик ошибок
  // app.use((err, req, res, next) => {
  //   const status = err.status || 500;
  //   res.status(status).json({ error: err.message });
  // });

  // 2) HTTP-сервер для Express + Socket.IO
  // const httpServer = https.createServer(httpsOptions, app)
  const httpServer = http.createServer(app)

  // 3) Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins as string[],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  })

  // 4) Инициализируем namespace’ы
  const mainNs: Namespace = io.of('/api/main')
  const chatNs: Namespace = io.of('/api/chat')
  const voiceNs: Namespace = io.of('/api/voice')
  new ChatSocketHandler(chatNs).registerHandlers()
  new MainSocketHandler(mainNs).registerHandlers()
  new VoiceSocketHandler(voiceNs).registerHandlers()

  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.url}`)
    next()
  })

  // Логирование событий Socket.IO
  io.on('connection', (socket) => {
    socket.on('disconnect', (reason) => {
      console.log(`[Socket] Disconnected: ${reason}`)
    })

    socket.on('error', (err) => {
      console.error('[Socket] Error:', err)
    })
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

  // Если есть другие неймспейсы:
  // const chatNs: Namespace = io.of('/chat');
  // new ChatSocketHandler(chatNs).registerHandlers();

  // 5) (опционально) NotificationService
  // const handlers = [ new LogUserEvents() /*, ... */ ];
  // const notificationService = new NotificationService(pool, handlers);
  // await notificationService.startListening();

  // 6) Стартуем
  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP & WS server listening on port ${PORT}`)
  })
}
