import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, User, BadgeCheck, CalendarCheck2, Loader2, CheckCircle2, XCircle, Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ----------------- Types -----------------
interface IUserInfo {
  fullname?: string;
  firstname?: string;
  lastname?: string;
  mobile?: string;
  email?: string;
  gender?: string;
  blood_group?: string;
  birth_date?: string;
  avatar?: string;
  circle_name?: string;
  company_name?: string;
  department_name?: string;
  employee_id?: string;
  employee_type?: string;
  profile_photo?: string;
  role_name?: string;
}

interface IAttachmentItem {
  id: number;
  document_file_name?: string;
  document_content_type?: string;
  // Sometimes provided from API for top-level attachments
  doctype?: string;
  document_file_size?: number;
  document_updated_at?: string;
  url?: string; // present in top-level attachments, may be absent in category attachments
  added_from?: string;
}

interface ICategoryCommonAttachments {
  [key: string]: IAttachmentItem[] | undefined; // mparivahan, vehicle, insurance, helmet, puc, medical_certificate, certificate, license, experience_certificate, first_aid, etc.
}

interface ICategoryBike {
  dl_number?: string;
  dl_valid_till?: string;
  reg_number?: string;
  attachments?: ICategoryCommonAttachments;
}
interface ICategoryCar {
  dl_number?: string;
  dl_valid_till?: string;
  vehicle_type?: string;
  reg_number?: string;
  valid_insurance?: string;
  valid_insurance_till?: string;
  valid_puc?: string; // date stored (Valid PUC)
  medical_certificate_valid_till?: string;
  attachments?: ICategoryCommonAttachments;
}
interface ICategoryElectrical {
  qualification?: string;
  license_number?: string;
  license_validity?: string;
  fit_to_work?: string;
  medical_certificate_valid_till?: string;
  first_aid_valid_till?: string;
  attachments?: ICategoryCommonAttachments;
}
interface ICategoryHeight {
  experience_years?: string;
  fit_to_work?: string;
  full_body_harness?: string;
  medical_certificate_valid_till?: string;
  first_aid_certificate_valid_till?: string;
  attachments?: ICategoryCommonAttachments;
}
interface ICategoryUnderground {
  experience_years?: string;
  role?: string;
  fit_to_work?: string;
  medical_certificate_valid_till?: string;
  attachments?: ICategoryCommonAttachments;
}
interface ICategoryBicycle {
  reflective_jacket?: string;
  training_available?: string;
}
interface ICategoryMHE {
  safety_shoes?: string;
  hand_gloves?: string;
  reflective_jacket?: string;
}

interface ICategoriesResponse {
  bike?: ICategoryBike;
  car?: ICategoryCar;
  electrical?: ICategoryElectrical;
  height?: ICategoryHeight;
  underground?: ICategoryUnderground;
  bicycle?: ICategoryBicycle;
  mhe?: ICategoryMHE;
  none_of_the_above?: boolean;
}

interface IApiResponse {
  id: number;
  status?: string;
  user?: IUserInfo;
  approved_by?: IUserInfo | null;
  form_details?: Record<string, any>;
  krcc_attachments?: Array<{
    id: number;
    url?: string;
    added_from?: string;
    doctype?: string;
  }>;
  categories?: ICategoriesResponse;
  created_at?: string;
  updated_at?: string;
}

// --------------- Utility Components ---------------
const KeyValue: React.FC<{ label: string; value?: string | number | null; colSpan?: string } > = ({ label, value, colSpan }) => {
  if (!value && value !== 0) return null;
  return (
    <div className={colSpan ? colSpan : ''}>
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-900 break-all">{value || '-'}</span>
    </div>
  );
};

