// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE } from "../constants";
import { Fld, FI, FS, Btn } from "../components/UI";
import MemberSearchSelect from "../components/MemberSearchSelect";

export default function KpiEntryModal() {
  const {
    showAddKpi, setShowAddKpi, newKpi, setNewKpi, allJds, krasForJd,
    saveNewKpi, customUnits, kpisSaving, kpiAssignUsers, kpiAssignUsersLoading,
    kpiModalJdsLoading, kpiModalJdsError, kpiModalKras, kpiModalKrasLoading, kpiModalKrasError,
    kpiKraSearch, setKpiKraSearch,
  } = useJobs();
  if (!showAddKpi) return null;
  const assigneeOptions = kpiAssignUsers;
  const kraOptions = newKpi.jdId ? kpiModalKras : krasForJd(newKpi.jdId);
  const kraBlockedReason = !newKpi.jdId
    ? "Select a job description to load KRAs"
    : !newKpi.departmentId
      ? "Enter department ID to load KRAs"
      : !newKpi.assigneeIds?.[0]
        ? "Select an assignee to load KRAs"
        : "";
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
              gridTemplateColumns: "1fr 1fr 1fr",
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
                    kraId: "",
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
            <Fld label="Department ID">
              <FI
                type="number"
                placeholder="e.g. 12"
                value={newKpi.departmentId || ""}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, departmentId: e.target.value, kraId: "" }))
                }
              />
            </Fld>
            <Fld label="Assignee Person">
              <MemberSearchSelect
                value={newKpi.assigneeIds?.[0] || ""}
                options={assigneeOptions}
                onChange={(value, member) => {
                  setNewKpi((f) => ({
                    ...f,
                    kraId: "",
                    assignee: member?.name || "",
                    assigneeIds: value ? [Number(value)] : [],
                  }));
                }}
                placeholder="Select assignee"
                loading={kpiAssignUsersLoading}
                disabled={kpisSaving || kpiAssignUsersLoading}
              />
            </Fld>
          </div>
          <Fld label="Linked KRA *">
            {kraBlockedReason ? (
              <FI value="" placeholder={kraBlockedReason} disabled />
            ) : (
              <>
                <FI
                  placeholder="Search KRA"
                  value={kpiKraSearch}
                  onChange={(e) => setKpiKraSearch(e.target.value)}
                  disabled={kpisSaving}
                  style={{ minHeight: 38, marginBottom: 6 }}
                />
                <FS
                  value={newKpi.kraId}
                  disabled={kpiModalKrasLoading || kpisSaving}
                  onChange={(e) =>
                    setNewKpi((f) => ({ ...f, kraId: e.target.value }))
                  }
                >
                  <option value="">{kpiModalKrasLoading ? "Loading KRAs..." : "Select KRA"}</option>
                  {kraOptions.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.title}
                    </option>
                  ))}
                </FS>
              </>
            )}
            {kpiModalKrasError && (
              <span style={{ fontSize: 11, color: T.danger }}>Could not load KRAs: {kpiModalKrasError}</span>
            )}
          </Fld>
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
            <Fld label="KPI Unit">
              <FS
                value={newKpi.unit}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, unit: e.target.value }))
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
                placeholder="e.g. 15"
                value={newKpi.weightage}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, weightage: e.target.value }))
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
                placeholder="e.g. 95"
                value={newKpi.target}
                onChange={(e) =>
                  setNewKpi((f) => ({ ...f, target: e.target.value }))
                }
              />
            </Fld>
            <Fld label="Target Frequency">
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
            <Fld label="Update Type">
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
              <Fld label="Data Source">
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
                <Fld label="Module">
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
          <Btn primary onClick={saveNewKpi}>
            {kpisSaving ? "Saving..." : "Submit"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
