import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Autocomplete, TextFieldProps, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'sonner';
import { gateNumberService } from '@/services/gateNumberService';
import { SectionCard } from '@/components/survey/SectionCard';
import { ArrowLeft } from 'lucide-react';

interface GateNumberFormValues {
  gate_number: string;
  company_id: number | null;
  pms_site_id: number | null;
  building_id: number | null;
  status: string;
}

interface DropdownOption {
  id: number;
  name: string;
}

export interface SectionCardProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  // other props if any
}

const AddGateNumberPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const [sites, setSites] = useState<DropdownOption[]>([]);
  const [projects, setProjects] = useState<DropdownOption[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
  } = useForm<GateNumberFormValues>({
    defaultValues: {
      gate_number: '',
      company_id: null,
      pms_site_id: null,
      building_id: null,
      status: "Active",
    },
  });

  const siteId = watch("pms_site_id");

  const fetchDropdownData = useCallback(async () => {
    try {
      const [companiesData, sitesData] = await Promise.all([
        gateNumberService.getCompanies(),
        gateNumberService.getSites(),
      ]);
      setCompanies(companiesData);
      setSites(sitesData);
    } catch (error) {
      toast.error("Failed to load initial data.");
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (siteId) {
      const fetchProjects = async () => {
        try {
          setValue("building_id", null);
          const data = await gateNumberService.getProjectsBySite(siteId);
          setProjects(data);
        } catch (error) {
          toast.error("Failed to fetch projects");
        }
      };
      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [siteId]);

  const onSubmit = async (data: GateNumberFormValues) => {
    try {
      const payload = {
        gate_number: {
          ...data,
        },
      };
      await gateNumberService.createGateNumber(payload);
      toast.success("Gate number created successfully");
      navigate("/master/gate-number");
    } catch (error) {
      // Error is already toasted by the service
      console.error(error);
    }
  };

  return (
    
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-2">
          <button
            onClick={() => navigate('/master/gate-number')}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>Gate Number List</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">Add Gate Number</span>
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          ADD GATE NUMBER
        </h1>

        <div style={{ padding: '24px', marginTop: '20px', borderRadius: '3px', background: '#fff' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="company_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Company <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      label="Select Company"
                      notched
                      displayEmpty
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value || null)}
                    >
                      <MenuItem value="">Select Company</MenuItem>
                      {companies.map(option => (
                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="pms_site_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Site <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      label="Select Site"
                      notched
                      displayEmpty
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value || null)}
                    >
                      <MenuItem value="">Select Site</MenuItem>
                      {sites.map(option => (
                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="building_id"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel shrink>Select Building <span style={{ color: 'red' }}>*</span></InputLabel>
                    <Select
                      label="Select Building"
                      notched
                      displayEmpty
                      value={field.value || ''}
                      onChange={e => field.onChange(e.target.value || null)}
                    >
                      <MenuItem value="">Select Building</MenuItem>
                      {projects.map(option => (
                        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <Controller
                name="gate_number"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Gate Number"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </div>
            <div className="flex justify-center space-x-4 pt-4">
              <Button type="submit" className="w-32">
                Save
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-32"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddGateNumberPage;
