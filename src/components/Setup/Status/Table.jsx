import React, { useState, useMemo } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';

const ActionIcons = ({ row }) => (
  <div className="action-icons flex justify-between gap-5">
    <div>
      <EditOutlinedIcon sx={{ fontSize: "20px" }} />
      <button
        onClick={() => alert(`Deleting: ${row.original.roles}`)}
        title="Delete"
      >
        <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
      </button>
    </div>
  </div>
);

const defaultData = [
{
    title: "Not Started",
    color: "#B0BEC5", // grey
    status: false,
    createdOn: "01/01/2025"
  },
  {
    title: "Initiated",
    color: "#00BCD4", // cyan
    status: false,
    createdOn: "01/01/2025"
  },
  {
    title: "In Progress",
    color: "#42A5F5", // light blue
    status: false,
    createdOn: "01/01/2025"
  },
  {
    title: "On Hold",
    color: "#FFB300", // amber/orange
    status: false,
    createdOn: "01/01/2025"
  },
  {
    title: "Delayed",
    color: "#EF5350", // red
    status: false,
    createdOn: "01/01/2025"
  },
  {
    title: "Completed",
    color: "#66BB6A", // green
    status: false,
    createdOn: "01/01/2025"
  }
];

const StatusTable = () => {
  const [data, setData] = useState(defaultData);
  const fixedRowsPerPage = 13;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Project Status Title',
        size: 250,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      
             {
        accessorKey: 'color',
        header: 'Color',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? (
  <span
    style={{ backgroundColor: getValue(), width: '100%', height: '30px', display: 'block' }}
  ></span>
) : null;

        },
      },
         {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? <div className="flex gap-4"><span>Inactive</span><Switch color="danger" checked={getValue()} /><span>Active</span></div>: null;
        },
      },
             {
        accessorKey: 'createdOn',
        header: 'CreatedOn',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
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
  const desiredTableHeight = (fixedRowsPerPage * rowHeight) + headerHeight;


  return (
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
                    className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2 border-[#FFFFFF]"
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
          <tbody className="divide-y" style={{ height: `${fixedRowsPerPage * rowHeight}px` }}>
            {pageRows.map(row => {
              const isDataRowConsideredEmpty = !row.original || Object.values(row.original).every(v => v === null || v === '');

              return (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${isDataRowConsideredEmpty ? 'pointer-events-none text-transparent' : ''}`}
                  style={{ height: `${rowHeight}px` }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      style={{ width: cell.column.getSize() ,padding :"10px"}}
                      className={`${
                        cell.column.columnDef.meta?.cellClassName || ''
                      } whitespace-nowrap px-3 py-2 border-r-2
                      }`}
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
  );
};

export default StatusTable;