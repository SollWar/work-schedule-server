import 'dotenv/config'

export const corsEnv = {
  port: getEnvNumber('PORT'),
  clientOrigin: process.env.CLIENT_ORIGIN,
}

export const sessionEnv = {
  password: process.env.SESSION_PASSWORD,
  cookieName: process.env.SESSION_COOKIE_NAME,
  nodeEnv: process.env.NODE_ENV,
  domain: process.env.DOMAIN,
}

export const dbEnv = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: getEnvNumber('DB_PORT') || 5432,
}

export const telegramEnv = {
  botToken: process.env.TELEGRAM_BOT_TOKEN,
}

function getEnvNumber(key: string | undefined): number | undefined {
  if (!key) {
    return undefined
  }
  const value = process.env[key]
  if (!value) return 0
  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} is not a valid number: ${value}`
    )
  }
  return parsed
}
