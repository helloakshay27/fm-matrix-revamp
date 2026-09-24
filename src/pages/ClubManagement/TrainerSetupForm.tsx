import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { ArrowLeft, CalendarDays, UserRound, Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  ROSTER_OPTIONS,
  SLOT_DURATION_OPTIONS,
  SPECIALIZATIONS,
  type DurationValue,
  type TrainerAvailabilitySlot,
  type TrainerSetup,
} from "./trainerSetupMockData";

const blankDuration = (): DurationValue => ({ day: "", hour: "", minute: "" });

const blankAvailabilitySlot = (): TrainerAvailabilitySlot => ({
  startTime: { hour: "00", minute: "00" },
  endTime: { hour: "00", minute: "00" },
  concurrentSlots: "",
  slotBy: 15,
});

// Allows only positive integers, matching the pattern used on the Amenity Booking Setup form.
const isPositiveIntegerInput = (value: string) => value === "" || /^[1-9]\d*$/.test(value);
const isDigitsInput = (value: string) => value === "" || /^\d+$/.test(value);

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
  email: string;
  specialization: string;
  experience: string;
  ratePerSession: string;
  contactNumber: string;
  status: "Active" | "Inactive";
  bio: string;
  slot: string;
  roster: string;
  availabilitySlots: TrainerAvailabilitySlot[];
  bookableSlotsPerDay: string;
  bookingAllowedBefore: DurationValue;
  advanceBooking: DurationValue;
  canCancelBefore: DurationValue;
  facilityBookedTimes: string;
}

export const emptyTrainerSetupForm: TrainerSetupFormState = {
  name: "",
  email: "",
  specialization: "",
  experience: "",
  ratePerSession: "",
  contactNumber: "",
  status: "Active",
  bio: "",
  slot: "",
  roster: "",
  availabilitySlots: [blankAvailabilitySlot()],
  bookableSlotsPerDay: "",
  bookingAllowedBefore: blankDuration(),
  advanceBooking: blankDuration(),
  canCancelBefore: blankDuration(),
  facilityBookedTimes: "",
};

