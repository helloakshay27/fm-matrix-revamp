import { useEffect, useState } from "react";
import SelectBox from "../../../SelectBox";
import MultiSelectBox from "../../../MultiSelectBox";
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../../../redux/slices/projectSlice'
import { fetchUsers } from '../../../../redux/slices/userSlice'
import { fetchTags } from '../../../../redux/slices/tagsSlice'

const Details = ({ setTab, setOpenModal, openModal }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.createProject);
  const { users } = useSelector((state) => state.user);
  const { fetchTags: tags } = useSelector((state) => state.fetchTags);

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchTags())
  }, [])

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

    return `${days} : ${hours} : ${minutes}`;
  };

  const handleSubmit = (e) => {
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
      },
      member_ids: formData.team.map((member) => member.value),
      task_tag_ids: formData.tags.map((tag) => tag.value),
    }

    dispatch(createProject(payload))

    success && setTab("Milestone");
  };

  return (
    <form className="pt-2 pb-12 h-full" onSubmit={handleSubmit}>
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
                users.map((user) => ({
                  value: user.id,
                  label: user.firstname + " " + user.lastname,
                }))
              }
              value={formData.projectOwner}
              onChange={(value) => handleSelectChange("projectOwner", value)}
              placeholder="Select Owner"
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">Template</label>
            <SelectBox
              options={[
                { value: "Option 1", label: "Option 1" },
                { value: "Option 2", label: "Option 2" },
                { value: "Option 3", label: "Option 3" },
              ]}
              value={formData.template}
              onChange={(value) => handleSelectChange("template", value)}
              placeholder="Select Template"
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

          <div className="w-[250px] space-y-2">
            <label className="block ms-2">Duration</label>
            <input
              value={handleDuration()}
              type="text"
              className="w-full border outline-none border-gray-300 p-2 text-sm bg-gray-200"
              readOnly
            />
          </div>
        </div>

        <div className="relative">
          <label className="absolute text-[12px] text-[red] top-2 right-2 mt-2 cursor-pointer" onClick={() => { setOpenModal(true) }
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
                options={[
                  { value: "Option 1", label: "Option 1" },
                  { value: "Option 2", label: "Option 2" },
                  { value: "Option 3", label: "Option 3" },
                ]}
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
        </div>

        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10">
          <button
            type="submit"
            className="flex items-center justify-center border-2 border-[red] px-4 py-2 text-[black] w-[100px]"
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default Details;