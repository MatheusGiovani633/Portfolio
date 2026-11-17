# Portfólio — Matheus Giovani

Site pessoal com **currículo** e **blog**, feito em Node.js + Express.

## Rodar local

```bash
npm install
npm start          # http://localhost:3000
npm test           # testes das rotas (node:test)
```

## Estrutura

| Caminho | O que é |
|---|---|
| `server.js` | Sobe o Express em `0.0.0.0:3000` (`HOST` e `PORT` mudam isso) |
| `src/app.js` | Rotas: `/` (currículo), `/blog`, `/blog/:slug`, `/health` |
| `content/curriculo.json` | Todos os dados do currículo |
| `content/posts/*.md` | Posts do blog (Markdown com cabeçalho `title`, `date`, `summary`) |
| `public/style.css` | Estilo responsivo, com modo escuro automático |

## Novo post

Crie `content/posts/<slug>.md`:

```markdown
---
title: Título do post
date: 2026-11-20
summary: Uma frase sobre o post.
---

Texto em Markdown.
```

O post aparece na hora, sem reiniciar o servidor (o conteúdo é lido a cada acesso).
