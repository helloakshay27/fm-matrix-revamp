type Mode = string;

type Props = {
  modes: Mode[];
  value: Mode;
  onChange: (mode: Mode) => void;
};

export function ChartSwitch({ modes, value, onChange }: Props) {
  return (
    <div className="chart-switch">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          className={value === m ? 'active' : ''}
          onClick={(e) => {
            e.stopPropagation();
            onChange(m);
          }}
        >
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  );
}
