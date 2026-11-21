import { useState } from "react";
import { Icon } from "../components/Icon";
import { Switch } from "../components/Switch";
import {
  FONT_STEPS,
  useSettings,
  type ColorBlindMode,
  type ColorMode,
  type FontScale,
} from "../state/settings";
import { navigate, useAnnounce } from "../state/app";
import { useVoice } from "../state/voice";

const COLOR_MODES: { id: ColorMode; label: string; desc: string }[] = [
  { id: "padrao", label: "Padrão", desc: "Cores verdes e fundo claro." },
  { id: "escuro", label: "Alto contraste escuro", desc: "Texto claro sobre fundo preto." },
  { id: "claro", label: "Alto contraste claro", desc: "Texto preto sobre fundo branco." },
  { id: "mono", label: "Monocromático", desc: "Exibição em tons de cinza." },
];

const COLOR_BLIND: { id: ColorBlindMode; label: string; desc: string }[] = [
  { id: "none", label: "Sem filtro", desc: "Cores originais." },
  { id: "protanopia", label: "Protanopia", desc: "Adaptação para percepção do vermelho." },
  { id: "deuteranopia", label: "Deuteranopia", desc: "Adaptação para percepção do verde." },
  { id: "tritanopia", label: "Tritanopia", desc: "Adaptação para percepção do azul." },
];

