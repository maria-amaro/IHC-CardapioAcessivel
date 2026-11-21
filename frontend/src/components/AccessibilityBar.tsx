import { FONT_STEPS, useSettings } from "../state/settings";
import { navigate, useAnnounce, useFilters } from "../state/app";
import { useVoice } from "../state/voice";
import { Icon } from "./Icon";
import { Switch } from "./Switch";

export function AccessibilityBar() {
  const { settings, update, increaseFont, decreaseFont } = useSettings();
  const { announce } = useAnnounce();
  const { clearFilters, filters, query } = useFilters();
  const voice = useVoice();

  const isMin = settings.fontScale === FONT_STEPS[0];
  const isMax = settings.fontScale === FONT_STEPS[FONT_STEPS.length - 1];
  const highContrast = settings.colorMode === "escuro" || settings.colorMode === "claro";

  return (
    <section className="a11y-bar" aria-labelledby="a11y-bar-title">
      <div className="a11y-bar__inner">
        <div className="a11y-bar__top">
          <h2 id="a11y-bar-title" className="a11y-bar__title">
            Acessibilidade
          </h2>
          <a className="link-action" href="#/ajustes" onClick={(e) => { e.preventDefault(); navigate("settings"); }}>
            <Icon name="gear" size={18} />
            Ajustes
          </a>
        </div>

        <div className="a11y-bar__controls">
          <div className="font-control" role="group" aria-label="Tamanho do texto">
            <button
              type="button"
              className="btn btn--icon"
              aria-label="Diminuir texto"
              disabled={isMin}
              onClick={() => announce(`Texto em ${decreaseFont()}%.`, { silentToast: true })}
            >
              A-
            </button>
            <output className="font-control__value" aria-live="off">
              <span className="sr-only">Tamanho atual: </span>
              {settings.fontScale}%
            </output>
            <button
              type="button"
              className="btn btn--icon"
              aria-label="Aumentar texto"
              disabled={isMax}
              onClick={() => announce(`Texto em ${increaseFont()}%.`, { silentToast: true })}
            >
              A+
            </button>
          </div>

          <Switch
            label="Contraste"
            checked={highContrast}
            onChange={(on) => update({ colorMode: on ? "escuro" : "padrao" })}
          />

          <button
            type="button"
            className="btn btn--secondary"
            aria-pressed={voice.listening}
            onClick={voice.toggleCommands}
          >
            <Icon name="mic" size={18} />
            Navegar por voz
            {voice.listening ? <span className="badge-live" aria-hidden="true"> · ouvindo</span> : null}
          </button>

          <Switch
            label="Leitor de tela"
            stateText={settings.screenReader ? "ligado" : "desligado"}
            checked={settings.screenReader}
            onChange={(on) => {
              update({ screenReader: on });
              announce(on ? "Modo para leitor de tela ligado." : "Modo para leitor de tela desligado.");
            }}
          />

          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => {
              const had = filters.length > 0 || query !== "";
              clearFilters();
              announce(had ? "Filtros e busca removidos." : "Não há filtros para limpar.");
            }}
          >
            <Icon name="refresh" size={18} />
            Limpar filtros
          </button>
        </div>
      </div>
    </section>
  );
}
