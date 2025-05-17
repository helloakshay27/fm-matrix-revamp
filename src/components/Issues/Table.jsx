import StatusBadge from "./statusBadge"
import React, { useState, useMemo, use } from 'react';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import LoginTwoToneIcon from '@mui/icons-material/LoginTwoTone';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel, // Optional: for sorting
  getPaginationRowModel, // Optional: for pagination
  getFilteredRowModel, // Optional: for filtering
} from '@tanstack/react-table';
import './Table.css'; // We'll create this CSS file


const ActionIcons = ({ row }) => (
    <div className="action-icons">
    <button onClick={() => alert(`Editing: ${row.original.title}`)} title="Edit"><OpenInFullIcon sx={{fontSize: "1.2em"}}/></button>
    <button onClick={() => alert(`Viewing: ${row.original.title}`)} title="View"><LoginTwoToneIcon sx={{fontSize: "1.2em"}} /></button>
    <button onClick={() => alert(`Deleting: ${row.original.title}`)} title="Delete"><DeleteOutlineOutlinedIcon sx={{fontSize: "1.2em"}}/></button>
    <button onClick={() => alert(`Archiving: ${row.original.title}`)} title="Archive"><ArchiveOutlinedIcon sx={{fontSize: "1.2em"}}/></button>
  </div>
);







// Sample data - in a real app, this would come from props, state, or an API
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


const IssueTable = () => {
    const [data, setData] = useState(defaultData);
    const [sorting, setSorting] = useState([]); // Optional: for sorting state
    const [globalFilter, setGlobalFilter] = useState(''); // Optional: for global filter state


    

    
    // Define columns
    const columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Issue ID',
        size: 100, // Example size (TanStack Table uses this for flex-basis like calculations)
      },
      {
        accessorKey: 'title',
        header: 'Issue Title',
        size: 250,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 120,
        // Example of custom cell rendering for status
        cell: (info)=>{return(
              <StatusBadge status={info.getValue()} />
        );}
      },
      {
        accessorKey: 'project',
        header: 'Project',
        size: 150,
      },
      {
        accessorKey: 'person',
        header: 'Responsible Person',
        size: 180,
      },
      {
        accessorKey: 'IssueType',
        header: 'Issue Type',
        size: 120,

        cell: (info) => {
            const progress = info.getValue();
            return (
              <div className="progress-bar-container">
                <div className="progress-bar">
                <div className="progress-bar-label">{progress}</div>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}` }}
                >
                </div>
              </div>
              </div>
            );
          },
      },
      {
        accessorKey: 'assignedDate',
        header: 'Assigned Date',
        size: 100,
        cell: (info) => {
            const progress = info.getValue();
            return (
              <div className="progress-bar-container">
                <div className="progress-bar">
                <div className="progress-bar-label">{progress}</div>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progress}` }}
                >
                </div>
              </div>
              </div>
            );
          },
      },
      
      {
        accessorKey: 'endDate',
        header: 'End Date',
        size: 100,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        size: 120,
        meta: {
            isDarkColumn: true // Custom meta to identify darker columns
        }
      },
      {
        accessorKey: 'identifiedBy',
        header: 'Identified By',
        size: 120,
        meta: {
            isDarkColumn: true
        }
      },
      {
        accessorKey: 'TestedBy',
        header: 'Tested By',
        size: 100,
        meta: {
            isDarkColumn: true
        }
      },
      {
        id: 'QAstatus', // id is required if not using accessorKey
        header: 'QA status',
        size: 120,
        cell: ({ row }) => <ActionIcons row={row} />,
        enableSorting: false,
        meta: {
            isDarkColumn: true,
            cellClassName: 'actions-cell-content' // for specific centering
        }
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
  });

  return (
    <div className="project-table-container text-[14px] font-[300] ">


      <div className="table-wrapper"> 
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className={header.column.columnDef.meta?.isDarkColumn ? 'dark-column-header' : ''}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none sortable-header'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={`${cell.column.columnDef.meta?.isDarkColumn ? 'dark-column-cell' : ''} ${cell.column.columnDef.meta?.cellClassName || ''}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
             {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="no-data-message">
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

export default IssueTable;