
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-[#f6f4ee]">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
