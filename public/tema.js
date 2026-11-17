// Botão de tema: alterna claro/escuro e lembra a escolha neste navegador.
const root = document.documentElement
const button = document.querySelector('.tema')

function apply(theme) {
  root.dataset.theme = theme
  const dark = theme === 'dark'
  button.setAttribute('aria-pressed', String(dark))
  button.setAttribute('aria-label', dark ? button.dataset.toLight : button.dataset.toDark)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0B0B12' : '#FAFAFC')
}

apply(root.dataset.theme === 'dark' ? 'dark' : 'light')

button.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
  apply(next)
  try {
    localStorage.setItem('tema', next)
  } catch {
    // Sem armazenamento (aba anônima, bloqueado): o tema vale só até fechar a página.
  }
})
