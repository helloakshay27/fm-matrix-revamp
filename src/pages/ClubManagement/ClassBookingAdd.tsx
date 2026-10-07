import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  createClassBooking,
  fetchAvailableSlotTimes,
  fetchTrainersForClass,
  fetchUsablePurchasesForUser,
  fetchUsers,
  type ClassPurchaseListItem,
  type SlotTimeOption,
  type TrainerOption,
  type UserOption,
} from "./classPurchaseApi";

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
  "& .MuiInputLabel-root": { "&.Mui-focused": { color: "#C72030" } },
};

const requiredLabelSx = { "& .MuiFormLabel-asterisk": { color: "#DA7756" } };

export const ClassBookingAdd = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [purchases, setPurchases] = useState<ClassPurchaseListItem[]>([]);
  const [trainers, setTrainers] = useState<TrainerOption[]>([]);
  const [slots, setSlots] = useState<SlotTimeOption[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Matches AmenityBookingAdd's "occupant" (Members) / "guest" / "fm" (Staff) buyer-type
  // selector - kept for consistency with the Class Purchase form's UI (bookings don't have
  // their own per-tier pricing; cost is inherited from the linked purchase).
  const [userType, setUserType] = useState<"occupant" | "guest" | "fm">("occupant");
  const [userId, setUserId] = useState("");
  const [purchaseId, setPurchaseId] = useState("");
  const [trainerId, setTrainerId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [slotTimeIds, setSlotTimeIds] = useState<number[]>([]);

  const selectedPurchase = purchases.find((p) => p.id === purchaseId);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch((error) => {
        console.error("Failed to load users", error);
        toast.error("Failed to load members");
      });
    fetchTrainersForClass()
      .then(setTrainers)
      .catch((error) => {
        console.error("Failed to load trainers", error);
        toast.error("Failed to load trainers");
      });
  }, []);

  useEffect(() => {
    if (!userId) {
      setPurchases([]);
      setPurchaseId("");
      return;
    }
    setLoadingPurchases(true);
    fetchUsablePurchasesForUser(userId)
      .then((list) => {
        setPurchases(list);
        setPurchaseId("");
      })
      .catch((error) => {
        console.error("Failed to load purchases", error);
        toast.error("Failed to load this member's purchases");
      })
      .finally(() => setLoadingPurchases(false));
  }, [userId]);

  useEffect(() => {
    setSlotTimeIds([]);
    if (!trainerId || !bookingDate || !selectedPurchase) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    fetchAvailableSlotTimes(trainerId, bookingDate, selectedPurchase.classId)
      .then(setSlots)
      .catch((error) => {
        console.error("Failed to load available slots", error);
        toast.error("Failed to load available slots");
      })
      .finally(() => setLoadingSlots(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId, bookingDate, selectedPurchase?.classId]);

  const toggleSlot = (id: number) => {
    setSlotTimeIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const availableSlotsForSelect = slots.filter((s) => !s.isBooked && s.available > 0);
  const isSelectAllChecked = availableSlotsForSelect.length > 0 && availableSlotsForSelect.every((s) => slotTimeIds.includes(s.id));
  const isSelectAllIndeterminate = slotTimeIds.length > 0 && !isSelectAllChecked;

  const handleSubmit = async () => {
    const errors: string[] = [];
    if (!userId) errors.push("Member is required");
    if (!purchaseId) errors.push("Purchase is required");
    if (!trainerId) errors.push("Trainer is required");
    if (!bookingDate) errors.push("Date is required");
    if (slotTimeIds.length === 0) errors.push("Select at least one slot");
    if (errors.length > 0) {
      errors.forEach((message) => toast.error(message));
      return;
    }
    if (!selectedPurchase) return;

    setIsSubmitting(true);
    try {
      await createClassBooking({
        userId,
        clubClassId: selectedPurchase.classId,
        trainerId,
        classPurchaseId: purchaseId,
        bookingDate,
        slotTimeIds,
      });
      toast.success("Booking created successfully!");
      navigate("/club-management/class-booking");
    } catch (error: any) {
      console.error("Failed to create booking", error);
      const message = error?.response?.data?.errors?.join(", ") || "Failed to create booking";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      <header className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/club-management/class-booking")}
          className="flex items-center gap-2 text-black font-medium mb-2"
        >
          <ArrowLeft className="h-4 w-4 text-black" />
          Back to Class Bookings
        </button>
        <h1 className="text-2xl font-bold text-black">New Booking</h1>
      </header>

      <Section title="Booking Details" icon={<CalendarClock className="w-5 h-5" />}>
        <div className="mb-6">
          <RadioGroup value={userType} onValueChange={(val) => setUserType(val as typeof userType)} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occupant" id="booking-occupant" />
              <Label htmlFor="booking-occupant">Members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="guest" id="booking-guest" />
              <Label htmlFor="booking-guest">Guest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fm" id="booking-fm" />
              <Label htmlFor="booking-fm">Staff</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormControl fullWidth variant="outlined" required sx={{ "& .MuiInputBase-root": fieldStyles, ...requiredLabelSx }}>
            <InputLabel shrink>Member</InputLabel>
            <MuiSelect
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              label="Member"
              notched
              displayEmpty
              renderValue={(selected) => (selected ? users.find((u) => u.id === selected)?.name ?? String(selected) : "Search user")}
            >
              <MenuItem value="" disabled>
                Search user
              </MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <FormControl
            fullWidth
            variant="outlined"
            required
            disabled={!userId || loadingPurchases}
            sx={{ "& .MuiInputBase-root": fieldStyles, ...requiredLabelSx }}
          >
            <InputLabel shrink>Purchase</InputLabel>
            <MuiSelect
              value={purchaseId}
              onChange={(e) => setPurchaseId(e.target.value)}
              label="Purchase"
              notched
              displayEmpty
              renderValue={(selected) => {
                const p = purchases.find((pp) => pp.id === selected);
                return p ? `#${p.id} - ${p.packageName}, ${p.remainingSessions} left` : "Select purchase";
              }}
            >
              <MenuItem value="" disabled>
                {userId ? "Select purchase" : "Select a member first"}
              </MenuItem>
              {purchases.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  #{p.id} - {p.packageName}, {p.remainingSessions} left
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="Class (from purchase)"
            value={selectedPurchase?.className ?? ""}
            fullWidth
            variant="outlined"
            disabled
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />

          <FormControl fullWidth variant="outlined" required sx={{ "& .MuiInputBase-root": fieldStyles, ...requiredLabelSx }}>
            <InputLabel shrink>Trainer</InputLabel>
            <MuiSelect
              value={trainerId}
              onChange={(e) => setTrainerId(e.target.value)}
              label="Trainer"
              notched
              displayEmpty
              renderValue={(selected) => (selected ? trainers.find((t) => t.id === selected)?.name ?? String(selected) : "Select trainer")}
            >
              <MenuItem value="" disabled>
                Select trainer
              </MenuItem>
              {trainers.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>

          <TextField
            label="Date"
            required
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            fullWidth
            variant="outlined"
            sx={requiredLabelSx}
            slotProps={{ inputLabel: { shrink: true } }}
            InputProps={{ sx: fieldStyles }}
          />
        </div>

        {/* Select Slot - matches AmenityBookingAdd's checkbox-grid + Select All pattern. */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Select Slot<span className="text-red-500"> *</span>
            </h2>
            {slots.length > 0 && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select-all-booking-slots"
                  ref={(el) => {
                    if (el) el.indeterminate = isSelectAllIndeterminate;
                  }}
                  checked={isSelectAllChecked}
                  disabled={availableSlotsForSelect.length === 0}
                  onChange={(e) => {
                    setSlotTimeIds(e.target.checked ? availableSlotsForSelect.map((s) => s.id) : []);
                  }}
                  className="w-4 h-4 cursor-pointer accent-brand text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand disabled:cursor-not-allowed"
                />
                <Label htmlFor="select-all-booking-slots" className="cursor-pointer text-sm font-medium text-gray-700 select-none">
                  Select All
                  {slotTimeIds.length > 0 && (
                    <span className="ml-1.5 text-xs font-semibold text-brand bg-brand-light border border-brand px-2 py-0.5 rounded-full">
                      {slotTimeIds.length} selected
                    </span>
                  )}
                </Label>
              </div>
            )}
          </div>
          {slots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const isFull = slot.isBooked || slot.available <= 0;
                return (
                  <div
                    key={slot.id}
                    className={`flex items-center space-x-2 p-3 border rounded-lg ${
                      isFull ? "bg-red-50 opacity-60 border-red-300" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`booking-slot-${slot.id}`}
                      checked={slotTimeIds.includes(slot.id)}
                      onChange={() => toggleSlot(slot.id)}
                      className="w-4 h-4 accent-brand text-brand bg-gray-100 border-gray-300 rounded focus:ring-brand"
                      disabled={isFull}
                    />
                    <Label
                      htmlFor={`booking-slot-${slot.id}`}
                      className={`cursor-pointer text-sm font-medium flex items-center gap-2 ${isFull ? "text-red-600" : ""}`}
                    >
                      {slot.label}
                      {isFull && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                          </svg>
                          Booked
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">
              {trainerId && bookingDate ? "No slots available for the selected date" : "Select a trainer and date to see available slots"}
            </p>
          )}
          {loadingSlots && <p className="text-sm text-gray-500 mt-2">Loading slots...</p>}
        </div>
      </Section>

      <div className="flex items-center gap-3 justify-center pt-2">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="fm-button-fix fm-button-brand px-8 py-2">
          {isSubmitting ? "Creating..." : "Create Booking"}
        </Button>
        <Button
          onClick={() => navigate("/club-management/class-booking")}
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

export default ClassBookingAdd;
