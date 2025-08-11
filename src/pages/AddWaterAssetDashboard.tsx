import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select as MuiSelect, 
  FormControlLabel, 
  Radio, 
  RadioGroup as MuiRadioGroup,
  Checkbox as MuiCheckbox,
  FormLabel
} from '@mui/material';

export const AddWaterAssetDashboard = () => {
  const navigate = useNavigate();
  const [locationOpen, setLocationOpen] = useState(true);
  const [assetOpen, setAssetOpen] = useState(true);
  const [warrantyOpen, setWarrantyOpen] = useState(true);
  const [meterCategoryOpen, setMeterCategoryOpen] = useState(true);
  const [consumptionOpen, setConsumptionOpen] = useState(true);
  const [nonConsumptionOpen, setNonConsumptionOpen] = useState(true);
  const [attachmentsOpen, setAttachmentsOpen] = useState(true);

  const [formData, setFormData] = useState({
    site: '',
    building: '',
    wing: '',
    area: '',
    floor: '',
    room: '',
    assetName: '',
    assetNo: '',
    equipmentId: '',
    modelNo: '',
    serialNo: '',
    consumerNo: '',
    purchaseCost: '',
    capacity: '',
    unit: '',
    group: '',
    subgroup: '',
    purchasedOnDate: '',
    expiryDate: '',
    manufacturer: '',
    locationType: 'common',
    assetType: 'parent',
    status: 'inUse',
    critical: 'no',
    meterApplicable: false,
    underWarranty: 'no',
    warrantyStartDate: '',
    warrantyExpiresOn: '',
    commissioningDate: '',
    selectedMeterCategories: []
  });

  const [consumptionMeasures, setConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelowVal: '', alertAboveVal: '', multiplierFactor: '', checkPreviousReading: false }
  ]);

  const [nonConsumptionMeasures, setNonConsumptionMeasures] = useState([
    { name: '', unitType: '', min: '', max: '', alertBelowVal: '', alertAboveVal: '', multiplierFactor: '', checkPreviousReading: false }
  ]);

  const addConsumptionMeasure = () => {
    setConsumptionMeasures([...consumptionMeasures, { name: '', unitType: '', min: '', max: '', alertBelowVal: '', alertAboveVal: '', multiplierFactor: '', checkPreviousReading: false }]);
  };

  const removeConsumptionMeasure = (index: number) => {
    setConsumptionMeasures(consumptionMeasures.filter((_, i) => i !== index));
  };

  const addNonConsumptionMeasure = () => {
    setNonConsumptionMeasures([...nonConsumptionMeasures, { name: '', unitType: '', min: '', max: '', alertBelowVal: '', alertAboveVal: '', multiplierFactor: '', checkPreviousReading: false }]);
  };

  const removeNonConsumptionMeasure = (index: number) => {
    setNonConsumptionMeasures(nonConsumptionMeasures.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log('Saving asset:', formData);
    navigate('/utility/water');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new asset:', formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NEW ASSET</h1>
      </div>

      <div className="space-y-4">
        {/* Location Details */}
        <Card>
          <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    LOCATION DETAILS
                  </span>
                  {locationOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Site*</InputLabel>
                      <MuiSelect
                        value={formData.site}
                        label="Site*"
                        onChange={(e) => setFormData({...formData, site: e.target.value})}
                        sx={{ height: '45px' }}
                      >
                        <MenuItem value="site1">Site 1</MenuItem>
                        <MenuItem value="site2">Site 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Building</InputLabel>
                      <MuiSelect
                        value={formData.building}
                        label="Building"
                        onChange={(e) => setFormData({...formData, building: e.target.value})}
                        sx={{ height: '45px' }}
                      >
                        <MenuItem value="building1">Building 1</MenuItem>
                        <MenuItem value="building2">Building 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Wing</InputLabel>
                      <MuiSelect
                        value={formData.wing}
                        label="Wing"
                        onChange={(e) => setFormData({...formData, wing: e.target.value})}
                        sx={{ height: '45px' }}
                      >
                        <MenuItem value="wing1">Wing 1</MenuItem>
                        <MenuItem value="wing2">Wing 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Area</InputLabel>
                      <MuiSelect
                        value={formData.area}
                        label="Area"
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        sx={{ height: '45px' }}
                      >
                        <MenuItem value="area1">Area 1</MenuItem>
                        <MenuItem value="area2">Area 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Floor</InputLabel>
                      <MuiSelect
                        value={formData.floor}
                        label="Floor"
                        onChange={(e) => setFormData({...formData, floor: e.target.value})}
                        sx={{ height: '45px' }}
                      >
                        <MenuItem value="floor1">Floor 1</MenuItem>
                        <MenuItem value="floor2">Floor 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
                <div className="mt-4">
                  <FormControl size="small" sx={{ width: { xs: '100%', md: '20%' } }}>
                    <InputLabel>Room</InputLabel>
                    <MuiSelect
                      value={formData.room}
                      label="Room"
                      onChange={(e) => setFormData({...formData, room: e.target.value})}
                      sx={{ height: '45px' }}
                    >
                      <MenuItem value="room1">Room 1</MenuItem>
                      <MenuItem value="room2">Room 2</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Asset Details */}
        <Card>
          <Collapsible open={assetOpen} onOpenChange={setAssetOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    ASSET DETAILS
                  </span>
                  {assetOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <TextField
                      label="Asset Name*"
                      placeholder="Enter Text"
                      value={formData.assetName}
                      onChange={(e) => setFormData({...formData, assetName: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Asset No.*"
                      placeholder="Enter Number"
                      value={formData.assetNo}
                      onChange={(e) => setFormData({...formData, assetNo: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Equipment ID*"
                      placeholder="Enter Number"
                      value={formData.equipmentId}
                      onChange={(e) => setFormData({...formData, equipmentId: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Model No."
                      placeholder="Enter Number"
                      value={formData.modelNo}
                      onChange={(e) => setFormData({...formData, modelNo: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Serial No."
                      placeholder="Enter Number"
                      value={formData.serialNo}
                      onChange={(e) => setFormData({...formData, serialNo: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Consumer No."
                      placeholder="Enter Number"
                      value={formData.consumerNo}
                      onChange={(e) => setFormData({...formData, consumerNo: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Purchase Cost*"
                      placeholder="Enter Numeric value"
                      value={formData.purchaseCost}
                      onChange={(e) => setFormData({...formData, purchaseCost: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Capacity"
                      placeholder="Enter Text"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Unit"
                      placeholder="Enter Text"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Group*</InputLabel>
                      <MuiSelect
                        value={formData.group}
                        label="Group*"
                        onChange={(e) => setFormData({...formData, group: e.target.value})}
                        sx={{ height: '45px' }}
                      >
                        <MenuItem value="group1">Group 1</MenuItem>
                        <MenuItem value="group2">Group 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Subgroup*</InputLabel>
                      <MuiSelect
                        value={formData.subgroup}
                        label="Subgroup*"
                        onChange={(e) => setFormData({...formData, subgroup: e.target.value})}
                        sx={{ height: '45px' }}
                      >
                        <MenuItem value="subgroup1">SubGroup 1</MenuItem>
                        <MenuItem value="subgroup2">SubGroup 2</MenuItem>
                      </MuiSelect>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      label="Purchased ON Date"
                      type="date"
                      value={formData.purchasedOnDate}
                      onChange={(e) => setFormData({...formData, purchasedOnDate: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <TextField
                      label="Expiry date"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div>
                    <TextField
                      label="Manufacturer"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-4">
                  <div>
                    <FormLabel>Location Type</FormLabel>
                    <MuiRadioGroup 
                      value={formData.locationType} 
                      onChange={(e) => setFormData({...formData, locationType: e.target.value})}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="common" control={<Radio />} label="Common Area" />
                      <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                      <FormControlLabel value="na" control={<Radio />} label="NA" />
                    </MuiRadioGroup>
                  </div>

                  <div>
                    <FormLabel>Asset Type</FormLabel>
                    <MuiRadioGroup 
                      value={formData.assetType} 
                      onChange={(e) => setFormData({...formData, assetType: e.target.value})}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="parent" control={<Radio />} label="Parent" />
                      <FormControlLabel value="sub" control={<Radio />} label="Sub" />
                    </MuiRadioGroup>
                  </div>

                  <div>
                    <FormLabel>Status</FormLabel>
                    <MuiRadioGroup 
                      value={formData.status} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="inUse" control={<Radio />} label="In Use" />
                      <FormControlLabel value="breakdown" control={<Radio />} label="Breakdown" />
                    </MuiRadioGroup>
                  </div>

                  <div>
                    <FormLabel>Critical</FormLabel>
                    <MuiRadioGroup 
                      value={formData.critical} 
                      onChange={(e) => setFormData({...formData, critical: e.target.value})}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </MuiRadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <FormControlLabel
                      control={
                        <MuiCheckbox 
                          checked={formData.meterApplicable}
                          onChange={(e) => setFormData({...formData, meterApplicable: e.target.checked})}
                        />
                      }
                      label="Meter Applicable"
                    />
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Warranty Details */}
        <Card>
          <Collapsible open={warrantyOpen} onOpenChange={setWarrantyOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    Warranty Details
                  </span>
                  {warrantyOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <FormLabel>Under Warranty</FormLabel>
                    <MuiRadioGroup 
                      value={formData.underWarranty} 
                      onChange={(e) => setFormData({...formData, underWarranty: e.target.value})}
                      row
                      sx={{ mt: 1 }}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </MuiRadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <TextField
                        label="Warranty Start Date"
                        type="date"
                        value={formData.warrantyStartDate}
                        onChange={(e) => setFormData({...formData, warrantyStartDate: e.target.value})}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Warranty expires on"
                        type="date"
                        value={formData.warrantyExpiresOn}
                        onChange={(e) => setFormData({...formData, warrantyExpiresOn: e.target.value})}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                    <div>
                      <TextField
                        label="Commissioning Date"
                        type="date"
                        value={formData.commissioningDate}
                        onChange={(e) => setFormData({...formData, commissioningDate: e.target.value})}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Meter Category Type */}
        <Card>
          <Collapsible open={meterCategoryOpen} onOpenChange={setMeterCategoryOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">9</span>
                    Meter Category Type
                  </span>
                  {meterCategoryOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {['Board', 'DG', 'Renewable', 'Fresh Water', 'Recycled', 'IEX-GDAM'].map((category) => (
                    <div key={category} className="flex items-center space-x-2 bg-purple-100 p-3 rounded">
                      <FormControlLabel
                        control={
                          <MuiCheckbox 
                            checked={formData.selectedMeterCategories.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData, 
                                  selectedMeterCategories: [...formData.selectedMeterCategories, category]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedMeterCategories: formData.selectedMeterCategories.filter(c => c !== category)
                                });
                              }
                            }}
                          />
                        }
                        label={category}
                        sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Consumption Asset Measure */}
        <Card>
          <Collapsible open={consumptionOpen} onOpenChange={setConsumptionOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    CONSUMPTION ASSET MEASURE
                  </span>
                  {consumptionOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {consumptionMeasures.map((measure, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded mb-4">
                    <div className="flex justify-end">
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeConsumptionMeasure(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <TextField
                          label="Name"
                          placeholder="Enter Text"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <FormControl fullWidth size="small">
                          <InputLabel>Unit Type</InputLabel>
                          <MuiSelect
                            label="Unit Type"
                            sx={{ height: '45px' }}
                          >
                            <MenuItem value="kw">KW</MenuItem>
                            <MenuItem value="kwh">KWH</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          label="Min"
                          placeholder="Enter Number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Max"
                          placeholder="Enter Number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Alert Below Val."
                          placeholder="Enter Value"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          label="Alert Above Val."
                          placeholder="Enter Value"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Multiplier Factor"
                          placeholder="Enter Text"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormControlLabel
                        control={<MuiCheckbox />}
                        label="Check Previous Reading"
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addConsumptionMeasure}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Non Consumption Asset Measure */}
        <Card>
          <Collapsible open={nonConsumptionOpen} onOpenChange={setNonConsumptionOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    NON CONSUMPTION ASSET MEASURE
                  </span>
                  {nonConsumptionOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                {nonConsumptionMeasures.map((measure, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded mb-4">
                    <div className="flex justify-end">
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeNonConsumptionMeasure(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <TextField
                          label="Name"
                          placeholder="Name"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <FormControl fullWidth size="small">
                          <InputLabel>Unit Type</InputLabel>
                          <MuiSelect
                            label="Unit Type"
                            sx={{ height: '45px' }}
                          >
                            <MenuItem value="kw">KW</MenuItem>
                            <MenuItem value="kwh">KWH</MenuItem>
                          </MuiSelect>
                        </FormControl>
                      </div>
                      <div>
                        <TextField
                          label="Min"
                          placeholder="Min"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Max"
                          placeholder="Max"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Alert Below Val."
                          placeholder="Alert Below Value"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <TextField
                          label="Alert Above Val."
                          placeholder="Alert Above Value"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                      <div>
                        <TextField
                          label="Multiplier Factor"
                          placeholder="Multiplier Factor"
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ '& .MuiOutlinedInput-root': { height: '45px' } }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FormControlLabel
                        control={<MuiCheckbox />}
                        label="Check Previous Reading"
                      />
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  onClick={addNonConsumptionMeasure}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Attachments */}
        <Card>
          <Collapsible open={attachmentsOpen} onOpenChange={setAttachmentsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between text-orange-600">
                  <span className="flex items-center gap-2">
                    <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                    ATTACHMENTS
                  </span>
                  {attachmentsOpen ? <ChevronUp /> : <ChevronDown />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel className="mb-2 block">Manuals Upload</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-purple-50">
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <FormLabel className="mb-2 block">Insurance Details</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-purple-50">
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <FormLabel className="mb-2 block">Purchase Invoice</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-purple-50">
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <FormLabel className="mb-2 block">AMC</FormLabel>
                    <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-purple-50">
                      <div className="text-orange-500 mb-2">Choose File</div>
                      <div className="text-gray-500 text-sm">No file chosen</div>
                      <Button variant="ghost" className="mt-2 text-orange-500">
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2">
                        <Button variant="ghost" className="text-orange-500">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={handleSave}
            className="bg-purple-600 text-white hover:bg-purple-700 border-purple-600"
          >
            Save & Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            className="bg-purple-700 text-white hover:bg-purple-800"
          >
            Save & Create New Asset
          </Button>
        </div>
      </div>
    </div>
  );
};
