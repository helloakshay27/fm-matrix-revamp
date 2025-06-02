/* eslint-disable react/prop-types */
import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import LoginTwoToneIcon from "@mui/icons-material/LoginTwoTone";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, changeProjectStatus } from "../../../redux/slices/projectSlice";
import StatusBadge from "./statusBadge";
import "./Table.css";
import Loader from "../../Loader";

// ActionIcons component for row actions
const ActionIcons = ({ row }) => (
    <div className="action-icons flex justify-around items-center">
        <button
            onClick={() => alert(`Viewing/Editing Project ID: ${row.original.id}`)}
            title="View/Edit Details"
        >
            <OpenInFullIcon sx={{ fontSize: "1.2em" }} />
        </button>
        <button
            onClick={() => alert(`Some other action for: ${row.original.title}`)}
            title="Other Action"
        >
            <LoginTwoToneIcon sx={{ fontSize: "1.2em" }} />
        </button>
        <button
            onClick={() => alert(`Archiving: ${row.original.title}`)}
            title="Archive"
        >
            <ArchiveOutlinedIcon sx={{ fontSize: "1.2em" }} />
        </button>
        <button
            onClick={() => alert(`Deleting: ${row.original.title}`)}
            title="Delete"
        >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: "1.2em" }} />
        </button>
    </div>
);

