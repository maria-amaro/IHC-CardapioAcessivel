# Cardápio Acessível

Aplicação web responsiva para consulta presencial de cardápio em restaurante. A experiência prevista é a pessoa escanear um QR code na mesa e abrir o cardápio no navegador do celular, sem instalar aplicativo. A tela do QR code, a hospedagem pública e a associação real entre QR code e mesa ainda não estão implementadas.

O projeto da disciplina de Interação Humano-Computador (UFABC) prioriza informações de ingredientes e alérgenos e inclui recursos para pessoas com deficiência visual, daltonismo, baixa visão e pessoas idosas.

Telas: cardápio, detalhes do prato, ajustes de acessibilidade e pedido demonstrativo.

## Como rodar

```bash
npm install
npm run dev      # http://127.0.0.1:5173 (ou a próxima porta livre)
npm run build    # checa tipos e gera dist/
```

Requer Node 18+. Para reconhecimento de voz, use Chrome ou Edge.

## O que está implementado

| Área | Comportamento |
|---|---|
| Cardápio | Busca por nome/ingrediente, sugestões, filtros de preferência (sem glúten, lactose, amendoim, frutos do mar, soja, ovo, vegano, vegetariano). Pratos que conflitam com os filtros ficam ocultos, com aviso e botão para exibi-los marcados como "Não atende aos seus filtros". |
| Prato | Ingredientes, alérgenos presentes e onde aparecem, aviso de contato cruzado, ajustes ("Do seu jeito") e resumo com total. |
| Pedido | Adiciona, altera quantidade e remove. O envio é demonstrativo e não chega ao restaurante. |
| Atendimento | A ação produz apenas um aviso local neste navegador; não notifica funcionários. |
| Texto | 100%, 125%, 150% e 200%, com layout em rem que reflui sem rolagem horizontal. |
| Cores | Padrão, alto contraste escuro, alto contraste claro e monocromático. |
| Daltonismo | Filtros SVG para protanopia, deuteranopia e tritanopia (aproximações de daltonização). Todo alerta usa ícone e texto, nunca só cor. |
| Voz | "Navegar por voz" (comandos) e "Buscar por voz", via Web Speech API (pt-BR). Comandos: "buscar frango", "ler ingredientes", "ver pedido", "ajustes", "voltar", "aumentar texto", "alto contraste", "chamar atendimento", "limpar filtros", "adicionar bowl da horta". |
| Leitura | "Ouvir opções do cardápio" e "Ouvir descrição do prato" (síntese de fala do navegador). |
| Leitor de tela | O modo "Leitor de tela" adiciona descrições resumidas por prato e anúncios de resultado e de troca de página. A marcação semântica é a mesma com o modo desligado. |
| Teclado | Link "Pular para o conteúdo", foco sempre visível, foco movido ao título a cada troca de página, alvos de toque de pelo menos 44 px. |

## Privacidade e dados

- Ajustes de acessibilidade ficam em `localStorage` neste aparelho.
- Preferências alimentares e o pedido (dados de saúde potencialmente sensíveis) ficam só em memória e somem ao recarregar.
- O frontend não envia pedidos nem preferências para o backend e não tem rastreamento nesta aplicação.
- O reconhecimento de voz do Chrome/Edge pode enviar áudio ao serviço do navegador; informe isso antes de uso real.

## Estrutura

```
src/
  data/menu.ts            pratos, alérgenos, filtros e regras de conflito
  state/                  ajustes, busca/filtros, pedido, rotas, avisos e voz
  lib/                    fala (TTS/STT), textos lidos em voz alta, filtragem
  components/, pages/     interface
  styles.css              temas, alto contraste e responsividade
```

Para trocar o cardápio, edite `src/data/menu.ts`.

## Pendências e limites conhecidos

- Os dados dos pratos, restaurante e Mesa 08 são fictícios. Devem ser substituídos e validados com o estabelecimento.
- Gerar e instalar o QR code no restaurante, publicar o frontend em hospedagem acessível e testar a abertura em diferentes celulares.
- Implementar um canal real para a solicitação de atendimento; atualmente a confirmação é local.
- Definir como pedidos serão enviados à equipe. A ação atual é somente uma demonstração; a API em `../backend/` não está conectada.
- Os filtros de daltonismo são aproximações e não substituem teste com usuários reais.
- Não foram feitos testes com leitores de tela reais (NVDA, TalkBack, VoiceOver) nem com usuários, previstos no planejamento do documento. Isso deve ser feito antes de afirmar conformidade com WCAG 2.2 AA.

Consulte `../docs/CHECKLIST_ENTREGA.md` para o plano de conclusão.
