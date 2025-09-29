import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';

interface UserCategoryTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const UserCategoryTab: React.FC<UserCategoryTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  
  // User Category state
  const [userCategories, setUserCategories] = useState<any[]>([]);
  const [isLoadingUserCategories, setIsLoadingUserCategories] = useState(false);
  const [isAddUserCategoryOpen, setIsAddUserCategoryOpen] = useState(false);
  const [isEditUserCategoryOpen, setIsEditUserCategoryOpen] = useState(false);
  const [userCategoryName, setUserCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: number, name: string, resource_type?: string, resource_id?: number } | null>(null);

  useEffect(() => {
    fetchUserCategories();
  }, []);

  const fetchUserCategories = async () => {
    setIsLoadingUserCategories(true);
    try {
      const response = await fetch(getFullUrl('/pms/admin/user_categories.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCategories(data);
      } else {
        toast.error('Failed to fetch user categories');
      }
    } catch (error) {
      console.error('Error fetching user categories:', error);
      toast.error('Error fetching user categories');
    } finally {
      setIsLoadingUserCategories(false);
    }
  };

  const handleSubmitUserCategory = async () => {
    if (!userCategoryName.trim()) {
      toast.error('Please enter a user category name');
      return;
    }

    try {
      const response = await fetch(getFullUrl('/pms/admin/user_categories'), {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_category: {
            name: userCategoryName
          }
        }),
      });

      if (response.ok) {
        toast.success('User category added successfully');
        fetchUserCategories(); // Refresh the list
        setUserCategoryName('');
        setIsAddUserCategoryOpen(false);
      } else {
        toast.error('Failed to add user category');
      }
    } catch (error) {
      console.error('Error adding user category:', error);
      toast.error('Error adding user category');
    }
  };

  const handleEditUserCategory = (category: any) => {
    setEditingCategory({
      id: category.id,
      name: category.name,
      resource_type: category.resource_type,
      resource_id: category.resource_id
    });
    setIsEditUserCategoryOpen(true);
  };

  const handleUpdateUserCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Please enter a user category name');
      return;
    }

    try {
      const response = await fetch(getFullUrl(`/pms/admin/user_categories/${editingCategory.id}.json?user_category[name]=${encodeURIComponent(editingCategory.name)}`), {
        method: 'PUT',
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('User category updated successfully');
        fetchUserCategories(); // Refresh the list
        setEditingCategory(null);
        setIsEditUserCategoryOpen(false);
      } else {
        toast.error('Failed to update user category');
      }
    } catch (error) {
      console.error('Error updating user category:', error);
      toast.error('Error updating user category');
    }
  };

  const filteredUserCategories = userCategories.filter(category =>
    category.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Dialog open={isAddUserCategoryOpen} onOpenChange={setIsAddUserCategoryOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01020] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add User Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add User Category</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
                onClick={() => setIsAddUserCategoryOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category_name">User Category Name *</Label>
                <Input
                  id="category_name"
                  value={userCategoryName}
                  onChange={(e) => setUserCategoryName(e.target.value)}
                  placeholder="Enter user category name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserCategoryOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitUserCategory} className="bg-[#C72030] hover:bg-[#A01020] text-white">
                Add User Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <div className="flex items-center gap-4">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">entries per page</span>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search user categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Resource Type</TableHead>
                <TableHead className="font-semibold">Resource ID</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingUserCategories ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading user categories...
                  </TableCell>
                </TableRow>
              ) : filteredUserCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No user categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUserCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.resource_type || '-'}</TableCell>
                    <TableCell>{category.resource_id || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUserCategory(category)}
                          className="hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Category Dialog */}
      <Dialog open={isEditUserCategoryOpen} onOpenChange={setIsEditUserCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Category</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsEditUserCategoryOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit_category_name">User Category Name *</Label>
              <Input
                id="edit_category_name"
                value={editingCategory?.name || ''}
                onChange={(e) => setEditingCategory(editingCategory ? { ...editingCategory, name: e.target.value } : null)}
                placeholder="Enter user category name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUserCategory} className="bg-[#C72030] hover:bg-[#A01020] text-white">
              Update User Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
