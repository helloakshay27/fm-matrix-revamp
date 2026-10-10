import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, Select, MenuItem, SelectChangeEvent, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { Recycle, ArrowLeft, Plus, Trash2, X, Eye } from 'lucide-react';
import {
  fetchBuildings,
  fetchWings,
  fetchAreas,
  fetchCommodities,
  fetchSubcategoriesByParent,
  fetchOperationalLandlords,
  fetchEntities,
  fetchWasteGenerationById,
  updateWasteGenerationWithEntries,
  Building as BuildingType,
  Wing,
  Area,
  Commodity,
  Category,
  OperationalLandlord,
  Entity,
  UpdateWasteGenerationEntriesPayload,
  WasteEntryValueUpdateInput
} from '@/services/wasteGenerationAPI';
import { SupplierSearchSelect } from '@/components/SupplierSearchSelect';
import { FormSearchSelect } from '@/components/FormSearchSelect';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';

// Already-uploaded file on an existing waste entry — shown read-only (no
// remove control, since we don't send a "keep vs delete" signal to the API).
type ExistingAttachment = { url: string; name: string };
type ExistingBagValue = { id: number; value: string };

// One row in the "Waste Entries" section: a category + commodity with a bag
// count and overall weight (which gets split evenly across that many bags
// before being sent as the `values` array the update_waste API expects),
// plus attachments. `id` is set for rows loaded from the existing record so
// the backend can update them in place instead of creating duplicates.
interface WasteEntryRow {
  key: string;
  id?: number;
  category: string;
  commodity: string;
  uom: string;
  bagCount: string;
  overallWeight: string;
  attachments: File[];
  existingAttachments: ExistingAttachment[];
  existingValues: ExistingBagValue[];
}

let wasteEntryRowSeq = 0;
const createEmptyWasteEntryRow = (): WasteEntryRow => ({
  key: `entry-${++wasteEntryRowSeq}`,
  category: '',
  commodity: '',
  uom: 'Kg',
  bagCount: '1',
  overallWeight: '',
  attachments: [],
  existingAttachments: [],
  existingValues: [],
});

// Splits `total` evenly across `count` bags (e.g. 50 over 5 bags -> [10,10,10,10,10]).
// Rounds each share to 2 decimals and folds any rounding remainder into the
// last bag so the values always sum back to exactly `total`.
const distributeWeight = (total: number, count: number): number[] => {
  if (count <= 0 || !(total >= 0)) return [];
  const share = Math.floor((total / count) * 100) / 100;
  const values = Array(count).fill(share);
  const remainder = Math.round((total - share * count) * 100) / 100;
  values[values.length - 1] = Math.round((values[values.length - 1] + remainder) * 100) / 100;
  return values;
};

const normalizeAttachment = (raw: unknown): ExistingAttachment | null => {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as Record<string, unknown>;

  // Real shape returned by the waste generation API: { id, document: "<url-encoded,
  // protocol-relative S3 URL>", active }. A few more conventional field names are
  // checked too in case other records/endpoints shape this differently.
  const rawUrl = [record.document, record.url, record.document_url, record.file_url].find(
    (v): v is string => typeof v === 'string' && v.trim().length > 0
  );
  if (!rawUrl) return null;

  let decoded = rawUrl;
  try {
    decoded = decodeURIComponent(rawUrl);
  } catch {
    // Not actually URL-encoded — use as-is.
  }
  const url = decoded.startsWith('//') ? `https:${decoded}` : decoded;

  const explicitName = [record.document_name, record.document_file_name, record.name, record.file_name].find(
    (v): v is string => typeof v === 'string' && v.trim().length > 0
  );
  const fallbackName = (url.split('/').pop() || 'Attachment').split('?')[0];
  const candidateName = explicitName ?? fallbackName;
  const name = candidateName.toLowerCase() === 'download' ? 'Attachment' : candidateName;

  return { url, name };
};

