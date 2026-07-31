import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, FS, Btn } from "../components/UI";
import { useEscalateUsers } from "../hooks/useEscalateUsers";

export default function AssignToJdModal() {
  const { assignModal, setAssignModal, assignUserId, setAssignUserId, setAssignUserName, assignUser } = useJobs();
  const { data: escalateUsers = [], isLoading, error } = useEscalateUsers();

  if (!assignModal) return null;

  const handleUserChange = (e) => {
    const userId = e.target.value ? Number(e.target.value) : null;
    setAssignUserId(userId);
    if (userId) {
      const selectedUser = escalateUsers.find((u) => u.id === userId);
      setAssignUserName(selectedUser?.full_name || "");
    } else {
      setAssignUserName("");
    }
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
        <Fld
          label="Member"
          hint={error ? `Could not load users: ${error.message}` : undefined}
        >
          <FS
            value={assignUserId || ""}
            onChange={handleUserChange}
            disabled={isLoading}
          >
            <option value="">Select member</option>
            {escalateUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.full_name}
              </option>
            ))}
          </FS>
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
          <Btn primary onClick={assignUser} disabled={!assignUserId || isLoading}>
            Assign
          </Btn>
        </div>
      </div>
    </div>
  );
}
