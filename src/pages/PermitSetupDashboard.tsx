// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Download, Edit, Trash2 } from 'lucide-react';
// import { API_CONFIG, getAuthenticatedFetchOptions, getFullUrl } from '@/config/apiConfig';
// import {
//   FormControl,
//   InputLabel,
//   Select as MuiSelect,
//   MenuItem,
//   ThemeProvider,
//   createTheme
// } from '@mui/material';

// // MUI Theme for consistent styling
// const muiTheme = createTheme({
//   components: {
//     MuiFormControl: {
//       styleOverrides: {
//         root: {
//           width: '100%',
//           '& .MuiOutlinedInput-root': {
//             height: '45px',
//             '@media (max-width: 768px)': {
//               height: '36px',
//             },
//             backgroundColor: '#FFFFFF',
//             '& fieldset': {
//               borderColor: '#d1d5db',
//             },
//             '&:hover fieldset': {
//               borderColor: '#9ca3af',
//             },
//             '&.Mui-focused fieldset': {
//               borderColor: '#C72030',
//               borderWidth: '2px',
//             },
//           },
//         },
//       },
//     },
//     MuiInputLabel: {
//       styleOverrides: {
//         root: {
//           color: '#374151',
//           fontWeight: 500,
//           '&.Mui-focused': {
//             color: '#C72030',
//           },
//         },
//       },
//     },
//     MuiSelect: {
//       styleOverrides: {
//         root: {
//           '& .MuiSelect-select': {
//             padding: '10px 14px',
//             display: 'flex',
//             alignItems: 'center',
//           },
//         },
//       },
//     },
//     MuiMenuItem: {
//       styleOverrides: {
//         root: {
//           '&:hover': {
//             backgroundColor: '#f3f4f6',
//           },
//           '&.Mui-selected': {
//             backgroundColor: '#C72030',
//             color: '#ffffff',
//             '&:hover': {
//               backgroundColor: '#b91c1c',
//             },
//           },
//         },
//       },
//     },
//   },
// });

// // Menu props for consistent dropdown behavior
// const menuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: 300,
//       zIndex: 9999,
//       backgroundColor: 'white',
//       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//     },
//   },
//   MenuListProps: {
//     style: {
//       padding: 0,
//     },
//   },
// };

// export const PermitSetupDashboard = () => {
//   const [permitType, setPermitType] = useState('');
//   const [permitTypes, setPermitTypes] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingPermitTypes, setIsLoadingPermitTypes] = useState(true);

//   // Permit Activity states
//   const [permitActivity, setPermitActivity] = useState('');
//   const [selectedPermitType, setSelectedPermitType] = useState('');
//   const [permitActivities, setPermitActivities] = useState([]);
//   const [isSubmittingPermitActivity, setIsSubmittingPermitActivity] = useState(false);
//   const [isLoadingPermitActivities, setIsLoadingPermitActivities] = useState(true);

//   // Permit Sub Activity states
//   const [permitSubActivity, setPermitSubActivity] = useState('');
//   const [selectedPermitTypeForSub, setSelectedPermitTypeForSub] = useState('');
//   const [selectedPermitActivity, setSelectedPermitActivity] = useState('');
//   const [permitSubActivities, setPermitSubActivities] = useState([
//     { id: 1, permitType: 'test', permitActivity: 'tested', permitSubActivity: 'testing' }
//   ]);
//   const [isSubmittingPermitSubActivity, setIsSubmittingPermitSubActivity] = useState(false);

//   // Permit Hazard Category states
//   const [permitHazardCategory, setPermitHazardCategory] = useState('');
//   const [selectedCategoryForHazard, setSelectedCategoryForHazard] = useState('');
//   const [selectedSubCategoryForHazard, setSelectedSubCategoryForHazard] = useState('');
//   const [selectedSubSubCategoryForHazard, setSelectedSubSubCategoryForHazard] = useState('');
//   const [permitHazardCategories, setPermitHazardCategories] = useState([
//     {
//       id: 1,
//       category: '',
//       subCategory: '',
//       subSubCategory: '',
//       permitHazardCategory: 'Water Sefty'
//     }
//   ]);
//   const [isSubmittingPermitHazardCategory, setIsSubmittingPermitHazardCategory] = useState(false);

//   // Permit Risk states
//   const [permitRisk, setPermitRisk] = useState('');
//   const [selectedPermitTypeForRisk, setSelectedPermitTypeForRisk] = useState('');
//   const [selectedSubCategoryForRisk, setSelectedSubCategoryForRisk] = useState('');
//   const [selectedSubSubCategoryForRisk, setSelectedSubSubCategoryForRisk] = useState('');
//   const [selectedSubSubSubCategoryForRisk, setSelectedSubSubSubCategoryForRisk] = useState('');
//   const [permitRisks, setPermitRisks] = useState([
//     {
//       id: 1,
//       permitType: '',
//       subCategory: '',
//       subSubCategory: '',
//       subSubSubCategory: '',
//       permitRisk: 'Electrical Approvall'
//     }
//   ]);
//   const [isSubmittingPermitRisk, setIsSubmittingPermitRisk] = useState(false);

//   // Permit Safety Equipment states
//   const [permitSafetyEquipment, setPermitSafetyEquipment] = useState('');
//   const [selectedPermitTypeForSafety, setSelectedPermitTypeForSafety] = useState('');
//   const [selectedPermitActivityForSafety, setSelectedPermitActivityForSafety] = useState('');
//   const [selectedPermitSubActivityForSafety, setSelectedPermitSubActivityForSafety] = useState('');
//   const [selectedPermitHazardCategoryForSafety, setSelectedPermitHazardCategoryForSafety] = useState('');
//   const [selectedPermitRiskForSafety, setSelectedPermitRiskForSafety] = useState('');
//   const [permitSafetyEquipments, setPermitSafetyEquipments] = useState([
//     {
//       id: 1,
//       permitType: '',
//       permitActivity: '',
//       permitSubActivity: '',
//       permitHazardCategory: '',
//       permitRisk: '',
//       permitSafetyEquipment: 'Waste Management'
//     }
//   ]);
//   const [isSubmittingPermitSafetyEquipment, setIsSubmittingPermitSafetyEquipment] = useState(false);

//   // API service function for creating permit type
//   const createPermitType = async (name) => {
//     try {
//       const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
//       const options = getAuthenticatedFetchOptions('POST', {
//         pms_permit_tag: {
//           name: name,
//           active: true,
//           parent_id: null,
//           tag_type: "PermitType"
//         }
//       });

//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating permit type:', error);
//       throw error;
//     }
//   };

//   // API service function for fetching permit types
//   const fetchPermitTypes = async () => {
//     try {
//       const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
//       const options = getAuthenticatedFetchOptions('GET');
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching permit types:', error);
//       throw error;
//     }
//   };

//   // Function to load permit types from API
//   const loadPermitTypes = async () => {
//     try {
//       setIsLoadingPermitTypes(true);
//       const data = await fetchPermitTypes();
//       console.log('Fetched permit types:', data);
//       let permitTypeItems = [];
//       if (data && Array.isArray(data)) {
//         permitTypeItems = data
//           .filter(item => item.tag_type === 'PermitType')
//           .map(item => ({
//             id: item.id,
//             name: item.name
//           }));
//         setPermitTypes(permitTypeItems);
//       } else if (data && data.permit_tags) {
//         permitTypeItems = data.permit_tags
//           .filter(item => item.tag_type === 'PermitType')
//           .map(item => ({
//             id: item.id,
//             name: item.name
//           }));
//         setPermitTypes(permitTypeItems);
//       }
//       return permitTypeItems;
//     } catch (error) {
//       console.error('Failed to load permit types:', error);
//     } finally {
//       setIsLoadingPermitTypes(false);
//     }
//   };

//   // API service function for creating permit activity
//   const createPermitActivity = async (name, parentId) => {
//     try {
//       const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
//       const options = getAuthenticatedFetchOptions('POST', {
//         pms_permit_tag: {
//           name: name,
//           active: true,
//           parent_id: parentId,
//           tag_type: "PermitActivity"
//         }
//       });
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating permit activity:', error);
//       throw error;
//     }
//   };

//   // API service function for fetching permit activities
//   const fetchPermitActivities = async () => {
//     try {
//       const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitActivity`;
//       const options = getAuthenticatedFetchOptions('GET');
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching permit activities:', error);
//       throw error;
//     }
//   };

//   // API service function for creating permit sub activity
//   const createPermitSubActivity = async (name, parentId) => {
//     try {
//       const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
//       const options = getAuthenticatedFetchOptions('POST', {
//         pms_permit_tag: {
//           name: name,
//           active: true,
//           parent_id: parentId,
//           tag_type: "PermitSubActivity"
//         }
//       });
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating permit sub activity:', error);
//       throw error;
//     }
//   };

//   // API service function for fetching permit sub activities
//   const fetchPermitSubActivities = async () => {
//     try {
//       const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitSubActivity`;
//       const options = getAuthenticatedFetchOptions('GET');
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching permit sub activities:', error);
//       throw error;
//     }
//   };

//   // API service function for creating permit hazard category
//   const createPermitHazardCategory = async (name, parentId) => {
//     try {
//       const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
//       const options = getAuthenticatedFetchOptions('POST', {
//         pms_permit_tag: {
//           name: name,
//           active: true,
//           parent_id: parentId,
//           tag_type: "PermitHazardCategory"
//         }
//       });
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating permit hazard category:', error);
//       throw error;
//     }
//   };

//   // API service function for fetching permit hazard categories
//   const fetchPermitHazardCategories = async () => {
//     try {
//       const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitHazardCategory`;
//       const options = getAuthenticatedFetchOptions('GET');
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching permit hazard categories:', error);
//       throw error;
//     }
//   };

//   // API service function for creating permit risk
//   const createPermitRisk = async (name, parentId) => {
//     try {
//       const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
//       const options = getAuthenticatedFetchOptions('POST', {
//         pms_permit_tag: {
//           name: name,
//           active: true,
//           parent_id: parentId,
//           tag_type: "PermitRisk"
//         }
//       });
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating permit risk:', error);
//       throw error;
//     }
//   };

//   // API service function for fetching permit risks
//   const fetchPermitRisks = async () => {
//     try {
//       const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitRisk`;
//       const options = getAuthenticatedFetchOptions('GET');
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching permit risks:', error);
//       throw error;
//     }
//   };

//   // API service function for creating permit safety equipment
//   const createPermitSafetyEquipment = async (name, parentId) => {
//     try {
//       const url = getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS);
//       const options = getAuthenticatedFetchOptions('POST', {
//         pms_permit_tag: {
//           name: name,
//           active: true,
//           parent_id: parentId,
//           tag_type: "PermitSafetyEquipment"
//         }
//       });
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error creating permit safety equipment:', error);
//       throw error;
//     }
//   };

//   // API service function for fetching permit safety equipment
//   const fetchPermitSafetyEquipments = async () => {
//     try {
//       const url = `${getFullUrl(API_CONFIG.ENDPOINTS.PERMIT_TAGS)}?q[tag_type_eq]=PermitSafetyEquipment`;
//       const options = getAuthenticatedFetchOptions('GET');
//       const response = await fetch(url, options);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching permit safety equipment:', error);
//       throw error;
//     }
//   };

