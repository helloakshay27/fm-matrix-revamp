import React, { useState, useEffect, useMemo, useRef, Fragment, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// Your Custom Components
import StatusBadge from "../Projects/statusBadge";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon as HUIDownIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

// Import SelectBox
import SelectBox from '../../SelectBox';

// Redux Thunks
import { fetchTasks } from '../../../redux/slices/taskSlice';
import { fetchUsers } from '../../../redux/slices/userSlice';
import { fetchTags } from '../../../redux/slices/tagsSlice';


// UserCustomDropdownMultiple (remains the same)

// Generic Input Components for the "Add New Issues" Row
const NewIssuesTextField = ({ value, onChange, onEnterPress, inputRef, placeholder }) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onEnterPress();
        }
    };
    return <input ref={inputRef} type="text" placeholder={placeholder} value={value || ""} onChange={onChange} onKeyDown={handleKeyDown} className="w-full p-1 focus:outline-none rounded text-sm border border-gray-300"/>;
};

const NewIssuesDateEditor = ({ value, onChange, onEnterPress, placeholder }) => {
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

const IssuesTable = () => {
  const { id:parentId } = useParams();
  const dispatch = useDispatch();

  const {
    fetchTasks: allTasksFromStore,
    loading: loadingAllTasks,
    error: allTasksError,
  } = useSelector((state) => state.fetchTasks); 

  const { 
     fetchUsers: users, 
    loading: loadingUsers, 
    error: usersFetchError 
  } = useSelector((state) => state.fetchUsers || { users: [], loading: false, error: null }); 

  const { 
    fetchTags: tagList , 
    loading: loadingTags, 
    error: tagsError 
  } = useSelector((state) => state.fetchTags || { tagList: [], loading: false, error: null });


  const [data, setData] = useState([]);
  const [parentTaskForIssuess, setParentTaskForIssuess] = useState(null);
  const [parentTaskLookupStatus, setParentTaskLookupStatus] = useState('idle');

  const [isAddingNewIssues, setIsAddingNewIssues] = useState(false);
  const [newIssuesTitle, setNewIssuesTitle] = useState('');
  const [newIssuesStatus, setNewIssuesStatus] = useState('open');
  const [newIssuesResponsiblePersonId, setNewIssuesResponsiblePersonId] = useState(null);
  const [newIssuesStartDate, setNewIssuesStartDate] = useState('');
  const [newIssuesType, setNewIssuesType] = useState('');
  const [newIssuesEndDate, setNewIssuesEndDate] = useState('');
  const [newIssuesPriority, setNewIssuesPriority] = useState('None');
  const [newIssuesComments, setNewIssuesComments] = useState(""); 
  const [newIssuesTags, setNewIssuesTags] = useState([]);

  const [isSavingIssues, setIsSavingIssues] = useState(false);
  const [localError, setLocalError] = useState(null);

  const newIssuesTitleInputRef = useRef(null);
  const newTaskFormRowRef = useRef(null); // <<< MODIFICATION: Added ref for the new Issues form row
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


// <<< MODIFICATION: This useEffect is now correctly set up for Issuess

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
        setParentTaskForIssuess(foundTask);
        setParentTaskLookupStatus('found');
        if (foundTask.sub_tasks_managements && Array.isArray(foundTask.sub_tasks_managements)) {
          const processedIssuess = foundTask.sub_tasks_managements.map(sub => ({
            id: sub.id,
            taskTitle: sub.title || "Unnamed Issues",
            status: sub.status || 'open',
            responsiblePerson: sub.responsible_person?.name || 'Unassigned',
            responsiblePersonId: sub.responsible_person?.id || null,
            startDate: sub.started_at ? new Date(sub.started_at).toLocaleDateString('en-CA') : null,
            endDate: sub.target_date ? new Date(sub.target_date).toLocaleDateString('en-CA') : null,
            duration: calculateDuration(sub.started_at, sub.target_date),
            priority: sub.priority || 'None',
            tags: (sub.task_tags || []).map((tag) => tag.company_tag.name), 
          }));
          setData(processedIssuess);
        } else {
          setData([]);
        }
        setLocalError(null);
      } else {
        setParentTaskForIssuess(null); setParentTaskLookupStatus('not_found'); setData([]);
        setLocalError(`Parent task with ID ${parentId} not found.`);
      }
    } else if (!loadingAllTasks && allTasksFromStore && parentId) {
        setParentTaskLookupStatus('not_found'); setData([]);
        setLocalError(`Parent task with ID ${parentId} not found.`);
    }
  }, [allTasksFromStore, parentId, loadingAllTasks, allTasksError]);

  useEffect(() => {
    if (isAddingNewIssues && newIssuesTitleInputRef.current) {
      newIssuesTitleInputRef.current.focus();
    }
  }, [isAddingNewIssues]);

  const resetNewIssuesForm = useCallback(() => {
    setNewIssuesTitle('');
    setNewIssuesStatus('open');
    setNewIssuesResponsiblePersonId(null);
    setNewIssuesStartDate('');
    setNewIssuesEndDate('');
    setNewIssuesPriority('None');
    setNewIssuesTags([]);
    setLocalError(null);
  }, []);

  const handleShowNewIssuesForm = useCallback(() => {
    if (!parentTaskForIssuess) {
        setLocalError("Parent task not loaded. Cannot add Issues.");
        return;
    }
    resetNewIssuesForm();
    setIsAddingNewIssues(true);
  }, [parentTaskForIssuess, resetNewIssuesForm]);

  const handleCancelNewIssues = useCallback(() => {
    setIsAddingNewIssues(false);
    resetNewIssuesForm();
  }, [resetNewIssuesForm]);

  const handleSaveNewIssues = useCallback(async () => {
    if (!newIssuesTitle || newIssuesTitle.trim() === "") {
      setLocalError("Issues title cannot be empty.");
      if (newIssuesTitleInputRef.current) newIssuesTitleInputRef.current.focus();
      return;
    }
    setLocalError(null);
    setIsSavingIssues(true);

    const selectedTagIds = newIssuesTags
        .map(tagName => {
            const foundTag = Array.isArray(tagList) ? tagList.find(tagInStore => tagInStore.name === tagName) : null;
            return foundTag ? foundTag.id : null;
        })
        .filter(id => id !== null);

    const IssuesPayload = {
      parent_id: parentId,
      title: newIssuesTitle.trim(),
      status: newIssuesStatus,
      responsible_person_id: newIssuesResponsiblePersonId,
      project_management_id: parentTaskForIssuess?.projectManagementId || 2, // Consider making this more robust if needed
      started_at: newIssuesStartDate || null,
      target_date: newIssuesEndDate || null,
      priority: newIssuesPriority,
      task_tag_ids: selectedTagIds, 
    };

    try {
      await dispatch(createIssues(IssuesPayload)).unwrap(); 
      dispatch(fetchTasks()); 
      setIsAddingNewIssues(false);
      resetNewIssuesForm();
    } catch (error) {
      console.error("Failed to create Issues:", error);
      const errorMessage = error?.message || (typeof error === 'string' ? error : "Failed to save Issues.");
      setLocalError(errorMessage);
    } finally {
      setIsSavingIssues(false);
    }
  }, [
    dispatch, parentId, parentTaskForIssuess, resetNewIssuesForm,
    newIssuesTitle, newIssuesStatus, newIssuesResponsiblePersonId,
    newIssuesStartDate, newIssuesEndDate, newIssuesPriority, newIssuesTags,
    tagList 
  ]);

  const handleDeleteExistingIssues = useCallback((IssuesId) => {
      alert(`API for deleting existing Issues ${IssuesId} needs to be implemented.`);
  }, []);

