# Checklist de Entrega e Próximas Etapas

## Escopo oficial
Cardápio web para restaurante presencial, aberto pelo cliente ao escanear um QR code na mesa. Não é um aplicativo de delivery. O envio de pedido e a API ainda são demonstrações separadas, não uma integração operacional.

## Concluído no protótipo atual
- [x] Substituir a implementação anterior do frontend pela aplicação da pasta `IHC`.
- [x] Build do frontend concluído após migração (`npm run build`).
- [x] Layout responsivo de cardápio para celular e desktop.
- [x] Busca por pratos/ingredientes, sugestões e filtros alimentares.
- [x] Detalhes de prato com ingredientes, alérgenos, personalizações e aviso de contato cruzado.
- [x] Pedido demonstrativo com quantidade, remoção e resumo.
- [x] Ajustes de texto, contraste, daltonismo, leitura e voz.
- [x] Documentar limitações dos dados fictícios, do pedido demonstrativo e da API não integrada.
- [x] Build local do frontend aprovado.

## Pendências prioritárias antes de um piloto em restaurante
- [ ] Confirmar com o restaurante os pratos, ingredientes, receitas, preços, alérgenos e textos de contato cruzado.
- [ ] Definir se o fluxo será somente consulta ou se o cliente poderá enviar pedido à equipe.
- [ ] Se houver envio de pedido, implementar backend/API real, confirmação para cliente/equipe, tratamento de falhas e proteção contra pedidos duplicados.
- [ ] Implementar notificação real ao chamar a equipe; o controle atual apenas anuncia uma confirmação no próprio navegador.
- [ ] Definir como restaurante e mesa serão identificados; substituir “Casa do Ipê” e “Mesa 08” demonstrativos.
- [ ] Hospedar o frontend com HTTPS e domínio/endereço estável.
- [ ] Gerar QR code com a URL final, imprimir para a mesa e testar câmera, foco, abertura e retorno em diferentes celulares.
- [ ] Definir manutenção do cardápio: responsável, atualização de preço/ingredientes e processo para retirar prato indisponível.
- [ ] Revisar privacidade e segurança, especialmente se alergias, preferências ou pedidos forem armazenados/enviados.

## Acessibilidade e validação
- [ ] Testar teclado, foco e fluxos completos em desktop e celular.
- [ ] Testar VoiceOver no iOS e TalkBack no Android; avaliar leitor de tela de desktop conforme a plataforma escolhida.
- [ ] Verificar contraste, ampliação de texto, reflow, orientações e estados com ferramentas e inspeção manual.
- [ ] Validar reconhecimento e síntese de voz nos navegadores suportados; garantir alternativa sem voz.
- [ ] Concluir auditoria MobileDU diretriz por diretriz, confirmar manualmente os resultados e registrar evidências.
- [ ] Fazer avaliação heurística/usabilidade com tarefas e participantes, se exigida; guardar consentimento e resultados reais.
- [ ] Não relatar SUS ou entrevistas como concluídos sem coleta e análise correspondentes.

## Documentação e apresentação
- [ ] Atualizar a matriz de rastreabilidade para o escopo de QR code presencial e ligar requisitos a evidências reais.
- [ ] Completar referências bibliográficas e conferir citações no projeto escrito.
- [ ] Atualizar o PPT para mostrar o fluxo presencial QR code → cardápio → detalhes → pedido demonstrativo/real.
- [ ] Preparar capturas antes/depois, relatórios e prompts exigidos pelas atividades.
- [ ] Conferir consistência entre protótipo, código, relatório e apresentação.
- [ ] Fazer revisão final do pacote de entrega e submissão no Moodle.

## Compartilhamento
- [x] Repositório Git e remoto do grupo configurados.
- [x] Versão oficial e documentação atualizada publicadas em `main` (commit `de3a9c7`).
- [ ] Pedir a outro integrante para clonar, instalar e executar o frontend seguindo o README.
