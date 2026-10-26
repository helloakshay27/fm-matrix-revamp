import { useState } from "react";
import { toast } from "sonner";
import { TextField } from "@mui/material";
import { auditTextareaSx } from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { errorToast, extendViInspectionTargetDate } from "./viInspectionApi";
import { formatInspectionDate, planDeadline, type ViInspectionActionPlan } from "./viInspectionData";

/**
 * SPOC: extend a released plan's target date
 * (PUT /vi_inspection_action_plans/:id/extend_target_date.json). The new date must be after the
 * current deadline (latest extension, else target date) and needs a reason; the API keeps the history.
 */
export const InspectionPlanExtensionForm = ({
  plan,
  onExtended,
  onCancel,
}: {
  plan: ViInspectionActionPlan;
  onExtended: () => void;
  onCancel: () => void;
}) => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const deadline = planDeadline(plan);

  // Day after the current deadline (the API requires a later date).
  const minDate = (() => {
    if (!deadline) return "";
    const d = new Date(`${deadline}T00:00:00`);
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  const submit = async () => {
    if (saving) return;
    if (!date || !reason.trim()) {
      toast.error("Please select the extended target date and enter the reason for extension");
      return;
    }
    if (minDate && date < minDate) {
      toast.error(`Extended target date must be after ${formatInspectionDate(deadline)}`);
      return;
    }
    setSaving(true);
    try {
      await extendViInspectionTargetDate(plan.id, date, reason.trim());
      toast.success("Target date extended");
      onExtended();
    } catch (error) {
      errorToast("Failed to extend target date", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 rounded-[10px] border border-[rgba(26,26,24,0.09)] bg-[#F7F6F2] p-4">
      <p className="text-xs text-[rgba(26,26,24,0.68)]">
        Current deadline: <span className="font-medium text-[#1A1A18]">{formatInspectionDate(deadline) || "-"}</span>
      </p>
      <TextField
        fullWidth
        type="date"
        label={requiredLabel("Extend Target Date")}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        inputProps={{ min: minDate || undefined }}
      />
      <TextField
        fullWidth
        multiline
        rows={3}
        sx={auditTextareaSx}
        label={requiredLabel("Reason for extension")}
        placeholder="Describe the reason for extending the target date..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <div className="flex justify-end gap-2">
        <button type="button" className="fm-action-secondary" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="button" className="fm-action-primary" onClick={submit} disabled={saving}>
          {saving ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};
