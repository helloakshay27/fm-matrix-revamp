import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { ArrowLeft, UserRound, Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { SPECIALIZATIONS, type TrainerSetup } from "./trainerSetupMockData";

// Matches the Section pattern used by CreditNoteClubAdd/Edit and ClassSetupForm (bg-[#F6F4EE]
// header bar, circular bg-[#E5E0D3] icon badge in the brand red).
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

export interface TrainerSetupFormState {
  name: string;
  specialization: string;
  experience: string;
  ratePerSession: string;
  contactNumber: string;
  status: "Active" | "Inactive";
  bio: string;
}

export const emptyTrainerSetupForm: TrainerSetupFormState = {
  name: "",
  specialization: "",
  experience: "",
  ratePerSession: "",
  contactNumber: "",
  status: "Active",
  bio: "",
};

interface TrainerSetupFormProps {
  pageTitle: string;
  backLabel: string;
  initialValues: TrainerSetupFormState;
  submitLabel: string;
  submittingLabel: string;
  onBack: () => void;
  onSubmit: (payload: Omit<TrainerSetup, "id" | "credentials">) => void;
}

const UploadZone = ({
  id,
  label,
  hint,
  file,
  onPick,
  onClear,
  accept,
}: {
  id: string;
  label: string;
  hint: string;
  file: File | null;
  onPick: (file: File | null) => void;
  onClear: () => void;
  accept?: string;
}) => (
  <div>
    <div className="text-sm font-medium mb-2">{label}</div>
    <label
      htmlFor={id}
      className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md py-5 px-4 text-center cursor-pointer hover:border-brand transition-colors"
    >
      <Upload className="w-5 h-5 text-gray-400" />
      <span className="text-sm text-gray-500">{file ? file.name : hint}</span>
      <span className="mt-1 px-5 py-1.5 text-sm font-medium text-brand bg-gray-100 hover:bg-gray-200">
        Browse
      </span>
      <input
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
    </label>
    {file && (
      <button
        type="button"
        onClick={onClear}
        className="mt-2 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
      >
        <X className="w-3 h-3" /> Remove
      </button>
    )}
  </div>
);

export const TrainerSetupForm = ({
  pageTitle,
  backLabel,
  initialValues,
  submitLabel,
  submittingLabel,
  onBack,
  onSubmit,
}: TrainerSetupFormProps) => {
  const [form, setForm] = useState<TrainerSetupFormState>(initialValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = <K extends keyof TrainerSetupFormState>(key: K, value: TrainerSetupFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.specialization.trim() ||
      !form.experience.trim() ||
      !form.ratePerSession.trim() ||
      !form.contactNumber.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    onSubmit({
      name: form.name.trim(),
      specialization: form.specialization.trim(),
      experience: form.experience.trim(),
      ratePerSession: form.ratePerSession.trim(),
      contactNumber: form.contactNumber.trim(),
      status: form.status,
      bio: form.bio.trim(),
      imageUrl: imageFile ? imageFile.name : "",
    });
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

      <div className="space-y-6">
        <Section title="Trainer Details" icon={<UserRound className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField
              label="Trainer Name"
              required
              placeholder="e.g. Elena Rostova"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Specialization"
              required
              placeholder="e.g. Pilates, Yoga, Strength"
              value={form.specialization}
              onChange={(e) => setField("specialization", e.target.value)}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Experience (Years)"
              required
              placeholder="e.g. 5"
              value={form.experience}
              onChange={(e) => setField("experience", e.target.value)}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label="Rate per Session (₹)"
              required
              placeholder="e.g. 95"
              value={form.ratePerSession}
              onChange={(e) => setField("ratePerSession", e.target.value)}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Contact Number"
              required
              placeholder="e.g. +1 (555) 012-4432"
              value={form.contactNumber}
              onChange={(e) => setField("contactNumber", e.target.value)}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ "& .MuiInputBase-root": fieldStyles, ...requiredLabelSx }}
            >
              <InputLabel shrink>Status</InputLabel>
              <MuiSelect
                value={form.status}
                onChange={(e) => setField("status", e.target.value as "Active" | "Inactive")}
                label="Status"
                notched
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </MuiSelect>
            </FormControl>

            {/* <div className="md:col-span-3">
              <div className="relative">
                <textarea
                  className="peer w-full rounded-md border border-gray-300 p-3 focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756] resize-y"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setField("bio", e.target.value);
                  }}
                  placeholder="Short profile / specialities"
                  maxLength={500}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal text-black/60 peer-focus:text-[#DA7756]">
                  Bio
                </label>
              </div>
              <div className="mt-1 text-right text-xs text-gray-400">{form.bio.length}/500</div>
            </div> */}
          </div>
        </Section>

        <Section title="Attachments & Files" icon={<Paperclip className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <UploadZone
              id="trainer-image-upload"
              label="Upload Trainer Image"
              hint="Choose a photo or drag & drop it here"
              accept="image/*"
              file={imageFile}
              onPick={setImageFile}
              onClear={() => setImageFile(null)}
            />
            <UploadZone
              id="trainer-cert-upload"
              label="Upload Certificates"
              hint="Upload professional credentials (PDF/JPG)"
              accept=".pdf,.jpg,.jpeg,.png"
              file={certFile}
              onPick={setCertFile}
              onClear={() => setCertFile(null)}
            />
            <UploadZone
              id="trainer-contract-upload"
              label="Upload Contract"
              hint="Upload professional credentials (PDF/JPG)"
              accept=".pdf,.jpg,.jpeg,.png"
              file={contractFile}
              onPick={setContractFile}
              onClear={() => setContractFile(null)}
            />
          </div>
        </Section>
      </div>

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

// Kept exported so a future dropdown can reuse the canonical specialization list.
export { SPECIALIZATIONS };
