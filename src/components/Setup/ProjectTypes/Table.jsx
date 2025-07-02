// /* eslint-disable react/prop-types */
// import { useState, useMemo, useEffect } from 'react';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import Switch from '@mui/joy/Switch';
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   getPaginationRowModel,
// } from '@tanstack/react-table';
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteProjectType, fetchProjectTypes, updateProjectType } from '../../../redux/slices/projectSlice';
// import Modal from './Modal';
// import toast from 'react-hot-toast';

// const TypesTable = () => {
//   const token = localStorage.getItem('token');
//   const [openModal, setOpenModal] = useState(false);
//   const [editMode, setEditMode] = useState(false);
//   const [selectedData, setSelectedData] = useState(null);

//   const [data, setData] = useState([]);

//   const dispatch = useDispatch();
//   const { fetchProjectTypes: ProjectTypes } = useSelector((state) => state.fetchProjectTypes);


//   // Initial fetch of project types
//   useEffect(() => {
//     dispatch(fetchProjectTypes({ token }));
//   }, [dispatch]);

//   // Update table data when ProjectTypes changes
//   useEffect(() => {
//     if (ProjectTypes && ProjectTypes.length > 0) {
//       setData(ProjectTypes);
//     }
//   }, [ProjectTypes]);

//   // Fetch data when modal closes to ensure table is refreshed
//   useEffect(() => {
//     if (!openModal) {
//       dispatch(fetchProjectTypes({ token }));
//     }
//   }, [openModal, dispatch]);

//   const handleEditClick = (row) => {
//     setSelectedData(row.original);
//     setEditMode(true);
//     setOpenModal(true);
//   };

//   const handleDeleteClick = async (id) => {
//     try {
//       await dispatch(deleteProjectType({ token, id })).unwrap(); // unwrap to handle async correctly
//       toast.dismiss();
//       toast.success('Project Type deleted successfully', {
//         iconTheme: {
//           primary: 'red', // This might directly change the color of the success icon
//           secondary: 'white', // The circle background
//         },
//       });
//       dispatch(fetchProjectTypes({ token })); // refetch data after successful delete
//     } catch (error) {
//       console.error('Failed to delete:', error);
//       toast.error('Failed to delete Project Type.', {
//         iconTheme: {
//           primary: 'red', // This might directly change the color of the error icon
//           secondary: 'white', // The circle background
//         },
//       })
//     }
//   };

//   const handleToggle = async (row) => {
//     const updatedValue = !row.original.active;
//     const payload = {
//       active: updatedValue,
//     };

//     try {
//       await dispatch(updateProjectType({ token, id: row.original.id, data: payload })).unwrap();
//       toast.dismiss();
//       toast.success(`status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
//         iconTheme: {
//           primary: updatedValue ? 'green' : 'red',
//           secondary: 'white',
//         },
//       });
//       dispatch(fetchProjectTypes({ token }));
//     } catch (error) {
//       console.error('Failed to update toggle:', error, {
//         iconTheme: {
//           primary: 'red', // This might directly change the color of the error icon
//           secondary: 'white', // The circle background
//         },
//       });
//     }
//   };

//   const ActionIcons = ({ row }) => (
//     <div className="action-icons flex justify-between gap-5">
//       <div>
//         <EditOutlinedIcon
//           sx={{ fontSize: '20px', cursor: 'pointer' }}
//           onClick={() => handleEditClick(row)}
//         />
//         <button
//           title="Delete"
//         >
//           <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} onClick={() => handleDeleteClick(row.original.id)} />
//         </button>
//       </div>
//     </div>
//   );

//   function formatToDDMMYYYY(dateString) {
//     const date = new Date(dateString);
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   }

//   const fixedRowsPerPage = 13;

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Project Type Name',
//         size: 450,
//         cell: ({ row, getValue }) => {
//           const value = getValue();
//           return value
//         },
//       },
//       {
//         accessorKey: 'status',
//         header: 'Status',
//         size: 150,
//         cell: ({ row }) => {
//           const isActive = row.original.active;

//           return (
//             <div className="flex gap-4">
//               <span>Inactive</span>
//               <Switch
//                 color={`${isActive ? 'success' : 'danger'}`}

//                 checked={isActive}
//                 onChange={() => handleToggle(row)} // toggle the row state
//               />
//               <span>Active</span>

//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'created_at',
//         header: 'CreatedOn',
//         size: 150,
//         cell: ({ getValue }) => {
//           const rawDate = getValue();
//           return rawDate ? <span className="pl-2">{formatToDDMMYYYY(rawDate)} </span> : null;
//         },
//       },
//       {
//         accessorKey: 'created_by',
//         header: 'Created By',
//         size: 150,
//         cell: ({ row, getValue }) => {
//           return row.original ? getValue() : null;
//         },
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         size: 60,
//         cell: ({ row }) => (row.original ? <ActionIcons row={row} /> : null),
//         meta: {
//           cellClassName: 'actions-cell-content',
//         },
//       },
//     ],
//     []
//   );

