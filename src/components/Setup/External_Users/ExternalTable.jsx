/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import AddExternalUserModal from './AddExternalUserModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExternalUser, fetchUpdateUser } from '../../../redux/slices/userSlice';
import toast from 'react-hot-toast';

const ActionIcons = ({ row, onEdit }) => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(!!row.original.active);

  const handleToggle = async () => {
    const updatedValue = !isActive;
    setIsActive(updatedValue);

    const userData = row.original;

    const payload = {
      user: {
        active: updatedValue ? 1 : 0,
      },
    };

    try {
      await dispatch(fetchUpdateUser({ token, userId: userData.id, updatedData: payload })).unwrap();
      toast.dismiss();
      toast.success(`Status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
        iconTheme: {
          primary: updatedValue ? 'green' : 'red',
          secondary: 'white',
        }
      });
    } catch (error) {
      toast.dismiss();
      toast.error(error?.message || 'Failed to update status', {
        iconTheme: {
          primary: 'red',
          secondary: 'white',
        },
        style: {
          background: '#f8d7da',
          color: '#721c24',
        },
      });
    }
  };

  return (
    <div className="flex gap-3 items-center">
      <Switch
        color={`${isActive ? 'success' : 'danger'}`}
        checked={isActive}
        onChange={handleToggle}
      />
      <EditOutlinedIcon
        sx={{ fontSize: 20, cursor: 'pointer' }}
        onClick={() => onEdit(row.original)}
      />
      {/* <DeleteOutlineOutlinedIcon
        sx={{ fontSize: 20, cursor: 'pointer' }}
        onClick={() => alert(`Delete user: ${row.original.userName}`)}
      /> */}
    </div>
  );
};


const ExternalTable = () => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const { fetchExternalUser: externalUsers } = useSelector(state => state.fetchExternalUser);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(fetchExternalUser({ token })).unwrap();
      } catch (error) {
        console.error("Error fetching external users:", error);
        toast.error("Failed to load external users");
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [dispatch, token]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAddUser = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (user) => {
    setIsEditMode(true);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSuccess = useCallback(() => {
    dispatch(fetchExternalUser({ token })); // refresh roles list
    setIsModalOpen(false);  // close modal
  }, [dispatch]);

  const columns = useMemo(() => [
    {
      accessorKey: 'firstname',
      header: 'User Name',
      size: 150,
      cell: ({ row }) => {
        const { firstname, lastname } = row.original;
        return `${firstname} ${lastname}`;
      },
    },
    {
      accessorKey: 'organization_name',
      header: 'Organisation',
      size: 200,
    },
    {
      accessorKey: 'user_company_name',
      header: 'Company',
      size: 200,
      cell: ({ getValue }) => (
        <div className="px-4"> {/* px-4 = horizontal padding */}
          {getValue()}
        </div>
      ),
    },
    {

      accessorKey: 'mobile',
      header: 'Mobile No.',
      size: 200,
      cell: ({ getValue }) => <span className="pl-2">{getValue()}</span>,
    },
    {
      accessorKey: 'email',
      header: 'Email Id',
      size: 250,
      cell: ({ getValue }) => <span className="pl-2">{getValue()}</span>,
    },
    {
      accessorKey: 'lock_role.display_name',
      header: 'Role',
      size: 180,
      cell: ({ row, getValue }) => {
        const value = row.original ? getValue() : null;
        if (!value) return null;
        const formattedValue = value.replace(/_/g, ' ');
        return formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
      },
    },
    {
      accessorKey: 'status',
      header: 'Invitation Status',
      size: 150,
      cell: ({ getValue }) => {
        const value = getValue();
        const color = value === 'Accepted' ? 'green' : 'red';
        return (
          <span style={{ color, fontWeight: 500 }}>
            {value}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 120,
      cell: ({ row }) => (
        <ActionIcons
          row={row}
          onEdit={handleEditClick}
        />
      ),
    },
  ], [externalUsers]);

  return (
    <div>
      <CustomTable
        data={externalUsers || []}
        columns={columns}
        title="User Table"
        layout="inline"
        buttonText="Add Users"
        showDropdown
        onAdd={handleAddUser}
      />
      {
        isModalOpen && (
          <AddExternalUserModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            isEditMode={isEditMode}
            initialData={selectedUser}
            onSuccess={handleSuccess}
          />
        )
      }

    </div>
  );
};

export default ExternalTable;
