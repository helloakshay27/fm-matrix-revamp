import { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
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
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#ffffff !important',
  },
};

const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const AddTestimonialModal = ({ isOpen, onClose, fetchData, isEditing, record }: AddTestimonialModalProps) => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  const { sites } = useAppSelector(state => state.site);

  const [formData, setFormData] = useState({
    site: [] as (string | number)[],
    name: '',
    designation: '',
    companyName: '',
    description: '',
  });

  const [attachmentPreview, setAttachmentPreview] = useState<{ file?: File; preview: string } | null>(null);

  useEffect(() => {
    if (isEditing && record) {
      setFormData((prev) => ({
        ...prev,
        name: record.name,
        designation: record.designation,
        companyName: record.company_name,
        description: record.description,
      }));
      setAttachmentPreview({ file: undefined, preview: record?.video_preview_image });
    }
  }, [record, isEditing]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSiteChange = (event: SelectChangeEvent<(string | number)[]>) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      site: typeof value === 'string' ? value.split(',') : value,
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
        payload.append('testimonial[site_ids][]', String(site));
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
    });
    setAttachmentPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth sx={{ '& .MuiPaper-root': { borderRadius: '24px' } }}>
      <DialogContent className="!bg-white" sx={{ padding: '28px' }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-semibold">{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
          <IconButton onClick={handleClose} size="small" aria-label="Close">
            <Close fontSize="small" />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <FormControl fullWidth variant="outlined">
              <InputLabel id="testimonial-site-label">Site *</InputLabel>
              <Select
                labelId="testimonial-site-label"
                multiple
                label="Site *"
                name="site"
                value={formData.site}
                onChange={handleSiteChange}
                displayEmpty
                sx={fieldStyles}
                MenuProps={selectMenuProps}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <em className="text-gray-400">Select Site</em>;
                  }
                  return selected
                    .map((value) => sites.find((option) => String(option.id) === String(value))?.name)
                    .filter(Boolean)
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
          )}

          <TextField
            label="Name *"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldStyles, mt: 1 }}
          />

          <TextField
            label="Designation *"
            name="designation"
            type="text"
            value={formData.designation}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldStyles, mt: 1 }}
          />

          <TextField
            label="Company Name *"
            name="companyName"
            type="text"
            value={formData.companyName}
            onChange={handleFormChange}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{ ...fieldStyles, mt: 1 }}
          />

          <TextField
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            multiline
            minRows={3}
            type="text"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#ffffff !important',
                height: 'auto !important',
              },
            }}
          />

          <Box>
            <label className="mb-1.5 block text-[12px] font-semibold text-gray-700">Attachment</label>

            <div>
              <input
                type="file"
                accept="image/*,application/pdf,.xlsx,.xls"
                className="hidden"
                id="file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:bg-[var(--color-surface)] p-8 text-center transition-colors">
                  <span className="text-gray-600">
                    Drag & Drop or{" "}
                    <span className="text-[var(--color-text)] font-medium underline">Choose file</span>{" "}
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
                      backgroundColor: 'hsl(var(--background))',
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
                        '&:hover': { backgroundColor: 'hsl(var(--destructive))', color: 'white' },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </div>
          </Box>

          <div className="fm-action-bar pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="fm-action-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="fm-action-primary"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
