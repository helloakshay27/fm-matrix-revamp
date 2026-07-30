// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE } from "../constants";
import { Fld, FI, FS, Btn } from "../components/UI";

export default function EditKpiModal() {
  const { editingKpiId, setEditingKpiId, editKpiForm, setEditKpiForm, customUnits, saveEditKpi, allJds, allKras, krasForJd, allMembers, kpisSaving } = useJobs();
  if (!editingKpiId) return null;
  const editKras = editKpiForm.jdId ? krasForJd(editKpiForm.jdId) : allKras;
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
            <Fld label="Job Description">
              <FS
                value={editKpiForm.jdId || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({
                    ...f,
                    jdId: e.target.value,
                    kraId: "",
                  }))
                }
              >
                <option value="">Select JD</option>
                {allJds.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </FS>
            </Fld>
            <Fld label="Linked KRA">
              <FS
                value={editKpiForm.kraId || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, kraId: e.target.value }))
                }
              >
                <option value="">Select KRA</option>
                {editKras.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.title}
                  </option>
                ))}
              </FS>
            </Fld>
            <Fld label="Department ID">
              <FI
                type="number"
                value={editKpiForm.departmentId || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, departmentId: e.target.value }))
                }
              />
            </Fld>
          </div>
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
            <Fld label="KPI Weightage (%)">
              <FI
                type="number"
                value={editKpiForm.weightage || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, weightage: e.target.value }))
                }
              />
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Measurement Type">
              <FS
                value={editKpiForm.measurementType || "positive"}
                onChange={(e) =>
                  setEditKpiForm((f) => ({ ...f, measurementType: e.target.value }))
                }
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </FS>
            </Fld>
            <Fld label="Assignee Person">
              <FS
                value={editKpiForm.assigneeIds?.[0] || ""}
                onChange={(e) =>
                  setEditKpiForm((f) => ({
                    ...f,
                    assigneeIds: e.target.value ? [Number(e.target.value)] : [],
                  }))
                }
              >
                <option value="">Select assignee</option>
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </FS>
            </Fld>
          </div>
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
