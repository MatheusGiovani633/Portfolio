---
title: BattleZone, o meu TCC
date: 2026-11-10
summary: Uma plataforma para as lojas de card game organizarem torneios e os jogadores acompanharem o ranking.
---

O **BattleZone** nasceu de um problema real: torneios de card game nas lojas ainda são organizados em planilha e grupo de mensagem.

Na plataforma:

- a **loja** publica o torneio, define vagas, inscrição e premiação;
- o **jogador** encontra torneios perto dele, se inscreve, paga por PIX e envia a decklist;
- depois do torneio, os pontos entram num **ranking** por cidade e por jogo.

A stack é FastAPI e PostgreSQL no back-end, React com TypeScript no front-end, e a produção roda na AWS.

Vindo de QA, levei para o projeto o hábito de testar antes de entregar: cada funcionalidade passa por testes unitários, testes de ponta a ponta contra um banco real e uma revisão antes de ir para a produção.
