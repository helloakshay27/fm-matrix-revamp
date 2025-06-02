import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusBadge from '../../components/Home/Projects/statusBadge';
import CustomTable from '../../components/Setup/CustomTable';
import AddSprintModal from '../../components/Home/Sprints/AddSprintModal';
import { fetchSpirints, putSprint } from '../../redux/slices/spirintSlice';
import { Link } from 'react-router-dom';

const globalStatusOptions = ["open", "in_progress", "completed", "on_hold", "overdue", "reopen", "abort"];

const SprintTable = () => {
    const dispatch = useDispatch();
    const newSpirints = useSelector((state) => state.fetchSpirints?.fetchSpirints || []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch(fetchSpirints());
    }, [dispatch]);

    useEffect(() => {
        if (newSpirints?.length) {
            const sortedData = [...newSpirints].sort((a, b) => a.id - b.id);
            setData(sortedData);
        }
    }, [newSpirints]);

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
                accessorKey: 'name',
                header: 'Sprint Title',
                size: 250,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 150,
                cell: ({ row, getValue }) => {
                    const currentStatus = getValue();
                    const sprintId = row.original.id;

                    const handleStatusChange = (e) => {
                        const newStatus = e.target.value;
                        setData((prev) =>
                            prev.map((sprint) =>
                                sprint.id === sprintId ? { ...sprint, status: newStatus } : sprint
                            )
                        );
                        dispatch(
                            putSprint({
                                id: sprintId,
                                payload: { status: newStatus },
                            })
                        );
                    };

                    const statusHexColors = {
                        overdue: '#FF2733',
                        open: '#E4636A',
                        in_progress: '#08AEEA',
                        on_hold: '#7BD2B5',
                        completed: '#83D17A',
                    };

                    const bgColor = statusHexColors[currentStatus?.toLowerCase()] || '#000000';

                    return (
                        <select
                            value={currentStatus}
                            onChange={handleStatusChange}
                            style={{
                                backgroundColor: bgColor,
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: 'none',
                                fontSize: '14px',
                                marginLeft: '12px',
                            }}
                        >
                            {globalStatusOptions.map((statusOption) => (
                                <option
                                    key={statusOption}
                                    value={statusOption}
                                    style={{ color: 'black' }}
                                >
                                    {statusOption.replace('_', ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                    );
                },
            },
            {
                accessorKey: 'Sprint Owner',
                header: 'Sprint Owner',
                size: 150,
            },
            {
                accessorKey: 'start_date',
                header: 'Start Date',
                size: 180,
            },
            {
                accessorKey: 'end_date',
                header: 'End Date',
                size: 130,
            },
            {
                accessorKey: 'duration',
                header: 'Duration',
                size: 110,
            },
            {
                accessorKey: 'Priority',
                header: 'Priority',
                size: 100,
            },
            {
                accessorKey: 'No Of Projects',
                header: 'No Of Projects',
                size: 120,
            },
        ],
        []
    );

    return (
        <>
            <CustomTable
                data={data}
                columns={columns}
                title="Active Sprints"
                buttonText="New Sprint"
                layout="block"
                onAdd={() => setIsModalOpen(true)}
            />
            {isModalOpen && (
                <AddSprintModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            )}
        </>
    );
};

export default SprintTable;