import React, { useState, useEffect, useMemo, useRef, Fragment } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import StatusBadge from "../Projects/statusBadge"; // Assuming this path is correct
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'; // Kept as per user's code (though not used in this snippet)
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
    <div className="relative w-full text-[12px]" onKeyDown={onKeyDown}>
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
            {filteredOptions.map((option) => (
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

const responsiblePersonOptions = ['Alice A', 'Bob B', 'Charlie C', 'Duhita Raut', 'Unassigned'];
const priorityOptions=['None', 'Low', 'Medium', 'High', 'Urgent'];
const statusOptions = ['Open', 'In Progress', 'Completed', 'On Hold'];
const issueOptions=["Bug", "Feature", "Task"];

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

const createNewSubtask = () => ({
  id: "I-001",
  issueTitle: '',
  status: 'Open',
  responsiblePerson: 'Unassigned',
  endDate: null,
  priority: 'Urgent',
  issueType: 'Bug',
  comments: "", // Added comments back
  isEditing: true,
  isNew: true,
});

const IssuesTable = () => {
  const [data, setData] = useState([]);
  const newRowFirstInputRef = useRef(null);

  useEffect(() => {
    if (newRowFirstInputRef.current) {
      newRowFirstInputRef.current.focus();
      newRowFirstInputRef.current = null;
    }
  }, [data]);

  const updateCellData = (newValue, rowId, columnId) => {
    setData(oldData =>
      oldData.map(row => {
        if (row.id === rowId) {
          return { ...row, [columnId]: newValue };
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
          return { ...r, isEditing: false, isNew: false };
        }
        return r;
      })
    );
  };

  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'Issue Id', size: 80,
        cell: ({getValue}) => <span className="text-xs text-gray-500 px-1">{getValue()}</span>
      },
      {
        accessorKey: 'issueTitle',
        header: 'Issue Title',
        size: 200,
        cell: ({ row, getValue, column, table }) => {
            const isFirstEditableCellInNewRow = row.original.isNew && column.id === 'issueTitle';
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
        cell: (info) => <StatusBadge status={info.getValue()} statusOptions={statusOptions} />,
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
        accessorKey: 'issueType',
        header: 'Issue Type',
        size: 150,
        cell: (info) => <StatusBadge status={info.getValue()} statusOptions={issueOptions} />,
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        size: 130,
        cell: ({ row, getValue, column, table }) => (row.original.isEditing ?
          <DateEditor value={getValue()} onUpdate={table.options.meta?.updateCellData} rowId={row.original.id} columnId={column.id} saveRow={table.options.meta?.handleFinalizeRow} /> :
          (getValue() ? new Date(getValue()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'}) : <span className="text-gray-400 p-1">Select date</span>)
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 120,
        cell: (info) => <StatusBadge status={info.getValue()} statusOptions={priorityOptions} />,
      },
      { // Added comments column back
        accessorKey: 'comments',
        header: 'Comments',
        size: 120, // You can adjust the size as needed
        cell: ({ row, getValue, column, table }) => {
            // 'issueTitle' is still considered the first cell to focus in a new row
            return row.original.isEditing ? (
              <EditableTextField
                inputRef={null} // No specific ref for this cell on initial load
                value={getValue()}
                onUpdate={table.options.meta?.updateCellData}
                rowId={row.original.id}
                columnId={column.id}
                saveRow={table.options.meta?.handleFinalizeRow}
              />
            ) : ( getValue() || <span className="text-gray-400 text-xs italic">No comment</span> ); // Display placeholder if no comment
          },
      },
    ],
    [newRowFirstInputRef] // Dependency array for useMemo
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
                <th key={header.id} className="border p-2 text-center bg-gray-50 text-gray-600 font-semibold" style={{ width: `${header.getSize()}px` }}>
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
                <td key={cell.id} className={`border pl-3 text-left`} style={{ width: `${cell.column.getSize()}px` }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {canShowAddPlaceholder && (
            <tr>
              <td colSpan={columns.length} className="border p-2 text-left text-[12px]">
                <button onClick={addNewSubtaskOnClick} className="text-red-500 hover:underline text-sm">
                  Add issue
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
export default IssuesTable;