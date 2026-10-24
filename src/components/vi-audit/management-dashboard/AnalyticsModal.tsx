import { ANALYTICS_CATALOG } from "./data";
import { AuditTabIcon, CheckIcon } from "./icons";

interface AnalyticsModalProps {
  open: boolean;
  selected: string[];
  onToggle: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  onClear: () => void;
  onApply: () => void;
  onClose: () => void;
}

export function AnalyticsModal({ open, selected, onToggle, onToggleAll, onClear, onApply, onClose }: AnalyticsModalProps) {
  const allChecked = ANALYTICS_CATALOG.every((item) => selected.includes(item.id));
  const count = selected.length;

  return (
    <>
      <div className={`am-scrim${open ? " open" : ""}`} onClick={onClose} />
      <div className={`am-modal${open ? " open" : ""}`} aria-labelledby="analytics-title">
        <div className="am-hd">
          <h3 id="analytics-title">Select Analytics</h3>
          <div className="s">Choose analytics from different modules</div>
        </div>
        <div className="am-body">
          <div className="am-group">
            <div className="am-group-hd">
              <AuditTabIcon />
              <div className="name">Audit</div>
              <div className={`am-checkbox${allChecked ? " checked" : ""}`} onClick={() => onToggleAll(!allChecked)}>
                <CheckIcon />
              </div>
            </div>
            {ANALYTICS_CATALOG.map((item) => (
              <button key={item.id} type="button" className="am-item" onClick={() => onToggle(item.id)}>
                <div className={`am-checkbox${selected.includes(item.id) ? " checked" : ""}`}>
                  <CheckIcon />
                </div>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="am-ft">
          <div className="count">
            {count} analytic{count === 1 ? "" : "s"} selected
          </div>
          <div className="am-ft-actions">
            <button type="button" className="am-clear-btn" onClick={onClear}>
              Clear All
            </button>
            <button type="button" className="am-apply-btn" onClick={onApply}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