//   // Function to load permit activities from API
//   const loadPermitActivities = async () => {
//     try {
//       setIsLoadingPermitActivities(true);
//       const data = await fetchPermitActivities();
//       console.log('Fetched permit activities:', data);
//       if (data && Array.isArray(data)) {
//         const permitActivityItems = data
//           .filter(item => item.tag_type === 'PermitActivity')
//           .map(item => {
//             const parentType = permitTypes.find(type => type.id === item.parent_id);
//             return {
//               id: item.id,
//               permitType: parentType ? parentType.name : 'Unknown',
//               permitActivity: item.name,
//               parentId: item.parent_id
//             };
//           });
//         setPermitActivities(permitActivityItems);
//       }
//     } catch (error) {
//       console.error('Failed to load permit activities:', error);
//     } finally {
//       setIsLoadingPermitActivities(false);
//     }
//   };

//   // Load permit types on component mount and then load all other data
//   useEffect(() => {
//     loadAllData();
//   }, []);

//   // Clear dependent selections when parent selections change
//   useEffect(() => {
//     setSelectedPermitActivity('');
//   }, [selectedPermitTypeForSub]);

//   useEffect(() => {
//     setSelectedSubCategoryForHazard('');
//     setSelectedSubSubCategoryForHazard('');
//   }, [selectedCategoryForHazard]);

//   useEffect(() => {
//     setSelectedSubSubCategoryForHazard('');
//   }, [selectedSubCategoryForHazard]);

//   useEffect(() => {
//     setSelectedSubCategoryForRisk('');
//     setSelectedSubSubCategoryForRisk('');
//     setSelectedSubSubSubCategoryForRisk('');
//   }, [selectedPermitTypeForRisk]);

//   useEffect(() => {
//     setSelectedSubSubCategoryForRisk('');
//     setSelectedSubSubSubCategoryForRisk('');
//   }, [selectedSubCategoryForRisk]);

//   useEffect(() => {
//     setSelectedSubSubSubCategoryForRisk('');
//   }, [selectedSubSubCategoryForRisk]);

//   useEffect(() => {
//     setSelectedPermitActivityForSafety('');
//     setSelectedPermitSubActivityForSafety('');
//     setSelectedPermitHazardCategoryForSafety('');
//     setSelectedPermitRiskForSafety('');
//   }, [selectedPermitTypeForSafety]);

//   useEffect(() => {
//     setSelectedPermitSubActivityForSafety('');
//     setSelectedPermitHazardCategoryForSafety('');
//     setSelectedPermitRiskForSafety('');
//   }, [selectedPermitActivityForSafety]);

//   useEffect(() => {
//     setSelectedPermitHazardCategoryForSafety('');
//     setSelectedPermitRiskForSafety('');
//   }, [selectedPermitSubActivityForSafety]);

//   useEffect(() => {
//     setSelectedPermitRiskForSafety('');
//   }, [selectedPermitHazardCategoryForSafety]);

//   // Function to reload all data
//   const loadAllData = async () => {
//     try {
//       // First load permit types and get the actual data
//       const permitTypeItems = await loadPermitTypes();

//       // Then load all other data in parallel
//       const [activitiesData, subActivitiesData, hazardCategoriesData, risksData, safetyEquipmentData] = await Promise.all([
//         fetchPermitActivities(),
//         fetchPermitSubActivities(),
//         fetchPermitHazardCategories(),
//         fetchPermitRisks(),
//         fetchPermitSafetyEquipments()
//       ]);

//       // Create lookup maps for faster access
//       const allData = {
//         permitTypes: permitTypeItems || [],
//         permitActivities: activitiesData?.filter(item => item.tag_type === 'PermitActivity') || [],
//         permitSubActivities: subActivitiesData?.filter(item => item.tag_type === 'PermitSubActivity') || [],
//         permitHazardCategories: hazardCategoriesData?.filter(item => item.tag_type === 'PermitHazardCategory') || [],
//         permitRisks: risksData?.filter(item => item.tag_type === 'PermitRisk') || [],
//         permitSafetyEquipments: safetyEquipmentData?.filter(item => item.tag_type === 'PermitSafetyEquipment') || []
//       };

//       // Create lookup function
//       const findItemById = (array, id) => array.find(item => item.id === id);
//       const getParentName = (array, id) => {
//         const item = findItemById(array, id);
//         return item ? item.name : 'Unknown';
//       };

//       // Process permit activities
//       const processedActivities = allData.permitActivities.map(item => {
//         const parentType = findItemById(allData.permitTypes, item.parent_id);
//         return {
//           id: item.id,
//           permitType: parentType ? parentType.name : 'Unknown',
//           permitActivity: item.name,
//           parentId: item.parent_id
//         };
//       });
//       setPermitActivities(processedActivities);

//       // Process permit sub activities
//       const processedSubActivities = allData.permitSubActivities.map(item => {
//         const parentActivity = findItemById(processedActivities, item.parent_id);
//         const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
//         return {
//           id: item.id,
//           permitType: parentType ? parentType.name : 'Unknown',
//           permitActivity: parentActivity ? parentActivity.permitActivity : 'Unknown',
//           permitSubActivity: item.name,
//           parentId: item.parent_id
//         };
//       });
//       setPermitSubActivities(processedSubActivities);

//       // Process permit hazard categories
//       const processedHazardCategories = allData.permitHazardCategories.map(item => {
//         const parentSubActivity = findItemById(processedSubActivities, item.parent_id);
//         const parentActivity = parentSubActivity ? findItemById(processedActivities, parentSubActivity.parentId) : null;
//         const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
//         return {
//           id: item.id,
//           category: parentType ? parentType.name : 'Unknown',
//           subCategory: parentActivity ? parentActivity.permitActivity : 'Unknown',
//           subSubCategory: parentSubActivity ? parentSubActivity.permitSubActivity : 'Unknown',
//           permitHazardCategory: item.name,
//           parentId: item.parent_id
//         };
//       });
//       setPermitHazardCategories(processedHazardCategories);

//       // Process permit risks
//       const processedRisks = allData.permitRisks.map(item => {
//         const parentHazardCategory = findItemById(processedHazardCategories, item.parent_id);
//         const parentSubActivity = parentHazardCategory ? findItemById(processedSubActivities, parentHazardCategory.parentId) : null;
//         const parentActivity = parentSubActivity ? findItemById(processedActivities, parentSubActivity.parentId) : null;
//         const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
//         return {
//           id: item.id,
//           permitType: parentType ? parentType.name : 'Unknown',
//           subCategory: parentActivity ? parentActivity.permitActivity : 'Unknown',
//           subSubCategory: parentSubActivity ? parentSubActivity.permitSubActivity : 'Unknown',
//           subSubSubCategory: parentHazardCategory ? parentHazardCategory.permitHazardCategory : 'Unknown',
//           permitRisk: item.name,
//           parentId: item.parent_id
//         };
//       });
//       setPermitRisks(processedRisks);

//       // Process permit safety equipment
//       const processedSafetyEquipment = allData.permitSafetyEquipments.map(item => {
//         const parentRisk = findItemById(processedRisks, item.parent_id);
//         const parentHazardCategory = parentRisk ? findItemById(processedHazardCategories, parentRisk.parentId) : null;
//         const parentSubActivity = parentHazardCategory ? findItemById(processedSubActivities, parentHazardCategory.parentId) : null;
//         const parentActivity = parentSubActivity ? findItemById(processedActivities, parentSubActivity.parentId) : null;
//         const parentType = parentActivity ? findItemById(allData.permitTypes, parentActivity.parentId) : null;
//         return {
//           id: item.id,
//           permitType: parentType ? parentType.name : 'Unknown',
//           permitActivity: parentActivity ? parentActivity.permitActivity : 'Unknown',
//           permitSubActivity: parentSubActivity ? parentSubActivity.permitSubActivity : 'Unknown',
//           permitHazardCategory: parentHazardCategory ? parentHazardCategory.permitHazardCategory : 'Unknown',
//           permitRisk: parentRisk ? parentRisk.permitRisk : 'Unknown',
//           permitSafetyEquipment: item.name
//         };
//       });
//       setPermitSafetyEquipments(processedSafetyEquipment);

//     } catch (error) {
//       console.error('Failed to load permit data:', error);
//     } finally {
//       setIsLoadingPermitTypes(false);
//       setIsLoadingPermitActivities(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (permitType.trim() && !isSubmitting) {
//       setIsSubmitting(true);
//       try {
//         const response = await createPermitType(permitType);
//         setPermitType('');
//         await loadAllData();
//         console.log('Permit type created successfully:', response);
//       } catch (error) {
//         console.error('Failed to create permit type:', error);
//         alert('Failed to create permit type. Please try again.');
//       } finally {
//         setIsSubmitting(false);
//       }
//     }
//   };

//   const handlePermitActivitySubmit = async (e) => {
//     e.preventDefault();
//     if (permitActivity.trim() && selectedPermitType && !isSubmittingPermitActivity) {
//       const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitType);
//       if (selectedType) {
//         setIsSubmittingPermitActivity(true);
//         try {
//           const response = await createPermitActivity(permitActivity, selectedType.id);
//           setPermitActivity('');
//           setSelectedPermitType('');
//           await loadAllData();
//           console.log('Permit activity created successfully:', response);
//         } catch (error) {
//           console.error('Failed to create permit activity:', error);
//           alert('Failed to create permit activity. Please try again.');
//         } finally {
//           setIsSubmittingPermitActivity(false);
//         }
//       }
//     }
//   };

//   const handlePermitSubActivitySubmit = async (e) => {
//     e.preventDefault();
//     if (permitSubActivity.trim() && selectedPermitTypeForSub && selectedPermitActivity && !isSubmittingPermitSubActivity) {
//       const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForSub);
//       const selectedActivity = permitActivities.find(activity =>
//         activity.id.toString() === selectedPermitActivity &&
//         activity.permitType === selectedType?.name
//       );

//       if (selectedType && selectedActivity) {
//         setIsSubmittingPermitSubActivity(true);
//         try {
//           const response = await createPermitSubActivity(permitSubActivity, selectedActivity.id);
//           setPermitSubActivity('');
//           setSelectedPermitTypeForSub('');
//           setSelectedPermitActivity('');
//           await loadAllData();
//           console.log('Permit sub activity created successfully:', response);
//         } catch (error) {
//           console.error('Failed to create permit sub activity:', error);
//           alert('Failed to create permit sub activity. Please try again.');
//         } finally {
//           setIsSubmittingPermitSubActivity(false);
//         }
//       }
//     }
//   };

//   const handlePermitHazardCategorySubmit = async (e) => {
//     e.preventDefault();
//     if (permitHazardCategory.trim() && selectedSubSubCategoryForHazard && !isSubmittingPermitHazardCategory) {
//       const selectedSubActivity = permitSubActivities.find(subActivity => subActivity.id.toString() === selectedSubSubCategoryForHazard);
//       if (selectedSubActivity) {
//         setIsSubmittingPermitHazardCategory(true);
//         try {
//           const response = await createPermitHazardCategory(permitHazardCategory, selectedSubActivity.id);
//           setPermitHazardCategory('');
//           setSelectedCategoryForHazard('');
//           setSelectedSubCategoryForHazard('');
//           setSelectedSubSubCategoryForHazard('');
//           await loadAllData();
//           console.log('Permit hazard category created successfully:', response);
//         } catch (error) {
//           console.error('Failed to create permit hazard category:', error);
//           alert('Failed to create permit hazard category. Please try again.');
//         } finally {
//           setIsSubmittingPermitHazardCategory(false);
//         }
//       }
//     }
//   };

//   const handlePermitRiskSubmit = async (e) => {
//     e.preventDefault();
//     if (permitRisk.trim() && selectedSubSubSubCategoryForRisk && !isSubmittingPermitRisk) {
//       const selectedHazardCategory = permitHazardCategories.find(hazard => hazard.id.toString() === selectedSubSubSubCategoryForRisk);
//       if (selectedHazardCategory) {
//         setIsSubmittingPermitRisk(true);
//         try {
//           const response = await createPermitRisk(permitRisk, selectedHazardCategory.id);
//           setPermitRisk('');
//           setSelectedPermitTypeForRisk('');
//           setSelectedSubCategoryForRisk('');
//           setSelectedSubSubCategoryForRisk('');
//           setSelectedSubSubSubCategoryForRisk('');
//           await loadAllData();
//           console.log('Permit risk created successfully:', response);
//         } catch (error) {
//           console.error('Failed to create permit risk:', error);
//           alert('Failed to create permit risk. Please try again.');
//         } finally {
//           setIsSubmittingPermitRisk(false);
//         }
//       }
//     }
//   };

//   const handlePermitSafetyEquipmentSubmit = async (e) => {
//     e.preventDefault();
//     if (permitSafetyEquipment.trim() && selectedPermitRiskForSafety && !isSubmittingPermitSafetyEquipment) {
//       const selectedRisk = permitRisks.find(risk => risk.id.toString() === selectedPermitRiskForSafety);
//       if (selectedRisk) {
//         setIsSubmittingPermitSafetyEquipment(true);
//         try {
//           const response = await createPermitSafetyEquipment(permitSafetyEquipment, selectedRisk.id);
//           setPermitSafetyEquipment('');
//           setSelectedPermitTypeForSafety('');
//           setSelectedPermitActivityForSafety('');
//           setSelectedPermitSubActivityForSafety('');
//           setSelectedPermitHazardCategoryForSafety('');
//           setSelectedPermitRiskForSafety('');
//           await loadAllData();
//           console.log('Permit safety equipment created successfully:', response);
//         } catch (error) {
//           console.error('Failed to create permit safety equipment:', error);
//           alert('Failed to create permit safety equipment. Please try again.');
//         } finally {
//           setIsSubmittingPermitSafetyEquipment(false);
//         }
//       }
//     }
//   };

//   const handleDelete = (index) => {
//     setPermitTypes(permitTypes.filter((_, i) => i !== index));
//   };

//   const handlePermitActivityDelete = (id) => {
//     setPermitActivities(permitActivities.filter(activity => activity.id !== id));
//   };

//   const handlePermitSubActivityDelete = (id) => {
//     setPermitSubActivities(permitSubActivities.filter(activity => activity.id !== id));
//   };

//   const handlePermitHazardCategoryDelete = (id) => {
//     setPermitHazardCategories(permitHazardCategories.filter(hazard => hazard.id !== id));
//   };

//   const handlePermitRiskDelete = (id) => {
//     setPermitRisks(permitRisks.filter(risk => risk.id !== id));
//   };

//   const handlePermitSafetyEquipmentDelete = (id) => {
//     setPermitSafetyEquipments(permitSafetyEquipments.filter(safety => safety.id !== id));
//   };

//   const filteredPermitActivities = permitActivities.filter(activity => {
//     const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForSub);
//     return selectedType ? activity.permitType === selectedType.name : false;
//   });

//   // Filtered permit activities for hazard category tab
//   const filteredPermitActivitiesForHazard = permitActivities.filter(activity => {
//     const selectedType = permitTypes.find(type => type.id.toString() === selectedCategoryForHazard);
//     return selectedType ? activity.permitType === selectedType.name : false;
//   });

//   // Filtered permit sub activities for hazard category tab
//   const filteredPermitSubActivitiesForHazard = permitSubActivities.filter(subActivity => {
//     const selectedActivity = permitActivities.find(activity => activity.id.toString() === selectedSubCategoryForHazard);
//     return selectedActivity ? subActivity.permitActivity === selectedActivity.permitActivity : false;
//   });

//   // Filtered permit activities for risk tab
//   const filteredPermitActivitiesForRisk = permitActivities.filter(activity => {
//     const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForRisk);
//     return selectedType ? activity.permitType === selectedType.name : false;
//   });

//   // Filtered permit sub activities for risk tab
//   const filteredPermitSubActivitiesForRisk = permitSubActivities.filter(subActivity => {
//     const selectedActivity = permitActivities.find(activity => activity.id.toString() === selectedSubCategoryForRisk);
//     return selectedActivity ? subActivity.permitActivity === selectedActivity.permitActivity : false;
//   });

//   // Filtered permit hazard categories for risk tab
//   const filteredPermitHazardCategoriesForRisk = permitHazardCategories.filter(hazard => {
//     const selectedSubActivity = permitSubActivities.find(subActivity => subActivity.id.toString() === selectedSubSubCategoryForRisk);
//     return selectedSubActivity ? hazard.subSubCategory === selectedSubActivity.permitSubActivity : false;
//   });

//   // Filtered permit activities for safety equipment tab
//   const filteredPermitActivitiesForSafety = permitActivities.filter(activity => {
//     const selectedType = permitTypes.find(type => type.id.toString() === selectedPermitTypeForSafety);
//     return selectedType ? activity.permitType === selectedType.name : false;
//   });

//   // Filtered permit sub activities for safety equipment tab
//   const filteredPermitSubActivitiesForSafety = permitSubActivities.filter(subActivity => {
//     const selectedActivity = permitActivities.find(activity => activity.id.toString() === selectedPermitActivityForSafety);
//     return selectedActivity ? subActivity.permitActivity === selectedActivity.permitActivity : false;
//   });

//   // Filtered permit hazard categories for safety equipment tab
//   const filteredPermitHazardCategoriesForSafety = permitHazardCategories.filter(hazard => {
//     const selectedSubActivity = permitSubActivities.find(subActivity => subActivity.id.toString() === selectedPermitSubActivityForSafety);
//     return selectedSubActivity ? hazard.subSubCategory === selectedSubActivity.permitSubActivity : false;
//   });

//   // Filtered permit risks for safety equipment tab
//   const filteredPermitRisksForSafety = permitRisks.filter(risk => {
//     const selectedHazard = permitHazardCategories.find(hazard => hazard.id.toString() === selectedPermitHazardCategoryForSafety);
//     return selectedHazard ? risk.subSubSubCategory === selectedHazard.permitHazardCategory : false;
//   });

//   return (
//     <ThemeProvider theme={muiTheme}>
//       <div className="flex-1 p-6 bg-white min-h-screen">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Permit Setup</h1>
//             </div>
//             <Button className="bg-gray-600 hover:bg-gray-700 text-white">
//               <Download className="w-4 h-4 mr-2" />
//               Import Permit Tags
//             </Button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <Tabs defaultValue="permit-type" className="w-full">
//           <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200">
//             <TabsTrigger value="permit-type" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
//               Permit Type
//             </TabsTrigger>
//             <TabsTrigger value="permit-activity" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Activity</TabsTrigger>
//             <TabsTrigger value="permit-sub-activity" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Sub Activity</TabsTrigger>
//             <TabsTrigger value="permit-hazard-category" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Hazard Category</TabsTrigger>
//             <TabsTrigger value="permit-risk" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Risk</TabsTrigger>
//             <TabsTrigger value="permit-safety-equipment" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">Permit Safety Equipment</TabsTrigger>
//           </TabsList>

//           <TabsContent value="permit-type" className="space-y-6 mt-6">
//             {/* Form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="flex items-end gap-4">
//                 <div className="flex-1">
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Name
//                   </label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={permitType}
//                     onChange={(e) => setPermitType(e.target.value)}
//                     className="w-full"
//                     placeholder="Enter permit type name"
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmitting ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </div>
//             </form>

//             {/* Table */}
//             <div className="bg-white rounded-lg border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50">
//                     <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
//                     <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {isLoadingPermitTypes ? (
//                     <TableRow>
//                       <TableCell colSpan={2} className="text-center py-8 text-gray-500">
//                         Loading permit types...
//                       </TableCell>
//                     </TableRow>
//                   ) : permitTypes.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={2} className="text-center py-8 text-gray-500">
//                         No permit types found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     permitTypes.map((type, index) => (
//                       <TableRow key={type.id}>
//                         <TableCell className="py-4">{type.name}</TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex justify-end gap-2">
//                             <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
//                               <Edit className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-red-500 hover:text-red-600"
//                               onClick={() => handleDelete(index)}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>

//           <TabsContent value="permit-activity" className="space-y-6 mt-6">
//             {/* Form */}
//             <form onSubmit={handlePermitActivitySubmit} className="space-y-4">
//               <div className="flex items-end gap-4">
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Category</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitType}
//                       onChange={(e) => setSelectedPermitType(e.target.value)}
//                       label="Category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       {isLoadingPermitTypes ? (
//                         <MenuItem value="" disabled>
//                           Loading permit types...
//                         </MenuItem>
//                       ) : permitTypes.length === 0 ? (
//                         <MenuItem value="" disabled>
//                           No permit types available
//                         </MenuItem>
//                       ) : (
//                         permitTypes.map((type) => (
//                           <MenuItem key={type.id} value={type.id.toString()}>
//                             {type.name}
//                           </MenuItem>
//                         ))
//                       )}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Name
//                   </label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={permitActivity}
//                     onChange={(e) => setPermitActivity(e.target.value)}
//                     className="w-full"
//                     placeholder="Enter permit activity name"
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={isSubmittingPermitActivity}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmittingPermitActivity ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </div>
//             </form>

//             {/* Table */}
//             <div className="bg-white rounded-lg border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50">
//                     <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {isLoadingPermitActivities ? (
//                     <TableRow>
//                       <TableCell colSpan={3} className="text-center py-8 text-gray-500">
//                         Loading permit activities...
//                       </TableCell>
//                     </TableRow>
//                   ) : permitActivities.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={3} className="text-center py-8 text-gray-500">
//                         No permit activities found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     permitActivities.map((activity) => (
//                       <TableRow key={activity.id}>
//                         <TableCell className="py-4">{activity.permitType}</TableCell>
//                         <TableCell className="py-4">{activity.permitActivity}</TableCell>
//                         <TableCell className="text-right">
//                           <div className="flex justify-end gap-2">
//                             <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
//                               <Edit className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="text-red-500 hover:text-red-600"
//                               onClick={() => handlePermitActivityDelete(activity.id)}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>

//           <TabsContent value="permit-sub-activity" className="space-y-6 mt-6">
//             {/* Form */}
//             <form onSubmit={handlePermitSubActivitySubmit} className="space-y-4">
//               <div className="flex items-end gap-4">
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Category</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitTypeForSub}
//                       onChange={(e) => setSelectedPermitTypeForSub(e.target.value)}
//                       label="Category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       {isLoadingPermitTypes ? (
//                         <MenuItem value="" disabled>
//                           Loading permit types...
//                         </MenuItem>
//                       ) : permitTypes.length === 0 ? (
//                         <MenuItem value="" disabled>
//                           No permit types available
//                         </MenuItem>
//                       ) : (
//                         permitTypes.map((type) => (
//                           <MenuItem key={type.id} value={type.id.toString()}>
//                             {type.name}
//                           </MenuItem>
//                         ))
//                       )}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Sub category</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitActivity}
//                       onChange={(e) => setSelectedPermitActivity(e.target.value)}
//                       label="Sub category"
//                       displayEmpty
//                       disabled={!selectedPermitTypeForSub}
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Select Sub Category</em>
//                       </MenuItem>
//                       {filteredPermitActivities.map((activity) => (
//                         <MenuItem key={activity.id} value={activity.id.toString()}>
//                           {activity.permitActivity}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Name
//                   </label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={permitSubActivity}
//                     onChange={(e) => setPermitSubActivity(e.target.value)}
//                     className="w-full"
//                     placeholder=""
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={isSubmittingPermitSubActivity}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmittingPermitSubActivity ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </div>
//             </form>

