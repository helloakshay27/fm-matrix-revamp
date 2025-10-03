
// import React, { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import { Info, FileText, Users, Settings, AlertTriangle, Search, Loader2, Paperclip, Heart, Stethoscope, UserSearch, Trash } from 'lucide-react';
// import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, Checkbox, FormControlLabel } from '@mui/material';
// import { incidentService, type Incident } from '@/services/incidentService';
// import { toast } from 'sonner';

// export const EditIncidentDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [incident, setIncident] = useState<Incident | null>(null);

//   // Determine if we're in Safety or Maintenance context
//   const isSafetyContext = location.pathname.startsWith('/safety');
//   const basePath = isSafetyContext ? '/safety' : '/maintenance';

//   const [formData, setFormData] = useState({
//     year: '',
//     month: '',
//     day: '',
//     hour: '',
//     minute: '',
//     incidentDate: '',
//     incidentTime: '',
//     location: '',
//     building: '',
//     categoryForIncident: '',
//     primaryCategory: '',
//     subCategory: '',
//     subSubCategory: '',
//     secondaryCategory: '',
//     secondarySubCategory: '',
//     secondarySubSubCategory: '',
//     secondarySubSubSubCategory: '',
//     severity: '',
//     probability: '',
//     incidentLevel: '',
//     description: '',
//     propertyDamageHappened: '',
//     propertyDamageCategory: '',
//     damageCoveredInsurance: '',
//     damagedRecovered: '',
//     insuredBy: '',
//     primaryRootCauseCategory: '',
//     rca: '',
//     correctiveAction: '',
//     preventiveAction: '',
//     incidentType: '',
//     reportedBy: '',
//     witnessName: '',
//     injuryOccurred: '',
//     propertyDamage: '',
//     immediateAction: '',
//     rootCause: '',
//     preventiveMeasures: '',
//     status: '',
//     assignedTo: '',
//     priority: '',
//     witnesses: [
//       { name: '', mobile: '', id: null, _destroy: false }
//     ],
//     equipmentPropertyDamagedCost: '',
//     productionLoss: '',
//     treatmentCost: '',
//     absenteeismCost: '',
//     otherCost: '',
//     totalCost: '0.00',
//     firstAidProvided: false,
//     firstAidAttendants: '',
//     medicalTreatment: false,
//     treatmentFacility: '',
//     attendingPhysician: '',
//     investigationTeam: [
//       { name: '', mobile: '', designation: '', id: null, _destroy: false }
//     ],
//     supportRequired: false,
//     factsCorrect: false,
//     attachments: null,
//     incidentDetailId: null
//   });

//   const [formKey, setFormKey] = useState(0);

//   // State for buildings and categories (same as AddIncidentPage)
//   const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
//   const [dataLoaded, setDataLoaded] = useState(false);
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
//   // Severity and Probability options (if available from API)
//   const [severityOptions, setSeverityOptions] = useState<{ id: number; name: string }[]>([]);
//   const [probabilityOptions, setProbabilityOptions] = useState<{ id: number; name: string }[]>([]);
//   // Attachments state
//   const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
//   const [newAttachments, setNewAttachments] = useState<File[]>([]);
//   // Property Damage Category and RCA Category states
//   const [propertyDamageCategories, setPropertyDamageCategories] = useState<{ id: number; name: string }[]>([]);
//   const [rcaCategories, setRcaCategories] = useState<{ id: number; name: string }[]>([]);

//   // Debug form data changes
//   useEffect(() => {
//     console.log('Form data state updated:', formData);
//   }, [formData]);

//   // Calculate total cost whenever individual cost fields change
//   useEffect(() => {
//     const calculateTotalCost = () => {
//       const equipmentCost = parseFloat(formData.equipmentPropertyDamagedCost) || 0;
//       const production = parseFloat(formData.productionLoss) || 0;
//       const treatment = parseFloat(formData.treatmentCost) || 0;
//       const absenteeism = parseFloat(formData.absenteeismCost) || 0;
//       const other = parseFloat(formData.otherCost) || 0;

//       const total = equipmentCost + production + treatment + absenteeism + other;
//       setFormData(prev => ({ ...prev, totalCost: total.toFixed(2) }));
//     };

//     calculateTotalCost();
//   }, [formData.equipmentPropertyDamagedCost, formData.productionLoss, formData.treatmentCost, formData.absenteeismCost, formData.otherCost]);

//   // Clear property damage related fields when "No" is selected
//   useEffect(() => {
//     if (formData.propertyDamageHappened === 'false') {
//       setFormData(prev => ({
//         ...prev,
//         propertyDamageCategory: '',
//         damageCoveredInsurance: '',
//         damagedRecovered: '',
//         insuredBy: '',
//         equipmentPropertyDamagedCost: '',
//         productionLoss: '',
//         treatmentCost: '',
//         absenteeismCost: '',
//         otherCost: '',
//         totalCost: '0.00'
//       }));
//     }
//   }, [formData.propertyDamageHappened]);

//   // Clear insured by field when damage is not covered under insurance
//   useEffect(() => {
//     if (formData.damageCoveredInsurance === 'false') {
//       setFormData(prev => ({
//         ...prev,
//         damagedRecovered: '',
//         insuredBy: ''
//       }));
//     }
//   }, [formData.damageCoveredInsurance]);

//   // Helper to calculate and set incident level based on risk score (same as AddIncidentPage)
//   const calculateAndSetIncidentLevel = (severity: string, probability: string) => {
//     const sev = parseInt(severity);
//     const prob = parseInt(probability);
//     if (!sev || !prob) {
//       setFormData(prev => ({ ...prev, incidentLevel: '' }));
//       return;
//     }
//     const riskScore = sev * prob;
//     let riskLevelText = '';

//     // Determine risk level text based on score
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
//     setFormData(prev => ({
//       ...prev,
//       incidentLevel: levelId
//     }));
//   };

//   // Recalculate incident level whenever severity or probability changes
//   useEffect(() => {
//     if (formData.severity && formData.probability && incidentLevels.length > 0) {
//       calculateAndSetIncidentLevel(formData.severity, formData.probability);
//     }
//   }, [formData.severity, formData.probability, incidentLevels]);

//   // Fetch all tags and buildings on mount (same as AddIncidentPage)
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
//           // Update to use pms_buildings array as per API response structure
//           const buildingsArray = Array.isArray(result.pms_buildings) ? result.pms_buildings : [];
//           setBuildings(buildingsArray.map((b: any) => ({ id: b.id, name: b.name })));
//           console.log('Loaded buildings:', buildingsArray.length);
//         } else {
//           setBuildings([]);
//         }
//       } catch (error) {
//         console.error('Error fetching buildings:', error);
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
//           console.log('Loaded incident levels:', levels.length);
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
//           console.log('Loaded tag data:', data.length, 'items');

//           // Primary hierarchy
//           const allCategories = data.filter((item: any) => item.tag_type === 'IncidenceCategory' && item.parent_id === null);
//           setCategories(allCategories.map((item: any) => ({ id: item.id, name: item.name })));
//           console.log('Loaded categories:', allCategories.length);

//           const allSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubCategory');
//           setSubCategories(allSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           console.log('Loaded sub categories:', allSubCategories.length);

//           const allSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubCategory');
//           setSubSubCategories(allSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           console.log('Loaded sub sub categories:', allSubSubCategories.length);

//           const allSubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubSubCategory');
//           setSubSubSubCategories(allSubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           console.log('Loaded sub sub sub categories:', allSubSubSubCategories.length);
//           // Secondary hierarchy
//           const allSecondaryCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondaryCategory' && item.parent_id === null);
//           setSecondaryCategories(allSecondaryCategories.map((item: any) => ({ id: item.id, name: item.name })));
//           console.log('Loaded secondary categories:', allSecondaryCategories.length);

//           const allSecondarySubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubCategory');
//           setSecondarySubCategories(allSecondarySubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           console.log('Loaded secondary sub categories:', allSecondarySubCategories.length);

//           const allSecondarySubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubCategory');
//           setSecondarySubSubCategories(allSecondarySubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           console.log('Loaded secondary sub sub categories:', allSecondarySubSubCategories.length);

//           const allSecondarySubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubSubCategory');
//           setSecondarySubSubSubCategories(allSecondarySubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
//           console.log('Loaded secondary sub sub sub categories:', allSecondarySubSubSubCategories.length);

//           // Try to fetch severity and probability options if available from API
//           const allSeverityOptions = data.filter((item: any) => item.tag_type === 'Severity' || item.tag_type === 'IncidenceSeverity');
//           if (allSeverityOptions.length > 0) {
//             setSeverityOptions(allSeverityOptions.map((item: any) => ({ id: item.id, name: item.name })));
//             console.log('Loaded severity options from API:', allSeverityOptions.length);
//           } else {
//             console.log('No severity options found in API, using fallback');
//           }

//           const allProbabilityOptions = data.filter((item: any) => item.tag_type === 'Probability' || item.tag_type === 'IncidenceProbability');
//           if (allProbabilityOptions.length > 0) {
//             setProbabilityOptions(allProbabilityOptions.map((item: any) => ({ id: item.id, name: item.name })));
//             console.log('Loaded probability options from API:', allProbabilityOptions.length);
//           } else {
//             console.log('No probability options found in API, using fallback');
//           }

//           // Fetch Property Damage Categories
//           const allPropertyDamageCategories = data.filter((item: any) => item.tag_type === 'PropertyDamageCategory');
//           setPropertyDamageCategories(allPropertyDamageCategories.map((item: any) => ({ id: item.id, name: item.name })));
//           console.log('Loaded property damage categories:', allPropertyDamageCategories.length);

//           // Fetch RCA Categories
//           const allRcaCategories = data.filter((item: any) => item.tag_type === 'RCACategory');
//           setRcaCategories(allRcaCategories.map((item: any) => ({ id: item.id, name: item.name })));
//           console.log('Loaded RCA categories:', allRcaCategories.length);
//         }
//       } catch { }

//       // Mark data as loaded
//       setDataLoaded(true);
//     };
//     fetchAll();
//   }, []);

//   // Fetch incident details after API data is loaded and buildings are available
//   useEffect(() => {
//     if (id && dataLoaded && buildings.length > 0) {
//       fetchIncidentDetails();
//     }
//   }, [id, dataLoaded, buildings.length]);

//   const fetchIncidentDetails = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('Fetching incident details for ID:', id);
//       const incidentData = await incidentService.getIncidentById(id!);
//       console.log('Received incident data:', JSON.stringify(incidentData, null, 2));

//       if (incidentData) {
//         setIncident(incidentData);
//         populateFormData(incidentData);
//       } else {
//         setError('Incident not found');
//       }
//     } catch (err) {
//       setError('Failed to fetch incident details');
//       console.error('Error fetching incident:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const populateFormData = (incident: Incident) => {
//     console.log('Populating form data with incident:', incident);
//     console.log('Incident fields for categories:', {
//       inc_sec_sub_sub_category_id: incident.inc_sec_sub_sub_category_id,
//       inc_sec_sub_sub_sub_category_id: incident.inc_sec_sub_sub_sub_category_id,
//       inc_sub_sub_sub_category_id: incident.inc_sub_sub_sub_category_id,
//       sub_sub_sub_category_name: incident.sub_sub_sub_category_name,
//       sec_sub_sub_sub_category_name: incident.sec_sub_sub_sub_category_name
//     });

//     // Helper function to validate if a value exists in options
//     const getValidOptionValue = (value: any, options: any[]) => {
//       if (!value) return '';
//       const stringValue = value.toString();
//       const exists = options.some(option => option.id.toString() === stringValue);
//       return exists ? stringValue : '';
//     };

//     // Helper function to find ID by name when ID is missing
//     const getIdByName = (name: any, options: any[]) => {
//       if (!name || typeof name !== 'string') return '';
//       const found = options.find(option => {
//         if (!option.name || typeof option.name !== 'string') return false;
//         return option.name.toLowerCase() === name.toLowerCase();
//       });
//       return found ? found.id.toString() : '';
//     };

//     // Parse the incident time
//     const incTime = new Date(incident.inc_time);

