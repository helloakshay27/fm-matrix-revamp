import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from 'lucide-react';
import { TextField, Select as MuiSelect, MenuItem, FormControl, InputLabel } from '@mui/material';

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
  const [subSubSubCategories, setSubSubSubCategories] = useState([{
    id: 1,
    category: 'risks',
    subCategory: 'data',
    subSubCategory: 'data I',
    subSubSubCategory: 'data I-A'
  }]);
  const [incidenceStatuses, setIncidenceStatuses] = useState([]);
  const [incidenceLevels, setIncidenceLevels] = useState([]);
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
  const [secondaryCategories, setSecondaryCategories] = useState([]);
  const [secondarySubCategories, setSecondarySubCategories] = useState([]);
  const [selectedSecondaryCategory, setSelectedSecondaryCategory] = useState('');
  const [selectedSecondarySubCategory, setSelectedSecondarySubCategory] = useState('');
  const [secondarySubSubCategories, setSecondarySubSubCategories] = useState([{
    id: 1,
    secondaryCategory: 'latest',
    secondarySubCategory: 'test',
    secondarySubSubCategory: 'test'
  }]);
  const [secondarySubSubSubCategories, setSecondarySubSubSubCategories] = useState([{
    id: 1,
    secondaryCategory: '',
    secondarySubCategory: '',
    secondarySubSubCategory: '',
    secondarySubSubSubCategory: 'test'
  }]);
  const [selectedSecondarySubSubCategory, setSelectedSecondarySubSubCategory] = useState('');
  const [whoGotInjured, setWhoGotInjured] = useState([]);
  const [propertyDamageCategories, setPropertyDamageCategories] = useState([]);
  const [rcaCategories, setRcaCategories] = useState([]);
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
              subCategory: parentSub ? parentSub.name : '',
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

  useEffect(() => {
    if (selectedCategory === 'Category') {
      fetchCategories();
    } else if (selectedCategory === 'Sub Category') {
      fetchSubCategories();
    } else if (selectedCategory === 'Sub Sub Category') {
      fetchSubSubCategories();
    } else if (selectedCategory === 'Sub Sub Sub Category') {
      fetchSubSubSubCategories();
    } else if (selectedCategory === 'Who got injured') {
      fetchWhoGotInjured();
    } else if (selectedCategory === 'Property Damage Category') {
      fetchPropertyDamageCategories();
    } else if (selectedCategory === 'Incidence status') {
      fetchIncidenceStatuses();
    } else if (selectedCategory === 'Incidence level') {
      fetchIncidenceLevels();
    } else if (selectedCategory === 'Secondary Category') {
      fetchSecondaryCategories();
    } else if (selectedCategory === 'Secondary Sub Category') {
      fetchSecondarySubCategories();
    } else if (selectedCategory === 'RCA Category') {
      fetchRCACategories();
    }
  }, [selectedCategory]);


  const handleSubmit = async () => {
    if (!categoryName.trim()) return;

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
      if (selectedEscalationLevel && escalateInDays && escalateToUsers) {
        setEscalations([...escalations, {
          id: newId,
          level: selectedEscalationLevel,
          escalateInDays: escalateInDays,
          users: escalateToUsers
        }]);
        setSelectedEscalationLevel('');
        setEscalateInDays('');
        setEscalateToUsers('');
      }
    } else if (selectedCategory === 'Approval Setup') {
      if (selectedApprovalUsers) {
        setApprovalSetups([...approvalSetups, {
          id: newId,
          users: selectedApprovalUsers
        }]);
        setSelectedApprovalUsers('');
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
      if (selectedSecondaryCategory && selectedSecondarySubCategory) {
        setSecondarySubSubCategories([...secondarySubSubCategories, {
          id: newId,
          secondaryCategory: selectedSecondaryCategory,
          secondarySubCategory: selectedSecondarySubCategory,
          secondarySubSubCategory: categoryName
        }]);
      }
    } else if (selectedCategory === 'Secondary Sub Sub Sub Category') {
      if (selectedSecondaryCategory && selectedSecondarySubCategory && selectedSecondarySubSubCategory) {
        setSecondarySubSubSubCategories([...secondarySubSubSubCategories, {
          id: newId,
          secondaryCategory: selectedSecondaryCategory,
          secondarySubCategory: selectedSecondarySubCategory,
          secondarySubSubCategory: selectedSecondarySubSubCategory,
          secondarySubSubSubCategory: categoryName
        }]);
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
    //         .filter(item => item.tag_type === 'PropertyDamageCategory')
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
      setEditFormData({
        category: '',
        subCategory: '',
        subSubCategory: '',
        name: '',
        level: item.level || '',
        escalateInDays: item.escalateInDays || '',
        users: item.users || ''
      });
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
      else if (type === 'Who got injured') fetchFn = fetchWhoGotInjured;
      else if (type === 'Property Damage Category') fetchFn = fetchPropertyDamageCategories;
      else if (type === 'RCA Category') fetchFn = fetchRCACategories;

      // Only use local state for types that are not stored in backend
      if (fetchFn) {
        try {
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            await fetchFn();
          } else {
            alert('Failed to delete. Please try again.');
          }
        } catch (error) {
          alert('An error occurred while deleting.');
        }
      } else {
        // For local-only types
        if (type === 'Sub Sub Sub Category') setSubSubSubCategories(subSubSubCategories.filter(subsubsub => subsubsub.id !== item.id));
        else if (type === 'Escalations') setEscalations(escalations.filter(escalation => escalation.id !== item.id));
        else if (type === 'Approval Setup') setApprovalSetups(approvalSetups.filter(approval => approval.id !== item.id));
        else if (type === 'Secondary Sub Sub Category') setSecondarySubSubCategories(secondarySubSubCategories.filter(secondarySubSub => secondarySubSub.id !== item.id));
        else if (type === 'Secondary Sub Sub Sub Category') setSecondarySubSubSubCategories(secondarySubSubSubCategories.filter(secondarySubSubSub => secondarySubSubSub.id !== item.id));
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
                      Escalate to users
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {editFormData.users.split(',').filter(user => user.trim()).map((user, index) => (
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
                        ))}
                      </div>
                      <Select
                        onValueChange={value => {
                          const currentUsers = editFormData.users ? editFormData.users.split(',').map(u => u.trim()) : [];
                          if (!currentUsers.includes(value)) {
                            const newUsers = [...currentUsers, value].filter(u => u);
                            setEditFormData({ ...editFormData, users: newUsers.join(', ') });
                          }
                        }}
                      >
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Category
                      </label>
                      <Select
                        value={editFormData.category}
                        onValueChange={value => setEditFormData({ ...editFormData, category: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {secondaryCategories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(editingItem?.type === 'Secondary Sub Sub Category' || editingItem?.type === 'Secondary Sub Sub Sub Category') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Sub Category
                      </label>
                      <Select
                        value={editFormData.subCategory}
                        onValueChange={value => setEditFormData({ ...editFormData, subCategory: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {secondarySubCategories
                            .filter(sub => sub.secondaryCategory === editFormData.category)
                            .map(subCategory => (
                              <SelectItem key={subCategory.id} value={subCategory.secondarySubCategory}>
                                {subCategory.secondarySubCategory}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {editingItem?.type === 'Secondary Sub Sub Sub Category' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Sub Sub Category
                      </label>
                      <Select
                        value={editFormData.subSubCategory}
                        onValueChange={value => setEditFormData({ ...editFormData, subSubCategory: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {secondarySubSubCategories
                            .filter(subsub => subsub.secondaryCategory === editFormData.category && subsub.secondarySubCategory === editFormData.subCategory)
                            .map(subSubCategory => (
                              <SelectItem key={subSubCategory.id} value={subSubCategory.secondarySubSubCategory}>
                                {subSubCategory.secondarySubSubCategory}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(editingItem?.type === 'Sub Category' || editingItem?.type === 'Sub Sub Category' || editingItem?.type === 'Sub Sub Sub Category') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Select
                        value={editFormData.category}
                        onValueChange={async value => {
                          setEditFormData({ ...editFormData, category: value, subCategory: '', subSubCategory: '' });
                          // Optionally, fetch subcategories for this category if not already loaded
                          // If you want to always fetch, uncomment below:
                          // await fetchSubCategories();
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(editingItem?.type === 'Sub Sub Category' || editingItem?.type === 'Sub Sub Sub Category') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Category
                      </label>
                      <Select
                        value={editFormData.subCategory}
                        onValueChange={value => setEditFormData({ ...editFormData, subCategory: value, subSubCategory: '' })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subCategories
                            .filter(sub => sub.category === editFormData.category)
                            .map(subCategory => (
                              <SelectItem key={subCategory.id} value={subCategory.subCategory}>
                                {subCategory.subCategory}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {editingItem?.type === 'Sub Sub Sub Category' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Sub Category
                      </label>
                      <Select
                        value={editFormData.subSubCategory}
                        onValueChange={value => setEditFormData({ ...editFormData, subSubCategory: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subSubCategories
                            .filter(subsub => subsub.category === editFormData.category && subsub.subCategory === editFormData.subCategory)
                            .map(subSubCategory => (
                              <SelectItem key={subSubCategory.id} value={subSubCategory.subSubCategory}>
                                {subSubCategory.subSubCategory}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
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
                      <FormControl fullWidth size="small">
                        <InputLabel>Select up to 15 Options...</InputLabel>
                        <MuiSelect
                          value={selectedApprovalUsers}
                          onChange={e => setSelectedApprovalUsers(e.target.value)}
                          label="Select up to 15 Options..."
                        >
                          <MenuItem value="Mahendra Lungare">Mahendra Lungare</MenuItem>
                          <MenuItem value="Vinayak Mane">Vinayak Mane</MenuItem>
                          <MenuItem value="Abdul A">Abdul A</MenuItem>
                          <MenuItem value="John Doe">John Doe</MenuItem>
                          <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                        </MuiSelect>
                      </FormControl>
                    </div>
                  ) : selectedCategory === 'Escalations' ? (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Level
                        </label>
                        <FormControl fullWidth size="small">
                          <InputLabel>Select Level</InputLabel>
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
                          Escalate In Days
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
                    </>
                  ) : selectedCategory === 'Secondary Sub Category' ? (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Category
                        </label>
                        <Select value={selectedSecondaryCategory} onValueChange={setSelectedSecondaryCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {secondaryCategories.map(category => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : selectedCategory === 'Secondary Sub Sub Category' ? (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Category
                        </label>
                        <Select value={selectedSecondaryCategory} onValueChange={setSelectedSecondaryCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {secondaryCategories.map(category => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Sub Category
                        </label>
                        <Select value={selectedSecondarySubCategory} onValueChange={setSelectedSecondarySubCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Secondary Sub Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {secondarySubCategories
                              .filter(sub => sub.secondaryCategory === selectedSecondaryCategory)
                              .map(sub => (
                                <SelectItem key={sub.id} value={sub.secondarySubCategory}>
                                  {sub.secondarySubCategory}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : selectedCategory === 'Secondary Sub Sub Sub Category' ? (
                    <>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Category
                        </label>
                        <Select value={selectedSecondaryCategory} onValueChange={setSelectedSecondaryCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {secondaryCategories.map(category => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Sub Category
                        </label>
                        <Select value={selectedSecondarySubCategory} onValueChange={setSelectedSecondarySubCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Secondary Sub Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {secondarySubCategories
                              .filter(sub => sub.secondaryCategory === selectedSecondaryCategory)
                              .map(sub => (
                                <SelectItem key={sub.id} value={sub.secondarySubCategory}>
                                  {sub.secondarySubCategory}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Secondary Sub Sub Category
                        </label>
                        <Select value={selectedSecondarySubSubCategory} onValueChange={setSelectedSecondarySubSubCategory}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Secondary Sub Sub Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            {secondarySubSubCategories
                              .filter(subsub => subsub.secondaryCategory === selectedSecondaryCategory && subsub.secondarySubCategory === selectedSecondarySubCategory)
                              .map(subsub => (
                                <SelectItem key={subsub.id} value={subsub.secondarySubSubCategory}>
                                  {subsub.secondarySubSubCategory}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
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
                        Category
                      </label>
                      <FormControl fullWidth size="small">
                        <InputLabel>Select Category</InputLabel>
                        <MuiSelect
                          value={selectedParentCategory}
                          onChange={e => setSelectedParentCategory(e.target.value)}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Category
                      </label>
                      <Select value={selectedSubCategory} onValueChange={setSelectedSubCategory}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subCategories.filter(sub => String(sub.categoryId) === String(selectedParentCategory)).map(subCategory => (
                            <SelectItem key={subCategory.id} value={subCategory.id}>
                              {subCategory.subCategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {selectedCategory === 'Sub Sub Sub Category' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Sub Category
                      </label>
                      <Select
                        value={editFormData.subSubCategory}
                        onValueChange={value => setEditFormData({ ...editFormData, subSubCategory: value })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Sub Sub Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          {subSubCategories.filter(subsub => subsub.category === selectedParentCategory && subsub.subCategory === selectedSubCategory).map(subSubCategory => (
                            <SelectItem key={subSubCategory.id} value={subSubCategory.subSubCategory}>
                              {subSubCategory.subSubCategory}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {selectedCategory !== 'Escalations' && (
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
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
                    Submit
                  </Button>
                </div>
              </div>

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
                            <TableHead className="px-4 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Users</TableHead>
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
                      )) : selectedCategory === 'Escalations' ? escalations.map(escalation => (
                        <TableRow key={escalation.id} className="hover:bg-gray-50 border-b border-[#D5DbDB]">
                          <TableCell className="px-4 py-3 text-sm font-medium text-gray-900">{escalation.level}</TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{escalation.escalateInDays}</TableCell>
                          <TableCell className="px-4 py-3 text-sm text-gray-600">{escalation.users}</TableCell>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentSetupDashboard;