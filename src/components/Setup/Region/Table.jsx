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
import {
  fetchRegion,
  updateRegion,
  deleteRegion,
} from '../../../redux/slices/regionSlice';
import { fetchCountry } from '../../../redux/slices/countrySlice';
import AddRegionModel from './Model';
import toast from 'react-hot-toast';

const RegionTable = ({ openModal, setOpenModal, editMode, setEditMode }) => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);

  const { fetchRegion: Region } = useSelector((state) => state.fetchRegion);
  const { fetchCountry: countries } = useSelector((state) => state.fetchCountry);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchRegion({ token })).unwrap();
        await dispatch(fetchCountry({ token })).unwrap();
      } catch (error) {
        toast.error('Failed to fetch data.');
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, token]);

  useEffect(() => {
    if (Array.isArray(Region)) {
      setData(Region);
    }
  }, [Region]);

  const handleEditClick = (row) => {
    setSelectedData(row.original);
    setEditMode(true);
    setOpenModal(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteRegion({ token, id })).unwrap();
      toast.success('Region deleted successfully', {
        iconTheme: { primary: 'red', secondary: 'white' },
      });
      dispatch(fetchRegion({ token }));
    } catch (error) {
      toast.error('Failed to delete Region.');
      console.error(error);
    }
  };

  const handleToggle = async (row) => {
    const updatedValue = !row.original.active;
    try {
      await dispatch(updateRegion({
        token,
        id: row.original.id,
        payload: { active: updatedValue },
      })).unwrap();

      toast.dismiss();
      toast.success(`Status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
        iconTheme: {
          primary: updatedValue ? 'green' : 'red',
          secondary: 'white',
        },
      });
      dispatch(fetchRegion({ token }));
    } catch (error) {
      toast.error('Failed to update status.');
      console.error(error);
    }
  };

  const onSuccess = () => {
    dispatch(fetchRegion({ token }));
    setOpenModal(false);
  };

  const ActionIcons = ({ row }) => (
    <div className="action-icons flex justify-between gap-5">
      <EditOutlinedIcon
        sx={{ fontSize: 20, cursor: 'pointer' }}
        onClick={() => handleEditClick(row)}
      />
      <DeleteOutlineOutlinedIcon
        sx={{ fontSize: 20, cursor: 'pointer' }}
        onClick={() => handleDeleteClick(row.original.id)}
      />
    </div>
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Region',
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span> : null;
        }
      },
      {
        accessorKey: 'country_name',
        header: 'Country',
        size: 150,
        cell: ({ getValue }) => getValue(),
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
                color={isActive ? 'success' : 'danger'}
                checked={isActive}
                onChange={() => handleToggle(row)}
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
        cell: ({ row }) => row.original ? <ActionIcons row={row} /> : null,
        meta: { cellClassName: 'actions-cell-content' },
      },
    ],
    [countries]
  );

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 13,
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
  const emptyRows = Math.max(0, pagination.pageSize - pageRows.length);
  const rowHeight = 40;
  const headerHeight = 48;
  const desiredHeight = pagination.pageSize * rowHeight + headerHeight;

  return (
    <>
      <div className="project-table-container text-[14px] font-light">
        <div className="table-wrapper overflow-x-auto" style={{ height: `${desiredHeight}px` }}>
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2"
                      style={{ width: header.getSize() }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody style={{ height: `${pagination.pageSize * rowHeight}px` }}>
              {pageRows.map(row => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 even:bg-[#D5DBDB4D]"
                  style={{ height: `${rowHeight}px` }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className={`whitespace-nowrap px-3 py-2 border-r-2 ${cell.column.columnDef.meta?.cellClassName || ''}`}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {Array.from({ length: emptyRows }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  style={{ height: `${rowHeight}px` }}
                  className="even:bg-[#D5DBDB4D] pointer-events-none"
                >
                  {table.getAllLeafColumns().map(col => (
                    <td key={col.id} className="whitespace-nowrap px-3 py-2 text-transparent" style={{ width: col.getSize() }}>
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
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="text-red-600 disabled:opacity-30">{'<'}</button>
            {[...Array(Math.min(3, table.getPageCount()))].map((_, i) => {
              const pageIndex = Math.max(0, table.getState().pagination.pageIndex - 1 + i);
              return (
                <button
                  key={pageIndex}
                  onClick={() => table.setPageIndex(pageIndex)}
                  className={`px-3 py-1 ${pageIndex === table.getState().pagination.pageIndex ? 'bg-gray-200 font-bold' : ''}`}
                >
                  {pageIndex + 1}
                </button>
              );
            })}
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="text-red-600 disabled:opacity-30">{'>'}</button>
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
