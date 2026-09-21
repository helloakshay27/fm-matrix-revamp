import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { ArrowLeft, Package as PackageIcon, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  PACKAGE_CLASSES,
  gstAmount,
  newTier,
  tierTotal,
  type PackageSetup,
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

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export interface PackageSetupFormState {
  classActivity: string;
  tiers: PricingTier[];
}

export const emptyPackageSetupForm: PackageSetupFormState = {
  classActivity: "",
  tiers: [],
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
    tiers: PricingTier[];
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
  const [tiers, setTiers] = useState<PricingTier[]>(initialValues.tiers);
  const [draft, setDraft] = useState({ label: "", price: "", gstPercent: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const patchTier = (id: string, patch: Partial<PricingTier>) =>
    setTiers((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const removeTier = (id: string) => setTiers((rows) => rows.filter((r) => r.id !== id));

  const addDraftTier = () => {
    if (!draft.label.trim()) {
      toast.error("Enter a package name for the new pricing row");
      return;
    }
    setTiers((rows) => [
      ...rows,
      {
        ...newTier(),
        label: draft.label.trim(),
        price: Number(draft.price) || 0,
        gstPercent: Number(draft.gstPercent) || 18,
      },
    ]);
    setDraft({ label: "", price: "", gstPercent: "" });
  };

  const handleSubmit = () => {
    if (!classActivity) {
      toast.error("Please select a class");
      return;
    }
    setIsSubmitting(true);
    onSubmit({ classActivity, tiers });
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
        <div className="max-w-sm mb-6">
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
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
            <h3 className="font-semibold text-gray-900">Club member pricing</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-2 font-medium">Package</th>
                  <th className="px-4 py-2 font-medium w-40">Price (₹)</th>
                  <th className="px-4 py-2 font-medium w-28">GST %</th>
                  <th className="px-4 py-2 font-medium w-32 text-right">Total</th>
                  <th className="px-4 py-2 font-medium w-12" />
                </tr>
              </thead>
              <tbody>
                {/* New pricing tier draft row */}
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-2">
                    <input
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]"
                      placeholder="Enter package name"
                      value={draft.label}
                      onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]"
                      placeholder="Enter Price"
                      value={draft.price}
                      onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]"
                      placeholder="Enter %"
                      value={draft.gstPercent}
                      onChange={(e) => setDraft((d) => ({ ...d, gstPercent: e.target.value }))}
                    />
                  </td>
                  <td className="px-4 py-2 text-right text-gray-500">
                    {inr(
                      (Number(draft.price) || 0) +
                        Math.round(((Number(draft.price) || 0) * (Number(draft.gstPercent) || 0)) / 100)
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="fm-button-fix px-3"
                      onClick={addDraftTier}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>

                {tiers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                      No pricing tiers yet. Add one above.
                    </td>
                  </tr>
                ) : (
                  tiers.map((tier) => (
                    <tr key={tier.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-2">
                        <input
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]"
                          value={tier.label}
                          onChange={(e) => patchTier(tier.id, { label: e.target.value })}
                        />
                        <input
                          className="mt-1 w-28 border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-500 focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]"
                          type="number"
                          value={tier.credits}
                          onChange={(e) => patchTier(tier.id, { credits: Number(e.target.value) || 0 })}
                          placeholder="credits"
                        />
                      </td>
                      <td className="px-4 py-2 align-top">
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]"
                          value={tier.price}
                          onChange={(e) => patchTier(tier.id, { price: Number(e.target.value) || 0 })}
                        />
                        <div className="mt-1 text-xs text-gray-400">GST {inr(gstAmount(tier))}</div>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]"
                          value={tier.gstPercent}
                          onChange={(e) => patchTier(tier.id, { gstPercent: Number(e.target.value) || 0 })}
                        />
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-gray-900 align-top">
                        {inr(tierTotal(tier))}
                      </td>
                      <td className="px-4 py-2 text-right align-top">
                        <button
                          type="button"
                          onClick={() => removeTier(tier.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Remove tier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