//             {/* Table */}
//             <div className="bg-white rounded-lg border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50">
//                     <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {permitSubActivities.map((subActivity) => (
//                     <TableRow key={subActivity.id}>
//                       <TableCell className="py-4">{subActivity.permitType}</TableCell>
//                       <TableCell className="py-4">{subActivity.permitActivity}</TableCell>
//                       <TableCell className="py-4">{subActivity.permitSubActivity}</TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-500 hover:text-red-600"
//                             onClick={() => handlePermitSubActivityDelete(subActivity.id)}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>

//           <TabsContent value="permit-hazard-category" className="space-y-6 mt-6">
//             {/* Form */}
//             <form onSubmit={handlePermitHazardCategorySubmit} className="space-y-4">
//               <div className="flex items-end gap-4">
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Category</InputLabel>
//                     <MuiSelect
//                       value={selectedCategoryForHazard}
//                       onChange={(e) => setSelectedCategoryForHazard(e.target.value)}
//                       label="Category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       {isLoadingPermitTypes ? (
//                         <MenuItem value="" disabled>
//                           Loading permit types...
//                         </MenuItem>
//                       ) : permitTypes.length === 0 ? (
//                         <MenuItem value="" disabled>
//                           No permit types available
//                         </MenuItem>
//                       ) : (
//                         permitTypes.map((type) => (
//                           <MenuItem key={type.id} value={type.id.toString()}>
//                             {type.name}
//                           </MenuItem>
//                         ))
//                       )}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Sub category</InputLabel>
//                     <MuiSelect
//                       value={selectedSubCategoryForHazard}
//                       onChange={(e) => setSelectedSubCategoryForHazard(e.target.value)}
//                       label="Sub category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Select Sub Category</em>
//                       </MenuItem>
//                       {filteredPermitActivitiesForHazard.map((activity) => (
//                         <MenuItem key={activity.id} value={activity.id.toString()}>
//                           {activity.permitActivity}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Sub sub category</InputLabel>
//                     <MuiSelect
//                       value={selectedSubSubCategoryForHazard}
//                       onChange={(e) => setSelectedSubSubCategoryForHazard(e.target.value)}
//                       label="Sub sub category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Select Sub Sub Category</em>
//                       </MenuItem>
//                       {filteredPermitSubActivitiesForHazard.map((subActivity) => (
//                         <MenuItem key={subActivity.id} value={subActivity.id.toString()}>
//                           {subActivity.permitSubActivity}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Name
//                   </label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={permitHazardCategory}
//                     onChange={(e) => setPermitHazardCategory(e.target.value)}
//                     className="w-full"
//                     placeholder=""
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={isSubmittingPermitHazardCategory}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmittingPermitHazardCategory ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </div>
//             </form>

//             {/* Table */}
//             <div className="bg-white rounded-lg border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50">
//                     <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Hazard Category</TableHead>
//                     <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {permitHazardCategories.map((hazard) => (
//                     <TableRow key={hazard.id}>
//                       <TableCell className="py-4">{hazard.category}</TableCell>
//                       <TableCell className="py-4">{hazard.subCategory}</TableCell>
//                       <TableCell className="py-4">{hazard.subSubCategory}</TableCell>
//                       <TableCell className="py-4">{hazard.permitHazardCategory}</TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-500 hover:text-red-600"
//                             onClick={() => handlePermitHazardCategoryDelete(hazard.id)}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>

//           <TabsContent value="permit-risk" className="space-y-6 mt-6">
//             {/* Form */}
//             <form onSubmit={handlePermitRiskSubmit} className="space-y-4">
//               <div className="flex items-end gap-4">
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Permit type</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitTypeForRisk}
//                       onChange={(e) => setSelectedPermitTypeForRisk(e.target.value)}
//                       label="Permit type"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       {isLoadingPermitTypes ? (
//                         <MenuItem value="" disabled>
//                           Loading permit types...
//                         </MenuItem>
//                       ) : permitTypes.length === 0 ? (
//                         <MenuItem value="" disabled>
//                           No permit types available
//                         </MenuItem>
//                       ) : (
//                         permitTypes.map((type) => (
//                           <MenuItem key={type.id} value={type.id.toString()}>
//                             {type.name}
//                           </MenuItem>
//                         ))
//                       )}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Sub category</InputLabel>
//                     <MuiSelect
//                       value={selectedSubCategoryForRisk}
//                       onChange={(e) => setSelectedSubCategoryForRisk(e.target.value)}
//                       label="Sub category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Select Sub Category</em>
//                       </MenuItem>
//                       {filteredPermitActivitiesForRisk.map((activity) => (
//                         <MenuItem key={activity.id} value={activity.id.toString()}>
//                           {activity.permitActivity}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Sub sub category</InputLabel>
//                     <MuiSelect
//                       value={selectedSubSubCategoryForRisk}
//                       onChange={(e) => setSelectedSubSubCategoryForRisk(e.target.value)}
//                       label="Sub sub category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Select Sub Sub Category</em>
//                       </MenuItem>
//                       {filteredPermitSubActivitiesForRisk.map((subActivity) => (
//                         <MenuItem key={subActivity.id} value={subActivity.id.toString()}>
//                           {subActivity.permitSubActivity}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Sub sub sub category</InputLabel>
//                     <MuiSelect
//                       value={selectedSubSubSubCategoryForRisk}
//                       onChange={(e) => setSelectedSubSubSubCategoryForRisk(e.target.value)}
//                       label="Sub sub sub category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Select Sub Sub Sub Category</em>
//                       </MenuItem>
//                       {filteredPermitHazardCategoriesForRisk.map((hazard) => (
//                         <MenuItem key={hazard.id} value={hazard.id.toString()}>
//                           {hazard.permitHazardCategory}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div className="flex-1">
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Name
//                   </label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={permitRisk}
//                     onChange={(e) => setPermitRisk(e.target.value)}
//                     className="w-full"
//                     placeholder=""
//                   />
//                 </div>
//                 <Button
//                   type="submit"
//                   disabled={isSubmittingPermitRisk}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmittingPermitRisk ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </div>
//             </form>

//             {/* Table */}
//             <div className="bg-white rounded-lg border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50">
//                     <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Hazard Category</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Risk</TableHead>
//                     <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {permitRisks.map((risk) => (
//                     <TableRow key={risk.id}>
//                       <TableCell className="py-4">{risk.permitType}</TableCell>
//                       <TableCell className="py-4">{risk.subCategory}</TableCell>
//                       <TableCell className="py-4">{risk.subSubCategory}</TableCell>
//                       <TableCell className="py-4">{risk.subSubSubCategory}</TableCell>
//                       <TableCell className="py-4">{risk.permitRisk}</TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-500 hover:text-red-600"
//                             onClick={() => handlePermitRiskDelete(risk.id)}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>

//           <TabsContent value="permit-safety-equipment" className="space-y-6 mt-6">
//             {/* Form */}
//             <form onSubmit={handlePermitSafetyEquipmentSubmit} className="space-y-4">
//               <div className="grid grid-cols-3 gap-4 mb-4">
//                 <div>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Permit type</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitTypeForSafety}
//                       onChange={(e) => setSelectedPermitTypeForSafety(e.target.value)}
//                       label="Permit type"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       {isLoadingPermitTypes ? (
//                         <MenuItem value="" disabled>
//                           Loading permit types...
//                         </MenuItem>
//                       ) : permitTypes.length === 0 ? (
//                         <MenuItem value="" disabled>
//                           No permit types available
//                         </MenuItem>
//                       ) : (
//                         permitTypes.map((type) => (
//                           <MenuItem key={type.id} value={type.id.toString()}>
//                             {type.name}
//                           </MenuItem>
//                         ))
//                       )}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Permit activity</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitActivityForSafety}
//                       onChange={(e) => setSelectedPermitActivityForSafety(e.target.value)}
//                       label="Permit activity"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Permit Activity</em>
//                       </MenuItem>
//                       {filteredPermitActivitiesForSafety.map((activity) => (
//                         <MenuItem key={activity.id} value={activity.id.toString()}>
//                           {activity.permitActivity}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Permit sub activity</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitSubActivityForSafety}
//                       onChange={(e) => setSelectedPermitSubActivityForSafety(e.target.value)}
//                       label="Permit sub activity"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Permit Sub Activity</em>
//                       </MenuItem>
//                       {filteredPermitSubActivitiesForSafety.map((subActivity) => (
//                         <MenuItem key={subActivity.id} value={subActivity.id.toString()}>
//                           {subActivity.permitSubActivity}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Permit hazard category</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitHazardCategoryForSafety}
//                       onChange={(e) => setSelectedPermitHazardCategoryForSafety(e.target.value)}
//                       label="Permit hazard category"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Permit Hazard Category</em>
//                       </MenuItem>
//                       {filteredPermitHazardCategoriesForSafety.map((hazard) => (
//                         <MenuItem key={hazard.id} value={hazard.id.toString()}>
//                           {hazard.permitHazardCategory}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div>
//                   <FormControl fullWidth variant="outlined">
//                     <InputLabel shrink>Permit risk</InputLabel>
//                     <MuiSelect
//                       value={selectedPermitRiskForSafety}
//                       onChange={(e) => setSelectedPermitRiskForSafety(e.target.value)}
//                       label="Permit risk"
//                       displayEmpty
//                       MenuProps={menuProps}
//                     >
//                       <MenuItem value="">
//                         <em>Permit Risk</em>
//                       </MenuItem>
//                       {filteredPermitRisksForSafety.map((risk) => (
//                         <MenuItem key={risk.id} value={risk.id.toString()}>
//                           {risk.permitRisk}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </div>
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                     Name
//                   </label>
//                   <Input
//                     id="name"
//                     type="text"
//                     value={permitSafetyEquipment}
//                     onChange={(e) => setPermitSafetyEquipment(e.target.value)}
//                     className="w-full"
//                     placeholder=""
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end">
//                 <Button
//                   type="submit"
//                   disabled={isSubmittingPermitSafetyEquipment}
//                   className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isSubmittingPermitSafetyEquipment ? 'Submitting...' : 'Submit'}
//                 </Button>
//               </div>
//             </form>

//             {/* Table */}
//             <div className="bg-white rounded-lg border overflow-hidden">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-gray-50">
//                     <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Sub Activity</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Hazard Category</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Risk</TableHead>
//                     <TableHead className="font-semibold text-gray-900">Permit Safety Equipment</TableHead>
//                     <TableHead className="font-semibold text-gray-900 text-right">Action</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {permitSafetyEquipments.map((safety) => (
//                     <TableRow key={safety.id}>
//                       <TableCell className="py-4">{safety.permitType}</TableCell>
//                       <TableCell className="py-4">{safety.permitActivity}</TableCell>
//                       <TableCell className="py-4">{safety.permitSubActivity}</TableCell>
//                       <TableCell className="py-4">{safety.permitHazardCategory}</TableCell>
//                       <TableCell className="py-4">{safety.permitRisk}</TableCell>
//                       <TableCell className="py-4">{safety.permitSafetyEquipment}</TableCell>
//                       <TableCell className="text-right">
//                         <div className="flex justify-end gap-2">
//                           <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600">
//                             <Edit className="w-4 h-4" />
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-500 hover:text-red-600"
//                             onClick={() => handlePermitSafetyEquipmentDelete(safety.id)}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </ThemeProvider>
//   );
// };

