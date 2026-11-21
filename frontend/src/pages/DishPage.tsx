import { useCallback, useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { Switch } from "../components/Switch";
import { CROSS_CONTACT_DETAIL, conflicts, formatPrice, joinList, listAllergens, type Dish } from "../data/menu";
import { dishSpeech } from "../lib/readAloud";
import { speak, stopSpeaking, ttsSupported, useSpeakingId } from "../lib/speech";
import { navigate, useAnnounce, useFilters, useOrder } from "../state/app";
import { ADD_CURRENT_EVENT, READ_CURRENT_EVENT, useVoice } from "../state/voice";

export function DishPage({ dish }: { dish: Dish }) {
  const { filters } = useFilters();
  const { add, count } = useOrder();
  const { announce } = useAnnounce();
  const { callStaff } = useVoice();
  const [removed, setRemoved] = useState<string[]>([]);
  const speakingId = useSpeakingId();
  const speechId = `dish-${dish.id}`;
  const reading = speakingId === speechId;
  const problems = conflicts(dish, filters);

  // Ao trocar de prato, os ajustes recomeçam.
  useEffect(() => setRemoved([]), [dish.id]);

  const summary = dish.customizations.filter((c) => removed.includes(c.id)).map((c) => c.summary);

  const addToOrder = useCallback(() => {
    add(dish.id, removed);
    announce(`${dish.name} adicionado ao pedido. Seu pedido tem ${count + 1} ${count + 1 === 1 ? "item" : "itens"}.`);
  }, [add, announce, count, dish.id, dish.name, removed]);

  const read = useCallback(() => speak(speechId, dishSpeech(dish)), [dish, speechId]);

  /* Comandos de voz "adicionar" e "ler ingredientes" chegam por eventos. */
  useEffect(() => {
    window.addEventListener(ADD_CURRENT_EVENT, addToOrder);
    window.addEventListener(READ_CURRENT_EVENT, read);
    return () => {
      window.removeEventListener(ADD_CURRENT_EVENT, addToOrder);
      window.removeEventListener(READ_CURRENT_EVENT, read);
    };
  }, [addToOrder, read]);

  useEffect(() => () => stopSpeaking(), [dish.id]);

  return (
    <div className="detail">
      <button type="button" className="btn btn--secondary btn--back" onClick={() => navigate("menu")}>
        <Icon name="back" size={18} />
        Voltar ao cardápio
      </button>

      <p className="eyebrow">{dish.category}</p>
      <div className="dish__head">
        <h1 id="page-title" tabIndex={-1} className="page-title">
          {dish.name}
        </h1>
        <p className="dish__price dish__price--lg">{formatPrice(dish.priceCents)}</p>
      </div>
      <p className="lead">{dish.description}</p>

      {problems.length ? (
        <div className="notice notice--danger notice--lg" role="alert">
          <Icon name="x" size={22} />
          <div>
            <p>
              <strong>Este prato não atende aos seus filtros.</strong>
            </p>
            <p>Motivo: {joinList(problems)}.</p>
          </div>
        </div>
      ) : null}

      {ttsSupported ? (
        <button type="button" className="btn btn--secondary btn--block-narrow" onClick={read}>
          <Icon name={reading ? "stop" : "speaker"} size={18} />
          {reading ? "Parar leitura" : "Ouvir descrição do prato"}
        </button>
      ) : null}

      <div className="detail__grid">
        <section className="panel" aria-labelledby="ing-title">
          <h2 id="ing-title" className="section-title">
            Ingredientes
          </h2>
          <ul className="ingredients">
            {dish.ingredients.map((i) => (
              <li key={i.name}>
                {i.name}
                {i.note ? <span className="muted"> ({i.note})</span> : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel stack" aria-labelledby="all-title">
          <h2 id="all-title" className="section-title">
            Informações de alérgenos
          </h2>
          <div className="notice notice--warn">
            <Icon name="alert" size={18} />
            <div>
              <p>
                <strong>{dish.contains.length ? `Contém ${listAllergens(dish.contains)}.` : "Sem os 6 alérgenos dos filtros na receita."}</strong>
              </p>
              <p>{dish.allergenDetail}</p>
            </div>
          </div>
          <div className="notice notice--warn">
            <Icon name="shield" size={18} />
            <div>
              <p>
                <strong>Risco de contato cruzado</strong>
              </p>
              <p>{CROSS_CONTACT_DETAIL}</p>
            </div>
          </div>
          <p className="notice notice--ok">
            <Icon name="check" size={18} />
            <span>
              {dish.freeFromText} Isso não elimina o risco de contato cruzado.
            </span>
          </p>
        </section>
      </div>

      <section className="panel stack" aria-labelledby="custom-title">
        <div>
          <h2 id="custom-title" className="section-title">
            Do seu jeito
          </h2>
          <p className="hint">Ajustes sem custo adicional</p>
        </div>
        <ul className="custom-list">
          {dish.customizations.map((c) => {
            const on = removed.includes(c.id);
            return (
              <li key={c.id} className="custom-item">
                <Switch
                  label={c.label}
                  stateText={on ? `✓ ${c.onText}` : c.offText}
                  checked={on}
                  onChange={(next) => setRemoved((cur) => (next ? [...cur, c.id] : cur.filter((x) => x !== c.id)))}
                />
              </li>
            );
          })}
        </ul>
        <p className="notice notice--warn">
          <Icon name="alert" size={18} />
          <span>{dish.customizationWarning}</span>
        </p>
      </section>

      <section className="panel choice" aria-labelledby="choice-title">
        <h2 id="choice-title" className="section-title">
          Sua escolha
        </h2>
        <p>
          1 porção{summary.length ? ` · ${summary.join(", ")}` : " · sem ajustes"}
        </p>
        <p className="choice__total">
          Total: <strong>{formatPrice(dish.priceCents)}</strong>
        </p>
        <div className="dish__actions">
          <button type="button" className="btn btn--primary" onClick={addToOrder}>
            <Icon name="plus" size={18} />
            Adicionar ao pedido
          </button>
          <button type="button" className="btn btn--secondary" onClick={callStaff}>
            <Icon name="chat" size={18} />
            Falar sobre minha alergia
          </button>
        </div>
      </section>
    </div>
  );
}
