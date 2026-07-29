// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, KPI_UNITS, TARGET_FREQ, DATA_SOURCES, MODULES_BY_SOURCE } from "../constants";
import { Fld, FI, FT, FS, Btn } from "../components/UI";

export default function AssignToJdModal() {
  const { assignModal, setAssignModal, assignName, setAssignName, assignUser } = useJobs();
  if (!assignModal) return null;
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
          Add a team member for performance tracking.
        </p>
        <Fld label="Member Name">
          <FI
            placeholder="e.g. Priya Sharma"
            value={assignName}
            onChange={(e) => setAssignName(e.target.value)}
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
          <Btn primary onClick={assignUser}>
            Assign
          </Btn>
        </div>
      </div>
    </div>
  );
}
