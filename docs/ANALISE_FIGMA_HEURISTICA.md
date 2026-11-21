# Análise do Protótipo Figma - Cardápio Acessível

## Referência e cenário
Protótipo: https://www.figma.com/design/ZIVOfNYTfKekosmA44cS64/Prot%C3%B3tipo?t=a0esSpED2SJHKLsy-1

O cenário definido é o de um cardápio de restaurante presencial aberto no navegador após a leitura de um QR code na mesa. A implementação atual é uma réplica funcional local; não se deve confundir o QR code de entrada nem o envio de pedido com funcionalidades já integradas.

## Elementos observados no protótipo
- Cabeçalho de acessibilidade separado dos controles e dos dados do restaurante.
- Ajuste de texto, contraste, navegação por voz, leitor de tela e limpeza de filtros.
- Identificação do restaurante, chamada de atendimento e acesso ao pedido.
- Busca, sugestões e filtros alimentares.
- Lista de pratos com preço, ingredientes/resumo, alérgenos e ações.
- Detalhes de prato, ajustes de acessibilidade e fluxo de pedido.

## Estado da avaliação heurística
Os itens abaixo são perguntas de inspeção que ainda precisam ser avaliadas diretriz por diretriz e registradas com evidência. Não são achados confirmados:
1. H1 - Visibilidade do status: filtros, atualizações de quantidade e confirmação do pedido são anunciados?
2. H2 - Compatibilidade com o mundo real: termos, preço por porção, mesa e informações alimentares são compreensíveis?
3. H3 - Controle e liberdade: é possível voltar, limpar filtros e remover itens sem perder contexto?
4. H4 - Consistência e padrões: controles mantêm posições, rótulos e estados entre páginas e tamanhos de tela?
5. H5 - Prevenção de erros: conflito entre filtros e dados dos pratos é identificado sem sugerir segurança absoluta?
6. H6 - Reconhecimento: ingredientes e alérgenos podem ser consultados sem depender da memória entre telas?
7. H7 - Flexibilidade e eficiência: os controles por toque, teclado e voz funcionam como alternativas equivalentes?
8. H8 - Design minimalista: avisos e informações prioritárias permanecem fáceis de localizar?
9. H9 - Recuperação de erros: busca sem resultados ou falha no reconhecimento de voz oferece uma alternativa clara?
10. H10 - Ajuda: a forma de chamar a equipe é fácil de encontrar e tem comportamento previsível?

## Verificações necessárias
- Fazer a inspeção manual de todas as telas e estados do Figma e da implementação.
- Testar combinação e limpeza de filtros, ausência de resultados, pedido vazio e pedido preenchido.
- Conferir contraste, ampliação, navegação por teclado e nomes acessíveis.
- Validar os fluxos de voz em navegadores compatíveis e confirmar alternativa textual.
- Diferenciar dados observados de hipóteses; registrar severidade e evidência para cada achado real.

## Evidências a guardar
- Tela inicial em celular e desktop.
- Preferências selecionadas e resultado dos filtros.
- Detalhe de prato com ingredientes, alérgenos e aviso de contato cruzado.
- Página de ajustes em cada modo de cor e tamanho de texto.
- Pedido, estado vazio, edição de quantidade e confirmação demonstrativa.
- Resultado dos testes de teclado e tecnologia assistiva.
