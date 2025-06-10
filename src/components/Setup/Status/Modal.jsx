import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const Modal = ({ setOpenModal, id }) => {
  const [type, setType] = useState('');
  const [color, setColor] = useState('#c72030');
  const [warningOpen, setWarningOpen] = useState(false);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    color: '#c72030',
  });

  useEffect(() => {
    if (!id) return;

    axios
      .get(`https://api-tasks.lockated.com/project_statuses/${id}.json`, {
        headers: {
          Authorization: 'Bearer bTcVnWgQrF6QCdNbMiPXzCZNAqsN9qoEfFWdFQ1Auk4',
        },
      })
      .then((response) => {
        const data = response.data;
        // Set form fields from fetched data
        setFormData({
          type: data.status || '',
          color: data.color_code || '#c72030',
        });
      })
      .catch((error) => {
        console.error('API fetch error:', error);
      });
  }, [id]);

  const handleSave = () => {
    const payload = {
      project_status: {
        title: formData.type,
        active: true,
        color_code: formData.color,
        // created_by_id: 1, // Update this if needed
      },
    };

    const url = id
      ? `https://api-tasks.lockated.com/project_statuses/${id}.json`
      : `https://api-tasks.lockated.com/project_statuses.json`;

    const method = id ? axios.put : axios.post;

    method(url, payload, {
      headers: {
        Authorization: 'Bearer bTcVnWgQrF6QCdNbMiPXzCZNAqsN9qoEfFWdFQ1Auk4',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log('Successfully saved:', response.data);
        setOpenModal(false);
      })
      .catch((error) => {
        console.error('Save error:', error);
      });
  };


  return (
    <div className="w-[560px] h-[250px] bg-white absolute top-[40%] left-[45%] translate-x-[-50%] translate-y-[-50%] border-[0.5px] border-[#C0C0C0] flex flex-col shadow-md z-50">
      <div className="h-full flex flex-col gap-5 p-4">
        <div className="flex justify-end">
          <CloseIcon className="cursor-pointer" onClick={() => setOpenModal(false)} />
        </div>

        <input
          value={formData.type}
          onChange={(e) => {
            setFormData({ ...formData, type: e.target.value });
          }}
          placeholder="Enter Status Name"
          className={`border-[0.5px]  'border-[#C72030]' : 'border-[#C0C0C0]'
            } p-2 text-sm`}
        />


        <div className="border-[0.5px] border-[#C0C0C0] p-2">
          <input
            type="color"
            value={formData.color}
            onChange={(e) => {
            setFormData({ ...formData, color: e.target.value });
          }}
            className="w-1/3 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-center gap-3 mt-2 bg-[#D5DBDB] items-center h-full">
        <button
          className="bg-[#C72030] h-[28px] w-[100px] cursor-pointer text-white px-4"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="border-2 border-[#C72030] h-[28px] w-[100px] cursor-pointer text-[#C72030] px-4"
          onClick={() => setOpenModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;
