import React, { useState, useEffect, useMemo, useRef, Fragment, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';

// Your Custom Components
import StatusBadge from "../Projects/statusBadge";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { ChevronDownIcon as HUIDownIcon, ArrowPathIcon } from '@heroicons/react/20/solid';

// Import SelectBox
import SelectBox from '../../SelectBox';

// Redux Thunks
import { fetchUsers } from '../../../redux/slices/userSlice';
import { fetchIssue, createIssue, updateIssue } from '../../../redux/slices/IssueSlice';
import { all } from 'axios';



const NewIssuesTextField = ({ value, onChange, onEnterPress, inputRef, placeholder, validator }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnterPress();
    }
  };
  return <input ref={inputRef} type="text" placeholder={placeholder} value={value || ""} onChange={onChange} onKeyDown={handleKeyDown} className={`${validator ? 'border border-red-500' : 'border-none'} w-full p-1 focus:outline-none rounded text-[12px] `} style={{ background: "none" }} />;
};

const NewIssuesDateEditor = ({ value, onChange, onEnterPress, placeholder, validator }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onEnterPress();
    }
  };
  return <input type="date" placeholder={placeholder} value={value || ""} onChange={onChange} onKeyDown={handleKeyDown} className={` ${validator ? 'border border-red-500' : 'border-none'} my-custom-date-editor w-full p-1 focus:outline-none rounded text-[13px] `} />;
};


// Constants
const globalPriorityOptions = ['None', 'Low', 'Medium', 'High', 'Urgent'];
const globalStatusOptions = ['open', 'in_progress', 'completed', 'on_hold'];
const globalTypesOptions = ['bug', 'task', 'feature', 'UI', 'UX'];


