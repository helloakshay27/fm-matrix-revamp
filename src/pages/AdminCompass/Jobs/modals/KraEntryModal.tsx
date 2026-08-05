// @ts-nocheck
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, FI, FT, FS, Btn } from "../components/UI";
import MemberSearchSelect from "../components/MemberSearchSelect";

export default function KraEntryModal() {
  const {
    showAddKra,
    setShowAddKra,
    newKra,
    setNewKra,
    allJds,
    escalateUsers,
    krasSaving,
    saveNewKra,
    assigneeKraUsage,
    loadAssigneeKraUsage,
  } = useJobs();
  const queryClient = useQueryClient();

  // Weightage hint pehle chune gaye member ka dikhate hain (validation save par
  // har member ke liye chalti hai).
  const primaryAssigneeId = newKra.assigneeIds?.[0] || newKra.assigneeId || "";

  // Assignee badalte hi uske baaki KRAs ka total le aate hain.
  useEffect(() => {
    if (!showAddKra) return;
    loadAssigneeKraUsage(primaryAssigneeId);
  }, [showAddKra, primaryAssigneeId, loadAssigneeKraUsage]);

  if (!showAddKra) return null;

  const memberOptions = (escalateUsers || []).map((u) => ({
    id: u.id,
    name: u.full_name || u.name || `User ${u.id}`,
    email: u.email,
  }));
  const primaryAssigneeName =
    memberOptions.find((u) => String(u.id) === String(primaryAssigneeId))?.name ||
    "this member";

  const usageReady =
    primaryAssigneeId &&
    !assigneeKraUsage.loading &&
    String(assigneeKraUsage.assigneeId) === String(primaryAssigneeId);
  const usedByMember = usageReady ? assigneeKraUsage.used : 0;
  const remainingForMember = Math.max(0, 100 - usedByMember);
  const overLimit =
    usageReady && Number(newKra.weightage || 0) > remainingForMember;

  const handleSave = async () => {
    await saveNewKra();
    queryClient.invalidateQueries({ queryKey: ["kras-list"] });
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
      onClick={() => setShowAddKra(false)}
    >
      <div
        style={{
          width: 520,
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
          Add New KRA
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>
          Link a Key Result Area to an existing job description.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Job Description *">
              <FS
                value={newKra.jdId}
                onChange={(e) =>
                  setNewKra((f) => ({ ...f, jdId: e.target.value }))
                }
              >
                <option value="">Select JD</option>
                {allJds.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </FS>
            </Fld>
            <Fld label="Status">
              <FS
                value={newKra.status}
                onChange={(e) =>
                  setNewKra((f) => ({ ...f, status: e.target.value }))
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
            <Fld label="KRA Name *">
              <FI
                placeholder="e.g. Revenue Generation"
                value={newKra.title}
                onChange={(e) =>
                  setNewKra((f) => ({ ...f, title: e.target.value }))
                }
              />
            </Fld>
            <Fld
              label="KRA Weightage (%)"
              hint={
                primaryAssigneeId
                  ? assigneeKraUsage.loading
                    ? "Checking member's total..."
                    : `${usedByMember}% used by ${primaryAssigneeName}'s other KRAs, ${remainingForMember}% left`
                  : undefined
              }
            >
              <FI
                type="number"
                min={0}
                max={usageReady ? remainingForMember : 100}
                placeholder="e.g. 30"
                value={newKra.weightage}
                onChange={(e) =>
                  setNewKra((f) => ({ ...f, weightage: e.target.value }))
                }
              />
              {overLimit && (
                <span style={{ fontSize: 11, color: T.danger }}>
                  Exceeds 100% total for this member
                </span>
              )}
            </Fld>
          </div>
          <Fld
            label="Assignee Person(s)"
            hint="Ek se zyada member chun sakte hain."
          >
            <MemberSearchSelect
              multiple
              value={(newKra.assigneeIds || []).map(String)}
              options={memberOptions}
              onChange={(values) =>
                setNewKra((f) => ({
                  ...f,
                  assigneeIds: values || [],
                  assigneeId: values?.[0] || "",
                }))
              }
              placeholder="Select assignees"
              disabled={krasSaving}
            />
          </Fld>
          <Fld label="Description">
            <FT
              placeholder="What does this KRA measure?"
              value={newKra.desc}
              onChange={(e) =>
                setNewKra((f) => ({ ...f, desc: e.target.value }))
              }
              style={{ minHeight: 68 }}
            />
          </Fld>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="Effective From">
              <FI
                type="date"
                value={newKra.effectiveFrom}
                onChange={(e) =>
                  setNewKra((f) => ({
                    ...f,
                    effectiveFrom: e.target.value,
                  }))
                }
              />
            </Fld>
            <Fld label="Effective To">
              <FI
                type="date"
                value={newKra.effectiveTo}
                onChange={(e) =>
                  setNewKra((f) => ({ ...f, effectiveTo: e.target.value }))
                }
              />
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
          <Btn onClick={() => setShowAddKra(false)}>Cancel</Btn>
          <Btn primary onClick={handleSave} disabled={krasSaving}>
            {krasSaving ? "Saving…" : "Submit"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
