import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useIsCloudRoute } from "../../../utils/navigationUtils";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";

// Custom Components
import StatusBadge from "../Projects/statusBadge";
import { ArrowPathIcon } from "@heroicons/react/20/solid";
import SelectBox from "../../SelectBox";
import qs from "qs";

// Redux Thunks
import { fetchUsers } from "../../../redux/slices/userSlice";
import {
  fetchIssue,
  createIssue,
  updateIssue,
  fetchIssueType,
  filterIssue,
} from "../../../redux/slices/IssueSlice";
import { fetchProjects } from "../../../redux/slices/projectSlice";
import { fetchMilestone } from "../../../redux/slices/milestoneSlice";
import { editTaskComment, fetchTasks } from "../../../redux/slices/taskSlice";

const NewIssuesTextField = ({
  value,
  onChange,
  onEnterPress,
  inputRef,
  placeholder,
  validator,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnterPress();
    }
  };

  const handleBlur = () => {
    onEnterPress();
  };
  return (
    <input
      ref={inputRef}
      type="text"
      onBlur={handleBlur}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={`${validator ? "border border-red-500" : "border-none"
        } w-full p-1 focus:outline-none rounded text-[12px]`}
      style={{ background: "none" }}
    />
  );
};

const NewIssuesDateEditor = ({
  value,
  onChange,
  onEnterPress,
  placeholder,
  validator,
  min,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnterPress();
    }
  };
  return (
    <input
      type="date"
      min={min}
      placeholder={placeholder}
      value={value || ""}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      className={`${validator ? "border border-red-500" : "border-none"
        } my-custom-date-editor w-full p-1 focus:outline-none rounded text-[13px]`}
    />
  );
};

const Attachments = ({
  attachments,
  setAttachments,
  fileInputRef,
  containerRef,
  setIsFileDialogOpen,
}) => {
  const handleAttachFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDialogOpen(true);
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) {
      setIsFileDialogOpen(false);
      return;
    }
    setAttachments(selectedFiles);
    setIsFileDialogOpen(false);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3 p-5">
      <div className="text-[14px] mt-2">
        {attachments.length > 0 ? (
          <span>{attachments.length}</span>
        ) : (
          <span
            onClick={handleAttachFile}
            type="button"
            className="block mb-2 cursor-pointer text-gray-400"
          >
            <i>Click to attach files</i>
          </span>
        )}
      </div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

// Constants
const globalPriorityOptions = ["None", "Low", "Medium", "High", "Urgent"];
const globalStatusOptions = ["open", "in_progress", "completed", "on_hold"];
const globalTypesOptions = ["bug", "task", "feature", "UI", "UX"];

