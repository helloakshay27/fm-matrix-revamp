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
  const token = localStorage.getItem('token');
  const [isActive, setIsActive] = useState(row.original.active);
  const dispatch = useDispatch();

  // ✅ Sync isActive with updated row.original.active
  useEffect(() => {
    setIsActive(row.original.active);
  }, [row.original.active]);

  const handleToggle = async () => {
    const updatedValue = !isActive;
    setIsActive(updatedValue);

    try {
      const payload = {
        lock_role: {
          name: row.original.name,
          display_name: row.original.display_name,
          active: updatedValue ? 1 : 0,
        },
      };

      await dispatch(editRole({ token, id: row.original.id, payload })).unwrap();
      await dispatch(fetchRoles({ token })).unwrap();

      toast.dismiss();
      toast.success(`Status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
        iconTheme: {
          primary: updatedValue ? 'green' : 'red',
          secondary: 'white',
        },
      });
    } catch (error) {
      setIsActive(!updatedValue); // Revert UI on failure
      toast.dismiss();
      toast.error('Failed to update status', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
      console.error('Toggle failed:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await dispatch(deleteRole({ token, id })).unwrap();
      await dispatch(fetchRoles({ token }));
      toast.dismiss();
      toast.success('Role deleted successfully', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to delete Role.', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
      });
      console.error('Failed to delete:', error);
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
  const token = localStorage.getItem('token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalMode, setModalMode] = useState('create');

  const dispatch = useDispatch();
  const { fetchRoles: roles = [] } = useSelector((state) => state.fetchRoles);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchRoles({ token })).unwrap();
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        toast.error('Error loading roles.');
      }
    };
    fetchData();
  }, [dispatch, token]);

  const handleEdit = useCallback((role) => {
    setSelectedRole(role);
    setModalMode('edit');
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback(async () => {
    try {
      await dispatch(fetchRoles({ token })).unwrap();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to refresh roles.');
      console.error('Refetch failed after modal success:', error);
    }
  }, [dispatch, token]);

  const columns = useMemo(() => [
    {
      accessorKey: 'display_name',
      header: 'Roles',
      size: 650,
      cell: ({ row, getValue }) => {
        try {
          const value = row.original ? getValue() : null;
          return value || '-';
        } catch (error) {
          console.error('Error rendering display_name:', error);
          return '-';
        }
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created On',
      size: 100,
      cell: ({ getValue }) => {
        try {
          const rawDate = getValue();
          if (!rawDate) return '-';
          const date = new Date(rawDate);
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          });
        } catch (error) {
          console.error('Error formatting date:', error);
          return '-';
        }
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
        data={[...(roles || [])].reverse()}
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
