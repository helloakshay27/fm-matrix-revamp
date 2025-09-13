import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { toast } from 'sonner';
import { gateNumberService } from '@/services/gateNumberService';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

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
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<GateNumberFormValues>();

  const siteId = watch("pms_site_id");
  console.log("dropdownsLoaded:-", dropdownsLoaded);
  console.log("initialData:-", initialData);

  // Fetch dropdowns and initial data, then set form values only after all are loaded
  useEffect(() => {
    let isMounted = true;
    async function fetchAll() {
      try {
        // Fetch companies and sites with selected values
        const [companiesRes, sitesRes] = await Promise.all([
          fetch(`${gateNumberService && gateNumberService.getCompanies ? API_CONFIG.BASE_URL + '/allowed_companies.json' : ''}`, {
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json',
            },
          }).then(r => r.json()),
          fetch(`${gateNumberService && gateNumberService.getSites ? API_CONFIG.BASE_URL + '/pms/sites/allowed_sites.json?user_id=87989' : ''}`, {
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json',
            },
          }).then(r => r.json()),
        ]);
        if (!isMounted) return;
        setCompanies(companiesRes.companies || []);
        setSites(sitesRes.sites || []);
        setDropdownsLoaded(true);
        // Set default selected company and site if present
        if (companiesRes.selected_company) {
          setValue('company_id', companiesRes.selected_company.id);
        }
        if (sitesRes.selected_site) {
          setValue('pms_site_id', sitesRes.selected_site.id);
        }
      } catch (error) {
        toast.error("Failed to load companies and sites.");
      }
    }
    fetchAll();
    return () => { isMounted = false; };
  }, [setValue]);

  // Fetch initial gate number data
  useEffect(() => {
    if (gateNumberId) {
      gateNumberService.getGateNumberById(gateNumberId).then(data => {
        setInitialData(data);
      });
    }
  }, [gateNumberId]);

  // When dropdowns and initial data are loaded, set form values and fetch projects
  useEffect(() => {
    if (dropdownsLoaded && initialData) {
      // Find matching company/site/project in dropdowns
      const companyId = typeof initialData.company_id === 'number' ? initialData.company_id : Number(initialData.company_id) || null;
      const siteId = typeof initialData.pms_site_id === 'number' ? initialData.pms_site_id : Number(initialData.pms_site_id || initialData.site_id) || null;
      const projectId = typeof initialData.project_id === 'number' ? initialData.project_id : Number(initialData.project_id || initialData.building_id) || null;
      reset({
        gate_number: initialData.gate_number || '',
        company_id: companyId,
        pms_site_id: siteId,
        project_id: null, // will be set after projects are loaded
        // active: initialData.active === 1 || initialData.active === true,
      });
      // Fetch projects for the site and set project after loaded
      if (siteId) {
        gateNumberService.getProjectsBySite(siteId).then(projectsData => {
          // If the API returns { buildings: [...] }, use buildings array
          const buildings = Array.isArray(projectsData.buildings) ? projectsData.buildings : projectsData;
          setProjects(buildings);
          // Set project_id after projects are loaded
          const foundProject = buildings.find((p: any) => p.id === projectId);
          if (foundProject) {
            setValue('project_id', String(foundProject.id));
          } else {
            setValue('project_id', null);
          }
        });
      } else {
        setProjects([]);
        setValue('project_id', null);
      }
    }
  }, [dropdownsLoaded, initialData, reset, setValue]);
  // console.log("Log:", dropdownsLoaded, initialData, projects);
  

  // When user changes site, fetch projects
  useEffect(() => {
    if (siteId && (!initialData || (initialData && siteId !== (initialData.pms_site_id || initialData.site_id)))) {
      const fetchProjects = async () => {
        try {
          const data = await gateNumberService.getProjectsBySite(siteId);
          setProjects(data);
        } catch (error) {
          toast.error("Failed to fetch projects");
        }
      };
      fetchProjects();
    } else if (!siteId) {
      setProjects([]);
    }
  }, [siteId, initialData]);

  const onSubmit = async (data: GateNumberFormValues) => {
    try {
      const payload = {
        gate_number: {
          ...data,
          // active: data.active ? 1 : 0,
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
    <div className="p-4 sm:p-6 max-w-full sm:max-w-7xl mx-auto min-h-screen bg-gray-50" style={{ fontFamily: 'Work Sans, sans-serif' }}>
      <div className="w-full max-w-none space-y-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Gate Number</h1>
      <div style={{ padding: '24px', margin: 0, borderRadius: '3px', background: '#fff' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Dropdown */}
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Company <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Company"
                    notched
                    displayEmpty
                    value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                    onChange={e => field.onChange(e.target.value === '' ? '' : e.target.value)}
                  >
                    <MenuItem value="">Select Company</MenuItem>
                    {companies.map(option => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          />
          {/* Site Dropdown */}
          <Controller
            name="pms_site_id"
            control={control}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Site <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Site"
                    notched
                    displayEmpty
                    value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                    onChange={e => {
                      field.onChange(e.target.value === '' ? null : Number(e.target.value));
                      setValue("project_id", null);
                    }}
                  >
                    <MenuItem value="">Select Site</MenuItem>
                    {sites.map(option => (
                      <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          />
          {/* Project Dropdown */}
          <Controller
            name="project_id"
            control={control}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Project <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Project"
                    notched
                    displayEmpty
                    value={field.value !== null && field.value !== undefined ? String(field.value) : ''}
                    onChange={e => field.onChange(e.target.value === '' ? null : e.target.value)}
                    disabled={!siteId}
                  >
                    <MenuItem value="">Select Project</MenuItem>
                    {projects.map(option => (
                      <MenuItem key={option.id} value={String(option.id)}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          />
          {/* Gate Number Field */}
          <Controller
            name="gate_number"
            control={control}
            render={({ field }) => (
              <>
                {console.log(field)}
                <TextField {...field} label="Gate Number" variant="outlined" fullWidth />
              </>
            )}
          />
          {/* Status Dropdown */}
          {/* <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Box>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Status <span style={{ color: 'red' }}>*</span></InputLabel>
                  <Select
                    label="Status"
                    notched
                    displayEmpty
                    value={field.value === true ? 'true' : field.value === false ? 'false' : ''}
                    onChange={e => field.onChange(e.target.value === 'true')}
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="true">Active</MenuItem>
                    <MenuItem value="false">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          /> */}
        </div>
        <div className="flex justify-center space-x-4 pt-4">
          <Button type="submit" className="w-32">Save</Button>
          <Button type="button" variant="outline" className="w-32" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </form>
    </div>
    </div>
    </div>
  );
};

export default EditGateNumberPage;
