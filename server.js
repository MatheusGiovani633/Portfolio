import { createApp } from './src/app.js'

// 0.0.0.0: escuta em todas as interfaces, para aceitar acesso pelo IP público.
const HOST = process.env.HOST ?? '0.0.0.0'
const PORT = Number(process.env.PORT ?? 3000)

createApp().listen(PORT, HOST, () => {
  console.log(`Site no ar em http://${HOST}:${PORT}`)
})
