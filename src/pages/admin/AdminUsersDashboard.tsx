import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Search, Filter, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';

interface AdminUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  organization_name?: string;
  company_name?: string;
  user_type: string;
  active: boolean;
  created_at: string;
}

export const AdminUsersDashboard = () => {
  const navigate = useNavigate();
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [adminUsers, searchTerm, statusFilter]);

  const fetchAdminUsers = async () => {
    setIsLoading(true);
    try {
      // This would be the actual API endpoint for fetching admin users
      // For now, we'll use the FM users endpoint and filter admin users
      const response = await fetch(getFullUrl('/pms/admin/users/admin_users.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Admin users API response:', data);
        
        // Transform the data based on the actual API response structure
        let users: AdminUser[] = [];
        if (data && Array.isArray(data.users)) {
          users = data.users;
        } else if (Array.isArray(data)) {
          users = data;
        }
        
        setAdminUsers(users);
      } else {
        console.error('Failed to fetch admin users:', response.statusText);
        toast.error('Failed to load admin users');
        
        // Fallback: show some sample data for demonstration
        const sampleUsers: AdminUser[] = [
          {
            id: 1,
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            mobile: '1234567890',
            organization_name: 'Tech Corp',
            company_name: 'Tech Solutions',
            user_type: 'organization_admin',
            active: true,
            created_at: '2024-01-15T10:30:00Z'
          },
          {
            id: 2,
            firstname: 'Jane',
            lastname: 'Smith',
            email: 'jane.smith@example.com',
            mobile: '0987654321',
            organization_name: 'Business Inc',
            company_name: 'Business Solutions',
            user_type: 'organization_admin',
            active: true,
            created_at: '2024-01-20T14:20:00Z'
          }
        ];
        setAdminUsers(sampleUsers);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast.error('Error loading admin users');
      
      // Show sample data on error too
      const sampleUsers: AdminUser[] = [
        {
          id: 1,
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          mobile: '1234567890',
          organization_name: 'Tech Corp',
          company_name: 'Tech Solutions',
          user_type: 'organization_admin',
          active: true,
          created_at: '2024-01-15T10:30:00Z'
        }
      ];
      setAdminUsers(sampleUsers);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = adminUsers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobile.includes(searchTerm) ||
        (user.organization_name && user.organization_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.company_name && user.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.active);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.active);
      }
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = () => {
    navigate('/ops-console/admin/create-admin-user');
  };

  const handleViewUser = (userId: number) => {
    // Navigate to user details page (to be implemented)
    toast.info('User details page to be implemented');
  };

  const handleEditUser = (userId: number) => {
    // Navigate to edit user page (to be implemented)
    toast.info('Edit user page to be implemented');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'organization_admin':
        return 'Organization Admin';
      case 'company_admin':
        return 'Company Admin';
      case 'super_admin':
        return 'Super Admin';
      default:
        return 'Admin';
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Admin Users</h1>
          <p className="text-sm text-gray-600 mt-1">Manage organization admin users and their permissions</p>
        </div>
        <Button
          onClick={handleCreateUser}
          className="bg-[#C72030] hover:bg-[#A01020] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Admin User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, email, phone, organization, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Admin Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No admin users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Get started by creating a new admin user.'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <div className="mt-6">
                  <Button onClick={handleCreateUser} className="bg-[#C72030] hover:bg-[#A01020] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Admin User
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstname} {user.lastname}
                      </TableCell>
                      <TableCell className="text-blue-600 hover:text-blue-800">
                        <a href={`mailto:${user.email}`}>{user.email}</a>
                      </TableCell>
                      <TableCell>
                        <a href={`tel:${user.mobile}`} className="text-blue-600 hover:text-blue-800">
                          {user.mobile}
                        </a>
                      </TableCell>
                      <TableCell>{user.organization_name || '-'}</TableCell>
                      <TableCell>{user.company_name || '-'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getUserTypeLabel(user.user_type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                              Edit User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
