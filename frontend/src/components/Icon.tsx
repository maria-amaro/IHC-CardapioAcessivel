/** Ícones decorativos (aria-hidden). O significado sempre vem também em texto. */
const PATHS = {
  gear: "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7.4-2.6 1.6 1.2-1.6 2.8-1.9-.6a7 7 0 0 1-1.6.9l-.3 2h-3.2l-.3-2a7 7 0 0 1-1.6-.9l-1.9.6L7 14.1l1.6-1.2a7 7 0 0 1 0-1.8L7 9.9l1.6-2.8 1.9.6a7 7 0 0 1 1.6-.9l.3-2h3.2l.3 2a7 7 0 0 1 1.6.9l1.9-.6L21 9.9l-1.6 1.2a7 7 0 0 1 0 1.8Z",
  mic: "M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm6-3a6 6 0 0 1-12 0M12 18v3m-3 0h6",
  ear: "M11 20a3 3 0 0 0 3-3c0-2 3-3 3-6a5.5 5.5 0 0 0-11 0M9.5 11a2.5 2.5 0 0 1 5 0c0 1.5-1.5 2-2 3",
  speaker: "M4 9v6h4l5 4V5L8 9H4Zm13 0a4 4 0 0 1 0 6m2.5-9a8 8 0 0 1 0 12",
  stop: "M7 7h10v10H7z",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6",
  back: "M19 12H5m6-6-6 6 6 6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  chat: "M4 5h16v11H9l-5 4V5Z",
  bag: "M6 8h12l1 12H5L6 8Zm3 0V7a3 3 0 0 1 6 0v1",
  alert: "M12 4 2.5 20h19L12 4Zm0 6v5m0 3v.01",
  check: "m5 12 5 5 9-10",
  leaf: "M5 19c0-8 5-14 15-14 0 9-5 14-13 14M5 19l7-7",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  x: "M6 6l12 12M18 6 6 18",
  trash: "M5 7h14M10 7V4h4v3m-6 0 1 13h6l1-13",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9v.01",
  shield: "M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Zm-3 9 2 2 4-4",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