// ProgressBar component for milestones and tasks
const ProgressBar = ({ progressString }) => {
    const numericValue = parseInt(progressString, 10);
    const isValidPercentage =
        !isNaN(numericValue) && numericValue >= 0 && numericValue <= 100;

    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${isValidPercentage ? numericValue : 0}%` }}
                ></div>
                <div className="progress-bar-label">
                    {isValidPercentage ? `${numericValue}%` : "Invalid Percentage"}
                </div>
            </div>
        </div>
    );
};

// Define all possible project statuses
const globalStatusOptions = ["active", "inactive", "in_progress", "overdue", "completed", "on_hold", "abort"];

const ProjectList = ({ filters = {} }) => {
    const fixedRowsPerPage = 10;
    const dispatch = useDispatch();

    // Select project data, loading, and error states from Redux
    const {
        fetchProjects: projects,
        loading: fetchProjectsLoading,
        error: fetchProjectsError,
    } = useSelector((state) => state.fetchProjects);

    const {
        loading: statusChangeLoading,
        error: statusChangeError,
    } = useSelector((state) => state.changeProjectStatus);

    // Transform raw project data for table display
    const transformedData = useMemo(() => {
        if (!projects || !Array.isArray(projects)) return [];
        return projects.map((project) => ({
            id: `P-${project.id.toString()}`,
            actualId: project.id.toString(),
            title: project.title,
            status: project.status.charAt(0).toUpperCase() + project.status.slice(1),
            type: project.resource_type || "Unknown",
            manager: project.project_members?.[0]?.user
                ? `${project.project_members[0].user.firstname} ${project.project_members[0].user.lastname}`
                : "Unassigned",
            managerFirstname: project.project_members?.[0]?.user?.firstname || "Unassigned",
            milestones: "70%", // Static for demo; replace with real data
            tasks: "90%", // Static for demo; replace with real data
            issues: "8/10", // Static for demo; replace with real data
            startDate: project.start_date,
            endDate: project.end_date,
            priority: project.priority.charAt(0).toUpperCase() + project.priority.slice(1),
        }));
    }, [projects]);

    // Apply filters to transformed data (all conditions must match)
    const filteredData = useMemo(() => {
        let result = transformedData;

        // Filter by statuses
        if (filters.statuses?.length > 0) {
            result = result.filter((project) =>
                filters.statuses.includes(project.status)
            );
        }

        // Filter by types
        if (filters.types?.length > 0) {
            result = result.filter((project) => filters.types.includes(project.type));
        }

        // Filter by managers (case-insensitive)
        if (filters.managers?.length > 0) {
            result = result.filter((project) =>
                filters.managers.some(
                    (manager) => project.managerFirstname.toLowerCase() === manager.toLowerCase()
                )
            );
        }

        // Filter by creators
        if (filters.creators?.length > 0) {
            // Example: result = result.filter((project) => filters.creators.includes(project.createdBy));
        }

        // Filter by date range
        if (filters.startDate) {
            result = result.filter(
                (project) => new Date(project.startDate) >= new Date(filters.startDate)
            );
        }
        if (filters.endDate) {
            result = result.filter(
                (project) => new Date(project.endDate) <= new Date(filters.endDate)
            );
        }

        return result;
    }, [transformedData, filters]);

    const [data, setData] = useState(filteredData);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: fixedRowsPerPage,
    });

    // Fetch projects on mount
    useEffect(() => {
        dispatch(fetchProjects());
    }, [dispatch]);

    // Update data when filters change
    useEffect(() => {
        setData(filteredData);
    }, [filteredData]);


    const handleStatusChange = useCallback(
        async ({ id: rowId, name, payload: newValue }) => {
            const actualProjectId = rowId.replace("P-", "");
            const apiCompatibleValue = newValue.toLowerCase();

            try {
                await dispatch(
                    changeProjectStatus({
                        id: actualProjectId,
                        payload: { [name]: apiCompatibleValue },
                    })
                ).unwrap();

                dispatch(fetchProjects());
            } catch (err) {
                console.error(`Failed to update project ${name} for ID ${actualProjectId}:`, err);
            }
        },
        [dispatch]
    );

    // Table dimensions
    const rowHeight = 40;
    const headerHeight = 48;
    const desiredTableHeight = fixedRowsPerPage * rowHeight + headerHeight;

    // Define table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "Project ID",
                size: 110,
                cell: ({ row, getValue }) => (
                    <Link
                        to={`/projects/${row.original.actualId}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {getValue()}
                    </Link>
                ),
            },
            {
                accessorKey: "title",
                header: "Project Title",
                size: 250,
                cell: ({ row, getValue }) => (
                    <Link to={`/milestones`} className="cursor-pointer">
                        {getValue()}
                    </Link>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                size: 150,
                cell: (info) => (
                    <StatusBadge
                        statusOptions={globalStatusOptions.map(
                            (status) => status.charAt(0).toUpperCase() + status.slice(1)
                        )}
                        status={info.getValue()}
                        onStatusChange={(newStatus) => {
                            handleStatusChange({
                                id: info.row.original.id,
                                name: "status",
                                payload: newStatus,
                            });
                        }}
                    />
                ),
            },
            {
                accessorKey: "type",
                header: "Project Type",
                size: 150,
            },
            {
                accessorKey: "manager",
                header: "Project Manager",
                size: 180,
            },
            {
                accessorKey: "milestones",
                header: "Milestones",
                size: 130,
                cell: (info) => <ProgressBar progressString={info.getValue()} />,
            },
            {
                accessorKey: "tasks",
                header: "Tasks",
                size: 110,
                cell: (info) => <ProgressBar progressString={info.getValue()} />,
            },
            {
                accessorKey: "issues",
                header: "Issues",
                size: 100,
            },
            {
                accessorKey: "startDate",
                header: "Start Date",
                size: 120,
                meta: { isDarkColumn: true },
            },
            {
                accessorKey: "endDate",
                header: "End Date",
                size: 120,
                meta: { isDarkColumn: true },
            },
            {
                accessorKey: "priority",
                header: "Priority",
                size: 100,
                cell: (info) => (
                    <StatusBadge
                        statusOptions={["High", "Low", "Medium", "Urgent"]}
                        status={info.getValue()}
                        onStatusChange={(newPriority) => {
                            handleStatusChange({
                                id: info.row.original.id,
                                name: "priority",
                                payload: newPriority,
                            });
                        }}
                    />
                ),
                meta: { isDarkColumn: true },
            },
            {
                id: "actions",
                header: "Actions",
                size: 150,
                cell: ({ row }) => <ActionIcons row={row} />,
                meta: {
                    isDarkColumn: true,
                    cellClassName: "actions-cell-content",
                },
            },
        ],
        []
    );

    // Initialize react-table
    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // Render loading, error, or table content
    let content;
    if (fetchProjectsLoading || statusChangeLoading || fetchProjectsError || statusChangeError) {
        let loadingMessage, error;
        if (fetchProjectsLoading) loadingMessage = "Loading Projects..";
        if (statusChangeLoading) loadingMessage = "Updating Status..";
        if (fetchProjectsError) error = fetchProjectsError;
        if (statusChangeError) error = statusChangeError;

        content = <Loader message={loadingMessage} error={error} />;
    } else {
        content = (
            <div
                className="project-table-container text-[14px] font-light"
                style={{ height: `${desiredTableHeight}px` }}
            >
                <div className="table-wrapper overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{ width: header.getSize(), height: `${headerHeight}px` }}
                                            className="bg-[#D5DBDB] px-3 py-3.5 text-gray-800 text-center font-[500] border-r-2 border-[#FFFFFF]"
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
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 even:bg-[#D5DBDB4D]"
                                    style={{ height: `${rowHeight}px` }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() }}
                                            className={`${cell.column.columnDef.meta?.cellClassName || ""} whitespace-nowrap border-r-2`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {table.getRowModel().rows.length === 0 && !fetchProjectsLoading && !statusChangeLoading && (
                                <tr style={{ height: `${rowHeight}px` }}>
                                    <td
                                        colSpan={columns.length}
                                        className="no-data-message text-center py-10 text-gray-500"
                                    >
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
                            {"<<"}
                        </button>
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            {">"}
                        </button>
                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="p-1 border rounded disabled:opacity-50"
                        >
                            {">>"}
                        </button>
                    </div>
                    <span className="flex items-center gap-1">
                        <div>Page</div>
                        <strong>
                            {table.getState().pagination.pageIndex + 1} of{" "}
                            {table.getPageCount()}
                        </strong>
                    </span>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                        }}
                        className="p-1 border rounded"
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    return content;
};

export default ProjectList;