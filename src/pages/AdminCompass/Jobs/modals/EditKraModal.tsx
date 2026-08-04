// @ts-nocheck
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useJobs } from "../JobsContext";
import { T } from "../constants";
import { Fld, FI, FT, FS, Btn } from "../components/UI";

export default function EditKraModal() {
  const {
    editingKraId,
    setEditingKraId,
    editKraForm,
    setEditKraForm,
    krasSaving,
    saveEditKra,
    assigneeKraUsage,
    loadAssigneeKraUsage,
  } = useJobs();
  const queryClient = useQueryClient();

  // Is KRA ko chhodkar member ke baaki KRAs ka total.
  useEffect(() => {
    if (!editingKraId) return;
    loadAssigneeKraUsage(editKraForm.assigneeId, editingKraId);
  }, [editingKraId, editKraForm.assigneeId, loadAssigneeKraUsage]);

  if (!editingKraId) return null;

  const usageReady =
    editKraForm.assigneeId &&
    !assigneeKraUsage.loading &&
    String(assigneeKraUsage.assigneeId) === String(editKraForm.assigneeId);
  const usedByMember = usageReady ? assigneeKraUsage.used : 0;
  const remainingForMember = Math.max(0, 100 - usedByMember);
  const overLimit =
    usageReady && Number(editKraForm.weightage || 0) > remainingForMember;

  const handleSave = async () => {
    await saveEditKra();
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
      onClick={() => setEditingKraId(null)}
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
          Edit KRA
        </h3>
        <p style={{ fontSize: 12.5, color: T.inkMuted, marginBottom: 22 }}>
          Update the Key Result Area details.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <Fld label="KRA Name *">
              <FI
                value={editKraForm.title || ""}
                onChange={(e) =>
                  setEditKraForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </Fld>
            <Fld
              label="KRA Weightage (%)"
              hint={
                editKraForm.assigneeId
                  ? assigneeKraUsage.loading
                    ? "Checking member's total..."
                    : `${usedByMember}% used by this member's other KRAs, ${remainingForMember}% left`
                  : undefined
              }
            >
              <FI
                type="number"
                min={0}
                max={usageReady ? remainingForMember : 100}
                value={editKraForm.weightage || ""}
                onChange={(e) =>
                  setEditKraForm((f) => ({ ...f, weightage: e.target.value }))
                }
              />
              {overLimit && (
                <span style={{ fontSize: 11, color: T.danger }}>
                  Exceeds 100% total for this member
                </span>
              )}
            </Fld>
          </div>
          <Fld label="Description">
            <FT
              value={editKraForm.desc || ""}
              onChange={(e) =>
                setEditKraForm((f) => ({ ...f, desc: e.target.value }))
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
                value={editKraForm.effectiveFrom || ""}
                onChange={(e) =>
                  setEditKraForm((f) => ({ ...f, effectiveFrom: e.target.value }))
                }
              />
            </Fld>
            <Fld label="Effective To">
              <FI
                type="date"
                value={editKraForm.effectiveTo || ""}
                onChange={(e) =>
                  setEditKraForm((f) => ({ ...f, effectiveTo: e.target.value }))
                }
              />
            </Fld>
          </div>
          <Fld label="Status">
            <FS
              value={editKraForm.status || "active"}
              onChange={(e) =>
                setEditKraForm((f) => ({ ...f, status: e.target.value }))
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
          <Btn onClick={() => setEditingKraId(null)}>Cancel</Btn>
          <Btn primary onClick={handleSave} disabled={krasSaving}>
            {krasSaving ? "Saving…" : "Save Changes"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
