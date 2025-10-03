// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'sonner';
// import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
// import { Heading } from '@/components/ui/heading';

// const fieldStyles = {
//   height: {
//     xs: 28,
//     sm: 36,
//     md: 45
//   },
//   '& .MuiInputBase-input, & .MuiSelect-select': {
//     padding: {
//       xs: '8px',
//       sm: '10px',
//       md: '12px'
//     }
//   },
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px',
//     backgroundColor: 'white',
//     '& fieldset': {
//       borderColor: '#e5e7eb',
//     },
//     '&:hover fieldset': {
//       borderColor: '#9ca3af',
//     },
//     '&.Mui-focused fieldset': {
//       borderColor: '#C72030',
//     },
//   },
//   '& .MuiInputLabel-root': {
//     color: '#6b7280',
//     '&.Mui-focused': {
//       color: '#C72030',
//     },
//   },
// };

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
//   anchorOrigin: {
//     vertical: 'bottom' as const,
//     horizontal: 'left' as const,
//   },
//   transformOrigin: {
//     vertical: 'top' as const,
//     horizontal: 'left' as const,
//   },
// };


// // Helper function to get current date/time values as strings
// const getCurrentDateTime = () => {
//   const now = new Date();
//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   return {
//     year: now.getFullYear().toString(),
//     month: monthNames[now.getMonth()],
//     day: now.getDate().toString(),
//     hour: now.getHours().toString(),
//     minute: now.getMinutes().toString()
//   };
// };

// export const AddIncidentPage = () => {
//   const navigate = useNavigate();
//   const currentDateTime = getCurrentDateTime();

//   const [incidentData, setIncidentData] = useState({
//     year: currentDateTime.year,
//     month: currentDateTime.month,
//     day: currentDateTime.day,
//     hour: currentDateTime.hour,
//     minute: currentDateTime.minute,
//     building: '',
//     // Primary hierarchy
//     categoryForIncident: '',
//     primaryCategory: '',
//     subCategory: '',
//     subSubCategory: '',
//     // Secondary hierarchy
//     secondaryCategory: '',
//     secondarySubCategory: '',
//     secondarySubSubCategory: '',
//     secondarySubSubSubCategory: '',
//     // Legacy/unused (kept for compatibility if referenced elsewhere)
//     secondaryCategoryForIncident: '',
//     // Risk inputs
//     severity: '',
//     probability: '',
//     // Computed/selected
//     incidentLevel: '',
//     // Others
//     description: '',
//     supportRequired: false,
//     factsCorrect: false,
//     attachments: null as File | null
//   });


//   // State for buildings
//   const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
//   // Category hierarchy states
//   const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
//   const [subCategories, setSubCategories] = useState<any[]>([]);
//   const [subSubCategories, setSubSubCategories] = useState<any[]>([]);
//   const [subSubSubCategories, setSubSubSubCategories] = useState<any[]>([]);
//   // Secondary hierarchy
//   const [secondaryCategories, setSecondaryCategories] = useState<{ id: number; name: string }[]>([]);
//   const [secondarySubCategories, setSecondarySubCategories] = useState<any[]>([]);
//   const [secondarySubSubCategories, setSecondarySubSubCategories] = useState<any[]>([]);
//   const [secondarySubSubSubCategories, setSecondarySubSubSubCategories] = useState<any[]>([]);
//   // Incident levels
//   const [incidentLevels, setIncidentLevels] = useState<{ id: number; name: string }[]>([]);

//   // Fetch all tags and buildings on mount
//   useEffect(() => {
//     const fetchAll = async () => {
//       // Get baseUrl and token from localStorage, ensure baseUrl starts with https://
//       let baseUrl = localStorage.getItem('baseUrl') || '';
//       const token = localStorage.getItem('token') || '';
//       if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
//         baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
//       }
//       // Fetch buildings
//       try {
//         const response = await fetch(`${baseUrl}/pms/buildings.json`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         if (response.ok) {
//           const result = await response.json();
//           setBuildings(Array.isArray(result.pms_buildings) ? result.pms_buildings.map((b: any) => ({ id: b.id, name: b.name })) : []);
//         } else {
//           setBuildings([]);
//         }
//       } catch {
//         setBuildings([]);
//       }

//       // Fetch incident levels
//       try {
//         const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         if (response.ok) {
//           const result = await response.json();
//           const levels = result.data
//             .filter((item: any) => item.tag_type === 'IncidenceLevel')
//             .map(({ id, name }: any) => ({ id, name }));
//           setIncidentLevels(levels);
//         } else {
//           setIncidentLevels([]);
//         }
//       } catch {
//         setIncidentLevels([]);
//       }

//       // Fetch all tags for categories
//       try {
//         const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
//           headers: { 'Authorization': `Bearer ${token}` }
//         });
//         if (response.ok) {
//           const result = await response.json();
//           const data = result.data || [];
//           // Primary hierarchy
//           const allCategories = data.filter((item: any) => item.tag_type === 'IncidenceCategory' && item.parent_id === null);
//           setCategories(allCategories.map((item: any) => ({ id: item.id, name: item.name })));
//           const allSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubCategory');
//           setSubCategories(allSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           const allSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubCategory');
//           setSubSubCategories(allSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           const allSubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubSubCategory');
//           setSubSubSubCategories(allSubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           // Secondary hierarchy
//           const allSecondaryCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondaryCategory' && item.parent_id === null);
//           setSecondaryCategories(allSecondaryCategories.map((item: any) => ({ id: item.id, name: item.name })));
//           const allSecondarySubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubCategory');
//           setSecondarySubCategories(allSecondarySubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           const allSecondarySubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubCategory');
//           setSecondarySubSubCategories(allSecondarySubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           const allSecondarySubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubSubCategory');
//           setSecondarySubSubSubCategories(allSecondarySubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//         }
//       } catch { }
//     };
//     fetchAll();
//   }, []);

//   // Helper to calculate and set incident level based on risk score
//   const calculateAndSetIncidentLevel = (severity: string, probability: string) => {
//     const sev = parseInt(severity);
//     const prob = parseInt(probability);
//     if (!sev || !prob) {
//       setIncidentData(prev => ({ ...prev, incidentLevel: '' }));
//       return;
//     }
//     const riskScore = sev * prob;
//     let riskLevelText = '';

//     // Determine risk level text based on score~
//     if (riskScore >= 1 && riskScore <= 6) {
//       riskLevelText = 'Low Risk';
//     } else if (riskScore >= 8 && riskScore <= 12) {
//       riskLevelText = 'Medium Risk';
//     } else if (riskScore >= 15 && riskScore <= 20) {
//       riskLevelText = 'High Risk';
//     } else if (riskScore > 20) {
//       riskLevelText = 'Extreme Risk';
//     }

//     // Find the incident level that matches the risk level text
//     const matchedLevel = incidentLevels.find(level => {
//       const levelName = level.name.toLowerCase();
//       const riskText = riskLevelText.toLowerCase();

