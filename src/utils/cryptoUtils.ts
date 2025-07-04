import crypto from 'crypto'
import { cryptoEnv } from '../config/index.js'

// Настройки
const algorithm = 'aes-256-gcm'
const password = cryptoEnv.password as string
const ivLength = 12 // Для GCM — 12 байт
const saltLength = 16 // Соль 16 байт

// Генерация ключа с помощью scrypt
export function getKey(
  password: string,
  salt: Buffer<ArrayBufferLike>
): Promise<Buffer<ArrayBufferLike>> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 32, (err, key) => {
      if (err) reject(err)
      else resolve(key)
    })
  })
}

// Шифрование
export async function encrypt(plainText: string) {
  const salt = crypto.randomBytes(saltLength)
  const iv = crypto.randomBytes(ivLength)
  const key = await getKey(password, salt)

  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const encrypted = Buffer.concat([
    cipher.update(plainText, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  // Склеиваем все части: salt + iv + authTag + encrypted
  const payload = Buffer.concat([salt, iv, authTag, encrypted])
  return payload.toString('base64')
}

// Расшифровка
export async function decrypt(encryptedBase64: string) {
  const payload = Buffer.from(encryptedBase64, 'base64')

  const salt = Buffer.from(payload.subarray(0, saltLength))
  const iv = Buffer.from(payload.subarray(saltLength, saltLength + ivLength))
  const authTag = Buffer.from(
    payload.subarray(saltLength + ivLength, saltLength + ivLength + 16)
  )
  const encrypted = Buffer.from(payload.subarray(saltLength + ivLength + 16))

  const key = await getKey(password, salt)
  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAuthTag(authTag)

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}

export const cryptoTest = async () => {
  const originalText = 'Привет, безопасный мир!'
  const encrypted = await encrypt(originalText)
  console.log('Зашифровано:', encrypted)

  const decrypted = await decrypt(encrypted)
  console.log('Расшифровано:', decrypted)
}
