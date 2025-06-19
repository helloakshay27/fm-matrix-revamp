import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import CustomTable from '../CustomTable';
import { fetchTags, updateTag, deleteTag } from '../../../redux/slices/tagsSlice';
import toast from 'react-hot-toast';

const ActionIcons = ({ row, onEdit }) => {
  const token = localStorage.getItem('token');
  const [isActive, setIsActive] = useState(row.original.active);
  const dispatch = useDispatch();



  const handleDeleteClick = async () => {
    try {
      await dispatch(deleteTag({ token, id: row.original.id })).unwrap();
      toast.dismiss();
      toast.success('Tag deleted successfully', {
        iconTheme: {
          primary: 'red', // This might directly change the color of the success icon
          secondary: 'white', // The circle background
        },
      });
      dispatch(fetchTags({ token }));
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete tag.', {
        iconTheme: {
          primary: 'red', // This might directly change the color of the error icon
          secondary: 'white', // The circle background
        },
      })
    }

  };

  return (
    <div className="action-icons flex justify-between gap-5">
      <EditOutlinedIcon
        sx={{ fontSize: '20px' }}
        className="cursor-pointer"
        onClick={() => onEdit(row.original)}
      />
      <button title="Delete">
        <DeleteOutlineOutlinedIcon sx={{ fontSize: '20px' }} onClick={handleDeleteClick} />
      </button>
    </div>
  );
};


const TagsTable = () => {
  const token = localStorage.getItem('token');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const dispatch = useDispatch();
  const { fetchTags: tags, loading, error } = useSelector((state) => state.fetchTags); // Adjust to your tag slice

  useEffect(() => {
    dispatch(fetchTags({ token }));
  }, [dispatch]);

  const handleEdit = useCallback((tag) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
  }, []);

  const formatToDDMMYYYY = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleToggle = async (row) => {
    const updatedValue = !row.original.active;
    const payload = {
      active: updatedValue,
    };

    try {
      await dispatch(updateTag({ token, id: row.original.id, data: payload })).unwrap();
      toast.dismiss();
      toast.success(`status ${updatedValue ? 'activated' : 'deactivated'} successfully`, {
        iconTheme: {
          primary: 'red', // This might directly change the color of the success icon
          secondary: 'white', // The circle background
        },
      });
      dispatch(fetchTags({ token }));
    } catch (error) {
      console.error('Failed to update toggle:', error, {
        iconTheme: {
          primary: 'red', // This might directly change the color of the error icon
          secondary: 'white', // The circle background
        },
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Tag Name',
        size: 250,
        cell: ({ row, getValue }) => (row.original ? getValue() : null),
      },
      {
        accessorKey: 'tag_type',
        header: 'Tag Type',
        size: 150,
        cell: ({ row, getValue }) => (row.original ? getValue() : null),
      },
      {
        accessorKey: 'created_at',
        header: 'Created On',
        size: 100,
        cell: ({ getValue }) => {
          const rawDate = getValue();
          return rawDate ? <span className="px-2">{formatToDDMMYYYY(rawDate)}</span> : null;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: ({ row }) => {
          const isActive = row.original.active;
          return (
            <div className="flex gap-2 items-center">
              <span>Inactive</span>
              <Switch
                color={`${isActive ? 'success' : 'danger'}`}
                checked={isActive}
                onChange={() => handleToggle(row)}
              />
              <span>Active</span>
            </div>
          );
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
    ],
    [handleEdit]
  );

  return (
    <>
      <CustomTable
        data={tags} // Ensure tags is defined
        columns={columns}
        title="Tags"
        buttonText="Add Tag"
        layout="inline"
        onAdd={() => {
          setSelectedTag(null);
          setIsModalOpen(true);
        }}
      />
      <Modal
        open={isModalOpen}
        setOpenModal={setIsModalOpen}
        editData={selectedTag}
      />
    </>
  );
};

export default React.memo(TagsTable);