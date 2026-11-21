import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const FONT_STEPS = [100, 125, 150, 200] as const;
export type FontScale = (typeof FONT_STEPS)[number];
export type ColorMode = "padrao" | "escuro" | "claro" | "mono";
export type ColorBlindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

export interface Settings {
  fontScale: FontScale;
  colorMode: ColorMode;
  colorBlind: ColorBlindMode;
  /** Otimização para leitores de tela: anúncios e descrições extras. */
  screenReader: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  fontScale: 100,
  colorMode: "padrao",
  colorBlind: "none",
  screenReader: true,
};

const STORAGE_KEY = "cardapio-acessivel:ajustes";

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    // Valida cada campo: o armazenamento local é uma fronteira não confiável.
    return {
      fontScale: (FONT_STEPS as readonly number[]).includes(parsed.fontScale as number)
        ? (parsed.fontScale as FontScale)
        : DEFAULT_SETTINGS.fontScale,
      colorMode: ["padrao", "escuro", "claro", "mono"].includes(parsed.colorMode as string)
        ? (parsed.colorMode as ColorMode)
        : DEFAULT_SETTINGS.colorMode,
      colorBlind: ["none", "protanopia", "deuteranopia", "tritanopia"].includes(parsed.colorBlind as string)
        ? (parsed.colorBlind as ColorBlindMode)
        : DEFAULT_SETTINGS.colorBlind,
      screenReader: typeof parsed.screenReader === "boolean" ? parsed.screenReader : DEFAULT_SETTINGS.screenReader,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface SettingsApi {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
  increaseFont: () => FontScale;
  decreaseFont: () => FontScale;
  toggleContrast: () => ColorMode;
}

const Ctx = createContext<SettingsApi | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* armazenamento indisponível: os ajustes valem apenas nesta sessão */
    }
    const root = document.documentElement;
    root.style.fontSize = `${settings.fontScale}%`;
    root.dataset.colorMode = settings.colorMode;
    root.dataset.colorBlind = settings.colorBlind;
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

  const step = useCallback(
    (dir: 1 | -1): FontScale => {
      const i = FONT_STEPS.indexOf(settings.fontScale);
      const next = FONT_STEPS[Math.min(FONT_STEPS.length - 1, Math.max(0, i + dir))];
      setSettings((s) => ({ ...s, fontScale: next }));
      return next;
    },
    [settings.fontScale],
  );

  const toggleContrast = useCallback((): ColorMode => {
    const next: ColorMode = settings.colorMode === "padrao" || settings.colorMode === "mono" ? "escuro" : "padrao";
    setSettings((s) => ({ ...s, colorMode: next }));
    return next;
  }, [settings.colorMode]);

  const value = useMemo<SettingsApi>(
    () => ({
      settings,
      update,
      reset,
      increaseFont: () => step(1),
      decreaseFont: () => step(-1),
      toggleContrast,
    }),
    [settings, update, reset, step, toggleContrast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSettings(): SettingsApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSettings fora do SettingsProvider");
  return ctx;
}
