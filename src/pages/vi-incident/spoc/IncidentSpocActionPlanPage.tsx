import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Search, ShieldCheck, ListChecks } from "lucide-react";
import { Checkbox, FormControlLabel, Switch, TextField } from "@mui/material";
import { DetailCard } from "@/components/ui/detail-card";
import {
  AuditLoadingState,
  sectionIcon,
  auditFieldSx,
  auditSwitchSx,
  auditCheckboxSx,
} from "@/components/vi-audit/ViAuditUi";
import { requiredLabel, toId } from "@/components/vi-audit/AuditFormFields";
import { type ViActiveUserOption } from "@/components/vi-audit/useViActiveUsers";
import { AutocompleteLabel } from "@/components/vi-audit/ViUserPicker";
import { IncidentSelectField, MultiUserSelectField } from "@/components/vi-incident/IncidentFormFields";
import {
  errorToast,
  isOthersOption,
  saveViIncidentInvestigation,
  useViIncidentChecklistHierarchy,
  useViIncidentDetail,
  useViIncidentMasters,
} from "@/components/vi-incident/viIncidentApi";
import {
  ACTION_TYPE_LABEL,
  todayIso,
  type ViIncidentActionType,
  type ViIncidentChecklistItem,
} from "@/components/vi-incident/viIncidentData";
import { INCIDENT_SPOC_PATH } from "./IncidentSpocListPage";

const ACTION_TYPES: ViIncidentActionType[] = ["corrective", "preventive"];

interface PlanDraft {
  description: string;
  owners: ViActiveUserOption[];
  targetDate: string;
  // Extensions are made later from the incident page; kept here so a re-save doesn't clear them.
  extendTargetDate: string;
  extensionReason: string;
}

type ItemPlans = Record<ViIncidentActionType, PlanDraft>;

const emptyPlan = (): PlanDraft => ({ description: "", owners: [], targetDate: "", extendTargetDate: "", extensionReason: "" });
const emptyItemPlans = (): ItemPlans => ({ corrective: emptyPlan(), preventive: emptyPlan() });
const hasContent = (plan: PlanDraft) => Boolean(plan.description.trim() || plan.owners.length || plan.targetDate);
const isNonNegative = (value: string) => value.trim() !== "" && Number(value) >= 0;