export function SettingsPage() {
  const { settings, update, reset, increaseFont, decreaseFont } = useSettings();
  const { announce } = useAnnounce();
  const voice = useVoice();
  const [focusDemo, setFocusDemo] = useState(false);

  return (
    <div className="detail settings">
      <button type="button" className="btn btn--secondary btn--back" onClick={() => navigate("menu")}>
        <Icon name="back" size={18} />
        Voltar ao cardápio
      </button>

      <h1 id="page-title" tabIndex={-1} className="page-title">
        Ajustes de acessibilidade
      </h1>
      <p className="lead">Deixe o cardápio mais confortável para você. Suas escolhas valem em todas as páginas.</p>

      <div className="settings__grid">
        <section className="panel stack" aria-labelledby="text-title">
          <div>
            <h2 id="text-title" className="section-title">
              Tamanho do texto
            </h2>
            <p className="hint">Aumente até 200% sem perder o conteúdo.</p>
          </div>

          <div className="font-control font-control--lg" role="group" aria-label="Aumentar ou diminuir o texto">
            <button type="button" className="btn btn--icon" aria-label="Diminuir texto" disabled={settings.fontScale === FONT_STEPS[0]} onClick={decreaseFont}>
              A-
            </button>
            <output className="font-control__value">
              <span className="sr-only">Tamanho atual: </span>
              {settings.fontScale}%
            </output>
            <button type="button" className="btn btn--icon" aria-label="Aumentar texto" disabled={settings.fontScale === FONT_STEPS[FONT_STEPS.length - 1]} onClick={increaseFont}>
              A+
            </button>
          </div>

          <fieldset className="fieldset">
            <legend className="sr-only">Escolher tamanho do texto</legend>
            <div className="segmented">
              {FONT_STEPS.map((s) => (
                <label key={s} className="segmented__item">
                  <input
                    type="radio"
                    name="font-scale"
                    checked={settings.fontScale === s}
                    onChange={() => update({ fontScale: s as FontScale })}
                  />
                  <span>{s}%</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="preview" aria-label={`Prévia do texto em ${settings.fontScale}%`} role="group">
            <p className="hint">Prévia · {settings.fontScale}%</p>
            <p className="preview__title">Bowl da horta</p>
            <p>Ingredientes claros. Mais autonomia para escolher.</p>
          </div>
        </section>

        <section className="panel stack" aria-labelledby="color-title">
          <div>
            <h2 id="color-title" className="section-title">
              Cores e contraste
            </h2>
            <p className="hint">Escolha um modo de exibição.</p>
          </div>
          <fieldset className="fieldset">
            <legend className="sr-only">Modo de exibição</legend>
            <div className="radio-cards">
              {COLOR_MODES.map((m) => (
                <label key={m.id} className="radio-card">
                  <input type="radio" name="color-mode" checked={settings.colorMode === m.id} onChange={() => update({ colorMode: m.id })} />
                  <span className="radio-card__body">
                    <span className="radio-card__label">{m.label}</span>
                    <span className="radio-card__desc">{m.desc}</span>
                  </span>
                  <span className={`swatch swatch--${m.id}`} aria-hidden="true">
                    Aa
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="panel stack" aria-labelledby="cb-title">
          <div>
            <h2 id="cb-title" className="section-title">
              Filtros para daltonismo
            </h2>
            <p className="hint">Os alertas sempre usam ícone e texto, independentemente da cor.</p>
          </div>
          <fieldset className="fieldset">
            <legend className="sr-only">Filtro para daltonismo</legend>
            <div className="radio-cards">
              {COLOR_BLIND.map((m) => (
                <label key={m.id} className="radio-card">
                  <input type="radio" name="color-blind" checked={settings.colorBlind === m.id} onChange={() => update({ colorBlind: m.id })} />
                  <span className="radio-card__body">
                    <span className="radio-card__label">{m.label}</span>
                    <span className="radio-card__desc">{m.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="panel stack" aria-labelledby="voice-title">
          <h2 id="voice-title" className="section-title">
            Leitura e voz
          </h2>
          <Switch
            label="Leitor de tela"
            stateText={settings.screenReader ? "ligado" : "desligado"}
            checked={settings.screenReader}
            describedBy="sr-desc"
            onChange={(on) => update({ screenReader: on })}
          />
          <p id="sr-desc" className="hint">
            Otimização para TalkBack e VoiceOver, com rótulos, ingredientes e ações em ordem de leitura.
          </p>
          <button type="button" className="btn btn--secondary btn--block-narrow" aria-pressed={voice.listening} onClick={voice.toggleCommands}>
            <Icon name="mic" size={18} />
            Navegar por voz{voice.listening ? " · ouvindo" : ""}
          </button>
          <p className="hint">
            Toque no microfone e diga, por exemplo: “Buscar frango” ou “Ler ingredientes”. Outros comandos: “ver pedido”, “ajustes”, “voltar”,
            “aumentar texto”, “alto contraste”, “chamar atendimento”.
            {voice.supported ? "" : " Seu navegador não oferece reconhecimento de voz; use o Chrome ou o Edge."}
          </p>
        </section>

        <section className="panel stack" aria-labelledby="kbd-title">
          <h2 id="kbd-title" className="section-title">
            Usando o teclado
          </h2>
          <p>Use Tab para avançar, Shift + Tab para voltar e Enter para escolher. O contorno indica o foco.</p>
          <button type="button" className={`btn btn--secondary btn--block-narrow${focusDemo ? " btn--demo" : ""}`} onClick={() => { setFocusDemo(true); announce("Este é o contorno de foco do teclado.", { silentToast: true }); }} onBlur={() => setFocusDemo(false)}>
            Exemplo de foco do teclado
          </button>
        </section>
      </div>

      <div className="notice notice--ok notice--lg">
        <Icon name="info" size={22} />
        <div>
          <p>
            <strong>Você está no controle</strong>
          </p>
          <p>Você pode abrir estes ajustes a qualquer momento pela barra de acessibilidade. Eles ficam salvos neste aparelho e não incluem dados pessoais.</p>
        </div>
      </div>

      <div className="dish__actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            navigate("menu");
            announce("Ajustes salvos.");
          }}
        >
          <Icon name="check" size={18} />
          Salvar e voltar ao cardápio
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            reset();
            announce("Ajustes padrão restaurados.");
          }}
        >
          <Icon name="refresh" size={18} />
          Restaurar ajustes padrão
        </button>
      </div>
    </div>
  );
}
