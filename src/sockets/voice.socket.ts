import {
  Consumer,
  Producer,
  Router,
  WebRtcTransport,
  WebRtcTransportOptions,
} from 'mediasoup/types'
import mediasoup from 'mediasoup'
import { DefaultEventsMap, Namespace } from 'socket.io'
import { checkAuth } from './utils/checkAuth.js'
import { SocketData } from '../models/main.socket.model.js'
import { voiceRoomStore } from '../temp/voiceRoomStore.js'
import {
  VoiceClientToServerEvents,
  VoiceInterServerEvents,
  VoiceServerToClientEvents,
} from '../models/voice.socket.model.js'

type ClientSession = {
  producerTransport?: WebRtcTransport
  producer?: Producer
  consumers: Array<{
    transport: WebRtcTransport
    consumer: Consumer
  }>
}

export class VoiceSocketHandler {
  constructor(
    private io: Namespace<
      VoiceClientToServerEvents,
      VoiceServerToClientEvents,
      VoiceInterServerEvents,
      SocketData
    >
  ) {}

  WEBRTC_TRANSPORT_OPTIONS: WebRtcTransportOptions = {
    listenIps: [{ ip: '0.0.0.0', announcedIp: '127.0.0.1' }],
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
  }

  clients = new Map<string, ClientSession>()
  producerIdToUserId = new Map<string, string>()

  routers = new Map<string, Router>()

  getClient(socketId: string): ClientSession {
    const client = this.clients.get(socketId)
    if (!client) throw new Error(`Client ${socketId} not found`)
    return client
  }

  listProducerIds(excludeSocketId?: string): string[] {
    return Array.from(this.clients.entries())
      .filter(([id, sess]) => sess.producer && id !== excludeSocketId)
      .map(([_, sess]) => sess.producer!.id)
  }

  async createWebRtcTransport(router: Router): Promise<WebRtcTransport> {
    return router.createWebRtcTransport(this.WEBRTC_TRANSPORT_OPTIONS)
  }

  // Создание worker
  async createWorker() {
    const newWorker = await mediasoup.createWorker({
      rtcMinPort: 20000,
      rtcMaxPort: 20100,
    })
    newWorker.on('died', () => {
      console.error('Worker died, exiting...')
      setTimeout(() => process.exit(1), 2000)
    })
    return newWorker
  }

