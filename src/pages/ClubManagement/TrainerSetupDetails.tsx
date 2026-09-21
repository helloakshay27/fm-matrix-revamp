import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { ArrowLeft, Pencil, Trash2, UserRound, Paperclip, FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { deleteTrainer, getTrainerById } from "./trainerSetupMockData";

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

export const TrainerSetupDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const trainer = id ? getTrainerById(id) : undefined;

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

          <div className="flex items-center gap-2 flex-wrap">
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
          </div>
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
                label="Rate per Session (₹)"
                value={trainer.ratePerSession}
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
              <FormControl fullWidth variant="outlined" disabled sx={{ "& .MuiInputBase-root": fieldStyles }}>
                <InputLabel shrink>Status</InputLabel>
                <MuiSelect value={trainer.status} label="Status" notched>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            {/* {trainer.bio && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bio</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{trainer.bio}</p>
              </div>
            )} */}
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
                    <a
                      href={cred.url || undefined}
                      download
                      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded shrink-0"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
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
