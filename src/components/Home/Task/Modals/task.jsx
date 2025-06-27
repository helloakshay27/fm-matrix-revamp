import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, removeUserFromProject } from "../../../../redux/slices/userSlice";
import { fetchTags } from "../../../../redux/slices/tagsSlice";
import WeekProgressPicker from "../../../../Milestone/weekProgressPicker";
import MultiSelectBox from "../../../MultiSelectBox";
import SelectBox from "../../../SelectBox";
import { createTask, editTask } from "../../../../redux/slices/taskSlice";
import { useParams } from "react-router-dom";
import { fetchProjectDetails, removeTagFromProject } from "../../../../redux/slices/projectSlice";
import { fetchMilestoneById } from "../../../../redux/slices/milestoneSlice";
import toast from "react-hot-toast";

const TaskForm = ({
  formData,
  setFormData,
  isReadOnly = false,
  project,
  milestone,
  users,
  tags,
  prevTags,
  setPrevTags,
  prevObservers,
  setPrevObservers,
  isEdit,
  dispatch,
  milestoneStartDate,
  milestoneEndDate,
  token,
  allUsers
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateSelect = (date) => {
    setFormData({ ...formData, expected_start_date: date });
  };

  const handleTargetDate = (date) => {
    setFormData({ ...formData, target_date: date });
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

    if (name === "observer") {
      const removed = prevObservers.find(
        (prev) => !selectedOptions.some((curr) => curr.value === prev.value)
      );

      if (removed && isEdit) {
        dispatch(removeUserFromProject({ token, id: removed.id }));
      }

      setPrevObservers(selectedOptions);
    }

    setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
  };

  const calculateDuration = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return "";
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (end < start) return "Invalid: End date before start date";

    const ms = end - start;
    const totalMinutes = Math.floor(ms / (1000 * 60));
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d : ${hours}h : ${minutes}m`;
  };

  return (
    <div className="p-4 bg-white">
      {/* <div className="flex items-center justify-between gap-3">
        <div className="mt-4 space-y-2">
          <label className="block ms-2">
            Project <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={project?.title || ""}
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200"
            readOnly
          />
        </div>
        <div className="mt-4 space-y-2 w-auto">
          <label className="block ms-2">
            Milestone <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={milestone?.title || ""}
            readOnly
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200"
          />
        </div>
      </div> */}

      {project && milestone &&
        !Array.isArray(project) &&
        !Array.isArray(milestone) &&
        project.title && milestone.title && (
          <div className="flex items-center justify-between gap-3">
            <div className="mt-4 space-y-2">
              <label className="block ms-2">
                Project <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={project.title}
                className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200"
                readOnly
              />
            </div>
            <div className="mt-4 space-y-2 w-auto">
              <label className="block ms-2">
                Milestone <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={milestone.title}
                readOnly
                className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200"
              />
            </div>
          </div>
        )}

      <div className="flex items-start gap-4 mt-3">
        <div className="w-full flex flex-col justify-between">
          <label className="block mb-2">
            Task Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="taskTitle"
            placeholder="Enter Task Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px]"
            value={formData.taskTitle}
            onChange={handleInputChange}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2 h-[100px]">
        <label className="block">Description</label>
        <textarea
          name="description"
          rows={5}
          placeholder="Enter Description"
          className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[70%]"
          value={formData.description}
          onChange={handleInputChange}
          disabled={isReadOnly}
        />
      </div>

      <div className="flex justify-between mt-1 mb-4 gap-2">
        <div className="mt-4 space-y-2 w-full">
          <label className="block">
            Responsible Person <span className="text-red-600">*</span>
          </label>
          <SelectBox
            options={users.map((user) => ({
              label: user?.user?.name || user.firstname + " " + user.lastname,
              value: user.user_id || user.id,
            }))}
            placeholder="Select Person"
            value={formData.responsiblePerson}
            onChange={(value) =>
              setFormData({ ...formData, responsiblePerson: value })
            }
            disabled={isReadOnly}
          />
        </div>
        <div className="mt-4 space-y-2 w-full">
          <label className="block">
            Department <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={
              allUsers.find((user) => user.id === formData.responsiblePerson)
                ?.lock_role?.display_name || ""
            }
            className="text-[13px] border-2 border-grey-300 px-2 py-[6px] bg-gray-200 w-full"
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
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2 w-full">
          <label className="block ms-2">Duration</label>
          <input
            type="text"
            className="w-full border outline-none border-gray-300 px-2 py-[7px] text-[13px] bg-gray-200"
            placeholder="00d:00h:00m"
            value={calculateDuration(
              formData.expected_start_date,
              formData.target_date
            )}
            readOnly
          />
        </div>
      </div>

      <div>
        <WeekProgressPicker
          onDateSelect={handleDateSelect}
          selectedDate={formData.expected_start_date}
          title="Start Date"
          disabled={isReadOnly}
          minDate={milestoneStartDate}
          maxDate={milestoneEndDate}
        />
      </div>

      <div>
        <WeekProgressPicker
          onDateSelect={handleTargetDate}
          selectedDate={formData.target_date}
          title="End Date"
          disabled={isReadOnly}
          minDate={milestoneStartDate}
          maxDate={milestoneEndDate}
        />
      </div>

      <div className="flex items-start gap-4 mt-3">
        <div className="flex flex-col justify-between w-full">
          <label className="block mb-2">
            Observer <span className="text-red-600">*</span>
          </label>
          <MultiSelectBox
            options={users.map((user) => ({
              label: user?.user?.name || user.firstname + " " + user.lastname,
              value: user.user_id || user.id,
            }))}
            value={formData.observer}
            placeholder="Select Observer"
            onChange={(values) => handleMultiSelectChange("observer", values)}
            disabled={isReadOnly}
          />
        </div>
      </div>

      <div className="flex items-start gap-4 mt-3">
        <div className="flex flex-col justify-between w-full">
          <label className="block mb-2">
            Tags <span className="text-red-600">*</span>
          </label>
          <MultiSelectBox
            options={tags.map(tag => ({ value: tag.id, label: tag.name }))}
            value={formData.tags}
            onChange={values => handleMultiSelectChange("tags", values)}
            placeholder="Select Tags"
            disabled={isReadOnly}
          />
        </div>
      </div>
    </div>
  );
};

const Tasks = ({ isEdit }) => {
  const token = localStorage.getItem("token");
  const { id, mid, tid } = useParams();
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.createTask);
  const { fetchUsers: users = [] } = useSelector((state) => state.fetchUsers);
  const { fetchTags: tags = [] } = useSelector((state) => state.fetchTags);
  const { taskDetails: task } = useSelector((state) => state.taskDetails);
  const { fetchProjectDetails: project } = useSelector((state) => state.fetchProjectDetails);
  const { fetchMilestoneById: milestone } = useSelector((state) => state.fetchMilestoneById);
  const {
    loading: editLoading,
    success: editSuccess,
    error: editError,
  } = useSelector((state) => state.editTask);

  const [nextId, setNextId] = useState(1);
  const [savedTasks, setSavedTasks] = useState([]);
  const [formData, setFormData] = useState({
    project: id,
    milestone: mid,
    taskTitle: "",
    description: "",
    responsiblePerson: "",
    department: "",
    priority: "",
    duration: "",
    expected_start_date: null,
    target_date: null,
    observer: [],
    tags: [],
  });

  const [prevTags, setPrevTags] = useState([]);
  const [prevObservers, setPrevObservers] = useState([]);

  useEffect(() => {
    dispatch(fetchUsers({ token }));
    dispatch(fetchTags({ token }));
    dispatch(fetchProjectDetails({ token, id }));
    dispatch(fetchMilestoneById({ token, id: mid }));
  }, [dispatch, id, mid]);

  const getTagName = useCallback(
    (id) => tags.find((t) => t.id === id)?.name || "",
    [tags]
  );

  useEffect(() => {
    if (isEdit && task) {
      const mappedTags = task.task_tags?.map((tag) => ({
        value: tag?.company_tag?.id,
        label: getTagName(tag?.company_tag?.id),
        id: tag.id
      })) || [];

      const mappedObservers = task.observers?.map((observer) => ({
        value: observer?.user_id,
        label: observer?.user_name,
        id: observer.id
      })) || [];
      console.log(task.expected_start_date.split("T")[0]);

      setFormData({
        project: id,
        milestone: mid,
        taskTitle: task.title || "",
        description: task.description || "",
        responsiblePerson: task.responsible_person_id || "",
        department: "",
        priority: task.priority || "",
        duration: "",
        expected_start_date: task.expected_start_date?.split("T")[0] || null,
        target_date: task.target_date || null,
        observer: mappedObservers,
        tags: mappedTags,
      });

      setPrevTags(mappedTags);
      setPrevObservers(mappedObservers);
    }
  }, [isEdit, task, id, mid]);

  const createTaskPayload = (data) => ({
    title: data.taskTitle,
    description: data.description,
    responsible_person_id: data.responsiblePerson,
    priority: data.priority,
    observer_ids: data.observer.map((observer) => observer.value),
    task_tag_ids: data.tags.map((tag) => tag.value),
    expected_start_date: data.expected_start_date,
    target_date: data.target_date,
    project_management_id: id,
    milestone_id: mid,
    active: true,
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (
      !formData.taskTitle ||
      !formData.responsiblePerson ||
      !formData.priority ||
      !formData.expected_start_date ||
      !formData.target_date ||
      !formData.observer.length ||
      !formData.tags.length
    ) {
      toast.dismiss();
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = createTaskPayload(formData);

    try {
      const resultAction = await dispatch(createTask({ token, payload })).unwrap();
        toast.dismiss();
        toast.success("Task created successfully.");
        setSavedTasks([...savedTasks, { id: nextId, formData }]);
        setFormData({
          project: id,
          milestone: mid,
          taskTitle: "",
          description: "",
          responsiblePerson: "",
          department: "",
          priority: "",
          duration: "",
          expected_start_date: null,
          target_date: null,
          observer: [],
          tags: [],
        });
        setNextId(nextId + 1);
      
    } catch (error) {
      console.error("Error creating task:", error);
      toast.dismiss();
      toast.error("Error creating task.");
    }
  };

  const handleSubmit = async (e, editId) => {
    e.preventDefault();
    if (
      !formData.taskTitle ||
      !formData.responsiblePerson ||
      !formData.priority ||
      !formData.expected_start_date ||
      !formData.target_date ||
      !formData.observer.length ||
      !formData.tags.length
    ) {
      toast.dismiss();
      toast.error("Please fill all required fields.");
      return;
    }

    const payload = createTaskPayload(formData);

    try {
      const resultAction = isEdit
        ? await dispatch(editTask({ token, id: editId, payload }))
        : await dispatch(createTask({ token, payload }));
      if (
        (isEdit && editTask.fulfilled.match(resultAction)) ||
        (!isEdit && createTask.fulfilled.match(resultAction))
      ) {
        toast.dismiss();
        toast.success(
          isEdit ? "Task updated successfully." : "Task created successfully."
        );
        window.location.reload();
      } else {
        toast.error(isEdit ? "Task update failed." : "Task creation failed.");
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} task:`, error);
      toast.error(`Error ${isEdit ? "updating" : "creating"} task.`);
    }
  };

  return (
    <form
      className="pt-2 pb-12 h-full overflow-y-auto text-[12px]"
      onSubmit={(e) => handleSubmit(e, tid)}
    >
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3"
      >
        {savedTasks.map((task) => (
          <TaskForm
            key={task.id}
            formData={task.formData}
            setFormData={() => { }} // No-op for read-only forms
            isReadOnly={true}
            project={project}
            milestone={milestone}
            users={project?.project_team?.project_team_members || users}
            tags={tags}
            prevTags={prevTags}
            setPrevTags={setPrevTags}
            prevObservers={prevObservers}
            setPrevObservers={setPrevObservers}
            isEdit={isEdit}
            dispatch={dispatch}
            milestoneStartDate={milestone?.start_date}
            milestoneEndDate={milestone?.end_date}
            token={token}
            allUsers={users}
          />
        ))}
        <TaskForm
          formData={formData}
          setFormData={setFormData}
          isReadOnly={false}
          project={project}
          milestone={milestone}
          users={project?.project_team?.project_team_members || users}
          tags={tags}
          prevTags={prevTags}
          setPrevTags={setPrevTags}
          prevObservers={prevObservers}
          setPrevObservers={setPrevObservers}
          isEdit={isEdit}
          dispatch={dispatch}
          milestoneStartDate={milestone?.start_date}
          milestoneEndDate={milestone?.end_date}
          token={token}
          allUsers={users}
        />
        {!isEdit && (
          <div className="relative">
            <button
              type="button"
              onClick={handleAddTask}
              className="absolute text-[12px] text-[red] right-2 top-[10px] cursor-pointer"
            >
              Add New Task
            </button>
          </div>
        )}
        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10 text-[12px]">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[white] border-[red] px-4 py-2 w-[100px] bg-[red]"
          >
            {loading || editLoading
              ? "Processing..."
              : isEdit
                ? "Update"
                : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Tasks;
