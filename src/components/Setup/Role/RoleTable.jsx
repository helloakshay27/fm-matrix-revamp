/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomModal from '../CustomModel';
import CustomTable from '../CustomTable';

const ActionIcons = ({ row, }) => (
  <div className="action-icons flex justify-between gap-5">
    <Switch color="danger" />
    <div>
      <EditOutlinedIcon sx={{ fontSize: "20px" }} />
      <button
        onClick={() => alert(`Deleting: ${row.original.roles}`)}
        title="Delete"
      >
        <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
      </button>
    </div>
  </div>
);

const defaultData = [
  { roles: "Project Manager", createdOn: "01 Jan 2025" },
  { roles: "Front End Dev", createdOn: "01 Jan 2025" },
  { roles: "Back End Dev", createdOn: "01 Jan 2025" },
  { roles: "Project SPOC", createdOn: "01 Jan 2025" },
];

const RoleTable = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);


  const columns = useMemo(
    () => [
      {
        accessorKey: 'roles',
        header: 'Roles',
        size: 650,
        cell: ({ row, getValue }) => row.original ? getValue() : null,
      },
      {
        accessorKey: 'createdOn',
        header: 'Created On',
        size: 100,
        cell: ({ row, getValue }) => row.original ? getValue() : null,
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 60,
        cell: ({ row }) => <ActionIcons row={row} />,
        meta: {
          cellClassName: 'actions-cell-content',
        },
      },
    ],

  );

  return (
    <><>
      <CustomTable
        data={defaultData}
        columns={columns}
        title="Roles"
        buttonText="Add Role"
        layout="block"
        onAdd={() => setIsModalOpen(true)} />
    </><CustomModal open={isModalOpen} onClose={() => setIsModalOpen(false)} placeholder="Project SPOC" /></>
  )

};

export default RoleTable;
