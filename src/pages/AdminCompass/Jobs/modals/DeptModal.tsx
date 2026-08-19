// @ts-nocheck
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, FI, FT, FS, Btn } from "../components/UI";

export default function DeptModal() {
  const { showDeptModal, setShowDeptModal, editingDept, deptForm, setDeptForm, saveDept } = useJobs();
  if (!showDeptModal) return null;
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
      onClick={() => setShowDeptModal(false)}
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
          {editingDept ? "Edit Department" : "Add New Department"}
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>
          {editingDept
            ? "Update department details."
            : "Fill in the details to create a new department."}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Fld label="Department Name *">
            <FI
              placeholder="e.g. Product & Design"
              value={deptForm.name}
              onChange={(e) =>
                setDeptForm((f) => ({ ...f, name: e.target.value }))
              }
            />
          </Fld>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Department Head">
              <FI
                placeholder="e.g. Priya Sharma"
                value={deptForm.head}
                onChange={(e) =>
                  setDeptForm((f) => ({ ...f, head: e.target.value }))
                }
              />
            </Fld>
            <Fld label="Team Size">
              <FI
                type="number"
                placeholder="e.g. 12"
                value={deptForm.members}
                onChange={(e) =>
                  setDeptForm((f) => ({ ...f, members: e.target.value }))
                }
              />
            </Fld>
          </div>
          <Fld label="Description">
            <FT
              placeholder="What does this department handle?"
              value={deptForm.description}
              onChange={(e) =>
                setDeptForm((f) => ({ ...f, description: e.target.value }))
              }
              style={{ minHeight: 68 }}
            />
          </Fld>
          <Fld label="Status">
            <FS
              value={deptForm.status}
              onChange={(e) =>
                setDeptForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FS>
          </Fld>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 22,
          }}
        >
          <Btn onClick={() => setShowDeptModal(false)}>Cancel</Btn>
          <Btn primary onClick={saveDept}>
            {editingDept ? "Update" : "Create Department"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
