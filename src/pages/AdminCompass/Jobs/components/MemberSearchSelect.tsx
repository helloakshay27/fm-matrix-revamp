// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { T } from "../constants";

export default function MemberSearchSelect({
  value,
  options = [],
  onChange,
  placeholder = "Select member",
  disabled = false,
  loading = false,
  multiple = false,
  loadingText = "Loading users...",
  emptyText = "No members found",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  const selectedValues = multiple
    ? (Array.isArray(value) ? value : []).map((item) => String(item))
    : [];
  const selected = multiple
    ? options.filter((option) => selectedValues.includes(String(option.id)))
    : options.find((option) => String(option.id) === String(value || ""));
  const displayValue = multiple
    ? selected.map((option) => option.name).join(", ")
    : selected?.name || "";
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return options;
    return options.filter((option) => {
      const haystack = `${option.name || ""} ${option.email || ""}`.toLowerCase();
      return haystack.includes(text);
    });
  }, [options, query]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative", width: "100%" }}>
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={open ? query : loading ? loadingText : displayValue}
          placeholder={placeholder}
          readOnly={!open}
          onClick={() => !disabled && setOpen(true)}
          onFocus={() => !disabled && setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              e.currentTarget.blur();
            }
            if (e.key === "Backspace" && !open && value) onChange(multiple ? [] : "");
          }}
          style={{
            width: "100%",
            minHeight: 44,
            border: `1px solid ${open ? T.orange : T.borderSoft}`,
            borderRadius: T.rmd,
            background: T.raised,
            color: displayValue || open || loading ? T.ink : T.inkMuted,
            padding: "0 40px 0 14px",
            fontSize: 13.5,
            fontWeight: 500,
            fontFamily: T.font,
            outline: "none",
            cursor: disabled ? "not-allowed" : "text",
            boxShadow: open ? `0 0 0 4px ${T.orangeSoft}` : "none",
            opacity: disabled ? 0.55 : 1,
            boxSizing: "border-box",
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => !disabled && setOpen((next) => !next)}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            border: "none",
            background: "transparent",
            color: T.inkMuted,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          <ChevronDown
            size={16}
            style={{
              transition: "transform .15s ease",
              transform: open ? "rotate(180deg)" : "none",
            }}
          />
        </button>
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
            {(multiple ? selectedValues.length > 0 : value) && (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(multiple ? [] : "");
                  setQuery("");
                  setOpen(false);
                }}
                style={optionStyle(false)}
              >
                Clear selection
              </button>
            )}
            {filtered.length === 0 ? (
              <div style={{ padding: "10px 12px", fontSize: 12.5, color: T.inkMuted }}>
                {emptyText}
              </div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (multiple) {
                      const optionId = String(option.id);
                      const nextValues = selectedValues.includes(optionId)
                        ? selectedValues.filter((id) => id !== optionId)
                        : [...selectedValues, optionId];
                      onChange(nextValues, option);
                      setQuery("");
                      window.setTimeout(() => inputRef.current?.focus(), 0);
                      return;
                    }
                    onChange(String(option.id), option);
                    setQuery("");
                    setOpen(false);
                  }}
                  style={optionStyle(multiple ? selectedValues.includes(String(option.id)) : String(option.id) === String(value || ""))}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {multiple && (
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 3,
                          border: `1px solid ${selectedValues.includes(String(option.id)) ? T.orange : T.borderSoft}`,
                          background: selectedValues.includes(String(option.id)) ? T.orange : T.raised,
                          color: "#fff",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          lineHeight: 1,
                        }}
                      >
                        {selectedValues.includes(String(option.id)) ? "✓" : ""}
                      </span>
                    )}
                    {option.name}
                  </span>
                  {option.email && (
                    <span style={{ fontSize: 11.5, color: T.inkMuted, marginTop: 2 }}>
                      {option.email}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const optionStyle = (active) => ({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  border: "none",
  borderRadius: 6,
  background: active ? T.orangeSoft : "transparent",
  color: active ? T.orange : T.ink,
  padding: "8px 10px",
  cursor: "pointer",
  fontFamily: T.font,
  fontSize: 13,
  fontWeight: active ? 700 : 500,
  textAlign: "left",
});
