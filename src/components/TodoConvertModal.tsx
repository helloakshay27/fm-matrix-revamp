import { useEffect, useState, forwardRef } from "react";
import axios from "axios";
import { getFullUrl } from "@/config/apiConfig";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import AddMilestoneForm from "./AddMilestoneForm";
import ProjectTaskCreateModal from "./ProjectTaskCreateModal";
import AddSubtaskModal from "./AddSubtaskModal";
import AddOpportunityModal from "./AddOpportunityModal";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Slide,
} from "@mui/material";
import {
  createProject,
  fetchProjects,
} from "@/store/slices/projectManagementSlice";
import { Button } from "./ui/button";
import { AddTeamModal } from "./AddTeamModal";
import { AddTagModal } from "./AddTagModal";
import MuiMultiSelect from "./MuiMultiSelect";
import { X } from "lucide-react";

const Transition = forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface TodoConvertModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  prefillData: {
    title?: string;
    description?: string;
    responsible_person?: {
      id: string;
    };
    target_date?: string;
    tags?: Array<{
      company_tag_id: number;
      company_tag: {
        name: string;
      };
    }>;
  };
  todoId: number | string;
  onSuccess?: () => void;
}

const TodoConvertModal = ({
  isModalOpen,
  setIsModalOpen,
  prefillData,
  todoId,
  onSuccess,
}: TodoConvertModalProps) => {
  const [selectedType, setSelectedType] = useState("Task");
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const dispatch = useAppDispatch();
  const [owners, setOwners] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // For Project Form
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    isChannel: false,
    isTemplate: false,
    description: "",
    owner: "",
    startDate: "",
    endDate: "",
    team: "",
    type: "",
    priority: "",
    tags: [],
  });
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  // For ProjectCreateModal
  const [openProjectDialog, setOpenProjectDialog] = useState(false);

  // For Subtask Conversion
  const [parentTaskId, setParentTaskId] = useState<number | null>(null);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);

  useEffect(() => {
    if (isModalOpen) {
      fetchOwners();
      fetchTeams();
      fetchProjectTypes();
      fetchTags();
      fetchAllProjects();
      fetchAvailableTasks();
      const selectedTags = (prefillData.tags || []).map((tag: any) => ({
        value: tag.company_tag_id,
        label: tag.company_tag.name || "Unknown Tag",
        id: tag.company_tag_id,
      }));
      setTags(selectedTags);
      setProjectFormData({
        title:
          prefillData?.title
            ?.replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
            .replace(/#\[(.*?)\]\(\d+\)/g, "#$1") || "",
        isChannel: false,
        isTemplate: false,
        description:
          prefillData?.description
            ?.replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
            .replace(/#\[(.*?)\]\(\d+\)/g, "#$1") || "",
        owner: prefillData?.responsible_person?.id || "",
        startDate: "",
        endDate: "",
        team: "",
        type: "",
        priority: "",
        tags: selectedTags,
      });
    }
  }, [isModalOpen]);

  const fetchOwners = async () => {
    setIsLoadingOwners(true);
    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOwners(response.data.users);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch owners");
    } finally {
      setIsLoadingOwners(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get(getFullUrl("/project_teams.json"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(response.data || []);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchProjectTypes = async () => {
    try {
      const response = await axios.get(getFullUrl("/project_types.json"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjectTypes(response.data || []);
    } catch (error) {
      console.error("Error fetching project types:", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(getFullUrl("/company_tags.json"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTags(response.data || []);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

      const response = await axios.get(
        `https://${baseUrl}/project_managements.json?q%5Bproject_team_project_team_members_user_id_or_owner_id_or_created_by_id_eq%5D=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.project_managements || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchAvailableTasks = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user") || "{}").id;

      const response = await axios.get(
        `https://${baseUrl}/task_managements.json?q%5Bresponsible_person_id_or_project_management_owner_id_eq%5D=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAvailableTasks(response.data.task_managements || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedType("Task");
  };

  const handleProjectSuccess = (projectId: number) => {
    toast.success("Project created successfully from todo!");
    closeModal();
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleTaskSuccess = (taskId: number) => {
    toast.success("Task created successfully from todo!");
    if (onSuccess) {
      onSuccess();
    }
    closeModal();
  };

  const handleMilestoneSuccess = (milestoneId: number) => {
    toast.success("Milestone created successfully from todo!");
    closeModal();
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSubtaskSuccess = () => {
    toast.success("Subtask created successfully from todo!");
    closeModal();
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleOpportunitySuccess = () => {
    toast.success("Opportunity created successfully from todo!");
    closeModal();
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSubtaskModalClose = (value: string | boolean) => {
    if (typeof value === "string") {
      setSelectedType(value);
    }
  };

  const handleProjectFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setProjectFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelectChange = (field: string, values: any) => {
    setProjectFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
  };

  const validateProjectForm = () => {
    toast.dismiss();
    if (!projectFormData.title) {
      toast.error("Please enter title");
      return false;
    }
    if (!projectFormData.owner) {
      toast.error("Please select owner");
      return false;
    }
    if (!projectFormData.endDate) {
      toast.error("Please select end date");
      return false;
    }
    if (!projectFormData.team) {
      toast.error("Please select team");
      return false;
    }
    if (!projectFormData.type) {
      toast.error("Please select type");
      return false;
    }
    if (!projectFormData.priority) {
      toast.error("Please select priority");
      return false;
    }
    return true;
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProjectForm()) {
      return;
    }

    setIsLoadingProject(true);

    const payload = {
      project_management: {
        title: projectFormData.title,
        description: projectFormData.description,
        start_date: projectFormData.startDate,
        end_date: projectFormData.endDate,
        status: "active",
        owner_id: projectFormData.owner,
        priority: projectFormData.priority,
        active: true,
        is_template: projectFormData.isTemplate,
        create_channel: projectFormData.isChannel,
        project_team_id: projectFormData.team,
        project_type_id: projectFormData.type,
      },
      task_tag_ids: projectFormData.tags,
    };

    try {
      const result = await dispatch(
        createProject({ token, baseUrl, data: payload })
      ).unwrap();
      const projectId = result?.id || result?.project_management?.id;

      if (projectId) {
        handleProjectSuccess(projectId);
      } else {
        toast.error("Project created but ID not found");
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(error.message || "Failed to create project");
    } finally {
      setIsLoadingProject(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <Dialog
      open={isModalOpen}
      onClose={closeModal}
      TransitionComponent={Transition}
      transitionDuration={{ enter: 500, exit: 300 }}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          position: "fixed",
          right: 0,
          top: 0,
          height: "100%",
          width: "50%",
          borderRadius: 0,
          margin: 0,
          maxHeight: "100%",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "16px",
          color: "#1B1B1B",
          textAlign: "center",
          borderBottom: "2px solid #E95420",
          py: 2,
          position: "relative",
        }}
      >
        Convert Todo
        <X
          className="absolute top-4 right-6 cursor-pointer text-gray-500 hover:text-gray-800"
          onClick={closeModal}
          size={20}
        />
      </DialogTitle>

      <DialogContent
        sx={{ p: 3, overflowY: "auto", maxHeight: "calc(100% - 100px)" }}
      >
        {/* Radio Buttons */}
        <div className="my-6">
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="convertType"
                value="Project"
                checked={selectedType === "Project"}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-[14px] font-medium">
                Convert to Project
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="convertType"
                value="Milestone"
                checked={selectedType === "Milestone"}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-[14px] font-medium">
                Convert to Milestone
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="convertType"
                value="Task"
                checked={selectedType === "Task"}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-[14px] font-medium">Convert to Task</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="convertType"
                value="Subtask"
                checked={selectedType === "Subtask"}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-[14px] font-medium">Convert to Subtask</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="convertType"
                value="Opportunity"
                checked={selectedType === "Opportunity"}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-[14px] font-medium">Convert to Opportunity</span>
            </label>
          </div>
        </div>

        {/* Forms based on selection */}
        <div>
          {selectedType === "Project" && (
            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className="mt-4 space-y-2">
                <TextField
                  label="Project Title"
                  name="title"
                  placeholder="Enter Project Title"
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={projectFormData.title}
                  onChange={handleProjectFormChange}
                  InputLabelProps={{ shrink: true }}
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
                      checked={
                        projectFormData[
                        name as keyof typeof projectFormData
                        ] as boolean
                      }
                      onChange={handleProjectFormChange}
                      className="mx-2 my-0.5"
                    />
                    <label htmlFor={id} className="text-sm">
                      Create a {label}
                    </label>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <TextField
                  label="Description*"
                  name="description"
                  placeholder=""
                  fullWidth
                  variant="outlined"
                  size="small"
                  multiline
                  minRows={2}
                  value={projectFormData.description}
                  onChange={handleProjectFormChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto !important",
                      padding: "2px !important",
                      display: "flex",
                    },
                    "& .MuiInputBase-input": {
                      resize: "none !important",
                    },
                  }}
                />
              </div>

              <div className="flex items-start gap-4 mt-3">
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel shrink>Select Owner*</InputLabel>
                  <Select
                    label="Select Owner*"
                    name="owner"
                    value={projectFormData.owner}
                    onChange={handleProjectFormChange}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Owner</em>
                    </MenuItem>
                    {owners.map((owner) => (
                      <MenuItem key={owner.id} value={owner.id}>
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
                      value={
                        projectFormData[field as keyof typeof projectFormData]
                      }
                      onChange={handleProjectFormChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ mt: 1 }}
                    />
                  </div>
                ))}
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
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <InputLabel shrink>Select Team*</InputLabel>
                    <Select
                      label="Select Team*"
                      name="team"
                      value={projectFormData.team}
                      onChange={handleProjectFormChange}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select Team</em>
                      </MenuItem>
                      {teams.map((team) => (
                        <MenuItem key={team.id} value={team.id}>
                          {team.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="flex gap-4">
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel shrink>Project Type*</InputLabel>
                    <Select
                      label="Project Type*"
                      name="type"
                      value={projectFormData.type}
                      onChange={handleProjectFormChange}
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select Project Type</em>
                      </MenuItem>
                      {projectTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel shrink>Priority*</InputLabel>
                    <Select
                      label="Priority*"
                      name="priority"
                      value={projectFormData.priority}
                      onChange={handleProjectFormChange}
                      displayEmpty
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
                  <div className="mt-2">
                    <MuiMultiSelect
                      label={
                        <span>
                          Tags <span className="text-[#c72030]">*</span>
                        </span>
                      }
                      options={tags.map((tag) => ({
                        value: tag.id,
                        label: tag.name,
                        id: tag.id,
                      }))}
                      value={projectFormData.tags}
                      onChange={(values) =>
                        handleMultiSelectChange("tags", values)
                      }
                      placeholder="Select Tags"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="px-6"
                    disabled={isLoadingProject}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProjectSubmit}
                    disabled={isLoadingProject}
                    className="bg-[#C72030] hover:bg-red-700"
                  >
                    {isLoadingProject ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {selectedType === "Milestone" && (
            <div>
              <AddMilestoneForm
                owners={owners}
                projects={projects}
                handleClose={closeModal}
                className="mx-0 w-full"
                prefillData={prefillData}
                isConversion={true}
                onSuccess={handleMilestoneSuccess}
                showProjectSelector={true}
              />
            </div>
          )}

          {selectedType === "Task" && (
            <ProjectTaskCreateModal
              isEdit={false}
              onCloseModal={closeModal}
              className="mx-0 w-full"
              prefillData={prefillData}
              onSuccess={handleTaskSuccess}
            />
          )}

          {selectedType === "Subtask" && (
            <AddSubtaskModal
              openTaskModal={true}
              setOpenTaskModal={handleSubtaskModalClose}
              fetchData={handleSubtaskSuccess}
              availableTasks={availableTasks}
              prefillData={prefillData}
              isInlineMode={true}
            />
          )}

          {selectedType === "Opportunity" && (
            <AddOpportunityModal
              open={selectedType === "Opportunity"}
              onClose={closeModal}
              onSuccess={handleOpportunitySuccess}
              prefillData={prefillData}
              isInlineMode={true}
              className="mx-0 w-full"
            />
          )}
        </div>
      </DialogContent>
      <AddTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        onTeamCreated={() => fetchTeams()}
      />
      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onTagCreated={() => fetchTags()}
      />
    </Dialog>
  );
};

export default TodoConvertModal;
