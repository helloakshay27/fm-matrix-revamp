import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { ArrowLeft, Pencil, Trash2, UserRound, CalendarDays, Paperclip, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { deleteTrainer, mapTrainerApiData, type TrainerSetup } from "./trainerSetupMockData";
import { apiClient } from "@/utils/apiClient";

const getStatusBadge = (status: string) => (
  <span
    className={
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
      (status === "Active" ? "bg-[#C7EDDA] text-gray-800" : "bg-[#F2C8C4] text-gray-800")
    }
  >
    {status}
  </span>
);

// Same look as TrainerSetupForm's fieldStyles, so the read-only details grid matches the
// create/edit form exactly - just rendered disabled instead of editable.
const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "&.Mui-disabled": {
      backgroundColor: "#F9FAFB",
    },
    "& fieldset": { borderColor: "#ddd" },
  },
};

const ReadOnlyField = ({ label, value }: { label: string; value: string | number | undefined }) => (
  <TextField
    label={label}
    value={value === undefined || value === "" ? "—" : value}
    disabled
    fullWidth
    variant="outlined"
    slotProps={{ inputLabel: { shrink: true } }}
    InputProps={{ sx: fieldStyles }}
  />
);

const downloadAttachment = async (url: string, fileName = "download") => {
  if (!url) return;

  try {
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = fileName;
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(blobUrl);
    return;
  } catch (error) {
    console.warn("Direct blob download failed, falling back to anchor navigation:", error);
  }

  const fallback = document.createElement("a");
  fallback.href = url;
  fallback.download = fileName;
  fallback.target = "_self";
  fallback.rel = "noopener noreferrer";
  fallback.style.display = "none";
  document.body.appendChild(fallback);
  fallback.click();
  document.body.removeChild(fallback);
};

const normalizeShiftTimingLabel = (value: string | number | undefined): string | number | undefined => {
  if (value === undefined || value === null || value === "") return value;

  const str = String(value);
  const normalized = str
    .split(/\s+to\s+/i)
    .map((segment) => {
      const match = segment.trim().match(/^00:(\d{2})\s*(AM|PM)$/i);
      if (!match) return segment.trim();
      return `12:${match[1]} ${match[2].toUpperCase()}`;
    })
    .join(" to ");

  return normalized || value;
};

const formatDuration = (duration?: TrainerSetup["bookingAllowedBefore"]) => {
  if (!duration) return "—";
  const parts = [
    duration.day ? `${duration.day} day${duration.day === "1" ? "" : "s"}` : "",
    duration.hour ? `${duration.hour} hour${duration.hour === "1" ? "" : "s"}` : "",
    duration.minute ? `${duration.minute} minute${duration.minute === "1" ? "" : "s"}` : "",
  ].filter(Boolean);
  return parts.join(", ") || "0";
};

export const TrainerSetupDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [trainer, setTrainer] = useState<TrainerSetup | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiClient
      .get(`/pms/admin/trainers/${id}.json`)
      .then((response) => setTrainer(mapTrainerApiData(response.data)))
      .catch((error) => {
        console.error("Failed to load trainer", error);
        toast.error("Trainer not found");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="p-6 text-gray-500">Loading trainer...</div>;
  }

  if (!trainer) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Trainer not found.</p>
        <Button variant="link" onClick={() => navigate("/club-management/trainer-setup")}>
          Back to Trainer Setup
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deleteTrainer(trainer.id);
    toast.success("Trainer deleted successfully!");
    navigate("/club-management/trainer-setup");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <button
              type="button"
              onClick={() => navigate("/club-management/trainer-setup")}
              className="flex items-center gap-2 text-black font-medium mb-2"
            >
              <ArrowLeft className="h-4 w-4 text-black" />
              Back to Trainer Setup List
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {trainer.name}
              {getStatusBadge(trainer.status)}
            </h1>
          </div>

          {/* <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/club-management/trainer-setup/edit/${trainer.id}`)}
              className="gap-2 fm-button-fix fm-button-brand"
            >
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
          </div> */}
        </div>

        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <UserRound className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Trainer Profile & Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F2EEE9] flex items-center justify-center text-xl font-semibold text-gray-600 overflow-hidden shrink-0">
                {trainer.imageUrl ? (
                  <img src={trainer.imageUrl} alt={trainer.name} className="w-full h-full object-cover" />
                ) : (
                  trainer.name.slice(0, 1)
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900">{trainer.name}</h2>
                  {getStatusBadge(trainer.status)}
                </div>
                <p className="text-sm text-gray-500">{trainer.specialization} Specialist</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                label="Trainer Name"
                value={trainer.name}
                disabled
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Specialization"
                value={trainer.specialization}
                disabled
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Experience (Years)"
                value={trainer.experience}
                disabled
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Contact Number"
                value={trainer.contactNumber}
                disabled
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                label="Email"
                value={trainer.email ?? ""}
                disabled
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <ReadOnlyField label="Emergency Contact" value={trainer.emergencyContact} />
              <ReadOnlyField label="Shift Timings" value={normalizeShiftTimingLabel(trainer.shiftTimings)} />
              <FormControl fullWidth variant="outlined" disabled sx={{ "& .MuiInputBase-root": fieldStyles }}>
                <InputLabel shrink>Status</InputLabel>
                <MuiSelect value={trainer.status} label="Status" notched>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

          </CardContent>
        </Card>

        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <CalendarDays className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Facility Operational Timings &amp; Booking</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-6 bg-white p-6 md:grid-cols-3">
            <ReadOnlyField label="Facility Slot ID" value={trainer.facilitySlotId} />
            <ReadOnlyField label="Start Time" value={trainer.availabilitySlots?.[0] ? `${trainer.availabilitySlots[0].startTime.hour}:${trainer.availabilitySlots[0].startTime.minute}` : ""} />
            <ReadOnlyField label="End Time" value={trainer.availabilitySlots?.[0] ? `${trainer.availabilitySlots[0].endTime.hour}:${trainer.availabilitySlots[0].endTime.minute}` : ""} />
            <ReadOnlyField label="Concurrent Slots" value={trainer.availabilitySlots?.[0]?.concurrentSlots} />
            <ReadOnlyField label="Slot Duration (Minutes)" value={trainer.availabilitySlots?.[0]?.slotBy} />
            <ReadOnlyField label="Bookable Slots Per Day" value={trainer.bookableSlotsPerDay} />
            <ReadOnlyField label="Booking Allowed Before" value={formatDuration(trainer.bookingAllowedBefore)} />
            <ReadOnlyField label="Advance Booking" value={formatDuration(trainer.advanceBooking)} />
            <ReadOnlyField label="Can Cancel Before Schedule" value={formatDuration(trainer.canCancelBefore)} />
            <ReadOnlyField label="Max Bookings Per User Per Day" value={trainer.facilityBookedTimes} />
          </CardContent>
        </Card>

        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <Paperclip className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Attachments &amp; Files</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Professional Credentials</h3>
            {trainer.credentials.length === 0 ? (
              <p className="text-sm text-gray-400">No credentials uploaded.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trainer.credentials.map((cred) => (
                  <div
                    key={cred.id}
                    className="flex items-center justify-between gap-3 border border-gray-200 rounded-md p-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-[#F6F4EE] text-[#C72030] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{cred.name}</div>
                        <div className="text-xs text-gray-400">{cred.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadAttachment(cred.url || "", cred.name || "trainer-credential")}
                      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded shrink-0"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainerSetupDetails;
