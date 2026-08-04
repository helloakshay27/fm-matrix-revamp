// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { T, COLORS } from "../constants";
export { COLORS };
import { I, ico } from "../icons";

/* ── Style helpers ── */
export const card = { background: T.surface, borderRadius: T.rlg, border: `1px solid ${T.borderSoft}`, padding: "24px 28px" };
export const g2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 18 };
export const g3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 18 };
export const fb = { borderColor: T.orange, boxShadow: `0 0 0 4px ${T.orangeSoft}` };
export const iB = { width: "100%", minHeight: 44, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, background: T.raised, color: T.ink, padding: "0 14px", fontSize: 13.5, fontWeight: 500, fontFamily: T.font, outline: "none", transition: "border-color .16s, box-shadow .16s" };
export const sB = { ...iB, appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(44,44,44,.48)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" };
export const tB = { ...iB, minHeight: 88, padding: "12px 14px", resize: "vertical", lineHeight: 1.6 };
export const gBtn = { width: 32, height: 32, borderRadius: T.rsm, border: "none", background: "transparent", cursor: "pointer", color: T.inkMuted, display: "grid", placeItems: "center", transition: "all .16s", padding: 0 };
export const aBtn = { ...gBtn, border: `1px solid ${T.borderSoft}`, background: T.raised };
export const dashedBtn = { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 12, borderRadius: T.rmd, border: `2px dashed ${T.borderWarm}`, background: "transparent", cursor: "pointer", color: T.inkSoft, fontSize: 13, fontWeight: 600, fontFamily: T.font };
export const smBtn = { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: T.rsm, border: "none", background: "transparent", cursor: "pointer", color: T.orange, fontSize: 12, fontWeight: 600, fontFamily: T.font };

export const navStyle = (a) => ({ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: T.rsm, cursor: "pointer", transition: "all .16s", background: a ? T.orangeSoft : "transparent", color: a ? T.orange : T.inkSoft, fontWeight: a ? 600 : 500, fontSize: 13.5, border: "none", width: "100%", textAlign: "left", fontFamily: T.font });

export const pill = (a) => ({ padding: "8px 18px", borderRadius: T.rsm, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .16s", fontFamily: T.font, background: a ? T.orange : "transparent", color: a ? "#fff" : T.inkSoft });

export const secTitle = (icon, title, sub) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
      <span style={{ color: T.orange, display: "flex" }}>{icon}</span>
      {title}
    </div>
    <p style={{ fontSize: 12, color: T.inkMuted, margin: 0 }}>{sub}</p>
  </div>
);

/* ── UI Components ── */
export const FI = ({ style: sx, ...p }) => {
  const [fc, sfc] = useState(false);
  return <input {...p} style={{ ...iB, ...sx, ...(fc ? fb : {}) }} onFocus={(e) => { sfc(true); p.onFocus?.(e); }} onBlur={(e) => { sfc(false); p.onBlur?.(e); }} />;
};

export const FS = ({ children, style: sx, ...p }) => {
  const [fc, sfc] = useState(false);
  return <select {...p} style={{ ...sB, ...sx, ...(fc ? fb : {}) }} onFocus={() => sfc(true)} onBlur={() => sfc(false)}>{children}</select>;
};

export const FT = ({ style: sx, ...p }) => {
  const [fc, sfc] = useState(false);
  return <textarea {...p} style={{ ...tB, ...sx, ...(fc ? fb : {}) }} onFocus={() => sfc(true)} onBlur={() => sfc(false)} />;
};

export const Fld = ({ label, children, hint, span }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, ...(span ? { gridColumn: `span ${span}` } : {}) }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: T.inkSoft }}>{label}</label>
    {children}
    {hint && <span style={{ fontSize: 11, color: T.inkMuted }}>{hint}</span>}
  </div>
);

export const Btn = ({ primary, children, disabled, ...p }) => (
  <button {...p} disabled={disabled} style={{ minHeight: 42, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 22px", borderRadius: T.rsm, border: primary ? "none" : `1px solid ${T.borderSoft}`, cursor: disabled ? "not-allowed" : "pointer", fontFamily: T.font, background: primary ? (disabled ? T.inkMuted : T.orange) : T.raised, color: primary ? "#fff" : T.inkSoft, fontSize: 13, fontWeight: 600, opacity: disabled ? 0.5 : 1, transition: "all .16s" }}>
    {children}
  </button>
);

export const SH = ({ icon, title, sub }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 2 }}>
      <span style={{ color: T.orange, display: "flex" }}>{icon}</span>
      {title}
    </div>
    {sub && <p style={{ fontSize: 12.5, color: T.inkMuted, margin: 0 }}>{sub}</p>}
  </div>
);

