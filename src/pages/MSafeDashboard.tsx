import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, FileText, Download, Upload, Filter, Copy, Eye, Trash2, Plus, Search, Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { TicketPagination } from '@/components/TicketPagination';
import { MSafeFilterDialog } from '@/components/MSafeFilterDialog';

export const MSafeDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', active: true },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Editor', active: false },
    { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'Viewer', active: true },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const location = useLocation();

  const handleFilterOpen = () => {
    setIsFilterOpen(true);
  };

  const handleFilterClose = () => {
    setIsFilterOpen(false);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">M Safe</h1>
      
      {/* Functionality Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: '#F6F4EE' }}
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5" style={{ color: '#C72030' }} />
          </div>
          <div>
            <div className="text-2xl font-bold text-black">
              {users.length.toString().padStart(2, '0')}
            </div>
            <div className="text-sm font-medium text-black">
              Total Users
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: '#F6F4EE' }}
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5" style={{ color: '#C72030' }} />
          </div>
          <div>
            <div className="text-2xl font-bold text-black">
              {users.filter(user => user.active).length.toString().padStart(2, '0')}
            </div>
            <div className="text-sm font-medium text-black">
              Active Users
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: '#F6F4EE' }}
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5" style={{ color: '#C72030' }} />
          </div>
          <div>
            <div className="text-2xl font-bold text-black">
              00
            </div>
            <div className="text-sm font-medium text-black">
              Pending Approvals
            </div>
          </div>
        </div>

        <div 
          className="p-4 rounded-lg flex items-center gap-3"
          style={{ backgroundColor: '#F6F4EE' }}
        >
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5" style={{ color: '#C72030' }} />
          </div>
          <div>
            <div className="text-2xl font-bold text-black">
              05
            </div>
            <div className="text-sm font-medium text-black">
              System Settings
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button><Plus className="w-4 h-4 mr-2" /> Add User</Button>
          <Button variant="outline" onClick={handleFilterOpen}><Filter className="w-4 h-4 mr-2" /> Filter</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
          <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Import</Button>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedUsers.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.active ? "default" : "secondary"}>
                    {user.active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`${location.pathname}/${user.id}`}><Eye className="w-4 h-4" /></Link>
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => toggleUserStatus(user.id)}>
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TicketPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <MSafeFilterDialog open={isFilterOpen} onOpenChange={setIsFilterOpen} />
    </div>
  );
};
