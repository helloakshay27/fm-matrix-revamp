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
          <div className="space-y-1 bg-gray-100 p-2 rounded-lg">
            {menuItems.map(item => <div key={item} onClick={() => setSelectedCategory(item)} className={`px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors ${selectedCategory === item ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:bg-white/50'}`}>
                {item}
              </div>)}
          </div>
        </div>

      </div>
    </div>;
};
export default IncidentSetupDashboard;