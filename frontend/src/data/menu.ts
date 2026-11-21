export type Allergen = "gluten" | "lactose" | "amendoim" | "frutos-do-mar" | "soja" | "ovo";

export type FilterId =
  | "sem-gluten"
  | "sem-lactose"
  | "sem-amendoim"
  | "sem-frutos-do-mar"
  | "sem-soja"
  | "sem-ovo"
  | "vegano"
  | "vegetariano";

export interface FilterDef {
  id: FilterId;
  label: string;
  /** Alérgeno evitado por este filtro (quando aplicável). */
  avoids?: Allergen;
}

export const FILTERS: FilterDef[] = [
  { id: "sem-gluten", label: "Sem glúten", avoids: "gluten" },
  { id: "sem-lactose", label: "Sem lactose", avoids: "lactose" },
  { id: "sem-amendoim", label: "Sem amendoim", avoids: "amendoim" },
  { id: "sem-frutos-do-mar", label: "Sem frutos do mar", avoids: "frutos-do-mar" },
  { id: "sem-soja", label: "Sem soja", avoids: "soja" },
  { id: "sem-ovo", label: "Sem ovo", avoids: "ovo" },
  { id: "vegano", label: "Vegano" },
  { id: "vegetariano", label: "Vegetariano" },
];

export const ALLERGEN_LABEL: Record<Allergen, string> = {
  gluten: "glúten",
  lactose: "lactose",
  amendoim: "amendoim",
  "frutos-do-mar": "frutos do mar",
  soja: "soja",
  ovo: "ovo",
};

export interface Ingredient {
  name: string;
  /** Detalhe opcional, ex.: composição do molho. */
  note?: string;
}

export interface Customization {
  id: string;
  /** Texto do ajuste, ex.: "Remover amendoim". */
  label: string;
  /** Texto exibido quando o ajuste está ativo. */
  onText: string;
  /** Texto exibido quando o ajuste está inativo. */
  offText: string;
  /** Texto curto usado no resumo do pedido, ex.: "sem cobertura de amendoim". */
  summary: string;
}

export interface Dish {
  id: string;
  name: string;
  /** Preço em centavos, para evitar erros de ponto flutuante. */
  priceCents: number;
  category: string;
  /** Resumo curto exibido no cartão da lista. */
  summary: string;
  /** Descrição completa exibida na página do prato. */
  description: string;
  ingredients: Ingredient[];
  /** Alérgenos presentes na receita. */
  contains: Allergen[];
  vegan: boolean;
  vegetarian: boolean;
  /** Frase curada pelo restaurante sobre a ausência de alérgenos. */
  freeFromText: string;
  /** Explicação sobre onde cada alérgeno aparece na receita. */
  allergenDetail: string;
  customizations: Customization[];
  /** Aviso sobre o que a remoção de um item NÃO resolve. */
  customizationWarning: string;
}

export const RESTAURANT = {
  name: "Casa do Ipê",
  tagline: "Comida de verdade, para todos.",
  table: "Mesa 08",
};

export const CROSS_CONTACT_NOTICE =
  "Nossa cozinha compartilha utensílios e superfícies. Não garantimos ausência de alérgenos. Se você tem alergia alimentar, converse com nossa equipe antes de pedir.";

export const CROSS_CONTACT_DETAIL =
  "A cozinha manipula glúten, leite, amendoim, frutos do mar, soja e ovo em utensílios e superfícies compartilhados. Não garantimos ausência de alérgenos.";

