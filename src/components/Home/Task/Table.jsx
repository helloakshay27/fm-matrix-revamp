import React, {
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
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import StatusBadge from "../Projects/statusBadge";
import { ChevronDownIcon, ChevronRightIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";

import { fetchTasks, createTask } from "../../../redux/slices/taskSlice";
import { fetchUsers } from "../../../redux/slices/userSlice";
import SelectBox from "../../SelectBox";


const fetchSubtasksAPI = async (parentId) => {
  console.log(`MOCK API: Fetching subtasks for ${parentId}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (parentId === 1 || parentId === "1" || String(parentId).startsWith("T-01")) {
        resolve([
          {
            id: `${parentId}-S1`, taskTitle: `Subtask 1 for Task ${parentId} (Loaded)`, status: "In Progress",
            responsiblePerson: "Duhita Raut", startDate: "2025-01-01", endDate: "2025-01-02",
            priority: "Urgent", predecessor: parentId.toString(), hasSubtasks: false, subRowsLoaded: true, subRows: [],
          },
        ]);
      } else { resolve([]); }
    }, 1000);
  });
};

const globalPriorityOptions = ["None", "Low", "Medium", "High", "Urgent"];
const globalStatusOptions = ["open", "in_progress", "completed", "on_hold"];

const EditableTextField = ({ value, onUpdate, inputRef, isNewRow, onEnterPress }) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onUpdate(localValue); // Update the state with the current local value
      onEnterPress(); // Then call the Enter press handler (e.g., save)
    }
  };
  const handleBlur = () => {
    onUpdate(localValue); // Update dedicated state on blur
  };
  return (<input ref={inputRef} type="text" value={localValue || ""} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="focus:outline-none w-full h-full p-1 rounded text-sm" />);
};

const DateEditor = ({ value, onUpdate, isNewRow, onEnterPress }) => {
  const [date, setDate] = useState(value ? new Date(value).toISOString().split("T")[0] : "");
  useEffect(() => { setDate(value ? new Date(value).toISOString().split("T")[0] : ""); }, [value]);
  const formattedDate = date ? new Date(date).toLocaleDateString("en-CA") : null;
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onUpdate(formattedDate);
      onEnterPress();
    }
  };
  const handleBlur = () => {
    onUpdate(formattedDate);
  };
  return (<input type="date" value={date} onChange={(e) => setDate(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="w-full focus:outline-none rounded text-sm" placeholder="Select date" />);
};

const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return "0d:0h:0m";
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) return "0d:0h:0m";
  let ms = endDate.getTime() - startDate.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(ms / (1000 * 60));
  return `${days}d:${hours}h:${minutes}m`;
};

const TaskTable = () => {
  const dispatch = useDispatch();
  const {
    loading: loadingTasks,
    error: tasksError,
    fetchTasks: tasksFromStore,
  } = useSelector((state) => state.fetchTasks);

  const {
    users = [],
    loading: loadingUsers,
    error: usersFetchError,
  } = useSelector((state) => state.user || { users: [], loading: false, error: null });

  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});

  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("open"); // Default to 'open'
  const [newTaskResponsiblePersonId, setNewTaskResponsiblePersonId] = useState(null);
  const [newTaskStartDate, setNewTaskStartDate] = useState("");
  const [newTaskEndDate, setNewTaskEndDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("None");

  const newTaskTitleInputRef = useRef(null);
  const newTaskFormRowRef = useRef(null);

  const [loadingSubtasksForRow, setLoadingSubtasksForRow] = useState({});
  const [localError, setLocalError] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const MIN_DISPLAY_ROWS = 10;
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 40;

  const createNewTaskDefaults = useCallback(() => ({ // Encapsulate defaults
    taskTitle: "", status: "open", responsiblePersonId: null,
    startDate: "", endDate: "", priority: "None",
  }), []);


  useEffect(() => {
    if (!loadingTasks && (!tasksFromStore || tasksFromStore.length === 0) && !isCreatingTask) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasksFromStore, loadingTasks, isCreatingTask]);

  useEffect(() => {
    const usersArray = users || [];
    if (!loadingUsers && usersArray.length === 0 && !isCreatingTask) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isCreatingTask]);

  useEffect(() => {
    if (isCreatingTask) return;

    if (tasksFromStore && Array.isArray(tasksFromStore)) {
      const newProcessedData = tasksFromStore.map((task) => ({
        id: task.id,
        taskTitle: task.title,
        status: task.status,
        responsiblePerson: task.responsible_person?.name || "Unassigned", // Use ?. for safety
        startDate: task.started_at, // Use started_at from user's code
        endDate: task.target_date,
        priority: task.priority,
        duration: calculateDuration(task.started_at, task.target_date),
        hasSubtasks: task.has_children !== undefined ? task.has_children : true,
        subRowsLoaded: false, subRows: [],
        predecessor: task.predecessor || "", successor: task.successor || "",
      }));
      setData(newProcessedData);
      setLocalError(null);
    } else if (tasksError && !tasksFromStore) {
      setData([]);
    }
  }, [tasksFromStore, tasksError, isCreatingTask]);

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
    if (isCreatingTask || isAddingNewTask) return;
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
      project_management_id: 1,
      responsible_person_id: newTaskResponsiblePersonId,
      started_at: newTaskStartDate || null, // Using started_at as per user's code processing tasks
      target_date: newTaskEndDate || null,
      priority: newTaskPriority,
    };

    setIsCreatingTask(true);
    setIsAddingNewTask(false);

    dispatch(createTask(taskAttributes)).unwrap()
      .then(() => {
        resetNewTaskForm();
        return dispatch(fetchTasks()).unwrap();
      })
      .catch((error) => {
        console.error("Task creation failed:", error);
        setLocalError(`Task creation failed: ${error?.response?.data?.errors || error?.message || 'Server error'}`);
        setIsAddingNewTask(true);
      })
      .finally(() => {
        setIsCreatingTask(false);
      });
  }, [dispatch, newTaskTitle, newTaskStatus, newTaskResponsiblePersonId, newTaskStartDate, newTaskEndDate, newTaskPriority, resetNewTaskForm]);


  useEffect(() => {
    const handleClickOutsideNewTaskRow = (event) => {
      if (!isAddingNewTask || isCreatingTask || !newTaskFormRowRef.current || newTaskFormRowRef.current.contains(event.target)) {
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
  }, [isAddingNewTask, isCreatingTask, newTaskTitle, handleSaveNewTask, resetNewTaskForm]);


  const loadSubtasksForParent = useCallback(async (parentId, currentTaskRow) => {
    if (loadingSubtasksForRow[parentId] || !parentId) return;
    setLoadingSubtasksForRow(prev => ({ ...prev, [parentId]: true }));
    try {
      const subtasksFromServer = await fetchSubtasksAPI(parentId);
      const processedSubtasks = subtasksFromServer.map(sub => ({
        id: sub.id || `sub-${Math.random()}`, taskTitle: sub.taskTitle || sub.title, status: sub.status,
        responsiblePerson: sub.responsiblePerson, startDate: sub.startDate, endDate: sub.endDate,
        priority: sub.priority, duration: calculateDuration(sub.startDate, sub.endDate),
        hasSubtasks: sub.hasSubtasks || false, subRowsLoaded: true, subRows: sub.subRows || [],
      }));
      setData(current => current.map(task => {
        if (task.id === parentId) return { ...task, subRows: processedSubtasks, subRowsLoaded: true, hasSubtasks: processedSubtasks.length > 0 };
        return task;
      }));
      currentTaskRow.toggleExpanded(true);
      setLocalError(null);
    } catch (err) {
      console.error(`Failed to load subtasks for ${parentId}:`, err);
      setLocalError(`Failed to load subtasks for ${parentId}.`);
      setData(current => current.map(task => {
        if (task.id === parentId) return { ...task, subRowsLoaded: true, hasSubtasks: false };
        return task;
      }));
    } finally {
      setLoadingSubtasksForRow(prev => ({ ...prev, [parentId]: false }));
    }
  }, [loadingSubtasksForRow, setData]);

  const mainTableColumns = useMemo(() => [
    {
      id: "expander", header: () => null, size: 40, cell: ({ row }) => {
        const canExpand = row.original.hasSubtasks;
        return canExpand ? (
          <button onClick={() => { if (!row.original.subRowsLoaded && !row.getIsExpanded()) loadSubtasksForParent(row.original.id, row); else row.getToggleExpandedHandler()(); }}
            style={{ cursor: "pointer", paddingLeft: `${row.depth * 1}rem` }} className="flex items-center justify-center w-full h-full" aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}>
            {row.getIsExpanded() ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
          </button>
        ) : <span style={{ paddingLeft: `${row.depth * 1 + 0.5}rem` }} className="flex items-center justify-center w-full h-full">&nbsp;</span>;
      }
    },
    {
      accessorKey: "id", header: "Task Id", size: 100, cell: ({ getValue }) => {
        let originalId = String(getValue() || '');
        let displayId = ''; let linkIdPart = originalId;
        if (originalId.startsWith('T-')) { displayId = originalId; linkIdPart = originalId.substring(2); }
        else { displayId = `T-${originalId}`; }
        return (<Link to={`/tasks/${linkIdPart}`} className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-1"><span >{displayId}</span></Link>);
      }
    },
    { accessorKey: "taskTitle", header: "Task Title", size: 250, cell: ({ getValue }) => <span className="truncate">{getValue()}</span> },
    { accessorKey: "status", header: "Status", size: 120, cell: ({ getValue }) => (<StatusBadge status={getValue()} statusOptions={globalStatusOptions} />) },
    {
      accessorKey: "responsiblePerson", header: "Responsible Person", size: 150, cell: ({ getValue }) => {
        const name = getValue();
        return name || <span className="text-gray-400">Unassigned</span>;
      }
    },
    { accessorKey: "startDate", header: "Start Date", size: 130, cell: ({ getValue }) => ((getValue() ? new Date(getValue()).toLocaleDateString() : null) || <span className="text-gray-400 p-1">Select</span>) },
    { accessorKey: "endDate", header: "End Date", size: 130, cell: ({ getValue }) => ((getValue() ? new Date(getValue()).toLocaleDateString() : null) || <span className="text-gray-400 p-1">Select</span>) },
    { accessorKey: "duration", header: "Duration", size: 120, cell: ({ getValue }) => <span className="text-xs">{getValue()}</span> },
    { accessorKey: "priority", header: "Priority", size: 110, cell: ({ getValue }) => (<StatusBadge status={getValue()} statusOptions={globalPriorityOptions} />) },
    { accessorKey: "predecessor", header: "Predecessor", size: 100, cell: ({ getValue }) => <span className="text-xs p-1">{getValue()}</span> },
    { accessorKey: "successor", header: "Successor", size: 100, cell: ({ getValue }) => <span className="text-xs p-1">{getValue()}</span> },
  ], [loadSubtasksForParent, loadingSubtasksForRow]);

  const table = useReactTable({
    data, columns: mainTableColumns, state: { expanded }, onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows, getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const showTopLevelAddTaskButton = !isAddingNewTask && !isCreatingTask && !loadingTasks && !tasksError;
  const actualDataRows = table.getRowModel().rows;
  let displayedRowCount = actualDataRows.length + (isAddingNewTask ? 1 : 0);
  if (showTopLevelAddTaskButton && !isAddingNewTask) displayedRowCount++;

  const numEmptyRowsToFill = Math.max(0, MIN_DISPLAY_ROWS - displayedRowCount);
  const totalRowsForHeightCalc = Math.max(MIN_DISPLAY_ROWS, displayedRowCount);
  const desiredTableHeight = totalRowsForHeightCalc * ROW_HEIGHT + HEADER_HEIGHT;

  const newTskEnterKeyHandler = (event) => { // Combined Enter key handler for new task row
    if (event.key === "Enter") {
      event.preventDefault();
      handleSaveNewTask();
    }
  };


  let content;
  if (isCreatingTask || (loadingTasks && !data.length && !isAddingNewTask)) {
    content = (<div className="p-4 flex justify-center items-center min-h-[200px]"><ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" /> {isCreatingTask ? 'Creating task...' : 'Loading tasks...'}</div>);
  } else if (tasksError && !data.length) {
    content = (<div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded min-h-[100px]"><strong>Error fetching tasks:</strong> {typeof tasksError === 'object' ? JSON.stringify(tasksError) : String(tasksError)}</div>);
  } else {
    content = (
      <div className="table-wrapper border-none overflow-x-auto" style={{ minHeight: `${desiredTableHeight}px`, maxHeight: '80vh', overflowY: 'auto' }}>
        <table className="w-full text-sm table-fixed">
          <thead className="sticky top-0 bg-gray-50">
            {table.getHeaderGroups().map(hg => <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} style={{ width: `${h.getSize()}px` }} className="border-r-2 p-2 text-center text-gray-600 font-semibold break-words">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}
          </thead>
          <tbody className="bg-white">
            {isAddingNewTask && (
              <tr ref={newTaskFormRowRef} style={{ height: `${ROW_HEIGHT}px` }} className="border-b relative z-30"> {/* No specific bg, higher z-index if needed */}
                <td className="p-0 align-middle border-r-2"></td>
                <td className="p-0 align-middle border-r-2 text-gray-400"><div className="h-full w-full flex items-center px-1">---</div></td>
                <td className="p-0 align-middle border-r-2"><EditableTextField value={newTaskTitle} onUpdate={setNewTaskTitle} inputRef={newTaskTitleInputRef} isNewRow={true} onEnterPress={handleSaveNewTask} /></td>
                <td className="p-0 align-middle border-r-2"><StatusBadge status={newTaskStatus} statusOptions={globalStatusOptions} onStatusChange={setNewTaskStatus} /></td>
                <td className="p-0 align-middle border-r-2">
                  <SelectBox options={[{ value: null, label: "Unassigned" }, ...users.map(u => ({ value: u.id, label: `${u.firstname || ''} ${u.lastname || ''}`.trim() }))]} value={newTaskResponsiblePersonId} onChange={(selectedId) => setNewTaskResponsiblePersonId(selectedId)} placeholder="Select Person..." />
                </td>
                <td className="p-0 align-middle border-r-2"><DateEditor value={newTaskStartDate} onUpdate={setNewTaskStartDate} isNewRow={true} onEnterPress={handleSaveNewTask} /></td>
                <td className="p-0 align-middle border-r-2"><DateEditor value={newTaskEndDate} onUpdate={setNewTaskEndDate} isNewRow={true} onEnterPress={handleSaveNewTask} /></td>
                <td className="p-0 align-middle border-r-2 text-xs"><div className="h-full w-full flex items-center px-1">{calculateDuration(newTaskStartDate, newTaskEndDate)}</div></td>
                <td className="p-0 align-middle border-r-2"><StatusBadge status={newTaskPriority} statusOptions={globalPriorityOptions} onStatusChange={setNewTaskPriority} /></td>
                <td className="p-0 align-middle border-r-2"></td>
                <td className="p-0 align-middle border-r-2">
                  <button onClick={handleSaveNewTask} className="text-green-500 hover:text-green-700 p-1 text-xs">Save</button>
                  <button onClick={handleCancelNewTask} className="text-red-500 hover:text-red-700 p-1 text-xs">Cancel</button>
                </td>
              </tr>
            )}
            {(actualDataRows.length === 0 && !isAddingNewTask && !showTopLevelAddTaskButton && !loadingTasks && !isCreatingTask) && (<tr style={{ height: `${ROW_HEIGHT * 2}px` }}><td colSpan={mainTableColumns.length} className="text-center text-gray-500 p-4">No tasks available.</td></tr>)}
            {actualDataRows.map(row => (
              <Fragment key={row.id}>
                <tr className={`hover:bg-gray-50 ${row.getIsExpanded() ? "bg-gray-100" : "even:bg-slate-50"} relative z-1`} style={{ height: `${ROW_HEIGHT}px` }} >
                  {row.getVisibleCells().map(cell => (<td key={cell.id} style={{ width: `${cell.column.getSize()}px` }} className={`border-r-2 text-left p-0 align-middle`}><div className="h-full w-full flex items-center px-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div></td>))}
                </tr>
              </Fragment>
            ))}
            {showTopLevelAddTaskButton && (<tr style={{ height: `${ROW_HEIGHT}px` }}><td colSpan={mainTableColumns.length} className="border text-left text-[12px]"><button onClick={handleShowNewTaskForm} className="text-red-500 hover:underline text-sm px-2 py-1">+ Click here to add a new task</button></td></tr>)}
            {Array.from({ length: numEmptyRowsToFill }).map((_, i) => <tr key={`empty-${i}`} style={{ height: `${ROW_HEIGHT}px` }}><td colSpan={mainTableColumns.length} className="border-r-2 p-2">&nbsp;</td></tr>)}
          </tbody>
        </table>
      </div>
    );
  }

  if (usersFetchError && (!users || users.length === 0)) { console.error("Error fetching users for dropdown:", usersFetchError); }
  if (localError) { console.warn("Local error occurred:", localError); }
  if (loadingUsers && (!users || users.length === 0)) { console.log("Loading users for dropdown..."); }

  return (<div className="p-2">{content}</div>);
};

export default TaskTable;