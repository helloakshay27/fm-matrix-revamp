import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Edit, Trash2 } from 'lucide-react';
import { API_CONFIG, getAuthenticatedFetchOptions, getFullUrl } from '@/config/apiConfig';

export const PermitSetupDashboard = () => {
  const [permitType, setPermitType] = useState('');
  const [permitTypes, setPermitTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPermitTypes, setIsLoadingPermitTypes] = useState(true);

  // Permit Activity states
  const [permitActivity, setPermitActivity] = useState('');
  const [selectedPermitType, setSelectedPermitType] = useState('');
  const [permitActivities, setPermitActivities] = useState([]);
  const [isSubmittingPermitActivity, setIsSubmittingPermitActivity] = useState(false);
  const [isLoadingPermitActivities, setIsLoadingPermitActivities] = useState(true);

  // Permit Sub Activity states
  const [permitSubActivity, setPermitSubActivity] = useState('');
  const [selectedPermitTypeForSub, setSelectedPermitTypeForSub] = useState('');
  const [selectedPermitActivity, setSelectedPermitActivity] = useState('');
  const [permitSubActivities, setPermitSubActivities] = useState([
    { id: 1, permitType: 'test', permitActivity: 'tested', permitSubActivity: 'testing' }
  ]);
  const [isSubmittingPermitSubActivity, setIsSubmittingPermitSubActivity] = useState(false);

  // Permit Hazard Category states
  const [permitHazardCategory, setPermitHazardCategory] = useState('');
  const [selectedCategoryForHazard, setSelectedCategoryForHazard] = useState('');
  const [selectedSubCategoryForHazard, setSelectedSubCategoryForHazard] = useState('');
  const [selectedSubSubCategoryForHazard, setSelectedSubSubCategoryForHazard] = useState('');
  const [permitHazardCategories, setPermitHazardCategories] = useState([
    {
      id: 1,
      category: '',
      subCategory: '',
      subSubCategory: '',
      permitHazardCategory: 'Water Sefty'
    }
  ]);
  const [isSubmittingPermitHazardCategory, setIsSubmittingPermitHazardCategory] = useState(false);

  // Permit Risk states
  const [permitRisk, setPermitRisk] = useState('');
  const [selectedPermitTypeForRisk, setSelectedPermitTypeForRisk] = useState('');
  const [selectedSubCategoryForRisk, setSelectedSubCategoryForRisk] = useState('');
  const [selectedSubSubCategoryForRisk, setSelectedSubSubCategoryForRisk] = useState('');
  const [selectedSubSubSubCategoryForRisk, setSelectedSubSubSubCategoryForRisk] = useState('');
  const [permitRisks, setPermitRisks] = useState([
    {
      id: 1,
      permitType: '',
      subCategory: '',
      subSubCategory: '',
      subSubSubCategory: '',
      permitRisk: 'Electrical Approvall'
    }
  ]);
  const [isSubmittingPermitRisk, setIsSubmittingPermitRisk] = useState(false);

  // Permit Safety Equipment states
  const [permitSafetyEquipment, setPermitSafetyEquipment] = useState('');
  const [selectedPermitTypeForSafety, setSelectedPermitTypeForSafety] = useState('');
  const [selectedPermitActivityForSafety, setSelectedPermitActivityForSafety] = useState('');
  const [selectedPermitSubActivityForSafety, setSelectedPermitSubActivityForSafety] = useState('');
  const [selectedPermitHazardCategoryForSafety, setSelectedPermitHazardCategoryForSafety] = useState('');
  const [selectedPermitRiskForSafety, setSelectedPermitRiskForSafety] = useState('');
  const [permitSafetyEquipments, setPermitSafetyEquipments] = useState([
    {
      id: 1,
      permitType: '',
      permitActivity: '',
      permitSubActivity: '',
      permitHazardCategory: '',
      permitRisk: '',
      permitSafetyEquipment: 'Waste Management'
    }
  ]);
  const [isSubmittingPermitSafetyEquipment, setIsSubmittingPermitSafetyEquipment] = useState(false);

  // API service function for creating permit type
  const createPermitType = async (name) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
      const options = getAuthenticatedFetchOptions('POST', {
        pms_permit_tag: {
          name: name,
          active: true,
          parent_id: null,
          tag_type: "PermitType"
        }
      });

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating permit type:', error);
      throw error;
    }
  };

  // API service function for fetching permit types
  const fetchPermitTypes = async () => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching permit types:', error);
      throw error;
    }
  };

  // Function to load permit types from API
  const loadPermitTypes = async () => {
    try {
      setIsLoadingPermitTypes(true);
      const data = await fetchPermitTypes();
      console.log('Fetched permit types:', data);
      let permitTypeItems = [];
      if (data && Array.isArray(data)) {
        permitTypeItems = data
          .filter(item => item.tag_type === 'PermitType')
          .map(item => ({
            id: item.id,
            name: item.name
          }));
        setPermitTypes(permitTypeItems);
      } else if (data && data.permit_tags) {
        permitTypeItems = data.permit_tags
          .filter(item => item.tag_type === 'PermitType')
          .map(item => ({
            id: item.id,
            name: item.name
          }));
        setPermitTypes(permitTypeItems);
      }
      return permitTypeItems;
    } catch (error) {
      console.error('Failed to load permit types:', error);
    } finally {
      setIsLoadingPermitTypes(false);
    }
  };

  // API service function for creating permit activity
  const createPermitActivity = async (name, parentId) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
      const options = getAuthenticatedFetchOptions('POST', {
        pms_permit_tag: {
          name: name,
          active: true,
          parent_id: parentId,
          tag_type: "PermitActivity"
        }
      });
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating permit activity:', error);
      throw error;
    }
  };

  // API service function for fetching permit activities
  const fetchPermitActivities = async () => {
    try {
      const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitActivity`;
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching permit activities:', error);
      throw error;
    }
  };

  // API service function for creating permit sub activity
  const createPermitSubActivity = async (name, parentId) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
      const options = getAuthenticatedFetchOptions('POST', {
        pms_permit_tag: {
          name: name,
          active: true,
          parent_id: parentId,
          tag_type: "PermitSubActivity"
        }
      });
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating permit sub activity:', error);
      throw error;
    }
  };

  // API service function for fetching permit sub activities
  const fetchPermitSubActivities = async () => {
    try {
      const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitSubActivity`;
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching permit sub activities:', error);
      throw error;
    }
  };

  // API service function for creating permit hazard category
  const createPermitHazardCategory = async (name, parentId) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
      const options = getAuthenticatedFetchOptions('POST', {
        pms_permit_tag: {
          name: name,
          active: true,
          parent_id: parentId,
          tag_type: "PermitHazardCategory"
        }
      });
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating permit hazard category:', error);
      throw error;
    }
  };

  // API service function for fetching permit hazard categories
  const fetchPermitHazardCategories = async () => {
    try {
      const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitHazardCategory`;
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching permit hazard categories:', error);
      throw error;
    }
  };

  // API service function for creating permit risk
  const createPermitRisk = async (name, parentId) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
      const options = getAuthenticatedFetchOptions('POST', {
        pms_permit_tag: {
          name: name,
          active: true,
          parent_id: parentId,
          tag_type: "PermitRisk"
        }
      });
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating permit risk:', error);
      throw error;
    }
  };

  // API service function for fetching permit risks
  const fetchPermitRisks = async () => {
    try {
      const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitRisk`;
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching permit risks:', error);
      throw error;
    }
  };

  // API service function for creating permit safety equipment
  const createPermitSafetyEquipment = async (name, parentId) => {
    try {
      const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
      const options = getAuthenticatedFetchOptions('POST', {
        pms_permit_tag: {
          name: name,
          active: true,
          parent_id: parentId,
          tag_type: "PermitSafetyEquipment"
        }
      });
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating permit safety equipment:', error);
      throw error;
    }
  };

  // API service function for fetching permit safety equipment
  const fetchPermitSafetyEquipments = async () => {
    try {
      const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitSafetyEquipment`;
      const options = getAuthenticatedFetchOptions('GET');
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching permit safety equipment:', error);
      throw error;
    }
  };

  // Function to load permit activities from API
  const loadPermitActivities = async () => {
    try {
      setIsLoadingPermitActivities(true);
      const data = await fetchPermitActivities();
      console.log('Fetched permit activities:', data);
      if (data && Array.isArray(data)) {
        const permitActivityItems = data
          .filter(item => item.tag_type === 'PermitActivity')
          .map(item => {
            const parentType = permitTypes.find(type => type.id === item.parent_id);
            return {
              id: item.id,
              permitType: parentType ? parentType.name : 'Unknown',
              permitActivity: item.name,
              parentId: item.parent_id
            };
          });
        setPermitActivities(permitActivityItems);
      }
    } catch (error) {
      console.error('Failed to load permit activities:', error);
    } finally {
      setIsLoadingPermitActivities(false);
    }
  };

  // Load permit types on component mount and then load all other data
  useEffect(() => {
    loadAllData();
  }, []);

  // Clear dependent selections when parent selections change
  useEffect(() => {
    setSelectedPermitActivity('');
  }, [selectedPermitTypeForSub]);

  useEffect(() => {
    setSelectedSubCategoryForHazard('');
    setSelectedSubSubCategoryForHazard('');
  }, [selectedCategoryForHazard]);

  useEffect(() => {
    setSelectedSubSubCategoryForHazard('');
  }, [selectedSubCategoryForHazard]);

  useEffect(() => {
    setSelectedSubCategoryForRisk('');
    setSelectedSubSubCategoryForRisk('');
    setSelectedSubSubSubCategoryForRisk('');
  }, [selectedPermitTypeForRisk]);

  useEffect(() => {
    setSelectedSubSubCategoryForRisk('');
    setSelectedSubSubSubCategoryForRisk('');
  }, [selectedSubCategoryForRisk]);

  useEffect(() => {
    setSelectedSubSubSubCategoryForRisk('');
  }, [selectedSubSubCategoryForRisk]);

  useEffect(() => {
    setSelectedPermitActivityForSafety('');
    setSelectedPermitSubActivityForSafety('');
    setSelectedPermitHazardCategoryForSafety('');
    setSelectedPermitRiskForSafety('');
  }, [selectedPermitTypeForSafety]);

  useEffect(() => {
    setSelectedPermitSubActivityForSafety('');
    setSelectedPermitHazardCategoryForSafety('');
    setSelectedPermitRiskForSafety('');
  }, [selectedPermitActivityForSafety]);

  useEffect(() => {
    setSelectedPermitHazardCategoryForSafety('');
    setSelectedPermitRiskForSafety('');
  }, [selectedPermitSubActivityForSafety]);

  useEffect(() => {
    setSelectedPermitRiskForSafety('');
  }, [selectedPermitHazardCategoryForSafety]);

  // Function to reload all data
  const loadAllData = async () => {
    try {
      // First load permit types and get the actual data
      const permitTypeItems = await loadPermitTypes();

      // Then load all other data in parallel
      const [activitiesData, subActivitiesData, hazardCategoriesData, risksData, safetyEquipmentData] = await Promise.all([
        fetchPermitActivities(),
        fetchPermitSubActivities(),
        fetchPermitHazardCategories(),
        fetchPermitRisks(),
        fetchPermitSafetyEquipments()
      ]);

      // Create lookup maps for faster access
      const allData = {
        permitTypes: permitTypeItems || [],
        permitActivities: activitiesData?.filter(item => item.tag_type === 'PermitActivity') || [],
        permitSubActivities: subActivitiesData?.filter(item => item.tag_type === 'PermitSubActivity') || [],
        permitHazardCategories: hazardCategoriesData?.filter(item => item.tag_type === 'PermitHazardCategory') || [],
        permitRisks: risksData?.filter(item => item.tag_type === 'PermitRisk') || [],
        permitSafetyEquipments: safetyEquipmentData?.filter(item => item.tag_type === 'PermitSafetyEquipment') || []
      };

      // Create lookup function
      const findItemById = (array, id) => array.find(item => item.id === id);
      const getParentName = (array, id) => {
        const item = findItemById(array, id);
        return item ? item.name : 'Unknown';
      };

      // Process permit activities
      const processedActivities = allData.permitActivities.map(item => {
        const parentType = findItemById(allData.permitTypes, item.parent_id);
        return {
          id: item.id,
          permitType: parentType ? parentType.name : 'Unknown',
          permitActivity: item.name,
          parentId: item.parent_id
        };
      });
      setPermitActivities(processedActivities);

      // Process permit sub activities
      const processedSubActivities = allData.permitSubActivities.map(item => {
        const parentActivity = findItemById(processedActivities, item.parent_id);
        const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
        return {
          id: item.id,
          permitType: parentType ? parentType.name : 'Unknown',
          permitActivity: parentActivity ? parentActivity.permitActivity : 'Unknown',
          permitSubActivity: item.name,
          parentId: item.parent_id
        };
      });
      setPermitSubActivities(processedSubActivities);

      // Process permit hazard categories
      const processedHazardCategories = allData.permitHazardCategories.map(item => {
        const parentSubActivity = findItemById(processedSubActivities, item.parent_id);
        const parentActivity = parentSubActivity ? findItemById(processedActivities, parentSubActivity.parentId) : null;
        const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
        return {
          id: item.id,
          category: parentType ? parentType.name : 'Unknown',
          subCategory: parentActivity ? parentActivity.permitActivity : 'Unknown',
          subSubCategory: parentSubActivity ? parentSubActivity.permitSubActivity : 'Unknown',
          permitHazardCategory: item.name,
          parentId: item.parent_id
        };
      });
      setPermitHazardCategories(processedHazardCategories);

      // Process permit risks
      const processedRisks = allData.permitRisks.map(item => {
        const parentHazardCategory = findItemById(processedHazardCategories, item.parent_id);
        const parentSubActivity = parentHazardCategory ? findItemById(processedSubActivities, parentHazardCategory.parentId) : null;
        const parentActivity = parentSubActivity ? findItemById(processedActivities, parentSubActivity.parentId) : null;
        const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
        return {
          id: item.id,
          permitType: parentType ? parentType.name : 'Unknown',
          subCategory: parentActivity ? parentActivity.permitActivity : 'Unknown',
          subSubCategory: parentSubActivity ? parentSubActivity.permitSubActivity : 'Unknown',
          subSubSubCategory: parentHazardCategory ? parentHazardCategory.permitHazardCategory : 'Unknown',
          permitRisk: item.name,
          parentId: item.parent_id
        };
      });
      setPermitRisks(processedRisks);

      // Process permit safety equipment
      const processedSafetyEquipment = allData.permitSafetyEquipments.map(item => {
        const parentRisk = findItemById(processedRisks, item.parent_id);
        const parentHazardCategory = parentRisk ? findItemById(processedHazardCategories, parentRisk.parentId) : null;
        const parentSubActivity = parentHazardCategory ? findItemById(processedSubActivities, parentHazardCategory.parentId) : null;
        const parentActivity = parentSubActivity ? findItemById(processedActivities, parentSubActivity.parentId) : null;
        const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
        return {
          id: item.id,
          permitType: parentType ? parentType.name : 'Unknown',
          permitActivity: parentActivity ? parentActivity.permitActivity : 'Unknown',
          permitSubActivity: parentSubActivity ? parentSubActivity.permitSubActivity : 'Unknown',
          permitHazardCategory: parentHazardCategory ? parentHazardCategory.permitHazardCategory : 'Unknown',
          permitRisk: parentRisk ? parentRisk.permitRisk : 'Unknown',
          permitSafetyEquipment: item.name
        };
      });
      setPermitSafetyEquipments(processedSafetyEquipment);

    } catch (error) {
      console.error('Failed to load permit data:', error);
    } finally {
      setIsLoadingPermitTypes(false);
      setIsLoadingPermitActivities(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (permitType.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const response = await createPermitType(permitType);
        setPermitType('');
        await loadAllData();
        console.log('Permit type created successfully:', response);
      } catch (error) {
        console.error('Failed to create permit type:', error);
        alert('Failed to create permit type. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePermitActivitySubmit = async (e) => {
    e.preventDefault();
    if (permitActivity.trim() && selectedPermitType && !isSubmittingPermitActivity) {
      const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitType);
      if (selectedType) {
        setIsSubmittingPermitActivity(true);
        try {
          const response = await createPermitActivity(permitActivity, selectedType.id);
          setPermitActivity('');
          setSelectedPermitType('');
          await loadAllData();
          console.log('Permit activity created successfully:', response);
        } catch (error) {
          console.error('Failed to create permit activity:', error);
          alert('Failed to create permit activity. Please try again.');
        } finally {
          setIsSubmittingPermitActivity(false);
        }
      }
    }
  };

  const handlePermitSubActivitySubmit = async (e) => {
    e.preventDefault();
    if (permitSubActivity.trim() && selectedPermitTypeForSub && selectedPermitActivity && !isSubmittingPermitSubActivity) {
      const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForSub);
      const selectedActivity = permitActivities.find(activity =>
        activity.id.toString() === selectedPermitActivity &&
        activity.permitType === selectedType?.name
      );

      if (selectedType && selectedActivity) {
        setIsSubmittingPermitSubActivity(true);
        try {
          const response = await createPermitSubActivity(permitSubActivity, selectedActivity.id);
          setPermitSubActivity('');
          setSelectedPermitTypeForSub('');
          setSelectedPermitActivity('');
          await loadAllData();
          console.log('Permit sub activity created successfully:', response);
        } catch (error) {
          console.error('Failed to create permit sub activity:', error);
          alert('Failed to create permit sub activity. Please try again.');
        } finally {
          setIsSubmittingPermitSubActivity(false);
        }
      }
    }
  };

  const handlePermitHazardCategorySubmit = async (e) => {
    e.preventDefault();
    if (permitHazardCategory.trim() && selectedSubSubCategoryForHazard && !isSubmittingPermitHazardCategory) {
      const selectedSubActivity = permitSubActivities.find(subActivity => subActivity.id.toString() === selectedSubSubCategoryForHazard);
      if (selectedSubActivity) {
        setIsSubmittingPermitHazardCategory(true);
        try {
          const response = await createPermitHazardCategory(permitHazardCategory, selectedSubActivity.id);
          setPermitHazardCategory('');
          setSelectedCategoryForHazard('');
          setSelectedSubCategoryForHazard('');
          setSelectedSubSubCategoryForHazard('');
          await loadAllData();
          console.log('Permit hazard category created successfully:', response);
        } catch (error) {
          console.error('Failed to create permit hazard category:', error);
          alert('Failed to create permit hazard category. Please try again.');
        } finally {
          setIsSubmittingPermitHazardCategory(false);
        }
      }
    }
  };

  const handlePermitRiskSubmit = async (e) => {
    e.preventDefault();
    if (permitRisk.trim() && selectedSubSubSubCategoryForRisk && !isSubmittingPermitRisk) {
      const selectedHazardCategory = permitHazardCategories.find(hazard => hazard.id.toString() === selectedSubSubSubCategoryForRisk);
      if (selectedHazardCategory) {
        setIsSubmittingPermitRisk(true);
        try {
          const response = await createPermitRisk(permitRisk, selectedHazardCategory.id);
          setPermitRisk('');
          setSelectedPermitTypeForRisk('');
          setSelectedSubCategoryForRisk('');
          setSelectedSubSubCategoryForRisk('');
          setSelectedSubSubSubCategoryForRisk('');
          await loadAllData();
          console.log('Permit risk created successfully:', response);
        } catch (error) {
          console.error('Failed to create permit risk:', error);
          alert('Failed to create permit risk. Please try again.');
        } finally {
          setIsSubmittingPermitRisk(false);
        }
      }
    }
  };

  const handlePermitSafetyEquipmentSubmit = async (e) => {
    e.preventDefault();
    if (permitSafetyEquipment.trim() && selectedPermitRiskForSafety && !isSubmittingPermitSafetyEquipment) {
      const selectedRisk = permitRisks.find(risk => risk.id.toString() === selectedPermitRiskForSafety);
      if (selectedRisk) {
        setIsSubmittingPermitSafetyEquipment(true);
        try {
          const response = await createPermitSafetyEquipment(permitSafetyEquipment, selectedRisk.id);
          setPermitSafetyEquipment('');
          setSelectedPermitTypeForSafety('');
          setSelectedPermitActivityForSafety('');
          setSelectedPermitSubActivityForSafety('');
          setSelectedPermitHazardCategoryForSafety('');
          setSelectedPermitRiskForSafety('');
          await loadAllData();
          console.log('Permit safety equipment created successfully:', response);
        } catch (error) {
          console.error('Failed to create permit safety equipment:', error);
          alert('Failed to create permit safety equipment. Please try again.');
        } finally {
          setIsSubmittingPermitSafetyEquipment(false);
        }
      }
    }
  };

  const handleDelete = (index) => {
    setPermitTypes(permitTypes.filter((_, i) => i !== index));
  };

  const handlePermitActivityDelete = (id) => {
    setPermitActivities(permitActivities.filter(activity => activity.id !== id));
  };

  const handlePermitSubActivityDelete = (id) => {
    setPermitSubActivities(permitSubActivities.filter(activity => activity.id !== id));
  };

  const handlePermitHazardCategoryDelete = (id) => {
    setPermitHazardCategories(permitHazardCategories.filter(hazard => hazard.id !== id));
  };

  const handlePermitRiskDelete = (id) => {
    setPermitRisks(permitRisks.filter(risk => risk.id !== id));
  };

  const handlePermitSafetyEquipmentDelete = (id) => {
    setPermitSafetyEquipments(permitSafetyEquipments.filter(safety => safety.id !== id));
  };

  const filteredPermitActivities = permitActivities.filter(activity => {
    const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForSub);
    return selectedType ? activity.permitType === selectedType.name : false;
  });

  // Filtered permit activities for hazard category tab
  const filteredPermitActivitiesForHazard = permitActivities.filter(activity => {
    const selectedType = permitTypes.find(type => type.id.toString() === selectedCategoryForHazard);
    return selectedType ? activity.permitType === selectedType.name : false;
  });

  // Filtered permit sub activities for hazard category tab
  const filteredPermitSubActivitiesForHazard = permitSubActivities.filter(subActivity => {
    const selectedActivity = permitActivities.find(activity => activity.id.toString() === selectedSubCategoryForHazard);
    return selectedActivity ? subActivity.permitActivity === selectedActivity.permitActivity : false;
  });

  // Filtered permit activities for risk tab
  const filteredPermitActivitiesForRisk = permitActivities.filter(activity => {
    const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForRisk);
    return selectedType ? activity.permitType === selectedType.name : false;
  });

  // Filtered permit sub activities for risk tab
  const filteredPermitSubActivitiesForRisk = permitSubActivities.filter(subActivity => {
    const selectedActivity = permitActivities.find(activity => activity.id.toString() === selectedSubCategoryForRisk);
    return selectedActivity ? subActivity.permitActivity === selectedActivity.permitActivity : false;
  });

  // Filtered permit hazard categories for risk tab
  const filteredPermitHazardCategoriesForRisk = permitHazardCategories.filter(hazard => {
    const selectedSubActivity = permitSubActivities.find(subActivity => subActivity.id.toString() === selectedSubSubCategoryForRisk);
    return selectedSubActivity ? hazard.subSubCategory === selectedSubActivity.permitSubActivity : false;
  });

  // Filtered permit activities for safety equipment tab
  const filteredPermitActivitiesForSafety = permitActivities.filter(activity => {
    const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForSafety);
    return selectedType ? activity.permitType === selectedType.name : false;
  });

  // Filtered permit sub activities for safety equipment tab
  const filteredPermitSubActivitiesForSafety = permitSubActivities.filter(subActivity => {
    const selectedActivity = permitActivities.find(activity => activity.id.toString() === selectedPermitActivityForSafety);
    return selectedActivity ? subActivity.permitActivity === selectedActivity.permitActivity : false;
  });

  // Filtered permit hazard categories for safety equipment tab
  const filteredPermitHazardCategoriesForSafety = permitHazardCategories.filter(hazard => {
    const selectedSubActivity = permitSubActivities.find(subActivity => subActivity.id.toString() === selectedPermitSubActivityForSafety);
    return selectedSubActivity ? hazard.subSubCategory === selectedSubActivity.permitSubActivity : false;
  });

  // Filtered permit risks for safety equipment tab
  const filteredPermitRisksForSafety = permitRisks.filter(risk => {
    const selectedHazard = permitHazardCategories.find(hazard => hazard.id.toString() === selectedPermitHazardCategoryForSafety);
    return selectedHazard ? risk.subSubSubCategory === selectedHazard.permitHazardCategory : false;
  });

  return (
    <div className="flex-1 p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Permit Setup</h1>
          </div>
          <Button className="bg-gray-600 hover:bg-gray-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Import Permit Tags
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="permit-type" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200">
          <TabsTrigger value="permit-type" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
            Permit Type
          </TabsTrigger>
          <TabsTrigger value="permit-activity" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Activity</TabsTrigger>
          <TabsTrigger value="permit-sub-activity" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Sub Activity</TabsTrigger>
          <TabsTrigger value="permit-hazard-category" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Hazard Category</TabsTrigger>
          <TabsTrigger value="permit-risk" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Risk</TabsTrigger>
          <TabsTrigger value="permit-safety-equipment" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Safety Equipment</TabsTrigger>
        </TabsList>

        <TabsContent value="permit-type" className="space-y-6 mt-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={permitType}
                  onChange={(e) => setPermitType(e.target.value)}
                  className="w-full"
                  placeholder="Enter permit type name"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPermitTypes ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                      Loading permit types...
                    </TableCell>
                  </TableRow>
                ) : permitTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                      No permit types found
                    </TableCell>
                  </TableRow>
                ) : (
                  permitTypes.map((type, index) => (
                    <TableRow key={type.id}>
                      <TableCell className="py-4">{type.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permit-activity" className="space-y-6 mt-6">
          {/* Form */}
          <form onSubmit={handlePermitActivitySubmit} className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select value={selectedPermitType} onValueChange={setSelectedPermitType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingPermitTypes ? "Loading permit types..." : "Select Type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPermitTypes ? (
                      <SelectItem value="loading" disabled>
                        Loading permit types...
                      </SelectItem>
                    ) : permitTypes.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No permit types available
                      </SelectItem>
                    ) : (
                      permitTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={permitActivity}
                  onChange={(e) => setPermitActivity(e.target.value)}
                  className="w-full"
                  placeholder="Enter permit activity name"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmittingPermitActivity}
                className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingPermitActivity ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingPermitActivities ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      Loading permit activities...
                    </TableCell>
                  </TableRow>
                ) : permitActivities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                      No permit activities found
                    </TableCell>
                  </TableRow>
                ) : (
                  permitActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="py-4">{activity.permitType}</TableCell>
                      <TableCell className="py-4">{activity.permitActivity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handlePermitActivityDelete(activity.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permit-sub-activity" className="space-y-6 mt-6">
          {/* Form */}
          <form onSubmit={handlePermitSubActivitySubmit} className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select value={selectedPermitTypeForSub} onValueChange={setSelectedPermitTypeForSub}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingPermitTypes ? "Loading permit types..." : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPermitTypes ? (
                      <SelectItem value="loading" disabled>
                        Loading permit types...
                      </SelectItem>
                    ) : permitTypes.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No permit types available
                      </SelectItem>
                    ) : (
                      permitTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Sub category
                </label>
                <Select
                  value={selectedPermitActivity}
                  onValueChange={setSelectedPermitActivity}
                  disabled={!selectedPermitTypeForSub}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitActivities.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id.toString()}>
                        {activity.permitActivity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={permitSubActivity}
                  onChange={(e) => setPermitSubActivity(e.target.value)}
                  className="w-full"
                  placeholder=""
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmittingPermitSubActivity}
                className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingPermitSubActivity ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permitSubActivities.map((subActivity) => (
                  <TableRow key={subActivity.id}>
                    <TableCell className="py-4">{subActivity.permitType}</TableCell>
                    <TableCell className="py-4">{subActivity.permitActivity}</TableCell>
                    <TableCell className="py-4">{subActivity.permitSubActivity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handlePermitSubActivityDelete(subActivity.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permit-hazard-category" className="space-y-6 mt-6">
          {/* Form */}
          <form onSubmit={handlePermitHazardCategorySubmit} className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select value={selectedCategoryForHazard} onValueChange={setSelectedCategoryForHazard}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingPermitTypes ? "Loading permit types..." : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPermitTypes ? (
                      <SelectItem value="loading" disabled>
                        Loading permit types...
                      </SelectItem>
                    ) : permitTypes.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No permit types available
                      </SelectItem>
                    ) : (
                      permitTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Sub category
                </label>
                <Select value={selectedSubCategoryForHazard} onValueChange={setSelectedSubCategoryForHazard}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitActivitiesForHazard.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id.toString()}>
                        {activity.permitActivity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="sub-sub-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Sub sub category
                </label>
                <Select value={selectedSubSubCategoryForHazard} onValueChange={setSelectedSubSubCategoryForHazard}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitSubActivitiesForHazard.map((subActivity) => (
                      <SelectItem key={subActivity.id} value={subActivity.id.toString()}>
                        {subActivity.permitSubActivity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={permitHazardCategory}
                  onChange={(e) => setPermitHazardCategory(e.target.value)}
                  className="w-full"
                  placeholder=""
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmittingPermitHazardCategory}
                className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingPermitHazardCategory ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Hazard Category</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permitHazardCategories.map((hazard) => (
                  <TableRow key={hazard.id}>
                    <TableCell className="py-4">{hazard.category}</TableCell>
                    <TableCell className="py-4">{hazard.subCategory}</TableCell>
                    <TableCell className="py-4">{hazard.subSubCategory}</TableCell>
                    <TableCell className="py-4">{hazard.permitHazardCategory}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handlePermitHazardCategoryDelete(hazard.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permit-risk" className="space-y-6 mt-6">
          {/* Form */}
          <form onSubmit={handlePermitRiskSubmit} className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label htmlFor="permit-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Permit type
                </label>
                <Select value={selectedPermitTypeForRisk} onValueChange={setSelectedPermitTypeForRisk}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingPermitTypes ? "Loading permit types..." : "Select Category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPermitTypes ? (
                      <SelectItem value="loading" disabled>
                        Loading permit types...
                      </SelectItem>
                    ) : permitTypes.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No permit types available
                      </SelectItem>
                    ) : (
                      permitTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Sub category
                </label>
                <Select value={selectedSubCategoryForRisk} onValueChange={setSelectedSubCategoryForRisk}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitActivitiesForRisk.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id.toString()}>
                        {activity.permitActivity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="sub-sub-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Sub sub category
                </label>
                <Select value={selectedSubSubCategoryForRisk} onValueChange={setSelectedSubSubCategoryForRisk}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitSubActivitiesForRisk.map((subActivity) => (
                      <SelectItem key={subActivity.id} value={subActivity.id.toString()}>
                        {subActivity.permitSubActivity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="sub-sub-sub-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Sub sub sub category
                </label>
                <Select value={selectedSubSubSubCategoryForRisk} onValueChange={setSelectedSubSubSubCategoryForRisk}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sub Sub Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitHazardCategoriesForRisk.map((hazard) => (
                      <SelectItem key={hazard.id} value={hazard.id.toString()}>
                        {hazard.permitHazardCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={permitRisk}
                  onChange={(e) => setPermitRisk(e.target.value)}
                  className="w-full"
                  placeholder=""
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmittingPermitRisk}
                className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingPermitRisk ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Hazard Category</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Risk</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permitRisks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell className="py-4">{risk.permitType}</TableCell>
                    <TableCell className="py-4">{risk.subCategory}</TableCell>
                    <TableCell className="py-4">{risk.subSubCategory}</TableCell>
                    <TableCell className="py-4">{risk.subSubSubCategory}</TableCell>
                    <TableCell className="py-4">{risk.permitRisk}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handlePermitRiskDelete(risk.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permit-safety-equipment" className="space-y-6 mt-6">
          {/* Form */}
          <form onSubmit={handlePermitSafetyEquipmentSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="permit-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Permit type
                </label>
                <Select value={selectedPermitTypeForSafety} onValueChange={setSelectedPermitTypeForSafety}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingPermitTypes ? "Loading..." : "Permit Type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingPermitTypes ? (
                      <SelectItem value="loading" disabled>
                        Loading permit types...
                      </SelectItem>
                    ) : permitTypes.length === 0 ? (
                      <SelectItem value="no-data" disabled>
                        No permit types available
                      </SelectItem>
                    ) : (
                      permitTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="permit-activity" className="block text-sm font-medium text-gray-700 mb-2">
                  Permit activity
                </label>
                <Select value={selectedPermitActivityForSafety} onValueChange={setSelectedPermitActivityForSafety}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Permit Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitActivitiesForSafety.map((activity) => (
                      <SelectItem key={activity.id} value={activity.id.toString()}>
                        {activity.permitActivity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="permit-sub-activity" className="block text-sm font-medium text-gray-700 mb-2">
                  Permit sub activity
                </label>
                <Select value={selectedPermitSubActivityForSafety} onValueChange={setSelectedPermitSubActivityForSafety}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Permit Sub Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitSubActivitiesForSafety.map((subActivity) => (
                      <SelectItem key={subActivity.id} value={subActivity.id.toString()}>
                        {subActivity.permitSubActivity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="permit-hazard-category" className="block text-sm font-medium text-gray-700 mb-2">
                  Permit hazard category
                </label>
                <Select value={selectedPermitHazardCategoryForSafety} onValueChange={setSelectedPermitHazardCategoryForSafety}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Permit Hazard Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitHazardCategoriesForSafety.map((hazard) => (
                      <SelectItem key={hazard.id} value={hazard.id.toString()}>
                        {hazard.permitHazardCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="permit-risk" className="block text-sm font-medium text-gray-700 mb-2">
                  Permit risk
                </label>
                <Select value={selectedPermitRiskForSafety} onValueChange={setSelectedPermitRiskForSafety}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Permit Risk" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPermitRisksForSafety.map((risk) => (
                      <SelectItem key={risk.id} value={risk.id.toString()}>
                        {risk.permitRisk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={permitSafetyEquipment}
                  onChange={(e) => setPermitSafetyEquipment(e.target.value)}
                  className="w-full"
                  placeholder=""
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmittingPermitSafetyEquipment}
                className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingPermitSafetyEquipment ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </form>

          {/* Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Hazard Category</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Risk</TableHead>
                  <TableHead className="font-semibold text-gray-900">Permit Safety Equipment</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permitSafetyEquipments.map((safety) => (
                  <TableRow key={safety.id}>
                    <TableCell className="py-4">{safety.permitType}</TableCell>
                    <TableCell className="py-4">{safety.permitActivity}</TableCell>
                    <TableCell className="py-4">{safety.permitSubActivity}</TableCell>
                    <TableCell className="py-4">{safety.permitHazardCategory}</TableCell>
                    <TableCell className="py-4">{safety.permitRisk}</TableCell>
                    <TableCell className="py-4">{safety.permitSafetyEquipment}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handlePermitSafetyEquipmentDelete(safety.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PermitSetupDashboard;