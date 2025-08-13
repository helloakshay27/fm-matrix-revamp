import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, RefreshCw, Grid3X3, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveInOutModalOpen, setIsMoveInOutModalOpen] = useState(false);
  const [isWorkTypeModalOpen, setIsWorkTypeModalOpen] = useState(false);
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
      purpose: 'vendor',
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
      purpose: 'Delivery',
      status: true,
      createdOn: '15/01/2025 11:02 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '4',
      purpose: 'Maintenance',
      status: false,
      createdOn: '15/01/2025 11:01 AM',
      createdBy: 'Abdul A'
    },
    {
      id: '5',
      purpose: 'Interview',
      status: true,
      createdOn: '15/01/2025 11:00 AM',
      createdBy: 'Abdul A'
    }
  ];

  const [filteredPurposes, setFilteredPurposes] = useState<VisitingPurposeData[]>(samplePurposes);
  const [purposes, setPurposes] = useState<VisitingPurposeData[]>(samplePurposes);

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
    toast({
      title: "Edit Purpose",
      description: `Editing purpose ID: ${purposeId}`,
    });
  };

  const handleDelete = (purposeId: string) => {
    setPurposes(prev => prev.filter(item => item.id !== purposeId));
    toast({
      title: "Delete Purpose",
      description: "Purpose deleted successfully",
    });
  };

  return (
    <>
      <div className="p-6 min-h-screen">
        {/* Action Buttons Bar */}
        <div className="flex items-center gap-3 mb-6">
          <Button 
            onClick={handleAddPurpose}
            className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Purpose
          </Button>
          
          <Button 
            onClick={handleMoveInOut}
            className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Move In/Out
          </Button>
          
          <Button 
            onClick={handleWorkType}
            className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Work Type
          </Button>
          
          <Button 
            onClick={handleVisitorCategory}
            className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            Visitor Comment
          </Button>

          <div className="flex-1"></div>

        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f6f4ee]">
                <TableHead className="w-20">Action</TableHead>
                <TableHead className="min-w-[200px]">Purpose</TableHead>
                <TableHead className="w-32 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurposes.map((purpose) => (
                <TableRow key={purpose.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(purpose.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4 text-gray-600 hover:text-[#C72030]" />
                      </button>
                      <button
                        onClick={() => handleDelete(purpose.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-600" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {purpose.purpose}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      purpose.status 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {purpose.status ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <span>Powered by</span>
            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="font-semibold text-gray-800">LOCKATED</span>
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
              <Input
                placeholder="enter purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                className="w-full"
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
              <Input
                placeholder="enter purpose"
                value={moveInOutFormData.purpose}
                onChange={(e) => setMoveInOutFormData({...moveInOutFormData, purpose: e.target.value})}
                className="w-full"
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
              <Input
                placeholder="Enter Work Type"
                value={workTypeFormData.workType}
                onChange={(e) => setWorkTypeFormData({...workTypeFormData, workType: e.target.value})}
                className="w-full"
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
              <Textarea
                placeholder="Enter Comment"
                value={commentFormData.comment}
                onChange={(e) => setCommentFormData({...commentFormData, comment: e.target.value})}
                className="w-full min-h-[80px] resize-none"
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
    </>
  );
};