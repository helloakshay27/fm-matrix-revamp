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
import { Link, useParams } from "react-router-dom";
import "../../Home/Sprints/Table.css";

import {
  fetchTasks,
  createTask,
  changeTaskStatus,
  updateTask,
  filterTask,
  fetchMyTasks
} from "../../../redux/slices/taskSlice";
import { fetchUsers } from "../../../redux/slices/userSlice";
import SelectBox from "../../SelectBox";
import Loader from "../../Loader";
import { useLocation } from "react-router-dom";
import qs from "qs";

const globalPriorityOptions = ["None", "Low", "Medium", "High", "Urgent"];
const globalStatusOptions = ["open", "in_progress", "completed", "on_hold", "overdue", "reopen", "abort"];

const EditableTextField = ({
  value,
  onUpdate,
  inputRef,
  isNewRow,
  onEnterPress,
  validator,
  table
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
      className={`${validator ? ' border border-red-600' : 'border-none'} focus:outline-none w-full h-full p-1 rounded text-[12px] bg-transparent`}
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
  validator,
  min

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
      className={`${validator ? 'border border-red-400' : 'border-none'} w-full focus:outline-none rounded text-[12px] p-1 my-custom-date-editor  `}
      placeholder={placeholder}
      min={min || null}
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
    startDate: task.expected_start_date?.split("T")[0],
    endDate: task.target_date?.split("T")[0],
    priority: task.priority,
    duration: calculateDuration(task.expected_start_date, task.target_date),
    predecessor: task.predecessor || "",
    successor: task.successor || "",
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

  const {
    loading: loadingTasks,
    error: tasksError,
    fetchTasks: tasksFromStore,
  } = useSelector((state) => state.fetchTasks);

  const{
    fetchMyTasks: myTasksFromStore,
    loading: loadingMyTasks,
    error: myTasksError,
    success: myTaskSuccess
  } = useSelector((state) => state.fetchMyTasks);


  const {
    fetchUsers: users, // Assuming 'users' is the array here based on your previous code structure
    loading: loadingUsers,
    error: usersFetchError,
  } = useSelector(
    (state) => state.fetchUsers || { users: [], loading: false, error: null }
  );

  const {
    filterTask: filterTasks,
    loading: loadingFilterTasks,
    error: filterTasksError,
    success:filterSuccess
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
  const [validator, setValidator] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

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
        const handleBeforeUnload = () => {
            localStorage.removeItem("taskFilters");
        };

        window.addEventListener("beforeunload", handleBeforeUnload); console.log("Resetting filters at", new Date().toISOString());


        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
   
    useEffect(() => {
      filterSuccess? setIsFiltered(true) : setIsFiltered(false);  
    },[filterSuccess,filterTasks]);

  useEffect(() => {
    if (
      !isCreatingTask &&
      !isUpdatingTask
    ) {
      if(mid)
      dispatch(fetchTasks({ token, id: mid }));
      else
      dispatch(fetchTasks({ token ,id:""}));
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
        dispatch(fetchUsers({ token }));
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
    const myTasks= localStorage.getItem("myTasks");

    console.log(tasksFromStore,myTasks);
    if (myTasks==="false") {
      console.log("hi");
        // All Tasks mode
        if (filterSuccess && Array.isArray(filterTasks)) {
            console.log("All Tasks mode: Using filtered tasks");
            newProcessedData = filterTasks.map((task) => processTaskData(task));
        } else if (tasksFromStore && Array.isArray(tasksFromStore) && tasksFromStore.length > 0) {
            console.log("All Tasks mode: Using all tasks");
            newProcessedData = tasksFromStore.map((task) => processTaskData(task));
        }
    } else {
        // My Tasks mode
        if (filterSuccess && Array.isArray(filterTasks)) {
            console.log("My Tasks mode: Using filtered tasks");
            newProcessedData = filterTasks.map((task) => processTaskData(task));
        } else if (myTaskSuccess && Array.isArray(myTasksFromStore)) {
            console.log("My Tasks mode: Using my tasks");
            newProcessedData = myTasksFromStore.map((task) => processTaskData(task));
        }
    }
    
    setData(newProcessedData);
    setLocalError(null);
    console.log(newProcessedData);
  }, [tasksFromStore, tasksError, isCreatingTask, isUpdatingTask, filterTasksError, filterTasks,myTasksFromStore,myTasksError,myTaskSuccess]);

  useEffect(() => {
    if (isAddingNewTask && newTaskTitleInputRef.current) {
      newTaskTitleInputRef.current.focus();
    }
  }, [isAddingNewTask, filterTasks, tasksFromStore,isFiltered]);

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
    if (!newTaskTitle || newTaskTitle.trim() === "" || !newTaskEndDate || !newTaskStartDate) {
      setLocalError("Fill all required fields");
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
      milestone_id: mid
    };
    setIsCreatingTask(true);
    setIsAddingNewTask(false);
    dispatch(createTask({ token, payload: taskAttributes }))
      .unwrap()
      .then(() => {
        resetNewTaskForm();
        return dispatch(fetchTasks({ token, id: mid?mid:"" })).unwrap();
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
        console.log("Escape key pressed!");
        handleCancelNewTask();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAddingNewTask, handleCancelNewTask]);

  const handleFetchTasks=async()=>{
     const myTasks= localStorage.getItem("myTasks");

    console.log(tasksFromStore,myTasks);
      if (localStorage.getItem("taskFilters")){
        console.log("hoe");
        const saved=JSON.parse(localStorage.getItem("taskFilters"));
        const newFilter = {
                "q[status_in][]": saved.selectedStatuses.length > 0 ? saved.selectedStatuses : [],
                "q[created_by_id_eq]": saved.selectedCreators.length > 0 ? saved.selectedCreators : [],
                "q[start_date_eq]": saved.dates["Start Date"],
                "q[end_date_eq]": saved.dates["End Date"],
                "q[responsible_person_id_in][]": saved.selectedResponsible.length > 0 ? saved.selectedResponsible : [],
                "q[milestone_id_eq]": mid
            }
          const queryString = qs.stringify(newFilter, { arrayFormat: 'repeat' });
                   await dispatch(filterTask({token,filter:queryString})).unwrap();
           return;
    }
    if(mid!=undefined && mid!=null){
      await dispatch(fetchTasks({ token, id: mid })).unwrap();
    }
     else{
    if (myTasks==="false") {
         await dispatch(fetchTasks({ token, id: "" })).unwrap();
    } else {
      await dispatch(fetchMyTasks({ token })).unwrap();
    }
    }

  }


  const handleUpdateTaskFieldCell = useCallback(
    async (taskId, fieldName, newValue) => {
      console.log(taskId, fieldName, newValue)
      if (isUpdatingTask ) return;
      const payload = { [fieldName]: newValue };
      setIsUpdatingTask(true);
      setLocalError(null);
      try {
        if (fieldName === "status") {
          await dispatch(changeTaskStatus({ token, id: taskId, payload })) // Using changeTaskStatus as per import
            .unwrap()
        }
        else {
          await dispatch(updateTask({ token, id: taskId, payload }))
            .unwrap()
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
              to={`${linkIdPart}`}
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
        cell: ({ getValue, row }) => {

          const [editTitle, setEditTitle] = useState(getValue());
          return (
            < EditableTextField value={editTitle} onUpdate={(title) => setEditTitle(title)} onEnterPress={() => handleUpdateTaskFieldCell(row.original.id, "title", editTitle)} />)
        }
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
            onUpdate={(date) => handleUpdateTaskFieldCell(row.original.id, "expected_start_date", date)}
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
    [handleUpdateTaskFieldCell, users,data]
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
    loadingFilterTasks 
    || loadingMyTasks ||
    loadingTasks
  ) {
    let loadingMessage = "Loading tasks...";
    if (isCreatingTask) loadingMessage = "Creating task...";
    if (isUpdatingTask) loadingMessage = "Updating task...";
    if(loadingFilterTasks) loadingMessage = "Filtering tasks..."
    content = (
      <Loader message={loadingMessage} error={tasksError} />
    )
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
          {" "}
          <table className="w-full text-sm table-fixed">
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
              { data.length==0 &&
                !isAddingNewTask &&
                !showTopLevelAddTaskButton &&
                !loadingTasks &&
                !isCreatingTask &&
                !isUpdatingTask && !loadingFilterTasks && (
                    <tr style={{ height: `${ROW_HEIGHT * 2}px` }}>
                      <td
                        colSpan={mainTableColumns.length}
                        className="text-center text-gray-500 p-4"
                      >
                        {isFiltered ? "Try adjusting Filters":""
                        }
                        "No tasks available"
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
                      validator={validator}
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
                      validator={validator}
                      min={new Date().toISOString().split("T")[0]}
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
                      validator={validator}
                      min={newTaskStartDate}
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
      </>
    );
  }

  const renderError = localError ? (
    <div className="mt-2 p-2 text-red-700 b text-sm">
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
      {data.length > 0 && (
        <div className=" flex items-center justify-start gap-4 mt-4 text-[12px]">
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-red-600 disabled:opacity-30"
          >
            {"<"}
          </button>

          {/* Page Numbers (Sliding Window of 3) */}
          {(() => {
            const totalPages = table.getPageCount();
            const currentPage = table.getState().pagination.pageIndex;
            const visiblePages = 3;

            let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
            let end = start + visiblePages;

            // Ensure end does not exceed total pages
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

          {/* Next Button */}
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