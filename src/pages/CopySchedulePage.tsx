
import React from 'react';
import { useParams } from 'react-router-dom';

export const CopySchedulePage = () => {
  const { id } = useParams();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Copy Schedule</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Copying schedule with ID: {id}</p>
      </div>
    </div>
  );
};
