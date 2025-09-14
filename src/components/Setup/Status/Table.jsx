import { useEffect, useMemo, useState, useCallback } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Switch from "@mui/joy/Switch";
import {
  fetchStatus,
  updateStatus,
  deleteStatus,
} from "../../../redux/slices/statusSlice.js";
import { useDispatch, useSelector } from "react-redux";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import toast from "react-hot-toast";

const StatusTable = ({ setOpenModal, setIsEdit, setExistingData }) => {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const statusList = useSelector((state) => state.fetchStatus.fetchStatus || []);
  const fixedRowsPerPage = 13;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: fixedRowsPerPage,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchStatus({ token })).unwrap();
      } catch (error) {
        console.error('Failed to fetch status:', error);
        toast.error('Failed to load status list');
      }
    };
    fetchData();
  }, [dispatch, token]);

  const ActionIcons = ({ row }) => {
    const handleEditClick = () => {
      setIsEdit(true);
      setExistingData(row.original);
      setOpenModal(true);
    };

    const handleDeleteClick = async (id) => {
      try {
        await dispatch(deleteStatus({ token, id })).unwrap();
        await dispatch(fetchStatus({ token }));
        toast.success("Status deleted successfully", {
          iconTheme: { primary: "red", secondary: "white" },
        });
      } catch (error) {
        console.error("Failed to delete:", error);
        toast.error("Failed to delete Status.", {
          iconTheme: { primary: "red", secondary: "white" },
        });
      }
    };

    return (
      <div className="action-icons flex justify-between gap-5">
        <EditOutlinedIcon
          onClick={handleEditClick}
          sx={{ fontSize: "20px", cursor: "pointer" }}
        />
        <button onClick={() => handleDeleteClick(row.original.id)} title="Delete">
          <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
        </button>
      </div>
    );
  };

  const toggleStatus = useCallback(
    async (row) => {
      try {
        const payload = { active: !row.original.active };
        await dispatch(updateStatus({ token, id: row.original.id, payload })).unwrap();
        toast.success(
          `Status ${payload.active ? "activated" : "deactivated"} successfully`,
          {
            iconTheme: { primary: payload.active ? "green" : "red", secondary: "white" },
          }
        );
        await dispatch(fetchStatus({ token }));
      } catch (error) {
        console.error("Failed to toggle status:", error);
        toast.error("Failed to update status.", {
          iconTheme: { primary: "red", secondary: "white" },
        });
      }
    },
    [dispatch, token]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "status",
        header: "Status Name",
        size: 250,
        cell: ({ getValue }) => getValue(),
      },
      {
        accessorKey: "color_code",
        header: "Color",
        size: 150,
        cell: ({ getValue }) => (
          <span
            style={{
              backgroundColor: getValue(),
              width: "100%",
              height: "30px",
              display: "block",
              borderRadius: "4px",
            }}
          />
        ),
      },
      {
        accessorKey: "active",
        header: "Status",
        size: 150,
        cell: ({ row, getValue }) => (
          <div className="flex gap-4 items-center justify-center">
            <span>Inactive</span>
            <Switch
              color={`${getValue() ? "success" : "danger"}`}
              checked={getValue()}
              onChange={() => toggleStatus(row)}
            />
            <span>Active</span>
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created On",
        size: 150,
        cell: ({ getValue }) => {
          const date = new Date(getValue());
          return date.toLocaleDateString("en-GB");
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 60,
        cell: ({ row }) =>
          row.original ? (
            <ActionIcons
              row={row}
              setOpenModal={setOpenModal}
              setIsEdit={setIsEdit}
              setExistingData={setExistingData}
            />
          ) : null,
        meta: { cellClassName: "actions-cell-content" },
      },
    ],
    [setOpenModal, setIsEdit, setExistingData, toggleStatus]
  );

  const table = useReactTable({
    data: useMemo(() => [...statusList].reverse(), [statusList]),
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  const pageRows = table.getRowModel().rows;
  const numDataRowsOnPage = useMemo(() => pageRows.length, [pageRows]);
  const numEmptyRowsToAdd = Math.max(0, fixedRowsPerPage - numDataRowsOnPage);
  const rowHeight = 40;
  const headerHeight = 48;
  const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;

  return (
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
                    className="bg-[#D5DBDB] px-3 py-3.5 text-center font-[500] border-r-2 border-[#FFFFFF]"
                  >
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y" style={{ height: `${fixedRowsPerPage * rowHeight}px` }}>
            {pageRows.map((row) => {
              const isEmpty =
                !row.original ||
                Object.values(row.original).every((v) => v === null || v === "");
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
                      style={{ width: cell.column.getSize(), padding: "10px" }}
                      className={`whitespace-nowrap px-3 py-2 border-r-2 ${cell.column.columnDef.meta?.cellClassName || ""
                        }`}
                    >
                      {!isEmpty
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
                    className="whitespace-nowrap px-3 py-2 text-transparent border-r-2"
                  >

                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {statusList.length > 0 && (
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
            let start = Math.max(0, currentPage - Math.floor(visiblePages / 2));
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
                  className={`px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""}`}
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
  );
};

export default StatusTable;