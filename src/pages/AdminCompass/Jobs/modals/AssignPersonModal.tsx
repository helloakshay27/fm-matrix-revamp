// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, FI, Btn } from "../components/UI";

export default function AssignPersonModal() {
  const { assignKraModal, setAssignKraModal, assignKraName, setAssignKraName, assignToKra } = useJobs();
  if (!assignKraModal) return null;
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
      onClick={() => setAssignKraModal(null)}
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
          Assign Person to KRA
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>
          Assign a team member to this Key Result Area.
        </p>
        <Fld label="Member Name">
          <FI
            placeholder="e.g. Priya Sharma"
            value={assignKraName}
            onChange={(e) => setAssignKraName(e.target.value)}
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
          <Btn onClick={() => setAssignKraModal(null)}>Cancel</Btn>
          <Btn primary onClick={assignToKra}>
            Assign
          </Btn>
        </div>
      </div>
    </div>
  );
}
