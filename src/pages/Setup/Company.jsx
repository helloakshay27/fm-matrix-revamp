import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import toast from "react-hot-toast";
import CustomTable from "../../components/Setup/CustomTable";
import CompanyModal from "../../components/Setup/Company/CompanyModal";
import { editCompany, fetchCompany } from "../../redux/slices/companySlice";

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

const Company = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem("token");

    const { fetchCompany: companies } = useSelector((state) => state.fetchCompany);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        dispatch(fetchCompany({ token }));
    }, [dispatch, token]);

    const handleEditClick = useCallback((data) => {
        setEditData(data);
        setIsModalOpen(true);
    }, []);

    const handleToggle = useCallback((row) => {
        const updatedStatus = !row.original.active;
        const payload = {
            active: updatedStatus
        };

        dispatch(editCompany({ token, payload, id: row.original.id }));
    }, [dispatch, token]);

    const formatToDDMMYYYY = (dateString) => {
        const date = new Date(dateString);
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    };

    const columns = useMemo(() => [
        {
            accessorKey: "name",
            header: "Company Name",
            size: 250,
            cell: ({ getValue }) => getValue(),
        },
        {
            accessorKey: "organization_name",
            header: "Organization Name",
            size: 250,
            cell: ({ getValue }) => getValue(),
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
                data={companies}
                columns={columns}
                title="Companies"
                buttonText="Add Company"
                layout="inline"
                onAdd={() => {
                    setEditData(null);
                    setIsModalOpen(true);
                }}
            />
            <CompanyModal
                open={isModalOpen}
                setOpenModal={setIsModalOpen}
                editData={editData}
            />
        </div>
    )
}

export default Company