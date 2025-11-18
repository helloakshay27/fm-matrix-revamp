import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Users, Building2, CalendarCheck2, MessageCircle, ClipboardList, Paperclip, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';




const SMTDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  type SmtDetail = {
    id: number;
    area_of_visit?: string | null;
    facility_name?: string | null;
    other_facility_name?: string | null;
    created_at?: string | null;
    smt_done_date?: string | null;
    circle_name?: string | null;
    zone_id?: number | null;
    work_location?: string | null;
    people_interacted_with?: (string | null)[] | string | null;
    form_details?: Record<string, any> | null;
    key_observations?: string | null;
    responsible_person?: { name?: string | null; email?: string | null; mobile?: string | null } | null;
    smt_user?: { id: number; name?: string | null; email?: string | null; mobile?: string | null; department?: string | null } | null;
    card_attachments?: { url?: string }[];
    other_attachments?: { url?: string }[];
  };
  const [smtDetails, setSmtDetails] = useState<SmtDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imgPreviewOpen, setImgPreviewOpen] = useState(false);
  const [imgPreviewUrl, setImgPreviewUrl] = useState<string | null>(null);

  const smtDetailPageByID = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    if (!baseUrl || !token || !id) {
      toast("Missing base URL, token, or service ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cleanBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
      const response = await axios.get(
        `${cleanBaseUrl}/smts/${id}.json`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const payload = response.data;
      // API may return object directly or inside data
      const detail: SmtDetail | null = Array.isArray(payload?.data)
        ? (payload.data[0] as SmtDetail)
        : (payload?.data as SmtDetail) || (payload as SmtDetail) || null;
      setSmtDetails(detail);
    } catch (error) {
      console.error('Failed to fetch SMT details:', error);
      toast("Failed to fetch SMT details");
      setError('Failed to fetch SMT details');
      setSmtDetails(null);
    }
    finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    smtDetailPageByID();
  }, [id]);

  // Derived safe values
  const peopleList = useMemo(() => {
    const val = smtDetails?.people_interacted_with;
    if (!val) return [] as string[];
    if (Array.isArray(val)) return val.map((p) => (p || '').toString().trim()).filter((p) => p.length > 0);
    if (typeof val === 'string') {
      const s = val.trim();
      if (s.startsWith('[') && s.endsWith(']')) {
        try {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) return parsed.map((p) => (p || '').toString().trim()).filter((p) => p.length > 0);
        } catch { }
      }
      return s.split(/[;,\n]/g).map((x) => x.trim()).filter((x) => x.length > 0);
    }
    return [] as string[];
  }, [smtDetails]);

  const formDetails = (smtDetails?.form_details || {}) as Record<string, any>;
  const yn = (v: any) => String(v ?? '').toLowerCase() === 'yes' || v === true || v === 'true';
  const topics = {
    road_safety: yn(formDetails['road_safety']),
    electrical_safety: yn(formDetails['electrical_safety']),
    work_height_safety: yn(formDetails['work_height'] || formDetails['work_height_safety']),
    ofc: yn(formDetails['ofc']),
    health_wellbeing: yn(formDetails['health_well'] || formDetails['health_wellbeing']),
    tool_box_talk: yn(formDetails['tool_box'] || formDetails['tool_box_talk']),
    thank_you_card: yn(formDetails['thank_you_card']),
  };

  const thankYouCardUrl = (smtDetails?.card_attachments || []).map((a) => a.url).filter(Boolean)[0] || '';
  const otherImages = (smtDetails?.other_attachments || []).map((a) => a.url).filter(Boolean);

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4" />
          <p className="text-gray-700">Loading SMT details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!smtDetails) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">No SMT details found</div>
        </div>
      </div>
    );
  }

  const formatDate = (val: string | null | undefined) => {
    if (!val) return '-';
    const d = new Date(val);
    if (isNaN(d.getTime())) return '-';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-gray-800 mb-4 text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">SMT DETAILS</h1>
          </div>
        </div>
      </div>

      {/* SMT DETAILS */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <User className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">SMT DETAILS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 text-[15px] p-4 gap-6">
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.smt_user?.name || '—'}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">Email</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-all">{smtDetails.smt_user?.email || '—'}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">Function</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.smt_user?.department || '—'}</span></div>
          </div>
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">Circle</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.circle_name || '—'}</span></div>
            <div className="flex"><span className="text-gray-500 w-40">Zone / Work Location</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.work_location || '—'}</span></div>
          </div>
        </div>
      </div>

      {/* FACILITY & AREA */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <Building2 className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">FACILITY & AREA OF VISIT</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 text-[15px] p-4 gap-6">
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">Type of Facility</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.facility_name || '—'}</span></div>
          </div>
          <div className="space-y-3">
            <div className="flex"><span className="text-gray-500 w-40">Area of Visit</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.area_of_visit || '—'}</span></div>
          </div>
        </div>
      </div>

      {/* SMT DATE */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <CalendarCheck2 className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">SMT DATE</h2>
        </div>
        <div className="p-4">
          <div className="flex"><span className="text-gray-500 w-40">Date</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{formatDate(smtDetails.smt_done_date || smtDetails.created_at)}</span></div>
        </div>
      </div>

      {/* PEOPLE INTERACTED */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <Users className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">PEOPLE INTERACTED WITH</h2>
        </div>
        <div className="p-4">
          {peopleList.length > 0 ? (
            <ul className="list-decimal ml-6 mt-2 text-gray-900 space-y-1">
              {peopleList.map((person, idx) => (<li key={idx}>{person}</li>))}
            </ul>
          ) : <span className="text-gray-500">—</span>}
        </div>
      </div>

      {/* TOPICS DISCUSSED */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <ClipboardList className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">TOPICS DISCUSSED</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Road Safety', value: topics.road_safety },
              { label: 'Electrical Safety', value: topics.electrical_safety },
              { label: 'Work / Height Safety', value: topics.work_height_safety },
              { label: 'OFC', value: topics.ofc },
              { label: 'Health & Wellbeing', value: topics.health_wellbeing },
              { label: 'Tool Box Talk', value: topics.tool_box_talk },
              { label: 'Thank You Card Given', value: topics.thank_you_card },
            ].map(t => (
              <div key={t.label} className="flex items-center justify-between border rounded px-3 py-2 bg-white">
                <span className="text-sm text-gray-700">{t.label}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{t.value ? 'Yes' : 'No'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ATTACHMENTS */} 
      {/* <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <Paperclip className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">ATTACHMENTS</h2>
        </div>
        <div className="p-4 space-y-6">
          <div>
            <div className="flex mb-2"><span className="text-gray-500 w-40">Attach Card Image</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{thankYouCardUrl ? '' : '—'}</span></div>
            {thankYouCardUrl && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setImgPreviewUrl(thankYouCardUrl); setImgPreviewOpen(true); }}
                  className="group rounded-md overflow-hidden hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C72030]"
                  aria-label="Open thank you card image"
                >
                  <img src={thankYouCardUrl} alt="Thank You Card" className="h-24 w-24 object-cover" />
                </button>
              </div>
            )}
          </div>
          <div>
            <div className="flex mb-2"><span className="text-gray-500 w-40">Other Images</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{otherImages.length ? '' : '—'}</span></div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {otherImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setImgPreviewUrl(img); setImgPreviewOpen(true); }}
                    className="group rounded-md overflow-hidden hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C72030]"
                    aria-label={`Open attachment ${idx + 1}`}
                  >
                    <img src={img} alt={`Attachment ${idx + 1}`} className="h-24 w-24 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Image Preview Modal */}
      {/* <Dialog open={imgPreviewOpen} onOpenChange={(open) => { setImgPreviewOpen(open); if (!open) setImgPreviewUrl(null); }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
          </DialogHeader>
          {imgPreviewUrl ? (
            <div className="w-full">
              <img src={imgPreviewUrl} alt="Attachment Preview" className="max-h-[80vh] w-full object-contain rounded" />
            </div>
          ) : (
            <div className="text-gray-400">No image</div>
          )}
        </DialogContent>
      </Dialog> */}


      {/* KEY OBSERVATIONS */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <MessageCircle className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">KEY OBSERVATIONS / EXPERIENCE</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-900 whitespace-pre-wrap">{smtDetails.key_observations || '—'}</p>
        </div>
      </div>

      {/* RESPONSIBLE PERSON */}
      <div className="bg-white rounded-lg border text-[15px] mb-6">
        <div className="flex p-4 items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-xs mr-3">
            <Eye className="w-5 h-5 text-[#C72030]" />
          </div>
          <h2 className="text-lg font-bold">RESPONSIBLE PERSON</h2>
        </div>
        <div className="p-4">
          <div className="flex"><span className="text-gray-500 w-40">Name</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.responsible_person?.name || '—'}</span></div>
          <div className="flex mt-2"><span className="text-gray-500 w-40">Email</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium break-all">{smtDetails.responsible_person?.email || '—'}</span></div>
          <div className="flex mt-2"><span className="text-gray-500 w-40">Mobile</span><span className="text-gray-500 mx-2">:</span><span className="text-gray-900 font-medium">{smtDetails.responsible_person?.mobile || '—'}</span></div>
        </div>
      </div>
    </div>
  );
};

export default SMTDetailPage;