export const StatusPill = ({ s: st }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: (st === "published" || st === "active") ? "rgba(137,247,231,.2)" : "rgba(237,196,136,.28)", color: (st === "published" || st === "active") ? T.growth : "#8B5D1B" }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: (st === "published" || st === "active") ? T.growth : "#C9A24E" }} />
    {st === "published" ? "Published" : st === "active" ? "Active" : st === "draft" ? "Draft" : "Inactive"}
  </span>
);

export const FilterSelect = ({ value, onChange, label, options = [] }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 12px", background: T.raised, border: `1px solid ${T.borderSoft}`, borderRadius: T.rmd, minHeight: 40 }}>
    <select style={{ border: "none", outline: "none", background: "transparent", fontSize: 12.5, fontWeight: 500, fontFamily: T.font, color: T.ink, cursor: "pointer" }} value={value} onChange={onChange}>
      <option value="all">{label}</option>
      {options.map((o, index) => {
        const optionValue = typeof o === "string" ? o : o?.value ?? o?.id ?? "";
        const optionLabel = typeof o === "string" ? o : o?.label ?? o?.name ?? "";
        return (
          <option key={`${optionValue}-${index}`} value={String(optionValue)}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  </div>
);

/**
 * FilterSelect ka searchable version — list lambi ho (departments, members)
 * to type karke filter kiya ja sakta hai. `onChange` seedhe value string
 * deta hai (native select event nahi).
 */
export const FilterSearchSelect = ({
  value,
  onChange,
  label,
  options = [],
  emptyText = "No results found",
  minWidth = 170,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const normalized = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { value: option, label: option }
          : {
            value: String(option?.value ?? option?.id ?? ""),
            label: String(option?.label ?? option?.name ?? ""),
          }
      ),
    [options]
  );

  const selected = normalized.find(
    (option) => String(option.value) === String(value ?? "")
  );
  const displayValue = selected?.label || label;

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return normalized;
    return normalized.filter((option) =>
      option.label.toLowerCase().includes(text)
    );
  }, [normalized, query]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  const pick = (nextValue) => {
    onChange?.(nextValue);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={rootRef} style={{ position: "relative", minWidth }}>
      <div
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 10px 0 12px",
          background: T.raised,
          border: `1px solid ${open ? T.orange : T.borderSoft}`,
          borderRadius: T.rmd,
          minHeight: 40,
          cursor: "pointer",
          boxShadow: open ? `0 0 0 4px ${T.orangeSoft}` : "none",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          readOnly={!open}
          value={open ? query : displayValue}
          placeholder={label}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              e.currentTarget.blur();
            }
          }}
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            flex: 1,
            minWidth: 0,
            fontSize: 12.5,
            fontWeight: 500,
            fontFamily: T.font,
            color: T.ink,
            cursor: open ? "text" : "pointer",
          }}
        />
        <ChevronDown
          size={15}
          style={{
            color: T.inkMuted,
            flexShrink: 0,
            transition: "transform .15s ease",
            transform: open ? "rotate(180deg)" : "none",
          }}
        />
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(100% + 6px)",
            zIndex: 80,
            background: T.raised,
            border: `1px solid ${T.borderSoft}`,
            borderRadius: T.rmd,
            boxShadow: "0 12px 32px rgba(44,44,44,.16)",
            overflow: "hidden",
          }}
        >
          <div style={{ maxHeight: 240, overflowY: "auto", padding: 4 }}>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                pick("all");
              }}
              style={filterOptionStyle(String(value ?? "all") === "all")}
            >
              {label}
            </button>
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: 12.5, color: T.inkMuted }}>
                {emptyText}
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(option.value);
                  }}
                  style={filterOptionStyle(
                    String(option.value) === String(value ?? "")
                  )}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const filterOptionStyle = (active) => ({
  width: "100%",
  display: "block",
  border: "none",
  borderRadius: 6,
  background: active ? T.orangeSoft : "transparent",
  color: active ? T.orange : T.ink,
  padding: "8px 10px",
  cursor: "pointer",
  fontFamily: T.font,
  fontSize: 12.5,
  fontWeight: active ? 700 : 500,
  textAlign: "left",
});

export const AiBar = ({ text, sub, onClick, label }) => (
  <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, background: T.warm, border: "1px solid rgba(218,119,86,.12)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: T.rmd, background: T.aiGrad, display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>{ico.ai}</div>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>{text}</div>
        <div style={{ fontSize: 12, color: T.inkSoft }}>{sub}</div>
      </div>
    </div>
    <Btn primary onClick={onClick}>{label}</Btn>
  </div>
);

export const Loader = ({ text }) => (
  <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, minHeight: 100, marginBottom: 16 }}>
    <div style={{ width: 32, height: 32, borderRadius: "50%", background: T.aiGrad, display: "grid", placeItems: "center", animation: "pulse 1.5s ease infinite" }}>
      <I d="M12 8a4 4 0 100 8 4 4 0 000-8z" size={14} stroke="#fff" />
    </div>
    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{text}</span>
    <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.08);opacity:.8}}`}</style>
  </div>
);
