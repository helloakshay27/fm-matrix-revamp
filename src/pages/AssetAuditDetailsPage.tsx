import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Printer, Eye, File } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, SelectChangeEvent } from '@mui/material';
import StatusDropdown from '@/components/StatusDropdown';

// Helper function to format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const AssetAuditDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState<any>(null);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<{ [key: string]: string }>({});

  // Audit details state
  const [auditDetails, setAuditDetails] = useState({
    name: '',
    id: '',
    status: 'scheduled',
    createdBy: '',
    lastUpdated: '',
    basicDetails: {
      startDate: '',
      endDate: '',
      site: '',
      building: '',
      floor: '',
      wing: '',
      assetGroup: '',
      subGroup: '',
      department: '',
      conductedBy: '',
      audit_type: ''
    }
  });

  const [filterWing, setFilterWing] = useState('');
  const [filterArea, setFilterArea] = useState('');
  const [filterFloor, setFilterFloor] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterAssetGroup, setFilterAssetGroup] = useState('');
  const [filterSubGroup, setFilterSubGroup] = useState('');
  const [unscannedAssets, setUnscannedAssets] = useState<any[]>([]);
  const [scannedAssets, setScannedAssets] = useState<any[]>([]);

  // Dropdown options state
  const [wings, setWings] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [assetGroups, setAssetGroups] = useState<any[]>([]);
  const [assetSubGroups, setAssetSubGroups] = useState<any[]>([]);

  // Loading states
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubGroups, setLoadingSubGroups] = useState(false);

  // MUI Select field styles
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 40 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '10px 12px' },
    },
  };

  // Fetch wings on component mount
  useEffect(() => {
    const fetchWings = async () => {
      setLoadingWings(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/wings.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch wings');
        }

        const data = await response.json();
        console.log('Wings API response:', data);
        setWings(Array.isArray(data.wings) ? data.wings : []);
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
      } finally {
        setLoadingWings(false);
      }
    };

    fetchWings();
  }, []);

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/departments.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const data = await response.json();
        console.log('Departments API response:', data);
        console.log('Departments count:', data.departments?.length);
        setDepartments(Array.isArray(data.departments) ? data.departments : []);
      } catch (error) {
        console.error('Error fetching departments:', error);
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Fetch asset groups on component mount
  useEffect(() => {
    const fetchAssetGroups = async () => {
      setLoadingGroups(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/assets/get_asset_group_sub_group.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch asset groups');
        }

        const data = await response.json();
        console.log('Asset Groups API response:', data);
        console.log('Asset Groups count:', data.asset_groups?.length);
        setAssetGroups(Array.isArray(data.asset_groups) ? data.asset_groups : []);
      } catch (error) {
        console.error('Error fetching asset groups:', error);
        setAssetGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchAssetGroups();
  }, []);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreas = async () => {
      if (!filterWing) {
        setAreas([]);
        setFilterArea('');
        setFilterFloor('');
        return;
      }

      setLoadingAreas(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/wings/${filterWing}/areas.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch areas');
        }

        const data = await response.json();
        console.log('Areas API response:', data);
        setAreas(Array.isArray(data.areas) ? data.areas : []);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreas();
  }, [filterWing]);

  // Fetch floors when area changes
  useEffect(() => {
    const fetchFloors = async () => {
      if (!filterArea) {
        setFloors([]);
        setFilterFloor('');
        return;
      }

      setLoadingFloors(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/areas/${filterArea}/floors.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch floors');
        }

        const data = await response.json();
        console.log('Floors API response:', data);
        setFloors(Array.isArray(data.floors) ? data.floors : []);
      } catch (error) {
        console.error('Error fetching floors:', error);
        setFloors([]);
      } finally {
        setLoadingFloors(false);
      }
    };

    fetchFloors();
  }, [filterArea]);

  // Fetch subgroups when asset group changes
  useEffect(() => {
    const fetchSubGroups = async () => {
      if (!filterAssetGroup) {
        setAssetSubGroups([]);
        setFilterSubGroup('');
        return;
      }

      setLoadingSubGroups(true);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/assets/get_asset_group_sub_group.json?group_id=${filterAssetGroup}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch asset subgroups');
        }

        const data = await response.json();
        console.log('Asset SubGroups API response:', data);
        console.log('Asset SubGroups count:', data.asset_groups?.length);
        setAssetSubGroups(Array.isArray(data.asset_groups) ? data.asset_groups : []);
      } catch (error) {
        console.error('Error fetching asset subgroups:', error);
        setAssetSubGroups([]);
      } finally {
        setLoadingSubGroups(false);
      }
    };

    fetchSubGroups();
  }, [filterAssetGroup]);

  // Fetch audit details from API
  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        setLoading(true);
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/asset_audits/${id}/audit_details.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch audit details');
        }

        const data = await response.json();
        setAuditData(data);

        // Map API response to component state
        setAuditDetails({
          name: data.name || '',
          id: String(data.id) || '',
          status: data.status || 'scheduled',
          createdBy: data.created_by || 'Unknown',
          lastUpdated: `Last updated by ${data.updated_by || 'Unknown'} on ${data.updated_at ? new Date(data.updated_at).toLocaleString() : new Date().toLocaleString()}`,
          basicDetails: {
            startDate: formatDate(data.start_date),
            endDate: formatDate(data.end_date),
            site: data.site || 'N/A',
            building: data.building || 'N/A',
            floor: data.floor || 'N/A',
            wing: data.wing || 'N/A',
            assetGroup: data.asset_group || 'N/A',
            subGroup: data.asset_sub_group || 'N/A',
            department: 'N/A',
            conductedBy: data.conducted_by || 'N/A',
            audit_type: data.audit_type || 'N/A'
          }
        });

        // Initialize selectedStatus
        setSelectedStatus({
          [data.id]: data.status || 'scheduled'
        });

        // Map unscanned assets
        if (data.unscanned_assets && Array.isArray(data.unscanned_assets)) {
          setUnscannedAssets(data.unscanned_assets.map((asset: any) => ({
            assetName: asset.name || 'N/A',
            serialNo: asset.serial_number || 'N/A',
            manufacturer: asset.manufacturer || 'N/A',
            group: asset.group || 'N/A',
            subgroup: asset.subgroup || 'N/A',
            site: asset.location?.site || 'N/A',
            building: asset.location?.building || 'N/A',
            wing: asset.location?.wing || 'N/A',
            floor: asset.location?.floor || 'N/A',
            department: 'N/A'
          })));
        }

        // Map scanned assets
        if (data.scanned_assets && Array.isArray(data.scanned_assets)) {
          setScannedAssets(data.scanned_assets.map((asset: any) => ({
            assetName: asset.name || 'N/A',
            serialNo: asset.serial_number || 'N/A',
            manufacturer: asset.manufacturer || 'N/A',
            group: asset.group || 'N/A',
            subgroup: asset.subgroup || 'N/A',
            site: asset.location?.site || 'N/A',
            building: asset.location?.building || 'N/A',
            wing: asset.location?.wing || 'N/A',
            floor: asset.location?.floor || 'N/A',
            department: 'N/A'
          })));
        }

      } catch (error) {
        console.error('Error fetching audit details:', error);
        toast.error('Failed to fetch audit details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuditDetails();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string, auditId: number) => {
    const previousStatus = selectedStatus[auditId] || convertStatusToApi(auditDetails.status);

    // Optimistic update
    setSelectedStatus((prev) => ({
      ...prev,
      [auditId]: newStatus,
    }));

    setAuditDetails(prev => ({ ...prev, status: newStatus }));

    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/asset_audits/${id}.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pms_asset_audit: {
            status: newStatus,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(`Status changed to ${newStatus}`);

      // Refetch audit details to get updated data
      const updatedResponse = await fetch(`https://${baseUrl}/pms/asset_audits/${id}/audit_details.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setAuditData(updatedData);
      }
    } catch (error) {
      console.error('Error updating status:', error);

      // Rollback on error
      setSelectedStatus((prev) => ({
        ...prev,
        [auditId]: previousStatus,
      }));

      setAuditDetails(prev => ({ ...prev, status: previousStatus }));
      toast.error('Failed to update audit status');
    }
  };

  const handleEditClick = () => {
    navigate(`/maintenance/audit/assets/edit/${id}`);
  };

  const handlePrintList = () => {
    const printContent = `
      <html>
        <head>
          <title>Asset Audit List - ${auditDetails.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Asset Audit List</h1>
            <p><strong>Audit Name:</strong> ${auditDetails.name} (${auditDetails.id})</p>
            <p><strong>Status:</strong> ${auditDetails.status}</p>
            <p><strong>Created By:</strong> ${auditDetails.createdBy}</p>
            <p><strong>Date Range:</strong> ${auditDetails.basicDetails.startDate} - ${auditDetails.basicDetails.endDate}</p>
            <p><strong>Site:</strong> ${auditDetails.basicDetails.site}</p>
            <p><strong>Building:</strong> ${auditDetails.basicDetails.building}</p>
          </div>
          <h2>Assets to be Scanned</h2>
          <table>
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Asset Serial No</th>
                <th>Manufacturer</th>
                <th>Group</th>
                <th>Subgroup</th>
                <th>Site</th>
                <th>Building</th>
                <th>Wing</th>
                <th>Floor</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              ${unscannedAssets.map(asset => `
                <tr>
                  <td>${asset.assetName}</td>
                  <td>${asset.serialNo}</td>
                  <td>${asset.manufacturer}</td>
                  <td>${asset.group}</td>
                  <td>${asset.subgroup}</td>
                  <td>${asset.site}</td>
                  <td>${asset.building}</td>
                  <td>${asset.wing}</td>
                  <td>${asset.floor}</td>
                  <td>${asset.department}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success('Print dialog opened');
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: '#C4B89D' },
    { value: 'in_progress', label: 'In Progress', color: '#F4C790' },
    { value: 'completed', label: 'Completed', color: '#AAB9C5' },
    { value: 'overdue', label: 'Overdue', color: '#E4626F' },
    { value: 'closed', label: 'Closed', color: '#bbf7d0' },
  ];

  const getStatusStyle = (status: string): React.CSSProperties => {
    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '').replace(/_/g, '');
    const statusMap: { [key: string]: string } = {
      'scheduled': '#C4B89D',
      'inprogress': '#F4C790',
      'completed': '#AAB9C5',
      'overdue': '#E4626F',
      'closed': '#bbf7d0',
    };
    const color = statusMap[normalizedStatus] || '#AAB9C5';
    return {
      backgroundColor: color,
      color: '#000',
      border: 'none',
    };
  };

  const convertStatusToApi = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'scheduled': 'scheduled',
      'in progress': 'in_progress',
      'completed': 'completed',
      'overdue': 'overdue',
      'closed': 'closed'
    };
    return statusMap[status.toLowerCase()] || status.toLowerCase().replace(/\s+/g, '_');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading audit details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <span className="text-gray-500 text-sm">Audit List</span>
          <span className="text-gray-500 text-sm mx-2">&gt;</span>
          <span className="text-sm font-medium">Audit Details</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{auditDetails.name} ({auditDetails.id})</h1>

            {/* Status Dropdown */}
            <div className="min-w-[140px]">
              <StatusDropdown
                data={{ id: Number(auditDetails.id), status: auditDetails.status }}
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusChange}
                openDropdownId={openDropdownId}
                setOpenDropdownId={setOpenDropdownId}
                statusOptions={statusOptions}
                getStatusStyle={getStatusStyle}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {auditData && ['completed', 'closed'].includes(auditData.status) && (
              <Button
                onClick={() => navigate(`/maintenance/audit/assets/report/${id}`)}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Report
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={handleEditClick}>
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Created By {auditDetails.createdBy} | {auditDetails.lastUpdated}
        </p>

        {/* Basic Details Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          {/* <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</span>
              BASIC DETAILS
            </h2>
          </div> */}
          <div className="p-4 border-b flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
              <File className="w-6 h-6" style={{ color: "#C72030" }} />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              BASIC DETAILS
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-8 px-3">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Start Date</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.startDate}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">End Date</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.endDate}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Type</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.audit_type}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Site</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.site}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Building</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.building}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Floor</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.floor}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Wing</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.wing}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Department</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.department}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Asset Group</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.assetGroup}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Sub Group</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.subGroup}</span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-500 min-w-[140px]">Conducted By</span>
                  <span className="text-gray-500 mx-2">:</span>
                  <span className="text-gray-900 font-medium">{auditDetails.basicDetails.conductedBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* List of Assets Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          {/* <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</span>
              LIST OF ASSETS
            </h2>
          </div> */}
          <div className="p-4 border-b flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
              <File className="w-6 h-6" style={{ color: "#C72030" }} />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">
              LIST OF ASSETS
            </h3>
          </div>

          <div className="p-6">
            {/* Filter Row */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="wing-select-label" shrink>Wing</InputLabel>
                  <MuiSelect
                    labelId="wing-select-label"
                    label="Wing"
                    value={filterWing}
                    onChange={(e: SelectChangeEvent<string>) => setFilterWing(e.target.value)}
                    disabled={loadingWings}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>{loadingWings ? "Loading..." : "Select Wing"}</em></MenuItem>
                    {wings.map((wing) => (
                      <MenuItem key={wing.id} value={String(wing.id)}>
                        {wing.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="area-select-label" shrink>Area</InputLabel>
                  <MuiSelect
                    labelId="area-select-label"
                    label="Area"
                    value={filterArea}
                    onChange={(e: SelectChangeEvent<string>) => setFilterArea(e.target.value)}
                    disabled={!filterWing || loadingAreas}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>{!filterWing ? "Select Wing first" : loadingAreas ? "Loading..." : "Select Area"}</em></MenuItem>
                    {areas.map((area) => (
                      <MenuItem key={area.id} value={String(area.id)}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="floor-select-label" shrink>Floor</InputLabel>
                  <MuiSelect
                    labelId="floor-select-label"
                    label="Floor"
                    value={filterFloor}
                    onChange={(e: SelectChangeEvent<string>) => setFilterFloor(e.target.value)}
                    disabled={!filterArea || loadingFloors}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>{!filterArea ? "Select Area first" : loadingFloors ? "Loading..." : "Select Floor"}</em></MenuItem>
                    {floors.map((floor) => (
                      <MenuItem key={floor.id} value={String(floor.id)}>
                        {floor.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="department-select-label" shrink>Department</InputLabel>
                  <MuiSelect
                    labelId="department-select-label"
                    label="Department"
                    value={filterDepartment}
                    onChange={(e: SelectChangeEvent<string>) => setFilterDepartment(e.target.value)}
                    disabled={loadingDepartments}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>{loadingDepartments ? "Loading..." : "Select Department"}</em></MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept.id} value={String(dept.id)}>
                        {dept.department_name || dept.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="asset-group-select-label" shrink>Asset Group</InputLabel>
                  <MuiSelect
                    labelId="asset-group-select-label"
                    label="Asset Group"
                    value={filterAssetGroup}
                    onChange={(e: SelectChangeEvent<string>) => setFilterAssetGroup(e.target.value)}
                    disabled={loadingGroups}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>{loadingGroups ? "Loading..." : "Select Asset Group"}</em></MenuItem>
                    {assetGroups.map((group) => (
                      <MenuItem key={group.id} value={String(group.id)}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="sub-group-select-label" shrink>Sub Group</InputLabel>
                  <MuiSelect
                    labelId="sub-group-select-label"
                    label="Sub Group"
                    value={filterSubGroup}
                    onChange={(e: SelectChangeEvent<string>) => setFilterSubGroup(e.target.value)}
                    disabled={!filterAssetGroup || loadingSubGroups}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>{!filterAssetGroup ? "Select Asset Group first" : loadingSubGroups ? "Loading..." : "Select Sub Group"}</em></MenuItem>
                    {assetSubGroups.map((subGroup) => (
                      <MenuItem key={subGroup.id} value={String(subGroup.id)}>
                        {subGroup.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <Button
                onClick={handlePrintList}
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                size="sm"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print List
              </Button>
            </div>

            {/* Assets to be Scanned */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">List Of Assets To Be Scanned</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Asset Serial No</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Subgroup</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Wing</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unscannedAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                          No unscanned assets available
                        </TableCell>
                      </TableRow>
                    ) : (
                      unscannedAssets.map((asset, index) => (
                        <TableRow key={index}>
                          <TableCell>{asset.assetName}</TableCell>
                          <TableCell>{asset.serialNo}</TableCell>
                          <TableCell>{asset.manufacturer}</TableCell>
                          <TableCell>{asset.group}</TableCell>
                          <TableCell>{asset.subgroup}</TableCell>
                          <TableCell>{asset.site}</TableCell>
                          <TableCell>{asset.building}</TableCell>
                          <TableCell>{asset.wing}</TableCell>
                          <TableCell>{asset.floor}</TableCell>
                          <TableCell>{asset.department}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Total Scanned Assets */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Total Scanned Assets</h3>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Asset Serial No</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Subgroup</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Building</TableHead>
                      <TableHead>Wing</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Department</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scannedAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                          No assets available
                        </TableCell>
                      </TableRow>
                    ) : (
                      scannedAssets.map((asset, index) => (
                        <TableRow key={index}>
                          <TableCell>{asset.assetName}</TableCell>
                          <TableCell>{asset.serialNo}</TableCell>
                          <TableCell>{asset.manufacturer}</TableCell>
                          <TableCell>{asset.group}</TableCell>
                          <TableCell>{asset.subgroup}</TableCell>
                          <TableCell>{asset.site}</TableCell>
                          <TableCell>{asset.building}</TableCell>
                          <TableCell>{asset.wing}</TableCell>
                          <TableCell>{asset.floor}</TableCell>
                          <TableCell>{asset.department}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
