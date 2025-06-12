import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatusBadge from "../../components/Home/Projects/statusBadge";
import CustomTable from "../../components/Setup/CustomTable";
import AddSprintModal from "../../components/Home/Sprints/AddSprintModal";
import {
    fetchSpirints,
    putSprint,
    postSprint,
} from "../../redux/slices/spirintSlice";
import { Link } from "react-router-dom";
import TaskActions from "../../components/Home/TaskActions";
import BoardsSection from "../../components/Home/BoardsSection";
import { Milestone } from "lucide-react";
import SprintGantt from "../../components/Sprints/SprintGantt";

const globalStatusOptions = [
    "open",
    "in_progress",
    "completed",
    "on_hold",
    "overdue",
    "reopen",
    "abort",
];

const formatDuration = (days) => {
    if (!days || isNaN(days)) return "00d:00h:00m:00s";

    const totalSeconds = Math.floor(days * 24 * 60 * 60);
    const daysPart = Math.floor(totalSeconds / (24 * 60 * 60));
    const hoursPart = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutesPart = Math.floor((totalSeconds % (60 * 60)) / 60);
    const secondsPart = totalSeconds % 60;

    return `${String(daysPart).padStart(2, "0")}d:${String(hoursPart).padStart(
        2,
        "0"
    )}h:${String(minutesPart).padStart(2, "0")}m:${String(secondsPart).padStart(
        2,
        "0"
    )}s`;
};

const SprintTable = (setIsSidebarOpen) => {
    const dispatch = useDispatch();
    const newSpirints = useSelector(
        (state) => state.fetchSpirints?.fetchSpirints || []
    );

    const [data, setData] = useState([]);

    const handlefetchSpirints = () => {
        try {
            dispatch(fetchSpirints()).unwrap();
        } catch (error) {
            console.log(error);
        }
    };

    const handleCreateSprints = async (payload) => {
        try {
            dispatch(postSprint(payload)).unwrap();
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        handlefetchSpirints();
    }, [dispatch]);

    useEffect(() => {
        if (newSpirints?.length) {
            setData(newSpirints);
        }
    }, [newSpirints]);
    let layout = "block";

    const isInline = layout === "inline";

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "Sprint Id",
                size: 110,
                cell: ({ getValue, row }) => {
                    const originalId = String(getValue() || "");
                    let displayId = "";
                    let linkIdPart = originalId;

                    if (originalId.startsWith("S-")) {
                        displayId = originalId;
                        linkIdPart = originalId.substring(2);
                    } else {
                        displayId = `S-${originalId}`;
                    }

                    return (
                        <Link
                            to={`/sprint/${linkIdPart}`}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline p-1 block"
                            style={{ paddingLeft: `${row.depth * 1.5}rem` }}
                        >
                            <span>{displayId}</span>
                        </Link>
                    );
                },
            },
            {
                accessorKey: "name",
                header: "Sprint Title",
                size: 250,
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
                            dispatch(
                                putSprint({
                                    id: info.row.original.id,
                                    payload: { status: newStatus.toLowerCase() },
                                })
                            );
                        }}
                    />
                ),
            },
            {
                accessorKey: "Sprint Owner",
                header: "Sprint Owner",
                size: 150,
            },
            {
                accessorKey: "start_date",
                header: "Start Date",
                size: 180,
            },
            {
                accessorKey: "end_date",
                header: "End Date",
                size: 130,
            },
            {
                accessorKey: "duration",
                header: "Duration",
                size: 110,
                cell: ({ getValue }) => {
                    const durationInDays = getValue();
                    return (
                        <span style={{ color: "green" }}>
                            {formatDuration(durationInDays)}
                        </span>
                    );
                },
            },
            {
                accessorKey: "Priority",
                header: "Priority",
                size: 100,
            },
            {
                accessorKey: "No Of Projects",
                header: "No Of Projects",
                size: 120,
            },
        ],
        []
    );

    const [selectedType, setSelectedType] = useState(() => {
        return localStorage.getItem("selectedTaskType") || "List";
    });

    useEffect(() => {
        localStorage.setItem("selectedTaskType", selectedType);
    }, [selectedType]);

    return (
        <>
            <TaskActions
                setIsSidebarOpen={setIsSidebarOpen}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                addType={"Sprint-Gantt"}
                context="Tasks"
            />

            {selectedType === "Sprint-Gantt" ? (
                <SprintGantt />
            ) : selectedType === "List" ? (
                <CustomTable
                    data={data}
                    columns={columns}
                    layout="inline"
                    onAdd={() => setIsModalOpen(true)}
                    onCreateInlineItem={handleCreateSprints}
                    onRefreshInlineData={handlefetchSpirints}
                />
            ) : (
                <></>
            )}
        </>
    );
};

export default SprintTable;
