/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';

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
  const [userData] = useState([
    {
      userName: 'Rajkumar',
      organisation: 'Panchshil Realty',
      emailId: 'rajkumar.sharma@panchshil.com',
      role: 'Project IT Head',
      status: 'Accepted',
    },
    {
      userName: 'Ameya',
      organisation: 'Panchshil Realty',
      emailId: 'ameya1@panchshil.com',
      role: 'Marketing Manager',
      status: 'Pending',
    },
  ]);

  const columns = useMemo(() => [
    {
      accessorKey: 'userName',
      header: 'User Name',
      size: 150,
    },
    {
      accessorKey: 'organisation',
      header: 'Organisation',
      size: 200,
    },
    {
      accessorKey: 'emailId',
      header: 'Email Id',
      size: 250,
    },
    {
      accessorKey: 'role',
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
    <CustomTable
      data={userData}
      columns={columns}
      title="User Table"
      layout="inline"
      buttonText="Add Users"
      showDropdown
    />
  );
};

export default ExternalTable;
