import { Request, RequestHandler, Response } from 'express'
import { getIronSession } from 'iron-session'
import { UserService } from '../services/user.services.js'
import { getSession } from '../config/session.js'
import { PublicUser, User } from '../models/user.model.js'
import { Socket } from 'socket.io'
import {
  MainClientToServerEvents,
  MainServerToClientEvents,
  SocketData,
} from '../models/main.socket.model.js'

export class UserController {
  private userService = new UserService()

  async getIdToLogin(
    socket: Socket<
      MainClientToServerEvents,
      MainServerToClientEvents,
      {},
      SocketData
    >,
    ack: (idToLogin: Record<string, string>) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }
      const idToLogin = await this.userService.idToLogin()
      if (!idToLogin) {
        throw new Error('Нет пользователей')
      }
      ack(idToLogin)
    } catch (err) {
      // единый формат ошибок
      // socket.emit('error', { code: 'ROOM_FETCH_FAILED', message: err.message });
      console.log('Ошибка получения пользователей')
    }
  }

  async getUser(
    socket: Socket<
      MainClientToServerEvents,
      MainServerToClientEvents,
      {},
      SocketData
    >,
    id: string,
    ack: (user: PublicUser) => void
  ) {
    try {
      const userId = socket.data.session?.id
      if (!userId) {
        throw new Error('Unauthorized')
      }
      const user = await this.userService.getById(id)
      if (!user) {
        throw new Error('Пользователь не найден')
      }
      const { password_hash, ...publicUser } = user
      ack(publicUser!)
    } catch (err) {
      // единый формат ошибок
      // socket.emit('error', { code: 'ROOM_FETCH_FAILED', message: err.message });
      console.log('Ошибка получения комнат')
    }
  }
}
