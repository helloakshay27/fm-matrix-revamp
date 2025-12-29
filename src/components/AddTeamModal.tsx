import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  fetchProjectTeams,
  createProjectTeam,
} from "@/store/slices/projectTeamsSlice";
import { toast } from "sonner";
import MuiMultiSelect from "./MuiMultiSelect";
import axios from "axios";

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated?: () => void;
}

export const AddTeamModal = ({
  isOpen,
  onClose,
  onTeamCreated,
}: AddTeamModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [escalateUsers, setEscalateUsers] = useState<any[]>([]);

  const [teamName, setTeamName] = useState("");
  const [selectedLead, setSelectedLead] = useState<number | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<
    { value: number; label: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  // Fetch escalate users
  const fetchEscalateUsers = async () => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEscalateUsers(response.data.users || []);
    } catch (error) {
      console.log("Error fetching escalate users:", error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEscalateUsers();
    }
  }, [isOpen]);

  const closeDialog = () => {
    setTeamName("");
    setSelectedLead(null);
    setSelectedMembers([]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!teamName.trim()) {
      toast.error("Please enter team name");
      return;
    }
    if (!selectedLead) {
      toast.error("Please select a team lead");
      return;
    }
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }

    const payload = {
      project_team: {
        name: teamName,
        team_lead_id: selectedLead,
        user_ids: selectedMembers.map((member) => member.value),
      },
    };

    try {
      setLoading(true);
      await dispatch(createProjectTeam(payload)).unwrap();
      toast.success("Team created successfully");
      dispatch(fetchProjectTeams());
      if (onTeamCreated) {
        onTeamCreated();
      }
      closeDialog();
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  const handleMultiSelectChange = (values: any) => {
    setSelectedMembers(values);
  };

  return (
    <Dialog open={isOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
      <DialogContent
        className="bg-[#fff] text-sm"
        sx={{
          padding: "24px !important",
        }}
      >
        <h3 className="text-[16px] font-medium text-center mb-4">Add Team</h3>
        <button
          onClick={closeDialog}
          className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Team Name */}
        <div className="mt-6 space-y-2">
          <TextField
            label="Team Name*"
            name="teamName"
            placeholder="Enter Team Name"
            fullWidth
            variant="outlined"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />
        </div>

        {/* Team Lead */}
        <div className="mt-4 space-y-2">
          <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
            <InputLabel shrink>Team Lead*</InputLabel>
            <Select
              label="Team Lead*"
              name="teamLead"
              value={selectedLead || ""}
              onChange={(e) => setSelectedLead(e.target.value as number)}
              displayEmpty
              sx={fieldStyles}
            >
              <MenuItem value="">
                <em>Select Team Lead</em>
              </MenuItem>
              {escalateUsers.map((user: any) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.full_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Team Members */}
        <div className="mt-4 space-y-2">
          <MuiMultiSelect
            label="Team Members*"
            options={escalateUsers
              .filter((user: any) => user.id !== selectedLead)
              .map((user: any) => ({
                value: user.id,
                label: user.full_name,
                id: user.id,
              }))}
            value={selectedMembers}
            onChange={handleMultiSelectChange}
            placeholder="Select Team Members"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-6 mt-8">
          <Button variant="outline" onClick={closeDialog} className="px-6">
            Cancel
          </Button>
          <Button
            className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Team"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamModal;
