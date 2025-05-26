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

import {fetchTasks, createTask} from "../../../redux/slices/taskSlice";
import { fetchUsers } from "../../../redux/slices/userSlice";
import SelectBox from "../../SelectBox";


const fetchSubtasksAPI = async (parentId) => {
  console.log(`MOCK API: Fetching subtasks for ${parentId}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (parentId === 1 || parentId === "1" || String(parentId).startsWith("T-01") || String(parentId).includes("TEMP_TASK")) {
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
const globalStatusOptions = ["Open", "In Progress", "Completed", "On Hold"];

const EditableTextField = ({ value, onUpdate, rowId, columnId, saveRow, inputRef, isNewRow }) => {
    const [localValue, setLocalValue] = useState(value);
    useEffect(() => { setLocalValue(value); }, [value]);
    const handleKeyDown = (event) => { if (event.key === "Enter") { event.preventDefault(); onUpdate(localValue, rowId, columnId); saveRow(rowId); } };
    const handleBlur = () => {
      if (!isNewRow) { onUpdate(localValue, rowId, columnId); }
    };
    return (<input ref={inputRef} type="text" value={localValue || ""} onChange={(e) => setLocalValue(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="focus:outline-none w-full h-full p-1 rounded text-sm" />);
};

const DateEditor = ({ value, onUpdate, rowId, columnId, saveRow, isNewRow }) => {
    const [date, setDate] = useState(value ? new Date(value).toISOString().split("T")[0] : "");
    useEffect(() => { setDate(value ? new Date(value).toISOString().split("T")[0] : ""); }, [value]);
    const handleKeyDown = (event) => { if (event.key === "Enter") { event.preventDefault(); onUpdate(date ? new Date(date).toLocaleDateString("en-CA") : null, rowId, columnId); saveRow(rowId); } };
    const handleBlur = () => {
      if (!isNewRow) {
        onUpdate(date ? new Date(date).toLocaleDateString("en-CA") : null, rowId, columnId);
        saveRow(rowId);
      }
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

const createNewTask = () => ({
  id: `TEMP_TASK-${Date.now()}`, taskTitle: "", status: "Open", responsiblePerson: "Unassigned",
  startDate: null, endDate: null, duration: "0d:0h:0m", priority: "None", predecessor: "", successor: "",
  isEditing: true, isNew: true, hasSubtasks: false, subRowsLoaded: true, subRows: [],
});

const findTaskByIdRecursive = (tasks, id) => {
  for (const task of tasks) {
    if (task.id === id) return task;
    if (task.subRows?.length) { const found = findTaskByIdRecursive(task.subRows, id); if (found) return found; }
  }
  return null;
};

const TaskTable = () => {
  const dispatch = useDispatch();
  const {
    loading: loadingTasks,
    error: tasksError,
    fetchTasks: tasksFromStore,
  } = useSelector((state) => state.fetchTasks );

  const {
    users = [],
    loading: loadingUsers,
    error: usersFetchError,
  } = useSelector((state) => state.user || { users: [], loading: false, error: null });

  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const newRowFirstInputRef = useRef(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const rowRefs = useRef({});
  const [loadingSubtasksForRow, setLoadingSubtasksForRow] = useState({});
  const [localError, setLocalError] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const MIN_DISPLAY_ROWS = 10;
  const ROW_HEIGHT = 40;
  const HEADER_HEIGHT = 40;

  useEffect(() => {
    if (typeof fetchTasks === 'function' && fetchTasks.pending) {
        dispatch(fetchTasks());
    } else { console.warn("`WorkspaceTasks` (from taskSlice) may not be the expected async thunk."); }

    if (typeof fetchUsers === 'function' && (fetchUsers.pending || (Array.isArray(users) && users.length === 0))) {
        dispatch(fetchUsers());
    } else if (typeof fetchUsers !== 'function' || !fetchUsers.pending){
        console.warn("`WorkspaceUsers` (from userSlice) may not be the expected async thunk.");
    }
  }, [dispatch, users]);

  useEffect(() => {
    if (tasksFromStore && Array.isArray(tasksFromStore)) {
      const processedTasks = tasksFromStore.map((task) => ({
        id: task.id || `generated-${Math.random()}`,
        taskTitle: task.title,
        status: task.status,
        responsiblePerson: task.responsible_person_name || "Unassigned",
        startDate: task.started_date,
        endDate: task.target_date,
        priority: task.priority,
        duration: calculateDuration(task.started_date, task.target_date),
        hasSubtasks: task.has_children !== undefined ? task.has_children : true,
        subRowsLoaded: false,
        subRows: [],
        isEditing: false, isNew: false,
        predecessor: task.predecessor || "", successor: task.successor || "",
      }));
      setData(processedTasks);
      setLocalError(null);
    } else if (tasksError) { setData([]); }
  }, [tasksFromStore, tasksError]);

  useEffect(() => {
    if (newRowFirstInputRef.current && editingRowId) {
      const newOrEditingTask = findTaskByIdRecursive(data, editingRowId);
      if (newOrEditingTask?.isNew) newRowFirstInputRef.current.focus();
    }
  }, [data, editingRowId]);

  const stableSetData = useCallback(setData, []);

  const updateCellData = useCallback((newValue, rowId, columnId) => {
    stableSetData(old => old.map(row => {
      if (row.id === rowId) {
        const updated = { ...row, [columnId]: newValue };
        if (columnId === "startDate" || columnId === "endDate") {
          updated.duration = calculateDuration(updated.startDate, updated.endDate);
        }
        return updated;
      }
      return row;
    }));
  }, [stableSetData]);

  const handleFinalizeRow = useCallback((rowIdToFinalize) => {
    const taskToFinalize = findTaskByIdRecursive(data, rowIdToFinalize);

    if (taskToFinalize && taskToFinalize.isNew) {
      const responsibleUser = users.find(u => `${u.firstname || ''} ${u.lastname || ''}`.trim() === taskToFinalize.responsiblePerson);

      const payload = {
        title: taskToFinalize.taskTitle || "New Task",
        status: taskToFinalize.status,
        responsible_person_id: responsibleUser ? responsibleUser.id : null,
        started_date: taskToFinalize.startDate,
        target_date: taskToFinalize.endDate,
        priority: taskToFinalize.priority,
        project_management_id: 1,
      };
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined) { payload[key] = null; }
        if (payload[key] === "" && key !== "title") { payload[key] = null; }
      });
      if (payload.title === null) payload.title = "Untitled Task";

      setIsCreatingTask(true);
      setData(currentData => currentData.filter(task => task.id !== rowIdToFinalize));
      if (rowIdToFinalize === editingRowId) { setEditingRowId(null); }

      dispatch(createTask(payload)).unwrap()
        .then((createdTaskFromServer) => {
          console.log("Task creation successful, re-fetching tasks:", createdTaskFromServer);
          setLocalError(null);
          dispatch(fetchTasks());
        })
        .catch((creationError) => {
          console.error("Task creation failed:", creationError);
          setLocalError(`Failed to create task: ${creationError?.message || 'Server error'}`);
        })
        .finally(() => {
            setIsCreatingTask(false);
        });
    } else if (taskToFinalize) {
      console.log("Finalizing existing task (Update API call needed here):", taskToFinalize.id);
      stableSetData(oldData => oldData.map(r =>
        r.id === rowIdToFinalize ? { ...r, isEditing: false, duration: calculateDuration(r.startDate, r.endDate) } : r
      ));
      if (rowIdToFinalize === editingRowId) { setEditingRowId(null); }
    }
  }, [dispatch, data, editingRowId, stableSetData, setData, users, setIsCreatingTask]);

  const addNewTaskOnClick = useCallback(() => {
    const newTask = createNewTask();
    setData(prev => [newTask, ...prev]);
    setEditingRowId(newTask.id);
    setTimeout(() => newRowFirstInputRef.current?.focus(), 0);
  }, [setData, setEditingRowId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!editingRowId) return;
      const el = rowRefs.current[editingRowId];
      if (el && !el.contains(event.target)) {
        const task = findTaskByIdRecursive(data, editingRowId);
        if (task?.isEditing) {
            if (task.isNew && (!task.taskTitle || task.taskTitle.trim() === "")) {
                setData(currentData => currentData.filter(t => t.id !== editingRowId));
                setEditingRowId(null);
            } else { handleFinalizeRow(editingRowId); }
        }
        else if (!task && editingRowId) setEditingRowId(null);
      }
    };
    if (editingRowId) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingRowId, data, handleFinalizeRow, stableSetData, setData]);

  // const loadSubtasksForParent = useCallback(async (parentId, currentTaskRow) => {
  //   if (loadingSubtasksForRow[parentId] || !parentId) return;
  //   setLoadingSubtasksForRow(prev => ({ ...prev, [parentId]: true }));
  //   try {
  //     const subtasksFromServer = await fetchSubtasksAPI(parentId);
  //     const processedSubtasks = subtasksFromServer.map(sub => ({
  //       id: sub.id || `sub-${Math.random()}`, taskTitle: sub.taskTitle || sub.title, status: sub.status,
  //       responsiblePerson: sub.responsiblePerson || sub.responsible_person_name,
  //       startDate: sub.startDate || sub.started_date, endDate: sub.endDate || sub.target_date,
  //       priority: sub.priority, duration: calculateDuration(sub.startDate || sub.started_date, sub.endDate || sub.target_date),
  //       hasSubtasks: sub.hasSubtasks || false, subRowsLoaded: true, subRows: sub.subRows || [],
  //       isEditing: false, isNew: false, predecessor: sub.predecessor || "", successor: sub.successor || "",
  //     }));
  //     setData(current => current.map(task => {
  //       if (task.id === parentId) return { ...task, subRows: processedSubtasks, subRowsLoaded: true, hasSubtasks: processedSubtasks.length > 0 };
  //       return task;
  //     }));
  //     currentTaskRow.toggleExpanded(true);
  //     setLocalError(null);
  //   } catch (err) => {
  //     console.error(`Failed to load subtasks for ${parentId}:`, err);
  //     setLocalError(`Failed to load subtasks for ${parentId}.`);
  //     setData(current => current.map(task => {
  //       if (task.id === parentId) return { ...task, subRowsLoaded: true, hasSubtasks: false };
  //       return task;
  //     }));
  //   } finally {
  //     setLoadingSubtasksForRow(prev => ({ ...prev, [parentId]: false }));
  //   }
  // }, [loadingSubtasksForRow, setData]);

  const columns = useMemo(() => [
    {
      id: "expander", header: () => null, size: 40,
      cell: ({ row }) => {
        const canExpand = row.original.hasSubtasks;
        return canExpand ? (
          <button onClick={() => { if (!row.original.subRowsLoaded && !row.getIsExpanded()) loadSubtasksForParent(row.original.id, row); else row.getToggleExpandedHandler()(); }}
            style={{ cursor: "pointer", paddingLeft: `${row.depth * 1}rem` }} className="flex items-center justify-center w-full h-full" aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}>
            {row.getIsExpanded() ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
          </button>
        ) : <span style={{ paddingLeft: `${row.depth * 1 + 0.5}rem` }} className="flex items-center justify-center w-full h-full">&nbsp;</span>;
      },
    },
     {
        accessorKey: "id", header: "Task Id", size: 100,
        cell: ({ row, getValue }) => {
            if (row.original.isNew) {
                return <span style={{ paddingLeft: `${row.depth * 0.5}rem` }} className="p-1 text-gray-400">---</span>;
            }
            let originalId = String(getValue() || '');
            let displayId = ''; let linkIdPart = originalId;
            if (originalId.startsWith('TEMP_TASK-')) {
                const coreId = originalId.substring('TEMP_TASK-'.length); displayId = `T-${coreId}`; linkIdPart = coreId;
            } else if (originalId.startsWith('T-')) {
                displayId = originalId; linkIdPart = originalId.substring(2);
            } else { displayId = `T-${originalId}`; }
            if(linkIdPart.startsWith('T-')) linkIdPart = linkIdPart.substring(2);
            return (<Link to={`/tasks/${linkIdPart}`} className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-1"><span style={{ paddingLeft: `${row.depth * 0.5}rem` }}>{displayId}</span></Link>);
        }
    },
    {
        accessorKey: "taskTitle", header: "Task Title", size: 250,
        cell: ({ row, getValue, column, table }) => {
            const titleContent = (<span onClick={() => { if (row.original.hasSubtasks && !row.original.isEditing) { if (!row.original.subRowsLoaded && !row.getIsExpanded()) loadSubtasksForParent(row.original.id, row); else row.getToggleExpandedHandler()(); }}} className={row.original.hasSubtasks && !row.original.isEditing ? "cursor-pointer hover:underline" : ""} style={{ paddingLeft: `${!row.original.hasSubtasks && row.depth > 0 ? 1 : 0.3}rem`}}>{getValue()}</span>);
            return row.original.isEditing ? <EditableTextField isNewRow={row.original.isNew} inputRef={row.original.isNew ? newRowFirstInputRef : null} value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> : titleContent;
        },
    },
    { accessorKey: "status", header: "Status", size: 120, cell: ({ getValue }) => (<StatusBadge status={getValue()} statusOptions={globalStatusOptions} />) },
    {
        accessorKey: "responsiblePerson", header: "Responsible Person", size: 150,
        cell: ({ row, getValue, column, table }) => {
            const currentResponsiblePersonName = getValue();
            if (row.original.isEditing) {
                const selectBoxOptions = users.map(user => ({
                    value: user.id,
                    label: `${user.firstname || ''} ${user.lastname || ''}`.trim() || "Unknown User"
                }));

                const selectedUser = users.find(user => (`${user.firstname || ''} ${user.lastname || ''}`.trim()) === currentResponsiblePersonName);
                const valueForSelectBox = selectedUser ? selectedUser.id : (currentResponsiblePersonName === "Unassigned" || !currentResponsiblePersonName ? "" : null);

                return (
                    <div className="w-full text-[12px]" tabIndex={-1}>
                        <SelectBox
                            options={[{ value: "", label: "Unassigned" }, ...selectBoxOptions]}
                            value={valueForSelectBox}
                            onChange={(selectedOption) => {
                                const newName = selectedOption ? selectedOption.label : "Unassigned";
                                table.options.meta?.updateCellData(newName, row.original.id, column.id);
                            }}
                            placeholder="Select Person..."
                        />
                    </div>
                );
            }
            return currentResponsiblePersonName || <span className="text-gray-400">Unassigned</span>;
        }
    },
    {
        accessorKey: "startDate", header: "Start Date", size: 130,
        cell: ({ row, getValue, column, table }) => row.original.isEditing ? <DateEditor isNewRow={row.original.isNew} value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> : ((getValue() ? new Date(getValue()).toLocaleDateString() : null) || <span className="text-gray-400 p-1">Select</span>),
    },
    {
        accessorKey: "endDate", header: "End Date", size: 130,
        cell: ({ row, getValue, column, table }) => row.original.isEditing ? <DateEditor isNewRow={row.original.isNew} value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> : ((getValue() ? new Date(getValue()).toLocaleDateString() : null) || <span className="text-gray-400 p-1">Select</span>),
    },
    { accessorKey: "duration", header: "Duration", size: 120, cell: ({ getValue }) => <span className="text-xs">{getValue()}</span> },
    { accessorKey: "priority", header: "Priority", size: 110, cell: ({ getValue }) => (<StatusBadge status={getValue()} statusOptions={globalPriorityOptions} />) },
    {
        accessorKey: "predecessor", header: "Predecessor", size: 100,
        cell: ({ row, getValue, column, table }) => row.original.isEditing ? <EditableTextField isNewRow={row.original.isNew} value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> : <span className="text-xs p-1">{getValue()}</span>,
    },
    {
        accessorKey: "successor", header: "Successor", size: 100,
        cell: ({ row, getValue, column, table }) => row.original.isEditing ? <EditableTextField isNewRow={row.original.isNew} value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> : <span className="text-xs p-1">{getValue()}</span>,
    },
  ], [editingRowId, handleFinalizeRow, updateCellData, loadingSubtasksForRow, users]);

  const table = useReactTable({
    data, columns, state: { expanded }, onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows, getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(), meta: { updateCellData, handleFinalizeRow },
  });

  const canShowAddPlaceholder = !data.some(r => r.isNew || r.isEditing || (r.subRows?.some(sr => sr.isNew || sr.isEditing)));
  const showTopLevelAddTaskButton = !editingRowId && canShowAddPlaceholder && !loadingTasks && !tasksError && !isCreatingTask;
  const actualDataRows = table.getRowModel().rows;
  const effectiveRowCountForHeight = actualDataRows.length + (showTopLevelAddTaskButton ? 1 : 0);
  const numEmptyRowsToFill = Math.max(0, MIN_DISPLAY_ROWS - effectiveRowCountForHeight);
  const totalRowsForHeightCalc = Math.max(MIN_DISPLAY_ROWS, effectiveRowCountForHeight);
  const desiredTableHeight = totalRowsForHeightCalc * ROW_HEIGHT + HEADER_HEIGHT;

  if (loadingTasks && !data.length && !isCreatingTask) {
    return <div className="p-4 flex justify-center items-center min-h-[200px]"><ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" /> Loading tasks...</div>;
  }

  if (tasksError && !data.length) {
    return <div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded min-h-[100px]"><strong>Error fetching tasks:</strong> {typeof tasksError === 'object' ? JSON.stringify(tasksError) : String(tasksError)}</div>;
  }
  if (usersFetchError && (!users || users.length === 0)) {
      console.error("Error fetching users:", usersFetchError);
  }
  if (localError) {
      console.warn("Local error displayed:", localError);
  }


  return (
    <div className="p-2">
      <div className="table-wrapper border-none overflow-x-auto" style={{ minHeight: `${desiredTableHeight}px` }}>
        <table className="w-full table-auto text-sm table-fixed">
          <thead className="sticky top-0 bg-gray-50 z-20">
            {table.getHeaderGroups().map(hg => <tr key={hg.id}>{hg.headers.map(h => <th key={h.id} style={{ width: `${h.getSize()}px` }} className="border-r-2 p-2 text-center text-gray-600 font-semibold break-words">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</th>)}</tr>)}
          </thead>
          <tbody className="bg-white">
            {(actualDataRows.length === 0 && !showTopLevelAddTaskButton) && (!loadingTasks && !loadingUsers && !isCreatingTask) && (<tr style={{ height: `${ROW_HEIGHT*2}px` }}><td colSpan={columns.length} className="text-center text-gray-500 p-4">No tasks available.</td></tr>)}
            {actualDataRows.map(row => (
              <Fragment key={row.id}>
                <tr
                  ref={el => { if (el) rowRefs.current[row.original.id] = el; }}
                  className={`hover:bg-gray-50 ${row.getIsExpanded() ? "bg-gray-100" : "even:bg-slate-50"} ${
                    editingRowId === row.original.id ? "relative z-30" : "relative z-10"
                  }`}
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{ width: `${cell.column.getSize()}px`}} className={`border-r-2 text-left p-0 align-middle`}>
                      <div className="h-full w-full flex items-center px-1">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
            {showTopLevelAddTaskButton && (<tr style={{ height: `${ROW_HEIGHT}px` }}><td colSpan={columns.length} className="border text-left text-[12px]"><button onClick={addNewTaskOnClick} className="text-red-500 hover:underline text-sm px-2 py-1">+ Click here to add a new task</button></td></tr>)}
            {Array.from({ length: numEmptyRowsToFill }).map((_, i) => <tr key={`empty-${i}`} style={{ height: `${ROW_HEIGHT}px` }}><td colSpan={columns.length} className="border-r-2 p-2">&nbsp;</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;