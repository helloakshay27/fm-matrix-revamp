import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Edit, Eye, Trash2, Copy, Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const checklistData = [
  {
    id: 1,
    checklistName: 'Daily Equipment Inspection',
    type: 'PPM',
    assetType: 'HVAC Equipment',
    status: 'Active',
    lastModified: '2024-01-15',
    questionsCount: 12
  },
  {
    id: 2,
    checklistName: 'Emergency Breakdown Response',
    type: 'Breakdown',
    assetType: 'Fire Safety',
    status: 'Active',
    lastModified: '2024-01-14',
    questionsCount: 8
  },
  {
    id: 3,
    checklistName: 'Weekly Generator Maintenance',
    type: 'PPM',
    assetType: 'Generator',
    status: 'Inactive',
    lastModified: '2024-01-10',
    questionsCount: 15
  },
  {
    id: 4,
    checklistName: 'Elevator Safety Check',
    type: 'PPM',
    assetType: 'Elevator',
    status: 'Active',
    lastModified: '2024-01-12',
    questionsCount: 20
  }
];

export const ChecklistListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(checklistData);

  const handleAddChecklist = () => {
    navigate('/master/checklist/add');
  };

  const handleEditChecklist = (id: number) => {
    navigate(`/master/checklist/edit/${id}`);
  };

  const handleViewChecklist = (id: number) => {
    navigate(`/master/checklist/view/${id}`);
  };

  const handleDuplicateChecklist = (id: number) => {
    console.log('Duplicating checklist:', id);
  };

  const handleDeleteChecklist = (id: number) => {
    console.log('Deleting checklist:', id);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = checklistData.filter(item =>
      item.checklistName.toLowerCase().includes(value.toLowerCase()) ||
      item.type.toLowerCase().includes(value.toLowerCase()) ||
      item.assetType.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          Master / Checklist Management
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Checklist Management</h1>
          <Button 
            onClick={handleAddChecklist}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Checklist
          </Button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search checklists..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-foreground">{checklistData.length}</div>
            <div className="text-sm text-muted-foreground">Total Checklists</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {checklistData.filter(item => item.status === 'Active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">
              {checklistData.filter(item => item.type === 'PPM').length}
            </div>
            <div className="text-sm text-muted-foreground">PPM Checklists</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">
              {checklistData.filter(item => item.type === 'Breakdown').length}
            </div>
            <div className="text-sm text-muted-foreground">Breakdown Checklists</div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Checklist Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Asset Type</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.checklistName}</TableCell>
                    <TableCell>
                      <Badge variant={item.type === 'PPM' ? 'default' : 'secondary'}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.assetType}</TableCell>
                    <TableCell>{item.questionsCount}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastModified}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewChecklist(item.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditChecklist(item.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDuplicateChecklist(item.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteChecklist(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm ? 'No checklists found matching your search.' : 'No checklists available.'}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredData.length} of {checklistData.length} checklists
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};