import { EnhancedTable } from './enhanced-table/EnhancedTable';

const ChatTasks = () => {
    const initialData = [
        {
            id: '1',
            title: 'Please complete that today',
            responsible: 'Unassigned',
            duration: 'Enter Duration',
            endDate: 'Unassigned',
        },
    ];

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

    return (
        <div className="w-full">
            <EnhancedTable
                data={initialData}
                columns={columns}
                renderCell={renderCell}
                storageKey="chat-tasks-table"
                className="w-full border-separate border-spacing-0"
                emptyMessage="No tasks available"
                pagination={true}
                pageSize={10}
                hideTableSearch={true}
                hideColumnsButton={true}
            />
        </div>
    );
};

export default ChatTasks;