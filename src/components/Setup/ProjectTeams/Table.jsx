// import { useState, useMemo, useEffect } from 'react';
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import { Link } from 'react-router-dom';
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   getPaginationRowModel,
// } from '@tanstack/react-table';
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteProjectTeam, fetchProjectTeams } from '../../../redux/slices/projectSlice';
// import TeamModal from './Modal';
// import toast from 'react-hot-toast';


// const TeamsTable = () => {
//   const token = localStorage.getItem('token');
//   const dispatch = useDispatch();
//   const { fetchProjectTeams: projectTeams } = useSelector(state => state.fetchProjectTeams);

//   const [data, setData] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTeamId, setSelectedTeamId] = useState(null);
//   const fixedRowsPerPage = 13;

//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: fixedRowsPerPage,
//   });
//   const ActionIcons = ({ row, open }) => {
//     const handleDeleteClick = async (id) => {
//       try {
//         await dispatch(deleteProjectTeam({ token, id })).unwrap(); // unwrap to handle async correctly
//         dispatch(fetchProjectTeams({ token })); // refetch data after successful delete
//         toast.dismiss();
//         toast.success('Project Team deleted successfully', {
//           iconTheme: {
//             primary: 'red', // This might directly change the color of the success icon
//             secondary: 'white', // The circle background
//           },
//         });

//       } catch (error) {
//         console.error('Failed to delete:', error);
//         toast.error('Failed to delete Project Team.', {
//           iconTheme: {
//             primary: 'red', // This might directly change the color of the success icon
//             secondary: 'white', // The circle background
//           },
//         });
//       }
//     };

//     return (
//       <div className="action-icons flex justify-between gap-5">
//         <div>
//           <button
//             onClick={() => open(row.original.id)}
//           >
//             <EditOutlinedIcon sx={{ fontSize: "20px" }} />
//           </button>
//           <button
//             onClick={() => handleDeleteClick(row.original.id)}
//             title="Delete"
//           >
//             <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
//           </button>
//         </div>
//       </div>
//     )
//   };

//   useEffect(() => {
//     dispatch(fetchProjectTeams({ token }));
//   }, [dispatch]);

//   useEffect(() => {
//     if (projectTeams && Array.isArray(projectTeams)) {
//       const transformedData = projectTeams.map(team => ({
//         id: team.id,
//         name: team.name,
//         lead: team.team_lead?.name || 'N/A',
//         associatedProjects: team.project_management?.name || 'N/A',
//         TeamMember: team.project_team_members?.length + 1 || 0,
//       }));
//       setData(transformedData);
//     } else {
//       setData([]);
//     }
//   }, [projectTeams]);

//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'name',
//         header: 'Team name',
//         size: 350,
//         cell: ({ row, getValue }) => {
//           return row.original ? (
//             <Link
//               to={`/setup/project-teams/details/${row.original.id}`}
//               className="text-blue-600 hover:text-blue-800 hover:underline"
//             >
//               {getValue()}
//             </Link>
//           ) : null;
//         },
//       },
//       {
//         accessorKey: 'lead',
//         header: 'Team Lead',
//         size: 150,
//         cell: ({ row, getValue }) => {
//           return row.original ? getValue() : null;
//         },
//       },
//       {
//         accessorKey: 'TeamMember',
//         header: () => <div>Team Members (<i>TL+Members</i>)</div>,
//         size: 150,
//         cell: ({ row, getValue }) => {
//           return row.original ? (
//             <span style={{ paddingLeft: '12px' }}>{getValue()}</span>
//           ) : null;
//         },
//       },
//       {
//         id: 'actions',
//         header: 'Actions',
//         size: 60,
//         cell: ({ row }) => (
//           row.original ? <ActionIcons open={(id) => {
//             setSelectedTeamId(id);
//             setIsModalOpen(true);
//           }} row={row} /> : null
//         ),
//         meta: {
//           cellClassName: 'actions-cell-content',
//         },
//       },
//     ],
//     []
//   );

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
//   const desiredTableHeight = (fixedRowsPerPage * rowHeight) + headerHeight;

//   return (
//     <>
//       <div className="project-table-container text-[14px] font-light">
//         <div
//           className="table-wrapper overflow-x-auto"
//           style={{ height: `${desiredTableHeight}px` }}
//         >
//           <table className="w-full">
//             <thead>
//               {table.getHeaderGroups().map(headerGroup => (
//                 <tr key={headerGroup.id}>
//                   {headerGroup.headers.map(header => (
//                     <th
//                       key={header.id}
//                       colSpan={header.colSpan}
//                       style={{ width: header.getSize() }}
//                       className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2 border-[#FFFFFF66]"
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
//             <tbody className="divide-y" style={{ height: `${fixedRowsPerPage * rowHeight}px` }}>
//               {pageRows.map(row => {
//                 const isDataRowConsideredEmpty = !row.original || Object.values(row.original).every(v => v === null || v === '');

//                 return (
//                   <tr
//                     key={row.id}
//                     className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${isDataRowConsideredEmpty ? 'pointer-events-none text-transparent' : ''}`}
//                     style={{ height: `${rowHeight}px` }}
//                   >
//                     {row.getVisibleCells().map(cell => (
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
//                   {table.getAllLeafColumns().map(column => (
//                     <td
//                       key={`empty-cell-${index}-${column.id}`}
//                       style={{ width: column.getSize() }}
//                       className="whitespace-nowrap px-3 py-2 text-transparent border-r-2"
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
//           <div className="flex items-center justify-start gap-4 mt-4 text-[12px]">
//             <button
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//               className="text-red-600 disabled:opacity-30"
//             >
//               {"<"}
//             </button>
//             {(() => {
//               const totalPages = table.getPageCount();
//               const currentPage = table.getState().pagination.pageIndex;
//               const visiblePages = 3;

