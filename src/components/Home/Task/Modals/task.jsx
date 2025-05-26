import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import { fetchTags } from "../../../../redux/slices/tagsSlice";
import WeekProgressPicker from "../../../../Milestone/weekProgressPicker";
import MultiSelectBox from "../../../MultiSelectBox";
import SelectBox from "../../../SelectBox";
import { createTask } from "../../../../redux/slices/taskSlice";

const Tasks = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.createTask);
  const { users } = useSelector((state) => state.user);
  const { tags } = useSelector((state) => state.fetchTag);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchTags());
  }, []);

  const [formData, setFormData] = useState({
    project: "",
    milestone: "",
    taskTitle: "",
    description: "",
    responsiblePerson: "",
    department: "",
    priority: "",
    duration: "",
    expected_start_date: null,
    observer: [],
    tags: [],
  });

  const handleDateSelect = (date) => {
    setFormData({ ...formData, expected_start_date: date });
  };

  const handleAddTask = (e) => {
    e.preventDefault();

    const payload = {
      task_management: {
        title: formData.taskTitle,
        description: formData.description,
        responsible_person_id: formData.responsiblePerson,
        priority: formData.priority,
        observer_ids: formData.observer.map((observer) => observer.value),
        task_tag_ids: formData.tags.map((tag) => tag.value),
        expected_start_date: formData.expected_start_date,
        project_management_id: 10,
        active: true,
      },
    };

    dispatch(createTask(payload))
  };

  useEffect(() => {
    if (success) {
      window.location.reload();
    }
  }, [success]);

  return (
    <form className="pt-2 pb-12 h-full overflow-y-auto text-[12px]" onSubmit={handleAddTask}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="mt-4 space-y-2">
            <label className="block ms-2">
              Project <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.project}
              className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200"
              readOnly
            />
          </div>
          <div className="mt-4 space-y-2 w-auto">
            <label className="block ms-2">
              Milestone<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.milestone}
              readOnly
              className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200"
            />
          </div>
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="w-full flex flex-col justify-between">
            <label className="block mb-2">
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Task Title"
              className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px]"
              value={formData.taskTitle}
              onChange={(e) => setFormData({ ...formData, taskTitle: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4 space-y-2 h-[100px]">
          <label className="block ms-2">Description</label>
          <textarea
            type="text"
            rows={5}
            placeholder="Enter Description"
            className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[70%]"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="flex justify-between mt-1 mb-4 gap-2">
          <div className="mt-4 space-y-2 w-full">
            <label className="block">
              Responsible Person<span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={users.map((user) => ({
                label: user.firstname + " " + user.lastname,
                value: user.id,
              }))}
              placeholder="Select Person "
              value={formData.responsiblePerson}
              onChange={(value) => setFormData({ ...formData, responsiblePerson: value })}
            />
          </div>
          <div className="mt-4 space-y-2 w-full">
            <label className="block">
              Department<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.department}
              className="text-[13px] border-2 border-grey-300 px-2 py-[6px] bg-gray-200"
              readOnly
            />
          </div>
        </div>

        <div className="flex justify-between mt-1 gap-2 text-[12px]">
          <div className="space-y-2 w-full">
            <label className="block ms-2">Priority</label>
            <SelectBox
              options={[
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
              placeholder="Select Priority"
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value })}
            />
          </div>

          <div className=" space-y-2 w-full">
            <label className="block ms-2">Duration</label>
            <input
              type="text"
              className="w-full border outline-none border-gray-300 px-2 py-[7px] text-[13px]"
              placeholder="00d:00h:00m"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
        </div>

        <div>
          <WeekProgressPicker
            onDateSelect={handleDateSelect}
            selectedDate={formData.expected_start_date}
          />
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className="flex flex-col justify-between w-2/3">
            <label className="block mb-2">
              Observer<span className="text-red-600">*</span>
            </label>
            <MultiSelectBox
              options={users.map((user) => ({
                label: user.firstname + " " + user.lastname,
                value: user.id,
              }))}
              value={formData.observer}
              placeholder="Select Observer"
              onChange={(values) => setFormData({ ...formData, observer: values })}
            />
          </div>
        </div>

        <div className="flex items-start gap-4 mt-3">
          <div className=" flex flex-col justify-between w-full">
            <label className="block mb-2">
              Tags<span className="text-red-600">*</span>
            </label>
            <MultiSelectBox
              options={tags.map((tag) => ({
                label: tag.name,
                value: tag.id,
              }))}
              value={formData.tags}
              placeholder="Select Tags"
              onChange={(values) => setFormData({ ...formData, tags: values })}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10 text-[12px]">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[white] border-[red] px-4 py-2 w-[100px] bg-[red]"
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button" // Changed to type="button" to prevent form submission
            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2"
          >
            Add New task
          </button>
        </div>
      </div>
    </form>
  );
};

export default Tasks;