import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { TextField, Select as MuiSelect, MenuItem, FormControl, InputLabel, Chip, OutlinedInput, Box } from '@mui/material';
import { toast } from 'sonner';

export const IncidentSetupDashboard = () => {
  // Get baseUrl and token from localStorage, ensure baseUrl starts with https://
  let baseUrl = localStorage.getItem('baseUrl') || '';
  const token = localStorage.getItem('token') || '';
  if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
  }

  // Fetch SubSubSubCategories from API and map with category, subcategory, and subsubcategory names
  const fetchSubSubSubCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const allCategories = result.data.filter(item => item.tag_type === 'IncidenceCategory');
        const allSubCategories = result.data.filter(item => item.tag_type === 'IncidenceSubCategory');
        const allSubSubCategories = result.data.filter(item => item.tag_type === 'IncidenceSubSubCategory');
        const subSubSubCats = result.data
          .filter(item => item.tag_type === 'IncidenceSubSubSubCategory')
          .map(item => {
            const parentSubSub = allSubSubCategories.find(subsub => subsub.id === item.parent_id);
            const parentSub = parentSubSub ? allSubCategories.find(sub => sub.id === parentSubSub.parent_id) : null;
            const parentCat = parentSub ? allCategories.find(cat => cat.id === parentSub.parent_id) : null;
            return {
              id: item.id,
              category: parentCat ? parentCat.name : '',
              subCategory: parentSub ? parentSub.name : '',
              subSubCategory: parentSubSub ? parentSubSub.name : '',
              subSubSubCategory: item.name
            };
          });
        setSubSubSubCategories(subSubSubCats);
      } else {
        console.error('Failed to fetch sub sub sub categories');
      }
    } catch (error) {
      console.error('Error fetching sub sub sub categories:', error);
    }
  };
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  // Track selected Sub Sub Category (id) for creating Sub Sub Sub Category
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    category: '',
    subCategory: '',
    subSubCategory: '',
    name: '',
    level: '',
    escalateInDays: '',
    users: ''
  });
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subSubCategories, setSubSubCategories] = useState([]);
  console.log(subSubCategories)
  const [subSubSubCategories, setSubSubSubCategories] = useState([{
    id: 1,
    category: 'risks',
    subCategory: 'data',
    subSubCategory: 'data I',
    subSubSubCategory: 'data I-A'
  }]);
  const [incidenceStatuses, setIncidenceStatuses] = useState([]);
  const [incidenceLevels, setIncidenceLevels] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [escalationMatrix, setEscalationMatrix] = useState([]);
  // Fetch Escalations from API
  // Only use /pms/incidence_tags.json?q[tag_type_eq]=EscaltionMatrix for escalations GET
  const fetchEscalations = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Map API data to local escalation format
        const mapped = (result.data || []).map(item => ({
          id: item.id,
          level: item.name,
          escalateInDays: item.after_days ? String(item.after_days) : '',
          users: Array.isArray(item.escalate_to_users) ? item.escalate_to_users.join(', ') : ''
        }));
        setEscalations(mapped);
      } else {
        setEscalations([]);
      }
    } catch (error) {
      setEscalations([]);
    }
  };

  // Fetch Escalation Matrix from API
  const fetchEscalationMatrix = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags/get_escalation_matrix.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Extract escalation_matrix from the response
        setEscalationMatrix(result.escalation_matrix || []);
        toast.success('Escalation matrix loaded successfully');
      } else {
        console.error('Failed to fetch escalation matrix');
        toast.error('Failed to load escalation matrix');
        setEscalationMatrix([]);
      }
    } catch (error) {
      console.error('Error fetching escalation matrix:', error);
      toast.error('Error loading escalation matrix');
      setEscalationMatrix([]);
    }
  };

  const [selectedEscalationLevel, setSelectedEscalationLevel] = useState('');
  const [escalateInDays, setEscalateInDays] = useState('');
  const [escalateToUsers, setEscalateToUsers] = useState([]);
  const [approvalSetups, setApprovalSetups] = useState([{
    id: 1,
    users: 'Mahendra Lungare, Vinayak Mane'
  }, {
    id: 2,
    users: 'Abdul A, John Doe'
  }]);
  const [selectedApprovalUsers, setSelectedApprovalUsers] = useState([]);
  const [existingApprovalSetupId, setExistingApprovalSetupId] = useState(null);
  const [secondaryCategories, setSecondaryCategories] = useState([]);
  const [secondarySubCategories, setSecondarySubCategories] = useState([]);
  const [selectedSecondaryCategory, setSelectedSecondaryCategory] = useState('');
  const [selectedSecondarySubCategory, setSelectedSecondarySubCategory] = useState('');
  const [secondarySubSubCategories, setSecondarySubSubCategories] = useState([]);
  // Fetch Secondary Sub Sub Categories from API
  const fetchSecondarySubSubCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Use API data for parent lookups
        const allSecondaryCategories = (result.data || []).filter(item => item.tag_type === 'IncidenceSecondaryCategory');
        const allSecondarySubCategories = (result.data || []).filter(item => item.tag_type === 'IncidenceSecondarySubCategory');
        const subSubCats = (result.data || [])
          .filter(item => item.tag_type === 'IncidenceSecondarySubSubCategory')
          .map(item => {
            const subCat = allSecondarySubCategories.find(sub => sub.id === item.parent_id);
            const cat = subCat ? allSecondaryCategories.find(cat => cat.id === subCat.parent_id) : null;
            return {
              id: item.id,
              secondaryCategory: cat?.name || '',
              secondarySubCategory: subCat?.name || '',
              secondarySubSubCategory: item.name
            };
          });
        setSecondarySubSubCategories(subSubCats);
      } else {
        setSecondarySubSubCategories([]);
        console.error('Failed to fetch secondary sub sub categories');
      }
    } catch (error) {
      setSecondarySubSubCategories([]);
      console.error('Error fetching secondary sub sub categories:', error);
    }
  };
  const [secondarySubSubSubCategories, setSecondarySubSubSubCategories] = useState([{
    id: 1,
    secondaryCategory: '',
    secondarySubCategory: '',
    secondarySubSubCategory: '',
    secondarySubSubSubCategory: 'test'
  }]);

  // Fetch Secondary Sub Sub Sub Categories from API (Secondary hierarchy)
  const fetchSecondarySubSubSubCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Use API data for parent lookups in the Secondary hierarchy
        const allSecondaryCategories = (result.data || []).filter(item => item.tag_type === 'IncidenceSecondaryCategory');
        const allSecondarySubCategories = (result.data || []).filter(item => item.tag_type === 'IncidenceSecondarySubCategory');
        const allSecondarySubSubCategories = (result.data || []).filter(item => item.tag_type === 'IncidenceSecondarySubSubCategory');
        const subSubSubCats = (result.data || [])
          .filter(item => item.tag_type === 'IncidenceSecondarySubSubSubCategory')
          .map(item => {
            const subSubCat = allSecondarySubSubCategories.find(subsub => subsub.id === item.parent_id);
            const subCat = subSubCat ? allSecondarySubCategories.find(sub => sub.id === subSubCat.parent_id) : null;
            const cat = subCat ? allSecondaryCategories.find(cat => cat.id === subCat.parent_id) : null;
            return {
              id: item.id,
              secondaryCategory: cat?.name || '',
              secondarySubCategory: subCat?.name || '',
              secondarySubSubCategory: subSubCat?.name || '',
              secondarySubSubSubCategory: item.name
            };
          });
        setSecondarySubSubSubCategories(subSubSubCats);
      } else {
        setSecondarySubSubSubCategories([]);
        console.error('Failed to fetch secondary sub sub sub categories');
      }
    } catch (error) {
      setSecondarySubSubSubCategories([]);
      console.error('Error fetching secondary sub sub sub categories:', error);
    }
  };
  const [selectedSecondarySubSubCategory, setSelectedSecondarySubSubCategory] = useState('');
  const [whoGotInjured, setWhoGotInjured] = useState([]);
  const [propertyDamageCategories, setPropertyDamageCategories] = useState([]);
  const [rcaCategories, setRcaCategories] = useState([]);
  const [escalateToUsersList, setEscalateToUsersList] = useState([]);
  const menuItems = ['Category', 'Sub Category', 'Sub Sub Category', 'Sub Sub Sub Category', 'Incidence status', 'Incidence level', 'Escalations', 'Approval Setup', 'Secondary Category', 'Secondary Sub Category', 'Secondary Sub Sub Category', 'Secondary Sub Sub Sub Category', 'Who got injured', 'Property Damage Category', 'RCA Category', 'Incident Disclaimer'];




  // Fetch SubCategories from API and map with parent category name
  const fetchSubCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Get all categories for mapping parent name
        const allCategories = result.data.filter(item => item.tag_type === 'IncidenceCategory');
        const subCats = result.data
          .filter(item => item.tag_type === 'IncidenceSubCategory')
          .map(item => {
            const parent = allCategories.find(cat => cat.id === item.parent_id);
            return {
              id: item.id,
              category: parent ? parent.name : '',
              categoryId: parent ? parent.id : '',
              subCategory: item.name
            };
          });
        setSubCategories(subCats);
      } else {
        console.error('Failed to fetch sub categories');
      }
    } catch (error) {
      console.error('Error fetching sub categories:', error);
    }
  };

  // Fetch SubSubCategories from API and map with category and subcategory names
  const fetchSubSubCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const allCategories = result.data.filter(item => item.tag_type === 'IncidenceCategory');
        const allSubCategories = result.data.filter(item => item.tag_type === 'IncidenceSubCategory');
        const subSubCats = result.data
          .filter(item => item.tag_type === 'IncidenceSubSubCategory')
          .map(item => {
            const parentSub = allSubCategories.find(sub => sub.id === item.parent_id);
            const parentCat = parentSub ? allCategories.find(cat => cat.id === parentSub.parent_id) : null;
            return {
              id: item.id,
              category: parentCat ? parentCat.name : '',
              categoryId: parentCat ? parentCat.id : '',
              subCategory: parentSub ? parentSub.name : '',
              subCategoryId: parentSub ? parentSub.id : '',
              subSubCategory: item.name
            };
          });
        setSubSubCategories(subSubCats);
      } else {
        console.error('Failed to fetch sub sub categories');
      }
    } catch (error) {
      console.error('Error fetching sub sub categories:', error);
    }
  };

  const fetchIncidenceStatuses = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const statuses = result.data
          .filter(item => item.tag_type === 'IncidenceStatus')
          .map(({ id, name }) => ({ id, name }));
        setIncidenceStatuses(statuses);
      } else {
        console.error('Failed to fetch incidence statuses');
      }
    } catch (error) {
      console.error('Error fetching incidence statuses:', error);
    }
  };

  const fetchIncidenceLevels = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const levels = result.data
          .filter(item => item.tag_type === 'IncidenceLevel')
          .map(({ id, name }) => ({ id, name }));
        setIncidenceLevels(levels);
      } else {
        console.error('Failed to fetch incidence levels');
      }
    } catch (error) {
      console.error('Error fetching incidence levels:', error);
    }
  };

  const fetchSecondaryCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const filtered = result.data
          .filter(item => item.tag_type === 'IncidenceSecondaryCategory' && item.parent_id === null)
          .map(({ id, name }) => ({ id, name }));
        setSecondaryCategories(filtered);
      } else {
        console.error('Failed to fetch secondary categories');
      }
    } catch (error) {
      console.error('Error fetching secondary categories:', error);
    }
  };

  const fetchSecondarySubCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const allSecondaryCategories = result.data.filter(item => item.tag_type === 'IncidenceSecondaryCategory');
        const secondarySubCats = result.data
          .filter(item => item.tag_type === 'IncidenceSecondarySubCategory')
          .map(item => {
            const parent = allSecondaryCategories.find(cat => cat.id === item.parent_id);
            return {
              id: item.id,
              secondaryCategory: parent ? parent.name : '',
              secondarySubCategory: item.name
            };
          });
        setSecondarySubCategories(secondarySubCats);
      } else {
        console.error('Failed to fetch secondary sub categories');
      }
    } catch (error) {
      console.error('Error fetching secondary sub categories:', error);
    }
  };

  // Fetch RCACategory data from API
  const fetchRCACategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Map the API response correctly for RCA categories
        const rcaTypes = (result.data || [])
          .filter(item => item.tag_type === 'RCACategory')
          .map(item => ({ id: item.id, name: item.name }));
        setRcaCategories(rcaTypes);
      } else {
        console.error('Failed to fetch RCA categories');
      }
    } catch (error) {
      console.error('Error fetching RCA categories:', error);
    }
  };

  // Fetch PropertyDamageCategory data from API
  const fetchPropertyDamageCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const propertyDamageTypes = result.data
          .filter(item => item.tag_type === 'PropertyDamageCategory')
          .map(({ id, name }) => ({ id, name }));
        setPropertyDamageCategories(propertyDamageTypes);
      } else {
        console.error('Failed to fetch property damage categories');
      }
    } catch (error) {
      console.error('Error fetching property damage categories:', error);
    }
  };
  // Fetch InjuredType data from API
  const fetchWhoGotInjured = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const injuredTypes = result.data
          .filter(item => item.tag_type === 'InjuredType')
          .map(({ id, name }) => ({ id, name }));
        setWhoGotInjured(injuredTypes);
      } else {
        console.error('Failed to fetch injured types');
      }
    } catch (error) {
      console.error('Error fetching injured types:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const filteredCategories = result.data
          .filter(item => item.tag_type === 'IncidenceCategory' && item.parent_id === null)
          .map(({ id, name }) => ({ id, name }));
        setCategories(filteredCategories);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  const fetchEscalateToUsers = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/users/get_escalate_to_users.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setEscalateToUsersList(result.users || []);
      } else {
        console.error('Failed to fetch escalate to users');
      }
    } catch (error) {
      console.error('Error fetching escalate to users:', error);
    }
  };

  const fetchApprovalSetups = async () => {
    try {
      const response = await fetch(`${baseUrl}/pms/incidence_tags.json?tag_type=ApprovalSetup`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        // Since we're filtering by tag_type in the URL, all data should be ApprovalSetup
        const approvalSetupData = result.data || [];

        // Extract user IDs from the name field (comma-separated string) of the most recent ApprovalSetup entry
        if (approvalSetupData.length > 0) {
          const latestApprovalSetup = approvalSetupData[approvalSetupData.length - 1];
          const nameString = latestApprovalSetup.name || '';
          // Split comma-separated string into array and convert to string array for dropdown
          const userIds = nameString ? nameString.split(',').map(id => id.trim()) : [];
          setSelectedApprovalUsers(userIds);
          setExistingApprovalSetupId(latestApprovalSetup.id);
        } else {
          // If no existing approval setup, clear the selection
          setSelectedApprovalUsers([]);
          setExistingApprovalSetupId(null);
        }

        // Also update the approvalSetups state for the table display
        const approvalSetupsForTable = approvalSetupData.map(setup => ({
          id: setup.id,
          users: setup.name ? setup.name.split(',').map(userId => {
            // Find user in escalateToUsersList
            const user = escalateToUsersList.find(u => String(u.id) === userId.trim());
            return user ? user.full_name : `User ID: ${userId.trim()}`;
          }).join(', ') : 'No users selected'
        }));
        setApprovalSetups(approvalSetupsForTable);
      } else {
        console.error('Failed to fetch approval setups');
      }
    } catch (error) {
      console.error('Error fetching approval setups:', error);
    }
  };
  useEffect(() => {
    if (selectedCategory === 'Category') {
      fetchCategories();
    } else if (selectedCategory === 'Sub Category') {
      fetchCategories();
      fetchSubCategories();
    } else if (selectedCategory === 'Sub Sub Category') {
      fetchCategories();
      fetchSubCategories();
      fetchSubSubCategories();
    } else if (selectedCategory === 'Sub Sub Sub Category') {
      fetchCategories();
      fetchSubCategories();
      fetchSubSubCategories();
      fetchSubSubSubCategories();
    } else if (selectedCategory === 'Secondary Category') {
      fetchSecondaryCategories();
    } else if (selectedCategory === 'Secondary Sub Category') {
      fetchSecondaryCategories();
      fetchSecondarySubCategories();
    } else if (selectedCategory === 'Secondary Sub Sub Category') {
      fetchSecondaryCategories();
      fetchSecondarySubCategories();
      fetchSecondarySubSubCategories();
    } else if (selectedCategory === 'Secondary Sub Sub Sub Category') {
      fetchSecondaryCategories();
      fetchSecondarySubCategories();
      fetchSecondarySubSubCategories();
      fetchSecondarySubSubSubCategories();
    } else if (selectedCategory === 'Who got injured') {
      fetchWhoGotInjured();
    } else if (selectedCategory === 'Property Damage Category') {
      fetchPropertyDamageCategories();
    } else if (selectedCategory === 'Incidence status') {
      fetchIncidenceStatuses();
    } else if (selectedCategory === 'Incidence level') {
      fetchIncidenceLevels();
    } else if (selectedCategory === 'RCA Category') {
      fetchRCACategories();
    } else if (selectedCategory === 'Escalations') {
      fetchIncidenceLevels();
      fetchEscalateToUsers();
      fetchEscalations();
      fetchEscalationMatrix();
    } else if (selectedCategory === 'Approval Setup') {
      fetchEscalateToUsers();
    }
  }, [selectedCategory]);

  // Fetch approval setups after escalateToUsersList is loaded
  useEffect(() => {
    if (selectedCategory === 'Approval Setup' && escalateToUsersList.length > 0) {
      fetchApprovalSetups();
    } else if (selectedCategory !== 'Approval Setup') {
      // Clear approval users selection when switching away from Approval Setup tab
      setSelectedApprovalUsers([]);
      setExistingApprovalSetupId(null);
    }
  }, [selectedCategory, escalateToUsersList]);


  const handleSubmit = async () => {
    // Validation logic - check if all required fields are filled
    const validateFields = () => {
      if (selectedCategory === 'Category') {
        if (!categoryName.trim()) return false;
      } else if (selectedCategory === 'Sub Category') {
        if (!selectedParentCategory || !categoryName.trim()) return false;
      } else if (selectedCategory === 'Sub Sub Category') {
        if (!selectedParentCategory || !selectedSubCategory || !categoryName.trim()) return false;
      } else if (selectedCategory === 'Sub Sub Sub Category') {
        if (!selectedParentCategory || !selectedSubCategory || !selectedSubSubCategory || !categoryName.trim()) return false;
      } else if (selectedCategory === 'Incidence status') {
        if (!categoryName.trim()) return false;
      } else if (selectedCategory === 'Incidence level') {
        if (!categoryName.trim()) return false;
      } else if (selectedCategory === 'Escalations') {
        if (!selectedEscalationLevel || !escalateInDays || escalateToUsers.length === 0) return false;
      } else if (selectedCategory === 'Approval Setup') {
        if (selectedApprovalUsers.length === 0) return false;
      } else if (selectedCategory === 'Secondary Category') {
        if (!categoryName.trim()) return false;
      } else if (selectedCategory === 'Secondary Sub Category') {
        if (!selectedSecondaryCategory || !categoryName.trim()) return false;
      } else if (selectedCategory === 'Secondary Sub Sub Category') {
        if (!selectedSecondaryCategory || !selectedSecondarySubCategory || !categoryName.trim()) return false;
      } else if (selectedCategory === 'Secondary Sub Sub Sub Category') {
        if (!selectedSecondaryCategory || !selectedSecondarySubCategory || !selectedSecondarySubSubCategory || !categoryName.trim()) return false;
      } else if (selectedCategory === 'Who got injured') {
        if (!categoryName.trim()) return false;
      } else if (selectedCategory === 'Property Damage Category') {
        if (!categoryName.trim()) return false;
      } else if (selectedCategory === 'RCA Category') {
        if (!categoryName.trim()) return false;
      }
      return true;
    };

    // Show toast error if validation fails
    if (!validateFields()) {
      toast.error("Please fill all required fields.");
      return;
    }

    const newId = Math.max(...(
      selectedCategory === 'Category' ? categories.map(c => c.id) :
        selectedCategory === 'Sub Category' ? subCategories.map(s => s.id) :
          selectedCategory === 'Sub Sub Category' ? subSubCategories.map(s => s.id) :
            selectedCategory === 'Sub Sub Sub Category' ? subSubSubCategories.map(s => s.id) :
              selectedCategory === 'Incidence status' ? incidenceStatuses.map(s => s.id) :
                selectedCategory === 'Incidence level' ? incidenceLevels.map(l => l.id) :
                  selectedCategory === 'Escalations' ? escalations.map(e => e.id) :
                    selectedCategory === 'Approval Setup' ? approvalSetups.map(a => a.id) :
                      selectedCategory === 'Secondary Category' ? secondaryCategories.map(s => s.id) :
                        selectedCategory === 'Secondary Sub Category' ? secondarySubCategories.map(s => s.id) :
                          selectedCategory === 'Secondary Sub Sub Category' ? secondarySubSubCategories.map(s => s.id) :
                            selectedCategory === 'Secondary Sub Sub Sub Category' ? secondarySubSubSubCategories.map(s => s.id) :
                              [0]
    )) + 1;

    if (selectedCategory === 'Category') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              tag_type: 'IncidenceCategory',
              active: true,
              name: categoryName
            }
          })
        });

        if (response.ok) {
          await fetchCategories();
          setCategoryName('');
        } else {
          console.error('Failed to add category:', response.statusText);
          alert('Failed to add category. Please try again.');
        }
      } catch (error) {
        console.error('Error adding category:', error);
        alert('An error occurred while adding the category.');
      }
    } else if (selectedCategory === 'Sub Category') {
      // Use selectedParentCategory as the id directly
      if (selectedParentCategory && categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'IncidenceSubCategory',
                active: true,
                parent_id: selectedParentCategory,
                name: categoryName
              }
            })
          });
          if (response.ok) {
            // Always refetch subcategories from API to show latest data
            await fetchSubCategories();
            setCategoryName('');
          } else {
            console.error('Failed to add sub category:', response.statusText);
            alert('Failed to add sub category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding sub category:', error);
          alert('An error occurred while adding the sub category.');
        }
      }
    } else if (selectedCategory === 'Sub Sub Category') {
      // Use selectedParentCategory as category_id and selectedSubCategory as parent_id
      if (selectedParentCategory && selectedSubCategory && categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'IncidenceSubSubCategory',
                active: true,
                parent_id: selectedSubCategory,
                name: categoryName
              },
              category_id: selectedParentCategory
            })
          });
          if (response.ok) {
            // Always refetch sub sub categories from API to show latest data
            await fetchSubSubCategories();
            setCategoryName('');
          } else {
            console.error('Failed to add sub sub category:', response.statusText);
            alert('Failed to add sub sub category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding sub sub category:', error);
          alert('An error occurred while adding the sub sub category.');
        }
      }
    } else if (selectedCategory === 'Sub Sub Sub Category') {
      // Use selectedParentCategory as category_id and selectedSubSubCategory (id) as parent_id
      if (selectedParentCategory && selectedSubCategory && selectedSubSubCategory && categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'IncidenceSubSubSubCategory',
                active: true,
                parent_id: selectedSubSubCategory,
                name: categoryName
              },
              category_id: selectedParentCategory
            })
          });
          if (response.ok) {
            await fetchSubSubSubCategories();
            setCategoryName('');
            setSelectedSubSubCategory('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add sub sub sub category:', response.status, errorText);
            alert('Failed to add sub sub sub category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding sub sub sub category:', error);
          alert('An error occurred while adding the sub sub sub category.');
        }
      }
    } else if (selectedCategory === 'Incidence status') {
      try {
        // Only send the required fields, do not include 'type' or any extra property
        const body = {
          incidence_tag: {
            tag_type: 'IncidenceStatus',
            active: true,
            name: categoryName
          }
        };
        const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          await fetchIncidenceStatuses();
          setCategoryName('');
        } else {
          const errorText = await response.text();
          console.error('Failed to add incidence status:', response.status, errorText);
          alert('Failed to add incidence status. Please try again.');
        }
      } catch (error) {
        console.error('Error adding incidence status:', error);
        alert('An error occurred while adding the incidence status.');
      }
    } else if (selectedCategory === 'Incidence level') {
      try {
        const body = {
          incidence_tag: {
            tag_type: 'IncidenceLevel',
            active: true,
            name: categoryName
          }
        };
        const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
        if (response.ok) {
          await fetchIncidenceLevels();
          setCategoryName('');
        } else {
          const errorText = await response.text();
          console.error('Failed to add incidence level:', response.status, errorText);
          alert('Failed to add incidence level. Please try again.');
        }
      } catch (error) {
        console.error('Error adding incidence level:', error);
        alert('An error occurred while adding the incidence level.');
      }
    } else if (selectedCategory === 'Escalations') {
      if (selectedEscalationLevel && escalateInDays && escalateToUsers.length > 0) {
        try {
          const usersArray = Array.isArray(escalateToUsers) ? escalateToUsers : [];
          const payload = {
            escalation_matrix: {
              name: selectedEscalationLevel,
              after_days: Number(escalateInDays),
              escalate_to_users: usersArray
            }
          };
          const response = await fetch(`${baseUrl}/pms/add_escalation.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          });
          if (response.ok) {
            await fetchEscalations();
            setSelectedEscalationLevel('');
            setEscalateInDays('');
            setEscalateToUsers([]);
          } else {
            const errorText = await response.text();
            // Enhanced error logging for debugging
            console.error('Failed to add escalation:', {
              status: response.status,
              statusText: response.statusText,
              url: response.url,
              token,
              payload,
              errorText
            });
            alert(`Failed to add escalation. Status: ${response.status} - ${response.statusText}\n${errorText}`);
          }
        } catch (error) {
          console.error('Error adding escalation:', error);
          alert('An error occurred while adding the escalation.');
        }
      }
    } else if (selectedCategory === 'Approval Setup') {
      if (selectedApprovalUsers.length > 0) {
        try {
          // Determine if we're updating existing or creating new
          const isUpdate = existingApprovalSetupId !== null;
          const url = isUpdate
            ? `${baseUrl}/pms/incidence_tags/${existingApprovalSetupId}.json`
            : `${baseUrl}/pms/incidence_tags.json`;
          const method = isUpdate ? 'PUT' : 'POST';

          // Convert user IDs array to comma-separated string
          const userIdsString = selectedApprovalUsers.join(',');

          const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'ApprovalSetup',
                active: 1,
                name: userIdsString
              }
            })
          });

          if (response.ok) {
            // Refresh the approval setups data from the server
            await fetchApprovalSetups();
            toast.success(`Approval setup ${isUpdate ? 'updated' : 'created'} successfully!`);
          } else {
            const errorText = await response.text();
            console.error(`Failed to ${isUpdate ? 'update' : 'create'} approval setup:`, response.status, errorText);
            toast.error(`Failed to ${isUpdate ? 'update' : 'create'} approval setup. Please try again.`);
          }
        } catch (error) {
          console.error('Error saving approval setup:', error);
          toast.error('An error occurred while saving the approval setup.');
        }
      }
    } else if (selectedCategory === 'Secondary Category') {
      if (categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'IncidenceSecondaryCategory',
                active: true,
                name: categoryName
              }
            })
          });
          if (response.ok) {
            await fetchSecondaryCategories();
            setCategoryName('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add secondary category:', response.status, errorText);
            alert('Failed to add secondary category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding secondary category:', error);
          alert('An error occurred while adding the secondary category.');
        }
      }
    } else if (selectedCategory === 'Secondary Sub Category') {
      // Find the selected secondary category object to get its id
      const parentSecondaryCategoryObj = secondaryCategories.find(cat => cat.name === selectedSecondaryCategory);
      if (parentSecondaryCategoryObj && categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'IncidenceSecondarySubCategory',
                active: true,
                parent_id: parentSecondaryCategoryObj.id,
                name: categoryName
              }
            })
          });
          if (response.ok) {
            await fetchSecondarySubCategories();
            setCategoryName('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add secondary sub category:', response.status, errorText);
            alert('Failed to add secondary sub category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding secondary sub category:', error);
          alert('An error occurred while adding the secondary sub category.');
        }
      }
    } else if (selectedCategory === 'Secondary Sub Sub Category') {
      // POST API integration for Secondary Sub Sub Category
      // Find selected secondary sub category object to get its id and parent_id
      const parentSecondaryCategoryObj = secondaryCategories.find(cat => cat.name === selectedSecondaryCategory);
      const parentSecondarySubCategoryObj = secondarySubCategories.find(sub => sub.secondarySubCategory === selectedSecondarySubCategory && sub.secondaryCategory === selectedSecondaryCategory);
      if (parentSecondaryCategoryObj && parentSecondarySubCategoryObj && categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'IncidenceSecondarySubSubCategory',
                active: '1',
                parent_id: parentSecondarySubCategoryObj.id,
                name: categoryName
              },
              category_id: parentSecondaryCategoryObj.id
            })
          });
          if (response.ok) {
            await fetchSecondarySubSubCategories();
            setCategoryName('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add secondary sub sub category:', response.status, errorText);
            alert('Failed to add secondary sub sub category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding secondary sub sub category:', error);
          alert('An error occurred while adding the secondary sub sub category.');
        }
      }
    } else if (selectedCategory === 'Secondary Sub Sub Sub Category') {
      // POST API integration for Secondary Sub Sub Sub Category
      const parentSecondaryCategoryObj = secondaryCategories.find(cat => cat.name === selectedSecondaryCategory);
      const parentSecondarySubCategoryObj = secondarySubCategories.find(sub => sub.secondarySubCategory === selectedSecondarySubCategory && sub.secondaryCategory === selectedSecondaryCategory);
      const parentSecondarySubSubCategoryObj = secondarySubSubCategories.find(subsub => subsub.secondarySubSubCategory === selectedSecondarySubSubCategory && subsub.secondaryCategory === selectedSecondaryCategory && subsub.secondarySubCategory === selectedSecondarySubCategory);
      if (parentSecondaryCategoryObj && parentSecondarySubCategoryObj && parentSecondarySubSubCategoryObj && categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'IncidenceSecondarySubSubSubCategory',
                active: '1',
                parent_id: parentSecondarySubSubCategoryObj.id,
                name: categoryName
              },
              category_id: parentSecondaryCategoryObj.id
            })
          });
          if (response.ok) {
            // Always refresh all related lists and dropdowns after POST
            try {
              await fetchSecondarySubCategories();
              await fetchSecondarySubSubCategories();
              await fetchSecondarySubSubSubCategories();
            } catch (fetchError) {
              console.error('Error fetching updated secondary sub sub sub categories after POST:', fetchError);
            }
            setCategoryName('');
            setSelectedSecondarySubSubCategory('');
            setSelectedSecondarySubCategory('');
            // Optionally reset selectedSecondaryCategory as well if you want to clear all
            // setSelectedSecondaryCategory('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add secondary sub sub sub category:', response.status, errorText);
            alert('Failed to add secondary sub sub sub category. Please try again.');
          }
        } catch (error) {
          // Only show alert if the POST itself fails
          console.error('Error adding secondary sub sub sub category:', error);
          alert('An error occurred while adding the secondary sub sub sub category.');
        }
      }
    } else if (selectedCategory === 'Who got injured') {
      // API integration for InjuredType
      if (categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'InjuredType',
                active: true,
                name: categoryName
              }
            })
          });
          if (response.ok) {
            await fetchWhoGotInjured();
            setCategoryName('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add injured type:', response.status, errorText);
            alert('Failed to add injured type. Please try again.');
          }
        } catch (error) {
          console.error('Error adding injured type:', error);
          alert('An error occurred while adding the injured type.');
        }
      }
    } else if (selectedCategory === 'Property Damage Category') {
      // API integration for PropertyDamageCategory
      if (categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'PropertyDamageCategory',
                active: true,
                name: categoryName
              }
            })
          });
          if (response.ok) {
            // Always refetch the list from API to ensure latest data
            await fetchPropertyDamageCategories();
            setCategoryName('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add property damage category:', response.status, errorText);
            alert('Failed to add property damage category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding property damage category:', error);
          alert('An error occurred while adding the property damage category.');
        }
      }
    } else if (selectedCategory === 'RCA Category') {
      // API integration for RCACategory
      if (categoryName.trim()) {
        try {
          const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              incidence_tag: {
                tag_type: 'RCACategory',
                active: true,
                name: categoryName
              }
            })
          });
          if (response.ok) {
            await fetchRCACategories();
            setCategoryName('');
          } else {
            const errorText = await response.text();
            console.error('Failed to add RCA category:', response.status, errorText);
            alert('Failed to add RCA category. Please try again.');
          }
        } catch (error) {
          console.error('Error adding RCA category:', error);
          alert('An error occurred while adding the RCA category.');
        }
      }
    }

    setCategoryName('');
    // Optionally, fetch all PropertyDamageCategory from API (for future use or refresh)
    // const fetchPropertyDamageCategories = async () => {
    //   try {
    //     const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
    //     if (response.ok) {
    //       const result = await response.json();
    //       const propertyDamageTypes = result.data
    //         .filter item => item.tag_type === 'PropertyDamageCategory'
    //         .map(({ id, name }) => ({ id, name }));
    //       setPropertyDamageCategories(propertyDamageTypes);
    //     } else {
    //       console.error('Failed to fetch property damage categories');
    //     }
    //   } catch (error) {
    //     console.error('Error fetching property damage categories:', error);
    //   }
    // };
  };

  const handleEdit = (item, type) => {
    setEditingItem({
      ...item,
      type
    });
    if (type === 'Escalations') {
      // Extract user IDs from escalate_to_users array for the form
      const userIds = item.escalate_to_users ? item.escalate_to_users.map(user => String(user[2])) : [];
      setEditFormData({
        category: '',
        subCategory: '',
        subSubCategory: '',
        name: item.name || '',
        level: item.name || '',
        escalateInDays: String(item.after_days) || '',
        users: userIds.join(', ')
      });
      // Also set the form states for escalations
      setSelectedEscalationLevel(item.name || '');
      setEscalateInDays(String(item.after_days) || '');
      setEscalateToUsers(userIds);
    } else if (type === 'Secondary Sub Sub Category') {
      setEditFormData({
        category: item.secondaryCategory || '',
        subCategory: item.secondarySubCategory || '',
        subSubCategory: item.secondarySubSubCategory || '',
        name: item.secondarySubSubCategory || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    } else if (type === 'Secondary Sub Sub Sub Category') {
      setEditFormData({
        category: item.secondaryCategory || '',
        subCategory: item.secondarySubCategory || '',
        subSubCategory: item.secondarySubSubCategory || '',
        name: item.secondarySubSubSubCategory || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    } else if (type === 'Who got injured' || type === 'Property Damage Category' || type === 'RCA Category' || type === 'Category') {
      setEditFormData({
        category: '',
        subCategory: '',
        subSubCategory: '',
        name: item.name || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    } else if (type === 'Sub Sub Category') {
      setEditFormData({
        category: item.category || '',
        subCategory: item.subCategory || '',
        subSubCategory: item.subSubCategory || '',
        name: item.subSubCategory || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    } else if (type === 'Sub Category') {
      setEditFormData({
        category: item.category || '',
        subCategory: item.subCategory || '',
        subSubCategory: '',
        name: item.subCategory || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    } else if (type === 'Sub Sub Sub Category') {
      setEditFormData({
        category: item.category || '',
        subCategory: item.subCategory || '',
        subSubCategory: item.subSubCategory || '',
        name: item.subSubSubCategory || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    } else {
      setEditFormData({
        category: item.category || item.secondaryCategory || item.name || '',
        subCategory: item.subCategory || item.secondarySubCategory || '',
        subSubCategory: item.subSubCategory || item.secondarySubSubCategory || '',
        name: item.name || item.subCategory || item.subSubCategory || item.secondarySubCategory || item.secondarySubSubCategory || '',
        level: '',
        escalateInDays: '',
        users: ''
      });
    }
    setIsEditing(true);
  };

  const handleEditSubmit = async () => {
    console.log('Updating item:', editFormData);

    if (editingItem?.type === 'Who got injured') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchWhoGotInjured();
        } else {
          console.error('Failed to update injured type:', response.statusText);
          alert('Failed to update injured type. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating injured type:', error);
        alert('An error occurred while updating the injured type.');
        return;
      }
    } else if (editingItem?.type === 'Property Damage Category') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchPropertyDamageCategories();
        } else {
          console.error('Failed to update property damage category:', response.statusText);
          alert('Failed to update property damage category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating property damage category:', error);
        alert('An error occurred while updating the property damage category.');
        return;
      }
    } else if (editingItem?.type === 'RCA Category') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchRCACategories();
        } else {
          console.error('Failed to update RCA category:', response.statusText);
          alert('Failed to update RCA category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating RCA category:', error);
        alert('An error occurred while updating the RCA category.');
        return;
      }
    } else if (editingItem?.type === 'Secondary Category') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchSecondaryCategories();
        } else {
          console.error('Failed to update secondary category:', response.statusText);
          alert('Failed to update secondary category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating secondary category:', error);
        alert('An error occurred while updating the secondary category.');
        return;
      }
    } else if (editingItem?.type === 'Category') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchCategories();
        } else {
          console.error('Failed to update category:', response.statusText);
          alert('Failed to update category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating category:', error);
        alert('An error occurred while updating the category.');
        return;
      }
    } else if (editingItem?.type === 'Sub Category') {
      // Find the selected category object to get its id for parent_id
      const parentCategoryObj = categories.find(cat => cat.name === editFormData.category);
      if (!parentCategoryObj) {
        alert('Please select a valid Category');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name,
              parent_id: parentCategoryObj.id
            }
          })
        });

        if (response.ok) {
          await fetchSubCategories();
        } else {
          console.error('Failed to update sub category:', response.statusText);
          alert('Failed to update sub category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating sub category:', error);
        alert('An error occurred while updating the sub category.');
        return;
      }
    } else if (editingItem?.type === 'Sub Sub Category') {
      // Find the selected sub category object to get its id for parent_id
      const parentSubCategoryObj = subCategories.find(sub =>
        sub.subCategory === editFormData.subCategory &&
        sub.category === editFormData.category
      );
      if (!parentSubCategoryObj) {
        alert('Please select a valid Sub Category');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name,
              parent_id: parentSubCategoryObj.id
            }
          })
        });

        if (response.ok) {
          await fetchSubSubCategories();
        } else {
          console.error('Failed to update sub sub category:', response.statusText);
          alert('Failed to update sub sub category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating sub sub category:', error);
        alert('An error occurred while updating the sub sub category.');
        return;
      }
    } else if (editingItem?.type === 'Sub Sub Sub Category') {
      // Find the selected sub sub category object to get its id for parent_id
      const parentSubSubCategoryObj = subSubCategories.find(subsub =>
        subsub.subSubCategory === editFormData.subSubCategory &&
        subsub.subCategory === editFormData.subCategory &&
        subsub.category === editFormData.category
      );
      if (!parentSubSubCategoryObj) {
        alert('Please select a valid Sub Sub Category');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name,
              parent_id: parentSubSubCategoryObj.id
            }
          })
        });

        if (response.ok) {
          await fetchSubSubSubCategories();
        } else {
          console.error('Failed to update sub sub sub category:', response.statusText);
          alert('Failed to update sub sub sub category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating sub sub sub category:', error);
        alert('An error occurred while updating the sub sub sub category.');
        return;
      }
    } else if (editingItem?.type === 'Incidence status') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchIncidenceStatuses();
        } else {
          console.error('Failed to update incidence status:', response.statusText);
          alert('Failed to update incidence status. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating incidence status:', error);
        alert('An error occurred while updating the incidence status.');
        return;
      }
    } else if (editingItem?.type === 'Incidence level') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchIncidenceLevels();
        } else {
          console.error('Failed to update incidence level:', response.statusText);
          alert('Failed to update incidence level. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating incidence level:', error);
        alert('An error occurred while updating the incidence level.');
        return;
      }
    } else if (editingItem?.type === 'Who got injured') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchWhoGotInjured();
        } else {
          console.error('Failed to update injured type:', response.statusText);
          alert('Failed to update injured type. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating injured type:', error);
        alert('An error occurred while updating the injured type.');
        return;
      }
    } else if (editingItem?.type === 'Property Damage Category') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchPropertyDamageCategories();
        } else {
          console.error('Failed to update property damage category:', response.statusText);
          alert('Failed to update property damage category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating property damage category:', error);
        alert('An error occurred while updating the property damage category.');
        return;
      }
    } else if (editingItem?.type === 'RCA Category') {
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name
            }
          })
        });

        if (response.ok) {
          await fetchRCACategories();
        } else {
          console.error('Failed to update RCA category:', response.statusText);
          alert('Failed to update RCA category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating RCA category:', error);
        alert('An error occurred while updating the RCA category.');
        return;
      }
    } else if (editingItem?.type === 'Escalations') {
      try {
        const response = await fetch(`${baseUrl}/pms/update_escalation.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            escalation_matrix: {
              id: String(editingItem.id),
              name: editFormData.level,
              after_days: editFormData.escalateInDays,
              escalate_to_users: escalateToUsers
            }
          })
        });

        if (response.ok) {
          toast.success('Escalation updated successfully!');
          // Refresh the escalation matrix data
          fetchEscalationMatrix();
        } else {
          console.error('Failed to update escalation:', response.statusText);
          toast.error('Failed to update escalation');
          return;
        }
      } catch (error) {
        console.error('Error updating escalation:', error);
        toast.error('Error updating escalation');
        return;
      }
    } else if (editingItem?.type === 'Secondary Sub Category') {
      // Find the selected secondary category object to get its id for parent_id
      const parentSecondaryCategoryObj = secondaryCategories.find(cat => cat.name === editFormData.category);
      if (!parentSecondaryCategoryObj) {
        alert('Please select a valid Secondary Category');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name,
              parent_id: parentSecondaryCategoryObj.id
            }
          })
        });

        if (response.ok) {
          await fetchSecondarySubCategories();
        } else {
          console.error('Failed to update secondary sub category:', response.statusText);
          alert('Failed to update secondary sub category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating secondary sub category:', error);
        alert('An error occurred while updating the secondary sub category.');
        return;
      }
    } else if (editingItem?.type === 'Secondary Sub Sub Category') {
      // Find the selected secondary sub category object to get its id for parent_id
      const parentSecondarySubCategoryObj = secondarySubCategories.find(sub =>
        sub.secondarySubCategory === editFormData.subCategory &&
        sub.secondaryCategory === editFormData.category
      );
      if (!parentSecondarySubCategoryObj) {
        alert('Please select a valid Secondary Sub Category');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name,
              parent_id: parentSecondarySubCategoryObj.id
            }
          })
        });

        if (response.ok) {
          await fetchSecondarySubSubCategories();
        } else {
          console.error('Failed to update secondary sub sub category:', response.statusText);
          alert('Failed to update secondary sub sub category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating secondary sub sub category:', error);
        alert('An error occurred while updating the secondary sub sub category.');
        return;
      }
    } else if (editingItem?.type === 'Secondary Sub Sub Sub Category') {
      // Find the selected secondary sub sub category object to get its id for parent_id
      const parentSecondarySubSubCategoryObj = secondarySubSubCategories.find(subsub =>
        subsub.secondarySubSubCategory === editFormData.subSubCategory &&
        subsub.secondarySubCategory === editFormData.subCategory &&
        subsub.secondaryCategory === editFormData.category
      );
      if (!parentSecondarySubSubCategoryObj) {
        alert('Please select a valid Secondary Sub Sub Category');
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags/${editingItem.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            incidence_tag: {
              name: editFormData.name,
              parent_id: parentSecondarySubSubCategoryObj.id
            }
          })
        });

        if (response.ok) {
          await fetchSecondarySubSubSubCategories();
        } else {
          console.error('Failed to update secondary sub sub sub category:', response.statusText);
          alert('Failed to update secondary sub sub sub category. Please try again.');
          return;
        }
      } catch (error) {
        console.error('Error updating secondary sub sub sub category:', error);
        alert('An error occurred while updating the secondary sub sub sub category.');
        return;
      }
    }

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

  const handleDelete = async (item, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type.toLowerCase()}?`)) {
      let url = `${baseUrl}/pms/incidence_tags/${item.id}.json`;
      let fetchFn = null;
      if (type === 'Category') fetchFn = fetchCategories;
      else if (type === 'Sub Category') fetchFn = fetchSubCategories;
      else if (type === 'Sub Sub Category') fetchFn = fetchSubSubCategories;
      else if (type === 'Sub Sub Sub Category') fetchFn = fetchSubSubSubCategories;
      else if (type === 'Incidence status') fetchFn = fetchIncidenceStatuses;
      else if (type === 'Incidence level') fetchFn = fetchIncidenceLevels;
      else if (type === 'Secondary Category') fetchFn = fetchSecondaryCategories;
      else if (type === 'Secondary Sub Category') fetchFn = fetchSecondarySubCategories;
      else if (type === 'Secondary Sub Sub Category') fetchFn = fetchSecondarySubSubCategories;
      else if (type === 'Secondary Sub Sub Sub Category') fetchFn = fetchSecondarySubSubSubCategories;
      else if (type === 'Escalations') fetchFn = fetchEscalations;
      else if (type === 'Who got injured') fetchFn = fetchWhoGotInjured;
      else if (type === 'Property Damage Category') fetchFn = fetchPropertyDamageCategories;
      else if (type === 'RCA Category') fetchFn = fetchRCACategories;

      // Only use local state for types that are not stored in backend
      if (fetchFn) {
        try {
          let response;
          // Special handling for escalations which might need a different delete endpoint
          if (type === 'Escalations') {
            // Try special escalation delete endpoint first
            try {
              response = await fetch(`${baseUrl}/pms/escalations/${item.id}.json`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            } catch (error) {
              // If special endpoint fails, fall back to standard endpoint
              response = await fetch(`${baseUrl}/pms/incidence_tags/${item.id}.json`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
            }
          } else {
            // Standard delete for all other types
            response = await fetch(url, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
          }

          if (response.ok) {
            await fetchFn();
          } else {
            alert('Failed to delete. Please try again.');
          }
        } catch (error) {
          alert('An error occurred while deleting.');
        }
      } else {
        // For local-only types that don't have backend API
        if (type === 'Approval Setup') setApprovalSetups(approvalSetups.filter(approval => approval.id !== item.id));
      }
    }
  };

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Incidents Setup</h1>

      <div className="flex gap-8">
        <div className="w-80">
          <div className="space-y-1 bg-gray-100 p-2 rounded-lg">
            {menuItems.map(item => (
              <div
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`px-4 py-3 rounded-lg font-medium cursor-pointer transition-colors ${selectedCategory === item ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-700 hover:bg-white/50'
                  }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {isEditing ? (
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <FormControl fullWidth size="small">
                      <InputLabel>Select Level</InputLabel>
                      <MuiSelect
                        value={editFormData.level}
                        onChange={e => setEditFormData({ ...editFormData, level: e.target.value })}
                        label="Select Level"
                      >
                        {incidenceLevels.map(level =>
                          <MenuItem key={level.id} value={level.name}>
                            {level.name}
                          </MenuItem>
                        )}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escalate In Days
                    </label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escalate To Users <span style={{ color: '#C72030' }}>*</span>
                    </label>
                    <FormControl fullWidth className="mb-2">
                      <InputLabel>Escalate To Users <span style={{ color: '#C72030' }}>*</span></InputLabel>
                      <MuiSelect
                        multiple
                        value={escalateToUsers}
                        onChange={(e) => {
                          const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                          setEscalateToUsers(value);
                          // Update editFormData.users for consistency
                          const userNames = value.map(userId => {
                            const user = escalateToUsersList.find(u => String(u.id) === String(userId));
                            return user ? user.full_name : userId;
                          }).join(', ');
                          setEditFormData({ ...editFormData, users: userNames });
                        }}
                        input={<OutlinedInput label="Escalate To Users" />}
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <span style={{ color: '#999' }}>Select users...</span>;
                          }
                          return (
                            <span>
                              {selected.length} user{selected.length !== 1 ? 's' : ''} selected
                            </span>
                          );
                        }}
                      >
                        {escalateToUsersList.map(user => (
                          <MenuItem key={user.id} value={String(user.id)}>
                            {user.full_name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>

                    {/* Selected Users Display Area - Horizontal Compact Layout */}
                    {escalateToUsers.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-medium text-gray-600">
                            Selected ({escalateToUsers.length}):
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setEscalateToUsers([]);
                              setEditFormData({ ...editFormData, users: '' });
                            }}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {escalateToUsers.map((userId) => {
                            const user = escalateToUsersList.find(u => String(u.id) === String(userId));
                            return (
                              <Chip
                                key={userId}
                                label={user ? user.full_name : userId}
                                size="small"
                                color="primary"
                                variant="outlined"
                                onDelete={() => {
                                  const newUsers = escalateToUsers.filter(id => id !== userId);
                                  setEscalateToUsers(newUsers);
                                  const userNames = newUsers.map(id => {
                                    const u = escalateToUsersList.find(user => String(user.id) === String(id));
                                    return u ? u.full_name : id;
                                  }).join(', ');
                                  setEditFormData({ ...editFormData, users: userNames });
                                }}
                                style={{
                                  fontSize: '11px',
                                  height: '24px',
                                  margin: '0'
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleEditSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
                      Submit
                    </Button>
                    <Button onClick={handleEditBack} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2">
                      Back
                    </Button>
                  </div>
                </div>
              ) : (editingItem?.type === 'Who got injured' || editingItem?.type === 'Property Damage Category' || editingItem?.type === 'RCA Category' || editingItem?.type === 'Category') ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <Input
                      placeholder="Enter Name"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="focus:ring-[#C72030] focus:border-[#C72030]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleEditSubmit}
                      className="bg-[#C72030] hover:bg-[#A01020] text-white px-6"
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleEditBack}
                      className="px-6"
                    >
                      Back
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {(editingItem?.type === 'Secondary Sub Category' || editingItem?.type === 'Secondary Sub Sub Category' || editingItem?.type === 'Secondary Sub Sub Sub Category') && (
                    <div>
                      <FormControl fullWidth size="small">
                        <InputLabel>Secondary Category</InputLabel>
                        <MuiSelect
                          value={editFormData.category}
                          onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
                          label="Secondary Category"
                        >
                          {secondaryCategories.map(category => (
                            <MenuItem key={category.id} value={category.name}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}

                  {(editingItem?.type === 'Secondary Sub Sub Category' || editingItem?.type === 'Secondary Sub Sub Sub Category') && (
                    <div>
                      <FormControl fullWidth size="small">
                        <InputLabel>Secondary Sub Category</InputLabel>
                        <MuiSelect
                          value={editFormData.subCategory}
                          onChange={e => setEditFormData({ ...editFormData, subCategory: e.target.value })}
                          label="Secondary Sub Category"
                        >
                          {secondarySubCategories
                            .filter(sub => sub.secondaryCategory === editFormData.category)
                            .map(subCategory => (
                              <MenuItem key={subCategory.id} value={subCategory.secondarySubCategory}>
                                {subCategory.secondarySubCategory}
                              </MenuItem>
                            ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}

                  {editingItem?.type === 'Secondary Sub Sub Sub Category' && (
                    <div>
                      <FormControl fullWidth size="small">
                        <InputLabel>Secondary Sub Sub Category</InputLabel>
                        <MuiSelect
                          value={editFormData.subSubCategory}
                          onChange={e => setEditFormData({ ...editFormData, subSubCategory: e.target.value })}
                          label="Secondary Sub Sub Category"
                        >
                          {secondarySubSubCategories
                            .filter(subsub => subsub.secondaryCategory === editFormData.category && subsub.secondarySubCategory === editFormData.subCategory)
                            .map(subsubCategory => (
                              <MenuItem key={subsubCategory.id} value={subsubCategory.secondarySubSubCategory}>
                                {subsubCategory.secondarySubSubCategory}
                              </MenuItem>
                            ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}

                  {(editingItem?.type === 'Sub Category' || editingItem?.type === 'Sub Sub Category' || editingItem?.type === 'Sub Sub Sub Category') && (
                    <div>
                      <FormControl fullWidth size="small">
                        <InputLabel>Category</InputLabel>
                        <MuiSelect
                          value={editFormData.category}
                          onChange={async (e) => {
                            setEditFormData({ ...editFormData, category: e.target.value, subCategory: '', subSubCategory: '' });
                            // Optionally, fetch subcategories for this category if not already loaded
                            // If you want to always fetch, uncomment below:
                            // await fetchSubCategories();
                          }}
                          label="Category"
                        >
                          {categories.map(category => (
                            <MenuItem key={category.id} value={category.name}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}

                  {(editingItem?.type === 'Sub Sub Category' || editingItem?.type === 'Sub Sub Sub Category') && (
                    <div>
                      <FormControl fullWidth size="small">
                        <InputLabel>Sub-Category</InputLabel>
                        <MuiSelect
                          value={editFormData.subCategory}
                          onChange={(e) => setEditFormData({ ...editFormData, subCategory: e.target.value, subSubCategory: '' })}
                          label="Sub-Category"
                        >
                          {subCategories
                            .filter(sub => sub.category === editFormData.category)
                            .map(subCategory => (
                              <MenuItem key={subCategory.id} value={subCategory.subCategory}>
                                {subCategory.subCategory}
                              </MenuItem>
                            ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}

                  {editingItem?.type === 'Sub Sub Sub Category' && (
                    <div>
                      <FormControl fullWidth size="small">
                        <InputLabel>Sub Sub Category</InputLabel>
                        <MuiSelect
                          value={editFormData.subSubCategory}
                          onChange={e => setEditFormData({ ...editFormData, subSubCategory: e.target.value })}
                          label="Sub Sub Category"
                        >
                          {subSubCategories
                            .filter(subsub => subsub.category === editFormData.category && subsub.subCategory === editFormData.subCategory)
                            .map(subSubCategory => (
                              <MenuItem key={subSubCategory.id} value={subSubCategory.subSubCategory}>
                                {subSubCategory.subSubCategory}
                              </MenuItem>
                            ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
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

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleEditSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
                      Submit
                    </Button>
                    <Button onClick={handleEditBack} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2">
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex gap-4 items-end">
                  {selectedCategory === 'Approval Setup' ? (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Users <span style={{ color: '#C72030' }}>*</span>
                      </label>
                      <FormControl fullWidth className="mb-2">
                        <InputLabel>Select up to 15 Options... <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <MuiSelect
                          multiple
                          value={selectedApprovalUsers}
                          onChange={(e) => {
                            const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                            setSelectedApprovalUsers(value);
                          }}
                          input={<OutlinedInput label="Select up to 15 Options..." />}
                          renderValue={(selected) => {
                            if (selected.length === 0) {
                              return <span style={{ color: '#999' }}>Select users...</span>;
                            }
                            return (
                              <span>
                                {selected.length} user{selected.length !== 1 ? 's' : ''} selected
                              </span>
                            );
                          }}
                        >
                          {escalateToUsersList.map(user => (
                            <MenuItem key={user.id} value={String(user.id)}>
                              {user.full_name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>

                      {/* Selected Users Display Area - Horizontal Compact Layout */}
                      {selectedApprovalUsers.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-medium text-gray-600">
                              Selected ({selectedApprovalUsers.length}):
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedApprovalUsers([])}
                              className="text-xs text-red-600 hover:text-red-800 underline"
                            >
                              Clear All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedApprovalUsers.map((userId) => {
                              const user = escalateToUsersList.find(u => String(u.id) === String(userId));
                              return (
                                <Chip
                                  key={userId}
                                  label={user ? user.full_name : userId}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  onDelete={() => {
                                    setSelectedApprovalUsers(selectedApprovalUsers.filter(id => id !== userId));
                                  }}
                                  style={{
                                    fontSize: '11px',
                                    height: '24px',
                                    margin: '0'
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : selectedCategory === 'Escalations' ? (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level <span style={{ color: '#C72030' }}>*</span>
                        </label>
                        <FormControl fullWidth size="small">
                          <InputLabel>Select Level <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            value={selectedEscalationLevel}
                            onChange={e => setSelectedEscalationLevel(e.target.value)}
                            label="Select Level"
                          >
                            {incidenceLevels.map(level => (
                              <MenuItem key={level.id} value={level.name}>
                                {level.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Escalate In Days <span style={{ color: '#C72030' }}>*</span>
                        </label>
                        <TextField
                          type="text"
                          value={escalateInDays}
                          onChange={e => setEscalateInDays(e.target.value)}
                          placeholder="Enter days"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Escalate To Users <span style={{ color: '#C72030' }}>*</span>
                        </label>
                        <FormControl fullWidth className="mb-2">
                          <InputLabel>Escalate To Users <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            multiple
                            value={escalateToUsers}
                            onChange={(e) => {
                              const value = typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value;
                              setEscalateToUsers(value);
                            }}
                            input={<OutlinedInput label="Escalate To Users" />}
                            renderValue={(selected) => {
                              if (selected.length === 0) {
                                return <span style={{ color: '#999' }}>Select users...</span>;
                              }
                              return (
                                <span>
                                  {selected.length} user{selected.length !== 1 ? 's' : ''} selected
                                </span>
                              );
                            }}
                          >
                            {escalateToUsersList.map(user => (
                              <MenuItem key={user.id} value={String(user.id)}>
                                {user.full_name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>

                        {/* Selected Users Display Area - Horizontal Compact Layout */}
                        {escalateToUsers.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-medium text-gray-600">
                                Selected ({escalateToUsers.length}):
                              </span>
                              <button
                                type="button"
                                onClick={() => setEscalateToUsers([])}
                                className="text-xs text-red-600 hover:text-red-800 underline"
                              >
                                Clear All
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {escalateToUsers.map((userId) => {
                                const user = escalateToUsersList.find(u => String(u.id) === String(userId));
                                return (
                                  <Chip
                                    key={userId}
                                    label={user ? user.full_name : userId}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    onDelete={() => {
                                      setEscalateToUsers(escalateToUsers.filter(id => id !== userId));
                                    }}
                                    style={{
                                      fontSize: '11px',
                                      height: '24px',
                                      margin: '0'
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : selectedCategory === 'Secondary Sub Category' ? (
                    <>
                      <div className="flex-1">
                        <FormControl fullWidth className="mb-2">
                          <InputLabel>Secondary Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            value={selectedSecondaryCategory}
                            onChange={(e) => setSelectedSecondaryCategory(e.target.value)}
                            label="Secondary Category"
                          >
                            {secondaryCategories.map(category => (
                              <MenuItem key={category.id} value={category.name}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                    </>
                  ) : selectedCategory === 'Secondary Sub Sub Category' ? (
                    <>
                      <div className="flex-1">
                        <FormControl fullWidth className="mb-2">
                          <InputLabel>Secondary Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            value={selectedSecondaryCategory}
                            onChange={(e) => setSelectedSecondaryCategory(e.target.value)}
                            label="Secondary Category"
                          >
                            {secondaryCategories.map(category => (
                              <MenuItem key={category.id} value={category.name}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div className="flex-1">
                        <FormControl fullWidth className="mb-2">
                          <InputLabel>Secondary Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            value={selectedSecondarySubCategory}
                            onChange={(e) => setSelectedSecondarySubCategory(e.target.value)}
                            label="Secondary Sub Category"
                          >
                            {secondarySubCategories
                              .filter(sub => sub.secondaryCategory === selectedSecondaryCategory)
                              .map(sub => (
                                <MenuItem key={sub.id} value={sub.secondarySubCategory}>
                                  {sub.secondarySubCategory}
                                </MenuItem>
                              ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                    </>
                  ) : selectedCategory === 'Secondary Sub Sub Sub Category' ? (
                    <>
                      <div className="flex-1">
                        <FormControl fullWidth className="mb-2">
                          <InputLabel>Secondary Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            value={selectedSecondaryCategory}
                            onChange={(e) => setSelectedSecondaryCategory(e.target.value)}
                            label="Secondary Category"
                          >
                            {secondaryCategories.map(category => (
                              <MenuItem key={category.id} value={category.name}>
                                {category.name}
                              </MenuItem>
                            ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div className="flex-1">
                        <FormControl fullWidth className="mb-2">
                          <InputLabel>Secondary Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            value={selectedSecondarySubCategory}
                            onChange={(e) => setSelectedSecondarySubCategory(e.target.value)}
                            label="Secondary Sub Category"
                          >
                            {secondarySubCategories
                              .filter(sub => sub.secondaryCategory === selectedSecondaryCategory)
                              .map(sub => (
                                <MenuItem key={sub.id} value={sub.secondarySubCategory}>
                                  {sub.secondarySubCategory}
                                </MenuItem>
                              ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div className="flex-1">
                        <FormControl fullWidth className="mb-2">
                          <InputLabel>Secondary Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                          <MuiSelect
                            value={selectedSecondarySubSubCategory}
                            onChange={(e) => setSelectedSecondarySubSubCategory(e.target.value)}
                            label="Secondary Sub Sub Category"
                          >
                            {secondarySubSubCategories
                              .filter(subsub => subsub.secondaryCategory === selectedSecondaryCategory && subsub.secondarySubCategory === selectedSecondarySubCategory)
                              .map(subsub => (
                                <MenuItem key={subsub.id} value={subsub.secondarySubSubCategory}>
                                  {subsub.secondarySubSubCategory}
                                </MenuItem>
                              ))}
                          </MuiSelect>
                        </FormControl>
                      </div>
                    </>
                  ) : selectedCategory === 'Incident Disclaimer' ? (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <TextField
                          type="text"
                          value={categoryName}
                          onChange={e => setCategoryName(e.target.value)}
                          placeholder="Enter Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      </div>
                    </>
                  ) : (selectedCategory === 'Sub Category' || selectedCategory === 'Sub Sub Category' || selectedCategory === 'Sub Sub Sub Category') ? (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {/* Category <span style={{ color: '#C72030' }}>*</span> */}
                      </label>
                      <FormControl fullWidth size="small">
                        <InputLabel>Select Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <MuiSelect
                          value={selectedParentCategory}
                          onChange={e => {
                            setSelectedParentCategory(e.target.value as any);
                            setSelectedSubCategory('');
                            setSelectedSubSubCategory('');
                          }}
                          label="Select Category"
                        >
                          {categories.map(category => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  ) : null}
                  {(selectedCategory === 'Sub Sub Category' || selectedCategory === 'Sub Sub Sub Category') && (
                    <div className="flex-1">
                      <FormControl fullWidth className="mb-2">
                        <InputLabel>Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <MuiSelect
                          value={selectedSubCategory}
                          onChange={(e) => {
                            setSelectedSubCategory(e.target.value);
                            setSelectedSubSubCategory('');
                          }}
                          label="Sub Category"
                        >
                          {subCategories.filter(sub => String(sub.categoryId) === String(selectedParentCategory)).map(subCategory => (
                            <MenuItem key={subCategory.id} value={subCategory.id}>
                              {subCategory.subCategory}
                            </MenuItem>
                          ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}
                  {selectedCategory === 'Sub Sub Sub Category' && (
                    <div className="flex-1">
                      <FormControl fullWidth className="mb-2">
                        <InputLabel>Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                        <MuiSelect
                          value={selectedSubSubCategory}
                          onChange={(e) => setSelectedSubSubCategory(e.target.value)}
                          label="Sub Sub Category"
                        >
                          {subSubCategories
                            .filter(subsub => String(subsub.categoryId) === String(selectedParentCategory) && String(subsub.subCategoryId) === String(selectedSubCategory))
                            .map(subSubCategory => (
                              <MenuItem key={subSubCategory.id} value={String(subSubCategory.id)}>
                                {subSubCategory.subSubCategory}
                              </MenuItem>
                            ))}
                        </MuiSelect>
                      </FormControl>
                    </div>
                  )}
                  {selectedCategory !== 'Escalations' && selectedCategory !== 'Approval Setup' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span style={{ color: '#C72030' }}>*</span>
                      </label>
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
                  )}
                  <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700 text-white px-8">
                    {selectedCategory === 'Approval Setup' && existingApprovalSetupId ? 'Update' : 'Submit'}
                  </Button>
                </div>
              </div>

              {selectedCategory !== 'Approval Setup' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#f6f4ee] border-b border-[#D5DbDB]">
                          {selectedCategory === 'Secondary Sub Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Secondary Sub Sub Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Sub Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Secondary Sub Sub Sub Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Sub Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Secondary Sub Sub Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Who got injured' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Name</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Property Damage Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Name</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'RCA Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Name</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Incident Disclaimer' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Name</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Approval Setup' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Users</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Escalations' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Level</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Escalate In Days</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Escalate To Users</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Sub Sub Sub Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Sub Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Sub Sub Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Sub Sub Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Sub Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : selectedCategory === 'Sub Category' ? (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Sub Category</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Name</TableHead>
                              <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Action</TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCategory === 'Secondary Sub Category' ? secondarySubCategories.map(secondarySub => (
                          <TableRow key={secondarySub.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{secondarySub.secondaryCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{secondarySub.secondarySubCategory}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(secondarySub, 'Secondary Sub Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(secondarySub, 'Secondary Sub Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Secondary Sub Sub Category' ? secondarySubSubCategories.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.secondaryCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.secondarySubCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.secondarySubSubCategory}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Secondary Sub Sub Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Secondary Sub Sub Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Secondary Sub Sub Sub Category' ? secondarySubSubSubCategories.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.secondaryCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.secondarySubCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.secondarySubSubCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.secondarySubSubSubCategory}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Secondary Sub Sub Sub Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Secondary Sub Sub Sub Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Who got injured' ? whoGotInjured.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Who got injured')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Who got injured')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Property Damage Category' ? propertyDamageCategories.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Property Damage Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Property Damage Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'RCA Category' ? rcaCategories.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'RCA Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'RCA Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Incident Disclaimer' ? (
                          [
                            { id: 1, name: 'General Disclaimer' },
                            { id: 2, name: 'Safety Disclaimer' },
                            { id: 3, name: 'Legal Disclaimer' }
                          ].map(item => (
                            <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                              <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</TableCell>
                              <TableCell className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : selectedCategory === 'Approval Setup' ? approvalSetups.map(approval => (
                          <TableRow key={approval.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{approval.users}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(approval, 'Approval Setup')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(approval, 'Approval Setup')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Escalations' ? escalationMatrix.map(escalation => (
                          <TableRow key={escalation.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{escalation.name}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{escalation.after_days}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600 max-w-xs">
                              <div className="flex flex-wrap gap-1">
                                {escalation.escalate_to_users && escalation.escalate_to_users.length > 0 ? escalation.escalate_to_users.map((user, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                                    {`${user[0]} ${user[1]}`}
                                  </span>
                                )) : (
                                  <span className="text-gray-400">No users assigned</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(escalation, 'Escalations')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(escalation, 'Escalations')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Secondary Category' ? secondaryCategories.map(secondary => (
                          <TableRow key={secondary.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{secondary.name}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(secondary, 'Secondary Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(secondary, 'Secondary Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Incidence level' ? incidenceLevels.map(level => (
                          <TableRow key={level.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{level.name}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(level, 'Incidence level')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(level, 'Incidence level')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Incidence status' ? incidenceStatuses.map(status => (
                          <TableRow key={status.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{status.name}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(status, 'Incidence status')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(status, 'Incidence status')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Sub Sub Sub Category' ? subSubSubCategories.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.category}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.subCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.subSubCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.subSubSubCategory}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Sub Sub Sub Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Sub Sub Sub Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Sub Sub Category' ? subSubCategories.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.category}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.subCategory}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.subSubCategory}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Sub Sub Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Sub Sub Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : selectedCategory === 'Sub Category' ? subCategories.map(item => (
                          <TableRow key={item.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{item.category}</TableCell>
                            <TableCell className="px-4 py-3 text-sm text-gray-600">{item.subCategory}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(item, 'Sub Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(item, 'Sub Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : categories.map(category => (
                          <TableRow key={category.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                            <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{category.name}</TableCell>
                            <TableCell className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" onClick={() => handleEdit(category, 'Category')}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(category, 'Category')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentSetupDashboard;