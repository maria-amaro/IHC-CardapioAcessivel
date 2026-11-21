import { useEffect, useMemo, useRef } from "react";
import { CROSS_CONTACT_NOTICE, DISHES, FILTERS, RESTAURANT, joinList, normalize } from "../data/menu";
import { DishCard } from "../components/DishCard";
import { Icon } from "../components/Icon";
import { RestaurantHeader } from "../components/Shell";
import { menuSpeech } from "../lib/readAloud";
import { speak, stopSpeaking, ttsSupported, useSpeakingId } from "../lib/speech";
import { useVisibleDishes } from "../lib/visibleDishes";
import { useAnnounce, useFilters } from "../state/app";
import { useSettings } from "../state/settings";
import { useVoice } from "../state/voice";

export function MenuPage() {
  const { query, setQuery, filters, toggleFilter, clearFilters, showHidden, setShowHidden } = useFilters();
  const { shown, hidden, matching } = useVisibleDishes();
  const { announce } = useAnnounce();
  const { settings } = useSettings();
  const voice = useVoice();
  const speakingId = useSpeakingId();
  const reading = speakingId === "menu";

  /* Sugestões: pratos cujo nome ou ingredientes contêm o que foi digitado. */
  const suggestions = useMemo(() => {
    const q = normalize(query);
    if (q.length < 2) return [];
    return DISHES.filter((d) => normalize(d.name) !== q && normalize(`${d.name} ${d.ingredients.map((i) => i.name).join(" ")}`).includes(q)).slice(0, 3);
  }, [query]);

  /* Anuncia o resultado quando busca ou filtros mudam (com pausa, para não repetir a cada tecla). */
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      if (!settings.screenReader) return;
      const base =
        shown.length === 0
          ? "Nenhum prato encontrado."
          : `${shown.length} ${shown.length === 1 ? "prato encontrado" : "pratos encontrados"}.`;
      const extra = hidden.length && !showHidden ? ` ${hidden.length} ocultado${hidden.length > 1 ? "s" : ""} pelos seus filtros.` : "";
      announce(base + extra, { silentToast: true });
    }, 700);
    return () => window.clearTimeout(t);
  }, [query, filters, showHidden, shown.length, hidden.length, announce, settings.screenReader]);

  const activeLabels = FILTERS.filter((f) => filters.includes(f.id)).map((f) => f.label);

  return (
    <>
      <RestaurantHeader />

      <div className="page-title-row">
        <div>
          <h1 id="page-title" tabIndex={-1} className="page-title">
            Cardápio Acessível
          </h1>
          <p className="lead">Escolha com calma. Aqui, cada ingrediente é claro.</p>
        </div>
        <p className="status-pill">
          <Icon name="clock" size={16} />
          Pedidos abertos · {RESTAURANT.table}
        </p>
      </div>

      <div className="menu-layout">
        <aside className="menu-side" aria-label="Busca e preferências">
          <section className="panel" aria-labelledby="search-label">
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                announce(shown.length ? `${shown.length} pratos encontrados.` : "Nenhum prato encontrado.");
              }}
            >
              <label id="search-label" htmlFor="search-input" className="field-label">
                Buscar no cardápio
              </label>
              <div className="search-box">
                <Icon name="search" size={18} />
                <input
                  id="search-input"
                  type="search"
                  className="input"
                  placeholder="Nome ou ingrediente"
                  value={query}
                  autoComplete="off"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button type="button" className="btn btn--secondary btn--block" aria-pressed={voice.dictating} onClick={() => voice.dictate(setQuery)}>
                <Icon name="mic" size={18} />
                {voice.dictating ? "Ouvindo… toque para parar" : "Buscar por voz"}
              </button>
            </form>

            {suggestions.length ? (
              <div role="group" aria-labelledby="suggest-label" className="suggestions">
                <p id="suggest-label" className="hint">
                  Escolha uma sugestão para buscar
                </p>
                {suggestions.map((d) => (
                  <button key={d.id} type="button" className="btn btn--secondary btn--block btn--left" onClick={() => setQuery(d.name)}>
                    {d.name}
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <section className="panel">
            <fieldset className="fieldset">
              <legend className="panel__title">Suas preferências</legend>
              <p className="hint" id="prefs-hint">
                Selecione o que você precisa evitar.
              </p>
              <div className="chips" aria-describedby="prefs-hint">
                {FILTERS.map((f) => {
                  const on = filters.includes(f.id);
                  return (
                    <button key={f.id} type="button" className="chip" aria-pressed={on} onClick={() => toggleFilter(f.id)}>
                      {on ? <Icon name="check" size={16} /> : <Icon name="plus" size={16} />}
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <p className="hint">
              {activeLabels.length
                ? `${activeLabels.length} ${activeLabels.length === 1 ? "filtro selecionado" : "filtros selecionados"}: ${joinList(activeLabels)}.`
                : "Nenhum filtro selecionado."}
            </p>
            <p className="hint">Os filtros consideram a receita. Confira também o aviso de contato cruzado.</p>
            <div className="stack-sm only-wide">
              <button
                type="button"
                className="btn btn--secondary btn--block"
                onClick={() => {
                  clearFilters();
                  announce("Filtros e busca removidos.");
                }}
              >
                <Icon name="refresh" size={18} />
                Limpar filtros
              </button>
              {ttsSupported ? (
                <button type="button" className="btn btn--secondary btn--block" onClick={() => speak("menu", menuSpeech(shown, filters))}>
                  <Icon name={reading ? "stop" : "speaker"} size={18} />
                  {reading ? "Parar leitura" : "Ouvir opções do cardápio"}
                </button>
              ) : null}
            </div>
          </section>
        </aside>

        <section className="menu-main" aria-labelledby="dishes-title">
          <div className="notice notice--warn notice--lg">
            <Icon name="shield" size={22} />
            <div>
              <p>
                <strong>Sua segurança vem primeiro.</strong>
              </p>
              <p>{CROSS_CONTACT_NOTICE}</p>
            </div>
          </div>

          <div className="list-head">
            <h2 id="dishes-title" className="section-title">
              Pratos principais
            </h2>
            <p className="hint">
              {shown.length} {shown.length === 1 ? "prato" : "pratos"} · Preço por porção
            </p>
          </div>

          {shown.length === 0 ? (
            <div className="empty">
              <p>
                <strong>Nenhum prato encontrado.</strong>
              </p>
              <p>
                {matching.length
                  ? "Seus filtros ocultaram todos os pratos encontrados. Você pode ver os pratos ocultos ou limpar os filtros."
                  : "Tente buscar por outro nome ou ingrediente."}
              </p>
            </div>
          ) : (
            <ul className="dish-list">
              {shown.map((d) => (
                <li key={d.id}>
                  <DishCard dish={d} filters={filters} />
                </li>
              ))}
            </ul>
          )}

          {hidden.length ? (
            <div className="hidden-note">
              <p>
                <Icon name="info" size={18} />{" "}
                {showHidden
                  ? `Mostrando ${hidden.length} ${hidden.length === 1 ? "prato" : "pratos"} que não ${hidden.length === 1 ? "atende" : "atendem"} aos seus filtros.`
                  : `${hidden.length} ${hidden.length === 1 ? "prato foi ocultado" : "pratos foram ocultados"} pelos seus filtros.`}
              </p>
              <button type="button" className="btn btn--secondary" aria-pressed={showHidden} onClick={() => setShowHidden(!showHidden)}>
                {showHidden ? "Ocultar pratos que não atendem" : "Mostrar pratos ocultos"}
              </button>
            </div>
          ) : null}

          {ttsSupported ? (
            <button
              type="button"
              className="btn btn--secondary only-narrow"
              onClick={() => (reading ? stopSpeaking() : speak("menu", menuSpeech(shown, filters)))}
            >
              <Icon name={reading ? "stop" : "speaker"} size={18} />
              {reading ? "Parar leitura" : "Ouvir opções do cardápio"}
            </button>
          ) : null}
        </section>
      </div>
    </>
  );
}