  async registerHandlers() {
    checkAuth(this.io)
    const worker = await this.createWorker()
    // const router = await worker.createRouter({
    //   mediaCodecs: [
    //     {
    //       kind: 'audio',
    //       mimeType: 'audio/opus',
    //       clockRate: 48000,
    //       channels: 2,
    //     },
    //     {
    //       kind: 'audio',
    //       mimeType: 'audio/PCMU', // Резервный кодек
    //       clockRate: 8000,
    //       channels: 1,
    //     },
    //   ],
    // })

    this.io.on('connection', async (socket) => {
      const { roomId } = socket.handshake.auth

      const connectInit = () => {}

      if (!this.routers.get(roomId as string)) {
        console.log('Нету роутера')
        const newRouter = await worker.createRouter({
          mediaCodecs: [
            {
              kind: 'audio',
              mimeType: 'audio/opus',
              clockRate: 48000,
              channels: 2,
            },
            {
              kind: 'audio',
              mimeType: 'audio/PCMU', // Резервный кодек
              clockRate: 8000,
              channels: 1,
            },
          ],
        })
        this.routers.set(roomId as string, newRouter)
      }

      console.log('Client connected:', socket.id)
      // Инициализируем сессию
      this.clients.set(socket.id, {
        consumers: [],
      })

      socket.on('getRtpCapabilities', (callback) => {
        try {
          // const caps = router.rtpCapabilities
          const caps = this.routers.get(roomId as string)!.rtpCapabilities
          return callback(caps)
        } catch (err: any) {
          console.error('getRtpCapabilities error', err)
          return callback({ error: err.message } as any)
        }
      })

      socket.on('createTransport', async (_, callback) => {
        console.log(socket.id, 'создал транспорт')
        voiceRoomStore.addUserToRoom(
          roomId as string,
          socket.data.session?.id || 'aboba'
        )

        console.log(roomId)

        console.log(voiceRoomStore.getAllRooms())

        try {
          const transport = await this.createWebRtcTransport(
            this.routers.get(roomId as string)!
          )
          const client = this.getClient(socket.id)
          client.producerTransport = transport

          return callback({
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          })
        } catch (err: any) {
          console.error('createTransport error', err)
          return callback({ error: err.message } as any)
        }
      })

      socket.on(
        'connectTransport',
        async ({ transportId, dtlsParameters }, callback) => {
          try {
            const client = this.getClient(socket.id)
            if (
              !client.producerTransport ||
              client.producerTransport.id !== transportId
            ) {
              return callback({ error: 'Producer transport not found' } as any)
            }

            await client.producerTransport.connect({ dtlsParameters })

            const otherProducerIds = this.listProducerIds(socket.id)
            socket.broadcast.emit('userConnected', {
              userRoomId: roomId as string,
            })

            socket.emit('existingProducers', { producerIds: otherProducerIds })
            return callback()
          } catch (err: any) {
            console.error('connectTransport error', err)
            return callback({ error: err.message } as any)
          }
        }
      )

      socket.on('produce', async ({ kind, rtpParameters }, callback) => {
        try {
          const client = this.getClient(socket.id)
          if (!client.producerTransport) {
            return callback({
              error: 'Producer transport not initialized',
            } as any)
          }
          if (client.producer) {
            return callback({ error: 'Already producing' } as any)
          }

          const producer = await client.producerTransport.produce({
            kind,
            rtpParameters,
          })
          client.producer = producer

          ///
          this.producerIdToUserId.set(producer.id, socket.data.session!.id)

          socket.broadcast.emit('newProducer', { producerId: producer.id })
          return callback({ id: producer.id })
        } catch (err: any) {
          console.error('produce error', err)
          return callback({ error: err.message } as any)
        }
      })

      socket.on(
        'consume',
        async ({ producerId, rtpCapabilities }, callback) => {
          try {
            if (
              !this.routers
                .get(roomId as string)!
                .canConsume({ producerId, rtpCapabilities })
            ) {
              return callback({ error: 'Cannot consume' } as any)
            }

            const transport = await this.createWebRtcTransport(
              this.routers.get(roomId as string)!
            )
            const consumer = await transport.consume({
              producerId,
              rtpCapabilities,
              paused: false,
            })

            const client = this.getClient(socket.id)
            client.consumers.push({ transport, consumer })

            return callback({
              user_id: this.producerIdToUserId.get(producerId) as string,
              id: consumer.id,
              producerId: consumer.producerId,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
              transportId: transport.id,
              iceParameters: transport.iceParameters,
              iceCandidates: transport.iceCandidates,
              dtlsParameters: transport.dtlsParameters,
            })
          } catch (err: any) {
            console.error('consume error', err)
            return callback({ error: err.message } as any)
          }
        }
      )

      socket.on(
        'connectConsumerTransport',
        async ({ transportId, dtlsParameters }, callback) => {
          try {
            const client = this.getClient(socket.id)
            const session = client.consumers.find(
              (c) => c.transport.id === transportId
            )
            if (!session) {
              return callback({ error: 'Consumer transport not found' } as any)
            }

            await session.transport.connect({ dtlsParameters })
            return callback()
          } catch (err: any) {
            console.error('connectConsumerTransport error', err)
            return callback({ error: err.message } as any)
          }
        }
      )

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
        const client = this.clients.get(socket.id)
        if (!client) return

        // Закрываем продюсера
        if (client.producer) {
          client.producer.close()
          socket.broadcast.emit('userDisconnected', {
            userRoomId: roomId as string,
          })
        }
        // Закрываем producerTransport
        if (client.producerTransport) {
          client.producerTransport.close()
        }
        // Закрываем всех consumer'ов
        for (const { transport, consumer } of client.consumers) {
          consumer.close()
          transport.close()
        }

        voiceRoomStore.removeUser(socket.data.session?.id || 'aboba')
        if (!voiceRoomStore.isRoomExist(roomId as string)) {
          this.routers.delete(roomId as string)
        }
        //Внимание! '!'
        if (this.clients.get(socket.id)) {
          this.clients.delete(socket.id)
        }
      })
    })
  }
}
