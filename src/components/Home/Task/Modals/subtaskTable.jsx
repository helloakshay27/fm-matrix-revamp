import React, { useState, useEffect, useMemo, useRef, Fragment, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// Your Custom Components
import StatusBadge from "../../Projects/statusBadge";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon as HUIDownIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

// Import SelectBox
import SelectBox from '../../../SelectBox';

// Redux Thunks
import { fetchTasks, createSubTask } from '../../../../redux/slices/taskSlice';
import { fetchUsers } from '../../../../redux/slices/userSlice';
import { fetchTags } from '../../../../redux/slices/tagsSlice';


// UserCustomDropdownMultiple (remains the same)
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
        <div className="relative rounded-md shadow-sm">
          <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-opacity-75 sm:text-sm min-h-[40px] flex flex-wrap items-center gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span key={option} className="border-2 border-red-400 rounded-full px-2 py-0.5 text-xs whitespace-nowrap">
                  {option}
                </span>
              ))
            ) : ( <span className="text-gray-500">{placeholder}</span> )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HUIDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </ListboxButton>
          <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs z-50">
            <div className="sticky top-0 bg-white px-2 py-1 border-b border-gray-200 m-1">
              <div className="flex items-center border border-gray-300 rounded-md p-1">
                <SearchOutlinedIcon style={{ color: 'red' }} className="mr-2 h-4 w-4" />
                <input type="text" placeholder={searchPlaceholder} className="w-full text-xs focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            {filteredOptions.length > 0 ? filteredOptions.map((option) => (
              <ListboxOption key={option} className={({ active, selected }) => `relative cursor-default select-none py-2 pl-3 pr-4 text-xs ${active ? 'bg-[#C72030] text-white' : 'text-gray-900'} ${selected ? 'font-semibold' : 'font-normal'}`} value={option} >
                {({ selected: isSelected }) => ( <span className={`block truncate ${isSelected ? 'font-semibold' : 'font-normal'}`}>{option}</span> )}
              </ListboxOption>
            )) : ( <div className="text-gray-500 px-3 py-2">No options found</div> )}
          </ListboxOptions>
        </div>
      </Listbox>
    </div>
  );
};

// Generic Input Components for the "Add New Subtask" Row
const NewSubtaskTextField = ({ value, onChange, onEnterPress, inputRef, placeholder }) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onEnterPress();
        }
    };
    return <input ref={inputRef} type="text" placeholder={placeholder} value={value || ""} onChange={onChange} onKeyDown={handleKeyDown} className="w-full p-1 focus:outline-none rounded text-sm border border-gray-300"/>;
};

const NewSubtaskDateEditor = ({ value, onChange, onEnterPress, placeholder }) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onEnterPress();
        }
    };
    return <input type="date" placeholder={placeholder} value={value || ""} onChange={onChange} onKeyDown={handleKeyDown} className="w-full p-1 focus:outline-none rounded text-sm border border-gray-300"/>;
};


// Constants
const globalPriorityOptions = ['None', 'Low', 'Medium', 'High', 'Urgent'];
const globalStatusOptions = ['open', 'in_progress', 'completed', 'on_hold'];

const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) { return '0d:0h:0m'; }
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || endDate < startDate) { return '0d:0h:0m'; }
  let ms = endDate.getTime() - startDate.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(ms / (1000 * 60));
  return `${days}d:${hours}h:${minutes}m`;
};