//       // Try different matching strategies
//       return levelName.includes(riskText) ||
//         levelName.includes(riskText.replace(' ', '')) ||
//         (riskText === 'low risk' && (levelName.includes('level 1') || levelName.includes('1'))) ||
//         (riskText === 'medium risk' && (levelName.includes('level 2') || levelName.includes('2'))) ||
//         (riskText === 'high risk' && (levelName.includes('level 3') || levelName.includes('3'))) ||
//         (riskText === 'extreme risk' && (levelName.includes('level 4') || levelName.includes('4')));
//     });

//     // Set the incident level ID if found, otherwise use fallback based on risk score
//     let levelId = '';
//     if (matchedLevel) {
//       levelId = String(matchedLevel.id);
//     } else {
//       // Fallback: try to match by position in array if available
//       if (incidentLevels.length > 0) {
//         if (riskScore >= 1 && riskScore <= 6 && incidentLevels[0]) {
//           levelId = String(incidentLevels[0].id);
//         } else if (riskScore >= 8 && riskScore <= 12 && incidentLevels[1]) {
//           levelId = String(incidentLevels[1].id);
//         } else if (riskScore >= 15 && riskScore <= 20 && incidentLevels[2]) {
//           levelId = String(incidentLevels[2].id);
//         } else if (riskScore > 20 && incidentLevels[3]) {
//           levelId = String(incidentLevels[3].id);
//         } else {
//           // Use first available level as fallback
//           levelId = String(incidentLevels[0].id);
//         }
//       }
//     }

//     // Force update the incident level
//     setIncidentData(prev => ({
//       ...prev,
//       incidentLevel: levelId
//     }));
//   };

//   // Helper to get risk level text based on severity and probability
//   const getRiskLevelText = (): string => {
//     const sev = parseInt(incidentData.severity);
//     const prob = parseInt(incidentData.probability);
//     if (!sev || !prob) return '';

//     const riskScore = sev * prob;
//     if (riskScore >= 1 && riskScore <= 6) {
//       return 'Low Risk';
//     } else if (riskScore >= 8 && riskScore <= 12) {
//       return 'Medium Risk';
//     } else if (riskScore >= 15 && riskScore <= 20) {
//       return 'High Risk';
//     } else if (riskScore > 20) {
//       return 'Extreme Risk';
//     }
//     return '';
//   };

//   const handleInputChange = (field: string, value: string) => {
//     setIncidentData(prev => ({ ...prev, [field]: value }));
//   };

//   // Recalculate incident level whenever severity or probability changes
//   useEffect(() => {
//     if (incidentData.severity && incidentData.probability && incidentLevels.length > 0) {
//       calculateAndSetIncidentLevel(incidentData.severity, incidentData.probability);
//     }
//   }, [incidentData.severity, incidentData.probability, incidentLevels]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setIncidentData(prev => ({
//         ...prev,
//         attachments: file
//       }));
//       toast.success('File uploaded successfully');
//     }
//   };

//   const handleCheckboxChange = (field: string, checked: boolean) => {
//     setIncidentData(prev => ({
//       ...prev,
//       [field]: checked
//     }));
//   };

//   // Helper: convert month name to number (1-12)
//   const monthNameToNumber = (name: string) => {
//     const months = [
//       'january', 'february', 'march', 'april', 'may', 'june',
//       'july', 'august', 'september', 'october', 'november', 'december'
//     ];
//     const idx = months.indexOf((name || '').toLowerCase());
//     return idx === -1 ? '' : String(idx + 1);
//   };

//   // const handleSubmit = async () => {
//   //   // Enhanced validation for all required fields

//   //   // Time validation
//   //   if (!incidentData.hour || !incidentData.minute) {
//   //     toast.error('Please select both hour and minute');
//   //     return;
//   //   }

//   //   // Date validation
//   //   if (!incidentData.day || !incidentData.month || !incidentData.year) {
//   //     toast.error('Please select complete date (day, month, year)');
//   //     return;
//   //   }

//   //   if (!incidentData.building) {
//   //     toast.error('Please select a building');
//   //     return;
//   //   }

//   //   if (!incidentData.categoryForIncident) {
//   //     toast.error('Please select primary category');
//   //     return;
//   //   }

//   //   if (!incidentData.primaryCategory) {
//   //     toast.error('Please select sub category');
//   //     return;
//   //   }

//   //   if (!incidentData.subCategory) {
//   //     toast.error('Please select sub sub category');
//   //     return;
//   //   }

//   //   if (!incidentData.subSubCategory) {
//   //     toast.error('Please select sub sub sub category');
//   //     return;
//   //   }

//   //   if (!incidentData.severity) {
//   //     toast.error('Please select severity');
//   //     return;
//   //   }

//   //   if (!incidentData.probability) {
//   //     toast.error('Please select probability');
//   //     return;
//   //   }

//   //   if (!incidentData.incidentLevel) {
//   //     toast.error('Please select incident level');
//   //     return;
//   //   }

//   //   if (!incidentData.description || incidentData.description.trim() === '') {
//   //     toast.error('Please enter a description');
//   //     return;
//   //   }

//   //   // Secondary category hierarchy validation - all levels are now mandatory
//   //   if (!incidentData.secondaryCategory) {
//   //     toast.error('Please select secondary category');
//   //     return;
//   //   }

//   //   if (!incidentData.secondarySubCategory) {
//   //     toast.error('Please select secondary sub category');
//   //     return;
//   //   }

//   //   if (!incidentData.secondarySubSubCategory) {
//   //     toast.error('Please select secondary sub sub category');
//   //     return;
//   //   }

//   //   if (!incidentData.secondarySubSubSubCategory) {
//   //     toast.error('Please select secondary sub sub sub category');
//   //     return;
//   //   }


//   //   if (!incidentData.factsCorrect) {
//   //     toast.error('Please confirm the disclaimer');
//   //     return;
//   //   }

//   //   try {

//   //     let baseUrl = localStorage.getItem('baseUrl') || '';
//   //     const token = localStorage.getItem('token') || '';
//   //     if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
//   //       baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
//   //     }

//   //     const form = new FormData();

//   //     // Time fields
//   //     form.append('incident[inc_time(1i)]', incidentData.year);
//   //     form.append('incident[inc_time(2i)]', monthNameToNumber(incidentData.month));
//   //     form.append('incident[inc_time(3i)]', incidentData.day);
//   //     form.append('incident[inc_time(4i)]', incidentData.hour);
//   //     form.append('incident[inc_time(5i)]', incidentData.minute);

//   //     // Building
//   //     form.append('incident[building_id]', incidentData.building);

//   //     // Primary hierarchy
//   //     form.append('incident[inc_category_id]', incidentData.categoryForIncident);
//   //     form.append('incident[inc_sub_category_id]', incidentData.primaryCategory);
//   //     form.append('incident[inc_sub_sub_category_id]', incidentData.subCategory);
//   //     form.append('incident[inc_sub_sub_sub_category_id]', incidentData.subSubCategory);

//   //     // Secondary hierarchy (optional)
//   //     if (incidentData.secondaryCategory) form.append('incident[inc_sec_category_id]', incidentData.secondaryCategory);
//   //     if (incidentData.secondarySubCategory) form.append('incident[inc_sec_sub_category_id]', incidentData.secondarySubCategory);
//   //     if (incidentData.secondarySubSubCategory) form.append('incident[inc_sec_sub_sub_category_id]', incidentData.secondarySubSubCategory);
//   //     if (incidentData.secondarySubSubSubCategory) form.append('incident[inc_sec_sub_sub_sub_category_id]', incidentData.secondarySubSubSubCategory);

//   //     // Severity and Probability
//   //     form.append('incident[severity]', incidentData.severity);
//   //     form.append('incident[probability]', incidentData.probability);

//   //     // Incident Level (auto-calculated, if available)
//   //     if (incidentData.incidentLevel) {
//   //       form.append('incident[inc_level_id]', incidentData.incidentLevel);
//   //     }

//   //     form.append('incident[description]', incidentData.description);

//   //     form.append('incident[support_required]', incidentData.supportRequired ? '1' : '0');
//   //     form.append('incident[disclaimer]', incidentData.factsCorrect ? '1' : '0');

//   //     form.append('noticeboard[document]', '');
//   //     form.append('noticeboard[expire_time]', '');

//   //     if (incidentData.attachments) {
//   //       form.append('noticeboard[files_attached][]', incidentData.attachments);
//   //     }

//   //     const resp = await fetch(`${baseUrl}/pms/incidents.json`, {
//   //       method: 'POST',
//   //       headers: {
//   //         Authorization: `Bearer ${token}`
//   //       },
//   //       body: form
//   //     });

//   //     if (!resp.ok) {
//   //       const errText = await resp.text();
//   //       throw new Error(errText || 'Failed to create incident');
//   //     }

//   //     toast.success('Incident reported successfully!');
//   //     navigate('/safety/incident');
//   //   } catch (err: any) {
//   //     console.error('Incident POST failed:', err);
//   //     toast.error('Failed to create incident');
//   //   }
//   // };


//   const handleSubmit = async () => {
//     // Time validation
//     if (!incidentData.year || !incidentData.month || !incidentData.day) {
//       toast.error('Please select complete date (day, month, year)');
//       return;
//     }

//     if (!incidentData.hour || !incidentData.minute) {
//       toast.error('Please select both hour and minute');
//       return;
//     }

//     // Building validation
//     if (!incidentData.building) {
//       toast.error('Please select a building');
//       return;
//     }

//     // Primary category hierarchy validation
//     if (!incidentData.categoryForIncident) {
//       toast.error('Please select primary category');
//       return;
//     }
//     if (!incidentData.primaryCategory) {
//       toast.error('Please select sub category');
//       return;
//     }
//     if (!incidentData.subCategory) {
//       toast.error('Please select sub sub category');
//       return;
//     }
//     if (!incidentData.subSubCategory) {
//       toast.error('Please select sub sub sub category');
//       return;
//     }

//     // Risk validation
//     if (!incidentData.severity) {
//       toast.error('Please select severity');
//       return;
//     }
//     if (!incidentData.probability) {
//       toast.error('Please select probability');
//       return;
//     }

//     // Description validation
//     if (!incidentData.description || incidentData.description.trim() === '') {
//       toast.error('Please enter a description');
//       return;
//     }

//     // Disclaimer validation
//     if (!incidentData.factsCorrect) {
//       toast.error('Please confirm the disclaimer');
//       return;
//     }

//     try {
//       // Base URL and token
//       let baseUrl = localStorage.getItem('baseUrl') || '';
//       const token = localStorage.getItem('token') || '';
//       if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
//         baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
//       }

//       const form = new FormData();

//       // Time fields
//       form.append('incident[inc_time(1i)]', incidentData.year);
//       form.append('incident[inc_time(2i)]', monthNameToNumber(incidentData.month));
//       form.append('incident[inc_time(3i)]', incidentData.day);
//       form.append('incident[inc_time(4i)]', incidentData.hour);
//       form.append('incident[inc_time(5i)]', incidentData.minute);

//       // Building
//       form.append('incident[building_id]', incidentData.building);

//       // Primary hierarchy
//       form.append('incident[inc_category_id]', incidentData.categoryForIncident);
//       form.append('incident[inc_sub_category_id]', incidentData.primaryCategory);
//       form.append('incident[inc_sub_sub_category_id]', incidentData.subCategory);
//       form.append('incident[inc_sub_sub_sub_category_id]', incidentData.subSubCategory);

//       // Severity, Probability, Incident Level
//       form.append('incident[severity]', incidentData.severity);
//       form.append('incident[probability]', incidentData.probability);
//       if (incidentData.incidentLevel) form.append('incident[inc_level_id]', incidentData.incidentLevel);

//       // Description
//       form.append('incident[description]', incidentData.description);

//       // Disclaimer and support
//       form.append('incident[support_required]', incidentData.supportRequired ? '1' : '0');
//       form.append('incident[disclaimer]', incidentData.factsCorrect ? '1' : '0');

//       // Attachments (optional)
//       if (incidentData.attachments) {
//         form.append('noticeboard[files_attached][]', incidentData.attachments);
//       }

//       const resp = await fetch(`${baseUrl}/pms/incidents.json`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//         body: form
//       });

//       if (!resp.ok) {
//         const errText = await resp.text();
//         throw new Error(errText || 'Failed to create incident');
//       }

//       toast.success('Incident reported successfully!');
//       navigate('/safety/incident');
//     } catch (err: any) {
//       console.error('Incident POST failed:', err);
//       toast.error('Failed to create incident');
//     }
//   };


//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <nav className="flex items-center text-sm text-gray-600 mb-4">
//           <span>Home</span>
//           <span className="mx-2">{'>'}</span>
//           <span>Safety</span>
//           <span className="mx-2">{'>'}</span>
//           <span>Incident</span>
//         </nav>
//         <Heading level="h1" variant="primary" spacing="none" className="text-[#C72030] font-semibold">
//           NEW INCIDENT
//         </Heading>
//       </div>

//       {/* Basic Details */}
//       <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
//         <CardHeader className='bg-[#F6F4EE] mb-4'>
//           <CardTitle className="text-lg text-black flex items-center">
//             <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
//             INCIDENT DETAILS
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 bg-white">
//           {/* Time & Date Section */}
//           <div className="mb-6">
//             <h3 className="text-sm font-medium mb-3">Time & Date <span style={{ color: '#C72030' }}>*</span></h3>
//             <div className="grid grid-cols-5 gap-2">
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink>Year <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Year *"
//                   value={incidentData.year}
//                   onChange={e => handleInputChange('year', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                   MenuProps={menuProps}
//                 >
//                   <MenuItem value=""><em>Select Year</em></MenuItem>
//                   {Array.from({ length: new Date().getFullYear() + 50 - 2010 + 1 }, (_, i) => {
//                     const year = new Date().getFullYear() + 50 - i; // From current year + 50 down to 2010
//                     return (
//                       <MenuItem key={year} value={String(year)}>
//                         {year}
//                       </MenuItem>
//                     );
//                   })}
//                 </MuiSelect>
//               </FormControl>

//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink>Month <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Month *"
//                   value={incidentData.month}
//                   onChange={e => handleInputChange('month', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                   MenuProps={menuProps}
//                 >
//                   <MenuItem value=""><em>Select Month</em></MenuItem>
//                   <MenuItem value="January">January</MenuItem>
//                   <MenuItem value="February">February</MenuItem>
//                   <MenuItem value="March">March</MenuItem>
//                   <MenuItem value="April">April</MenuItem>
//                   <MenuItem value="May">May</MenuItem>
//                   <MenuItem value="June">June</MenuItem>
//                   <MenuItem value="July">July</MenuItem>
//                   <MenuItem value="August">August</MenuItem>
//                   <MenuItem value="September">September</MenuItem>
//                   <MenuItem value="October">October</MenuItem>
//                   <MenuItem value="November">November</MenuItem>
//                   <MenuItem value="December">December</MenuItem>
//                 </MuiSelect>
//               </FormControl>

//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink>Day <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Day *"
//                   value={incidentData.day}
//                   onChange={e => handleInputChange('day', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                   MenuProps={menuProps}
//                 >
//                   <MenuItem value=""><em>Select Day</em></MenuItem>
//                   {Array.from({ length: 31 }, (_, i) => (
//                     <MenuItem key={i + 1} value={String(i + 1)}>{i + 1}</MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>

//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink>Hour <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Hour *"
//                   value={incidentData.hour}
//                   onChange={e => handleInputChange('hour', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                   MenuProps={menuProps}
//                 >
//                   <MenuItem value=""><em>Select Hour</em></MenuItem>
//                   {Array.from({ length: 24 }, (_, i) => (
//                     <MenuItem key={i} value={String(i)}>{i}</MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>

//               <FormControl fullWidth variant="outlined">
//                 <InputLabel shrink>Minute <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Minute *"
//                   value={incidentData.minute}
//                   onChange={e => handleInputChange('minute', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                   MenuProps={menuProps}
//                 >
//                   <MenuItem value=""><em>Select Minute</em></MenuItem>
//                   {Array.from({ length: 60 }, (_, i) => (
//                     <MenuItem key={i} value={String(i)}>{i}</MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>
//             </div>
//           </div>


//           {/* Building and Categories Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             {/* Building Dropdown */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//               <InputLabel shrink>Building <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Building *"
//                 value={incidentData.building}
//                 onChange={e => handleInputChange('building', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Building</em></MenuItem>
//                 {buildings.map(b => (
//                   <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* PRIMARY CATEGORY HIERARCHY */}
//             {/* Level 1: Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//               <InputLabel shrink>Primary Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Primary Category *"
//                 value={incidentData.categoryForIncident}
//                 onChange={e => handleInputChange('categoryForIncident', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Primary Category</em></MenuItem>
//                 {categories.map(cat => (
//                   <MenuItem key={cat.id} value={String(cat.id)}>{cat.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* Level 2: Sub Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.categoryForIncident}>
//               <InputLabel shrink>Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Sub Category *"
//                 value={incidentData.primaryCategory}
//                 onChange={e => handleInputChange('primaryCategory', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Sub Category</em></MenuItem>
//                 {subCategories.filter(sub => String(sub.parent_id) === incidentData.categoryForIncident).map(sub => (
//                   <MenuItem key={sub.id} value={String(sub.id)}>{sub.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* Level 3: Sub Sub Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.primaryCategory}>
//               <InputLabel shrink>Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Sub Sub Category *"
//                 value={incidentData.subCategory}
//                 onChange={e => handleInputChange('subCategory', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Sub Sub Category</em></MenuItem>
//                 {subSubCategories.filter(subsub => String(subsub.parent_id) === incidentData.primaryCategory).map(subsub => (
//                   <MenuItem key={subsub.id} value={String(subsub.id)}>{subsub.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* Level 4: Sub Sub Sub Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.subCategory}>
//               <InputLabel shrink>Sub Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Sub Sub Sub Category *"
//                 value={incidentData.subSubCategory}
//                 onChange={e => handleInputChange('subSubCategory', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Sub Sub Sub Category</em></MenuItem>
//                 {subSubSubCategories.filter(subsubsub => String(subsubsub.parent_id) === incidentData.subCategory).map(subsubsub => (
//                   <MenuItem key={subsubsub.id} value={String(subsubsub.id)}>{subsubsub.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* SECONDARY CATEGORY HIERARCHY */}
//             {/* Level 1: Secondary Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//               <InputLabel shrink>Secondary Category</InputLabel>
//               <MuiSelect
//                 label="Secondary Category *"
//                 value={incidentData.secondaryCategory}
//                 onChange={e => handleInputChange('secondaryCategory', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Secondary Category</em></MenuItem>
//                 {secondaryCategories.map(cat => (
//                   <MenuItem key={cat.id} value={String(cat.id)}>{cat.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* Level 2: Secondary Sub Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.secondaryCategory}>
//               <InputLabel shrink>Secondary Sub Category</InputLabel>
//               <MuiSelect
//                 label="Secondary Sub Category *"
//                 value={incidentData.secondarySubCategory}
//                 onChange={e => handleInputChange('secondarySubCategory', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Secondary Sub Category</em></MenuItem>
//                 {secondarySubCategories.filter(sub => String(sub.parent_id) === incidentData.secondaryCategory).map(sub => (
//                   <MenuItem key={sub.id} value={String(sub.id)}>{sub.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* Level 3: Secondary Sub Sub Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.secondarySubCategory}>
//               <InputLabel shrink>Secondary Sub Sub Category</InputLabel>
//               <MuiSelect
//                 label="Secondary Sub Sub Category *"
//                 value={incidentData.secondarySubSubCategory}
//                 onChange={e => handleInputChange('secondarySubSubCategory', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Secondary Sub Sub Category</em></MenuItem>
//                 {secondarySubSubCategories.filter(subsub => String(subsub.parent_id) === incidentData.secondarySubCategory).map(subsub => (
//                   <MenuItem key={subsub.id} value={String(subsub.id)}>{subsub.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             {/* Level 4: Secondary Sub Sub Sub Category */}
//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.secondarySubSubCategory}>
//               <InputLabel shrink>Secondary Sub Sub Sub Category</InputLabel>
//               <MuiSelect
//                 label="Secondary Sub Sub Sub Category *"
//                 value={incidentData.secondarySubSubSubCategory}
//                 onChange={e => handleInputChange('secondarySubSubSubCategory', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Secondary Sub Sub Sub Category</em></MenuItem>
//                 {secondarySubSubSubCategories.filter(subsubsub => String(subsubsub.parent_id) === incidentData.secondarySubSubCategory).map(subsubsub => (
//                   <MenuItem key={subsubsub.id} value={String(subsubsub.id)}>{subsubsub.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//             </FormControl>

//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//               <InputLabel shrink>Severity <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Severity *"
//                 value={incidentData.severity}
//                 onChange={e => handleInputChange('severity', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Severity</em></MenuItem>
//                 <MenuItem value="1">Insignificant</MenuItem>
//                 <MenuItem value="2">Minor</MenuItem>
//                 <MenuItem value="3">Moderate</MenuItem>
//                 <MenuItem value="4">Major</MenuItem>
//                 <MenuItem value="5">Catastrophic</MenuItem>
//               </MuiSelect>
//             </FormControl>

//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//               <InputLabel shrink>Probability <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Probability *"
//                 value={incidentData.probability}
//                 onChange={e => handleInputChange('probability', e.target.value)}
//                 displayEmpty
//                 sx={fieldStyles}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Probability</em></MenuItem>
//                 <MenuItem value="1">Rare</MenuItem>
//                 <MenuItem value="2">Possible</MenuItem>
//                 <MenuItem value="3">Likely</MenuItem>
//                 <MenuItem value="4">Often</MenuItem>
//                 <MenuItem value="5">Frequent/ Almost certain</MenuItem>
//               </MuiSelect>
//             </FormControl>

//             <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//               <InputLabel shrink>Incident level <span style={{ color: '#C72030' }}>*</span></InputLabel>
//               <MuiSelect
//                 label="Incident level *"
//                 value={incidentData.incidentLevel}
//                 onChange={e => handleInputChange('incidentLevel', e.target.value)}
//                 displayEmpty
//                 disabled={!!(incidentData.severity && incidentData.probability)}
//                 sx={{
//                   ...fieldStyles,
//                   '& .MuiInputBase-input.Mui-disabled': {
//                     WebkitTextFillColor: '#000',
//                     backgroundColor: '#f5f5f5'
//                   }
//                 }}
//                 MenuProps={menuProps}
//               >
//                 <MenuItem value=""><em>Select Level</em></MenuItem>
//                 {incidentLevels.map(level => (
//                   <MenuItem key={level.id} value={String(level.id)}>{level.name}</MenuItem>
//                 ))}
//               </MuiSelect>
//               {incidentData.severity && incidentData.probability && (
//                 <div className="text-xs text-gray-600 mt-1">
//                   Auto-calculated based on severity and probability
//                 </div>
//               )}
//             </FormControl>
//           </div>

//           {/* Description */}
//           {/* <div className="mt-6">
//             <TextField
//               label={<>Description<span style={{ color: '#C72030' }}>*</span></>}
//               value={incidentData.description}
//               onChange={e => handleInputChange('description', e.target.value)}
//               fullWidth
//               variant="outlined"
//               multiline
//               rows={4}
//               InputLabelProps={{
//                 shrink: true
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   height: "auto !important",
//                   padding: "10px !important",
//                   display: "flex",
//                 },
//                 "& .MuiInputBase-input[aria-hidden='true']": {
//                   flex: 0,
//                   width: 0,
//                   height: 0,
//                   padding: "0 !important",
//                   margin: 0,
//                   display: "none",
//                 },
//                 "& .MuiInputBase-input": {
//                   resize: "none !important",
//                 },
//               }}
//             />
//           </div> */}
//           <div className="mt-6">
//             <TextField
//               label={<>Description<span style={{ color: '#C72030' }}>*</span></>}
//               value={incidentData.description}
//               onChange={e => handleInputChange('description', e.target.value)}
//               fullWidth
//               variant="outlined"
//               multiline
//               rows={4}
//               InputLabelProps={{
//                 shrink: true
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   padding: "10px", // Increased padding
//                   minHeight: "120px", // Ensure minimum height
//                   marginTop: "8px", // Space between label and input
//                 },
//                 "& .MuiInputBase-input": {
//                   resize: "none !important",
//                 },
//               }}
//             />
//           </div>
//         </CardContent>
//       </Card>

//       {/* Support and Disclaimer */}
//       <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
//         <CardHeader className='bg-[#F6F4EE] mb-4'>
//           <CardTitle className="text-lg text-black flex items-center">
//             <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
//             SUPPORT & DISCLAIMER
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 bg-white">
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-lg font-medium mb-3">Support</h3>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={incidentData.supportRequired}
//                     onChange={(e) => handleCheckboxChange('supportRequired', e.target.checked)}
//                     sx={{
//                       color: '#C72030',
//                       '&.Mui-checked': {
//                         color: '#C72030',
//                       },
//                     }}
//                   />
//                 }
//                 label="Support required"
//               />
//             </div>

//             <div>
//               <h3 className="text-lg font-medium mb-3">Disclaimer <span style={{ color: '#C72030' }}>*</span></h3>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     checked={incidentData.factsCorrect}
//                     onChange={(e) => handleCheckboxChange('factsCorrect', e.target.checked)}
//                     sx={{
//                       color: '#C72030',
//                       '&.Mui-checked': {
//                         color: '#C72030',
//                       },
//                     }}
//                   />
//                 }
//                 label={<>I have correctly stated all the facts related to the incident. </>}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Attachments */}
//       <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
//         <CardHeader className='bg-[#F6F4EE] mb-4'>
//           <CardTitle className="text-lg text-black flex items-center">
//             <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
//             ATTACHMENTS
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 bg-white">
//           <div className="space-y-4">
//             <div>
//               <input
//                 type="file"
//                 onChange={handleFileUpload}
//                 className="hidden"
//                 id="file-upload"
//                 accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//               />
//               <label
//                 htmlFor="file-upload"
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
//               >
//                 Choose Files
//               </label>
//               <span className="ml-4 text-sm text-gray-500">
//                 {incidentData.attachments ? incidentData.attachments.name : 'No file chosen'}
//               </span>
//             </div>

//             <div>
//               <Button
//                 style={{
//                   backgroundColor: '#C72030'
//                 }}
//                 className="text-white hover:opacity-90"
//               >
//                 Choose a file...
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Submit Button */}
//       <div className="flex justify-center pt-6">
//         <Button
//           onClick={handleSubmit}
//           style={{
//             backgroundColor: '#8B4A8C'
//           }}
//           className="text-white hover:opacity-90 px-8 py-3 text-lg"
//         >
//           Create Incident
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default AddIncidentPage;





import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { Heading } from '@/components/ui/heading';

