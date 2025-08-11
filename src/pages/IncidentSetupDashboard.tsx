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
  const [categories, setCategories] = useState([{
    id: 1,
    name: 'risks'
  }, {
    id: 2,
    name: 'Risk Assessment'
  }]);
  const [subCategories, setSubCategories] = useState([{
    id: 1,
    category: 'risks',
    subCategory: 'data'
  }, {
    id: 2,
    category: 'Risk Assessment',
    subCategory: 'Physical Security'
  }, {
    id: 3,
    category: 'Risk Assessment',
    subCategory: 'Integration Failure'
  }, {
    id: 4,
    category: 'Risk Assessment',
    subCategory: 'DDoS Attack'
  }, {
    id: 5,
    category: 'Risk Assessment',
    subCategory: 'Phishing Attacks'
  }, {
    id: 6,
    category: 'Risk Assessment',
    subCategory: 'Access Control'
  }, {
    id: 7,
    category: 'Risk Assessment',
    subCategory: 'Data Breached'
  }]);
  const [subSubCategories, setSubSubCategories] = useState([{
    id: 1,
    category: 'risks',
    subCategory: 'data',
    subSubCategory: 'data I'
  }]);
  const [subSubSubCategories, setSubSubSubCategories] = useState([{
    id: 1,
    category: 'risks',
    subCategory: 'data',
    subSubCategory: 'data I',
    subSubSubCategory: 'data I-A'
  }]);
  const [incidenceStatuses, setIncidenceStatuses] = useState([{
    id: 1,
    name: 'under observation'
  }, {
    id: 2,
    name: 'Closed'
  }, {
    id: 3,
    name: 'Open'
  }]);
  const [incidenceLevels, setIncidenceLevels] = useState([{
    id: 1,
    name: 'level 4'
  }, {
    id: 2,
    name: 'Level 3'
  }, {
    id: 3,
    name: 'Level 2'
  }, {
    id: 4,
    name: 'Level 1'
  }]);
  const [escalations, setEscalations] = useState([{
    id: 1,
    level: 'Level 1',
    escalateInDays: '1',
    users: 'Mahendra Lungare, Vinayak Mane'
  }, {
    id: 2,
    level: 'Level 2',
    escalateInDays: '2',
    users: 'Abdul A'
  }]);
  const [selectedEscalationLevel, setSelectedEscalationLevel] = useState('');
  const [escalateInDays, setEscalateInDays] = useState('');
  const [escalateToUsers, setEscalateToUsers] = useState('');
  const [approvalSetups, setApprovalSetups] = useState([{
    id: 1,
    users: 'Mahendra Lungare, Vinayak Mane'
  }, {
    id: 2,
    users: 'Abdul A, John Doe'
  }]);
  const [selectedApprovalUsers, setSelectedApprovalUsers] = useState('');
  const [secondaryCategories, setSecondaryCategories] = useState([{
    id: 1,
    name: 'Safety Risk'
  }, {
    id: 2,
    name: 'Operational Risk'
  }, {
    id: 3,
    name: 'Technical Risk'
  }]);
  const [secondarySubCategories, setSecondarySubCategories] = useState([{
    id: 1,
    secondaryCategory: 'Safety Risk',
    secondarySubCategory: 'Fire Safety'
  }, {
    id: 2,
    secondaryCategory: 'Operational Risk',
    secondarySubCategory: 'Process Failure'
  }]);
  const [selectedSecondaryCategory, setSelectedSecondaryCategory] = useState('');
  const menuItems = ['Category', 'Sub Category', 'Sub Sub Category', 'Sub Sub Sub Category', 'Incidence status', 'Incidence level', 'Escalations', 'Approval Setup', 'Secondary Category', 'Secondary Sub Category', 'Secondary Sub Sub Category', 'Secondary Sub Sub Sub Category', 'Who got injured', 'Property Damage Category', 'RCA Category', 'Incident Disclaimer'];
  const handleSubmit = () => {
    if (selectedCategory === 'Category' && categoryName.trim()) {
      const newCategory = {
        id: Date.now(),
        name: categoryName.trim()
      };
      setCategories([...categories, newCategory]);
      setCategoryName('');
    } else if (selectedCategory === 'Sub Category' && categoryName.trim() && selectedParentCategory) {
      const newSubCategory = {
        id: Date.now(),
        category: selectedParentCategory,
        subCategory: categoryName.trim()
      };
      setSubCategories([...subCategories, newSubCategory]);
      setCategoryName('');
    } else if (selectedCategory === 'Sub Sub Category' && categoryName.trim() && selectedParentCategory && selectedSubCategory) {
      const newSubSubCategory = {
        id: Date.now(),
        category: selectedParentCategory,
        subCategory: selectedSubCategory,
        subSubCategory: categoryName.trim()
      };
      setSubSubCategories([...subSubCategories, newSubSubCategory]);
      setCategoryName('');
    } else if (selectedCategory === 'Incidence status' && categoryName.trim()) {
      const newStatus = {
        id: Date.now(),
        name: categoryName.trim()
      };
      setIncidenceStatuses([...incidenceStatuses, newStatus]);
      setCategoryName('');
    } else if (selectedCategory === 'Incidence level' && categoryName.trim()) {
      const newLevel = {
        id: Date.now(),
        name: categoryName.trim()
      };
      setIncidenceLevels([...incidenceLevels, newLevel]);
      setCategoryName('');
    } else if (selectedCategory === 'Escalations' && selectedEscalationLevel.trim() && escalateInDays.trim() && escalateToUsers.trim()) {
      const newEscalation = {
        id: Date.now(),
        level: selectedEscalationLevel.trim(),
        escalateInDays: escalateInDays.trim(),
        users: escalateToUsers.trim()
      };
      setEscalations([...escalations, newEscalation]);
      setSelectedEscalationLevel('');
      setEscalateInDays('');
      setEscalateToUsers('');
    } else if (selectedCategory === 'Approval Setup' && selectedApprovalUsers.trim()) {
      const newApproval = {
        id: Date.now(),
        users: selectedApprovalUsers.trim()
      };
      setApprovalSetups([...approvalSetups, newApproval]);
      setSelectedApprovalUsers('');
    } else if (selectedCategory === 'Secondary Category' && categoryName.trim()) {
      const newSecondaryCategory = {
        id: Date.now(),
        name: categoryName.trim()
      };
      setSecondaryCategories([...secondaryCategories, newSecondaryCategory]);
      setCategoryName('');
    } else if (selectedCategory === 'Secondary Sub Category' && categoryName.trim() && selectedSecondaryCategory) {
      const newSecondarySubCategory = {
        id: Date.now(),
        secondaryCategory: selectedSecondaryCategory,
        secondarySubCategory: categoryName.trim()
      };
      setSecondarySubCategories([...secondarySubCategories, newSecondarySubCategory]);
      setCategoryName('');
    }
  };
  const handleEdit = (item: any, type: string) => {
    setEditingItem({
      ...item,
      type
    });
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
  return <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Incidents Setup</h1>

      <div className="flex gap-8">
        {/* Left Side - Category Menu */}
        <div className="w-80">
          <div className="space-y-1 bg-gray-100 p-2 rounded-lg">
            {menuItems.map(item => <div key={item} onClick={() => setSelectedCategory(item)} className={`px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors ${selectedCategory === item ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:bg-white/50'}`}>
                {item}
              </div>)}
          </div>
        </div>

        {/* Right Side - Form and Table */}
        {selectedCategory !== 'Incident Disclaimer' && (
          <div className="flex-1">
            {isEditing ? (
              /* Edit Form Modal */
              <div className="bg-white p-8 rounded-lg border shadow-sm max-w-2xl">
                <h2 className="text-lg font-semibold mb-4">Edit {editingItem?.type}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {editingItem?.type === 'Escalations' ? <>
                      <TextField label="Level" fullWidth margin="normal" value={editFormData.level} onChange={e => setEditFormData({
                        ...editFormData,
                        level: e.target.value
                      })} />
                      <TextField label="Escalate In Days" fullWidth margin="normal" value={editFormData.escalateInDays} onChange={e => setEditFormData({
                        ...editFormData,
                        escalateInDays: e.target.value
                      })} />
                      <TextField label="Users" fullWidth margin="normal" value={editFormData.users} onChange={e => setEditFormData({
                        ...editFormData,
                        users: e.target.value
                      })} />
                    </> : <>
                      <TextField label="Name" fullWidth margin="normal" value={editFormData.name} onChange={e => setEditFormData({
                        ...editFormData,
                        name: e.target.value
                      })} />
                    </>}
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="ghost" onClick={handleEditBack}>
                    Back
                  </Button>
                  <Button onClick={handleEditSubmit}>Update</Button>
                </div>
              </div>
            ) : (
              /* Add/View Form and Table */
              <div className="space-y-6">
                {/* Form */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Add New {selectedCategory}</h2>
                  {selectedCategory === 'Category' && (
                    <div className="flex gap-4">
                      <Input type="text" placeholder="Category name" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Category</Button>
                    </div>
                  )}
                  {selectedCategory === 'Sub Category' && (
                    <div className="flex gap-4">
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <MuiSelect labelId="category-label" id="category-select" value={selectedParentCategory} label="Category" onChange={e => setSelectedParentCategory(e.target.value)}>
                          {categories.map(category => (
                            <MenuItem key={category.id} value={category.name}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                      <Input type="text" placeholder="Sub Category name" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Sub Category</Button>
                    </div>
                  )}
                  {selectedCategory === 'Sub Sub Category' && (
                    <div className="flex gap-4">
                      <FormControl fullWidth>
                        <InputLabel id="category-label">Category</InputLabel>
                        <MuiSelect labelId="category-label" id="category-select" value={selectedParentCategory} label="Category" onChange={e => setSelectedParentCategory(e.target.value)}>
                          {categories.map(category => (
                            <MenuItem key={category.id} value={category.name}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="subcategory-label">Sub Category</InputLabel>
                        <MuiSelect labelId="subcategory-label" id="subcategory-select" value={selectedSubCategory} label="Sub Category" onChange={e => setSelectedSubCategory(e.target.value)}>
                          {subCategories.filter(sub => sub.category === selectedParentCategory).map(sub => (
                            <MenuItem key={sub.id} value={sub.subCategory}>
                              {sub.subCategory}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                      <Input type="text" placeholder="Sub Sub Category name" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Sub Sub Category</Button>
                    </div>
                  )}
                  {selectedCategory === 'Incidence status' && (
                    <div className="flex gap-4">
                      <Input type="text" placeholder="Incidence status" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Incidence status</Button>
                    </div>
                  )}
                  {selectedCategory === 'Incidence level' && (
                    <div className="flex gap-4">
                      <Input type="text" placeholder="Incidence level" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Incidence level</Button>
                    </div>
                  )}
                  {selectedCategory === 'Escalations' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input type="text" placeholder="Level" value={selectedEscalationLevel} onChange={e => setSelectedEscalationLevel(e.target.value)} />
                      <Input type="text" placeholder="Escalate In Days" value={escalateInDays} onChange={e => setEscalateInDays(e.target.value)} />
                      <Input type="text" placeholder="Escalate to users" value={escalateToUsers} onChange={e => setEscalateToUsers(e.target.value)} />
                      <Button onClick={handleSubmit} className="md:col-span-3">Add Escalation</Button>
                    </div>
                  )}
                  {selectedCategory === 'Approval Setup' && (
                    <div className="flex gap-4">
                      <Input type="text" placeholder="Approval Users" value={selectedApprovalUsers} onChange={e => setSelectedApprovalUsers(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Approval Users</Button>
                    </div>
                  )}
                  {selectedCategory === 'Secondary Category' && (
                    <div className="flex gap-4">
                      <Input type="text" placeholder="Secondary Category" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Secondary Category</Button>
                    </div>
                  )}
                  {selectedCategory === 'Secondary Sub Category' && (
                    <div className="flex gap-4">
                      <FormControl fullWidth>
                        <InputLabel id="secondary-category-label">Secondary Category</InputLabel>
                        <MuiSelect labelId="secondary-category-label" id="secondary-category-select" value={selectedSecondaryCategory} label="Secondary Category" onChange={e => setSelectedSecondaryCategory(e.target.value)}>
                          {secondaryCategories.map(secondaryCategory => (
                            <MenuItem key={secondaryCategory.id} value={secondaryCategory.name}>
                              {secondaryCategory.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                      <Input type="text" placeholder="Secondary Sub Category" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="flex-1" />
                      <Button onClick={handleSubmit}>Add Secondary Sub Category</Button>
                    </div>
                  )}
                </div>

                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCategory === 'Category' && categories.map(category => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(category, 'Category')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(category, 'Category')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Sub Category' && subCategories.filter(sub => sub.category === selectedParentCategory).map(sub => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">{sub.subCategory}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(sub, 'Sub Category')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(sub, 'Sub Category')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Sub Sub Category' && subSubCategories.filter(subsub => subsub.subCategory === selectedSubCategory).map(subsub => (
                      <TableRow key={subsub.id}>
                        <TableCell className="font-medium">{subsub.subSubCategory}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(subsub, 'Sub Sub Category')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(subsub, 'Sub Sub Category')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Incidence status' && incidenceStatuses.map(status => (
                      <TableRow key={status.id}>
                        <TableCell className="font-medium">{status.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(status, 'Incidence status')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(status, 'Incidence status')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Incidence level' && incidenceLevels.map(level => (
                      <TableRow key={level.id}>
                        <TableCell className="font-medium">{level.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(level, 'Incidence level')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(level, 'Incidence level')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Escalations' && escalations.map(escalation => (
                      <TableRow key={escalation.id}>
                        <TableCell className="font-medium">{escalation.level}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(escalation, 'Escalations')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(escalation, 'Escalations')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Approval Setup' && approvalSetups.map(approval => (
                      <TableRow key={approval.id}>
                        <TableCell className="font-medium">{approval.users}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(approval, 'Approval Setup')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(approval, 'Approval Setup')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Secondary Category' && secondaryCategories.map(secondary => (
                      <TableRow key={secondary.id}>
                        <TableCell className="font-medium">{secondary.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(secondary, 'Secondary Category')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(secondary, 'Secondary Category')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedCategory === 'Secondary Sub Category' && secondarySubCategories.filter(secondarySub => secondarySub.secondaryCategory === selectedSecondaryCategory).map(secondarySub => (
                      <TableRow key={secondarySub.id}>
                        <TableCell className="font-medium">{secondarySub.secondarySubCategory}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(secondarySub, 'Secondary Sub Category')}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(secondarySub, 'Secondary Sub Category')}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>;
};
export default IncidentSetupDashboard;
