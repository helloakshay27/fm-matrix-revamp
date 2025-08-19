import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, User, BadgeCheck, CalendarCheck2, Loader2 } from 'lucide-react';
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
}

interface IAttachmentItem {
  id: number;
  document_file_name?: string;
  document_content_type?: string;
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
}

interface IApiResponse {
  id: number;
  status?: string;
  user?: IUserInfo;
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

const AttachmentGroup: React.FC<{ title: string; items?: IAttachmentItem[] | undefined }> = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
        <label className="block text-sm font-medium text-gray-700">{title}</label>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => {
          const display = item.document_file_name || item.id;
          return (
            <div key={item.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-center h-20 bg-white rounded border mb-2 relative overflow-hidden">
                {/* If URL & is image show thumbnail */}
                {item.url && item.document_content_type?.startsWith('image') && (
                  <img src={item.url} alt={display + ''} className="max-h-20 object-contain" />
                )}
                {(!item.url || !item.document_content_type?.startsWith('image')) && (
                  <FileText className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div className="text-center">
                <button
                  disabled={!item.url}
                  onClick={() => item.url && window.open(item.url, '_blank')}
                  className={`flex items-center justify-center gap-1 text-[#C72030] mx-auto ${!item.url ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <Download className="h-3 w-3" />
                  <span className="text-xs font-medium truncate max-w-[140px]" title={display + ''}>{display}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
  const categories = data?.categories || {};

  const handleBack = () => navigate('/maintenance/krcc-list');

  const bike = categories.bike;
  const car = categories.car;
  const electrical = categories.electrical;
  const height = categories.height;
  const underground = categories.underground;
  const bicycle = categories.bicycle;
  const mhe = categories.mhe;

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <KeyValue label="First Name" value={user?.firstname} />
      <KeyValue label="Last Name" value={user?.lastname} />
      <KeyValue label="Email ID" value={user?.email} />
      <KeyValue label="Gender" value={user?.gender} />
      <KeyValue label="Blood Group" value={user?.blood_group} />
      <KeyValue label="DOB" value={user?.birth_date} />
    </div>
  ), [user]);

  if (loading) {
    return (
      <div className="p-6 flex items-center gap-2 text-sm text-gray-600"><Loader2 className="h-4 w-4 animate-spin" /> Loading KRCC form...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handleBack} className="h-8 w-8 p-0"><ArrowLeft className="h-4 w-4" /></Button>
          <Button onClick={fetchDetails} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">Retry</Button>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="h-8 w-8 p-0"><ArrowLeft className="h-4 w-4" /></Button>
          <p className="text-gray-900">Back</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDetails}>Refresh</Button>
          <Button onClick={exportToExcel} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white">Export</Button>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-2 bg-[#f6f4ee] p-6">
          <User className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
          <h2 className="text-lg font-semibold">Personal Details</h2>
        </div>
        {personalDetailsGrid}
      </div>

      {/* Bike / 2 Wheeler */}
      {bike && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 bg-[#f6f4ee] p-6 mb-2">
            <BadgeCheck className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
            <h2 className="text-lg font-semibold">KRCC Details (Ride a 2 Wheeler)</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="flex items-center gap-2 mb-4 mt-4">
              <CalendarCheck2 className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
              <h3 className="text-base font-medium text-gray-900">Driving License Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <KeyValue label="Driving License Number" value={bike.dl_number} />
              <KeyValue label="Valid Till" value={bike.dl_valid_till} />
              <KeyValue label="2 Wheeler Reg. Number" value={bike.reg_number} />
            </div>
            <AttachmentGroup title="M-Parivahan Attachments" items={bike.attachments?.mparivahan as IAttachmentItem[]} />
            <AttachmentGroup title="Vehicle Attachments" items={bike.attachments?.vehicle as IAttachmentItem[]} />
            <AttachmentGroup title="Insurance Attachments" items={bike.attachments?.insurance as IAttachmentItem[]} />
            <AttachmentGroup title="Helmet Attachments" items={bike.attachments?.helmet as IAttachmentItem[]} />
            <AttachmentGroup title="PUC Attachments" items={bike.attachments?.puc as IAttachmentItem[]} />
            <AttachmentGroup title="Medical Certificate Attachments" items={bike.attachments?.medical_certificate as IAttachmentItem[]} />
          </div>
        </div>
      )}

      {/* Car / 4 Wheeler */}
      {car && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 bg-[#f6f4ee] p-6 mb-2">
            <BadgeCheck className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
            <h2 className="text-lg font-semibold">KRCC Details (Drive a 4 Wheeler)</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="flex items-center gap-2 mb-4 mt-4">
              <CalendarCheck2 className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
              <h3 className="text-base font-medium text-gray-900">Driving License Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <KeyValue label="Driving License Number" value={car.dl_number} />
              <KeyValue label="Valid Till" value={car.dl_valid_till} />
            </div>
            <div className="flex items-center gap-2 mb-4 mt-2">
              <CalendarCheck2 className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
              <h3 className="text-base font-medium text-gray-900">4 Wheeler Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <KeyValue label="Vehicle Type" value={car.vehicle_type} />
              <KeyValue label="Registration Number" value={car.reg_number} />
              <KeyValue label="Valid Insurance" value={car.valid_insurance} />
              <KeyValue label="Valid Till" value={car.valid_insurance_till} />
              <KeyValue label="Valid PUC" value={car.valid_puc} />
              <KeyValue label="Valid Till (If Applicable)" value={car.medical_certificate_valid_till} />
            </div>
            <AttachmentGroup title="M-Parivahan Attachments" items={car.attachments?.mparivahan as IAttachmentItem[]} />
            <AttachmentGroup title="Insurance Attachments" items={car.attachments?.insurance as IAttachmentItem[]} />
            <AttachmentGroup title="PUC Attachments" items={car.attachments?.puc as IAttachmentItem[]} />
            <AttachmentGroup title="Medical Certificate Attachments" items={car.attachments?.medical_certificate as IAttachmentItem[]} />
          </div>
        </div>
      )}

      {/* Electrical Work */}
      {electrical && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 bg-[#f6f4ee] p-6 mb-2">
            <BadgeCheck className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
            <h2 className="text-lg font-semibold">Work on Electrical System</h2>
          </div>
          <div className="p-6 pt-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4 mt-2">
                <CalendarCheck2 className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
                <h3 className="text-base font-medium text-gray-900">Qualification Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KeyValue label="Qualification" value={electrical.qualification} />
                <KeyValue label="License Number" value={electrical.license_number} />
                <KeyValue label="Valid Date" value={electrical.license_validity} />
                <KeyValue label="Fit to work on electrical system" value={electrical.fit_to_work} />
                <KeyValue label="Valid Till (If Applicable)" value={electrical.medical_certificate_valid_till} />
                <KeyValue label="Valid Till" value={electrical.first_aid_valid_till} />
              </div>
            </div>
            <AttachmentGroup title="Certificate Attachments" items={electrical.attachments?.certificate as IAttachmentItem[]} />
            <AttachmentGroup title="License Attachments" items={electrical.attachments?.license as IAttachmentItem[]} />
            <AttachmentGroup title="Medical Certificate Attachments" items={electrical.attachments?.medical_certificate as IAttachmentItem[]} />
            <AttachmentGroup title="Experience Certificate Attachments" items={electrical.attachments?.experience_certificate as IAttachmentItem[]} />
            <AttachmentGroup title="First Aid Training Attachments" items={electrical.attachments?.first_aid as IAttachmentItem[]} />
          </div>
        </div>
      )}

      {/* Work at Height */}
      {height && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 bg-[#f6f4ee] p-6 mb-2">
            <BadgeCheck className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
            <h2 className="text-lg font-semibold">Work at Height</h2>
          </div>
          <div className="p-6 pt-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4 mt-2">
                <CalendarCheck2 className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
                <h3 className="text-base font-medium text-gray-900">Experience Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KeyValue label="Experience to work on Height (In Years)" value={height.experience_years} />
                <KeyValue label="Fit to work at height" value={height.fit_to_work} />
                <KeyValue label="Availability of VIL approved full body harness" value={height.full_body_harness} />
                <KeyValue label="Valid Till (If Applicable)" value={height.medical_certificate_valid_till} />
                <KeyValue label="Valid Till" value={height.first_aid_certificate_valid_till} />
              </div>
            </div>
            <AttachmentGroup title="Medical Certificate Attachments" items={height.attachments?.medical_certificate as IAttachmentItem[]} />
            <AttachmentGroup title="First Aid Attachments" items={height.attachments?.first_aid as IAttachmentItem[]} />
          </div>
        </div>
      )}

      {/* Work Underground */}
      {underground && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 bg-[#f6f4ee] p-6 mb-2">
            <BadgeCheck className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
            <h2 className="text-lg font-semibold">Work Underground</h2>
          </div>
          <div className="p-6 pt-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4 mt-2">
                <CalendarCheck2 className="h-4 w-4 text-white bg-[#C72030] rounded-full p-1" />
                <h3 className="text-base font-medium text-gray-900">Experience Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KeyValue label="Experience to work Underground (In years)" value={underground.experience_years} />
                <KeyValue label="Role" value={underground.role} />
                <KeyValue label="Fit to work Underground" value={underground.fit_to_work} />
                <KeyValue label="Valid Till (If Applicable)" value={underground.medical_certificate_valid_till} />
              </div>
            </div>
            <AttachmentGroup title="Medical Certificate Attachments" items={underground.attachments?.medical_certificate as IAttachmentItem[]} />
          </div>
        </div>
      )}

      {/* Ride a Bicycle */}
      {bicycle && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 bg-[#f6f4ee] p-6 mb-2">
            <BadgeCheck className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
            <h2 className="text-lg font-semibold">Ride a Bicycle</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KeyValue label="Reflective jacket available" value={bicycle.reflective_jacket} />
              <KeyValue label="Training for safe bicycle riding available" value={bicycle.training_available} />
            </div>
          </div>
        </div>
      )}

      {/* Operate MHE */}
      {mhe && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 bg-[#f6f4ee] p-6 mb-2">
            <BadgeCheck className="h-6 w-6 text-white bg-[#C72030] rounded-full p-1" />
            <h2 className="text-lg font-semibold">Operate MHE</h2>
          </div>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KeyValue label="Safety shoes available" value={mhe.safety_shoes} />
              <KeyValue label="Cut resistant hand gloves available" value={mhe.hand_gloves} />
              <KeyValue label="Reflective jacket available" value={mhe.reflective_jacket} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};