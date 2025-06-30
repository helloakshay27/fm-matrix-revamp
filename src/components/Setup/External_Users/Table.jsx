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
import { useDispatch, useSelector } from 'react-redux';

const ActionIcons = ({ row }) => (
  <div className="action-icons flex justify-between gap-5">
    <Switch color="danger" />
    <div>
      <EditOutlinedIcon sx={{ fontSize: "20px" }} />
      <button
        onClick={() => alert(`Deleting: ${row.original.roles}`)}
        title="Delete"
      >
        {/* <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} /> */}
      </button>
    </div>
  </div>
);

const defaultData = [
  {
    userName: "Rajkumar",
    organisation: "Panchshil Realty",
    emailId: "rajkumar.sharma@panchshil.com",
    role: "Project IT Head",
    invitationStatus: "Accepted",
  }

];

const ExternalTable = () => {
  const dispatch = useDispatch();
  const { fetchExternalUser: externalUsers } = useSelector(state => state.fetchExternalUser)

  const [data, setData] = useState(externalUsers);
  const fixedRowsPerPage = 13;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstname',
        header: 'User Name',
        size: 250,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      {
        accessorKey: 'organization_id',
        header: 'Organisation',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      {
        accessorKey: 'user_company_name',
        header: 'Company',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      {
        accessorKey: 'email',
        header: 'Email Id',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      {
        accessorKey: 'role_id',
        header: 'Role',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      {
        accessorKey: 'invitationStatus',
        header: 'Invitation Status',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? <span className={`${getValue() === 'Accepted' ? 'text-green-600' : 'text-yellow-600'}`}>{getValue()}</span> : null;
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
    <div className="project-table-container text-[14px] ">
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
                      style={{ width: cell.column.getSize() }}
                      className={`${cell.column.columnDef.meta?.cellClassName || ''
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
  );
};

export default ExternalTable;