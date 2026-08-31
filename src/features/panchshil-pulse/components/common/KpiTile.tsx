import React, { useState, useEffect } from "react";
import { InfoPopover } from "./InfoPopover";
import { usePulseDashboard } from "../../contexts/PulseDashboardContext";
import { BM_DEFAULTS } from "../../data/sampleData";

interface KpiTileProps {
  id?: string;
  label: string;
  val: string;
  raw?: number;
  dir?: 'up' | 'dn' | 'flat';
  delta?: string | null;
  sub?: string;
  noTarget?: boolean;
  unit?: string;
  goodUp?: boolean;
}

export const KpiTile: React.FC<KpiTileProps> = ({
  id,
  label,
  val,
  raw,
  dir = 'flat',
  delta,
  sub,
  noTarget = false,
  unit = '',
  goodUp = true
}) => {
  const { benchmarks, updateBenchmark } = usePulseDashboard();

  // Retrieve current target (custom user override or default benchmark)
  const currentTarget = id !== undefined && benchmarks[id] !== undefined
    ? benchmarks[id]
    : (id !== undefined && BM_DEFAULTS[id] !== undefined ? BM_DEFAULTS[id] : null);

  // Local state for the text input
  const [inputValue, setInputValue] = useState<string>(
    currentTarget !== null && currentTarget !== undefined ? String(currentTarget) : ""
  );

  // Keep input value in sync if context changes
  useEffect(() => {
    setInputValue(currentTarget !== null && currentTarget !== undefined ? String(currentTarget) : "");
  }, [currentTarget]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    
    if (id) {
      if (value === "") {
        updateBenchmark(id, null);
      } else {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          updateBenchmark(id, parsed);
        }
      }
    }
  };

  const arrowSym = dir === 'up' ? '▲' : dir === 'dn' ? '▼' : '—';
  
  // Render target row
  let targetRow = null;
  if (!noTarget && id) {
    let badge = null;
    const isTargetUnset = currentTarget === null || currentTarget === undefined || isNaN(currentTarget);

    if (isTargetUnset) {
      badge = <span className="bb unset">set a target</span>;
    } else {
      const isRawValid = raw !== undefined && !isNaN(raw);
      const isMet = isRawValid ? (goodUp ? raw! >= currentTarget! : raw! <= currentTarget!) : false;
      badge = (
        <span className={`bb ${isMet ? 'met' : 'miss'}`}>
          {isMet ? '✓ on target' : '✕ off target'}
        </span>
      );
    }

    targetRow = (
      <div className="bm">
        <span className="bl">Target</span>
        <input
          className="bmin"
          type="text"
          inputMode="decimal"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="—"
          title="Set your own target for this KPI"
        />
        {unit && <span className="bu">{unit}</span>}
        {badge}
      </div>
    );
  }

  return (
    <div className="tile">
      <div className="tophead">
        <div className="lbl">{label}</div>
        <InfoPopover label={label} />
      </div>
      <div className="val">{val}</div>
      {delta !== undefined && delta !== null && (
        <div className={`delta ${dir}`}>
          {arrowSym} {delta}
        </div>
      )}
      {sub && <div className="sub2">{sub}</div>}
      {targetRow}
    </div>
  );
};
