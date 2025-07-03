import { RequestHandler } from 'express'
import { createHmac } from 'node:crypto'
import { telegramEnv } from '../config/index.js'
import { getSession, sessionOptions } from '../config/session.js'

export class AuthController {
  public telegramAuth: RequestHandler = async (req, res) => {
    try {
      const { initData } = req.body
      if (typeof initData !== 'string') {
        res.status(400).json({ error: 'Недостаточно параметров' })
      } else {
        const session = await getSession(req, res)
        session.id = initData
        session.expiresAt = new Date(
          Date.now() + sessionOptions.cookieOptions.maxAge * 1000
        )
        await session.save()
        res.json(initData)

        // const params = new URLSearchParams(initData)
        // const hash = params.get('hash')
        // params.delete('hash')
        // const dataCheckString = Array.from(params.entries())
        //   .sort(([a], [b]) => a.localeCompare(b))
        //   .map(([k, v]) => `${k}=${v}`)
        //   .join('\n')

        // const botToken = telegramEnv.botToken

        // if (!botToken) {
        //   res.status(400).json({ error: 'BOT_TOKEN is not defined in .env' })
        // } else {
        //   const secret = createHmac('sha256', 'WebAppData')
        //     .update(botToken)
        //     .digest()
        //   const calculatedHash = createHmac('sha256', secret)
        //     .update(dataCheckString)
        //     .digest('hex')

        //   if (hash !== calculatedHash) {
        //     res.status(400).json({ error: 'Invalid initData' })
        //   } else {
        //     const userString = params.get('user')
        //     if (!userString) {
        //       res.status(400).json({ error: 'User data missing' })
        //     } else {
        //       const user = JSON.parse(decodeURIComponent(userString))
        //       const telegramID: string = user.id

        //       if (!telegramID) {
        //         res.status(400).json({ error: 'telegramID is missing' })
        //       } else {
        //         const session = await getSession(req, res)
        //         session.id = telegramID
        //         session.expiresAt = new Date(
        //           Date.now() + sessionOptions.cookieOptions.maxAge * 1000
        //         )
        //         await session.save()
        //         res.json(telegramID)
        //       }
        //     }
        //   }
        // }
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  }
}
