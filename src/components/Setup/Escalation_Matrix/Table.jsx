/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import CustomTable from '../CustomTable';
import AddEscalationModal from './Modal';

const ActionIcons = ({ row }) => (
  <div className="action-icons flex justify-between gap-5">
    <Switch color="danger" />
    <div>
      <EditOutlinedIcon sx={{ fontSize: "20px" }} />
      <button
        onClick={() => alert(`Deleting: ${row.original.matrixTitle}`)}
        title="Delete"
      >
        <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
      </button>
    </div>
  </div>
);

const defaultData = [

];

const EscalationTableWrapper = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);


  const columns = useMemo(
    () => [
      {
        accessorKey: 'matrixTitle',
        header: 'Matrix Title',
        size: 300,
        cell: ({ row, getValue }) => row.original ? getValue() : null,
      },
      {
        accessorKey: 'triggerEvent',
        header: 'Trigger Event',
        size: 150,
        cell: ({ row, getValue }) => row.original ? getValue() : null,
      },
      {
        accessorKey: 'level1EscalatesTo',
        header: 'Level 1 Escalates To',
        size: 150,
        cell: ({ row, getValue }) => row.original ? getValue() : null,
      },
      {
        accessorKey: 'level2EscalatesTo',
        header: 'Level 2 Escalates To',
        size: 150,
        cell: ({ row, getValue }) => row.original ? getValue() : null,
      },
      {
        accessorKey: 'notificationType',
        header: 'Notification Type',
        size: 150,
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
    []
  );

  return (
    <>
      <CustomTable
        data={defaultData}
        columns={columns}
        title="Matrix"
        buttonText="Add Escalation"
        layout="block"
        onAdd={() => setIsModalOpen(true)} />

      {isModalOpen && (
        <AddEscalationModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}

    </>

  );
};

export default EscalationTableWrapper;
