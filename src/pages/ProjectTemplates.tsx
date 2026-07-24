import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    const { shouldShow } = useDynamicPermissions();
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            setTemplates(templates.filter(template => template.id !== id));
        }
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2">
                {shouldShow("Project Templates","destroy")&&(
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1 text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>)}
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
            {loading ? (
                <div className="bg-white rounded-lg border border-gray-200">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-[#f6f4ee]">
                                <TableHead className="font-medium">Project Template</TableHead>
                                <TableHead className="font-medium">Owner Name</TableHead>
                                <TableHead className="font-medium">Priority</TableHead>
                                <TableHead className="font-medium">Project Members</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} className="pt-4 pb-16">
                                    <div className="w-full flex items-center justify-start gap-3 pl-4">
                                        <div
                                            className="h-5 w-5 rounded-full animate-spin"
                                            style={{ border: "2px solid #000000", borderTopColor: "transparent" }}
                                        />
                                        <span className="text-sm text-black">Loading ...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            ) : (
            <EnhancedTable
                data={templates}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                pagination={true}
                pageSize={10}
            />
            )}
        </div>
    )
}

export default ProjectTemplates