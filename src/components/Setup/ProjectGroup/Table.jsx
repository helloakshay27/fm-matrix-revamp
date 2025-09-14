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
import { fetchProjectGroup, createProjectGroup, updateProjectGroup, deleteProjectGroup } from '../../../redux/slices/projectSlice';
import Modal from './Modal';
import toast from 'react-hot-toast';

const GroupTable = () => {
  const token = localStorage.getItem('token')
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { fetchProjectGroup: projectGroup } = useSelector((state) => state.fetchProjectGroup);


  // Initial fetch of project Group
  useEffect(() => {
    dispatch(fetchProjectGroup({ token })).unwrap();
  }, [dispatch]);

  // Update table data when ProjectTypes changes
  useEffect(() => {
    if (projectGroup && projectGroup.length > 0) {
      setData(projectGroup);
    }
  }, [projectGroup]);

  // Fetch data when modal closes to ensure table is refreshed
  useEffect(() => {
    if (!openModal) {
      dispatch(fetchProjectGroup({ token }));
    }
  }, [openModal, dispatch]);

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 76) + 180;
    const g = Math.floor(Math.random() * 76) + 180;
    const b = Math.floor(Math.random() * 76) + 180;
    return `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };


  const ActionIcons = ({ row }) => {

    const handleEditClick = (row) => {
      console.log("hi");
      console.log(row.original);
      setSelectedData(row.original);
      setEditMode(true);
      setOpenModal(true);
    };

    const handleDeleteClick = async (id) => {
      try {
        await dispatch(deleteProjectGroup({ token, id })).unwrap(); // unwrap to handle async correctly
        await dispatch(fetchProjectGroup({ token })).unwrap(); // refetch data after successful delete
        toast.dismiss();
        toast.success('Project Group deleted successfully', {
          iconTheme: {
            primary: 'red', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
          },
        });

      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete Project Group.', {
          iconTheme: {
            primary: 'red', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
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
        await dispatch(updateProjectGroup({ token, id: row.original.id, payload })).unwrap();
        toast.dismiss();
        toast.success(`status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
          iconTheme: {
            primary: updatedValue ? 'green' : 'red', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
          },
        });
        dispatch(fetchProjectGroup({ token }));
      } catch (error) {
        console.error('Failed to update toggle:', error, {
          iconTheme: {
            primary: 'red', // This might directly change the color of the error icon
            secondary: 'white', // The circle background
          },
        });
      }
    };
    return (
      <div className=" flex justify-start items-start gap-5 ml-2">
        <Switch
          color={`${row.original.active ? 'success' : 'danger'}`}

          checked={row.original.active}
          onChange={() => handleToggle(row)} // toggle the row state
        />

        <EditOutlinedIcon
          sx={{ fontSize: '20px', cursor: 'pointer' }}
          onClick={() => handleEditClick(row)}
        />
        <button
          title="Delete"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} onClick={() => handleDeleteClick(row.original.id)} />
        </button>
      </div>
    )
  };




  function formatToDDMMYYYY(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const ProjectMembers = (members) => {
    console.log(members);
    return (
      <div className="flex">
        {members.members?.map((member, index) => (
          <div
            key={index}
            title={member.user_name}
            className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[14px] text-gray-800 cursor-pointer ${index !== 0 ? "-ml-[6px]" : ""
              }`}
            style={{ backgroundColor: getRandomColor() }}
          >
            {member.user_name ? member.user_name.charAt(0) : ""}
          </div>
        ))}
      </div>
    );
  }


  const fixedRowsPerPage = 13;

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Project Group Name',
        size: 100,
        cell: ({ row, getValue }) => {
          const raw = row.original ? getValue() : '';
          return raw
        },
      },
      {
        id: 'project_group_members',
        header: 'Project Group Members',
        size: 20,
        cell: ({ getValue, row }) => {
          return (
            <ProjectMembers members={row.original.project_group_members} />
          )
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 50,
        cell: ({ row }) => (row.original ? <ActionIcons row={row} /> : null),

      }
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
      <div className="project-table-container text-[14px] font-light ">
        <div
          className="table-wrapper overflow-x-auto"
          style={{ height: `${desiredTableHeight}px` }}
        >
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="bg-[#D5DBDB] px-2 py-2 text-center font-[500] border-r-2"
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
                        {!isDataRowConsideredEmpty
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

export default GroupTable;