const IssuesTable = () => {
  const { id: parentId } = useParams();
  console.log(parentId);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const {
    fetchIssue: allIssuesFromStore, // Corrected: Assuming 'issues' is the key in state.fetchIssues
    loading: loadingAllIssues,
    error: allIssuesError,
  } = useSelector((state) => state.fetchIssues || { issues: [], loading: false, error: null });

  const {
    fetchUsers: users, // Corrected: Assuming 'users' is the key in state.fetchUsers and the desired variable name
    loading: loadingUsers,
    error: usersFetchError
  } = useSelector((state) => state.fetchUsers || { users: [], loading: false, error: null });

  const [data, setData] = useState([]);
  const [isAddingNewIssues, setIsAddingNewIssues] = useState(false);
  const [newIssuesTitle, setNewIssuesTitle] = useState('');
  const [newIssuesStatus, setNewIssuesStatus] = useState('open');
  const [newIssuesResponsiblePersonId, setNewIssuesResponsiblePersonId] = useState(null);
  const [newIssuesType, setNewIssuesType] = useState('');
  const [newIssuesEndDate, setNewIssuesEndDate] = useState('');
  const [newIssuesPriority, setNewIssuesPriority] = useState('None');
  const [newIssuesComments, setNewIssuesComments] = useState("");

  const [isSavingIssues, setIsSavingIssues] = useState(false);
  const [isUpdatingIssue, setIsUpdatingIssue] = useState(false); // Added state for tracking updates
  const [localError, setLocalError] = useState(null);
  const [validator, setValidator] = useState(false);

  const newIssuesTitleInputRef = useRef(null);
  const newIssueFormRowRef = useRef(null);
  const userFetchInitiatedRef = useRef(false);
  const allIssuesFetchInitiatedRef = useRef(false);

  useEffect(() => {
    if (!loadingAllIssues && (!allIssuesFromStore || !Array.isArray(allIssuesFromStore) || allIssuesFromStore.length === 0) && !allIssuesError && !allIssuesFetchInitiatedRef.current) {
      dispatch(fetchIssue({ token }));
      allIssuesFetchInitiatedRef.current = true;
    } else if (allIssuesFromStore || allIssuesError) {
      allIssuesFetchInitiatedRef.current = true;
    }
  }, [dispatch, allIssuesFromStore, loadingAllIssues, allIssuesError]);

  useEffect(() => {
    if (!loadingUsers && (!Array.isArray(users) || users.length === 0) && !usersFetchError && !userFetchInitiatedRef.current) {
      dispatch(fetchUsers({ token }));
      userFetchInitiatedRef.current = true;
    } else if ((Array.isArray(users) && users.length > 0) || usersFetchError) {
      userFetchInitiatedRef.current = true;
    }
  }, [dispatch, users, loadingUsers, usersFetchError]);


  useEffect(() => {
    let allIssues;
    if (parentId !== null) {
      allIssues = allIssuesFromStore.filter((issue) => issue.project_management_id == parentId);
    }
    else {
      allIssues = allIssuesFromStore;
    }
    console.log(allIssues);

    if (allIssues && Array.isArray(allIssues)) {
      const processedIssuess = allIssues.map(issue => ({
        id: issue.id,
        issueTitle: issue.title || "Unnamed Issues",
        status: issue.status || 'open',
        responsiblePerson: issue.responsible_person?.name || 'Unassigned',
        responsiblePersonId: issue.responsible_person?.id || null,
        issueType: issue.issue_type || 'None',
        endDate: issue.end_date ? new Date(issue.end_date).toLocaleDateString('en-CA') : null, // Ensure 'en-CA' format (YYYY-MM-DD) is compatible with date input
        priority: issue.priority || 'None',
        comments: issue.comments && issue.comments.length > 0 && issue.comments[0]?.body ? issue.comments[0].body : '', // Robust comment handling
      }));
      setData(processedIssuess);
      setLocalError(null);
    } else if (allIssuesError) {
      setLocalError('Failed to load issues.');
      setData([]);
    }
  }, [allIssuesFromStore, allIssuesError, parentId]);


  useEffect(() => {
    if (isAddingNewIssues && newIssuesTitleInputRef.current) {
      newIssuesTitleInputRef.current.focus();
    }
  }, [isAddingNewIssues]);

  const resetNewIssuesForm = useCallback(() => {
    setNewIssuesTitle('');
    setNewIssuesStatus('open');
    setNewIssuesResponsiblePersonId(null);
    setNewIssuesType('');
    setNewIssuesEndDate('');
    setNewIssuesPriority('None');
    setNewIssuesComments('');
    setLocalError(null);
    setValidator(false);
  }, []);

  const handleShowNewIssuesForm = useCallback(() => {
    resetNewIssuesForm();
    setIsAddingNewIssues(true);
  }, [resetNewIssuesForm]);

  const handleCancelNewIssues = useCallback(() => {
    setIsAddingNewIssues(false);
    resetNewIssuesForm();
  }, [resetNewIssuesForm]);

  const handleSaveNewIssues = useCallback(async () => {
    if (!newIssuesTitle || newIssuesTitle.trim() === "" || !newIssuesEndDate) {
      setLocalError("Please fill in all required fields.");
      setValidator(true);
      return;
    }
    setLocalError(null);
    setIsSavingIssues(true);
    setValidator(false);

    const IssuesPayload = {
      title: newIssuesTitle.trim(),
      status: newIssuesStatus,
      responsible_person_id: newIssuesResponsiblePersonId,
      project_management_id: parentId || null,
      start_date: new Date().toISOString(), // Standard ISO format for dates
      end_date: newIssuesEndDate || null,
      priority: newIssuesPriority,
      created_by_id: 158,
      comment: newIssuesComments, // Example: Save as array of comment objects
      issue_type: newIssuesType
    };

    try {
      await dispatch(createIssue({ token, data: IssuesPayload })).unwrap();
      dispatch(fetchIssue({ token })); // Re-fetch issues to get the latest data including the new one
      setIsAddingNewIssues(false);
      resetNewIssuesForm();
    } catch (error) {
      console.error("Failed to create Issues:", error);
      const errorMessage = error?.response?.data?.message || error?.message || (typeof error === 'string' ? error : "Failed to save Issues.");
      setLocalError(errorMessage);
    } finally {
      setIsSavingIssues(false);
    }
  }, [
    dispatch, parentId, resetNewIssuesForm,
    newIssuesTitle, newIssuesStatus, newIssuesResponsiblePersonId,
    newIssuesEndDate, newIssuesPriority, newIssuesComments, newIssuesType
  ]);

  const handleDeleteExistingIssues = useCallback((IssuesId) => {
    alert(`API for deleting existing Issues ${IssuesId} needs to be implemented.`);
  }, []);

  const handleUpdateIssues = useCallback(async (id, field, newValue) => {
    // Optimistic UI updat

    setIsUpdatingIssue(true);
    setLocalError(null);

    try {
      const payload = { [field]: newValue };
      if (field === "responsiblePersonId") {
        delete payload.responsiblePersonId; // remove camelCase if backend expects snake_case
        payload.responsible_person_id = newValue;
      }

      await dispatch(updateIssue({ token, id: id, payload })).unwrap();
      dispatch(fetchIssue({ token }));
    } catch (error) {
      console.error("Failed to update issue:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update issue.";
      setLocalError(errorMessage);
      dispatch(fetchIssue({ token }));
    } finally {
      setIsUpdatingIssue(false);
    }
  }, [dispatch, users]);


  useEffect(() => {
    const handleClickOutsideNewIssuesRow = (event) => {
      if (
        !isAddingNewIssues ||
        isSavingIssues || isUpdatingIssue || // Consider ongoing updates
        !newIssueFormRowRef.current ||
        newIssueFormRowRef.current.contains(event.target)
      ) {
        return;
      }

      handleSaveNewIssues();
    };

    if (isAddingNewIssues) {
      document.addEventListener("mousedown", handleClickOutsideNewIssuesRow);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideNewIssuesRow);
    };
  }, [
    isAddingNewIssues,
    isSavingIssues, isUpdatingIssue, // Added isUpdatingIssue
    newIssuesTitle,
    handleSaveNewIssues,
    resetNewIssuesForm,
  ]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (!isAddingNewIssues) return;
      if (event.key === "Escape") {
        console.log("Escape key pressed!");
        handleCancelNewIssues();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isAddingNewIssues, handleCancelNewIssues]);




  const userOptionsForSelectBox = useMemo(() => [
    { value: null, label: "Unassigned" },
    ...(Array.isArray(users) ? users.map(u => ({ value: u.id, label: `${u.firstname || ''} ${u.lastname || ''}`.trim() })) : [])
  ], [users]);


  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Default page size
  });



  const fixedRowsPerPage = 10;
  const rowHeight = 45;
  const headerHeight = 42;
  const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id', header: 'Issue id', size: 80,
        cell: ({ getValue }) => <span className="text-xs text-gray-500 px-1">{`I-${getValue()?.toString().slice(-5)}`}</span>
      },
      {
        accessorKey: 'issueTitle', header: 'Issues Title', size: 150,
        cell: info => info.getValue()
      },
      {
        accessorKey: 'status', header: 'Status', size: 100,
        cell: ({ row }) => <StatusBadge status={row.original.status} statusOptions={globalStatusOptions} onStatusChange={(newStatus) => handleUpdateIssues(row.original.id, "status", newStatus)} />
      },
      {
        accessorKey: 'responsiblePerson', header: 'Responsible Person', size: 150,
        cell: ({ row }) => {
          return (
            <SelectBox table={true} options={userOptionsForSelectBox} value={row.original.responsiblePersonId} onChange={(selectedOptionValue) => handleUpdateIssues(row.original.id, "responsible_person_id", selectedOptionValue)} />
          );
        }
      },
      {
        accessorKey: 'issueType', header: 'Type', size: 100,
        cell: ({ row }) => {
          return (
            <StatusBadge status={row.original.issueType} statusOptions={globalTypesOptions} onStatusChange={(newStatus) => handleUpdateIssues(row.original.id, "issue_type", newStatus)} />
          )
        }
      },
      {
        accessorKey: 'endDate', header: 'End Date', size: 100,
        // Assuming NewIssuesDateEditor value is YYYY-MM-DD and toLocaleDateString matches this or is acceptable for display
        cell: ({ row }) => {
          const originalValue = row.original.endDate; // This is already processed into en-CA (YYYY-MM-DD like) string or null
          return <NewIssuesDateEditor
            value={originalValue || ""}
            onChange={(e) => handleUpdateIssues(row.original.id, "end_date", e.target.value || null)} // Send as end_date, ensure null if empty
            placeholder="End Date"
          />;
        }
      },
      {
        accessorKey: 'priority', header: 'Priority', size: 100,
        cell: ({ row }) => <StatusBadge status={row.original.priority} statusOptions={globalPriorityOptions} onStatusChange={(newStatus) => handleUpdateIssues(row.original.id, "priority", newStatus)} />
      },
      {
        accessorKey: 'comments', header: 'Comments', size: 360,
        cell: ({ row }) => (
          <NewIssuesTextField
            value={row.original.comments}
            onChange={(e) => handleUpdateIssues(row.original.id, "comments", e.target.value)} // Assuming comments is a string field now
            placeholder="Comments"
          />
        )
      },
    ],
    [handleDeleteExistingIssues, handleUpdateIssues, userOptionsForSelectBox]
  );

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });


  let pageContent;
  if (loadingAllIssues || (loadingUsers && !userFetchInitiatedRef.current) || isSavingIssues || isUpdatingIssue) { // Added isSavingIssues and isUpdatingIssue to main loader
    pageContent = (<div className="p-4 flex justify-center items-center min-h-[200px]"><ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" /> Loading data...</div>);
  } else if (allIssuesError || usersFetchError) {
    pageContent = (<div className="p-4 text-red-600 bg-red-100 border border-red-400 rounded">
      Error: {localError || String(allIssuesError?.message || allIssuesError || usersFetchError?.message || usersFetchError || "Could not load required data.")}
    </div>);
  } else {
    pageContent = (
      <div className="p-3">
        {localError && <div className="mb-4 px-3 text-red-700  text-sm">{localError}</div>}
        {/* Removed individual isSavingIssues message as it's covered by the main loader now */}
        <div className="project-table-container font-light mt-2"
          style={{ height: `${desiredTableHeight}px`, minHeight: "200px" }}

        >
          <div className="table-wrapper overflow-x-auto" >
            <table className="w-full border text-sm bg-white overflow-y-auto ">
              <thead >
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id} style={{ width: header.getSize() ? `${header.getSize()}px` : undefined, height: `${headerHeight}px` }} className="border p-2 text-center text-gray-700 font-semibold sticky top-0">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50 even:bg-gray-100" style={{ height: `${rowHeight}px` }}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className={`border p-1 align-middle ${cell.column.id === 'actions' ? 'text-center' : 'text-left'}`}>
                        <div className="p-1 h-full flex items-center">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
                {isAddingNewIssues && (
                  <tr ref={newIssueFormRowRef} style={{ height: `${rowHeight}px` }}>
                    <td className="border p-1 text-xs text-gray-400 align-middle">NEW</td>
                    <td className="border p-1 align-middle">
                      <NewIssuesTextField
                        inputRef={newIssuesTitleInputRef}
                        value={newIssuesTitle}
                        onChange={(e) => { setNewIssuesTitle(e.target.value); if (localError) setLocalError(null); }}
                        onEnterPress={handleSaveNewIssues}
                        placeholder="Issues title"
                        validator={validator}
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
                        table={true}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <StatusBadge
                        status={newIssuesType}
                        statusOptions={globalTypesOptions}
                        onStatusChange={setNewIssuesType}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <NewIssuesDateEditor
                        value={newIssuesEndDate}
                        onChange={(e) => setNewIssuesEndDate(e.target.value)}
                        onEnterPress={handleSaveNewIssues}
                        validator={validator}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <StatusBadge
                        status={newIssuesPriority}
                        statusOptions={globalPriorityOptions}
                        onStatusChange={setNewIssuesPriority}
                      />
                    </td>
                    <td className="border p-1 align-middle">
                      <NewIssuesTextField
                        value={newIssuesComments}
                        onChange={(e) => { setNewIssuesComments(e.target.value); if (localError) setLocalError(null); }}
                        onEnterPress={handleSaveNewIssues}
                        placeholder="Comments"

                      />
                    </td>
                  </tr>
                )}

                {!isAddingNewIssues && (
                  <tr>
                    <td colSpan={columns.length} className="border p-2 text-left text-[12px]">
                      <button onClick={handleShowNewIssuesForm} className="text-red-500 hover:underline text-sm py-1" disabled={isSavingIssues || isUpdatingIssue}>
                        + Add Issues
                      </button>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        </div>
        {data.length > 0 && (
          <div className=" flex items-center justify-start gap-4 w-full ml-3 text-[12px]">
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
  }

  return pageContent
};

export default IssuesTable;