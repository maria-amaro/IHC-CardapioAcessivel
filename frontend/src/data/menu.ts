export type Dish = {
	id: string;
	nome: string;
	preco: number;
	imagem: string;
	resumo: string;
	descricao: string;
	ingredientes: string[];
	alergenos: string[];
	tags: string[];
};

export const alergenosDisponiveis = [
	'gluten',
	'lactose',
	'amendoim',
	'frutos do mar',
	'soja',
	'ovo',
] as const;

export type Alergeno = (typeof alergenosDisponiveis)[number];

export const dishes: Dish[] = [
	{
		id: '1',
		nome: 'Frango com amendoim',
		preco: 38,
		imagem:
			'https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&w=900&q=80',
		resumo: 'Frango grelhado com arroz e legumes frescos.',
		descricao: 'Frango grelhado, arroz, brócolis e molho de soja com amendoim.',
		ingredientes: ['frango', 'arroz', 'brócolis', 'molho de soja', 'amendoim'],
		alergenos: ['amendoim', 'soja'],
		tags: ['sem glúten', 'sem lactose'],
	},
	{
		id: '2',
		nome: 'Bowl da horta',
		preco: 32,
		imagem:
			'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
		resumo: 'Bowl vegetariano com legumes e molho cítrico.',
		descricao: 'Arroz integral, grão-de-bico, abóbora, brócolis e molho de limão.',
		ingredientes: ['arroz integral', 'grão-de-bico', 'abóbora', 'brócolis', 'limão'],
		alergenos: [],
		tags: ['vegano', 'vegetariano'],
	},
	{
		id: '3',
		nome: 'Risoto de camarão',
		preco: 52,
		imagem:
			'https://images.pexels.com/photos/37045069/pexels-photo-37045069.jpeg',
		resumo: 'Risoto cremoso com camarão e toque de parmesão.',
		descricao: 'Arroz arbóreo, camarão, leite, manteiga, parmesão e salsinha.',
		ingredientes: ['arroz arbóreo', 'camarão', 'leite', 'manteiga', 'parmesão', 'salsinha'],
		alergenos: ['frutos do mar', 'lactose'],
		tags: ['sem glúten'],
	},
];


