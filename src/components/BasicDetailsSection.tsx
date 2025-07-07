import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextareaAutosize,
  TextField
} from '@mui/material';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from 'lucide-react';

interface BasicDetailsSectionProps {
  category: string;
  setCategory: (value: string) => void;
  subCategory: string;
  setSubCategory: (value: string) => void;
  site: string;
  setSite: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  categorization: string;
  setCategorization: (value: string) => void;
  observation: string;
  setObservation: (value: string) => void;
  recommendation: string;
  setRecommendation: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  mustHave: boolean;
  handleMustHaveChange: (checked: boolean | "indeterminate") => void;
}

export const BasicDetailsSection: React.FC<BasicDetailsSectionProps> = ({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  site,
  setSite,
  location,
  setLocation,
  categorization,
  setCategorization,
  observation,
  setObservation,
  recommendation,
  setRecommendation,
  tag,
  setTag,
  mustHave,
  handleMustHaveChange
}) => {
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const textareaStyle = {
    width: '100%',
    fontSize: '16px',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontFamily: 'inherit',
    resize: 'vertical',
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center px-4 sm:px-6 md:px-[50px]">
        <div className="flex items-center justify-center border border-[#C72030] w-10 h-10 rounded-full">
          <Settings size={18} color="#C72030" />
        </div>
        <CardTitle className="pl-4 text-lg sm:text-xl md:text-2xl font-semibold uppercase text-black font-['Work_Sans']">
          Basic Details
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 sm:px-6 md:px-[50px]">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <FormControl fullWidth variant="outlined">
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

          <FormControl fullWidth variant="outlined">
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

          <FormControl fullWidth variant="outlined">
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
              <MenuItem value="godrej-prime">Godrej Prime, Gurgaon</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <TextField
            label="Location"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={fieldStyles}
          />

          <FormControl fullWidth variant="outlined">
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

          <FormControl fullWidth variant="outlined">
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

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Observation</label>
            <TextareaAutosize
              minRows={4}
              placeholder="Enter Observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              style={textareaStyle}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Recommendation</label>
            <TextareaAutosize
              minRows={4}
              placeholder="Enter Recommendation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              style={textareaStyle}
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="mt-4">
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
  );
};
