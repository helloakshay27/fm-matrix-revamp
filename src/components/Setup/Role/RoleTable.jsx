/* eslint-disable react/prop-types */
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import RoleModal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRole, editRole, fetchRoles } from '../../../redux/slices/roleSlice';
import toast from 'react-hot-toast';

const ActionIcons = ({ row, onEdit }) => {
  const [isActive, setIsActive] = useState(row.original.active);
  const dispatch = useDispatch();

  const handleToggle = () => {
    const updatedValue = !isActive;
    setIsActive(updatedValue);

    const payload = {
      lock_role: {
        name: row.original.name,
        display_name: row.original.display_name,
        active: updatedValue ? 1 : 0,
      },
    };

    dispatch(editRole({ id: row.original.id, payload }));
    toast.dismiss();
    toast.success(`Status ${updatedValue?"activated":"deactivated"} successfully`,{
      iconTheme: {
        primary: 'red', // This might directly change the color of the success icon
        secondary: 'white', // The circle background
      },
    });
  };

    const handleDeleteClick = async (id) => {
      try {
        await dispatch(deleteRole({id})).unwrap(); // unwrap to handle async correctly
        dispatch(fetchRoles()); // refetch data after successful delete
        toast.dismiss();
        toast.success('Role deleted successfully',{
            iconTheme: {
            primary: 'red', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
          },
        });
  
      } catch (error) {
        console.error('Failed to delete:', error);
        toast.error('Failed to delete Role.',{
            iconTheme: {
            primary: 'red', // This might directly change the color of the success icon
            secondary: 'white', // The circle background
          },
        });
      }
    };

  return (
    <div className="action-icons flex justify-between gap-5">
      <Switch
        color={isActive ? 'success' : 'danger'}
        checked={isActive}
        onChange={handleToggle}
      />
      <div>
        <EditOutlinedIcon
          sx={{ fontSize: '20px' }}
          className="cursor-pointer"
          onClick={() => onEdit(row.original)}
        />
        <button
          onClick={() => handleDeleteClick(row.original.id)}
          title="Delete"
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
        </button>
      </div>
    </div>
  );
};

const RoleTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  const dispatch = useDispatch();
  const { fetchRoles: roles } = useSelector((state) => state.fetchRoles);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleEdit = useCallback((role) => {
    setSelectedRole(role);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    dispatch(fetchRoles()); // refresh roles list
    setIsModalOpen(false);  // close modal
  }, [dispatch]);

  const columns = useMemo(() => [
    {
      accessorKey: 'display_name',
      header: 'Roles',
      size: 650,
      cell: ({ row, getValue }) => {
        const value = row.original ? getValue() : null;
        if (!value) return null;
        const formattedValue = value.replace(/_/g, ' ');
        return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created On',
      size: 100,
      cell: ({ getValue }) => {
        const rawDate = getValue();
        const date = new Date(rawDate);
        return date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
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
  ], [handleEdit]);

  return (
    <>
      <CustomTable
        data={[...roles].reverse()}
        columns={columns}
        title="Roles"
        buttonText="Add Role"
        layout="block"
        onAdd={() => {
          setSelectedRole(null);
          setModalMode('create');
          setIsModalOpen(true);
        }}
      />
      <RoleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        role={selectedRole}
        mode={modalMode}
      />
    </>
  );
};

export default React.memo(RoleTable);
