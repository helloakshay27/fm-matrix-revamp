// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, FS, Btn } from "../components/UI";

export default function AssignEntityToMemberModal() {
  const { assignKraMemberModal, setAssignKraMemberModal, assignKraMemberKraId, setAssignKraMemberKraId, allMembers, allKras, jdTitle, assignKraToMember } = useJobs();
  if (!assignKraMemberModal) return null;
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
      onClick={() => {
        setAssignKraMemberModal(null);
        setAssignKraMemberKraId("");
      }}
    >
      <div
        style={{
          width: 440,
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
          Assign KRA to Member
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 20 }}>
          Select a KRA to assign to{" "}
          <strong>
            {allMembers.find((m) => m.id === assignKraMemberModal)?.name}
          </strong>
          .
        </p>
        <Fld label="Select KRA">
          <FS
            value={assignKraMemberKraId}
            onChange={(e) => setAssignKraMemberKraId(e.target.value)}
          >
            <option value="">Choose a KRA</option>
            {allKras
              .filter((k) => k.status === "active")
              .map((k) => (
                <option key={k.id} value={k.id}>
                  {k.title} ({jdTitle(k.jdId)})
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
          <Btn
            onClick={() => {
              setAssignKraMemberModal(null);
              setAssignKraMemberKraId("");
            }}
          >
            Cancel
          </Btn>
          <Btn
            primary
            disabled={!assignKraMemberKraId}
            onClick={assignKraToMember}
          >
            Assign
          </Btn>
        </div>
      </div>
    </div>
  );
}
