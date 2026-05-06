import {
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  IconButton,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { X, Mic, MicOff } from "lucide-react";
import { forwardRef, useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  createProject,
  changeProjectStatus,
} from "@/store/slices/projectManagementSlice";
import AddMilestoneForm from "./AddMilestoneForm";
import { AddTeamModal } from "./AddTeamModal";
import { AddTagModal } from "./AddTagModal";
import MuiMultiSelect from "./MuiMultiSelect";
import { SpeechInput } from "./SpeechInput";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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

const ProjectCreateModal = ({
  openDialog,
  handleCloseDialog,
  owners,
  teams,
  projectTypes,
  tags,
  fetchProjects,
  templateDetails,
}) => {
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const quillRef = useRef<HTMLDivElement>(null);
  const quillEditorRef = useRef<Quill | null>(null);

  const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();
  const [baseValue, setBaseValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState("details");
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
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
    tags: [],
  });

  // Handle STT for Description
  useEffect(() => {
    if (isListening && transcript && activeId === "project-description") {
      const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
      if (quillEditorRef.current) {
        const formattedValue = newValue.startsWith("<") ? newValue : `<p>${newValue}</p>`;
        quillEditorRef.current.root.innerHTML = formattedValue;
        setFormData((prev) => ({
          ...prev,
          description: formattedValue,
        }));
      }
    }
  }, [isListening, transcript, activeId, baseValue]);

  // Populate form when template is selected
  useEffect(() => {
    // Reset createdProjectId when modal opens or template changes
    setCreatedProjectId(null);

    if (templateDetails && templateDetails.id) {
      const mappedTags =
        templateDetails.project_tags?.map((tag: any) => ({
          value: tag?.company_tag?.id,
          label: tag?.company_tag?.name,
        })) || [];

      setFormData({
        title:
          templateDetails?.title
            ?.replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
            .replace(/#\[(.*?)\]\(\d+\)/g, "#$1") || "",
        isChannel: templateDetails.create_channel || false,
        isTemplate: templateDetails.is_template || false,
        description:
          templateDetails?.description
            ?.replace(/@\[(.*?)\]\(\d+\)/g, "@$1")
            .replace(/#\[(.*?)\]\(\d+\)/g, "#$1") || "",
        owner: templateDetails.owner_id || "",
        startDate: templateDetails.start_date || "",
        endDate: templateDetails.end_date || "",
        duration: "",
        team: templateDetails.project_team_id || "",
        type: templateDetails.project_type_id || "",
        priority: templateDetails.priority || "",
        tags: mappedTags,
      });
    } else {
      // Reset form if no template
      setFormData({
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
        tags: [],
      });
    }
  }, [templateDetails, openDialog]);

  // Initialize Quill Editor
  useEffect(() => {
    if (openDialog) {
      const initTimer = setTimeout(() => {
        if (quillRef.current) {
          // Clear previous instance if it exists
          if (quillEditorRef.current) {
            quillEditorRef.current = null;
          }

          quillEditorRef.current = new Quill(quillRef.current, {
            theme: "snow",
            placeholder: "Type description...",
            modules: {
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                ["blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            },
          });

          // Set initial description if exists
          if (formData.description) {
            quillEditorRef.current.root.innerHTML = formData.description;
          }

          // Handle text changes
          quillEditorRef.current.on("text-change", () => {
            const htmlContent = quillEditorRef.current?.root.innerHTML;
            setFormData((prev) => ({
              ...prev,
              description: htmlContent || "",
            }));
          });
        }
      }, 100);

      return () => {
        clearTimeout(initTimer);
      };
    } else {
      // Reset editor ref when modal closes
      if (quillEditorRef.current) {
        quillEditorRef.current = null;
      }
    }
  }, [openDialog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMultiSelectChange = (field: string, values: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: values,
    }));
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
      toast.error("Please select owner");
      return false;
    }
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    if (formData.startDate && formData.startDate < todayStr) {
      toast.error("Start date cannot be before today");
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
    if (!formData.team) {
      toast.error("Please select team");
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

  const handleSubmit = async (e, shouldNavigateToMilestone = false) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    const payload = {
      project_management: {
        title: formData.title,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: "active",
        owner_id: formData.owner,
        priority: formData.priority,
        active: true,
        is_template: formData.isTemplate,
        create_channel: formData.isChannel,
        project_team_id: formData.team,
        project_type_id: formData.type,
      },
      task_tag_ids: formData.tags.map((tag: any) => tag.value),
    };
    try {
      if (createdProjectId) {
        // Update existing project
        await dispatch(
          changeProjectStatus({
            token,
            baseUrl,
            id: createdProjectId,
            payload,
          })
        ).unwrap();
        toast.success("Project updated successfully");
        // Invalidate cache after project update
        const { cache } = await import("../utils/cacheUtils");
        cache.invalidatePattern("projects_*");
      } else {
        // Create new project
        const result = await dispatch(
          createProject({ token, baseUrl, data: payload })
        ).unwrap();
        toast.success("Project created successfully");
        // Invalidate cache after project creation
        const { cache } = await import("../utils/cacheUtils");
        cache.invalidatePattern("projects_*");
        // Store the created project ID
        setCreatedProjectId(result.id);
      }
      fetchProjects();

      if (shouldNavigateToMilestone) {
        // Save and Next: Switch to milestone tab
        setSelectedTab("milestone");
      } else {
        // Save: Close the modal
        handleCloseDialog();
      }
    } catch (error) {
      console.error("Error creating/updating project:", error);
      toast.error(error.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
    >
      <DialogContent
        className="w-[40rem] fixed right-0 top-0 rounded-none bg-[#fff] text-sm"
        style={{ margin: 0 }}
        sx={{
          padding: "0 !important",
        }}
      >
        <h3 className="text-[14px] font-medium text-center mt-8">
          New Project
        </h3>
        <X
          className="absolute top-[26px] right-8 cursor-pointer"
          onClick={handleCloseDialog}
        />

        <hr className="border border-[#E95420] mt-4" />
        <Tabs
          defaultValue={selectedTab}
          value={selectedTab}
          onValueChange={setSelectedTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="milestone">Milestone</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 110px)" }}
            >
              <form onSubmit={handleSubmit}>
                <div className="max-w-[90%] mx-auto pr-3">
                  <div className="mt-4 space-y-2">
                    <SpeechInput
                      label={
                        <>
                          Project Title<span className="text-[#c72030]">*</span>
                        </>
                      }
                      name="title"
                      placeholder="Enter Project Title"
                      fullWidth
                      variant="outlined"
                      value={formData.title}
                      onChange={(value) => setFormData({ ...formData, title: value })}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{ sx: fieldStyles }}
                      sx={{ mt: 1 }}
                    />
                  </div>

                  <div className="flex justify-between my-4">
                    {[
                      {
                        id: "createChannel",
                        name: "isChannel",
                        label: "Channel",
                      },
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
                          checked={formData[name]}
                          onChange={handleChange}
                          className="mx-2 my-0.5"
                        />
                        <label htmlFor={id} className="text-sm">
                          Create a {label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium">
                        Description<span className="text-[#c72030]">*</span>
                      </label>
                      {supported && (
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (isListening && activeId === "project-description") {
                              stopListening();
                            } else {
                              const currentText = quillEditorRef.current
                                ? quillEditorRef.current.root.innerHTML
                                : formData.description;
                              setBaseValue(currentText === "<p><br></p>" ? "" : currentText);
                              startListening("project-description");
                            }
                          }}
                          color={isListening && activeId === "project-description" ? "secondary" : "default"}
                          sx={{ color: isListening && activeId === "project-description" ? "#C72030" : "inherit" }}
                        >
                          {isListening && activeId === "project-description" ? (
                            <Mic size={18} />
                          ) : (
                            <MicOff size={18} />
                          )}
                        </IconButton>
                      )}
                    </div>
                    <div
                      ref={quillRef}
                      style={{
                        border: "1px solid rgba(0, 0, 0, 0.23)",
                        borderRadius: "4px",
                        minHeight: "200px",
                      }}
                    />
                  </div>

                  <div className="flex items-start gap-4 mt-3">
                    <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                      <InputLabel shrink>
                        Select Owner<span className="text-[#c72030]">*</span>
                      </InputLabel>
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
                        {owners?.map((owner) => (
                          <MenuItem key={owner.id} value={owner.id}>
                            {owner.full_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  <div className="flex gap-2 mt-4 text-[12px]">
                    {["startDate", "endDate"].map((field) => {
                      const today = new Date().toISOString().split("T")[0];

                      const minDate =
                        field === "startDate"
                          ? today
                          : formData.startDate || today;

                      return (
                        <div key={field} className="w-full space-y-2">
                          <TextField
                            label={
                              field === "endDate" ? (
                                <span>
                                  End Date{" "}
                                  <span className="text-[#c72030]">*</span>
                                </span>
                              ) : (
                                "Start Date"
                              )
                            }
                            type="date"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            fullWidth
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ sx: fieldStyles }}
                            sx={{ mt: 1 }}
                            inputProps={{
                              min: minDate,
                            }}
                          />
                        </div>
                      );
                    })}

                    <div className="w-[350px] space-y-2">
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
                        <InputLabel shrink>
                          Select Team <span className="text-[#c72030]">*</span>
                        </InputLabel>
                        <Select
                          label="Select Team*"
                          name="team"
                          value={formData.team}
                          onChange={handleChange}
                          displayEmpty
                          sx={fieldStyles}
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
                      <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel shrink>
                          Project Type <span className="text-[#c72030]">*</span>
                        </InputLabel>
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
                          {projectTypes.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              {type.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                        <InputLabel shrink>
                          Priority <span className="text-[#c72030]">*</span>
                        </InputLabel>
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
                          value={formData.tags}
                          onChange={(values) =>
                            handleMultiSelectChange("tags", values)
                          }
                          placeholder="Select Tags"
                        />
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 mb-4">
                      <Button
                        type="button"
                        onClick={(e) => handleSubmit(e, false)}
                        disabled={isSubmitting}
                        variant="outline"
                        className="px-6"
                      >
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        onClick={(e) => handleSubmit(e, true)}
                        disabled={isSubmitting}
                        className="px-6"
                      >
                        {isSubmitting ? "Saving..." : "Save & Next"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </TabsContent>
          <TabsContent value="milestone">
            <div
              className="overflow-y-auto"
              style={{ height: "calc(100vh - 110px)" }}
            >
              <AddMilestoneForm
                handleClose={handleCloseDialog}
                owners={owners}
              />
            </div>
          </TabsContent>
        </Tabs>
        <AddTeamModal
          isOpen={isTeamModalOpen}
          onClose={() => setIsTeamModalOpen(false)}
          onTeamCreated={() => fetchProjects()}
        />
        <AddTagModal
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          onTagCreated={() => fetchProjects()}
        />
      </DialogContent>

      <style>{`
        .ql-toolbar {
          border-top: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
          border-radius: 4px 4px 0 0;
          background-color: #fafafa;
          margin-bottom: 0 !important;
        }

        .ql-container {
          border-bottom: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-radius: 0 0 4px 4px;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
          margin-top: 0 !important;
        }

        .ql-editor {
          padding: 12px 14px;
          font-size: 14px;
          line-height: 1.5;
        }

        .ql-editor.ql-blank::before {
          color: rgba(0, 0, 0, 0.6);
          font-style: normal;
        }

        .ql-toolbar button:hover {
          color: #01569E;
        }

        .ql-toolbar button.ql-active {
          color: #01569E;
        }
      `}</style>
    </Dialog>
  );
};

export default ProjectCreateModal;
