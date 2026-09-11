import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { ArrowLeft, ClipboardList, Upload, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { LOCATIONS, TRAINERS, type ClassSetup } from "./classSetupMockData";

// Matches the Section pattern used by CreditNoteClubAdd/Edit (bg-[#F6F4EE] header bar,
// circular bg-[#E5E0D3] icon badge in the brand red) so Class Setup's Add/Edit pages look
// consistent with the rest of Club Management's create/edit flows.
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

// Matches AddTicketDashboard's fieldStyles: fixed 45px height, white background, brand-red
// border on hover/focus - the shared MUI look for create/edit forms across the app.
const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
};

// The required-field asterisk is a sibling of the input inside the same FormControl/TextField
// root, not a descendant of the input itself - so this has to go on the component's own top-level
// `sx`, not nested inside `InputProps.sx` (which only scopes to the input root).
const requiredLabelSx = {
  "& .MuiFormLabel-asterisk": {
    color: "#DA7756",
  },
};

export interface ClassSetupFormState {
  className: string;
  amountPerPerson: string;
  minParticipants: string;
  maxCapacity: string;
  location: string;
  duration: string;
  trainer: string;
  status: "Active" | "Inactive";
  description: string;
}

export const emptyClassSetupForm: ClassSetupFormState = {
  className: "",
  amountPerPerson: "",
  minParticipants: "",
  maxCapacity: "",
  location: "",
  duration: "",
  trainer: "",
  status: "Active",
  description: "",
};

interface ClassSetupFormProps {
  pageTitle: string;
  backLabel: string;
  initialValues: ClassSetupFormState;
  submitLabel: string;
  submittingLabel: string;
  onBack: () => void;
  onSubmit: (payload: Omit<ClassSetup, "id" | "trainers">) => void;
}

export const ClassSetupForm = ({
  pageTitle,
  backLabel,
  initialValues,
  submitLabel,
  submittingLabel,
  onBack,
  onSubmit,
}: ClassSetupFormProps) => {
  const [form, setForm] = useState<ClassSetupFormState>(initialValues);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = <K extends keyof ClassSetupFormState>(key: K, value: ClassSetupFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!form.className.trim() || !form.minParticipants || !form.maxCapacity || !form.location) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    onSubmit({
      className: form.className.trim(),
      amountPerPerson: form.amountPerPerson,
      minParticipants: Number(form.minParticipants),
      maxCapacity: Number(form.maxCapacity),
      location: form.location,
      duration: form.duration,
      trainer: form.trainer,
      status: form.status,
      description: form.description,
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
        <Section title="Class Details" icon={<ClipboardList className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TextField
              label="Class Name"
              required
              placeholder="Enter Title"
              value={form.className}
              onChange={(e) => setField("className", e.target.value)}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Amount per person"
              placeholder="Enter Amount"
              value={form.amountPerPerson}
              onChange={(e) => setField("amountPerPerson", e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Minimum person"
              required
              type="number"
              placeholder="Enter minimum"
              value={form.minParticipants}
              onChange={(e) => setField("minParticipants", e.target.value)}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />

            <TextField
              label="Maximum person"
              required
              type="number"
              placeholder="Enter maximum"
              value={form.maxCapacity}
              onChange={(e) => setField("maxCapacity", e.target.value)}
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
              <InputLabel shrink>Location</InputLabel>
              <MuiSelect
                value={form.location}
                onChange={(e) => setField("location", e.target.value)}
                label="Location"
                notched
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select location...
                </MenuItem>
                {LOCATIONS.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <TextField
              label="Duration"
              placeholder="Eg. 50 min."
              value={form.duration}
              onChange={(e) => setField("duration", e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />

            <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": fieldStyles }}>
              <InputLabel shrink>Trainer</InputLabel>
              <MuiSelect
                value={form.trainer}
                onChange={(e) => setField("trainer", e.target.value)}
                label="Trainer"
                notched
                displayEmpty
              >
                <MenuItem value="">Select trainer...</MenuItem>
                {TRAINERS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": fieldStyles }}>
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

            <div className="md:col-span-3">
              <div className="relative">
                <textarea
                  className="peer w-full rounded-md border border-gray-300 p-3 focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756] resize-y"
                  rows={4}
                  value={form.description}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) setField("description", e.target.value);
                  }}
                  placeholder="Enter Description"
                  maxLength={500}
                />
                <label className="absolute -top-2 left-3 bg-white px-1 text-xs font-normal text-black/60 peer-focus:text-[#DA7756]">
                  Class Description<span className="text-[#DA7756]">*</span>
                </label>
              </div>
              <div className="mt-1 text-right text-xs text-gray-400">{form.description.length}/500</div>
            </div>
          </div>
        </Section>

        {/* Attachment - compact "Upload Files" button + a list of attached file chips,
            matching AddTicketDashboard's "Add Attachments" section rather than a large dropzone. */}
        <Section title="Attachment" icon={<Paperclip className="w-4 h-4" />}>
          <div className="space-y-3">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="class-setup-file-upload"
            />
            <Button
              type="button"
              onClick={() => document.getElementById("class-setup-file-upload")?.click()}
              variant="outline"
              size="sm"
              className="border-dashed border-2 border-gray-300 hover:border-gray-400 text-gray-600 bg-white hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>

            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded border">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span>{file.name}</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
