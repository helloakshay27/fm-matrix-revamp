/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import AddInternalUser from './AddInternalUserModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInternalUser, fetchUpdateUser, fetchUsers } from '../../../redux/slices/userSlice';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ActionIcons = ({ row, onEditClick }) => {
  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(!!row.original.active);

  const handleToggle = async () => {
    const updatedValue = !isActive;
    const userData = row.original;

    const payload = {
      user: {
        active: updatedValue ? 1 : 0,
      },
    };

    try {
      await dispatch(fetchUpdateUser({ token, userId: userData.id, updatedData: payload })).unwrap();
      await dispatch(fetchInternalUser({ token })).unwrap();
      toast.dismiss();
      toast.success(`status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
        iconTheme: {
          primary: 'red', // This might directly change the color of the success icon
          secondary: 'white', // The circle background
        },
      });
    } catch (error) {
      console.log(error);
      toast.error('Failed to update status', {
        iconTheme: {
          primary: 'red', // This might directly change the color of the error icon
          secondary: 'white', // The circle background
        },
      });
    }
  };


  return (
    <div className="action-icons flex justify-start gap-5">
      <Switch color={`${isActive ? 'success' : 'danger'}`}
        checked={isActive}
        onChange={handleToggle} />
      <div>
        <EditOutlinedIcon
          sx={{ fontSize: '20px', cursor: 'pointer' }}
          onClick={() => onEditClick(row.original)} // Pass user data on edit icon click
        />
        <button
          onClick={() => alert(`Deleting: ${row.original.name}`)}
          title="Delete"
        >
          {/* <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} /> */}
        </button>
      </div>
    </div>
  )
}


const InternalTable = () => {
  const token = localStorage.getItem('token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();
  const { fetchInternalUser: internalUser } = useSelector(state => state.fetchInternalUser);
  const { fetchUsers: users } = useSelector(state => state.fetchUsers);


  useEffect(() => {
    dispatch(fetchInternalUser({ token }));
    dispatch(fetchUsers({ token }));
  }, [dispatch]);

  const handleAddClick = () => {
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
    dispatch(fetchInternalUser({ token })); // refresh roles list
    setIsModalOpen(false);  // close modal
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstname', // still needed for sorting/search
        header: 'User Name',
        size: 250,
        cell: ({ row }) => {
          const { firstname, lastname } = row.original;
          return (
            <Link to={`/setup/internal-users/details/${row.original.id}`}> <span className="cursor-pointer">
              {firstname} {lastname}
            </span>
            </Link>
          );
        },
      },
      {
        accessorKey: 'mobile',
        header: 'Mobile No.',
        size: 150,

      },
      {
        accessorKey: 'email',
        header: 'Email Id',
        size: 200,
        cell: ({ row, getValue }) => {
          const value = row.original ? getValue() : null;
          return <span className="pl-2">{value}</span>;
        }
      },
      {
        accessorKey: 'user_company_name',
        header: 'Company',
        size: 200,
        cell: ({ row, getValue }) => {
          const value = row.original ? getValue() : null;
          return <span className="pl-2">{value}</span>;
        }
      },
      {
        accessorKey: 'lock_role.display_name',
        header: 'Role',
        size: 150,
        cell: ({ row, getValue }) => {
          const value = row.original ? getValue() : null;
          if (!value) return null;
          const formattedValue = value.replace(/_/g, ' ');
          return <span className="pl-2">{formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1)}</span>;
        },
      },
      {
        accessorKey: 'report_to_id',
        header: 'Reports to',
        size: 150,
        cell: ({ row, getValue }) => {
          let value = users.find((user) => user.id === getValue());
          return <span className="pl-2">{value?.firstname} {value?.lastname}</span>;
        }
      },
      {
        accessorKey: 'associatedProjects',
        header: 'Associated Projects',
        size: 100,
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 60,
        cell: ({ row }) => <ActionIcons row={row} onEditClick={handleEditClick} />,
      },
    ],
    [users, internalUser]
  );

  return (
    <>
      <CustomTable
        data={internalUser}
        columns={columns}
        title="Active Users"
        buttonText="Add User"
        layout="inline"
        onAdd={handleAddClick}
        showDropdown
      />
      <AddInternalUser
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditMode={isEditMode}
        selectedUser={selectedUser}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default InternalTable;
