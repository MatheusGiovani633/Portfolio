// Escapa o que vem dos arquivos de conteúdo antes de entrar no HTML.
const esc = s =>
  String(s ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  )

const fmtDate = iso => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return esc(iso)
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  )
}

function layout(cv, { title, active, body }) {
  const nav = [
    ['/', 'Currículo', 'curriculo'],
    ['/blog', 'Blog', 'blog'],
  ]
    .map(
      ([href, label, key]) =>
        `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`,
    )
    .join('')

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(cv.nome)}</title>
<meta name="description" content="${esc(cv.resumo)}">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="topo">
  <a class="marca" href="/">${esc(cv.nome)}</a>
  <nav aria-label="Principal">${nav}</nav>
</header>
<main id="conteudo">${body}</main>
<footer class="rodape">
  <span>© ${new Date().getFullYear()} ${esc(cv.nome)}</span>
  <span>Feito com Node.js + Express</span>
</footer>
</body>
</html>`
}

const list = items => items.map(i => `<li>${esc(i)}</li>`).join('')

function postCards(posts) {
  if (posts.length === 0) return '<p class="vazio">Nenhum post publicado ainda.</p>'
  return `<ul class="posts">${posts
    .map(
      p => `<li class="card">
  <a href="/blog/${esc(p.slug)}"><h3>${esc(p.title)}</h3></a>
  <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time>
  <p>${esc(p.summary)}</p>
</li>`,
    )
    .join('')}</ul>`
}

export function curriculoPage(cv, recentPosts) {
  const links = cv.links
    .map(l => `<li><a href="${esc(l.url)}" rel="noopener">${esc(l.rotulo)}</a></li>`)
    .join('')
  const formacao = cv.formacao
    .map(
      f => `<li class="item">
  <h3>${esc(f.curso)}</h3>
  <p class="meta">${esc(f.instituicao)} · ${esc(f.periodo)}</p>
  ${f.detalhe ? `<p>${esc(f.detalhe)}</p>` : ''}
</li>`,
    )
    .join('')
  const experiencia = cv.experiencia
    .map(
      e => `<li class="item">
  <h3>${esc(e.cargo)}</h3>
  <p class="meta">${esc(e.empresa)} · ${esc(e.periodo)}</p>
  <ul class="pontos">${list(e.pontos)}</ul>
</li>`,
    )
    .join('')
  const projetos = cv.projetos
    .map(
      p => `<li class="card">
  <h3>${p.url ? `<a href="${esc(p.url)}" rel="noopener">${esc(p.nome)}</a>` : esc(p.nome)}</h3>
  <p>${esc(p.descricao)}</p>
  <p class="tags">${p.tecnologias.map(t => `<span>${esc(t)}</span>`).join('')}</p>
</li>`,
    )
    .join('')

  const body = `
<section class="hero">
  <h1>${esc(cv.nome)}</h1>
  <p class="cargo">${esc(cv.cargo)}</p>
  <p class="resumo">${esc(cv.resumo)}</p>
  <ul class="links">${links}</ul>
</section>

<section aria-labelledby="h-exp">
  <h2 id="h-exp">Experiência</h2>
  <ul class="lista">${experiencia}</ul>
</section>

<section aria-labelledby="h-form">
  <h2 id="h-form">Formação acadêmica</h2>
  <ul class="lista">${formacao}</ul>
</section>

<section aria-labelledby="h-hab">
  <h2 id="h-hab">Habilidades técnicas</h2>
  <div class="habilidades">${Object.entries(cv.habilidades)
    .map(([grupo, itens]) => `<div><h3>${esc(grupo)}</h3><ul class="tags">${list(itens)}</ul></div>`)
    .join('')}</div>
</section>

<section aria-labelledby="h-idiomas">
  <h2 id="h-idiomas">Idiomas</h2>
  <ul class="tags">${list(cv.idiomas ?? [])}</ul>
</section>

<section aria-labelledby="h-proj">
  <h2 id="h-proj">Portfólio</h2>
  <ul class="grade">${projetos}</ul>
</section>

<section aria-labelledby="h-blog">
  <h2 id="h-blog">Últimos posts</h2>
  ${postCards(recentPosts)}
  <p><a href="/blog">Ver todos os posts →</a></p>
</section>

<section aria-labelledby="h-contato" class="contato">
  <h2 id="h-contato">Contato</h2>
  <p><a href="mailto:${esc(cv.contato.email)}">${esc(cv.contato.email)}</a></p>
  ${cv.contato.cidade ? `<p>${esc(cv.contato.cidade)}</p>` : ''}
</section>`

  return layout(cv, { title: 'Currículo', active: 'curriculo', body })
}

export function blogPage(cv, posts) {
  return layout(cv, {
    title: 'Blog',
    active: 'blog',
    body: `<section><h1>Blog</h1>${postCards(posts)}</section>`,
  })
}

export function postPage(cv, post) {
  return layout(cv, {
    title: post.title,
    active: 'blog',
    body: `<article class="post">
  <p><a href="/blog">← Todos os posts</a></p>
  <h1>${esc(post.title)}</h1>
  <time datetime="${esc(post.date)}">${fmtDate(post.date)}</time>
  <div class="texto">${post.html}</div>
</article>`,
  })
}

export function notFoundPage(cv) {
  return layout(cv, {
    title: 'Página não encontrada',
    active: null,
    body: `<section><h1>Página não encontrada</h1><p><a href="/">Voltar para o início</a></p></section>`,
  })
}
