import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import StatusBadge from "../../Projects/statusBadge";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // Kept as per user's code
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

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
    <div className="relative w-full text-[12px]" onKeyDown={onKeyDown}> {/* Assuming w-34 was intended as w-full or similar from context */}
      <Listbox value={selectedOption} onChange={handleSelect}>
        <div className="relative rounded-md">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm min-h-[38px]">
            <span className="block truncate">{selectedOption || `Select...`}</span>
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
            {filteredOptions.map((option, index) => (
              <ListboxOption
                key={option}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-4 text-[12px] ${
                    active ? 'bg-[#C72030] text-white' : 'text-gray-900'
                  }`
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

const UserCustomDropdownMultiple = ({ options = [], value = [], onChange, onKeyDownHandler, placeholder = "Select options...", searchPlaceholder = "Search options..." }) => {
  const [selectedOptions, setSelectedOptions] = useState(value);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSelectedOptions(Array.isArray(value) ? value : []);
  }, [value]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleListboxChange = (newSelectionArray) => {
    setSelectedOptions(newSelectionArray);
    if (onChange) {
      onChange(newSelectionArray);
    }
  };

  return (
    <div className="relative w-full text-xs" onKeyDown={onKeyDownHandler} tabIndex={-1}>
      <Listbox value={selectedOptions} onChange={handleListboxChange} multiple name="custom-multi-select">
        <div className="relative  rounded-md shadow-sm">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm min-h-[40px] flex flex-wrap items-center gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span key={option} className="border-2 border-red-400 rounded-full px-2 py-0.5 text-xs whitespace-nowrap">
                  {option}
                </span>
              ))
            ) : ( <span className="text-gray-500">{placeholder}</span> )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs z-10">
            <div className="sticky top-0 bg-white px-2 py-1 border-b border-gray-200 m-1">
              <div className="flex items-center border border-gray-300 rounded-md p-1">
                <SearchOutlinedIcon style={{ color: 'red' }} className="mr-2 h-4 w-4" />
                <input type="text" placeholder={searchPlaceholder} className="w-full text-xs focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            {filteredOptions.length > 0 ? filteredOptions.map((option) => (
              <ListboxOption key={option} className={({ active, selected }) => `relative cursor-default select-none py-2 pl-3 pr-4 text-xs ${active ? 'bg-[#C72030] text-white' : 'text-gray-900'} ${selected ? 'font-semibold' : 'font-normal'}`} value={option} >
                {({ selected }) => ( <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option}</span> )}
              </ListboxOption>
            )) : ( <div className="text-gray-500 px-3 py-2">No options found</div> )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

const responsiblePersonOptions = ['Alice A', 'Bob B', 'Charlie C', 'Duhita Raut', 'Unassigned'];
const tagOptions = ['FM Matrix', 'UI/UX', 'Backend', 'API', 'Urgent Task', 'Client Feedback', 'NewTask', 'Important', 'Review Needed'];
const priorityOptions=['None', 'Low', 'Medium', 'High', 'Urgent'];
const statusOptions = ['Open', 'In Progress', 'Completed', 'On Hold'];


const EditableTextField = ({ value, onUpdate, rowId, columnId, saveRow, inputRef }) => {
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => { setLocalValue(value); }, [value]);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') { event.preventDefault(); onUpdate(localValue, rowId, columnId); saveRow(rowId); }
  };
  const handleBlur = () => onUpdate(localValue, rowId, columnId);
  return <input ref={inputRef} type="text" value={localValue} onChange={e => setLocalValue(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="w-full p-1 focus:outline-none rounded text-sm"/>;
};



const DateEditor = ({ value, onUpdate, rowId, columnId, saveRow }) => {
  const [date, setDate] = useState(value ? new Date(value).toISOString().split('T')[0] : '');
  useEffect(() => { setDate(value ? new Date(value).toISOString().split('T')[0] : ''); }, [value]);
  const handleKeyDown = (event) => { if (event.key === 'Enter') { event.preventDefault(); onUpdate(date ? new Date(date).toLocaleDateString('en-CA') : null, rowId, columnId); saveRow(rowId); }};
  const handleBlur = () => { onUpdate(date ? new Date(date).toLocaleDateString('en-CA') : null, rowId, columnId);};
  return <input type="date" value={date} onChange={e => setDate(e.target.value)} onBlur={handleBlur} onKeyDown={handleKeyDown} className="w-full p-1 rounded text-sm" placeholder="Select date"/>;
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

const createNewSubtask = () => ({
  id: `TASK-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  taskTitle: '',
  status: 'Open',
  responsiblePerson: 'Unassigned',
  startDate: null,
  endDate: null,
  duration: '0d:0h:0m:0s',
  priority: 'None',
  tags: ["FM Matrix"],
  isEditing: true,
  isNew: true,
});

const SubtaskTable = () => {
  const [data, setData] = useState([]);
  const newRowFirstInputRef = useRef(null);

  useEffect(() => {
    if (newRowFirstInputRef.current) {
      newRowFirstInputRef.current.focus();
      newRowFirstInputRef.current = null;
    }
  }, [data]);
  const PriorityOptions=['None', 'Low', 'Medium', 'High', 'Urgent'];

const statusOptions = ['Open', 'In Progress', 'Completed', 'On Hold'];

  const updateCellData = (newValue, rowId, columnId) => {
    setData(oldData =>
      oldData.map(row => {
        if (row.id === rowId) {
          const updatedRow = { ...row, [columnId]: newValue };
          if (columnId === 'startDate' || columnId === 'endDate') {
            const newStartDate = columnId === 'startDate' ? newValue : updatedRow.startDate;
            const newEndDate = columnId === 'endDate' ? newValue : updatedRow.endDate;
            updatedRow.duration = calculateDuration(newStartDate, newEndDate);
          }
          return updatedRow;
        }
        return row;
      })
    );
  };

  const addNewSubtaskOnClick = () => {
    const newSubtask = createNewSubtask();
    setData(prevData => [...prevData, newSubtask]);
  };

  const handleFinalizeRow = (rowIdToFinalize) => {
    setData(oldData => oldData.map(r => {
        if (r.id === rowIdToFinalize) {
          const currentStartDate = r.startDate;
          const currentEndDate = r.endDate;
          const updatedDuration = calculateDuration(currentStartDate, currentEndDate);
          return { ...r, duration: updatedDuration, isEditing: false, isNew: false };
        }
        return r;
      })
    );
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'Task Id', size: 80,
        cell: ({getValue}) => <span className="text-xs text-gray-500 px-1">{getValue().toString().slice(-5)}</span>
      },
      {
        accessorKey: 'taskTitle',
        header: 'Task Title',
        size: 200,
        cell: ({ row, getValue, column, table }) => {
            const isFirstEditableCellInNewRow = row.original.isNew && column.id === 'taskTitle';
            return row.original.isEditing ? (
              <EditableTextField
                inputRef={isFirstEditableCellInNewRow ? newRowFirstInputRef : null}
                value={getValue()}
                onUpdate={table.options.meta?.updateCellData}
                rowId={row.original.id}
                columnId={column.id}
                saveRow={table.options.meta?.handleFinalizeRow}
              />
            ) : ( getValue() );
          },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: (info)=>{return(

<StatusBadge status={info.getValue()} statusOptions={statusOptions} />

 );},
      },
      {
        accessorKey: 'responsiblePerson',
        header: 'Responsible person',
        size: 150,
        cell: ({ row, getValue, column, table }) => {
            if (row.original.isEditing) {
                const handleChange = (newValue) => {
                    table.options.meta?.updateCellData(newValue, row.original.id, column.id);
                };
                const handleKeyDown = (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        table.options.meta?.handleFinalizeRow(row.original.id);
                    }
                };
                return (
                    <div onKeyDown={handleKeyDown} className="w-full" tabIndex={-1}>
                        <UserCustomDropdown
                            value={getValue()}
                            options={responsiblePersonOptions}
                            onChange={handleChange}
                        />
                    </div>
                );
            }
            return getValue() || <span className="text-gray-400">Unassigned</span>;
        }
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        size: 130,
        cell: ({ row, getValue, column,table }) => (row.original.isEditing ?
          <DateEditor value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> :
          getValue() || <span className="text-gray-400 p-1">Select date</span>),
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        size: 130,
        cell: ({ row, getValue, column,table }) => (row.original.isEditing ?
          <DateEditor value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> :
          getValue() || <span className="text-gray-400" p-1>Select date</span>),
      },
      { accessorKey: 'duration', header: 'Duration', size: 120,
        cell: ({getValue}) => <span className="text-xs p-1">{getValue()}</span>
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 120,
        cell: (info)=>{return(

       <StatusBadge status={info.getValue()} statusOptions={PriorityOptions} />

);},      
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        size: 120,
        cell: ({ row, getValue, column, table }) => {
            if (row.original.isEditing) {
                const currentValue = Array.isArray(getValue()) ? getValue() : [];
                const handleChange = (newValuesArray) => {
                    table.options.meta?.updateCellData(newValuesArray, row.original.id, column.id);
                };
                const handleKeyDown = (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        table.options.meta?.handleFinalizeRow(row.original.id);
                    }
                };
                return (
                    <div onKeyDown={handleKeyDown} className="w-full" tabIndex={-1}>
                        <UserCustomDropdownMultiple
                            value={currentValue}
                            options={tagOptions}
                            onChange={handleChange}
                            placeholder="Select Tags"
                            searchPlaceholder="Search tags..."
                        />
                    </div>
                );
            }
            const tagsToDisplay = Array.isArray(getValue()) ? getValue() : [];
            return tagsToDisplay.length > 0
                ? tagsToDisplay.map(tag => <span key={tag} className="border-2 border-red-300 px-2 py-0.5 rounded-full text-xs mr-1 whitespace-nowrap">{tag}</span>)
                : <span className="text-gray-400">No tags</span>;
        }
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateCellData,
      handleFinalizeRow,
    }
  });

  const canShowAddPlaceholder = !data.some(row => row.isNew || row.isEditing);

  return (
    <div className="p-2">
      <table className="w-full border-collapse border text-sm">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border p-2 text-center bg-gray-50 text-gray-600 font-semibold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-white">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className={`border } pl-3 text-left`}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {canShowAddPlaceholder&&  (
            <tr>
              <td colSpan={columns.length} className="border p-2 text-left text-[12px]">
                <button onClick={addNewSubtaskOnClick} className="text-red-500 hover:underline text-sm">
                  Add subtask
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default SubtaskTable;