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

export const AddEnergyAssetDashboard = () => {
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
    selectedMeterCategory: '',
    boardSubCategory: '',
    renewableSubCategory: '',
    dgSubCategory: ''
  });

  const handleSave = () => {
    console.log('Saving energy asset:', formData);
    navigate('/utility/energy');
  };

  const handleSaveAndCreateNew = () => {
    console.log('Saving and creating new energy asset:', formData);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NEW ENERGY ASSET</h1>
      </div>

      <div className="space-y-4">
        {/* Location Details */}
        <Card>
          <Collapsible open={locationOpen} onOpenChange={setLocationOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
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
                        <MenuItem value="electrical">Electrical Room</MenuItem>
                        <MenuItem value="generator">Generator Area</MenuItem>
                        <MenuItem value="substation">Sub-station</MenuItem>
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

        {/* Energy Asset Details */}
        <Card>
          <Collapsible open={assetOpen} onOpenChange={setAssetOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-black">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                    ENERGY ASSET DETAILS
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
                      placeholder="Enter Energy Asset Name"
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
                      label="Power Capacity"
                      placeholder="Enter Power Rating"
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
                      placeholder="KW/MW/KVA"
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
                        <MenuItem value="electrical">Electrical Equipment</MenuItem>
                        <MenuItem value="generator">Generator</MenuItem>
                        <MenuItem value="transformer">Transformer</MenuItem>
                        <MenuItem value="solar">Solar Equipment</MenuItem>
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
                        <MenuItem value="panel">Panel</MenuItem>
                        <MenuItem value="meter">Energy Meter</MenuItem>
                        <MenuItem value="switchgear">Switchgear</MenuItem>
                        <MenuItem value="ups">UPS</MenuItem>
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
                      <FormControlLabel value="maintenance" control={<Radio />} label="Under Maintenance" />
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

                  <div>
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

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <Button 
            onClick={handleSave}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8"
          >
            Save and Show Details
          </Button>
          <Button 
            onClick={handleSaveAndCreateNew}
            variant="outline"
            className="border-orange-600 text-orange-600 hover:bg-orange-50 px-8"
          >
            Save and Create New
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEnergyAssetDashboard;