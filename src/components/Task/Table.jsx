import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getExpandedRowModel,
} from '@tanstack/react-table';
import StatusBadge from "../Projects/statusBadge";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

const UserCustomDropdown = ({ options, value, onChange, onKeyDown }) => {
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
        <div className="relative rounded-md">
          
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none  sm:text-sm min-h-[38px]">
            {selectedOption=="Unassigned"?
                <span className="block truncate"><i>{selectedOption}</i></span>:
                <span className="block truncate">{selectedOption || `Select...`}</span>}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 p-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-[12px] z-10">
            <div className="sticky top-0 bg-white px-1 py-1 m-1">
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
                  `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${
                    active ? 'bg-[#C72030] text-white' : 'text-gray-900'
                  } ` 
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
        </div>
      </Listbox>
    </div>
  );
};

const responsiblePersonOptions = ['Alice A', 'Bob B', 'Charlie C', 'Duhita Raut', 'Unassigned'];
const globalPriorityOptions=['None', 'Low', 'Medium', 'High', 'Urgent'];
const globalStatusOptions = ['Open', 'In Progress', 'Completed', 'On Hold'];

const EditableTextField = ({ value, onUpdate, rowId, columnId, saveRow, inputRef }) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') { event.preventDefault(); onUpdate(localValue, rowId, columnId); saveRow(rowId); }
  };
  const handleBlur = () => onUpdate(localValue, rowId, columnId);
  return <input ref={inputRef} type="text" value={localValue} onChange={e => setLocalValue(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className=" focus:outline-none w-full h-full p-1 rounded text-sm"/>;
};

const StatusBadgeAsEditor = ({ value, options, onUpdate, rowId, columnId, saveRow }) => {
    const handleChange = (changeArg) => {
      const newValue = (changeArg && typeof changeArg.data !== 'undefined') ? changeArg.data : changeArg;
      onUpdate(newValue, rowId, columnId);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') { event.preventDefault(); saveRow(rowId); }
    };
    return (<div onKeyDown={handleKeyDown} className="w-full" tabIndex={-1}><StatusBadge status={value} statusOptions={options} onStatusChange={handleChange} /></div>);
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
    predecessor: '',
    successor: '02',
    isEditing: false, isNew: false,
    subRows: [
      { id: 'T-01-S1', taskTitle: 'Subtask 1 for Task 1', status: 'In Progress', responsiblePerson: 'Duhita Raut', startDate: '2025-01-01', endDate: '2025-01-02', duration: '0d:0h:0m:0s', priority: 'Urgent', predecessor: '01', successor: '', isEditing: false, isNew: false },
      { id: 'T-01-S2', taskTitle: 'Subtask 2 for Task 1', status: 'Open', responsiblePerson: 'Charlie C', startDate: '2025-01-02', endDate: '2025-01-03', duration: '0d:0h:0m:0s', priority: 'Medium', predecessor: '01', successor: '', isEditing: false, isNew: false },
    ],
  },
  {
    id: 'T-02', taskTitle: 'Task 2 (Not Expandable)', status: 'Completed', responsiblePerson: 'Alice A', startDate: '2025-01-04', endDate: '2025-01-05', duration: '0d:0h:0m:0s', priority: 'Low',
    predecessor: '', successor: '',
    isEditing: false, isNew: false, subRows: []
  },
];

const createNewTask = (isSubtask = false, parentId = null) => ({
  id: `${isSubtask ? parentId +'-S' : 'TASK-'}${Date.now()}-${Math.random().toString(16).slice(2)}`,
  taskTitle: '', status: 'Open', responsiblePerson: 'Unassigned', startDate: null, endDate: null, duration: '0d:0h:0m:0s', priority: 'None',
  predecessor: '',
  successor: '',
  isEditing: true, isNew: true,
  subRows: isSubtask ? undefined : [],
});

