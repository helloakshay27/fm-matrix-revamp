// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, DEPARTMENTS } from "../constants";
import { Fld, FI, FS, Btn } from "../components/UI";
import { ico } from "../icons";

export default function InviteModal() {
  const {
    showInviteModal, setShowInviteModal,
    inviteMode, inviteRows,
    updateInviteRow, removeInviteRow, addInviteRow,
    sendInvites,
  } = useJobs();
  if (!showInviteModal) return null;

  const dashedBtn = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: 12,
    borderRadius: T.rmd,
    border: `2px dashed ${T.borderWarm}`,
    background: "transparent",
    cursor: "pointer",
    color: T.inkSoft,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: T.font,
  };

  const gBtn = {
    width: 32,
    height: 32,
    borderRadius: T.rsm,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: T.inkMuted,
    display: "grid",
    placeItems: "center",
    transition: "all .16s",
    padding: 0,
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
      onClick={() => setShowInviteModal(false)}
    >
      <div
        style={{
          width: 580,
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
          {inviteMode === "bulk" ? "Bulk Invite Members" : "Invite Member"}
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>
          {inviteMode === "bulk"
            ? "Add multiple team members at once. Fill in their details below."
            : "Send an invite to a new team member."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {inviteRows.map((row, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                padding: inviteMode === "bulk" ? "14px 16px" : 0,
                background:
                  inviteMode === "bulk" ? T.surface : "transparent",
                borderRadius: T.rmd,
                border:
                  inviteMode === "bulk"
                    ? `1px solid ${T.borderSoft}`
                    : "none",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 12,
                  flex: 1,
                }}
              >
                <Fld label="Full Name *">
                  <FI
                    placeholder="e.g. Priya Sharma"
                    value={row.name}
                    onChange={(e) =>
                      updateInviteRow(idx, "name", e.target.value)
                    }
                  />
                </Fld>
                <Fld label="Email Address *">
                  <FI
                    type="email"
                    placeholder="e.g. priya@company.com"
                    value={row.email}
                    onChange={(e) =>
                      updateInviteRow(idx, "email", e.target.value)
                    }
                  />
                </Fld>
                <Fld label="Department">
                  <FS
                    value={row.department}
                    onChange={(e) =>
                      updateInviteRow(idx, "department", e.target.value)
                    }
                  >
                    <option value="">Select (optional)</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </FS>
                </Fld>
              </div>
              {inviteMode === "bulk" && inviteRows.length > 1 && (
                <button
                  style={{ ...gBtn, marginBottom: 6 }}
                  onClick={() => removeInviteRow(idx)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = T.danger;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = T.inkMuted;
                  }}
                >
                  {ico.trash}
                </button>
              )}
            </div>
          ))}
          {inviteMode === "bulk" && (
            <button style={dashedBtn} onClick={addInviteRow}>
              {ico.plus} Add Another Member
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 22,
          }}
        >
          <span style={{ fontSize: 12, color: T.inkMuted }}>
            {inviteRows.filter((r) => r.name && r.email).length} valid
            invite
            {inviteRows.filter((r) => r.name && r.email).length !== 1
              ? "s"
              : ""}{" "}
            ready
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setShowInviteModal(false)}>Cancel</Btn>
            <Btn primary onClick={sendInvites}>
              Send Invite
              {inviteRows.filter((r) => r.name && r.email).length > 1
                ? "s"
                : ""}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
