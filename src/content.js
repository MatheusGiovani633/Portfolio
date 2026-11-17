import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { marked } from 'marked'

export async function loadCurriculo(dir) {
  return JSON.parse(await readFile(path.join(dir, 'curriculo.json'), 'utf8'))
}

// Só letras, números e hífen: o slug vira nome de arquivo, então "../" nunca passa.
const SLUG = /^[a-z0-9-]+$/

/**
 * Cabeçalho simples no topo do .md, entre linhas "---":
 *   title: Título
 *   date: 2026-11-17
 *   summary: Uma frase
 */
function parse(slug, raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  const meta = {}
  for (const line of (match?.[1] ?? '').split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return {
    slug,
    title: meta.title ?? slug,
    date: meta.date ?? '',
    summary: meta.summary ?? '',
    html: marked.parse(match ? match[2] : raw),
  }
}

export async function loadPosts(dir) {
  const postsDir = path.join(dir, 'posts')
  const files = (await readdir(postsDir)).filter(f => f.endsWith('.md'))
  const posts = await Promise.all(
    files.map(async f =>
      parse(f.slice(0, -3), await readFile(path.join(postsDir, f), 'utf8')),
    ),
  )
  // Mais recente primeiro (datas no formato AAAA-MM-DD ordenam como texto).
  return posts.sort((a, b) => b.date.localeCompare(a.date))
}

export async function loadPost(dir, slug) {
  if (!SLUG.test(slug)) return null
  try {
    return parse(slug, await readFile(path.join(dir, 'posts', `${slug}.md`), 'utf8'))
  } catch (err) {
    if (err.code === 'ENOENT') return null
    throw err
  }
}