useEffect(() => {
    const handleClickOutsideNewIssuesRow = (event) => {
      if (
        !isAddingNewIssues ||                // Not in add mode
        isSavingIssues ||                   // Currently saving
        !newTaskFormRowRef.current ||        // Ref not available
        newTaskFormRowRef.current.contains(event.target) // Click is inside the form
      ) {
        return;
      }

      // Click is outside, form is active, and not currently saving
      if (!newIssuesTitle || newIssuesTitle.trim() === "") {
        setIsAddingNewIssues(false);
        resetNewIssuesForm();
      } else {
        handleSaveNewIssues();
      }
    };

    if (isAddingNewIssues) {
      document.addEventListener("mousedown", handleClickOutsideNewIssuesRow);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNewIssuesRow);
    };
  }, [
    isAddingNewIssues,
    isSavingIssues, 
    newIssuesTitle,  
    handleSaveNewIssues, 
    resetNewIssuesForm,
  ]);



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
      { accessorKey: 'issueTitle', header: 'Issues Title', size: 250,
        cell: info => info.getValue()
      },
      { accessorKey: 'status', header: 'Status', size: 150,
        cell: info => <StatusBadge status={info.getValue()} statusOptions={globalStatusOptions} />
      },
      { accessorKey: 'responsiblePerson', header: 'Responsible Person', size: 180,
        cell: info => info.getValue() || <span className="text-gray-400">Unassigned</span>
      },
       {
        acccessorKey: 'issueType', header: 'Type', size: 160,
        cell: info => info.getValue() || <span className="text-gray-400">Unassigned</span>
       },
      { accessorKey: 'endDate', header: 'End Date', size: 160,
        cell: info => (info.getValue() ? new Date(info.getValue()).toLocaleDateString() : <span className="text-gray-400 p-1">N/A</span>)
      },
      { accessorKey: 'priority', header: 'Priority', size: 150,
        cell: info => <StatusBadge status={info.getValue()} statusOptions={globalPriorityOptions} />
      },
      { accessorKey: 'comments', header: 'Comments', size: 200, 
        cell: info => info.getValue() || <span className="text-gray-400">N/A</span>
      }
    ],
    [handleDeleteExistingIssues]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


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
        {localError && !isAddingNewIssues && <div className="mb-4 p-2 text-red-700 bg-red-100 border border-red-400 rounded text-sm">{localError}</div>}
        {/* Display localError for new Issues form if it's active */}
        {localError && isAddingNewIssues && <div className="my-2 p-2 text-red-700 bg-red-100 border border-red-400 rounded text-sm">{localError}</div>}
        {isSavingIssues && <div className="mb-4 p-2 text-blue-700 bg-blue-100 border border-blue-400 rounded text-sm">Saving Issues...</div>}
        <div className="overflow-x-auto h-[400px]">
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
              {isAddingNewIssues && (
                <tr ref={newTaskFormRowRef}> {/* <<< MODIFICATION: Assigned ref here */}
                  <td className="border p-1 text-xs text-gray-400 align-middle">NEW</td>
                  <td className="border p-1 align-middle">
                    <NewIssuesTextField
                      inputRef={newIssuesTitleInputRef}
                      value={newIssuesTitle}
                      onChange={(e) => { setNewIssuesTitle(e.target.value); if (localError) setLocalError(null);}} // Clear error on typing
                      onEnterPress={handleSaveNewIssues}
                      placeholder="Issues title"
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <StatusBadge
                        status={newIssuesStatus}
                        statusOptions={globalStatusOptions}
                        onStatusChange={setNewIssuesStatus}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <SelectBox
                        options={userOptionsForSelectBox}
                        value={newIssuesResponsiblePersonId}
                        onChange={setNewIssuesResponsiblePersonId}
                        placeholder="Select Person..."
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <NewIssuesDateEditor
                        value={newIssuesStartDate}
                        onChange={(e) => setNewIssuesStartDate(e.target.value)}
                        onEnterPress={handleSaveNewIssues}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                     <NewIssuesDateEditor
                        value={newIssuesEndDate}
                        onChange={(e) => setNewIssuesEndDate(e.target.value)}
                        onEnterPress={handleSaveNewIssues}
                    />
                  </td>
                  <td className="border p-1 text-xs align-middle">{newIssuesDuration}</td>
                  <td className="border p-1 align-middle">
                     <StatusBadge
                        status={newIssuesPriority}
                        statusOptions={globalPriorityOptions}
                        onStatusChange={setNewIssuesPriority}
                    />
                  </td>
                  <td className="border p-1 align-middle">
                    <UserCustomDropdownMultiple
                        value={newIssuesTags} 
                        options={tagNamesForDropdown} 
                        onChange={setNewIssuesTags} 
                        placeholder="Select Tags"
                        searchPlaceholder="Search tags..."
                    />
                  </td>
                  <td className="border p-1 text-center align-middle">
                    <div className="flex items-center justify-center space-x-1">
                        <button onClick={handleSaveNewIssues} className="text-green-600 hover:text-green-800 p-1 text-xs" disabled={isSavingIssues}>
                            {isSavingIssues ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={handleCancelNewIssues} className="text-gray-600 hover:text-gray-800 p-1 text-xs">Cancel</button>
                    </div>
                  </td>
                </tr>
              )}

              {!isAddingNewIssues && parentTaskLookupStatus === 'found' && (
                <tr>
                  <td colSpan={columns.length} className="border p-2 text-left text-[12px]">
                    <button onClick={handleShowNewIssuesForm} className="text-red-500 hover:underline text-sm  py-1">
                      Add Issues
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

export default IssuesTable;