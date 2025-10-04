import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const columns = [
    {
        key: 'title',
        label: 'Task Title',
        sortable: true,
        defaultVisible: true,
    },
    {
        key: 'responsible',
        label: 'Responsible Person',
        sortable: true,
        defaultVisible: true,
    },
    {
        key: 'duration',
        label: 'Duration',
        sortable: true,
        defaultVisible: true,
    },
    {
        key: 'endDate',
        label: 'End Date',
        sortable: true,
        defaultVisible: true,
    },
];

const demoTasks = [
    {
        id: 1,
        title: 'Task 1',
        responsible: 'Person 1',
        duration: '2 days',
        endDate: '2023-12-31',
    },
    {
        id: 2,
        title: 'Task 2',
        responsible: 'Person 2',
        duration: '3 days',
        endDate: '2024-01-03',
    },
]

const ChannelTasksAll = () => {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([])

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            case 'title':
                return <span className="font-normal text-black">{item[columnKey]}</span>;
            case 'responsible':
            case 'endDate':
                return <span className="italic text-gray-600">{item[columnKey]}</span>;
            case 'duration':
                return (
                    <div className="inline-block bg-gray-100 text-gray-600 italic px-4 py-2 rounded-sm">
                        {item[columnKey]}
                    </div>
                );
            default:
                return item[columnKey];
        }
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/channels/tasks/${item.id}`)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    return (
        <div className="p-6">
            <EnhancedTable
                data={demoTasks}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                storageKey="chat-tasks-table"
                emptyMessage="No tasks available"
                pagination={true}
                pageSize={10}
                hideTableSearch={true}
                hideColumnsButton={true}
            />
        </div>
    )
}

export default ChannelTasksAll