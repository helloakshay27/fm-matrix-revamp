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
import {fetchOrganizations} from '../../../redux/slices/organizationSlice';
import {fetchCompany} from '../../../redux/slices/companySlice';
import { fetchRegion , updateRegion, deleteRegion} from '../../../redux/slices/regionSlice';
import AddRegionModel from './Model';
import toast from 'react-hot-toast';

const RegionTable = ({ openModal, setOpenModal ,editMode, setEditMode}) => {
  const token = localStorage.getItem('token');
  const [selectedData, setSelectedData] = useState(null);

  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const { fetchRegion: Region } = useSelector((state) => state.fetchRegion);


  // Initial fetch of project types
  useEffect(() => {
    dispatch(fetchRegion({ token }));
    dispatch(fetchOrganizations({ token }));
    dispatch(fetchCompany({ token }));
  }, [dispatch]);

  // Update table data when Region changes
  useEffect(() => {
    if (Region && Region.length > 0) {
      setData(Region);
    }
  }, [Region]);

  // Fetch data when modal closes to ensure table is refreshed
  useEffect(() => {
    if (!openModal) {
      dispatch(fetchRegion({ token }));
    }
  }, [openModal, dispatch]);

  const handleEditClick = (row) => {
    setSelectedData(row.original);
    console.log(row.original);
    setEditMode(true);
    setOpenModal(true);
  };

 const onSuccess = () => {
    dispatch(fetchRegion({ token }));
    setOpenModal(false);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteRegion({ token, id })).unwrap(); // unwrap to handle async correctly
      toast.dismiss();
      toast.success('Region deleted successfully', {
        iconTheme: {
          primary: 'red', // This might directly change the color of the success icon
          secondary: 'white', // The circle background
        },
      });
      dispatch(fetchRegion({ token })); // refetch data after successful delete
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete Region.', {
        iconTheme: {
          primary: 'red', // This might directly change the color of the error icon
          secondary: 'white', // The circle background
        },
      })
    }
  };


  const handleToggle = async (row) => {
    const updatedValue = !row.original.active;
    const payload = {
      active: updatedValue,
    };

    try {
      await dispatch(updateRegion({ token, id: row.original.id, payload })).unwrap();
      toast.dismiss();
      toast.success(`status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
        iconTheme: {
          primary: 'red', // This might directly change the color of the success icon
          secondary: 'white', // The circle background
        },
      });
      dispatch(fetchRegion({ token }));
    } catch (error) {
      console.error('Failed to update toggle:', error, {
        iconTheme: {
          primary: 'red', // This might directly change the color of the error icon
          secondary: 'white', // The circle background
        },
      });
    }
  };


  const ActionIcons = ({ row }) => (
    <div className="action-icons flex justify-between gap-5">
      <div>
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
        header: 'Region',
        size: 150,
        cell: ({ row, getValue }) => {
          const value = getValue();
          if (!value) return null;
          return <span className=''>{value.charAt(0).toUpperCase() + value.slice(1)}</span>;
        },
      },
           {
        accessorKey: 'country_id',
        header: 'Country',
        size: 150,
        cell: ({ getValue }) => {
        //   const value=countries.find(org => org.id === getValue());
        //   return value ? <span className="pl-2">{value.name}</span> : null;
        },
      },
      
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: ({ row }) => {
          const isActive = row.original.active;

          return (
            <div className="flex gap-4 pl-2">
              <span>Inactive</span>
              <Switch
                color={`${isActive ? 'success' : 'danger'}`}

                checked={isActive}
                onChange={() => handleToggle(row)} // toggle the row state
              />
              <span>Active</span>

            </div>
          );
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
    [Region]
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
                      className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2"
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
        <AddRegionModel
          openModal={openModal}
          setOpenModal={setOpenModal}
          isEditMode={editMode}
          initialData={selectedData}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
};

export default RegionTable;