//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: fixedRowsPerPage,
//   });

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       pagination,
//     },
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     manualPagination: false,
//   });

//   const pageRows = table.getRowModel().rows;
//   const numDataRowsOnPage = pageRows.length;
//   const numEmptyRowsToAdd = Math.max(0, fixedRowsPerPage - numDataRowsOnPage);

//   const rowHeight = 40;
//   const headerHeight = 48;
//   const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;

//   return (
//     <>
//       <div className="project-table-container text-[14px] font-light">
//         <div
//           className="table-wrapper overflow-x-auto"
//           style={{ height: `${desiredTableHeight}px` }}
//         >
//           <table className="w-full">
//             <thead>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <th
//                       key={header.id}
//                       colSpan={header.colSpan}
//                       style={{ width: header.getSize() }}
//                       className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2"
//                     >
//                       {header.isPlaceholder ? null : (
//                         <div>
//                           {flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                         </div>
//                       )}
//                     </th>
//                   ))}
//                 </tr>
//               ))}
//             </thead>
//             <tbody
//               className="divide-y"
//               style={{ height: `${fixedRowsPerPage * rowHeight}px` }}
//             >
//               {pageRows.map((row) => {
//                 const isDataRowConsideredEmpty = !row.original || Object.values(row.original).every((v) => v === null || v === '');

