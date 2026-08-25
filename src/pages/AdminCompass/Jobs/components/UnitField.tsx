// @ts-nocheck
import { useEffect, useState } from "react";
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, FI, FS, Btn } from "./UI";

/* KPI Unit ka select + "Create new unit" — link dabate hi chhota modal khulta hai.
   Ek hi component JD create step aur Add KPI modal dono jagah use hota hai,
   isliye unit list aur creation behaviour har jagah same rehta hai. */
export default function UnitField({
  label = "KPI Unit *",
  value,
  onChange,
  extraOptions = [],
  disabled = false,
  hint,
}) {
  const { customUnits, createCustomUnit, unitsSaving } = useJobs();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  // Esc se modal band — saving ke beech me nahi.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !unitsSaving) {
        setDraft("");
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, unitsSaving]);

  // Settings ke units + is record par pehle se set units (AI/legacy values bhi
  // dropdown me dikhein, warna select blank lagta hai).
  const options = [...customUnits.map((u) => u.name), ...extraOptions, value]
    .map((unit) => String(unit || "").trim())
    .filter(Boolean)
    .filter(
      (unit, index, units) =>
        units.findIndex((item) => item.toLowerCase() === unit.toLowerCase()) ===
        index
    );

  const close = () => {
    if (unitsSaving) return;
    setDraft("");
    setOpen(false);
  };

  const submitNewUnit = async () => {
    const created = await createCustomUnit(draft);
    if (!created) return;
    onChange(created);
    setDraft("");
    setOpen(false);
  };

  return (
    <>
      <Fld label={label} hint={hint}>
        <FS
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">Select unit</option>
          {options.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </FS>
        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={disabled}
          style={{
            alignSelf: "center",
            padding: 0,
            border: "none",
            background: "transparent",
            color: disabled ? T.inkMuted : T.orange,
            fontFamily: T.font,
            fontSize: 11.5,
            fontWeight: 600,
            whiteSpace: "nowrap",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          + Create new unit
        </button>
      </Fld>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44,44,44,.32)",
            display: "grid",
            placeItems: "center",
            zIndex: 70,
            backdropFilter: "blur(2px)",
          }}
          onClick={(e) => {
            // Add KPI modal ke andar se khulta hai — click upar tak na jaaye.
            e.stopPropagation();
            close();
          }}
        >
          <div
            style={{
              width: 420,
              maxWidth: "92vw",
              background: T.raised,
              borderRadius: T.rxl,
              padding: 26,
              boxShadow: "0 8px 40px rgba(44,44,44,.14)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 4px" }}>
              Create New Unit
            </h3>
            <p style={{ fontSize: 12.5, color: T.inkMuted, margin: "0 0 20px" }}>
              This unit is saved for the organisation and will appear in every
              KPI form.
            </p>
            <Fld label="Unit Name *">
              <FI
                autoFocus
                placeholder="e.g. Tickets, NPS Score, Tasks"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!unitsSaving && draft.trim()) submitNewUnit();
                  }
                }}
                disabled={unitsSaving}
              />
            </Fld>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 22,
              }}
            >
              <Btn onClick={close} disabled={unitsSaving}>
                Cancel
              </Btn>
              <Btn
                primary
                disabled={unitsSaving}
                softDisabled={!draft.trim()}
                onClick={() => {
                  if (!draft.trim()) return;
                  submitNewUnit();
                }}
              >
                {unitsSaving ? "Saving…" : "Add Unit"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
