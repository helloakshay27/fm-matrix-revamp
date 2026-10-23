import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Search, ShieldCheck, Trash2, ListChecks } from "lucide-react";
import { Checkbox, FormControlLabel, Switch, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import {
  auditFieldSx,
  sectionIcon,
} from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { ROOT_CAUSE_GROUPS } from "@/components/vi-incident/viIncidentData";
import { INCIDENT_SPOC_PATH } from "./IncidentSpocListPage";

interface PlanEntry {
  corrective: string;
  preventive: string;
  responsiblePerson: ViActiveUserOption | null;
  targetDate: string;
  extendTargetDate: string;
  extensionReason: string;
}

const todayIso = () => new Date().toISOString().split("T")[0];

const emptyEntry = (): PlanEntry => ({
  corrective: "",
  preventive: "",
  responsiblePerson: null,
  targetDate: todayIso(),
  extendTargetDate: todayIso(),
  extensionReason: "",
});

// SPOC: create the action plan for an incident.
// Step 1 — investigation required? + root causes; step 2 — CAPA (corrective & preventive actions) per cause.
// The Incident API is not live yet: Save draft / Submit validate the form and return to the incident.
const IncidentSpocActionPlanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const incidentPath = `${INCIDENT_SPOC_PATH}/${id}`;

  const [step, setStep] = useState<1 | 2>(1);
  const [investigationRequired, setInvestigationRequired] = useState(false);
  const [noInvestigationReason, setNoInvestigationReason] = useState("");
  const [daysAway, setDaysAway] = useState("");
  const [restrictedDays, setRestrictedDays] = useState("");
  const [causes, setCauses] = useState<string[]>([]);
  const [breachOfRules, setBreachOfRules] = useState(false);
  const [summary, setSummary] = useState("");
  const [plans, setPlans] = useState<Record<string, PlanEntry[]>>({});

  const toggleCause = (cause: string) =>
    setCauses((prev) => (prev.includes(cause) ? prev.filter((c) => c !== cause) : [...prev, cause]));

  const updateEntry = (cause: string, index: number, patch: Partial<PlanEntry>) =>
    setPlans((prev) => ({
      ...prev,
      [cause]: (prev[cause] ?? [emptyEntry()]).map((entry, i) => {
        if (i !== index) return entry;
        const next = { ...entry, ...patch };
        // The extended date never sits before the target date.
        if (next.extendTargetDate < next.targetDate) next.extendTargetDate = next.targetDate;
        return next;
      }),
    }));

  const entriesFor = (cause: string) => plans[cause] ?? [emptyEntry()];

  const addEntry = (cause: string) =>
    setPlans((prev) => ({ ...prev, [cause]: [...entriesFor(cause), emptyEntry()] }));

  const removeEntry = (cause: string, index: number) =>
    setPlans((prev) => ({ ...prev, [cause]: entriesFor(cause).filter((_, i) => i !== index) }));

  // Causes in the order they appear on the form (CAPA cards follow the same order).
  const orderedCauses = useMemo(
    () => ROOT_CAUSE_GROUPS.flatMap((group) => group.options).filter((option) => causes.includes(option)),
    [causes],
  );

  const handleSaveDraft = () => {
    toast.success("Action plan saved to draft");
    navigate(incidentPath);
  };

  const handleNext = () => {
    if (!investigationRequired) return;
    if (!orderedCauses.length) {
      toast.error("Select at least one root cause");
      return;
    }
    if (!summary.trim()) {
      toast.error("Please add the investigation summary");
      return;
    }
    setStep(2);
  };

  // Investigation not required — only the reason is needed.
  const handleSubmitWithoutInvestigation = () => {
    if (!noInvestigationReason.trim()) {
      toast.error("Please describe why an investigation is not required");
      return;
    }
    toast.success("Action plan submitted successfully");
    navigate(incidentPath);
  };

  const handleSubmitPlans = () => {
    for (const cause of orderedCauses) {
      for (const [index, entry] of entriesFor(cause).entries()) {
        const label = entriesFor(cause).length > 1 ? `${cause} (${index + 1})` : cause;
        if (!entry.corrective.trim() || !entry.preventive.trim() || !entry.responsiblePerson || !entry.targetDate) {
          toast.error(`${label}: Corrective, Preventive plan, Responsible Person and Target Date are required`);
          return;
        }
        if (entry.extendTargetDate > entry.targetDate && !entry.extensionReason.trim()) {
          toast.error(`${label}: please add a reason for the extension`);
          return;
        }
      }
    }
    toast.success("Action plan submitted successfully");
    navigate(incidentPath);
  };

  const handleBack = () => (step === 2 ? setStep(1) : navigate(incidentPath));

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Incident</h1>
        <span className="text-sm text-gray-500">Action Plan</span>
      </div>

      {step === 1 && (
        <>
          <DetailCard icon={sectionIcon(Search)} title="Investigation" className="mb-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Investigation Required?</span>
              <Switch
                checked={investigationRequired}
                onChange={(e) => setInvestigationRequired(e.target.checked)}
              />
            </div>
            <div className="mt-4">
              {investigationRequired ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextField
                    fullWidth
                    type="number"
                    label="Days away from Work"
                    placeholder="Number of days away from work"
                    value={daysAway}
                    onChange={(e) => setDaysAway(e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={auditFieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label="Restricted Work Days"
                    placeholder="Enter number of days"
                    value={restrictedDays}
                    onChange={(e) => setRestrictedDays(e.target.value)}
                    inputProps={{ min: 0 }}
                    sx={auditFieldSx}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label={requiredLabel("Reason")}
                  placeholder="Describe why an investigation is not required"
                  value={noInvestigationReason}
                  onChange={(e) => setNoInvestigationReason(e.target.value)}
                  sx={auditFieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </div>
          </DetailCard>

          {/* Root-cause checklists — read-only until an investigation is required */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {ROOT_CAUSE_GROUPS.map((group) => (
              <DetailCard key={group.key} icon={sectionIcon(ListChecks)} title={group.title}>
                <div className="space-y-1">
                  {group.options.map((option) => (
                    <FormControlLabel
                      key={option}
                      className="!m-0 flex w-full !justify-between"
                      labelPlacement="start"
                      disabled={!investigationRequired}
                      control={
                        <Checkbox checked={causes.includes(option)} onChange={() => toggleCause(option)} size="small" />
                      }
                      label={<span className="text-sm text-gray-900">{option}</span>}
                      sx={{ marginLeft: 0, justifyContent: "space-between" }}
                    />
                  ))}
                </div>
              </DetailCard>
            ))}
          </div>

          {investigationRequired && (
            <>
              <DetailCard icon={sectionIcon(ShieldCheck)} title="Breach of absolute safety rules" className="mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{breachOfRules ? "Yes" : "No"}</span>
                  <Switch checked={breachOfRules} onChange={(e) => setBreachOfRules(e.target.checked)} />
                </div>
              </DetailCard>

              <DetailCard icon={sectionIcon(Search)} title="Investigation Summary" className="mb-5">
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  label={requiredLabel("Summary")}
                  placeholder="Enter text..."
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  sx={auditFieldSx}
                  InputLabelProps={{ shrink: true }}
                />
              </DetailCard>
            </>
          )}

          <div className="flex flex-wrap gap-4 justify-center pt-4 sm:pt-6">
            <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSaveDraft}>
              Save Draft
            </button>
            {investigationRequired ? (
              <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSubmitWithoutInvestigation}>
                Submit
              </button>
            )}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <DetailCard icon={sectionIcon(ShieldCheck)} title="CAPA - Corrective & Preventive Actions" className="mb-5">
            <p className="text-sm text-gray-500">
              Add a corrective and preventive action plan for each root cause identified.
            </p>
          </DetailCard>

          {orderedCauses.map((cause, causeIndex) => (
            <DetailCard key={cause} icon={sectionIcon(ListChecks)} title={`${causeIndex + 1}. ${cause}`} className="mb-5">
              <div className="space-y-6">
                {entriesFor(cause).map((entry, index) => (
                  <div key={index} className={index > 0 ? "border-t border-gray-200 pt-6" : ""}>
                    {entriesFor(cause).length > 1 && (
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-gray-900">Plan {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeEntry(cause, index)}
                          className="rounded-[8px] p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          aria-label={`Remove plan ${index + 1}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="space-y-5">
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label={requiredLabel("Corrective Action Plan")}
                        placeholder="Describe immediate actions to be taken..."
                        value={entry.corrective}
                        onChange={(e) => updateEntry(cause, index, { corrective: e.target.value })}
                        sx={auditFieldSx}
                        InputLabelProps={{ shrink: true }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label={requiredLabel("Preventive Action Plan")}
                        placeholder="Describe immediate actions to be taken..."
                        value={entry.preventive}
                        onChange={(e) => updateEntry(cause, index, { preventive: e.target.value })}
                        sx={auditFieldSx}
                        InputLabelProps={{ shrink: true }}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <UserSelectField
                          label="Responsible Person"
                          required
                          value={entry.responsiblePerson}
                          onChange={(user) => updateEntry(cause, index, { responsiblePerson: user })}
                          employeeType="internal"
                          placeholder="Select"
                        />
                        <TextField
                          fullWidth
                          type="date"
                          label={requiredLabel("Select Target Date")}
                          value={entry.targetDate}
                          onChange={(e) => updateEntry(cause, index, { targetDate: e.target.value })}
                          sx={auditFieldSx}
                          InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                          fullWidth
                          type="date"
                          label={requiredLabel("Extend Target Date")}
                          value={entry.extendTargetDate}
                          onChange={(e) => updateEntry(cause, index, { extendTargetDate: e.target.value })}
                          inputProps={{ min: entry.targetDate }}
                          sx={auditFieldSx}
                          InputLabelProps={{ shrink: true }}
                        />
                      </div>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Reason for extension"
                        placeholder="Describe immediate actions to be taken..."
                        value={entry.extensionReason}
                        onChange={(e) => updateEntry(cause, index, { extensionReason: e.target.value })}
                        sx={auditFieldSx}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => addEntry(cause)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                    Add more
                  </button>
                </div>
              </div>
            </DetailCard>
          ))}

          <div className="flex flex-wrap gap-4 justify-center pt-4 sm:pt-6">
            <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSaveDraft}>
              Save Draft
            </button>
            <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSubmitPlans}>
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentSpocActionPlanPage;
