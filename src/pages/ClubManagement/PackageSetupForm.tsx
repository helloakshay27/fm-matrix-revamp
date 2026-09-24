import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { ArrowLeft, Package as PackageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  PACKAGE_CLASSES,
  PACKAGE_TIER_TYPES,
  blankTier,
  type PricingTier,
} from "./packageSetupMockData";

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="border border-gray-200 rounded-lg overflow-hidden">
    <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
      <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
        {icon}
      </div>
      <span className="font-semibold text-lg text-gray-800">{title}</span>
    </div>
    <div className="p-6 bg-white">{children}</div>
  </section>
);

const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "#C72030" },
    "&.Mui-focused fieldset": { borderColor: "#C72030" },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": { color: "#C72030" },
  },
};

const requiredLabelSx = {
  "& .MuiFormLabel-asterisk": { color: "#DA7756" },
};

// Blocks typing/pasting the "-" sign so number fields can't go negative
// (the `min: 0` attribute alone only affects the spinner, not typed input).
const blockNegativeKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "-" || e.key === "e") e.preventDefault();
};

const toNonNegative = (value: string): number => Math.max(0, Number(value) || 0);

// Numeric tier fields are edited as `number | ""` so a genuinely empty field keeps
// showing its placeholder, while a value the user actually set to 0 still renders as "0"
// (a plain `number` state can't tell those two cases apart).
type NumericTierField =
  | "credits"
  | "validityDays"
  | "priceMember"
  | "priceHotelGuest"
  | "priceNonMember"
  | "cgstRate"
  | "sgstRate";

type TierDraft = Omit<PricingTier, NumericTierField | "price" | "gstPercent"> & {
  [K in NumericTierField]: number | "";
};

const toDraft = (t: PricingTier): TierDraft => ({
  ...t,
  credits: t.credits,
  validityDays: t.validityDays,
  priceMember: t.priceMember,
  priceHotelGuest: t.priceHotelGuest,
  priceNonMember: t.priceNonMember,
  cgstRate: t.cgstRate,
  sgstRate: t.sgstRate,
});

const blankDraft = (): TierDraft => ({
  ...toDraft({ ...blankTier() }),
  credits: "",
  validityDays: "",
  priceMember: "",
  priceHotelGuest: "",
  priceNonMember: "",
  cgstRate: "",
  sgstRate: "",
});

const draftToTier = (d: TierDraft): PricingTier => {
  const priceMember = Number(d.priceMember) || 0;
  return {
    ...d,
    credits: Number(d.credits) || 0,
    validityDays: Number(d.validityDays) || 0,
    priceMember,
    priceHotelGuest: Number(d.priceHotelGuest) || 0,
    priceNonMember: Number(d.priceNonMember) || 0,
    cgstRate: Number(d.cgstRate) || 0,
    sgstRate: Number(d.sgstRate) || 0,
    price: priceMember,
    gstPercent: (Number(d.cgstRate) || 0) + (Number(d.sgstRate) || 0),
  };
};

export interface PackageSetupFormState {
  classActivity: string;
  memberTiers: PricingTier[];
  nonMemberTiers: PricingTier[];
}

export const emptyPackageSetupForm: PackageSetupFormState = {
  classActivity: "",
  memberTiers: [blankTier()],
  nonMemberTiers: [],
};

interface PackageSetupFormProps {
  pageTitle: string;
  backLabel: string;
  initialValues: PackageSetupFormState;
  submitLabel: string;
  submittingLabel: string;
  onBack: () => void;
  onSubmit: (payload: {
    classActivity: string;
    memberTiers: PricingTier[];
    nonMemberTiers: PricingTier[];
  }) => void;
}

