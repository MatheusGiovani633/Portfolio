---
title: Qualidade não é só "a tela funciona"
date: 2026-10-27
summary: O que aprendi como QA da nova Central de Atendimento do WhatsApp no CRM da Dataweb.
---

Neste mês apresentamos aos times de Comercial, Implantação e Suporte a nova **Central de Atendimento do WhatsApp**, uma ferramenta do módulo CRM da Dataweb Tecnologia. Com ela, a ótica atende os clientes pelo WhatsApp sem sair do CRM.

Por trás da tela tem bastante coisa:

- **Velocidade:** a mensagem do cliente vira um card na tela em segundos.
- **Nada se perde:** se o CRM ficar fora do ar, as mensagens ficam guardadas por até 7 dias e, quando ele volta, tudo entra na ordem certa.
- **Privacidade:** as conversas ficam no banco do próprio cliente, sem prazo de expiração, e cada número só entrega mensagens para quem o conectou. Um cliente nunca lê a conversa de outro.

O desenvolvimento foi do Lucas Dal Pozzo de Matos e do Bernardo Silva Alves, com a gestão do Dionatan Netto. Eu participei como QA, testando a ferramenta para que ela chegasse estável a quem vai usar no dia a dia.

## O que testar quando "funciona"

A tela abrir e a mensagem aparecer é o começo. O teste que importa é o do dia ruim:

1. **Queda no meio do caminho:** derrubar o CRM com mensagens chegando e conferir que, na volta, todas aparecem e na ordem certa.
2. **Isolamento:** dois clientes com números diferentes e a certeza de que nenhuma conversa vaza de um para o outro.
3. **O banco, não só a tela:** conferir onde a conversa ficou guardada e que ela não some depois de um prazo.

Para mim, o mais legal desse projeto foi isso: qualidade é garantir que nada se perde quando algo dá errado e que os dados de cada cliente ficam protegidos.
