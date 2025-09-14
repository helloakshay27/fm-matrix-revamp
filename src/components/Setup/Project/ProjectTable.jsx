/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CustomTable from '../CustomTable';
import { useNavigate } from 'react-router-dom';

const ActionIcons = ({ row }) => (
  <div className="flex gap-3 items-center">
    <EditOutlinedIcon
      sx={{ fontSize: 20, cursor: 'pointer' }}
      onClick={() => alert(`Edit: ${row.original.teamName}`)}
    />
    <DeleteOutlineOutlinedIcon
      sx={{ fontSize: 20, cursor: 'pointer' }}
      onClick={() => alert(`Delete: ${row.original.teamName}`)}
    />
  </div>
);

const ProjectTable = () => {

  const navigate = useNavigate()

  const handleRowClick = (rowData) => {
    sessionStorage.setItem('ProjectUser', JSON.stringify(rowData)); 
    navigate('/setup/project-teams/project-details', { state: rowData });
  };

  const [projectData] = useState([
    {
      teamName: 'Customer app dev',
      teamLead: 'Mahendra Lungare',
      associatedProjects: '',
      teamMembers: 7,
    },
  ]);

  const columns = useMemo(() => [
    {
      accessorKey: 'teamName',
      header: 'Team Name',
      size: 200,
      cell: ({ row, getValue }) => (
        <span onClick={() => handleRowClick(row.original)} className="cursor-pointer ">
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'teamLead',
      header: 'Team Lead',
      size: 200,
      cell: ({ row, getValue }) => (
        <span onClick={() => handleRowClick(row.original)} className="cursor-pointer ">
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'associatedProjects',
      header: 'Associated Projects',
      size: 250,
      cell: ({ row, getValue }) => (
        <span onClick={() => handleRowClick(row.original)} className="cursor-pointer ">
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'teamMembers',
      header: () => (
        <>
          Team Members <em className="text-xs">(TL + Members)</em>
        </>
      ),
      size: 150,
      cell: ({ row, getValue }) => (
        <span onClick={() => handleRowClick(row.original)} className="cursor-pointer ">
          {getValue()}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 100,
      cell: ({ row }) => <ActionIcons row={row} />,
    },
  ], []);

  return (
    <CustomTable
      data={projectData}
      columns={columns}
      title="Active Users"
      layout="inline"
      buttonText="Add Team"
      showDropdown
    />
  );
};

export default ProjectTable;
