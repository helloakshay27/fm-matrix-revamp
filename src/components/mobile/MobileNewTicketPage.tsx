import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Settings, QrCode, Sparkles, Wrench, Monitor,
  ShieldCheck, Plus, X, Wifi, Zap, Wind, Droplets
} from 'lucide-react';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ticketManagementAPI, CategoryResponse, SubCategoryResponse } from '@/services/ticketManagementAPI';
import { getUser } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { co } from 'node_modules/@fullcalendar/core/internal-common';
import { result } from 'lodash';

const CATEGORY_ICON_LIST = [Sparkles, Wrench, Monitor, ShieldCheck, Wifi, Zap, Wind, Droplets];
const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 - Critical' },
  { value: 'P2', label: 'P2 - Very High' },
  { value: 'P3', label: 'P3 - High' },
  { value: 'P4', label: 'P4 - Medium' },
  { value: 'P5', label: 'P5 - Low' }
];

const PROACTIVE_REACTIVE_OPTIONS = [
  { value: 'Proactive', label: 'Proactive' },
  { value: 'Reactive', label: 'Reactive' }
];

const SEVERITY_OPTIONS = [
  { value: 'Major', label: 'Major' },
  { value: 'Minor', label: 'Minor' }
];
const getCategoryIcon = (name: string, index: number) => {
  const lower = name.toLowerCase();
  if (lower.includes('house') || lower.includes('clean')) return Sparkles;
  if (lower.includes('tech') || lower.includes('maint') || lower.includes('mechanic')) return Wrench;
  if (lower.includes('it') || lower.includes('computer') || lower.includes('network')) return Monitor;
  if (lower.includes('safe') || lower.includes('secur') || lower.includes('fire')) return ShieldCheck;
  if (lower.includes('wifi') || lower.includes('internet') || lower.includes('telecom')) return Wifi;
  if (lower.includes('electric') || lower.includes('power')) return Zap;
  if (lower.includes('air') || lower.includes('hvac') || lower.includes('ac')) return Wind;
  if (lower.includes('plumb') || lower.includes('water') || lower.includes('sanit')) return Droplets;
  return CATEGORY_ICON_LIST[index % CATEGORY_ICON_LIST.length];
};

/**
 * Determine the base API domain based on the current host
 */
const getBaseApiDomain = (): string => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return 'https://fm-uat-api.lockated.com';
  }

  if (hostname === 'oig.gophygital.work' || hostname.includes('oig.gophygital.work')) {
    return 'https://oig-api.gophygital.work';
  }

  if (hostname === 'fm-matrix.lockated.com' || hostname.includes('fm-matrix')) {
    return 'https://fm-uat-api.lockated.com';
  }

  // Default to live API for all other cases
  return 'https://live-api.lockated.com';
};

/**
 * Interfaces for API responses
 */
interface SnagQuestion {
  id: number;
  descr: string;
  qtype: 'text' | 'email' | 'number' | 'date' | 'textarea';
}
interface ComplaintCustomField {
  id: number;
  field_name: string;
  field_value: string;
}

interface ComplaintCustomFieldsResponse {
  code: number;
  fields: ComplaintCustomField[];
}

interface ComplaintFieldsResponse {
  code: number;
  snag_questions: SnagQuestion[];
  snag_checklist_id: number;
}

/**
 * Service to fetch site base URL and data dynamically
 */
