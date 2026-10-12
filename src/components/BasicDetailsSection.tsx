
import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  TextField
} from '@mui/material';
import { Checkbox } from "@/components/ui/checkbox";
import { Paperclip, Settings } from 'lucide-react';
import { FormSection, assetFieldStyles } from '@/components/common/FormSection';
import { AttachmentUpload } from '@/components/common/AttachmentUpload';

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

// Add Asset page jaisa multiline field
const textareaSx = {
  "& .MuiOutlinedInput-root": { height: "auto !important", padding: "2px !important" },
};

const requiredLabel = (text: string) => (
  <span>{text}<span className="fm-required-mark">*</span></span>
);

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
  const handleFilesSelected = (newFiles: File[]) => {
    onAttachmentsChange([...attachments, ...newFiles]);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const updatedAttachments = attachments.filter((_, index) => index !== indexToRemove);
    onAttachmentsChange(updatedAttachments);
  };

  return (
    <>
      <FormSection title="BASIC DETAILS" icon={Settings}>
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-label" shrink>{requiredLabel('Category')}</InputLabel>
            <MuiSelect
              labelId="category-label"
              label="Category*"
              notched
              displayEmpty
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={assetFieldStyles}
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
              notched
              displayEmpty
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              sx={assetFieldStyles}
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
            <InputLabel id="site-label" shrink>{requiredLabel('Site')}</InputLabel>
            <MuiSelect
              labelId="site-label"
              label="Site*"
              notched
              displayEmpty
              value={site}
              onChange={(e) => setSite(e.target.value)}
              sx={assetFieldStyles}
            >
              <MenuItem value=""><em>Select Site</em></MenuItem>
              {siteList.map((s) => (
                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <TextField
            label="Location"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: assetFieldStyles }}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="categorization-label" shrink>{requiredLabel('Categorization')}</InputLabel>
            <MuiSelect
              labelId="categorization-label"
              label="Categorization*"
              notched
              displayEmpty
              value={categorization}
              onChange={(e) => setCategorization(e.target.value)}
              sx={assetFieldStyles}
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
              notched
              displayEmpty
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              sx={assetFieldStyles}
            >
              <MenuItem value=""><em>Select Tag</em></MenuItem>
              <MenuItem value="workaround">Workaround</MenuItem>
              <MenuItem value="Learning for the future project">Learning for the future project</MenuItem>
            </MuiSelect>
          </FormControl>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <TextField
            label="Observation"
            placeholder="Enter Observation"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={textareaSx}
          />
          <TextField
            label="Recommendation"
            placeholder="Enter Recommendation"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={textareaSx}
          />
        </div>

        {/* Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="mustHave"
            checked={mustHave}
            onCheckedChange={handleMustHaveChange}
            className="border-brand data-[state=checked]:bg-brand data-[state=checked]:text-white"
          />
          <label htmlFor="mustHave" className="text-sm font-medium">
            Must Have
          </label>
        </div>
      </FormSection>

      <FormSection title="ATTACHMENTS" icon={Paperclip}>
        <AttachmentUpload
          label="Attachments"
          chooseText="Choose Files"
          uploadText="Upload Files"
          accept=".png,.jpg,.jpeg,.pdf"
          multiple
          files={attachments}
          onFilesSelected={handleFilesSelected}
          onRemove={handleRemoveFile}
        />
      </FormSection>
    </>
  );
};
