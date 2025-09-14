import {
  useState,
  useEffect,
  useMemo,
  useRef,
  Fragment,
  useCallback,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getExpandedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import StatusBadge from "../Projects/statusBadge";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { Link, useParams } from "react-router-dom";
import "../../Home/Sprints/Table.css";
import { getTaskPaths, useIsCloudRoute } from "../../../utils/navigationUtils";

import {
  fetchTasks,
  createTask,
  changeTaskStatus,
  updateTask,
  filterTask,
  fetchMyTasks,
} from "../../../redux/slices/taskSlice";
import { fetchUsers } from "../../../redux/slices/userSlice";
import SelectBox from "../../SelectBox";
import Loader from "../../Loader";
import { useLocation } from "react-router-dom";
import qs from "qs";
import { fetchProjectTeamMembers } from "../../../redux/slices/projectSlice";

const globalPriorityOptions = ["None", "Low", "Medium", "High", "Urgent"];
const globalStatusOptions = [
  "open",
  "in_progress",
  "completed",
  "on_hold",
  "overdue",
];

const EditableTextField = ({
  value,
  onUpdate,
  inputRef,
  isNewRow,
  onEnterPress,
  validator,
  table,
}) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onUpdate(localValue);
      onEnterPress();
    }
  };
  const handleBlur = () => {
    onUpdate(localValue);
  };
  return (
    <input
      ref={inputRef}
      type="text"
      value={localValue || ""}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${validator ? " border border-red-600" : "border-none"
        } focus:outline-none w-full h-full p-1 rounded text-[12px] bg-transparent`}
    />
  );
};

const formatDate = (input) => {
  if (!input) return "";
  const d = new Date(input);
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
};

const DateEditor = ({
  value: propValue,
  onUpdate,
  isNewRow,
  onEnterPress,
  className,
  placeholder = "Select date",
  validator,
  min,
  max,
}) => {
  const [date, setDate] = useState(formatDate(propValue));
  const inputRef = useRef(null);

  useEffect(() => {
    setDate(formatDate(propValue));
  }, [propValue]);

  const performUpdate = (dateValue) => {
    onUpdate(dateValue || null);
  };

  const handleInputChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    performUpdate(newDate);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performUpdate(date);
      if (onEnterPress) {
        onEnterPress();
      }
    }
  };

  const handleBlur = () => {
    performUpdate(date);
  };

  const handleInputClick = () => {
    if (inputRef.current && typeof inputRef.current.showPicker === "function") {
      try {
        inputRef.current.showPicker();
      } catch (error) {
        console.error("Error showing picker:", error);
      }
    }
  };

  const isInvalid = typeof validator === "function" ? !validator(date) : false;

  return (
    <input
      ref={inputRef}
      type="date"
      value={date}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleInputClick}
      className={`${isInvalid ? "border border-red-400" : "border-none"
        } w-full focus:outline-none bg-transparent rounded text-[12px] p-1 ${className || ""}`}
      placeholder={placeholder}
      min={formatDate(min)}
      max={formatDate(max)}
    />
  );
};

const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) {
    return "0d:0h:0m";
  }
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

const processTaskData = (task) => {
  if (typeof task !== "object" || task === null) {
    console.warn("Invalid task data encountered in processTaskData:", task);
    return {
      id: `invalid-${Math.random()}`,
      taskTitle: "Invalid Task Data",
      status: "error",
      hasSubtasks: false,
      subRows: [],
      subRowsLoaded: true,
    };
  }

  const hasSubtasks =
    task.sub_tasks_managements && task.sub_tasks_managements.length > 0;
  let subRows = [];
  if (hasSubtasks) {
    subRows = task.sub_tasks_managements.map((subTask) =>
      processTaskData(subTask)
    );
  }

  return {
    id: task.id,
    taskTitle: task.title || task.name || "Unnamed Task",
    status: task.status,
    responsiblePerson: task.responsible_person?.name || "Unassigned",
    responsiblePersonId: task.responsible_person?.id || null,
    projectManagementId: task.project_management_id || 2,
    startDate: task.expected_start_date?.split("T")[0],
    endDate: task.target_date?.split("T")[0],
    priority: task.priority,
    duration: calculateDuration(task.expected_start_date, task.target_date),
    predecessor: task.predecessor_task.length || 0,
    successor: task.successor_task.length || 0,
    hasSubtasks: hasSubtasks,
    subRows: subRows,
    subRowsLoaded: true,
  };
};

const TaskTable = () => {
  const token = localStorage.getItem("token");
  const { id, mid } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const isCloudRoute = useIsCloudRoute();

  const {
    loading: loadingTasks,
    error: tasksError,
    fetchTasks: tasksFromStore,
  } = useSelector((state) => state.fetchTasks);

  const { fetchProjectTeamMembers: projectTeamMembers } = useSelector(state => state.fetchProjectTeamMembers)

  const {
    fetchMyTasks: myTasksFromStore,
    loading: loadingMyTasks,
    error: myTasksError,
    success: myTaskSuccess,
  } = useSelector((state) => state.fetchMyTasks);

  const {
    fetchUsers: users,
    loading: loadingUsers,
    error: usersFetchError,
  } = useSelector(
    (state) => state.fetchUsers || { users: [], loading: false, error: null }
  );

  const {
    filterTask: filterTasks,
    loading: loadingFilterTasks,
    error: filterTasksError,
    success: filterSuccess,
  } = useSelector((state) => state.filterTask);
  const { fetchMilestoneById: milestone } = useSelector(
    (state) => state.fetchMilestoneById
  );

  const userFetchInitiatedRef = useRef(false);

  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});

  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("open");
  const [newTaskResponsiblePersonId, setNewTaskResponsiblePersonId] =
    useState(null);
  const [newTaskStartDate, setNewTaskStartDate] = useState("");
  const [newTaskEndDate, setNewTaskEndDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("None");
  const [validator, setValidator] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const newTaskTitleInputRef = useRef(null);
  const newTaskFormRowRef = useRef(null);

  const [localError, setLocalError] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const MIN_DISPLAY_ROWS = 10;
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 40;

  const createNewTaskDefaults = useCallback(
    () => ({
      taskTitle: "",
      status: "open",
      responsiblePersonId: null,
      startDate: "",
      endDate: "",
      priority: "None",
    }),
    []
  );

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        await dispatch(fetchProjectTeamMembers({ token, id })).unwrap();
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };

    fetchMembers();
  }, [dispatch, token, id]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("taskFilters");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    filterSuccess ? setIsFiltered(true) : setIsFiltered(false);
  }, [filterSuccess, filterTasks]);

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!isCreatingTask && !isUpdatingTask) {
          await dispatch(fetchTasks({ token, id: mid || "" })).unwrap();
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetch();
  }, [dispatch, isCreatingTask, isUpdatingTask, location.pathname, mid, token]);

  useEffect(() => {
    if (
      !loadingUsers &&
      Array.isArray(users) &&
      users.length === 0 &&
      !usersFetchError &&
      !isCreatingTask &&
      !isUpdatingTask
    ) {
      if (!userFetchInitiatedRef.current) {
        dispatch(fetchUsers({ token }));
        userFetchInitiatedRef.current = true;
      }
    } else if (Array.isArray(users) && (users.length > 0 || usersFetchError)) {
      userFetchInitiatedRef.current = true;
    }
  }, [
    dispatch,
    users,
    loadingUsers,
    usersFetchError,
    isCreatingTask,
    isUpdatingTask,
    token,
  ]);

  useEffect(() => {
    if (isCreatingTask || isUpdatingTask) return;

    let newProcessedData = [];
    const myTasks = localStorage.getItem("myTasks");

    if (myTasks === "false") {
      if (
        filterSuccess &&
        Array.isArray(filterTasks) &&
        (localStorage.getItem("taskFilters") ||
          localStorage.getItem("taskStatus"))
      ) {
        newProcessedData = filterTasks.map((task) => processTaskData(task));
      } else if (
        tasksFromStore &&
        Array.isArray(tasksFromStore) &&
        tasksFromStore.length > 0
      ) {
        newProcessedData = tasksFromStore.map((task) => processTaskData(task));
      }
    } else {
      if (
        filterSuccess &&
        Array.isArray(filterTasks) &&
        (localStorage.getItem("taskFilters") ||
          localStorage.getItem("taskStatus"))
      ) {
        newProcessedData = filterTasks.map((task) => processTaskData(task));
      } else if (myTaskSuccess && Array.isArray(myTasksFromStore)) {
        newProcessedData = myTasksFromStore.map((task) =>
          processTaskData(task)
        );
      }
    }

    setData(newProcessedData);
    setLocalError(null);
  }, [
    tasksFromStore,
    tasksError,
    isCreatingTask,
    isUpdatingTask,
    filterTasksError,
    filterTasks,
    myTasksFromStore,
    myTasksError,
    myTaskSuccess,
    filterSuccess,
  ]);

  useEffect(() => {
    if (isAddingNewTask && newTaskTitleInputRef.current) {
      newTaskTitleInputRef.current.focus();
    }
  }, [isAddingNewTask, filterTasks, tasksFromStore, isFiltered]);

  const resetNewTaskForm = useCallback(() => {
    const defaults = createNewTaskDefaults();
    setNewTaskTitle(defaults.taskTitle);
    setNewTaskStatus(defaults.status);
    setNewTaskResponsiblePersonId(defaults.responsiblePersonId);
    setNewTaskStartDate(defaults.startDate);
    setNewTaskEndDate(defaults.endDate);
    setNewTaskPriority(defaults.priority);
    setLocalError(null);
    setValidator(false);
  }, [createNewTaskDefaults]);

  const handleShowNewTaskForm = () => {
    if (isCreatingTask || isAddingNewTask || isUpdatingTask) return;
    resetNewTaskForm();
    setIsAddingNewTask(true);
  };

  const handleCancelNewTask = () => {
    setIsAddingNewTask(false);
    resetNewTaskForm();
  };

  const handleSaveNewTask = useCallback(() => {
    // Validation for required fields
    if (!newTaskTitle || newTaskTitle.trim() === "") {
      setLocalError("Task title is required");
      setValidator(true);
      return;
    }
    if (!newTaskStartDate) {
      setLocalError("Start date is required");
      setValidator(true);
      return;
    }
    if (!newTaskEndDate) {
      setLocalError("End date is required");
      setValidator(true);
      return;
    }

    // Additional date validation
    const start = new Date(newTaskStartDate);
    const end = new Date(newTaskEndDate);
    const milestoneStart = milestone?.start_date
      ? new Date(milestone.start_date)
      : new Date();
    const milestoneEnd = milestone?.end_date ? new Date(milestone.end_date) : null;

    if (start < milestoneStart) {
      setLocalError("Start date cannot be before milestone start date");
      setValidator(true);
      return;
    }
    if (milestoneEnd && start > milestoneEnd) {
      setLocalError("Start date cannot be after milestone end date");
      setValidator(true);
      return;
    }
    if (end < start) {
      setLocalError("End date cannot be before start date");
      setValidator(true);
      return;
    }
    if (milestoneEnd && end > milestoneEnd) {
      setLocalError("End date cannot be after milestone end date");
      setValidator(true);
      return;
    }

    setLocalError(null);
    setValidator(false);
    const taskAttributes = {
      title: newTaskTitle.trim(),
      status: newTaskStatus,
      project_management_id: id,
      responsible_person_id: newTaskResponsiblePersonId,
      expected_start_date: newTaskStartDate || null,
      target_date: newTaskEndDate || null,
      priority: newTaskPriority,
      milestone_id: mid,
    };
    setIsCreatingTask(true);
    setIsAddingNewTask(false);
    dispatch(createTask({ token, payload: taskAttributes }))
      .unwrap()
      .then(() => {
        resetNewTaskForm();
        return dispatch(fetchTasks({ token, id: mid ? mid : "" })).unwrap();
      })
      .catch((error) => {
        console.error("Task creation failed:", error);
        setLocalError(
          `Task creation failed: ${error?.response?.data?.errors || error?.message || "Server error"
          }`
        );
        setIsAddingNewTask(true);
      })
      .finally(() => {
        setIsCreatingTask(false);
      });
  }, [
    dispatch,
    newTaskTitle,
    newTaskStatus,
    newTaskResponsiblePersonId,
    newTaskStartDate,
    newTaskEndDate,
    newTaskPriority,
    resetNewTaskForm,
    id,
    mid,
    token,
    milestone,
  ]);

  useEffect(() => {
    const handleClickOutsideNewTaskRow = (event) => {
      if (
        !isAddingNewTask ||
        !newTaskFormRowRef.current ||
        newTaskFormRowRef.current.contains(event.target)
      ) {
        return;
      }

      handleSaveNewTask();
    };
    if (isAddingNewTask) {
      document.addEventListener("mousedown", handleClickOutsideNewTaskRow);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNewTaskRow);
    };
  }, [
    isAddingNewTask,
    isCreatingTask,
    newTaskTitle,
    handleSaveNewTask,
    resetNewTaskForm,
  ]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (!isAddingNewTask) return;
      if (event.key === "Escape") {
        handleCancelNewTask();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAddingNewTask, handleCancelNewTask]);

  const handleFetchTasks = async () => {
    const myTasks = localStorage.getItem("myTasks");

    if (localStorage.getItem("taskFilters")) {
      const saved = JSON.parse(localStorage.getItem("taskFilters"));
      const newFilter = {
        "q[status_in][]":
          saved.selectedStatuses.length > 0 ? saved.selectedStatuses : [],
        "q[created_by_id_eq]":
          saved.selectedCreators.length > 0 ? saved.selectedCreators : [],
        "q[start_date_eq]": saved.dates["Start Date"],
        "q[end_date_eq]": saved.dates["End Date"],
        "q[responsible_person_id_in][]":
          saved.selectedResponsible.length > 0 ? saved.selectedResponsible : [],
        "q[milestone_id_eq]": mid,
      };
      const queryString = qs.stringify(newFilter, { arrayFormat: "repeat" });
      await dispatch(filterTask({ token, filter: queryString })).unwrap();
      return;
    }
    if (localStorage.getItem("taskStatus")) {
      const saved = localStorage.getItem("taskStatus");
      const filter = {
        "q[status_eq]": saved,
      };
      await dispatch(filterTask({ token, filter })).unwrap();
      return;
    }
    if (mid != undefined && mid != null) {
      await dispatch(fetchTasks({ token, id: mid })).unwrap();
    } else {
      if (myTasks === "false") {
        await dispatch(fetchTasks({ token, id: "" })).unwrap();
      } else {
        await dispatch(fetchMyTasks({ token })).unwrap();
      }
    }
  };

  const handleUpdateTaskFieldCell = useCallback(
    async (taskId, fieldName, newValue) => {
      if (isUpdatingTask) return;
      const payload = { [fieldName]: newValue };
      setIsUpdatingTask(true);
      setLocalError(null);
      try {
        if (fieldName === "status") {
          await dispatch(changeTaskStatus({ token, id: taskId, payload }))
            .unwrap();
        } else {
          await dispatch(updateTask({ token, id: taskId, payload })).unwrap();
        }
        handleFetchTasks();
      } catch (error) {
        console.error(
          `Task field update failed for ${taskId} (${fieldName}):`,
          error
        );
        setLocalError(
          `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"
          }`
        );
      } finally {
        setIsUpdatingTask(false);
      }
    },
    [dispatch, isUpdatingTask, token]
  );

  const mainTableColumns = [
    {
      id: "expander",
      header: () => null,
      size: 40,
      cell: ({ row }) => {
        const canExpand = row.original.hasSubtasks;
        return canExpand ? (
          <button
            onClick={row.getToggleExpandedHandler()}
            style={{ cursor: "pointer", paddingLeft: `${row.depth * 1}rem` }}
            className="flex items-center justify-center w-full h-full"
            aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
          >
            {row.getIsExpanded() ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
        ) : (
          <span
            style={{ paddingLeft: `${row.depth * 1 + 0.5}rem` }}
            className="flex items-center justify-center w-full h-full"
          ></span>
        );
      },
    },
    {
      accessorKey: "id",
      header: "Task Id",
      size: 100,
      cell: ({ getValue, row }) => {
        let originalId = String(getValue() || "");
        let displayId = "";
        let linkIdPart = originalId;
        if (originalId.startsWith("T-")) {
          displayId = originalId;
          linkIdPart = originalId.substring(2);
        } else {
          displayId = `T-${originalId}`;
        }
        
        // Generate cloud-aware navigation path
        const taskPaths = getTaskPaths(id, mid, linkIdPart, isCloudRoute);
        const navigationPath = taskPaths.taskDetailSimple;
        
        return (
          <Link
            to={navigationPath}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-1 block"
            style={{ paddingLeft: `${row.depth * 1.5}rem` }}
          >
            <span>{displayId}</span>
          </Link>
        );
      },
    },
    {
      accessorKey: "taskTitle",
      header: "Task Title",
      size: 200,
      cell: ({ getValue, row }) => {
        const [editTitle, setEditTitle] = useState(getValue());
        return (
          <EditableTextField
            value={editTitle}
            onUpdate={(title) => setEditTitle(title)}
            onEnterPress={() =>
              handleUpdateTaskFieldCell(row.original.id, "title", editTitle)
            }
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 150,
      cell: ({ getValue, row }) => (
        <StatusBadge
          status={getValue()}
          statusOptions={globalStatusOptions}
          onStatusChange={(newStatus) =>
            handleUpdateTaskFieldCell(row.original.id, "status", newStatus)
          }
        />
      ),
    },
    {
      accessorKey: "responsiblePersonId",
      header: "Responsible Person",
      size: 150,
      cell: ({ getValue, row }) => {
        return (
          <SelectBox
            options={(projectTeamMembers.length > 0 ? projectTeamMembers : users).map(
              (user) => ({
                value: user.user_id || user.id,
                label:
                  user?.user?.name || `${user.firstname} ${user.lastname}`,
              })
            )}
            value={getValue()}
            onChange={(newValue) =>
              handleUpdateTaskFieldCell(
                row.original.id,
                "responsible_person_id",
                newValue
              )
            }
            table={true}
            className="w-full"
          />
        );
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      size: 130,
      cell: ({ getValue, row }) => (
        <DateEditor
          value={getValue()}
          onUpdate={(date) =>
            handleUpdateTaskFieldCell(
              row.original.id,
              "expected_start_date",
              date
            )
          }
          className="text-[12px]"
        />
      ),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      size: 130,
      cell: ({ getValue, row }) => (
        <DateEditor
          value={getValue()}
          onUpdate={(date) =>
            handleUpdateTaskFieldCell(row.original.id, "target_date", date)
          }
          className="text-[12px]"
          min={row.original.startDate}
        />
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      size: 120,
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 110,
      cell: ({ getValue, row }) => (
        <StatusBadge
          status={getValue()}
          statusOptions={globalPriorityOptions}
          onStatusChange={(newPriority) =>
            handleUpdateTaskFieldCell(
              row.original.id,
              "priority",
              newPriority
            )
          }
        />
      ),
    },
    {
      accessorKey: "predecessor",
      header: "Predecessor",
      size: 100,
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
    },
    {
      accessorKey: "successor",
      header: "Successor",
      size: 100,
      cell: ({ getValue }) => <span className="text-xs">{getValue()}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      size: 100,
      cell: ({ row }) => {
        const taskId = row.original.id;
        const taskPaths = getTaskPaths(id, mid, taskId, isCloudRoute);
        const detailPath = taskPaths.taskDetailSimple;
        
        return (
          <div className="flex gap-2 items-center">
            <Link
              to={detailPath}
              className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-600 rounded hover:bg-blue-50"
            >
              View
            </Link>
            <Link
              to={`${detailPath}?edit=true`}
              className="text-green-600 hover:text-green-800 text-xs px-2 py-1 border border-green-600 rounded hover:bg-green-50"
            >
              Edit
            </Link>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns: mainTableColumns,
    state: {
      expanded,
      pagination,
    },
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const showTopLevelAddTaskButton =
    !isAddingNewTask &&
    !isCreatingTask &&
    !isUpdatingTask &&
    !loadingTasks &&
    !tasksError;
  const actualDataRows = table.getRowModel().rows;
  let displayedRowCount = actualDataRows.length + (isAddingNewTask ? 1 : 0);
  if (showTopLevelAddTaskButton && !isAddingNewTask) displayedRowCount++;

  const numEmptyRowsToFill = Math.max(0, MIN_DISPLAY_ROWS - displayedRowCount);
  const totalRowsForHeightCalc = Math.max(MIN_DISPLAY_ROWS, displayedRowCount);
  const desiredTableHeight =
    totalRowsForHeightCalc * ROW_HEIGHT + HEADER_HEIGHT;

  const newTskEnterKeyHandler = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSaveNewTask();
    }
  };

  let content;
  if (
    isCreatingTask ||
    isUpdatingTask ||
    loadingFilterTasks ||
    loadingMyTasks ||
    loadingTasks
  ) {
    let loadingMessage = "Loading tasks...";
    if (isCreatingTask) loadingMessage = "Creating task...";
    if (isUpdatingTask) loadingMessage = "Updating task...";
    if (loadingFilterTasks) loadingMessage = "Filtering tasks...";
    content = <Loader message={loadingMessage} error={tasksError} />;
  } else {
    content = (
      <>
        <div
          className="table-wrapper border-none overflow-x-auto"
          style={{
            minHeight: `${desiredTableHeight}px`,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 bg-gray-50 z-30">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      style={{ width: `${h.getSize()}px` }}
                      className="border-r-2 p-2 text-center text-gray-600 font-semibold break-words"
                    >
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white">
              {data.length === 0 &&
                !isAddingNewTask &&
                !showTopLevelAddTaskButton &&
                !loadingTasks &&
                !isCreatingTask &&
                !isUpdatingTask &&
                !loadingFilterTasks && (
                  <tr style={{ height: `${ROW_HEIGHT * 2}px` }}>
                    <td
                      colSpan={mainTableColumns.length}
                      className="text-center text-gray-500 p-4"
                    >
                      {isFiltered ? "Try adjusting Filters" : ""}
                      "No tasks available"
                    </td>
                  </tr>
                )}
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr
                    className={`hover:bg-gray-50 ${row.getIsExpanded() ? "bg-gray-100" : "even:bg-[#D5DBDB4D]"
                      } font-[300] relative z-1`}
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: `${cell.column.getSize()}px` }}
                        className={`border-r-2 text-left pl-2 align-middle p-0`}
                      >
                        <div className="h-full w-full flex items-center">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </Fragment>
              ))}
              {isAddingNewTask && (
                <tr
                  ref={newTaskFormRowRef}
                  style={{ height: `${ROW_HEIGHT}px` }}
                  className="border-b relative z-1"
                >
                  <td className="p-0 align-middle border-r-2 text-gray-400">
                    <div className="h-full w-full flex items-center px-1"></div>
                  </td>
                  <td className="p-0 align-middle border-r-2 text-gray-400">
                    <div className="h-full w-full flex items-center px-1">
                      ---
                    </div>
                  </td>
                  <td className="pl-2 p-0 align-middle border-r-2">
                    <EditableTextField
                      value={newTaskTitle}
                      onUpdate={setNewTaskTitle}
                      inputRef={newTaskTitleInputRef}
                      isNewRow={true}
                      onEnterPress={handleSaveNewTask}
                      validator={!newTaskTitle || newTaskTitle.trim() === ""}
                    />
                  </td>
                  <td className="pl-2 p-0 align-middle border-r-2">
                    <StatusBadge
                      status={newTaskStatus}
                      statusOptions={globalStatusOptions}
                      onStatusChange={setNewTaskStatus}
                    />
                  </td>
                  <td className="p-0 align-middle border-r-2">
                    <SelectBox
                      options={[
                        ...(Array.isArray(projectTeamMembers)
                          ? projectTeamMembers.map((u) => ({
                            value: u.user_id,
                            label: u?.user?.name,
                          }))
                          : []),
                      ]}
                      value={newTaskResponsiblePersonId}
                      onChange={(selectedId) => {
                        setNewTaskResponsiblePersonId(selectedId);
                      }}
                      placeholder="Select Person..."
                      table={true}
                    />
                  </td>
                  <td className="p-0 align-middle border-r-2">
                    <DateEditor
                      value={newTaskStartDate}
                      onUpdate={setNewTaskStartDate}
                      isNewRow={true}
                      onEnterPress={handleSaveNewTask}
                      validator={(date) => {
                        if (!date) return false;
                        const start = new Date(date);
                        const milestoneStart = milestone?.start_date
                          ? new Date(milestone.start_date)
                          : new Date();
                        const milestoneEnd = milestone?.end_date
                          ? new Date(milestone.end_date)
                          : null;
                        return (
                          start >= milestoneStart &&
                          (!milestoneEnd || start <= milestoneEnd) &&
                          (!newTaskEndDate || start <= new Date(newTaskEndDate))
                        );
                      }}
                      min={
                        milestone?.start_date
                          ? milestone.start_date
                          : new Date().toISOString().split("T")[0]
                      }
                      max={milestone?.end_date || undefined}
                    />
                  </td>
                  <td className="p-0 align-middle border-r-2">
                    <DateEditor
                      value={newTaskEndDate}
                      onUpdate={setNewTaskEndDate}
                      isNewRow={true}
                      onEnterPress={handleSaveNewTask}
                      className="text-[12px]"
                      validator={(date) => {
                        if (!date) return false;
                        const end = new Date(date);
                        const start = newTaskStartDate ? new Date(newTaskStartDate) : null;
                        const milestoneEnd = milestone?.end_date
                          ? new Date(milestone.end_date)
                          : null;
                        return (
                          (!start || end >= start) &&
                          (!milestoneEnd || end <= milestoneEnd)
                        );
                      }}
                      min={newTaskStartDate}
                      max={milestone?.end_date || undefined}
                    />
                  </td>
                  <td className="p-0 align-middle border-r-2 text-xs">
                    <div className="h-full w-full flex items-center px-2">
                      {calculateDuration(newTaskStartDate, newTaskEndDate)}
                    </div>
                  </td>
                  <td className="p-0 pl-2 align-middle border-r-2">
                    <StatusBadge
                      status={newTaskPriority}
                      statusOptions={globalPriorityOptions}
                      onStatusChange={setNewTaskPriority}
                    />
                  </td>
                  <td className="p-0 align-middle border-r-2"></td>
                  <td className="p-0 align-middle border-r-2"></td>
                </tr>
              )}
              {showTopLevelAddTaskButton && (
                <tr style={{ height: `${ROW_HEIGHT}px` }}>
                  <td
                    colSpan={mainTableColumns.length}
                    className="border text-left text-[12px]"
                  >
                    <button
                      onClick={handleShowNewTaskForm}
                      className="text-red-500 hover:underline text-sm px-2 py-1"
                    >
                      + Click here to add a new task
                    </button>
                  </td>
                </tr>
              )}
              {Array.from({ length: numEmptyRowsToFill }).map((_, i) => (
                <tr key={`empty-${i}`} style={{ height: `${ROW_HEIGHT}px` }}>
                  <td
                    colSpan={mainTableColumns.length}
                    className="border-r-2 p-2"
                  >

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  const renderError = localError ? (
    <div className="mt-2 p-2 text-red-700 b text-sm">{String(localError)}</div>
  ) : null;

  if (usersFetchError && (!Array.isArray(users) || users.length === 0)) {
    console.error("Error fetching users for dropdown:", usersFetchError);
  }
  if (loadingUsers && (!Array.isArray(users) || users.length === 0)) {
    console.log("Loading users for dropdown...");
  }

  return (
    <div className="p-2">
      {renderError}
      {content}

      {data.length > 0 && !loadingTasks && (
        <div className=" flex items-center justify-start gap-4 mt-4 text-[12px]">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-red-600 disabled:opacity-30"
          >
            {"<"}
          </button>

          {(() => {
            const totalPages = table.getPageCount();
            const currentPage = table.getState().pagination.pageIndex;
            const visiblePages = 3;

            let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
            let end = start + visiblePages;

            if (end > totalPages) {
              end = totalPages;
              start = Math.max(0, end - visiblePages);
            }

            return [...Array(end - start)].map((_, i) => {
              const page = start + i;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  onClick={() => table.setPageIndex(page)}
                  className={` px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""}`}
                >
                  {page + 1}
                </button>
              );
            });
          })()}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-red-600 disabled:opacity-30"
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskTable;