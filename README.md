
# Cardápio Acessível

Cardápio digital para uso presencial em restaurantes. A proposta é que a pessoa escaneie um QR code na mesa, abra o cardápio web no próprio celular e consulte pratos, ingredientes e alérgenos com recursos de acessibilidade.

## Aplicação

O frontend oficial está em [`frontend/`](frontend/README.md). Ele contém o protótipo web responsivo, com páginas de cardápio, detalhes do prato, ajustes de acessibilidade e pedido demonstrativo.

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

Para validar a compilação:

```bash
cd frontend
npm run build
```

## Estado da integração

- O frontend usa dados fictícios da Casa do Ipê e da Mesa 08.
- O QR code e a hospedagem pública do cardápio ainda precisam ser configurados para o restaurante.
- O pedido funciona como demonstração local; não é enviado à equipe.
- O botão “Chamar atendimento” só anuncia uma confirmação neste navegador; não notifica funcionários.
- O backend em `backend/` é uma API inicial separada e ainda não está integrado ao frontend.
- Consulte [`docs/CHECKLIST_ENTREGA.md`](docs/CHECKLIST_ENTREGA.md) para as pendências e critérios de conclusão.

## Backend opcional

O frontend oficial não consome a API neste momento. Para iniciar a API de demonstração em outro terminal:

```bash
cd backend
npm ci
npm run dev
```

Ela disponibiliza `GET /api/health` e `GET /api/pratos` na porta 3000.