const TaskTable = () => {
  const [data, setData] = useState(() => initialTasksData.map(task => ({...task, duration: calculateDuration(task.startDate, task.endDate), subRows: task.subRows ? task.subRows.map(sub => ({...sub, duration: calculateDuration(sub.startDate, sub.endDate)})) : [] })));
  const [expanded, setExpanded] = useState({});
  const newRowFirstInputRef = useRef(null);

  useEffect(() => {
    if (newRowFirstInputRef.current) {
      newRowFirstInputRef.current.focus();
      newRowFirstInputRef.current = null;
    }
  }, [data]);

  const updateCellData = (newValue, rowId, columnId) => {
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
    setData(oldData => updateRecursively(oldData));
  };

  const addNewTaskOnClick = (parentId = null) => {
    const newTask = createNewTask(!!parentId, parentId);
    if (parentId) {
      const addSubtaskRecursively = (rows) => {
        return rows.map(task => {
          if (task.id === parentId) { return { ...task, subRows: [...(task.subRows || []), newTask] }; }
          if (task.subRows && task.subRows.length > 0) { return { ...task, subRows: addSubtaskRecursively(task.subRows) }; }
          return task;
        });
      };
      setData(prevData => addSubtaskRecursively(prevData));
      setExpanded(prev => ({...prev, [parentId]: true}));
    } else {
      setData(prevData => [...prevData, newTask]);
    }
  };

  const handleFinalizeRow = (rowIdToFinalize) => {
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
    setData(oldData => finalizeRecursively(oldData));
  };

  const columns = useMemo(
    () => [
      { id: 'expander', header: () => null, size: 40,
        cell: ({ row }) => (row.getCanExpand() ? (<button onClick={row.getToggleExpandedHandler()} style={{ cursor: 'pointer', paddingLeft: `${row.depth * 1}rem` }} className="flex items-center justify-center w-full h-full">{row.getIsExpanded() ? <ChevronDownIcon className="h-4 w-4"/> : <ChevronRightIcon className="h-4 w-4"/>}</button>) : <span style={{ paddingLeft: `${row.depth * 1 + 0.5}rem` }}>&nbsp;</span>),
      },
      { accessorKey: 'id', header: 'Task Id', size: 100,
        cell: ({row, getValue}) => <Link to={`/tasks/${row.original.id.replace('T-', '')}`} className=""><span  style={{ paddingLeft: `${row.depth * 0.5}rem` }} className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-1">{getValue().toString().slice(0, 5)}</span></Link> },
      {
        accessorKey: 'taskTitle', header: 'Task Title', size: 250,
        cell: ({ row, getValue, column, table }) => {
            const isFirstEditableCellInNewRow = row.original.isNew && column.id === 'taskTitle' && row.depth === 0;
            const titleContent = (<span onClick={row.getCanExpand() && !row.original.isEditing ? row.getToggleExpandedHandler() : undefined} className={row.getCanExpand() && !row.original.isEditing ? 'cursor-pointer hover:underline' : ''} style={{ paddingLeft: `${!row.getCanExpand() && row.depth > 0 ? 1 : 0.3}rem`}}>{getValue()}</span>);
            return row.original.isEditing ? (<EditableTextField inputRef={isFirstEditableCellInNewRow ? newRowFirstInputRef : null} value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} />) : titleContent;
          },
      },
      {
        accessorKey: 'status', header: 'Status', size: 120,
        cell: ({ row, getValue, column, table }) => (row.original.isEditing ?
          <StatusBadgeAsEditor value={getValue()} options={globalStatusOptions} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow}/> :
          <StatusBadge status={getValue()} statusOptions={globalStatusOptions} />
        ),
      },
      {
        accessorKey: 'responsiblePerson', header: 'Responsible Person', size: 150,
        cell: ({ row, getValue, column, table }) => (row.original.isEditing ?
          <div onKeyDown={(e) => { if(e.key === 'Enter'){ e.preventDefault(); table.options.meta?.handleFinalizeRow(row.original.id)}}} className="w-full " tabIndex={-1}>
            <UserCustomDropdown options={responsiblePersonOptions} value={getValue()} onChange={(newValue) => table.options.meta?.updateCellData(newValue, row.original.id, column.id)} />
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
        cell: ({ row, getValue, column,table }) => (row.original.isEditing ?
          <StatusBadgeAsEditor value={getValue()} options={globalPriorityOptions} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow}/> :
          <StatusBadge status={getValue()} statusOptions={globalPriorityOptions} />
        ),
      },
      {
        accessorKey: 'predecessor',
        header: 'Predecessor',
        size: 100,
        cell: ({ getValue }) => <span className="text-xs p-3 ">{getValue()}</span>
      },
      {
        accessorKey: 'successor',
        header: 'Successor',
        size: 100,
        cell: ({ getValue }) => <span className="text-xs p-3">{getValue()}</span>
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { expanded, },
    onExpandedChange: setExpanded,
    getSubRows: row => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: { updateCellData, handleFinalizeRow, }
  });

  const canShowAddPlaceholder = !data.some(row => row.isNew || row.isEditing || (row.subRows && row.subRows.some(sr => sr.isNew || sr.isEditing)) );

  return (
    <div className="p-2 overflow-x-auto h-[600px]">
      <table className="w-full border-collapse table-auto border text-sm table-fixed">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{width: header.getSize()}} className="border p-2 text-center  text-gray-600 font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <Fragment key={row.id}>
              <tr className="hover:bg-white">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} style={{width: cell.column.getSize()}} className={`border text-left p-2 align-middle`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            </Fragment>
          ))}
          {canShowAddPlaceholder && !data.some(task => task.isNew || task.isEditing) && (
            <tr>
              <td colSpan={columns.length} className="border p-2 text-left text-[12px]">
                <button onClick={() => addNewTaskOnClick()} className="text-red-500 hover:underline text-sm">
                  Click here to add task
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;