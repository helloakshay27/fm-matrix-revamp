import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, ListItemText } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { ArrowLeft, ClipboardList, Upload, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { CLASS_TYPES, ACTIVITY_TYPES, type ClassSetup } from "./classSetupMockData";

interface TrainerOption {
  id: string;
  name: string;
}

export interface SelectedTrainer {
  name: string;
  value: number;
}

// The native <input type="time"> picker's popup (hour/minute/AM-PM wheel columns) is
// browser/OS chrome and can't be recolored via CSS - swapping to MUI X's TimePicker
// renders that popup in React instead, so its selected-state highlight (and the clock
// toggle icon) can actually be themed to the brand orange.
const timePickerSlotProps = {
  textField: { fullWidth: true as const, variant: "outlined" as const },
  openPickerButton: { sx: { color: "#DA7756" } },
  digitalClockSectionItem: {
    // The section item carries two separately-generated classes (this slot's override,
    // and MuiMenuItem's own default `.Mui-selected` blue) with equal specificity - source
    // order decides the tie, and MenuItem's tends to win. `!important` forces this one through.
    sx: {
      "&.Mui-selected": {
        backgroundColor: "#DA7756 !important",
        color: "#fff !important",
      },
      "&.Mui-selected:hover, &.Mui-selected:focus": {
        backgroundColor: "#c9673f !important",
      },
    },
  },
};

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

// TimePicker's field renders as MuiPickersOutlinedInput/MuiPickersInputBase, a different
// component from the plain OutlinedInput `fieldStyles` above targets. Its `InputProps.sx`
// scopes directly onto that root element itself, so these rules stay top-level (`&...`) -
// nesting them under another "& .MuiPickersOutlinedInput-root" selector (as fieldStyles
// briefly did) asks for a descendant with that class, which doesn't exist since the class
// is already on the element sx is attached to, so it silently matched nothing.
const timePickerFieldSx = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiPickersOutlinedInput-notchedOutline": {
    borderColor: "#ddd",
  },
  "&:hover .MuiPickersOutlinedInput-notchedOutline": {
    borderColor: "#DA7756",
  },
  // MUI ships its own focus rule for this outline scoped to `.Mui-focused:not(.Mui-error)`,
  // which is one specificity unit ahead of a plain `.Mui-focused` override (the `:not()`
  // counts same as a class) and wins the cascade regardless of source order - `!important`
  // is the only way to reliably beat it. Using the brand orange directly (not the legacy
  // #C72030 red) since this class isn't caught by theme.css's global #C72030->orange remap.
  "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
    borderColor: "#DA7756 !important",
  },
  // The blue ring on focus isn't the fieldset border above - it's the browser's native
  // a11y focus outline on the sections container (a [role="group"] with tabIndex), which
  // MUI leaves unstyled. The orange fieldset border already shows focus state, so drop it.
  "&.Mui-focused": {
    outline: "none",
  },
  // Empty state shows the format tokens ("hh:mm aa") as a placeholder - this only matches
  // this sectioned field (no other field type has these classes), so it's a no-op elsewhere;
  // digits are untouched, only the letters (placeholder tokens, and the real "am"/"pm") get
  // capitalized. The color/opacity match is so the mask reads as a placeholder (like every
  // other field's grey hint text) instead of full-strength text.
  "& .MuiPickersSectionList-sectionContent": {
    textTransform: "uppercase",
    '&[aria-valuetext="Empty"]': {
      color: "rgba(0, 0, 0, 0.42)",
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

const isNonNegativeInteger = (value: string) => value === "" || /^\d+$/.test(value);
const isNonNegativeDuration = (value: string) => !value.includes("-");
const preventNegativeSign = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === "-") event.preventDefault();
};

export interface ClassSetupFormState {
  className: string;
  classType: string;
  activityType: string;
  amountPerPerson: string;
  minParticipants: string;
  maxCapacity: string;
  location: string;
  duration: string;
  trainer: string[];
  status: "Active" | "Inactive";
  startTime: string;
  endTime: string;
  description: string;
}

