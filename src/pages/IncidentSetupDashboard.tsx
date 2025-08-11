import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { TextField, Select as MuiSelect, MenuItem, FormControl, InputLabel } from '@mui/material';

export const IncidentSetupDashboard = () => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    category: '',
    subCategory: '',
    subSubCategory: '',
    name: '',
    level: '',
    escalateInDays: '',
    users: ''
  });

  const [categories, setCategories] = useState([
    { id: 1, name: 'risks' },
    { id: 2, name: 'Risk Assessment' }
  ]);

  const [subCategories, setSubCategories] = useState([
    { id: 1, category: 'risks', subCategory: 'data' },
    { id: 2, category: 'Risk Assessment', subCategory: 'Physical Security' },
    { id: 3, category: 'Risk Assessment', subCategory: 'Integration Failure' },
    { id: 4, category: 'Risk Assessment', subCategory: 'DDoS Attack' },
    { id: 5, category: 'Risk Assessment', subCategory: 'Phishing Attacks' },
    { id: 6, category: 'Risk Assessment', subCategory: 'Access Control' },
    { id: 7, category: 'Risk Assessment', subCategory: 'Data Breached' }
  ]);

  const [subSubCategories, setSubSubCategories] = useState([
    { id: 1, category: 'risks', subCategory: 'data', subSubCategory: 'data I' }
  ]);

  const [subSubSubCategories, setSubSubSubCategories] = useState([
    { id: 1, category: 'risks', subCategory: 'data', subSubCategory: 'data I', subSubSubCategory: 'data I-A' }
  ]);

  const [incidenceStatuses, setIncidenceStatuses] = useState([
    { id: 1, name: 'under observation' },
    { id: 2, name: 'Closed' },
    { id: 3, name: 'Open' }
  ]);

  const [incidenceLevels, setIncidenceLevels] = useState([
    { id: 1, name: 'level 4' },
    { id: 2, name: 'Level 3' },
    { id: 3, name: 'Level 2' },
    { id: 4, name: 'Level 1' }
  ]);

  const [escalations, setEscalations] = useState([
    { id: 1, level: 'Level 1', escalateInDays: '1', users: 'Mahendra Lungare, Vinayak Mane' },
    { id: 2, level: 'Level 2', escalateInDays: '2', users: 'Abdul A' }
  ]);

  const [selectedEscalationLevel, setSelectedEscalationLevel] = useState('');
  const [escalateInDays, setEscalateInDays] = useState('');
  const [escalateToUsers, setEscalateToUsers] = useState('');

  const [approvalSetups, setApprovalSetups] = useState([
    { id: 1, users: 'Mahendra Lungare, Vinayak Mane' },
    { id: 2, users: 'Abdul A, John Doe' }
  ]);

  const [selectedApprovalUsers, setSelectedApprovalUsers] = useState('');

  const [secondaryCategories, setSecondaryCategories] = useState([
    { id: 1, name: 'Safety Risk' },
    { id: 2, name: 'Operational Risk' },
    { id: 3, name: 'Technical Risk' }
  ]);

  const [secondarySubCategories, setSecondarySubCategories] = useState([
    { id: 1, secondaryCategory: 'Safety Risk', secondarySubCategory: 'Fire Safety' },
    { id: 2, secondaryCategory: 'Operational Risk', secondarySubCategory: 'Process Failure' }
  ]);

  const [selectedSecondaryCategory, setSelectedSecondaryCategory] = useState('');

  const menuItems = [
    'Category', 'Sub Category', 'Sub Sub Category', 'Sub Sub Sub Category', 
    'Incidence status', 'Incidence level', 'Escalations', 'Approval Setup', 
    'Secondary Category', 'Secondary Sub Category', 'Secondary Sub Sub Category', 
    'Secondary Sub Sub Sub Category', 'Who got injured', 'Property Damage Category', 
    'RCA Category', 'Incident Disclaimer'
  ];

  const handleSubmit = () => {
    if (categoryName.trim()) {
      console.log('Adding category:', categoryName);
      setCategoryName('');
    }
  };

  const handleEdit = (item: any, type: string) => {
    setEditingItem({ ...item, type });
    if (type === 'Escalations') {
      setEditFormData({
        category: '',
        subCategory: '',
        subSubCategory: '',
        name: '',
        level: item.level || '',
        escalateInDays: item.escalateInDays || '',
        users: item.users || ''
      });
    } else {
      setEditFormData({
        category: item.category || item.name || '',
        subCategory: item.subCategory || '',
        subSubCategory: item.subSubCategory || '',
        name: item.name || item.subCategory || item.subSubCategory || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    }
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    console.log('Updating item:', editFormData);
    setIsEditing(false);
    setEditingItem(null);
    setEditFormData({
      category: '',
      subCategory: '',
      subSubCategory: '',
      name: '',
      level: '',
      escalateInDays: '',
      users: ''
    });
  };

  const handleEditBack = () => {
    setIsEditing(false);
    setEditingItem(null);
    setEditFormData({
      category: '',
      subCategory: '',
      subSubCategory: '',
      name: '',
      level: '',
      escalateInDays: '',
      users: ''
    });
  };

  const handleDelete = (item: any, type: string) => {
    if (window.confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) {
      if (type === 'Category') {
        setCategories(categories.filter(cat => cat.id !== item.id));
      } else if (type === 'Sub Category') {
        setSubCategories(subCategories.filter(sub => sub.id !== item.id));
      } else if (type === 'Sub Sub Category') {
        setSubSubCategories(subSubCategories.filter(subsub => subsub.id !== item.id));
      } else if (type === 'Sub Sub Sub Category') {
        setSubSubSubCategories(subSubSubCategories.filter(subsubsub => subsubsub.id !== item.id));
      } else if (type === 'Incidence status') {
        setIncidenceStatuses(incidenceStatuses.filter(status => status.id !== item.id));
      } else if (type === 'Incidence level') {
        setIncidenceLevels(incidenceLevels.filter(level => level.id !== item.id));
      } else if (type === 'Escalations') {
        setEscalations(escalations.filter(escalation => escalation.id !== item.id));
      } else if (type === 'Approval Setup') {
        setApprovalSetups(approvalSetups.filter(approval => approval.id !== item.id));
      } else if (type === 'Secondary Category') {
        setSecondaryCategories(secondaryCategories.filter(secondary => secondary.id !== item.id));
      } else if (type === 'Secondary Sub Category') {
        setSecondarySubCategories(secondarySubCategories.filter(secondarySub => secondarySub.id !== item.id));
      }
    }
  };

  if (isEditing) {
    return (
      <div className="flex-1 p-6 bg-white min-h-screen">
        <div className="bg-white p-8 rounded-lg border shadow-sm max-w-2xl">
          {editingItem?.type === 'Escalations' ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⚙</span>
                </div>
                <h2 className="text-lg font-semibold text-red-500">Edit Escalation</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <FormControl fullWidth size="small">
                  <InputLabel>Select Level</InputLabel>
                  <MuiSelect 
                    value={editFormData.level} 
                    onChange={e => setEditFormData({ ...editFormData, level: e.target.value })}
                    label="Select Level"
                  >
                    {incidenceLevels.map(level => 
                      <MenuItem key={level.id} value={level.name}>{level.name}</MenuItem>
                    )}
                  </MuiSelect>
                </FormControl>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Escalate In Days</label>
                <TextField 
                  type="text" 
                  value={editFormData.escalateInDays} 
                  onChange={e => setEditFormData({ ...editFormData, escalateInDays: e.target.value })} 
                  placeholder="Enter days"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Escalate to users</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {editFormData.users.split(',').filter(user => user.trim()).map((user, index) => 
                      <div key={index} className="bg-gray-200 px-3 py-1 rounded-md flex items-center gap-2">
                        <span className="text-sm">{user.trim()}</span>
                        <button 
                          onClick={() => {
                            const userList = editFormData.users.split(',').filter(u => u.trim() !== user.trim());
                            setEditFormData({ ...editFormData, users: userList.join(', ') });
                          }} 
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                  <Select onValueChange={value => {
                    const currentUsers = editFormData.users ? editFormData.users.split(',').map(u => u.trim()) : [];
                    if (!currentUsers.includes(value)) {
                      const newUsers = [...currentUsers, value].filter(u => u);
                      setEditFormData({ ...editFormData, users: newUsers.join(', ') });
                    }
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select users to add..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="Mahendra Lungare">Mahendra Lungare</SelectItem>
                      <SelectItem value="Vinayak Mane">Vinayak Mane</SelectItem>
                      <SelectItem value="Abdul A">Abdul A</SelectItem>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleEditSubmit} 
                  disabled={!editFormData.level || !editFormData.escalateInDays}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Submit
                </Button>
                <Button 
                  onClick={handleEditBack} 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-2 transition-all duration-200"
                >
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <TextField 
                  type="text" 
                  value={editFormData.name} 
                  onChange={e => setEditFormData({ ...editFormData, name: e.target.value })} 
                  placeholder="Enter name"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleEditSubmit} 
                  disabled={!editFormData.name.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  Submit
                </Button>
                <Button 
                  onClick={handleEditBack} 
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-2 transition-all duration-200"
                >
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Incidents Setup</h1>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Side - Category Menu */}
        <div className="w-full lg:w-80 mb-6 lg:mb-0">
          <div className="space-y-1 bg-gray-100 p-2 rounded-lg">
            {menuItems.map(item => 
              <button
                key={item} 
                onClick={() => setSelectedCategory(item)} 
                className={`w-full px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-200 text-left ${
                  selectedCategory === item 
                    ? 'bg-white text-gray-900 shadow-sm transform scale-105' 
                    : 'text-gray-700 hover:bg-white/50 hover:transform hover:scale-102'
                } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50`}
                role="tab"
                aria-selected={selectedCategory === item}
              >
                {item}
              </button>
            )}
          </div>
        </div>

        {/* Right Side - Form and Table */}
        <div className="flex-1">
          {/* Form Section */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <TextField 
                  type="text" 
                  value={categoryName} 
                  onChange={e => setCategoryName(e.target.value)} 
                  placeholder="Enter name"
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>
              <Button 
                onClick={handleSubmit} 
                disabled={!categoryName.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2 w-full sm:w-auto transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Table Section - Updated to match Inward list style */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    {selectedCategory === 'Escalations' ? (
                      <>
                        <TableHead>Level</TableHead>
                        <TableHead>Escalate In Days</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Action</TableHead>
                      </>
                    ) : selectedCategory === 'Sub Category' ? (
                      <>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub Category</TableHead>
                        <TableHead>Action</TableHead>
                      </>
                    ) : selectedCategory === 'Sub Sub Category' ? (
                      <>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub Category</TableHead>
                        <TableHead>Sub Sub Category</TableHead>
                        <TableHead>Action</TableHead>
                      </>
                    ) : selectedCategory === 'Sub Sub Sub Category' ? (
                      <>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub Category</TableHead>
                        <TableHead>Sub Sub Category</TableHead>
                        <TableHead>Sub Sub Sub Category</TableHead>
                        <TableHead>Action</TableHead>
                      </>
                    ) : selectedCategory === 'Approval Setup' ? (
                      <>
                        <TableHead>Users</TableHead>
                        <TableHead>Action</TableHead>
                      </>
                    ) : selectedCategory === 'Secondary Sub Category' ? (
                      <>
                        <TableHead>Secondary Category</TableHead>
                        <TableHead>Secondary Sub Category</TableHead>
                        <TableHead>Action</TableHead>
                      </>
                    ) : (
                      <>
                        <TableHead>Name</TableHead>
                        <TableHead>Action</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCategory === 'Escalations' ? 
                    escalations.map(escalation => 
                      <TableRow key={escalation.id}>
                        <TableCell className="font-medium">{escalation.level}</TableCell>
                        <TableCell>{escalation.escalateInDays}</TableCell>
                        <TableCell>{escalation.users}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(escalation, 'Escalations')}
                               aria-label="Edit escalation"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(escalation, 'Escalations')}
                               aria-label="Delete escalation"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Sub Category' ?
                    subCategories.map(item => 
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell>{item.subCategory}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(item, 'Sub Category')}
                               aria-label="Edit sub category"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(item, 'Sub Category')}
                               aria-label="Delete sub category"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Sub Sub Category' ?
                    subSubCategories.map(item => 
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell>{item.subCategory}</TableCell>
                        <TableCell>{item.subSubCategory}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(item, 'Sub Sub Category')}
                               aria-label="Edit sub sub category"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(item, 'Sub Sub Category')}
                               aria-label="Delete sub sub category"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Sub Sub Sub Category' ?
                    subSubSubCategories.map(item => 
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell>{item.subCategory}</TableCell>
                        <TableCell>{item.subSubCategory}</TableCell>
                        <TableCell>{item.subSubSubCategory}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(item, 'Sub Sub Sub Category')}
                               aria-label="Edit sub sub sub category"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(item, 'Sub Sub Sub Category')}
                               aria-label="Delete sub sub sub category"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Approval Setup' ?
                    approvalSetups.map(approval => 
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.users}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(approval, 'Approval Setup')}
                               aria-label="Edit approval setup"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(approval, 'Approval Setup')}
                               aria-label="Delete approval setup"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Secondary Sub Category' ?
                    secondarySubCategories.map(secondarySub => 
                      <TableRow key={secondarySub.id}>
                        <TableCell className="font-medium">{secondarySub.secondaryCategory}</TableCell>
                        <TableCell>{secondarySub.secondarySubCategory}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(secondarySub, 'Secondary Sub Category')}
                               aria-label="Edit secondary sub category"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(secondarySub, 'Secondary Sub Category')}
                               aria-label="Delete secondary sub category"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Incidence status' ?
                    incidenceStatuses.map(status => 
                      <TableRow key={status.id}>
                        <TableCell className="font-medium">{status.name}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(status, 'Incidence status')}
                               aria-label="Edit incidence status"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(status, 'Incidence status')}
                               aria-label="Delete incidence status"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Incidence level' ?
                    incidenceLevels.map(level => 
                      <TableRow key={level.id}>
                        <TableCell className="font-medium">{level.name}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(level, 'Incidence level')}
                               aria-label="Edit incidence level"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(level, 'Incidence level')}
                               aria-label="Delete incidence level"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) : selectedCategory === 'Secondary Category' ?
                    secondaryCategories.map(secondary => 
                      <TableRow key={secondary.id}>
                        <TableCell className="font-medium">{secondary.name}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(secondary, 'Secondary Category')}
                               aria-label="Edit secondary category"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(secondary, 'Secondary Category')}
                               aria-label="Delete secondary category"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    ) :
                    categories.map(category => 
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                         <TableCell>
                           <div className="flex gap-1 sm:gap-2">
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleEdit(category, 'Category')}
                               aria-label="Edit category"
                             >
                               <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                             <Button 
                               variant="ghost" 
                               size="sm" 
                               className="text-red-600 hover:text-red-800 hover:bg-red-50 transition-all duration-200 p-1 sm:p-2" 
                               onClick={() => handleDelete(category, 'Category')}
                               aria-label="Delete category"
                             >
                               <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                             </Button>
                           </div>
                         </TableCell>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};