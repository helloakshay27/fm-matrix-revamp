import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { TextField } from "@mui/material";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";
import { apiErrorMessage } from "./viAuditApi";
import { auditTextareaSx } from "./ViAuditUi";
import { localTodayIso, type ViActionPlan } from "./viAuditData";

const requiredLabel = (text: string) => (
  <>
    {text} <span className="text-red-500">*</span>
  </>
);

/**
 * SPOC: extend the target date of a breached action plan.
 * PUT /vi_audit_action_plans/:id.json { vi_audit_action_plan: { extend_target_date, extension_reason } }
 * (extend_target_date must be on/after target_date and needs a reason).
 */
export const PlanExtensionForm = ({
  plan,
  onExtended,
}: {
  plan: ViActionPlan;
  /** Called after a successful PUT; awaited so "Submitting..." stays until the plan has refreshed. */
  onExtended: () => void | Promise<void>;
}) => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  // The new date can't be before today or before the current target date.
  const currentDue = (plan.extendedTargetDate || plan.targetDate || "").slice(0, 10);
  const today = localTodayIso();
  const minDate = currentDue > today ? currentDue : today;

  const submit = async () => {
    if (saving) return;
    if (!date || !reason.trim()) {
      toast.error("Please select the extended target date and enter the reason for extension");
      return;
    }
    if (date < minDate) {
      toast.error("Extended target date can't be before today or the current target date");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(getFullUrl(`/vi_audit_action_plans/${encodeURIComponent(plan.id)}.json`), {
        method: "PUT",
        headers: { Authorization: getAuthHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({
          vi_audit_action_plan: { extend_target_date: date, extension_reason: reason.trim() },
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(apiErrorMessage(result) || `Request failed with status ${response.status}`);
      toast.success("Target date extended");
      await onExtended();
    } catch (error) {
      console.error("Target date extension failed:", error);
      const message = error instanceof Error ? error.message : "";
      toast.error(message ? `Failed to extend target date: ${message}` : "Failed to extend target date");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 border-t border-gray-200 bg-white px-4 py-4">
      <p className="flex items-center gap-2 text-sm font-medium italic text-red-600">
        <AlertCircle className="w-4 h-4 shrink-0" />
        Target date breached, Kindly extend target date.
      </p>
      <div className="max-w-sm">
        <TextField
          fullWidth
          type="date"
          label={requiredLabel("Extend Target Date")}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: minDate }}
        />
      </div>
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
      <div className="flex justify-end">
        <button type="button" className="fm-action-primary" onClick={submit} disabled={saving}>
          {saving ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};
