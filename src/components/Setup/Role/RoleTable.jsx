/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import RoleModal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles } from '../../../redux/slices/roleSlice';

const ActionIcons = ({ row, onEdit }) => (
  <div className="action-icons flex justify-between gap-5">
    <Switch color="danger" />
    <div>
      <EditOutlinedIcon
        sx={{ fontSize: "20px" }}
        className="cursor-pointer"
        onClick={() => onEdit(row.original)} // Pass the row data to onEdit
      />
      <button
        onClick={() => alert(`Deleting: ${row.original.roles}`)}
        title="Delete"
      >
        <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
      </button>
    </div>
  </div>
);

const RoleTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); // Store selected role
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'

  const dispatch = useDispatch();
  const { fetchRoles: roles, loading, error } = useSelector((state) => state.fetchRoles);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleEdit = (role) => {
    setSelectedRole(role); // Set the role to edit
    setModalMode('edit'); // Set modal to edit mode
    setIsModalOpen(true); // Open the modal
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'display_name',
        header: 'Roles',
        size: 650,
        cell: ({ row, getValue }) => (row.original ? getValue() : null),
      },
      {
        accessorKey: 'created_at',
        header: 'Created On',
        size: 100,
        cell: ({ getValue }) => {
          const rawDate = getValue();
          const date = new Date(rawDate);
          const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
          return formattedDate;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 60,
        cell: ({ row }) => <ActionIcons row={row} onEdit={handleEdit} />,
        meta: {
          cellClassName: 'actions-cell-content',
        },
      },
    ],
    [roles]
  );

  return (
    <>
      <CustomTable
        data={roles}
        columns={columns}
        title="Roles"
        buttonText="Add Role"
        layout="block"
        onAdd={() => {
          setSelectedRole(null); // Clear selected role for create mode
          setModalMode('create'); // Set modal to create mode
          setIsModalOpen(true);
        }}
      />
      <RoleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole} // Pass selected role to modal
        mode={modalMode} // Pass modal mode
      />
    </>
  );
};

export default RoleTable;