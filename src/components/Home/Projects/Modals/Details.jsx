import { useEffect, useState } from "react";
import SelectBox from "../../../SelectBox";
import MultiSelectBox from "../../../MultiSelectBox";
import { useDispatch, useSelector } from 'react-redux';
import { createProject, editProject, fetchProjectTypes, fetchTemplates } from '../../../../redux/slices/projectSlice'
import { fetchUsers } from '../../../../redux/slices/userSlice'
import { fetchTags } from '../../../../redux/slices/tagsSlice'
import { useParams } from "react-router-dom";

const Details = ({ setTab, setOpenTagModal,setOpenTeamModal, endText = "Next", isEdit = false }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { fetchUsers: users } = useSelector((state) => state.fetchUsers);
  const { fetchTags: tags } = useSelector((state) => state.fetchTags);
  const { fetchProjectDetails: editData } = useSelector((state) => state.fetchProjectDetails)
  const { success: editsuccess } = useSelector((state) => state.editProject)
  const { fetchProjectTypes: projectTypes } = useSelector((state) => state.fetchProjectTypes)
  const { fetchTemplates: templates } = useSelector((state) => state.fetchTemplates)

  const getUserName = (id) => {
    const user = users.find(u => u.id === id);
    return user ? `${user.firstname} ${user.lastname}` : "";
  };

  const getTagName = (id) => {
    const tag = tags.find(t => t.id === id);
    return tag ? tag.name : "";
  };


  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchTags());
    dispatch(fetchProjectTypes());
    dispatch(fetchTemplates());
  }, []);


  useEffect(() => {
    if (isEdit && editData) {
      setFormData({
        projectTitle: editData.title || "",
        description: editData.description || "",
        projectOwner: editData.owner_id || "",
        template: editData.template || "",
        startDate: editData.start_date || "",
        endDate: editData.end_date || "",
        team: editData.member_ids?.map(id => ({
          value: id,
          label: getUserName(id)
        })) || [],
        projectType: editData.projectType || "",
        priority: editData.priority || "",
        tags: editData.task_tag_ids?.map(id => ({
          value: id,
          label: getTagName(id)
        })) || [],

        createChannel: editData.createChannel || false,
        createTemplate: editData.createTemplate || false,
      });
    }
  }, [isEdit, editData]);


  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    projectOwner: "",
    template: "",
    startDate: "",
    endDate: "",
    team: [],
    projectType: "",
    priority: "",
    tags: [],
    createChannel: false,
    createTemplate: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (name, selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions,
    }));
  };

  const handleDuration = () => {
    if (!formData.startDate || !formData.endDate) return "";
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (end < start) return "Invalid: End date before start date";

    const ms = end - start;
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    return `${days}d : ${hours}h: ${minutes}m`;
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();

    const payload = {
      project_management: {
        title: formData.projectTitle,
        description: formData.description,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: 'active',
        owner_id: formData.projectOwner,
        priority: formData.priority,
        active: true,
        is_template: formData.createTemplate,
      },
      member_ids: formData.team.map((member) => member.value),
      task_tag_ids: formData.tags.map((tag) => tag.value),
    };

    if (isEdit) {
      dispatch(editProject({ id: id, payload: payload }));
    } else {
      const resultAction = await dispatch(createProject(payload));
      if (resultAction.meta.requestStatus === 'fulfilled') {
        setTab("Milestone");
      }
    }
  };

  useEffect(() => {
    if (editsuccess) {
      window.location.reload()
    }
  }, [editsuccess])

  return (
    <form className="pt-2 pb-12 h-full" onSubmit={(e) => handleSubmit(e, id)}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        <div className="mt-4 space-y-2">
          <label className="block ms-2">
            Project Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleInputChange}
            placeholder="Enter Project Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[12px]"
            required
          />
        </div>

        <div className="flex justify-between my-4">
          <div>
            <input
              type="checkbox"
              id="channel"
              name="createChannel"
              checked={formData.createChannel}
              onChange={handleInputChange}
              className="mx-2 my-0.5"
            />
            <label htmlFor="channel">Create a Channel</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="template"
              name="createTemplate"
              checked={formData.createTemplate}
              onChange={handleInputChange}
              className="mx-2 my-0.5"
            />
            <label htmlFor="template">Create a Template</label>
          </div>
        </div>

        <div className="mt-4 space-y-2 h-[100px]">
          <label className="block ms-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            placeholder="Enter Description"
            className="w-full border outline-none border-gray-300 p-2 text-sm h-[70%]"
          />
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Project Owner <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={
                users?.map((user) => ({
                  value: user.id,
                  label: user?.firstname + " " + user?.lastname,
                }))
              }
              value={formData.projectOwner}
              onChange={(value) => {
                handleSelectChange("projectOwner", value)
              }}
              placeholder="Select Owner"
                style={{"border":"1px solid #b3b2b2"}}

            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">Template</label>
            <SelectBox
              options={
                templates?.map((template) => ({
                  value: template.id,
                  label: template?.title,
                }))
              }
              value={formData.template}
              onChange={(value) => handleSelectChange("template", value)}
              placeholder="Select Template"
                style={{"border":"1px solid #b3b2b2"}}

            />
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 mt-4 text-[12px]">
          <div className="w-full space-y-2">
            <label className="block ms-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            />
          </div>

          <div className="w-full space-y-2">
            <label className="block ms-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
            />
          </div>

          <div className="w-[300px] space-y-2">
            <label className="block ms-2">Duration</label>
            <input
              value={handleDuration()}
              type="text"
              placeholder="00d:00h:00m"
              className="w-full border outline-none border-gray-300 p-2 text-sm bg-gray-200"
              readOnly
            />
          </div>
        </div>

        <div className="relative">
          <label className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer" onClick={() => { setOpenTeamModal("true") }
          }>
            <i>Create new team</i>
          </label>
        </div>

        <div className="flex flex-col relative justify-start gap-4 w-full bottom-0 py-3 bg-white my-10">
          <div>
            <label className="block mb-2">Project Team</label>
            <MultiSelectBox
              options={
                users.map((user) => ({
                  value: user.id,
                  label: user.firstname + " " + user.lastname,
                }))
              }
              value={formData.team}
              onChange={(values) => handleMultiSelectChange("team", values)}
              placeholder="Select Team"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <label className="block mb-2">Project Type</label>
              <SelectBox
                options={
                  projectTypes.map((type) => ({
                    value: type.id,
                    label: type.name,
                  }))
                }
                value={formData.projectType}
                onChange={(value) => handleSelectChange("projectType", value)}
                placeholder="Select Type"
                style={{"border":"1px solid #b3b2b2"}}

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
                style={{"border":"1px solid #b3b2b2"}}

              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Tags</label>
            <MultiSelectBox
              options={
                tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))
              }
              value={formData.tags}
              onChange={(values) => handleMultiSelectChange("tags", values)}
              placeholder="Select Tags"
            />
          </div>

         <div className="relative">
          <label className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer" onClick={() => {setOpenTagModal(true) }
          }>
            <i>Create new tag</i>
          </label>
        </div>

        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10">
          <button
            type="submit"
            className="flex items-center justify-center border-2 border-[red] px-4 py-2 text-[black] w-[100px]"
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