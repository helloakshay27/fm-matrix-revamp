import { useMemo } from "react";
import { useInspectionDraft } from "@/components/vi-inspection/useInspectionDraft";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ListChecks, Plus, Trash2 } from "lucide-react";
import { TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import { sectionIcon } from "@/components/vi-audit/ViAuditUi";
import { requiredLabel } from "@/components/vi-audit/AuditFormFields";
import { UserSelectField } from "@/components/vi-audit/ViUserPicker";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { getViInspection } from "@/components/vi-inspection/viInspectionData";
import { INSPECTION_SPOC_PATH } from "./InspectionSpocDetailPage";

type PlanKind = "corrective" | "preventive";

interface PlanEntry {
  description: string;
  responsiblePerson: ViActiveUserOption | null;
  targetDate: string;
}

type FindingPlans = Record<PlanKind, PlanEntry[]>;

const PLAN_LABEL: Record<PlanKind, string> = {
  corrective: "Corrective Action Plan",
  preventive: "Preventive Action Plan",
};

const todayIso = () => new Date().toISOString().split("T")[0];
const emptyEntry = (): PlanEntry => ({ description: "", responsiblePerson: null, targetDate: todayIso() });
const emptyFindingPlans = (): FindingPlans => ({ corrective: [emptyEntry()], preventive: [emptyEntry()] });

// SPOC: add corrective & preventive action plans for each checklist finding of an inspection.
// The Inspection API is not live yet: Save Draft / Submit validate the form and return to the inspection.
const InspectionSpocActionPlanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const inspectionPath = `${INSPECTION_SPOC_PATH}/${id}`;
  const findings = useMemo(() => getViInspection(id).checklist, [id]);

  const { value: plans, setValue: setPlans, loading, error, saving, retry, saveDraft, clearDraft } = useInspectionDraft<FindingPlans[]>(`spoc-action-plan:${id}`, () => findings.map(emptyFindingPlans));

  const updateEntries = (findingIndex: number, kind: PlanKind, update: (entries: PlanEntry[]) => PlanEntry[]) =>
    setPlans((prev) => prev.map((plan, i) => (i === findingIndex ? { ...plan, [kind]: update(plan[kind]) } : plan)));

  const updateEntry = (findingIndex: number, kind: PlanKind, entryIndex: number, patch: Partial<PlanEntry>) =>
    updateEntries(findingIndex, kind, (entries) =>
      entries.map((entry, i) => (i === entryIndex ? { ...entry, ...patch } : entry)),
    );

  const handleSaveDraft = async () => {
    if (!(await saveDraft())) return;
    toast.success("Action plan saved to draft");
    navigate(inspectionPath);
  };

  const handleSubmit = async () => {
    for (const [findingIndex, plan] of plans.entries()) {
      for (const kind of ["corrective", "preventive"] as PlanKind[]) {
        const invalid = plan[kind].findIndex((e) => !e.description.trim() || !e.responsiblePerson || !e.targetDate);
        if (invalid !== -1) {
          const suffix = plan[kind].length > 1 ? ` (${invalid + 1})` : "";
          toast.error(
            `${findingIndex + 1}. ${findings[findingIndex].finding} — ${PLAN_LABEL[kind]}${suffix}: description, Responsible Person and Target Date are required`,
          );
          return;
        }
      }
    }
    if (!(await clearDraft())) return;
    toast.success("Action plan submitted successfully");
    navigate(inspectionPath);
  };

  const renderPlanSection = (findingIndex: number, kind: PlanKind) => {
    const entries = plans[findingIndex][kind];
    return (
      <div className="rounded-xl border border-[rgba(26,26,24,0.09)] p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#1A1A18]">{PLAN_LABEL[kind]}</span>
          <button
            type="button"
            onClick={() => updateEntries(findingIndex, kind, (prev) => [...prev, emptyEntry()])}
            className="inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[13px] font-semibold text-[#1A1A18] hover:bg-[#F5F4F0]"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        <div className="space-y-6">
          {entries.map((entry, entryIndex) => (
            <div key={entryIndex} className={entryIndex > 0 ? "border-t border-[rgba(26,26,24,0.09)] pt-6" : ""}>
              {entries.length > 1 && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1A1A18]">Plan {entryIndex + 1}</span>
                  <button
                    type="button"
                    onClick={() => updateEntries(findingIndex, kind, (prev) => prev.filter((_, i) => i !== entryIndex))}
                    className="rounded-[8px] p-1.5 text-[rgba(26,26,24,0.48)] hover:bg-[#F5F4F0] hover:text-[#1A1A18]"
                    aria-label={`Remove plan ${entryIndex + 1}`}
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
                  label={requiredLabel(PLAN_LABEL[kind])}
                  placeholder="Describe immediate actions to be taken..."
                  value={entry.description}
                  onChange={(e) => updateEntry(findingIndex, kind, entryIndex, { description: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <UserSelectField
                    label="Responsible Person"
                    required
                    value={entry.responsiblePerson}
                    onChange={(user) => updateEntry(findingIndex, kind, entryIndex, { responsiblePerson: user })}
                    employeeType="internal"
                    placeholder="Select"
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label={requiredLabel("Select Target Date")}
                    value={entry.targetDate}
                    onChange={(e) => updateEntry(findingIndex, kind, entryIndex, { targetDate: e.target.value })}
                    inputProps={{ min: todayIso() }}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (error) return <div className="p-6" role="alert">Unable to load draft. <button onClick={retry}>Retry</button></div>;
  if (loading) return <div className="p-6" role="status">Loading draft...</div>;
  return (
    <fieldset disabled={saving} className="p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => navigate(inspectionPath)}
          className="flex h-8 w-8 items-center justify-center rounded-[8px] hover:bg-[#F5F4F0]"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[rgba(26,26,24,0.68)]" />
        </button>
        <h1 className="text-xl font-semibold text-[#1A1A18]">Inspection</h1>
        <span className="text-sm text-[rgba(26,26,24,0.48)]">Action Plan</span>
      </div>

      {findings.map((finding, findingIndex) => (
        <DetailCard
          key={findingIndex}
          icon={sectionIcon(ListChecks)}
          title={`${findingIndex + 1}. ${finding.finding}`}
          className="mb-5"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {renderPlanSection(findingIndex, "corrective")}
            {renderPlanSection(findingIndex, "preventive")}
          </div>
        </DetailCard>
      ))}

      <div className="fm-action-bar pt-4 sm:pt-6">
        <button type="button" className="fm-action-secondary" onClick={handleSaveDraft}>
          Save Draft
        </button>
        <button type="button" className="fm-action-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </fieldset>
  );
};

export default InspectionSpocActionPlanPage;