//     // Create the updated form data
//     const updatedFormData = {
//       year: incTime.getFullYear().toString(),
//       month: incTime.toLocaleString('default', { month: 'long' }),
//       day: incTime.getDate().toString(),
//       hour: incTime.getHours().toString(),
//       minute: incTime.getMinutes().toString(),
//       incidentDate: incident.inc_time,
//       incidentTime: incident.inc_time,
//       location: incident.building_name || '',
//       building: getValidOptionValue(incident.building_id, buildings),
//       categoryForIncident: getValidOptionValue(incident.inc_category_id, categories),
//       primaryCategory: getValidOptionValue(incident.inc_sub_category_id, subCategories),
//       subCategory: getValidOptionValue(incident.inc_sub_sub_category_id, subSubCategories),
//       subSubCategory: getValidOptionValue(incident.inc_sub_sub_sub_category_id, subSubSubCategories) ||
//         getIdByName(incident.sub_sub_sub_category_name || '', subSubSubCategories),
//       secondaryCategory: getValidOptionValue(incident.inc_sec_category_id, secondaryCategories),
//       secondarySubCategory: getValidOptionValue(incident.inc_sec_sub_category_id, secondarySubCategories),
//       secondarySubSubCategory: getValidOptionValue(incident.inc_sec_sub_sub_category_id, secondarySubSubCategories),
//       secondarySubSubSubCategory: getValidOptionValue(incident.inc_sec_sub_sub_sub_category_id, secondarySubSubSubCategories) ||
//         getIdByName(incident.sec_sub_sub_sub_category_name || '', secondarySubSubSubCategories),
//       severity: severityOptions.length > 0 ? getValidOptionValue(incident.severity, severityOptions) : incident.severity || '',
//       probability: probabilityOptions.length > 0 ? getValidOptionValue(incident.probability, probabilityOptions) : incident.probability?.toString() || '',
//       incidentLevel: getValidOptionValue(incident.inc_level_id, incidentLevels),
//       description: incident.description || '',
//       propertyDamageHappened: incident.property_damage === 'true' || String(incident.property_damage) === 'true' ? 'true' :
//         incident.property_damage === 'false' || String(incident.property_damage) === 'false' ? 'false' :
//           incident.property_damage === null ? '' : String(incident.property_damage || ''),
//       propertyDamageCategory: getValidOptionValue(incident.property_damage_id, propertyDamageCategories) ||
//         getIdByName(incident.property_damage_category_name || '', propertyDamageCategories),
//       damageCoveredInsurance: incident.damage_covered_insurance === 'true' || String(incident.damage_covered_insurance) === 'true' ? 'true' :
//         incident.damage_covered_insurance === 'false' || String(incident.damage_covered_insurance) === 'false' ? 'false' :
//           incident.damage_covered_insurance === null ? '' : String(incident.damage_covered_insurance || ''),
//       damagedRecovered: incident.damaged_recovered || '',
//       insuredBy: incident.insured_by || '',
//       primaryRootCauseCategory:
//         // Prefer rca_category.id from API response if available
//         incident.rca_category?.id
//           ? getValidOptionValue(incident.rca_category.id, rcaCategories)
//           : getValidOptionValue(incident.rca_category_id, rcaCategories) ||
//           getIdByName(incident.rca_category?.name || incident.rca_category || '', rcaCategories),
//       rca: incident.rca || '',
//       correctiveAction: incident.corrective_action || '',
//       preventiveAction: incident.preventive_action || '',
//       incidentType: 'accident',
//       reportedBy: incident.created_by || '',
//       witnessName: '',
//       injuryOccurred: 'no',
//       propertyDamage: 'no',
//       immediateAction: '',
//       rootCause: incident.rca || '',
//       preventiveMeasures: incident.preventive_action || '',
//       status: incident.current_status || '',
//       assignedTo: incident.assigned_to_user_name || '',
//       priority: 'medium',
//       witnesses: incident.incident_witnesses && incident.incident_witnesses.length > 0
//         ? incident.incident_witnesses.map((w) => ({ name: w.name || '', mobile: w.mobile || '', id: w.id, }))
//         : [{ name: '', mobile: '' }],
//       equipmentPropertyDamagedCost: incident.equipment_property_damaged_cost?.toString() || '',
//       productionLoss: incident.production_loss?.toString() || '',
//       treatmentCost: incident.treatment_cost?.toString() || '',
//       absenteeismCost: incident.absenteeism_cost?.toString() || '',
//       otherCost: incident.other_cost?.toString() || '',
//       totalCost: incident.total_cost?.toString() || '0.00',
//       firstAidProvided: incident.first_aid_provided === 'Yes',
//       firstAidAttendants: incident.incident_detail?.name_first_aid_attendants || '',
//       medicalTreatment: incident.sent_for_medical_treatment === 'Yes',
//       treatmentFacility: incident.incident_detail?.name_and_address_treatment_facility || '',
//       attendingPhysician: incident.incident_detail?.name_and_address_attending_physician || '',
//       incidentDetailId: incident.incident_detail?.id || null,
//       investigationTeam: incident.incident_investigations && incident.incident_investigations.length > 0
//         ? incident.incident_investigations.map((inv) => ({
//           name: inv.name || '',

//           mobile: inv.mobile || '',
//           designation: inv.designation || '',
//           id: inv.id || null
//         }))
//         : [{ name: '', mobile: '', designation: '', id: null }],
//       supportRequired: Boolean(incident.support_required),
//       factsCorrect: Boolean(incident.disclaimer),
//       attachments: null
//     };

//     // Handle existing attachments
//     if (incident.attachments && incident.attachments.length > 0) {
//       setExistingAttachments(incident.attachments);
//       console.log('Loaded existing attachments:', incident.attachments);
//     }

//     console.log('Available options for validation:', {
//       buildings: buildings.length,
//       categories: categories.length,
//       subCategories: subCategories.length,
//       subSubCategories: subSubCategories.length,
//       subSubSubCategories: subSubSubCategories.length,
//       secondaryCategories: secondaryCategories.length,
//       secondarySubCategories: secondarySubCategories.length,
//       secondarySubSubCategories: secondarySubSubCategories.length,
//       secondarySubSubSubCategories: secondarySubSubSubCategories.length,
//       incidentLevels: incidentLevels.length,
//       severityOptions: severityOptions.length,
//       probabilityOptions: probabilityOptions.length,
//       propertyDamageCategories: propertyDamageCategories.length,
//       rcaCategories: rcaCategories.length
//     });

//     console.log('Detailed category options:', {
//       subSubSubCategories: subSubSubCategories,
//       secondarySubSubCategories: secondarySubSubCategories,
//       secondarySubSubSubCategories: secondarySubSubSubCategories
//     });

//     console.log('Setting form data with:', updatedFormData);
//     setFormData(updatedFormData);
//     setFormKey(prev => prev + 1); // Force re-render
//     console.log('Form data set successfully');
//   }; const handleInputChange = (field: string, value: string | boolean | any[]) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   // Delete witness by id (set _destroy true and show toast)
//   const handleDeleteWitness = (id: number | null) => {
//     setFormData(prev => ({
//       ...prev,
//       witnesses: prev.witnesses.map(w =>
//         w.id === id ? { ...w, _destroy: true } : w
//       )
//     }));
//     toast.success('Witness deleted');
//   };

//   // Delete investigation team member by id (set _destroy true and show toast)
//   const handleDeleteInvestigationMember = (id: number | null) => {
//     setFormData(prev => ({
//       ...prev,
//       investigationTeam: prev.investigationTeam.map(m =>
//         m.id === id ? { ...m, _destroy: true } : m
//       )
//     }));
//     toast.success('Investigation team member deleted');
//   };

//   // Field styles for Material-UI components
//   const fieldStyles = {
//     height: {
//       xs: 28,
//       sm: 36,
//       md: 45
//     },
//     '& .MuiInputBase-input, & .MuiSelect-select': {
//       padding: {
//         xs: '8px',
//         sm: '10px',
//         md: '12px'
//       }
//     }
//   };

//   console.log(formData)

//   const validateForm = () => {
//     if (!formData.building) {
//       toast.error('Please select a Building');
//       return false;
//     }
//     if (!formData.primaryCategory) {
//       toast.error('Please select a Primary Category');
//       return false;
//     }
//     if (!formData.subCategory) {
//       toast.error('Please select a Sub Category');
//       return false;
//     }
//     if (!formData.subSubCategory) {
//       toast.error('Please select a Sub-Sub Category');
//       return false;
//     }

//     return true;
//   }

//   const handleUpdateDetails = async () => {
//     if (!validateForm()) return;

//     try {
//       setSaving(true);
//       setError(null);

//       // Prepare the form data with new attachments
//       const updatedFormData = {
//         ...formData,
//         newAttachments: newAttachments, // Pass all new attachments
//         attachments: null // Clear this to avoid duplication
//       };

//       console.log('Updating incident with attachments:', {
//         existingAttachments: existingAttachments.length,
//         newAttachments: newAttachments.length
//       });

//       const updatedIncident = await incidentService.updateIncident(id!, updatedFormData);
//       console.log('Incident updated successfully:', updatedIncident);

//       // Show success message
//       toast.success('Incident updated successfully!');

//       // Navigate back to the details page
//       navigate(`${basePath}/incident/${id}`);
//     } catch (err) {
//       setError('Failed to update incident details');
//       console.error('Error updating incident:', err);
//       toast.error('Failed to update incident. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     navigate(`${basePath}/incident/${id}`);
//   };


//   return (
//     <div className="p-6 bg-white min-h-screen">
//       {/* Header */}
//       <div className="mb-6">
//         <nav className="flex items-center text-sm text-gray-600 mb-4">
//           <span>{isSafetyContext ? 'Safety' : 'Maintenance'}</span>
//           <span className="mx-2">{'>'}</span>
//           <span>Incident</span>
//           <span className="mx-2">{'>'}</span>
//           <span>Edit Incident</span>
//         </nav>
//         <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT INCIDENT DETAILS</h1>
//             <p className="text-gray-600">Incident #{id}</p>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6" key={formKey}>
//         {/* Basic Information */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//             <CardTitle className="flex items-center gap-3 text-lg">
//               <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                 <Info className="h-4 w-4" />
//               </div>
//               <span className="text-[#1A1A1A] font-semibold uppercase">BASIC INFORMATION</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 bg-white space-y-4">
//             {/* Time & Date Section */}
//             <div className="mb-6">
//               <h3 className="text-sm font-medium mb-3">Time & Date <span style={{ color: '#C72030' }}>*</span></h3>
//               <div className="grid grid-cols-5 gap-2">
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel shrink>Year</InputLabel>
//                   <MuiSelect
//                     label="Year"
//                     value={formData.year}
//                     onChange={e => handleInputChange('year', e.target.value)}
//                     sx={fieldStyles}
//                   >
//                     {Array.from({ length: new Date().getFullYear() + 50 - 2010 + 1 }, (_, i) => {
//                       const year = new Date().getFullYear() + 50 - i; // From current year + 50 down to 2010
//                       return (
//                         <MenuItem key={year} value={String(year)}>
//                           {year}
//                         </MenuItem>
//                       );
//                     })}
//                   </MuiSelect>
//                 </FormControl>

//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel shrink>Month</InputLabel>
//                   <MuiSelect
//                     label="Month"
//                     value={formData.month}
//                     onChange={e => handleInputChange('month', e.target.value)}
//                     sx={fieldStyles}
//                   >
//                     <MenuItem value="January">January</MenuItem>
//                     <MenuItem value="February">February</MenuItem>
//                     <MenuItem value="March">March</MenuItem>
//                     <MenuItem value="April">April</MenuItem>
//                     <MenuItem value="May">May</MenuItem>
//                     <MenuItem value="June">June</MenuItem>
//                     <MenuItem value="July">July</MenuItem>
//                     <MenuItem value="August">August</MenuItem>
//                     <MenuItem value="September">September</MenuItem>
//                     <MenuItem value="October">October</MenuItem>
//                     <MenuItem value="November">November</MenuItem>
//                     <MenuItem value="December">December</MenuItem>
//                   </MuiSelect>
//                 </FormControl>

//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel shrink>Day</InputLabel>
//                   <MuiSelect
//                     label="Day"
//                     value={formData.day}
//                     onChange={e => handleInputChange('day', e.target.value)}
//                     sx={fieldStyles}
//                   >
//                     {Array.from({ length: 31 }, (_, i) => (
//                       <MenuItem key={i + 1} value={String(i + 1)}>{i + 1}</MenuItem>
//                     ))}
//                   </MuiSelect>
//                 </FormControl>

//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel shrink>Hour</InputLabel>
//                   <MuiSelect
//                     label="Hour"
//                     value={formData.hour}
//                     onChange={e => handleInputChange('hour', e.target.value)}
//                     sx={fieldStyles}
//                   >
//                     {Array.from({ length: 24 }, (_, i) => (
//                       <MenuItem key={i} value={String(i)}>{i}</MenuItem>
//                     ))}
//                   </MuiSelect>
//                 </FormControl>

//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel shrink>Minute</InputLabel>
//                   <MuiSelect
//                     label="Minute"
//                     value={formData.minute}
//                     onChange={e => handleInputChange('minute', e.target.value)}
//                     sx={fieldStyles}
//                   >
//                     {Array.from({ length: 60 }, (_, i) => (
//                       <MenuItem key={i} value={String(i)}>{i}</MenuItem>
//                     ))}
//                   </MuiSelect>
//                 </FormControl>
//               </div>
//             </div>

//             {/* Building and Categories Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//               {/* Building Dropdown */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Building <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Building *"
//                   value={formData.building}
//                   onChange={e => handleInputChange('building', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Building</em></MenuItem>
//                   {buildings.map((building) => (
//                     <MenuItem key={building.id} value={building.id.toString()}>
//                       {building.name}
//                     </MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* PRIMARY CATEGORY HIERARCHY */}
//               {/* Level 1: Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Primary Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Primary Category *"
//                   value={formData.categoryForIncident}
//                   onChange={e => handleInputChange('categoryForIncident', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Primary Category</em></MenuItem>
//                   {categories.map((category) => (
//                     <MenuItem key={category.id} value={category.id.toString()}>
//                       {category.name}
//                     </MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* Level 2: Sub Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.categoryForIncident}>
//                 <InputLabel shrink>Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Sub Category"
//                   value={formData.primaryCategory}
//                   onChange={e => handleInputChange('primaryCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Sub Category</em></MenuItem>
//                   {subCategories
//                     .filter(subCat => subCat.parent_id === parseInt(formData.categoryForIncident))
//                     .map((subCategory) => (
//                       <MenuItem key={subCategory.id} value={subCategory.id.toString()}>
//                         {subCategory.name}
//                       </MenuItem>
//                     ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* Level 3: Sub Sub Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.primaryCategory}>
//                 <InputLabel shrink>Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Sub Sub Category"
//                   value={formData.subCategory}
//                   onChange={e => handleInputChange('subCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Sub Sub Category</em></MenuItem>
//                   {subSubCategories
//                     .filter(subSubCat => subSubCat.parent_id === parseInt(formData.primaryCategory))
//                     .map((subSubCategory) => (
//                       <MenuItem key={subSubCategory.id} value={subSubCategory.id.toString()}>
//                         {subSubCategory.name}
//                       </MenuItem>
//                     ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* Level 4: Sub Sub Sub Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.subCategory}>
//                 <InputLabel shrink>Sub Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Sub Sub Sub Category"
//                   value={formData.subSubCategory}
//                   onChange={e => handleInputChange('subSubCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Sub Sub Sub Category</em></MenuItem>
//                   {subSubSubCategories
//                     .filter(subSubSubCat => subSubSubCat.parent_id === parseInt(formData.subCategory))
//                     .map((subSubSubCategory) => (
//                       <MenuItem key={subSubSubCategory.id} value={subSubSubCategory.id.toString()}>
//                         {subSubSubCategory.name}
//                       </MenuItem>
//                     ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* SECONDARY CATEGORY HIERARCHY */}
//               {/* Level 1: Secondary Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Secondary Category</InputLabel>
//                 <MuiSelect
//                   label="Secondary Category"
//                   value={formData.secondaryCategory}
//                   onChange={e => handleInputChange('secondaryCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Secondary Category</em></MenuItem>
//                   {secondaryCategories.map((category) => (
//                     <MenuItem key={category.id} value={category.id.toString()}>
//                       {category.name}
//                     </MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* Level 2: Secondary Sub Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.secondaryCategory}>
//                 <InputLabel shrink>Secondary Sub Category</InputLabel>
//                 <MuiSelect
//                   label="Secondary Sub Category"
//                   value={formData.secondarySubCategory}
//                   onChange={e => handleInputChange('secondarySubCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Secondary Sub Category</em></MenuItem>
//                   {secondarySubCategories
//                     .filter(subCat => subCat.parent_id === parseInt(formData.secondaryCategory))
//                     .map((subCategory) => (
//                       <MenuItem key={subCategory.id} value={subCategory.id.toString()}>
//                         {subCategory.name}
//                       </MenuItem>
//                     ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* Level 3: Secondary Sub Sub Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.secondarySubCategory}>
//                 <InputLabel shrink>Secondary Sub Sub Category</InputLabel>
//                 <MuiSelect
//                   label="Secondary Sub Sub Category"
//                   value={formData.secondarySubSubCategory}
//                   onChange={e => handleInputChange('secondarySubSubCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Secondary Sub Sub Category</em></MenuItem>
//                   {secondarySubSubCategories
//                     .filter(subSubCat => subSubCat.parent_id === parseInt(formData.secondarySubCategory))
//                     .map((subSubCategory) => (
//                       <MenuItem key={subSubCategory.id} value={subSubCategory.id.toString()}>
//                         {subSubCategory.name}
//                       </MenuItem>
//                     ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* Level 4: Secondary Sub Sub Sub Category */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.secondarySubSubCategory}>
//                 <InputLabel shrink>Secondary Sub Sub Sub Category</InputLabel>
//                 <MuiSelect
//                   label="Secondary Sub Sub Sub Category"
//                   value={formData.secondarySubSubSubCategory}
//                   onChange={e => handleInputChange('secondarySubSubSubCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Secondary Sub Sub Sub Category</em></MenuItem>
//                   {secondarySubSubSubCategories
//                     .filter(subSubSubCat => subSubSubCat.parent_id === parseInt(formData.secondarySubSubCategory))
//                     .map((subSubSubCategory) => (
//                       <MenuItem key={subSubSubCategory.id} value={subSubSubCategory.id.toString()}>
//                         {subSubSubCategory.name}
//                       </MenuItem>
//                     ))}
//                 </MuiSelect>
//               </FormControl>

//               {/* <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Severity <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Severity *"
//                   value={formData.severity}
//                   onChange={e => handleInputChange('severity', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Severity</em></MenuItem>
//                   {severityOptions.length > 0 ? (
//                     severityOptions.map((severity) => (
//                       <MenuItem key={severity.id} value={severity.id.toString()}>
//                         {severity.name}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <>
//                       <MenuItem value="1">Insignificant</MenuItem>
//                       <MenuItem value="2">Minor</MenuItem>
//                       <MenuItem value="3">Moderate</MenuItem>
//                       <MenuItem value="4">Major</MenuItem>
//                       <MenuItem value="5">Catastrophic</MenuItem>
//                     </>
//                   )}
//                 </MuiSelect>
//               </FormControl> */}
//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Severity <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Severity *"
//                   value={formData.severity}
//                   onChange={e => handleInputChange('severity', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 // MenuProps={menuProps}
//                 >
//                   <MenuItem value=""><em>Select Severity</em></MenuItem>
//                   <MenuItem value="1">Insignificant</MenuItem>
//                   <MenuItem value="2">Minor</MenuItem>
//                   <MenuItem value="3">Moderate</MenuItem>
//                   <MenuItem value="4">Major</MenuItem>
//                   <MenuItem value="5">Catastrophic</MenuItem>
//                 </MuiSelect>
//               </FormControl>

//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Probability <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Probability *"
//                   value={formData.probability}
//                   onChange={e => handleInputChange('probability', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select Probability</em></MenuItem>
//                   {probabilityOptions.length > 0 ? (
//                     probabilityOptions.map((probability) => (
//                       <MenuItem key={probability.id} value={probability.id.toString()}>
//                         {probability.name}
//                       </MenuItem>
//                     ))
//                   ) : (
//                     <>
//                       <MenuItem value="1">Rare</MenuItem>
//                       <MenuItem value="2">Possible</MenuItem>
//                       <MenuItem value="3">Likely</MenuItem>
//                       <MenuItem value="4">Often</MenuItem>
//                       <MenuItem value="5">Frequent/ Almost certain</MenuItem>
//                     </>
//                   )}
//                 </MuiSelect>
//               </FormControl>

//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Incident level <span style={{ color: '#C72030' }}>*</span></InputLabel>
//                 <MuiSelect
//                   label="Incident level *"
//                   value={formData.incidentLevel}
//                   onChange={e => handleInputChange('incidentLevel', e.target.value)}
//                   displayEmpty
//                   disabled={!!(formData.severity && formData.probability)}
//                   sx={{
//                     ...fieldStyles,
//                     '& .MuiInputBase-input.Mui-disabled': {
//                       WebkitTextFillColor: '#000',
//                       backgroundColor: '#f5f5f5'
//                     }
//                   }}
//                 >
//                   <MenuItem value=""><em>Select Level</em></MenuItem>
//                   {incidentLevels.map((level) => (
//                     <MenuItem key={level.id} value={level.id.toString()}>
//                       {level.name}
//                     </MenuItem>
//                   ))}
//                 </MuiSelect>
//                 {formData.severity && formData.probability && (
//                   <div className="text-xs text-gray-600 mt-1">
//                     Auto-calculated based on severity and probability
//                   </div>
//                 )}
//               </FormControl>
//             </div>

//             {/* Description */}
//             <div className="mt-6">
//               <TextField
//                 label={<span>Description <span style={{ color: '#C72030' }}>*</span></span>}
//                 value={formData.description}
//                 onChange={e => handleInputChange('description', e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={4}
//                 InputLabelProps={{
//                   shrink: true
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     height: "auto !important",
//                     padding: "2px !important",
//                     display: "flex",
//                   },
//                   "& .MuiInputBase-input[aria-hidden='true']": {
//                     flex: 0,
//                     width: 0,
//                     height: 0,
//                     padding: "0 !important",

//                     margin: 0,
//                     display: "none",
//                   },
//                   "& .MuiInputBase-input": {
//                     resize: "none !important",
//                   },
//                 }}
//               />
//             </div>


//           </CardContent>
//         </Card>

//         {/* Damage Block */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//             <CardTitle className="flex items-center gap-3 text-lg">
//               <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                 <AlertTriangle className="h-4 w-4" />
//               </div>
//               <span className="text-[#1A1A1A] font-semibold uppercase">DAMAGE</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
//             {/* Damage Fields Grid */}
//             {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
//                 <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                   Has Any Property Damage Happened In The Incident? <span className="text-red-500">*</span>
//                 </legend>
//                 <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
//                   <MuiSelect
//                     value={formData.propertyDamageHappened || ''}
//                     onChange={e => handleInputChange('propertyDamageHappened', e.target.value)}
//                     displayEmpty
//                     sx={{
//                       height: {
//                         xs: 28,
//                         sm: 36,
//                         md: 45
//                       },
//                       '& .MuiInputBase-input, & .MuiSelect-select': {
//                         padding: {
//                           xs: '8px',
//                           sm: '10px',
//                           md: '12px'
//                         }
//                       },
//                       '& .MuiOutlinedInput-notchedOutline': {
//                         border: 'none'
//                       }
//                     }}
//                   >
//                     <MenuItem value="">select</MenuItem>
//                     <MenuItem value="false">No</MenuItem>
//                     <MenuItem value="true">Yes</MenuItem>
//                   </MuiSelect>
//                 </FormControl>
//               </fieldset>

//               {formData.propertyDamageHappened === 'true' && (
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Property Damage Category
//                   </legend>
//                   <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
//                     <MuiSelect
//                       value={formData.propertyDamageCategory || ''}
//                       onChange={e => handleInputChange('propertyDamageCategory', e.target.value)}
//                       displayEmpty
//                       sx={{
//                         height: {
//                           xs: 28,
//                           sm: 36,
//                           md: 45
//                         },
//                         '& .MuiInputBase-input, & .MuiSelect-select': {
//                           padding: {
//                             xs: '8px',
//                             sm: '10px',
//                             md: '12px'
//                           }
//                         },
//                         '& .MuiOutlinedInput-notchedOutline': {
//                           border: 'none'
//                         }
//                       }}
//                     >
//                       <MenuItem value="">Select</MenuItem>
//                       {propertyDamageCategories.map((category) => (
//                         <MenuItem key={category.id} value={category.id}>
//                           {category.name}
//                         </MenuItem>
//                       ))}
//                     </MuiSelect>
//                   </FormControl>
//                 </fieldset>
//               )}

//               {formData.propertyDamageHappened === 'true' && (
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Damage covered under insurance
//                   </legend>
//                   <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
//                     <MuiSelect
//                       value={formData.damageCoveredInsurance || ''}
//                       onChange={e => handleInputChange('damageCoveredInsurance', e.target.value)}
//                       displayEmpty
//                       sx={{
//                         height: {
//                           xs: 28,
//                           sm: 36,
//                           md: 45
//                         },
//                         '& .MuiInputBase-input, & .MuiSelect-select': {
//                           padding: {
//                             xs: '8px',
//                             sm: '10px',
//                             md: '12px'
//                           }
//                         },
//                         '& .MuiOutlinedInput-notchedOutline': {
//                           border: 'none'
//                         }
//                       }}
//                     >
//                       <MenuItem value="">select</MenuItem>
//                       <MenuItem value="false">No</MenuItem>
//                       <MenuItem value="true">Yes</MenuItem>
//                     </MuiSelect>
//                   </FormControl>
//                 </fieldset>
//               )}

//               {formData.damageCoveredInsurance === 'true' && (
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Insured by
//                   </legend>
//                   <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
//                     <MuiSelect
//                       value={formData.insuredBy || ''}
//                       onChange={e => handleInputChange('insuredBy', e.target.value)}
//                       displayEmpty
//                       sx={{
//                         height: {
//                           xs: 28,
//                           sm: 36,
//                           md: 45
//                         },
//                         '& .MuiInputBase-input, & .MuiSelect-select': {
//                           padding: {
//                             xs: '8px',
//                             sm: '10px',
//                             md: '12px'
//                           }
//                         },
//                         '& .MuiOutlinedInput-notchedOutline': {
//                           border: 'none'
//                         }
//                       }}
//                     >
//                       <MenuItem value="">select</MenuItem>
//                       <MenuItem value="Building insurance">Building insurance</MenuItem>
//                       <MenuItem value="Private/ individual insurance">Private/ individual insurance</MenuItem>
//                       <MenuItem value="Others">Others</MenuItem>
//                     </MuiSelect>
//                   </FormControl>
//                 </fieldset>
//               )}

//               {formData.damageCoveredInsurance === 'true' && (
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Damaged Recovered
//                   </legend>
//                   <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
//                     <MuiSelect
//                       value={formData.damagedRecovered || ''}
//                       onChange={e => handleInputChange('damagedRecovered', e.target.value)}
//                       displayEmpty
//                       sx={{
//                         height: {
//                           xs: 28,
//                           sm: 36,
//                           md: 45
//                         },
//                         '& .MuiInputBase-input, & .MuiSelect-select': {
//                           padding: {
//                             xs: '8px',
//                             sm: '10px',
//                             md: '12px'
//                           }
//                         },
//                         '& .MuiOutlinedInput-notchedOutline': {
//                           border: 'none'
//                         }
//                       }}
//                     >
//                       <MenuItem value="">Select</MenuItem>
//                       <MenuItem value="Yes, from the insurance agency">Yes, from the insurance agency</MenuItem>
//                       <MenuItem value="No">No</MenuItem>
//                       <MenuItem value="Partially recovered">Partially recovered</MenuItem>
//                     </MuiSelect>
//                   </FormControl>
//                 </fieldset>
//               )}

//               <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
//                 <InputLabel shrink>Primary root cause category</InputLabel>
//                 <MuiSelect
//                   label="Primary root cause category"
//                   value={formData.primaryRootCauseCategory || ''}
//                   onChange={e => handleInputChange('primaryRootCauseCategory', e.target.value)}
//                   displayEmpty
//                   sx={fieldStyles}
//                 >
//                   <MenuItem value=""><em>Select</em></MenuItem>
//                   {rcaCategories.map((category) => (
//                     <MenuItem key={category.id} value={category.id}>
//                       {category.name}
//                     </MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>
//             </div> */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Property Damage Happened */}
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel id="property-damage-happened-label">
//                   Has Any Property Damage Happened In The Incident?
//                 </InputLabel>
//                 <MuiSelect
//                   labelId="property-damage-happened-label"
//                   label="Has Any Property Damage Happened In The Incident?"
//                   value={formData.propertyDamageHappened || ''}
//                   onChange={e => handleInputChange('propertyDamageHappened', e.target.value)}
//                   displayEmpty
//                 >
//                   <MenuItem value=""><em>Select</em></MenuItem>
//                   <MenuItem value="false">No</MenuItem>
//                   <MenuItem value="true">Yes</MenuItem>
//                 </MuiSelect>
//               </FormControl>

//               {/* Property Damage Category */}
//               {formData.propertyDamageHappened === 'true' && (
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel id="property-damage-category-label">Property Damage Category</InputLabel>
//                   <MuiSelect
//                     labelId="property-damage-category-label"
//                     label="Property Damage Category"
//                     value={formData.propertyDamageCategory || ''}
//                     onChange={e => handleInputChange('propertyDamageCategory', e.target.value)}
//                     displayEmpty
//                   >
//                     <MenuItem value=""><em>Select</em></MenuItem>
//                     {propertyDamageCategories.map(category => (
//                       <MenuItem key={category.id} value={category.id}>
//                         {category.name}
//                       </MenuItem>
//                     ))}
//                   </MuiSelect>
//                 </FormControl>
//               )}

//               {/* Damage Covered Under Insurance */}
//               {formData.propertyDamageHappened === 'true' && (
//                 <FormControl fullWidth variant="outlined">
//                   <InputLabel id="damage-covered-insurance-label">Damage Covered Insurance</InputLabel>
//                   <MuiSelect
//                     labelId="damage-covered-insurance-label"
//                     label="Damage Covered Insurance"
//                     value={formData.damageCoveredInsurance || ''}
//                     onChange={e => handleInputChange('damageCoveredInsurance', e.target.value)}
//                     displayEmpty
//                   >
//                     <MenuItem value=""><em>Select</em></MenuItem>
//                     <MenuItem value="false">No</MenuItem>
//                     <MenuItem value="true">Yes</MenuItem>
//                   </MuiSelect>
//                 </FormControl>
//               )}

//               {/* Primary Root Cause Category (already correct) */}
//               <FormControl fullWidth variant="outlined">
//                 <InputLabel id="primary-root-cause-label">Primary root cause category</InputLabel>
//                 <MuiSelect
//                   labelId="primary-root-cause-label"
//                   label="Primary root cause category"
//                   value={formData.primaryRootCauseCategory || ''}
//                   onChange={e => handleInputChange('primaryRootCauseCategory', e.target.value)}
//                   displayEmpty
//                 >
//                   <MenuItem value=""><em>Select</em></MenuItem>
//                   {rcaCategories.map(category => (
//                     <MenuItem key={category.id} value={category.id}>
//                       {category.name}
//                     </MenuItem>
//                   ))}
//                 </MuiSelect>
//               </FormControl>
//             </div>



//             {/* Text Area Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
//               {/* RCA */}
//               <div>
//                 <TextField
//                   label={<span>Root Cause Analysis (RCA) <span style={{ color: '#C72030' }}>*</span></span>}
//                   value={formData.rca || ''}
//                   onChange={e => handleInputChange('rca', e.target.value)}
//                   fullWidth
//                   variant="outlined"
//                   multiline
//                   rows={3}
//                   InputLabelProps={{
//                     shrink: true
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: "auto !important",
//                       padding: "2px !important",
//                       display: "flex",
//                     },
//                     "& .MuiInputBase-input[aria-hidden='true']": {
//                       flex: 0,
//                       width: 0,
//                       height: 0,
//                       padding: "0 !important",
//                       margin: 0,
//                       display: "none",
//                     },
//                     "& .MuiInputBase-input": {
//                       resize: "none !important",
//                     },
//                   }}
//                 />
//               </div>

//               {/* Preventive action */}
//               <div>
//                 <TextField
//                   label={<span>Preventive Action <span style={{ color: '#C72030' }}>*</span></span>}
//                   value={formData.preventiveAction || ''}
//                   onChange={e => handleInputChange('preventiveAction', e.target.value)}
//                   fullWidth
//                   variant="outlined"
//                   multiline
//                   rows={3}
//                   InputLabelProps={{
//                     shrink: true
//                   }}
//                   sx={{
//                     "& .MuiOutlinedInput-root": {
//                       height: "auto !important",
//                       padding: "2px !important",
//                       display: "flex",
//                     },
//                     "& .MuiInputBase-input[aria-hidden='true']": {
//                       flex: 0,
//                       width: 0,
//                       height: 0,
//                       padding: "0 !important",
//                       margin: 0,
//                       display: "none",
//                     },
//                     "& .MuiInputBase-input": {
//                       resize: "none !important",
//                     },
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Corrective action - Full Width */}
//             <div className="mt-6">
//               <TextField
//                 label={<span>Corrective Action <span style={{ color: '#C72030' }}>*</span></span>}
//                 value={formData.correctiveAction || ''}
//                 onChange={e => handleInputChange('correctiveAction', e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 multiline
//                 rows={3}
//                 InputLabelProps={{
//                   shrink: true
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     height: "auto !important",
//                     padding: "2px !important",
//                     display: "flex",
//                   },
//                   "& .MuiInputBase-input[aria-hidden='true']": {
//                     flex: 0,
//                     width: 0,
//                     height: 0,
//                     padding: "0 !important",
//                     margin: 0,
//                     display: "none",
//                   },
//                   "& .MuiInputBase-input": {
//                     resize: "none !important",
//                   },
//                 }}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Add Witnesses Details */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//             <CardTitle className="flex items-center gap-3 text-lg">
//               <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                 <Users className="h-4 w-4" />
//               </div>
//               <span className="text-[#1A1A1A] font-semibold uppercase">ADD WITNESSES DETAILS</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
//             {formData.witnesses && formData.witnesses.filter(w => !w._destroy).map((witness, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Name <span style={{ color: '#C72030' }}>*</span>
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     placeholder="Enter Name"
//                     value={witness.name}
//                     onChange={(e) => {
//                       const newWitnesses = [...formData.witnesses];
//                       newWitnesses[index].name = e.target.value;
//                       handleInputChange('witnesses', newWitnesses);
//                     }}
//                   />
//                 </fieldset>

//                 {/* <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Mobile
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     placeholder="Enter Mobile"
//                     value={witness.mobile}
//                     onChange={(e) => {
//                       const newWitnesses = [...formData.witnesses];
//                       newWitnesses[index].mobile = e.target.value;
//                       handleInputChange('witnesses', newWitnesses);
//                     }}
//                   />
//                 </fieldset> */}
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Mobile <span style={{ color: '#C72030' }}>*</span>
//                   </legend>
//                   <input
//                     type="text"
//                     maxLength={10}
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     placeholder="Enter Mobile"
//                     value={witness.mobile}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
//                       const newWitnesses = [...formData.witnesses];
//                       newWitnesses[index].mobile = value.slice(0, 10); // Ensure max 10 digits
//                       handleInputChange('witnesses', newWitnesses);
//                     }}
//                   />
//                 </fieldset>


//                 <div className="flex justify-center items-center">
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteWitness(witness.id)}
//                     className="text-red-600 hover:text-red-800 p-2"
//                   >
//                     <Trash className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <div className="mt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   const newWitnesses = [...(formData.witnesses || []), { name: '', mobile: '', id: null, _destroy: false }];
//                   handleInputChange('witnesses', newWitnesses);
//                 }}
//                 className="bg-purple-600 text-white hover:bg-purple-700"
//               >
//                 + Add More
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Cost of Incident - Show only when property damage happened */}
//         {/* {formData.propertyDamageHappened === 'true' && (
//           <Card className="mb-6 border border-[#D9D9D9]">
//             <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//               <CardTitle className="flex items-center gap-3 text-lg">
//                 <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                   <Settings className="h-4 w-4" />
//                 </div>
//                 <span className="text-[#1A1A1A] font-semibold uppercase">COST OF INCIDENT</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Equipment/Property Damaged Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.equipmentPropertyDamagedCost}
//                     onChange={(e) => handleInputChange('equipmentPropertyDamagedCost', e.target.value)}
//                   />
//                 </fieldset>


//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Production Loss
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.productionLoss}
//                     onChange={(e) => handleInputChange('productionLoss', e.target.value)}
//                   />
//                 </fieldset>


//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Treatment Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.treatmentCost}
//                     onChange={(e) => handleInputChange('treatmentCost', e.target.value)}
//                   />
//                 </fieldset>


//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Absenteeism Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.absenteeismCost}
//                     onChange={(e) => handleInputChange('absenteeismCost', e.target.value)}
//                   />
//                 </fieldset>


//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Other Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.otherCost}
//                     onChange={(e) => handleInputChange('otherCost', e.target.value)}
//                   />
//                 </fieldset>


//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Total Cost
//                   </legend>
//                   <div className="text-sm font-medium text-gray-900">
//                     {formData.totalCost}
//                   </div>
//                 </fieldset>
//               </div>
//             </CardContent>
//           </Card>
//         )} */}
//         {formData.propertyDamageHappened === 'true' && (
//           <Card className="mb-6 border border-[#D9D9D9]">
//             <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//               <CardTitle className="flex items-center gap-3 text-lg">
//                 <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                   <Settings className="h-4 w-4" />
//                 </div>
//                 <span className="text-[#1A1A1A] font-semibold uppercase">COST OF INCIDENT</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 {/* Equipment/Property Damaged Cost */}
//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Equipment/Property Damaged Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.equipmentPropertyDamagedCost}
//                     onChange={(e) =>
//                       handleInputChange('equipmentPropertyDamagedCost', e.target.value.replace(/\D/g, ''))
//                     }
//                   />
//                 </fieldset>

//                 {/* Production Loss */}
//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Production Loss
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.productionLoss}
//                     onChange={(e) =>
//                       handleInputChange('productionLoss', e.target.value.replace(/\D/g, ''))
//                     }
//                   />
//                 </fieldset>

//                 {/* Treatment Cost */}
//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Treatment Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.treatmentCost}
//                     onChange={(e) =>
//                       handleInputChange('treatmentCost', e.target.value.replace(/\D/g, ''))
//                     }
//                   />
//                 </fieldset>

//                 {/* Absenteeism Cost */}
//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Absenteeism Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.absenteeismCost}
//                     onChange={(e) =>
//                       handleInputChange('absenteeismCost', e.target.value.replace(/\D/g, ''))
//                     }
//                   />
//                 </fieldset>

//                 {/* Other Cost */}
//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Other Cost
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     type="text"
//                     value={formData.otherCost}
//                     onChange={(e) =>
//                       handleInputChange('otherCost', e.target.value.replace(/\D/g, ''))
//                     }
//                   />
//                 </fieldset>

//                 {/* Total Cost */}
//                 <fieldset className="border border-gray-300 rounded p-3">
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Total Cost
//                   </legend>
//                   <div className="text-sm font-medium text-gray-900">
//                     {formData.totalCost}
//                   </div>
//                 </fieldset>
//               </div>
//             </CardContent>
//           </Card>
//         )}


//         {/* First Aid Provided */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//             <CardTitle className="flex items-center gap-3 text-lg">
//               <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                 <Heart className="h-4 w-4" />
//               </div>
//               <span className="text-[#1A1A1A] font-semibold uppercase">FIRST AID PROVIDED</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
//             <div className="flex items-center space-x-3">
//               <input
//                 type="checkbox"
//                 id="firstAidProvided"
//                 checked={formData.firstAidProvided}
//                 onChange={(e) => handleInputChange('firstAidProvided', e.target.checked)}
//                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="firstAidProvided" className="text-sm font-medium text-gray-700">
//                 Was First Aid provided by Employees?
//               </label>
//             </div>

//             {formData.firstAidProvided && (
//               <div className="mt-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm text-gray-600">Name of First Aid Attendants</Label>
//                   <Input
//                     value={formData.firstAidAttendants}
//                     onChange={(e) => handleInputChange('firstAidAttendants', e.target.value)}
//                     placeholder="Enter names of first aid attendants"
//                     className="bg-white"
//                   />
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Medical Treatment */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//             <CardTitle className="flex items-center gap-3 text-lg">
//               <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                 <Stethoscope className="h-4 w-4" />
//               </div>
//               <span className="text-[#1A1A1A] font-semibold uppercase">MEDICAL TREATMENT</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
//             <div className="flex items-center space-x-3">
//               <input
//                 type="checkbox"
//                 id="medicalTreatment"
//                 checked={formData.medicalTreatment}
//                 onChange={(e) => handleInputChange('medicalTreatment', e.target.checked)}
//                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//               />
//               <label htmlFor="medicalTreatment" className="text-sm font-medium text-gray-700">
//                 Sent for Medical Treatment
//               </label>
//             </div>

//             {formData.medicalTreatment && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm text-gray-600">Name and Address of Treatment Facility</Label>
//                   <Input
//                     value={formData.treatmentFacility}
//                     onChange={(e) => handleInputChange('treatmentFacility', e.target.value)}
//                     placeholder="Enter treatment facility details"
//                     className="bg-white"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm text-gray-600">Name and Address of Attending Physician</Label>
//                   <Input
//                     value={formData.attendingPhysician}
//                     onChange={(e) => handleInputChange('attendingPhysician', e.target.value)}
//                     placeholder="Enter physician details"
//                     className="bg-white"
//                   />
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Add Investigation Team Details */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//             <CardTitle className="flex items-center gap-3 text-lg">
//               <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                 <UserSearch className="h-4 w-4" />
//               </div>
//               <span className="text-[#1A1A1A] font-semibold uppercase">ADD INVESTIGATION TEAM DETAILS</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
//             {formData.investigationTeam && formData.investigationTeam.filter(member => !member._destroy).map((member, index) => (
//               <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Name
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     placeholder="Enter Name"
//                     value={member.name}
//                     onChange={(e) => {
//                       const newTeam = [...formData.investigationTeam];
//                       newTeam[index].name = e.target.value;
//                       handleInputChange('investigationTeam', newTeam);
//                     }}
//                   />
//                 </fieldset>

//                 {/* <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Mobile
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     placeholder="Enter Mobile"
//                     value={member.mobile}
//                     onChange={(e) => {
//                       const newTeam = [...formData.investigationTeam];
//                       newTeam[index].mobile = e.target.value;
//                       handleInputChange('investigationTeam', newTeam);
//                     }}
//                   />
//                 </fieldset> */}
//                 <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Mobile
//                   </legend>
//                   <input
//                     type="text"
//                     maxLength={10}
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     placeholder="Enter Mobile"
//                     value={member.mobile}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
//                       const newTeam = [...formData.investigationTeam];
//                       newTeam[index].mobile = value.slice(0, 10); // Max 10 digits
//                       handleInputChange('investigationTeam', newTeam);
//                     }}
//                   />
//                 </fieldset>


//                 <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
//                   <legend className="float-none px-2 text-sm font-medium text-gray-700">
//                     Designation
//                   </legend>
//                   <input
//                     className="w-full p-0 border-0 bg-transparent outline-none text-sm"
//                     placeholder="Enter Designation"
//                     value={member.designation}
//                     onChange={(e) => {
//                       const newTeam = [...formData.investigationTeam];
//                       newTeam[index].designation = e.target.value;
//                       handleInputChange('investigationTeam', newTeam);
//                     }}
//                   />
//                 </fieldset>

//                 <div className="flex justify-center items-center">
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteInvestigationMember(member.id)}
//                     className="text-red-600 hover:text-red-800 p-2"
//                   >
//                     <Trash className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <div className="mt-4">
//               <Button
//                 variant="outline"
//                 onClick={() => {
//                   const newTeam = [...(formData.investigationTeam || []), { name: '', mobile: '', designation: '' }];
//                   handleInputChange('investigationTeam', newTeam);
//                 }}
//                 className="bg-purple-600 text-white hover:bg-purple-700"
//               >
//                 + Add More
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Support and Disclaimer */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardContent className="p-6">
//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-medium mb-3">Support</h3>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={formData.supportRequired}
//                       onChange={(e) => handleInputChange('supportRequired', e.target.checked)}
//                       sx={{
//                         color: '#C72030',
//                         '&.Mui-checked': {
//                           color: '#C72030',
//                         },
//                       }}
//                     />
//                   }
//                   label="Support required"
//                 />
//               </div>

//               <div>
//                 <h3 className="text-lg font-medium mb-3">Disclaimer</h3>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={formData.factsCorrect}
//                       onChange={(e) => handleInputChange('factsCorrect', e.target.checked)}
//                       sx={{
//                         color: '#C72030',
//                         '&.Mui-checked': {
//                           color: '#C72030',
//                         },
//                       }}
//                     />
//                   }
//                   label="I have correctly stated all the facts related to the incident."
//                 />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Attachments */}
//         <Card className="mb-6 border border-[#D9D9D9]">
//           <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
//             <CardTitle className="flex items-center gap-3 text-lg">
//               <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
//                 <Paperclip className="h-4 w-4" />
//               </div>
//               <span className="text-[#1A1A1A] font-semibold uppercase">
//                 ATTACHMENTS - {existingAttachments.length + newAttachments.length}
//               </span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6 bg-[#F6F7F7]">
//             <div className="space-y-6">
//               {/* Existing Attachments */}
//               {existingAttachments.length > 0 && (
//                 <div>
//                   <h4 className="text-sm font-medium mb-3 text-gray-700">Current Attachments</h4>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {existingAttachments.map((attachment, index) => (
//                       <div key={attachment.id} className="bg-white border rounded p-3">
//                         <div className="mb-2">
//                           <span className="text-sm text-gray-600 truncate">
//                             {attachment.doctype || 'File'}
//                           </span>
//                         </div>

//                         {/* Image Preview - using same logic as IncidentDetailsPage */}
//                         {attachment.doctype?.startsWith('image/') && (
//                           <img
//                             src={attachment.url}
//                             alt="Attachment"
//                             className="mt-2 w-full h-32 object-cover rounded"
//                           />
//                         )}

//                         <div className="flex gap-2 mt-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => window.open(attachment.url, '_blank')}
//                             className="flex-1 text-xs"
//                           >
//                             View
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* New Attachments Upload */}
//               <div>
//                 <h4 className="text-sm font-medium mb-3 text-gray-700">Add New Attachments</h4>
//                 <div>
//                   <input
//                     type="file"
//                     onChange={(e) => {
//                       if (e.target.files) {
//                         const files = Array.from(e.target.files);
//                         setNewAttachments(prev => [...prev, ...files]);
//                         // Don't call handleInputChange with file object
//                       }
//                     }}
//                     className="hidden"
//                     id="file-upload"
//                     accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
//                     multiple
//                   />
//                   <label
//                     htmlFor="file-upload"
//                     className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 bg-white"
//                   >
//                     Choose Files
//                   </label>
//                   <span className="ml-4 text-sm text-gray-500">
//                     {newAttachments.length > 0 ? `${newAttachments.length} file(s) selected` : 'No new files chosen'}
//                   </span>
//                 </div>

//                 {/* Preview New Attachments */}
//                 {newAttachments.length > 0 && (
//                   <div className="mt-4">
//                     <h5 className="text-xs font-medium mb-2 text-gray-600">New Files to Upload:</h5>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//                       {newAttachments.map((file, index) => (
//                         <div key={index} className="bg-white border rounded p-3">
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-sm text-gray-600 truncate" title={file.name}>
//                               {file.type || 'File'}
//                             </span>
//                             <button
//                               type="button"
//                               onClick={() => {
//                                 setNewAttachments(prev => prev.filter((_, i) => i !== index));
//                               }}
//                               className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
//                             >
//                               Remove
//                             </button>
//                           </div>

//                           {/* Preview for images - matching IncidentDetailsPage logic */}
//                           {file.type.startsWith('image/') && (
//                             <img
//                               src={URL.createObjectURL(file)}
//                               alt={file.name}
//                               className="mt-2 w-full h-32 object-cover rounded"
//                             />
//                           )}

//                           <div className="mt-2 text-xs text-gray-400">
//                             {file.name} • {(file.size / 1024).toFixed(1)} KB
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="mt-4">
//                   <Button
//                     style={{
//                       backgroundColor: '#C72030'
//                     }}
//                     className="text-white hover:opacity-90"
//                     onClick={() => document.getElementById('file-upload')?.click()}
//                   >
//                     Choose Files...
//                   </Button>
//                 </div>
//               </div>

//               {/* No attachments message */}
//               {existingAttachments.length === 0 && newAttachments.length === 0 && (
//                 <p className="text-gray-600">No attachments available.</p>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Submit Buttons */}
//         <div className="flex gap-3 pt-6">
//           <Button
//             variant="outline"
//             onClick={handleCancel}
//             disabled={saving}
//             className="px-8"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleUpdateDetails}
//             disabled={saving}
//             style={{ backgroundColor: saving ? '#9CA3AF' : '#C72030' }}
//             className="text-white hover:opacity-90 px-8"
//           >
//             {saving ? (
//               <>
//                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                 Updating...
//               </>
//             ) : (
//               'Update Details'
//             )}
//           </Button>
//         </div>

//         {error && (
//           <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
//             <p className="text-red-600 text-sm">{error}</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };












import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Info, FileText, Users, Settings, AlertTriangle, Search, Loader2, Paperclip, Heart, Stethoscope, UserSearch, Trash } from 'lucide-react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { incidentService, type Incident } from '@/services/incidentService';
import { toast } from 'sonner';

