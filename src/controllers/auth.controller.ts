import { RequestHandler } from 'express'
import { AuthService } from '../services/auth.services.js'
import { getSession, sessionOptions } from '../config/session.js'
import { RoomService } from '../services/room.services.js'

export class AuthController {
  private authService = new AuthService()
  private roomService = new RoomService()

  public register: RequestHandler = async (req, res) => {
    try {
      const { login, password } = req.body
      const userId = await this.authService.register(login, password)
      const allRoom = await this.roomService.findAll()
      allRoom?.forEach((room) => {
        this.roomService.addUserToRoom(userId, room.id)
      })
      res.json({ id: userId })
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }

  public login: RequestHandler = async (req, res) => {
    try {
      const { login, password } = req.body
      const userId = await this.authService.authenticate(login, password)
      const session = await getSession(req, res)
      session.id = userId
      session.expiresAt = new Date(
        Date.now() + sessionOptions.cookieOptions.maxAge * 1000
      )
      await session.save()
      res.json({ ok: true, id: userId })
    } catch (err: any) {
      res.status(401).json({ error: err.message })
    }
  }

  public logout: RequestHandler = async (req, res) => {
    const session = await getSession(req, res)
    await session.destroy()
    res.json({ ok: true })
  }
}
