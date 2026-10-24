import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import { TextField } from "@mui/material";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { IncidentDetailView, IncidentInvestigationCard } from "@/components/vi-incident/IncidentDetailView";
import { IncidentActionPlanCards, planTargetLabel } from "@/components/vi-incident/IncidentActionPlanCards";
import {
  errorToast,
  extendViIncidentTargetDate,
  useViIncidentDetail,
} from "@/components/vi-incident/viIncidentApi";
import {
  ACTION_TYPE_LABEL,
  isPlanExpired,
  planDeadline,
  todayIso,
  type ViIncidentActionPlan,
} from "@/components/vi-incident/viIncidentData";
import { INCIDENT_SPOC_PATH } from "./IncidentSpocListPage";

// The day after `iso` — a new deadline must be after today and after the expired one.
const nextDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d + 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

/** PUT /vi_incident_action_plans/:id/extend_target_date.json for one expired plan. */
const ExtendTargetDateDialog = ({
  plan,
  onClose,
  onExtended,
}: {
  plan: ViIncidentActionPlan | null;
  onClose: () => void;
  onExtended: () => void;
}) => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const minDate = plan ? nextDay([todayIso(), planDeadline(plan)].sort()[1]) : "";

  const submit = async () => {
    if (!plan || saving) return;
    if (!date || !reason.trim()) {
      toast.error("Please add the new target date and the reason for the extension");
      return;
    }
    if (date < minDate) {
      toast.error("The new target date must be after today and after the expired deadline");
      return;
    }
    setSaving(true);
    try {
      await extendViIncidentTargetDate(plan.id, date, reason.trim());
      toast.success("Target date extended");
      setDate("");
      setReason("");
      onExtended();
    } catch (error) {
      errorToast("Failed to extend target date", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={Boolean(plan)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-8">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">Extend Target Date</DialogTitle>
        </DialogHeader>
        {plan && (
          <p className="text-sm text-gray-600">
            {ACTION_TYPE_LABEL[plan.actionType]} action plan — current target: {planTargetLabel(plan)}
          </p>
        )}
        <div className="mt-2 space-y-5">
          <TextField
            fullWidth
            type="date"
            label={requiredLabel("New Target Date")}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            inputProps={{ min: minDate }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label={requiredLabel("Reason for extension")}
            placeholder="Why is more time needed?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={submit} disabled={saving}>
            Extend
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// SPOC: incident detail with the "Create Action Plan" action while the investigation is pending;
// afterwards the investigation and action plans, where an expired deadline can be extended.
const IncidentSpocDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { incident, loading, reload } = useViIncidentDetail(id);
  const [extending, setExtending] = useState<ViIncidentActionPlan | null>(null);

  const isOpen = incident?.storedStatus === "open";
  // The SPOC works on the investigation while the incident is open and it hasn't been submitted.
  const canCreatePlan = Boolean(incident && isOpen && !incident.investigation.submitted);
  const hasDraftPlan = Boolean(incident && (incident.actionPlans.length || incident.investigation.summary));

  return (
    <>
      <IncidentDetailView
        incident={incident}
        loading={loading}
        listPath={INCIDENT_SPOC_PATH}
        footer={
          canCreatePlan ? (
            <button
              type="button"
              className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
              onClick={() => navigate(`${INCIDENT_SPOC_PATH}/${id}/action-plan`)}
            >
              {hasDraftPlan ? "Continue Action Plan" : "Create Action Plan"}
            </button>
          ) : undefined
        }
      >
        {incident?.investigation.submitted && (
          <>
            <IncidentInvestigationCard incident={incident} />
            <IncidentActionPlanCards
              incident={incident}
              renderPlanActions={(plan) =>
                isOpen && isPlanExpired(plan) ? (
                  <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => setExtending(plan)}>
                    <CalendarClock className="w-4 h-4" />
                    Extend Target Date
                  </button>
                ) : null
              }
            />
          </>
        )}
      </IncidentDetailView>

      <ExtendTargetDateDialog
        plan={extending}
        onClose={() => setExtending(null)}
        onExtended={() => {
          setExtending(null);
          reload();
        }}
      />
    </>
  );
};

export default IncidentSpocDetailPage;
