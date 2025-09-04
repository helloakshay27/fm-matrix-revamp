import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Autocomplete, TextFieldProps } from '@mui/material';
import { toast } from 'sonner';
import { gateNumberService } from '@/services/gateNumberService';

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Gate Number</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={companies}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => value ? option.id === value.id : false}
                  onChange={(_, data) => field.onChange(data ? data.id : null)}
                  value={companies.find((c) => c.id === field.value) || null}
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      label="Select Company"
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="pms_site_id"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={sites}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => value ? option.id === value.id : false}
                  onChange={(_, data) => field.onChange(data ? data.id : null)}
                  value={sites.find((s) => s.id === field.value) || null}
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      label="Select PMS Site"
                      variant="outlined"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="building_id"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={projects}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => value ? option.id === value.id : false}
                  onChange={(_, data) => field.onChange(data ? data.id : null)}
                  value={projects.find((p) => p.id === field.value) || null}
                  renderInput={(params: TextFieldProps) => (
                    <TextField
                      {...params}
                      label="Select Building"
                      variant="outlined"
                    />
                  )}
                />
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
  );
};

export default AddGateNumberPage;
