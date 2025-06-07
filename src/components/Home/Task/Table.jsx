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
  getPaginationRowModel, // Import getPaginationRowModel
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import StatusBadge from "../Projects/statusBadge";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import "../../Home/Sprints/Table.css";

import {
  fetchTasks,
  createTask,
  changeTaskStatus,
  updateTask,
} from "../../../redux/slices/taskSlice";
import { fetchUsers } from "../../../redux/slices/userSlice";
import SelectBox from "../../SelectBox";
import Loader from "../../Loader";
import { useLocation } from "react-router-dom";

const globalPriorityOptions = ["None", "Low", "Medium", "High", "Urgent"];
const globalStatusOptions = ["open", "in_progress", "completed", "on_hold", "overdue", "reopen", "abort"];

const EditableTextField = ({
  value,
  onUpdate,
  inputRef,
  isNewRow,
  onEnterPress,
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
      className="focus:outline-none w-full h-full p-1 rounded text-sm"
    />
  );
};

const DateEditor = ({
  value: propValue,
  onUpdate,
  isNewRow,
  onEnterPress,
  className,
  placeholder = "Select date",

}) => {
  const [date, setDate] = useState(
    propValue ? new Date(propValue).toISOString().split("T")[0] : ""
  );
  const inputRef = useRef(null);

  useEffect(() => {
    const initialDate = propValue ? new Date(propValue).toISOString().split("T")[0] : "";
    setDate(initialDate);
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
    if (inputRef.current && typeof inputRef.current.showPicker === 'function') {
      try {
        inputRef.current.showPicker();
      } catch (error) {
        console.error("Error trying to show picker:", error);
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="date"
      value={date}
      onChange={handleInputChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={handleInputClick}
      className={`w-full focus:outline-none rounded text-[12px] my-custom-date-editor ${className || ''} `}
      placeholder={placeholder}
    />
  );
};

const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return "0d:0h:0m";
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (
    isNaN(startDate.getTime()) ||
    isNaN(endDate.getTime()) ||
    endDate < startDate
  )
    return "0d:0h:0m";
  let ms = endDate.getTime() - startDate.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(ms / (1000 * 60));
  return `${days}d:${hours}h:${minutes}m`;
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
    startDate: task.started_at?.split("T")[0],
    endDate: task.target_date?.split("T")[0],
    priority: task.priority,
    duration: calculateDuration(task.started_at, task.target_date),
    predecessor: task.predecessor || "",
    successor: task.successor || "",
    hasSubtasks: hasSubtasks,
    subRows: subRows,
    subRowsLoaded: true,
  };
};

const TaskTable = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    loading: loadingTasks,
    error: tasksError,
    fetchTasks: tasksFromStore,
  } = useSelector((state) => state.fetchTasks);

  const {
    fetchUsers: users, // Assuming 'users' is the array here based on your previous code structure
    loading: loadingUsers,
    error: usersFetchError,
  } = useSelector(
    (state) => state.fetchUsers || { users: [], loading: false, error: null }
  );

  const {
    filterTask,
    loading: loadingFilterTasks,
    error: filterTasksError,
  } = useSelector(
    (state) => state.filterTask
  )

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

  const newTaskTitleInputRef = useRef(null);
  const newTaskFormRowRef = useRef(null);

  const [localError, setLocalError] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  // Pagination states
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Default page size
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
    if (
      !isCreatingTask &&
      !isUpdatingTask && location.pathname == '/tasks'
    ) {
      dispatch(fetchTasks());
    }
  }, [dispatch, isCreatingTask, isUpdatingTask, location.pathname]);

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
        dispatch(fetchUsers());
        userFetchInitiatedRef.current = true;
      }
    } else if (Array.isArray(users) && (users.length > 0 || usersFetchError)) {
      userFetchInitiatedRef.current = true;
    }
  }, [
    dispatch,
    // Check if users is an array before accessing length
    users && users.length, // More robust dependency for length
    loadingUsers,
    usersFetchError,
    isCreatingTask,
    isUpdatingTask,
  ]);

  useEffect(() => {
    if (isCreatingTask || isUpdatingTask) return;
    let newProcessedData = [];
    if (filterTask && filterTask.length > 0) {
      newProcessedData = filterTask.map((task) =>
        processTaskData(task)
      );
    }
    else if (tasksFromStore && Array.isArray(tasksFromStore)) {
      // Use the recursive helper to process tasks and their sub_tasks_managements
      newProcessedData = tasksFromStore.map((task) =>
        processTaskData(task)
      );
      setData(newProcessedData);
      setLocalError(null);
    } else if (tasksError && !tasksFromStore && filterTasksError && !filterTask) {
      setData([]);
    }
  }, [tasksFromStore, tasksError, isCreatingTask, isUpdatingTask, filterTasksError, filterTask]);

  useEffect(() => {
    if (isAddingNewTask && newTaskTitleInputRef.current) {
      newTaskTitleInputRef.current.focus();
    }
  }, [isAddingNewTask]);

  const resetNewTaskForm = useCallback(() => {
    const defaults = createNewTaskDefaults();
    setNewTaskTitle(defaults.taskTitle);
    setNewTaskStatus(defaults.status);
    setNewTaskResponsiblePersonId(defaults.responsiblePersonId);
    setNewTaskStartDate(defaults.startDate);
    setNewTaskEndDate(defaults.endDate);
    setNewTaskPriority(defaults.priority);
    setLocalError(null);
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
    if (!newTaskTitle || newTaskTitle.trim() === "") {
      setLocalError("Task title cannot be empty.");
      if (newTaskTitleInputRef.current) newTaskTitleInputRef.current.focus();
      return;
    }
    setLocalError(null);
    const taskAttributes = {
      title: newTaskTitle.trim(),
      status: newTaskStatus,
      project_management_id: 2,
      responsible_person_id: newTaskResponsiblePersonId,
      started_at: newTaskStartDate || null,
      target_date: newTaskEndDate || null,
      priority: newTaskPriority,
    };
    setIsCreatingTask(true);
    setIsAddingNewTask(false);
    dispatch(createTask(taskAttributes))
      .unwrap()
      .then(() => {
        resetNewTaskForm();
        return dispatch(fetchTasks()).unwrap();
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
      if (!newTaskTitle || newTaskTitle.trim() === "") {
        setIsAddingNewTask(false);
        resetNewTaskForm();
      } else {
        handleSaveNewTask();
      }
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

  const handleUpdateTaskFieldCell = useCallback(
    async (taskId, fieldName, newValue) => {
      console.log(taskId, fieldName, newValue)
      if (isUpdatingTask) return;
      const payload = { [fieldName]: newValue };
      setIsUpdatingTask(true);
      setLocalError(null);
      try {
        if (fieldName === "status") {
          dispatch(changeTaskStatus({ id: taskId, payload })) // Using changeTaskStatus as per import
            .unwrap()
            .then(() => {
              return dispatch(fetchTasks()).unwrap();
            })
        }
        else {
          dispatch(updateTask({ id: taskId, payload }))
            .unwrap()
            .then(() => {
              return dispatch(fetchTasks()).unwrap();
            })
        }
      } catch (error) {
        console.error(
          `Task field update failed for ${taskId} (${fieldName}):`,
          error
        );
        setLocalError(
          `Update failed: ${error?.response?.data?.errors || error?.message || "Server error"
          }`
        );
        dispatch(fetchTasks());
      }
      finally {
        setIsUpdatingTask(false);
      }
    },
    [dispatch, isUpdatingTask]
  );

  const mainTableColumns = useMemo(
    () => [
      {
        id: "expander",
        header: () => null,
        size: 40,
        cell: ({ row }) => {
          const canExpand = row.original.hasSubtasks; // Relies on hasSubtasks from processTaskData
          return canExpand ? (
            <button
              onClick={row.getToggleExpandedHandler()} // Just toggle, subRows are already loaded
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
            >
              &nbsp;
            </span>
          );
        },
      },
      {
        accessorKey: "id",
        header: "Task Id",
        size: 100,
        cell: ({ getValue, row }) => {
          // Added row for depth
          let originalId = String(getValue() || "");
          let displayId = "";
          let linkIdPart = originalId;
          if (originalId.startsWith("T-")) {
            displayId = originalId;
            linkIdPart = originalId.substring(2);
          } else {
            displayId = `T-${originalId}`;
          }
          return (
            <Link
              to={`/tasks/${linkIdPart}`}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-1 block" // Added block for padding
              style={{ paddingLeft: `${row.depth * 1.5}rem` }} // Indentation for subtask IDs
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
        cell: (
          { getValue, row } // Added row for depth
        ) => (
          <span
            className="truncate block" // Added block for padding
            style={{
              paddingLeft:
                row.depth > 0 ? `${row.depth * 1.5 + 0.5}rem` : "0.55rem",
            }} // Indentation for subtask titles, 0.25rem is p-1
          >
            {getValue()}
          </span>
        ),
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
              options={users.map((user) => ({ value: user.id, label: `${user.firstname} ${user.lastname}` }))}
              value={getValue()}
              onChange={(newValue) => handleUpdateTaskFieldCell(row.original.id, "responsible_person_id", newValue)}
              style={
                {
                  border: "none",
                  width: "100%",
                  height: "100%",
                  padding: "0.5rem"
                }
              }
              table={true}
            />
          )
        },
      },
      {
        accessorKey: "startDate",
        header: "Start Date",
        size: 130,
        cell: ({ getValue, row }) =>
        (
          <DateEditor
            value={getValue()}
            onUpdate={(date) => handleUpdateTaskFieldCell(row.original.id, "started_at", date)}
            className="text-[12px]"
          />
        )

      },
      {
        accessorKey: "endDate",
        header: "End Date",
        size: 130,
        cell: ({ getValue, row }) =>
        (
          <DateEditor
            value={getValue()}
            onUpdate={(date) => handleUpdateTaskFieldCell(row.original.id, "target_date", date)}
            className="text-[12px]"
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
        cell: ({ getValue }) => (
          <span className="text-xs p-1">{getValue()}</span>
        ),
      },
      {
        accessorKey: "successor",
        header: "Successor",
        size: 100,
        cell: ({ getValue }) => (
          <span className="text-xs p-1">{getValue()}</span>
        ),
      },
    ],
    [handleUpdateTaskFieldCell, users]
  );

  const table = useReactTable({
    data,
    columns: mainTableColumns,
    state: {
      expanded,
      pagination, // Add pagination state
    },
    onExpandedChange: setExpanded,
    onPaginationChange: setPagination, // Add pagination handler
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
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
    (loadingTasks && !data.length && !isAddingNewTask)
  ) {
    let loadingMessage = "Loading tasks...";
    if (isCreatingTask) loadingMessage = "Creating task...";
    if (isUpdatingTask) loadingMessage = "Updating task...";
    content = (
      <Loader message={loadingMessage} error={tasksError} />
    )
  } else {
    content = (
      <div
        className="table-wrapper border-none overflow-x-auto"
        style={{
          minHeight: `${desiredTableHeight}px`,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {" "}
        <table className="w-full table-auto text-sm table-fixed">
          {" "}
          <thead className="sticky top-0 bg-gray-50 z-30">
            {" "}
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
            {" "}
          </thead>
          {" "}
          <tbody className="bg-white">
            {" "}
            {actualDataRows.length === 0 &&
              !isAddingNewTask &&
              !showTopLevelAddTaskButton &&
              !loadingTasks &&
              !isCreatingTask &&
              !isUpdatingTask && (
                <tr style={{ height: `${ROW_HEIGHT * 2}px` }}>
                  <td
                    colSpan={mainTableColumns.length}
                    className="text-center text-gray-500 p-4"
                  >
                    No tasks available.
                  </td>
                </tr>
              )}
            {" "}
            {table.getRowModel().rows.map((row) => ( // Use table.getRowModel().rows for paginated rows
              <Fragment key={row.id}>
                {" "}
                <tr
                  className={`hover:bg-gray-50 ${row.getIsExpanded() ? "bg-gray-100" : "even:bg-[#D5DBDB4D]"
                    } font-[300] relative z-1`}
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {" "}
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
                  {" "}
                </tr>
                {" "}
              </Fragment>
            ))}
            {" "}
            {isAddingNewTask && (
              <tr
                ref={newTaskFormRowRef}
                style={{ height: `${ROW_HEIGHT}px` }}
                className="border-b relative z-1"
              >
                {" "}
                <td className="p-0 align-middle border-r-2 text-gray-400">
                  <div className="h-full w-full flex items-center px-1">
                  </div>
                </td>
                {" "}
                <td className="p-0 align-middle border-r-2 text-gray-400">
                  <div className="h-full w-full flex items-center px-1">
                    ---
                  </div>
                </td>
                {" "}
                <td className="pl-2 p-0 align-middle border-r-2">
                  <EditableTextField
                    value={newTaskTitle}
                    onUpdate={setNewTaskTitle}
                    inputRef={newTaskTitleInputRef}
                    isNewRow={true}
                    onEnterPress={handleSaveNewTask}
                  />
                </td>
                {" "}
                <td className="pl-2 p-0 align-middle border-r-2">
                  {" "}
                  <StatusBadge
                    status={newTaskStatus}
                    statusOptions={globalStatusOptions}
                    onStatusChange={setNewTaskStatus}
                  />
                </td>
                {" "}
                <td className="p-0 align-middle border-r-2">
                  {" "}
                  <SelectBox
                    options={[
                      { value: null, label: "Unassigned" },
                      ...(Array.isArray(users)
                        ? users.map((u) => ({
                          value: u.id,
                          label: `${u.firstname || ""} ${u.lastname || ""
                            }`.trim(),
                        }))
                        : []),
                    ]}
                    value={newTaskResponsiblePersonId}
                    onChange={(selectedId) => {
                      setNewTaskResponsiblePersonId(selectedId);
                      console.log(selectedId);
                    }
                    }
                    placeholder="Select Person..."
                    table={true}
                  />
                  {" "}
                </td>
                {" "}
                <td className="p-0 align-middle border-r-2">
                  <DateEditor
                    value={newTaskStartDate}
                    onUpdate={setNewTaskStartDate}
                    isNewRow={true}
                    onEnterPress={handleSaveNewTask}
                  />
                </td>
                {" "}
                <td className="p-0 align-middle border-r-2">
                  <DateEditor
                    value={newTaskEndDate}
                    onUpdate={setNewTaskEndDate}
                    isNewRow={true}
                    onEnterPress={handleSaveNewTask}
                    className="text-[12px]"
                  />
                </td>
                {" "}
                <td className="p-0 align-middle border-r-2 text-xs">
                  <div className="h-full w-full flex items-center px-2">
                    {calculateDuration(newTaskStartDate, newTaskEndDate)}
                  </div>
                </td>
                {" "}
                <td className="p-0 pl-2 align-middle border-r-2">
                  <StatusBadge
                    status={newTaskPriority}
                    statusOptions={globalPriorityOptions}
                    onStatusChange={setNewTaskPriority}
                  />
                </td>
                {" "}
                <td className="p-0 align-middle border-r-2"></td>
                {""}
                <td className="p-0 align-middle border-r-2"></td>
                {" "}
              </tr>
            )}
            {" "}
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
            {" "}
            {Array.from({ length: numEmptyRowsToFill }).map((_, i) => (
              <tr key={`empty-${i}`} style={{ height: `${ROW_HEIGHT}px` }}>
                <td
                  colSpan={mainTableColumns.length}
                  className="border-r-2 p-2"
                >
                  &nbsp;
                </td>
              </tr>
            ))}
            {" "}
          </tbody>
          {" "}
        </table>
        {" "}
      </div>
    );
  }

  const renderError = localError ? (
    <div className="mt-2 p-2 text-red-700 bg-red-100 border border-red-400 rounded text-sm">
      {String(localError)}
    </div>
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

      {/* Pagination Controls */}
      {!loadingTasks && data.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1 text-sm">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1 text-sm">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="w-16 p-1 border rounded-md text-sm"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className="p-1 border rounded-md text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm">
            {table.getFilteredRowModel().rows.length} Total Tasks
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;