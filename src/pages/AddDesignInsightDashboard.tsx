
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { CustomTextField } from '@/components/ui/custom-text-field';
import { useToast } from '@/hooks/use-toast';

export const AddDesignInsightDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [site, setSite] = useState('');
  const [location, setLocation] = useState('');
  const [categorization, setCategorization] = useState('');
  const [observation, setObservation] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [tag, setTag] = useState('');
  const [mustHave, setMustHave] = useState(false);

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const handleSave = () => {
    console.log('Design Insight saved:', {
      category,
      subCategory,
      site,
      location,
      categorization,
      observation,
      recommendation,
      tag,
      mustHave
    });
    toast({
      title: "Success",
      description: "Design Insight saved successfully!",
    });
    navigate('/transitioning/design-insight');
  };

  const handleBack = () => {
    navigate('/transitioning/design-insight');
  };

  const handleMustHaveChange = (checked: boolean | "indeterminate") => {
    setMustHave(checked === true);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4">
        <span className="text-sm text-gray-600">Design Insight &gt; NEW Design Insight</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">NEW DESIGN INSIGHT</h1>
      </div>

      {/* Basic Details Section */}
      <Card className="mb-6">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">⚙</span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            <div className="flex flex-col">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="category-label" shrink>Category*</InputLabel>
                <MuiSelect
                  labelId="category-label"
                  label="Category*"
                  displayEmpty
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  <MenuItem value="landscape">Landscape</MenuItem>
                  <MenuItem value="facade">Façade</MenuItem>
                  <MenuItem value="security">Security & surveillance</MenuItem>
                  <MenuItem value="inside-units">Inside Units</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="flex flex-col">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="sub-category-label" shrink>Sub-category</InputLabel>
                <MuiSelect
                  labelId="sub-category-label"
                  label="Sub-category"
                  displayEmpty
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Sub Category</em></MenuItem>
                  <MenuItem value="access-control">Access Control</MenuItem>
                  <MenuItem value="cctv">CCTV</MenuItem>
                  <MenuItem value="bedroom">Bedroom</MenuItem>
                  <MenuItem value="entry-exit">Entry-Exit</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="flex flex-col">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="site-label" shrink>Site*</InputLabel>
                <MuiSelect
                  labelId="site-label"
                  label="Site*"
                  displayEmpty
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Site</em></MenuItem>
                  <MenuItem value="lockated">Lockated</MenuItem>
                  <MenuItem value="godrej-prime">Godrej Prime,Gurgaon</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="flex flex-col">
              <CustomTextField
                label="Location"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                fullWidth
              />
            </div>

            <div className="flex flex-col">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="categorization-label" shrink>Categorization*</InputLabel>
                <MuiSelect
                  labelId="categorization-label"
                  label="Categorization*"
                  displayEmpty
                  value={categorization}
                  onChange={(e) => setCategorization(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Categorization</em></MenuItem>
                  <MenuItem value="safety">Safety</MenuItem>
                  <MenuItem value="workaround">Workaround</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>

            <div className="flex flex-col">
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel id="tag-label" shrink>Tag</InputLabel>
                <MuiSelect
                  labelId="tag-label"
                  label="Tag"
                  displayEmpty
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  sx={fieldStyles}
                >
                  <MenuItem value=""><em>Select Tag</em></MenuItem>
                  <MenuItem value="workaround">Workaround</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="minor">Minor</MenuItem>
                </MuiSelect>
              </FormControl>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-8">
            <div className="flex flex-col">
              <CustomTextField
                label="Observation"
                placeholder="Enter Observation"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            </div>

            <div className="flex flex-col">
              <CustomTextField
                label="Recommendation"
                placeholder="Enter Recommendation"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                fullWidth
                multiline
                rows={4}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mustHave" 
                checked={mustHave}
                onCheckedChange={handleMustHaveChange}
              />
              <label htmlFor="mustHave" className="text-sm font-medium">
                Must Have
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card className="mb-6">
        <CardHeader className="bg-orange-100">
          <CardTitle className="text-orange-600 flex items-center gap-2">
            <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">📎</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div>
            <div className="mt-2 border-2 border-dashed border-orange-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Drag & Drop or <span className="text-orange-600 cursor-pointer">Choose File</span>
              </p>
              <p className="text-sm text-gray-400 mt-1">No file chosen</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button 
          onClick={handleSave}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
        >
          Save
        </Button>
        <Button 
          onClick={handleBack}
          variant="outline"
          className="border-gray-300 text-gray-700 px-8"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddDesignInsightDashboard;
