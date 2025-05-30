/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import AddInternalUser from './AddInternalUserModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInternalUser, fetchUpdateUser } from '../../../redux/slices/userSlice';

const ActionIcons = ({ row, onEditClick }) => {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(!!row.original.active);

  const handleToggle = () => {
    const updatedValue = !isActive;
    setIsActive(updatedValue);

    const userData = row.original;


    const payload = {
      user: {
        active: updatedValue ? 1 : 0,
      },
    };

    dispatch(fetchUpdateUser({ userId: userData.id, updatedData: payload }))
      .then(() => {
        console.log('User active status updated.');
      })
      .catch((error) => {
        console.error('Failed to update status:', error);
      });
  };

  return (
    <div className="action-icons flex justify-between gap-5">
      <Switch color="danger" checked={isActive}
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
          <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
        </button>
      </div>
    </div>
  )
}


const InternalTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const dispatch = useDispatch();
  const { fetchInternalUser: internalUser } = useSelector(state => state.fetchInternalUser);

  useEffect(() => {
    dispatch(fetchInternalUser());
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
    dispatch(fetchInternalUser()); // refresh roles list
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
            <span className="cursor-pointer">
              {firstname} {lastname}
            </span>
          );
        },
      },
      {
        accessorKey: 'email',
        header: 'Email Id',
        size: 200,
      },
      {
        accessorKey: 'lock_role.name',
        header: 'Role',
        size: 150,
      },
      {
        accessorKey: 'reportingManager',
        header: 'Reports to',
        size: 150,
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
    []
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
