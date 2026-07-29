// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T, DEPARTMENTS } from "../constants";
import { Fld, FI, FS, Btn } from "../components/UI";
import { I } from "../icons";

export default function EditMemberModal() {
  const { editingMember, setEditingMember, editMemberForm, setEditMemberForm, saveEditMember } = useJobs();
  if (!editingMember) return null;
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
      onClick={() => setEditingMember(null)}
    >
      <div
        style={{
          width: 480,
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
          Edit Member
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>
          Update member details and role assignments.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Full Name *">
              <FI
                value={editMemberForm.name}
                onChange={(e) =>
                  setEditMemberForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </Fld>
            <Fld label="Email Address *">
              <FI
                type="email"
                value={editMemberForm.email}
                onChange={(e) =>
                  setEditMemberForm((f) => ({ ...f, email: e.target.value }))
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
            <Fld label="Department">
              <FS
                value={editMemberForm.department}
                onChange={(e) =>
                  setEditMemberForm((f) => ({ ...f, department: e.target.value }))
                }
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </FS>
            </Fld>
            <Fld label="Mark as HOD">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minHeight: 44,
                  padding: "0 14px",
                  border: `1px solid ${T.borderSoft}`,
                  borderRadius: T.rmd,
                  background: T.raised,
                  cursor: "pointer",
                }}
                onClick={() =>
                  setEditMemberForm((f) => ({ ...f, isHOD: !f.isHOD }))
                }
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: T.rxs,
                    border: `2px solid ${editMemberForm.isHOD ? T.orange : T.borderWarm}`,
                    background: editMemberForm.isHOD
                      ? T.orange
                      : "transparent",
                    display: "grid",
                    placeItems: "center",
                    transition: "all .16s",
                  }}
                >
                  {editMemberForm.isHOD && (
                    <I d="M20 6L9 17l-5-5" size={12} stroke="#fff" />
                  )}
                </div>
                <span
                  style={{ fontSize: 13, fontWeight: 500, color: T.ink }}
                >
                  Head of Department
                </span>
              </div>
            </Fld>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 22,
          }}
        >
          <Btn onClick={() => setEditingMember(null)}>Cancel</Btn>
          <Btn primary onClick={saveEditMember}>
            Save Changes
          </Btn>
        </div>
      </div>
    </div>
  );
}
