import { RESTAURANT } from "../data/menu";
import { navigate, useAnnounce, useOrder } from "../state/app";
import { useVoice } from "../state/voice";
import { Icon } from "./Icon";

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <Icon name="leaf" size={24} />
    </span>
  );
}

export function OrderButton({ className = "" }: { className?: string }) {
  const { count } = useOrder();
  return (
    <a
      className={`btn btn--secondary ${className}`}
      href="#/pedido"
      onClick={(e) => {
        e.preventDefault();
        navigate("order");
      }}
    >
      <Icon name="bag" size={18} />
      Meu pedido · {count} {count === 1 ? "item" : "itens"}
    </a>
  );
}

export function CallStaffButton({ className = "", label = "Chamar atendimento" }: { className?: string; label?: string }) {
  const { callStaff } = useVoice();
  return (
    <button type="button" className={`btn btn--secondary ${className}`} onClick={callStaff}>
      <Icon name="chat" size={18} />
      {label}
    </button>
  );
}

export function RestaurantHeader() {
  return (
    <header className="restaurant">
      <BrandMark />
      <div className="restaurant__text">
        <p className="restaurant__name">{RESTAURANT.name}</p>
        <p className="restaurant__tagline">{RESTAURANT.tagline}</p>
      </div>
      <div className="restaurant__actions only-wide">
        <CallStaffButton />
        <OrderButton />
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <section className="care" aria-labelledby="care-title">
        <h2 id="care-title" className="care__title">
          Podemos ajudar?
        </h2>
        <p>
          Sua escolha merece cuidado. Para restrições alimentares, confirme ingredientes e condições de preparo com
          nossa equipe. Estamos aqui para ajudar.
        </p>
        <CallStaffButton label="Falar com a equipe" />
      </section>
      <div className="footer__brand">
        <p>
          {RESTAURANT.name} · Cardápio Acessível
        </p>
        <p>Boa comida. Mais autonomia.</p>
      </div>
    </footer>
  );
}

/** Aviso visível + barra de pedido (fixos no fim da página, sem cobrir o conteúdo). */
export function Dock() {
  const { toast, dismissToast } = useAnnounce();
  return (
    <div className="dock">
      {toast ? (
        <div className="toast">
          <p>{toast}</p>
          <button type="button" className="btn btn--icon toast__close" onClick={dismissToast} aria-label="Fechar aviso">
            <Icon name="x" size={18} />
          </button>
        </div>
      ) : null}
      <div className="dock__order only-narrow">
        <OrderButton className="btn--block" />
      </div>
    </div>
  );
}

export function LiveRegion() {
  const { message } = useAnnounce();
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}

/**
 * Filtros SVG de adaptação para daltonismo (matrizes de daltonização aproximadas).
 * A informação nunca depende só de cor: todo alerta tem ícone e texto.
 */
export function ColorBlindFilters() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <defs>
        <filter id="cb-protanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  -0.2549 1.2549 0 0 0  0.3031 -0.5451 1.242 0 0  0 0 0 1 0" />
        </filter>
        <filter id="cb-deuteranopia" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.885 0.115 0 0 0  0 1 0 0 0  -0.49 0.19 1.3 0 0  0 0 0 1 0" />
        </filter>
        <filter id="cb-tritanopia" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1.05 -0.3825 0.3325 0 0  0 1.2345 -0.2345 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </defs>
    </svg>
  );
}
