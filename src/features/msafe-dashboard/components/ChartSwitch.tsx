import { useContext } from 'react';
import { useMSafeEvents } from '@/components/PostHogMSafeEvents';
import { ChartCardLabelContext } from '../context/ChartCardLabelContext';

type Mode = string;

type Props = {
  modes: Mode[];
  value: Mode;
  onChange: (mode: Mode) => void;
};

export function ChartSwitch({ modes, value, onChange }: Props) {
  const cardLabel = useContext(ChartCardLabelContext);
  const msafeEvents = useMSafeEvents();

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
            // Re-clicking the mode already showing isn't a view change — don't report it.
            if (m !== value) {
              msafeEvents.onMsafeChartViewChanged({
                card_label: cardLabel,
                view_mode: m,
                previous_view_mode: value,
                available_modes: modes,
              });
            }
          }}
        >
          {m.charAt(0).toUpperCase() + m.slice(1)}
        </button>
      ))}
    </div>
  );
}