const SubtaskTable = () => {
  const { id:parentId } = useParams();
  const dispatch = useDispatch();

  const {
    fetchTasks: allTasksFromStore, // Assuming this key holds the array of tasks
    loading: loadingAllTasks,
    error: allTasksError,
  } = useSelector((state) => state.fetchTasks); // Make sure 'fetchTasks' is the correct slice name or object key

  const { 
     fetchUsers: users, // Default users to an empty array
    loading: loadingUsers, 
    error: usersFetchError 
  } = useSelector((state) => state.fetchUsers || { users: [], loading: false, error: null }); // Corrected user selector

  // Selector for tags
  const { 
    fetchTags: tagList , // Assuming tagList is the array of tag objects {id, name}
    loading: loadingTags, 
    error: tagsError 
  } = useSelector((state) => state.fetchTags || { tagList: [], loading: false, error: null });


  const [data, setData] = useState([]);
  const [parentTaskForSubtasks, setParentTaskForSubtasks] = useState(null);
  const [parentTaskLookupStatus, setParentTaskLookupStatus] = useState('idle');

  const [isAddingNewSubtask, setIsAddingNewSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newSubtaskStatus, setNewSubtaskStatus] = useState('open');
  const [newSubtaskResponsiblePersonId, setNewSubtaskResponsiblePersonId] = useState(null);
  const [newSubtaskStartDate, setNewSubtaskStartDate] = useState('');
  const [newSubtaskEndDate, setNewSubtaskEndDate] = useState('');
  const [newSubtaskPriority, setNewSubtaskPriority] = useState('None');
  const [newSubtaskTags, setNewSubtaskTags] = useState([]); // Stores array of selected tag NAMES

  const [isSavingSubtask, setIsSavingSubtask] = useState(false);
  const [localError, setLocalError] = useState(null);

  const newSubtaskTitleInputRef = useRef(null);
  const userFetchInitiatedRef = useRef(false);
  const allTasksFetchInitiatedRef = useRef(false);
  const tagsFetchInitiatedRef = useRef(false);

  useEffect(() => {
    if (!loadingAllTasks && (!allTasksFromStore || !Array.isArray(allTasksFromStore) || allTasksFromStore.length === 0) && !allTasksError && !allTasksFetchInitiatedRef.current) {
      dispatch(fetchTasks());
      allTasksFetchInitiatedRef.current = true;
    } else if (allTasksFromStore || allTasksError) {
        allTasksFetchInitiatedRef.current = true;
    }
  }, [dispatch, allTasksFromStore, loadingAllTasks, allTasksError]);

  useEffect(() => {
    if (!loadingUsers && (!Array.isArray(users) || users.length === 0) && !usersFetchError && !userFetchInitiatedRef.current) {
      dispatch(fetchUsers());
      userFetchInitiatedRef.current = true;
    } else if ((Array.isArray(users) && users.length > 0) || usersFetchError) {
        userFetchInitiatedRef.current = true;
    }
  }, [dispatch, users, loadingUsers, usersFetchError]);
  
  useEffect(() => {
    if (!loadingTags && (!Array.isArray(tagList) || tagList.length === 0) && !tagsError && !tagsFetchInitiatedRef.current) {
      dispatch(fetchTags());
      tagsFetchInitiatedRef.current = true;
    } else if ((Array.isArray(tagList) && tagList.length > 0) || tagsError) {
        tagsFetchInitiatedRef.current = true;
    }
  }, [dispatch, tagList, loadingTags, tagsError]);


  useEffect(() => {
    if (loadingAllTasks) {
      setParentTaskLookupStatus('loading'); return;
    }
    if (allTasksError) {
      setParentTaskLookupStatus('error');
      setLocalError('Failed to load tasks to find the parent.'); return;
    }
    if (allTasksFromStore && Array.isArray(allTasksFromStore) && allTasksFromStore.length > 0 && parentId) {
      const foundTask = allTasksFromStore.find(task => String(task.id) === String(parentId));
      if (foundTask) {
        setParentTaskForSubtasks(foundTask);
        setParentTaskLookupStatus('found');
        if (foundTask.sub_tasks_managements && Array.isArray(foundTask.sub_tasks_managements)) {
          const processedSubtasks = foundTask.sub_tasks_managements.map(sub => ({
            id: sub.id,
            taskTitle: sub.title || "Unnamed Subtask",
            status: sub.status || 'open',
            responsiblePerson: sub.responsible_person?.name || 'Unassigned',
            responsiblePersonId: sub.responsible_person?.id || null,
            startDate: sub.started_at ? new Date(sub.started_at).toLocaleDateString('en-CA') : null,
            endDate: sub.target_date ? new Date(sub.target_date).toLocaleDateString('en-CA') : null,
            duration: calculateDuration(sub.started_at, sub.target_date),
            priority: sub.priority || 'None',
            tags: (sub.task_tags).map((tag) => tag.company_tag.name), // Map task_tags to names
          }));
          setData(processedSubtasks);
        } else {
          setData([]);
        }
        setLocalError(null);
      } else {
        setParentTaskForSubtasks(null); setParentTaskLookupStatus('not_found'); setData([]);
        setLocalError(`Parent task with ID ${parentId} not found.`);
      }
    } else if (!loadingAllTasks && allTasksFromStore && parentId) {
        setParentTaskLookupStatus('not_found'); setData([]);
        setLocalError(`Parent task with ID ${parentId} not found.`);
    }
  }, [allTasksFromStore, parentId, loadingAllTasks, allTasksError]);

  useEffect(() => {
    if (isAddingNewSubtask && newSubtaskTitleInputRef.current) {
      newSubtaskTitleInputRef.current.focus();
    }
  }, [isAddingNewSubtask]);

  const resetNewSubtaskForm = useCallback(() => {
    setNewSubtaskTitle('');
    setNewSubtaskStatus('open');
    setNewSubtaskResponsiblePersonId(null);
    setNewSubtaskStartDate('');
    setNewSubtaskEndDate('');
    setNewSubtaskPriority('None');
    setNewSubtaskTags([]);
    setLocalError(null);
  }, []);

  const handleShowNewSubtaskForm = useCallback(() => {
    if (!parentTaskForSubtasks) {
        setLocalError("Parent task not loaded. Cannot add subtask.");
        return;
    }
    resetNewSubtaskForm();
    setIsAddingNewSubtask(true);
  }, [parentTaskForSubtasks, resetNewSubtaskForm]);

  const handleCancelNewSubtask = useCallback(() => {
    setIsAddingNewSubtask(false);
    resetNewSubtaskForm();
  }, [resetNewSubtaskForm]);

  const handleSaveNewSubtask = useCallback(async () => {
    if (!newSubtaskTitle || newSubtaskTitle.trim() === "") {
      setLocalError("Subtask title cannot be empty.");
      if (newSubtaskTitleInputRef.current) newSubtaskTitleInputRef.current.focus();
      return;
    }
    setLocalError(null);
    setIsSavingSubtask(true);

    // Convert selected tag names (from newSubtaskTags state) to IDs
    const selectedTagIds = newSubtaskTags
        .map(tagName => {
            const foundTag = Array.isArray(tagList) ? tagList.find(tagInStore => tagInStore.name === tagName) : null;
            return foundTag ? foundTag.id : null;
        })
        .filter(id => id !== null);

    const subtaskPayload = {
      parent_id: parentId,
      title: newSubtaskTitle.trim(),
      status: newSubtaskStatus,
      responsible_person_id: newSubtaskResponsiblePersonId,
      project_management_id: parentTaskForSubtasks?.projectManagementId || 1,
      started_at: newSubtaskStartDate || null,
      target_date: newSubtaskEndDate || null,
      priority: newSubtaskPriority,
      task_tag_ids: selectedTagIds, // Send array of IDs for tags
    };

    try {
      await dispatch(createSubTask(subtaskPayload)).unwrap(); // Pass subtaskPayload directly
      dispatch(fetchTasks());
      setIsAddingNewSubtask(false);
      resetNewSubtaskForm();
    } catch (error) {
      console.error("Failed to create subtask:", error);
      const errorMessage = error?.message || (typeof error === 'string' ? error : "Failed to save subtask.");
      setLocalError(errorMessage);
    } finally {
      setIsSavingSubtask(false);
    }
  }, [
    dispatch, parentId, parentTaskForSubtasks, resetNewSubtaskForm,
    newSubtaskTitle, newSubtaskStatus, newSubtaskResponsiblePersonId,
    newSubtaskStartDate, newSubtaskEndDate, newSubtaskPriority, newSubtaskTags,
    tagList // Add tagList dependency
  ]);

  const handleDeleteExistingSubtask = useCallback((subtaskId) => {
      alert(`API for deleting existing subtask ${subtaskId} needs to be implemented.`);
  }, []);

  const userOptionsForSelectBox = useMemo(() => [
    { value: null, label: "Unassigned" },
    ...(Array.isArray(users) ? users.map(u => ({ value: u.id, label: `${u.firstname || ''} ${u.lastname || ''}`.trim() })) : [])
  ], [users]);

  const tagNamesForDropdown = useMemo(() => {
    return Array.isArray(tagList) ? tagList.map(tag => tag.name) : [];
  }, [tagList]);


  const columns = useMemo(
    () => [
      { accessorKey: 'id', header: 'ID', size: 80,
        cell: ({getValue}) => <span className="text-xs text-gray-500 px-1">{getValue().toString().slice(-5)}</span>
      },
      { accessorKey: 'taskTitle', header: 'Subtask Title', size: 250,
        cell: info => info.getValue()
      },
      { accessorKey: 'status', header: 'Status', size: 150,
        cell: info => <StatusBadge status={info.getValue()} statusOptions={globalStatusOptions} />
      },
      { accessorKey: 'responsiblePerson', header: 'Responsible Person', size: 180,
        cell: info => info.getValue() || <span className="text-gray-400">Unassigned</span>
      },
      { accessorKey: 'startDate', header: 'Start Date', size: 160,
        cell: info => (info.getValue() ? new Date(info.getValue()).toLocaleDateString() : <span className="text-gray-400 p-1">N/A</span>)
      },
      { accessorKey: 'endDate', header: 'End Date', size: 160,
        cell: info => (info.getValue() ? new Date(info.getValue()).toLocaleDateString() : <span className="text-gray-400 p-1">N/A</span>)
      },
      { accessorKey: 'duration', header: 'Duration', size: 100,
        cell: info => <span className="text-xs p-1">{info.getValue()}</span>
      },
      { accessorKey: 'priority', header: 'Priority', size: 150,
        cell: info => <StatusBadge status={info.getValue()} statusOptions={globalPriorityOptions} />
      },
      { accessorKey: 'tags', header: 'Tags', size: 200, // 'tags' accessor should provide array of names
        cell: ({ getValue }) => {
          const tagsToDisplay = Array.isArray(getValue()) ? getValue() : [];
          return tagsToDisplay.length > 0
            ? tagsToDisplay.map(tag => <span key={tag} className="border bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs mr-1 whitespace-nowrap">{tag}</span>)
            : <span className="text-gray-400">No tags</span>;
        }
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <button
                onClick={() => handleDeleteExistingSubtask(row.original.id)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label="Delete subtask"
            >
                <DeleteOutlinedIcon fontSize="small" />
            </button>
          </div>
        ),
      },
    ],
    [handleDeleteExistingSubtask]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const newSubtaskDuration = useMemo(() =>
    calculateDuration(newSubtaskStartDate, newSubtaskEndDate),
    [newSubtaskStartDate, newSubtaskEndDate]
  );

  let pageContent;
  if (parentTaskLookupStatus === 'loading' || (loadingAllTasks && !allTasksFetchInitiatedRef.current) || (loadingUsers && !userFetchInitiatedRef.current) || (loadingTags && !tagsFetchInitiatedRef.current) ) {
    pageContent = (<div className="p-4 flex justify-center items-center min-h-[200px]"><ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" /> Loading data...</div>);
  } else if (parentTaskLookupStatus === 'error' || allTasksError || usersFetchError || tagsError) {
    pageContent = (<div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded">
        Error: {localError || String(allTasksError?.message || allTasksError || usersFetchError?.message || usersFetchError || tagsError?.message || tagsError || "Could not load required data.")}
      </div>);
  } else if (parentTaskLookupStatus === 'not_found') {
    pageContent = <div className="p-4 text-center text-gray-600">Parent task (ID: {parentId}) not found.</div>;
  } else if (parentTaskLookupStatus === 'found') {
    pageContent = (
      <>
        {localError && !isAddingNewSubtask && <div className="mb-4 p-2 text-red-700 bg-red-100 border border-red-400 rounded text-sm">{localError}</div>}
        {isSavingSubtask && <div className="mb-4 p-2 text-blue-700 bg-blue-100 border border-blue-400 rounded text-sm">Saving subtask...</div>}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm bg-white">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} style={{width: header.getSize() ? `${header.getSize()}px` : undefined }} className="border p-2 text-center text-gray-700 font-semibold">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className={`border p-0 align-middle ${cell.column.id === 'actions' ? 'text-center' : 'text-left'}`}>
                       <div className="p-1 h-full flex items-center">
                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
              {isAddingNewSubtask && (
                <tr >
                  <td className="border p-1 text-xs text-gray-400 align-middle">NEW</td>
                  <td className="border p-1 align-middle">
                    <NewSubtaskTextField
                      inputRef={newSubtaskTitleInputRef}
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onEnterPress={handleSaveNewSubtask}
                      placeholder="Subtask title"
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <StatusBadge
                        status={newSubtaskStatus}
                        statusOptions={globalStatusOptions}
                        onStatusChange={setNewSubtaskStatus}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <SelectBox
                        options={userOptionsForSelectBox}
                        value={newSubtaskResponsiblePersonId}
                        onChange={setNewSubtaskResponsiblePersonId}
                        placeholder="Select Person..."
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <NewSubtaskDateEditor
                        value={newSubtaskStartDate}
                        onChange={(e) => setNewSubtaskStartDate(e.target.value)}
                        onEnterPress={handleSaveNewSubtask}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                     <NewSubtaskDateEditor
                        value={newSubtaskEndDate}
                        onChange={(e) => setNewSubtaskEndDate(e.target.value)}
                        onEnterPress={handleSaveNewSubtask}
                    />
                  </td>
                  <td className="border p-1 text-xs align-middle">{newSubtaskDuration}</td>
                  <td className="border p-1 align-middle">
                     <StatusBadge
                        status={newSubtaskPriority}
                        statusOptions={globalPriorityOptions}
                        onStatusChange={setNewSubtaskPriority}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <UserCustomDropdownMultiple
                        value={newSubtaskTags} // Array of names
                        options={tagNamesForDropdown} // Array of names
                        onChange={setNewSubtaskTags} // Sets array of names
                        placeholder="Select Tags"
                        searchPlaceholder="Search tags..."
                    />
                  </td>
                  <td className="border p-1 text-center align-middle">
                    <div className="flex items-center justify-center space-x-1">
                        <button onClick={handleSaveNewSubtask} className="text-green-600 hover:text-green-800 p-1 text-xs" disabled={isSavingSubtask}>
                            {isSavingSubtask ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={handleCancelNewSubtask} className="text-gray-600 hover:text-gray-800 p-1 text-xs">Cancel</button>
                    </div>
                  </td>
                </tr>
              )}

              {!isAddingNewSubtask && parentTaskLookupStatus === 'found' && (
                <tr>
                  <td colSpan={columns.length} className="border p-2 text-left text-[12px]">
                    <button onClick={handleShowNewSubtaskForm} className="text-red-500 hover:underline text-sm  py-1">
                      Add subtask
                    </button>
                  </td>
                </tr>
              )}
               
            </tbody>
          </table>
        </div>
      </>
    );
  } else {
    pageContent = <div className="p-4 text-center text-gray-500">Please wait or ensure a valid task ID is provided.</div>;
  }

return pageContent
};

export default SubtaskTable;