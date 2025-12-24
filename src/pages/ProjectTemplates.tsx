import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Trash2 } from "lucide-react";
import { useState } from "react";

const columns: ColumnConfig[] = [
    {
        key: 'templateName',
        label: 'Project Template',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'ownerName',
        label: 'Owner Name',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'priority',
        label: 'Priority',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'memberCount',
        label: 'Project Members',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ProjectTemplates = () => {
    const [templates, setTemplates] = useState([
        {
            id: 1,
            templateName: 'Upload Test',
            ownerName: 'Deepak yadav',
            priority: 'High',
            memberCount: 4,
        },
        {
            id: 2,
            templateName: 'project review',
            ownerName: 'Deepak yadav',
            priority: 'Medium',
            memberCount: 4,
        },
        {
            id: 3,
            templateName: 'Project Alpha',
            ownerName: 'Deepak yadav',
            priority: 'High',
            memberCount: 4,
        },
        {
            id: 4,
            templateName: 'Milestone project test',
            ownerName: 'Sadanand Gupta',
            priority: 'High',
            memberCount: 4,
        },
        {
            id: 5,
            templateName: 'Test Roster',
            ownerName: 'Test User Name',
            priority: 'Low',
            memberCount: 2,
        },
        {
            id: 6,
            templateName: 'Finance Module',
            ownerName: 'Sadanand Gupta',
            priority: 'High',
            memberCount: 4,
        },
        {
            id: 7,
            templateName: 'New Project Demo',
            ownerName: 'Akshay',
            priority: 'High',
            memberCount: 0,
        },
    ]);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(template => template.id !== id));
        }
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case 'priority':
                const priorityColors = {
                    'High': 'text-red-600 font-medium',
                    'Medium': 'text-yellow-600 font-medium',
                    'Low': 'text-green-600 font-medium',
                };
                return (
                    <span className={priorityColors[item.priority] || ''}>
                        {item.priority}
                    </span>
                );
            default:
                return item[columnKey] || "-";
        }
    }

    return (
        <div className="p-6">
            <EnhancedTable
                data={templates}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                pagination={true}
                pageSize={10}
            />
        </div>
    )
}

export default ProjectTemplates