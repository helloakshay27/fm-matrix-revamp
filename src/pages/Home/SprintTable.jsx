import { useState, useMemo } from 'react';
import StatusBadge from '../../components/Home/Projects/statusBadge';
import CustomTable from '../../components/Setup/CustomTable';
import AddSprintModal from '../../components/Home/Sprints/AddSprintModal';


const globalPriorityOptions = ['None', 'Low', 'Medium', 'High', 'Urgent'];
const globalStatusOptions = ['Open', 'In Progress', 'Completed', 'On Hold'];


const defaultData = [

    {
        "Id": "SP-001",
        "Sprint Title": "Sprint 1",
        "Status": "Open",
        "Sprint Owner": "Sehail Ansaro",
        "Start Date": "15/01/2025",
        "End Date": "22/01/2025",
        "Duration": "07d:16h:00m:00s",
        "Priority": "High",
        "No Of Projects": "Projects Unassigned"
    },
    {
        "Id": "SP-002",
        "Sprint Title": "Sprint 2 - Planning",
        "Status": "In Progress",
        "Sprint Owner": "Jane Doe",
        "Start Date": "23/01/2025",
        "End Date": "30/01/2025",
        "Duration": "07d:00h:00m:00s",
        "Priority": "High",
        "No Of Projects": "3 Projects Assigned"
    },
    {
        "Id": "SP-003",
        "Sprint Title": "Sprint 3 - Development",
        "Status": "Open",
        "Sprint Owner": "John Smith",
        "Start Date": "01/02/2025",
        "End Date": "15/02/2025",
        "Duration": "14d:00h:00m:00s",
        "Priority": "Medium",
        "No Of Projects": "5 Projects Assigned"
    },
    {
        "Id": "SP-004",
        "Sprint Title": "Sprint 4 - Testing",
        "Status": "Closed",
        "Sprint Owner": "Alice Brown",
        "Start Date": "16/02/2025",
        "End Date": "23/02/2025",
        "Duration": "07d:00h:00m:00s",
        "Priority": "High",
        "No Of Projects": "2 Projects Assigned"
    },
    {
        "Id": "SP-005",
        "Sprint Title": "Sprint 5 - Deployment",
        "Status": "Open",
        "Sprint Owner": "Bob Green",
        "Start Date": "24/02/2025",
        "End Date": "28/02/2025",
        "Duration": "04d:00h:00m:00s",
        "Priority": "Critical",
        "No Of Projects": "1 Project Assigned"
    }

];

const SprintTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [data, setData] = useState(defaultData);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'Id',
                header: 'Id',
                size: 110,

            },
            {
                accessorKey: 'Sprint Title',
                header: 'Sprint Title',
                size: 250,
            },
            {
                accessorKey: 'Status',
                header: 'Status',
                size: 150,
                cell: ({ row, getValue, column, table }) => (
                    <StatusBadge status={getValue()} statusOptions={globalStatusOptions} />
                ),
            },
            {
                accessorKey: 'Sprint Owner',
                header: 'Sprint Owner',
                size: 150,
            },
            {
                accessorKey: 'Start Date',
                header: 'Start Date',
                size: 180,
            },
            {
                accessorKey: 'End Date',
                header: 'End Date',
                size: 130,
            },
            {
                accessorKey: 'Duration',
                header: 'Duration',
                size: 110,
            },
            {
                accessorKey: 'Priority',
                header: 'Priority',
                size: 100,
                cell: ({ row, getValue, column, table }) => (
                    <StatusBadge status={getValue()} statusOptions={globalPriorityOptions} />
                ),
            },
            {
                accessorKey: 'No Of Projects',
                header: 'No Of Projects',
                size: 120,
            },

        ],
        [data]
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
            {
                isModalOpen && <AddSprintModal
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                />
            }
        </>
    );
};

export default SprintTable;