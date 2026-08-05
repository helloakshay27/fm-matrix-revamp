// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, Btn } from "../components/UI";
import MemberSearchSelect from "../components/MemberSearchSelect";

export default function AssignPersonModal() {
  const {
    assignKraModal, setAssignKraModal, assignKraUserIds, setAssignKraUserIds,
    kraAssignUsers, assignToKra, krasSaving,
    assignKpiModal, setAssignKpiModal, assignKpiUserIds, setAssignKpiUserIds,
    kpiAssignUsers, kpiAssignUsersLoading, kpiAssignUsersError, loadKpiAssignUsers,
    assignToKpi, kpisSaving,
  } = useJobs();
  const isKpiAssign = !!assignKpiModal;
  const isKraAssign = !!assignKraModal;
  if (!isKraAssign && !isKpiAssign) return null;
  const close = () => {
    if (isKpiAssign) setAssignKpiModal(null);
    else setAssignKraModal(null);
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
      onClick={close}
    >
      <div
        style={{
          width: 420,
          maxWidth: "92vw",
          background: T.raised,
          borderRadius: T.rxl,
          padding: 28,
          boxShadow: "0 8px 40px rgba(44,44,44,.14)",
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
          Assign {isKpiAssign ? "Person" : "Members"} to {isKpiAssign ? "KPI" : "KRA"}
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>
          Assign team members to this {isKpiAssign ? "Key Performance Indicator" : "Key Result Area"}.
        </p>
        {isKpiAssign ? (
          <Fld
            label="Member"
            hint={
              kpiAssignUsersError
                ? `Could not load users: ${kpiAssignUsersError}`
                : undefined
            }
          >
            <MemberSearchSelect
              value={assignKpiUserIds}
              options={kpiAssignUsers}
              onChange={setAssignKpiUserIds}
              placeholder="Select member"
              disabled={kpiAssignUsersLoading || kpisSaving}
              loading={kpiAssignUsersLoading}
              multiple
            />
            {kpiAssignUsersError && (
              <Btn onClick={loadKpiAssignUsers} disabled={kpiAssignUsersLoading} style={{ marginTop: 4 }}>
                Retry
              </Btn>
            )}
          </Fld>
        ) : (
          <Fld
            label="Members"
            hint={
              kpiAssignUsersError
                ? `Could not load users: ${kpiAssignUsersError}`
                : "Ek se zyada member chun sakte hain — selection hi final list hai, unselect karne par member hat jayega."
            }
          >
            <MemberSearchSelect
              multiple
              value={assignKraUserIds}
              options={kraAssignUsers}
              onChange={setAssignKraUserIds}
              placeholder="Select members"
              disabled={kpiAssignUsersLoading || krasSaving}
              loading={kpiAssignUsersLoading}
            />
            {kpiAssignUsersError && (
              <Btn onClick={loadKpiAssignUsers} disabled={kpiAssignUsersLoading} style={{ marginTop: 4 }}>
                Retry
              </Btn>
            )}
          </Fld>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Btn onClick={close}>Cancel</Btn>
          <Btn
            primary
            onClick={isKpiAssign ? assignToKpi : assignToKra}
            // Loading flag button ko block nahi karta — jab tak list load ho rahi
            // hai selection khali hoti hai, wahi check kaafi hai.
            disabled={
              isKpiAssign
                ? !assignKpiUserIds.length || kpisSaving
                : !assignKraUserIds.length || krasSaving
            }
          >
            {(isKpiAssign ? kpisSaving : krasSaving) ? "Assigning..." : "Assign"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