export const DISHES: Dish[] = [
  {
    id: "frango-com-amendoim",
    name: "Frango com amendoim",
    priceCents: 3800,
    category: "Pratos principais",
    summary: "Frango grelhado, arroz, brócolis e molho de soja com amendoim.",
    description: "Frango grelhado, arroz, brócolis e molho de soja com amendoim. Uma porção individual, preparada na hora.",
    ingredients: [
      { name: "Filé de peito de frango", note: "150 g" },
      { name: "Arroz branco" },
      { name: "Brócolis" },
      { name: "Amendoim tostado" },
      { name: "Molho de soja sem glúten", note: "soja, água e sal" },
      { name: "Azeite de oliva" },
      { name: "Alho e sal" },
    ],
    contains: ["amendoim", "soja"],
    vegan: false,
    vegetarian: false,
    freeFromText: "Receita sem glúten e sem lactose.",
    allergenDetail:
      "O amendoim é usado na cobertura. A soja está no molho e permanece na receita, mesmo se remover a cobertura.",
    customizations: [
      {
        id: "sem-amendoim",
        label: "Remover amendoim",
        onText: "Sim, remover",
        offText: "Não, manter",
        summary: "sem cobertura de amendoim",
      },
      {
        id: "sem-brocolis",
        label: "Remover brócolis",
        onText: "Sim, remover",
        offText: "Não, manter",
        summary: "sem brócolis",
      },
    ],
    customizationWarning:
      "Remover não torna o prato seguro para alérgicos. Se a cobertura de amendoim for removida, ainda pode haver contato cruzado. Fale com a equipe antes de pedir.",
  },
  {
    id: "bowl-da-horta",
    name: "Bowl da horta",
    priceCents: 3200,
    category: "Pratos principais",
    summary: "Arroz integral, grão-de-bico, abóbora, brócolis e molho de limão.",
    description: "Arroz integral, grão-de-bico, abóbora, brócolis e molho de limão.",
    ingredients: [
      { name: "Arroz integral" },
      { name: "Grão-de-bico" },
      { name: "Abóbora assada" },
      { name: "Brócolis" },
      { name: "Molho de limão", note: "limão, azeite, sal e ervas" },
    ],
    contains: [],
    vegan: true,
    vegetarian: true,
    freeFromText: "Receita vegana e vegetariana.",
    allergenDetail: "Nenhum dos seis alérgenos dos filtros faz parte da receita.",
    customizations: [
      {
        id: "sem-brocolis",
        label: "Remover brócolis",
        onText: "Sim, remover",
        offText: "Não, manter",
        summary: "sem brócolis",
      },
      {
        id: "molho-a-parte",
        label: "Molho à parte",
        onText: "Sim, à parte",
        offText: "Não, sobre o prato",
        summary: "molho à parte",
      },
    ],
    customizationWarning:
      "Ajustes não eliminam o risco de contato cruzado na cozinha. Fale com a equipe antes de pedir se você tem alergia.",
  },
  {
    id: "risotto-de-camarao",
    name: "Risotto de camarão",
    priceCents: 5200,
    category: "Pratos principais",
    summary: "Arroz arbóreo, camarão, leite, manteiga, parmesão e salsinha.",
    description: "Arroz arbóreo, camarão, leite, manteiga, parmesão e salsinha.",
    ingredients: [
      { name: "Arroz arbóreo" },
      { name: "Camarão", note: "fruto do mar" },
      { name: "Leite" },
      { name: "Manteiga" },
      { name: "Queijo parmesão" },
      { name: "Salsinha" },
    ],
    contains: ["frutos-do-mar", "lactose"],
    vegan: false,
    vegetarian: false,
    freeFromText: "Receita sem glúten.",
    allergenDetail:
      "O camarão é o fruto do mar da receita. O leite, a manteiga e o parmesão contêm lactose.",
    customizations: [
      {
        id: "sem-salsinha",
        label: "Remover salsinha",
        onText: "Sim, remover",
        offText: "Não, manter",
        summary: "sem salsinha",
      },
      {
        id: "sem-parmesao",
        label: "Remover parmesão",
        onText: "Sim, remover",
        offText: "Não, manter",
        summary: "sem parmesão",
      },
    ],
    customizationWarning:
      "Remover o parmesão não elimina a lactose do leite e da manteiga. Fale com a equipe antes de pedir.",
  },
];

export function getDish(id: string): Dish | undefined {
  return DISHES.find((d) => d.id === id);
}

/** Retorna os motivos pelos quais o prato NÃO atende aos filtros ativos. */
export function conflicts(dish: Dish, active: FilterId[]): string[] {
  const out: string[] = [];
  for (const id of active) {
    const def = FILTERS.find((f) => f.id === id);
    if (!def) continue;
    if (def.avoids && dish.contains.includes(def.avoids)) {
      out.push(`contém ${ALLERGEN_LABEL[def.avoids]}`);
    } else if (id === "vegano" && !dish.vegan) {
      out.push("não é vegano");
    } else if (id === "vegetariano" && !dish.vegetarian) {
      out.push("não é vegetariano");
    }
  }
  return out;
}

export function listAllergens(contains: Allergen[]): string {
  return joinList(contains.map((a) => ALLERGEN_LABEL[a]));
}

export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} e ${items[items.length - 1]}`;
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export function formatPrice(cents: number): string {
  return brl.format(cents / 100).replace(/\u00a0/g, " ");
}

/** Preço dito em voz alta, ex.: "38 reais". */
export function spokenPrice(cents: number): string {
  const reais = Math.floor(cents / 100);
  const c = cents % 100;
  const r = `${reais} ${reais === 1 ? "real" : "reais"}`;
  return c ? `${r} e ${c} centavos` : r;
}

export function normalize(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}