export const EditIncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incident, setIncident] = useState<Incident | null>(null);

  // Determine if we're in Safety or Maintenance context
  const isSafetyContext = location.pathname.startsWith('/safety');
  const basePath = isSafetyContext ? '/safety' : '/maintenance';

  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    incidentDate: '',
    incidentTime: '',
    location: '',
    building: '',
    primaryCategory: '',
    subCategory: '',
    subSubCategory: '',
    subSubSubCategory: '',
    secondaryCategory: '',
    secondarySubCategory: '',
    secondarySubSubCategory: '',
    secondarySubSubSubCategory: '',
    severity: '',
    probability: '',
    incidentLevel: '',
    description: '',
    propertyDamageHappened: '',
    propertyDamageCategory: '',
    damageCoveredInsurance: '',
    damagedRecovered: '',
    insuredBy: '',
    primaryRootCauseCategory: '',
    rca: '',
    correctiveAction: '',
    preventiveAction: '',
    witnesses: [
      { name: '', mobile: '', id: null, _destroy: false }
    ],
    equipmentPropertyDamagedCost: '',
    productionLoss: '',
    treatmentCost: '',
    absenteeismCost: '',
    otherCost: '',
    totalCost: '0.00',
    firstAidProvided: false,
    firstAidAttendants: '',
    medicalTreatment: false,
    treatmentFacility: '',
    attendingPhysician: '',
    investigationTeam: [
      { name: '', mobile: '', designation: '', id: null, _destroy: false }
    ],
    supportRequired: false,
    factsCorrect: false,
    attachments: null,
    incidentDetailId: null
  });

  const [formKey, setFormKey] = useState(0);

  // State for buildings and categories (same as AddIncidentPage)
  const [buildings, setBuildings] = useState<{ id: number; name: string }[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
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
  // Severity and Probability options (if available from API)
  const [severityOptions, setSeverityOptions] = useState<{ id: number; name: string }[]>([]);
  const [probabilityOptions, setProbabilityOptions] = useState<{ id: number; name: string }[]>([]);
  // Attachments state
  const [existingAttachments, setExistingAttachments] = useState<any[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  // Property Damage Category and RCA Category states
  const [propertyDamageCategories, setPropertyDamageCategories] = useState<{ id: number; name: string }[]>([]);
  const [rcaCategories, setRcaCategories] = useState<{ id: number; name: string }[]>([]);

  // Debug form data changes
  useEffect(() => {
    console.log('Form data state updated:', formData);
  }, [formData]);

  // Calculate total cost whenever individual cost fields change
  useEffect(() => {
    const calculateTotalCost = () => {
      const equipmentCost = parseFloat(formData.equipmentPropertyDamagedCost) || 0;
      const production = parseFloat(formData.productionLoss) || 0;
      const treatment = parseFloat(formData.treatmentCost) || 0;
      const absenteeism = parseFloat(formData.absenteeismCost) || 0;
      const other = parseFloat(formData.otherCost) || 0;

      const total = equipmentCost + production + treatment + absenteeism + other;
      setFormData(prev => ({ ...prev, totalCost: total.toFixed(2) }));
    };

    calculateTotalCost();
  }, [formData.equipmentPropertyDamagedCost, formData.productionLoss, formData.treatmentCost, formData.absenteeismCost, formData.otherCost]);

  // Clear property damage related fields when "No" is selected
  useEffect(() => {
    if (formData.propertyDamageHappened === 'false') {
      setFormData(prev => ({
        ...prev,
        propertyDamageCategory: '',
        damageCoveredInsurance: '',
        damagedRecovered: '',
        insuredBy: '',
        equipmentPropertyDamagedCost: '',
        productionLoss: '',
        treatmentCost: '',
        absenteeismCost: '',
        otherCost: '',
        totalCost: '0.00'
      }));
    }
  }, [formData.propertyDamageHappened]);

  // Clear insured by field when damage is not covered under insurance
  useEffect(() => {
    if (formData.damageCoveredInsurance === 'false') {
      setFormData(prev => ({
        ...prev,
        damagedRecovered: '',
        insuredBy: ''
      }));
    }
  }, [formData.damageCoveredInsurance]);

  // Helper to calculate and set incident level based on risk score (same as AddIncidentPage)
  const calculateAndSetIncidentLevel = (severity: string, probability: string) => {
    const sev = parseInt(severity);
    const prob = parseInt(probability);
    if (!sev || !prob) {
      setFormData(prev => ({ ...prev, incidentLevel: '' }));
      return;
    }
    const riskScore = sev * prob;
    let riskLevelText = '';

    // Determine risk level text based on score
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
    setFormData(prev => ({
      ...prev,
      incidentLevel: levelId
    }));
  };

  // Recalculate incident level whenever severity or probability changes
  useEffect(() => {
    if (formData.severity && formData.probability && incidentLevels.length > 0) {
      calculateAndSetIncidentLevel(formData.severity, formData.probability);
    }
  }, [formData.severity, formData.probability, incidentLevels]);

  // Fetch all tags and buildings on mount (same as AddIncidentPage)
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
          // Update to use pms_buildings array as per API response structure
          const buildingsArray = Array.isArray(result.pms_buildings) ? result.pms_buildings : [];
          setBuildings(buildingsArray.map((b: any) => ({ id: b.id, name: b.name })));
          console.log('Loaded buildings:', buildingsArray.length);
        } else {
          setBuildings([]);
        }
      } catch (error) {
        console.error('Error fetching buildings:', error);
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
          console.log('Loaded incident levels:', levels.length);
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
          console.log('Loaded tag data:', data.length, 'items');

          // Primary hierarchy
          const allCategories = data.filter((item: any) => item.tag_type === 'IncidenceCategory' && item.parent_id === null);
          setCategories(allCategories.map((item: any) => ({ id: item.id, name: item.name })));
          console.log('Loaded categories:', allCategories.length);

          const allSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubCategory');
          setSubCategories(allSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          console.log('Loaded sub categories:', allSubCategories.length);

          const allSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubCategory');
          setSubSubCategories(allSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          console.log('Loaded sub sub categories:', allSubSubCategories.length);

          const allSubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSubSubSubCategory');
          setSubSubSubCategories(allSubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          console.log('Loaded sub sub sub categories:', allSubSubSubCategories.length);
          // Secondary hierarchy
          const allSecondaryCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondaryCategory' && item.parent_id === null);
          setSecondaryCategories(allSecondaryCategories.map((item: any) => ({ id: item.id, name: item.name })));
          console.log('Loaded secondary categories:', allSecondaryCategories.length);

          const allSecondarySubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubCategory');
          setSecondarySubCategories(allSecondarySubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          console.log('Loaded secondary sub categories:', allSecondarySubCategories.length);

          const allSecondarySubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubCategory');
          setSecondarySubSubCategories(allSecondarySubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          console.log('Loaded secondary sub sub categories:', allSecondarySubSubCategories.length);

          const allSecondarySubSubSubCategories = data.filter((item: any) => item.tag_type === 'IncidenceSecondarySubSubSubCategory');
          setSecondarySubSubSubCategories(allSecondarySubSubSubCategories.map((item: any) => ({ id: item.id, name: item.name, parent_id: item.parent_id })));
          console.log('Loaded secondary sub sub sub categories:', allSecondarySubSubSubCategories.length);

          // Try to fetch severity and probability options if available from API
          const allSeverityOptions = data.filter((item: any) => item.tag_type === 'Severity' || item.tag_type === 'IncidenceSeverity');
          if (allSeverityOptions.length > 0) {
            setSeverityOptions(allSeverityOptions.map((item: any) => ({ id: item.id, name: item.name })));
            console.log('Loaded severity options from API:', allSeverityOptions.length);
          } else {
            console.log('No severity options found in API, using fallback');
          }

          const allProbabilityOptions = data.filter((item: any) => item.tag_type === 'Probability' || item.tag_type === 'IncidenceProbability');
          if (allProbabilityOptions.length > 0) {
            setProbabilityOptions(allProbabilityOptions.map((item: any) => ({ id: item.id, name: item.name })));
            console.log('Loaded probability options from API:', allProbabilityOptions.length);
          } else {
            console.log('No probability options found in API, using fallback');
          }

          // Fetch Property Damage Categories
          const allPropertyDamageCategories = data.filter((item: any) => item.tag_type === 'PropertyDamageCategory');
          setPropertyDamageCategories(allPropertyDamageCategories.map((item: any) => ({ id: item.id, name: item.name })));
          console.log('Loaded property damage categories:', allPropertyDamageCategories.length);

          // Fetch RCA Categories
          const allRcaCategories = data.filter((item: any) => item.tag_type === 'RCACategory');
          setRcaCategories(allRcaCategories.map((item: any) => ({ id: item.id, name: item.name })));
          console.log('Loaded RCA categories:', allRcaCategories.length);
        }
      } catch { }

      // Mark data as loaded
      setDataLoaded(true);
    };
    fetchAll();
  }, []);

  // Fetch incident details after API data is loaded and buildings are available
  useEffect(() => {
    if (id && dataLoaded && buildings.length > 0) {
      fetchIncidentDetails();
    }
  }, [id, dataLoaded, buildings.length]);

  const fetchIncidentDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching incident details for ID:', id);
      const incidentData = await incidentService.getIncidentById(id!);
      console.log('Received incident data:', JSON.stringify(incidentData, null, 2));

      if (incidentData) {
        setIncident(incidentData);
        populateFormData(incidentData);
      } else {
        setError('Incident not found');
      }
    } catch (err) {
      setError('Failed to fetch incident details');
      console.error('Error fetching incident:', err);
    } finally {
      setLoading(false);
    }
  };

  const populateFormData = (incident: Incident) => {
    console.log('Populating form data with incident:', incident);
    console.log('Incident fields for categories:', {
      inc_sec_sub_sub_category_id: incident.inc_sec_sub_sub_category_id,
      inc_sec_sub_sub_sub_category_id: incident.inc_sec_sub_sub_sub_category_id,
      inc_sub_sub_sub_category_id: incident.inc_sub_sub_sub_category_id,
      sub_sub_sub_category_name: incident.sub_sub_sub_category_name,
      sec_sub_sub_sub_category_name: incident.sec_sub_sub_sub_category_name
    });

    // Helper function to validate if a value exists in options
    const getValidOptionValue = (value: any, options: any[]) => {
      if (!value) return '';
      const stringValue = value.toString();
      const exists = options.some(option => option.id.toString() === stringValue);
      return exists ? stringValue : '';
    };

    // Helper function to find ID by name when ID is missing
    const getIdByName = (name: any, options: any[]) => {
      if (!name || typeof name !== 'string') return '';
      const found = options.find(option => {
        if (!option.name || typeof option.name !== 'string') return false;
        return option.name.toLowerCase() === name.toLowerCase();
      });
      return found ? found.id.toString() : '';
    };

    // Parse the incident time
    const incTime = new Date(incident.inc_time);

    // Create the updated form data
    const updatedFormData = {
      year: incTime.getFullYear().toString(),
      month: incTime.toLocaleString('default', { month: 'long' }),
      day: incTime.getDate().toString(),
      hour: incTime.getHours().toString(),
      minute: incTime.getMinutes().toString(),
      incidentDate: incident.inc_time,
      incidentTime: incident.inc_time,
      location: incident.building_name || '',
      building: getValidOptionValue(incident.building_id, buildings),
      primaryCategory: getValidOptionValue(incident.inc_category_id, categories),
      subCategory: getValidOptionValue(incident.inc_sub_category_id, subCategories),
      subSubCategory: getValidOptionValue(incident.inc_sub_sub_category_id, subSubCategories),
      subSubSubCategory: getValidOptionValue(incident.inc_sub_sub_sub_category_id, subSubSubCategories) ||
        getIdByName(incident.sub_sub_sub_category_name || '', subSubSubCategories),
      secondaryCategory: getValidOptionValue(incident.inc_sec_category_id, secondaryCategories),
      secondarySubCategory: getValidOptionValue(incident.inc_sec_sub_category_id, secondarySubCategories),
      secondarySubSubCategory: getValidOptionValue(incident.inc_sec_sub_sub_category_id, secondarySubSubCategories),
      secondarySubSubSubCategory: getValidOptionValue(incident.inc_sec_sub_sub_sub_category_id, secondarySubSubSubCategories) ||
        getIdByName(incident.sec_sub_sub_sub_category_name || '', secondarySubSubSubCategories),
      severity: severityOptions.length > 0 ? getValidOptionValue(incident.severity, severityOptions) : incident.severity || '',
      probability: probabilityOptions.length > 0 ? getValidOptionValue(incident.probability, probabilityOptions) : incident.probability?.toString() || '',
      incidentLevel: getValidOptionValue(incident.inc_level_id, incidentLevels),
      description: incident.description || '',
      propertyDamageHappened: incident.property_damage === 'true' || String(incident.property_damage) === 'true' ? 'true' :
        incident.property_damage === 'false' || String(incident.property_damage) === 'false' ? 'false' :
          incident.property_damage === null ? '' : String(incident.property_damage || ''),
      propertyDamageCategory: getValidOptionValue(incident.property_damage_id, propertyDamageCategories) ||
        getIdByName(incident.property_damage_category_name || '', propertyDamageCategories),
      damageCoveredInsurance: incident.damage_covered_insurance === 'true' || String(incident.damage_covered_insurance) === 'true' ? 'true' :
        incident.damage_covered_insurance === 'false' || String(incident.damage_covered_insurance) === 'false' ? 'false' :
          incident.damage_covered_insurance === null ? '' : String(incident.damage_covered_insurance || ''),
      damagedRecovered: incident.damaged_recovered || '',
      insuredBy: incident.insured_by || '',
      primaryRootCauseCategory:
        // Prefer rca_category.id from API response if available
        incident.rca_category?.id
          ? getValidOptionValue(incident.rca_category.id, rcaCategories)
          : getValidOptionValue(incident.rca_category_id, rcaCategories) ||
          getIdByName(incident.rca_category?.name || incident.rca_category || '', rcaCategories),
      rca: incident.rca || '',
      correctiveAction: incident.corrective_action || '',
      preventiveAction: incident.preventive_action || '',
      witnesses: incident.incident_witnesses && incident.incident_witnesses.length > 0
        ? incident.incident_witnesses.map((w) => ({ name: w.name || '', mobile: w.mobile || '', id: w.id, _destroy: false }))
        : [{ name: '', mobile: '', id: null, _destroy: false }],
      equipmentPropertyDamagedCost: incident.equipment_property_damaged_cost?.toString() || '',
      productionLoss: incident.production_loss?.toString() || '',
      treatmentCost: incident.treatment_cost?.toString() || '',
      absenteeismCost: incident.absenteeism_cost?.toString() || '',
      otherCost: incident.other_cost?.toString() || '',
      totalCost: incident.total_cost?.toString() || '0.00',
      firstAidProvided: incident.first_aid_provided === 'Yes',
      firstAidAttendants: incident.incident_detail?.name_first_aid_attendants || '',
      medicalTreatment: incident.sent_for_medical_treatment === 'Yes',
      treatmentFacility: incident.incident_detail?.name_and_address_treatment_facility || '',
      attendingPhysician: incident.incident_detail?.name_and_address_attending_physician || '',
      incidentDetailId: incident.incident_detail?.id || null,
      investigationTeam: incident.incident_investigations && incident.incident_investigations.length > 0
        ? incident.incident_investigations.map((inv) => ({
          name: inv.name || '',
          mobile: inv.mobile || '',
          designation: inv.designation || '',
          id: inv.id || null,
          _destroy: false
        }))
        : [{ name: '', mobile: '', designation: '', id: null, _destroy: false }],
      supportRequired: Boolean(incident.support_required),
      factsCorrect: Boolean(incident.disclaimer),
      attachments: null
    };

    // Handle existing attachments
    if (incident.attachments && incident.attachments.length > 0) {
      setExistingAttachments(incident.attachments);
      console.log('Loaded existing attachments:', incident.attachments);
    }

    console.log('Available options for validation:', {
      buildings: buildings.length,
      categories: categories.length,
      subCategories: subCategories.length,
      subSubCategories: subSubCategories.length,
      subSubSubCategories: subSubSubCategories.length,
      secondaryCategories: secondaryCategories.length,
      secondarySubCategories: secondarySubCategories.length,
      secondarySubSubCategories: secondarySubSubCategories.length,
      secondarySubSubSubCategories: secondarySubSubSubCategories.length,
      incidentLevels: incidentLevels.length,
      severityOptions: severityOptions.length,
      probabilityOptions: probabilityOptions.length,
      propertyDamageCategories: propertyDamageCategories.length,
      rcaCategories: rcaCategories.length
    });

    console.log('Detailed category options:', {
      subSubSubCategories: subSubSubCategories,
      secondarySubSubCategories: secondarySubSubCategories,
      secondarySubSubSubCategories: secondarySubSubSubCategories
    });

    console.log('Setting form data with:', updatedFormData);
    setFormData(updatedFormData);
    setFormKey(prev => prev + 1); // Force re-render
    console.log('Form data set successfully');
  }; const handleInputChange = (field: string, value: string | boolean | any[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Delete witness by id (set _destroy true and show toast)
  const handleDeleteWitness = (id: number | null) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.map(w =>
        w.id === id ? { ...w, _destroy: true } : w
      )
    }));
    toast.success('Witness deleted');
  };

  // Delete investigation team member by id (set _destroy true and show toast)
  const handleDeleteInvestigationMember = (id: number | null) => {
    setFormData(prev => ({
      ...prev,
      investigationTeam: prev.investigationTeam.map(m =>
        m.id === id ? { ...m, _destroy: true } : m
      )
    }));
    toast.success('Investigation team member deleted');
  };

  // Field styles for Material-UI components
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
    }
  };

  console.log(formData)

  const validateForm = () => {
    if (!formData.building) {
      toast.error('Please select a Building');
      return false;
    }
    if (!formData.primaryCategory) {
      toast.error('Please select a Primary Category');
      return false;
    }
    if (!formData.subCategory) {
      toast.error('Please select a Sub Category');
      return false;
    }
    if (!formData.subSubCategory) {
      toast.error('Please select a Sub-Sub Category');
      return false;
    }
    if (!formData.subSubSubCategory) {
      toast.error('Please select a Sub-Sub-Sub Category');
      return false;
    }

    if (!formData.severity) {
      toast.error('Please select Severity');
      return false;
    }
    // if (!formData.probability) {
    //   toast.error('Please select Probability');
    //   return false;
    // }
    if (!formData.incidentLevel) {
      toast.error('Incident Level could not be determined. Please select it manually.');
      return false;
    }
    if (!formData.description || formData.description.trim().length < 10) {
      toast.error('Please provide a detailed Description (at least 10 characters)');
      return false;
    }
    if (!formData.rca) {
      toast.error('Please provide Root Cause Analysis (RCA)');
      return false;
    }
    if (!formData.preventiveAction) {
      toast.error('Please provide Preventive Action');
      return false;
    }
    if (!formData.correctiveAction) {
      toast.error('Please provide Corrective Action');
      return false;
    }
    for (const witness of formData.witnesses) {
      if (!witness.name) {
        toast.error("Witness name is required for all witnesses")
        return false;
      }
      if (!witness.mobile) {
        toast.error("Witness number is required for all witnesses")
        return false;
      }
    }
    if (!formData.supportRequired) {
      toast.error("Please select support checkbox")
      return false;
    }
    if (!formData.factsCorrect) {
      toast.error("Please select the desclaimer")
      return false;
    }
    return true;
  }

  const handleUpdateDetails = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);

      // Prepare the form data with new attachments
      const updatedFormData = {
        ...formData,
        newAttachments: newAttachments, // Pass all new attachments
        attachments: null // Clear this to avoid duplication
      };

      console.log('Updating incident with attachments:', {
        existingAttachments: existingAttachments.length,
        newAttachments: newAttachments.length
      });

      const updatedIncident = await incidentService.updateIncident(id!, updatedFormData);
      console.log('Incident updated successfully:', updatedIncident);

      // Show success message
      toast.success('Incident updated successfully!');

      // Navigate back to the details page
      navigate(`${basePath}/incident/${id}`);
    } catch (err) {
      setError('Failed to update incident details');
      console.error('Error updating incident:', err);
      toast.error('Failed to update incident. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`${basePath}/incident/${id}`);
  };


  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>{isSafetyContext ? 'Safety' : 'Maintenance'}</span>
          <span className="mx-2">{'>'}</span>
          <span>Incident</span>
          <span className="mx-2">{'>'}</span>
          <span>Edit Incident</span>
        </nav>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT INCIDENT DETAILS</h1>
            <p className="text-gray-600">Incident #{id}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6" key={formKey}>
        {/* Basic Information */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <Info className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">BASIC INFORMATION</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white space-y-4">
            {/* Time & Date Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Time & Date <span style={{ color: '#C72030' }}>*</span></h3>
              <div className="grid grid-cols-5 gap-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Year</InputLabel>
                  <MuiSelect
                    label="Year"
                    value={formData.year}
                    onChange={e => handleInputChange('year', e.target.value)}
                    sx={fieldStyles}
                    disabled
                  >
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
                  <InputLabel shrink>Month</InputLabel>
                  <MuiSelect
                    label="Month"
                    value={formData.month}
                    onChange={e => handleInputChange('month', e.target.value)}
                    sx={fieldStyles}
                    disabled
                  >
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
                  <InputLabel shrink>Day</InputLabel>
                  <MuiSelect
                    label="Day"
                    value={formData.day}
                    onChange={e => handleInputChange('day', e.target.value)}
                    sx={fieldStyles}
                    disabled
                  >
                    {Array.from({ length: 31 }, (_, i) => (
                      <MenuItem key={i + 1} value={String(i + 1)}>{i + 1}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Hour</InputLabel>
                  <MuiSelect
                    label="Hour"
                    value={formData.hour}
                    onChange={e => handleInputChange('hour', e.target.value)}
                    sx={fieldStyles}
                    disabled
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <MenuItem key={i} value={String(i)}>{i}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Minute</InputLabel>
                  <MuiSelect
                    label="Minute"
                    value={formData.minute}
                    onChange={e => handleInputChange('minute', e.target.value)}
                    sx={fieldStyles}
                    disabled
                  >
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
                  value={formData.building}
                  onChange={e => handleInputChange('building', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  {buildings.map((building) => (
                    <MenuItem key={building.id} value={building.id.toString()}>
                      {building.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* PRIMARY CATEGORY HIERARCHY */}
              {/* Level 1: Primary Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Primary Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Primary Category *"
                  value={formData.primaryCategory}
                  onChange={e => handleInputChange('primaryCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Primary Category</em></MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Level 2: Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.primaryCategory}>
                <InputLabel shrink>Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Sub Category"
                  value={formData.subCategory}
                  onChange={e => handleInputChange('subCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                  {subCategories
                    .filter(subCat => subCat.parent_id === parseInt(formData.primaryCategory || '0'))
                    .map((subCategory) => (
                      <MenuItem key={subCategory.id} value={subCategory.id.toString()}>
                        {subCategory.name}
                      </MenuItem>
                    ))}
                </MuiSelect>
              </FormControl>

              {/* Level 3: Sub Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.subCategory}>
                <InputLabel shrink>Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Sub Sub Category"
                  value={formData.subSubCategory}
                  onChange={e => handleInputChange('subSubCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Sub Category</em></MenuItem>
                  {subSubCategories
                    .filter(subSubCat => subSubCat.parent_id === parseInt(formData.subCategory || '0'))
                    .map((subSubCategory) => (
                      <MenuItem key={subSubCategory.id} value={subSubCategory.id.toString()}>
                        {subSubCategory.name}
                      </MenuItem>
                    ))}
                </MuiSelect>
              </FormControl>

              {/* Level 4: Sub Sub Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.subSubCategory}>
                <InputLabel shrink>Sub Sub Sub Category <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Sub Sub Sub Category"
                  value={formData.subSubSubCategory}
                  onChange={e => handleInputChange('subSubSubCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Sub Sub Category</em></MenuItem>
                  {subSubSubCategories
                    .filter(subSubSubCat => subSubSubCat.parent_id === parseInt(formData.subSubCategory || '0'))
                    .map((subSubSubCategory) => (
                      <MenuItem key={subSubSubCategory.id} value={subSubSubCategory.id.toString()}>
                        {subSubSubCategory.name}
                      </MenuItem>
                    ))}
                </MuiSelect>
              </FormControl>

              {/* SECONDARY CATEGORY HIERARCHY */}
              {/* Level 1: Secondary Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Secondary Category</InputLabel>
                <MuiSelect
                  label="Secondary Category"
                  value={formData.secondaryCategory}
                  onChange={e => handleInputChange('secondaryCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Secondary Category</em></MenuItem>
                  {secondaryCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>

              {/* Level 2: Secondary Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.secondaryCategory}>
                <InputLabel shrink>Secondary Sub Category</InputLabel>
                <MuiSelect
                  label="Secondary Sub Category"
                  value={formData.secondarySubCategory}
                  onChange={e => handleInputChange('secondarySubCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Secondary Sub Category</em></MenuItem>
                  {secondarySubCategories
                    .filter(subCat => subCat.parent_id === parseInt(formData.secondaryCategory || '0'))
                    .map((subCategory) => (
                      <MenuItem key={subCategory.id} value={subCategory.id.toString()}>
                        {subCategory.name}
                      </MenuItem>
                    ))}
                </MuiSelect>
              </FormControl>

              {/* Level 3: Secondary Sub Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.secondarySubCategory}>
                <InputLabel shrink>Secondary Sub Sub Category</InputLabel>
                <MuiSelect
                  label="Secondary Sub Sub Category"
                  value={formData.secondarySubSubCategory}
                  onChange={e => handleInputChange('secondarySubSubCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Secondary Sub Sub Category</em></MenuItem>
                  {secondarySubSubCategories
                    .filter(subSubCat => subSubCat.parent_id === parseInt(formData.secondarySubCategory || '0'))
                    .map((subSubCategory) => (
                      <MenuItem key={subSubCategory.id} value={subSubCategory.id.toString()}>
                        {subSubCategory.name}
                      </MenuItem>
                    ))}
                </MuiSelect>
              </FormControl>

              {/* Level 4: Secondary Sub Sub Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.secondarySubSubCategory}>
                <InputLabel shrink>Secondary Sub Sub Sub Category</InputLabel>
                <MuiSelect
                  label="Secondary Sub Sub Sub Category"
                  value={formData.secondarySubSubSubCategory}
                  onChange={e => handleInputChange('secondarySubSubSubCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Secondary Sub Sub Sub Category</em></MenuItem>
                  {secondarySubSubSubCategories
                    .filter(subSubSubCat => subSubSubCat.parent_id === parseInt(formData.secondarySubSubCategory || '0'))
                    .map((subSubSubCategory) => (
                      <MenuItem key={subSubSubCategory.id} value={subSubSubCategory.id.toString()}>
                        {subSubSubCategory.name}
                      </MenuItem>
                    ))}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Severity <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Severity *"
                  value={formData.severity}
                  onChange={e => handleInputChange('severity', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
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
                  value={formData.probability}
                  onChange={e => handleInputChange('probability', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Probability</em></MenuItem>
                  {probabilityOptions.length > 0 ? (
                    probabilityOptions.map((probability) => (
                      <MenuItem key={probability.id} value={probability.id.toString()}>
                        {probability.name}
                      </MenuItem>
                    ))
                  ) : (
                    <>
                      <MenuItem value="1">Rare</MenuItem>
                      <MenuItem value="2">Possible</MenuItem>
                      <MenuItem value="3">Likely</MenuItem>
                      <MenuItem value="4">Often</MenuItem>
                      <MenuItem value="5">Frequent/ Almost certain</MenuItem>
                    </>
                  )}
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Incident level <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Incident level *"
                  value={formData.incidentLevel}
                  onChange={e => handleInputChange('incidentLevel', e.target.value)}
                  displayEmpty
                  disabled={!!(formData.severity && formData.probability)}
                  sx={{
                    ...fieldStyles,
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000',
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <MenuItem value=""><em>Select Level</em></MenuItem>
                  {incidentLevels.map((level) => (
                    <MenuItem key={level.id} value={level.id.toString()}>
                      {level.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
                {formData.severity && formData.probability && (
                  <div className="text-xs text-gray-600 mt-1">
                    Auto-calculated based on severity and probability
                  </div>
                )}
              </FormControl>
            </div>

            {/* Description */}
            <div className="mt-6">
              <TextField
                label={<span>Description <span style={{ color: '#C72030' }}>*</span></span>}
                value={formData.description}
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
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",

                    margin: 0,
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    resize: "none !important",
                  },
                }}
              />
            </div>


          </CardContent>
        </Card>

        {/* Damage Block */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <AlertTriangle className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">DAMAGE</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            {/* Damage Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Property Damage Happened */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="property-damage-happened-label">
                  Has Any Property Damage Happened In The Incident?
                </InputLabel>
                <MuiSelect
                  labelId="property-damage-happened-label"
                  label="Has Any Property Damage Happened In The Incident?"
                  value={formData.propertyDamageHappened || ''}
                  onChange={e => handleInputChange('propertyDamageHappened', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="false">No</MenuItem>
                  <MenuItem value="true">Yes</MenuItem>
                </MuiSelect>
              </FormControl>

              {/* Property Damage Category */}
              {formData.propertyDamageHappened === 'true' && (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="property-damage-category-label">Property Damage Category</InputLabel>
                  <MuiSelect
                    labelId="property-damage-category-label"
                    label="Property Damage Category"
                    value={formData.propertyDamageCategory || ''}
                    onChange={e => handleInputChange('propertyDamageCategory', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    {propertyDamageCategories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              )}

              {/* Damage Covered Under Insurance */}
              {formData.propertyDamageHappened === 'true' && (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="damage-covered-insurance-label">Damage Covered Insurance</InputLabel>
                  <MuiSelect
                    labelId="damage-covered-insurance-label"
                    label="Damage Covered Insurance"
                    value={formData.damageCoveredInsurance || ''}
                    onChange={e => handleInputChange('damageCoveredInsurance', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </MuiSelect>
                </FormControl>
              )}

              {/* Insured By */}
              {formData.damageCoveredInsurance === 'true' && (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="insured-by-label">Insured By</InputLabel>
                  <MuiSelect
                    labelId="insured-by-label"
                    label="Insured By"
                    value={formData.insuredBy || ''}
                    onChange={e => handleInputChange('insuredBy', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    <MenuItem value="Building insurance">Building insurance</MenuItem>
                    <MenuItem value="Private/ individual insurance">Private/ individual insurance</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </MuiSelect>
                </FormControl>
              )}

              {/* Damaged Recovered */}
              {formData.damageCoveredInsurance === 'true' && (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="damaged-recovered-label">Damaged Recovered</InputLabel>
                  <MuiSelect
                    labelId="damaged-recovered-label"
                    label="Damaged Recovered"
                    value={formData.damagedRecovered || ''}
                    onChange={e => handleInputChange('damagedRecovered', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value=""><em>Select</em></MenuItem>
                    <MenuItem value="Yes, from the insurance agency">Yes, from the insurance agency</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="Partially recovered">Partially recovered</MenuItem>
                  </MuiSelect>
                </FormControl>
              )}

              {/* Primary Root Cause Category */}
              <FormControl fullWidth variant="outlined">
                <InputLabel id="primary-root-cause-label">Primary root cause category</InputLabel>
                <MuiSelect
                  labelId="primary-root-cause-label"
                  label="Primary root cause category"
                  value={formData.primaryRootCauseCategory || ''}
                  onChange={e => handleInputChange('primaryRootCauseCategory', e.target.value)}
                  displayEmpty
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  {rcaCategories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            {/* Text Area Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* RCA */}
              <div>
                <TextField
                  label={<span>Root Cause Analysis (RCA) <span style={{ color: '#C72030' }}>*</span></span>}
                  value={formData.rca || ''}
                  onChange={e => handleInputChange('rca', e.target.value)}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto !important",
                      padding: "2px !important",
                      display: "flex",
                    },
                    "& .MuiInputBase-input[aria-hidden='true']": {
                      flex: 0,
                      width: 0,
                      height: 0,
                      padding: "0 !important",
                      margin: 0,
                      display: "none",
                    },
                    "& .MuiInputBase-input": {
                      resize: "none !important",
                    },
                  }}
                />
              </div>

              {/* Preventive action */}
              <div>
                <TextField
                  label={<span>Preventive Action <span style={{ color: '#C72030' }}>*</span></span>}
                  value={formData.preventiveAction || ''}
                  onChange={e => handleInputChange('preventiveAction', e.target.value)}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  InputLabelProps={{
                    shrink: true
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "auto !important",
                      padding: "2px !important",
                      display: "flex",
                    },
                    "& .MuiInputBase-input[aria-hidden='true']": {
                      flex: 0,
                      width: 0,
                      height: 0,
                      padding: "0 !important",
                      margin: 0,
                      display: "none",
                    },
                    "& .MuiInputBase-input": {
                      resize: "none !important",
                    },
                  }}
                />
              </div>
            </div>

            {/* Corrective action - Full Width */}
            <div className="mt-6">
              <TextField
                label={<span>Corrective Action <span style={{ color: '#C72030' }}>*</span></span>}
                value={formData.correctiveAction || ''}
                onChange={e => handleInputChange('correctiveAction', e.target.value)}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                InputLabelProps={{
                  shrink: true
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    resize: "none !important",
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Witnesses Details */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <Users className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">ADD WITNESSES DETAILS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            {formData.witnesses && formData.witnesses.filter(w => !w._destroy).map((witness, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Name <span style={{ color: '#C72030' }}>*</span>
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    placeholder="Enter Name"
                    value={witness.name}
                    onChange={(e) => {
                      const newWitnesses = [...formData.witnesses];
                      newWitnesses[index].name = e.target.value;
                      handleInputChange('witnesses', newWitnesses);
                    }}
                  />
                </fieldset>

                <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Mobile <span style={{ color: '#C72030' }}>*</span>
                  </legend>
                  <input
                    type="text"
                    maxLength={10}
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    placeholder="Enter Mobile"
                    value={witness.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      const newWitnesses = [...formData.witnesses];
                      newWitnesses[index].mobile = value.slice(0, 10); // Ensure max 10 digits
                      handleInputChange('witnesses', newWitnesses);
                    }}
                  />
                </fieldset>


                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteWitness(witness.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  const newWitnesses = [...(formData.witnesses || []), { name: '', mobile: '', id: null, _destroy: false }];
                  handleInputChange('witnesses', newWitnesses);
                }}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                + Add More
              </Button>
            </div>
          </CardContent>
        </Card>

        {formData.propertyDamageHappened === 'true' && (
          <Card className="mb-6 border border-[#D9D9D9]">
            <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                  <Settings className="w-6 h-6" style={{ color: '#C72030' }} />
                </div>
                <span className="text-[#1A1A1A] font-semibold uppercase">COST OF INCIDENT</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Equipment/Property Damaged Cost */}
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Equipment/Property Damaged Cost
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    type="text"
                    value={formData.equipmentPropertyDamagedCost}
                    onChange={(e) =>
                      handleInputChange('equipmentPropertyDamagedCost', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </fieldset>

                {/* Production Loss */}
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Production Loss
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    type="text"
                    value={formData.productionLoss}
                    onChange={(e) =>
                      handleInputChange('productionLoss', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </fieldset>

                {/* Treatment Cost */}
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Treatment Cost
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    type="text"
                    value={formData.treatmentCost}
                    onChange={(e) =>
                      handleInputChange('treatmentCost', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </fieldset>

                {/* Absenteeism Cost */}
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Absenteeism Cost
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    type="text"
                    value={formData.absenteeismCost}
                    onChange={(e) =>
                      handleInputChange('absenteeismCost', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </fieldset>

                {/* Other Cost */}
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Other Cost
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    type="text"
                    value={formData.otherCost}
                    onChange={(e) =>
                      handleInputChange('otherCost', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </fieldset>

                {/* Total Cost */}
                <fieldset className="border border-gray-300 rounded p-3">
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Total Cost
                  </legend>
                  <div className="text-sm font-medium text-gray-900">
                    {formData.totalCost}
                  </div>
                </fieldset>
              </div>
            </CardContent>
          </Card>
        )}


        {/* First Aid Provided */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <Heart className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">FIRST AID PROVIDED</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="firstAidProvided"
                checked={formData.firstAidProvided}
                onChange={(e) => handleInputChange('firstAidProvided', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="firstAidProvided" className="text-sm font-medium text-gray-700">
                Was First Aid provided by Employees?
              </label>
            </div>

            {formData.firstAidProvided && (
              <div className="mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Name of First Aid Attendants</Label>
                  <Input
                    value={formData.firstAidAttendants}
                    onChange={(e) => handleInputChange('firstAidAttendants', e.target.value)}
                    placeholder="Enter names of first aid attendants"
                    className="bg-white"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical Treatment */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <Stethoscope className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">MEDICAL TREATMENT</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="medicalTreatment"
                checked={formData.medicalTreatment}
                onChange={(e) => handleInputChange('medicalTreatment', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="medicalTreatment" className="text-sm font-medium text-gray-700">
                Sent for Medical Treatment
              </label>
            </div>

            {formData.medicalTreatment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Name and Address of Treatment Facility</Label>
                  <Input
                    value={formData.treatmentFacility}
                    onChange={(e) => handleInputChange('treatmentFacility', e.target.value)}
                    placeholder="Enter treatment facility details"
                    className="bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">Name and Address of Attending Physician</Label>
                  <Input
                    value={formData.attendingPhysician}
                    onChange={(e) => handleInputChange('attendingPhysician', e.target.value)}
                    placeholder="Enter physician details"
                    className="bg-white"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Investigation Team Details */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <UserSearch className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">ADD INVESTIGATION TEAM DETAILS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            {formData.investigationTeam && formData.investigationTeam.filter(member => !member._destroy).map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Name
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    placeholder="Enter Name"
                    value={member.name}
                    onChange={(e) => {
                      const newTeam = [...formData.investigationTeam];
                      newTeam[index].name = e.target.value;
                      handleInputChange('investigationTeam', newTeam);
                    }}
                  />
                </fieldset>

                <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Mobile
                  </legend>
                  <input
                    type="text"
                    maxLength={10}
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    placeholder="Enter Mobile"
                    value={member.mobile}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
                      const newTeam = [...formData.investigationTeam];
                      newTeam[index].mobile = value.slice(0, 10); // Max 10 digits
                      handleInputChange('investigationTeam', newTeam);
                    }}
                  />
                </fieldset>


                <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Designation
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    placeholder="Enter Designation"
                    value={member.designation}
                    onChange={(e) => {
                      const newTeam = [...formData.investigationTeam];
                      newTeam[index].designation = e.target.value;
                      handleInputChange('investigationTeam', newTeam);
                    }}
                  />
                </fieldset>

                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteInvestigationMember(member.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  const newTeam = [...(formData.investigationTeam || []), { name: '', mobile: '', designation: '', id: null, _destroy: false }];
                  handleInputChange('investigationTeam', newTeam);
                }}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                + Add More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support and Disclaimer */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Support<span style={{ color: '#C72030' }}>*</span></h3>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.supportRequired}
                      onChange={(e) => handleInputChange('supportRequired', e.target.checked)}
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
                <h3 className="text-lg font-medium mb-3">Disclaimer<span style={{ color: '#C72030' }}>*</span></h3>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.factsCorrect}
                      onChange={(e) => handleInputChange('factsCorrect', e.target.checked)}
                      sx={{
                        color: '#C72030',
                        '&.Mui-checked': {
                          color: '#C72030',
                        },
                      }}
                    />
                  }
                  label="I have correctly stated all the facts related to the incident."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                <Paperclip className="w-6 h-6" style={{ color: '#C72030' }} />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">
                ATTACHMENTS - {existingAttachments.length + newAttachments.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7]">
            <div className="space-y-6">
              {/* Existing Attachments */}
              {existingAttachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3 text-gray-700">Current Attachments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {existingAttachments.map((attachment, index) => (
                      <div key={attachment.id} className="bg-white border rounded p-3">
                        <div className="mb-2">
                          <span className="text-sm text-gray-600 truncate">
                            {attachment.doctype || 'File'}
                          </span>
                        </div>

                        {/* Image Preview - using same logic as IncidentDetailsPage */}
                        {attachment.doctype?.startsWith('image/') && (
                          <img
                            src={attachment.url}
                            alt="Attachment"
                            className="mt-2 w-full h-32 object-cover rounded"
                          />
                        )}

                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(attachment.url, '_blank')}
                            className="flex-1 text-xs"
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Attachments Upload */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-gray-700">Add New Attachments</h4>
                <div>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setNewAttachments(prev => [...prev, ...files]);
                        // Don't call handleInputChange with file object
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 bg-white"
                  >
                    Choose Files
                  </label>
                  <span className="ml-4 text-sm text-gray-500">
                    {newAttachments.length > 0 ? `${newAttachments.length} file(s) selected` : 'No new files chosen'}
                  </span>
                </div>

                {/* Preview New Attachments */}
                {newAttachments.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-xs font-medium mb-2 text-gray-600">New Files to Upload:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {newAttachments.map((file, index) => (
                        <div key={index} className="bg-white border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 truncate" title={file.name}>
                              {file.type || 'File'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setNewAttachments(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>

                          {/* Preview for images - matching IncidentDetailsPage logic */}
                          {file.type.startsWith('image/') && (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="mt-2 w-full h-32 object-cover rounded"
                            />
                          )}

                          <div className="mt-2 text-xs text-gray-400">
                            {file.name} • {(file.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <Button
                    style={{
                      backgroundColor: '#C72030'
                    }}
                    className="text-white hover:opacity-90"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files...
                  </Button>
                </div>
              </div>

              {/* No attachments message */}
              {existingAttachments.length === 0 && newAttachments.length === 0 && (
                <p className="text-gray-600">No attachments available.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={saving}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateDetails}
            disabled={saving}
            style={{ backgroundColor: saving ? '#9CA3AF' : '#C72030' }}
            className="text-white hover:opacity-90 px-8"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Details'
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};