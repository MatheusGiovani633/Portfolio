import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { loadCurriculo, loadPost, loadPosts } from './content.js'
import { LANGS } from './i18n.js'
import { blogPage, curriculoPage, notFoundPage, postPage } from './views.js'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

export function createApp({ contentDir = path.join(root, 'content') } = {}) {
  const app = express()
  app.disable('x-powered-by')

  app.use(express.static(path.join(root, 'public'), { maxAge: '1h' }))

  // Currículo em cada idioma: / (português), /en e /ja.
  // O conteúdo é lido a cada pedido: uma mudança aparece sem reiniciar o servidor.
  for (const [lang, { path: route }] of Object.entries(LANGS)) {
    app.get(route, async (_req, res) => {
      const [cv, posts] = await Promise.all([
        loadCurriculo(contentDir, lang),
        loadPosts(contentDir),
      ])
      res.send(curriculoPage(cv, posts.slice(0, 3), lang))
    })
  }

  app.get('/curriculo', (_req, res) => res.redirect(301, '/'))

  app.get('/blog', async (_req, res) => {
    const [cv, posts] = await Promise.all([
      loadCurriculo(contentDir),
      loadPosts(contentDir),
    ])
    res.send(blogPage(cv, posts))
  })

  app.get('/blog/:slug', async (req, res) => {
    const [cv, post] = await Promise.all([
      loadCurriculo(contentDir),
      loadPost(contentDir, req.params.slug),
    ])
    if (!post) return res.status(404).send(notFoundPage(cv))
    res.send(postPage(cv, post))
  })

  // Para conferir de fora que o processo está vivo.
  app.get('/health', (_req, res) =>
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) }),
  )

  app.use(async (_req, res) => {
    res.status(404).send(notFoundPage(await loadCurriculo(contentDir)))
  })

  return app
}