export const emptyClassSetupForm: ClassSetupFormState = {
  className: "",
  classType: "",
  activityType: "",
  amountPerPerson: "",
  minParticipants: "",
  maxCapacity: "",
  location: "",
  duration: "",
  trainer: [],
  status: "Active",
  startTime: "",
  endTime: "",
  description: "",
};

interface ClassSetupFormProps {
  pageTitle: string;
  backLabel: string;
  initialValues: ClassSetupFormState;
  submitLabel: string;
  submittingLabel: string;
  onBack: () => void;
  onSubmit: (
    payload: Omit<ClassSetup, "id" | "trainers"> & { selectedTrainers: SelectedTrainer[] },
    attachedFiles: File[]
  ) => void | Promise<void>;
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
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `https://${baseUrl}/pms/admin/club_classes/trainer_list.json`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.trainers ?? res.data?.data ?? [];
        setTrainers(
          list.map((t: any) => ({
            id: String(t.value ?? t.id),
            name: t.name ?? t.full_name ?? `Trainer ${t.id}`,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch trainer list", err);
      }
    };
    fetchTrainers();
  }, []);

  const setField = <K extends keyof ClassSetupFormState>(key: K, value: ClassSetupFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !form.className.trim() ||
      !form.classType ||
      !form.activityType ||
      !form.minParticipants ||
      !form.maxCapacity
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (Number(form.maxCapacity) < Number(form.minParticipants)) {
      toast.error("Maximum person must not be less than minimum person");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(
        {
          className: form.className.trim(),
          classType: form.classType,
          activityType: form.activityType,
          amountPerPerson: form.amountPerPerson,
          minParticipants: Number(form.minParticipants),
          maxCapacity: Number(form.maxCapacity),
          location: form.location,
          duration: form.duration,
          trainer: form.trainer,
          selectedTrainers: form.trainer.map((id) => {
            const trainer = trainers.find((option) => option.id === id);
            return { name: trainer?.name ?? "", value: Number(id) };
          }),
          status: form.status,
          startTime: form.startTime,
          endTime: form.endTime,
          description: form.description,
        },
        attachedFiles
      );
    } finally {
      // A failed submit (rejected promise) must re-enable the button - a
      // successful one navigates away, so this becomes a harmless no-op there.
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ "& .MuiInputBase-root": fieldStyles, ...requiredLabelSx }}
            >
              <InputLabel shrink>Class Type</InputLabel>
              <MuiSelect
                value={form.classType}
                onChange={(e) => setField("classType", e.target.value)}
                label="Class Type"
                notched
                displayEmpty
                renderValue={(selected) => (selected ? String(selected) : "Select class type...")}
              >
                <MenuItem value="" disabled>
                  Select class type...
                </MenuItem>
                {CLASS_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              required
              sx={{ "& .MuiInputBase-root": fieldStyles, ...requiredLabelSx }}
            >
              <InputLabel shrink>Activity Type</InputLabel>
              <MuiSelect
                value={form.activityType}
                onChange={(e) => setField("activityType", e.target.value)}
                label="Activity Type"
                notched
                displayEmpty
                renderValue={(selected) => (selected ? String(selected) : "Select activity type...")}
              >
                <MenuItem value="" disabled>
                  Select activity type...
                </MenuItem>
                {ACTIVITY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>
            {/* <TextField
              label="Amount per person"
              placeholder="Enter Amount"
              value={form.amountPerPerson}
              onChange={(e) => setField("amountPerPerson", e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            /> */}
            <TextField
              label="Minimum person"
              required
              type="number"
              placeholder="Enter minimum"
              value={form.minParticipants}
              onKeyDown={preventNegativeSign}
              onChange={(e) => {
                if (isNonNegativeInteger(e.target.value)) setField("minParticipants", e.target.value);
              }}
              inputProps={{ min: 0, step: 1 }}
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
              onKeyDown={preventNegativeSign}
              onChange={(e) => {
                if (isNonNegativeInteger(e.target.value)) setField("maxCapacity", e.target.value);
              }}
              inputProps={{ min: 0, step: 1 }}
              fullWidth
              variant="outlined"
              sx={requiredLabelSx}
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Location"
              placeholder="Enter location"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />
            <TextField
              label="Duration"
              type="text"
              placeholder="Eg. 50 min."
              value={form.duration}
              onKeyDown={preventNegativeSign}
              onChange={(e) => {
                if (isNonNegativeDuration(e.target.value)) setField("duration", e.target.value);
              }}
              fullWidth
              variant="outlined"
              slotProps={{ inputLabel: { shrink: true } }}
              InputProps={{ sx: fieldStyles }}
            />

            <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": fieldStyles }}>
              <InputLabel shrink>Trainer</InputLabel>
              <MuiSelect
                multiple
                value={form.trainer}
                onChange={(e) => {
                  const value = e.target.value;
                  setField("trainer", typeof value === "string" ? value.split(",") : value);
                }}
                label="Trainer"
                notched
                displayEmpty
                renderValue={(selected) =>
                  selected.length > 0
                    ? selected
                        .map((id) => trainers.find((t) => t.id === id)?.name)
                        .filter(Boolean)
                        .join(", ")
                    : "Select trainer..."
                }
              >
                {trainers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    <Checkbox checked={form.trainer.includes(t.id)} sx={{ color: "#DA7756", "&.Mui-checked": { color: "#DA7756" } }} />
                    <ListItemText primary={t.name} />
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
            {/* MUI's sectioned time field only paints its "HH:MM AA" format mask once
                focused - blank at rest, which reads as broken next to every other field's
                always-visible grey hint. A custom overlay (hidden the moment the field gets
                focus, via group-focus-within) fills that resting-state gap without touching
                MUI's own placeholder/typing behavior once the user is actually in the field. */}
            {/* <div className="relative group">
              <TimePicker
                label="Start Time"
                value={form.startTime ? dayjs(form.startTime, "HH:mm") : null}
                onChange={(newValue) => setField("startTime", newValue?.isValid() ? newValue.format("HH:mm") : "")}
                slotProps={{
                  ...timePickerSlotProps,
                  textField: {
                    ...timePickerSlotProps.textField,
                    required: true,
                    sx: requiredLabelSx,
                    slotProps: { inputLabel: { shrink: true } },
                    InputProps: { sx: timePickerFieldSx },
                  },
                }}
              />
              {!form.startTime && (
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-black/40 group-focus-within:hidden">
                  HH:MM AA
                </span>
              )}
            </div> */}
            {/* <div className="relative group">
              <TimePicker
                label="End Time"
                value={form.endTime ? dayjs(form.endTime, "HH:mm") : null}
                onChange={(newValue) => setField("endTime", newValue?.isValid() ? newValue.format("HH:mm") : "")}
                slotProps={{
                  ...timePickerSlotProps,
                  textField: {
                    ...timePickerSlotProps.textField,
                    required: true,
                    sx: requiredLabelSx,
                    slotProps: { inputLabel: { shrink: true } },
                    InputProps: { sx: timePickerFieldSx },
                  },
                }}
              />
              {!form.endTime && (
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-black/40 group-focus-within:hidden">
                  HH:MM AA
                </span>
              )}
            </div> */}

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

        {/* Attachment - large "Upload Image" dropzone matching the Figma (dashed box,
            upload icon, "Choose a file or drag & drop it here", centered Browse button). */}
        <Section title="Attachment" icon={<Paperclip className="w-4 h-4" />}>
          <div className="max-w-sm">
            <div className="text-sm font-medium mb-2">Upload Image</div>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="class-setup-file-upload"
            />
            <label
              htmlFor="class-setup-file-upload"
              className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-md py-5 cursor-pointer hover:border-brand transition-colors"
            >
              <Upload className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500 text-center">
                Choose a file or drag &amp; drop it here
              </span>
              <span className="mt-1 px-5 py-1.5 text-sm font-medium text-brand bg-gray-100 hover:bg-gray-200">
                Browse
              </span>
            </label>
          </div>

          {attachedFiles.length > 0 && (
            <div className="space-y-2 mt-4">
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
    </LocalizationProvider>
  );
};
