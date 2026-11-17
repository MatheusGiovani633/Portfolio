import { LANGS } from './i18n.js'

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

const shortDate = iso =>
  /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split('-').reverse().join('.') : esc(iso)

// Pinta as palavras de destaque da chamada: a primeira em roxo, a segunda em verde.
function highlight(text, words = []) {
  let html = esc(text)
  words.forEach((w, i) => {
    html = html.replace(esc(w), `<span class="${i % 2 ? 'verde' : 'roxo'}">${esc(w)}</span>`)
  })
  return html
}

// Link do WhatsApp com a mensagem já escrita no idioma da página (wa.me abre o WhatsApp Web no computador e o app no celular).
const whatsapp = (cv, lang) =>
  cv.contato.whatsapp
    ? `https://wa.me/${cv.contato.whatsapp}?text=${encodeURIComponent(LANGS[lang].waText)}`
    : `mailto:${cv.contato.email}`

const SUN ='<svg class="ic-sol" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
const MOON = '<svg class="ic-lua" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'

function layout(cv, { lang = 'pt', title, active, body }) {
  const s = LANGS[lang]
  const base = s.path === '/' ? '/' : s.path
  const nav = [
    [`${base}#experiencia`, s.nav.experiencia, 'experiencia'],
    [`${base}#projetos`, s.nav.projetos, 'projetos'],
    [`${base}#stack`, s.nav.stack, 'stack'],
    ['/blog', s.nav.blog, 'blog'],
  ]
    .map(([href, label, key]) => `<a href="${href}"${key === active ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('')

  const langs = Object.entries(LANGS)
    .map(
      ([code, l]) =>
        `<a href="${l.path}" lang="${l.html}" hreflang="${l.html}" title="${l.name}"${code === lang ? ' aria-current="true"' : ''}>${l.label}</a>`,
    )
    .join('')

  const alternates = Object.values(LANGS)
    .map(l => `<link rel="alternate" hreflang="${l.html}" href="${l.path}">`)
    .join('\n')

  const jaFont = lang === 'ja' ? '&family=Noto+Sans+JP:wght@400;500;700' : ''

  return `<!doctype html>
<html lang="${s.html}" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(cv.nome)}</title>
<meta name="description" content="${esc(cv.resumo)}">
<meta name="theme-color" content="#FAFAFC">
${alternates}
<script>
  // Antes de pintar: aplica o tema salvo, para não piscar o claro quando a pessoa escolheu o escuro.
  try { if (localStorage.getItem('tema') === 'dark') document.documentElement.dataset.theme = 'dark' } catch {}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500${jaFont}&display=swap">
<link rel="stylesheet" href="/style.css">
<script src="/tema.js" defer></script>
</head>
<body>
<a class="skip" href="#conteudo">${s.skip}</a>
<header class="wrap topo">
  <a class="marca" href="${base}" aria-label="${esc(cv.nome)}">
    <span class="logo" aria-hidden="true"><span>MG</span></span>
    <span>Matheus Giovani</span>
  </a>
  <nav class="menu" aria-label="${s.nav.experiencia}">${nav}<a class="btn-contato" href="mailto:${esc(cv.contato.email)}">${s.contact}</a></nav>
  <div class="controles">
    <nav class="idiomas" aria-label="${s.langNav}">${langs}</nav>
    <button type="button" class="tema" aria-label="${s.toDark}" aria-pressed="false" data-to-dark="${s.toDark}" data-to-light="${s.toLight}">${MOON}${SUN}</button>
  </div>
</header>
<main id="conteudo">${body}</main>
<footer class="wrap rodape">
  <p class="vamos"><a href="${esc(whatsapp(cv, lang))}" rel="noopener" target="_blank">${s.footer[0]}<span class="degrade">${s.footer[1]}</span>${s.footer[2]}</a></p>
  <a class="mono email" href="mailto:${esc(cv.contato.email)}">${esc(cv.contato.email)}</a>
  <div class="assinatura">
    <span>© ${new Date().getFullYear()} ${esc(cv.nome)}</span>
    <span class="mono">Node.js · Express · GitHub Actions</span>
  </div>
</footer>
</body>
</html>`
}

const heading = (id, num, text) =>
  `<h2 id="${id}" class="titulo"><span class="num mono">${num}</span>${text}</h2>`

function postRows(posts) {
  if (posts.length === 0) return '<p class="vazio">Nenhum post publicado ainda.</p>'
  return `<ul class="posts">${posts
    .map(
      p => `<li><a href="/blog/${esc(p.slug)}" lang="pt-BR">
  <time class="mono" datetime="${esc(p.date)}">${shortDate(p.date)}</time>
  <span><strong>${esc(p.title)} <span class="seta" aria-hidden="true">↗</span></strong><span>${esc(p.summary)}</span></span>
</a></li>`,
    )
    .join('')}</ul>`
}

export function curriculoPage(cv, recentPosts, lang = 'pt') {
  const s = LANGS[lang]
  const links = cv.links
    .filter(l => !/battlezone/i.test(l.url))
    .map(l => `<a class="btn" href="${esc(l.url)}" rel="noopener">${esc(l.rotulo)}</a>`)
    .join('')

  const ficha = (cv.ficha ?? [])
    .map(f => `<div><dt class="mono">${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`)
    .join('')

  const experiencia = cv.experiencia
    .map(
      e => `<article class="linha">
  <p class="mono periodo">${esc(e.periodo)}</p>
  <div>
    <h3>${esc(e.cargo)}</h3>
    <p class="empresa">${esc(e.empresa)}</p>
    <ul class="pontos">${e.pontos.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
  </div>
</article>`,
    )
    .join('')

  const projetos = cv.projetos
    .map(
      p => `<a class="projeto" href="${esc(p.url)}" rel="noopener">
  <span class="mono tipo"><span>${esc(p.tipo ?? '')}</span><span class="seta" aria-hidden="true">↗</span></span>
  <span class="nome">${esc(p.nome)}</span>
  <span class="desc">${esc(p.descricao)}</span>
  <span class="mono stackp">${p.tecnologias.map(esc).join(' · ')}</span>
</a>`,
    )
    .join('')

  const formacao = cv.formacao
    .map(
      f => `<li><strong>${esc(f.curso)}</strong><span>${esc(f.instituicao)} · ${esc(f.periodo)}</span>${f.detalhe ? `<span>${esc(f.detalhe)}</span>` : ''}</li>`,
    )
    .join('')

  const stack = Object.entries(cv.habilidades)
    .map(
      ([grupo, itens]) =>
        `<div><h3 class="mono rotulo">${esc(grupo)}</h3><ul>${itens.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`,
    )
    .join('')

  const body = `
<section class="wrap hero">
  <div class="hero-texto">
    <p class="mono selo"><span class="ponto" aria-hidden="true"></span>${esc(cv.disponibilidade ?? '')}</p>
    <h1>${esc(cv.nome.split(' ').slice(0, 2).join(' '))}</h1>
    <p class="chamada">${highlight(cv.chamada ?? cv.cargo, cv.destaques)}</p>
    <p class="resumo">${esc(cv.resumo)}</p>
    <div class="acoes">
      <a class="btn primario" href="${esc(whatsapp(cv, lang))}" rel="noopener" target="_blank">${s.cta}</a>
      ${links}
    </div>
  </div>
  <div class="hero-lado">
    <div class="foto"><img src="/foto.jpg" alt="${s.photo} ${esc(cv.nome)}" width="162" height="162"></div>
    <dl class="ficha">${ficha}</dl>
  </div>
</section>

<section class="secao" aria-labelledby="experiencia"><div class="wrap">
  ${heading('experiencia', '01', s.sections.experiencia)}
  ${experiencia}
</div></section>

<section class="secao" aria-labelledby="projetos"><div class="wrap">
  ${heading('projetos', '02', s.sections.projetos)}
  <div class="projetos">${projetos}</div>
</div></section>

<section class="secao" aria-labelledby="stack"><div class="wrap">
  ${heading('stack', '03', s.sections.stack)}
  <ul class="formacao">${formacao}</ul>
  <div class="stack">${stack}<div><h3 class="mono rotulo">${s.languages}</h3><ul>${(cv.idiomas ?? []).map(i => `<li>${esc(i)}</li>`).join('')}</ul></div></div>
</div></section>

<section class="secao" aria-labelledby="blog-home"><div class="wrap">
  ${heading('blog-home', '04', s.sections.blog)}
  ${s.postsNote ? `<p class="nota">${s.postsNote}</p>` : ''}
  ${postRows(recentPosts)}
  <p class="mais"><a href="/blog">${s.allPosts}</a></p>
</div></section>`

  return layout(cv, { lang, title: s.title, active: null, body })
}

export function blogPage(cv, posts) {
  return layout(cv, {
    title: 'Blog',
    active: 'blog',
    body: `<section class="secao"><div class="wrap">
  <h1 class="titulo-pagina">Blog</h1>
  ${postRows(posts)}
</div></section>`,
  })
}

export function postPage(cv, post) {
  return layout(cv, {
    title: post.title,
    active: 'blog',
    body: `<article class="secao"><div class="wrap post">
  <p><a class="voltar" href="/blog">← Todos os posts</a></p>
  <time class="mono" datetime="${esc(post.date)}">${fmtDate(post.date)}</time>
  <h1 class="titulo-pagina">${esc(post.title)}</h1>
  <div class="texto">${post.html}</div>
</div></article>`,
  })
}

export function notFoundPage(cv) {
  return layout(cv, {
    title: 'Página não encontrada',
    active: null,
    body: `<section class="secao"><div class="wrap">
  <h1 class="titulo-pagina">Página não encontrada</h1>
  <p><a href="/">Voltar para o início →</a></p>
</div></section>`,
  })
}
