import { useEffect, useState, useCallback } from "react";
import SelectBox from "../../../SelectBox";
import MultiSelectBox from "../../../MultiSelectBox";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  editProject,
  fetchActiveProjectTypes,
  fetchProjectDetails,
  fetchProjects,
  fetchProjectTeams,
  fetchProjectTypes,
  fetchTemplates,
  removeTagFromProject,
  resetEditSuccess,
  resetProjectSuccess,
} from "../../../../redux/slices/projectSlice";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import { fetchActiveTags, fetchTags } from "../../../../redux/slices/tagsSlice";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Details = ({
  setTab,
  setOpenTagModal,
  setOpenTeamModal,
  endText = "Next",
  isEdit = false,
  templateDetails,
}) => {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    fetchUsers: users = [],
    fetchActiveTags: tags = [],
    fetchProjectDetails: editData = {},
    createProject: { success },
    editProject: { success: editsuccess },
    fetchActiveProjectTypes: projectTypes = [],
    fetchTemplates: templates = [],
    fetchProjectTeams: teams = [],
  } = useSelector((state) => ({
    fetchUsers: state.fetchUsers.fetchUsers,
    fetchActiveTags: state.fetchActiveTags.fetchActiveTags,
    fetchProjectDetails: state.fetchProjectDetails.fetchProjectDetails,
    createProject: state.createProject,
    editProject: state.editProject,
    fetchActiveProjectTypes:
      state.fetchActiveProjectTypes.fetchActiveProjectTypes,
    fetchTemplates: state.fetchTemplates.fetchTemplates,
    fetchProjectTeams: state.fetchProjectTeams.fetchProjectTeams,
  }));

  const { createProject: project = {} } = useSelector(
    (state) => state.createProject
  );

  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    projectOwner: "",
    template: "",
    startDate: "",
    endDate: "",
    projectType: "",
    projectTeam: "",
    priority: "",
    tags: [],
    createChannel: false,
    createTemplate: false,
  });

  const [prevTags, setPrevTags] = useState([]);

  const getTagName = useCallback(
    (id) => tags.find((t) => t.id === id)?.name || "",
    [tags]
  );

  useEffect(() => {
    if (isEdit) {
      setIsEditAllowed(true);
    }
  }, [isEdit]);

  useEffect(() => {
    dispatch(fetchUsers({ token }));
    dispatch(fetchActiveTags({ token }));
    dispatch(fetchActiveProjectTypes({ token }));
    dispatch(fetchTemplates({ token }));
    dispatch(fetchProjectTeams({ token }));
  }, [dispatch]);

  useEffect(() => {
    if (templateDetails) {
      const mappedTags =
        templateDetails.project_tags?.map((tag) => ({
          value: tag?.company_tag?.id,
          label: getTagName(tag?.company_tag?.id),
          id: tag.id,
        })) || [];

      setFormData({
        projectTitle: templateDetails.title || "",
        description: templateDetails.description || "",
        projectOwner: templateDetails.owner_id || "",
        template: templateDetails.template || "",
        startDate: templateDetails.start_date || "",
        endDate: templateDetails.end_date || "",
        projectType: templateDetails.project_type_id || "",
        priority: templateDetails.priority || "",
        tags: mappedTags,
        projectTeam: templateDetails.project_team_id || "",
        createChannel: templateDetails.create_channel || false,
        createTemplate: templateDetails.is_template || false,
      });
    }
  }, [templateDetails]);

  useEffect(() => {
    if (!Array.isArray(project) && !isEdit) {
      dispatch(fetchProjectDetails({ token, id: project.id }));
      setIsEditAllowed(true);
    }
  }, [project]);

  useEffect(() => {
    if ((isEdit && editData?.id) || (project && project.id)) {
      const mappedTags =
        editData.project_tags?.map((tag) => ({
          value: tag?.company_tag?.id, // used for MultiSelectBox
          label: getTagName(tag?.company_tag?.id),
          id: tag.id, // project_tag.id used for deletion
        })) || [];

      setFormData({
        projectTitle: editData.title || "",
        description: editData.description || "",
        projectOwner: editData.owner_id || "",
        template: editData.template || "",
        startDate: editData.start_date || "",
        endDate: editData.end_date || "",
        projectType: editData.project_type_id || "",
        priority: editData.priority || "",
        tags: mappedTags,
        projectTeam: editData.project_team_id || "",
        createChannel: editData.create_channel || false,
        createTemplate: editData.is_template || false,
      });

      setPrevTags(mappedTags);
    }
  }, [isEdit, editData, getTagName]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    if (name === "tags") {
      const removed = prevTags.find(
        (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
      );

      if (removed && isEdit) {
        dispatch(removeTagFromProject({ token, id: removed.id }));
      }

      setPrevTags(selectedOptions);
    }

    setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.projectTitle)
      errors.projectTitle = "Project title is required.";
    else if (!formData.projectOwner)
      errors.projectOwner = "Project owner is required.";
    else if (!formData.startDate) errors.startDate = "Start date is required.";
    else if (!formData.endDate) errors.endDate = "End date is required.";
    else if (!formData.projectTeam)
      errors.projectTeam = "Project team is required.";

    if (Object.keys(errors).length) {
      toast.dismiss();
      toast.error(Object.values(errors)[0]);
      return false;
    }
    return true;
  };

  const handleDuration = () => {
    if (!formData.startDate || !formData.endDate) return "";
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (end < start) return "Invalid: End date before start date";

    const ms = end - start;
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d : ${hours}h : ${minutes}m`;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    const payload = {
      project_management: {
        title: formData.projectTitle,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        owner_id: formData.projectOwner,
        priority: formData.priority,
        active: true,
        is_template: formData.createTemplate,
        create_channel: formData.createChannel,
        project_team_id: formData.projectTeam,
        project_type_id: formData.projectType,
      },
      task_tag_ids: formData.tags.map((tag) => tag.value),
    };

    try {
      await dispatch(createProject({ token, payload })).unwrap();
      window.location.reload();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error creating project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = {
      project_management: {
        title: formData.projectTitle,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        ...(!isEdit && { status: "active" }),
        owner_id: formData.projectOwner,
        priority: formData.priority,
        active: true,
        is_template: formData.createTemplate,
        create_channel: formData.createChannel,
        project_team_id: formData.projectTeam,
        project_type_id: formData.projectType,
      },
      task_tag_ids: formData.tags.map((tag) => tag.value),
    };

    try {
      if (isEdit || isEditAllowed) {
        await dispatch(
          editProject({ token, id: id || project.id, payload })
        ).unwrap();

        if (isEdit) {
          window.location.reload();
        } else {
          setTab("Milestone");
        }
      } else {
        await dispatch(createProject({ token, payload }));
        toast.dismiss()
        toast.success("Project created successfully");
        setTab("Milestone");
        await dispatch(fetchProjects({ token })).unwrap();
      }
    } catch (error) {
      console.error("Project submission failed:", error);
      toast.dismiss()
      toast.error(error.message || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
      dispatch(resetProjectSuccess());
      dispatch(resetEditSuccess());
    }
  };

  return (
    <form className="pt-2 pb-12 h-full" onSubmit={handleSubmit}>
      <div className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3">
        <div className="mt-4 space-y-2">
          <label className="block">
            Project Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleInputChange}
            placeholder="Enter Project Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
          />
        </div>

        <div className="flex justify-between my-4">
          {["createChannel", "createTemplate"].map((name) => (
            <div key={name}>
              <input
                type="checkbox"
                id={name}
                name={name}
                checked={formData[name]}
                onChange={handleInputChange}
                className="mx-2 my-0.5"
              />
              <label htmlFor={name}>
                Create a {name === "createChannel" ? "Channel" : "Template"}
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2 h-[100px]">
          <label className="block">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            placeholder="Enter Description"
            className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[75px] overflow-y-auto resize-none"
          />
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="w-full">
            <label className="block mb-2">
              Project Owner <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={users.map((user) => ({
                value: user.id,
                label: `${user.firstname} ${user.lastname}`,
              }))}
              value={formData.projectOwner}
              onChange={(value) => handleSelectChange("projectOwner", value)}
              placeholder="Select Owner"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 text-[12px]">
          {["startDate", "endDate"].map((field) => (
            <div key={field} className="w-full space-y-2">
              <label className="block">
                {field === "startDate" ? "Start Date" : "End Date"}{" "}
                <span className="text-red-600">*</span>
              </label>

              <input
                type="date"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="w-full border outline-none border-gray-300 p-2"
                min={
                  field === "startDate"
                    ? !isEdit
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                    : formData.startDate ||
                    new Date().toISOString().split("T")[0]
                }
              />
            </div>
          ))}

          <div className="w-[300px] space-y-2">
            <label className="block">Duration</label>
            <input
              value={handleDuration()}
              readOnly
              type="text"
              className="w-full border outline-none border-gray-300 p-2 bg-gray-200"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 my-10">
          <div>
            <div className="flex justify-between">
              <label className="block mb-2">
                Project Team <span className="text-red-600">*</span>
              </label>
              <label
                className="text-[12px] text-[red] cursor-pointer"
                onClick={() => setOpenTeamModal(true)}
              >
                <i>Create new team</i>
              </label>
            </div>
            <SelectBox
              options={
                teams
                  ? teams.map((team) => ({ value: team.id, label: team.name }))
                  : []
              }
              value={formData.projectTeam}
              onChange={(value) => handleSelectChange("projectTeam", value)}
              placeholder="Select Team"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block mb-2">Project Type</label>
              <SelectBox
                options={
                  projectTypes
                    ? projectTypes.map((type) => ({
                      value: type.id,
                      label:
                        type.name.charAt(0).toUpperCase() +
                        type.name.slice(1),
                    }))
                    : []
                }
                value={formData.projectType}
                onChange={(value) => handleSelectChange("projectType", value)}
                placeholder="Select Type"
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2">Priority</label>
              <SelectBox
                options={[
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
                value={formData.priority}
                onChange={(value) => handleSelectChange("priority", value)}
                placeholder="Select Priority"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2">Tags</label>
            <MultiSelectBox
              options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
              value={formData.tags}
              onChange={(values) => handleMultiSelectChange("tags", values)}
              placeholder="Select Tags"
            />
            <div
              className="text-[12px] text-[red] text-right cursor-pointer mt-2"
              onClick={() => setOpenTagModal(true)}
            >
              <i>Create new tag</i>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            {
              !isEdit && (
                <button
                  type="button"
                  className="border-2 border-red-500 px-4 py-2 text-black w-[100px]"
                  disabled={isSubmitting}
                  onClick={handleSave}
                >
                  Save
                </button>
              )
            }
            <button
              type="submit"
              className="border-2 border-red-500 px-4 py-2 text-black w-max"
              disabled={isSubmitting}
            >
              {endText}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Details;
