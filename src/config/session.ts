import { Request, Response } from 'express'
import { getIronSession, IronSession } from 'iron-session'
import { AuthSession } from '../models/auth.model.js'
import { sessionEnv } from './index.js'

declare module 'iron-session' {
  interface IronSessionData extends AuthSession {}
}

export const sessionOptions = {
  password: sessionEnv.password as string,
  cookieName: sessionEnv.cookieName as string,
  cookieOptions: {
    domain: sessionEnv.domain,
    secure: sessionEnv.nodeEnv === 'production', // в проде — по HTTPS
    httpOnly: true,
    sameSite: 'None', //Lax
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  },
}

export async function getSession(
  req: Request,
  res: Response
): Promise<IronSession<AuthSession>> {
  const session = await getIronSession<AuthSession>(req, res, sessionOptions)
  return session
}
