import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors());
app.use(express.json());

const dishes = [
  {
    id: '1',
    nome: 'Frango com amendoim',
    preco: 38,
    alergenos: ['amendoim', 'soja'],
  },
  {
    id: '2',
    nome: 'Bowl da horta',
    preco: 32,
    alergenos: [],
  },
  {
    id: '3',
    nome: 'Risoto de camarão',
    preco: 52,
    alergenos: ['frutos do mar', 'lactose'],
  },
];

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'cardapio-acessivel-backend' });
});

app.get('/api/pratos', (_request, response) => {
  response.json(dishes);
});

app.listen(port, () => {
  console.log(`API ativa na porta ${port}`);
});