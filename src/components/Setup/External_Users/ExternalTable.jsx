/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import AddExternalUserModal from './AddExternalUserModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExternalUser } from '../../../redux/slices/userSlice';

const ActionIcons = ({ row }) => (
  <div className="flex gap-3 items-center">
    <Switch color="danger" defaultChecked={row.original.status === 'Accepted'} />
    <EditOutlinedIcon sx={{ fontSize: 20, cursor: 'pointer' }} />
    <DeleteOutlineOutlinedIcon
      sx={{ fontSize: 20, cursor: 'pointer' }}
      onClick={() => alert(`Delete user: ${row.original.userName}`)}
    />
  </div>
);

const ExternalTable = () => {

  const dispatch = useDispatch();
  const { fetchExternalUser: externalUsers } = useSelector(state => state.fetchExternalUser)

  useEffect(() => {
    dispatch(fetchExternalUser())
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData] = useState(externalUsers);

  const columns = useMemo(() => [
    {
      accessorKey: 'firstname',
      header: 'User Name',
      size: 150,
    },
    {
      accessorKey: 'organization_id',
      header: 'Organisation',
      size: 200,
    },
    {
      accessorKey: 'email',
      header: 'Email Id',
      size: 250,
    },
    {
      accessorKey: 'lock_role.name',
      header: 'Role',
      size: 180,
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
      cell: ({ row }) => <ActionIcons row={row} />,
    },
  ], []);

  return (
    <div>
      <CustomTable
        data={externalUsers}
        columns={columns}
        title="User Table"
        layout="inline"
        buttonText="Add Users"
        showDropdown
        onAdd={() => { setIsModalOpen(true) }}
      />
      <AddExternalUserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ExternalTable;
