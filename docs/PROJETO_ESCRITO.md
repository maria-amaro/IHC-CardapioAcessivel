# Projeto Escrito - Cardápio Acessível

## 1. Visão geral
O Cardápio Acessível é um protótipo de cardápio web para uso presencial em restaurantes. A pessoa cliente escaneia um QR code disponibilizado na mesa e consulta o cardápio no navegador do próprio celular, sem instalar um aplicativo. O foco é tornar ingredientes, alérgenos e opções de acessibilidade fáceis de encontrar antes de escolher um prato.

O protótipo atual usa a Casa do Ipê e a Mesa 08 como dados demonstrativos. Não representa um restaurante real.

## 2. Problema
Durante uma refeição presencial, clientes podem precisar de informações que não estão claras em cardápios impressos ou digitais: ingredientes, alérgenos, possibilidade de contato cruzado, preço e opções de personalização. Texto pequeno, nomenclatura ambígua, filtros inacessíveis e a necessidade de chamar a equipe para cada dúvida podem reduzir autonomia e dificultar a tomada de decisão.

## 3. Objetivo
Projetar e avaliar um cardápio web responsivo, acessado por QR code no contexto de restaurante presencial, que permita consultar pratos e informações alimentares com clareza, autonomia e recursos de acessibilidade. O sistema deve informar limites dos dados e não prometer segurança contra contato cruzado.

## 4. Público-alvo
- Pessoas com alergias ou intolerâncias alimentares.
- Pessoas com baixa visão, cegueira ou que utilizam leitores de tela.
- Pessoas daltônicas.
- Pessoas idosas ou com diferentes níveis de letramento digital.
- Clientes que preferem consultar o cardápio sem aguardar atendimento para obter informações básicas.

## 5. Escopo do protótipo

### Implementado no frontend
- Cardápio responsivo para celular e desktop.
- Busca por nome e ingrediente, sugestões e filtros por alérgenos e preferências alimentares.
- Ocultação de pratos incompatíveis com filtros, com opção de exibi-los identificados.
- Páginas de detalhes com ingredientes, alérgenos, personalizações e avisos de contato cruzado.
- Pedido demonstrativo com adição, remoção, alteração de quantidade e resumo.
- Ajuste de texto, modos de cor/contraste, filtros aproximados para daltonismo, leitura em voz alta, navegação e busca por voz.
- Preferências de acessibilidade persistidas localmente neste aparelho.

### Fora do escopo funcional atual
- Gerar ou imprimir QR codes, hospedar o serviço publicamente ou associar QR codes reais a mesas.
- Gerenciar restaurantes, mesas, cardápios ou usuários em um painel administrativo.
- Enviar pedidos à cozinha ou ao sistema de ponto de venda. A confirmação atual é demonstrativa.
- Notificar funcionários ao tocar em “Chamar atendimento”; hoje o botão apenas anuncia uma mensagem local no navegador.
- Conectar o frontend à API que permanece no diretório `backend/`.

## 6. Requisitos funcionais
- RF01: consultar o cardápio no navegador em telas de celular e desktop.
- RF02: buscar pratos por nome ou ingrediente.
- RF03: filtrar pratos por alérgenos a evitar e preferências alimentares.
- RF04: explicar quando um prato conflita com filtros ativos e permitir visualizar pratos ocultos com aviso.
- RF05: apresentar ingredientes, alérgenos, preço e possibilidade de contato cruzado.
- RF06: apresentar detalhes e personalizações de cada prato.
- RF07: permitir montar e revisar um pedido demonstrativo.
- RF08: permitir ajustar texto, contraste, filtros de daltonismo e recursos de voz.
- RF09: disponibilizar uma forma de chamar a equipe. No protótipo atual, a ação só apresenta um aviso local; a notificação real está pendente.

## 7. Requisitos não funcionais e de qualidade
- RNF01: interface responsiva e utilizável em telas pequenas e grandes.
- RNF02: estrutura semântica, rótulos acessíveis, foco visível e navegação por teclado.
- RNF03: mensagens importantes não dependem exclusivamente de cor.
- RNF04: linguagem simples e consistente.
- RNF05: ajustes de acessibilidade não removem conteúdo ou funcionalidade.
- RNF06: minimizar dados pessoais e deixar claro quando funções são apenas demonstrativas.
- RNF07: informar que filtros de receita não garantem ausência de contato cruzado.

## 8. Tecnologia e arquitetura atual
- Frontend: React, TypeScript e Vite em `frontend/`.
- Estado de busca, pedido, navegação e avisos mantido no cliente.
- Preferências de acessibilidade salvas em `localStorage`; busca e pedido ficam em memória.
- Há uma API inicial em `backend/`, mas ela não está conectada ao frontend atual e não envia pedidos.

## 9. Pesquisa, avaliação e limites metodológicos
Entrevistas de exemplo são material simulado e não podem ser citadas como dados coletados. Não foram realizados testes com leitores de tela reais nem validação com usuários nesta versão documentada. Avaliações heurísticas, auditorias de acessibilidade e testes com participantes devem ser descritos somente com evidências e registros correspondentes.

A interface pode apoiar a consulta, mas não substitui confirmação com o restaurante, especialmente para alergias graves. Os dados fictícios devem ser revisados pelo estabelecimento antes de qualquer uso real.

## 10. Próximos passos
1. Validar o problema, requisitos e fluxo com usuários e equipe do restaurante.
2. Substituir dados demonstrativos por cardápio, preços, ingredientes e alérgenos aprovados pelo estabelecimento.
3. Decidir se o produto será apenas informativo ou se enviará pedidos à equipe; implementar a integração correspondente.
4. Implementar um canal real para solicitar atendimento, ou deixar explícito na interface que a ação é demonstrativa.
5. Hospedar o frontend, gerar e testar QR codes por mesa e confirmar o fluxo em celulares reais.
6. Realizar testes de acessibilidade, usabilidade e privacidade antes de qualquer piloto.
7. Finalizar relatórios, evidências, referências e apresentação.
