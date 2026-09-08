import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Paperclip, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Placeholder option lists — swap for live master-data lookups once the Audit
// backend is available.
const AUDIT_CIRCLES = ["Birla", "Tata", "Adani", "Godrej"];
const AUDIT_ZONES = ["Worli", "Churchgate", "Andheri", "Bandra"];
const AUDIT_LOCATIONS = [
  "Birla centurion Pvt. Ltd.",
  "Tata Projects Pvt. Ltd.",
  "Adani Realty Pvt. Ltd.",
];
const AUDIT_FUNCTIONS = ["Test", "Operations", "Maintenance", "Security"];
const VENDORS = [
  "Jethalal & Sons Pvt. Ltd.",
  "Popatlal Pvt. Ltd.",
  "Reliance Industries Ltd.",
  "Mahindra Infra Ltd.",
];
const CLASSIFICATIONS = ["Very High", "High", "Medium", "Low"];
const CATEGORIES = ["Electronic", "Mechanical", "Civil"];
const SUB_CATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  Electronic: ["HVAC", "Wiring"],
  Mechanical: ["Plumbing"],
  Civil: ["Scaffolding"],
};
const SPOCS = ["Arun Mohan", "Veena Kumari", "Vikram Singh", "Kiran Joshi"];
const FUNCTIONAL_HEADS = ["Vinit Mehra", "Priya Nair", "Rohit Sharma"];
const RESPONSIBLE_PERSONS = [...SPOCS, ...FUNCTIONAL_HEADS];

const STEPS = [
  "General Details",
  "Observation Details",
  "Action Plan",
  "Actions Taken",
] as const;

interface RequestorDetails {
  name: string;
  mailId: string;
  designation: string;
}

interface BasicDetails {
  dateOfAudit: string;
  auditCircle: string;
  auditZone: string;
  auditLocation: string;
  auditFunction: string;
}

interface VendorDetails {
  vendor: string;
  subVendor: string;
}

interface ObservationDetails {
  observation: string;
  attachments: string[];
  classification: string;
  category: string;
  subCategory: string;
  spoc: string;
  functionalHead: string;
}

interface ActionPlanEntry {
  actionPlan: string;
  attachmentName: string;
  responsiblePerson: string;
  targetDate: string;
  reassignTargetDate: string;
  reasonForReassigning: string;
}

const EMPTY_ACTION_PLAN_ENTRY: ActionPlanEntry = {
  actionPlan: "",
  attachmentName: "",
  responsiblePerson: "",
  targetDate: "",
  reassignTargetDate: "",
  reasonForReassigning: "",
};

interface ActionTakenEntry {
  actionTaken: string;
  attachmentName: string;
  closureDate: string;
}

const EMPTY_ACTION_TAKEN_ENTRY: ActionTakenEntry = {
  actionTaken: "",
  attachmentName: "",
  closureDate: "",
};

function getLoggedInUser(): { name: string; email: string } {
  try {
    const raw = JSON.parse(localStorage.getItem("user") || "{}");
    const name = [raw?.firstname, raw?.lastname].filter(Boolean).join(" ").trim();
    return { name: name || raw?.name || "", email: raw?.email || "" };
  } catch {
    return { name: "", email: "" };
  }
}

