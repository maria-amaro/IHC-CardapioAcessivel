interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  /** Texto visual do estado (ex.: "ligado"). Fica oculto para leitores de tela, que já leem o estado do switch. */
  stateText?: string;
  className?: string;
  describedBy?: string;
}

export function Switch({ checked, onChange, label, stateText, className = "", describedBy }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={describedBy}
      className={`switch ${className}`}
      onClick={() => onChange(!checked)}
    >
      <span className="switch__track" aria-hidden="true">
        <span className="switch__thumb" />
      </span>
      <span className="switch__label">
        {label}
        {stateText ? <span aria-hidden="true"> {stateText}</span> : null}
      </span>
    </button>
  );
}