//               let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
//               let end = start + visiblePages;

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
//                     className={`px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""}`}
//                   >
//                     {page + 1}
//                   </button>
//                 );
//               });
//             })()}
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
//       {isModalOpen && (
//         <TeamModal
//           isModalOpen={isModalOpen}
//           setIsModalOpen={setIsModalOpen}
//           isEdit={true}
//           id={selectedTeamId}
//         />
//       )}
//     </>
//   );
// };

// export default TeamsTable;


import { useState, useMemo, useEffect } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProjectTeam, fetchProjectTeams } from '../../../redux/slices/projectSlice';
import TeamModal from './Modal';
import toast from 'react-hot-toast';

const TeamsTable = () => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const { fetchProjectTeams: projectTeams = [] } = useSelector(state => state.fetchProjectTeams || {});

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const fixedRowsPerPage = 13;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

  const ActionIcons = ({ row, open }) => {
    const handleDeleteClick = async (id) => {
      try {
        await dispatch(deleteProjectTeam({ token, id })).unwrap();
        await dispatch(fetchProjectTeams({ token }));
        toast.dismiss();
        toast.success('Project Team deleted successfully', {
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        });
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete Project Team.', {
          iconTheme: {
            primary: 'red',
            secondary: 'white',
          },
        });
      }
    };

    return (
      <div className="action-icons flex justify-between gap-5">
        <button onClick={() => open(row.original.id)}>
          <EditOutlinedIcon sx={{ fontSize: "20px" }} />
        </button>
        <button
          onClick={() => handleDeleteClick(row.original.id)}
          title="Delete"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
        </button>
      </div>
    );
  };

  // ✅ useEffect with try-catch for dispatch
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          await dispatch(fetchProjectTeams({ token })).unwrap();
        }
      } catch (error) {
        console.error('Failed to fetch project teams:', error);
        toast.error('Failed to load project teams');
      }
    };

    fetchData();
  }, [dispatch, token]);

  // ✅ Safe mapping
  useEffect(() => {
    if (Array.isArray(projectTeams)) {
      const transformedData = projectTeams.map(team => ({
        id: team?.id ?? '',
        name: team?.name ?? 'N/A',
        lead: team?.team_lead?.name ?? 'N/A',
        associatedProjects: team?.project_management?.name ?? 'N/A',
        TeamMember: (team?.project_team_members?.length ?? 0) + 1,
      }));
      setData(transformedData);
    } else {
      setData([]);
    }
  }, [projectTeams]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Team name',
        size: 350,
        cell: ({ row, getValue }) => (
          row.original ? (
            <Link
              to={`/setup/project-teams/details/${row.original.id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {getValue()}
            </Link>
          ) : null
        ),
      },
      {
        accessorKey: 'lead',
        header: 'Team Lead',
        size: 150,
        cell: ({ row, getValue }) => row.original ? getValue() : null,
      },
      {
        accessorKey: 'TeamMember',
        header: () => <div>Team Members (<i>TL+Members</i>)</div>,
        size: 150,
        cell: ({ row, getValue }) => (
          row.original ? (
            <span style={{ paddingLeft: '12px' }}>{getValue()}</span>
          ) : null
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 60,
        cell: ({ row }) =>
          row.original ? (
            <ActionIcons
              open={(id) => {
                setSelectedTeamId(id);
                setIsModalOpen(true);
              }}
              row={row}
            />
          ) : null,
        meta: {
          cellClassName: 'actions-cell-content',
        },
      },
    ],
    []
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

  const pageRows = table.getRowModel().rows;
  const numDataRowsOnPage = pageRows.length;
  const numEmptyRowsToAdd = Math.max(0, fixedRowsPerPage - numDataRowsOnPage);
  const rowHeight = 40;
  const headerHeight = 48;
  const desiredTableHeight = (fixedRowsPerPage * rowHeight) + headerHeight;

  return (
    <>
      <div className="project-table-container text-[14px] font-light">
        <div
          className="table-wrapper overflow-x-auto"
          style={{ height: `${desiredTableHeight}px` }}
        >
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2 border-[#FFFFFF66]"
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              className="divide-y"
              style={{ height: `${fixedRowsPerPage * rowHeight}px` }}
            >
              {pageRows.map(row => {
                const isEmptyRow =
                  !row.original ||
                  Object.values(row.original).every(v => v === null || v === '');

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${isEmptyRow ? 'pointer-events-none text-transparent' : ''
                      }`}
                    style={{ height: `${rowHeight}px` }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`${cell.column.columnDef.meta?.cellClassName || ''} whitespace-nowrap px-3 py-2 border-r-2`}
                      >
                        {!isEmptyRow
                          ? flexRender(cell.column.columnDef.cell, cell.getContext())
                          : null}
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
                  {table.getAllLeafColumns().map(column => (
                    <td
                      key={`empty-cell-${index}-${column.id}`}
                      style={{ width: column.getSize() }}
                      className="whitespace-nowrap px-3 py-2 text-transparent border-r-2"
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
          <div className="flex items-center justify-start gap-4 mt-4 text-[12px]">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-red-600 disabled:opacity-30"
            >
              {"<"}
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
                    className={`px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""}`}
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
              {">"}
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <TeamModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          isEdit={true}
          id={selectedTeamId}
        />
      )}
    </>
  );
};

export default TeamsTable;
