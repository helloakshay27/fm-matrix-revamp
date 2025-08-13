import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextField } from '@mui/material';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLayout } from '@/contexts/LayoutContext';

interface VisitingPurposeData {
  id: string;
  purpose: string;
  status: boolean;
  createdOn: string;
  createdBy: string;
}

export const VisitingPurposePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection } = useLayout();
  const [activeTab, setActiveTab] = useState('Visit Purpose');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveInOutModalOpen, setIsMoveInOutModalOpen] = useState(false);
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPurpose, setEditingPurpose] = useState<VisitingPurposeData | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    site: '',
    purpose: '',
    active: true
  });
  const [moveInOutFormData, setMoveInOutFormData] = useState({
    site: '',
    purpose: '',
    active: true
  });
  const [workTypeFormData, setWorkTypeFormData] = useState({
    site: '',
    staffType: '',
    workType: '',
    active: true
  });
  const [commentFormData, setCommentFormData] = useState({
    comment: '',
    active: true
  });

  // Sample data matching the image structure
  const samplePurposes: VisitingPurposeData[] = [
    {
      id: '1',
      purpose: 'Vendor',
      status: true,
      createdOn: '15/01/2025 11:04 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '2',
      purpose: 'Meeting',
      status: true,
      createdOn: '15/01/2025 11:03 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '3',
      purpose: 'Personal',
      status: true,
      createdOn: '15/01/2025 11:02 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '4',
      purpose: 'Courier',
      status: true,
      createdOn: '15/01/2025 11:01 AM',
      createdBy: 'Abdul A'
    }
  ];

  const [filteredPurposes, setFilteredPurposes] = useState<VisitingPurposeData[]>(samplePurposes);
  const [purposes, setPurposes] = useState<VisitingPurposeData[]>(samplePurposes);

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  useEffect(() => {
    const filtered = purposes.filter(purpose =>
      purpose.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purpose.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPurposes(filtered);
  }, [searchTerm, purposes]);

  const handleAddPurpose = () => {
    setIsAddModalOpen(true);
  };

  const handleMoveInOut = () => {
    setIsMoveInOutModalOpen(true);
  };

  const handleMoveInOutModalClose = () => {
    setIsMoveInOutModalOpen(false);
    setMoveInOutFormData({
      site: '',
      purpose: '',
      active: true
    });
  };

  const handleMoveInOutSubmit = () => {
    if (!moveInOutFormData.purpose) {
      toast({
        title: "Error",
        description: "Please enter a move in/out purpose",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Move In/Out purpose created successfully",
    });
    handleMoveInOutModalClose();
  };

  const handleWorkType = () => {
    setIsWorkTypeModalOpen(true);
  };

  const handleWorkTypeModalClose = () => {
    setIsWorkTypeModalOpen(false);
    setWorkTypeFormData({
      site: '',
      staffType: '',
      workType: '',
      active: true
    });
  };

  const handleWorkTypeSubmit = () => {
    if (!workTypeFormData.workType) {
      toast({
        title: "Error",
        description: "Please enter a work type",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Work type created successfully",
    });
    handleWorkTypeModalClose();
  };

  const handleVisitorCategory = () => {
    setIsCommentModalOpen(true);
  };

  const handleCommentModalClose = () => {
    setIsCommentModalOpen(false);
    setCommentFormData({
      comment: '',
      active: true
    });
  };

  const handleCommentSubmit = () => {
    if (!commentFormData.comment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Comment created successfully",
    });
    handleCommentModalClose();
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setFormData({
      site: '',
      purpose: '',
      active: true
    });
  };

  const handleSubmit = () => {
    if (!formData.purpose) {
      toast({
        title: "Error",
        description: "Please enter a purpose",
        variant: "destructive"
      });
      return;
    }

    const newPurpose: VisitingPurposeData = {
      id: (purposes.length + 1).toString(),
      purpose: formData.purpose,
      status: formData.active,
      createdOn: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      createdBy: 'Current User'
    };

    setPurposes(prev => [...prev, newPurpose]);
    toast({
      title: "Success",
      description: "Visiting purpose created successfully",
    });
    handleModalClose();
  };

  const handleStatusToggle = (id: string) => {
    setPurposes(prevData => 
      prevData.map(item => 
        item.id === id 
          ? { ...item, status: !item.status }
          : item
      )
    );
    
    const updatedItem = purposes.find(item => item.id === id);
    const newValue = updatedItem ? !updatedItem.status : false;
    toast({
      title: "Status Updated",
      description: `Purpose status updated to ${newValue ? 'Active' : 'Inactive'}`
    });
  };

  const handleEdit = (purposeId: string) => {
    const purpose = purposes.find(p => p.id === purposeId);
    if (purpose) {
      setEditingPurpose(purpose);
      setIsEditModalOpen(true);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingPurpose(null);
  };

  const handleEditSubmit = () => {
    if (!editingPurpose) return;

    setPurposes(prev => 
      prev.map(p => 
        p.id === editingPurpose.id 
          ? { ...p, purpose: editingPurpose.purpose, status: editingPurpose.status }
          : p
      )
    );

    toast({
      title: "Success",
      description: "Purpose updated successfully",
    });
    handleEditModalClose();
  };

  const handleDelete = (purposeId: string) => {
    setPurposes(prev => prev.filter(item => item.id !== purposeId));
    toast({
      title: "Delete Purpose",
      description: "Purpose deleted successfully",
    });
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              {['Visit Purpose', 'Move In/Out', 'Work Type', 'Visitor Comment'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-200">
              {activeTab === 'Visit Purpose' && (
                <Button 
                  onClick={handleAddPurpose}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Purpose
                </Button>
              )}
              
              {activeTab === 'Move In/Out' && (
                <Button 
                  onClick={handleMoveInOut}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Move In/Out
                </Button>
              )}
              
              {activeTab === 'Work Type' && (
                <Button 
                  onClick={handleWorkType}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Work Type
                </Button>
              )}
              
              {activeTab === 'Visitor Comment' && (
                <Button 
                  onClick={handleVisitorCategory}
                  className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Visitor Comment
                </Button>
              )}

              <div className="flex-1"></div>

            </div>

            {/* Table */}
            <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                <TableHead className="px-4 py-3 w-20">Action</TableHead>
                <TableHead className="px-4 py-3 min-w-[200px]">Purpose</TableHead>
                <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                <TableHead className="px-4 py-3 w-20">Action</TableHead>
                <TableHead className="px-4 py-3 min-w-[200px]">Purpose</TableHead>
                <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                <TableHead className="px-4 py-3 w-20">Action</TableHead>
                <TableHead className="px-4 py-3 min-w-[200px]">Purpose</TableHead>
                <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
                <TableHead className="px-4 py-3 w-20">Action</TableHead>
                <TableHead className="px-4 py-3 min-w-[200px]">Purpose</TableHead>
                <TableHead className="px-4 py-3 w-32 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                {/* Vendor */}
                <TableCell className="px-4 py-3">
                  <button
                    onClick={() => handleEdit('1')}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium">Vendor</TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </TableCell>

                {/* Meeting */}
                <TableCell className="px-4 py-3">
                  <button
                    onClick={() => handleEdit('2')}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium">Meeting</TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </TableCell>

                {/* Personal */}
                <TableCell className="px-4 py-3">
                  <button
                    onClick={() => handleEdit('3')}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium">Personal</TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </TableCell>

                {/* Courier */}
                <TableCell className="px-4 py-3">
                  <button
                    onClick={() => handleEdit('4')}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                  </button>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium">Courier</TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
            </div>
          </div>
        </div>

      </div>

      {/* Add Purpose Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Purpose</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Site Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select site</Label>
              <Select value={formData.site} onValueChange={(value) => setFormData({...formData, site: value})}>
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  <SelectItem value="site1">Lockated - Main Office</SelectItem>
                  <SelectItem value="site2">Zycus Infotech - Pune</SelectItem>
                  <SelectItem value="site3">Arvog Finance - Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Purpose Input */}
            <div className="space-y-2">
              <Label>Enter purpose</Label>
              <TextField
                placeholder="enter purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C72030',
                    },
                  },
                }}
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked as boolean})}
              />
              <Label htmlFor="active">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Move In/Out Purpose Modal */}
      <Dialog open={isMoveInOutModalOpen} onOpenChange={setIsMoveInOutModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Move In/Out Purpose</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMoveInOutModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Site Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select site</Label>
              <Select value={moveInOutFormData.site} onValueChange={(value) => setMoveInOutFormData({...moveInOutFormData, site: value})}>
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  <SelectItem value="site1">Lockated - Main Office</SelectItem>
                  <SelectItem value="site2">Zycus Infotech - Pune</SelectItem>
                  <SelectItem value="site3">Arvog Finance - Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Move In/Out Purpose Input */}
            <div className="space-y-2">
              <Label>Enter move in/ out purpose</Label>
              <TextField
                placeholder="enter purpose"
                value={moveInOutFormData.purpose}
                onChange={(e) => setMoveInOutFormData({...moveInOutFormData, purpose: e.target.value})}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C72030',
                    },
                  },
                }}
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="moveInOutActive"
                checked={moveInOutFormData.active}
                onCheckedChange={(checked) => setMoveInOutFormData({...moveInOutFormData, active: checked as boolean})}
              />
              <Label htmlFor="moveInOutActive">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleMoveInOutSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Work Type Modal */}
      <Dialog open={isWorkTypeModalOpen} onOpenChange={setIsWorkTypeModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Work Type</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWorkTypeModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Site Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select Site</Label>
              <Select value={workTypeFormData.site} onValueChange={(value) => setWorkTypeFormData({...workTypeFormData, site: value})}>
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select Site" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  <SelectItem value="site1">Lockated - Main Office</SelectItem>
                  <SelectItem value="site2">Zycus Infotech - Pune</SelectItem>
                  <SelectItem value="site3">Arvog Finance - Mumbai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Staff Type Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">Select Staff Type</Label>
              <Select value={workTypeFormData.staffType} onValueChange={(value) => setWorkTypeFormData({...workTypeFormData, staffType: value})}>
                <SelectTrigger className="w-full bg-white border border-gray-300">
                  <SelectValue placeholder="Select Staff Type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[60] border border-gray-300 shadow-lg">
                  <SelectItem value="permanent">Permanent Staff</SelectItem>
                  <SelectItem value="contract">Contract Staff</SelectItem>
                  <SelectItem value="temporary">Temporary Staff</SelectItem>
                  <SelectItem value="vendor">Vendor Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Work Type Input */}
            <div className="space-y-2">
              <Label>Enter Work Type</Label>
              <TextField
                placeholder="Enter Work Type"
                value={workTypeFormData.workType}
                onChange={(e) => setWorkTypeFormData({...workTypeFormData, workType: e.target.value})}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C72030',
                    },
                  },
                }}
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="workTypeActive"
                checked={workTypeFormData.active}
                onCheckedChange={(checked) => setWorkTypeFormData({...workTypeFormData, active: checked as boolean})}
              />
              <Label htmlFor="workTypeActive">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleWorkTypeSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Comment Modal */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Add Comment</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCommentModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Comment Textarea */}
            <div className="space-y-2">
              <Label>Enter comment</Label>
              <TextField
                placeholder="Enter Comment"
                value={commentFormData.comment}
                onChange={(e) => setCommentFormData({...commentFormData, comment: e.target.value})}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C72030',
                    },
                  },
                }}
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="commentActive"
                checked={commentFormData.active}
                onCheckedChange={(checked) => setCommentFormData({...commentFormData, active: checked as boolean})}
              />
              <Label htmlFor="commentActive">Active</Label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleCommentSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Purpose Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md bg-white z-50">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-3">
            <DialogTitle className="text-lg font-semibold">Edit Purpose</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditModalClose}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Purpose Input */}
            <div className="space-y-2">
              <TextField
                value={editingPurpose?.purpose || ''}
                onChange={(e) => editingPurpose && setEditingPurpose({...editingPurpose, purpose: e.target.value})}
                fullWidth
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#d1d5db',
                    },
                    '&:hover fieldset': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#C72030',
                    },
                  },
                }}
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="editActive"
                checked={editingPurpose?.status || false}
                onCheckedChange={(checked) => editingPurpose && setEditingPurpose({...editingPurpose, status: checked as boolean})}
              />
              <Label htmlFor="editActive" className="text-black">Active</Label>
            </div>

            {/* Update Button */}
            <div className="flex justify-start pt-4">
              <Button 
                onClick={handleEditSubmit}
                className="bg-green-500 hover:bg-green-600 text-white px-6"
              >
                UPDATE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};