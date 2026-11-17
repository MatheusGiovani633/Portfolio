import assert from 'node:assert/strict'
import { cp, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { after, before, test } from 'node:test'

import { createApp } from '../src/app.js'

let server
let base
let fixture

// Conteúdo de teste com dois posts, para conferir a ordem sem depender do blog real.
before(async () => {
  fixture = await mkdtemp(path.join(tmpdir(), 'portfolio-'))
  await cp('content', fixture, { recursive: true })
  await writeFile(
    path.join(fixture, 'posts', 'post-antigo.md'),
    '---\ntitle: Post antigo\ndate: 2020-01-01\nsummary: Antigo\n---\n\nTexto com `codigo`.\n',
  )
  server = createApp({ contentDir: fixture }).listen(0, '127.0.0.1')
  await new Promise(r => server.once('listening', r))
  base = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  server.close()
  await rm(fixture, { recursive: true, force: true })
})

const get = p => fetch(base + p, { redirect: 'manual' })

test('currículo responde com o nome e as seções', async () => {
  const res = await get('/')
  assert.equal(res.status, 200)
  const html = await res.text()
  assert.match(html, /<html lang="pt-BR"[^>]*data-theme="light"/)
  for (const s of ['Matheus Giovani', 'Experiência', 'Projetos', 'Formação e stack']) {
    assert.ok(html.includes(s), `faltou ${s}`)
  }
})

test('inglês e japonês têm a própria página', async () => {
  for (const [p, lang, secao] of [['/en', 'en', 'Experience'], ['/ja', 'ja', '職務経歴']]) {
    const res = await get(p)
    assert.equal(res.status, 200)
    const html = await res.text()
    assert.match(html, new RegExp(`<html lang="${lang}"`))
    assert.ok(html.includes(secao), `${p} sem ${secao}`)
  }
})

test('"Vamos conversar" abre o WhatsApp', async () => {
  const html = await (await get('/')).text()
  assert.match(html, /href="https:\/\/wa\.me\/5551992494038\?text=/)
})

test('/curriculo redireciona para a página inicial', async () => {
  const res = await get('/curriculo')
  assert.equal(res.status, 301)
  assert.equal(res.headers.get('location'), '/')
})

test('blog lista os posts, mais recente primeiro', async () => {
  const html = await (await get('/blog')).text()
  const tcc = html.indexOf('/blog/battlezone-o-tcc')
  const antigo = html.indexOf('/blog/post-antigo')
  assert.ok(tcc > 0 && antigo > 0)
  assert.ok(tcc < antigo, 'o post mais novo vem primeiro')
})

test('post abre com o markdown convertido', async () => {
  const res = await get('/blog/post-antigo')
  assert.equal(res.status, 200)
  assert.match(await res.text(), /<code>codigo<\/code>/)
})

test('slug inexistente ou com ../ dá 404', async () => {
  assert.equal((await get('/blog/nao-existe')).status, 404)
  assert.equal((await get('/blog/..%2Fcurriculo')).status, 404)
  assert.equal((await get('/qualquer-coisa')).status, 404)
})

test('health responde ok', async () => {
  const body = await (await get('/health')).json()
  assert.equal(body.status, 'ok')
})
