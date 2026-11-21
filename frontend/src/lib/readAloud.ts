import {
  conflicts,
  CROSS_CONTACT_DETAIL,
  formatPrice,
  joinList,
  listAllergens,
  spokenPrice,
  type Dish,
  type FilterId,
} from "../data/menu";

/** Texto lido para um prato completo. Usa frases curtas e ordem fixa. */
export function dishSpeech(dish: Dish): string {
  const parts = [
    `${dish.name}. ${spokenPrice(dish.priceCents)} por porção.`,
    `Ingredientes: ${joinList(dish.ingredients.map((i) => (i.note ? `${i.name} (${i.note})` : i.name)))}.`,
    dish.contains.length ? `Contém ${listAllergens(dish.contains)}. ${dish.allergenDetail}` : "Nenhum dos alérgenos dos filtros faz parte da receita.",
    dish.freeFromText,
    `Atenção: ${CROSS_CONTACT_DETAIL}`,
  ];
  return parts.join(" ");
}

/** Texto lido para a lista de pratos visíveis. */
export function menuSpeech(dishes: Dish[], active: FilterId[]): string {
  if (dishes.length === 0) return "Nenhum prato corresponde aos filtros escolhidos.";
  const intro = `${dishes.length} ${dishes.length === 1 ? "prato" : "pratos"} no cardápio.`;
  const items = dishes.map((d, i) => {
    const alert = d.contains.length ? `Contém ${listAllergens(d.contains)}.` : "Sem alérgenos dos filtros.";
    return `Prato ${i + 1}: ${d.name}, ${spokenPrice(d.priceCents)}. ${d.summary} ${alert}`;
  });
  const filterNote = active.length ? "Seus filtros estão aplicados." : "";
  return [intro, filterNote, ...items, "Lembre-se: pode haver contato cruzado na cozinha."].filter(Boolean).join(" ");
}

/** Descrição resumida usada em rótulos para leitores de tela. */
export function dishAriaSummary(dish: Dish, active: FilterId[]): string {
  const problems = conflicts(dish, active);
  const base = `${dish.name}, ${formatPrice(dish.priceCents)}.`;
  const allergens = dish.contains.length ? ` Contém ${listAllergens(dish.contains)}.` : " Sem os alérgenos dos filtros.";
  const warn = problems.length ? ` Atenção: ${joinList(problems)}, conflita com seus filtros.` : "";
  return `${base}${allergens}${warn}`;
}
