/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import CustomModal from '../CustomModel';
import { useNavigate } from 'react-router-dom';
import AddInternalUser from './AddInternalUserModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInternalUser } from '../../../redux/slices/userSlice';

const ActionIcons = ({ row }) => (
  <div className="action-icons flex justify-between gap-5">
    <Switch color="danger" />
    <div>
      <EditOutlinedIcon sx={{ fontSize: '20px' }} />
      <button
        onClick={() => alert(`Deleting: ${row.original.name}`)}
        title="Delete"
      >
        <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} />
      </button>
    </div>
  </div>
);

const defaultData = [
  {
    name: 'Sohail',
    email: 'sohail.a@lockated.com',
    role: 'Product Manager',
    reportingManager: 'Chetan Bafna',
    associatedProjects: 3,
  },
  {
    name: 'Shubh',
    email: 'shubh.j@lockated.com',
    role: 'Product Manager',
    reportingManager: 'Chetan Bafna',
    associatedProjects: 3,
  },
  {
    name: 'Kshitij',
    email: 'kshitij.r@lockated.com',
    role: 'Project SPOC',
    reportingManager: 'Chetan Bafna',
    associatedProjects: 3,
  },
  {
    name: 'Bilal',
    email: 'bilal.s@lockated.com',
    role: 'Front End Dev',
    reportingManager: 'Mahendra Lungare',
    associatedProjects: 5,
  },
  {
    name: 'Komal',
    email: 'komal.s@lockated.com',
    role: 'QA',
    reportingManager: 'Sadanand G',
    associatedProjects: 2,
  },
  {
    name: 'Abhidnya',
    email: 'abhidnya.t@lockated.com',
    role: 'Designer',
    reportingManager: 'Kshitij Rasal',
    associatedProjects: 1,
  },
];

const InternalTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { fetchInternalUser: internalUser } = useSelector(state => state.fetchInternalUser);

  console.log(internalUser)

  useEffect(() => {
    dispatch(fetchInternalUser())
  }, [])

  const handleRowClick = (rowData) => {
    sessionStorage.setItem('selectedUser', JSON.stringify(rowData));
    navigate('/setup/internal-users/details', { state: rowData });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstname',
        header: 'User Name',
        size: 250,
        cell: ({ row, getValue }) => (
          <span onClick={() => handleRowClick(row.original)} className="cursor-pointer ">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email Id',
        size: 200,
        cell: ({ row, getValue }) => (
          <span onClick={() => handleRowClick(row.original)} className="cursor-pointer">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'lock_role.name',
        header: 'Role',
        size: 150,
        cell: ({ row, getValue }) => (
          <span onClick={() => handleRowClick(row.original)} className="cursor-pointer">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'reportingManager',
        header: 'Reports to',
        size: 150,
        cell: ({ row, getValue }) => (
          <span onClick={() => handleRowClick(row.original)} className="cursor-pointer">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'associatedProjects',
        header: 'Associated Projects',
        size: 100,
        cell: ({ row, getValue }) => (
          <span onClick={() => handleRowClick(row.original)} className="cursor-pointer">
            {getValue()}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 60,
        cell: ({ row }) => <ActionIcons row={row} />,
      },
    ],
  );


  return (
    <>
      <CustomTable
        data={internalUser}
        columns={columns}
        title="Active Users"
        buttonText="Add User"
        layout="inline"
        onAdd={() => setIsModalOpen(true)}
        showDropdown
      />
      <AddInternalUser
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default InternalTable;