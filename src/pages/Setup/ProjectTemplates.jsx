import { useDispatch, useSelector } from 'react-redux';
import CustomTable from '../../components/Setup/CustomTable'
import { useEffect, useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { editProject, fetchTemplates } from '../../redux/slices/projectSlice';
import toast from 'react-hot-toast';

const ActionIcons = ({ row, onEditClick }) => {
    const token = localStorage.getItem('token')
    const dispatch = useDispatch();
    const [isActive, setIsActive] = useState(!!row.original.active);

    const deleteTemplate = () => {
        dispatch(editProject({ token, id: row.original.id, payload: { is_template: false } }))
    }

    return (
        <div className="action-icons flex justify-between gap-5">
            <div>
                {/* <EditOutlinedIcon
                    sx={{ fontSize: '20px', cursor: 'pointer' }}
                    onClick={() => onEditClick(row.original)} // Pass user data on edit icon click
                /> */}
                <button
                    onClick={deleteTemplate}
                    title="Delete"
                >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
                </button>
            </div>
        </div>
    )
}

const ProjectTemplates = () => {
    const token = localStorage.getItem('token')
    const dispatch = useDispatch()
    const { fetchTemplates: templates } = useSelector(state => state.fetchTemplates)
    const { success } = useSelector(state => state.editProject)

    useEffect(() => {
        dispatch(fetchTemplates({ token }))
    }, [dispatch])

    useEffect(() => {
        if (success) {
            toast.dismiss()
            toast.success('Template deleted successfully')
            dispatch(fetchTemplates({ token }))
        }
    }, [success])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'title', // still needed for sorting/search
                header: 'Project Template',
                size: 250,
            },
            {
                accessorKey: 'project_owner_name',
                header: 'Owner Name',
                size: 200,
            },
            {
                accessorKey: 'priority',
                header: 'Priority',
                size: 200,
                cell: ({ row, getValue }) => {
                    const value = getValue();
                    const capitalized = value ? value.charAt(0).toUpperCase() + value.slice(1) : '';
                    return <span className="pl-2">{capitalized}</span>;
                },
            },
            {
                accessorKey: 'project_team.project_team_members',
                header: 'Project Members',
                size: 200,
                cell: ({ row }) => {
                    const members = row.original?.project_team?.project_team_members;
                    return <span>{Array.isArray(members) ? members.length : 0}</span>;
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                size: 60,
                cell: ({ row }) => <ActionIcons row={row} />,
                meta: {
                    cellClassName: 'actions-cell-content',
                },
            },
        ],
        []
    );
    return (
        <>
            <CustomTable
                data={templates}
                columns={columns}
                title="Templates"
                layout="inline"
            />
        </>
    )
}

export default ProjectTemplates