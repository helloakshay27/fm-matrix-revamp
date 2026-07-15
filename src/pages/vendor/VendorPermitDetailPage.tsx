import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Shield, Paperclip, CheckCircle, Activity, ArrowLeft,
  MapPin, User, Calendar, Users, MessageSquare, FileText, Download,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/* ─── shared styles ─────────────────────────────────────────── */
const tabTriggerCls =
  'rounded-none border-b-2 border-transparent data-[state=active]:border-[#D92818] data-[state=active]:text-[#D92818] data-[state=active]:bg-transparent px-2 py-3 font-semibold text-gray-500 hover:text-gray-700 data-[state=inactive]:shadow-none transition-none focus-visible:ring-0 focus-visible:outline-none';

/* ─── helpers ────────────────────────────────────────────────── */
const fmt  = (v: any): string => (v != null && v !== '' ? String(v) : '-');
const fmtDate = (v?: string | null) => (v ? v.split('T')[0] : '-');
const name = (o: any): string =>
  o ? (o.full_name || o.name || o.company_name || fmt(o)) : '-';

/* ─── reusable layout pieces ────────────────────────────────── */
const SectionCard = ({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <Card className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden mb-6">
    <CardHeader className="bg-white pb-4 border-b border-gray-100">
      <CardTitle className="flex items-center gap-3 text-lg font-semibold">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#f0e8dc]">
          {icon}
        </div>
        <span className="uppercase tracking-wide" style={{ color: '#eb5e28' }}>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 bg-white">{children}</CardContent>
  </Card>
);

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div className="flex items-start text-sm">
    <span className="text-gray-500 w-[220px] shrink-0">{label}</span>
    <span className="text-gray-900 font-medium break-words flex-1">: {value ?? '-'}</span>
  </div>
);

const StatusBadge = ({ status }: { status?: string }) => {
  const s = (status || '').toLowerCase();
  const cls =
    s === 'approved'  ? 'bg-green-100 text-green-800'  :
    s === 'rejected'  ? 'bg-red-100 text-red-800'      :
    s === 'open'      ? 'bg-orange-100 text-orange-800' :
    s === 'draft'     ? 'bg-blue-100 text-blue-800'    :
    s === 'closed'    ? 'bg-gray-200 text-gray-700'    :
    s === 'hold'      ? 'bg-yellow-100 text-yellow-800' :
    s === 'extended'  ? 'bg-purple-100 text-purple-800' :
    'bg-gray-100 text-gray-700';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{status || '-'}</span>;
};

const ApprovalBadge = ({ status }: { status?: string }) => {
  const s = (status || '').toLowerCase();
  const cls =
    s === 'approved' ? 'bg-green-100 text-green-800' :
    s === 'rejected' ? 'bg-red-100 text-red-800'     :
    'bg-yellow-100 text-yellow-800';
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{status || 'Pending'}</span>;
};

