import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useApiConfig } from '@/hooks/useApiConfig';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { AttachmentUpload } from '@/components/common/AttachmentUpload';

// Column configs â€” har tab ka apna EnhancedTable
// Same columns as ops-console CountryTab
const countryColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'organization_name', label: 'Organization', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'country_name', label: 'Country Name', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'company_name', label: 'Company', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'created_at', label: 'Created At', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

type CountryRow = {
  id?: number;
  name: string;
  organization_name?: string;
  country_name?: string;
  company_name?: string;
  created_at?: string;
  status: boolean;
};
type RegionRow = { id?: number; country: string; region: string; status: boolean };
type ZoneRow = { id?: number; country: string; region: string; zone: string; status: boolean; icon: string };
type SiteRow = {
  id?: number;
  country: string;
  region: string;
  zone: string;
  site: string;
  latitude: string;
  longitude: string;
  status: boolean;
  qrCode: string;
};

// API responses come either as a bare array or wrapped ({ headquarters: [...] } / { data: [...] })
const toList = (data: any, key: string): any[] => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data[key])) return data[key];
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

const regionColumns: ColumnConfig[] = [
  { key: 'country', label: 'Country', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'region', label: 'Region', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

const zoneColumns: ColumnConfig[] = [
  { key: 'country', label: 'Country', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'region', label: 'Region', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'zone', label: 'Zone', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'icon', label: 'Icon', sortable: false, hideable: true, defaultVisible: true, draggable: true },
];

const siteColumns: ColumnConfig[] = [
  { key: 'country', label: 'Country', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'region', label: 'Region', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'zone', label: 'Zone', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'site', label: 'Site', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'latitude', label: 'Latitude', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'longitude', label: 'Longitude', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'qrCode', label: 'QR Code', sortable: false, hideable: true, defaultVisible: true, draggable: true },
];

const entityColumns: ColumnConfig[] = [
  { key: 'status', label: 'Active', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'entity', label: 'Entity', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

const userCategoryColumns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'name', label: 'Name', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'resource_type', label: 'Resource Type', sortable: true, hideable: true, defaultVisible: true, draggable: true },
  { key: 'created_at', label: 'Created At', sortable: true, hideable: true, defaultVisible: true, draggable: true },
];

// Rows me original array index (_index) rakhte hain taaki status toggle handlers
// sort/filter/pagination ke baad bhi sahi row update karein. Client search khud karte
// hain (sirf diye gaye text fields pe) â€” warna _index / boolean status bhi match ho jaate.
const filterRows = <T extends Record<string, any>>(rows: T[], term: string, fields: (keyof T)[]) => {
  const query = term.trim().toLowerCase();
  if (!query) return rows;
  return rows.filter(row => fields.some(field => String(row[field] ?? '').toLowerCase().includes(query)));
};

export const LocationAccountPage = () => {
  const { getFullUrl, getAuthHeader } = useApiConfig();
  const [activeTab, setActiveTab] = useState('organization');
  // Har tab ka apna search term â€” ek tab me type karne se dusra filter nahi hota
  const [tableSearch, setTableSearch] = useState({
    country: '',
    region: '',
    zone: '',
    site: '',
    entity: '',
    userCategory: '',
  });
  const setSearchFor = (key: keyof typeof tableSearch) => (value: string) =>
    setTableSearch(prev => ({ ...prev, [key]: value }));
  const [companyName, setCompanyName] = useState("");
  const [removeLogo, setRemoveLogo] = useState(false);
  const [dailyReport, setDailyReport] = useState(false);
  const [companyLogoFile, setCompanyLogoFile] = useState<File | null>(null);
  const [isLoadingUserCategories, setIsLoadingUserCategories] = useState(false);

  // Country / Region / Zone lists come from the API
  const [countries, setCountries] = useState<CountryRow[]>([]);
  const [regions, setRegions] = useState<RegionRow[]>([]);
  const [zones, setZones] = useState<ZoneRow[]>([]);
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [loadingList, setLoadingList] = useState({ country: false, region: false, zone: false, site: false });

  const fetchList = async (
    key: 'country' | 'region' | 'zone' | 'site',
    path: string,
    onData: (data: any) => void
  ) => {
    setLoadingList(prev => ({ ...prev, [key]: true }));
    try {
      const response = await fetch(getFullUrl(path), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      onData(await response.json());
    } catch (error) {
      console.error(`Error fetching ${key} list:`, error);
      toast.error(`Failed to fetch ${key} list`);
    } finally {
      setLoadingList(prev => ({ ...prev, [key]: false }));
    }
  };

  // Current organization — set at login as "org_id" (other keys are older fallbacks)
  const getCurrentOrgId = () =>
    localStorage.getItem('org_id') ||
    localStorage.getItem('organization_id') ||
    localStorage.getItem('organisation_id') ||
    '';

  const fetchCountries = () => {
    const orgId = getCurrentOrgId();
    const path = orgId
      ? `/headquarters.json?q[organization_id_eq]=${encodeURIComponent(orgId)}`
      : '/headquarters.json';
    return fetchList('country', path, (data) =>
      setCountries(
        toList(data, 'headquarters').map((hq: any) => ({
          id: hq.id,
          name: hq.country_name || hq.headquarter_name || '',
          organization_name: hq.organization_name,
          country_name: hq.country_name,
          company_name: hq.company_name,
          created_at: hq.created_at,
          status: !!hq.active,
        }))
      )
    );
  };

  // Current company — set by Layout/ProtectedRoute as "selectedCompanyId" (others are older fallbacks)
  const getCurrentCompanyId = () =>
    localStorage.getItem('selectedCompanyId') ||
    localStorage.getItem('selected_company_id') ||
    localStorage.getItem('company_id') ||
    '';

  const fetchRegions = () => {
    const companyId = getCurrentCompanyId();
    const path = companyId
      ? `/regions.json?q[company_id_eq]=${encodeURIComponent(companyId)}`
      : '/regions.json';
    return fetchList('region', path, (data) =>
      setRegions(
        toList(data, 'regions').map((r: any) => ({
          id: r.id,
          country: r.country_name || r.headquarter_name || r.headquarter?.name || '',
          region: r.name || r.region_name || '',
          status: !!r.active,
        }))
      )
    );
  };

  const fetchZones = () =>
    fetchList('zone', '/pms/zones.json', (data) =>
      setZones(
        toList(data, 'zones').map((z: any) => ({
          id: z.id,
          country: z.headquarter?.name || '',
          region: z.pms_region?.name || '',
          zone: z.name || '',
          status: !!z.active,
          icon: z.image || '/placeholder.svg',
        }))
      )
    );

  // Sites of the logged-in user (API is scoped by the auth token, no extra filter needed)
  // Response: { status, message, sites: [{ id, headquarter, region, zone, name, latitude, longitude, active, qr_code_url }] }
  const fetchSites = () =>
    fetchList('site', '/pms/account_setups/get_user_site_details.json', (data) =>
      setSites(
        toList(data, 'sites').map((s: any) => ({
          id: s.id,
          country: s.headquarter || '',
          region: s.region || '',
          zone: s.zone || '',
          site: s.name || '',
          latitude: s.latitude !== null && s.latitude !== undefined ? String(s.latitude) : '',
          longitude: s.longitude !== null && s.longitude !== undefined ? String(s.longitude) : '',
          status: !!s.active,
          qrCode: s.qr_code_url || '',
        }))
      )
    );

  // Load the list when its tab opens (Region/Zone dialogs also need countries/regions)
  useEffect(() => {
    if (activeTab === 'country') fetchCountries();
    if (activeTab === 'site') fetchSites();
    if (activeTab === 'region') {
      fetchRegions();
      if (countries.length === 0) fetchCountries();
    }
    if (activeTab === 'zone') {
      fetchZones();
      if (countries.length === 0) fetchCountries();
      if (regions.length === 0) fetchRegions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const [entities, setEntities] = useState<{ id?: number; entity: string; status: boolean }[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

  // Entities API is server-paginated (15 per page):
  // { entities: [{ id, name, active }], pagination: { current_page, total_pages, ... } }
  // Load every page so the table's own search / pagination covers all entities.
  const fetchEntities = async () => {
    setLoadingEntities(true);
    try {
      const all: any[] = [];
      let page = 1;
      let totalPages = 1;
      do {
        const response = await fetch(
          getFullUrl(`/pms/account_setups/get_entities.json?page=${page}`),
          {
            headers: {
              'Authorization': getAuthHeader(),
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        all.push(...toList(data, 'entities'));
        totalPages = Number(data?.pagination?.total_pages) || 1;
        page++;
      } while (page <= totalPages && page <= 100); // hard cap as a safety net

      setEntities(
        all.map((e: any) => ({
          id: e.id,
          entity: e.name || '',
          status: !!e.active,
        }))
      );
    } catch (error) {
      console.error('Error fetching entity list:', error);
      toast.error('Failed to fetch entity list');
    } finally {
      setLoadingEntities(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'entity') fetchEntities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const [userCategories, setUserCategories] = useState<any[]>([]);

  // Fetch user categories from API
  useEffect(() => {
    if (activeTab === 'user-category') {
      fetchUserCategories();
    }
  }, [activeTab]);

  const fetchUserCategories = async () => {
    setIsLoadingUserCategories(true);
    try {
      const response = await fetch(getFullUrl('/pms/admin/user_categories.json'), {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCategories(data);
      } else {
        toast.error('Failed to fetch user categories');
      }
    } catch (error) {
      console.error('Error fetching user categories:', error);
      toast.error('Error fetching user categories');
    } finally {
      setIsLoadingUserCategories(false);
    }
  };

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      setCompanyLogoFile(file);
      toast.success('File uploaded successfully');
    }
  };

  const handleSubmitCompany = () => {
    toast.success('Company details updated successfully');
  };

  // Table rows (original index ke saath) + per-tab search
  const countryRows = filterRows(countries.map((c, _index) => ({ ...c, _index })), tableSearch.country, ['organization_name', 'country_name', 'company_name']);
  const regionRows = filterRows(regions.map((r, _index) => ({ ...r, _index })), tableSearch.region, ['country', 'region']);
  const zoneRows = filterRows(zones.map((z, _index) => ({ ...z, _index })), tableSearch.zone, ['country', 'region', 'zone']);
  const siteRows = filterRows(sites.map((s, _index) => ({ ...s, _index })), tableSearch.site, ['country', 'region', 'zone', 'site', 'latitude', 'longitude']);
  const entityRows = filterRows(entities.map((e, _index) => ({ ...e, _index })), tableSearch.entity, ['entity']);
  const userCategoryRows = filterRows(
    userCategories.map((category, _index) => ({ ...category, _index })),
    tableSearch.userCategory,
    ['id', 'name', 'resource_type']
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ACCOUNT</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6 bg-white border border-gray-200">
          {[
            { value: 'organization', label: 'Organization' },
            { value: 'company', label: 'Company' },
            { value: 'country', label: 'Country' },
            { value: 'region', label: 'Region' },
            { value: 'zone', label: 'Zone' },
            { value: 'site', label: 'Site' },
            { value: 'entity', label: 'Entity' },
            { value: 'user-category', label: 'User Category' },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">{localStorage.getItem('selectedOrg')}</h2>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              {/* File Upload */}
              <AttachmentUpload
                label="Company Logo"
                chooseText="Choose Logo"
                uploadText="Upload Logo"
                emptyText="No file chosen"
                accept="image/*"
                files={companyLogoFile ? [companyLogoFile] : []}
                onFilesSelected={handleFileUpload}
                onRemove={() => setCompanyLogoFile(null)}
              />

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  disabled
                  value={localStorage.getItem('selectedCompany')}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="removeLogo"
                    checked={removeLogo}
                    onChange={(e) => setRemoveLogo(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="removeLogo" className="text-sm text-gray-700">
                    Remove Logo
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="dailyReport"
                    checked={dailyReport}
                    onChange={(e) => setDailyReport(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="dailyReport" className="text-sm text-gray-700">
                    Daily Helpdesk Report Email
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="fm-action-bar pt-4">
                <button type="button" className="fm-action-primary" onClick={handleSubmitCompany}>
                  Submit
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="country" className="space-y-4">
          <EnhancedTable
            data={countryRows}
            columns={countryColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-country-table"
            loading={loadingList.country}
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <StatusBadge status={item.status ? 'active' : 'inactive'} size="sm">{item.status ? 'Active' : 'Inactive'}</StatusBadge>
                );
              }
              if (columnKey === 'created_at') {
                return item.created_at ? new Date(item.created_at).toLocaleDateString() : '-';
              }
              return (item[columnKey as keyof typeof item] as React.ReactNode) || '-';
            }}
            enableSearch={true}
            searchTerm={tableSearch.country}
            onSearchChange={setSearchFor('country')}
            disableClientSearch={true}
            searchPlaceholder="Search countries..."
            emptyMessage="No countries found"
            pagination={true}
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="region" className="space-y-4">
          <EnhancedTable
            data={regionRows}
            columns={regionColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-region-table"
            loading={loadingList.region}
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <StatusBadge status={item.status ? 'active' : 'inactive'} size="sm">{item.status ? 'Active' : 'Inactive'}</StatusBadge>
                );
              }
              return item[columnKey as keyof typeof item] as React.ReactNode;
            }}
            enableSearch={true}
            searchTerm={tableSearch.region}
            onSearchChange={setSearchFor('region')}
            disableClientSearch={true}
            searchPlaceholder="Search regions..."
            emptyMessage="No regions found"
            pagination={true}
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="zone" className="space-y-4">
          <EnhancedTable
            data={zoneRows}
            columns={zoneColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-zone-table"
            loading={loadingList.zone}
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <StatusBadge status={item.status ? 'active' : 'inactive'} size="sm">{item.status ? 'Active' : 'Inactive'}</StatusBadge>
                );
              }
              if (columnKey === 'icon') {
                return (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <img src={item.icon} alt="Zone icon" className="w-6 h-6" />
                  </div>
                );
              }
              return (item[columnKey as keyof typeof item] as React.ReactNode) || '-';
            }}
            enableSearch={true}
            searchTerm={tableSearch.zone}
            onSearchChange={setSearchFor('zone')}
            disableClientSearch={true}
            searchPlaceholder="Search zones..."
            emptyMessage="No zones found"
            pagination={true}
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="site" className="space-y-4">
          <EnhancedTable
            data={siteRows}
            columns={siteColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-site-table"
            loading={loadingList.site}
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <StatusBadge status={item.status ? 'active' : 'inactive'} size="sm">{item.status ? 'Active' : 'Inactive'}</StatusBadge>
                );
              }
              if (columnKey === 'qrCode') {
                if (!item.qrCode) return '-';
                return (
                  <a href={item.qrCode} target="_blank" rel="noopener noreferrer" title="Open QR code">
                    <img src={item.qrCode} alt="QR Code" className="w-10 h-10 object-contain border rounded bg-white" />
                  </a>
                );
              }
              return (item[columnKey as keyof typeof item] as React.ReactNode) || '-';
            }}
            enableSearch={true}
            searchTerm={tableSearch.site}
            onSearchChange={setSearchFor('site')}
            disableClientSearch={true}
            searchPlaceholder="Search sites..."
            emptyMessage="No sites found"
            pagination={true}
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="entity" className="space-y-4">

          <EnhancedTable
            data={entityRows}
            columns={entityColumns}
            getItemId={(item) => String(item._index)}
            storageKey="account-entity-table"
            loading={loadingEntities}
            renderCell={(item, columnKey) => {
              if (columnKey === 'status') {
                return (
                  <StatusBadge status={item.status ? 'active' : 'inactive'} size="sm">{item.status ? 'Active' : 'Inactive'}</StatusBadge>
                );
              }
              return (item[columnKey as keyof typeof item] as React.ReactNode) || '-';
            }}
            enableSearch={true}
            searchTerm={tableSearch.entity}
            onSearchChange={setSearchFor('entity')}
            disableClientSearch={true}
            searchPlaceholder="Search entities..."
            emptyMessage="No entities found"
            pagination={true}
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="user-category" className="space-y-4">
          <EnhancedTable
            data={userCategoryRows}
            columns={userCategoryColumns}
            getItemId={(item) => String(item.id ?? item._index)}
            storageKey="account-user-category-table"
            renderCell={(item, columnKey) => {
              if (columnKey === 'created_at') {
                return new Date(item.created_at).toLocaleDateString();
              }
              return item[columnKey] as React.ReactNode;
            }}
            enableSearch={true}
            searchTerm={tableSearch.userCategory}
            onSearchChange={setSearchFor('userCategory')}
            disableClientSearch={true}
            searchPlaceholder="Search user categories..."
            emptyMessage="No user categories found"
            loading={isLoadingUserCategories}
            loadingMessage="Loading user categories..."
            pagination={true}
            pageSize={10}
          />

        </TabsContent>
      </Tabs>

    </div>
  );
};
