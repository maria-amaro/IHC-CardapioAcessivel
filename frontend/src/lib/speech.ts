import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/* Leitura em voz alta (síntese de fala do navegador)                  */
/* ------------------------------------------------------------------ */

export const ttsSupported = typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

let speakingId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function pickVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang.toLowerCase() === "pt-br") ?? voices.find((v) => v.lang.toLowerCase().startsWith("pt"));
}

/** Divide em frases: alguns navegadores interrompem falas muito longas. */
function chunks(text: string): string[] {
  return text
    .split(/(?<=[.!?:])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function stopSpeaking() {
  if (!ttsSupported) return;
  window.speechSynthesis.cancel();
  speakingId = null;
  emit();
}

/** Lê o texto. Chamar de novo com o mesmo id interrompe a leitura. */
export function speak(id: string, text: string) {
  if (!ttsSupported) return;
  if (speakingId === id) {
    stopSpeaking();
    return;
  }
  window.speechSynthesis.cancel();
  speakingId = id;
  emit();
  const parts = chunks(text);
  const voice = pickVoice();
  parts.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part);
    u.lang = "pt-BR";
    if (voice) u.voice = voice;
    u.rate = 0.95;
    const finish = () => {
      if (i === parts.length - 1 && speakingId === id) {
        speakingId = null;
        emit();
      }
    };
    u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.speak(u);
  });
}

export function useSpeakingId(): string | null {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => speakingId,
    () => null,
  );
}

/* ------------------------------------------------------------------ */
/* Reconhecimento de voz                                               */
/* ------------------------------------------------------------------ */

interface RecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<RecognitionResultLike>;
}
export interface RecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type RecognitionCtor = new () => RecognitionLike;

function getCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export const recognitionSupported = Boolean(getCtor());

export function createRecognition(continuous: boolean): RecognitionLike | null {
  const Ctor = getCtor();
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = "pt-BR";
  r.continuous = continuous;
  r.interimResults = false;
  return r;
}
