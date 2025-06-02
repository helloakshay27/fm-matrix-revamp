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

const ProjectList = () => {
    const fixedRowsPerPage = 10;
    const dispatch = useDispatch();

    // Select project data, loading, and error states from Redux
    const {
        fetchProjects: initialProjects,
        loading: fetchProjectsLoading,
        error: fetchProjectsError,
    } = useSelector((state) => state.fetchProjects);

    const {
        filterProjects: filteredProjects,
        loading: filterProjectsLoading,
        error: filterProjectsError,
    } = useSelector((state) => state.filterProjects);

    const {
        loading: statusChangeLoading,
        error: statusChangeError,
    } = useSelector((state) => state.changeProjectStatus);

    // Track whether filters are applied
    const [isFiltered, setIsFiltered] = useState(false);
    const [data, setData] = useState([]);

    // Log Redux state for debugging
    useEffect(() => {
        console.log("Redux state - fetchProjects:", {
            initialProjects,
            fetchProjectsLoading,
            fetchProjectsError,
            isArray: Array.isArray(initialProjects),
            length: initialProjects ? initialProjects.length : "N/A",
        });
        console.log("Redux state - filterProjects:", {
            filteredProjects,
            filterProjectsLoading,
            filterProjectsError,
            isArray: Array.isArray(filteredProjects),
            length: filteredProjects ? filteredProjects.length : "N/A",
        });
    }, [
        initialProjects,
        fetchProjectsLoading,
        fetchProjectsError,
        filteredProjects,
        filterProjectsLoading,
        filterProjectsError,
    ]);

    // Transform API response data for table display
    const transformedData = useMemo(() => {
        const projects = isFiltered && Array.isArray(filteredProjects) && filteredProjects.length > 0 ? filteredProjects : initialProjects;
        console.log("Transforming data - isFiltered:", isFiltered, "Using:", isFiltered ? "filteredProjects" : "initialProjects", "Projects length:", projects ? projects.length : "N/A");

        if (!projects) {
            console.log("Projects is null/undefined");
            return [];
        }

        if (!Array.isArray(projects)) {
            console.log("Projects is not an array, received:", projects);
            if (projects?.data && Array.isArray(projects.data)) {
                console.log("Found nested data array, using projects.data");
                return projects.data.map((project, index) => transformProject(project, index));
            }
            return [];
        }

        if (projects.length === 0) {
            console.log("Projects array is empty");
            return [];
        }

        return projects.map((project, index) => transformProject(project, index));

        function transformProject(project, index) {
            console.log(`Transforming project ${index}:`, project);
            try {
                return {
                    id: `P-${project.id?.toString() || `unknown-${index}`}`,
                    actualId: project.id?.toString() || `unknown-${index}`,
                    title: project.title || "Untitled",
                    status: project.status
                        ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
                        : "Unknown",
                    type: project.resource_type || "Unknown",
                    manager: project.project_owner_name || "Unassigned",
                    milestones: "70%", // Static for demo; replace with real data
                    tasks: "90%", // Static for demo; replace with real data
                    issues: "8/10", // Static for demo; replace with real data
                    startDate: project.start_date || "N/A",
                    endDate: project.end_date || "N/A",
                    priority: project.priority
                        ? project.priority.charAt(0).toUpperCase() + project.priority.slice(1)
                        : "Unknown",
                };
            } catch (error) {
                console.error(`Error transforming project ${index}:`, error, "Project:", project);
                return {
                    id: `P-error-${index}`,
                    actualId: `error-${index}`,
                    title: "Error",
                    status: "Error",
                    type: "Error",
                    manager: "Error",
                    milestones: "0%",
                    tasks: "0%",
                    issues: "0/0",
                    startDate: "N/A",
                    endDate: "N/A",
                    priority: "Error",
                };
            }
        }
    }, [initialProjects, filteredProjects, isFiltered]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: fixedRowsPerPage,
    });

    // Fetch initial projects on mount
    useEffect(() => {
        console.log("Dispatching fetchProjects at", new Date().toISOString());
        dispatch(fetchProjects());
    }, [dispatch]);

    // Update data when transformedData changes
    useEffect(() => {
        console.log("Setting data, transformedData length:", transformedData.length);
        setData(transformedData);
    }, [transformedData]);

    // Update filter state when filteredProjects changes
    useEffect(() => {
        if (Array.isArray(filteredProjects) && filteredProjects.length > 0) {
            console.log("filteredProjects has data, setting isFiltered to true:", filteredProjects.length);
            setIsFiltered(true);
        } else {
            console.log("filteredProjects is null or empty, setting isFiltered to false:", filteredProjects);
            setIsFiltered(false);
        }
    }, [filteredProjects]);

    const handleStatusChange = useCallback(
        async ({ id: rowId, name, payload: newValue }) => {
            const actualProjectId = rowId.replace("P-", "");
            const apiCompatibleValue = newValue.toLowerCase();
            console.log("Changing status for project ID:", actualProjectId, "to:", apiCompatibleValue);

            try {
                await dispatch(
                    changeProjectStatus({
                        id: actualProjectId,
                        payload: { [name]: apiCompatibleValue },
                    })
                ).unwrap();
                console.log("Status change successful, refreshing projects");
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
    console.log("Rendering ProjectList - data length:", data.length, "loading:", fetchProjectsLoading || filterProjectsLoading || statusChangeLoading);
    let content;
    if (fetchProjectsLoading || filterProjectsLoading || statusChangeLoading) {
        const loadingMessage = fetchProjectsLoading
            ? "Loading Projects..."
            : filterProjectsLoading
            ? "Applying Filters..."
            : "Updating Status...";
        console.log("Rendering loader with message:", loadingMessage);
        content = <Loader message={loadingMessage} />;
    } else if (fetchProjectsError || filterProjectsError || statusChangeError) {
        const error = fetchProjectsError || filterProjectsError || statusChangeError;
        console.log("Rendering error:", error);
        content = (
            <div className="p-4 text-red-600">
                <p>Error: {typeof error === "string" ? error : JSON.stringify(error)}</p>
            </div>
        );
    } else {
        content = (
            <div
                className="project-table-container text-[14px] font-light"
                style={{ height: `${desiredTableHeight}px`, minHeight: "200px" }}
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
                            {data.length === 0 ? (
                                <tr style={{ height: `${rowHeight}px` }}>
                                    <td
                                        colSpan={columns.length}
                                        className="no-data-message text-center py-10 text-gray-500"
                                    >
                                        No projects found. {isFiltered ? "Try adjusting filters." : "Please check the API or try refreshing."}
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row) => (
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {data.length > 0 && (
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
                )}
            </div>
        );
    }

    return (
        <div className="project-list-wrapper">
            {content}
        </div>
    );
};

export default ProjectList;