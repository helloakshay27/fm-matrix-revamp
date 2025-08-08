
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
import { Button, Box, Typography, IconButton } from '@mui/material';
import { Upload, X } from 'lucide-react';

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
  siteList: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  subCategories: { id: number; name: string; parent_id: number | null }[];
  attachments: File[];
  onAttachmentsChange: (files: File[]) => void;
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
  handleMustHaveChange,
  attachments,
  onAttachmentsChange,
  siteList = [],
  categories = [],
  subCategories = [],
}) => {
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    fontSize: '16px',
    padding: '12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontFamily: 'inherit',
    resize: 'vertical' as const,
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      onAttachmentsChange([...attachments, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedAttachments = attachments.filter((_, index) => index !== indexToRemove);
    onAttachmentsChange(updatedAttachments);
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
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
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
              disabled={!category}
            >
              <MenuItem value=""><em>Select Sub Category</em></MenuItem>
              {subCategories
                .filter((sc) => String(sc.parent_id) === String(category))
                .map((sc) => (
                  <MenuItem key={sc.id} value={sc.id}>{sc.name}</MenuItem>
                ))}
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
              {siteList.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
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
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Customer Experience">Customer Experience</MenuItem>
              <MenuItem value="CAM">CAM</MenuItem>
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
              <MenuItem value="Learning for the future project">Learning for the future project</MenuItem>

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
              style={{
                borderColor: '#C72030',
                backgroundColor: mustHave ? '#C72030' : 'transparent'
              }}
            />
            <label htmlFor="mustHave" className="text-sm font-medium">
              Must Have
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Attachments
          </label>
          <Box
            sx={{
              border: '2px dashed #dc2626',
              borderRadius: '6px',
              backgroundColor: '#f9fafb',
              minHeight: '96px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f3f4f6',
              },
            }}
            onClick={() => document.getElementById('file-upload-attachments')?.click()}
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <Typography variant="body2" sx={{ color: '#374151', textAlign: 'center' }}>
              Click to upload files or drag and drop
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', textAlign: 'center' }}>
              PNG, JPG, PDF up to 10MB
            </Typography>
            <input
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf"
              id="file-upload-attachments"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <Button
              variant="outlined"
              size="small"
              sx={{
                mt: 1,
                borderColor: '#dc2626',
                color: '#dc2626',
                '&:hover': {
                  borderColor: '#b91c1c',
                  backgroundColor: 'rgba(220, 38, 38, 0.04)',
                },
              }}
            >
              Choose Files
            </Button>
          </Box>

          {/* Preview Section */}
          {attachments && attachments?.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected Files ({attachments.length})
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: 2,
                }}
              >
                {attachments.map((file, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: '100%',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f3f4f6',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb',
                        }}
                      >
                        <Typography variant="caption">{file.name}</Typography>
                      </Box>
                    )}
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#dc2626',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#b91c1c',
                        },
                      }}
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X size={16} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
