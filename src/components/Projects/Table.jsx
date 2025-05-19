import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';

import StatusBadge from './statusBadge';
import './Table.css';

const ActionIcons = ({ row }) => (
  <div className="action-icons flex justify-around items-center">
    <button onClick={() => alert(`Viewing/Editing Project ID: ${row.original.id}`)} title="View/Edit Details">
      <OpenInFullIcon sx={{ fontSize: "1.2em" }} />
    </button>
    <button onClick={() => alert(`Some other action for: ${row.original.title}`)} title="Other Action">
      <LoginTwoToneIcon sx={{ fontSize: "1.2em" }} />
    </button>
    <button onClick={() => alert(`Archiving: ${row.original.title}`)} title="Archive">
      <ArchiveOutlinedIcon sx={{ fontSize: "1.2em" }} />
    </button>
    <button onClick={() => alert(`Deleting: ${row.original.title}`)} title="Delete">
      <DeleteOutlineOutlinedIcon sx={{ fontSize: "1.2em" }} />
    </button>
  </div>
);

const ProgressBar = ({ progressString }) => {
  const numericValue = parseInt(progressString, 10);
  const isValidPercentage = !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;

  return (
   <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${isValidPercentage ? numericValue : 0}%` }}></div>
        <div className="progress-bar-label">{isValidPercentage ? `${numericValue}%` : 'Invalid Percentage'}</div>
      </div>
   </div>
  );
};

const defaultData = [
    {
        id: 'P-01',
        title: 'Sample Project Alpha',
        status: 'Completed',
        type: 'Internal',
        manager: 'Astrid Excel',
        milestones: '100%',
        tasks: '100%',
        issues: '0/0',
        startDate: '01/01/2025',
        endDate: '20/12/2025',
        priority: 'High',
    },
    {
        id: 'P-02',
        title: 'New Website Launch',
        status: 'In Progress',
        type: 'Client',
        manager: 'John Doe',
        milestones: '60%',
        tasks: '75%',
        issues: '2/5',
        startDate: '15/02/2025',
        endDate: '30/09/2025',
        priority: 'Medium',
    },
    {
        id: 'P-03',
        title: 'Mobile App Development',
        status: 'Planning',
        type: 'Internal',
        manager: 'Jane Smith',
        milestones: '10%',
        tasks: '5%',
        issues: '0/1',
        startDate: '01/06/2025',
        endDate: '31/03/2026',
        priority: 'High',
    },
    {
        id: 'P-04',
        title: 'Marketing Campaign Q3',
        status: 'On Hold',
        type: 'Marketing',
        manager: 'Mike Brown',
        milestones: '30%',
        tasks: '20%',
        issues: '1/2',
        startDate: '01/07/2025',
        endDate: '30/09/2025',
        priority: 'Low',
    },
];

const ProjectTable = () => {
  const [data, setData] = useState(defaultData);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Project ID',
        size: 110,
        cell: ({ row, getValue }) => (
          <Link
            to={`/projects/${row.original.id.replace('P-', '')}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {getValue()}
          </Link>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Project Title',
        size: 250,
        cell:({row,getValue}) => <Link to={`/milestones`} className="cursor-pointer">{getValue()}</Link>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: (info) => <StatusBadge statusOptions={['Completed', 'In Progress', 'Planning', 'On Hold']} status={info.getValue()} onStatusChange={(newStatus) => {
            const newData = data.map(row => {
                if (row.id === info.row.original.id) {
                    return { ...row, status: newStatus };
                }
                return row;
            });
            setData(newData);
        }} />,
      },
      {
        accessorKey: 'type',
        header: 'Project Type',
        size: 150,
      },
      {
        accessorKey: 'manager',
        header: 'Project Manager',
        size: 180,
      },
      {
        accessorKey: 'milestones',
        header: 'Milestones',
        size: 130,
        cell: (info) => <ProgressBar progressString={info.getValue()} />,
      },
      {
        accessorKey: 'tasks',
        header: 'Tasks',
        size: 110,
        cell: (info) => <ProgressBar progressString={info.getValue()} />,
      },
      {
        accessorKey: 'issues',
        header: 'Issues',
        size: 100,
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        size: 120,
        meta: { isDarkColumn: true },
      },
      {
        accessorKey: 'endDate',
        header: 'End Date',
        size: 120,
        meta: { isDarkColumn: true },
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 100,
        meta: { isDarkColumn: true },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 150,
        cell: ({ row }) => <ActionIcons row={row} />,
        meta: {
          isDarkColumn: true,
          cellClassName: 'actions-cell-content',
        },
      },
    ],
    [data]
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
  });

  return (
    <div className="project-table-container text-[14px] font-light">
      <div className="table-wrapper overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className={"bg-[#D5DBDB] px-3 py-3.5 text-left text-gray-800 "}
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
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 even:bg-[#D5DBDB4D]">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={`${cell.column.columnDef.meta?.cellClassName || ''} whitespace-nowrap px-3 py-4 text-gray-500`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="no-data-message text-center py-10 text-gray-500">
                  No data found.
                </td>
              </tr>
            )}
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
        <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
                table.setPageSize(Number(e.target.value))
            }}
            className="p-1 border rounded"
        >
            {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectTable;