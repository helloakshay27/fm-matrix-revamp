
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Box, Dialog, DialogContent, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toast } from 'sonner';
import { createTestimonial, editTestimonial } from '@/store/slices/testimonialSlice';

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  fetchData: () => void;
  isEditing?: boolean;
  record?: any;
}

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

export const AddTestimonialModal = ({ isOpen, onClose, fetchData, isEditing, record }: AddTestimonialModalProps) => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  const { sites } = useAppSelector(state => state.site);

  const [formData, setFormData] = useState({
    site: [],
    name: '',
    designation: '',
    companyName: '',
    description: '',
  });

  const [attachmentPreview, setAttachmentPreview] = useState<{ file?: File; preview: string } | null>(null);

  useEffect(() => {
    if (isEditing && record) {
      setFormData({
        ...formData,
        name: record.name,
        designation: record.designation,
        companyName: record.company_name,
        description: record.description,
      })
      setAttachmentPreview({ file: undefined, preview: record?.video_preview_image })
    }
  }, [record, isEditing])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
      setAttachmentPreview({ file, preview });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    if (isEditing) {
      payload.append('testimonial[site_ids][]', localStorage.getItem("selectedSiteId") || '');
      payload.append('testimonial[name]', formData.name);
      payload.append('testimonial[designation]', formData.designation);
      payload.append('testimonial[company_name]', formData.companyName);
      payload.append('testimonial[description]', formData.description);
      if (attachmentPreview?.file) {
        payload.append('testimonial_image', attachmentPreview.file);
      }

      try {
        const response = await dispatch(editTestimonial({ baseUrl, token, data: payload, id: record.id })).unwrap();
        toast.success(response.message);
        fetchData();
        handleClose();
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    } else {
      formData.site.forEach((site) => {
        payload.append('testimonial[site_ids][]', site);
      });
      payload.append('testimonial[name]', formData.name);
      payload.append('testimonial[designation]', formData.designation);
      payload.append('testimonial[company_name]', formData.companyName);
      payload.append('testimonial[description]', formData.description);
      if (attachmentPreview?.file) {
        payload.append('testimonial_image', attachmentPreview.file);
      }
      payload.append('testimonial[active]', String(1));

      try {
        const response = await dispatch(createTestimonial({ baseUrl, token, data: payload })).unwrap();
        toast.success(response.message);
        fetchData();
        handleClose();
      } catch (error) {
        console.log(error);
        toast.dismiss();
        toast.error(error);
      }
    }
  };

  const handleRemoveAttachment = () => {
    setAttachmentPreview(null);
  };

  const handleClose = () => {
    setFormData({
      site: [],
      name: '',
      designation: '',
      companyName: '',
      description: '',
    })
    setAttachmentPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogContent>
        <div>
          <h1 className='text-xl mb-6 mt-2 font-semibold'>{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {
            !isEditing && (
              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                <InputLabel shrink>Site</InputLabel>
                <Select
                  multiple
                  label="Site"
                  name="site"
                  value={formData.site}
                  onChange={handleFormChange}
                  displayEmpty
                  sx={fieldStyles}
                  renderValue={(selected) => {
                    if (selected.length === 0) {
                      return <em>Select Site</em>;
                    }
                    return selected
                      .map((value) => sites.find((option) => option.id === value)?.name)
                      .join(', ');
                  }}
                >
                  {sites.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )
          }

          <TextField
            label="Name*"
            name="name"
            type='text'
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="Designation*"
            name="designation"
            type='text'
            value={formData.designation}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="Company Name*"
            name="companyName"
            type='text'
            value={formData.companyName}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{ mt: 1 }}
          />

          <TextField
            label="Description*"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            multiline
            rows={2}
            type='text'
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: fieldStyles }}
            sx={{
              mt: 1,
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

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, color: 'hsl(var(--label-text))', fontWeight: 500 }}>
              Attachment
            </Typography>

            <div>
              <input
                type="file"
                accept="image/*,application/pdf,.xlsx,.xls"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-orange-50 hover:bg-orange-100 transition-colors">
                  <span className="text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-red-500 underline">Choose file</span>{" "}
                  </span>
                </div>
              </label>

              {attachmentPreview && (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      border: '1px solid hsl(var(--form-border))',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'hsl(var(--background))'
                    }}
                  >
                    <img
                      src={attachmentPreview.preview}
                      alt={attachmentPreview.file?.name || 'Attachment'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={handleRemoveAttachment}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: 'hsl(var(--background))',
                        '&:hover': { backgroundColor: 'hsl(var(--destructive))', color: 'white' }
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </div>
          </Box>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
