import { Icon } from "../components/Icon";
import { RESTAURANT, formatPrice, getDish } from "../data/menu";
import { navigate, useAnnounce, useOrder } from "../state/app";
import { useVoice } from "../state/voice";

export function OrderPage() {
  const { lines, count, totalCents, setQty, remove, clear } = useOrder();
  const { announce } = useAnnounce();
  const { callStaff } = useVoice();

  return (
    <div className="detail">
      <button type="button" className="btn btn--secondary btn--back" onClick={() => navigate("menu")}>
        <Icon name="back" size={18} />
        Voltar ao cardápio
      </button>

      <h1 id="page-title" tabIndex={-1} className="page-title">
        Meu pedido
      </h1>
      <p className="lead">
        {RESTAURANT.table} · {count} {count === 1 ? "item" : "itens"}
      </p>

      {lines.length === 0 ? (
        <div className="empty">
          <p>
            <strong>Seu pedido está vazio.</strong>
          </p>
          <p>Escolha um prato no cardápio e use “Adicionar ao pedido”.</p>
        </div>
      ) : (
        <>
          <ul className="order-list">
            {lines.map((line) => {
              const dish = getDish(line.dishId);
              if (!dish) return null;
              const notes = dish.customizations.filter((c) => line.customizations.includes(c.id)).map((c) => c.summary);
              const titleId = `line-${line.key}`;
              return (
                <li key={line.key} className="panel order-line">
                  <div>
                    <h2 id={titleId} className="dish__name">
                      {dish.name}
                    </h2>
                    <p className="hint">{notes.length ? notes.join(", ") : "Sem ajustes"}</p>
                    <p>{formatPrice(dish.priceCents * line.qty)}</p>
                  </div>
                  <div className="order-line__controls">
                    <div className="font-control" role="group" aria-labelledby={titleId}>
                      <button
                        type="button"
                        className="btn btn--icon"
                        aria-label={`Diminuir quantidade de ${dish.name}`}
                        onClick={() => {
                          setQty(line.key, line.qty - 1);
                          announce(line.qty - 1 <= 0 ? `${dish.name} removido do pedido.` : `${dish.name}: ${line.qty - 1}.`, { silentToast: true });
                        }}
                      >
                        <Icon name="minus" size={18} />
                      </button>
                      <output className="font-control__value">
                        <span className="sr-only">Quantidade: </span>
                        {line.qty}
                      </output>
                      <button
                        type="button"
                        className="btn btn--icon"
                        aria-label={`Aumentar quantidade de ${dish.name}`}
                        onClick={() => {
                          setQty(line.key, line.qty + 1);
                          announce(`${dish.name}: ${line.qty + 1}.`, { silentToast: true });
                        }}
                      >
                        <Icon name="plus" size={18} />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => {
                        remove(line.key);
                        announce(`${dish.name} removido do pedido.`);
                      }}
                    >
                      <Icon name="trash" size={18} />
                      Remover<span className="sr-only"> {dish.name}</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <section className="panel choice" aria-labelledby="sum-title">
            <h2 id="sum-title" className="section-title">
              Resumo
            </h2>
            <p className="choice__total">
              Total: <strong>{formatPrice(totalCents)}</strong>
            </p>
            <p className="notice notice--warn">
              <Icon name="alert" size={18} />
              <span>Se você tem alergia alimentar, avise a equipe antes de enviar o pedido. Pode haver contato cruzado na cozinha.</span>
            </p>
            <div className="dish__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  clear();
                  navigate("menu");
                  announce("Pedido enviado à equipe. Esta é uma demonstração: nenhum dado foi enviado.");
                }}
              >
                <Icon name="check" size={18} />
                Enviar pedido à equipe
              </button>
              <button type="button" className="btn btn--secondary" onClick={callStaff}>
                <Icon name="chat" size={18} />
                Falar sobre minha alergia
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
