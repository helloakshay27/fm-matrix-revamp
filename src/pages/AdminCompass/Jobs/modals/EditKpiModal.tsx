// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE } from "../constants";
import { Fld, FI, FS, Btn } from "../components/UI";

/**
 * Sirf KPI ki apni details edit hoti hain. JD, Department, Assignee aur Linked
 * KRA create ke waqt hi tay hote hain — baad me yahan se nahi badalte (assignee
 * "Assign Person" flow se badalta hai, jo KRA bhi saath me handle karta hai).
 */
export default function EditKpiModal() {
  const {
    editingKpiId, setEditingKpiId, editKpiForm, setEditKpiForm, customUnits, saveEditKpi,
    kpisSaving, kraWeightageLimit, kraWeightageUsed,
  } = useJobs();
  if (!editingKpiId) return null;
  // Baaki KPIs ka weightage (khud ko chhodkar) — total 100% se upar nahi ja sakta.
  const kraUsedWeightage = editKpiForm.kraId
    ? kraWeightageUsed(editKpiForm.kraId, editingKpiId)
    : 0;
  const kraTotalWeightage = editKpiForm.kraId ? kraWeightageLimit(editKpiForm.kraId) : 100;
  const kraRemainingWeightage = Math.max(0, kraTotalWeightage - kraUsedWeightage);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(44,44,44,.32)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        backdropFilter: "blur(2px)",
      }}
      onClick={() => setEditingKpiId(null)}
    >
      <div
        style={{
          width: 560,
          maxWidth: "92vw",
          background: T.raised,
          borderRadius: T.rxl,
          padding: 28,
          boxShadow: "0 8px 40px rgba(44,44,44,.14)",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            marginTop: 0,
            marginBottom: 4,
          }}
        >
          Edit KPI
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>
          Update the Key Performance Indicator details.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="KPI Name *">
              <FI
                value={editKpiForm.name || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </Fld>
            <Fld label="KPI Unit">
              <FS
                value={editKpiForm.unit || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, unit: e.target.value }))
                }
              >
                <option value="">Select</option>
                {customUnits.map((u) => (
                  <option key={u.name}>{u.name}</option>
                ))}
              </FS>
            </Fld>
            <Fld
              label="KPI Weightage (%)"
              hint={
                editKpiForm.kraId
                  ? `${kraUsedWeightage}% used by other KPIs, ${kraRemainingWeightage}% left of ${kraTotalWeightage}% KRA weightage`
                  : undefined
              }
            >
              <FI
                type="number"
                min={0}
                max={kraRemainingWeightage}
                value={editKpiForm.weightage || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, weightage: e.target.value }))
                }
              />
              {editKpiForm.kraId &&
                Number(editKpiForm.weightage) > kraRemainingWeightage && (
                  <span style={{ fontSize: 11, color: T.danger }}>
                    Exceeds {kraTotalWeightage}% total for this KRA
                  </span>
                )}
            </Fld>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Target Value *">
              <FI
                value={editKpiForm.target || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, target: e.target.value }))
                }
              />
            </Fld>
            <Fld label="Target Frequency">
              <FS
                value={editKpiForm.freq || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, freq: e.target.value }))
                }
              >
                <option value="">Select</option>
                {TARGET_FREQ.map((fr) => (
                  <option key={fr}>{fr}</option>
                ))}
              </FS>
            </Fld>
          </div>
          <Fld label="Update Type">
            <FS
              value={editKpiForm.updateType || "manual"}
              onChange={(e) =>
                setEditKpiForm((f) => ({
                  ...f,
                  updateType: e.target.value,
                  dataSource: e.target.value === "manual" ? "" : f.dataSource,
                }))
              }
            >
              <option value="manual">Manual Entry</option>
              <option value="automatic">Automatic</option>
            </FS>
          </Fld>
          {editKpiForm.updateType === "automatic" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Fld label="Data Source">
                <FS
                  value={editKpiForm.dataSource || ""}
                  onChange={(e) =>
                    setEditKpiForm((f) => ({
                      ...f,
                      dataSource: e.target.value,
                      module: "",
                    }))
                  }
                >
                  <option value="">Select data source</option>
                  {DATA_SOURCES.map((ds) => (
                    <option key={ds}>{ds}</option>
                  ))}
                </FS>
              </Fld>
              {editKpiForm.dataSource && (
                <Fld label="Module">
                  <FS
                    value={editKpiForm.module || ""}
                    onChange={(e) =>
                      setEditKpiForm((f) => ({ ...f, module: e.target.value }))
                    }
                  >
                    <option value="">Select module</option>
                    {(MODULES_BY_SOURCE[editKpiForm.dataSource] || []).map(
                      (m) => (
                        <option key={m}>{m}</option>
                      )
                    )}
                  </FS>
                </Fld>
              )}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 22,
          }}
        >
          <Btn onClick={() => setEditingKpiId(null)}>Cancel</Btn>
          <Btn primary onClick={saveEditKpi}>
            {kpisSaving ? "Saving..." : "Save Changes"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