const handleDownload = async (url: string, filename: string) => {
  try {
    const token = localStorage.getItem('token');
    const res   = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    if (!res.ok) throw new Error('Download failed');
    const blob = await res.blob();
    // Force octet-stream so the browser downloads instead of previewing (e.g. PDF viewer)
    const forcedBlob = new Blob([blob], { type: 'application/octet-stream' });
    const blobUrl    = URL.createObjectURL(forcedBlob);
    const a          = document.createElement('a');
    a.href           = blobUrl;
    a.download       = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
  } catch {
    // CORS fallback: force download via anchor with download attribute
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};

const AttachmentRow = ({
  url, filename, relation, index,
}: { url?: string; filename?: string; relation?: string; index: number }) => {
  const resolvedUrl  = url || '';
  const resolvedName = filename || `Attachment ${index + 1}`;
  return (
    <li className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
      <Paperclip className="w-4 h-4 text-gray-400 shrink-0" />
      <span className="flex-1 text-sm text-gray-800 break-all">{resolvedName}</span>
      {relation && <span className="text-gray-400 text-xs shrink-0">({relation})</span>}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={resolvedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
          title="Open"
        >
          View
        </a>
        <button
          onClick={() => handleDownload(resolvedUrl, resolvedName)}
          className="flex items-center gap-1 text-xs text-[#D92818] hover:text-[#b01a28] font-medium"
          title="Download"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>
    </li>
  );
};

const TH = ({ cols }: { cols: string[] }) => (
  <TableHeader>
    <TableRow className="bg-[#fcf5f5] hover:bg-[#fcf5f5]">
      {cols.map(h => (
        <TableHead key={h} className="font-semibold text-gray-700 text-xs whitespace-nowrap py-3">{h}</TableHead>
      ))}
    </TableRow>
  </TableHeader>
);

/* ─── main component ─────────────────────────────────────────── */
export const VendorPermitDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem('baseUrl');
  const token   = localStorage.getItem('token');

  const [loading, setLoading] = useState(false);
  const [res, setRes]         = useState<any>(null);   // full API response

  useEffect(() => {
    if (!id || !baseUrl || !token) return;
    (async () => {
      setLoading(true);
      try {
        const r = await fetch(`https://${baseUrl}/pms/permits/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) throw new Error();
        setRes(await r.json());
      } catch {
        toast.error('Failed to load permit details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return (
    <div className="p-6 text-gray-500 flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-[#D92818] border-t-transparent rounded-full animate-spin" />
      Loading permit details...
    </div>
  );
  if (!res) return <div className="p-6 text-gray-500">No permit data found.</div>;

  /* ── destructure top-level response ── */
  const permit: any          = res.permit || res;
  const approvalLevels: any[]  = res.approval_levels || permit.approval_levels || [];
  const permitExtends: any[]   = res.permit_extends  || permit.permit_extends  || [];
  const permitResumes: any[]   = res.permit_resume   || permit.permit_resume   || [];
  const permitClosure: any     = res.permit_closure  || permit.permit_closure  || null;
  const activityDetails: any[] = res.activity_details || permit.activity_details || [];
  const mainAttachments: any[] = res.main_attachments || permit.main_attachments || permit.attachments || [];
  const vendorAttachments: any = res.vendor_attachments || permit.vendor_attachments || null;
  const manpowerDetails: any[] = res.manpower_details  || permit.manpower_details  || [];
  const commentLogs: any[]     = res.comment_logs      || permit.comment_logs      || [];
  const qrCode: any            = res.qr_code           || permit.qr_code           || null;

  /* ── permit sub-fields ── */
  const permitType  = typeof permit.permit_type === 'object' ? permit.permit_type?.name : permit.permit_type;
  const location    = typeof permit.location    === 'object' ? permit.location?.name    : (permit.location || permit.location_details);
  const createdBy   = permit.created_by ? name(permit.created_by) : '-';
  const vendor      = permit.vendor ? name(permit.vendor) : (permit.external_vendor_name || permit.vender_name || '-');
  const contractor  = permit.contractor ? name(permit.contractor) : '-';
  const initiator   = permit.initiator  ? name(permit.initiator)  : '-';

  const vendorAttachList = vendorAttachments
    ? [
        ...(vendorAttachments.list_of_people || []),
        ...(vendorAttachments.esi_wc_policy  || []),
        ...(vendorAttachments.medical_reports || []),
        ...(vendorAttachments.other          || []),
      ]
    : [];

  const allAttachments = [...mainAttachments, ...vendorAttachList];

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-[#fafafa]">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          Vendor &gt; My Permits &gt; <span className="text-gray-900 font-medium">Permit Details</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold uppercase text-[#1a1a1a]">PERMIT DETAILS</h1>
            {permit.reference_number && (
              <p className="text-sm text-gray-500 mt-0.5">Ref: {permit.reference_number}</p>
            )}
          </div>
          <StatusBadge status={permit.status} />
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="flex flex-wrap items-center justify-start gap-4 bg-transparent border-b border-gray-200 rounded-none p-0 h-auto w-full mb-6">
          <TabsTrigger value="basic"      className={tabTriggerCls}>Basic Information</TabsTrigger>
          <TabsTrigger value="approval"   className={tabTriggerCls}>
            Approval {approvalLevels.length > 0 && `(${approvalLevels.length})`}
          </TabsTrigger>
          {permitExtends.length > 0 && (
            <TabsTrigger value="extensions" className={tabTriggerCls}>Extensions ({permitExtends.length})</TabsTrigger>
          )}
          {permitClosure && (
            <TabsTrigger value="closure" className={tabTriggerCls}>Closure</TabsTrigger>
          )}
          {manpowerDetails.length > 0 && (
            <TabsTrigger value="manpower" className={tabTriggerCls}>Manpower ({manpowerDetails.length})</TabsTrigger>
          )}
          {activityDetails.length > 0 && (
            <TabsTrigger value="activity" className={tabTriggerCls}>Activity ({activityDetails.length})</TabsTrigger>
          )}
          <TabsTrigger value="attachments" className={tabTriggerCls}>
            Attachments {allAttachments.length > 0 && `(${allAttachments.length})`}
          </TabsTrigger>
          {commentLogs.length > 0 && (
            <TabsTrigger value="comments" className={tabTriggerCls}>Comments ({commentLogs.length})</TabsTrigger>
          )}
        </TabsList>

        {/* ══ BASIC INFORMATION ══════════════════════════════════ */}
        <TabsContent value="basic" className="mt-0 space-y-6">

          {/* Permit Info */}
          <SectionCard icon={<Shield className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Permit Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Permit ID"              value={permit.id} />
              <Field label="Reference No."          value={permit.reference_number || permit.ref_no} />
              <Field label="Permit Number"          value={permit.permit_number} />
              <Field label="Permit Type"            value={permitType} />
              <Field label="Work Type"              value={permit.work_type} />
              <Field label="Permit For"             value={permit.permit_for} />
              <Field label="Status"                 value={permit.status} />
              <Field label="Extension Status"       value={permit.extension_status} />
              <Field label="All Levels Approved"    value={permit.all_level_approved === true ? 'Yes' : permit.all_level_approved === false ? 'No' : '-'} />
              <Field label="Revision"               value={permit.revision} />
            </div>
          </SectionCard>

          {/* Location */}
          <SectionCard icon={<MapPin className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Location">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Location / Area"  value={location} />
              <Field label="Site"             value={permit.site?.name       || permit.site} />
              <Field label="Building"         value={permit.building?.name   || permit.building} />
              <Field label="Wing"             value={permit.wing?.name       || permit.wing} />
              <Field label="Floor"            value={permit.floor?.name      || permit.floor} />
              <Field label="Unit"             value={permit.unit?.name       || permit.unit} />
              <Field label="Area"             value={permit.area?.name       || permit.area} />
              <Field label="Room"             value={permit.room?.name       || permit.room} />
              <Field label="Department"       value={permit.department?.name || permit.department} />
            </div>
          </SectionCard>

          {/* People */}
          <SectionCard icon={<User className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="People & Contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Created By"         value={createdBy} />
              {permit.created_by?.department_name && (
                <Field label="Department"       value={permit.created_by.department_name} />
              )}
              {permit.created_by?.mobile && (
                <Field label="Creator Mobile"   value={permit.created_by.mobile} />
              )}
              <Field label="Designation"        value={permit.designation} />
              <Field label="Initiator"          value={initiator} />
              {permit.initiator?.contact_number && (
                <Field label="Initiator Contact" value={permit.initiator.contact_number} />
              )}
              <Field label="Contractor"         value={contractor} />
              {permit.contractor?.contact_number && (
                <Field label="Contractor Contact" value={permit.contractor.contact_number} />
              )}
              {permit.contractor?.address && (
                <Field label="Contractor Address" value={permit.contractor.address} />
              )}
              <Field label="Vendor"             value={vendor} />
              <Field label="Permit Issuer"      value={permit.permit_issuer ? name(permit.permit_issuer) : '-'} />
              {permit.permit_issuer?.contact_number && (
                <Field label="Issuer Contact"   value={permit.permit_issuer.contact_number} />
              )}
              <Field label="Safety Officer"     value={permit.safety_officer ? name(permit.safety_officer) : '-'} />
              {permit.safety_officer?.contact_number && (
                <Field label="Safety Officer Contact" value={permit.safety_officer.contact_number} />
              )}
              <Field label="Contact Person"     value={permit.contact_person} />
              <Field label="Contact Number"     value={permit.contact_number} />
              <Field label="Technician"         value={permit.technician ? name(permit.technician) : '-'} />
            </div>
          </SectionCard>

          {/* Dates */}
          <SectionCard icon={<Calendar className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Dates">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
              <Field label="Requested Date"         value={fmtDate(permit.requested_date)} />
              <Field label="Created On"             value={fmtDate(permit.created_on || permit.created_at)} />
              <Field label="Issued At"              value={fmtDate(permit.issued_at)} />
              <Field label="Start Date"             value={fmtDate(permit.start_date || permit.valid_from)} />
              <Field label="End Date"               value={fmtDate(permit.end_date   || permit.valid_to)} />
              <Field label="Expiry Date"            value={fmtDate(permit.expiry_date || permit.permit_expiry)} />
              <Field label="Extension Date"         value={fmtDate(permit.extension_date)} />
              <Field label="Resume Date"            value={fmtDate(permit.resume_date)} />
            </div>
          </SectionCard>

          {/* Work Details — only if any narrative fields exist */}
          {(permit.description || permit.work_description || permit.comment ||
            permit.rejection_reason || permit.safety_precautions || permit.tools_required || permit.remarks) && (
            <SectionCard icon={<FileText className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Work Details">
              <div className="space-y-4 text-sm">
                {[
                  { label: 'Description',         val: permit.description },
                  { label: 'Work Description',    val: permit.work_description },
                  { label: 'Safety Precautions',  val: permit.safety_precautions },
                  { label: 'Tools Required',      val: permit.tools_required },
                  { label: 'Comment',             val: permit.comment },
                  { label: 'Rejection Reason',    val: permit.rejection_reason },
                  { label: 'Remarks',             val: permit.remarks },
                ].filter(x => x.val).map(({ label, val }) => (
                  <div key={label}>
                    <p className="text-gray-500 font-medium mb-1">{label}</p>
                    <p className="text-gray-900">{val}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </TabsContent>

        {/* ══ APPROVAL ══════════════════════════════════════════ */}
        <TabsContent value="approval" className="mt-0">
          <SectionCard icon={<CheckCircle className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Approval Levels">
            {approvalLevels.length === 0 ? (
              <p className="text-gray-400 text-sm">No approval levels found.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TH cols={['Order', 'Level Name', 'Status', 'Updated By', 'Updated At', 'Rejection Reason']} />
                  <TableBody>
                    {approvalLevels.map((lvl: any, i: number) => (
                      <TableRow key={lvl.id ?? i}>
                        <TableCell className="text-xs py-3">{fmt(lvl.order)}</TableCell>
                        <TableCell className="text-xs py-3 whitespace-nowrap">{fmt(lvl.name || lvl.level_name)}</TableCell>
                        <TableCell className="text-xs py-3"><ApprovalBadge status={lvl.status} /></TableCell>
                        <TableCell className="text-xs py-3">{fmt(lvl.updated_by || lvl.approved_by)}</TableCell>
                        <TableCell className="text-xs py-3 whitespace-nowrap">{fmtDate(lvl.status_updated_at || lvl.approved_at)}</TableCell>
                        <TableCell className="text-xs py-3">{fmt(lvl.rejection_reason)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        {/* ══ EXTENSIONS ════════════════════════════════════════ */}
        {permitExtends.length > 0 && (
          <TabsContent value="extensions" className="mt-0 space-y-4">
            {permitExtends.map((ext: any, i: number) => (
              <SectionCard
                key={ext.id ?? i}
                icon={<Calendar className="w-5 h-5" style={{ color: '#eb5e28' }} />}
                title={`Extension ${i + 1}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 mb-4">
                  <Field label="Extension Date"        value={fmtDate(ext.extension_date)} />
                  <Field label="Status"                value={ext.status} />
                  <Field label="Reason"                value={ext.reason_for_extension} />
                  <Field label="Created By"            value={name(ext.created_by)} />
                  <Field label="Assignees"             value={ext.assignees} />
                  <Field label="Attachments Count"     value={ext.attachments_count} />
                </div>
                {ext.extend_approval_levels?.length > 0 && (
                  <div className="overflow-x-auto mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Approval Levels</p>
                    <Table>
                      <TH cols={['Level Name', 'Status', 'Updated By', 'Updated At']} />
                      <TableBody>
                        {ext.extend_approval_levels.map((lvl: any, j: number) => (
                          <TableRow key={j}>
                            <TableCell className="text-xs py-2">{fmt(lvl.name)}</TableCell>
                            <TableCell className="text-xs py-2"><ApprovalBadge status={lvl.status} /></TableCell>
                            <TableCell className="text-xs py-2">{fmt(lvl.updated_by)}</TableCell>
                            <TableCell className="text-xs py-2 whitespace-nowrap">{fmtDate(lvl.status_updated_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </SectionCard>
            ))}
          </TabsContent>
        )}

        {/* ══ CLOSURE ════════════════════════════════════════════ */}
        {permitClosure && (
          <TabsContent value="closure" className="mt-0">
            <SectionCard icon={<CheckCircle className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Permit Closure">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 mb-4">
                <Field label="Closed By"           value={name(permitClosure.closed_by)} />
                <Field label="Attachments Count"   value={permitClosure.attachments_count} />
                {permitClosure.completion_comment && (
                  <div className="flex items-start text-sm md:col-span-2">
                    <span className="text-gray-500 w-[220px] shrink-0">Completion Comment</span>
                    <span className="text-gray-900 font-medium flex-1">: {permitClosure.completion_comment}</span>
                  </div>
                )}
              </div>
              {permitClosure.closure_approval_levels?.length > 0 && (
                <div className="overflow-x-auto mt-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Closure Approval Levels</p>
                  <Table>
                    <TH cols={['Level Name', 'Status', 'Updated By', 'Updated At']} />
                    <TableBody>
                      {permitClosure.closure_approval_levels.map((lvl: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs py-2">{fmt(lvl.name)}</TableCell>
                          <TableCell className="text-xs py-2"><ApprovalBadge status={lvl.status} /></TableCell>
                          <TableCell className="text-xs py-2">{fmt(lvl.updated_by)}</TableCell>
                          <TableCell className="text-xs py-2 whitespace-nowrap">{fmtDate(lvl.status_updated_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {permitClosure.attachments?.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Closure Attachments</p>
                  <ul className="divide-y divide-gray-100">
                    {permitClosure.attachments.map((a: any, i: number) => (
                      <AttachmentRow
                        key={a.id ?? i}
                        index={i}
                        url={a.url || a.document_url}
                        filename={a.filename}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </SectionCard>
          </TabsContent>
        )}

        {/* ══ MANPOWER ══════════════════════════════════════════ */}
        {manpowerDetails.length > 0 && (
          <TabsContent value="manpower" className="mt-0">
            <SectionCard icon={<Users className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Manpower Details">
              <div className="overflow-x-auto">
                <Table>
                  <TH cols={['#', 'Name', 'Designation', 'Phone']} />
                  <TableBody>
                    {manpowerDetails.map((mp: any, i: number) => (
                      <TableRow key={mp.id ?? i}>
                        <TableCell className="text-xs py-2">{i + 1}</TableCell>
                        <TableCell className="text-xs py-2 font-medium">{fmt(mp.assignee_name || mp.name)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(mp.designation)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(mp.phone || mp.mobile)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </TabsContent>
        )}

        {/* ══ ACTIVITY ══════════════════════════════════════════ */}
        {activityDetails.length > 0 && (
          <TabsContent value="activity" className="mt-0">
            <SectionCard icon={<Activity className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Activity Log">
              <div className="overflow-x-auto">
                <Table>
                  <TH cols={['#', 'Activity', 'Status', 'Done By', 'Date', 'Remarks']} />
                  <TableBody>
                    {activityDetails.map((act: any, i: number) => (
                      <TableRow key={act.id ?? i}>
                        <TableCell className="text-xs py-2">{i + 1}</TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{fmt(act.activity || act.name || act.title)}</TableCell>
                        <TableCell className="text-xs py-2"><ApprovalBadge status={act.status} /></TableCell>
                        <TableCell className="text-xs py-2">{fmt(act.done_by || act.user?.name || act.user?.full_name)}</TableCell>
                        <TableCell className="text-xs py-2 whitespace-nowrap">{fmtDate(act.date || act.created_at)}</TableCell>
                        <TableCell className="text-xs py-2">{fmt(act.remarks || act.comment)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SectionCard>
          </TabsContent>
        )}

        {/* ══ ATTACHMENTS ═══════════════════════════════════════ */}
        <TabsContent value="attachments" className="mt-0 space-y-6">
          {/* Main Attachments */}
          <SectionCard icon={<Paperclip className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Attachments">
            {mainAttachments.length === 0 ? (
              <p className="text-gray-400 text-sm">No attachments found.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {mainAttachments.map((a: any, i: number) => (
                  <AttachmentRow
                    key={a.id ?? i}
                    index={i}
                    url={a.url || a.document_url}
                    filename={a.filename || a.document_file_name}
                    relation={a.relation}
                  />
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Vendor Attachments by category */}
          {vendorAttachments && (
            <>
              {[
                { key: 'list_of_people',   label: 'List of People' },
                { key: 'esi_wc_policy',    label: 'ESI / WC Policy' },
                { key: 'medical_reports',  label: 'Medical Reports' },
                { key: 'other',            label: 'Other Documents' },
              ].map(({ key, label }) => {
                const list: any[] = vendorAttachments[key] || [];
                if (!list.length) return null;
                return (
                  <SectionCard key={key} icon={<Paperclip className="w-5 h-5" style={{ color: '#eb5e28' }} />} title={label}>
                    <ul className="divide-y divide-gray-100">
                      {list.map((a: any, i: number) => (
                        <AttachmentRow
                          key={a.id ?? i}
                          index={i}
                          url={a.url || a.document_url}
                          filename={a.filename || a.document_file_name}
                        />
                      ))}
                    </ul>
                  </SectionCard>
                );
              })}
            </>
          )}
        </TabsContent>

        {/* ══ COMMENTS ══════════════════════════════════════════ */}
        {commentLogs.length > 0 && (
          <TabsContent value="comments" className="mt-0">
            <SectionCard icon={<MessageSquare className="w-5 h-5" style={{ color: '#eb5e28' }} />} title="Comment Logs">
              <div className="space-y-4">
                {commentLogs.map((c: any, i: number) => (
                  <div key={c.id ?? i} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {name(c.created_by)}
                      </span>
                      <span className="text-xs text-gray-400">{fmtDate(c.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{c.description || '-'}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default VendorPermitDetailPage;