// SPOC: investigation + action plan for an incident (PATCH /vi_incidents/:id/investigation.json).
// Step 1 — investigation required? + root causes (checklist sub-sub categories); step 2 — a
// corrective and a preventive plan per root cause, each with its responsible persons.
const IncidentSpocActionPlanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const incidentPath = `${INCIDENT_SPOC_PATH}/${id}`;
  const { incident, loading: incidentLoading } = useViIncidentDetail(id);
  const { masters, loading: mastersLoading } = useViIncidentMasters();
  const categoryIds = useMemo(() => masters.checklistCategories.map((c) => c.value), [masters.checklistCategories]);
  const { categories, loading: checklistLoading } = useViIncidentChecklistHierarchy(categoryIds);

  const [step, setStep] = useState<1 | 2>(1);
  const [saving, setSaving] = useState(false);
  const [investigationRequired, setInvestigationRequired] = useState(false);
  const [noInvestigationReason, setNoInvestigationReason] = useState("");
  const [daysAway, setDaysAway] = useState("");
  const [restrictedDays, setRestrictedDays] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [breachOfRules, setBreachOfRules] = useState(false);
  const [breachRuleId, setBreachRuleId] = useState("");
  const [breachRuleOther, setBreachRuleOther] = useState("");
  const [conclusionId, setConclusionId] = useState("");
  const [summary, setSummary] = useState("");
  const [plans, setPlans] = useState<Record<string, ItemPlans>>({});

  // Continue from a saved draft.
  const prefilled = useRef(false);
  useEffect(() => {
    if (!incident || prefilled.current) return;
    prefilled.current = true;
    const inv = incident.investigation;
    setInvestigationRequired(inv.required);
    setNoInvestigationReason(inv.notRequiredReason);
    setDaysAway(inv.daysAwayFromWork);
    setRestrictedDays(inv.restrictedWorkDays);
    setBreachOfRules(inv.breach);
    setBreachRuleId(inv.breachSafetyRuleId);
    setBreachRuleOther(inv.breachSafetyRuleOther);
    setConclusionId(inv.conclusionId);
    setSummary(inv.summary);
    setSelectedItems(incident.checklistItems.map((item) => item.id));
    const saved: Record<string, ItemPlans> = {};
    for (const plan of incident.actionPlans) {
      saved[plan.checklistItemId] ??= emptyItemPlans();
      saved[plan.checklistItemId][plan.actionType] = {
        description: plan.description,
        owners: plan.assignments.map((a) => a.owner).filter((o): o is ViActiveUserOption => o !== null),
        targetDate: plan.targetDate,
        extendTargetDate: plan.extendTargetDate,
        extensionReason: plan.extensionReason,
      };
    }
    setPlans(saved);
  }, [incident]);

  // The catch-all safety rule ("Violation -Any other HSW Rule", or a plain "Others") needs the
  // rule described in words; every other rule hides the text box.
  const breachRuleLabel = masters.breachSafetyRules.find((rule) => rule.value === breachRuleId)?.label ?? "";
  const breachRuleIsOther =
    isOthersOption(masters.breachSafetyRules, breachRuleId) || /\bany\s+other\b/i.test(breachRuleLabel);

  // Every selectable root cause, with its "Category / Sub Category" path.
  const itemLookup = useMemo(() => {
    const lookup = new Map<string, ViIncidentChecklistItem>();
    for (const category of categories) {
      for (const sub of category.subCategories) {
        for (const item of sub.items) lookup.set(item.id, { id: item.id, name: item.name, path: `${category.name} / ${sub.name}` });
      }
    }
    for (const item of incident?.checklistItems ?? []) if (!lookup.has(item.id)) lookup.set(item.id, item);
    return lookup;
  }, [categories, incident]);

  // Selected items in checklist order (CAPA cards follow the same order).
  const orderedItems = useMemo(
    () =>
      [...itemLookup.keys()]
        .filter((itemId) => selectedItems.includes(itemId))
        .map((itemId) => itemLookup.get(itemId) as ViIncidentChecklistItem),
    [itemLookup, selectedItems],
  );

  const toggleItem = (itemId: string) =>
    setSelectedItems((prev) => (prev.includes(itemId) ? prev.filter((i) => i !== itemId) : [...prev, itemId]));

  // Parent (sub category) checkboxes: ticking one opens its child items. A parent also counts as
  // ticked while any of its children is selected (e.g. a saved draft).
  const [openParents, setOpenParents] = useState<string[]>([]);
  type ChecklistSub = (typeof categories)[number]["subCategories"][number];
  const isParentChecked = (sub: ChecklistSub) =>
    openParents.includes(sub.id) || sub.items.some((item) => selectedItems.includes(item.id));
  const toggleParent = (sub: ChecklistSub) => {
    if (isParentChecked(sub)) {
      // Closing a parent clears its children.
      const childIds = sub.items.map((item) => item.id);
      setOpenParents((prev) => prev.filter((id) => id !== sub.id));
      setSelectedItems((prev) => prev.filter((id) => !childIds.includes(id)));
    } else {
      setOpenParents((prev) => [...prev, sub.id]);
    }
  };

  const plansFor = (itemId: string) => plans[itemId] ?? emptyItemPlans();

  const updatePlan = (itemId: string, type: ViIncidentActionType, patch: Partial<PlanDraft>) =>
    setPlans((prev) => {
      const current = prev[itemId] ?? emptyItemPlans();
      return { ...prev, [itemId]: { ...current, [type]: { ...current[type], ...patch } } };
    });

  const buildBody = (submit: boolean) => {
    const required = investigationRequired;
    const itemIds = required ? orderedItems.map((item) => item.id) : [];
    return {
      investigation: {
        investigation_required: required,
        investigation_not_required_reason: required ? null : noInvestigationReason.trim(),
        days_away_from_work: required && daysAway !== "" ? Number(daysAway) : null,
        restricted_work_days: required && restrictedDays !== "" ? Number(restrictedDays) : null,
        breach_of_absolute_safety_rules: required ? breachOfRules : false,
        breach_safety_rule_id: required && breachOfRules ? toId(breachRuleId) : null,
        // The API's "<field>_other_value" for the "Others" master.
        breach_safety_rule_other_value:
          required && breachOfRules && breachRuleIsOther ? breachRuleOther.trim() || null : null,
        investigation_summary: required ? summary.trim() : null,
        investigation_conclusion_id: required && !breachOfRules ? toId(conclusionId) : null,
      },
      checklist_sub_sub_category_ids: itemIds.map(toId),
      action_plans: itemIds.flatMap((itemId) =>
        ACTION_TYPES.map((type) => ({ type, plan: plansFor(itemId)[type] }))
          // Drafts skip untouched plans; on submit every plan is sent (and was validated).
          .filter(({ plan }) => submit || hasContent(plan))
          .map(({ type, plan }) => ({
            checklist_sub_sub_category_id: toId(itemId),
            action_type: type,
            action_description: plan.description.trim(),
            target_date: plan.targetDate || null,
            extend_target_date: plan.extendTargetDate || null,
            extension_reason: plan.extensionReason || null,
            responsible_person_ids: plan.owners.map((owner) => toId(owner.id)),
          })),
      ),
    };
  };

  const save = async (submit: boolean) => {
    if (!id || saving) return;
    setSaving(true);
    try {
      await saveViIncidentInvestigation(id, buildBody(submit), submit);
      toast.success(submit ? "Action plan submitted successfully" : "Action plan saved to draft");
      navigate(incidentPath);
    } catch (error) {
      errorToast(submit ? "Failed to submit action plan" : "Failed to save draft", error);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (!isNonNegative(daysAway) || !isNonNegative(restrictedDays)) {
      toast.error("Please add Days away from Work and Restricted Work Days (0 or more)");
      return;
    }
    if (!orderedItems.length) {
      toast.error("Select at least one root cause");
      return;
    }
    const emptyParent = categories
      .flatMap((category) => category.subCategories)
      .find((sub) => isParentChecked(sub) && !sub.items.some((item) => selectedItems.includes(item.id)));
    if (emptyParent) {
      toast.error(`Select at least one item under "${emptyParent.name}", or untick it`);
      return;
    }
    if (breachOfRules ? !breachRuleId : !conclusionId) {
      toast.error(breachOfRules ? "Please select the safety rule breached" : "Please select the investigation conclusion");
      return;
    }
    if (breachOfRules && breachRuleIsOther && !breachRuleOther.trim()) {
      toast.error("Please describe the other violation");
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
    save(true);
  };

  const handleSubmitPlans = () => {
    for (const [index, item] of orderedItems.entries()) {
      for (const type of ACTION_TYPES) {
        const plan = plansFor(item.id)[type];
        if (!plan.description.trim() || !plan.owners.length || !plan.targetDate) {
          toast.error(
            `${index + 1}. ${item.name}: ${ACTION_TYPE_LABEL[type]} plan, Responsible Person and Target Date are required`,
          );
          return;
        }
      }
    }
    save(true);
  };

  const handleBack = () => (step === 2 ? setStep(1) : navigate(incidentPath));

  if (incidentLoading) return <AuditLoadingState message="Loading incident..." />;
  if (!incident) return <AuditLoadingState message="Incident not found." onBack={() => navigate(INCIDENT_SPOC_PATH)} />;
  if (incident.storedStatus !== "open" || incident.investigation.submitted) {
    return (
      <AuditLoadingState
        message="The action plan for this incident has already been submitted."
        onBack={() => navigate(incidentPath)}
      />
    );
  }

  const draftButton = (
    <button type="button" className="fm-button-fix inline-flex items-center justify-center gap-2 border border-brand bg-white text-brand hover:bg-brand-selected px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => save(false)} disabled={saving}>
      Save Draft
    </button>
  );

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
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Incident — {incident.incidentNo}</h1>
        <span className="text-sm text-gray-500">Action Plan</span>
      </div>

      {step === 1 && (
        <>
          <DetailCard icon={sectionIcon(Search)} title="Investigation" className="mb-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">Investigation Required?</span>
              <Switch sx={auditSwitchSx} checked={investigationRequired} onChange={(e) => setInvestigationRequired(e.target.checked)} />
            </div>
            <div className="mt-4">
              {investigationRequired ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <TextField
                    fullWidth
                    type="number"
                    label={requiredLabel("Days away from Work")}
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
                    label={requiredLabel("Restricted Work Days")}
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

          {/* Root-cause checklists (GET /vi_incidents/checklist_hierarchy.json) — locked (dimmed, not
              clickable) until "Investigation Required?" is switched on */}
          {mastersLoading || checklistLoading ? (
            <p className="mb-5 text-sm text-gray-500">Loading root cause checklist...</p>
          ) : (
            <>
            {!investigationRequired && (
              <p className="mb-3 text-sm text-gray-500">
                Turn on “Investigation Required?” to select the root causes.
              </p>
            )}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 transition-opacity ${
                investigationRequired ? "" : "pointer-events-none select-none opacity-50"
              }`}
              aria-disabled={!investigationRequired}
            >
              {categories.map((category) => (
                <DetailCard key={category.id} icon={sectionIcon(ListChecks)} title={category.name}>
                  <div className="space-y-1">
                    {category.subCategories.map((sub) => {
                      const parentChecked = isParentChecked(sub);
                      return (
                        <div key={sub.id}>
                          {/* Parent: sub category */}
                          <FormControlLabel
                            className="!m-0 flex w-full !justify-between"
                            labelPlacement="start"
                            disabled={!investigationRequired}
                            control={
                              <Checkbox sx={auditCheckboxSx} checked={parentChecked} onChange={() => toggleParent(sub)} size="small" />
                            }
                            label={<span className="text-sm font-semibold text-gray-900">{sub.name}</span>}
                            sx={{ marginLeft: 0, justifyContent: "space-between" }}
                          />
                          {/* Children: sub-sub categories, shown once the parent is ticked */}
                          {parentChecked && (
                            <div className="mb-2 ml-3 border-l-2 border-gray-200 pl-3">
                              {sub.items.length ? (
                                sub.items.map((item) => (
                                  <FormControlLabel
                                    key={item.id}
                                    className="!m-0 flex w-full !justify-between"
                                    labelPlacement="start"
                                    disabled={!investigationRequired}
                                    control={
                                      <Checkbox sx={auditCheckboxSx}
                                        checked={selectedItems.includes(item.id)}
                                        onChange={() => toggleItem(item.id)}
                                        size="small"
                                      />
                                    }
                                    label={<span className="text-sm text-gray-600">{item.name}</span>}
                                    sx={{ marginLeft: 0, justifyContent: "space-between" }}
                                  />
                                ))
                              ) : (
                                <p className="py-1 text-xs text-gray-400">No checklist items</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </DetailCard>
              ))}
            </div>
            </>
          )}

          {investigationRequired && (
            <>
              <DetailCard icon={sectionIcon(ShieldCheck)} title="Breach of absolute safety rules" className="mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{breachOfRules ? "Yes" : "No"}</span>
                  <Switch sx={auditSwitchSx} checked={breachOfRules} onChange={(e) => setBreachOfRules(e.target.checked)} />
                </div>
                <div className="mt-4 max-w-md">
                  {breachOfRules ? (
                    <div className="space-y-5">
                      <IncidentSelectField
                        label="Safety Rule Breached"
                        required
                        value={breachRuleId}
                        onChange={setBreachRuleId}
                        options={masters.breachSafetyRules}
                        loading={mastersLoading}
                        placeholder="Select safety rule"
                      />
                      {/* "Others" asks for the rule in words */}
                      {breachRuleIsOther && (
                        <TextField
                          fullWidth
                          label={requiredLabel("Other Violation")}
                          placeholder="Describe the other HSW rule violated"
                          value={breachRuleOther}
                          onChange={(e) => setBreachRuleOther(e.target.value)}
                          sx={auditFieldSx}
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    </div>
                  ) : (
                    <IncidentSelectField
                      label="Investigation Conclusion"
                      required
                      value={conclusionId}
                      onChange={setConclusionId}
                      options={masters.investigationConclusions}
                      loading={mastersLoading}
                      placeholder="Select conclusion"
                    />
                  )}
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
            {draftButton}
            {investigationRequired ? (
              <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleNext} disabled={saving}>
                Next
              </button>
            ) : (
              <button
                type="button"
                className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSubmitWithoutInvestigation}
                disabled={saving}
              >
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
              Add a corrective and a preventive action plan for each root cause identified.
            </p>
          </DetailCard>

          {orderedItems.map((item, itemIndex) => (
            <DetailCard
              key={item.id}
              icon={sectionIcon(ListChecks)}
              title={`${itemIndex + 1}. ${item.name}`}
              className="mb-5"
            >
              {item.path && <p className="-mt-2 mb-4 text-xs text-gray-500">{item.path}</p>}
              <div className="space-y-6">
                {ACTION_TYPES.map((type, typeIndex) => {
                  const plan = plansFor(item.id)[type];
                  return (
                    <div key={type} className={typeIndex > 0 ? "border-t border-gray-200 pt-6" : ""}>
                      <div className="space-y-5">
                        <TextField
                          fullWidth
                          multiline
                          minRows={3}
                          label={requiredLabel(`${ACTION_TYPE_LABEL[type]} Action Plan`)}
                          placeholder="Describe the actions to be taken..."
                          value={plan.description}
                          onChange={(e) => updatePlan(item.id, type, { description: e.target.value })}
                          sx={auditFieldSx}
                          InputLabelProps={{ shrink: true }}
                        />
                        {/* Same label component and input height on both fields, so they line up in one row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5">
                          <MultiUserSelectField
                            label="Responsible Person"
                            required
                            value={plan.owners}
                            onChange={(owners) => updatePlan(item.id, type, { owners })}
                            placeholder="Search by email or mobile"
                          />
                          <div>
                            <AutocompleteLabel required>Select Target Date</AutocompleteLabel>
                            <TextField
                              fullWidth
                              type="date"
                              value={plan.targetDate}
                              onChange={(e) => updatePlan(item.id, type, { targetDate: e.target.value })}
                              inputProps={{ min: todayIso(), "aria-label": "Select Target Date" }}
                              sx={{ "& .MuiOutlinedInput-root": { height: { xs: 36, sm: 40, md: 45 } } }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DetailCard>
          ))}

          <div className="flex flex-wrap gap-4 justify-center pt-4 sm:pt-6">
            {draftButton}
            <button type="button" className="fm-button-fix fm-button-brand inline-flex items-center justify-center gap-2 px-8 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSubmitPlans} disabled={saving}>
              Submit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IncidentSpocActionPlanPage;
