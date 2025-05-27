import { parse } from 'cookie'
import { Namespace } from 'socket.io'
import { sessionOptions } from '../../config/session.js'
import { unsealData } from 'iron-session'
import { AuthSession } from '../../models/auth.model.js'

export const checkAuth = (namespace: Namespace) => {
  namespace.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie

      if (!cookieHeader) {
        return next(new Error('Ошибка socket: Отсутствует заголовок Cookie'))
      }

      const cookies = parse(cookieHeader)
      const seal: string = cookies[sessionOptions.cookieName] as string

      if (!seal) {
        return next(new Error('Ошибка socket: Сессионная cookie не найдена'))
      }

      socket.data.session = await unsealData<AuthSession>(seal, sessionOptions)

      if (new Date(socket.data.session.expiresAt) < new Date()) {
        return next(new Error('Ошибка socket: Авторизация устарела'))
      }

      if (!socket.data.session?.id) {
        return next(new Error('Ошибка socket: Пользователь не авторизован'))
      }
      next()
    } catch (error) {
      return next(new Error(`Ошибка socket: Ошибка аутентификации: ${error}`))
    }
  })
}
