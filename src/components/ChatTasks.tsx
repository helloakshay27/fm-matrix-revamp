import { useEffect, useState } from 'react';
import { EnhancedTable } from './enhanced-table/EnhancedTable';
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';
import { fetchIndividualChatTasks } from '@/store/slices/channelSlice';
import { useLocation, useParams } from 'react-router-dom';

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

const formattedData = (data) => {
    return data.map((item) => ({
        id: item.id,
        title: item.title,
        responsible: item.responsible_person.name,
        duration: item.duration,
        endDate: item.target_date,
    }));
}

const ChatTasks = () => {
    const { id } = useParams();
    const path = useLocation().pathname;
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [tasks, setTasks] = useState([])

    const getChatTasks = async () => {
        const param = path.includes('messages') ? 'conversation_id_eq' : 'project_space_id_eq';
        try {
            const response = await dispatch(fetchIndividualChatTasks({ baseUrl, token, id, param })).unwrap();
            setTasks(formattedData(response))
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    useEffect(() => {
        getChatTasks()
    }, [])

    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            case 'title':
                return <div className="font-normal text-black max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">{item[columnKey]}</div>;
            case 'responsible':
            case 'endDate':
                return <span className="text-gray-600">{item[columnKey]}</span>;
            case 'duration':
                return (
                    <div className="inline-block px-4 py-2 rounded-sm">
                        {item[columnKey] ? `${item[columnKey]} hours` : '-'}
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