const dynamicSiteService = {
  /**
   * Get the site base URL from the organizations API
   */
  async getSiteBaseUrl(siteId: number): Promise<{ base_url: string, site_name: string }> {
    try {
      const baseApiDomain = getBaseApiDomain();
      const url = `${baseApiDomain}/organizations/site_base_url?site_id=${siteId}`;

      console.log('🔍 Fetching site base URL from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Site base URL response:', data);
      return data || { base_url: '', site_name: "Unknown Site" };


    } catch (error) {
      console.error('❌ Error fetching site base URL:', error);
      throw error;
    }
  },

  /**
   * Get helpdesk categories for a site
   */
  async getCategories(siteDomain: string, siteId: number): Promise<CategoryResponse[]> {
    try {
      const url = `https://${siteDomain}/pms/admin/helpdesk_categories/get_categories.json?site_id=${siteId}`;

      console.log('🔍 Fetching categories from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Categories response:', data);
      return data.categories || [];
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get subcategories for a category
   */
  async getSubcategories(siteDomain: string, categoryTypeId: number): Promise<SubCategoryResponse[]> {
    try {
      const url = `https://${siteDomain}/pms/admin/helpdesk_categories/get_sub_categories_site.json?category_type_id=${categoryTypeId}`;

      console.log('🔍 Fetching subcategories from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Subcategories response:', data);
      return data.sub_categories || [];
    } catch (error) {
      console.error('❌ Error fetching subcategories:', error);
      throw error;
    }
  },

  /**
   * Get complaint/requester fields for a site
   */
  async getComplaintFields(siteDomain: string, siteId: number): Promise<ComplaintFieldsResponse> {
    try {
      const baseApiDomain = getBaseApiDomain();
      const url = `https://${siteDomain}/pms/admin/complaints/get_fields.json?site_id=${siteId}`;

      console.log('🔍 Fetching complaint fields from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Complaint fields response:', data);
      return data;
    } catch (error) {
      console.error('❌ Error fetching complaint fields:', error);
      throw error;
    }
  },
  async getComplaintCustomFields(
    siteDomain: string,
    siteId: number
  ): Promise<ComplaintCustomFieldsResponse> {
    try {
      const url = `https://${siteDomain}/pms/admin/complaints/get_complaint_custom_fields.json?site_id=${siteId}`;

      console.log('🔍 Fetching complaint custom fields from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Complaint custom fields response:', data);

      return data;
    } catch (error) {
      console.error('❌ Error fetching complaint custom fields:', error);
      throw error;
    }
  },
  async getBuildings(siteDomain: string, siteId: number) {
    const url = `https://${siteDomain}/api/pms/buildings.json?site_id=${siteId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.buildings || [];
  },

  async getWings(siteDomain: string, buildingId: string) {
    const url = `https://${siteDomain}/api/pms/buildings/wings.json?building_id=${buildingId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.wings || [];
  },

  async getAreas(siteDomain: string, buildingId: string, wingId?: string) {
    const params = new URLSearchParams({ building_id: buildingId });
    if (wingId) params.append('wing_id', wingId);

    const url = `https://${siteDomain}/api/pms/buildings/areas.json?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.areas || [];
  },

  async getFloors(siteDomain: string, buildingId: string, wingId?: string, areaId?: string) {
    const params = new URLSearchParams({ building_id: buildingId });
    if (wingId) params.append('wing_id', wingId);
    if (areaId) params.append('area_id', areaId);

    const url = `https://${siteDomain}/api/pms/buildings/floors.json?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.floors || [];
  },

  async getRooms(
    siteDomain: string,
    buildingId: string,
    wingId?: string,
    areaId?: string,
    floorId?: string
  ) {
    const params = new URLSearchParams({ building_id: buildingId });

    if (wingId) params.append('wing_id', wingId);
    if (areaId) params.append('area_id', areaId);
    if (floorId) params.append('floor_id', floorId);

    const url = `https://${siteDomain}/api/pms/buildings/rooms.json?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.rooms || [];
  },
};

interface MobileNewTicketPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const MobileNewTicketPage: React.FC<MobileNewTicketPageProps> = ({ onBack, onSuccess }) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = getUser();

  // Extract site_id from URL or use default
  const siteIdParam = searchParams.get('site_id');
  const siteId = siteIdParam ? parseInt(siteIdParam) : 2189;

  const [siteDomain, setSiteDomain] = useState<string>('');
  const [siteError, setSiteError] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : '',
    employeeId: user?.id ? `EMP-${String(user.id).padStart(4, '0')}` : 'EMP-0000',
    contactNumber: user?.mobile || user?.phone || '',
    category: '',
    categoryName: '',
    subCategory: '',
    description: '',
    building: '',
    wing: '',
    floor: '',
    area: '',
    room: '',
    proactiveReactive: '',
    severity: '',
    adminPriority: '',
  });

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategoryResponse[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [complaintFields, setComplaintFields] = useState<SnagQuestion[]>([]);
  const [loadingComplaintFields, setLoadingComplaintFields] = useState(false);
  const [dynamicFieldValues, setDynamicFieldValues] = useState<Record<number, string>>({});
  const [site_name, setSiteName] = useState('Unknown Site');
  const [customFieldConfig, setCustomFieldConfig] = useState<Record<string, boolean>>({});
  const [checklistId, setChecklistId] = useState<number | null>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [wings, setWings] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [successData, setSuccessData] = useState<{
    ticketId: string;
    message: string;
  } | null>(null);
  // Initialize: fetch site base URL, then categories and complaint fields
  useEffect(() => {
    const initializeSiteData = async () => {
      try {
        setLoadingCategories(true);
        setLoadingComplaintFields(true);
        setSiteError('');

        console.log('📌 Initializing with site_id:', siteId);

        // Step 1: Get site base URL
        const siteUrlResponse = await dynamicSiteService.getSiteBaseUrl(siteId);
        const domain = siteUrlResponse.base_url;
        const siteName = siteUrlResponse.site_name || 'Unknown Site';

        if (!domain) {
          throw new Error('No domain returned from site base URL API');
        }

        console.log('✅ Site domain:', domain);
        console.log('✅ Site name:', siteName);

        setSiteDomain(domain);
        setSiteName(siteName);
        const buildingsData = await dynamicSiteService.getBuildings(domain, siteId);
        setBuildings(buildingsData);

        // Step 2: Fetch categories
        const categoriesData = await dynamicSiteService.getCategories(domain, siteId);
        setCategories(categoriesData);
        console.log('✅ Categories loaded:', categoriesData.length);

        // Step 3: Fetch requester fields
        const fieldsData = await dynamicSiteService.getComplaintFields(domain, siteId);
        setComplaintFields(fieldsData.snag_questions || []);
        console.log(
          '✅ Complaint fields loaded:',
          fieldsData.snag_questions?.length || 0
        );
        setChecklistId(fieldsData.snag_checklist_id);

        // Step 4: Fetch custom field visibility
        const customFieldsData =
          await dynamicSiteService.getComplaintCustomFields(domain, siteId);

        const config = (customFieldsData.fields || []).reduce((acc, item) => {
          acc[item.field_name] = item.field_value === 'true';
          return acc;
        }, {} as Record<string, boolean>);

        setCustomFieldConfig(config);
        console.log('✅ Custom field config:', config);
      } catch (error) {
        console.error('❌ Error initializing site data:', error);

        setSiteError(
          `Failed to load site data: ${error instanceof Error ? error.message : 'Unknown error'
          }`
        );

        toast({
          title: 'Error',
          description: 'Failed to load categories. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoadingCategories(false);
        setLoadingComplaintFields(false);
      }
    };

    initializeSiteData();
  }, [siteId, toast]);

  const isFieldEnabled = (fieldName: string) =>
    customFieldConfig[fieldName] !== false;
  const handleCategorySelect = useCallback(async (id: string, name: string) => {
    setFormData(prev => ({ ...prev, category: id, categoryName: name, subCategory: '' }));
    setSubcategories([]);
    setLoadingSubcategories(true);
    try {
      if (!siteDomain) {
        throw new Error('Site domain not initialized');
      }

      const subs = await dynamicSiteService.getSubcategories(siteDomain, parseInt(id));
      setSubcategories(subs);
      console.log('✅ Subcategories loaded:', subs.length);
    } catch (error) {
      console.error('❌ Error fetching subcategories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subcategories. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingSubcategories(false);
    }
  }, [siteDomain, toast]);
  const handleBuildingChange = async (buildingId: string) => {
    field('building', buildingId);

    field('wing', '');
    field('area', '');
    field('floor', '');
    field('room', '');

    setWings([]);
    setAreas([]);
    setFloors([]);
    setRooms([]);

    if (!buildingId || !siteDomain) return;

    const [wingsData, areasData, floorsData] = await Promise.all([
      dynamicSiteService.getWings(siteDomain, buildingId),
      dynamicSiteService.getAreas(siteDomain, buildingId),
      dynamicSiteService.getFloors(siteDomain, buildingId),
    ]);

    setWings(wingsData);
    setAreas(areasData);
    setFloors(floorsData);
  };

  const handleWingChange = async (wingId: string) => {
    field('wing', wingId);

    field('area', '');
    field('floor', '');
    field('room', '');

    setAreas([]);
    setFloors([]);
    setRooms([]);

    if (!formData.building || !siteDomain) return;

    const [areasData, floorsData] = await Promise.all([
      dynamicSiteService.getAreas(siteDomain, formData.building, wingId),
      dynamicSiteService.getFloors(siteDomain, formData.building, wingId),
    ]);

    setAreas(areasData);
    setFloors(floorsData);
  };

  const handleAreaChange = async (areaId: string) => {
    field('area', areaId);

    field('floor', '');
    field('room', '');

    setFloors([]);
    setRooms([]);

    if (!formData.building || !siteDomain) return;

    const floorsData = await dynamicSiteService.getFloors(
      siteDomain,
      formData.building,
      formData.wing,
      areaId
    );

    setFloors(floorsData);
  };

  const handleFloorChange = async (floorId: string) => {
    field('floor', floorId);

    field('room', '');
    setRooms([]);

    if (!formData.building || !siteDomain) return;

    const roomsData = await dynamicSiteService.getRooms(
      siteDomain,
      formData.building,
      formData.wing,
      formData.area,
      floorId
    );

    setRooms(roomsData);
  };

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => {
      const slots = 5 - prev.length;
      return [...prev, ...files.slice(0, slots)];
    });
    e.target.value = '';
  };

  const handleSubmit = async () => {
    if (!formData.category) {
      toast({ title: 'Validation Error', description: 'Please select a category', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      if (!siteDomain) {
        throw new Error('Site domain not initialized');
      }
      const basicFields = complaintFields.reduce((acc, question) => {
        const value = dynamicFieldValues[question.id];

        if (value !== undefined && value !== '') {
          acc[String(question.id)] = {
            remarks: value,
            qtype: question.qtype,
          };
        }

        return acc;
      }, {} as Record<string, { remarks: string; qtype: string }>);

      // const ticketData = {
      //   of_phase: 'pms',
      //   site_id: siteId,
      //   on_behalf_of: 'admin',
      //   complaint_type: 'request',
      //   category_type_id: parseInt(formData.category),
      //   heading: formData.description || formData.categoryName,
      //   complaint_mode_id: 75,
      //   room_id: 1,
      //   wing_id: 1,
      //   area_id: 1,
      //   floor_id: 1,
      //   priority: 'P3',
      //   society_staff_type: 'User',
      //   proactive_reactive: 'reactive',
      //   ...(user?.id && { id_user: user.id }),
      //   ...(formData.subCategory && { sub_category_id: parseInt(formData.subCategory) }),
      // };
      const ticketData = {
        site_id: siteId,
        on_behalf_of: 'self',
        of_phase: 'pms',
        complaint_type: 'complaint',
        sel_id_user: null,
        fm_user_id: user?.id || null,
        checklist_id: checklistId || null,

        complaint: {
          heading: formData.description || formData.categoryName,
          text: formData.description,
          of_phase: 'pms',
          complaint_type: 'complaint',

          ...(isFieldEnabled('category_enabled') &&
            formData.category && {
            category_type_id: parseInt(formData.category),
          }),

          ...(isFieldEnabled('sub_category_enabled') &&
            formData.subCategory && {
            sub_category_id: parseInt(formData.subCategory),
          }),

          priority: 'P3',
          ...(formData.building && { tower_id: parseInt(formData.building) }),
          ...(formData.wing && { wing_id: parseInt(formData.wing) }),
          ...(formData.area && { area_id: parseInt(formData.area) }),
          ...(formData.floor && { floor_id: parseInt(formData.floor) }),
          ...(formData.room && { room_id: parseInt(formData.room) }),
          on_behalf_of: 'self',
          ...(isFieldEnabled('proactive_reactive_enabled') &&
            formData.proactiveReactive && {
            proactive_reactive: formData.proactiveReactive,
          }),

          ...(isFieldEnabled('severity_enabled') &&
            formData.severity && {
            severity: formData.severity,
          }),

          ...(isFieldEnabled('admin_priority_enabled') &&
            formData.adminPriority && {
            priority: formData.adminPriority,
          }),
        },

        attachments: [],

        basic_fields: basicFields,
      };

      console.log('📤 Submitting ticket:', ticketData);

      // Try using the dynamic site domain, fallback to ticketManagementAPI
      try {
        // const submitUrl = `${siteDomain}/pms/admin/helpdesk_request/create.json`;
        const submitUrl = `https://${siteDomain}/pms/admin/complaints/create_site_ticket.json`;

        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ticketData),
        });
        result = await response.json();

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('✅ Ticket submitted successfully via dynamic domain');
      } catch (dynamicError) {
        console.warn('⚠️ Dynamic submission failed, trying ticketManagementAPI:', dynamicError);
        // await ticketManagementAPI.createTicket(ticketData, attachments);
        // result = await ticketManagementAPI.createTicket(ticketData, attachments);
        console.error('❌ Error submitting ticket via dynamic domain:', dynamicError);

      }
      

      // toast({ title: 'Success', description: 'Ticket submitted successfully!' });
      // onSuccess();
      console.log('✅ Ticket submission result:', result);
      setSuccessData({
        ticketId: String(result.complaint_id),
        message: result.message || 'Ticket created successfully',
      });


      return;
    } catch (error) {
      console.error('❌ Submit error:', error);
      toast({ title: 'Error', description: 'Failed to submit ticket. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof formData, val: string) =>
    setFormData(prev => ({ ...prev, [key]: val }));

  /**
   * Render form input based on field type (qtype)
   */
  const renderDynamicField = (field: SnagQuestion) => {
    const value = dynamicFieldValues[field.id] || '';
    const handleChange = (val: string) => {
      setDynamicFieldValues(prev => ({ ...prev, [field.id]: val }));
    };

    switch (field.qtype) {
      case 'email':
        return (
          <Input
            key={field.id}
            type="email"
            placeholder={`e.g. ${field.descr.toLowerCase()}@example.com`}
            value={value}
            onChange={e => handleChange(e.target.value)}
            className="h-10 rounded-lg text-sm md:h-11"
            style={{ borderColor: '#d3d1c7' }}
          />
        );
      case 'number':
        return (
          <Input
            key={field.id}
            type="number"
            placeholder={`Enter ${field.descr.toLowerCase()}`}
            value={value}
            onChange={e => handleChange(e.target.value)}
            className="h-10 rounded-lg text-sm md:h-11"
            style={{ borderColor: '#d3d1c7' }}
          />
        );
      case 'date':
        return (
          <Input
            key={field.id}
            type="date"
            value={value}
            onChange={e => handleChange(e.target.value)}
            className="h-10 rounded-lg text-sm md:h-11"
            style={{ borderColor: '#d3d1c7' }}
          />
        );
      case 'textarea':
        return (
          <Textarea
            key={field.id}
            placeholder={`Enter ${field.descr.toLowerCase()}`}
            value={value}
            onChange={e => handleChange(e.target.value)}
            rows={3}
            className="resize-none rounded-lg text-sm"
            style={{ borderColor: '#d3d1c7' }}
          />
        );
      case 'text':
      default:
        return (
          <Input
            key={field.id}
            type="text"
            placeholder={`Enter ${field.descr.toLowerCase()}`}
            value={value}
            onChange={e => handleChange(e.target.value)}
            className="h-10 rounded-lg text-sm md:h-11"
            style={{ borderColor: '#d3d1c7' }}
          />
        );
    }
  };

  const handleCopyTicketId = async () => {
    if (!successData?.ticketId) return;

    await navigator.clipboard.writeText(successData.ticketId);

    toast({
      title: 'Copied',
      description: 'Ticket ID copied to clipboard',
    });
  };
  if (successData) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ backgroundColor: '#f6f4ee' }}
      >
        <div className="w-full max-w-md text-center">
          <div
            className="mx-auto mb-6 w-24 h-24 rounded-full flex items-center justify-center border-4"
            style={{
              borderColor: '#18b26a',
              backgroundColor: 'rgba(24,178,106,0.08)',
            }}
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#18b26a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h2
            className="text-3xl font-bold mb-3"
            style={{ color: '#111827' }}
          >
            Request Submitted!
          </h2>

          <p
            className="text-base leading-7 mb-8"
            style={{ color: '#6b7280' }}
          >
            Your request has been received and assigned to the team.
            You'll be notified when work begins.
          </p>

          <div
            className="rounded-3xl px-6 py-6 shadow-lg"
            style={{ backgroundColor: '#1f3d99' }}
          >
            <p
              className="text-xs font-semibold tracking-widest mb-3"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              TICKET ID
            </p>

            <div className="flex items-center justify-between gap-3">
              <div
                className="text-3xl font-bold"
                style={{ color: '#ffffff' }}
              >
                {successData.ticketId}
              </div>

              <button
                onClick={handleCopyTicketId}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255,255,255,0.16)' }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>

            <p
              className="text-sm mt-4"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Save this ID to track your request status
            </p>
          </div>

          {/* <button
          onClick={onSuccess}
          className="mt-6 w-full py-4 rounded-2xl font-semibold text-white"
          style={{ backgroundColor: '#da7756' }}
        >
          Done
        </button> */}
        </div>
      </div>
    );
  }
  return (
    /*
     * Mobile  : full-screen flex column, inner div scrolls, button sticks via sticky
     * Desktop : normal page flow, content capped at max-w-3xl, centred
     */
    <div
      className="flex flex-col h-screen md:h-auto md:min-h-screen"
      style={{ backgroundColor: '#f6f4ee' }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow-sm flex-shrink-0 md:sticky md:top-0 md:z-10 md:px-8">
        <button onClick={onBack} className="p-1 rounded-lg active:bg-gray-100">
          <ArrowLeft className="h-6 w-6" style={{ color: '#2c2c2c' }} />
        </button>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#da7756' }}
          >
            <QrCode className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-lg font-semibold" style={{ color: '#2c2c2c' }}>New Ticket</h1>
        </div>
        <button className="p-1 rounded-lg active:bg-gray-100">
          <Settings className="h-6 w-6" style={{ color: '#2c2c2c' }} />
        </button>
      </div>

      {/* ── Scrollable body ────────────────────────────────────── */}
      {/*
       * Mobile  : flex-1 overflow-y-auto keeps content scrollable inside h-screen
       * Desktop : overflow visible, page itself scrolls
       */}
      <div className="flex-1 overflow-y-auto md:flex-none md:overflow-visible">
        {/* Centred content column on desktop */}
        <div className="md:max-w-3xl md:mx-auto md:px-4 md:py-6 pb-6">

          {/* Scanned Location */}
          <div
            className="mx-4 mt-4 md:mx-0 rounded-xl p-4 flex items-center gap-3"
            style={{ backgroundColor: '#dce8f5' }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#da7756' }}
            >
              <QrCode className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: '#5a7a9a' }}>Scanned Location</p>
              <p className="text-base font-semibold" style={{ color: '#2c2c2c' }}>{site_name}</p>
            </div>
          </div>

          {/* Requester Details */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm" style={{ color: '#da7756' }}>&#9432;</span>
              <span className="text-base font-semibold" style={{ color: '#2c2c2c' }}>
                Requester Details
              </span>
            </div>

            {loadingComplaintFields ? (
              <div className="text-center py-4 text-sm" style={{ color: '#888780' }}>
                Loading requester fields…
              </div>
            ) : complaintFields.length === 0 ? (
              <div className="text-center py-4 text-sm" style={{ color: '#888780' }}>
                No requester fields available
              </div>
            ) : (
              <div className="space-y-3">
                {complaintFields.map((question) => (
                  <div key={question.id}>
                    <label
                      className="text-xs font-medium mb-1 block"
                      style={{ color: '#2c2c2c' }}
                    >
                      {question.descr}
                    </label>

                    {renderDynamicField(question)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {isFieldEnabled('category_enabled') && (
            <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
              {/* Category */}
              <p className="text-base font-semibold mb-3" style={{ color: '#2c2c2c' }}>
                Category <span style={{ color: '#da7756' }}>*</span>
              </p>

              {siteError && (
                <div
                  className="mb-4 p-3 rounded-lg"
                  style={{
                    backgroundColor: '#fee',
                    borderLeft: '3px solid #da7756',
                  }}
                >
                  <p className="text-sm" style={{ color: '#c00' }}>
                    ⚠️ {siteError}
                  </p>
                </div>
              )}

              {loadingCategories ? (
                <div
                  className="text-center py-6 text-sm"
                  style={{ color: '#888780' }}
                >
                  Loading categories…
                </div>
              ) : categories.length === 0 ? (
                <div
                  className="text-center py-6 text-sm"
                  style={{ color: '#888780' }}
                >
                  No categories available
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categories.map((cat, idx) => {
                    const Icon = getCategoryIcon(cat.name, idx);
                    const selected = formData.category === cat.id.toString();

                    return (
                      <button
                        key={cat.id}
                        onClick={() =>
                          handleCategorySelect(cat.id.toString(), cat.name)
                        }
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all active:scale-95 hover:shadow-sm"
                        style={{
                          borderColor: selected ? '#da7756' : '#e8e4dc',
                          backgroundColor: selected
                            ? 'rgba(218,119,86,0.08)'
                            : '#fff',
                        }}
                      >
                        <Icon
                          className="h-7 w-7"
                          style={{
                            color: selected ? '#da7756' : '#888780',
                          }}
                        />

                        <span
                          className="text-xs font-medium text-center leading-tight"
                          style={{
                            color: selected ? '#da7756' : '#2c2c2c',
                          }}
                        >
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Subcategory */}
          {isFieldEnabled('sub_category_enabled') && (

            <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
              <label className="text-base font-semibold mb-3 block" style={{ color: '#2c2c2c' }}>
                Subcategory <span style={{ color: '#da7756' }}>*</span>
              </label>
              <Select
                value={formData.subCategory}
                onValueChange={val => field('subCategory', val)}
                disabled={!formData.category || loadingSubcategories}
              >
                <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                  <SelectValue
                    placeholder={
                      !formData.category
                        ? 'Select a category first'
                        : loadingSubcategories
                          ? 'Loading…'
                          : 'Select subcategory'
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-60" style={{ borderColor: '#d3d1c7', backgroundColor: '#d3d1c7 !important' }}>
                  {subcategories.map(sub => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          {isFieldEnabled('description_enabled') && (
            <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
              <label className="text-base font-semibold mb-1 block" style={{ color: '#2c2c2c' }}>
                Description
              </label>
              <Textarea
                placeholder="Describe the issue in detail — what happened, when it started, any relevant observations..."
                value={formData.description}
                onChange={e => field('description', e.target.value)}
                rows={4}
                className="resize-none rounded-lg text-sm mt-2"
                style={{ borderColor: '#d3d1c7' }}
              />
              <p className="text-xs mt-2" style={{ color: '#888780' }}>
                Optional but helps our team respond faster
              </p>
            </div>
          )}
          {(isFieldEnabled('proactive_reactive_enabled') ||
            isFieldEnabled('severity_enabled') ||
            isFieldEnabled('admin_priority_enabled')) && (
              <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
                <p
                  className="text-base font-semibold mb-3"
                  style={{ color: '#2c2c2c' }}
                >
                  Additional Details
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {isFieldEnabled('proactive_reactive_enabled') && (
                    <div>
                      <label
                        className="text-xs font-medium mb-1 block"
                        style={{ color: '#888780' }}
                      >
                        Proactive / Reactive
                      </label>

                      <Select
                        value={formData.proactiveReactive}
                        onValueChange={(val) => field('proactiveReactive', val)}
                      >
                        <SelectTrigger
                          className="h-11 rounded-lg text-sm"
                          style={{ borderColor: '#d3d1c7' }}
                        >
                          <SelectValue placeholder="Select Proactive/Reactive" />
                        </SelectTrigger>

                        <SelectContent>
                          {PROACTIVE_REACTIVE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {isFieldEnabled('severity_enabled') && (
                    <div>
                      <label
                        className="text-xs font-medium mb-1 block"
                        style={{ color: '#888780' }}
                      >
                        Severity
                      </label>

                      <Select
                        value={formData.severity}
                        onValueChange={(val) => field('severity', val)}
                      >
                        <SelectTrigger
                          className="h-11 rounded-lg text-sm"
                          style={{ borderColor: '#d3d1c7' }}
                        >
                          <SelectValue placeholder="Select Severity" />
                        </SelectTrigger>

                        <SelectContent>
                          {SEVERITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {isFieldEnabled('admin_priority_enabled') && (
                    <div>
                      <label
                        className="text-xs font-medium mb-1 block"
                        style={{ color: '#888780' }}
                      >
                        Admin Priority
                      </label>

                      <Select
                        value={formData.adminPriority}
                        onValueChange={(val) => field('adminPriority', val)}
                      >
                        <SelectTrigger
                          className="h-11 rounded-lg text-sm"
                          style={{ borderColor: '#d3d1c7' }}
                        >
                          <SelectValue placeholder="Select Admin Priority" />
                        </SelectTrigger>

                        <SelectContent>
                          {PRIORITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}
          {/* Attachments */}
          <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base font-semibold" style={{ color: '#2c2c2c' }}>Attachments</span>
              <span className="text-sm" style={{ color: '#888780' }}>Optional</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-lg border flex items-center justify-center"
                  style={{ borderColor: '#c4b89d', backgroundColor: '#f6f4ee' }}
                >
                  <span className="text-xs text-center px-1 line-clamp-2 break-all" style={{ color: '#2c2c2c' }}>
                    {file.name.length > 8 ? file.name.slice(0, 7) + '…' : file.name}
                  </span>
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#da7756' }}
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {attachments.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 active:bg-gray-50 hover:bg-gray-50"
                  style={{ borderColor: '#c4b89d' }}
                >
                  <Plus className="h-5 w-5" style={{ color: '#888780' }} />
                  <span className="text-xs" style={{ color: '#888780' }}>Add</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileAdd}
              className="hidden"
            />
            <p className="text-xs mt-2" style={{ color: '#888780' }}>
              JPEG, PNG, PDF up to 10MB each · Max 5 files
            </p>
          </div>

          {isFieldEnabled('location_enabled') && (
            <div className="mx-4 mt-4 md:mx-0 bg-white rounded-xl p-4 md:p-6">
              <p className="text-base font-semibold mb-3" style={{ color: '#2c2c2c' }}>
                Location <span style={{ color: '#da7756' }}>*</span>
              </p>

              <div className="mb-3">
                <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>
                  Building
                </label>

                <Select value={formData.building} onValueChange={handleBuildingChange}>
                  <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                    <SelectValue placeholder="Select Building" />
                  </SelectTrigger>

                  <SelectContent>
                    {buildings.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>
                    Wing
                  </label>

                  <Select
                    value={formData.wing}
                    onValueChange={handleWingChange}
                    disabled={!formData.building}
                  >
                    <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                      <SelectValue placeholder="Select Wing" />
                    </SelectTrigger>

                    <SelectContent>
                      {wings.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>
                    Floor
                  </label>

                  <Select
                    value={formData.floor}
                    onValueChange={handleFloorChange}
                    disabled={!formData.building}
                  >
                    <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                      <SelectValue placeholder="Select Floor" />
                    </SelectTrigger>

                    <SelectContent>
                      {floors.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>
                    Area
                  </label>

                  <Select
                    value={formData.area}
                    onValueChange={handleAreaChange}
                    disabled={!formData.building}
                  >
                    <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>

                    <SelectContent>
                      {areas.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium mb-1 block" style={{ color: '#888780' }}>
                    Room
                  </label>

                  <Select
                    value={formData.room}
                    onValueChange={(val) => field('room', val)}
                    disabled={!formData.floor}
                  >
                    <SelectTrigger className="h-11 rounded-lg text-sm" style={{ borderColor: '#d3d1c7' }}>
                      <SelectValue placeholder="Select Room" />
                    </SelectTrigger>

                    <SelectContent>
                      {rooms.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <p className="mx-4 mt-3 md:mx-0 text-xs" style={{ color: '#888780' }}>* Required fields</p>

          {/* ── Submit button – desktop: inline block at bottom of content ── */}
          <div
            className="hidden md:block mt-6 mb-2"
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: '#da7756' }}
            >
              <span>{loading ? 'Submitting…' : 'Submit Request'}</span>
              {!loading && <span className="text-lg">›</span>}
            </button>
          </div>

        </div>{/* /centred column */}
      </div>{/* /scrollable body */}

      {/* ── Submit button – mobile only: sticky to bottom of scroll container ── */}
      <div
        className="md:hidden sticky bottom-0 left-0 right-0 px-4 py-4 bg-white border-t flex-shrink-0"
        style={{ borderColor: '#e8e4dc' }}
      >
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2 transition-opacity active:opacity-80 disabled:opacity-60"
          style={{ backgroundColor: '#da7756' }}
        >
          <span>{loading ? 'Submitting…' : 'Submit Request'}</span>
          {!loading && <span className="text-lg">›</span>}
        </button>
      </div>
    </div >
  );
};
