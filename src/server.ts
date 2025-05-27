import { bootstrap } from './app.js'

bootstrap().catch((err) => {
  console.error('Failed to bootstrap server:', err)
  process.exit(1)
})
