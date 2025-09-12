import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Users, FileText, Building2, CalendarCheck2, MessageCircle, ClipboardList, Paperclip, Eye } from 'lucide-react';
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
      const response = await axios.get(
        `https://${baseUrl}/smts/${id}.json`,
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
      <div className="p-6 bg-gray-50 min-h-screen grid place-items-center text-gray-600">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen grid place-items-center text-red-600">{error}</div>
    );
  }

  if (!smtDetails) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen grid place-items-center text-gray-600">No details found</div>
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* SMT Details - Done By */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">SMT DETAILS</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm">Name</span>
              <p className="text-gray-900 font-medium">{smtDetails.smt_user?.name || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Email Id</span>
              <p className="text-gray-900 font-medium">{smtDetails.smt_user?.email || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Function</span>
              <p className="text-gray-900 font-medium">{smtDetails.smt_user?.department || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Circle</span>
              <p className="text-gray-900 font-medium">{smtDetails.circle_name || '-'}</p>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Zone/Work Location</span>
              <p className="text-gray-900 font-medium">{smtDetails.work_location || '-'}</p>
            </div>
          </div>
        </div>
      </div>


      {/* Type of Facility & Area of Visit */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Type of Facility & Area of Visit</h2>
        </div>
        <div className="p-6 grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <span className="text-gray-500 text-sm">Type of Facility</span>
            <p className="text-gray-900 font-medium">{smtDetails.facility_name || '-'}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Area of Visit</span>
            <p className="text-gray-900 font-medium">{smtDetails.area_of_visit || '-'}</p>
          </div>
        </div>
      </div>


      {/* SMT Date */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <CalendarCheck2 className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">SMT Date</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900 font-medium">{formatDate(smtDetails.smt_done_date || smtDetails.created_at)}</p>
        </div>
      </div>


      {/* People Interacted With */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">People Interacted With</h2>
        </div>
        <div className="p-6">
          {peopleList.length > 0 ? (
            <ul className="list-decimal ml-6 mt-2 text-gray-900">
              {peopleList.map((person, idx) => (
                <li key={idx}>{person}</li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      </div>


      {/* Topics Discussed */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Topics Discussed</h2>
        </div>
        <div className="p-6">
          <ul className="mt-2 text-gray-900">
            <li>Road Safety: {topics.road_safety ? 'Yes' : 'No'}</li>
            <li>Electrical Safety: {topics.electrical_safety ? 'Yes' : 'No'}</li>
            <li>Work/Height Safety: {topics.work_height_safety ? 'Yes' : 'No'}</li>
            <li>OFC: {topics.ofc ? 'Yes' : 'No'}</li>
            <li>Health and wellbeing initiatives by in: {topics.health_wellbeing ? 'Yes' : 'No'}</li>
            <li>Tool Box Talk: {topics.tool_box_talk ? 'Yes' : 'No'}</li>
            <li>Thank you card given: {topics.thank_you_card ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </div>


      {/* Attachments */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Paperclip className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Attachments</h2>
        </div>
        <div className="p-6">
          <div className="mt-2 space-y-4">
            <div>
              <div className="font-medium text-gray-700 mb-2">Attach Card Image</div>
              {thankYouCardUrl ? (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setImgPreviewUrl(thankYouCardUrl); setImgPreviewOpen(true); }}
                    className="group rounded-md overflow-hidden hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C72030]"
                    aria-label="Open thank you card image"
                  >
                    <img
                      src={thankYouCardUrl}
                      alt="Thank You Card"
                      className="h-24 w-24 object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  </button>
                </div>
              ) : (
                <span className="text-gray-400">No file</span>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-700 mb-2"> Attach Other Images</div>
              {otherImages && otherImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {otherImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { setImgPreviewUrl(img); setImgPreviewOpen(true); }}
                      className="group rounded-md overflow-hidden hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C72030]"
                      aria-label={`Open attachment ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Attachment ${idx + 1}`}
                        className="h-24 w-24 object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">No images</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={imgPreviewOpen} onOpenChange={(open) => { setImgPreviewOpen(open); if (!open) setImgPreviewUrl(null); }}>
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
      </Dialog>


      {/* Key Observations */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Key Observations/Experience with talking to people</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900 mt-2">{smtDetails.key_observations || <span className="text-gray-400">N/A</span>}</p>
        </div>
      </div>


      {/* Person Responsible for Location */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-[#f6f4ee]">
          <div className="w-8 h-8 bg-[#C72030] rounded-full flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Person Responsible for Location</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-900 mt-2">{smtDetails.responsible_person?.name || <span className="text-gray-400">N/A</span>}</p>
        </div>
      </div>
    </div>
  );
};

export default SMTDetailPage;
