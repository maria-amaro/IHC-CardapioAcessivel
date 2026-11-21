import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getDish, type FilterId } from "../data/menu";

/* ------------------------------------------------------------------ */
/* Avisos (região ao vivo + aviso visível)                             */
/* ------------------------------------------------------------------ */

interface AnnounceApi {
  /** Anuncia uma mensagem para leitores de tela e mostra um aviso visível. */
  announce: (message: string, opts?: { silentToast?: boolean }) => void;
  message: string;
  toast: string;
  dismissToast: () => void;
}

const AnnounceCtx = createContext<AnnounceApi | null>(null);

export function AnnounceProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");
  const timer = useRef<number | undefined>(undefined);
  const flip = useRef(false);

  const announce = useCallback((text: string, opts?: { silentToast?: boolean }) => {
    // Alterna um caractere invisível para que mensagens idênticas sejam relidas.
    flip.current = !flip.current;
    setMessage(flip.current ? text : `${text}\u200b`);
    window.clearTimeout(timer.current);
    if (opts?.silentToast) return;
    setToast(text);
    timer.current = window.setTimeout(() => setToast(""), 8000);
  }, []);

  const dismissToast = useCallback(() => {
    window.clearTimeout(timer.current);
    setToast("");
  }, []);

  const value = useMemo(() => ({ announce, message, toast, dismissToast }), [announce, message, toast, dismissToast]);
  return <AnnounceCtx.Provider value={value}>{children}</AnnounceCtx.Provider>;
}

export function useAnnounce(): AnnounceApi {
  const ctx = useContext(AnnounceCtx);
  if (!ctx) throw new Error("useAnnounce fora do AnnounceProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Busca e preferências alimentares                                    */
/* Dados de saúde são sensíveis (LGPD): ficam só em memória, nunca     */
/* são gravados no navegador nem enviados.                             */
/* ------------------------------------------------------------------ */

interface FilterApi {
  query: string;
  setQuery: (q: string) => void;
  filters: FilterId[];
  toggleFilter: (id: FilterId) => void;
  clearFilters: () => void;
  showHidden: boolean;
  setShowHidden: (v: boolean) => void;
}

const FilterCtx = createContext<FilterApi | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterId[]>([]);
  const [showHidden, setShowHidden] = useState(false);

  const toggleFilter = useCallback(
    (id: FilterId) =>
      setFilters((cur) => {
        let next = cur.includes(id) ? cur.filter((f) => f !== id) : [...cur, id];
        // Vegano implica vegetariano: evita seleção redundante.
        if (id === "vegano" && next.includes("vegano")) next = next.filter((f) => f !== "vegetariano");
        if (id === "vegetariano" && next.includes("vegetariano")) next = next.filter((f) => f !== "vegano");
        return next;
      }),
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters([]);
    setQuery("");
    setShowHidden(false);
  }, []);

  const value = useMemo(
    () => ({ query, setQuery, filters, toggleFilter, clearFilters, showHidden, setShowHidden }),
    [query, filters, toggleFilter, clearFilters, showHidden],
  );
  return <FilterCtx.Provider value={value}>{children}</FilterCtx.Provider>;
}

export function useFilters(): FilterApi {
  const ctx = useContext(FilterCtx);
  if (!ctx) throw new Error("useFilters fora do FilterProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Pedido                                                              */
/* ------------------------------------------------------------------ */

export interface OrderLine {
  key: string;
  dishId: string;
  /** Ids dos ajustes ativos (ex.: "sem-amendoim"). */
  customizations: string[];
  qty: number;
}

interface OrderApi {
  lines: OrderLine[];
  count: number;
  totalCents: number;
  add: (dishId: string, customizations: string[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const OrderCtx = createContext<OrderApi | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);

  const add = useCallback((dishId: string, customizations: string[]) => {
    const sorted = [...customizations].sort();
    const key = `${dishId}|${sorted.join(",")}`;
    setLines((cur) => {
      const found = cur.find((l) => l.key === key);
      if (found) return cur.map((l) => (l.key === key ? { ...l, qty: Math.min(l.qty + 1, 20) } : l));
      return [...cur, { key, dishId, customizations: sorted, qty: 1 }];
    });
  }, []);

  const setQty = useCallback(
    (key: string, qty: number) =>
      setLines((cur) =>
        qty <= 0 ? cur.filter((l) => l.key !== key) : cur.map((l) => (l.key === key ? { ...l, qty: Math.min(qty, 20) } : l)),
      ),
    [],
  );
  const remove = useCallback((key: string) => setLines((cur) => cur.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const totalCents = lines.reduce((sum, l) => sum + (getDish(l.dishId)?.priceCents ?? 0) * l.qty, 0);

  const value = useMemo(
    () => ({ lines, count, totalCents, add, setQty, remove, clear }),
    [lines, count, totalCents, add, setQty, remove, clear],
  );
  return <OrderCtx.Provider value={value}>{children}</OrderCtx.Provider>;
}

export function useOrder(): OrderApi {
  const ctx = useContext(OrderCtx);
  if (!ctx) throw new Error("useOrder fora do OrderProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Rotas simples por hash (#/, #/prato/ID, #/ajustes, #/pedido)         */
/* ------------------------------------------------------------------ */

export type Route =
  | { name: "menu" }
  | { name: "dish"; id: string }
  | { name: "settings" }
  | { name: "order" };

function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts[0] === "prato" && parts[1] && getDish(decodeURIComponent(parts[1]))) {
    return { name: "dish", id: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === "ajustes") return { name: "settings" };
  if (parts[0] === "pedido") return { name: "order" };
  return { name: "menu" };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(to: "menu" | "settings" | "order" | { dish: string }) {
  if (to === "menu") window.location.hash = "#/";
  else if (to === "settings") window.location.hash = "#/ajustes";
  else if (to === "order") window.location.hash = "#/pedido";
  else window.location.hash = `#/prato/${encodeURIComponent(to.dish)}`;
}
