import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
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
    if (categoryName.trim()) {
      console.log('Adding category:', categoryName);
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
          <div className="space-y-1">
            {menuItems.map(item => <div key={item} onClick={() => setSelectedCategory(item)} className={`px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors ${selectedCategory === item ? 'bg-purple-100 text-purple-800' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                {item}
              </div>)}
          </div>
        </div>

        {/* Right Side - Form and Table */}
        <div className="flex-1">
          {isEditing ? (/* Edit Form Modal */
        <div className="bg-white p-8 rounded-lg border shadow-sm max-w-2xl">
              {editingItem?.type === 'Escalations' ? <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">⚙</span>
                    </div>
                    <h2 className="text-lg font-semibold text-red-500">Edit Escalation</h2>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <Select value={editFormData.level} onValueChange={value => setEditFormData({
                ...editFormData,
                level: value
              })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        {incidenceLevels.map(level => <SelectItem key={level.id} value={level.name}>
                            {level.name}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escalate In Days
                    </label>
                    <Input type="text" value={editFormData.escalateInDays} onChange={e => setEditFormData({
                ...editFormData,
                escalateInDays: e.target.value
              })} className="w-full" placeholder="Enter days" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escalate to users
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {editFormData.users.split(',').filter(user => user.trim()).map((user, index) => <div key={index} className="bg-gray-200 px-3 py-1 rounded-md flex items-center gap-2">
                            <span className="text-sm">{user.trim()}</span>
                            <button onClick={() => {
                      const userList = editFormData.users.split(',').filter(u => u.trim() !== user.trim());
                      setEditFormData({
                        ...editFormData,
                        users: userList.join(', ')
                      });
                    }} className="text-gray-500 hover:text-gray-700">
                              ×
                            </button>
                          </div>)}
                      </div>
                      <Select onValueChange={value => {
                  const currentUsers = editFormData.users ? editFormData.users.split(',').map(u => u.trim()) : [];
                  if (!currentUsers.includes(value)) {
                    const newUsers = [...currentUsers, value].filter(u => u);
                    setEditFormData({
                      ...editFormData,
                      users: newUsers.join(', ')
                    });
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

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleEditSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
                      Submit
                    </Button>
                    <Button onClick={handleEditBack} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2">
                      Back
                    </Button>
                  </div>
                </div> : <div className="space-y-6">
                  {(editingItem?.type === 'Sub Category' || editingItem?.type === 'Sub Sub Category' || editingItem?.type === 'Sub Sub Sub Category') && <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Select value={editFormData.category} onValueChange={value => setEditFormData({
                ...editFormData,
                category: value
              })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {categories.map(category => <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>}

                  {(editingItem?.type === 'Sub Sub Category' || editingItem?.type === 'Sub Sub Sub Category') && <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Category
                      </label>
                      <Select value={editFormData.subCategory} onValueChange={value => setEditFormData({
                ...editFormData,
                subCategory: value
              })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subCategories.filter(sub => sub.category === editFormData.category).map(subCategory => <SelectItem key={subCategory.id} value={subCategory.subCategory}>
                                {subCategory.subCategory}
                              </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>}

                  {editingItem?.type === 'Sub Sub Sub Category' && <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Sub Category
                      </label>
                      <Select value={editFormData.subSubCategory} onValueChange={value => setEditFormData({
                ...editFormData,
                subSubCategory: value
              })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subSubCategories.filter(subsub => subsub.category === editFormData.category && subsub.subCategory === editFormData.subCategory).map(subSubCategory => <SelectItem key={subSubCategory.id} value={subSubCategory.subSubCategory}>
                                {subSubCategory.subSubCategory}
                              </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input type="text" value={editFormData.name} onChange={e => setEditFormData({
                ...editFormData,
                name: e.target.value
              })} className="w-full" placeholder="Enter name" />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleEditSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
                      Submit
                    </Button>
                    <Button onClick={handleEditBack} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2">
                      Back
                    </Button>
                  </div>
                </div>}
            </div>) : <>
              {/* Form Section */}
              <div className="mb-6">
                <div className="flex gap-4 items-end">
                  {selectedCategory === 'Approval Setup' ? <div className="flex-1">
                      <Select value={selectedApprovalUsers} onValueChange={setSelectedApprovalUsers}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select up to 15 Options..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="Mahendra Lungare">Mahendra Lungare</SelectItem>
                          <SelectItem value="Vinayak Mane">Vinayak Mane</SelectItem>
                          <SelectItem value="Abdul A">Abdul A</SelectItem>
                          <SelectItem value="John Doe">John Doe</SelectItem>
                          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> : selectedCategory === 'Escalations' ? <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level
                        </label>
                        <Select value={selectedEscalationLevel} onValueChange={setSelectedEscalationLevel}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {incidenceLevels.map(level => <SelectItem key={level.id} value={level.name}>
                                {level.name}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Escalate In Days
                        </label>
                        <Input type="text" value={escalateInDays} onChange={e => setEscalateInDays(e.target.value)} className="w-full" placeholder="Enter days" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Escalate To Users
                        </label>
                        <Select value={escalateToUsers} onValueChange={setEscalateToUsers}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select up to 15 Options..." />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            <SelectItem value="Mahendra Lungare">Mahendra Lungare</SelectItem>
                            <SelectItem value="Vinayak Mane">Vinayak Mane</SelectItem>
                            <SelectItem value="Abdul A">Abdul A</SelectItem>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </> : selectedCategory === 'Secondary Sub Category' ? <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondry Category
                        </label>
                        <Select value={selectedSecondaryCategory} onValueChange={setSelectedSecondaryCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {secondaryCategories.map(category => <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                       <div className="flex-1">
                         <Input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full" placeholder="Enter Name" />
                       </div>
                     </> : selectedCategory === 'Secondary Sub Sub Category' ? <>
                       <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Secondry Category
                         </label>
                         <Select value={selectedSecondaryCategory} onValueChange={setSelectedSecondaryCategory}>
                           <SelectTrigger className="w-full">
                             <SelectValue placeholder="Select Category" />
                           </SelectTrigger>
                           <SelectContent className="bg-white z-50">
                             {secondaryCategories.map(category => <SelectItem key={category.id} value={category.name}>
                                 {category.name}
                               </SelectItem>)}
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Secondary Sub Category
                         </label>
                         <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                           <SelectTrigger className="w-full">
                             <SelectValue placeholder="Select Secondry Sub Category" />
                           </SelectTrigger>
                           <SelectContent className="bg-white z-50">
                             {secondarySubCategories
                               .filter(sub => sub.secondaryCategory === selectedSecondaryCategory)
                               .map(sub => <SelectItem key={sub.id} value={sub.secondarySubCategory}>
                                   {sub.secondarySubCategory}
                                 </SelectItem>)}
                           </SelectContent>
                         </Select>
                        </div>
                     </> : selectedCategory === 'Secondary Sub Sub Sub Category' ? <>
                       <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Secondary Category
                         </label>
                         <Select value={selectedSecondaryCategory} onValueChange={setSelectedSecondaryCategory}>
                           <SelectTrigger className="w-full">
                             <SelectValue placeholder="Select Category" />
                           </SelectTrigger>
                           <SelectContent className="bg-white z-50">
                             {secondaryCategories.map(category => <SelectItem key={category.id} value={category.name}>
                                 {category.name}
                               </SelectItem>)}
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Secondary Sub Category
                         </label>
                         <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                           <SelectTrigger className="w-full">
                             <SelectValue placeholder="Select Secondary Sub Category" />
                           </SelectTrigger>
                           <SelectContent className="bg-white z-50">
                             {secondarySubCategories
                               .filter(sub => sub.secondaryCategory === selectedSecondaryCategory)
                               .map(sub => <SelectItem key={sub.id} value={sub.secondarySubCategory}>
                                   {sub.secondarySubCategory}
                                 </SelectItem>)}
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Secondary Sub Sub Category
                         </label>
                         <Select>
                           <SelectTrigger className="w-full">
                             <SelectValue placeholder="Select Secondary Sub Category" />
                           </SelectTrigger>
                           <SelectContent className="bg-white z-50">
                             <SelectItem value="Fire Prevention">Fire Prevention</SelectItem>
                             <SelectItem value="System Malfunction">System Malfunction</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                     </> : selectedCategory === 'Who got injured' ? <>
                       <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Name
                         </label>
                         <Input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full" placeholder="Enter Name" />
                       </div>
                     </> : selectedCategory === 'Property Damage Category' ? <>
                       <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 mb-1">
                           Name
                         </label>
                         <Input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full" placeholder="Enter Name" />
                       </div>
                    </> : selectedCategory === 'Sub Category' || selectedCategory === 'Sub Sub Category' || selectedCategory === 'Sub Sub Sub Category' ? <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <Select value={selectedParentCategory} onValueChange={setSelectedParentCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {categories.map(category => <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div> : null}
                  {(selectedCategory === 'Sub Sub Category' || selectedCategory === 'Sub Sub Sub Category') && <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Category
                      </label>
                      <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subCategories.filter(sub => sub.category === selectedParentCategory).map(subCategory => <SelectItem key={subCategory.id} value={subCategory.subCategory}>
                                {subCategory.subCategory}
                              </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>}
                  {selectedCategory === 'Sub Sub Sub Category' && <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Sub Category
                      </label>
                      <Select value={editFormData.subSubCategory} onValueChange={value => setEditFormData({
                  ...editFormData,
                  subSubCategory: value
                })}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subSubCategories.filter(subsub => subsub.category === selectedParentCategory && subsub.subCategory === selectedSubCategory).map(subSubCategory => <SelectItem key={subSubCategory.id} value={subSubCategory.subSubCategory}>
                                {subSubCategory.subSubCategory}
                              </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>}
                  {selectedCategory !== 'Escalations' && <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <Input type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full" placeholder="Enter name" />
                    </div>}
                  <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                    Submit
                  </Button>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {selectedCategory === 'Secondary Sub Category' ? <>
                          <TableHead>Secondary Category</TableHead>
                          <TableHead>Secondry Sub Category</TableHead>
                          <TableHead>Action</TableHead>
                         </> : selectedCategory === 'Secondary Sub Sub Category' ? <>
                           <TableHead>Secondary Category</TableHead>
                           <TableHead>Secondary Sub Category</TableHead>
                           <TableHead>Secondary Sub Sub Category</TableHead>
                           <TableHead>Action</TableHead>
                          </> : selectedCategory === 'Secondary Sub Sub Sub Category' ? <>
                            <TableHead>Secondary Category</TableHead>
                            <TableHead>Secondary Sub Category</TableHead>
                            <TableHead>Secondary Sub Sub Category</TableHead>
                            <TableHead>Secondary Sub Sub Sub Category</TableHead>
                             <TableHead>Action</TableHead>
                           </> : selectedCategory === 'Who got injured' ? <>
                             <TableHead>Name</TableHead>
                             <TableHead>Action</TableHead>
                            </> : selectedCategory === 'Property Damage Category' ? <>
                              <TableHead>Name</TableHead>
                              <TableHead>Action</TableHead>
                            </> : selectedCategory === 'Approval Setup' ? <>
                              <TableHead>Users</TableHead>
                              <TableHead>Action</TableHead>
                        </> : selectedCategory === 'Escalations' ? <>
                          <TableHead>Level</TableHead>
                          <TableHead>Escalate In Days</TableHead>
                          <TableHead>Users</TableHead>
                          <TableHead>Action</TableHead>
                        </> : selectedCategory === 'Sub Sub Sub Category' ? <>
                          <TableHead>Category</TableHead>
                          <TableHead>Sub Category</TableHead>
                          <TableHead>Sub Sub Category</TableHead>
                          <TableHead>Sub Sub Sub Category</TableHead>
                          <TableHead>Action</TableHead>
                        </> : selectedCategory === 'Sub Sub Category' ? <>
                          <TableHead>Category</TableHead>
                          <TableHead>Sub Category</TableHead>
                          <TableHead>Sub Sub Category</TableHead>
                          <TableHead>Action</TableHead>
                        </> : selectedCategory === 'Sub Category' ? <>
                          <TableHead>Category</TableHead>
                          <TableHead>Sub Category</TableHead>
                          <TableHead>Action</TableHead>
                        </> : <>
                          <TableHead>Name</TableHead>
                          <TableHead>Action</TableHead>
                        </>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCategory === 'Secondary Sub Category' ? secondarySubCategories.map(secondarySub => <TableRow key={secondarySub.id}>
                          <TableCell>{secondarySub.secondaryCategory}</TableCell>
                          <TableCell>{secondarySub.secondarySubCategory}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(secondarySub, 'Secondary Sub Category')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(secondarySub, 'Secondary Sub Category')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                          </TableRow>) : selectedCategory === 'Secondary Sub Sub Category' ? [
                            { id: 1, secondaryCategory: 'Safety Risk', secondarySubCategory: 'Fire Safety', secondarySubSubCategory: 'Fire Prevention' },
                            { id: 2, secondaryCategory: 'Operational Risk', secondarySubCategory: 'Process Failure', secondarySubSubCategory: 'System Malfunction' }
                          ].map(item => <TableRow key={item.id}>
                            <TableCell>{item.secondaryCategory}</TableCell>
                            <TableCell>{item.secondarySubCategory}</TableCell>
                            <TableCell>{item.secondarySubSubCategory}</TableCell>
                           <TableCell>
                             <div className="flex gap-2">
                               <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                 <Edit className="w-4 h-4" />
                               </Button>
                               <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                 <Trash2 className="w-4 h-4" />
                               </Button>
                             </div>
                           </TableCell>
                          </TableRow>) : selectedCategory === 'Secondary Sub Sub Sub Category' ? [
                            { id: 1, secondaryCategory: 'Safety Risk', secondarySubCategory: 'Fire Safety', secondarySubSubCategory: 'Fire Prevention', secondarySubSubSubCategory: 'Alarm Systems' },
                            { id: 2, secondaryCategory: 'Operational Risk', secondarySubCategory: 'Process Failure', secondarySubSubCategory: 'System Malfunction', secondarySubSubSubCategory: 'Hardware Issues' }
                          ].map(item => <TableRow key={item.id}>
                            <TableCell>{item.secondaryCategory}</TableCell>
                            <TableCell>{item.secondarySubCategory}</TableCell>
                            <TableCell>{item.secondarySubSubCategory}</TableCell>
                            <TableCell>{item.secondarySubSubSubCategory}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                           </TableRow>) : selectedCategory === 'Who got injured' ? [
                             { id: 1, name: 'Employee' },
                             { id: 2, name: 'Contractor' },
                             { id: 3, name: 'Visitor' }
                           ].map(item => <TableRow key={item.id}>
                             <TableCell>{item.name}</TableCell>
                             <TableCell>
                               <div className="flex gap-2">
                                 <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                   <Edit className="w-4 h-4" />
                                 </Button>
                                 <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                   <Trash2 className="w-4 h-4" />
                                 </Button>
                               </div>
                             </TableCell>
                            </TableRow>) : selectedCategory === 'Property Damage Category' ? [
                              { id: 1, name: 'Building Damage' },
                              { id: 2, name: 'Equipment Damage' },
                              { id: 3, name: 'Vehicle Damage' }
                            ].map(item => <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>) : selectedCategory === 'Approval Setup' ? approvalSetups.map(approval => <TableRow key={approval.id}>
                          <TableCell>{approval.users}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(approval, 'Approval Setup')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(approval, 'Approval Setup')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : selectedCategory === 'Escalations' ? escalations.map(escalation => <TableRow key={escalation.id}>
                          <TableCell>{escalation.level}</TableCell>
                          <TableCell>{escalation.escalateInDays}</TableCell>
                          <TableCell>{escalation.users}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(escalation, 'Escalations')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(escalation, 'Escalations')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : selectedCategory === 'Secondary Category' ? secondaryCategories.map(secondary => <TableRow key={secondary.id}>
                          <TableCell>{secondary.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(secondary, 'Secondary Category')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(secondary, 'Secondary Category')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : selectedCategory === 'Incidence level' ? incidenceLevels.map(level => <TableRow key={level.id}>
                          <TableCell>{level.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(level, 'Incidence level')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(level, 'Incidence level')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : selectedCategory === 'Incidence status' ? incidenceStatuses.map(status => <TableRow key={status.id}>
                          <TableCell>{status.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(status, 'Incidence status')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(status, 'Incidence status')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : selectedCategory === 'Sub Sub Sub Category' ? subSubSubCategories.map(item => <TableRow key={item.id}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.subCategory}</TableCell>
                          <TableCell>{item.subSubCategory}</TableCell>
                          <TableCell>{item.subSubSubCategory}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Sub Sub Sub Category')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Sub Sub Sub Category')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : selectedCategory === 'Sub Sub Category' ? subSubCategories.map(item => <TableRow key={item.id}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.subCategory}</TableCell>
                          <TableCell>{item.subSubCategory}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Sub Sub Category')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Sub Sub Category')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : selectedCategory === 'Sub Category' ? subCategories.map(item => <TableRow key={item.id}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.subCategory}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Sub Category')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Sub Category')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>) : categories.map(category => <TableRow key={category.id}>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(category, 'Category')}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(category, 'Category')}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>)}
                  </TableBody>
                </Table>
              </div>
            </>}
        </div>
      </div>
    </div>;
};
export default IncidentSetupDashboard;