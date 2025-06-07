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
import { fetchProjectGroup, createProjectGroup, updateProjectGroup } from '../../../redux/slices/projectSlice';
import Modal from './Modal';

const GroupTable = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { fetchProjectGroup: ProjectGroups } = useSelector((state) => state.fetchProjectGroup);


  // Initial fetch of project Group
  useEffect(() => {
    dispatch(fetchProjectGroup());
  }, [dispatch]);

  // Update table data when ProjectTypes changes
  useEffect(() => {
    if (ProjectGroups && ProjectGroups.length > 0) {
      setData(ProjectGroups);
    }
  }, [ProjectGroups]);

  // Fetch data when modal closes to ensure table is refreshed
  useEffect(() => {
    if (!openModal) {
      dispatch(fetchProjectGroup());
    }
  }, [openModal, dispatch]);

  const handleEditClick = (row) => {
    setSelectedData(ProjectGroups.find((item)=>item.name==row.original.name));
    setEditMode(true);
    setOpenModal(true);
  };

//   const handleDeleteClick = async (id) => {
//     try {
//       await dispatch(deleteProjectType(id)).unwrap(); // unwrap to handle async correctly
//       dispatch(fetchProjectTypes()); // refetch data after successful delete
//     } catch (error) {
//       console.error('Failed to delete:', error);
//     }
//   };


  const handleToggle = async (row) => {
    const updatedValue = !row.original.active;
    const payload = {
      active: updatedValue,
    };

    try {
      await dispatch(updateProjectGroup({ id: row.original.id, payload })).unwrap();
      dispatch(fetchProjectGroup());
    } catch (error) {
      console.error('Failed to update toggle:', error);
    }
  };


  const ActionIcons = ({ row }) => (
    <div className="action-icons flex justify-between gap-5">
              <Switch
                color="danger"
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
        header: 'Project Group Name',
        size: 100,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 50,
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
      <div className="project-table-container text-[14px] font-light ">
        <div
          className="table-wrapper overflow-x-auto"
          style={{ height: `${desiredTableHeight}px`}}
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

        <div className="pagination-controls flex items-center justify-between gap-2 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-1 border rounded disabled:opacity-50"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 border rounded disabled:opacity-50"
            >
              {'<'}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 border rounded disabled:opacity-50"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-1 border rounded disabled:opacity-50"
            >
              {'>>'}
            </button>
          </div>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
        </div>
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