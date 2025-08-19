
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useParams, useNavigate } from 'react-router-dom';
import { Info, FileText, Users, Settings, AlertTriangle, Search } from 'lucide-react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField, Checkbox, FormControlLabel } from '@mui/material';

export const EditIncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    year: '2025',
    month: 'August',
    day: '12',
    hour: '12',
    minute: '25',
    incidentDate: '2025-01-29',
    incidentTime: '15:21',
    location: 'Building A, Floor 3',
    building: '',
    categoryForIncident: '',
    primaryCategory: '',
    subCategory: '',
    subSubCategory: '',
    secondaryCategory: '',
    secondarySubCategory: '',
    secondarySubSubCategory: '',
    secondarySubSubSubCategory: '',
    severity: '',
    probability: '',
    incidentLevel: '',
    description: 'ygyuiyi',
    propertyDamageHappened: '',
    propertyDamageCategory: '',
    damageCoveredInsurance: '',
    insuredBy: '',
    primaryRootCauseCategory: '',
    rca: '',
    correctiveAction: '',
    preventiveAction: '',
    incidentType: 'accident',
    reportedBy: 'John Doe',
    witnessName: '',
    injuryOccurred: 'no',
    propertyDamage: 'no',
    immediateAction: 'Area secured and cleaned',
    rootCause: 'Under investigation',
    preventiveMeasures: 'To be determined',
    status: 'open',
    assignedTo: '',
    priority: 'medium',
    witnesses: [
      { name: '', mobile: '' },
      { name: '', mobile: '' }
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
      { name: '', mobile: '', designation: '' }
    ],
    supportRequired: false,
    factsCorrect: false,
    attachments: null
  });

  const handleInputChange = (field: string, value: string | boolean | any[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleUpdateDetails = () => {
    console.log('Incident details updated:', formData);
    navigate(`/maintenance/safety/incident/${id}`);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center text-sm text-gray-600 mb-4">
          <span>Safety</span>
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

      <div className="space-y-6">
        {/* Basic Information */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
                <Info className="h-4 w-4" />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">BASIC INFORMATION</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            {/* Time & Date Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Time & Date *</h3>
              <div className="grid grid-cols-5 gap-2">
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Year</InputLabel>
                  <MuiSelect
                    label="Year"
                    value={formData.year}
                    onChange={e => handleInputChange('year', e.target.value)}
                    sx={fieldStyles}
                  >
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                  </MuiSelect>
                </FormControl>

                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Month</InputLabel>
                  <MuiSelect
                    label="Month"
                    value={formData.month}
                    onChange={e => handleInputChange('month', e.target.value)}
                    sx={fieldStyles}
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
                <InputLabel shrink>Building *</InputLabel>
                <MuiSelect
                  label="Building *"
                  value={formData.building}
                  onChange={e => handleInputChange('building', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Building</em></MenuItem>
                  <MenuItem value="1">Building A</MenuItem>
                  <MenuItem value="2">Building B</MenuItem>
                  <MenuItem value="3">Building C</MenuItem>
                </MuiSelect>
              </FormControl>

              {/* PRIMARY CATEGORY HIERARCHY */}
              {/* Level 1: Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Primary Category *</InputLabel>
                <MuiSelect
                  label="Primary Category *"
                  value={formData.categoryForIncident}
                  onChange={e => handleInputChange('categoryForIncident', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Primary Category</em></MenuItem>
                  <MenuItem value="1">Safety</MenuItem>
                  <MenuItem value="2">Security</MenuItem>
                  <MenuItem value="3">Fire</MenuItem>
                </MuiSelect>
              </FormControl>

              {/* Level 2: Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.categoryForIncident}>
                <InputLabel shrink>Sub Category</InputLabel>
                <MuiSelect
                  label="Sub Category"
                  value={formData.primaryCategory}
                  onChange={e => handleInputChange('primaryCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                  <MenuItem value="1">Accident</MenuItem>
                  <MenuItem value="2">Near Miss</MenuItem>
                  <MenuItem value="3">Property Damage</MenuItem>
                </MuiSelect>
              </FormControl>

              {/* Level 3: Sub Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.primaryCategory}>
                <InputLabel shrink>Sub Sub Category</InputLabel>
                <MuiSelect
                  label="Sub Sub Category"
                  value={formData.subCategory}
                  onChange={e => handleInputChange('subCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Sub Category</em></MenuItem>
                  <MenuItem value="1">Minor</MenuItem>
                  <MenuItem value="2">Major</MenuItem>
                  <MenuItem value="3">Critical</MenuItem>
                </MuiSelect>
              </FormControl>

              {/* Level 4: Sub Sub Sub Category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }} disabled={!formData.subCategory}>
                <InputLabel shrink>Sub Sub Sub Category</InputLabel>
                <MuiSelect
                  label="Sub Sub Sub Category"
                  value={formData.subSubCategory}
                  onChange={e => handleInputChange('subSubCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Sub Sub Category</em></MenuItem>
                  <MenuItem value="1">Type A</MenuItem>
                  <MenuItem value="2">Type B</MenuItem>
                  <MenuItem value="3">Type C</MenuItem>
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
                  <MenuItem value="1">Environmental</MenuItem>
                  <MenuItem value="2">Health</MenuItem>
                  <MenuItem value="3">Compliance</MenuItem>
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
                  <MenuItem value="1">Air Quality</MenuItem>
                  <MenuItem value="2">Water Quality</MenuItem>
                  <MenuItem value="3">Noise</MenuItem>
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
                  <MenuItem value="1">Indoor</MenuItem>
                  <MenuItem value="2">Outdoor</MenuItem>
                  <MenuItem value="3">Mixed</MenuItem>
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
                  <MenuItem value="1">Low Impact</MenuItem>
                  <MenuItem value="2">Medium Impact</MenuItem>
                  <MenuItem value="3">High Impact</MenuItem>
                </MuiSelect>
              </FormControl>

              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Severity *</InputLabel>
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
                <InputLabel shrink>Probability *</InputLabel>
                <MuiSelect
                  label="Probability *"
                  value={formData.probability}
                  onChange={e => handleInputChange('probability', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
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
                <InputLabel shrink>Incident level *</InputLabel>
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
                  <MenuItem value="1">Level 1 - Low Risk</MenuItem>
                  <MenuItem value="2">Level 2 - Medium Risk</MenuItem>
                  <MenuItem value="3">Level 3 - High Risk</MenuItem>
                  <MenuItem value="4">Level 4 - Extreme Risk</MenuItem>
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
                label="Description*"
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
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </div>

            {/* Additional Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Has Any Property Damage Happened In The Incident */}
              <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
                <legend className="float-none px-2 text-sm font-medium text-gray-700">
                  Has Any Property Damage Happened In The Incident? <span className="text-red-500">*</span>
                </legend>
                <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
                  <MuiSelect
                    value={formData.propertyDamageHappened || ''}
                    onChange={e => handleInputChange('propertyDamageHappened', e.target.value)}
                    displayEmpty
                    sx={{
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
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                  >
                    <MenuItem value="">select</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </MuiSelect>
                </FormControl>
              </fieldset>

              {/* Property Damage Category */}
              <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
                <legend className="float-none px-2 text-sm font-medium text-gray-700">
                  Property Damage Category
                </legend>
                <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
                  <MuiSelect
                    value={formData.propertyDamageCategory || ''}
                    onChange={e => handleInputChange('propertyDamageCategory', e.target.value)}
                    displayEmpty
                    sx={{
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
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </MuiSelect>
                </FormControl>
              </fieldset>

              {/* Damage covered under insurance */}
              <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
                <legend className="float-none px-2 text-sm font-medium text-gray-700">
                  Damage covered under insurance
                </legend>
                <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
                  <MuiSelect
                    value={formData.damageCoveredInsurance || ''}
                    onChange={e => handleInputChange('damageCoveredInsurance', e.target.value)}
                    displayEmpty
                    sx={{
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
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                  >
                    <MenuItem value="">select</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                    <MenuItem value="true">Yes</MenuItem>
                  </MuiSelect>
                </FormControl>
              </fieldset>

              {/* Insured by */}
              <fieldset className="border border-gray-300 rounded p-3" style={{ minHeight: '72px' }}>
                <legend className="float-none px-2 text-sm font-medium text-gray-700">
                  Insured by
                </legend>
                <FormControl fullWidth variant="outlined" sx={{ mt: 0 }}>
                  <MuiSelect
                    value={formData.insuredBy || ''}
                    onChange={e => handleInputChange('insuredBy', e.target.value)}
                    displayEmpty
                    sx={{
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
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      }
                    }}
                  >
                    <MenuItem value="">select</MenuItem>
                    <MenuItem value="Building insurance">Building insurance</MenuItem>
                    <MenuItem value="Private/ individual insurance">Private/ individual insurance</MenuItem>
                    <MenuItem value="Others">Others</MenuItem>
                  </MuiSelect>
                </FormControl>
              </fieldset>

              {/* Primary root cause category */}
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Primary root cause category</InputLabel>
                <MuiSelect
                  label="Primary root cause category"
                  value={formData.primaryRootCauseCategory || ''}
                  onChange={e => handleInputChange('primaryRootCauseCategory', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select</em></MenuItem>
                  <MenuItem value="human-error">Human Error</MenuItem>
                  <MenuItem value="equipment-failure">Equipment Failure</MenuItem>
                  <MenuItem value="process-failure">Process Failure</MenuItem>
                  <MenuItem value="environmental">Environmental</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            {/* Text Area Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* RCA */}
              <div>
                <TextField
                  label="RCA *"
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
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white'
                    }
                  }}
                />
              </div>

              {/* Preventive action */}
              <div>
                <TextField
                  label="Preventive action *"
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
                    mt: 1,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white'
                    }
                  }}
                />
              </div>
            </div>

            {/* Corrective action - Full Width */}
            <div className="mt-6">
              <TextField
                label="Corrective action *"
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
                  mt: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white'
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Witnesses Details */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">ADD WITNESSES DETAILS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            {formData.witnesses && formData.witnesses.map((witness, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <fieldset className="border border-gray-300 rounded p-3" style={{ height: '60px' }}>
                  <legend className="float-none px-2 text-sm font-medium text-gray-700">
                    Name
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
                    Mobile
                  </legend>
                  <input
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    placeholder="Enter Mobile"
                    value={witness.mobile}
                    onChange={(e) => {
                      const newWitnesses = [...formData.witnesses];
                      newWitnesses[index].mobile = e.target.value;
                      handleInputChange('witnesses', newWitnesses);
                    }}
                  />
                </fieldset>

                <div className="flex justify-center items-center">
                  <button
                    type="button"
                    onClick={() => {
                      const newWitnesses = formData.witnesses.filter((_, i) => i !== index);
                      handleInputChange('witnesses', newWitnesses);
                    }}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  const newWitnesses = [...(formData.witnesses || []), { name: '', mobile: '' }];
                  handleInputChange('witnesses', newWitnesses);
                }}
                className="bg-purple-600 text-white hover:bg-purple-700"
              >
                + Add More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cost of Incident */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-[#FF8C42] text-white rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4" />
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
                  onChange={(e) => handleInputChange('equipmentPropertyDamagedCost', e.target.value)}
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
                  onChange={(e) => handleInputChange('productionLoss', e.target.value)}
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
                  onChange={(e) => handleInputChange('treatmentCost', e.target.value)}
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
                  onChange={(e) => handleInputChange('absenteeismCost', e.target.value)}
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
                  onChange={(e) => handleInputChange('otherCost', e.target.value)}
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

        {/* First Aid Provided */}
        <Card className="mb-6 border border-[#D9D9D9]">
          <CardHeader className="bg-[#F6F4EE] border-b border-[#D9D9D9]">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-[#FF8C42] text-white rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4" />
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
              <div className="w-8 h-8 bg-[#FF8C42] text-white rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4" />
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
              <div className="w-8 h-8 bg-[#FF8C42] text-white rounded-full flex items-center justify-center">
                <Settings className="h-4 w-4" />
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">ADD INVESTIGATION TEAM DETAILS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7] space-y-4">
            {formData.investigationTeam && formData.investigationTeam.map((member, index) => (
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
                    className="w-full p-0 border-0 bg-transparent outline-none text-sm"
                    placeholder="Enter Mobile"
                    value={member.mobile}
                    onChange={(e) => {
                      const newTeam = [...formData.investigationTeam];
                      newTeam[index].mobile = e.target.value;
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
                    onClick={() => {
                      const newTeam = formData.investigationTeam.filter((_, i) => i !== index);
                      handleInputChange('investigationTeam', newTeam);
                    }}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  const newTeam = [...(formData.investigationTeam || []), { name: '', mobile: '', designation: '' }];
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
                <h3 className="text-lg font-medium mb-3">Support</h3>
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
                <h3 className="text-lg font-medium mb-3">Disclaimer</h3>
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
              <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center">
                <span className="text-white text-sm">📎</span>
              </div>
              <span className="text-[#1A1A1A] font-semibold uppercase">ATTACHMENTS</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-[#F6F7F7]">
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  onChange={(e) => handleInputChange('attachments', e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 bg-white"
                >
                  Choose Files
                </label>
                <span className="ml-4 text-sm text-gray-500">
                  {formData.attachments ? formData.attachments.name : 'No file chosen'}
                </span>
              </div>

              <div>
                <Button
                  style={{
                    backgroundColor: '#C72030'
                  }}
                  className="text-white hover:opacity-90"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose a file...
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={() => navigate(`/maintenance/safety/incident/${id}`)}
            className="px-8"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateDetails}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:opacity-90 px-8"
          >
            Update Details
          </Button>
        </div>
      </div>
    </div>
  );
};
