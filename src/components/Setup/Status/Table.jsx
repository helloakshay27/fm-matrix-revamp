import React, { useEffect, useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import axios from 'axios';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';
import Modal from '../Status/Modal.jsx';

const ActionIcons = ({ data }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="action-icons flex justify-between gap-5">
      <div>
        <EditOutlinedIcon
          onClick={() => setOpenModal(true)}
          sx={{ fontSize: '20px', cursor: 'pointer' }}
        />

        {openModal && <Modal id={data.id} setOpenModal={setOpenModal} openModal={openModal} />}

        <button
          onClick={() => alert(`Deleting: ${data.title}`)}
          title="Delete"
          className="ml-2"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
        </button>
      </div>
    </div>
  );
};

const defaultData = [
  {
    status: "Not Started",
    color_code: "#B0BEC5", // grey
    status: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    status: "Initiated",
    color_code: "#00BCD4", // cyan
    status: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    status: "In Progress",
    color_code: "#42A5F5", // light blue
    status: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    status: "On Hold",
    color_code: "#FFB300", // amber/orange
    status: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    status: "Delayed",
    color_code: "#EF5350", // red
    status: false,
    created_at: "2025-01-01T00:00:00Z",
  },
  {
    status: "Completed",
    color_code: "#66BB6A", // green
    status: false,
    created_at: "2025-01-01T00:00:00Z",
  },
];

const StatusTable = () => {
  const [data, setData] = useState(defaultData);
  const fixedRowsPerPage = 13;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

  // Fetch data from API once
  useEffect(() => {
    axios
      .get('https://api-tasks.lockated.com/project_statuses.json', {
        headers: {
          Authorization: 'Bearer bTcVnWgQrF6QCdNbMiPXzCZNAqsN9qoEfFWdFQ1Auk4',
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('API fetch error:', error);
      });
  }, []);

  // Handler to toggle status in data state (for demo only)
  const toggleStatus = (rowIndex) => {
    setData((old) =>
      old.map((item, index) =>
        index === rowIndex ? { ...item, status: !item.status } : item
      )
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: 'Project Status Title',
        size: 250,
        cell: ({ getValue }) => getValue(),
      },
      {
        accessorKey: 'color_code',
        header: 'Color',
        size: 150,
        cell: ({ getValue }) => (
          <span
            style={{
              backgroundColor: getValue(),
              width: '100%',
              height: '30px',
              display: 'block',
              borderRadius: '4px',
            }}
          />
        ),
      },
      {
        accessorKey: 'active',
        header: 'Status',
        size: 150,
        cell: ({ row, getValue }) => (
          <div className="flex gap-4 items-center justify-center">
            <span>Inactive</span>
            <Switch
              color="danger"
              checked={getValue()}
              onChange={() => toggleStatus(row.index)}
            />
            <span>Active</span>
          </div>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Created On',
        size: 150,
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 60,
        cell: ({ row }) =>
          row.original ? <ActionIcons data={row.original} /> : null,
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
  const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;

  return (
    <div className="project-table-container text-[14px] font-light">
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
                    className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2 border-[#FFFFFF]"
                  >
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
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
              const isEmpty =
                !row.original ||
                Object.values(row.original).every(
                  (v) => v === null || v === ''
                );

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${
                    isEmpty ? 'pointer-events-none text-transparent' : ''
                  }`}
                  style={{ height: `${rowHeight}px` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.getSize(), padding: '10px' }}
                      className={`whitespace-nowrap px-3 py-2 border-r-2 ${
                        cell.column.columnDef.meta?.cellClassName || ''
                      }`}
                    >
                      {!isEmpty
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
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-red-600 disabled:opacity-30"
          >
            {'<'}
          </button>

          {/* Page Numbers (Sliding Window of 3) */}
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
                  className={`px-3 py-1 ${
                    isActive ? 'bg-gray-200 font-bold' : ''
                  }`}
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
            {'>'}
          </button>
        </div>
      )}
    </div>
  );
};

export default StatusTable;
