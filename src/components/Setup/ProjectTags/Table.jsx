import React, { useEffect, useMemo, useState, useCallback } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Switch from '@mui/joy/Switch';
import { useDispatch, useSelector } from 'react-redux';
import Modal from './Modal';
import CustomTable from '../CustomTable';
import { fetchTags, updateTag, deleteTag } from '../../../redux/slices/tagsSlice';

const ActionIcons = ({ row, onEdit }) => {
  const [isActive, setIsActive] = useState(row.original.active);
  const dispatch = useDispatch();

  const handleToggle = async () => {
    const updatedValue = !isActive;
    setIsActive(updatedValue);

    const payload = {
      tag: {
        name: row.original.name,
        active: updatedValue ? 1 : 0,
      },
    };

    try {
      await dispatch(updateTag({ id: row.original.id, data: payload })).unwrap();
      dispatch(fetchTags());
    } catch (error) {
      console.error('Failed to update toggle:', error);
    }
  };

  const handleDeleteClick = async () => {
    try {
      await dispatch(deleteTag(row.original.id)).unwrap();
      dispatch(fetchTags());
    } catch (error) {
      console.error('Failed to delete:', error);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const dispatch = useDispatch();
  const { fetchTags: tags, loading, error } = useSelector((state) => state.fetchTags); // Adjust to your tag slice




  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  console.log('Tags data:', tags);


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
      await dispatch(updateTag({ id: row.original.id, data: payload })).unwrap();
      dispatch(fetchTags());
    } catch (error) {
      console.error('Failed to update toggle:', error);
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
          return rawDate ? formatToDDMMYYYY(rawDate) : null;
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
                color="danger"
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


  const reversedTags = useMemo(() => {
    return tags ? [...tags].reverse() : [];
  }, [tags]);



  return (
    <>
      <CustomTable
        data={reversedTags} // Ensure tags is defined
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