export const PackageSetupForm = ({
  pageTitle,
  backLabel,
  initialValues,
  submitLabel,
  submittingLabel,
  onBack,
  onSubmit,
}: PackageSetupFormProps) => {
  const [classActivity, setClassActivity] = useState(initialValues.classActivity);
  const [tier, setTier] = useState<TierDraft>(
    initialValues.memberTiers[0] ? toDraft(initialValues.memberTiers[0]) : blankDraft()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patchTier = (patch: Partial<TierDraft>) => setTier((prev) => ({ ...prev, ...patch }));

  // Empty input keeps the field blank (placeholder shows); anything typed is clamped to >= 0.
  const handleNumberChange =
    (field: NumericTierField) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      patchTier({ [field]: raw === "" ? "" : toNonNegative(raw) } as Partial<TierDraft>);
    };

  const handleSubmit = () => {
    if (!classActivity) {
      toast.error("Please select a class");
      return;
    }
    setIsSubmitting(true);
    onSubmit({ classActivity, memberTiers: [draftToTier(tier)], nonMemberTiers: [] });
  };

  return (
    <div className="p-6 space-y-6 relative">
      <header className="mb-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-black font-medium mb-2"
        >
          <ArrowLeft className="h-4 w-4 text-black" />
          {backLabel}
        </button>
        <h1 className="text-2xl font-bold text-black">{pageTitle}</h1>
      </header>

      <Section title="Package Details" icon={<PackageIcon className="w-5 h-5" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormControl
            fullWidth
            variant="outlined"
            required
            sx={{ "& .MuiInputBase-root": fieldStyles, ...requiredLabelSx }}
          >
            <InputLabel shrink>Select Class</InputLabel>
            <MuiSelect
              value={classActivity}
              onChange={(e) => setClassActivity(e.target.value)}
              label="Select Class"
              notched
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select class
              </MenuItem>
              {PACKAGE_CLASSES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="Package"
            placeholder="Enter package name"
            value={tier.label}
            onChange={(e) => patchTier({ label: e.target.value })}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": fieldStyles }}>
            <InputLabel shrink>Package Type</InputLabel>
            <MuiSelect
              value={tier.packageType}
              onChange={(e) => patchTier({ packageType: e.target.value as string })}
              label="Package Type"
              notched
              displayEmpty
              renderValue={(selected) =>
                selected
                  ? PACKAGE_TIER_TYPES.find((type) => type.value === selected)?.label ?? String(selected)
                  : "Select package type"
              }
            >
              <MenuItem value="" disabled>
                Select package type
              </MenuItem>
              {PACKAGE_TIER_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="No. of Classes"
            type="number"
            placeholder="Enter number of classes"
            value={tier.credits}
            onChange={handleNumberChange("credits")}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
            inputProps={{ min: 0, onKeyDown: blockNegativeKey }}
          />

          <TextField
            label="Validity Days (from purchase)"
            type="number"
            placeholder="Enter validity in days"
            value={tier.validityDays}
            onChange={handleNumberChange("validityDays")}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
            inputProps={{ min: 0, onKeyDown: blockNegativeKey }}
          />

          <TextField
            label="Price Member (₹)"
            type="number"
            placeholder="Enter member price"
            value={tier.priceMember}
            onChange={handleNumberChange("priceMember")}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
            inputProps={{ min: 0, onKeyDown: blockNegativeKey }}
          />

          <TextField
            label="Hotel Guest (₹)"
            type="number"
            placeholder="Enter hotel guest price"
            value={tier.priceHotelGuest}
            onChange={handleNumberChange("priceHotelGuest")}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
            inputProps={{ min: 0, onKeyDown: blockNegativeKey }}
          />

          <TextField
            label="Non Member (₹)"
            type="number"
            placeholder="Enter non-member price"
            value={tier.priceNonMember}
            onChange={handleNumberChange("priceNonMember")}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
            inputProps={{ min: 0, onKeyDown: blockNegativeKey }}
          />

          <TextField
            label="CGST %"
            type="number"
            placeholder="Enter CGST %"
            value={tier.cgstRate}
            onChange={handleNumberChange("cgstRate")}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
            inputProps={{ min: 0, max: 100, onKeyDown: blockNegativeKey }}
          />

          <TextField
            label="SGST %"
            type="number"
            placeholder="Enter SGST %"
            value={tier.sgstRate}
            onChange={handleNumberChange("sgstRate")}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
            inputProps={{ min: 0, max: 100, onKeyDown: blockNegativeKey }}
          />

          <TextField
            label="HSN Code"
            placeholder="Enter HSN code"
            value={tier.hsnCode}
            onChange={(e) => patchTier({ hsnCode: e.target.value })}
            fullWidth
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />
        </div>
      </Section>

      <div className="flex items-center gap-3 justify-center pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="fm-button-fix fm-button-brand px-8 py-2"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        <Button
          onClick={onBack}
          disabled={isSubmitting}
          variant="outline"
          className="fm-button-fix px-8 py-2"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