interface TrainerSetupFormProps {
  pageTitle: string;
  backLabel: string;
  initialValues: TrainerSetupFormState;
  submitLabel: string;
  submittingLabel: string;
  onBack: () => void;
  onSubmit: (payload: Omit<TrainerSetup, "id" | "credentials"> & { email: string }, files: {
    image: File | null;
    certificate: File | null;
    contract: File | null;
  }) => void | Promise<void>;
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
  // Defensively backfill any field a caller's initialValues left undefined (e.g. a stale
  // pre-existing record from before availability/slot/roster existed) so nothing here
  // ever reads .map()/.day etc. off undefined. A plain object spread wouldn't be enough -
  // a key present with value `undefined` still overwrites the default.
  const [form, setForm] = useState<TrainerSetupFormState>({
    ...emptyTrainerSetupForm,
    ...initialValues,
    email: initialValues.email ?? emptyTrainerSetupForm.email,
    availabilitySlots: initialValues.availabilitySlots ?? emptyTrainerSetupForm.availabilitySlots,
    bookingAllowedBefore: initialValues.bookingAllowedBefore ?? emptyTrainerSetupForm.bookingAllowedBefore,
    advanceBooking: initialValues.advanceBooking ?? emptyTrainerSetupForm.advanceBooking,
    canCancelBefore: initialValues.canCancelBefore ?? emptyTrainerSetupForm.canCancelBefore,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = <K extends keyof TrainerSetupFormState>(key: K, value: TrainerSetupFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const addAvailabilitySlot = () =>
    setForm((f) => ({ ...f, availabilitySlots: [...(f.availabilitySlots ?? []), blankAvailabilitySlot()] }));

  const removeAvailabilitySlot = (index: number) =>
    setForm((f) => ({ ...f, availabilitySlots: (f.availabilitySlots ?? []).filter((_, i) => i !== index) }));

  const patchAvailabilitySlot = (index: number, patch: Partial<TrainerAvailabilitySlot>) =>
    setForm((f) => ({
      ...f,
      availabilitySlots: (f.availabilitySlots ?? []).map((slot, i) => (i === index ? { ...slot, ...patch } : slot)),
    }));

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
      email: form.email.trim(),
      specialization: form.specialization.trim(),
      experience: form.experience.trim(),
      ratePerSession: form.ratePerSession.trim(),
      contactNumber: form.contactNumber.trim(),
      status: form.status,
      bio: form.bio.trim(),
      imageUrl: imageFile ? imageFile.name : "",
      slot: form.slot,
      roster: form.roster,
      availabilitySlots: form.availabilitySlots,
      bookableSlotsPerDay: form.bookableSlotsPerDay,
      bookingAllowedBefore: form.bookingAllowedBefore,
      advanceBooking: form.advanceBooking,
      canCancelBefore: form.canCancelBefore,
      facilityBookedTimes: form.facilityBookedTimes,
    }, { image: imageFile, certificate: certFile, contract: contractFile });
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
              label="Email"
              type="email"
              placeholder="e.g. trainer@example.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              fullWidth
              variant="outlined"
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

            {/* <TextField
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
            /> */}
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

            <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": fieldStyles }}>
              <InputLabel shrink>Slot</InputLabel>
              <MuiSelect
                value={form.slot}
                onChange={(e) => setField("slot", e.target.value as string)}
                label="Slot"
                notched
                displayEmpty
                renderValue={(selected) =>
                  selected
                    ? SLOT_DURATION_OPTIONS.find((opt) => opt.value === selected)?.label ?? String(selected)
                    : "Select slot"
                }
              >
                <MenuItem value="" disabled>
                  Select slot
                </MenuItem>
                {SLOT_DURATION_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ "& .MuiInputBase-root": fieldStyles }}>
              <InputLabel shrink>Roster</InputLabel>
              <MuiSelect
                value={form.roster}
                onChange={(e) => setField("roster", e.target.value as string)}
                label="Roster"
                notched
                displayEmpty
                renderValue={(selected) => (selected ? String(selected) : "Select roster")}
              >
                <MenuItem value="" disabled>
                  Select roster
                </MenuItem>
                {ROSTER_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
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

        <Section title="Facility Operational Timings & Booking" icon={<CalendarDays className="w-5 h-5" />}>
          <div>
            <Button
              type="button"
              onClick={addAvailabilitySlot}
              className="bg-purple-600 hover:bg-purple-700 mb-4"
            >
              Add
            </Button>

            {/* Fixed column widths (rather than grid-cols-5's equal fr tracks) so the
                two-select time cells have room to breathe; the wrapper scrolls instead
                of squeezing columns on narrow viewports. */}
            <div className="overflow-x-auto">
              <div
                className="grid gap-2 mb-2 text-sm font-medium text-gray-600 min-w-max"
                style={{ gridTemplateColumns: "200px 200px 140px 180px 90px" }}
              >
                <div>Start Time</div>
                <div>End Time</div>
                <div>Concurrent Slots</div>
                <div>Slot by</div>
                <div>Action</div>
              </div>

              {/* Slot Rows */}
              {(form.availabilitySlots ?? []).map((slot, index) => (
                <div
                  key={index}
                  className="grid gap-2 mb-2 min-w-max"
                  style={{ gridTemplateColumns: "200px 200px 140px 180px 90px" }}
                >
                  <div className="flex gap-1">
                    <FormControl size="small" sx={{ minWidth: 88 }}>
                      <MuiSelect
                        value={slot.startTime.hour}
                        onChange={(e) =>
                          patchAvailabilitySlot(index, {
                            startTime: { ...slot.startTime, hour: e.target.value as string },
                          })
                        }
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 88 }}>
                      <MuiSelect
                        value={slot.startTime.minute}
                        onChange={(e) =>
                          patchAvailabilitySlot(index, {
                            startTime: { ...slot.startTime, minute: e.target.value as string },
                          })
                        }
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div className="flex gap-1">
                    <FormControl size="small" sx={{ minWidth: 88 }}>
                      <MuiSelect
                        value={slot.endTime.hour}
                        onChange={(e) =>
                          patchAvailabilitySlot(index, {
                            endTime: { ...slot.endTime, hour: e.target.value as string },
                          })
                        }
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 88 }}>
                      <MuiSelect
                        value={slot.endTime.minute}
                        onChange={(e) =>
                          patchAvailabilitySlot(index, {
                            endTime: { ...slot.endTime, minute: e.target.value as string },
                          })
                        }
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <TextField
                    size="small"
                    value={slot.concurrentSlots}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isPositiveIntegerInput(value)) {
                        patchAvailabilitySlot(index, { concurrentSlots: value });
                      }
                    }}
                    variant="outlined"
                  />

                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <MuiSelect
                      value={slot.slotBy}
                      onChange={(e) => patchAvailabilitySlot(index, { slotBy: Number(e.target.value) })}
                    >
                      <MenuItem value={15}>15 Minutes</MenuItem>
                      <MenuItem value={30}>Half hour</MenuItem>
                      <MenuItem value={45}>45 Minutes</MenuItem>
                      <MenuItem value={60}>1 hour</MenuItem>
                      <MenuItem value={90}>1 and a half hours</MenuItem>
                      <MenuItem value={120}>2 hours</MenuItem>
                      <MenuItem value={150}>2 and a half hours</MenuItem>
                      <MenuItem value={180}>3 hours</MenuItem>
                      <MenuItem value={210}>3 and a half hours</MenuItem>
                      <MenuItem value={240}>4 hours</MenuItem>
                      <MenuItem value={270}>4 and a half hours</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAvailabilitySlot(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <label className="text-sm font-medium text-gray-700">Bookable Slots Per Day</label>
              <TextField
                size="small"
                value={form.bookableSlotsPerDay}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isPositiveIntegerInput(value)) setField("bookableSlotsPerDay", value);
                }}
                variant="outlined"
              />
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Booking Allowed before :</label>
                <p className="text-sm text-gray-600 mb-2">(Enter Time: DD Days, HH Hours, MM Minutes)</p>
                <div className="flex gap-2 items-center">
                  <TextField
                    placeholder="Day"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.bookingAllowedBefore.day}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("bookingAllowedBefore", { ...form.bookingAllowedBefore, day: value });
                      }
                    }}
                  />
                  <span>DD</span>
                  <TextField
                    placeholder="Hour"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.bookingAllowedBefore.hour}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("bookingAllowedBefore", { ...form.bookingAllowedBefore, hour: value });
                      }
                    }}
                  />
                  <span>HH</span>
                  <TextField
                    placeholder="Mins"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.bookingAllowedBefore.minute}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("bookingAllowedBefore", { ...form.bookingAllowedBefore, minute: value });
                      }
                    }}
                  />
                  <span>MM</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Advance Booking :</label>
                <div className="flex gap-2 items-center">
                  <TextField
                    placeholder="Day"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.advanceBooking.day}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("advanceBooking", { ...form.advanceBooking, day: value });
                      }
                    }}
                  />
                  <span>DD</span>
                  <TextField
                    placeholder="Hour"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.advanceBooking.hour}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("advanceBooking", { ...form.advanceBooking, hour: value });
                      }
                    }}
                  />
                  <span>HH</span>
                  <TextField
                    placeholder="Mins"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.advanceBooking.minute}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("advanceBooking", { ...form.advanceBooking, minute: value });
                      }
                    }}
                  />
                  <span>MM</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Can Cancel Before Schedule :</label>
                <div className="flex gap-2 items-center">
                  <TextField
                    placeholder="Day"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.canCancelBefore.day}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("canCancelBefore", { ...form.canCancelBefore, day: value });
                      }
                    }}
                  />
                  <span>DD</span>
                  <TextField
                    placeholder="Hour"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.canCancelBefore.hour}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("canCancelBefore", { ...form.canCancelBefore, hour: value });
                      }
                    }}
                  />
                  <span>HH</span>
                  <TextField
                    placeholder="Mins"
                    size="small"
                    style={{ width: "80px" }}
                    variant="outlined"
                    value={form.canCancelBefore.minute}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (isDigitsInput(value)) {
                        setField("canCancelBefore", { ...form.canCancelBefore, minute: value });
                      }
                    }}
                  />
                  <span>MM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-4">
              <span>Facility can be booked</span>
              <TextField
                value={form.facilityBookedTimes}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isPositiveIntegerInput(value)) setField("facilityBookedTimes", value);
                }}
                variant="outlined"
                size="small"
                style={{ width: "80px" }}
              />
              <span>times per day by User</span>
            </div>
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
