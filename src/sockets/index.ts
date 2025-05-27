// // src/sockets/index.ts
// import { createServer } from 'http'
// import { Server, Namespace } from 'socket.io'
// import { MainSocketHandler } from './main.socket.js'
// import { expressApp } from '../app.js'
// import { corsEnv } from '../config/index.js'

// export function initSockets(port: number) {
//   // 1) создаём HTTP-сервер на базе Express
//   const httpServer = createServer(expressApp)

//   // 2) поднимаем Socket.IO
//   const io = new Server(httpServer, {
//     // например, настройки CORS
//     cors: {
//       origin: corsEnv.clientOrigin,
//       credentials: true,
//     },
//     // можно указать cookie-parser, но в примере мы разбираем вручную
//   })

//   // 3) инициализируем namespace’ы
//   const mainNs: Namespace = io.of('/main')
//   const mainHandler = new MainSocketHandler(mainNs)
//   mainHandler.registerHandlers()

//   // (Если будут другие namespace, аналогично:)
//   // const chatNs = io.of('/chat');
//   // new ChatSocketHandler(chatNs).registerHandlers();

//   // 4) запускаем сервер
//   httpServer.listen(port, () => {
//     console.log(`🚀 Server listening on port ${port}`)
//     console.log(`🔌 Socket.IO ready at http://localhost:${port}/main`)
//   })

//   return { io, httpServer }
// }
