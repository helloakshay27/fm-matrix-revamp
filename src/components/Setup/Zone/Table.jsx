/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, useCallback } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Switch from "@mui/joy/Switch";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { fetchRegion } from "../../../redux/slices/regionSlice";
import {
  fetchZone,
  updateZone,
  deleteZone,
} from "../../../redux/slices/zoneSlice";
import AddZoneModel from "./Model";
import toast from "react-hot-toast";

const ZoneTable = ({ openModal, setOpenModal, editMode, setEditMode }) => {
  const token = localStorage.getItem("token");
  const [selectedData, setSelectedData] = useState(null);
  const dispatch = useDispatch();
  const { fetchRegion: Region } = useSelector((state) => state.fetchRegion);
  const { fetchZone: Zone } = useSelector((state) => state.fetchZone);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          dispatch(fetchRegion({ token })).unwrap(),
          dispatch(fetchZone({ token })).unwrap()
        ]);
      } catch (error) {
        console.error("Failed to fetch initial zone/region data:", error);
        toast.dismiss();
        toast.error("Failed to load Zone or Region data", {
          iconTheme: { primary: "red", secondary: "white" },
        });
      }
    };
    fetchInitialData();
  }, [dispatch, token]);

  const handleEditClick = useCallback(
    (row) => {
      setSelectedData(row.original);
      setEditMode(true);
      setOpenModal(true);
    },
    [setEditMode, setOpenModal]
  );

  const onSuccess = useCallback(() => {
    dispatch(fetchZone({ token }));
    setOpenModal(false);
  }, [dispatch, token, setOpenModal]);

  const handleDeleteClick = useCallback(
    async (id) => {
      try {
        console.log("Deleting zone:", id);
        await dispatch(deleteZone({ token, id })).unwrap();
        toast.dismiss();
        toast.success("Zone deleted successfully", {
          iconTheme: { primary: "red", secondary: "white" },
        });
        await dispatch(fetchZone({ token }));
      } catch (error) {
        console.error("Failed to delete zone:", error);
        toast.error("Failed to delete Zone.", {
          iconTheme: { primary: "red", secondary: "white" },
        });
      }
    },
    [dispatch, token]
  );

  const handleToggle = useCallback(
    async (row) => {
      const updatedValue = !row.original.active;
      const payload = { active: updatedValue };
      try {
        await dispatch(
          updateZone({ token, id: row.original.id, payload })
        ).unwrap();
        toast.dismiss();
        toast.success(
          `Status ${updatedValue ? "activated" : "deactivated"} successfully`,
          {
            iconTheme: {
              primary: updatedValue ? "green" : "red",
              secondary: "white",
            },
          }
        );
        await dispatch(fetchZone({ token }));
      } catch (error) {
        console.error("Failed to update toggle:", error);
        toast.error("Failed to update status", {
          iconTheme: { primary: "red", secondary: "white" },
        });
      }
    },
    [dispatch, token]
  );

  const ActionIcons = ({ row }) => (
    <div className="action-icons flex justify-between gap-5">
      <EditOutlinedIcon
        sx={{ fontSize: "20px", cursor: "pointer" }}
        onClick={() => handleEditClick(row)}
      />
      <DeleteOutlineOutlinedIcon
        sx={{ fontSize: "20px", cursor: "pointer" }}
        onClick={() => handleDeleteClick(row.original.id)}
      />
    </div>
  );

  const regionMap = useMemo(() => {
    const map = {};
    if (Array.isArray(Region)) {
      Region.forEach((r) => {
        map[r.id] = r.name;
      });
    }
    return map;
  }, [Region]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Zone",
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? (
            <span className="pl-2">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          ) : null;
        },
      },
      {
        accessorKey: "region_id",
        header: "Country",
        size: 150,
        cell: ({ row }) => {
          const regionId = row.original.region_id;
          const regionMatch = Region.find((r) => r.id === regionId);
          return regionMatch ? regionMatch.country_name : "-";
        },
      },
      {
        accessorKey: "region_id",
        header: "Region",
        size: 150,
        cell: ({ getValue }) => {
          const value = regionMap[getValue()];
          return value ? (
            <span className="pl-2">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          ) : null;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
        cell: ({ row }) => {
          const isActive = row.original.active;
          return (
            <div className="flex gap-4">
              <span>Inactive</span>
              <Switch
                color={isActive ? "success" : "danger"}
                checked={isActive}
                onChange={() => handleToggle(row)}
              />
              <span>Active</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 60,
        cell: ({ row }) => (row.original ? <ActionIcons row={row} /> : null),
        meta: { cellClassName: "actions-cell-content" },
      },
    ],
    [regionMap, handleToggle]
  );

  const fixedRowsPerPage = 13;
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

  const table = useReactTable({
    data: useMemo(() => [...(Zone || [])].reverse(), [Zone]),
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageRows = table.getRowModel().rows;
  const numDataRowsOnPage = useMemo(() => pageRows.length, [pageRows]);
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
                      className="bg-[#D5DBDB] px-2 py-3.5 text-center font-[500] border-r-2"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
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
                    (v) => v === null || v === ""
                  );
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-gray-50 even:bg-[#D5DBDB4D] ${isEmpty ? "pointer-events-none text-transparent" : ""
                      }`}
                    style={{ height: `${rowHeight}px` }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className={`${cell.column.columnDef.meta?.cellClassName || ""
                          } whitespace-nowrap px-3 py-2 border-r-2`}
                      >
                        {!isEmpty
                          ? flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                          : null}
                      </td>
                    ))}
                  </tr>
                );
              })}
              {Array.from({ length: numEmptyRowsToAdd }).map((_, index) => (
                <tr
                  key={`empty-${index}`}
                  style={{ height: `${rowHeight}px` }}
                  className="even:bg-[#D5DBDB4D] pointer-events-none"
                >
                  {table.getAllLeafColumns().map((col) => (
                    <td
                      key={`empty-cell-${index}-${col.id}`}
                      style={{ width: col.getSize() }}
                      className="px-3 py-2 text-transparent"
                    >
                      &nbsp;
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {Zone && Zone.length > 0 && (
          <div className="flex items-center justify-start gap-4 mt-4 text-[12px]">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-red-600 disabled:opacity-30"
            >
              {"<"}
            </button>
            {(() => {
              const totalPages = table.getPageCount();
              const currentPage = table.getState().pagination.pageIndex;
              const visiblePages = 3;
              let start = Math.max(
                0,
                currentPage - Math.floor(visiblePages / 2)
              );
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
                    className={`px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""
                      }`}
                  >
                    {page + 1}
                  </button>
                );
              });
            })()}
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
        <AddZoneModel
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

export default ZoneTable;
