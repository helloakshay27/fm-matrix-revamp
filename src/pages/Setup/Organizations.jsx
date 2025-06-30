import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../components/Setup/CustomTable";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import toast from "react-hot-toast";
import OrganizationModal from "../../components/Setup/Organizations/OrganizationModal";
import {
    fetchOrganizations,
    editOrganization
} from "../../redux/slices/organizationSlice";

const ActionIcons = ({ row, onEdit }) => (
    <div className="flex justify-center gap-5">
        <EditOutlinedIcon
            sx={{ fontSize: 20 }}
            className="cursor-pointer"
            onClick={() => onEdit(row.original)}
        />
        <button title="Delete">
            <DeleteOutlineOutlinedIcon sx={{ fontSize: 20 }} />
        </button>
    </div>
);

const Organizations = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const { fetchOrganizations: organizations } = useSelector(state => state.fetchOrganizations);
    const { success: statusSuccess } = useSelector(state => state.editOrganization);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        dispatch(fetchOrganizations({ token }));
    }, [dispatch, token]);

    useEffect(() => {
        if (statusSuccess) {
            toast.dismiss();
            toast.success("Organization updated successfully", {
                iconTheme: { primary: "red", secondary: "white" }
            });
        }
    }, [statusSuccess]);

    const handleEditClick = useCallback((data) => {
        setEditData(data);
        setIsModalOpen(true);
    }, []);

    const handleToggle = useCallback((row) => {
        const updatedStatus = !row.original.active;
        const payload = new FormData();
        payload.append("organization[active]", updatedStatus);

        dispatch(editOrganization({ token, payload, id: row.original.id }));
    }, [dispatch, token]);

    const formatToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const columns = useMemo(() => [
        {
            accessorKey: "name",
            header: "Organization Name",
            size: 250,
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: "domain",
            header: "Domain",
            size: 150,
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: "attachment",
            header: "Logo",
            size: 150,
            cell: ({ row }) => {
                const url = row.original?.attachfile?.document_url;
                return url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex justify-center">
                        <img src={url} alt="Logo" className="w-14 h-14 object-cover rounded border hover:scale-110 transition-transform" />
                    </a>
                ) : <div className="text-gray-400 text-sm text-center">No File</div>;
            },
        },
        {
            accessorKey: "created_at",
            header: "Created On",
            size: 100,
            cell: ({ getValue }) => {
                const date = getValue();
                return date && <div className="flex justify-center">{formatToDDMMYYYY(date)}</div>;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            size: 150,
            cell: ({ row }) => {
                const isActive = row.original.active;
                return (
                    <div className="flex justify-center items-center gap-2">
                        <span className="text-sm">Inactive</span>
                        <Switch
                            color={isActive ? "success" : "danger"}
                            checked={isActive}
                            onChange={() => handleToggle(row)}
                        />
                        <span className="text-sm">Active</span>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            size: 60,
            cell: ({ row }) => <ActionIcons row={row} onEdit={handleEditClick} />,
        },
    ], [handleEditClick, handleToggle]);

    return (
        <div className="flex flex-col gap-2 text-[14px]">
            <CustomTable
                data={organizations}
                columns={columns}
                title="Organizations"
                buttonText="Add Organization"
                layout="inline"
                onAdd={() => {
                    setEditData(null);
                    setIsModalOpen(true);
                }}
            />
            <OrganizationModal
                open={isModalOpen}
                setOpenModal={setIsModalOpen}
                editData={editData}
            />
        </div>
    );
};

export default Organizations;
