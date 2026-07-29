// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, KPI_UNITS } from "../constants";
import { ico } from "../icons";
import { card, FI, Btn, SH, aBtn } from "./UI";

export default function SettingsUnits() {
  const {
    customUnits,
    newUnitInput,
    setNewUnitInput,
    addCustomUnit,
    removeCustomUnit,
  } = useJobs();

  return (
    <div>
      <div style={{ ...card, maxWidth: 640 }}>
        <SH
          icon={ico.wrench}
          title="KPI Units Configuration"
          sub="Define organisation-wide units for measuring KPIs. These units will appear in all KPI creation forms."
        />
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <FI
            placeholder="e.g. Tickets, NPS Score, Tasks"
            value={newUnitInput}
            onChange={(e) => setNewUnitInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomUnit()}
            style={{ flex: 1 }}
          />
          <Btn primary onClick={addCustomUnit}>
            {ico.plus} Add Unit
          </Btn>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {customUnits.map((unit, i) => {
            const isDefault = KPI_UNITS.includes(unit);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 16px",
                  background: T.raised,
                  border: `1px solid ${T.borderSoft}`,
                  borderRadius: T.rmd,
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.boxShadow = T.shadow)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.boxShadow = "none")
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>
                    {unit}
                  </span>
                  {isDefault && (
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 600,
                        background: T.kpiBlue,
                        color: T.ink,
                      }}
                    >
                      Default
                    </span>
                  )}
                </div>
                {!isDefault && (
                  <button
                    style={aBtn}
                    title="Remove"
                    onClick={() => removeCustomUnit(unit)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        "rgba(228,145,145,.1)";
                      e.currentTarget.style.color = T.danger;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = T.raised;
                      e.currentTarget.style.color = T.inkMuted;
                    }}
                  >
                    {ico.trash}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
