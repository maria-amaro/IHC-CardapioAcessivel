import { useMemo } from "react";
import { conflicts, DISHES, normalize, type Dish } from "../data/menu";
import { useFilters } from "../state/app";

export function matchesQuery(dish: Dish, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  const haystack = normalize([dish.name, dish.description, ...dish.ingredients.map((i) => i.name)].join(" "));
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export interface VisibleDishes {
  /** Pratos que a busca encontrou. */
  matching: Dish[];
  /** Pratos compatíveis com os filtros. */
  compatible: Dish[];
  /** Pratos encontrados que conflitam com os filtros. */
  hidden: Dish[];
  /** Pratos efetivamente mostrados na lista. */
  shown: Dish[];
}

export function useVisibleDishes(): VisibleDishes {
  const { query, filters, showHidden } = useFilters();
  return useMemo(() => {
    const matching = DISHES.filter((d) => matchesQuery(d, query));
    const compatible = matching.filter((d) => conflicts(d, filters).length === 0);
    const hidden = matching.filter((d) => conflicts(d, filters).length > 0);
    return { matching, compatible, hidden, shown: showHidden ? matching : compatible };
  }, [query, filters, showHidden]);
}
