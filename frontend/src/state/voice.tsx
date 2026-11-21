import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DISHES, normalize, RESTAURANT } from "../data/menu";
import { createRecognition, recognitionSupported, speak, stopSpeaking, type RecognitionLike } from "../lib/speech";
import { dishSpeech, menuSpeech } from "../lib/readAloud";
import { useVisibleDishes } from "../lib/visibleDishes";
import { navigate, useAnnounce, useFilters, useOrder, useRoute } from "./app";
import { useSettings } from "./settings";

interface VoiceApi {
  supported: boolean;
  listening: boolean;
  dictating: boolean;
  toggleCommands: () => void;
  /** Dita um texto (usado na busca por voz). */
  dictate: (onText: (text: string) => void) => void;
  callStaff: () => void;
}

const VoiceCtx = createContext<VoiceApi | null>(null);

export const ADD_CURRENT_EVENT = "cardapio:add-current";
export const READ_CURRENT_EVENT = "cardapio:read-current";

export function VoiceProvider({ children }: { children: ReactNode }) {
  const { announce } = useAnnounce();
  const { setQuery, clearFilters, filters } = useFilters();
  const { add } = useOrder();
  const { increaseFont, decreaseFont, toggleContrast } = useSettings();
  const route = useRoute();
  const { shown } = useVisibleDishes();

  const [listening, setListening] = useState(false);
  const [dictating, setDictating] = useState(false);
  const recRef = useRef<RecognitionLike | null>(null);
  const wantedRef = useRef(false);
  const dictRef = useRef<RecognitionLike | null>(null);

  const callStaff = useCallback(() => {
    announce(`Chamamos nossa equipe. Alguém virá até a ${RESTAURANT.table}.`);
  }, [announce]);

  /* Os comandos sempre usam o estado mais recente através deste ref. */
  const handlerRef = useRef<(text: string) => void>(() => undefined);
  handlerRef.current = (raw: string) => {
    const text = normalize(raw).replace(/[.,!?]/g, "");
    // Palavra inteira (com plural opcional), para "pare" não casar com "prepare".
    const has = (...words: string[]) => words.some((w) => new RegExp(`\\b${w}s?\\b`).test(text));

    const search = text.match(/^(?:buscar|busque|procurar|procure|pesquisar|pesquise)\s+(.+)$/);
    if (search) {
      navigate("menu");
      setQuery(search[1]);
      announce(`Buscando por ${search[1]}.`);
      return;
    }
    if (has("limpar filtro", "limpar busca", "limpar tudo")) {
      clearFilters();
      announce("Filtros e busca removidos.");
      return;
    }
    if (has("parar leitura", "pare", "silencio", "calar")) {
      stopSpeaking();
      return;
    }
    if (has("ajuste", "acessibilidade")) {
      navigate("settings");
      return;
    }
    if (has("voltar", "cardapio", "menu principal", "inicio")) {
      navigate("menu");
      return;
    }
    if (has("meu pedido", "ver pedido", "abrir pedido", "carrinho")) {
      navigate("order");
      return;
    }
    if (has("chamar atendimento", "chamar equipe", "chamar garcom", "chamar atendente")) {
      callStaff();
      return;
    }
    if (has("aumentar texto", "texto maior", "aumentar fonte", "fonte maior")) {
      announce(`Texto em ${increaseFont()}%.`);
      return;
    }
    if (has("diminuir texto", "texto menor", "diminuir fonte", "fonte menor")) {
      announce(`Texto em ${decreaseFont()}%.`);
      return;
    }
    if (has("contraste")) {
      announce(toggleContrast() === "escuro" ? "Alto contraste ligado." : "Alto contraste desligado.");
      return;
    }
    if (has("adicionar", "pedir", "quero")) {
      if (route.name === "dish") {
        window.dispatchEvent(new Event(ADD_CURRENT_EVENT));
        return;
      }
      const dish = DISHES.find((d) => text.includes(normalize(d.name)));
      if (dish) {
        add(dish.id, []);
        announce(`${dish.name} adicionado ao pedido.`);
      } else {
        announce("Diga o nome do prato, por exemplo: adicionar bowl da horta.");
      }
      return;
    }
    if (has("ler", "ouvir", "descricao", "ingrediente")) {
      if (route.name === "dish") {
        window.dispatchEvent(new Event(READ_CURRENT_EVENT));
      } else {
        const dish = DISHES.find((d) => text.includes(normalize(d.name)));
        if (dish) speak(`dish-${dish.id}`, dishSpeech(dish));
        else speak("menu", menuSpeech(shown, filters));
      }
      return;
    }
    const named = DISHES.find((d) => text.includes(normalize(d.name)) || text.includes(normalize(d.id.replace(/-/g, " "))));
    if (named) {
      navigate({ dish: named.id });
      return;
    }
    announce(`Não entendi "${raw}". Tente: buscar frango, ler ingredientes, ver pedido ou voltar.`);
  };

  const stopCommands = useCallback(() => {
    wantedRef.current = false;
    recRef.current?.abort();
    recRef.current = null;
    setListening(false);
  }, []);

  const startCommands = useCallback(() => {
    const rec = createRecognition(true);
    if (!rec) return;
    wantedRef.current = true;
    recRef.current = rec;
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) handlerRef.current(r[0].transcript);
      }
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        wantedRef.current = false;
        setListening(false);
        announce("Sem permissão para usar o microfone. Libere o acesso nas configurações do navegador.");
      }
    };
    rec.onend = () => {
      // O navegador encerra a escuta após silêncio. Reinicia enquanto o usuário quiser.
      if (wantedRef.current && recRef.current === rec) {
        try {
          rec.start();
        } catch {
          setListening(false);
        }
      }
    };
    try {
      rec.start();
      setListening(true);
      announce("Navegação por voz ligada. Diga, por exemplo: buscar frango.");
    } catch {
      setListening(false);
    }
  }, [announce]);

  const toggleCommands = useCallback(() => {
    if (!recognitionSupported) {
      announce("Seu navegador não oferece reconhecimento de voz. Use o Chrome ou o Edge.");
      return;
    }
    if (wantedRef.current) {
      stopCommands();
      announce("Navegação por voz desligada.");
    } else {
      startCommands();
    }
  }, [announce, startCommands, stopCommands]);

  const dictate = useCallback(
    (onText: (text: string) => void) => {
      if (!recognitionSupported) {
        announce("Seu navegador não oferece reconhecimento de voz. Digite a busca no campo.");
        return;
      }
      if (dictRef.current) {
        dictRef.current.abort();
        return;
      }
      const resume = wantedRef.current;
      if (resume) stopCommands();
      const rec = createRecognition(false);
      if (!rec) return;
      dictRef.current = rec;
      setDictating(true);
      announce("Pode falar o que deseja buscar.", { silentToast: false });
      const done = () => {
        dictRef.current = null;
        setDictating(false);
        if (resume) startCommands();
      };
      rec.onresult = (e) => {
        const text = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join(" ").trim();
        if (text) {
          onText(text.replace(/[.,!?]$/, ""));
          announce(`Busca: ${text}.`);
        }
      };
      rec.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          announce("Sem permissão para usar o microfone.");
        } else if (e.error === "no-speech") {
          announce("Não ouvi nada. Tente de novo.");
        }
      };
      rec.onend = done;
      try {
        rec.start();
      } catch {
        done();
      }
    },
    [announce, startCommands, stopCommands],
  );

  useEffect(
    () => () => {
      wantedRef.current = false;
      recRef.current?.abort();
      dictRef.current?.abort();
      stopSpeaking();
    },
    [],
  );

  const value = useMemo<VoiceApi>(
    () => ({ supported: recognitionSupported, listening, dictating, toggleCommands, dictate, callStaff }),
    [listening, dictating, toggleCommands, dictate, callStaff],
  );
  return <VoiceCtx.Provider value={value}>{children}</VoiceCtx.Provider>;
}

export function useVoice(): VoiceApi {
  const ctx = useContext(VoiceCtx);
  if (!ctx) throw new Error("useVoice fora do VoiceProvider");
  return ctx;
}