const IssuesTable = () => {
  const { id: parentId } = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const isCloudRoute = useIsCloudRoute();

  const {
    fetchIssue: allIssuesFromStore,
    pagination: { current_page, total_pages, total_count },
    loading: loadingAllIssues,
    error: allIssuesError,
  } = useSelector((state) => state.fetchIssues);

  const {
    filterIssue: filteredIssues,
    pagination: filterPagination,
    loading: loadingFilteredIssues,
    error: filteredIssuesError,
    success: filterSuccess,
  } = useSelector((state) => state.filterIssue || {
    filterIssue: [],
    pagination: { current_page: 1, total_pages: 1, total_count: 0 },
    loading: false,
    error: null,
    success: false,
  });

  const {
    fetchUsers: users,
    loading: loadingUsers,
    error: usersFetchError,
  } = useSelector(
    (state) =>
      state.fetchUsers || { fetchUsers: [], loading: false, error: null }
  );

  const {
    fetchProjects: projects,
    loading: loadingProjects,
    error: projectsFetchError,
  } = useSelector(
    (state) =>
      state.fetchProjects || { fetchProjects: [], loading: false, error: null }
  );

  const {
    fetchMilestone: milestone,
    loading: loadingMilestone,
    error: milestoneFetchError,
  } = useSelector(
    (state) =>
      state.fetchMilestone || {
        fetchMilestone: [],
        loading: false,
        error: null,
      }
  );

  const {
    fetchTasks: tasks,
    loading: loadingTasks,
    error: tasksFetchError,
  } = useSelector(
    (state) =>
      state.fetchTasks || { fetchTasks: [], loading: false, error: null }
  );

  const { fetchIssueType: issueType, loading: loadingIssueType, error: issueTypeFetchError, } = useSelector((state) => state.fetchIssueType);

  const { fetchProjectDetails: projectDetails } = useSelector(
    (state) =>
      state.fetchProjectDetails || {
        fetchProjectDetails: {},
        loading: false,
        error: null,
      }
  );

  const [data, setData] = useState([]);
  const [isAddingNewIssues, setIsAddingNewIssues] = useState(false);
  const [newIssuesTitle, setNewIssuesTitle] = useState("");
  const [newIssuesStatus, setNewIssuesStatus] = useState("open");
  const [newIssuesResponsiblePersonId, setNewIssuesResponsiblePersonId] =
    useState(null);
  const [newIssuesType, setNewIssuesType] = useState("");
  const [newIssuesStartDate, setNewIssuesStartDate] = useState("");
  const [newIssuesEndDate, setNewIssuesEndDate] = useState("");
  const [newIssuesPriority, setNewIssuesPriority] = useState("None");
  const [newIssuesComments, setNewIssuesComments] = useState("");
  const [newIssuesProjectId, setNewIssuesProjectId] = useState(null);
  const [newIssuesMilestoneId, setNewIssuesMilestoneId] = useState(null);
  const [newIssuesTaskId, setNewIssuesTaskId] = useState(null);
  const [newIssuesSubtaskId, setNewIssuesSubtaskId] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const [milestoneOptions, setMilestoneOptions] = useState([]);
  const [taskOptions, setTaskOptions] = useState([]);
  const [subtaskOptions, setSubtaskOptions] = useState([]);
  const [issueTypeOptions, setIssueTypeOptions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [isSavingIssues, setIsSavingIssues] = useState(false);
  const [isUpdatingIssue, setIsUpdatingIssue] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const [validator, setValidator] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: current_page - 1, // Convert to 0-based index for TanStack Table
    pageSize: 10, // Matches per_page in API call
  });

  const newIssuesTitleInputRef = useRef(null);
  const newIssueFormRowRef = useRef(null);
  const newIssueAttachmentInputRef = useRef(null);
  const newIssueAttachmentContainerRef = useRef(null);
  const userFetchInitiatedRef = useRef(false);
  const allIssuesFetchInitiatedRef = useRef(false);
  const issueTypeFetchInitiatedRef = useRef(false);
  const projectsFetchInitiatedRef = useRef(false);

  // Fetch issue types
  useEffect(() => {
    if (
      !loadingIssueType &&
      issueType?.length === 0 &&
      !issueTypeFetchError &&
      !issueTypeFetchInitiatedRef.current
    ) {
      dispatch(fetchIssueType({ token }));
      issueTypeFetchInitiatedRef.current = true;
    }
  }, [dispatch, loadingIssueType, issueType, issueTypeFetchError, token]);

  console.log(issueType)

  // Set issue type options
  // useEffect(() => {
  //   if (!loadingIssueType && issueType?.length > 0 && !issueTypeFetchError) {
  //     setIssueTypeOptions(issueType.map((i) => i.name));
  //   }
  // }, [issueType, loadingIssueType, issueTypeFetchError]);

  // Fetch issues
  useEffect(() => {
    if (
      !loadingAllIssues &&
      (!allIssuesFromStore ||
        !Array.isArray(allIssuesFromStore) ||
        allIssuesFromStore.length === 0) &&
      !allIssuesError &&
      !allIssuesFetchInitiatedRef.current
    ) {
      dispatch(
        fetchIssue({
          token,
          page: pagination.pageIndex + 1, // Convert to 1-based index for API
          per_page: pagination.pageSize,
        })
      );
      allIssuesFetchInitiatedRef.current = true;
    }
  }, [
    dispatch,
    allIssuesFromStore,
    loadingAllIssues,
    allIssuesError,
    token,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: current_page - 1, // Convert to 0-based index
    }));
  }, [current_page]);

  // Fetch tasks
  useEffect(() => {
    if (!loadingTasks && !tasksFetchError) {
      if (newIssuesMilestoneId) {
        dispatch(fetchTasks({ id: newIssuesMilestoneId, token }));
      } else if (!newIssuesProjectId && !newIssuesMilestoneId) {
        // Fetch all tasks when no project or milestone is selected
        dispatch(fetchTasks({ id: "", token }));
      }
      setNewIssuesTaskId(null);
      setTaskOptions([]);
      setNewIssuesSubtaskId(null);
      setSubtaskOptions([]);
    }
  }, [
    dispatch,
    newIssuesMilestoneId,
    newIssuesProjectId,
    token,
  ]);

  // Set task options
  useEffect(() => {
    if (!loadingTasks && !tasksFetchError && tasks.length > 0) {
      setTaskOptions(
        tasks.map((t) => ({
          value: t.id,
          label: t.title,
        }))
      );
    }
  }, [tasks, loadingTasks, tasksFetchError]);

  // Set subtask options
  useEffect(() => {
    if (newIssuesTaskId && tasks.length > 0) {
      const selectedTask = tasks.find((t) => t.id === newIssuesTaskId);
      if (selectedTask && Array.isArray(selectedTask.sub_tasks_managements)) {
        setSubtaskOptions(
          selectedTask.sub_tasks_managements.map((st) => ({
            value: st.id,
            label: st.title,
          }))
        );
      } else {
        setSubtaskOptions([]);
      }
    } else {
      setSubtaskOptions([]);
    }
  }, [newIssuesTaskId, tasks]);

  // Fetch milestones when project changes
  useEffect(() => {
    if (newIssuesProjectId && !loadingProjects && !projectsFetchError) {
      dispatch(fetchMilestone({ id: newIssuesProjectId, token }));
      setNewIssuesMilestoneId(null);
      setMilestoneOptions([]);
      setNewIssuesTaskId(null);
      setTaskOptions([]);
      setNewIssuesSubtaskId(null);
      setSubtaskOptions([]);
    }
  }, [
    dispatch,
    newIssuesProjectId,
    loadingProjects,
    projectsFetchError,
    token,
  ]);

  useEffect(() => {
    if (
      Array.isArray(milestone) &&
      milestone.length > 0 &&
      !loadingMilestone &&
      !milestoneFetchError
    ) {
      setMilestoneOptions(
        milestone.map((m) => ({
          value: m.id,
          label: m.title,
        }))
      );
    }
  }, [milestone, loadingMilestone, milestoneFetchError]);

  // Fetch users
  useEffect(() => {
    if (
      !loadingUsers &&
      (!Array.isArray(users) || users.length === 0) &&
      !usersFetchError &&
      !userFetchInitiatedRef.current
    ) {
      dispatch(fetchUsers({ token }));
      userFetchInitiatedRef.current = true;
    }
  }, [dispatch, users, loadingUsers, usersFetchError, token]);

  // Fetch projects or set project ID
  useEffect(() => {
    const run = async () => {
      try {
        if (parentId !== null && parentId !== undefined) {
          setNewIssuesProjectId(parentId);
        } else if (
          !loadingProjects &&
          projectOptions.length === 0 &&
          !projectsFetchInitiatedRef.current
        ) {
          projectsFetchInitiatedRef.current = true;
          await dispatch(fetchProjects({ token }));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    run();
  }, [dispatch, loadingProjects, parentId, projectOptions, token]);

  // Set project options
  useEffect(() => {
    if (loadingProjects) return; // wait for loading to finish

    if (projectsFetchError) {
      console.error("Failed to fetch projects:", projectsFetchError);
      setProjectOptions([]); // reset or show fallback
      return;
    }

    if (projects && Array.isArray(projects) && projects.length > 0) {
      try {
        const options = projects.map((project) => {
          if (!project?.id || !project?.title) {
            throw new Error("Invalid project data structure.");
          }
          return {
            value: project.id,
            label: project.title,
          };
        });

        setProjectOptions(options);
      } catch (err) {
        console.error("Error while mapping project options:", err);
        setProjectOptions([]); // fallback to empty
      }
    } else {
      setProjectOptions([]); // no projects case
    }
  }, [projects, loadingProjects, projectsFetchError]);

  // Process issues data
  useEffect(() => {
    let allIssues;
    if (parentId !== null && parentId !== undefined) {
      allIssues = allIssuesFromStore.filter(
        (issue) => issue.project_management_id == parentId
      );
    } else if (
      filterSuccess &&
      filteredIssues &&
      (localStorage.getItem("IssueFilters") ||
        localStorage.getItem("issueStatus"))
    ) {
      allIssues = filteredIssues;
    } else {
      allIssues = allIssuesFromStore;
    }

    if (allIssues && Array.isArray(allIssues)) {
      const processedIssues = allIssues.map((issue) => ({
        id: issue.id,
        issueTitle: issue.title || "Unnamed Issues",
        status: issue.status || "open",
        responsiblePerson: issue.responsible_person?.name || "Unassigned",
        responsiblePersonId: issue.responsible_person?.id || null,
        issueType: Number(issue.issue_type),
        startDate: issue.start_date
          ? new Date(issue.start_date).toLocaleDateString("en-CA")
          : null,
        endDate: issue.end_date
          ? new Date(issue.end_date).toLocaleDateString("en-CA")
          : null,
        priority: issue.priority || "None",
        projectName: issue.project_management_name || "",
        milestoneName: issue.milstone_name || "",
        taskName: issue.task_management_name || "",
        subtaskName: issue.sub_task_management_name || "",
        comments: issue.comments?.length
          ? issue.comments[issue.comments.length - 1].body
          : "",
        commentId: issue.comments?.length
          ? issue.comments[issue.comments.length - 1].id
          : null,
        attachments: issue.attachments || [],
      }));
      setData(processedIssues);
      setLocalError(null);
    } else if (allIssuesError) {
      setLocalError("Failed to load issues.");
      setData([]);
    }
  }, [
    allIssuesFromStore,
    allIssuesError,
    parentId,
    filteredIssues,
    filterSuccess,
  ]);

  // Focus new issue title input
  useEffect(() => {
    if (isAddingNewIssues && newIssuesTitleInputRef.current) {
      newIssuesTitleInputRef.current.focus();
    }
  }, [isAddingNewIssues]);

  const resetNewIssuesForm = useCallback(() => {
    setNewIssuesTitle("");
    setNewIssuesStatus("open");
    setNewIssuesResponsiblePersonId(null);
    setNewIssuesType("");
    setNewIssuesStartDate("");
    setNewIssuesEndDate("");
    setNewIssuesPriority("None");
    setAttachments([]);
    setNewIssuesComments("");
    setLocalError(null);
    setNewIssuesProjectId(null);
    setNewIssuesMilestoneId(null);
    setNewIssuesTaskId(null);
    setNewIssuesSubtaskId(null);
    setValidator(false);
  }, []);

  const handleShowNewIssuesForm = useCallback(() => {
    resetNewIssuesForm();
    setIsAddingNewIssues(true);
  }, [resetNewIssuesForm]);

  const handleCancelNewIssues = useCallback(() => {
    setIsAddingNewIssues(false);
    resetNewIssuesForm();
  }, [resetNewIssuesForm]);

  const handleSaveNewIssues = useCallback(async () => {
    if (
      !newIssuesTitle ||
      newIssuesTitle.trim() === "" ||
      !newIssuesEndDate ||
      !newIssuesTaskId
    ) {
      setLocalError("Please fill in all required fields.");
      setValidator(true);
      return;
    }
    setLocalError(null);
    setIsSavingIssues(true);
    setValidator(false);
    const formData = new FormData();

    formData.append("issue[title]", newIssuesTitle.trim());
    formData.append("issue[status]", newIssuesStatus);
    formData.append(
      "issue[responsible_person_id]",
      newIssuesResponsiblePersonId || ""
    );
    formData.append(
      "issue[project_management_id]",
      parentId || newIssuesProjectId || ""
    );
    formData.append("issue[milestone_id]", newIssuesMilestoneId || "");
    formData.append("issue[task_management_id]", newIssuesTaskId || "");
    formData.append("issue[subtask_management_id]", newIssuesSubtaskId || "");
    formData.append("issue[start_date]", newIssuesStartDate || "");
    formData.append("issue[end_date]", newIssuesEndDate || "");
    formData.append("issue[priority]", newIssuesPriority);
    formData.append(
      "issue[created_by_id]",
      JSON.parse(localStorage.getItem("user"))?.id || ""
    );
    formData.append("issue[issue_type]", newIssuesType);
    formData.append("issue[comment]", newIssuesComments);

    attachments.forEach((file) => {
      formData.append("issue[attachments][]", file);
    });

    try {
      await dispatch(createIssue({ token, payload: formData })).unwrap();
      dispatch(
        fetchIssue({
          token,
          page: pagination.pageIndex + 1,
          per_page: pagination.pageSize,
        })
      );
      setIsAddingNewIssues(false);
      resetNewIssuesForm();
    } catch (error) {
      console.error("Failed to create Issues:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : "Failed to save Issues.");
      setLocalError(errorMessage);
    } finally {
      setIsSavingIssues(false);
    }
  }, [
    dispatch,
    parentId,
    resetNewIssuesForm,
    newIssuesTitle,
    newIssuesStatus,
    newIssuesResponsiblePersonId,
    newIssuesType,
    newIssuesStartDate,
    newIssuesEndDate,
    newIssuesPriority,
    newIssuesComments,
    newIssuesProjectId,
    newIssuesMilestoneId,
    newIssuesTaskId,
    newIssuesSubtaskId,
    attachments,
    token,
    pagination.pageIndex,
    pagination.pageSize,
  ]);

  const handleDeleteExistingIssues = useCallback((IssuesId) => {
    alert(
      `API for deleting existing Issues ${IssuesId} needs to be implemented.`
    );
  }, []);

  const handleUpdateIssues = useCallback(
    async (id, field, newValue) => {
      if (isUpdatingIssue) return;
      setIsUpdatingIssue(true);
      setLocalError(null);

      try {
        const payload = { [field]: newValue };
        if (field === "responsiblePersonId") {
          delete payload.responsiblePersonId;
          payload.responsible_person_id = newValue;
        }
        await dispatch(updateIssue({ token, id, payload })).unwrap();
        if (localStorage.getItem("IssueFilters")) {
          const item = JSON.parse(localStorage.getItem("IssueFilters"));
          const newFilter = {
            "q[status_in][]":
              item.selectedStatuses.length > 0 ? item.selectedStatuses : [],
            "q[created_by_id_eq]":
              item.selectedCreators.length > 0 ? item.selectedCreators : [],
            "q[start_date_eq]": item.dates["Start Date"],
            "q[end_date_eq]": item.dates["End Date"],
            "q[responsible_person_id_in][]":
              item.selectedResponsible.length > 0
                ? item.selectedResponsible
                : [],
            "q[issue_type_in][]":
              item.selectedTypes.length > 0 ? item.selectedTypes : [],
            "q[project_management_id_in][]":
              item.selectedProjects.length > 0 ? item.selectedProjects : [],
            "q[task_management_id_in][]":
              item.selectedTasks.length > 0 ? item.selectedTasks : [],
            "q[subtask_management_id_in][]":
              item.selectedSubtasks?.length > 0 ? item.selectedSubtasks : [],
          };
          const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
          await dispatch(
            filterIssue({
              token,
              filter: queryString,
              page: pagination.pageIndex + 1,
              per_page: pagination.pageSize,
            })
          ).unwrap();
        } else if (localStorage.getItem("issueStatus")) {
          const status = localStorage.getItem("issueStatus");
          const filter = { "q[status_eq]": status };
          await dispatch(
            filterIssue({
              token,
              filter,
              page: pagination.pageIndex + 1,
              per_page: pagination.pageSize,
            })
          ).unwrap();
        } else {
          await dispatch(
            fetchIssue({
              token,
              page: pagination.pageIndex + 1,
              per_page: pagination.pageSize,
            })
          ).unwrap();
        }
      } catch (error) {
        console.error("Failed to update issue:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update issue.";
        setLocalError(errorMessage);
        dispatch(
          fetchIssue({
            token,
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
          })
        );
      } finally {
        setIsUpdatingIssue(false);
      }
    },
    [dispatch, token, pagination.pageIndex, pagination.pageSize]
  );

  const handleUpdateComment = useCallback(
    async (issueId, commentId, newComment) => {
      if (isUpdatingIssue) return;
      setIsUpdatingIssue(true);
      setLocalError(null);

      try {
        if (commentId) {
          const sendComment = new FormData();
          sendComment.append("comment[body]", newComment);
          await dispatch(
            editTaskComment({
              token,
              id: commentId,
              payload: sendComment,
            })
          ).unwrap();
        } else {
          await dispatch(
            createIssue({
              token,
              payload: { issue: { id: issueId, comment: newComment } },
            })
          ).unwrap();
        }
        if (localStorage.getItem("IssueFilters")) {
          const item = JSON.parse(localStorage.getItem("IssueFilters"));
          const newFilter = {
            "q[status_in][]":
              item.selectedStatuses.length > 0 ? item.selectedStatuses : [],
            "q[created_by_id_eq]":
              item.selectedCreators.length > 0 ? item.selectedCreators : [],
            "q[start_date_eq]": item.dates["Start Date"],
            "q[end_date_eq]": item.dates["End Date"],
            "q[responsible_person_id_in][]":
              item.selectedResponsible.length > 0
                ? item.selectedResponsible
                : [],
            "q[issue_type_in][]":
              item.selectedTypes.length > 0 ? item.selectedTypes : [],
            "q[project_management_id_in][]":
              item.selectedProjects.length > 0 ? item.selectedProjects : [],
            "q[task_management_id_in][]":
              item.selectedTasks.length > 0 ? item.selectedTasks : [],
            "q[subtask_management_id_in][]":
              item.selectedSubtasks?.length > 0 ? item.selectedSubtasks : [],
          };
          const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
          await dispatch(
            filterIssue({
              token,
              filter: queryString,
              page: pagination.pageIndex + 1,
              per_page: pagination.pageSize,
            })
          ).unwrap();
        } else if (localStorage.getItem("issueStatus")) {
          const status = localStorage.getItem("issueStatus");
          const filter = { "q[status_eq]": status };
          await dispatch(
            filterIssue({
              token,
              filter,
              page: pagination.pageIndex + 1,
              per_page: pagination.pageSize,
            })
          ).unwrap();
        } else {
          await dispatch(
            fetchIssue({
              token,
              page: pagination.pageIndex + 1,
              per_page: pagination.pageSize,
            })
          ).unwrap();
        }
      } catch (error) {
        console.error("Failed to update comment:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update comment.";
        setLocalError(errorMessage);
        dispatch(
          fetchIssue({
            token,
            page: pagination.pageIndex + 1,
            per_page: pagination.pageSize,
          })
        );
      } finally {
        setIsUpdatingIssue(false);
      }
    },
    [dispatch, token, pagination.pageIndex, pagination.pageSize]
  );

  // Clear filters on unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("IssueFilters");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle click outside new issue form
  useEffect(() => {
    const handleClickOutsideNewIssuesRow = (event) => {
      if (
        !isAddingNewIssues ||
        isSavingIssues ||
        isUpdatingIssue ||
        !newIssueFormRowRef.current ||
        isFileDialogOpen ||
        newIssueFormRowRef.current.contains(event.target) ||
        (newIssueAttachmentContainerRef.current &&
          newIssueAttachmentContainerRef.current.contains(event.target))
      ) {
        return;
      }
      handleSaveNewIssues();
    };

    if (isAddingNewIssues) {
      document.addEventListener("mousedown", handleClickOutsideNewIssuesRow);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNewIssuesRow);
    };
  }, [
    isAddingNewIssues,
    isSavingIssues,
    isUpdatingIssue,
    isFileDialogOpen,
    handleSaveNewIssues,
  ]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (!isAddingNewIssues) return;
      if (event.key === "Escape") {
        handleCancelNewIssues();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAddingNewIssues, handleCancelNewIssues]);

  const userOptionsForSelectBox = useMemo(
    () => [
      { value: null, label: "Unassigned" },
      ...(Array.isArray(users)
        ? users.map((u) => ({
          value: u.id,
          label: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
        }))
        : []),
    ],
    [users]
  );

  const fixedRowsPerPage = 10;
  const rowHeight = 45;
  const headerHeight = 42;
  const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Issue ID",
        size: 80,
        cell: ({ getValue }) => {
          const issueId = getValue();
          const issuePath = isCloudRoute ? `/cloud-issues/${issueId}` : `/issues/${issueId}`;
          return (
            <Link
              to={issuePath}
              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >{`I-${issueId?.toString().slice(-5)}`}</Link>
          );
        },
      },
      {
        accessorKey: "projectName",
        header: "Project Name",
        size: 150,
        cell: ({ getValue }) => getValue() || "Not selected",
      },
      {
        accessorKey: "milestoneName",
        header: "Milestone Name",
        size: 150,
        cell: ({ getValue }) => getValue() || "Not selected",
      },
      {
        accessorKey: "taskName",
        header: "Task Name",
        size: 150,
        cell: ({ getValue }) => getValue() || "Not selected",
      },
      {
        accessorKey: "subtaskName",
        header: "Subtask Name",
        size: 150,
        cell: ({ getValue }) => getValue() || "Not selected",
      },
      {
        accessorKey: "issueTitle",
        header: "Issues Title",
        size: 120,
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "attachments",
        header: "Attachments",
        size: 120,
        cell: ({ getValue }) => (
          <div className="flex justify-center items-center w-full h-full">
            <span>{getValue().length}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.status}
            statusOptions={globalStatusOptions}
            onStatusChange={(newStatus) =>
              handleUpdateIssues(row.original.id, "status", newStatus)
            }
          />
        ),
      },
      {
        accessorKey: "responsiblePerson",
        header: "Responsible Person",
        size: 150,
        cell: ({ row }) => (
          <SelectBox
            table={true}
            options={userOptionsForSelectBox}
            value={row.original.responsiblePersonId}
            onChange={(selectedOptionValue) =>
              handleUpdateIssues(
                row.original.id,
                "responsible_person_id",
                selectedOptionValue
              )
            }
            className="w-full"
          />
        ),
      },
      {
        accessorKey: "issueType",
        header: "Type",
        size: 150,
        cell: ({ row }) => (
          <SelectBox
            options={
              issueType.map((i) => ({
                value: i.id,
                label: i.name,
              }))
            }
            value={row.original.issueType}
            onChange={(selectedOptionValue) =>
              handleUpdateIssues(
                row.original.id,
                "issue_type_id",
                selectedOptionValue
              )
            }
            className="w-full"
            table={true}
          />
        ),
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        size: 100,
        cell: ({ row }) => (
          <NewIssuesDateEditor
            value={row.original.startDate || ""}
            onChange={(e) =>
              handleUpdateIssues(
                row.original.id,
                "start_date",
                e.target.value || null
              )
            }
            placeholder="Start Date"
          />
        ),
      },
      {
        accessorKey: "endDate",
        header: "End Date",
        size: 100,
        cell: ({ row }) => (
          <NewIssuesDateEditor
            value={row.original.endDate || ""}
            onChange={(e) =>
              handleUpdateIssues(
                row.original.id,
                "end_date",
                e.target.value || null
              )
            }
            placeholder="End Date"
            min={row.original.startDate}
          />
        ),
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 100,
        cell: ({ row }) => (
          <StatusBadge
            status={row.original.priority}
            statusOptions={globalPriorityOptions}
            onStatusChange={(newStatus) =>
              handleUpdateIssues(row.original.id, "priority", newStatus)
            }
          />
        ),
      },
      {
        accessorKey: "comments",
        header: "Comments",
        size: 360,
        cell: ({ row, getValue }) => {
          const [editField, setEditField] = useState(getValue() || "");
          return (
            <NewIssuesTextField
              value={editField}
              onChange={(e) => setEditField(e.target.value)}
              onEnterPress={() =>
                handleUpdateComment(
                  row.original.id,
                  row.original.commentId,
                  editField
                )
              }
              placeholder="Comments"
              validator={false}
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        cell: ({ row }) => {
          const issueId = row.original.id;
          const issuePath = isCloudRoute ? `/cloud-issues/${issueId}` : `/issues/${issueId}`;
          
          return (
            <div className="flex gap-2 items-center">
              <Link
                to={issuePath}
                className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50"
              >
                View
              </Link>
              <Link
                to={`${issuePath}?edit=true`}
                className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-600 rounded hover:bg-green-50"
              >
                Edit
              </Link>
            </div>
          );
        },
      },
    ],
    [handleUpdateIssues, handleUpdateComment, userOptionsForSelectBox, issueType]
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: (updater) => {
      setPagination((prev) => {
        const newState = typeof updater === "function" ? updater(prev) : updater;
        // Dispatch fetchIssue with new page
        dispatch(
          fetchIssue({
            token,
            page: newState.pageIndex + 1, // Convert to 1-based index
            per_page: newState.pageSize,
          })
        );
        return newState;
      });
    },
    getCoreRowModel: getCoreRowModel(),
    pageCount: filterSuccess ? filterPagination.total_pages : total_pages, // Use filter pagination if filters are applied
    manualPagination: true, // Enable manual pagination
  });

  let pageContent;
  if (
    loadingAllIssues ||
    (loadingUsers && !userFetchInitiatedRef.current) ||
    isSavingIssues ||
    isUpdatingIssue ||
    loadingFilteredIssues
  ) {
    pageContent = (
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" />
        Loading data...
      </div>
    );
  } else if (allIssuesError || usersFetchError) {
    pageContent = (
      <div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded">
        Error:{" "}
        {localError ||
          String(
            allIssuesError?.message ||
            allIssuesError ||
            usersFetchError?.message ||
            usersFetchError ||
            "Could not load required data."
          )}
      </div>
    );
  } else {
    pageContent = (
      <div className="p-3">
        {localError && (
          <div className="mb-4 px-3 text-red-700 text-sm">{localError}</div>
        )}
        <div
          className="project-table-container font-light mt-2"
          style={{ minHeight: "200px" }}
        >
          <div className="table-wrapper overflow-x-auto">
            <table className="w-full border text-sm bg-white overflow-y-auto">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{
                          width: header.getSize()
                            ? `${header.getSize()}px`
                            : undefined,
                          height: `${headerHeight}px`,
                        }}
                        className="border p-2 text-center text-gray-700 font-semibold sticky top-0"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {data.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">
                      <i>
                        {filterSuccess
                          ? "Try adjusting the filters."
                          : "No issues found"}
                      </i>
                    </td>
                  </tr>
                )}
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 even:bg-gray-100"
                    style={{ height: `${rowHeight}px` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`border p-1 align-middle ${cell.column.id === "actions"
                          ? "text-center"
                          : "text-left"
                          }`}
                      >
                        <div className="p-1 h-full flex items-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                {isAddingNewIssues && (
                  <tr
                    ref={newIssueFormRowRef}
                    style={{ height: `${rowHeight}px` }}
                  >
                    <td className="border p-1 text-xs text-gray-400 align-middle">
                      NEW
                    </td>
                    <td className="border p-1 text-xs text-gray-400 align-middle">
                      {parentId ? (
                        <span className="text-xs text-gray-600">
                          {projectDetails?.title}
                        </span>
                      ) : (
                        <SelectBox
                          options={projectOptions}
                          value={newIssuesProjectId}
                          onChange={(selected) =>
                            setNewIssuesProjectId(selected)
                          }
                          placeholder="Select Project"
                          table={true}
                        />
                      )}
                    </td>
                    <td className="border p-1 text-xs text-gray-400 align-middle">
                      <SelectBox
                        options={milestoneOptions}
                        value={newIssuesMilestoneId}
                        onChange={(selected) =>
                          setNewIssuesMilestoneId(selected)
                        }
                        placeholder="Select Milestone"
                        table={true}
                      />
                    </td>
                    <td className="border p-1 text-xs text-gray-400 align-middle">
                      <SelectBox
                        options={taskOptions}
                        value={newIssuesTaskId}
                        onChange={(selected) => setNewIssuesTaskId(selected)}
                        placeholder="Select Task"
                        table={true}
                        validator={validator}
                      />
                    </td>
                    <td className="border p-1 text-xs text-gray-400 align-middle">
                      <SelectBox
                        options={subtaskOptions}
                        value={newIssuesSubtaskId}
                        onChange={(selected) => setNewIssuesSubtaskId(selected)}
                        placeholder="Select Subtask"
                        table={true}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <NewIssuesTextField
                        inputRef={newIssuesTitleInputRef}
                        value={newIssuesTitle}
                        onChange={(e) => {
                          setNewIssuesTitle(e.target.value);
                          if (localError) setLocalError(null);
                        }}
                        onEnterPress={handleSaveNewIssues}
                        placeholder="Issues title"
                        validator={validator}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <Attachments
                        setAttachments={setAttachments}
                        attachments={attachments}
                        fileInputRef={newIssueAttachmentInputRef}
                        containerRef={newIssueAttachmentContainerRef}
                        setIsFileDialogOpen={setIsFileDialogOpen}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <StatusBadge
                        status={newIssuesStatus}
                        statusOptions={globalStatusOptions}
                        onStatusChange={setNewIssuesStatus}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <SelectBox
                        options={userOptionsForSelectBox}
                        value={newIssuesResponsiblePersonId}
                        onChange={setNewIssuesResponsiblePersonId}
                        placeholder="Select Person..."
                        table={true}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      {/* <StatusBadge
                        status={newIssuesType}
                        statusOptions={globalTypesOptions}
                        onStatusChange={setNewIssuesType}
                      /> */}
                      <SelectBox
                        options={
                          issueType.map(type => (
                            {
                              label: type.name,
                              value: type.id
                            }
                          ))
                        }
                        value={newIssuesType}
                        onChange={setNewIssuesType}
                        table={true}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <NewIssuesDateEditor
                        value={newIssuesStartDate}
                        onChange={(e) => setNewIssuesStartDate(e.target.value)}
                        onEnterPress={handleSaveNewIssues}
                        validator={validator}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <NewIssuesDateEditor
                        value={newIssuesEndDate}
                        onChange={(e) => setNewIssuesEndDate(e.target.value)}
                        onEnterPress={handleSaveNewIssues}
                        validator={validator}
                        min={newIssuesStartDate}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <StatusBadge
                        status={newIssuesPriority}
                        statusOptions={globalPriorityOptions}
                        onStatusChange={setNewIssuesPriority}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <NewIssuesTextField
                        value={newIssuesComments}
                        onChange={(e) => {
                          setNewIssuesComments(e.target.value);
                          if (localError) setLocalError(null);
                        }}
                        onEnterPress={handleSaveNewIssues}
                        placeholder="Comments"
                      />
                    </td>
                  </tr>
                )}
                {!isAddingNewIssues && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="border p-2 text-left text-[12px]"
                    >
                      <button
                        onClick={handleShowNewIssuesForm}
                        className="text-red-500 hover:underline text-sm py-1"
                        disabled={isSavingIssues || isUpdatingIssue}
                      >
                        + Add Issues
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {data.length > 0 && (
            <div className="flex items-center justify-start gap-4 w-full ml-3 text-[12px] my-4">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="text-blue-600 disabled:opacity-30"
              >
                {"<"}
              </button>
              {(() => {
                const { current_page: currPage, total_pages: totPages } = filterSuccess
                  ? filterPagination
                  : { current_page, total_pages };
                const visiblePages = 3;
                let start = Math.max(0, currPage - 1 - Math.floor(visiblePages / 2));
                let end = start + visiblePages;
                if (end > totPages) {
                  end = totPages;
                  start = Math.max(0, end - visiblePages);
                }
                return [...Array(end - start)].map((_, i) => {
                  const page = start + i;
                  const isActive = page === currPage - 1;
                  return (
                    <button
                      key={page}
                      onClick={() => table.setPageIndex(page)}
                      className={`px-3 py-1 ${isActive ? "bg-gray-200 font-semibold" : ""}`}
                    >
                      {page + 1}
                    </button>
                  );
                });
              })()}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="text-blue-600 disabled:opacity-30"
              >
                {">"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className="project-list-wrapper p-2">{pageContent}</div>;
};

export default IssuesTable;