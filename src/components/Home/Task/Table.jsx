import React, { useState, useEffect, useMemo, useRef, Fragment, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getExpandedRowModel,
} from '@tanstack/react-table';
import StatusBadge from "../Projects/statusBadge"; // Assuming this path is correct
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'; // Keep if UserCustomDropdown needs it
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react'; // Keep for UserCustomDropdown
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid'; // PlusCircleIcon removed as Add Subtask button is gone
import { Link } from 'react-router-dom';

// --- UserCustomDropdown, EditableTextField, DateEditor, calculateDuration ---
// (These components are assumed to be defined as in your original functional code)
// For brevity, I'm not re-listing UserCustomDropdown, EditableTextField, DateEditor here.
// Ensure UserCustomDropdown is correctly defined as it was in your first (working) snippet.

const UserCustomDropdown = ({ options, value, onChange, onKeyDown, setListboxOpen }) => {
  const [selectedOption, setSelectedOption] = useState(value);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedOption(value);
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option);
  };

  return (
    <div className="relative w-full text-[12px]" onKeyDown={onKeyDown}>
      <Listbox value={selectedOption} onChange={handleSelect}>
        {({ open }) => {
          useEffect(() => {
            if (setListboxOpen) setListboxOpen(open);
          }, [open, setListboxOpen]);
          return (
            <div className="relative rounded-md">
              <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm min-h-[38px]">
                {selectedOption === "Unassigned" ?
                  <span className="block truncate"><i>{selectedOption}</i></span> :
                  <span className="block truncate">{selectedOption || `Select...`}</span>}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </ListboxButton>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <ListboxOptions className="absolute mt-1 p-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-[12px] z-50">
                  <div className="sticky top-0 bg-white px-1 py-1 m-1 z-10">
                    <div className="flex items-center border border-gray-300 rounded-md p-1">
                      <SearchOutlinedIcon style={{ color: 'red' }} className="mr-1 h-4 w-4" />
                      <input
                        type="text"
                        placeholder={`Search...`}
                        className="w-full text-[12px] focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  {filteredOptions.map((option) => (
                    <ListboxOption
                      key={option}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${active ? 'bg-[#C72030] text-white' : 'text-gray-900'}`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {option}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                  {filteredOptions.length === 0 && (
                    <div className="text-gray-500 px-3 py-2">No options found</div>
                  )}
                </ListboxOptions>
              </Transition>
            </div>
          )
        }}
      </Listbox>
    </div>
  );
};

const responsiblePersonOptions = ['Alice A', 'Bob B', 'Charlie C', 'Duhita Raut', 'Unassigned', 'Abdul Ghaffar'];
const globalPriorityOptions = ['None', 'Low', 'Medium', 'High', 'Urgent'];
const globalStatusOptions = ['Open', 'In Progress', 'Completed', 'On Hold'];

const EditableTextField = ({ value, onUpdate, rowId, columnId, saveRow, inputRef }) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') { event.preventDefault(); onUpdate(localValue, rowId, columnId); saveRow(rowId); }
  };
  const handleBlur = () => onUpdate(localValue, rowId, columnId);
  return <input ref={inputRef} type="text" value={localValue} onChange={e => setLocalValue(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="focus:outline-none w-full h-full p-1 rounded text-sm"/>;
};

const DateEditor = ({ value, onUpdate, rowId, columnId, saveRow }) => {
  const [date, setDate] = useState(value ? new Date(value).toISOString().split('T')[0] : '');
  useEffect(() => { setDate(value ? new Date(value).toISOString().split('T')[0] : ''); }, [value]);
  const handleKeyDown = (event) => { if (event.key === 'Enter') { event.preventDefault(); onUpdate(date ? new Date(date).toLocaleDateString('en-CA') : null, rowId, columnId); saveRow(rowId); }};
  const handleBlur = () => { onUpdate(date ? new Date(date).toLocaleDateString('en-CA') : null, rowId, columnId);};
  return <input type="date" value={date} onChange={e => setDate(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="w-full focus:outline-none rounded text-sm" placeholder="Select date"/>;
};

const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) { return '0d:0h:0m:0s'; }
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) { return '0d:0h:0m:0s'; }
  let ms = endDate.getTime() - startDate.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(ms / (1000 * 60));
  ms -= minutes * (1000 * 60);
  const seconds = Math.floor(ms / 1000);
  return `${days}d:${hours}h:${minutes}m:${seconds}s`;
};


const initialTasksData = [
  {
    id: 'T-01', taskTitle: 'Task 1 (Expandable)', status: 'Open', responsiblePerson: 'Abdul Ghaffar', startDate: '2025-01-01', endDate: '2025-01-03', duration: '0d:0h:0m:0s', priority: 'High',
    predecessor: '', successor: '02', isEditing: false, isNew: false,
    subRows: [
      { id: 'T-01-S1', taskTitle: 'Subtask 1 for Task 1', status: 'In Progress', responsiblePerson: 'Duhita Raut', startDate: '2025-01-01', endDate: '2025-01-02', duration: '0d:0h:0m:0s', priority: 'Urgent', predecessor: '01', successor: '', isEditing: false, isNew: false },
      { id: 'T-01-S2', taskTitle: 'Subtask 2 for Task 1', status: 'Open', responsiblePerson: 'Charlie C', startDate: '2025-01-02', endDate: '2025-01-03', duration: '0d:0h:0m:0s', priority: 'Medium', predecessor: '01', successor: '', isEditing: false, isNew: false },
    ],
  },
  {
    id: 'T-02', taskTitle: 'Task 2 (Not Expandable)', status: 'Completed', responsiblePerson: 'Alice A', startDate: '2025-01-04', endDate: '2025-01-05', duration: '0d:0h:0m:0s', priority: 'Low',
    predecessor: '', successor: '', isEditing: false, isNew: false, subRows: []
  },
];

// Simplified: Always creates a top-level task
const createNewTask = () => ({
  id: `TASK-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  taskTitle: '', status: 'Open', responsiblePerson: 'Unassigned', startDate: null, endDate: null, duration: '0d:0h:0m:0s', priority: 'None',
  predecessor: '', successor: '', isEditing: true, isNew: true,
  subRows: [], // New tasks are top-level and can have sub-rows later if functionality is re-added
});

// Helper function to find a task by ID recursively (still needed for editing and data updates)
const findTaskByIdRecursive = (tasks, id) => {
    for (const task of tasks) {
        if (task.id === id) return task;
        if (task.subRows) {
            const found = findTaskByIdRecursive(task.subRows, id);
            if (found) return found;
        }
    }
    return null;
};

const TaskTable = () => {
  const [data, setData] = useState(() => initialTasksData.map(task => ({...task, duration: calculateDuration(task.startDate, task.endDate), subRows: task.subRows ? task.subRows.map(sub => ({...sub, duration: calculateDuration(sub.startDate, sub.endDate)})) : [] })));
  const [expanded, setExpanded] = useState({});
  const newRowFirstInputRef = useRef(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const rowRefs = useRef({});
  const [isListboxOpen, setIsListboxOpen] = useState(false);

  const MIN_DISPLAY_ROWS = 10;
  const ROW_HEIGHT = 40; // Example row height, adjust as needed
  const HEADER_HEIGHT = 40; // Example header height

  useEffect(() => {
    if (newRowFirstInputRef.current && editingRowId) {
      const newOrEditingTask = findTaskByIdRecursive(data, editingRowId);
      if (newOrEditingTask && newOrEditingTask.isNew) {
        newRowFirstInputRef.current.focus();
      }
      newRowFirstInputRef.current = null; 
    }
  }, [data, editingRowId]);

  const stableSetData = useCallback(setData, []);

  const updateCellData = useCallback((newValue, rowId, columnId) => {
    const updateRecursively = (rows) => {
      return rows.map(row => {
        if (row.id === rowId) {
          const updatedRow = { ...row, [columnId]: newValue };
          if (columnId === 'startDate' || columnId === 'endDate') {
            updatedRow.duration = calculateDuration( columnId === 'startDate' ? newValue : updatedRow.startDate, columnId === 'endDate' ? newValue : updatedRow.endDate );
          }
          return updatedRow;
        }
        if (row.subRows && row.subRows.length > 0) { return { ...row, subRows: updateRecursively(row.subRows) }; }
        return row;
      });
    };
    stableSetData(oldData => updateRecursively(oldData));
  }, [stableSetData]);

  const handleFinalizeRow = useCallback((rowIdToFinalize) => {
    const finalizeRecursively = (rows) => {
      return rows.map(r => {
        if (r.id === rowIdToFinalize) {
          const currentStartDate = r.startDate; const currentEndDate = r.endDate;
          const updatedDuration = calculateDuration(currentStartDate, currentEndDate);
          return { ...r, duration: updatedDuration, isEditing: false, isNew: false };
        }
        if (r.subRows && r.subRows.length > 0) { return { ...r, subRows: finalizeRecursively(r.subRows) };}
        return r;
      });
    };
    stableSetData(oldData => {
        const finalizedData = finalizeRecursively(oldData);
        if (rowIdToFinalize === editingRowId) {
            const task = findTaskByIdRecursive(finalizedData, rowIdToFinalize);
            if (task && !task.isEditing) {
                setEditingRowId(null);
            } else if (!task) { 
                setEditingRowId(null);
            }
        }
        return finalizedData;
    });
  }, [editingRowId, stableSetData, setEditingRowId]);

  // Simplified: Always adds a new top-level task
  const addNewTaskOnClick = useCallback(() => {
    const newTask = createNewTask();
    setData(prevData => [...prevData, newTask]);
    setEditingRowId(newTask.id);
  }, [setData, setEditingRowId]); // Removed setExpanded as parent expansion isn't triggered here

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!editingRowId || isListboxOpen) return;

      const editingRowElement = rowRefs.current[editingRowId];
      if (editingRowElement && !editingRowElement.contains(event.target)) {
        const task = findTaskByIdRecursive(data, editingRowId);
        if (task && task.isEditing) { 
            handleFinalizeRow(editingRowId);
        } else if (!task && editingRowId) { 
            setEditingRowId(null); 
        }
      }
    };

    if (editingRowId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingRowId, data, handleFinalizeRow, isListboxOpen, setEditingRowId]);


  const columns = useMemo(
    () => [
      { id: 'expander', header: () => null, size: 40,
        cell: ({ row }) => (row.getCanExpand() ? (<button {...{ onClick: row.getToggleExpandedHandler() }} style={{ cursor: 'pointer', paddingLeft: `${row.depth * 1}rem` }} className="flex items-center justify-center w-full h-full">{row.getIsExpanded() ? <ChevronDownIcon className="h-4 w-4"/> : <ChevronRightIcon className="h-4 w-4"/>}</button>) : <span style={{ paddingLeft: `${row.depth * 1 + 0.5}rem` }}>&nbsp;</span>),
      },
      { accessorKey: 'id', header: 'Task Id', size: 100,
        cell: ({row, getValue}) => <Link to={`/tasks/${row.original.id.replace('T-', '')}`} className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-1"><span style={{ paddingLeft: `${row.depth * 0.5}rem` }}>{getValue().toString().slice(0, 5)}</span></Link> },
      {
        accessorKey: 'taskTitle', header: 'Task Title', size: 250,
        cell: ({ row, getValue, column, table }) => {
            const titleContent = (<span onClick={row.getCanExpand() && !row.original.isEditing ? row.getToggleExpandedHandler() : undefined} className={row.getCanExpand() && !row.original.isEditing ? 'cursor-pointer hover:underline' : ''} style={{ paddingLeft: `${!row.getCanExpand() && row.depth > 0 ? 1 : 0.3}rem`}}>{getValue()}</span>);
            return row.original.isEditing ? (<EditableTextField inputRef={row.original.isNew ? newRowFirstInputRef : null} value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} />) : titleContent;
          },
      },
      {
        accessorKey: 'status', header: 'Status', size: 120,
        cell: ({ row, getValue, column, table }) => (
           <StatusBadge status={getValue()} statusOptions={globalStatusOptions} />
        ),
      },
      {
        accessorKey: 'responsiblePerson', header: 'Responsible Person', size: 150,
        cell: ({ row, getValue, column, table }) => (row.original.isEditing ?
          <div onKeyDown={(e) => { if(e.key === 'Enter'){ e.preventDefault(); table.options.meta?.handleFinalizeRow(row.original.id)}}} className="w-full text-[14px] " tabIndex={-1}>
            <UserCustomDropdown 
                options={responsiblePersonOptions} 
                value={getValue()} 
                onChange={(newValue) => table.options.meta?.updateCellData(newValue, row.original.id, column.id)}
                setListboxOpen={row.original.id === editingRowId ? setIsListboxOpen : undefined}
            />
          </div>
            : getValue() || <span className="text-gray-400 ">Unassigned</span>),
      },
      {
        accessorKey: 'startDate', header: 'Start Date', size: 130,
        cell: ({ row, getValue, column,table }) => (row.original.isEditing ? <DateEditor value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> : getValue() || <span className="text-gray-400 p-1">Select date</span>),
      },
      {
        accessorKey: 'endDate', header: 'End Date', size: 130,
        cell: ({ row, getValue, column,table }) => (row.original.isEditing ? <DateEditor value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> : getValue() || <span className="text-gray-400 p-3">Select date</span>),
      },
      { accessorKey: 'duration', header: 'Duration', size: 120,
        cell: ({getValue}) => <span className="text-xs">{getValue()}</span>
      },
      {
        accessorKey: 'priority', header: 'Priority', size: 110,
        cell: ({ row, getValue, column,table }) => (
             <StatusBadge status={getValue()} statusOptions={globalPriorityOptions} />
        ),
      },
      { accessorKey: 'predecessor', header: 'Predecessor', size: 100,
        cell: ({ row, getValue, column,table }) => (row.original.isEditing ? (<EditableTextField value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} />) : <span className="text-xs p-3 ">{getValue()}</span>)
      },
      { accessorKey: 'successor', header: 'Successor', size: 100,
        cell: ({ row, getValue, column,table }) => (row.original.isEditing ? (<EditableTextField value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} />) : <span className="text-xs p-3 ">{getValue()}</span>)
      },
      // Removed the 'actions' column
    ],
    [editingRowId, handleFinalizeRow, updateCellData, setIsListboxOpen] // Removed addNewTaskOnClick from here
  );

  const table = useReactTable({
    data,
    columns,
    state: { expanded, },
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows, // Still needed for displaying existing hierarchy
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(), // Still needed
    meta: { 
        updateCellData, 
        handleFinalizeRow, 
        // addNewTask: addNewTaskOnClick // This can be kept if you prefer, or removed if only the global button uses it.
                                       // For now, let's assume the global button directly calls the component's addNewTaskOnClick
    }
  });

  const canShowAddPlaceholder = !data.some(row => row.isNew || row.isEditing || (row.subRows && row.subRows.some(sr => sr.isNew || sr.isEditing)) );
  const showTopLevelAddTaskButton = !editingRowId && canShowAddPlaceholder;


  const actualDataRows = table.getRowModel().rows;
  let numRenderedDataRows = actualDataRows.length;

  let effectiveRowCountForHeight = numRenderedDataRows;
  if (showTopLevelAddTaskButton) {
    effectiveRowCountForHeight++;
  }
  const numEmptyRowsToFill = Math.max(0, MIN_DISPLAY_ROWS - effectiveRowCountForHeight);
  const totalRowsForHeightCalc = Math.max(MIN_DISPLAY_ROWS, effectiveRowCountForHeight);
  const desiredTableHeight = (totalRowsForHeightCalc * ROW_HEIGHT) + HEADER_HEIGHT;

  return (
    <div className="p-2">
      <div
        className="table-wrapper border-none overflow-x-auto" // Ensure this container doesn't cause z-index issues with dropdowns
        style={{ height: `${desiredTableHeight}px` }}
      >
        <table className="w-full  table-auto  text-sm table-fixed">
          <thead className="sticky top-0 bg-gray-50"> {/* Ensure header z-index is lower than dropdowns */}
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} style={{width: header.getSize()}} className="border-r-2 p-2 text-center text-gray-600 font-semibold">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {actualDataRows.map(row => (
              <Fragment key={row.id}>
                <tr 
                    ref={el => rowRefs.current[row.original.id] = el}
                    className={`hover:bg-gray-50 even:bg-gray-100 ${isListboxOpen && editingRowId === row.original.id ? 'relative z-30' : ''}`} // Example: lift row with open dropdown
                    style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} style={{width: cell.column.getSize()}} className={`border-r-2 text-left p-0 align-middle`}>
                      <div className="h-full w-full flex items-center px-2">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
            {showTopLevelAddTaskButton && (
                <tr style={{ height: `${ROW_HEIGHT}px` }}>
                    <td colSpan={table.getAllColumns().length} className="border text-left text-[12px]">
                        <button 
                            onClick={() => addNewTaskOnClick()} 
                            className="text-red-500 hover:underline text-sm"
                        >
                        Click here to add task
                        </button>
                    </td>
                </tr>
            )}
            {Array.from({ length: numEmptyRowsToFill }).map((_, index) => (
                <tr key={`empty-${index}`} style={{ height: `${ROW_HEIGHT}px` }}>
                    <td colSpan={table.getAllColumns().length} className="border-r-2 p-2">&nbsp;</td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;