//                 return (
//                   <tr
//                     key={row.id}
//                     className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${isDataRowConsideredEmpty ? 'pointer-events-none text-transparent' : ''}`}
//                     style={{ height: `${rowHeight}px` }}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <td
//                         key={cell.id}
//                         style={{ width: cell.column.getSize() }}
//                         className={`${cell.column.columnDef.meta?.cellClassName || ''} whitespace-nowrap px-3 py-2 border-r-2`}
//                       >
//                         {!isDataRowConsideredEmpty
//                           ? flexRender(cell.column.columnDef.cell, cell.getContext())
//                           : null}
//                       </td>
//                     ))}
//                   </tr>
//                 );
//               })}
//               {Array.from({ length: numEmptyRowsToAdd }).map((_, index) => (
//                 <tr
//                   key={`empty-row-${index}`}
//                   style={{ height: `${rowHeight}px` }}
//                   className="even:bg-[#D5DBDB4D] pointer-events-none"
//                 >
//                   {table.getAllLeafColumns().map((column) => (
//                     <td
//                       key={`empty-cell-${index}-${column.id}`}
//                       style={{ width: column.getSize() }}
//                       className="whitespace-nowrap px-3 py-2 text-transparent"
//                     >
//                       &nbsp;
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {data.length > 0 && (
//           <div className=" flex items-center justify-start gap-4 mt-4 text-[12px]">
//             {/* Previous Button */}
//             <button
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//               className="text-red-600 disabled:opacity-30"
//             >
//               {"<"}
//             </button>

//             {/* Page Numbers (Sliding Window of 3) */}
//             {(() => {
//               const totalPages = table.getPageCount();
//               const currentPage = table.getState().pagination.pageIndex;
//               const visiblePages = 3;

//               let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
//               let end = start + visiblePages;

//               // Ensure end does not exceed total pages
//               if (end > totalPages) {
//                 end = totalPages;
//                 start = Math.max(0, end - visiblePages);
//               }

//               return [...Array(end - start)].map((_, i) => {
//                 const page = start + i;
//                 const isActive = page === currentPage;

//                 return (
//                   <button
//                     key={page}
//                     onClick={() => table.setPageIndex(page)}
//                     className={` px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""}`}
//                   >
//                     {page + 1}
//                   </button>
//                 );
//               });
//             })()}

//             {/* Next Button */}
//             <button
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//               className="text-red-600 disabled:opacity-30"
//             >
//               {">"}
//             </button>
//           </div>
//         )}
//       </div>
//       {openModal && (
//         <Modal
//           openModal={openModal}
//           setOpenModal={setOpenModal}
//           editMode={editMode}
//           existingData={selectedData}
//         />
//       )}
//     </>
//   );
// };

// export default TypesTable;


/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProjectType, fetchProjectTypes, updateProjectType } from '../../../redux/slices/projectSlice';
import Modal from './Modal';
import toast from 'react-hot-toast';

const TypesTable = () => {
  const token = localStorage.getItem('token');
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { fetchProjectTypes: ProjectTypes } = useSelector((state) => state.fetchProjectTypes);

  // Initial fetch of project types
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProjectTypes({ token })).unwrap();
      } catch (error) {
        console.error('Failed to fetch project types:', error);
        toast.error('Error fetching project types');
      }
    };

    fetchData();
  }, [dispatch, token]);

  // Update table data when ProjectTypes changes
  useEffect(() => {
    if (ProjectTypes && ProjectTypes.length > 0) {
      setData(ProjectTypes);
    }
  }, [ProjectTypes]);

  const handleEditClick = (row) => {
    setSelectedData(row.original);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteProjectType({ token, id })).unwrap();
      toast.dismiss();
      toast.success('Project Type deleted successfully', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
      dispatch(fetchProjectTypes({ token }));
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete Project Type.', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
    }
  };

  const handleToggle = async (row) => {
    const updatedValue = !row.original.active;
    const payload = {
      active: updatedValue,
    };

    try {
      await dispatch(updateProjectType({ token, id: row.original.id, data: payload })).unwrap();
      toast.dismiss();
      toast.success(`status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
        iconTheme: {
          primary: updatedValue ? 'green' : 'red',
          secondary: 'white',
        },
      });
      dispatch(fetchProjectTypes({ token }));
    } catch (error) {
      console.error('Failed to update toggle:', error);
      toast.error('Failed to update status.', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
    }
  };

  const ActionIcons = ({ row }) => (
    <div className="action-icons flex justify-between gap-5">
      <div>
        <EditOutlinedIcon
          sx={{ fontSize: '20px', cursor: 'pointer' }}
          onClick={() => handleEditClick(row)}
        />
        <button title="Delete">
          <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} onClick={() => handleDeleteClick(row.original.id)} />
        </button>
      </div>
    </div>
  );

  function formatToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const fixedRowsPerPage = 13;

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Project Type Name',
        size: 450,
        cell: ({ row, getValue }) => getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: ({ row }) => {
          const isActive = row.original.active;
          return (
            <div className="flex gap-4">
              <span>Inactive</span>
              <Switch
                color={`${isActive ? 'success' : 'danger'}`}
                checked={isActive}
                onChange={() => handleToggle(row)}
              />
              <span>Active</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'created_at',
        header: 'CreatedOn',
        size: 150,
        cell: ({ getValue }) => {
          const rawDate = getValue();
          return rawDate ? <span className="pl-2">{formatToDDMMYYYY(rawDate)} </span> : null;
        },
      },
      {
        accessorKey: 'created_by',
        header: 'Created By',
        size: 150,
        cell: ({ row, getValue }) => (row.original ? getValue() : null),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 60,
        cell: ({ row }) => (row.original ? <ActionIcons row={row} /> : null),
        meta: {
          cellClassName: 'actions-cell-content',
        },
      },
    ],
    []
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const pageRows = table.getRowModel().rows;
  const numDataRowsOnPage = pageRows.length;
  const numEmptyRowsToAdd = Math.max(0, fixedRowsPerPage - numDataRowsOnPage);

  const rowHeight = 40;
  const headerHeight = 48;
  const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;

  return (
    <>
      <div className="project-table-container text-[14px] font-light">
        <div className="table-wrapper overflow-x-auto" style={{ height: `${desiredTableHeight}px` }}>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2"
                    >
                      {header.isPlaceholder ? null : (
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y" style={{ height: `${fixedRowsPerPage * rowHeight}px` }}>
              {pageRows.map((row) => {
                const isDataRowConsideredEmpty = !row.original || Object.values(row.original).every((v) => v === null || v === '');

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${isDataRowConsideredEmpty ? 'pointer-events-none text-transparent' : ''}`}
                    style={{ height: `${rowHeight}px` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`${cell.column.columnDef.meta?.cellClassName || ''} whitespace-nowrap px-3 py-2 border-r-2`}
                      >
                        {!isDataRowConsideredEmpty ? flexRender(cell.column.columnDef.cell, cell.getContext()) : null}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {Array.from({ length: numEmptyRowsToAdd }).map((_, index) => (
                <tr
                  key={`empty-row-${index}`}
                  style={{ height: `${rowHeight}px` }}
                  className="even:bg-[#D5DBDB4D] pointer-events-none"
                >
                  {table.getAllLeafColumns().map((column) => (
                    <td
                      key={`empty-cell-${index}-${column.id}`}
                      style={{ width: column.getSize() }}
                      className="whitespace-nowrap px-3 py-2 text-transparent"
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length > 0 && (
          <div className=" flex items-center justify-start gap-4 mt-4 text-[12px]">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-red-600 disabled:opacity-30"
            >
              {'<'}
            </button>

            {(() => {
              const totalPages = table.getPageCount();
              const currentPage = table.getState().pagination.pageIndex;
              const visiblePages = 3;

              let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
              let end = start + visiblePages;
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
                    className={` px-3 py-1 ${isActive ? 'bg-gray-200 font-bold' : ''}`}
                  >
                    {page + 1}
                  </button>
                );
              });
            })()}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-red-600 disabled:opacity-30"
            >
              {'>'}
            </button>
          </div>
        )}
      </div>
      {openModal && (
        <Modal
          openModal={openModal}
          setOpenModal={setOpenModal}
          editMode={editMode}
          existingData={selectedData}
        />
      )}
    </>
  );
};

export default TypesTable;
