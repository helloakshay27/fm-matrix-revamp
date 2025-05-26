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
import { fetchTags } from '../../../redux/slices/tagsSlice';

const ActionIcons = ({ row }) => (
  <div className="action-icons flex justify-between gap-5">
    <div>
      <EditOutlinedIcon sx={{ fontSize: "20px" }} className='cursor-pointer' />
      <button
        onClick={() => alert(`Deleting: ${row.original.roles}`)}
        title="Delete"
      >
        <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
      </button>
    </div>
  </div>
)

const TagsTable = () => {
  const dispatch = useDispatch();
  const { fetchTags: tags, error } = useSelector(state => state.fetchTags)

  const transformedData = useMemo(() => {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.map(tag => ({
      name: tag.name,
      tag_type: tag.tag_type,
      active: !!tag.active,
      created_at: new Date(tag.created_at).toLocaleDateString("en-IN"),
    }));
  }, [tags]);

  const [data, setData] = useState([]);
  const fixedRowsPerPage = 13;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });


  useEffect(() => {
    dispatch(fetchTags())
  }, [])

  useEffect(() => {
    setData(transformedData);
  }, [transformedData]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Tag Name',
        size: 450,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },

      {
        accessorKey: 'tag_type',
        header: 'Tag Type',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? getValue() : null;
        },
      },
      {
        accessorKey: 'active',
        header: 'Status',
        size: 150,
        cell: ({ row, getValue }) => {
          return row.original ? <div className="flex gap-4"><span>Inactive</span><Switch color="danger" checked={getValue()} /><span>Active</span></div> : null;
        },
      },
      {
        accessorKey: 'created_at',
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
                      style={{ width: cell.column.getSize() }}
                      className={`${cell.column.columnDef.meta?.cellClassName || ''
                        } whitespace-nowrap px-3 py-2 border-r-2
                          
                      }
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

export default TagsTable;