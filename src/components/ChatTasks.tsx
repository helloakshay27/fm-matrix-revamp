import { useState } from 'react';
import { EnhancedTable } from './enhanced-table/EnhancedTable';

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

const ChatTasks = () => {
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

    return (
        <EnhancedTable
            data={tasks}
            columns={columns}
            renderCell={renderCell}
            storageKey="chat-tasks-table"
            emptyMessage="No tasks available"
            pagination={true}
            pageSize={10}
            hideTableSearch={true}
            hideColumnsButton={true}
        />
    );
};

export default ChatTasks;