// Shared label helpers for checklist fields
const FIELD_LABELS: Record<string, string> = {
  // common 2w/4w
  dl_number: 'Driving License Number',
  dl_date: 'DL Date',
  reg_number: 'Registration Number',
  vehicle_type: 'Vehicle Type',
  valid_insurence: 'Valid Insurance',
  valid_insurence_date: 'Valid Insurance Till',
  valid_puc: 'Valid PUC',
  valid_puc_date: 'Valid PUC Till',
  medical_certificate_valid_date: 'Medical Certificate Valid Till',
  // 2w extras
  full_face_helmet: 'Full Face Helmet',
  reflective_jacket: 'Reflective Jacket',
  // underground
  yoe: 'Experience (Years)',
  role: 'Role',
  fit_to_work: 'Fit to Work',
};

const toTitle = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const isYes = (v: any) => String(v).toLowerCase() === 'yes' || v === true || String(v).toLowerCase() === 'true' || v === 1;
const isNo = (v: any) => String(v).toLowerCase() === 'no' || String(v).toLowerCase() === 'false' || v === 0;

const SectionChecklist: React.FC<{ title: string; prefix: string; formDetails?: Record<string, any> }>
  = ({ title, prefix, formDetails }) => {
    const entries = Object.entries(formDetails || {})
      .filter(([k]) => k.startsWith(prefix))
      .filter(([k]) => !k.startsWith('rule')) // defensive; our keys include prefix already
      .map(([k, v]) => {
        const base = k.slice(prefix.length).replace(/^_/, '');
        const label = FIELD_LABELS[base] || toTitle(base);
        // Checked when explicit Yes/true, or when a non-empty non-No value exists (like numbers/dates)
        const checked = isYes(v) || (!isNo(v) && typeof v === 'string' && v.trim() !== '') || (typeof v === 'number' && !isNaN(v));
        const showValue = typeof v === 'string' && !['yes', 'no', 'true', 'false'].includes(v.toLowerCase()) && v.trim() !== '';
        return { label, checked, valueText: showValue ? v : undefined };
      })
      .filter(item => !!item.label);

    if (!entries.length) return null;

    return (
      <div className="mt-2 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <CalendarCheck2 className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
          <h3 className="text-base font-medium text-gray-900">{title}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {entries.map((it, idx) => (
            <div key={idx} className="flex items-start gap-2 text-sm text-gray-900">
              {it.checked ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              )}
              <span>
                {it.label}
                {it.valueText ? (
                  <span className="ml-1 text-gray-600">({it.valueText})</span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

// Enhanced gallery with preview modal
const AttachmentGroup: React.FC<{ title: string; items?: IAttachmentItem[] | undefined; onPreview: (items: IAttachmentItem[], index: number, title: string) => void }> = ({ title, items, onPreview }) => {
  if (!items || items.length === 0) return null;
  const imageItems = items.filter((item) => {
    const contentType = (item.document_content_type || item.doctype || '').toLowerCase();
    const url = item.url || '';
    const isImageType = contentType.startsWith('image');
    const urlLooksImage = /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
    return !!url && (isImageType || urlLooksImage);
  });
  if (imageItems.length === 0) return null;
  return (
    <div className="mt-6 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-gradient-to-tr from-[#C72030] to-[#e54654] text-white rounded-md flex items-center justify-center shadow-sm">
            <FileText className="h-3.5 w-3.5" />
          </div>
          <label className="text-sm font-semibold tracking-wide text-gray-800">{title}</label>
          <span className="px-1.5 py-0.5 text-[10px] rounded bg-gray-200 text-gray-700 font-medium">{imageItems.length}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {imageItems.map((item, idx) => {
          const display = item.document_file_name || `Image-${item.id}`;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onPreview(imageItems, idx, title)}
              className="relative group/image rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#C72030]/40"
            >
              <div className="aspect-square w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                <img
                  src={item.url}
                  alt={display + ''}
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover/image:scale-105"
                />
                <div className="absolute inset-0 opacity-0 group-hover/image:opacity-100 bg-black/40 flex items-center justify-center transition-opacity">
                  <Maximize2 className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="p-1.5 text-[11px] font-medium truncate text-gray-700 text-left w-full bg-white/80 backdrop-blur-sm border-t border-gray-100">
                {display}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --------------- Helpers for merging top-level attachments ---------------
const filenameFromUrl = (url?: string) => {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');
    return parts[parts.length - 1] || undefined;
  } catch {
    const parts = url.split('?')[0].split('/');
    return parts[parts.length - 1] || undefined;
  }
};

const toAttachmentFromKrcc = (item: { id: number; url?: string; doctype?: string; added_from?: string }): IAttachmentItem => ({
  id: item.id,
  url: item.url,
  doctype: item.doctype,
  document_content_type: item.doctype,
  document_file_name: filenameFromUrl(item.url),
  added_from: item.added_from,
});

type CategoriesMutable = {
  bike?: ICategoryBike;
  car?: ICategoryCar;
  electrical?: ICategoryElectrical;
  height?: ICategoryHeight;
  underground?: ICategoryUnderground;
  bicycle?: ICategoryBicycle;
  mhe?: ICategoryMHE;
  none_of_the_above?: boolean;
};

const ensureAttachmentBucket = (obj: ICategoryCommonAttachments, key: string) => {
  if (!obj[key]) obj[key] = [];
  return obj[key]!;
};

const mergeKrccAttachmentsIntoCategories = (
  krcc: Array<{ id: number; url?: string; doctype?: string; added_from?: string }> | undefined,
  categories: ICategoriesResponse | undefined
): ICategoriesResponse => {
  if (!krcc || krcc.length === 0) return categories || {};
  const merged: CategoriesMutable = {
    bike: categories?.bike ? { ...categories.bike, attachments: { ...(categories.bike.attachments || {}) } } : undefined,
    car: categories?.car ? { ...categories.car, attachments: { ...(categories.car.attachments || {}) } } : undefined,
    electrical: categories?.electrical ? { ...categories.electrical, attachments: { ...(categories.electrical.attachments || {}) } } : undefined,
    height: categories?.height ? { ...categories.height, attachments: { ...(categories.height.attachments || {}) } } : undefined,
    underground: categories?.underground ? { ...categories.underground, attachments: { ...(categories.underground.attachments || {}) } } : undefined,
    bicycle: categories?.bicycle ? { ...categories.bicycle } : undefined,
  mhe: categories?.mhe ? { ...categories.mhe } : undefined,
  none_of_the_above: categories?.none_of_the_above,
  };

  const pushTo = (cat: keyof CategoriesMutable, key: string, att: IAttachmentItem) => {
    if (!merged[cat]) return;
    if (!('attachments' in (merged[cat] as any))) return;
    const attObj = (merged[cat] as any).attachments as ICategoryCommonAttachments;
    const bucket = ensureAttachmentBucket(attObj, key);
    bucket.push(att);
  };

  for (const a of krcc) {
    const added = (a.added_from || '').toLowerCase();
    const att = toAttachmentFromKrcc(a);

    if (added.startsWith('2w_')) {
      const key = added.replace('2w_', '');
      if (key.includes('insurance')) pushTo('bike', 'insurance', att);
      else if (key.includes('helmet')) pushTo('bike', 'helmet', att);
      else if (key.includes('puc')) pushTo('bike', 'puc', att);
      else if (key.includes('medical')) pushTo('bike', 'medical_certificate', att);
      else if (key.includes('mparivahan')) pushTo('bike', 'mparivahan', att);
      else if (key.includes('vehicle')) pushTo('bike', 'vehicle', att);
      continue;
    }

    if (added.startsWith('4w_')) {
      const key = added.replace('4w_', '');
      if (key.includes('insurance')) pushTo('car', 'insurance', att);
      else if (key.includes('puc')) pushTo('car', 'puc', att);
      else if (key.includes('medical')) pushTo('car', 'medical_certificate', att);
      else if (key.includes('mparivahan')) pushTo('car', 'mparivahan', att);
      else if (key.includes('vehicle')) pushTo('car', 'vehicle', att);
      continue;
    }

    if (added.startsWith('electrical_')) {
      const key = added.replace('electrical_', '');
      if (key.includes('certificate') && !key.includes('experience')) pushTo('electrical', 'certificate', att);
      else if (key.includes('license')) pushTo('electrical', 'license', att);
      else if (key.includes('medical')) pushTo('electrical', 'medical_certificate', att);
      else if (key.includes('experience')) pushTo('electrical', 'experience_certificate', att);
      else if (key.includes('first_aid')) pushTo('electrical', 'first_aid', att);
      continue;
    }

    if (added.startsWith('height_')) {
      const key = added.replace('height_', '');
      if (key.includes('medical')) pushTo('height', 'medical_certificate', att);
      else if (key.includes('first_aid')) pushTo('height', 'first_aid', att);
      continue;
    }

    if (added.startsWith('underground_')) {
      const key = added.replace('underground_', '');
      if (key.includes('medical')) pushTo('underground', 'medical_certificate', att);
      continue;
    }
  }

  return merged as ICategoriesResponse;
};

// --------------- Main Component ---------------
export const KRCCFormDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<IApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? localStorage.getItem('baseUrl') : '';
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchDetails = useCallback(async () => {
    if (!id) return;
    if (!baseUrl || !token) {
      setError('Missing API credentials');
      return;
    }
    setLoading(true);
    setError(null);
    try {
  // Ensure protocol present (else other modules use https://${baseUrl})
  
  const protocolBase = baseUrl && baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  const resp = await fetch(`${protocolBase}/krcc_forms/${id}.json`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json: IApiResponse = await resp.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Failed to load');
      toast.error('Failed to load KRCC form details');
    } finally {
      setLoading(false);
    }
  }, [id, baseUrl, token]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const user = data?.user;
  const mergedCategories = useMemo(() => data?.categories || {}, [data?.categories]);

  // Image preloading state (hide page until all images load)
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageProgress, setImageProgress] = useState({ loaded: 0, total: 0 });

  // Helper to decide if url is image (matches AttachmentGroup logic)
  const isImageUrl = (url?: string, contentType?: string) => {
    if (!url) return false;
    const ct = (contentType || '').toLowerCase();
    const looksImage = /(\.png|\.jpe?g|\.gif|\.webp|\.bmp|\.svg)(\?.*)?$/i.test(url);
    return ct.startsWith('image') || looksImage;
  };

  useEffect(() => {
    if (!data) return;
    // Collect all relevant image URLs (profile photos + attachment images)
    const urls: string[] = [];
    const push = (u?: string) => { if (u && !urls.includes(u)) urls.push(u); };
    push(data.user?.profile_photo || data.user?.avatar);
    push(data.approved_by?.profile_photo || data.approved_by?.avatar);

    const addAttachmentImages = (attObj?: ICategoryCommonAttachments) => {
      if (!attObj) return;
      Object.values(attObj).forEach(list => {
        (list || []).forEach(it => { if (isImageUrl(it.url, it.document_content_type || it.doctype)) push(it.url); });
      });
    };
    addAttachmentImages(data.categories?.bike?.attachments);
    addAttachmentImages(data.categories?.car?.attachments);
    addAttachmentImages(data.categories?.electrical?.attachments);
    addAttachmentImages(data.categories?.height?.attachments);
    addAttachmentImages(data.categories?.underground?.attachments);
    addAttachmentImages(data.categories?.bicycle ? (data.categories as any).bicycle?.attachments : undefined); // bicycle seems not to have attachments in interface
    addAttachmentImages(data.categories?.mhe ? (data.categories as any).mhe?.attachments : undefined); // same for mhe

    if (urls.length === 0) {
      setImagesLoaded(true);
      return;
    }
    setImageProgress({ loaded: 0, total: urls.length });
    setImagesLoaded(false);
    let loaded = 0;
    let cancelled = false;
    const handleOne = () => {
      if (cancelled) return;
      loaded += 1;
      setImageProgress({ loaded, total: urls.length });
      if (loaded >= urls.length) {
        setImagesLoaded(true);
      }
    };
    const timers: number[] = [];
    urls.forEach(u => {
      const img = new Image();
      img.onload = handleOne;
      img.onerror = handleOne;
      img.src = u;
    });
    // Fallback timeout (e.g., network issues) after 15s to avoid blocking forever
    const timeoutId = window.setTimeout(() => { if (!cancelled) setImagesLoaded(true); }, 15000);
    timers.push(timeoutId);
    return () => {
      cancelled = true;
      timers.forEach(t => clearTimeout(t));
    };
  }, [data]);

  // Preview (lightbox) state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<IAttachmentItem[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewTitle, setPreviewTitle] = useState('');

  const openPreview = useCallback((items: IAttachmentItem[], index: number, title: string) => {
    setPreviewItems(items);
    setPreviewIndex(index);
    setPreviewTitle(title);
    setPreviewOpen(true);
  }, []);
  const closePreview = useCallback(() => setPreviewOpen(false), []);
  const gotoPrev = useCallback(() => setPreviewIndex(i => (i - 1 + previewItems.length) % previewItems.length), [previewItems.length]);
  const gotoNext = useCallback(() => setPreviewIndex(i => (i + 1) % previewItems.length), [previewItems.length]);

  useEffect(() => {
    if (!previewOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePreview();
      if (e.key === 'ArrowLeft') gotoPrev();
      if (e.key === 'ArrowRight') gotoNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [previewOpen, closePreview, gotoPrev, gotoNext]);

  const handleBack = () => navigate("/safety/m-safe/krcc-list");

  const bike = mergedCategories?.bike;
  const car = mergedCategories?.car;
  const electrical = mergedCategories?.electrical;
  const height = mergedCategories?.height;
  const underground = mergedCategories?.underground;
  const bicycle = mergedCategories?.bicycle;
  const mhe = mergedCategories?.mhe;
  const noneOfTheAbove = mergedCategories?.none_of_the_above;

  const exportToExcel = useCallback(() => {
    if (!data) return;
    // Simple JSON export (placeholder). Could be replaced by server export endpoint.
    try {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `krcc_form_${data.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Exported');
    } catch {
      toast.error('Export failed');
    }
  }, [data]);

  const personalDetailsGrid = useMemo(() => (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        {user?.profile_photo || user?.avatar ? (
          <img
            src={user.profile_photo || user.avatar}
            alt={user.fullname || user.firstname || 'Profile'}
            className="h-20 w-20 rounded-full object-cover border border-gray-200 shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
            {(user?.firstname?.[0] || user?.fullname?.[0] || '?').toUpperCase()}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900">{user?.fullname || `${user?.firstname || ''} ${user?.lastname || ''}`.trim()}</span>
          <span className="text-sm text-gray-600">{user?.role_name}</span>
          {user?.employee_type && (
            <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 capitalize">{user.employee_type}</span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KeyValue label="Employee ID" value={user?.employee_id} />
        <KeyValue label="First Name" value={user?.firstname} />
        <KeyValue label="Last Name" value={user?.lastname} />
        <KeyValue label="Email ID" value={user?.email} />
        <KeyValue label="Mobile" value={user?.mobile} />
  <KeyValue label="Gender" value={user?.gender} />
  {/* Removed Blood Group and DOB per request */}
        <KeyValue label="Circle" value={user?.circle_name} />
        <KeyValue label="Company" value={user?.company_name} />
        <KeyValue label="Department" value={user?.department_name} />
        <KeyValue label="Role" value={user?.role_name} />
      </div>
    </div>
  ), [user]);

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4" />
          <p className="text-gray-700 text-sm">Loading KRCC form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800 text-base">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-bold text-[#1a1a1a] mt-3">KRCC FORM DETAILS</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchDetails} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">Retry</Button>
          </div>
        </div>
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  // Wait for all images to load before showing full page
  if (!imagesLoaded) {
    return (
      <div className="p-6 bg-white min-h-screen flex flex-col items-center justify-center gap-3 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]" />
        <p>Loading images {imageProgress.loaded}/{imageProgress.total}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <div>
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800 mb-4 text-base">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">KRCC FORM DETAILS</h1>
        </div>
        {/* <div className="flex gap-2 flex-wrap">
          <Button onClick={exportToExcel} className="bg-[#C72030] text-white hover:bg-[#C72030]/90 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div> */}
      </div>

      {/* PERSONAL DETAILS */}
      <div className="bg-white rounded-lg border text-[15px]">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
            <User className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">PERSONAL DETAILS</h2>
        </div>
        {personalDetailsGrid}
      </div>

      {/* Approved By */}
      {data.approved_by && (data.approved_by.fullname || data.approved_by.firstname || data.approved_by.employee_id) && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <User className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">APPROVED DETAILS</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              {data.approved_by.profile_photo || data.approved_by.avatar ? (
                <img
                  src={data.approved_by.profile_photo || data.approved_by.avatar}
                  alt={data.approved_by.fullname || data.approved_by.firstname || 'Approver'}
                  className="h-16 w-16 rounded-full object-cover border border-gray-200 shadow-sm"
                  loading="lazy"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-medium">
                  {(data.approved_by.firstname?.[0] || data.approved_by.fullname?.[0] || '?').toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-900">{data.approved_by.fullname || `${data.approved_by.firstname || ''} ${data.approved_by.lastname || ''}`.trim() || '-'}</span>
                <span className="text-sm text-gray-600">{data.approved_by.role_name || '-'}</span>
                {data.approved_by.employee_type && (
                  <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 capitalize">{data.approved_by.employee_type}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <KeyValue label="Employee ID" value={data.approved_by.employee_id} />
              <KeyValue label="Email" value={data.approved_by.email} />
              <KeyValue label="Mobile" value={data.approved_by.mobile} />
              <KeyValue label="Gender" value={data.approved_by.gender} />
              <KeyValue label="Circle" value={data.approved_by.circle_name} />
              <KeyValue label="Company" value={data.approved_by.company_name} />
              <KeyValue label="Department" value={data.approved_by.department_name} />
              <KeyValue label="Employee Type" value={data.approved_by.employee_type} />
              <KeyValue label="Role" value={data.approved_by.role_name} />
            </div>
          </div>
        </div>
      )}

      {/* Bike / 2 Wheeler */}
      {bike && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">KRCC DETAILS (RIDE A 2 WHEELER)</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {Object.entries(bike).filter(([k]) => k !== 'attachments').map(([k, v]) => (
                <KeyValue key={k} label={toTitle(k)} value={v} />
              ))}
            </div>
            {/* <AttachmentGroup title="M-Parivahan" items={bike.attachments?.mparivahan as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Vehicle" items={bike.attachments?.vehicle as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Insurance" items={bike.attachments?.insurance as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Helmet" items={bike.attachments?.helmet as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="PUC" items={bike.attachments?.puc as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Medical Certificate" items={bike.attachments?.medical_certificate as IAttachmentItem[]} onPreview={openPreview} /> */}
          </div>
        </div>
      )}

      {/* Car / 4 Wheeler */}
      {car && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">KRCC DETAILS (DRIVE A 4 WHEELER)</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {Object.entries(car).filter(([k]) => k !== 'attachments').map(([k, v]) => (
                <KeyValue key={k} label={toTitle(k)} value={v} />
              ))}
            </div>
            {/* <AttachmentGroup title="M-Parivahan" items={car.attachments?.mparivahan as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Insurance" items={car.attachments?.insurance as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="PUC" items={car.attachments?.puc as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Medical Certificate" items={car.attachments?.medical_certificate as IAttachmentItem[]} onPreview={openPreview} /> */}
          </div>
        </div>
      )}

      {/* Electrical Work */}
      {electrical && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">WORK ON ELECTRICAL SYSTEM</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {Object.entries(electrical).filter(([k]) => k !== 'attachments').map(([k, v]) => (
                <KeyValue key={k} label={toTitle(k)} value={v} />
              ))}
            </div>
            {/* <AttachmentGroup title="Certificates" items={electrical.attachments?.certificate as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Licenses" items={electrical.attachments?.license as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Medical Certificates" items={electrical.attachments?.medical_certificate as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="Experience Certificates" items={electrical.attachments?.experience_certificate as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="First Aid Training" items={electrical.attachments?.first_aid as IAttachmentItem[]} onPreview={openPreview} /> */}
          </div>
        </div>
      )}

      {/* Work at Height */}
      {height && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">WORK AT HEIGHT</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {Object.entries(height).filter(([k]) => k !== 'attachments').map(([k, v]) => (
                <KeyValue key={k} label={toTitle(k)} value={v} />
              ))}
            </div>
            {/* <AttachmentGroup title="Medical Certificates" items={height.attachments?.medical_certificate as IAttachmentItem[]} onPreview={openPreview} />
            <AttachmentGroup title="First Aid" items={height.attachments?.first_aid as IAttachmentItem[]} onPreview={openPreview} /> */}
          </div>
        </div>
      )}

      {/* Work Underground */}
      {underground && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">WORK UNDERGROUND</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {Object.entries(underground).filter(([k]) => k !== 'attachments').map(([k, v]) => (
                <KeyValue key={k} label={toTitle(k)} value={v} />
              ))}
            </div>
            {/* <AttachmentGroup title="Medical Certificates" items={underground.attachments?.medical_certificate as IAttachmentItem[]} onPreview={openPreview} /> */}
          </div>
        </div>
      )}

      {/* Ride a Bicycle */}
      {bicycle && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">RIDE A BICYCLE</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {bicycle && Object.entries(bicycle).map(([k, v]) => (
                <KeyValue key={k} label={toTitle(k)} value={v} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Operate MHE */}
      {mhe && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">OPERATE MHE</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {mhe && Object.entries(mhe).map(([k, v]) => (
                <KeyValue key={k} label={toTitle(k)} value={v} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* None of the Above */}
      {noneOfTheAbove && (
        <div className="bg-white rounded-lg border text-[15px]">
          <div className="flex p-4 items-center">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
              <BadgeCheck className="w-5 h-5 text-[#C72030]" />
            </div>
            <h2 className="text-lg font-bold">NONE OF THE ABOVE</h2>
          </div>
          <div className="p-6 pt-2">
            <p className="text-sm text-gray-700">User selected "None of the above"; no category-specific details provided.</p>
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewOpen && previewItems.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-3 text-white">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                <span className="font-medium text-sm tracking-wide">{previewTitle}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 border border-white/20">{previewIndex + 1}/{previewItems.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={gotoPrev} className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronLeft className="h-4 w-4" /></button>
                <button onClick={gotoNext} className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"><ChevronRight className="h-4 w-4" /></button>
                <button onClick={closePreview} className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center"><X className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-2xl bg-black/40 border border-white/10">
              <img
                src={previewItems[previewIndex].url}
                alt={(previewItems[previewIndex].document_file_name || '') + ''}
                className="mx-auto max-h-[70vh] object-contain w-full select-none"
                draggable={false}
              />
            </div>
            <div className="mt-3 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-32 overflow-y-auto pr-1">
              {previewItems.map((it, i) => {
                const active = i === previewIndex;
                const thumbName = it.document_file_name || `Img-${it.id}`;
                return (
                  <button
                    key={it.id}
                    onClick={() => setPreviewIndex(i)}
                    className={`relative group/thumb rounded border ${active ? 'border-[#C72030] ring-2 ring-[#C72030]/50' : 'border-white/20 hover:border-white/50'} overflow-hidden h-14 bg-white/5`}
                    title={thumbName}
                  >
                    <img src={it.url} alt={thumbName} className="h-full w-full object-cover" loading="lazy" />
                    {active && <span className="absolute inset-0 border-2 border-[#C72030] pointer-events-none"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};