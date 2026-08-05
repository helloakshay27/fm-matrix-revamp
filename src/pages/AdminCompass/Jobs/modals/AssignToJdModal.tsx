// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, Btn } from "../components/UI";
import MemberSearchSelect from "../components/MemberSearchSelect";
import { useEscalateUsers } from "../hooks/useEscalateUsers";

export default function AssignToJdModal() {
  const {
    assignModal, setAssignModal, assignJdUserIds, setAssignJdUserIds,
    assignUser, jdAssignSaving,
  } = useJobs();
  const { data: escalateUsers = [], isLoading, error } = useEscalateUsers();

  if (!assignModal) return null;

  const memberOptions = escalateUsers.map((u) => ({
    id: u.id,
    name: u.full_name || u.name || `User ${u.id}`,
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
      onClick={() => setAssignModal(null)}
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
          Assign Member
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>
          Add team members for performance tracking.
        </p>
        <Fld
          label="Members"
          hint={
            error
              ? `Could not load users: ${error.message}`
              : "Already assigned members pehle se selected hain — hataane ke liye unselect karein."
          }
        >
          <MemberSearchSelect
            multiple
            value={assignJdUserIds}
            options={memberOptions}
            onChange={setAssignJdUserIds}
            placeholder="Select members"
            loading={isLoading}
            disabled={isLoading || jdAssignSaving}
          />
        </Fld>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Btn onClick={() => setAssignModal(null)}>Cancel</Btn>
          <Btn primary onClick={assignUser} disabled={isLoading || jdAssignSaving}>
            {jdAssignSaving ? "Assigning..." : "Assign"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
