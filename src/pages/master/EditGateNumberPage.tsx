import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, Autocomplete, TextFieldProps } from '@mui/material';
import { toast } from 'sonner';
import { gateNumberService } from '@/services/gateNumberService';

interface GateNumberFormValues {
  gate_number: string;
  company_id: number | null;
  pms_site_id: number | null;
  project_id: number | null;
  active: boolean;
}

interface DropdownOption {
  id: number;
  name: string;
}

const EditGateNumberPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const gateNumberId = Number(id);

  const [companies, setCompanies] = useState<DropdownOption[]>([]);
  const [sites, setSites] = useState<DropdownOption[]>([]);
  const [projects, setProjects] = useState<DropdownOption[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<GateNumberFormValues>();

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
      toast.error("Failed to load companies and sites.");
    }
  }, []);

  useEffect(() => {
    fetchDropdownData();
  }, [fetchDropdownData]);

  useEffect(() => {
    if (gateNumberId) {
      gateNumberService.getGateNumberById(gateNumberId).then(data => {
        reset({
          ...data,
          project_id: data.building_id,
          active: data.active === 1,
        });
      });
    }
  }, [gateNumberId, reset]);

  useEffect(() => {
    if (siteId) {
      const fetchProjects = async () => {
        try {
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
          active: data.active ? 1 : 0,
          building_id: data.project_id,
        },
      };
      await gateNumberService.updateGateNumber(gateNumberId, payload);
      toast.success("Gate number updated successfully");
      navigate("/master/gate-number");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Gate Number</h1>
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
                    <TextField {...params} label="Select Company" variant="outlined" />
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
                  onChange={(_, data) => {
                    field.onChange(data ? data.id : null);
                    setValue("project_id", null);
                  }}
                  value={sites.find((s) => s.id === field.value) || null}
                  renderInput={(params: TextFieldProps) => (
                    <TextField {...params} label="Select PMS Site" variant="outlined" />
                  )}
                />
              )}
            />
            <Controller
              name="project_id"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={projects}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => value ? option.id === value.id : false}
                  onChange={(_, data) => field.onChange(data ? data.id : null)}
                  value={projects.find((p) => p.id === field.value) || null}
                  disabled={!siteId}
                  renderInput={(params: TextFieldProps) => (
                    <TextField {...params} label="Select Project" variant="outlined" />
                  )}
                />
              )}
            />
            <Controller
              name="gate_number"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Gate Number" variant="outlined" fullWidth />
              )}
            />
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  options={[{ label: 'Active', value: true }, { label: 'Inactive', value: false }]}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  onChange={(_, data) => field.onChange(data ? data.value : null)}
                  value={field.value ? { label: 'Active', value: true } : { label: 'Inactive', value: false }}
                  renderInput={(params: TextFieldProps) => (
                    <TextField {...params} label="Status" variant="outlined" />
                  )}
                />
              )}
            />
        </div>
        <div className="flex justify-center space-x-4 pt-4">
          <Button type="submit" className="w-32">Save</Button>
          <Button type="button" variant="outline" className="w-32" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
};

export default EditGateNumberPage;