const fieldStyles = {
  height: {
    xs: 28,
    sm: 36,
    md: 45
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: {
      xs: '8px',
      sm: '10px',
      md: '12px'
    }
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      zIndex: 9999,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  MenuListProps: {
    style: {
      padding: 0,
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
};


// Helper function to get current date/time values as strings
const getCurrentDateTime = () => {
  const now = new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return {
    year: now.getFullYear().toString(),
    month: monthNames[now.getMonth()],
    day: now.getDate().toString(),
    hour: now.getHours().toString(),
    minute: now.getMinutes().toString()
  };
};

export const AddIncidentPage = () => {
  const navigate = useNavigate();
  const currentDateTime = getCurrentDateTime();

  const [incidentData, setIncidentData] = useState({
    year: currentDateTime.year,
    month: currentDateTime.month,
    day: currentDateTime.day,
    hour: currentDateTime.hour,
    minute: currentDateTime.minute,
    building: '',
    // Primary hierarchy
    primaryCategory: '',
    subCategory: '',
    subSubCategory: '',
    subSubSubCategory: '',
    // Secondary hierarchy
    secondaryCategory: '',
    secondarySubCategory: '',
    secondarySubSubCategory: '',
    secondarySubSubSubCategory: '',
    // Risk inputs
    severity: '',
    probability: '',
    // Computed/selected
    incidentLevel: '',
    // Others
    description: '',
    supportRequired: false,
    factsCorrect: false,
    attachments: null as File | null
  });


  // State for buildings
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  // Category hierarchy states
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<any[]>([]);
  const [subSubSubCategories, setSubSubSubCategories] = useState<any[]>([]);
  // Secondary hierarchy
  const [secondaryCategories, setSecondaryCategories] = useState<{ id: number; name: string }[]>([]);
  const [secondarySubCategories, setSecondarySubCategories] = useState<any[]>([]);
  const [secondarySubSubCategories, setSecondarySubSubCategories] = useState<any[]>([]);
  const [secondarySubSubSubCategories, setSecondarySubSubSubCategories] = useState<any[]>([]);
  // Incident levels
  const [incidentLevels, setIncidentLevels] = useState<{ id: number; name: string }[]>([]);

  // Fetch all tags and buildings on mount
  useEffect(() => {
    const fetchAll = async () => {
      // Get baseUrl and token from localStorage, ensure baseUrl starts with https://
      let baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';
      if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
      }
      // Fetch buildings
      try {
        const response = await fetch(`${baseUrl}/pms/buildings.json`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          setBuildings(Array.isArray(result.pms_buildings) ? result.pms_buildings.map((b: any) => ({ id: b.id, name: b.name })) : []);
        } else {
          setBuildings([]);
        }
      } catch {
        setBuildings([]);
      }

      // Fetch incident levels
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          const levels = result.data
            .filter((item: any) => item.tag_type === 'IncidenceLevel')
            .map(({ id, name }: any) => ({ id, name }));
          setIncidentLevels(levels);
        } else {
          setIncidentLevels([]);
        }
      } catch {
        setIncidentLevels([]);
      }

      // Fetch all tags for categories
      try {
        const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          const data = result.data || [];
          // Primary hierarchy
          const allCategories = data.filter((item: any) => item.tag_type === 'IncidenceCategory' && item.parent_id === null);
          setCategories(allCategories.map((item: any) => ({ id: item.id, name: item.name })));
          const allSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubCategory');
          setSubCategories(allSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          const allSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubCategory');
          setSubSubCategories(allSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          const allSubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubSubCategory');
          setSubSubSubCategories(allSubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          // Secondary hierarchy
          const allSecondaryCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondaryCategory' && item.parent_id === null);
          setSecondaryCategories(allSecondaryCategories.map((item: any) => ({ id: item.id, name: item.name })));
          const allSecondarySubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubCategory');
          setSecondarySubCategories(allSecondarySubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          const allSecondarySubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubCategory');
          setSecondarySubSubCategories(allSecondarySubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          const allSecondarySubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubSubCategory');
          setSecondarySubSubSubCategories(allSecondarySubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
        }
      } catch { }
    };
    fetchAll();
  }, []);

  // Helper to calculate and set incident level based on risk score
  const calculateAndSetIncidentLevel = (severity: string, probability: string) => {
    const sev = parseInt(severity);
    const prob = parseInt(probability);
    if (!sev || !prob) {
      setIncidentData(prev => ({ ...prev, incidentLevel: '' }));
      return;
    }
    const riskScore = sev * prob;
    let riskLevelText = '';

    // Determine risk level text based on score~
    if (riskScore >= 1 && riskScore <= 6) {
      riskLevelText = 'Low Risk';
    } else if (riskScore >= 8 && riskScore <= 12) {
      riskLevelText = 'Medium Risk';
    } else if (riskScore >= 15 && riskScore <= 20) {
      riskLevelText = 'High Risk';
    } else if (riskScore > 20) {
      riskLevelText = 'Extreme Risk';
    }

    // Find the incident level that matches the risk level text
    const matchedLevel = incidentLevels.find(level => {
      const levelName = level.name.toLowerCase();
      const riskText = riskLevelText.toLowerCase();

      // Try different matching strategies
      return levelName.includes(riskText) ||
        levelName.includes(riskText.replace(' ', '')) ||
        (riskText === 'low risk' && (levelName.includes('level 1') || levelName.includes('1'))) ||
        (riskText === 'medium risk' && (levelName.includes('level 2') || levelName.includes('2'))) ||
        (riskText === 'high risk' && (levelName.includes('level 3') || levelName.includes('3'))) ||
        (riskText === 'extreme risk' && (levelName.includes('level 4') || levelName.includes('4')));
    });

    // Set the incident level ID if found, otherwise use fallback based on risk score
    let levelId = '';
    if (matchedLevel) {
      levelId = String(matchedLevel.id);
    } else {
      // Fallback: try to match by position in array if available
      if (incidentLevels.length > 0) {
        if (riskScore >= 1 && riskScore <= 6 && incidentLevels[0]) {
          levelId = String(incidentLevels[0].id);
        } else if (riskScore >= 8 && riskScore <= 12 && incidentLevels[1]) {
          levelId = String(incidentLevels[1].id);
        } else if (riskScore >= 15 && riskScore <= 20 && incidentLevels[2]) {
          levelId = String(incidentLevels[2].id);
        } else if (riskScore > 20 && incidentLevels[3]) {
          levelId = String(incidentLevels[3].id);
        } else {
          // Use first available level as fallback
          levelId = String(incidentLevels[0].id);
        }
      }
    }

    // Force update the incident level
    setIncidentData(prev => ({
      ...prev,
      incidentLevel: levelId
    }));
  };

  // Helper to get risk level text based on severity and probability
  const getRiskLevelText = (): string => {
    const sev = parseInt(incidentData.severity);
    const prob = parseInt(incidentData.probability);
    if (!sev || !prob) return '';

    const riskScore = sev * prob;
    if (riskScore >= 1 && riskScore <= 6) {
      return 'Low Risk';
    } else if (riskScore >= 8 && riskScore <= 12) {
      return 'Medium Risk';
    } else if (riskScore >= 15 && riskScore <= 20) {
      return 'High Risk';
    } else if (riskScore > 20) {
      return 'Extreme Risk';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setIncidentData(prev => ({ ...prev, [field]: value }));
  };

  // Recalculate incident level whenever severity or probability changes
  useEffect(() => {
    if (incidentData.severity && incidentData.probability && incidentLevels.length > 0) {
      calculateAndSetIncidentLevel(incidentData.severity, incidentData.probability);
    }
  }, [incidentData.severity, incidentData.probability, incidentLevels]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIncidentData(prev => ({
        ...prev,
        attachments: file
      }));
      toast.success('File uploaded successfully');
    }
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setIncidentData(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  // Helper: convert month name to number (1-12)
  const monthNameToNumber = (name: string) => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const idx = months.indexOf((name || '').toLowerCase());
    return idx === -1 ? '' : String(idx + 1);
  };

  const handleSubmit = async () => {
    // Time validation
    if (!incidentData.year || !incidentData.month || !incidentData.day) {
      toast.error('Please select complete date (day, month, year)');
      return;
    }

    if (!incidentData.hour || !incidentData.minute) {
      toast.error('Please select both hour and minute');
      return;
    }

    // Building validation
    if (!incidentData.building) {
      toast.error('Please select a building');
      return;
    }

    // Primary category hierarchy validation
    if (!incidentData.primaryCategory) {
      toast.error('Please select primary category');
      return;
    }
    if (!incidentData.subCategory) {
      toast.error('Please select sub category');
      return;
    }
    if (!incidentData.subSubCategory) {
      toast.error('Please select sub sub category');
      return;
    }
    if (!incidentData.subSubSubCategory) {
      toast.error('Please select sub sub sub category');
      return;
    }

    // Risk validation
    if (!incidentData.severity) {
      toast.error('Please select severity');
      return;
    }
    if (!incidentData.probability) {
      toast.error('Please select probability');
      return;
    }

    // Description validation
    if (!incidentData.description || incidentData.description.trim() === '') {
      toast.error('Please enter a description');
      return;
    }

    // Disclaimer validation
    if (!incidentData.factsCorrect) {
      toast.error('Please confirm the disclaimer');
      return;
    }

    try {
      // Base URL and token
      let baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';
      if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = 'https://' + baseUrl.replace(/^\/\/+/, '');
      }

      const form = new FormData();

      // Time fields
      form.append('incident[inc_time(1i)]', incidentData.year);
      form.append('incident[inc_time(2i)]', monthNameToNumber(incidentData.month));
      form.append('incident[inc_time(3i)]', incidentData.day);
      form.append('incident[inc_time(4i)]', incidentData.hour);
      form.append('incident[inc_time(5i)]', incidentData.minute);

      // Building
      form.append('incident[building_id]', incidentData.building);

      // Primary hierarchy
      form.append('incident[inc_category_id]', incidentData.primaryCategory);
      form.append('incident[inc_sub_category_id]', incidentData.subCategory);
      form.append('incident[inc_sub_sub_category_id]', incidentData.subSubCategory);
      form.append('incident[inc_sub_sub_sub_category_id]', incidentData.subSubSubCategory);

      // Severity, Probability, Incident Level
      // form.append('incident[consequence_insignificant]', incidentData.severity);
      form.append('incident[probability]', incidentData.probability);
      form.append('incident[severity]', incidentData.severity);
      if (incidentData.incidentLevel) form.append('incident[inc_level_id]', incidentData.incidentLevel);

      // Description
      form.append('incident[description]', incidentData.description);

      // Disclaimer and support
      form.append('incident[support_required]', incidentData.supportRequired ? '1' : '0');
      form.append('incident[disclaimer]', incidentData.factsCorrect ? '1' : '0');

      // Attachments (optional)
      if (incidentData.attachments) {
        form.append('noticeboard[files_attached][]', incidentData.attachments);
      }

      const resp = await fetch(`${baseUrl}/pms/incidents.json`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(errText || 'Failed to create incident');
      }

      toast.success('Incident reported successfully!');
      navigate('/safety/incident');
    } catch (err: any) {
      console.error('Incident POST failed:', err);
      toast.error('Failed to create incident');
    }
  };


  return (
    <div className="p-6">
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Home</span>
          <span className="mx-2">{'>'}</span>
          <span>Safety</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident</span>
        </nav>
        <Heading level="h1" variant="primary" spacing="none" className="text-[#C72030] font-semibold">
          NEW INCIDENT
        </Heading>
      </div>

      {/* Basic Details */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            INCIDENT DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          {/* Time & Date Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Time & Date <span style={{ color: '#C72030' }}>*</span></h3>
            <div className="grid grid-cols-5 gap-2">
              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Year <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Year *"
                  value={incidentData.year}
                  onChange={e => handleInputChange('year', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Year</em></MenuItem>
                  {Array.from({ length: new Date().getFullYear() + 50 - 2010 + 1 }, (_, i) => {
                    const year = new Date().getFullYear() + 50 - i; // From current year + 50 down to 2010
                    return (
                      <MenuItem key={year} value={String(year)}>
                        {year}
                      </MenuItem>
                    );
                  })}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Month <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Month *"
                  value={incidentData.month}
                  onChange={e => handleInputChange('month', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Month</em></MenuItem>
                  <MenuItem value="January">January</MenuItem>
                  <MenuItem value="February">February</MenuItem>
                  <MenuItem value="March">March</MenuItem>
                  <MenuItem value="April">April</MenuItem>
                  <MenuItem value="May">May</MenuItem>
                  <MenuItem value="June">June</MenuItem>
                  <MenuItem value="July">July</MenuItem>
                  <MenuItem value="August">August</MenuItem>
                  <MenuItem value="September">September</MenuItem>
                  <MenuItem value="October">October</MenuItem>
                  <MenuItem value="November">November</MenuItem>
                  <MenuItem value="December">December</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Day <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Day *"
                  value={incidentData.day}
                  onChange={e => handleInputChange('day', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Day</em></MenuItem>
                  {Array.from({ length: 31 }, (_, i) => (
                    <MenuItem key={i + 1} value={String(i + 1)}>{i + 1}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Hour <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Hour *"
                  value={incidentData.hour}
                  onChange={e => handleInputChange('hour', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Hour</em></MenuItem>
                  {Array.from({ length: 24 }, (_, i) => (
                    <MenuItem key={i} value={String(i)}>{i}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined">
                <InputLabel shrink>Minute <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Minute *"
                  value={incidentData.minute}
                  onChange={e => handleInputChange('minute', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={menuProps}
                >
                  <MenuItem value=""><em>Select Minute</em></MenuItem>
                  {Array.from({ length: 60 }, (_, i) => (
                    <MenuItem key={i} value={String(i)}>{i}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>
          </div>


          {/* Building and Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Building Dropdown */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Building <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Building *"
                value={incidentData.building}
                onChange={e => handleInputChange('building', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Building</em></MenuItem>
                {buildings.map(b => (
                  <MenuItem key={b.id} value={String(b.id)}>{b.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* PRIMARY CATEGORY HIERARCHY */}
            {/* Level 1: Primary Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Primary Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Primary Category *"
                value={incidentData.primaryCategory}
                onChange={e => handleInputChange('primaryCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Primary Category</em></MenuItem>
                {categories.map(cat => (
                  <MenuItem key={cat.id} value={String(cat.id)}>{cat.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Level 2: Sub Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.primaryCategory}>
              <InputLabel shrink>Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Sub Category *"
                value={incidentData.subCategory}
                onChange={e => handleInputChange('subCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                {subCategories.filter(sub => String(sub.parent_id) === incidentData.primaryCategory).map(sub => (
                  <MenuItem key={sub.id} value={String(sub.id)}>{sub.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Level 3: Sub Sub Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.subCategory}>
              <InputLabel shrink>Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Sub Sub Category *"
                value={incidentData.subSubCategory}
                onChange={e => handleInputChange('subSubCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Sub Sub Category</em></MenuItem>
                {subSubCategories.filter(subsub => String(subsub.parent_id) === incidentData.subCategory).map(subsub => (
                  <MenuItem key={subsub.id} value={String(subsub.id)}>{subsub.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Level 4: Sub Sub Sub Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.subSubCategory}>
              <InputLabel shrink>Sub Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Sub Sub Sub Category *"
                value={incidentData.subSubSubCategory}
                onChange={e => handleInputChange('subSubSubCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Sub Sub Sub Category</em></MenuItem>
                {subSubSubCategories.filter(subsubsub => String(subsubsub.parent_id) === incidentData.subSubCategory).map(subsubsub => (
                  <MenuItem key={subsubsub.id} value={String(subsubsub.id)}>{subsubsub.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* SECONDARY CATEGORY HIERARCHY */}
            {/* Level 1: Secondary Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Secondary Category</InputLabel>
              <MuiSelect
                label="Secondary Category *"
                value={incidentData.secondaryCategory}
                onChange={e => handleInputChange('secondaryCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Secondary Category</em></MenuItem>
                {secondaryCategories.map(cat => (
                  <MenuItem key={cat.id} value={String(cat.id)}>{cat.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Level 2: Secondary Sub Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.secondaryCategory}>
              <InputLabel shrink>Secondary Sub Category</InputLabel>
              <MuiSelect
                label="Secondary Sub Category *"
                value={incidentData.secondarySubCategory}
                onChange={e => handleInputChange('secondarySubCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Secondary Sub Category</em></MenuItem>
                {secondarySubCategories.filter(sub => String(sub.parent_id) === incidentData.secondaryCategory).map(sub => (
                  <MenuItem key={sub.id} value={String(sub.id)}>{sub.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Level 3: Secondary Sub Sub Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.secondarySubCategory}>
              <InputLabel shrink>Secondary Sub Sub Category</InputLabel>
              <MuiSelect
                label="Secondary Sub Sub Category *"
                value={incidentData.secondarySubSubCategory}
                onChange={e => handleInputChange('secondarySubSubCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Secondary Sub Sub Category</em></MenuItem>
                {secondarySubSubCategories.filter(subsub => String(subsub.parent_id) === incidentData.secondarySubCategory).map(subsub => (
                  <MenuItem key={subsub.id} value={String(subsub.id)}>{subsub.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            {/* Level 4: Secondary Sub Sub Sub Category */}
            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!incidentData.secondarySubSubCategory}>
              <InputLabel shrink>Secondary Sub Sub Sub Category</InputLabel>
              <MuiSelect
                label="Secondary Sub Sub Sub Category *"
                value={incidentData.secondarySubSubSubCategory}
                onChange={e => handleInputChange('secondarySubSubSubCategory', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Secondary Sub Sub Sub Category</em></MenuItem>
                {secondarySubSubSubCategories.filter(subsubsub => String(subsubsub.parent_id) === incidentData.secondarySubSubCategory).map(subsubsub => (
                  <MenuItem key={subsubsub.id} value={String(subsubsub.id)}>{subsubsub.name}</MenuItem>
                ))}
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Severity <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Severity *"
                value={incidentData.severity}
                onChange={e => handleInputChange('severity', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Severity</em></MenuItem>
                <MenuItem value="1">Insignificant</MenuItem>
                <MenuItem value="2">Minor</MenuItem>
                <MenuItem value="3">Moderate</MenuItem>
                <MenuItem value="4">Major</MenuItem>
                <MenuItem value="5">Catastrophic</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Probability <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Probability *"
                value={incidentData.probability}
                onChange={e => handleInputChange('probability', e.target.value)}
                displayEmpty
                sx={fieldStyles}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Probability</em></MenuItem>
                <MenuItem value="1">Rare</MenuItem>
                <MenuItem value="2">Possible</MenuItem>
                <MenuItem value="3">Likely</MenuItem>
                <MenuItem value="4">Often</MenuItem>
                <MenuItem value="5">Frequent/ Almost certain</MenuItem>
              </MuiSelect>
            </FormControl>

            <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
              <InputLabel shrink>Incident level <span style={{ color: '#C72030' }}>*</span></InputLabel>
              <MuiSelect
                label="Incident level *"
                value={incidentData.incidentLevel}
                onChange={e => handleInputChange('incidentLevel', e.target.value)}
                displayEmpty
                disabled={!!(incidentData.severity && incidentData.probability)}
                sx={{
                  ...fieldStyles,
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#000',
                    backgroundColor: '#f5f5f5'
                  }
                }}
                MenuProps={menuProps}
              >
                <MenuItem value=""><em>Select Level</em></MenuItem>
                {incidentLevels.map(level => (
                  <MenuItem key={level.id} value={String(level.id)}>{level.name}</MenuItem>
                ))}
              </MuiSelect>
              {incidentData.severity && incidentData.probability && (
                <div className="text-xs text-gray-600 mt-1">
                  Auto-calculated based on severity and probability
                </div>
              )}
            </FormControl>
          </div>

          {/* Description */}
          <div className="mt-6">
            <TextField
              label={<>Description<span style={{ color: '#C72030' }}>*</span></>}
              value={incidentData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              InputLabelProps={{
                shrink: true
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  padding: "10px", // Increased padding
                  minHeight: "120px", // Ensure minimum height
                  marginTop: "8px", // Space between label and input
                },
                "& .MuiInputBase-input": {
                  resize: "none !important",
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Support and Disclaimer */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
            SUPPORT & DISCLAIMER
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Support</h3>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={incidentData.supportRequired}
                    onChange={(e) => handleCheckboxChange('supportRequired', e.target.checked)}
                    sx={{
                      color: '#C72030',
                      '&.Mui-checked': {
                        color: '#C72030',
                      },
                    }}
                  />
                }
                label="Support required"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Disclaimer <span style={{ color: '#C72030' }}>*</span></h3>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={incidentData.factsCorrect}
                    onChange={(e) => handleCheckboxChange('factsCorrect', e.target.checked)}
                    sx={{
                      color: '#C72030',
                      '&.Mui-checked': {
                        color: '#C72030',
                      },
                    }}
                  />
                }
                label={<>I have correctly stated all the facts related to the incident. </>}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="space-y-4">
            <div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                Choose Files
              </label>
              <span className="ml-4 text-sm text-gray-500">
                {incidentData.attachments ? incidentData.attachments.name : 'No file chosen'}
              </span>
            </div>

            <div>
              <Button
                style={{
                  backgroundColor: '#C72030'
                }}
                className="text-white hover:opacity-90"
              >
                Choose a file...
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#8B4A8C'
          }}
          className="text-white hover:opacity-90 px-8 py-3 text-lg"
        >
          Create Incident
        </Button>
      </div>
    </div>
  );
}

export default AddIncidentPage;