// Business Genie input spec: label sits above the control (FieldLabel), white surface,
// 44px min height, 12px radius, 1px hairline border, 13.5px/500 text.
// `&.MuiOutlinedInput-root` covers a bare <Select>; `& .MuiOutlinedInput-root` a <TextField>.
const fieldStyles = {
  '&.MuiOutlinedInput-root, & .MuiOutlinedInput-root': {
    minHeight: 44,
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(44, 44, 44, 0.12)',
  },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: '10px 14px',
    fontSize: '13.5px',
    fontWeight: 500,
    color: '#2C2C2C',
  },
};

const textareaStyles = {
  ...fieldStyles,
  '& .MuiOutlinedInput-root': {
    minHeight: 88,
    borderRadius: '12px',
    backgroundColor: '#FFFFFF',
    padding: '12px 14px',
    alignItems: 'flex-start',
  },
  '& .MuiInputBase-input': {
    padding: 0,
    fontSize: '13.5px',
    fontWeight: 500,
    color: '#2C2C2C',
    resize: 'none',
  },
};

const FieldLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <span className="block mb-1.5 text-[12px] font-semibold text-[rgba(44,44,44,0.68)]">
    {children}
    {required && <span className="fm-required-mark">*</span>}
  </span>
);

// Compact variant of fieldStyles for inputs/selects placed inside the
// Waste Entries table cells, where the column header already acts as the label
const tableFieldStyles = {
  height: 40,
  backgroundColor: 'white',
  '& .MuiInputBase-input': {
    padding: '8px 10px',
  },
  // Select needs extra right padding to leave room for its dropdown arrow —
  // reusing the plain-input padding above collapses that gap, so the arrow
  // ends up overlapping long placeholder text like "Select Commodity".
  '& .MuiSelect-select': {
    padding: '8px 32px 8px 10px',
  },
};

// Shared MenuProps so Select dropdowns render correctly (positioned under the
// field, not detached) and match the brand-consistent styling used elsewhere
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

const EditWasteGenerationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast: reactToast } = useToast();

  const [initialLoading, setInitialLoading] = useState(true);
  const [isAttachmentPreviewOpen, setIsAttachmentPreviewOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    id: number;
    document_name?: string;
    document_file_name?: string;
    url: string;
  } | null>(null);
  const [generatorType, setGeneratorType] = useState<'self' | 'customer'>('self');
  const [customerId, setCustomerId] = useState('');

  const [formData, setFormData] = useState({
    building: '',
    wing: '',
    area: '',
    date: '',
    vendor: '',
    operationalName: '',
    agencyName: '',
    recycledUnit: '0',
    remark: '',
  });

  const [wasteEntries, setWasteEntries] = useState<WasteEntryRow[]>([createEmptyWasteEntryRow()]);
  const [deletedWasteEntryIds, setDeletedWasteEntryIds] = useState<number[]>([]);

  // API data state
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [wings, setWings] = useState<Wing[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  // Subcategories are fetched per selected Category (commodity) via
  // q[parent_id]=<id>, so they're cached here keyed by that parent's id
  // rather than loaded as one flat list up front.
  const [subcategoriesByParent, setSubcategoriesByParent] = useState<Record<string, Category[]>>({});
  const [loadingSubcategoryParents, setLoadingSubcategoryParents] = useState<Record<string, boolean>>({});
  const [operationalLandlords, setOperationalLandlords] = useState<OperationalLandlord[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);

  // Loading states
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingCommodities, setLoadingCommodities] = useState(false);
  const [loadingOperationalLandlords, setLoadingOperationalLandlords] = useState(false);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing waste generation data on component mount
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!id) return;

      try {
        setInitialLoading(true);

        const existingData = await fetchWasteGenerationById(parseInt(id));

        const formatDate = (dateString: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          building: existingData.building_id?.toString() || '',
          wing: existingData.wing_id?.toString() || '',
          area: existingData.area_id?.toString() || '',
          date: formatDate(existingData.wg_date),
          vendor: existingData.vendor?.id?.toString() || '',
          operationalName: existingData.operational_landlord?.id?.toString() || '',
          agencyName: existingData.agency_name || '',
          recycledUnit: existingData.recycled_unit?.toString() || '0',
          remark: existingData.remark || '',
        });

        if (existingData.entity_id != null) {
          setGeneratorType('customer');
          setCustomerId(existingData.entity_id.toString());
        }

        // Multi-category records carry their breakdown in `categories`; legacy
        // single-category records only have the flat commodity/category/waste_unit
        // fields directly on the record — fall back to a single preselected row.
        const categoryEntries = existingData.categories;
        const initialEntries: WasteEntryRow[] =
          categoryEntries && categoryEntries.length > 0
            ? categoryEntries.map((entry) => ({
                key: `entry-${++wasteEntryRowSeq}`,
                id: entry.id,
                category: entry.category?.id?.toString() || '',
                commodity: entry.commodity?.id?.toString() || '',
                uom: entry.uom || 'Kg',
                bagCount: (entry.bag_counts ?? 1).toString(),
                overallWeight: entry.waste_unit != null ? String(entry.waste_unit) : '',
                attachments: [],
                existingAttachments: (entry.attachments || [])
                  .map(normalizeAttachment)
                  .filter((a): a is ExistingAttachment => Boolean(a)),
                existingValues: (entry.waste_bag_details || []).map((value) => ({
                  id: value.id,
                  value: value.field_value,
                })),
              }))
            : [
                {
                  key: `entry-${++wasteEntryRowSeq}`,
                  id: undefined,
                  category: existingData.category?.id?.toString() || '',
                  commodity: existingData.commodity?.id?.toString() || '',
                  uom: 'Kg',
                  bagCount: (existingData.bag_counts ?? 1).toString(),
                  overallWeight: existingData.waste_unit != null ? String(existingData.waste_unit) : '',
                  attachments: [],
                  existingAttachments: (existingData.attachments || [])
                    .map(normalizeAttachment)
                    .filter((a): a is ExistingAttachment => Boolean(a)),
                  existingValues: (existingData.waste_bag_details || []).map((value) => ({
                    id: value.id,
                    value: value.field_value,
                  })),
                },
              ];
        setWasteEntries(initialEntries);

        // Pre-fetch the Subcategory list for each row's already-selected
        // Category so its existing Subcategory shows correctly instead of blank.
        const parentIds = Array.from(
          new Set(initialEntries.map((entry) => entry.commodity).filter(Boolean))
        );
        parentIds.forEach((parentId) => {
          loadSubcategoriesForParent(parentId);
        });
      } catch (error) {
        console.error('Error fetching waste generation data:', error);
        toast.error('Failed to load waste generation data');
        navigate('/maintenance/waste/generation');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExistingData();
  }, [id, navigate]);

  // Fetch all dropdowns data on component mount
  useEffect(() => {
    const fetchAllDropdowns = async () => {
      setLoadingBuildings(true);
      try {
        const buildingsData = await fetchBuildings();
        setBuildings(Array.isArray(buildingsData) ? buildingsData : []);
      } catch (error) {
        console.error('Error fetching buildings:', error);
        setBuildings([]);
        toast.error('Failed to load buildings');
      } finally {
        setLoadingBuildings(false);
      }

      setLoadingCommodities(true);
      try {
        const commoditiesData = await fetchCommodities();
        setCommodities(Array.isArray(commoditiesData) ? commoditiesData : []);
      } catch (error) {
        console.error('Error fetching commodities:', error);
        setCommodities([]);
        toast.error('Failed to load commodities');
      } finally {
        setLoadingCommodities(false);
      }


      setLoadingOperationalLandlords(true);
      try {
        const operationalLandlordsData = await fetchOperationalLandlords();
        setOperationalLandlords(Array.isArray(operationalLandlordsData) ? operationalLandlordsData : []);
      } catch (error) {
        console.error('Error fetching operational landlords:', error);
        setOperationalLandlords([]);
        toast.error('Failed to load operational landlords');
      } finally {
        setLoadingOperationalLandlords(false);
      }

      setLoadingEntities(true);
      try {
        const entitiesData = await fetchEntities();
        setEntities(Array.isArray(entitiesData) ? entitiesData : []);
      } catch (error) {
        console.error('Error fetching entities:', error);
        setEntities([]);
        toast.error('Failed to load customers');
      } finally {
        setLoadingEntities(false);
      }
    };

    fetchAllDropdowns();
  }, []);

  // Fetch wings when building changes
  useEffect(() => {
    const fetchWingsData = async () => {
      if (!formData.building) {
        setWings([]);
        setFormData(prev => ({ ...prev, wing: '', area: '' }));
        return;
      }

      setLoadingWings(true);
      try {
        const wingsData = await fetchWings(parseInt(formData.building));
        setWings(Array.isArray(wingsData) ? wingsData : []);
      } catch (error) {
        console.error('Error fetching wings:', error);
        setWings([]);
        toast.error('Failed to fetch wings');
      } finally {
        setLoadingWings(false);
      }
    };

    fetchWingsData();
  }, [formData.building]);

  // Fetch areas when wing changes
  useEffect(() => {
    const fetchAreasData = async () => {
      if (!formData.wing) {
        setAreas([]);
        setFormData(prev => ({ ...prev, area: '' }));
        return;
      }

      setLoadingAreas(true);
      try {
        const areasData = await fetchAreas(parseInt(formData.wing));
        setAreas(Array.isArray(areasData) ? areasData : []);
      } catch (error) {
        console.error('Error fetching areas:', error);
        setAreas([]);
        toast.error('Failed to fetch areas');
      } finally {
        setLoadingAreas(false);
      }
    };

    fetchAreasData();
  }, [formData.wing]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "recycledUnit" && Number(value) < 0) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Waste entry (category row) helpers
  const addWasteEntry = () => {
    setWasteEntries(prev => [...prev, createEmptyWasteEntryRow()]);
  };

  const removeWasteEntry = (key: string) => {
    if (wasteEntries.length <= 1) return;
    const removedEntry = wasteEntries.find((entry) => entry.key === key);
    if (removedEntry?.id) {
      setDeletedWasteEntryIds((previous) => [...previous, removedEntry.id as number]);
    }
    setWasteEntries((previous) => previous.filter((entry) => entry.key !== key));
  };

  const updateWasteEntry = (
    key: string,
    field: 'category' | 'commodity' | 'uom' | 'bagCount' | 'overallWeight',
    value: string
  ) => {
    if ((field === 'bagCount' || field === 'overallWeight') && Number(value) < 0) {
      return;
    }
    setWasteEntries(prev =>
      prev.map(entry => {
        if (entry.key !== key) return entry;
        // Subcategory options depend on which Category (commodity) is selected,
        // so changing the parent Category clears any previously chosen Subcategory.
        if (field === 'commodity') {
          return { ...entry, commodity: value, category: '' };
        }
        return { ...entry, [field]: value };
      })
    );

    if (field === 'commodity' && value) {
      loadSubcategoriesForParent(value);
    }
  };

  // Fetches and caches the Subcategory list for a given parent Category
  // (commodity) id, skipping the call if it's already cached or in flight.
  const loadSubcategoriesForParent = async (parentId: string) => {
    if (subcategoriesByParent[parentId] || loadingSubcategoryParents[parentId]) return;
    setLoadingSubcategoryParents(prev => ({ ...prev, [parentId]: true }));
    try {
      const data = await fetchSubcategoriesByParent(parseInt(parentId, 10));
      setSubcategoriesByParent(prev => ({ ...prev, [parentId]: Array.isArray(data) ? data : [] }));
    } catch (error) {
      console.error('Error fetching subcategories for parent:', error);
      toast.error('Failed to load subcategories');
    } finally {
      setLoadingSubcategoryParents(prev => ({ ...prev, [parentId]: false }));
    }
  };

  const addAttachments = (key: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setWasteEntries(prev =>
      prev.map(entry =>
        entry.key === key ? { ...entry, attachments: [...entry.attachments, ...Array.from(files)] } : entry
      )
    );
  };

  const removeAttachment = (key: string, index: number) => {
    setWasteEntries(prev =>
      prev.map(entry =>
        entry.key === key ? { ...entry, attachments: entry.attachments.filter((_, i) => i !== index) } : entry
      )
    );
  };

  const totalGeneratedUnit = useMemo(
    () => wasteEntries.reduce((sum, entry) => sum + (parseFloat(entry.overallWeight) || 0), 0),
    [wasteEntries]
  );

  const handleUpdate = async () => {
    if (!id) return;

    if (!formData.building) {
      toast.error("Validation Error: Building is required.");
      return;
    }

    if (!formData.date) {
      toast.error("Validation Error: Date is required.");
      return;
    }

    if (formData.date > new Date().toISOString().split('T')[0]) {
      toast.error("Validation Error: Date cannot be a future date.");
      return;
    }

    if (!formData.vendor) {
      toast.error("Validation Error: Vendor is required.");
      return;
    }

    if (!formData.operationalName) {
      toast.error("Validation Error: Operational Name of Landlord/Tenant is required.");
      return;
    }

    if (wasteEntries.length === 0) {
      toast.error("Validation Error: At least one waste category entry is required.");
      return;
    }

    for (const entry of wasteEntries) {
      if (!entry.category) {
        toast.error("Validation Error: Subcategory is required for every waste entry.");
        return;
      }
      if (!entry.commodity) {
        toast.error("Validation Error: Category is required for every waste entry.");
        return;
      }
      if (!entry.uom.trim()) {
        toast.error("Validation Error: UOM is required for every waste entry.");
        return;
      }
      if (!entry.bagCount || parseInt(entry.bagCount, 10) <= 0) {
        toast.error("Validation Error: Bag Count must be at least 1 for every waste entry.");
        return;
      }
      if (!entry.overallWeight || parseFloat(entry.overallWeight) <= 0) {
        toast.error("Validation Error: Overall Weight must be greater than 0 for every waste entry.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload: UpdateWasteGenerationEntriesPayload = {
        waste_generation_id: parseInt(id),
        pms_waste_generation: {
          wg_date: formData.date,
          vendor_id: formData.vendor ? parseInt(formData.vendor) : null,
          operational_landlord_id: parseInt(formData.operationalName),
          building_id: parseInt(formData.building),
          wing_id: formData.wing ? parseInt(formData.wing) : null,
          area_id: formData.area ? parseInt(formData.area) : null,
          agency_name: formData.agencyName || '',
          recycled_unit: formData.recycledUnit ? parseFloat(formData.recycledUnit) : 0,
          remark: formData.remark || '',
          entity_id: generatorType === 'customer' && customerId ? parseInt(customerId) : null,
        },
        waste_entries: [
          ...wasteEntries.map((entry) => {
            const bagCount = parseInt(entry.bagCount, 10);
            const values: WasteEntryValueUpdateInput[] = distributeWeight(
              parseFloat(entry.overallWeight),
              bagCount
            ).map((value, index) => ({
              ...(entry.existingValues[index] ? { id: entry.existingValues[index].id } : {}),
              value: String(value),
            }));
            values.push(
              ...entry.existingValues.slice(bagCount).map((value) => ({
                id: value.id,
                value: value.value,
                _destroy: true,
              }))
            );
            return {
              id: entry.id,
              category_id: parseInt(entry.category),
              commodity_id: parseInt(entry.commodity),
              uom: entry.uom,
              values,
              attachments: entry.attachments,
              signature: null,
            };
          }),
          ...deletedWasteEntryIds.map((entryId) => ({ id: entryId, _destroy: true })),
        ],
      };

      console.log('Submitting waste generation update:', payload);

      await updateWasteGenerationWithEntries(parseInt(id), payload);

      toast.success('Waste generation updated successfully!');
      navigate(`/maintenance/waste/generation/${id}`);

    } catch (error) {
      console.error('Error updating waste generation:', error);
      toast.error('Failed to update waste generation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(`/maintenance/waste/generation/${id}`);
  };

  const buildingOptions = useMemo(
    () => buildings.map((b) => ({ value: b.id.toString(), label: b.name })),
    [buildings]
  );
  const wingOptions = useMemo(
    () => wings.map((w) => ({ value: w.id.toString(), label: w.name })),
    [wings]
  );
  const areaOptions = useMemo(
    () => areas.map((a) => ({ value: a.id.toString(), label: a.name })),
    [areas]
  );
  const commodityOptions = useMemo(
    () =>
      commodities.map((c) => ({
        value: c.id.toString(),
        label: c.category_name,
      })),
    [commodities]
  );
  // Subcategory options come from the per-parent cache populated by
  // loadSubcategoriesForParent (API call scoped to q[parent_id]=<commodityId>).
  const getSubcategoryOptions = (commodityId: string) =>
    (subcategoriesByParent[commodityId] || []).map((c) => ({
      value: c.id.toString(),
      label: c.category_name,
    }));
  const operationalLandlordOptions = useMemo(
    () =>
      operationalLandlords
        .filter((l) => l?.id != null && String(l.category_name || '').trim() !== '')
        .map((l) => ({
          value: String(l.id),
          label: String(l.category_name).trim(),
        })),
    [operationalLandlords]
  );
  const customerOptions = useMemo(
    () =>
      entities
        .filter((e) => e?.id != null && String(e.name || '').trim() !== '')
        .map((e) => ({
          value: String(e.id),
          label: String(e.name).trim(),
        })),
    [entities]
  );

  if (initialLoading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading waste generation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">EDIT WASTE GENERATION</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
        {/* Waste Generation Details */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span className="w-8 h-8 text-white rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#E5E0D3' }}>
                <Recycle size={16} color="#C72030" />
              </span>
              WASTE GENERATION DETAILS
            </h2>
          </div>
          <div className="p-6 space-y-10">
            {/* Generator Type */}
            <div className="space-y-4">
              <RadioGroup
                row
                value={generatorType}
                onChange={(e) => setGeneratorType(e.target.value as 'self' | 'customer')}
              >
                <FormControlLabel value="self" control={<Radio />} label="Self" />
                <FormControlLabel value="customer" control={<Radio />} label="Customer" />
              </RadioGroup>

              {generatorType === 'customer' && (
                <div className="max-w-sm">
                  <FieldLabel>Customer</FieldLabel>
                  <FormControl fullWidth disabled={loadingEntities}>
                    <Select
                      inputProps={{ 'aria-label': 'Customer' }}
                      value={customerId}
                      onChange={(e: SelectChangeEvent<string>) => setCustomerId(e.target.value)}
                      displayEmpty
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value="">
                        <em>{loadingEntities ? 'Loading...' : 'Select Customer'}</em>
                      </MenuItem>
                      {customerOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}
            </div>

            {/* Location Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-10">
              <div>
              <FieldLabel required>Building</FieldLabel>
              <FormControl fullWidth disabled={loadingBuildings}>
                <Select
                  inputProps={{ 'aria-label': 'Building' }}
                  value={formData.building}
                  onChange={(e: SelectChangeEvent<string>) => handleInputChange('building', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>{loadingBuildings ? 'Loading...' : 'Select Building'}</em>
                  </MenuItem>
                  {buildingOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              </div>

              <div>
              <FieldLabel>Wing</FieldLabel>
              <FormControl fullWidth disabled={loadingWings || !formData.building}>
                <Select
                  inputProps={{ 'aria-label': 'Wing' }}
                  value={formData.wing}
                  onChange={(e: SelectChangeEvent<string>) => handleInputChange('wing', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>
                      {loadingWings
                        ? 'Loading...'
                        : !formData.building
                        ? 'Select Building First'
                        : 'Select Wing (Optional)'}
                    </em>
                  </MenuItem>
                  {wingOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              </div>

              <div>
              <FieldLabel>Area</FieldLabel>
              <FormControl fullWidth disabled={loadingAreas || !formData.wing}>
                <Select
                  inputProps={{ 'aria-label': 'Area' }}
                  value={formData.area}
                  onChange={(e: SelectChangeEvent<string>) => handleInputChange('area', e.target.value)}
                  displayEmpty
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value="">
                    <em>
                      {loadingAreas
                        ? 'Loading...'
                        : !formData.wing
                        ? 'Select Wing First'
                        : 'Select Area (Optional)'}
                    </em>
                  </MenuItem>
                  {areaOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              </div>

              <div>
                <FieldLabel required>Date</FieldLabel>
                <TextField
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    htmlInput: {
                      max: new Date().toISOString().split('T')[0],
                      'aria-label': 'Date',
                    },
                  }}
                  sx={fieldStyles}
                />
              </div>
            </div>

            {/* Waste Entries — one table row per category, each with its own
                commodity, UOM, a dynamic list of bag weights, and attachments */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Waste Entries</h3>
              </div>

              <div className="border border-gray-200 rounded-md overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow className="border-b-gray-200 hover:bg-gray-50">
                      <TableHead className="w-12 font-semibold text-gray-600">Sr. No.</TableHead>
                      <TableHead className="min-w-[220px] font-semibold text-gray-600">
                        Category <span className="fm-required-mark">*</span>
                      </TableHead>
                      <TableHead className="min-w-[220px] font-semibold text-gray-600">
                        Subcategory <span className="fm-required-mark">*</span>
                      </TableHead>
                      <TableHead className="min-w-[110px] font-semibold text-gray-600">
                        UOM <span className="fm-required-mark">*</span>
                      </TableHead>
                      <TableHead className="min-w-[280px] font-semibold text-gray-600">
                        Bags / Weights <span className="fm-required-mark">*</span>
                      </TableHead>
                      <TableHead className="min-w-[220px] font-semibold text-gray-600">Attachments</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {wasteEntries.map((entry, entryIndex) => (
                      <TableRow key={entry.key} className="border-b-gray-200 hover:bg-transparent align-top">
                        <TableCell className="pt-4 text-sm text-gray-600">{entryIndex + 1}</TableCell>

                        <TableCell className="p-2 align-top">
                          <FormControl fullWidth size="small" disabled={loadingCommodities}>
                            <Select
                              value={entry.commodity}
                              onChange={(e: SelectChangeEvent<string>) => updateWasteEntry(entry.key, 'commodity', e.target.value)}
                              displayEmpty
                              sx={tableFieldStyles}
                              MenuProps={selectMenuProps}
                            >
                              <MenuItem value="">
                                <em>{loadingCommodities ? 'Loading...' : 'Select Category'}</em>
                              </MenuItem>
                              {commodityOptions.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>

                        <TableCell className="p-2 align-top">
                          <FormControl fullWidth size="small" disabled={!entry.commodity || loadingSubcategoryParents[entry.commodity]}>
                            <Select
                              value={entry.category}
                              onChange={(e: SelectChangeEvent<string>) => updateWasteEntry(entry.key, 'category', e.target.value)}
                              displayEmpty
                              sx={tableFieldStyles}
                              MenuProps={selectMenuProps}
                            >
                              <MenuItem value="">
                                <em>
                                  {!entry.commodity
                                    ? 'Select Category first'
                                    : loadingSubcategoryParents[entry.commodity]
                                    ? 'Loading...'
                                    : 'Select Subcategory'}
                                </em>
                              </MenuItem>
                              {getSubcategoryOptions(entry.commodity).map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>

                        <TableCell className="p-2 align-top">
                          <TextField
                            fullWidth
                            variant="outlined"
                            value={entry.uom}
                            onChange={(e) => updateWasteEntry(entry.key, 'uom', e.target.value)}
                            placeholder="UOM"
                            sx={tableFieldStyles}
                          />
                        </TableCell>

                        <TableCell className="p-2 align-top">
                          <div className="flex items-start gap-2">
                            <div>
                              <FieldLabel>Bag Count</FieldLabel>
                              <TextField
                                type="number"
                                value={entry.bagCount}
                                onChange={(e) => updateWasteEntry(entry.key, 'bagCount', e.target.value)}
                                variant="outlined"
                                inputProps={{ min: '1', step: '1', 'aria-label': 'Bag Count' }}
                                sx={{ width: 100, ...tableFieldStyles }}
                              />
                            </div>
                            <div>
                              <FieldLabel>Overall Weight</FieldLabel>
                              <TextField
                                type="number"
                                value={entry.overallWeight}
                                onChange={(e) => updateWasteEntry(entry.key, 'overallWeight', e.target.value)}
                                variant="outlined"
                                inputProps={{ min: '0', 'aria-label': 'Overall Weight' }}
                                sx={{ width: 120, ...tableFieldStyles }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-2 align-top">
                          <div className="flex flex-col gap-1.5">
                            <label className="inline-flex h-10 w-full items-center justify-center bg-gray-100 border border-gray-300 rounded px-3 text-xs text-gray-900 cursor-pointer hover:bg-gray-200">
                              Choose File(s)
                              <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                  addAttachments(entry.key, e.target.files);
                                  e.target.value = '';
                                }}
                              />
                            </label>
                            {entry.existingAttachments.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {entry.existingAttachments.map((att, attIndex) => (
                                  <span
                                    key={`existing-${attIndex}`}
                                    className="inline-flex items-center gap-1 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-700 max-w-[160px]"
                                  >
                                    <span className="truncate">{att.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedAttachment({
                                          id: attIndex,
                                          document_name: att.name,
                                          url: att.url,
                                        });
                                        setIsAttachmentPreviewOpen(true);
                                      }}
                                      className="shrink-0 text-gray-500 hover:text-brand"
                                      aria-label={`View ${att.name}`}
                                      title="View attachment"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                            {entry.attachments.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {entry.attachments.map((file, fileIndex) => (
                                  <span
                                    key={fileIndex}
                                    className="inline-flex items-center gap-1 bg-white border border-gray-300 rounded px-1.5 py-0.5 text-xs text-gray-700 max-w-[160px]"
                                  >
                                    <span className="truncate">{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeAttachment(entry.key, fileIndex)}
                                      className="text-gray-400 hover:text-red-600 shrink-0"
                                      aria-label="Remove attachment"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="p-2 pt-4 text-center">
                          {wasteEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeWasteEntry(entry.key)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              aria-label="Remove category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWasteEntry}
                className="mt-3 h-[40px] px-[18px] gap-[7px] rounded-[8px] bg-white border border-[rgba(44,44,44,0.12)] text-[#2C2C2C] text-[12.5px] font-semibold tracking-normal hover:bg-[#F6F4EE] hover:text-[#2C2C2C] [&_svg]:text-[#2C2C2C]"
              >
                <Plus className="w-4 h-4" /> Add Category
              </Button>
            </div>

            {/* Organization Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-10">
              <div className="min-w-0">
                <FieldLabel required>Operational Name of Landlord/Tenant</FieldLabel>
                <FormSearchSelect
                  value={formData.operationalName}
                  onChange={(value) => handleInputChange('operationalName', value)}
                  options={operationalLandlordOptions}
                  placeholder="Select Operational Name"
                  disabled={loadingOperationalLandlords}
                  isLoading={loadingOperationalLandlords}
                  isClearable
                />
              </div>

              <div>
                <FieldLabel>Agency Name</FieldLabel>
                <TextField
                  placeholder="Enter Agency Name"
                  value={formData.agencyName}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  fullWidth
                  variant="outlined"
                  slotProps={{ htmlInput: { 'aria-label': 'Agency Name' } }}
                  sx={fieldStyles}
                />
              </div>

              <div>
                <FieldLabel>Total Generated Unit</FieldLabel>
                <TextField
                  type="number"
                  value={totalGeneratedUnit}
                  fullWidth
                  variant="outlined"
                  disabled
                  slotProps={{ htmlInput: { 'aria-label': 'Total Generated Unit' } }}
                  sx={fieldStyles}
                />
              </div>

              {/* Vendor — uses virtualized SupplierSearchSelect to handle large record sets without freezing */}
              <div>
                <FieldLabel required>Vendor</FieldLabel>
                <SupplierSearchSelect
                  value={formData.vendor}
                  onChange={(vendorId) => handleInputChange('vendor', vendorId)}
                  size="schedule"
                  error={false}
                />
              </div>

              <div className="md:col-span-4">
                <FieldLabel>Remark</FieldLabel>
                <TextField
                  placeholder="Enter remark"
                  value={formData.remark}
                  onChange={(e) => handleInputChange('remark', e.target.value)}
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  slotProps={{ htmlInput: { 'aria-label': 'Remark' } }}
                  sx={textareaStyles}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="fm-action-bar px-6 py-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={submitting}
              className="fm-action-secondary disabled:opacity-50"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="fm-action-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </form>
      <AttachmentPreviewModal
        isModalOpen={isAttachmentPreviewOpen}
        setIsModalOpen={setIsAttachmentPreviewOpen}
        showDownload={false}
        selectedDoc={selectedAttachment}
        setSelectedDoc={setSelectedAttachment}
      />
    </div>
  );
};

export default EditWasteGenerationPage;
