import { useEffect, useMemo, useState } from 'react';
import { alergenosDisponiveis, dishes, type Alergeno } from './data/menu';

type ContrastMode = 'padrao' | 'alto-claro' | 'alto-escuro';
type CartState = Record<string, number>;

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '';
const WHATSAPP_DEFAULT_MESSAGE =
	'Olá! Preciso de ajuda com o Cardápio Acessível e tenho uma dúvida sobre alergênicos.';
const A11Y_SETUP_STORAGE_KEY = 'a11y-setup-done';

const normalizeText = (value: string) =>
	value
		.toLocaleLowerCase('pt-BR')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');

function App() {
	const [query, setQuery] = useState('');
	const [fontScale, setFontScale] = useState(100);
	const [contrast, setContrast] = useState<ContrastMode>('padrao');
	const [selectedAlergenos, setSelectedAlergenos] = useState<Alergeno[]>([]);
	const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
	const [cart, setCart] = useState<CartState>({});
	const [leitorTelaAtivo, setLeitorTelaAtivo] = useState(true);
	const [announce, setAnnounce] = useState('');
	const [removerAmendoim, setRemoverAmendoim] = useState(true);
	const [removerBrocolis, setRemoverBrocolis] = useState(false);
	const [pedidoExpandido, setPedidoExpandido] = useState(false);
	const [showA11ySetup, setShowA11ySetup] = useState(false);

	useEffect(() => {
		const setupDone = window.localStorage.getItem(A11Y_SETUP_STORAGE_KEY);
		if (!setupDone) {
			setShowA11ySetup(true);
		}
	}, []);

	const filtered = useMemo(() => {
		const normalized = normalizeText(query).trim();
		return dishes.filter((dish) => {
			const matchesText =
				normalized.length === 0 ||
				normalizeText(dish.nome).includes(normalized) ||
				normalizeText(dish.descricao).includes(normalized) ||
				dish.ingredientes.some((i) => normalizeText(i).includes(normalized)) ||
				dish.alergenos.some((a) => normalizeText(a).includes(normalized));

			const isSafe = selectedAlergenos.every((a) => !dish.alergenos.includes(a));
			return matchesText && isSafe;
		});
	}, [query, selectedAlergenos]);

	const pratoSelecionado = useMemo(
		() => (selectedDishId ? dishes.find((dish) => dish.id === selectedDishId) ?? null : null),
		[selectedDishId],
	);

	const totalItens = useMemo(() => Object.values(cart).reduce((acc, q) => acc + q, 0), [cart]);

	const totalPedido = useMemo(
		() =>
			Object.entries(cart).reduce((acc, [id, qty]) => {
				const dish = dishes.find((item) => item.id === id);
				return acc + (dish ? dish.preco * qty : 0);
			}, 0),
		[cart],
	);

	const itensPedido = useMemo(
		() =>
			Object.entries(cart)
				.map(([id, qty]) => {
					const dish = dishes.find((item) => item.id === id);
					if (!dish) {
						return null;
					}
					return {
						dish,
						qty,
						subtotal: dish.preco * qty,
					};
				})
				.filter(
					(item): item is { dish: (typeof dishes)[number]; qty: number; subtotal: number } =>
						item !== null,
				),
		[cart],
	);

	const classes = ['app-root', `contrast-${contrast}`].join(' ');

	const toggleAlergeno = (a: Alergeno) => {
		setSelectedAlergenos((prev) =>
			prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
		);
	};

	const falar = (texto: string) => {
		if (!leitorTelaAtivo) {
			return;
		}

		if (!('speechSynthesis' in window)) {
			setAnnounce('Leitor de tela por voz não disponível neste navegador.');
			return;
		}

		window.speechSynthesis.cancel();
		const utterance = new SpeechSynthesisUtterance(texto);
		utterance.lang = 'pt-BR';
		utterance.rate = 1;
		window.speechSynthesis.speak(utterance);
	};

	const ouvirOpcoes = () => {
		const texto =
			filtered.length === 0
				? 'Nenhum prato encontrado com os filtros atuais.'
				: `Pratos disponíveis: ${filtered
						.map((dish) => `${dish.nome}, R$ ${dish.preco.toFixed(2).replace('.', ',')}`)
						.join('. ')}.`;
		falar(texto);
	};

	const adicionarAoPedido = (dishId: string, quantidade = 1) => {
		const dish = dishes.find((item) => item.id === dishId);
		if (!dish) {
			return;
		}

		setCart((prev) => ({
			...prev,
			[dishId]: (prev[dishId] ?? 0) + quantidade,
		}));

		const mensagem = `${dish.nome} adicionado ao pedido.`;
		setAnnounce(mensagem);
		falar(mensagem);
	};

	const atualizarQuantidade = (dishId: string, delta: number) => {
		setCart((prev) => {
			const atual = prev[dishId] ?? 0;
			const proximo = atual + delta;

			if (proximo <= 0) {
				const { [dishId]: _removido, ...restante } = prev;
				return restante;
			}

			return {
				...prev,
				[dishId]: proximo,
			};
		});
	};

	const abrirWhatsappAjuda = () => {
		const mensagem = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
		const numeroLimpo = WHATSAPP_NUMBER.replace(/\D/g, '');
		const url = numeroLimpo
			? `https://api.whatsapp.com/send?phone=${numeroLimpo}&text=${mensagem}`
			: `https://api.whatsapp.com/send?text=${mensagem}`;

		setAnnounce(
			numeroLimpo
				? 'Abrindo atendimento no WhatsApp.'
				: 'Abrindo WhatsApp. Selecione o contato de atendimento.',
		);

		window.location.href = url;
	};

	const finalizarSetupAcessibilidade = () => {
		window.localStorage.setItem(A11Y_SETUP_STORAGE_KEY, 'true');
		setShowA11ySetup(false);
		setAnnounce('Configurações de acessibilidade aplicadas. Você pode ajustar depois na barra superior.');
	};

	const abrirSetupAcessibilidade = () => {
		setShowA11ySetup(true);
	};

	return (
		<div className={classes} style={{ fontSize: `${fontScale}%` }}>
			<header className="topbar" aria-label="Cabeçalho do cardápio">
				<div className="topbar-brand">
					<p className="label">Casa do Ipê</p>
					<h1>Cardápio Acessível</h1>
					<p className="subtitle">Visual simples, leitura fácil e decisão segura.</p>
				</div>
				<div className="topbar-actions">
					<button type="button" onClick={abrirWhatsappAjuda}>Ajuda</button>
					<button type="button" onClick={() => setPedidoExpandido(true)}>
						Meu pedido: {totalItens} item(ns)
					</button>
				</div>
			</header>

			{showA11ySetup ? (
				<div className="a11y-setup-overlay" role="presentation">
					<section className="a11y-setup-modal" role="dialog" aria-modal="true" aria-labelledby="a11y-setup-title">
						<h2 id="a11y-setup-title">Configuração inicial de acessibilidade</h2>
						<p>Escolha como você prefere visualizar e navegar. Você pode mudar isso a qualquer momento depois.</p>

						<div className="a11y-setup-row">
							<label htmlFor="a11y-font">Tamanho da fonte</label>
							<select
								id="a11y-font"
								value={fontScale}
								onChange={(e) => setFontScale(Number(e.target.value))}
							>
								<option value={100}>Padrão (100%)</option>
								<option value={110}>Médio (110%)</option>
								<option value={120}>Grande (120%)</option>
								<option value={140}>Muito grande (140%)</option>
							</select>
						</div>

						<div className="a11y-setup-row">
							<label htmlFor="a11y-contrast">Contraste</label>
							<select
								id="a11y-contrast"
								value={contrast}
								onChange={(e) => setContrast(e.target.value as ContrastMode)}
							>
								<option value="padrao">Padrão</option>
								<option value="alto-claro">Alto contraste claro</option>
								<option value="alto-escuro">Alto contraste escuro</option>
							</select>
						</div>

						<div className="a11y-setup-row a11y-setup-toggle">
							<span>Leitor de tela por voz</span>
							<button
								type="button"
								className={leitorTelaAtivo ? 'toggle active' : 'toggle'}
								onClick={() => setLeitorTelaAtivo((prev) => !prev)}
								aria-pressed={leitorTelaAtivo}
							>
								{leitorTelaAtivo ? 'Ligado' : 'Desligado'}
							</button>
						</div>

						<div className="a11y-setup-actions">
							<button type="button" onClick={finalizarSetupAcessibilidade} className="primary">
								Salvar e continuar
							</button>
						</div>
					</section>
				</div>
			) : null}

			<section className="accessibility-toolbar" aria-label="Barra de acessibilidade">
				<div className="toolbar-group">
					<span className="toolbar-title">Acessibilidade</span>
					<button onClick={() => setFontScale((v) => Math.max(90, v - 10))} aria-label="Diminuir fonte">
						A-
					</button>
					<strong>{fontScale}%</strong>
					<button onClick={() => setFontScale((v) => Math.min(200, v + 10))} aria-label="Aumentar fonte">
						A+
					</button>
				</div>
				<div className="toolbar-group">
					<span>Contraste</span>
					<button onClick={() => setContrast('padrao')}>Padrão</button>
					<button onClick={() => setContrast('alto-claro')}>Claro</button>
					<button onClick={() => setContrast('alto-escuro')}>Escuro</button>
				</div>
				<div className="toolbar-group">
					<button onClick={() => falar('Navegação por voz ativa. Use os botões para ouvir as opções do cardápio.')}>Navegar por voz</button>
					<button
						onClick={() => {
							setLeitorTelaAtivo((prev) => {
								const novoEstado = !prev;
								setAnnounce(`Leitor de tela ${novoEstado ? 'ligado' : 'desligado'}.`);
								return novoEstado;
							});
						}}
					>
						Leitor de tela: {leitorTelaAtivo ? 'ligado' : 'desligado'}
					</button>
					<button onClick={abrirSetupAcessibilidade}>Configuração inicial</button>
					<button
						onClick={() => {
							setSelectedAlergenos([]);
							setQuery('');
						}}
					>
						Limpar filtros
					</button>
				</div>
			</section>

			<main id="main-content" className="layout">
				<aside className="panel" aria-labelledby="filtros-title">
					<h2 id="filtros-title">Filtros</h2>

					<section className="group" aria-labelledby="busca-title">
						<h3 id="busca-title">Buscar no cardápio</h3>
						<label htmlFor="search">Buscar por nome ou ingrediente</label>
						<input
							id="search"
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Ex: frango, sem lactose"
						/>
						<button className="full-button" onClick={ouvirOpcoes}>
							Ouvir opções
						</button>
					</section>

					<section className="group" aria-labelledby="restricoes-title">
						<h3 id="restricoes-title">Evitar alérgenos</h3>
						<ul className="chips" aria-label="Lista de alérgenos filtráveis">
							{alergenosDisponiveis.map((a) => {
								const active = selectedAlergenos.includes(a);
								return (
									<li key={a}>
										<button
											className={active ? 'chip active' : 'chip'}
											onClick={() => toggleAlergeno(a)}
											aria-pressed={active}
										>
											{active ? 'Remover' : 'Evitar'} {a}
										</button>
									</li>
								);
							})}
						</ul>

						<p className="panel-note">Nenhum filtro selecionado? Você verá o cardápio completo.</p>

						<button
							className="full-button"
							onClick={() => {
								setSelectedAlergenos([]);
								setQuery('');
							}}
						>
							Limpar todos os filtros
						</button>
					</section>
				</aside>

				<section className="main-stack" aria-label="Lista de pratos e detalhes">
					{pedidoExpandido ? (
						<section className="panel details-view" aria-label="Visão completa do pedido">
							<button className="back-button" onClick={() => setPedidoExpandido(false)}>
								Voltar ao cardápio
							</button>

							<h2>Resumo completo do pedido</h2>
							<p>{totalItens} item(ns) selecionado(s)</p>

							{itensPedido.length === 0 ? (
								<p className="warning">Seu pedido ainda está vazio. Escolha um prato para começar.</p>
							) : (
								<ul className="order-full-list">
									{itensPedido.map(({ dish, qty, subtotal }) => (
										<li key={dish.id} className="order-full-item">
											<img className="order-thumb" src={dish.imagem} alt={`Miniatura do prato ${dish.nome}`} loading="lazy" />
											<div>
												<h3>{dish.nome}</h3>
												<p>R$ {dish.preco.toFixed(2).replace('.', ',')} cada</p>
												<p>Subtotal: R$ {subtotal.toFixed(2).replace('.', ',')}</p>
											</div>
											<div className="qty-controls" aria-label={`Quantidade de ${dish.nome}`}>
												<button onClick={() => atualizarQuantidade(dish.id, -1)} aria-label={`Diminuir quantidade de ${dish.nome}`}>
													-
												</button>
												<strong>{qty}</strong>
												<button onClick={() => atualizarQuantidade(dish.id, 1)} aria-label={`Aumentar quantidade de ${dish.nome}`}>
													+
												</button>
											</div>
										</li>
									))}
								</ul>
							)}

							<p className="details-price">Total do pedido: R$ {totalPedido.toFixed(2).replace('.', ',')}</p>
							<button className="primary full-button" disabled={totalItens === 0}>
								Finalizar pedido
							</button>
						</section>
					) : pratoSelecionado ? (
						<section className="panel details-panel details-view" aria-label="Detalhes do prato">
							<button className="back-button" onClick={() => setSelectedDishId(null)}>
								Voltar ao cardápio
							</button>

							<img
								className="details-image"
								src={pratoSelecionado.imagem}
								alt={`Foto do prato ${pratoSelecionado.nome}`}
								loading="eager"
							/>

							<h2>{pratoSelecionado.nome}</h2>
							<p className="details-price">R$ {pratoSelecionado.preco.toFixed(2).replace('.', ',')}</p>
							<p>{pratoSelecionado.descricao}</p>

							<button className="full-button" onClick={() => falar(`${pratoSelecionado.nome}. ${pratoSelecionado.descricao}`)}>
								Ouvir descrição do prato
							</button>

							<h3>Ingredientes</h3>
							<ul className="ingredients-list">
								{pratoSelecionado.ingredientes.map((ingrediente) => (
									<li key={ingrediente}>{ingrediente}</li>
								))}
							</ul>

							<h3>Informações de alérgenos</h3>
							<p className="alert">Contém {pratoSelecionado.alergenos.join(' e ') || 'nenhum alergeno principal'}.</p>
							<p className="alert">Risco de contato cruzado: não garantimos ausência total desses alérgenos.</p>

							<h3>Do seu jeito</h3>
							<div className="switch-line">
								<span>Remover amendoim</span>
								<button
									className={removerAmendoim ? 'toggle active' : 'toggle'}
									onClick={() => setRemoverAmendoim((prev) => !prev)}
									aria-pressed={removerAmendoim}
								>
									{removerAmendoim ? 'Sim' : 'Não'}
								</button>
							</div>
							<div className="switch-line">
								<span>Remover brócolis</span>
								<button
									className={removerBrocolis ? 'toggle active' : 'toggle'}
									onClick={() => setRemoverBrocolis((prev) => !prev)}
									aria-pressed={removerBrocolis}
								>
									{removerBrocolis ? 'Sim' : 'Não'}
								</button>
							</div>

							<p className="warning">Remover não torna o prato seguro para alérgicos. Fale com a equipe antes de pedir.</p>

							<h3>Sua escolha</h3>
							<p>
								1 porção de {pratoSelecionado.nome.toLowerCase()}
								{removerAmendoim ? ' sem amendoim' : ''}
								{removerBrocolis ? ' e sem brócolis' : ''}
							</p>
							<p className="details-price">Total: R$ {pratoSelecionado.preco.toFixed(2).replace('.', ',')}</p>

							<div className="dish-actions">
								<button className="primary" onClick={() => adicionarAoPedido(pratoSelecionado.id)}>
									+ Adicionar ao pedido
								</button>
								<button onClick={() => falar('Olá, tenho alergia alimentar e preciso confirmar os ingredientes antes de finalizar o pedido.')}>Falar sobre minha alergia</button>
							</div>
						</section>
					) : (
						<section className="panel list-panel" aria-label="Lista de pratos">
							<h2 className="panel-title-center">Pratos principais</h2>
							<div className="result-summary result-summary-center" role="status" aria-live="polite">
								{filtered.length} prato(s) disponível(is)
							</div>

							<p className="warning" role="note">
								Sua segurança vem primeiro: nossa cozinha compartilha utensílios e superfícies. Em caso de alergia alimentar, converse com a equipe antes de pedir.
							</p>

							<ul className="dish-list list-centered">
								{filtered.map((dish) => (
									<li key={dish.id} className="dish-card">
										<img
											className="dish-image"
											src={dish.imagem}
											alt={`Foto do prato ${dish.nome}`}
											loading="lazy"
										/>

										<div className="dish-head">
											<h2>{dish.nome}</h2>
											<strong>R$ {dish.preco.toFixed(2).replace('.', ',')}</strong>
										</div>
										<p className="dish-summary">{dish.resumo}</p>

										<div className="tags" aria-label="Etiquetas do prato">
											{dish.tags.map((tag) => (
												<span key={tag} className="tag">
													{tag}
												</span>
											))}
										</div>

										{dish.alergenos.length > 0 ? (
											<p className="alert" role="alert">
												Contém {dish.alergenos.join(' e ')}. Pode haver contato cruzado na cozinha.
											</p>
										) : (
											<p className="safe">Sem os alérgenos dos filtros na receita. Pode haver contato cruzado na cozinha.</p>
										)}

										<div className="dish-actions">
											<button
												onClick={() => {
													setPedidoExpandido(false);
													setSelectedDishId(dish.id);
												}}
											>
												Ver detalhes do prato
											</button>
											<button className="primary" onClick={() => adicionarAoPedido(dish.id)}>
												+ Adicionar ao pedido
											</button>
										</div>
									</li>
								))}
							</ul>
						</section>
					)}
				</section>

				<aside className="panel order-sidebar" aria-label="Menu lateral do pedido">
					<h2>Meu pedido</h2>
					<p>{totalItens} item(ns)</p>

					<ul className="order-mini-list">
						{itensPedido.map(({ dish, qty }) => (
							<li key={dish.id}>
								<span>{dish.nome}</span>
								<strong>{qty}x</strong>
							</li>
						))}
					</ul>

					<p className="details-price">Total: R$ {totalPedido.toFixed(2).replace('.', ',')}</p>
					<button className="full-button" onClick={() => setPedidoExpandido(true)}>
						Avançar
					</button>
					<button className="primary full-button" disabled={totalItens === 0}>
						Finalizar pedido
					</button>

					<p className="panel-note">Use “Avançar” para abrir a visão completa e ajustar quantidades.</p>
				</aside>
			</main>

			<footer className="footer-note">
				<p>Sua escolha merece cuidado. Para restrições alimentares, confirme ingredientes e condições de preparo com nossa equipe.</p>
			</footer>

			<p className="sr-only" role="status" aria-live="polite">
				{announce}
			</p>
		</div>
	);
}

export default App;


