import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from '@tanstack/react-table';

import StatusBadge from './statusBadge';
import './Table.css';




const defaultData = [
    
  {
    "Id": "SP-001",
    "Sprint Title": "Sprint 1",
    "Status": "Open",
    "Sprint Owner": "Sehail Ansaro",
    "Start Date": "15/01/2025",
    "End Date": "22/01/2025",
    "Duration": "07d:16h:00m:00s",
    "Priority": "High",
    "No Of Projects": "Projects Unassigned"
  },
  {
    "Id": "SP-002",
    "Sprint Title": "Sprint 2 - Planning",
    "Status": "In Progress",
    "Sprint Owner": "Jane Doe",
    "Start Date": "23/01/2025",
    "End Date": "30/01/2025",
    "Duration": "07d:00h:00m:00s",
    "Priority": "High",
    "No Of Projects": "3 Projects Assigned"
  },
  {
    "Id": "SP-003",
    "Sprint Title": "Sprint 3 - Development",
    "Status": "Open",
    "Sprint Owner": "John Smith",
    "Start Date": "01/02/2025",
    "End Date": "15/02/2025",
    "Duration": "14d:00h:00m:00s",
    "Priority": "Medium",
    "No Of Projects": "5 Projects Assigned"
  },
  {
    "Id": "SP-004",
    "Sprint Title": "Sprint 4 - Testing",
    "Status": "Closed",
    "Sprint Owner": "Alice Brown",
    "Start Date": "16/02/2025",
    "End Date": "23/02/2025",
    "Duration": "07d:00h:00m:00s",
    "Priority": "High",
    "No Of Projects": "2 Projects Assigned"
  },
  {
    "Id": "SP-005",
    "Sprint Title": "Sprint 5 - Deployment",
    "Status": "Open",
    "Sprint Owner": "Bob Green",
    "Start Date": "24/02/2025",
    "End Date": "28/02/2025",
    "Duration": "04d:00h:00m:00s",
    "Priority": "Critical",
    "No Of Projects": "1 Project Assigned"
  }

];

const SprintsTable = () => {
  const [data, setData] = useState(defaultData);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        size: 110,
        
      },
      {
        accessorKey: 'Sprint Title',
        header: 'Sprint Title',
        size: 250,
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        size: 150,
        
      },
      {
        accessorKey: 'Sprint Owner',
        header: 'Sprint Owner',
        size: 150,
      },
      {
        accessorKey: 'Start Date',
        header: 'Start Date',
        size: 180,
      },
      {
        accessorKey: 'End Date',
        header: 'End Date',
        size: 130,
      },
      {
        accessorKey: 'Duration',
        header: 'Duration',
        size: 110,
      },
      {
        accessorKey: 'Priority',
        header: 'Priority',
        size: 100,
      },
      {
        accessorKey: 'No Of Projects',
        header: 'No Of Projects',
        size: 120,
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
                    className={`${header.column.columnDef.meta?.isDarkColumn ? 'dark-column-header' : ''} px-3 py-3.5 text-left text-gray-800`}
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
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={`${cell.column.columnDef.meta?.isDarkColumn ? 'dark-column-cell' : ''} ${cell.column.columnDef.meta?.cellClassName || ''} whitespace-nowrap px-3 py-4 text-gray-500`}
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

      
    </div>
  );
};

export default ProjectTable;