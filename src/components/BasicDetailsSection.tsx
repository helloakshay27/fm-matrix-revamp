import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomTextField } from '@/components/ui/custom-text-field';

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

  return (
    <Card className="mb-6">
      <CardHeader 
        className="flex flex-row items-center gap-5 py-[50px] px-[50px]"
      >
        <div 
          className="flex items-center justify-center"
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#C72030',
            borderRadius: '50%'
          }}
        >
          <span 
            className="flex items-center justify-center"
            style={{
              width: '18px',
              height: '18px',
              color: '#FFFFFF'
            }}
          >
            ⚙
          </span>
        </div>
        <CardTitle 
          className="font-['Work_Sans']"
          style={{
            fontSize: '26px',
            fontWeight: '600',
            lineHeight: 'auto',
            letterSpacing: '0%',
            color: '#C72030',
            backgroundColor: '#FFFFFF',
            paddingLeft: '20px',
            textAlign: 'center',
            textTransform: 'uppercase'
          }}
        >
          BASIC DETAILS
        </CardTitle>
      </CardHeader>
      <CardContent className="px-[50px] py-[50px]">
        {/* First row - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[50px] gap-y-[40px] mb-[40px]">
          <div className="flex flex-col space-y-3">
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
          </div>

          <div className="flex flex-col space-y-3">
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
          </div>

          <div className="flex flex-col space-y-3">
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
                <MenuItem value="godrej-prime">Godrej Prime,Gurgaon</MenuItem>
              </MuiSelect>
            </FormControl>
          </div>
        </div>

        {/* Second row - 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[50px] gap-y-[40px] mb-[40px]">
          <div className="flex flex-col space-y-3">
            <CustomTextField
              label="Location"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
          </div>

          <div className="flex flex-col space-y-3">
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
          </div>

          <div className="flex flex-col space-y-3">
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
        </div>

        {/* Third row - 2 columns for responsive text areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[50px] gap-y-[40px] mb-[40px]">
          <div className="flex flex-col space-y-3">
            <CustomTextField
              label="Observation"
              placeholder="Enter Observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  // Desktop (default)
                  width: '100%',
                  minHeight: '72px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0px',
                  '& fieldset': {
                    borderColor: '#C72030',
                    borderRadius: '0px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#C72030',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C72030',
                    borderWidth: '2px',
                  },
                  '& textarea': {
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#C72030',
                    opacity: 1,
                    padding: '12px',
                    '&::placeholder': {
                      color: '#C72030',
                      opacity: 0.7,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#C72030',
                  '&.Mui-focused': {
                    color: '#C72030',
                  },
                  '&.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                    backgroundColor: '#FFFFFF',
                    padding: '0 4px',
                  },
                },
                // Tablet breakpoint
                '@media (max-width: 1024px)': {
                  '& .MuiOutlinedInput-root': {
                    minHeight: '56px',
                    '& textarea': {
                      fontSize: '12px',
                      padding: '12px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                  },
                },
                // Mobile breakpoint
                '@media (max-width: 768px)': {
                  '& .MuiOutlinedInput-root': {
                    minHeight: '44px',
                    '& textarea': {
                      fontSize: '8px',
                      padding: '8px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '10px',
                  },
                },
              }}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <CustomTextField
              label="Recommendation"
              placeholder="Enter Recommendation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              fullWidth
              multiline
              rows={2}
              sx={{
                '& .MuiOutlinedInput-root': {
                  // Desktop (default)
                  width: '100%',
                  minHeight: '72px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0px',
                  '& fieldset': {
                    borderColor: '#C72030',
                    borderRadius: '0px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#C72030',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#C72030',
                    borderWidth: '2px',
                  },
                  '& textarea': {
                    fontSize: '14px',
                    fontWeight: 400,
                    color: '#C72030',
                    opacity: 1,
                    padding: '12px',
                    '&::placeholder': {
                      color: '#C72030',
                      opacity: 0.7,
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#C72030',
                  '&.Mui-focused': {
                    color: '#C72030',
                  },
                  '&.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -9px) scale(0.75)',
                    backgroundColor: '#FFFFFF',
                    padding: '0 4px',
                  },
                },
                // Tablet breakpoint
                '@media (max-width: 1024px)': {
                  '& .MuiOutlinedInput-root': {
                    minHeight: '56px',
                    '& textarea': {
                      fontSize: '12px',
                      padding: '12px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '14px',
                  },
                },
                // Mobile breakpoint
                '@media (max-width: 768px)': {
                  '& .MuiOutlinedInput-root': {
                    minHeight: '44px',
                    '& textarea': {
                      fontSize: '8px',
                      padding: '8px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '10px',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Checkbox section */}
        <div>
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