// export default PermitSetupDashboard;

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Edit, Trash2, X } from 'lucide-react';
// import { API_CONFIG, getAuthenticatedFetchOptions, getFullUrl } from '@/config/apiConfig';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  ThemeProvider,
  createTheme
} from '@mui/material';

/** ----------------- MUI THEME ----------------- */
const muiTheme = createTheme({
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            height: '45px',
            '@media (max-width: 768px)': { height: '36px' },
            backgroundColor: '#FFFFFF',
            '& fieldset': { borderColor: '#d1d5db' },
            '&:hover fieldset': { borderColor: '#9ca3af' },
            '&.Mui-focused fieldset': { borderColor: '#C72030', borderWidth: '2px' },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#374151',
          fontWeight: 500,
          '&.Mui-focused': { color: '#C72030' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '& .MuiSelect-select': { padding: '10px 14px', display: 'flex', alignItems: 'center' },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#f3f4f6' },
          '&.Mui-selected': {
            backgroundColor: '#C72030',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#b91c1c' },
          },
        },
      },
    },
  },
});

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      zIndex: 9999,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  MenuListProps: { style: { padding: 0 } },
};

/** ----------------- HELPERS ----------------- */
const toNum = (v: any) => (v === '' || v === null || v === undefined ? '' : Number(v));
const safeStr = (v: any, fallback = '—') => (typeof v === 'string' && v.trim() ? v : fallback);

/** Split a flat array by tag_type */
const splitByType = (raw: any[]) => {
  const norm = raw.map((r) => ({
    ...r,
    id: Number(r.id),
    parent_id: r.parent_id === null || r.parent_id === undefined ? null : Number(r.parent_id),
    name: String(r.name ?? ''),
    tag_type: String(r.tag_type ?? ''),
  }));

  const byType = {
    PermitType: [] as any[],
    PermitActivity: [] as any[],
    PermitSubActivity: [] as any[],
    PermitHazardCategory: [] as any[],
    PermitRisk: [] as any[],
    PermitSafetyEquipment: [] as any[],
  };

  norm.forEach((r) => {
    if (r.tag_type in byType) byType[r.tag_type as keyof typeof byType].push(r);
  });

  return byType;
};

/** Filter out obviously broken hierarchy rows (optional but nicer UX) */
const filterOrphanRows = (sets: ReturnType<typeof splitByType>) => {
  const typeIds = new Set(sets.PermitType.map(t => t.id));
  const actIds = new Set(sets.PermitActivity.filter(a => a.parent_id && typeIds.has(a.parent_id)).map(a => a.id));
  const subIds = new Set(sets.PermitSubActivity.filter(s => s.parent_id && actIds.has(s.parent_id)).map(s => s.id));
  const hazIds = new Set(sets.PermitHazardCategory.filter(h => h.parent_id && subIds.has(h.parent_id)).map(h => h.id));
  const riskIds = new Set(sets.PermitRisk.filter(r => r.parent_id && hazIds.has(r.parent_id)).map(r => r.id));

  return {
    PermitType: sets.PermitType,
    PermitActivity: sets.PermitActivity.filter(a => a.parent_id !== null && typeIds.has(a.parent_id)),
    PermitSubActivity: sets.PermitSubActivity.filter(s => s.parent_id !== null && actIds.has(s.parent_id)),
    PermitHazardCategory: sets.PermitHazardCategory.filter(h => h.parent_id !== null && subIds.has(h.parent_id)),
    PermitRisk: sets.PermitRisk.filter(r => r.parent_id !== null && hazIds.has(r.parent_id)),
    PermitSafetyEquipment: sets.PermitSafetyEquipment.filter(se => se.parent_id !== null && riskIds.has(se.parent_id)),
  };
};

/** ----------------- COMPONENT ----------------- */
export const PermitSetupDashboard = () => {
  /** ------- Master data (normalized raw lists for relationships) ------- */
  const [permitTypes, setPermitTypes] = useState<{ id: number; name: string }[]>([]);
  const [activitiesRaw, setActivitiesRaw] = useState<{ id: number; parentId: number; name: string }[]>([]);
  const [subsRaw, setSubsRaw] = useState<{ id: number; parentId: number; name: string }[]>([]);
  const [hazardsRaw, setHazardsRaw] = useState<{ id: number; parentId: number; name: string }[]>([]);
  const [risksRaw, setRisksRaw] = useState<{ id: number; parentId: number; name: string }[]>([]);
  const [safetyRaw, setSafetyRaw] = useState<{ id: number; parentId: number; name: string }[]>([]);

  /** ------- Loading flags ------- */
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPermitActivity, setIsSubmittingPermitActivity] = useState(false);
  const [isSubmittingPermitSubActivity, setIsSubmittingPermitSubActivity] = useState(false);
  const [isSubmittingPermitHazardCategory, setIsSubmittingPermitHazardCategory] = useState(false);
  const [isSubmittingPermitRisk, setIsSubmittingPermitRisk] = useState(false);
  const [isSubmittingPermitSafetyEquipment, setIsSubmittingPermitSafetyEquipment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /** ------- Add/Edit form states ------- */
  // Type
  const [permitType, setPermitType] = useState('');
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);

  // Activity
  const [permitActivity, setPermitActivity] = useState('');
  const [selectedPermitType, setSelectedPermitType] = useState<number | ''>('');
  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);

  // Sub-Activity
  const [permitSubActivity, setPermitSubActivity] = useState('');
  const [selectedPermitTypeForSub, setSelectedPermitTypeForSub] = useState<number | ''>('');
  const [selectedPermitActivity, setSelectedPermitActivity] = useState<number | ''>('');
  const [editingSubActivityId, setEditingSubActivityId] = useState<number | null>(null);

  // Hazard Category
  const [permitHazardCategory, setPermitHazardCategory] = useState('');
  const [selectedCategoryForHazard, setSelectedCategoryForHazard] = useState<number | ''>('');
  const [selectedSubCategoryForHazard, setSelectedSubCategoryForHazard] = useState<number | ''>('');
  const [selectedSubSubCategoryForHazard, setSelectedSubSubCategoryForHazard] = useState<number | ''>('');
  const [editingHazardId, setEditingHazardId] = useState<number | null>(null);

  // Risk
  const [permitRisk, setPermitRisk] = useState('');
  const [selectedPermitTypeForRisk, setSelectedPermitTypeForRisk] = useState<number | ''>('');
  const [selectedSubCategoryForRisk, setSelectedSubCategoryForRisk] = useState<number | ''>('');
  const [selectedSubSubCategoryForRisk, setSelectedSubSubCategoryForRisk] = useState<number | ''>('');
  const [selectedSubSubSubCategoryForRisk, setSelectedSubSubSubCategoryForRisk] = useState<number | ''>('');
  const [editingRiskId, setEditingRiskId] = useState<number | null>(null);

  // Safety Equipment
  const [permitSafetyEquipment, setPermitSafetyEquipment] = useState('');
  const [selectedPermitTypeForSafety, setSelectedPermitTypeForSafety] = useState<number | ''>('');
  const [selectedPermitActivityForSafety, setSelectedPermitActivityForSafety] = useState<number | ''>('');
  const [selectedPermitSubActivityForSafety, setSelectedPermitSubActivityForSafety] = useState<number | ''>('');
  const [selectedPermitHazardCategoryForSafety, setSelectedPermitHazardCategoryForSafety] = useState<number | ''>('');
  const [selectedPermitRiskForSafety, setSelectedPermitRiskForSafety] = useState<number | ''>('');
  const [editingSafetyId, setEditingSafetyId] = useState<number | null>(null);

  /** ----------------- API CLIENT ----------------- */
  // Get token and baseUrl from localStorage
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  // Ensure baseUrl is present and ends with no trailing slash
  const apiBase = baseUrl ? `https://${baseUrl}/pms/permit_tags.json` : '';


  // Helper for headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  });

  const apiCreate = async (payload: any) => {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ pms_permit_tag: payload })
    });
    if (!res.ok) throw new Error(`Create failed ${res.status}`);
    return res.json();
  };

  const apiUpdate = async (id: number, payload: any) => {
    const url = `${apiBase.replace(/\.json$/, '')}/${id}.json`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ pms_permit_tag: payload })
    });
    if (!res.ok) throw new Error(`Update failed ${res.status}`);
    return res.json();
  };

  const apiDelete = async (id: number) => {
    const url = `${apiBase.replace(/\.json$/, '')}/${id}.json`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Delete failed ${res.status}`);
  };

  const fetchAll = async () => {
    const res = await fetch(apiBase, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    // IMPORTANT: API returns a flat array (exactly like your sample)
    return res.json() as Promise<any[]>;
  };

  /** ----------------- LOAD DATA (Single GET, then split) ----------------- */
  const USE_SERVER_FILTERS = false; // set true if you *must* call server per type

  const loadAllData = async () => {
    try {
      setIsLoading(true);

      if (!USE_SERVER_FILTERS) {

        const flat = await fetchAll();
        const sets = splitByType(flat);
        const clean = filterOrphanRows(sets);

        setPermitTypes(clean.PermitType.map(t => ({ id: t.id, name: t.name })));
        setActivitiesRaw(clean.PermitActivity.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setSubsRaw(clean.PermitSubActivity.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setHazardsRaw(clean.PermitHazardCategory.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setRisksRaw(clean.PermitRisk.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setSafetyRaw(clean.PermitSafetyEquipment.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
      } else {
        // fallback path if you prefer server filtering (works with Rails/Ransack)
        const token = localStorage.getItem('token');
        const baseUrl = localStorage.getItem('baseUrl');
        const apiBase = baseUrl ? `${baseUrl.replace(/\/$/, '')}/pms/permit_tags.json` : '';
        const getHeaders = () => ({
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        });
        const [types, acts, subs, haz, risks, safety] = await Promise.all([
          fetch(`${apiBase}`, { method: 'GET', headers: getHeaders() }).then(r => r.json()),
          fetch(`${apiBase}?q[tag_type_eq]=PermitActivity`, { method: 'GET', headers: getHeaders() }).then(r => r.json()),
          fetch(`${apiBase}?q[tag_type_eq]=PermitSubActivity`, { method: 'GET', headers: getHeaders() }).then(r => r.json()),
          fetch(`${apiBase}?q[tag_type_eq]=PermitHazardCategory`, { method: 'GET', headers: getHeaders() }).then(r => r.json()),
          fetch(`${apiBase}?q[tag_type_eq]=PermitRisk`, { method: 'GET', headers: getHeaders() }).then(r => r.json()),
          fetch(`${apiBase}?q[tag_type_eq]=PermitSafetyEquipment`, { method: 'GET', headers: getHeaders() }).then(r => r.json()),
        ]);

        const sets = splitByType(types);
        const cleanActs = splitByType(acts).PermitActivity;
        const cleanSubs = splitByType(subs).PermitSubActivity;
        const cleanHaz = splitByType(haz).PermitHazardCategory;
        const cleanRisks = splitByType(risks).PermitRisk;
        const cleanSE = splitByType(safety).PermitSafetyEquipment;

        setPermitTypes(sets.PermitType.map(t => ({ id: t.id, name: t.name })));
        setActivitiesRaw(cleanActs.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setSubsRaw(cleanSubs.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setHazardsRaw(cleanHaz.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setRisksRaw(cleanRisks.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
        setSafetyRaw(cleanSE.map(i => ({ id: i.id, parentId: i.parent_id!, name: i.name })));
      }
    } catch (e) {
      console.error('Failed to load permit data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAllData(); }, []);

  /** ----------------- ENRICHED LOOKUPS ----------------- */
  const typesById = useMemo(() => Object.fromEntries(permitTypes.map(t => [t.id, t])), [permitTypes]);
  const actsById = useMemo(() => Object.fromEntries(activitiesRaw.map(a => [a.id, a])), [activitiesRaw]);
  const subsById = useMemo(() => Object.fromEntries(subsRaw.map(s => [s.id, s])), [subsRaw]);
  const hazById = useMemo(() => Object.fromEntries(hazardsRaw.map(h => [h.id, h])), [hazardsRaw]);
  const riskById = useMemo(() => Object.fromEntries(risksRaw.map(r => [r.id, r])), [risksRaw]);

  /** ----------------- TABLE MODELS ----------------- */
  const activitiesTable = useMemo(() => activitiesRaw.map(a => ({
    id: a.id,
    parentId: a.parentId,
    permitType: typesById[a.parentId]?.name ?? 'Unknown',
    permitActivity: a.name,
  })), [activitiesRaw, typesById]);

  const subsTable = useMemo(() => subsRaw.map(s => {
    const activity = actsById[s.parentId];
    const type = activity ? typesById[activity.parentId] : undefined;
    return {
      id: s.id, parentId: s.parentId,
      permitType: type?.name ?? 'Unknown',
      permitActivity: activity?.name ?? 'Unknown',
      permitSubActivity: s.name
    };
  }), [subsRaw, actsById, typesById]);

  const hazardsTable = useMemo(() => hazardsRaw.map(h => {
    const sub = subsById[h.parentId];
    const activity = sub ? actsById[sub.parentId] : undefined;
    const type = activity ? typesById[activity.parentId] : undefined;
    return {
      id: h.id, parentId: h.parentId,
      category: type?.name ?? 'Unknown',
      subCategory: activity?.name ?? 'Unknown',
      subSubCategory: sub?.name ?? 'Unknown',
      permitHazardCategory: h.name
    };
  }), [hazardsRaw, subsById, actsById, typesById]);

  const risksTable = useMemo(() => risksRaw.map(r => {
    const hazard = hazById[r.parentId];
    const sub = hazard ? subsById[hazard.parentId] : undefined;
    const activity = sub ? actsById[sub.parentId] : undefined;
    const type = activity ? typesById[activity.parentId] : undefined;
    return {
      id: r.id, parentId: r.parentId,
      permitType: type?.name ?? 'Unknown',
      subCategory: activity?.name ?? 'Unknown',
      subSubCategory: sub?.name ?? 'Unknown',
      subSubSubCategory: hazard?.name ?? 'Unknown',
      permitRisk: r.name
    };
  }), [risksRaw, hazById, subsById, actsById, typesById]);

  const safetyTable = useMemo(() => safetyRaw.map(se => {
    const risk = riskById[se.parentId];
    const hazard = risk ? hazById[risk.parentId] : undefined;
    const sub = hazard ? subsById[hazard.parentId] : undefined;
    const activity = sub ? actsById[sub.parentId] : undefined;
    const type = activity ? typesById[activity.parentId] : undefined;
    return {
      id: se.id,
      permitType: type?.name ?? 'Unknown',
      permitActivity: activity?.name ?? 'Unknown',
      permitSubActivity: sub?.name ?? 'Unknown',
      permitHazardCategory: hazard?.name ?? 'Unknown',
      permitRisk: risk?.name ?? 'Unknown',
      permitSafetyEquipment: se.name
    };
  }), [safetyRaw, riskById, hazById, subsById, actsById, typesById]);

  /** ----------------- FILTERED LISTS FOR SELECTS ----------------- */
  const filteredActivitiesForSub = useMemo(
    () => (selectedPermitTypeForSub === '' ? [] : activitiesRaw.filter(a => a.parentId === selectedPermitTypeForSub)),
    [activitiesRaw, selectedPermitTypeForSub]
  );

  const filteredActivitiesForHazard = useMemo(
    () => (selectedCategoryForHazard === '' ? [] : activitiesRaw.filter(a => a.parentId === selectedCategoryForHazard)),
    [activitiesRaw, selectedCategoryForHazard]
  );

  const filteredSubsForHazard = useMemo(
    () => (selectedSubCategoryForHazard === '' ? [] : subsRaw.filter(s => s.parentId === selectedSubCategoryForHazard)),
    [subsRaw, selectedSubCategoryForHazard]
  );

  const filteredActivitiesForRisk = useMemo(
    () => (selectedPermitTypeForRisk === '' ? [] : activitiesRaw.filter(a => a.parentId === selectedPermitTypeForRisk)),
    [activitiesRaw, selectedPermitTypeForRisk]
  );

  const filteredSubsForRisk = useMemo(
    () => (selectedSubCategoryForRisk === '' ? [] : subsRaw.filter(s => s.parentId === selectedSubCategoryForRisk)),
    [subsRaw, selectedSubCategoryForRisk]
  );

  const filteredHazardsForRisk = useMemo(
    () => (selectedSubSubCategoryForRisk === '' ? [] : hazardsRaw.filter(h => h.parentId === selectedSubSubCategoryForRisk)),
    [hazardsRaw, selectedSubSubCategoryForRisk]
  );

  const filteredActivitiesForSafety = useMemo(
    () => (selectedPermitTypeForSafety === '' ? [] : activitiesRaw.filter(a => a.parentId === selectedPermitTypeForSafety)),
    [activitiesRaw, selectedPermitTypeForSafety]
  );

  const filteredSubsForSafety = useMemo(
    () => (selectedPermitActivityForSafety === '' ? [] : subsRaw.filter(s => s.parentId === selectedPermitActivityForSafety)),
    [subsRaw, selectedPermitActivityForSafety]
  );

  const filteredHazardsForSafety = useMemo(
    () => (selectedPermitSubActivityForSafety === '' ? [] : hazardsRaw.filter(h => h.parentId === selectedPermitSubActivityForSafety)),
    [hazardsRaw, selectedPermitSubActivityForSafety]
  );

  const filteredRisksForSafety = useMemo(
    () => (selectedPermitHazardCategoryForSafety === '' ? [] : risksRaw.filter(r => r.parentId === selectedPermitHazardCategoryForSafety)),
    [risksRaw, selectedPermitHazardCategoryForSafety]
  );

  /** ----------------- CLEAR DEPENDENCIES ON PARENT CHANGE ----------------- */
  useEffect(() => { setSelectedPermitActivity(''); }, [selectedPermitTypeForSub]);
  useEffect(() => { setSelectedSubCategoryForHazard(''); setSelectedSubSubCategoryForHazard(''); }, [selectedCategoryForHazard]);
  useEffect(() => { setSelectedSubSubCategoryForHazard(''); }, [selectedSubCategoryForHazard]);

  useEffect(() => { setSelectedSubCategoryForRisk(''); setSelectedSubSubCategoryForRisk(''); setSelectedSubSubSubCategoryForRisk(''); }, [selectedPermitTypeForRisk]);
  useEffect(() => { setSelectedSubSubCategoryForRisk(''); setSelectedSubSubSubCategoryForRisk(''); }, [selectedSubCategoryForRisk]);
  useEffect(() => { setSelectedSubSubSubCategoryForRisk(''); }, [selectedSubSubCategoryForRisk]);

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
  useEffect(() => { setSelectedPermitRiskForSafety(''); }, [selectedPermitHazardCategoryForSafety]);

  /** ----------------- SUBMIT HANDLERS (CREATE / UPDATE) ----------------- */
  // TYPE
  const handleTypeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitType.trim()) return;
    setIsSubmitting(true);
    try {
      if (editingTypeId) {
        await apiUpdate(editingTypeId, { name: permitType, active: true, parent_id: null, tag_type: 'PermitType' });
      } else {
        await apiCreate({ name: permitType, active: true, parent_id: null, tag_type: 'PermitType' });
      }
      setPermitType('');
      setEditingTypeId(null);
      await loadAllData();
    } catch (err) {
      console.error('Type submit failed:', err);
      alert('Failed to save permit type.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditType = (type: { id: number; name: string }) => {
    setPermitType(type.name);
    setEditingTypeId(type.id);
  };
  const cancelEditType = () => {
    setPermitType('');
    setEditingTypeId(null);
  };

  // ACTIVITY
  const handlePermitActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitActivity.trim() || selectedPermitType === '') return;
    setIsSubmittingPermitActivity(true);
    try {
      if (editingActivityId) {
        await apiUpdate(editingActivityId, {
          name: permitActivity, active: true, parent_id: toNum(selectedPermitType), tag_type: 'PermitActivity'
        });
      } else {
        await apiCreate({
          name: permitActivity, active: true, parent_id: toNum(selectedPermitType), tag_type: 'PermitActivity'
        });
      }
      setPermitActivity('');
      setSelectedPermitType('');
      setEditingActivityId(null);
      await loadAllData();
    } catch (err) {
      console.error('Activity submit failed:', err);
      alert('Failed to save permit activity.');
    } finally {
      setIsSubmittingPermitActivity(false);
    }
  };

  const startEditActivity = (row: any) => {
    setEditingActivityId(row.id);
    setPermitActivity(row.permitActivity);
    setSelectedPermitType(row.parentId);
  };
  const cancelEditActivity = () => {
    setEditingActivityId(null);
    setPermitActivity('');
    setSelectedPermitType('');
  };

  // SUB ACTIVITY
  const handlePermitSubActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitSubActivity.trim() || selectedPermitTypeForSub === '' || selectedPermitActivity === '') return;
    setIsSubmittingPermitSubActivity(true);
    try {
      const parentActivityId = toNum(selectedPermitActivity);
      if (editingSubActivityId) {
        await apiUpdate(editingSubActivityId, {
          name: permitSubActivity, active: true, parent_id: parentActivityId, tag_type: 'PermitSubActivity'
        });
      } else {
        await apiCreate({
          name: permitSubActivity, active: true, parent_id: parentActivityId, tag_type: 'PermitSubActivity'
        });
      }
      setPermitSubActivity('');
      setSelectedPermitTypeForSub('');
      setSelectedPermitActivity('');
      setEditingSubActivityId(null);
      await loadAllData();
    } catch (err) {
      console.error('Sub-activity submit failed:', err);
      alert('Failed to save permit sub activity.');
    } finally {
      setIsSubmittingPermitSubActivity(false);
    }
  };

  const startEditSubActivity = (row: any) => {
    setEditingSubActivityId(row.id);
    const sub = subsById[row.id];
    const activity = sub ? actsById[sub.parentId] : null;
    const typeId = activity ? activity.parentId : '';
    setSelectedPermitTypeForSub(typeId === '' ? '' : Number(typeId));
    setSelectedPermitActivity(activity ? activity.id : '');
    setPermitSubActivity(row.permitSubActivity);
  };
  const cancelEditSubActivity = () => {
    setEditingSubActivityId(null);
    setPermitSubActivity('');
    setSelectedPermitTypeForSub('');
    setSelectedPermitActivity('');
  };

  // HAZARD CATEGORY
  const handlePermitHazardCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitHazardCategory.trim() || selectedSubSubCategoryForHazard === '') return;
    setIsSubmittingPermitHazardCategory(true);
    try {
      const parentSubId = toNum(selectedSubSubCategoryForHazard);
      if (editingHazardId) {
        await apiUpdate(editingHazardId, {
          name: permitHazardCategory, active: true, parent_id: parentSubId, tag_type: 'PermitHazardCategory'
        });
      } else {
        await apiCreate({
          name: permitHazardCategory, active: true, parent_id: parentSubId, tag_type: 'PermitHazardCategory'
        });
      }
      setPermitHazardCategory('');
      setSelectedCategoryForHazard('');
      setSelectedSubCategoryForHazard('');
      setSelectedSubSubCategoryForHazard('');
      setEditingHazardId(null);
      await loadAllData();
    } catch (err) {
      console.error('Hazard category submit failed:', err);
      alert('Failed to save hazard category.');
    } finally {
      setIsSubmittingPermitHazardCategory(false);
    }
  };

  const startEditHazard = (row: any) => {
    setEditingHazardId(row.id);
    const hazard = hazById[row.id];
    const sub = hazard ? subsById[hazard.parentId] : null;
    const activity = sub ? actsById[sub.parentId] : null;
    const typeId = activity ? activity.parentId : '';
    setSelectedCategoryForHazard(typeId === '' ? '' : Number(typeId));
    setSelectedSubCategoryForHazard(activity ? activity.id : '');
    setSelectedSubSubCategoryForHazard(sub ? sub.id : '');
    setPermitHazardCategory(row.permitHazardCategory);
  };
  const cancelEditHazard = () => {
    setEditingHazardId(null);
    setPermitHazardCategory('');
    setSelectedCategoryForHazard('');
    setSelectedSubCategoryForHazard('');
    setSelectedSubSubCategoryForHazard('');
  };

  // RISK
  const handlePermitRiskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitRisk.trim() || selectedSubSubSubCategoryForRisk === '') return;
    setIsSubmittingPermitRisk(true);
    try {
      const parentHazardId = toNum(selectedSubSubSubCategoryForRisk);
      if (editingRiskId) {
        await apiUpdate(editingRiskId, {
          name: permitRisk, active: true, parent_id: parentHazardId, tag_type: 'PermitRisk'
        });
      } else {
        await apiCreate({
          name: permitRisk, active: true, parent_id: parentHazardId, tag_type: 'PermitRisk'
        });
      }
      setPermitRisk('');
      setSelectedPermitTypeForRisk('');
      setSelectedSubCategoryForRisk('');
      setSelectedSubSubCategoryForRisk('');
      setSelectedSubSubSubCategoryForRisk('');
      setEditingRiskId(null);
      await loadAllData();
    } catch (err) {
      console.error('Risk submit failed:', err);
      alert('Failed to save permit risk.');
    } finally {
      setIsSubmittingPermitRisk(false);
    }
  };

  const startEditRisk = (row: any) => {
    setEditingRiskId(row.id);
    const risk = riskById[row.id];
    const hazard = risk ? hazById[risk.parentId] : null;
    const sub = hazard ? subsById[hazard.parentId] : null;
    const activity = sub ? actsById[sub.parentId] : null;
    const typeId = activity ? activity.parentId : '';
    setSelectedPermitTypeForRisk(typeId === '' ? '' : Number(typeId));
    setSelectedSubCategoryForRisk(activity ? activity.id : '');
    setSelectedSubSubCategoryForRisk(sub ? sub.id : '');
    setSelectedSubSubSubCategoryForRisk(hazard ? hazard.id : '');
    setPermitRisk(row.permitRisk);
  };
  const cancelEditRisk = () => {
    setEditingRiskId(null);
    setPermitRisk('');
    setSelectedPermitTypeForRisk('');
    setSelectedSubCategoryForRisk('');
    setSelectedSubSubCategoryForRisk('');
    setSelectedSubSubSubCategoryForRisk('');
  };

  // SAFETY EQUIPMENT
  const handlePermitSafetyEquipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permitSafetyEquipment.trim() || selectedPermitRiskForSafety === '') return;
    setIsSubmittingPermitSafetyEquipment(true);
    try {
      const parentRiskId = toNum(selectedPermitRiskForSafety);
      if (editingSafetyId) {
        await apiUpdate(editingSafetyId, {
          name: permitSafetyEquipment, active: true, parent_id: parentRiskId, tag_type: 'PermitSafetyEquipment'
        });
      } else {
        await apiCreate({
          name: permitSafetyEquipment, active: true, parent_id: parentRiskId, tag_type: 'PermitSafetyEquipment'
        });
      }
      setPermitSafetyEquipment('');
      setSelectedPermitTypeForSafety('');
      setSelectedPermitActivityForSafety('');
      setSelectedPermitSubActivityForSafety('');
      setSelectedPermitHazardCategoryForSafety('');
      setSelectedPermitRiskForSafety('');
      setEditingSafetyId(null);
      await loadAllData();
    } catch (err) {
      console.error('Safety equipment submit failed:', err);
      alert('Failed to save permit safety equipment.');
    } finally {
      setIsSubmittingPermitSafetyEquipment(false);
    }
  };

  const startEditSafety = (row: any) => {
    setEditingSafetyId(row.id);
    const se = safetyRaw.find(x => x.id === row.id);
    const risk = se ? riskById[se.parentId] : null;
    const hazard = risk ? hazById[risk.parentId] : null;
    const sub = hazard ? subsById[hazard.parentId] : null;
    const activity = sub ? actsById[sub.parentId] : null;
    const typeId = activity ? activity.parentId : '';
    setSelectedPermitTypeForSafety(typeId === '' ? '' : Number(typeId));
    setSelectedPermitActivityForSafety(activity ? activity.id : '');
    setSelectedPermitSubActivityForSafety(sub ? sub.id : '');
    setSelectedPermitHazardCategoryForSafety(hazard ? hazard.id : '');
    setSelectedPermitRiskForSafety(risk ? risk.id : '');
    setPermitSafetyEquipment(row.permitSafetyEquipment);
  };
  const cancelEditSafety = () => {
    setEditingSafetyId(null);
    setPermitSafetyEquipment('');
    setSelectedPermitTypeForSafety('');
    setSelectedPermitActivityForSafety('');
    setSelectedPermitSubActivityForSafety('');
    setSelectedPermitHazardCategoryForSafety('');
    setSelectedPermitRiskForSafety('');
  };

  /** ----------------- DELETE HANDLERS ----------------- */
  const deleteType = async (id: number) => {
    if (!confirm('Delete this Permit Type?')) return;
    try { await apiDelete(id); await loadAllData(); } catch (e) { alert('Delete failed.'); }
  };
  const deleteActivity = async (id: number) => {
    if (!confirm('Delete this Permit Activity?')) return;
    try { await apiDelete(id); await loadAllData(); } catch (e) { alert('Delete failed.'); }
  };
  const deleteSubActivity = async (id: number) => {
    if (!confirm('Delete this Permit Sub Activity?')) return;
    try { await apiDelete(id); await loadAllData(); } catch (e) { alert('Delete failed.'); }
  };
  const deleteHazard = async (id: number) => {
    if (!confirm('Delete this Permit Hazard Category?')) return;
    try { await apiDelete(id); await loadAllData(); } catch (e) { alert('Delete failed.'); }
  };
  const deleteRisk = async (id: number) => {
    if (!confirm('Delete this Permit Risk?')) return;
    try { await apiDelete(id); await loadAllData(); } catch (e) { alert('Delete failed.'); }
  };
  const deleteSafety = async (id: number) => {
    if (!confirm('Delete this Permit Safety Equipment?')) return;
    try { await apiDelete(id); await loadAllData(); } catch (e) { alert('Delete failed.'); }
  };

  /** ----------------- RENDER ----------------- */
  return (
    <ThemeProvider theme={muiTheme}>
      <div className="flex-1 p-6 bg-white min-h-screen">
        {/* Header */}
        {/* <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Permit Setup</h1>
            <Button className="bg-gray-600 hover:bg-gray-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Import Permit Tags
            </Button>
          </div>
        </div> */}

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

          {/* -------- Permit Type -------- */}
          <TabsContent value="permit-type" className="space-y-6 mt-6">
            <form onSubmit={handleTypeSubmit} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label htmlFor="permitTypeName" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    id="permitTypeName"
                    type="text"
                    value={permitType}
                    onChange={(e) => setPermitType(e.target.value)}
                    className="w-full"
                    placeholder="Enter permit type name"
                  />
                </div>
                <div className="flex gap-2">
                  {editingTypeId && (
                    <Button type="button" variant="ghost" onClick={cancelEditType} className="text-gray-700">
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (editingTypeId ? 'Updating...' : 'Submitting...') : (editingTypeId ? 'Update' : 'Submit')}
                  </Button>
                </div>
              </div>
            </form>

            <div className="bg-white rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-900">Permit Type</TableHead>
                    <TableHead className="font-semibold text-gray-900 ">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={2} className="text-center py-8 text-gray-500">Loading permit types...</TableCell></TableRow>
                  ) : permitTypes.length === 0 ? (
                    <TableRow><TableCell colSpan={2} className="text-center py-8 text-gray-500">No permit types found</TableCell></TableRow>
                  ) : permitTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="py-4">{safeStr(type.name)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600" onClick={() => startEditType(type)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteType(type.id)}>
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

          {/* -------- Permit Activity -------- */}
          <TabsContent value="permit-activity" className="space-y-6 mt-6">
            <form onSubmit={handlePermitActivitySubmit} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Category</InputLabel>
                    <MuiSelect
                      value={selectedPermitType}
                      onChange={(e) => setSelectedPermitType(toNum(e.target.value))}
                      label="Category"
                      displayEmpty
                      MenuProps={menuProps}
                    >
                      {isLoading ? (
                        <MenuItem value="" disabled>Loading permit types...</MenuItem>
                      ) : permitTypes.length === 0 ? (
                        <MenuItem value="" disabled>No permit types available</MenuItem>
                      ) : (
                        permitTypes.map((type) => (
                          <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                        ))
                      )}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <label htmlFor="permitActivityName" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    id="permitActivityName"
                    type="text"
                    value={permitActivity}
                    onChange={(e) => setPermitActivity(e.target.value)}
                    className="w-full"
                    placeholder="Enter permit activity name"
                  />
                </div>
                <div className="flex gap-2">
                  {editingActivityId && (
                    <Button type="button" variant="ghost" onClick={cancelEditActivity} className="text-gray-700">
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmittingPermitActivity}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingPermitActivity ? (editingActivityId ? 'Updating...' : 'Submitting...') : (editingActivityId ? 'Update' : 'Submit')}
                  </Button>
                </div>
              </div>
            </form>

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
                  {isLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8 text-gray-500">Loading permit activities...</TableCell></TableRow>
                  ) : activitiesTable.length === 0 ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8 text-gray-500">No permit activities found</TableCell></TableRow>
                  ) : activitiesTable.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-4">{row.permitType}</TableCell>
                      <TableCell className="py-4">{row.permitActivity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600" onClick={() => startEditActivity(row)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteActivity(row.id)}>
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

          {/* -------- Permit Sub Activity -------- */}
          <TabsContent value="permit-sub-activity" className="space-y-6 mt-6">
            <form onSubmit={handlePermitSubActivitySubmit} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Category</InputLabel>
                    <MuiSelect
                      value={selectedPermitTypeForSub}
                      onChange={(e) => setSelectedPermitTypeForSub(toNum(e.target.value))}
                      label="Category"
                      displayEmpty
                      MenuProps={menuProps}
                    >
                      {isLoading ? (
                        <MenuItem value="" disabled>Loading permit types...</MenuItem>
                      ) : permitTypes.length === 0 ? (
                        <MenuItem value="" disabled>No permit types available</MenuItem>
                      ) : (
                        permitTypes.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)
                      )}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Sub category</InputLabel>
                    <MuiSelect
                      value={selectedPermitActivity}
                      onChange={(e) => setSelectedPermitActivity(toNum(e.target.value))}
                      label="Sub category"
                      displayEmpty
                      disabled={selectedPermitTypeForSub === ''}
                      MenuProps={menuProps}
                    >
                      <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                      {filteredActivitiesForSub.map((a) => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <label htmlFor="permitSubActivityName" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    id="permitSubActivityName"
                    type="text"
                    value={permitSubActivity}
                    onChange={(e) => setPermitSubActivity(e.target.value)}
                    className="w-full"
                    placeholder=""
                  />
                </div>
                <div className="flex gap-2">
                  {editingSubActivityId && (
                    <Button type="button" variant="ghost" onClick={cancelEditSubActivity} className="text-gray-700">
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmittingPermitSubActivity}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingPermitSubActivity ? (editingSubActivityId ? 'Updating...' : 'Submitting...') : (editingSubActivityId ? 'Update' : 'Submit')}
                  </Button>
                </div>
              </div>
            </form>

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
                  {subsTable.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-4">{row.permitType}</TableCell>
                      <TableCell className="py-4">{row.permitActivity}</TableCell>
                      <TableCell className="py-4">{row.permitSubActivity}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600" onClick={() => startEditSubActivity(row)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteSubActivity(row.id)}>
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

          {/* -------- Permit Hazard Category -------- */}
          <TabsContent value="permit-hazard-category" className="space-y-6 mt-6">
            <form onSubmit={handlePermitHazardCategorySubmit} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Category</InputLabel>
                    <MuiSelect
                      value={selectedCategoryForHazard}
                      onChange={(e) => setSelectedCategoryForHazard(toNum(e.target.value))}
                      label="Category"
                      displayEmpty
                      MenuProps={menuProps}
                    >
                      {isLoading ? (
                        <MenuItem value="" disabled>Loading permit types...</MenuItem>
                      ) : permitTypes.length === 0 ? (
                        <MenuItem value="" disabled>No permit types available</MenuItem>
                      ) : (
                        permitTypes.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)
                      )}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Sub category</InputLabel>
                    <MuiSelect
                      value={selectedSubCategoryForHazard}
                      onChange={(e) => setSelectedSubCategoryForHazard(toNum(e.target.value))}
                      label="Sub category"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedCategoryForHazard === ''}
                    >
                      <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                      {filteredActivitiesForHazard.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Sub sub category</InputLabel>
                    <MuiSelect
                      value={selectedSubSubCategoryForHazard}
                      onChange={(e) => setSelectedSubSubCategoryForHazard(toNum(e.target.value))}
                      label="Sub sub category"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedSubCategoryForHazard === ''}
                    >
                      <MenuItem value=""><em>Select Sub Sub Category</em></MenuItem>
                      {filteredSubsForHazard.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <label htmlFor="hazardCategoryName" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    id="hazardCategoryName"
                    type="text"
                    value={permitHazardCategory}
                    onChange={(e) => setPermitHazardCategory(e.target.value)}
                    className="w-full"
                    placeholder=""
                  />
                </div>
                <div className="flex gap-2">
                  {editingHazardId && (
                    <Button type="button" variant="ghost" onClick={cancelEditHazard} className="text-gray-700">
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmittingPermitHazardCategory}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingPermitHazardCategory ? (editingHazardId ? 'Updating...' : 'Submitting...') : (editingHazardId ? 'Update' : 'Submit')}
                  </Button>
                </div>
              </div>
            </form>

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
                  {hazardsTable.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-4">{row.category}</TableCell>
                      <TableCell className="py-4">{row.subCategory}</TableCell>
                      <TableCell className="py-4">{row.subSubCategory}</TableCell>
                      <TableCell className="py-4">{row.permitHazardCategory}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600" onClick={() => startEditHazard(row)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteHazard(row.id)}>
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

          {/* -------- Permit Risk -------- */}
          <TabsContent value="permit-risk" className="space-y-6 mt-6">
            <form onSubmit={handlePermitRiskSubmit} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Permit type</InputLabel>
                    <MuiSelect
                      value={selectedPermitTypeForRisk}
                      onChange={(e) => setSelectedPermitTypeForRisk(toNum(e.target.value))}
                      label="Permit type"
                      displayEmpty
                      MenuProps={menuProps}
                    >
                      {isLoading ? (
                        <MenuItem value="" disabled>Loading permit types...</MenuItem>
                      ) : permitTypes.length === 0 ? (
                        <MenuItem value="" disabled>No permit types available</MenuItem>
                      ) : (
                        permitTypes.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)
                      )}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Sub category</InputLabel>
                    <MuiSelect
                      value={selectedSubCategoryForRisk}
                      onChange={(e) => setSelectedSubCategoryForRisk(toNum(e.target.value))}
                      label="Sub category"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedPermitTypeForRisk === ''}
                    >
                      <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                      {filteredActivitiesForRisk.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Sub sub category</InputLabel>
                    <MuiSelect
                      value={selectedSubSubCategoryForRisk}
                      onChange={(e) => setSelectedSubSubCategoryForRisk(toNum(e.target.value))}
                      label="Sub sub category"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedSubCategoryForRisk === ''}
                    >
                      <MenuItem value=""><em>Select Sub Sub Category</em></MenuItem>
                      {filteredSubsForRisk.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Sub sub sub category</InputLabel>
                    <MuiSelect
                      value={selectedSubSubSubCategoryForRisk}
                      onChange={(e) => setSelectedSubSubSubCategoryForRisk(toNum(e.target.value))}
                      label="Sub sub sub category"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedSubSubCategoryForRisk === ''}
                    >
                      <MenuItem value=""><em>Select Sub Sub Sub Category</em></MenuItem>
                      {filteredHazardsForRisk.map(h => <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div className="flex-1">
                  <label htmlFor="riskName" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    id="riskName"
                    type="text"
                    value={permitRisk}
                    onChange={(e) => setPermitRisk(e.target.value)}
                    className="w-full"
                    placeholder=""
                  />
                </div>
                <div className="flex gap-2">
                  {editingRiskId && (
                    <Button type="button" variant="ghost" onClick={cancelEditRisk} className="text-gray-700">
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmittingPermitRisk}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingPermitRisk ? (editingRiskId ? 'Updating...' : 'Submitting...') : (editingRiskId ? 'Update' : 'Submit')}
                  </Button>
                </div>
              </div>
            </form>

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
                  {risksTable.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-4">{row.permitType}</TableCell>
                      <TableCell className="py-4">{row.subCategory}</TableCell>
                      <TableCell className="py-4">{row.subSubCategory}</TableCell>
                      <TableCell className="py-4">{row.subSubSubCategory}</TableCell>
                      <TableCell className="py-4">{row.permitRisk}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600" onClick={() => startEditRisk(row)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteRisk(row.id)}>
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

          {/* -------- Permit Safety Equipment -------- */}
          <TabsContent value="permit-safety-equipment" className="space-y-6 mt-6">
            <form onSubmit={handlePermitSafetyEquipmentSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Permit type</InputLabel>
                    <MuiSelect
                      value={selectedPermitTypeForSafety}
                      onChange={(e) => setSelectedPermitTypeForSafety(toNum(e.target.value))}
                      label="Permit type"
                      displayEmpty
                      MenuProps={menuProps}
                    >
                      {isLoading ? (
                        <MenuItem value="" disabled>Loading permit types...</MenuItem>
                      ) : permitTypes.length === 0 ? (
                        <MenuItem value="" disabled>No permit types available</MenuItem>
                      ) : (
                        permitTypes.map((type) => <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>)
                      )}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Permit activity</InputLabel>
                    <MuiSelect
                      value={selectedPermitActivityForSafety}
                      onChange={(e) => setSelectedPermitActivityForSafety(toNum(e.target.value))}
                      label="Permit activity"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedPermitTypeForSafety === ''}
                    >
                      <MenuItem value=""><em>Permit Activity</em></MenuItem>
                      {filteredActivitiesForSafety.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Permit sub activity</InputLabel>
                    <MuiSelect
                      value={selectedPermitSubActivityForSafety}
                      onChange={(e) => setSelectedPermitSubActivityForSafety(toNum(e.target.value))}
                      label="Permit sub activity"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedPermitActivityForSafety === ''}
                    >
                      <MenuItem value=""><em>Permit Sub Activity</em></MenuItem>
                      {filteredSubsForSafety.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Permit hazard category</InputLabel>
                    <MuiSelect
                      value={selectedPermitHazardCategoryForSafety}
                      onChange={(e) => setSelectedPermitHazardCategoryForSafety(toNum(e.target.value))}
                      label="Permit hazard category"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedPermitSubActivityForSafety === ''}
                    >
                      <MenuItem value=""><em>Permit Hazard Category</em></MenuItem>
                      {filteredHazardsForSafety.map(h => <MenuItem key={h.id} value={h.id}>{h.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Permit risk</InputLabel>
                    <MuiSelect
                      value={selectedPermitRiskForSafety}
                      onChange={(e) => setSelectedPermitRiskForSafety(toNum(e.target.value))}
                      label="Permit risk"
                      displayEmpty
                      MenuProps={menuProps}
                      disabled={selectedPermitHazardCategoryForSafety === ''}
                    >
                      <MenuItem value=""><em>Permit Risk</em></MenuItem>
                      {filteredRisksForSafety.map(r => <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>)}
                    </MuiSelect>
                  </FormControl>
                </div>
                <div>
                  <label htmlFor="safetyEquipmentName" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    id="safetyEquipmentName"
                    type="text"
                    value={permitSafetyEquipment}
                    onChange={(e) => setPermitSafetyEquipment(e.target.value)}
                    className="w-full"
                    placeholder=""
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {editingSafetyId && (
                  <Button type="button" variant="ghost" onClick={cancelEditSafety} className="text-gray-700">
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmittingPermitSafetyEquipment}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingPermitSafetyEquipment ? (editingSafetyId ? 'Updating...' : 'Submitting...') : (editingSafetyId ? 'Update' : 'Submit')}
                </Button>
              </div>
            </form>

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
                  {safetyTable.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="py-4">{row.permitType}</TableCell>
                      <TableCell className="py-4">{row.permitActivity}</TableCell>
                      <TableCell className="py-4">{row.permitSubActivity}</TableCell>
                      <TableCell className="py-4">{row.permitHazardCategory}</TableCell>
                      <TableCell className="py-4">{row.permitRisk}</TableCell>
                      <TableCell className="py-4">{row.permitSafetyEquipment}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-orange-500 hover:text-orange-600" onClick={() => startEditSafety(row)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => deleteSafety(row.id)}>
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
    </ThemeProvider>
  );
};

export default PermitSetupDashboard;