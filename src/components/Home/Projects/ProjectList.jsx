import {
    useState,
    useMemo,
    useEffect,
    useCallback,
    useRef,
    Fragment,
} from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
    fetchProjects,
    changeProjectStatus,
    createProject,
    deleteProject,
    fetchProjectTypes,
    resetProjectSuccess,
    filterProjects
} from "../../../redux/slices/projectSlice";
import qs from "qs";
import { fetchUsers } from "../../../redux/slices/userSlice";
import StatusBadge from "./statusBadge";
import "./Table.css";
import Loader from "../../Loader";
import SelectBox from "../../SelectBox";
import { toast } from "react-hot-toast";

const NewProjectTextField = ({
    value,
    onChange,
    onEnterPress,
    inputRef,
    placeholder,
    className,
    validator,
}) => {
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && onEnterPress) {
            event.preventDefault();
            onEnterPress();
        }
    };
    return (
        <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={`${validator ? "border border-red-500" : "border-none"
                } w-full p-1 focus:outline-none rounded text-[13px] bg-none`}
        />
    );
};

const NewProjectDateEditor = ({
    value,
    onChange,
    onEnterPress,
    placeholder,
    className,
    validator,
    min
}) => {
    const handleKeyDown = (event) => {
        if (event.key === "Enter" && onEnterPress) {
            event.preventDefault();
            onEnterPress();
        }
    };
    return (
        <input
            type="date"
            placeholder={placeholder}
            value={value || ""}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={`${validator ? "border border-red-500" : "border-none"
                } w-full p-1 focus:outline-none rounded text-[13px] ${className || ""}`}
            min={min || null}
        />
    );
};

