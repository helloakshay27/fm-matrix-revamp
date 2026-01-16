import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { X } from "lucide-react";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { fetchProjectTeams } from "@/store/slices/projectTeamsSlice";
import { fetchProjectTypes } from "@/store/slices/projectTypeSlice";
import { fetchProjectsTags } from "@/store/slices/projectTagSlice";
import { AddTeamModal } from "./AddTeamModal";
import { AddTagModal } from "./AddTagModal";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

type Owner = { id: number; full_name: string };

const calculateDuration = (startDate: string, endDate: string): string => {
  if (!startDate || !endDate) return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  // If start date is today
  if (startDay.getTime() === today.getTime()) {
    // If end date is also today
    if (endDay.getTime() === today.getTime()) {
      // Calculate from now to end of today (11:59:59 PM)
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const msToEnd = endOfToday.getTime() - now.getTime();
      const totalMins = Math.floor(msToEnd / (1000 * 60));
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      return `0d : ${hrs}h : ${mins}m`;
    } else {
      // End date is in the future
      if (endDay.getTime() < startDay.getTime())
        return "Invalid: End date before start date";

      const daysDiff = Math.floor(
        (endDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Calculate remaining hours and minutes from now to end of today (midnight)
      const endOfToday = new Date(today);
      endOfToday.setHours(23, 59, 59, 999);

      const msToday = endOfToday.getTime() - now.getTime();
      const totalMinutes = Math.floor(msToday / (1000 * 60));
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${daysDiff}d : ${hours}h : ${minutes}m`;
    }
  } else {
    // For future dates, calculate days only
    if (endDay.getTime() < startDay.getTime())
      return "Invalid: End date before start date";

    const days =
      Math.floor(
        (endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    return `${days}d : 0h : 0m`;
  }
};

const ProjectEditModal = ({
  openDialog,
  handleCloseDialog,
  project,
  onUpdated,
}: {
  openDialog: boolean;
  handleCloseDialog: () => void;
  project: any;
  onUpdated: () => Promise<void> | void;
}) => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const { teams } = useAppSelector((state) => state.projectTeams);
  const { projectTypes } = useAppSelector((state) => state.projectTypes);
  const { projectTags } = useAppSelector((state) => state.projectTags);

  const [owners, setOwners] = useState<Owner[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    isChannel: false,
    isTemplate: false,
    description: "",
    owner: "",
    startDate: "",
    endDate: "",
    duration: "",
    team: "",
    type: "",
    priority: "",
    tags: [] as number[],
  });
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  useEffect(() => {
    if (!openDialog) return;
    dispatch(fetchProjectTeams());
    dispatch(fetchProjectTypes());
    dispatch(fetchProjectsTags());
    getOwners();
  }, [openDialog, dispatch]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      title: project?.title || "",
      description: project?.description || "",
      startDate: project?.start_date || "",
      endDate: project?.end_date || "",
      duration: "",
      team: project?.project_team_id,
      priority: project?.priority || "",
      tags: project?.project_tags?.map((tag: any) => tag.company_tag_id) || [],
      isChannel: Boolean(project?.create_channel),
      isTemplate: Boolean(project?.is_template),
    }));
  }, [project]);

  const matchedOwnerId = useMemo(() => {
    const name = project?.project_owner_name;
    if (!name) return "";
    const match = owners.find((o) => o.full_name === name);
    return match ? String(match.id) : "";
  }, [owners, project]);

  const matchedTypeId = useMemo(() => {
    const typeName = project?.project_type_name;
    if (!typeName) return "";
    const match = projectTypes.find((t: any) => t.name === typeName);
    return match ? String(match.id) : "";
  }, [projectTypes, project]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      owner: matchedOwnerId || prev.owner,
      type: matchedTypeId || prev.type,
    }));
  }, [matchedOwnerId, matchedTypeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagsChange = (e: any) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      tags: Array.isArray(value) ? value : [],
    }));
  };

  const getOwners = async () => {
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOwners(response.data.users || []);
    } catch (error) {
      toast.error("Failed to load owners");
    }
  };

  const validateForm = () => {
    toast.dismiss();
    if (!formData.title) {
      toast.error("Please enter title");
      return false;
    }
    if (!formData.owner) {
      toast.error("Please select owner");
      return false;
    }
    if (!formData.endDate) {
      toast.error("Please select end date");
      return false;
    }
    if (
      formData.endDate &&
      formData.startDate &&
      formData.endDate < formData.startDate
    ) {
      toast.error("End date cannot be before start date");
      return false;
    }
    if (!formData.type) {
      toast.error("Please select type");
      return false;
    }
    if (!formData.priority) {
      toast.error("Please select priority");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    const payload: any = {
      project_management: {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        owner_id: formData.owner,
        priority: formData.priority,
        project_team_id: formData.team || undefined,
        project_type_id: formData.type,
        is_template: formData.isTemplate,
        create_channel: formData.isChannel,
      },
      task_tag_ids: formData.tags,
    };
    try {
      await axios.put(
        `https://${baseUrl}/project_managements/${project?.id}.json`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Project updated successfully");
      // Invalidate cache after project update
      const { cache } = await import("../utils/cacheUtils");
      cache.invalidatePattern("projects_*");
      await Promise.resolve(onUpdated?.());
      handleCloseDialog();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to update project");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
    >
      <DialogContent
        className="w-[35rem] fixed right-0 top-0 rounded-none bg-[#fff] text-sm h-full"
        style={{ margin: 0 }}
        sx={{ padding: "0 !important" }}
      >
        <h3 className="text-[14px] font-medium text-center mt-8">
          Edit Project
        </h3>
        <X
          className="absolute top-[26px] right-8 cursor-pointer"
          onClick={handleCloseDialog}
        />
        <hr className="border border-[#E95420] mt-4" />
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 110px)" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="max-w-[90%] mx-auto pr-3">
              <div className="mt-4 space-y-2">
                <TextField
                  label="Project Title"
                  name="title"
                  placeholder="Enter Project Title"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: fieldStyles }}
                  sx={{ mt: 1 }}
                />
              </div>

              <div className="flex justify-between my-4">
                {[
                  { id: "createChannel", name: "isChannel", label: "Channel" },
                  {
                    id: "createTemplate",
                    name: "isTemplate",
                    label: "Template",
                  },
                ].map(({ id, name, label }) => (
                  <div key={id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={id}
                      name={name}
                      checked={(formData as any)[name]}
                      onChange={handleChange}
                      className="mx-2 my-0.5"
                    />
                    <label htmlFor={id} className="text-sm">
                      Create a {label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 h-[100px]">
                <TextField
                  label="Description"
                  name="description"
                  placeholder=""
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={2}
                  value={formData.description}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto !important",
                      padding: "2px !important",
                      display: "flex",
                    },
                    "& .MuiInputBase-input[aria-hidden='true']": {
                      flex: 0,
                      width: 0,
                      height: 0,
                      padding: "0 !important",
                      margin: 0,
                      display: "none",
                    },
                    "& .MuiInputBase-input": {
                      resize: "none !important",
                    },
                  }}
                />
              </div>

              <div className="flex items-start gap-4 mt-3">
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                  <InputLabel shrink>Select Owner*</InputLabel>
                  <Select
                    label="Select Owner*"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value="">
                      <em>Select Owner</em>
                    </MenuItem>
                    {owners.map((owner) => (
                      <MenuItem key={owner.id} value={String(owner.id)}>
                        {owner.full_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="flex gap-2 mt-4 text-[12px]">
                {["startDate", "endDate"].map((field) => (
                  <div key={field} className="w-full space-y-2">
                    <TextField
                      label={field === "startDate" ? "Start Date" : "End Date"}
                      type="date"
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>
                ))}

                <div className="w-[300px] space-y-2">
                  <TextField
                    label="Duration"
                    name="duration"
                    value={calculateDuration(
                      formData.startDate,
                      formData.endDate
                    )}
                    fullWidth
                    disabled
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: fieldStyles }}
                    sx={{ mt: 1 }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 my-5">
                <div>
                  <div className="flex justify-end">
                    <label
                      className="text-[12px] text-[red] cursor-pointer"
                      onClick={() => setIsTeamModalOpen(true)}
                    >
                      <i>Create new team</i>
                    </label>
                  </div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel shrink>Select Team</InputLabel>
                    <Select
                      label="Select Team"
                      name="team"
                      value={formData.team}
                      onChange={handleChange}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select Team</em>
                      </MenuItem>
                      {teams.map((team: any) => (
                        <MenuItem key={team.id} value={String(team.id)}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="flex gap-4">
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel shrink>Project Type*</InputLabel>
                    <Select
                      label="Project Type*"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select Project Type</em>
                      </MenuItem>
                      {projectTypes.map((type: any) => (
                        <MenuItem key={type.id} value={String(type.id)}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel shrink>Priority*</InputLabel>
                    <Select
                      label="Priority*"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select Priority</em>
                      </MenuItem>
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <div>
                  <div
                    className="text-[12px] text-[red] text-right cursor-pointer mt-2"
                    onClick={() => setIsTagModalOpen(true)}
                  >
                    <i>Create new tag</i>
                  </div>
                  <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel shrink>Tags</InputLabel>
                    <Select
                      label="Tags"
                      name="tags"
                      multiple
                      value={formData.tags}
                      onChange={handleTagsChange}
                      displayEmpty
                      sx={fieldStyles}
                    >
                      <MenuItem value="">
                        <em>Select Tags</em>
                      </MenuItem>
                      {projectTags.map((tag: any) => (
                        <MenuItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="flex justify-center my-8">
                <Button
                  type="submit"
                  className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
                  disabled={submitting}
                >
                  Update
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
      <AddTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onTeamCreated={() => {
          dispatch(fetchProjectTeams());
        }}
      />
      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onTagCreated={() => {
          dispatch(fetchProjectsTags());
        }}
      />
    </Dialog>
  );
};

export default ProjectEditModal;
