// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE } from "../constants";
import { Fld, FI, FS, Btn } from "../components/UI";
import MemberSearchSelect from "../components/MemberSearchSelect";
import { useDepartments } from "../hooks/useDepartments";

export default function EditKpiModal() {
  const { data: departments = [], isLoading: deptLoading } = useDepartments();
  const {
    editingKpiId, setEditingKpiId, editKpiForm, setEditKpiForm, customUnits, saveEditKpi,
    allJds, kpisSaving, kpiAssignUsers, kpiAssignUsersLoading,
    kpiModalJdsLoading, kpiModalJdsError, kpiModalKras, kpiModalKrasLoading, kpiModalKrasError,
    kraWeightageUsed,
  } = useJobs();
  if (!editingKpiId) return null;
  const assigneeOptions = kpiAssignUsers;
  // Baaki KPIs ka weightage (khud ko chhodkar) — total 100% se upar nahi ja sakta.
  const kraUsedWeightage = editKpiForm.kraId
    ? kraWeightageUsed(editKpiForm.kraId, editingKpiId)
    : 0;
  const kraRemainingWeightage = Math.max(0, 100 - kraUsedWeightage);
  // Search + list ek hi input me — MemberSearchSelect khud filter karta hai.
  const editKras = kpiModalKras.map((k) => ({ id: k.id, name: k.title }));
  const departmentOptions = departments.map((d) => ({
    id: d.id,
    name: d.department_name || d.name || d.title || "Unnamed department",
  }));
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
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Job Description">
              <FS
                value={editKpiForm.jdId || ""}
                disabled={kpiModalJdsLoading || kpisSaving}
                onChange={(e) =>
                  setEditKpiForm((f) => ({
                    ...f,
                    jdId: e.target.value,
                    departmentId:
                      allJds.find((j) => String(j.id) === String(e.target.value))?.departmentId ||
                      f.departmentId,
                  }))
                }
              >
                <option value="">{kpiModalJdsLoading ? "Loading JDs..." : "Select JD"}</option>
                {allJds.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </FS>
              {kpiModalJdsError && (
                <span style={{ fontSize: 11, color: T.danger }}>Could not load JDs: {kpiModalJdsError}</span>
              )}
            </Fld>
            <Fld label="Department">
              <MemberSearchSelect
                value={editKpiForm.departmentId || ""}
                options={departmentOptions}
                onChange={(value) =>
                  setEditKpiForm((f) => ({ ...f, departmentId: value }))
                }
                placeholder="Search and select department"
                loading={deptLoading}
                loadingText="Loading departments..."
                emptyText="No departments found"
                disabled={deptLoading || kpisSaving}
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
            <Fld label="Assignee Person">
              <MemberSearchSelect
                multiple
                value={(editKpiForm.assigneeIds || []).map(String)}
                options={assigneeOptions}
                onChange={(values) =>
                  setEditKpiForm((f) => ({
                    ...f,
                    assigneeIds: (values || [])
                      .map(Number)
                      .filter((id) => Number.isFinite(id)),
                  }))
                }
                placeholder="Select assignees"
                loading={kpiAssignUsersLoading}
                disabled={kpisSaving || kpiAssignUsersLoading}
              />
            </Fld>
            <Fld label="Linked KRA">
              <MemberSearchSelect
                value={editKpiForm.kraId || ""}
                options={editKras}
                onChange={(value) =>
                  setEditKpiForm((f) => ({ ...f, kraId: value }))
                }
                placeholder="Search and select KRA"
                loading={kpiModalKrasLoading}
                loadingText="Loading KRAs..."
                emptyText="No KRAs found"
                disabled={kpisSaving || kpiModalKrasLoading}
              />
              {kpiModalKrasError && (
                <span style={{ fontSize: 11, color: T.danger }}>Could not load KRAs: {kpiModalKrasError}</span>
              )}
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
            <Fld
              label="KPI Weightage (%)"
              hint={
                editKpiForm.kraId
                  ? `${kraUsedWeightage}% used by other KPIs, ${kraRemainingWeightage}% left`
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
                    Exceeds 100% total for this KRA
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
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
