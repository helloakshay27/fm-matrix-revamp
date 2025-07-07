import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  ArrowBack,
  ExpandLess,
  ExpandMore,
  Add,
  Close,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

export const EditAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [locationDetailsExpanded, setLocationDetailsExpanded] = useState(true);
  const [assetDetailsExpanded, setAssetDetailsExpanded] = useState(true);
  const [warrantyDetailsExpanded, setWarrantyDetailsExpanded] = useState(true);
  const [meterCategoryExpanded, setMeterCategoryExpanded] = useState(true);
  const [consumptionExpanded, setConsumptionExpanded] = useState(true);
  const [nonConsumptionExpanded, setNonConsumptionExpanded] = useState(true);
  const [attachmentsExpanded, setAttachmentsExpanded] = useState(true);

  const [locationData, setLocationData] = useState({
    site: 'Lockated',
    building: 'sebc',
    wing: '',
    area: '',
    floor: '',
    room: '',
  });

  const [formData, setFormData] = useState({
    assetName: 'sdcsdc',
    assetNo: 'sdcsdc',
    equipmentId: '',
    modelNo: 'tested',
    serialNo: 'sdcsdc',
    consumerNo: '',
    purchaseCost: '0.0',
    capacity: '10',
    unit: '10',
    group: 'Electrical',
    subgroup: 'Electric Meter',
    purchaseDate: '2024-05-26',
    expiryDate: '',
    manufacturer: '',
    locationType: 'common-area',
    assetType: 'parent',
    status: 'in-use',
    critical: 'yes',
    meterApplicable: true,
    underWarranty: 'yes',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: '',
  });

  const [selectedMeterTypes, setSelectedMeterTypes] = useState([]);
  const [consumptionMeasures, setConsumptionMeasures] = useState([]);
  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([]);
  const [attachments, setAttachments] = useState({
    manuals: [],
    insurance: [],
    invoice: [],
    amc: [],
  });

  const meterTypes = [
    { id: 'board', label: 'Board' },
    { id: 'eg-dg', label: 'EG DG' },
    { id: 'renewable', label: 'Renewable' },
    { id: 'fresh-water', label: 'Fresh Water' },
    { id: 'recycled', label: 'Recycled' },
    { id: 'iex-gdam', label: 'IEX-GDAM' },
  ];

  const unitTypes = [
    'kWh',
    'kW',
    'Liters',
    'Cubic Meters',
    'Units',
    'Percentage',
    'Temperature',
    'Pressure',
  ];

  const handleLocationChange = (field, value) => {
    setLocationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMeterTypeToggle = (typeId) => {
    setSelectedMeterTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleAddConsumptionMeasure = () => {
    const newMeasure = {
      id: Date.now(),
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    };
    setConsumptionMeasures((prev) => [...prev, newMeasure]);
  };

  const handleAddNonConsumptionMeasure = () => {
    const newMeasure = {
      id: Date.now(),
      name: '',
      unitType: '',
      min: '',
      max: '',
      alertBelowVal: '',
      alertAboveVal: '',
      multiplierFactor: '',
      checkPreviousReading: false,
    };
    setNonConsumptionMeasures((prev) => [...prev, newMeasure]);
  };

  const handleRemoveConsumptionMeasure = (id) => {
    setConsumptionMeasures((prev) => prev.filter((measure) => measure.id !== id));
  };

  const handleRemoveNonConsumptionMeasure = (id) => {
    setNonConsumptionMeasures((prev) =>
      prev.filter((measure) => measure.id !== id)
    );
  };

  const handleUpdateConsumptionMeasure = (id, field, value) => {
    setConsumptionMeasures((prev) =>
      prev.map((measure) =>
        measure.id === id ? { ...measure, [field]: value } : measure
      )
    );
  };

  const handleUpdateNonConsumptionMeasure = (id, field, value) => {
    setNonConsumptionMeasures((prev) =>
      prev.map((measure) =>
        measure.id === id ? { ...measure, [field]: value } : measure
      )
    );
  };

  const handleFileUpload = (category, event) => {
    const files = event.target.files;
    if (files) {
      console.log(`Uploading files for ${category}:`, Array.from(files));
      // Handle file upload logic here
    }
  };

  const handleSaveAndShowDetails = () => {
    console.log('Saving and showing details:', {
      locationData,
      formData,
      selectedMeterTypes,
      consumptionMeasures,
      nonConsumptionMeasures,
      attachments,
    });
    navigate(`/maintenance/asset/details/${id}`);
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new:', {
      locationData,
      formData,
      selectedMeterTypes,
      consumptionMeasures,
      nonConsumptionMeasures,
      attachments,
    });
    navigate('/maintenance/asset/add');
  };

  const handleBack = () => {
    navigate(`/maintenance/asset/details/${id}`);
  };

  // Styled Components
  const SectionHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  }));

  const SectionTitle = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  }));

  const Circle = styled(Box)(({ theme }) => ({
    width: 32,
    height: 32,
    backgroundColor: '#C72030',
    color: theme.palette.common.white,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
  }));

  const FileUploadBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.grey[400]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    '&:hover': {
      borderColor: theme.palette.grey[500],
    },
  }));

  return (
    <Box sx={{ p: 4, bgcolor: '#f6f4ee', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary' }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
          >
            Asset List
          </Button>
          <Typography variant="body2">&gt;</Typography>
          <Typography variant="body2">Create New Asset</Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', textTransform: 'uppercase' }}>
          NEW ASSET
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', boxShadow: 1 }}>
        {/* Location Details Section */}
        <SectionHeader>
          <SectionTitle>
            <Circle>1</Circle>
            <Typography variant="h6" sx={{ color: '#C72030', fontWeight: 'bold', textTransform: 'uppercase' }}>
              LOCATION DETAILS
            </Typography>
          </SectionTitle>
          <IconButton onClick={() => setLocationDetailsExpanded(!locationDetailsExpanded)}>
            {locationDetailsExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={locationDetailsExpanded}>
          <Box sx={{ p: 4, pt: 0 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Site*</InputLabel>
                <Select
                  value={locationData.site}
                  onChange={(e) => handleLocationChange('site', e.target.value)}
                  label="Site*"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="Lockated">Lockated</MenuItem>
                  <MenuItem value="Other Site">Other Site</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Building</InputLabel>
                <Select
                  value={locationData.building}
                  onChange={(e) => handleLocationChange('building', e.target.value)}
                  label="Building"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="sebc">sebc</MenuItem>
                  <MenuItem value="Building A">Building A</MenuItem>
                  <MenuItem value="Building B">Building B</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Wing</InputLabel>
                <Select
                  value={locationData.wing}
                  onChange={(e) => handleLocationChange('wing', e.target.value)}
                  label="Wing"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="North Wing">North Wing</MenuItem>
                  <MenuItem value="South Wing">South Wing</MenuItem>
                  <MenuItem value="East Wing">East Wing</MenuItem>
                  <MenuItem value="West Wing">West Wing</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Area</InputLabel>
                <Select
                  value={locationData.area}
                  onChange={(e) => handleLocationChange('area', e.target.value)}
                  label="Area"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="Area 1">Area 1</MenuItem>
                  <MenuItem value="Area 2">Area 2</MenuItem>
                  <MenuItem value="Area 3">Area 3</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Floor</InputLabel>
                <Select
                  value={locationData.floor}
                  onChange={(e) => handleLocationChange('floor', e.target.value)}
                  label="Floor"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="Ground Floor">Ground Floor</MenuItem>
                  <MenuItem value="1st Floor">1st Floor</MenuItem>
                  <MenuItem value="2nd Floor">2nd Floor</MenuItem>
                  <MenuItem value="3rd Floor">3rd Floor</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Room</InputLabel>
                <Select
                  value={locationData.room}
                  onChange={(e) => handleLocationChange('room', e.target.value)}
                  label="Room"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="Room 101">Room 101</MenuItem>
                  <MenuItem value="Room 102">Room 102</MenuItem>
                  <MenuItem value="Room 103">Room 103</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Collapse>

        {/* Asset Details Section */}
        <SectionHeader>
          <SectionTitle>
            <Circle>2</Circle>
            <Typography variant="h6" sx={{ color: '#C72030', fontWeight: 'bold', textTransform: 'uppercase' }}>
              ASSET DETAILS
            </Typography>
          </SectionTitle>
          <IconButton onClick={() => setAssetDetailsExpanded(!assetDetailsExpanded)}>
            {assetDetailsExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={assetDetailsExpanded}>
          <Box sx={{ p: 4, pt: 0 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 4 }}>
              <TextField
                label="Asset Name*"
                value={formData.assetName}
                onChange={(e) => handleInputChange('assetName', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Asset No.*"
                value={formData.assetNo}
                onChange={(e) => handleInputChange('assetNo', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Equipment ID*"
                value={formData.equipmentId}
                onChange={(e) => handleInputChange('equipmentId', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Model No."
                value={formData.modelNo}
                onChange={(e) => handleInputChange('modelNo', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Serial No."
                value={formData.serialNo}
                onChange={(e) => handleInputChange('serialNo', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 4 }}>
              <TextField
                label="Consumer No."
                value={formData.consumerNo}
                onChange={(e) => handleInputChange('consumerNo', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Purchase Cost*"
                value={formData.purchaseCost}
                onChange={(e) => handleInputChange('purchaseCost', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Capacity"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Unit"
                value={formData.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Group*</InputLabel>
                <Select
                  value={formData.group}
                  onChange={(e) => handleInputChange('group', e.target.value)}
                  label="Group*"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="Electrical">Electrical</MenuItem>
                  <MenuItem value="Mechanical">Mechanical</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Subgroup*</InputLabel>
                <Select
                  value={formData.subgroup}
                  onChange={(e) => handleInputChange('subgroup', e.target.value)}
                  label="Subgroup*"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="Electric Meter">Electric Meter</MenuItem>
                  <MenuItem value="Water Meter">Water Meter</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Purchased ON Date"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <TextField
                label="Expiry Date"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#C72030',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#C72030',
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Manufacturer</InputLabel>
                <Select
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  label="Manufacturer"
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="manufacturer1">Manufacturer 1</MenuItem>
                  <MenuItem value="manufacturer2">Manufacturer 2</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Location Type</FormLabel>
                <RadioGroup
                  row
                  value={formData.locationType}
                  onChange={(e) => handleInputChange('locationType', e.target.value)}
                >
                  <FormControlLabel value="common-area" control={<Radio />} label="Common Area" />
                  <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                  <FormControlLabel value="na" control={<Radio />} label="NA" />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel component="legend">Asset Type</FormLabel>
                <RadioGroup
                  row
                  value={formData.assetType}
                  onChange={(e) => handleInputChange('assetType', e.target.value)}
                >
                  <FormControlLabel value="parent" control={<Radio />} label="Parent" />
                  <FormControlLabel value="sub" control={<Radio />} label="Sub" />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel component="legend">Status</FormLabel>
                <RadioGroup
                  row
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <FormControlLabel value="in-use" control={<Radio />} label="In Use" />
                  <FormControlLabel value="breakdown" control={<Radio />} label="Breakdown" />
                </RadioGroup>
              </FormControl>
              <FormControl component="fieldset">
                <FormLabel component="legend">Critical</FormLabel>
                <RadioGroup
                  row
                  value={formData.critical}
                  onChange={(e) => handleInputChange('critical', e.target.value)}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.meterApplicable}
                    onChange={(e) => handleInputChange('meterApplicable', e.target.checked)}
                  />
                }
                label="Meter Applicable"
              />
            </Box>
          </Box>
        </Collapse>

        {/* Warranty Details Section */}
        <SectionHeader>
          <SectionTitle>
            <Circle>3</Circle>
            <Typography variant="h6" sx={{ color: '#C72030', fontWeight: 'bold', textTransform: 'uppercase' }}>
              WARRANTY DETAILS
            </Typography>
          </SectionTitle>
          <IconButton onClick={() => setWarrantyDetailsExpanded(!warrantyDetailsExpanded)}>
            {warrantyDetailsExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={warrantyDetailsExpanded}>
          <Box sx={{ p: 4, pt: 0 }}>
            <FormControl component="fieldset" sx={{ mb: 4 }}>
              <FormLabel component="legend">Under Warranty</FormLabel>
              <RadioGroup
                row
                value={formData.underWarranty}
                onChange={(e) => handleInputChange('underWarranty', e.target.value)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              <TextField
                label="Warranty Start Date"
                type="date"
                value={formData.warrantyStartDate}
                onChange={(e) => handleInputChange('warrantyStartDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Warranty Expires On"
                type="date"
                value={formData.warrantyExpiresOn}
                onChange={(e) => handleInputChange('warrantyExpiresOn', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Commissioning Date"
                type="date"
                value={formData.commissioningDate}
                onChange={(e) => handleInputChange('commissioningDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </Collapse>

        {/* Meter Category Type Section */}
        <SectionHeader>
          <SectionTitle>
            <Circle>4</Circle>
            <Typography variant="h6" sx={{ color: '#C72030', fontWeight: 'bold', textTransform: 'uppercase' }}>
              METER CATEGORY TYPE
            </Typography>
          </SectionTitle>
          <IconButton onClick={() => setMeterCategoryExpanded(!meterCategoryExpanded)}>
            {meterCategoryExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={meterCategoryExpanded}>
          <Box sx={{ p: 4, pt: 0 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {meterTypes.map((type) => (
                <Box
                  key={type.id}
                  onClick={() => handleMeterTypeToggle(type.id)}
                  sx={{
                    p: 2,
                    border: 2,
                    borderColor: selectedMeterTypes.includes(type.id) ? '#C72030' : 'grey.200',
                    bgcolor: selectedMeterTypes.includes(type.id) ? '#C72030' + '1A' : 'background.paper',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { borderColor: selectedMeterTypes.includes(type.id) ? '#C72030' : 'grey.300' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: 28,
                        borderColor: selectedMeterTypes.includes(type.id) ? '#C72030' : 'grey.300',
                        bgcolor: selectedMeterTypes.includes(type.id) ? '#C72030' : 'transparent',
                      }}
                    />
                    <Typography variant="body2">{type.label}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Collapse>

        {/* Consumption Asset Measure Section */}
        <SectionHeader>
          <SectionTitle>
            <Circle>5</Circle>
            <Typography variant="h6" sx={{ color: '#C72030', fontWeight: 'bold', textTransform: 'uppercase' }}>
              CONSUMPTION ASSET MEASURE
            </Typography>
          </SectionTitle>
          <IconButton onClick={() => setConsumptionExpanded(!consumptionExpanded)}>
            {consumptionExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={consumptionExpanded}>
          <Box sx={{ p: 4, pt: 0 }}>
            <Button
              startIcon={<Add />}
              onClick={handleAddConsumptionMeasure}
              sx={{ bgcolor: '#C72030', color: 'white', '&:hover': { bgcolor: '#C72030CC' }, mb: 2 }}
            >
              Add Consumption Measure
            </Button>
            {consumptionMeasures.map((measure) => (
              <Box key={measure.id} sx={{ p: 2, border: 1, borderColor: 'grey.200', borderRadius: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => handleRemoveConsumptionMeasure(measure.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 2 }}>
                  <TextField
                    label="Name"
                    value={measure.name}
                    onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'name', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Unit Type</InputLabel>
                    <Select
                      value={measure.unitType}
                      onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'unitType', e.target.value)}
                      label="Unit Type"
                    >
                      {unitTypes.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Min"
                    value={measure.min}
                    onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'min', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Max"
                    value={measure.max}
                    onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'max', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Alert Below Val."
                    value={measure.alertBelowVal}
                    onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <TextField
                    label="Alert Above Val."
                    value={measure.alertAboveVal}
                    onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Multiplier Factor"
                    value={measure.multiplierFactor}
                    onChange={(e) => handleUpdateConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={measure.checkPreviousReading}
                        onChange={(e) =>
                          handleUpdateConsumptionMeasure(measure.id, 'checkPreviousReading', e.target.checked)
                        }
                      />
                    }
                    label="Check Previous Reading"
                    sx={{ pt: 2 }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>

        {/* Non Consumption Asset Measure Section */}
        <SectionHeader>
          <SectionTitle>
            <Circle>6</Circle>
            <Typography variant="h6" sx={{ color: '#C72030', fontWeight: 'bold', textTransform: 'uppercase' }}>
              NON CONSUMPTION ASSET MEASURE
            </Typography>
          </SectionTitle>
          <IconButton onClick={() => setNonConsumptionExpanded(!nonConsumptionExpanded)}>
            {nonConsumptionExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={nonConsumptionExpanded}>
          <Box sx={{ p: 4, pt: 0 }}>
            <Button
              startIcon={<Add />}
              onClick={handleAddNonConsumptionMeasure}
              sx={{ bgcolor: '#C72030', color: 'white', '&:hover': { bgcolor: '#C72030CC' }, mb: 2 }}
            >
              Add Non-Consumption Measure
            </Button>
            {nonConsumptionMeasures.map((measure) => (
              <Box key={measure.id} sx={{ p: 2, border: 1, borderColor: 'grey.200', borderRadius: 1, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => handleRemoveNonConsumptionMeasure(measure.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <Close />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 2 }}>
                  <TextField
                    label="Name"
                    value={measure.name}
                    onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'name', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Unit Type</InputLabel>
                    <Select
                      value={measure.unitType}
                      onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'unitType', e.target.value)}
                      label="Unit Type"
                    >
                      {unitTypes.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                          {unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="Min"
                    value={measure.min}
                    onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'min', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Max"
                    value={measure.max}
                    onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'max', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Alert Below Val."
                    value={measure.alertBelowVal}
                    onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'alertBelowVal', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <TextField
                    label="Alert Above Val."
                    value={measure.alertAboveVal}
                    onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'alertAboveVal', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Multiplier Factor"
                    value={measure.multiplierFactor}
                    onChange={(e) => handleUpdateNonConsumptionMeasure(measure.id, 'multiplierFactor', e.target.value)}
                    fullWidth
                    variant="outlined"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={measure.checkPreviousReading}
                        onChange={(e) =>
                          handleUpdateNonConsumptionMeasure(measure.id, 'checkPreviousReading', e.target.checked)
                        }
                      />
                    }
                    label="Check Previous Reading"
                    sx={{ pt: 2 }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Collapse>

        {/* Attachments Section */}
        <SectionHeader>
          <SectionTitle>
            <Circle>7</Circle>
            <Typography variant="h6" sx={{ color: '#C72030', fontWeight: 'bold', textTransform: 'uppercase' }}>
              ATTACHMENTS
            </Typography>
          </SectionTitle>
          <IconButton onClick={() => setAttachmentsExpanded(!attachmentsExpanded)}>
            {attachmentsExpanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </SectionHeader>
        <Collapse in={attachmentsExpanded}>
          <Box sx={{ p: 4, pt: 0 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Manuals Upload
                </Typography>
                <FileUploadBox>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('manuals', e)}
                    style={{ display: 'none' }}
                    id="manuals-upload"
                  />
                  <label htmlFor="manuals-upload">
                    <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Add sx={{ fontSize: 24, color: 'grey.400', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        Click to upload files
                      </Typography>
                    </Box>
                  </label>
                </FileUploadBox>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Insurance Details
                </Typography>
                <FileUploadBox>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('insurance', e)}
                    style={{ display: 'none' }}
                    id="insurance-upload"
                  />
                  <label htmlFor="insurance-upload">
                    <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Add sx={{ fontSize: 24, color: 'grey.400', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        Click to upload files
                      </Typography>
                    </Box>
                  </label>
                </FileUploadBox>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Purchase Invoice
                </Typography>
                <FileUploadBox>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('invoice', e)}
                    style={{ display: 'none' }}
                    id="invoice-upload"
                  />
                  <label htmlFor="invoice-upload">
                    <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Add sx={{ fontSize: 24, color: 'grey.400', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        Click to upload files
                      </Typography>
                    </Box>
                  </label>
                </FileUploadBox>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  AMC
                </Typography>
                <FileUploadBox>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload('amc', e)}
                    style={{ display: 'none' }}
                    id="amc-upload"
                  />
                  <label htmlFor="amc-upload">
                    <Box sx={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Add sx={{ fontSize: 24, color: 'grey.400', mb: 1 }} />
                      <Typography variant="body2" sx={{ color: 'grey.500' }}>
                        Click to upload files
                      </Typography>
                    </Box>
                  </label>
                </FileUploadBox>
              </Box>
            </Box>
          </Box>
        </Collapse>

        {/* Action Buttons */}
        <Box sx={{ p: 4, display: 'flex', gap: 2 }}>
          <Button
            onClick={handleSaveAndShowDetails}
            sx={{ bgcolor: '#C72030', color: 'white', '&:hover': { bgcolor: '#C72030CC' }, px: 4 }}
          >
            Save & Show Details
          </Button>
          <Button
            onClick={handleSaveAndCreateNew}
            variant="outlined"
            sx={{
              borderColor: '#C72030',
              color: '#C72030',
              '&:hover': { bgcolor: '#C720301A', borderColor: '#C72030' },
              px: 4,
            }}
          >
            Save & Create New Asset
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
