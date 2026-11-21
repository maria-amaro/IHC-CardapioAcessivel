import { conflicts, formatPrice, joinList, listAllergens, type Dish, type FilterId } from "../data/menu";
import { navigate, useAnnounce, useOrder } from "../state/app";
import { useSettings } from "../state/settings";
import { dishAriaSummary } from "../lib/readAloud";
import { Icon } from "./Icon";

export function DishCard({ dish, filters }: { dish: Dish; filters: FilterId[] }) {
  const { add, count } = useOrder();
  const { announce } = useAnnounce();
  const { settings } = useSettings();
  const problems = conflicts(dish, filters);
  const titleId = `dish-title-${dish.id}`;
  const summaryId = `dish-summary-${dish.id}`;

  return (
    <article className={`dish${problems.length ? " dish--conflict" : ""}`} aria-labelledby={titleId} aria-describedby={settings.screenReader ? summaryId : undefined}>
      {settings.screenReader ? (
        <p id={summaryId} className="sr-only">
          {dishAriaSummary(dish, filters)}
        </p>
      ) : null}

      <div className="dish__head">
        <h3 id={titleId} className="dish__name">
          {dish.name}
        </h3>
        <p className="dish__price">{formatPrice(dish.priceCents)}</p>
      </div>
      <p className="dish__desc">{dish.summary}</p>

      {problems.length ? (
        <p className="notice notice--danger">
          <Icon name="x" size={18} />
          <span>
            <strong>Não atende aos seus filtros:</strong> {joinList(problems)}.
          </span>
        </p>
      ) : null}

      <p className="notice notice--ok">
        <Icon name="check" size={18} />
        <span>{dish.freeFromText}</span>
      </p>

      <div className="notice notice--warn">
        <Icon name="alert" size={18} />
        <div>
          <p>
            <strong>
              {dish.contains.length ? `Contém ${listAllergens(dish.contains)}.` : "Sem os 6 alérgenos dos filtros na receita."}
            </strong>
          </p>
          <p>Pode haver contato cruzado na cozinha.</p>
        </div>
      </div>

      <div className="dish__actions">
        <button type="button" className="btn btn--secondary" onClick={() => navigate({ dish: dish.id })}>
          Ver detalhes do prato<span className="sr-only"> {dish.name}</span>
        </button>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            add(dish.id, []);
            announce(`${dish.name} adicionado ao pedido. Seu pedido tem ${count + 1} ${count + 1 === 1 ? "item" : "itens"}.`);
          }}
        >
          <Icon name="plus" size={18} />
          Adicionar ao pedido<span className="sr-only"> {dish.name}</span>
        </button>
      </div>
    </article>
  );
}
