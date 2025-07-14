import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAvailability, fetchUsers, removeUserFromProject } from "../../../../redux/slices/userSlice";
import { fetchTags } from "../../../../redux/slices/tagsSlice";
import WeekProgressPicker from "../../../../Milestone/weekProgressPicker";
import MultiSelectBox from "../../../MultiSelectBox";
import SelectBox from "../../../SelectBox";
import { createTask, editTask, fetchTasks } from "../../../../redux/slices/taskSlice";
import { useParams } from "react-router-dom";
import { fetchProjectDetails, removeTagFromProject } from "../../../../redux/slices/projectSlice";
import { fetchMilestoneById } from "../../../../redux/slices/milestoneSlice";
import toast from "react-hot-toast";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

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
  allUsers,
  calculateDuration,
  hasSavedTasks,
  setIsDelete
}) => {
  const { fetchUserAvailability: userAvailability } = useSelector(state => state.fetchUserAvailability);
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

  return (
    <div className="p-4 bg-white relative">
      {!isReadOnly && hasSavedTasks && (
        <DeleteOutlinedIcon
          onClick={() => {
            setFormData({
              project: formData.project,
              milestone: formData.milestone,
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
            setIsDelete(true);
          }}
          className="absolute top-3 right-3 text-red-600 cursor-pointer"
        />
      )}
      {project && milestone &&
        !Array.isArray(project) &&
        !Array.isArray(milestone) &&
        project.title && milestone.title && (
          <div className="flex items-center justify-between gap-3">
            <div className="mt-4 space-y-2 w-full">
              <label className="block ms-2">
                Project <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={project.title}
                className="w-full border h-[40px] outline-none border-gray-300 p-2 text-[13px] bg-gray-200 overflow-hidden text-ellipsis"
                readOnly
              />
            </div>
            <div className="mt-4 space-y-2 w-full">
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
          className="w-full border outline-none border-gray-300 p-2 text-[13px] h-[80px] overflow-y-auto resize-none"
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
            onChange={(value) => {
              setFormData({ ...formData, responsiblePerson: value });
              if (!isReadOnly && value) {
                dispatch(fetchUserAvailability({ token, id: value }));
              }
            }}
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
          <label className="block ms-2">Priority <span className="text-red-600">*</span></label>
          <SelectBox
            options={[
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
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
          availabilityData={userAvailability}
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
          availabilityData={userAvailability}
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

const Tasks = ({ isEdit, onCloseModal }) => {
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
  const [isDelete, setIsDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalWorkingHours, setTotalWorkingHours] = useState(0);
  const [formData, setFormData] = useState({
    project: id,
    milestone: mid,
    taskTitle: "",
    description: "",
    responsiblePerson: "",
    department: "",
    priority: "",
    duration: 0,
    expected_start_date: null,
    target_date: null,
    observer: [],
    tags: [],
  });

  useEffect(() => {
    setFormData({
      ...formData,
      duration: Math.round(totalWorkingHours)
    })
  }, [totalWorkingHours])

  const [prevTags, setPrevTags] = useState([]);
  const [prevObservers, setPrevObservers] = useState([]);

  const calculateDuration = (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return "";

    const shiftStartHour = 9;
    const shiftEndHour = 17;
    const shiftMinutesPerDay = (shiftEndHour - shiftStartHour) * 60;

    const start = new Date(`${startDateStr}T${shiftStartHour.toString().padStart(2, "0")}:00:00`);
    const end = new Date(`${endDateStr}T${shiftEndHour.toString().padStart(2, "0")}:00:00`);

    if (end <= start) {
      setTotalWorkingHours(0); // Expired → 0 hours
      return "Expired";
    }

    let totalMinutes = 0;
    let current = new Date(start);

    while (current <= end) {
      const currentDay = new Date(current);
      currentDay.setHours(0, 0, 0, 0);

      const shiftStart = new Date(currentDay);
      shiftStart.setHours(shiftStartHour, 0, 0, 0);

      const shiftEnd = new Date(currentDay);
      shiftEnd.setHours(shiftEndHour, 0, 0, 0);

      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      if (!isWeekend) {
        // If it's within the date range and not a weekend, count full day
        const isSameDay = current.toDateString() === end.toDateString();
        const to = isSameDay && end < shiftEnd ? end : shiftEnd;

        // Always count full shift minutes if date is valid
        if (shiftStart <= to) {
          const diff = Math.floor((to - shiftStart) / 60000);
          totalMinutes += Math.min(diff, shiftMinutesPerDay);
        }
      }

      // Move to next day
      current.setDate(current.getDate() + 1);
      current.setHours(shiftStartHour, 0, 0, 0);
    }

    const totalHours = +(totalMinutes / 60).toFixed(2);
    setTotalWorkingHours(totalHours);

    const days = Math.floor(totalMinutes / shiftMinutesPerDay);
    const remainingMinutes = totalMinutes % shiftMinutesPerDay;
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    return `${days}d : ${hours}h : ${minutes}m`;
  };


  useEffect(() => {
    dispatch(fetchUsers({ token }));
    dispatch(fetchTags({ token }));
    dispatch(fetchProjectDetails({ token, id }));
    dispatch(fetchMilestoneById({ token, id: mid }));
  }, [dispatch, id, mid, token]);

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
  }, [isEdit, task, id, mid, getTagName]);

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
    estimated_hour: data.duration
  });

  const isFormEmpty = () => {
    return (
      !formData.taskTitle &&
      !formData.responsiblePerson &&
      !formData.priority &&
      !formData.expected_start_date &&
      !formData.target_date &&
      formData.observer.length === 0 &&
      formData.tags.length === 0
    );
  };

  const handleCancel = () => {
    if (savedTasks.length === 0) {
      if (onCloseModal) {
        onCloseModal();
      } else {
        console.log("Modal closed (onCloseModal not provided)");
      }
    } else {
      window.location.reload();
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (isDelete) {
      setIsDelete(false);
      return;
    }

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

    setIsSubmitting(true)

    const duration = calculateDuration(formData.expected_start_date, formData.target_date);
    if (duration.startsWith("Invalid")) {
      toast.dismiss();
      toast.error("End date cannot be before start date.");
      return;
    }

    const payload = createTaskPayload(formData);

    try {
      await dispatch(createTask({ token, payload })).unwrap();
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
        duration: 0,
        expected_start_date: null,
        target_date: null,
        observer: [],
        tags: [],
      });
      setPrevTags([]);
      setPrevObservers([]);
      setIsDelete(false);
      setNextId(nextId + 1);
      dispatch(fetchTasks({ token, id: mid ? mid : "" }));
    } catch (error) {
      console.errorovate("Error creating task:", error);
      toast.dismiss();
      toast.error("Error creating task.");
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleSubmit = async (e, editId) => {
    e.preventDefault();

    if (isDelete && isFormEmpty()) {
      window.location.reload();
      return;
    }

    if (
      !isDelete &&
      (!formData.taskTitle ||
        !formData.responsiblePerson ||
        !formData.priority ||
        !formData.expected_start_date ||
        !formData.target_date ||
        !formData.observer.length ||
        !formData.tags.length)
    ) {
      toast.dismiss();
      toast.error("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    const duration = calculateDuration(formData.expected_start_date, formData.target_date);
    if (duration.startsWith("Invalid")) {
      toast.dismiss();
      toast.error("End date cannot be before start date.");
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
        // window.location.reload();
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
            setFormData={() => { }}
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
            calculateDuration={calculateDuration}
            hasSavedTasks={savedTasks.length > 0}
            setIsDelete={setIsDelete}
          />
        ))}

        {!isDelete && (
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
            calculateDuration={calculateDuration}
            hasSavedTasks={savedTasks.length > 0}
            setIsDelete={setIsDelete}
          />
        )}

        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10 text-[12px]">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-[100px]"
            disabled={isSubmitting}
          >
            {loading || editLoading
              ? "Processing..."
              : isEdit
                ? "Update"
                : "Create"}
          </button>

          {!isEdit &&
            (isFormEmpty() ? (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center border-2 text-gray-600 border-gray-400 px-4 py-2 w-max"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center justify-center border-2 text-[red] border-[red] px-4 py-2 w-max"
                onClick={handleAddTask}
                disabled={isSubmitting}
              >
                Save & Add New
              </button>
            ))}
        </div>
      </div>
    </form>
  );
};

export default Tasks;