const ActionIcons = ({ row }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [deleting, setDeleting] = useState(false); // Local state for delete button

    const handleDelete = async (id) => {
        const formatId = id.split('-')[1];
        setDeleting(true);

        try {
            const response = await dispatch(
                deleteProject({ id: formatId, token: localStorage.getItem('token') })
            ).unwrap();

            if (response?.error === "You are not authorized to delete this project") {
                toast.dismiss()
                toast.error("You cannot delete this project — unauthorized access.", {
                    icon: "🚫",
                });
            } else {
                // Proceed only if no authorization issue
                await dispatch(fetchProjects({ token: localStorage.getItem('token') })).unwrap();
                toast.dismiss();
                toast.success("Project deleted successfully", {
                    iconTheme: {
                        primary: "red",
                        secondary: "white",
                    },
                });
            }
        } catch (err) {
            console.error("Delete error:", err);

            const message =
                err?.error === "You are not authorized to delete this project"
                    ? "You cannot delete this project."
                    : "Failed to delete project. Please try again.";

            toast.dismiss();
            toast.error(message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="action-icons flex justify-around items-center">
            <button
                onClick={() => navigate(`/projects/${row.original.actualId}`)}
                title="View Details"
            >
                <OpenInFullIcon sx={{ fontSize: "1.2em" }} />
            </button>
            <button
                onClick={() => navigate(`/projects/${row.original.actualId}/milestones`)}
                title="View Tasks"
            >
                <LoginTwoToneIcon sx={{ fontSize: "1.2em" }} />
            </button>
            <button
                onClick={() => handleDelete(row.original.id)}
                title="Delete"
                disabled={deleting} // Disable button when deleting
                className={deleting ? "opacity-50 cursor-not-allowed" : ""}
            >
                <DeleteOutlineOutlinedIcon sx={{ fontSize: "1.2em" }} />
            </button>
        </div>
    );
};

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

const globalStatusOptions = [
    "active",
    "in_progress",
    "on_hold",
    "completed",
    "overdue",
];

const globalPriorityOptionsForNew = ["Low", "Medium", "High", "Urgent"];

const ProjectList = () => {
    const token = localStorage.getItem("token");
    const fixedRowsPerPage = 10;
    const dispatch = useDispatch();

    const {
        fetchProjects: initialProjects,
        loading: fetchProjectsLoading,
        error: fetchProjectsError,
    } = useSelector((state) => state.fetchProjects);

    const {
        filterProjects: filteredProjects,
        success: filterProjectsSuccess,
        loading: filterProjectsLoadingRedux,
        error: filterProjectsErrorRedux,
    } = useSelector((state) => state.filterProjects);

    const { loading: statusChangeLoading, error: statusChangeError } =
        useSelector((state) => state.changeProjectStatus);

    const { success } = useSelector(state => state.createProject)

    const {
        fetchUsers: users,
        loading: loadingUsers,
        error: usersFetchError,
    } = useSelector(
        (state) => state.fetchUsers || { users: [], loading: false, error: null }
    );

    const {
        loading: deleteProjectLoading,
        error: deleteProjectError
    } = useSelector((state) => state.deleteProject);

    const {
        fetchProjectTypes: projectTypes,
        loading: fetchProjectTypesLoading,
        error: fetchProjectTypesError,
    } = useSelector((state) => state.fetchProjectTypes);

    const [isAddingNewProject, setIsAddingNewProject] = useState(false);
    const [projectTypeOptions, setProjectTypeOptions] = useState([]);
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [newProjectStatus, setNewProjectStatus] = useState(
        globalStatusOptions[0]
    );
    const [newProjectType, setNewProjectType] = useState(
        projectTypeOptions.length > 0 ? projectTypeOptions[0] : ""
    );
    const [newProjectManager, setNewProjectManager] = useState("");
    const [newProjectStartDate, setNewProjectStartDate] = useState("");
    const [newProjectEndDate, setNewProjectEndDate] = useState("");
    const [newProjectPriority, setNewProjectPriority] = useState(
        globalPriorityOptionsForNew[0]
    );
    const [localError, setLocalError] = useState(null);
    const [isSavingNewProject, setIsSavingNewProject] = useState(false);
    const [validator, setValidator] = useState(null);
    const newProjectTitleInputRef = useRef(null);
    const newProjectFormRowRef = useRef(null);

    const [isFiltered, setIsFiltered] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!fetchProjectTypesLoading && !fetchProjectTypesError && (projectTypes.length == 0 || !Array.isArray(projectTypes))) {
            dispatch(fetchProjectTypes({ token })).unwrap();
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(projectTypes) && projectTypes.length > 0) {
            setProjectTypeOptions(projectTypes.map((projectType) => ({ label: projectType.name, value: projectType.id })));
        }
    }, [projectTypes]);

    useEffect(() => {
        filterProjectsSuccess ? setIsFiltered(true) : setIsFiltered(false)
    }, [filterProjectsSuccess, filteredProjects]);

    const transformedData = useMemo(() => {
        let projectsSource;

        const hasFilter = isFiltered ||
            (localStorage.getItem("projectFilters") || localStorage.getItem("projectStatus"));

        if (hasFilter) {
            projectsSource = filteredProjects?.length > 0 ? filteredProjects : [];
        } else {
            projectsSource = initialProjects;
        }

        if (!projectsSource) return [];
        if (!Array.isArray(projectsSource)) {
            if (projectsSource?.data && Array.isArray(projectsSource.data)) {
                return projectsSource.data.map((project, index) =>
                    transformProject(project, index)
                );
            }
            console.warn("Projects source is not an array:", projectsSource);
            return [];
        }
        if (projectsSource.length === 0) return [];

        return projectsSource.map((project, index) =>
            transformProject(project, index)
        );

        function transformProject(project, index) {
            try {
                return {
                    id: `P-${project.id?.toString() || `unknown-${index}`}`,
                    actualId: project.id?.toString() || `unknown-${index}`,
                    title: project.title || project.name || project.project_title || "Untitled",
                    status: project.status
                        ? project.status.charAt(0).toUpperCase() + project.status.slice(1)
                        : "Unknown",
                    type: project.project_type_name
                        ? project.project_type_name.charAt(0).toUpperCase() + project.project_type_name.slice(1)
                        : project.type
                            ? project.type.charAt(0).toUpperCase() + project.type.slice(1)
                            : "",

                    manager: project.project_owner_name || project.manager || "Unassigned",
                    milestones: (() => {
                        const totalCount = Number(project.total_milestone_count);
                        const completedCount = Number(project.completed_milestone_count);

                        if (!totalCount || totalCount === 0) return 0;

                        const percentage = Math.round((completedCount / totalCount) * 100);
                        return percentage;
                    })(),

                    tasks: (() => {
                        const totalCount = Number(project.total_task_management_count);
                        const completedCount = Number(project.completed_task_management_count);

                        if (!totalCount || totalCount === 0) return 0;

                        const percentage = Math.round((completedCount / totalCount) * 100);
                        console.log(percentage)
                        return percentage;
                    })(),
                    issues: `${project.completed_issues_count} / ${project.total_issues_count}`,
                    startDate: project.start_date
                        ? new Date(project.start_date).toLocaleDateString("en-CA")
                        : "N/A",
                    endDate: project.end_date
                        ? new Date(project.end_date).toLocaleDateString("en-CA")
                        : "N/A",
                    priority: project.priority
                        ? project.priority.charAt(0).toUpperCase() + project.priority.slice(1)
                        : "Unknown",
                };
            } catch (error) {
                console.error(
                    `Error transforming project ${index}:`,
                    error,
                    "Project:",
                    project
                );
                return {
                    id: `P-error-${index}`,
                    actualId: `error-${index}`,
                    title: "Error Transforming Data",
                };
            }
        }
    }, [initialProjects, filteredProjects, isFiltered]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: fixedRowsPerPage,
    });

    useEffect(() => {
        dispatch(fetchUsers({ token }));
        dispatch(fetchProjects({ token }));
    }, [dispatch]);

    useEffect(() => {
        setData(transformedData);
    }, [transformedData]);

    const handleStatusChange = useCallback(
        async ({ id: rowId, name, payload: newValue }) => {
            const actualProjectId = rowId.replace("P-", "");
            const apiCompatibleValue =
                typeof newValue === "string" ? newValue.toLowerCase() : newValue;
            try {
                await dispatch(
                    changeProjectStatus({
                        token,
                        id: actualProjectId,
                        payload: { project_management: { [name]: apiCompatibleValue } },
                    })
                ).unwrap();
                if (localStorage.getItem("projectFilters")) {
                    console.log("hoe");
                    const saved = JSON.parse(localStorage.getItem("projectFilters"));
                    const newFilters = {
                        "q[status_in][]": saved.selectedStatuses, // Use array for multiple selections
                        "q[owner_id_in][]": saved.selectedManagers,
                        "q[created_by_id_in][]": saved.selectedCreators,
                        "q[project_type_id_in][]": saved.selectedTypes,
                        "q[title_cont]": "",
                        "q[is_template_eq]": "",
                        "q[start_date_eq]": saved.dates.startDate || "", // Ensure date is sent or empty string
                        "q[end_date_eq]": saved.dates.endDate || "",
                    };
                    const queryString = qs.stringify(newFilters, { arrayFormat: 'repeat' });
                    dispatch(filterProjects({ token, filters: queryString }));

                } else if (localStorage.getItem("projectStatus")) {
                    const status = localStorage.getItem("projectStatus");
                    const filter = {
                        "q[status_eq]": status
                    }
                    dispatch(filterProjects({ token, filters: filter }));

                }
                else {
                    dispatch(fetchProjects({ token }));
                }
            } catch (err) {
                console.error(
                    `Failed to update project ${name} for ID ${actualProjectId}:`,
                    err
                );
            }
        },
        [dispatch]
    );

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.removeItem("projectFilters");
        };

        window.addEventListener("beforeunload", handleBeforeUnload); console.log("Resetting filters at", new Date().toISOString());


        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const EditableTitleCell = ({ row, getValue }) => {
        const [title, setTitle] = useState(getValue());
        const [edit, setEdit] = useState(false);

        const currentPath = window.location.pathname;

        // Sync title with getValue() when row data changes
        useEffect(() => {
            setTitle(getValue());
        }, [getValue]);

        const handleDoubleClick = (e) => {
            e.preventDefault();
            setEdit(true);
        };

        const handleSave = () => {
            setEdit(false);
            if (title !== getValue()) {
                handleStatusChange({
                    id: row.original.id,
                    name: "title",
                    payload: title,
                });
            }
        };

        return (
            <span onDoubleClick={handleDoubleClick}>
                {edit ? (
                    <NewProjectTextField
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onEnterPress={handleSave}
                        onBlur={handleSave}
                    />
                ) : (
                    <Link
                        to={currentPath.includes("cloud-projects") ? `/cloud-projects/${row.original.actualId}/milestones` : `/projects/${row.original.actualId}/milestones`}
                        className="cursor-pointer"
                        onDoubleClick={handleDoubleClick}
                    >
                        {title}
                    </Link>
                )}
            </span>
        );
    };

    const resetNewProjectForm = useCallback(() => {
        setNewProjectTitle("");
        setNewProjectStatus(globalStatusOptions[0]);
        setNewProjectType(projectTypeOptions[0]);
        setNewProjectManager("");
        setNewProjectStartDate("");
        setNewProjectEndDate("");
        setNewProjectPriority(globalPriorityOptionsForNew[0]);
        setLocalError(null);
        setValidator(false);
    }, [projectTypeOptions]);

    const handleShowNewProjectForm = useCallback(() => {
        resetNewProjectForm();
        setIsAddingNewProject(true);
    }, [resetNewProjectForm]);

    const handleCancelNewProject = useCallback(() => {
        setIsAddingNewProject(false);
        resetNewProjectForm();
    }, [resetNewProjectForm]);

    const handleSaveNewProject = useCallback(async () => {
        if (
            !newProjectTitle ||
            newProjectTitle.trim() === "" ||
            !newProjectStartDate ||
            !newProjectEndDate
        ) {
            setLocalError("Fill all required fields.");
            setValidator(true);
            return;
        }
        setLocalError(null);
        setIsSavingNewProject(true);
        setValidator(false);

        const projectPayload = {
            title: newProjectTitle.trim(),
            status: newProjectStatus.toLowerCase(),
            owner_id: newProjectManager || null,
            start_date: newProjectStartDate || null,
            end_date: newProjectEndDate || null,
            priority: newProjectPriority.toLowerCase(),
            project_type_id: newProjectType,
            active: "true",
        };

        try {
            await dispatch(
                createProject({ token, payload: { project_management: projectPayload } })
            ).unwrap();
            dispatch(fetchProjects({ token }));
            handleCancelNewProject();
        } catch (error) {
            console.error("Failed to create project:", error);
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to save project.";
            setLocalError(errorMessage);
        } finally {
            setIsSavingNewProject(false);
        }
    }, [
        dispatch,
        handleCancelNewProject,
        newProjectTitle,
        newProjectStatus,
        newProjectType,
        newProjectManager,
        newProjectStartDate,
        newProjectEndDate,
        newProjectPriority,
    ]);

    useEffect(() => {
        if (isAddingNewProject && newProjectTitleInputRef.current) {
            newProjectTitleInputRef.current.focus();
        }
    }, [isAddingNewProject]);

    useEffect(() => {
        if (success) {
            dispatch(resetProjectSuccess())
        }
    }, [success, dispatch])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                !isAddingNewProject ||
                isSavingNewProject ||
                !newProjectFormRowRef.current ||
                newProjectFormRowRef.current.contains(event.target)
            ) {
                return;
            }
            handleSaveNewProject();
        };

        if (isAddingNewProject) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [
        isAddingNewProject,
        isSavingNewProject,
        newProjectTitle,
        handleSaveNewProject,
        handleCancelNewProject,
    ]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (!isAddingNewProject) return;
            if (event.key === "Escape") {
                handleCancelNewProject();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isAddingNewProject, handleCancelNewProject]);

    const userOptionsForSelectBox = useMemo(
        () => [
            { value: "", label: "Unassigned" },
            ...(Array.isArray(users)
                ? users.map((u) => ({
                    value: u.id,
                    label: `${u.firstname || ""} ${u.lastname || ""}`.trim(),
                }))
                : []),
        ],
        [users]
    );

    const rowHeight = 40;
    const headerHeight = 48;

    const currentPath = window.location.pathname;

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "Project ID",
                size: 110,
                cell: ({ row, getValue }) => (
                    <Link
                        to={currentPath.includes("cloud-projects") ? `/cloud-projects/${row.original.actualId}` : `/projects/${row.original.actualId}`}
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
                    <EditableTitleCell row={row} getValue={getValue} />
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                size: 150,
                cell: (info) => (
                    <StatusBadge
                        statusOptions={globalStatusOptions.map(
                            (s) => s.charAt(0).toUpperCase() + s.slice(1)
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
                cell: ({ getValue }) => getValue(),
            },
            {
                accessorKey: "manager",
                header: "Project Manager",
                size: 180,
                cell: ({ getValue }) => getValue(),
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
                cell: (info) => (
                    <div style={{ textAlign: "center", width: "100%" }}>
                        {info.getValue()}
                    </div>
                ),
            },
            {
                accessorKey: "startDate",
                header: "Start Date",
                size: 120,
                cell: ({ getValue }) => {
                    const date = new Date(getValue());
                    return date.toLocaleDateString("en-GB");
                },
            },
            {
                accessorKey: "endDate",
                header: "End Date",
                size: 120,
                cell: ({ getValue }) => {
                    const date = new Date(getValue());
                    return date.toLocaleDateString("en-GB");
                },
            },
            {
                accessorKey: "priority",
                header: "Priority",
                size: 100,
                cell: (info) => (
                    <StatusBadge
                        statusOptions={globalPriorityOptionsForNew}
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
            },
            {
                id: "actions",
                header: "Actions",
                size: 150,
                cell: ({ row }) => <ActionIcons row={row} />,
            },
        ],
        [handleStatusChange]
    );

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    let content;
    const anyFilterLoading = filterProjectsLoadingRedux;
    const anyFilterError = filterProjectsErrorRedux;

    if (
        fetchProjectsLoading ||
        anyFilterLoading ||
        isSavingNewProject
    ) {
        const loadingMessage = isSavingNewProject
            ? "Saving Project..."
            : fetchProjectsLoading
                ? "Loading Projects..."
                : anyFilterLoading
                    ? "Applying Filters..."
                    : "Updating Status...";
        content = <Loader message={loadingMessage} />;
    } else if (
        fetchProjectsError ||
        usersFetchError ||
        anyFilterError ||
        fetchProjectTypesError
    ) {
        toast.dismiss()
        toast.error("Internal Server Error, Refresh Once");
    } else {
        content = (
            <div
                className="project-table-container text-[14px] font-light"
                style={{ minHeight: "200px" }}
            >
                {localError && isAddingNewProject && (
                    <div className="mb-2 p-2 text-sm text-red-700">{localError}</div>
                )}
                <div className="table-wrapper overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                width: header.getSize(),
                                                height: `${headerHeight}px`,
                                            }}
                                            className="bg-[#D5DBDB] px-3 py-3.5 text-gray-800 text-center font-[500] border-r-2 border-[#FFFFFF] sticky top-0 z-10"
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
                        <tbody>
                            {data.length === 0 && !isAddingNewProject ? (
                                <tr style={{ height: `${rowHeight}px` }}>
                                    <td
                                        colSpan={columns.length}
                                        className="no-data-message text-center py-10 text-gray-500"
                                    >
                                        No projects found.{" "}
                                        {isFiltered ? "Try adjusting filters." : ""}
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
                                                className={`${cell.column.columnDef.meta?.cellClassName || ""
                                                    } whitespace-nowrap border-r-2 p-2 align-middle`}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                            {!isAddingNewProject && (
                                <tr>
                                    <td colSpan={columns.length} className="p-2 border-t-2">
                                        <button
                                            onClick={handleShowNewProjectForm}
                                            className="px-3 py-1.5 text-sm text-red-600 hover:underline"
                                            disabled={
                                                isSavingNewProject ||
                                                fetchProjectsLoading ||
                                                loadingUsers ||
                                                anyFilterLoading ||
                                                statusChangeLoading
                                            }
                                        >
                                            + Add Project
                                        </button>
                                    </td>
                                </tr>
                            )}
                            {isAddingNewProject && (
                                <tr
                                    ref={newProjectFormRowRef}
                                    className="bg-blue-50"
                                    style={{ height: `${rowHeight}px` }}
                                >
                                    <td className="p-1 border-r-2 text-center text-gray-500 text-xs align-middle">
                                        NEW
                                    </td>
                                    <td className="p-0 border-r-2 align-middle">
                                        <NewProjectTextField
                                            inputRef={newProjectTitleInputRef}
                                            value={newProjectTitle}
                                            onChange={(e) => {
                                                setNewProjectTitle(e.target.value);
                                                if (localError) setLocalError(null);
                                            }}
                                            onEnterPress={handleSaveNewProject}
                                            placeholder="Project Title"
                                            validator={validator}
                                        />
                                    </td>
                                    <td className="p-1 border-r-2 align-middle">
                                        <StatusBadge
                                            statusOptions={globalStatusOptions.map(
                                                (s) => s.charAt(0).toUpperCase() + s.slice(1)
                                            )}
                                            status={
                                                newProjectStatus.charAt(0).toUpperCase() +
                                                newProjectStatus.slice(1)
                                            }
                                            onStatusChange={(val) =>
                                                setNewProjectStatus(val.toLowerCase())
                                            }
                                        />
                                    </td>
                                    <td className="p-1 border-r-2 align-middle">
                                        <SelectBox
                                            options={projectTypeOptions}
                                            value={newProjectType}
                                            onChange={(selected) => setNewProjectType(selected)}
                                            table={true}
                                        />
                                    </td>
                                    <td className="p-0 border-r-2 align-middle">
                                        <SelectBox
                                            options={userOptionsForSelectBox}
                                            value={newProjectManager}
                                            onChange={(selectedValue) =>
                                                setNewProjectManager(selectedValue)
                                            }
                                            table={true}
                                            placeholder="Select Manager..."
                                        />
                                    </td>
                                    <td className="p-1 border-r-2 align-middle"></td>
                                    <td className="p-1 border-r-2 align-middle"></td>
                                    <td className="p-1 border-r-2 align-middle"></td>
                                    <td className="p-0 border-r-2 align-middle">
                                        <NewProjectDateEditor
                                            value={newProjectStartDate}
                                            onChange={(e) => setNewProjectStartDate(e.target.value)}
                                            onEnterPress={handleSaveNewProject}
                                            validator={validator}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </td>
                                    <td className="p-0 border-r-2 align-middle">
                                        <NewProjectDateEditor
                                            value={newProjectEndDate}
                                            onChange={(e) => setNewProjectEndDate(e.target.value)}
                                            onEnterPress={handleSaveNewProject}
                                            validator={validator}
                                            min={newProjectStartDate}
                                        />
                                    </td>
                                    <td className="p-1 border-r-2 align-middle">
                                        <StatusBadge
                                            statusOptions={globalPriorityOptionsForNew}
                                            status={newProjectPriority}
                                            onStatusChange={(val) => setNewProjectPriority(val)}
                                        />
                                    </td>
                                    <td className="p-1 border-r-2 text-center align-middle"></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {data.length > 0 && (
                    <div className=" flex items-center justify-start gap-4 mt-4 text-[12px]">
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
                                        className={` px-3 py-1 ${isActive ? "bg-gray-200 font-bold" : ""
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
        );
    }

    return <div className="project-list-wrapper p-4">{content}</div>;
};

export default ProjectList;