// @ts-nocheck
import { toast } from "sonner";
import { useJobs } from "../JobsContext";
import { T, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE } from "../constants";
import { Fld, FI, FS, Btn } from "../components/UI";
import UnitField from "../components/UnitField";
import MemberSearchSelect from "../components/MemberSearchSelect";
import { useDepartments } from "../hooks/useDepartments";

export default function KpiEntryModal() {
  const { data: departments = [], isLoading: deptLoading } = useDepartments();
  const {
    showAddKpi, setShowAddKpi, newKpi, setNewKpi, allJds,
    saveNewKpi, kpisSaving, kpiAssignUsers, kpiAssignUsersLoading,
    kpiModalJdsLoading, kpiModalJdsError, kpiModalKras, kpiModalKrasLoading, kpiModalKrasError,
    kraWeightageLimit, kraWeightageUsed,
  } = useJobs();
  if (!showAddKpi) return null;
  const assigneeOptions = kpiAssignUsers;
  // Selected KRA me kitna weightage bacha hai — total 100% se upar nahi ja sakta.
  const kraUsedWeightage = newKpi.kraId ? kraWeightageUsed(newKpi.kraId) : 0;
  const kraTotalWeightage = newKpi.kraId ? kraWeightageLimit(newKpi.kraId) : 100;
  const kraRemainingWeightage = Math.max(0, kraTotalWeightage - kraUsedWeightage);
  // Search + list ek hi input me — MemberSearchSelect khud filter karta hai.
  const kraOptions = kpiModalKras.map((k) => ({ id: k.id, name: k.title }));
  const departmentOptions = departments.map((d) => ({
    id: d.id,
    name: d.department_name || d.name || d.title || "Unnamed department",
  }));

  // Returns the first validation error, or null if the form is complete.
  const getKpiError = () => {
    if (!newKpi.jdId) return "Job Description is required";
    if (!newKpi.kraId) return "Linked KRA is required";
    if (!newKpi.name?.trim()) return "KPI Name is required";
    if (!newKpi.unit) return "KPI Unit is required";
    if (!newKpi.target?.toString().trim()) return "Target Value is required";
    if (!newKpi.freq) return "Target Frequency is required";
    if (!newKpi.weightage || Number(newKpi.weightage) <= 0) return "KPI Weightage must be greater than 0%";
    if (newKpi.kraId && Number(newKpi.weightage) > kraRemainingWeightage)
      return `KPI weightage exceeds the remaining ${kraRemainingWeightage}% for this KRA`;
    if (newKpi.updateType === "automatic" && !newKpi.dataSource)
      return "Data Source is required for Automatic update type";
    if (newKpi.updateType === "automatic" && newKpi.dataSource && !newKpi.module)
      return "Module is required after selecting a Data Source";
    return null;
  };

  const handleKpiSubmit = () => {
    const err = getKpiError();
    if (err) { toast.error(err); return; }
    saveNewKpi();
  };
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
      onClick={() => setShowAddKpi(false)}
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
          Add New KPI
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>
          Define a measurable indicator and link it to a KRA.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Job Description *">
              <FS
                value={newKpi.jdId}
                disabled={kpiModalJdsLoading || kpisSaving}
                onChange={(e) =>
                  setNewKpi((f) => ({
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
                value={newKpi.departmentId || ""}
                options={departmentOptions}
                onChange={(value) =>
                  setNewKpi((f) => ({ ...f, departmentId: value }))
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
                value={(newKpi.assigneeIds || []).map(String)}
                options={assigneeOptions}
                onChange={(values) => {
                  const ids = (values || [])
                    .map(Number)
                    .filter((id) => Number.isFinite(id));
                  setNewKpi((f) => ({
                    ...f,
                    assignee: assigneeOptions
                      .filter((u) => ids.some((id) => Number(u.id) === id))
                      .map((u) => u.name)
                      .join(", "),
                    assigneeIds: ids,
                  }));
                }}
                placeholder="Select assignees"
                loading={kpiAssignUsersLoading}
                disabled={kpisSaving || kpiAssignUsersLoading}
              />
            </Fld>
            <Fld label="Linked KRA *">
              <MemberSearchSelect
                value={newKpi.kraId}
                options={kraOptions}
                onChange={(value) =>
                  setNewKpi((f) => ({ ...f, kraId: value }))
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
                placeholder="e.g. Revenue closed"
                value={newKpi.name}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, name: e.target.value }))
                }
              />
            </Fld>
            <UnitField
              value={newKpi.unit}
              onChange={(unit) => setNewKpi((f) => ({ ...f, unit }))}
              disabled={kpisSaving}
            />
            <Fld
              label="KPI Weightage (%) *"
              hint={
                newKpi.kraId
                  ? `${kraUsedWeightage}% used, ${kraRemainingWeightage}% left of ${kraTotalWeightage}% KRA weightage`
                  : undefined
              }
            >
              <FI
                type="number"
                min={0}
                max={kraRemainingWeightage}
                placeholder="e.g. 15"
                value={newKpi.weightage}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, weightage: e.target.value }))
                }
              />
              {newKpi.kraId &&
                Number(newKpi.weightage) > kraRemainingWeightage && (
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
                placeholder="e.g. 95"
                value={newKpi.target}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, target: e.target.value }))
                }
              />
            </Fld>
            <Fld label="Target Frequency *">
              <FS
                value={newKpi.freq}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, freq: e.target.value }))
                }
              >
                <option value="">Select</option>
                {TARGET_FREQ.map((fr) => (
                  <option key={fr}>{fr}</option>
                ))}
              </FS>
            </Fld>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Update Type *">
              <FS
                value={newKpi.updateType}
                onChange={(e) =>
                  setNewKpi((f) => ({
                    ...f,
                    updateType: e.target.value,
                    dataSource:
                      e.target.value === "manual" ? "" : f.dataSource,
                  }))
                }
              >
                <option value="manual">Manual Entry</option>
                <option value="automatic">Automatic</option>
              </FS>
            </Fld>
            <Fld
              label="Measurement Type"
              hint={
                newKpi.measurementType === "negative"
                  ? "Missing target deducts points"
                  : "Missing target doesn't deduct"
              }
            >
              <FS
                value={newKpi.measurementType || "positive"}
                onChange={(e) =>
                  setNewKpi((f) => ({
                    ...f,
                    measurementType: e.target.value,
                  }))
                }
              >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
              </FS>
            </Fld>
          </div>
          {newKpi.updateType === "automatic" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <Fld label="Data Source *">
                <FS
                  value={newKpi.dataSource}
                  onChange={(e) =>
                    setNewKpi((f) => ({
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
              {newKpi.dataSource && (
                <Fld label="Module *">
                  <FS
                    value={newKpi.module}
                    onChange={(e) =>
                      setNewKpi((f) => ({ ...f, module: e.target.value }))
                    }
                  >
                    <option value="">Select module</option>
                    {(MODULES_BY_SOURCE[newKpi.dataSource] || []).map(
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
          <Btn onClick={() => setShowAddKpi(false)}>Cancel</Btn>
          <Btn
            primary
            onClick={handleKpiSubmit}
            disabled={kpisSaving}
            softDisabled={!!getKpiError()}
          >
            {kpisSaving ? "Saving..." : "Submit"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
