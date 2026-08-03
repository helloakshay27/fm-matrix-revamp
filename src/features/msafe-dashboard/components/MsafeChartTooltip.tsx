import type { TooltipProps } from 'recharts';
import type { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

type TipItem = {
  name?: NameType;
  value?: ValueType;
  color?: string;
  dataKey?: string | number;
  payload?: { name?: string; value?: number; color?: string; fill?: string };
};

type Props = TooltipProps<ValueType, NameType> & {
  valueSuffix?: string;
  /** Chart.js dataset label style — body shows "{bodyLabel}: {value}" */
  bodyLabel?: string;
};

/** Chart.js-style dark tooltip used across M-Safe charts (matches vi_msafe_v6.html). */
export function MsafeChartTooltip({
  active,
  payload,
  label,
  valueSuffix = '',
  bodyLabel,
}: Props) {
  if (!active || !payload?.length) return null;

  const items = payload as TipItem[];
  const title =
    label != null && label !== ''
      ? String(label)
      : String(items[0]?.payload?.name ?? items[0]?.name ?? '');

  return (
    <div className="msafe-chart-tip">
      {title ? <div className="msafe-chart-tip-title">{title}</div> : null}
      {items.map((it, i) => {
        const swatch = it.color || it.payload?.color || it.payload?.fill || '#DA7756';
        const raw = it.value;
        const num = typeof raw === 'number' ? raw : Number(raw);
        const display = Number.isFinite(num) ? num.toLocaleString() : String(raw ?? '—');
        const series =
          bodyLabel ||
          (it.name != null && String(it.name) !== title ? String(it.name) : '');
        return (
          <div key={i} className="msafe-chart-tip-row">
            <span className="msafe-chart-tip-sw" style={{ background: swatch }} />
            <span>
              {series ? `${series}: ` : ''}
              {display}
              {valueSuffix}
            </span>
          </div>
        );
      })}
    </div>
  );
}