function SectionCard({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm">
      <CardHeader className="bg-[#F6F4EE]">
        <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
          <span className="w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium shrink-0">
            {number}
          </span>
          {title.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">{children}</CardContent>
    </Card>
  );
}

function FieldSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div>
      <Label className="text-xs text-gray-600 mb-1 block">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/** Same floating-label look as the Input/Textarea `label` prop (label straddling
 *  the border), reproduced for Select since it doesn't have that mode built in. */
function FloatingFieldSelect({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <div className="relative mt-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-600 pointer-events-none">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </span>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-gray-500">{label} : </span>
      <span className="text-sm font-semibold text-gray-800">{value || "-"}</span>
    </div>
  );
}

function RecapSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-6 border-[#D9D9D9] bg-[#FAFAF7] shadow-sm">
      <CardHeader className="bg-[#F6F4EE]">
        <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
          <span className="w-6 h-6 bg-[#C4B89D] text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium shrink-0">
            {number}
          </span>
          {title.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-2">{children}</div>
      </CardContent>
    </Card>
  );
}

function ActionPlanSection({
  number,
  title,
  entries,
  onChange,
  onAdd,
}: {
  number: number;
  title: string;
  entries: ActionPlanEntry[];
  onChange: (index: number, patch: Partial<ActionPlanEntry>) => void;
  onAdd: () => void;
}) {
  return (
    <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm">
      <CardHeader className="bg-[#F6F4EE]">
        <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
          <span className="w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium shrink-0">
            {number}
          </span>
          {title.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {entries.map((entry, index) => (
          <div key={index} className={index > 0 ? "pt-4 border-t border-gray-100" : ""}>
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-gray-600 mb-1 block">
                  Action Plan<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Describe the immediate actions to be taken..."
                  value={entry.actionPlan}
                  onChange={(e) => onChange(index, { actionPlan: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50">
                  Upload Attachment
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      onChange(index, { attachmentName: e.target.files?.[0]?.name ?? "" })
                    }
                  />
                </label>
                <span className="text-sm text-gray-500">
                  {entry.attachmentName || "No file chosen"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FieldSelect
                  label="Responsible Person"
                  required
                  value={entry.responsiblePerson}
                  onChange={(v) => onChange(index, { responsiblePerson: v })}
                  options={RESPONSIBLE_PERSONS}
                  placeholder="Select"
                />
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    Target Date<span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={entry.targetDate}
                      onChange={(e) => onChange(index, { targetDate: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Reassign Target Date</Label>
                  <Input
                    type="date"
                    value={entry.reassignTargetDate}
                    onChange={(e) => onChange(index, { reassignTargetDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-600 mb-1 block">Reason for Reassigning</Label>
                <Textarea
                  placeholder="Describe the reason for reassigning..."
                  value={entry.reasonForReassigning}
                  onChange={(e) => onChange(index, { reasonForReassigning: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          className="bg-brand hover:bg-brand-hover text-white"
          onClick={onAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </CardContent>
    </Card>
  );
}

function ActionTakenSection({
  number,
  title,
  entries,
  onChange,
  onAdd,
}: {
  number: number;
  title: string;
  entries: ActionTakenEntry[];
  onChange: (index: number, patch: Partial<ActionTakenEntry>) => void;
  onAdd: () => void;
}) {
  return (
    <Card className="mb-6 border-[#D9D9D9] bg-white shadow-sm">
      <CardHeader className="bg-[#F6F4EE]">
        <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
          <span className="w-6 h-6 bg-brand text-white rounded-full flex items-center justify-center text-sm mr-2 font-medium shrink-0">
            {number}
          </span>
          {title.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`space-y-4 bg-[#FAFAF7] border border-gray-100 rounded-md p-4 ${
              index > 0 ? "mt-4" : ""
            }`}
          >
            <Textarea
              label="Action Taken*"
              placeholder="Describe the immediate actions taken..."
              value={entry.actionTaken}
              onChange={(e) => onChange(index, { actionTaken: e.target.value })}
            />

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50 bg-white">
                Upload Attachment
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    onChange(index, { attachmentName: e.target.files?.[0]?.name ?? "" })
                  }
                />
              </label>
              <span className="text-sm text-gray-500">
                {entry.attachmentName || "No file chosen"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                type="date"
                label="Closure Date*"
                value={entry.closureDate}
                onChange={(e) => onChange(index, { closureDate: e.target.value })}
              />
            </div>
          </div>
        ))}

        <Button type="button" className="bg-brand hover:bg-brand-hover text-white" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </CardContent>
    </Card>
  );
}

const ViAuditAddPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const loggedInUser = useMemo(getLoggedInUser, []);
  // Placeholder — the real Audit ID is assigned by the backend once this form
  // is wired to a live create-audit API.
  const auditId = useMemo(() => Math.floor(Math.random() * 900) + 100, []);

  const [requestor, setRequestor] = useState<RequestorDetails>({
    name: loggedInUser.name,
    mailId: loggedInUser.email,
    designation: "",
  });
  const [basic, setBasic] = useState<BasicDetails>({
    dateOfAudit: "",
    auditCircle: "",
    auditZone: "",
    auditLocation: "",
    auditFunction: "",
  });
  const [vendor, setVendor] = useState<VendorDetails>({ vendor: "", subVendor: "" });
  const [observation, setObservation] = useState<ObservationDetails>({
    observation: "",
    attachments: [],
    classification: "",
    category: "",
    subCategory: "",
    spoc: "",
    functionalHead: "",
  });
  const [correctivePlans, setCorrectivePlans] = useState<ActionPlanEntry[]>([
    { ...EMPTY_ACTION_PLAN_ENTRY },
  ]);
  const [preventivePlans, setPreventivePlans] = useState<ActionPlanEntry[]>([
    { ...EMPTY_ACTION_PLAN_ENTRY },
  ]);
  // Placeholder field set — the real "Actions Taken" step hasn't been specced yet;
  // swap these once the actual fields/layout for this step are confirmed.
  const [actionsTaken, setActionsTaken] = useState({ summary: "", status: "" });
  const [preventiveActionsTaken, setPreventiveActionsTaken] = useState<ActionTakenEntry[]>([
    { ...EMPTY_ACTION_TAKEN_ENTRY },
  ]);

  const subCategoryOptions = observation.category
    ? SUB_CATEGORIES_BY_CATEGORY[observation.category] ?? []
    : [];

  const updateEntry = <T,>(
    setter: React.Dispatch<React.SetStateAction<T[]>>,
    index: number,
    patch: Partial<T>,
  ) => {
    setter((prev) => prev.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)));
  };

  const handleBack = () => {
    if (step === 0) {
      navigate(-1);
    } else {
      setStep((s) => Math.max(0, s - 1));
    }
  };

  const handleNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  const handleSaveDraft = () => {
    toast.success("Audit saved to draft");
    navigate("/safety/audit-list");
  };

  const handleSubmit = () => {
    toast.success("Audit submitted");
    navigate("/safety/audit-list");
  };

  const renderNavigation = () => (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={handleBack}>
        Back
      </Button>
      <div className="flex items-center gap-3">
        {step === STEPS.length - 1 ? (
          <>
            <Button variant="outline" onClick={handleSaveDraft}>
              Save to Draft
            </Button>
            <Button className="bg-brand hover:bg-brand-hover text-white" onClick={handleSubmit}>
              Submit
            </Button>
          </>
        ) : (
          <Button className="bg-brand hover:bg-brand-hover text-white" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <button
            type="button"
            className="flex items-center gap-1 hover:text-gray-700"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Schedule List
          </button>
          <span>&gt;</span>
          <button
            type="button"
            className="font-semibold text-gray-700 hover:underline"
            onClick={() => navigate("/safety/audit-list")}
          >
            Back to Audit List
          </button>
        </div>

        <h1 className="text-xl font-bold tracking-wide mb-6">NEW AUDIT</h1>

        {/* Stepper */}
        <div className="flex items-center mb-6">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div
                className={`flex-1 text-center py-3 px-3 border rounded-md text-sm font-semibold whitespace-nowrap ${
                  idx <= step
                    ? "border-brand text-brand"
                    : "border-[#C4B89D] text-[#8a8272]"
                }`}
              >
                {label}
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 border-t-2 border-dotted mx-2 ${
                    idx < step ? "border-brand" : "border-[#C4B89D]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: General Details */}
        {step === 0 && (
          <>
            <SectionCard number={1} title="Requestor Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Name</Label>
                  <Input
                    value={requestor.name}
                    onChange={(e) => setRequestor((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Mail ID</Label>
                  <Input
                    type="email"
                    value={requestor.mailId}
                    onChange={(e) => setRequestor((p) => ({ ...p, mailId: e.target.value }))}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Designation</Label>
                  <Input
                    value={requestor.designation}
                    onChange={(e) =>
                      setRequestor((p) => ({ ...p, designation: e.target.value }))
                    }
                  />
                </div>
              </div>
            </SectionCard>

            <SectionCard number={2} title="Basic Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">
                    Date of Audit<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={basic.dateOfAudit}
                    onChange={(e) => setBasic((p) => ({ ...p, dateOfAudit: e.target.value }))}
                  />
                </div>
                <FieldSelect
                  label="Audit Circle"
                  required
                  value={basic.auditCircle}
                  onChange={(v) => setBasic((p) => ({ ...p, auditCircle: v }))}
                  options={AUDIT_CIRCLES}
                  placeholder="Select Circle"
                />
                <FieldSelect
                  label="Audit Zone"
                  required
                  value={basic.auditZone}
                  onChange={(v) => setBasic((p) => ({ ...p, auditZone: v }))}
                  options={AUDIT_ZONES}
                  placeholder="Select Zone"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldSelect
                  label="Audit Location"
                  required
                  value={basic.auditLocation}
                  onChange={(v) => setBasic((p) => ({ ...p, auditLocation: v }))}
                  options={AUDIT_LOCATIONS}
                  placeholder="Select Location"
                />
                <FieldSelect
                  label="Audit Function"
                  required
                  value={basic.auditFunction}
                  onChange={(v) => setBasic((p) => ({ ...p, auditFunction: v }))}
                  options={AUDIT_FUNCTIONS}
                  placeholder="Select Function"
                />
              </div>
            </SectionCard>

            <SectionCard number={3} title="Vendor Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldSelect
                  label="Vendor"
                  value={vendor.vendor}
                  onChange={(v) => setVendor((p) => ({ ...p, vendor: v }))}
                  options={VENDORS}
                  placeholder="Select Vendor"
                />
                <FieldSelect
                  label="Sub Vendor"
                  value={vendor.subVendor}
                  onChange={(v) => setVendor((p) => ({ ...p, subVendor: v }))}
                  options={VENDORS}
                  placeholder="Select Sub Vendor"
                />
              </div>
            </SectionCard>
          </>
        )}

        {/* Step 2: Observation Details */}
        {step === 1 && (
          <SectionCard number={4} title="Observation Details">
            <Textarea
              label="Observation*"
              placeholder=""
              value={observation.observation}
              onChange={(e) =>
                setObservation((p) => ({ ...p, observation: e.target.value }))
              }
            />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Attachments :</span>
              {observation.attachments.map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-1 pr-2 py-1"
                >
                  <span className="w-6 h-6 rounded-full bg-brand flex items-center justify-center shrink-0">
                    <Paperclip className="w-3 h-3 text-white" />
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{name}</span>
                  <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                </span>
              ))}
              <label className="text-sm font-medium text-brand cursor-pointer hover:underline">
                + Add Attachment
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const names = Array.from(e.target.files ?? []).map((f) => f.name);
                    if (names.length === 0) return;
                    setObservation((p) => ({ ...p, attachments: [...p.attachments, ...names] }));
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FloatingFieldSelect
                label="Classification"
                required
                value={observation.classification}
                onChange={(v) => setObservation((p) => ({ ...p, classification: v }))}
                options={CLASSIFICATIONS}
                placeholder="Select Classification"
              />
              <FloatingFieldSelect
                label="Category"
                required
                value={observation.category}
                onChange={(v) =>
                  setObservation((p) => ({ ...p, category: v, subCategory: "" }))
                }
                options={CATEGORIES}
                placeholder="Select Category"
              />
              <FloatingFieldSelect
                label="Sub Category"
                required
                value={observation.subCategory}
                onChange={(v) => setObservation((p) => ({ ...p, subCategory: v }))}
                options={subCategoryOptions}
                placeholder="Select Sub Category"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingFieldSelect
                label="SPOC"
                required
                value={observation.spoc}
                onChange={(v) => setObservation((p) => ({ ...p, spoc: v }))}
                options={SPOCS}
                placeholder="Select SPOC"
              />
              <FloatingFieldSelect
                label="Functional Head"
                required
                value={observation.functionalHead}
                onChange={(v) => setObservation((p) => ({ ...p, functionalHead: v }))}
                options={FUNCTIONAL_HEADS}
                placeholder="Select Functional Head"
              />
            </div>
          </SectionCard>
        )}

        {/* Step 3: Action Plan */}
        {step === 2 && (
          <>
            <ActionPlanSection
              number={5}
              title="Corrective Action Plan (0-7 Days)"
              entries={correctivePlans}
              onChange={(index, patch) => updateEntry(setCorrectivePlans, index, patch)}
              onAdd={() =>
                setCorrectivePlans((prev) => [...prev, { ...EMPTY_ACTION_PLAN_ENTRY }])
              }
            />
            <ActionPlanSection
              number={6}
              title="Preventive Action Plan (15-30 Days)"
              entries={preventivePlans}
              onChange={(index, patch) => updateEntry(setPreventivePlans, index, patch)}
              onAdd={() =>
                setPreventivePlans((prev) => [...prev, { ...EMPTY_ACTION_PLAN_ENTRY }])
              }
            />
          </>
        )}

        {/* Step 4: Actions Taken — placeholder fields pending the real spec for this step */}
        {step === 3 && (
          <SectionCard number={7} title="Actions Taken">
            <div>
              <Label className="text-xs text-gray-600 mb-1 block">Actions Taken Summary</Label>
              <Textarea
                placeholder="Describe the actions taken to close this audit..."
                value={actionsTaken.summary}
                onChange={(e) =>
                  setActionsTaken((p) => ({ ...p, summary: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FieldSelect
                label="Status"
                required
                value={actionsTaken.status}
                onChange={(v) => setActionsTaken((p) => ({ ...p, status: v }))}
                options={["Open", "Completed", "Draft"]}
                placeholder="Select Status"
              />
            </div>
          </SectionCard>
        )}

        {step === 3 && (
          <ActionTakenSection
            number={8}
            title="Preventive Action Taken (15-30 Days)"
            entries={preventiveActionsTaken}
            onChange={(index, patch) => updateEntry(setPreventiveActionsTaken, index, patch)}
            onAdd={() =>
              setPreventiveActionsTaken((prev) => [...prev, { ...EMPTY_ACTION_TAKEN_ENTRY }])
            }
          />
        )}

        {/* Navigation sits right after the current step's own section(s) — above the
            recap of earlier steps below it, not at the very bottom of the page. */}
        <div className="mb-6">{renderNavigation()}</div>

        {/* Recap of earlier steps — shown below the current step's own section(s), not above */}
        {step >= 1 && (
          <>
            <RecapSection number={1} title="Requestor Details">
              <RecapRow label="Name" value={requestor.name} />
              <RecapRow label="Email" value={requestor.mailId} />
              <RecapRow label="Designation" value={requestor.designation} />
            </RecapSection>
            <RecapSection number={2} title="Basic Details">
              <RecapRow label="Audit ID" value={String(auditId)} />
              <RecapRow label="Date of Audit" value={basic.dateOfAudit} />
              <RecapRow label="Audit Circle" value={basic.auditCircle} />
              <RecapRow label="Audit Zone" value={basic.auditZone} />
              <RecapRow label="Audit Location" value={basic.auditLocation} />
              <RecapRow label="Audit Function" value={basic.auditFunction} />
            </RecapSection>
            <RecapSection number={3} title="Vendor Details">
              <RecapRow label="Vendor Name" value={vendor.vendor} />
              <RecapRow label="Sub Vendor Name" value={vendor.subVendor} />
            </RecapSection>
          </>
        )}

        {step >= 2 && (
          <RecapSection number={4} title="Observation Details">
            <RecapRow label="Observation" value={observation.observation} />
            <RecapRow label="Classification" value={observation.classification} />
            <RecapRow label="Category" value={observation.category} />
            <RecapRow label="Sub Category" value={observation.subCategory} />
            <RecapRow label="SPOC" value={observation.spoc} />
            <RecapRow label="Functional Head" value={observation.functionalHead} />
          </RecapSection>
        )}

        {step >= 3 && (
          <RecapSection number={5} title="Action Plan">
            <RecapRow
              label="Corrective Actions Added"
              value={String(correctivePlans.filter((p) => p.actionPlan).length)}
            />
            <RecapRow
              label="Preventive Actions Added"
              value={String(preventivePlans.filter((p) => p.actionPlan).length)}
            />
          </RecapSection>
        )}

      </div>
    </div>
  );
};

export default ViAuditAddPage;
