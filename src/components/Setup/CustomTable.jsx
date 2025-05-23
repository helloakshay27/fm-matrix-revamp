/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';

const CustomTable = ({
  data,
  columns,
  fixedRowsPerPage = 7,
  rowHeight = 40,
  headerHeight = 48,
  title, buttonText, onAdd, layout = "block",
  showDropdown = false,

}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

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
  const numEmptyRowsToAdd = Math.max(0, fixedRowsPerPage - pageRows.length);
  const desiredTableHeight = (fixedRowsPerPage * rowHeight) + headerHeight;
  const isInline = layout === "inline";


  return (

    <>
      {/* Header with bottom border */}
      <div className={`px-4 pl-7 pt-4 ${isInline ? "flex justify-between items-center" : ""}`}>
        {/* Title */}
        <div className={isInline ? "" : "bg-[#F5F7F7] px-3 py-1 rounded inline-block"}>
          <h1 className="text-sm  text-gray-800 flex items-center gap-1">
            {title}
            {showDropdown && (
              <svg
                className="w-4 h-4 ml-1 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </h1>
        </div>

        {/* Border line */}
        {!isInline && <div className="border-b border-gray-200 mt-2"></div>}

        {/* Add Button */}
        <div className={`${isInline ? "" : "flex justify-end mt-4"}`}>
          <button
            className="bg-[#C62828] hover:bg-[#B71C1C] text-white text-sm font-medium px-5 py-2 rounded flex items-center gap-1"
            onClick={onAdd}
          >
            <span className="text-base font-bold">+</span>
            {buttonText}
            <span className="ml-1 text-xs">▾</span>
          </button>
        </div>
      </div>

      <div className="project-table-container text-[14px] font-light">
        <div className="table-wrapper overflow-x-auto" style={{ height: `${desiredTableHeight}px` }}>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="bg-[#D5DBDB] px-3 py-3.5 text-left text-gray-800"
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
            <tbody className="divide-y">
              {pageRows.map(row => {
                const isDataRowEmpty = !row.original || Object.values(row.original).every(v => !v);
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${isDataRowEmpty ? 'pointer-events-none text-transparent' : ''}`}
                    style={{ height: `${rowHeight}px` }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`${cell.column.columnDef.meta?.cellClassName || ''
                          } whitespace-nowrap px-3 py-2 ${isDataRowEmpty ? 'text-transparent' : 'text-gray-500'
                          }`}
                      >
                        {!isDataRowEmpty
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

        {/* Pagination Controls */}
        <div className="pagination-controls flex items-center justify-between gap-2 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1 border rounded disabled:opacity-50">{'<<'}</button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1 border rounded disabled:opacity-50">{'<'}</button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1 border rounded disabled:opacity-50">{'>'}</button>
            <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1 border rounded disabled:opacity-50">{'>>'}</button>
          </div>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>
        </div>
      </div>
    </>

  );
};

export default CustomTable;
