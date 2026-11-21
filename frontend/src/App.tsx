import { useEffect, useRef } from "react";
import { AccessibilityBar } from "./components/AccessibilityBar";
import { ColorBlindFilters, Dock, Footer, LiveRegion } from "./components/Shell";
import { getDish, RESTAURANT } from "./data/menu";
import { DishPage } from "./pages/DishPage";
import { MenuPage } from "./pages/MenuPage";
import { OrderPage } from "./pages/OrderPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AnnounceProvider, FilterProvider, OrderProvider, useRoute, useAnnounce, type Route } from "./state/app";
import { SettingsProvider, useSettings } from "./state/settings";
import { VoiceProvider } from "./state/voice";

function routeTitle(route: Route): string {
  switch (route.name) {
    case "dish":
      return getDish(route.id)?.name ?? "Prato";
    case "settings":
      return "Ajustes de acessibilidade";
    case "order":
      return "Meu pedido";
    default:
      return "Cardápio Acessível";
  }
}

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case "dish": {
      const dish = getDish(route.id);
      return dish ? <DishPage dish={dish} /> : <MenuPage />;
    }
    case "settings":
      return <SettingsPage />;
    case "order":
      return <OrderPage />;
    default:
      return <MenuPage />;
  }
}

function Layout() {
  const route = useRoute();
  const { announce } = useAnnounce();
  const { settings } = useSettings();
  const routeKey = route.name === "dish" ? `dish:${route.id}` : route.name;
  // Guarda a página anterior (e não um "primeiro render"), pois o StrictMode executa o efeito duas vezes.
  const previousKey = useRef(routeKey);

  /* Em troca de página: atualiza o título, volta ao topo e move o foco para o título (WCAG 2.4.3). */
  useEffect(() => {
    const title = routeTitle(route);
    document.title = `${title} · ${RESTAURANT.name}`;
    if (previousKey.current === routeKey) return;
    previousKey.current = routeKey;
    window.scrollTo({ top: 0 });
    document.getElementById("page-title")?.focus({ preventScroll: true });
    if (settings.screenReader) announce(`Página: ${title}.`, { silentToast: true });
    // Só reage à mudança de página, não a mudanças de ajustes.
  }, [routeKey]);

  return (
    <>
      <ColorBlindFilters />
      <div id="app-root" className="app">
        <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById("main"); m?.focus(); m?.scrollIntoView(); }}>
          Pular para o conteúdo
        </a>
        <AccessibilityBar />
        <main id="main" tabIndex={-1} className="main">
          <Page route={route} />
        </main>
        <Footer />
        <Dock />
      </div>
      <LiveRegion />
    </>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AnnounceProvider>
        <FilterProvider>
          <OrderProvider>
            <VoiceProvider>
              <Layout />
            </VoiceProvider>
          </OrderProvider>
        </FilterProvider>
      </AnnounceProvider>
    </SettingsProvider>
  );
}
