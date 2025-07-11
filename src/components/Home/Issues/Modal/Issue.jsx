import { useEffect, useState, useCallback, useRef } from "react";
import SelectBox from "../../../SelectBox";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../../../redux/slices/userSlice";
import {
  createIssue,
  fetchIssue,
  fetchIssueType,
} from "../../../../redux/slices/IssueSlice";
import { fetchMilestone } from "../../../../redux/slices/milestoneSlice";
import { fetchProjects } from "../../../../redux/slices/projectSlice";
import { fetchTasks } from "../../../../redux/slices/taskSlice";
import toast from "react-hot-toast";

const globalPriorityOptions = [
  { value: 2, label: "Low" },
  { value: 3, label: "Medium" },
  { value: 4, label: "High" },
  { value: 5, label: "Urgent" },
];

const Attachments = ({ attachments, setAttachments }) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles?.length) return;

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    setAttachments([...attachments, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    const updatedAttachments = [...attachments];
    updatedAttachments.splice(index, 1);
    setAttachments(updatedAttachments);
  };

  const isImage = (file) => file.type.startsWith("image/");
  const getFileUrl = (file) => URL.createObjectURL(file);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center border h-[45px] px-3 rounded-md">
        <span className="text-[14px] text-gray-500">
          {files?.length === 0 && <i>No Documents Attached</i>}
        </span>
        <button
          type="button"
          className="bg-[#C72030] h-[30px] w-[100px] text-white text-sm rounded"
          onClick={handleAttachFile}
        >
          Attach Files
        </button>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {files?.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative w-[80px] h-[80px] border rounded-md"
            >
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full w-5 h-5 text-lg flex items-center justify-center shadow-lg"
                title="Remove"
              >
                ×
              </button>
              {isImage(file) ? (
                <img
                  src={getFileUrl(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-gray-800 px-2 py-1 h-full flex items-center justify-center bg-gray-100">
                  📄 {file.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Issues = ({ closeModal }) => {
  const [title, setTitle] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newIssuesProjectId, setNewIssuesProjectId] = useState("");
  const [newIssuesMilestoneId, setNewIssuesMilestoneId] = useState("");
  const [newIssuesTaskId, setNewIssuesTaskId] = useState("");
  // Add state for subtask ID and subtask options
  const [newIssuesSubtaskId, setNewIssuesSubtaskId] = useState("");
  const [subtaskOptions, setSubtaskOptions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const token = localStorage.getItem("token");
  const isSubmittingRef = useRef(false);

  const {
    fetchUsers: users,
    loading: loadingUsers
  } = useSelector(
    (state) => state.fetchUsers || { users: [], loading: false, error: null }
  );

  const {
    fetchProjects: projects,
    loading: loadingProjects,
    error: projectsFetchError,
  } = useSelector(
    (state) =>
      state.fetchProjects || { projects: [], loading: false, error: null }
  );

  const {
    fetchMilestone: milestone,
    loading: loadingMilestone,
    error: milestoneFetchError,
  } = useSelector(
    (state) =>
      state.fetchMilestone || { milestone: [], loading: false, error: null }
  );

  const {
    fetchTasks: tasks,
    loading: loadingTasks,
    error: tasksFetchError,
  } = useSelector(
    (state) => state.fetchTasks || { tasks: [], loading: false, error: null }
  );

  const [projectOptions, setProjectOptions] = useState([]);
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers({ token }));
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueType = await dispatch(fetchIssueType({ token })).unwrap();
        setIssueTypeOptions(
          issueType.map((i) => ({
            value: i.id,
            label: i.name,
          }))
        );
      } catch (error) {
        toast.error("Failed to load issue types.");
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (
      !loadingMilestone &&
      milestoneOptions?.length > 0 &&
      !milestoneFetchError
    ) {
      if (newIssuesMilestoneId)
        dispatch(fetchTasks({ id: newIssuesMilestoneId, token }));
      setNewIssuesTaskId("");
      setTaskOptions([]);
      // Clear subtask options and selection when milestone changes
      setNewIssuesSubtaskId("");
      setSubtaskOptions([]);
    }
  }, [
    dispatch,
    loadingMilestone,
    milestoneFetchError,
    newIssuesMilestoneId,
    milestoneOptions,
  ]);

  useEffect(() => {
    dispatch(fetchTasks({ id: "", token }));
  }, [dispatch]);

  useEffect(() => {
    if (!loadingTasks && !tasksFetchError && tasks?.length > 0) {
      setTaskOptions(
        tasks.map((t) => ({
          value: t.id,
          label: t.title,
        }))
      );
    }
  }, [tasks, loadingTasks, tasksFetchError]);

  // New effect to handle subtask options when task is selected
  useEffect(() => {
    if (newIssuesTaskId && tasks?.length > 0) {
      const selectedTask = tasks.find((t) => t.id === newIssuesTaskId);
      if (
        selectedTask &&
        selectedTask.sub_tasks_managements &&
        Array.isArray(selectedTask.sub_tasks_managements) &&
        selectedTask.sub_tasks_managements.length > 0
      ) {
        setSubtaskOptions(
          selectedTask.sub_tasks_managements.map((subtask) => ({
            value: subtask.id,
            label: subtask.title,
          }))
        );
      } else {
        setSubtaskOptions([]);
      }
      // Reset subtask selection when task changes
      setNewIssuesSubtaskId("");
    } else {
      setSubtaskOptions([]);
      setNewIssuesSubtaskId("");
    }
  }, [newIssuesTaskId, tasks]);

  useEffect(() => {
    if (
      newIssuesProjectId &&
      projectOptions?.length > 0 &&
      !loadingProjects &&
      !projectsFetchError
    ) {
      dispatch(fetchMilestone({ id: newIssuesProjectId, token })).unwrap();
      setNewIssuesMilestoneId("");
      setMilestoneOptions([]);
      setNewIssuesTaskId("");
      setTaskOptions([]);
      // Clear subtask options and selection when project changes
      setNewIssuesSubtaskId("");
      setSubtaskOptions([]);
    }
  }, [
    dispatch,
    newIssuesProjectId,
    projectOptions,
    loadingProjects,
    projectsFetchError,
  ]);

  useEffect(() => {
    if (
      !loadingProjects &&
      (!Array.isArray(projectOptions) || projectOptions?.length === 0)
    ) {
      dispatch(fetchProjects({ token })).unwrap();
      setProjectOptions(
        projects
          ? projects.map((project) => ({
            value: project.id,
            label: project.title,
          }))
          : []
      );
    }
  }, [dispatch, loadingProjects, projectOptions]);

  useEffect(() => {
    if (
      !loadingMilestone &&
      !milestoneFetchError &&
      milestone?.length > 0 &&
      Array.isArray(milestone)
    ) {
      setMilestoneOptions(
        milestone?.map((m) => ({
          value: m.id,
          label: m.title,
        }))
      );
    }
  }, [milestone, loadingMilestone, milestoneFetchError]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      toast.dismiss();
      if (isSubmittingRef.current) return;
      console.log(newIssuesProjectId);
      if (!newIssuesTaskId) {
        toast.error("Task is required");
        return;
      }
      if (!title.trim()) {
        toast.error("Title is required");
        return;
      }
      if (!responsiblePerson) {
        toast.error("Responsible Person is required");
        return;
      }
      if (!type) {
        toast.error("Issue Type is required");
        return;
      }
      if (!priority) {
        toast.error("Priority is required");
        return;
      }
      if (!endDate) {
        toast.error("End Date is required");
        return;
      }
      if (!comments.trim()) {
        toast.error("Comment is required");
        return;
      }

      setIsSubmitting(true);
      isSubmittingRef.current = true;
      const formData = new FormData();

      formData.append("issue[title]", title.trim());
      formData.append("issue[status]", "open");
      formData.append("issue[responsible_person_id]", responsiblePerson);
      formData.append("issue[project_management_id]", newIssuesProjectId || "");
      formData.append("issue[milestone_id]", newIssuesMilestoneId || "");
      formData.append(
        "issue[task_management_id]",
        newIssuesSubtaskId || newIssuesTaskId || ""
      );
      formData.append("issue[start_date]", startDate || "");
      formData.append("issue[end_date]", endDate || "");
      formData.append(
        "issue[priority]",
        globalPriorityOptions.find((option) => option.value === priority)
          ?.label || null
      );
      formData.append(
        "issue[created_by_id]",
        JSON.parse(localStorage.getItem("user"))?.id || ""
      );
      formData.append(
        "issue[issue_type]",
        type || null
      );
      formData.append("issue[comment]", comments || "");

      attachments.forEach((file) => {
        formData.append("issue[attachments][]", file);
      });

      try {
        await dispatch(createIssue({ token, payload: formData })).unwrap();
        dispatch(fetchIssue({ token }));
        closeModal();
        toast.success("Issue created successfully!");
      } catch (error) {
        console.error("Error submitting Issue:", error);
        toast.error(
          `Issue creation failed: ${error.message || "Unknown error"}`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      dispatch,
      title,
      responsiblePerson,
      endDate,
      startDate,
      priority,
      comments,
      type,
      newIssuesProjectId,
      newIssuesMilestoneId,
      newIssuesTaskId,
      newIssuesSubtaskId, // Added to dependencies
      attachments,
      closeModal,
    ]
  );

  return (
    <form className="pt-2 pb-12 h-full overflow-y-auto" onSubmit={handleSubmit}>
      <div
        id="addTask"
        className="max-w-[90%] mx-auto h-[calc(100%-4rem)] overflow-y-auto pr-3 text-[12px]"
      >
        <div className="flex items-center justify-between gap-5">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">Project</label>
            <SelectBox
              options={projectOptions}
              value={newIssuesProjectId}
              onChange={(selectedValue) => setNewIssuesProjectId(selectedValue)}
              placeholder={"Select Project"}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">Milestone</label>
            <SelectBox
              options={milestoneOptions}
              value={newIssuesMilestoneId}
              onChange={(selectedValue) =>
                setNewIssuesMilestoneId(selectedValue)
              }
              placeholder={"Select Milestone"}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 mt-4">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Task <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={taskOptions}
              value={newIssuesTaskId}
              onChange={(selectedValue) => setNewIssuesTaskId(selectedValue)}
              placeholder={"Select Task"}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">Subtask</label>
            <SelectBox
              options={subtaskOptions} // Use subtaskOptions
              value={newIssuesSubtaskId}
              onChange={(selectedValue) => setNewIssuesSubtaskId(selectedValue)}
              placeholder={"Select Subtask"}
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="block">
            Title <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Issue Title"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
          />
        </div>
        <div className="flex items-start gap-4 mt-3">
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Responsible Person <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={
                users
                  ? users.map((user) => ({
                    value: user.id,
                    label: `${user.firstname || ""} ${user.lastname || ""}`.trim(),
                  }))
                  : []
              }
              value={responsiblePerson}
              onChange={(selectedValue) => setResponsiblePerson(selectedValue)}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Type <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={issueTypeOptions}
              value={type}
              onChange={(selectedValue) => setType(selectedValue)}
              placeholder={"Select Type"}
            />
          </div>
        </div>
        <div className="flex items-start gap-4 mt-4 text-[12px]">
          <div className="w-1/2 space-y-2">
            <label className="block">
              Start Date <span className="text-red-600">*</span>
            </label>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="w-1/2 space-y-2">
            <label className="block">
              End Date <span className="text-red-600">*</span>
            </label>
            <input
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              type="date"
              className="w-full border outline-none border-gray-300 p-2 text-[12px]"
              min={startDate}
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <label className="block mb-2">
              Priority <span className="text-red-600">*</span>
            </label>
            <SelectBox
              options={globalPriorityOptions}
              value={priority}
              onChange={(selectedValue) => setPriority(selectedValue)}
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label className="block">
            Comment <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Comment"
            className="w-full border h-[40px] outline-none border-gray-300 p-2 text-sm"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <div className="mt-4 space-y-2">
          <label>Attachments</label>
          <Attachments attachments={attachments} setAttachments={setAttachments} />
        </div>
        <div className="flex items-center justify-center gap-4 w-full bottom-0 py-3 bg-white mt-10">
          <button
            type="submit"
            className="flex items-center justify-center border-2 text-[black] border-[red] px-4 py-2 w-[100px]"
            disabled={isSubmitting || loadingUsers}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Issues;