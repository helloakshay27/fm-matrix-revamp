import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Download, Truck, Boxes, FileTextIcon, Paperclip, FileText, FileSpreadsheet, X, Ticket, Calendar, BarChart3, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddVisitModal } from '@/components/AddVisitModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';
import { AMCAnalyticsTab } from '@/components/amc-details/AMCAnalyticsTab';
import { AMCDetailsPreviewTab } from '@/components/amc-details/AMCDetailsPreviewTab';


interface AMCDetailsData {
  id: number;
  asset_id: number | null;
  service_id?: number | null; // added optional service_id to fix TS error when referencing amcDetails.service_id
  amc_vendor_name: string | null;
  amc_vendor_mobile: string | null;
  amc_vendor_email: string | null;
  amc_contract: string | null;
  amc_invoice: string | null;
  amc_cost: number;
  amc_start_date: string;
  amc_end_date: string;
  amc_first_service: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  payment_term: string;
  no_of_visits: number;
  remarks: string;
  asset_name?: string;
  amc_type?: string;
  amc_assets?: any[];
  service_name?: string;
  service_code?: string;
  execution_type?: string;
  service_status?: string;
  amc_services?: {
    id: number;
    service_id: number;
    group_id?: number | null;
    sub_group_id?: number | null;
    service_name?: string | null;
    sset_code?: string | null; // keeping backend field name as provided
    asset_code?: string | null; // allow dummy fallback field name
  }[];
}

interface Technician {
  id: number;
  name: string;
  email: string;
}

interface AmcVisitLog {
  id: number;
  visit_number: number;
  visit_date: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  asset_period: string;
  technician: Technician | null;
  // Added optional attachment to align with runtime usage (visit.attachment?.document / id)
  attachment?: {
    id?: number;
    document?: string;          // image URL or file URL
    document_url?: string;      // sometimes APIs use document_url
    [key: string]: any;         // allow extra backend-provided fields
  } | null;

}

interface AMCDetailsDataWithVisits extends AMCDetailsData {
  amc_visit_logs: AmcVisitLog[];
  amc_contracts?: any[];
  amc_invoices?: any[];
}

interface TicketRecord {
  id: number;
  heading: string | null;
  category_type?: string | null;
  status?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  updated_by?: string | null;
}

export const AMCDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: amcData, loading, error } = useAppSelector(
    (state) => state.amcDetails as { data: AMCDetailsDataWithVisits; loading: boolean; error: any }
  );
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const amcDetails: AMCDetailsData | null = amcData as AMCDetailsData;
  const amcVisitData = amcData?.amc_visit_logs?.map((visit) => visit) ?? [];
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('amc-information'); // Changed default to 'amc-information'
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  // Tickets state
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  const fetchTicketsForAssets = async (assetIds: number[]) => {
    if (!assetIds.length) return;
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) return;
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      const all: TicketRecord[] = [];
      // Sequential to keep order; could parallelize with Promise.all if backend load ok
      for (const assetId of assetIds) {
        try {
          const url = `https://${baseUrl}/pms/assets/${assetId}/tickets.json?id=${assetId}`;
          const resp = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
          if (!resp.ok) throw new Error(`Asset ${assetId} tickets fetch failed`);
          const data = await resp.json();
          const arr = Array.isArray(data) ? data : (Array.isArray(data?.tickets) ? data.tickets : []);
          arr.forEach((t: any) => {
            all.push({
              id: t.id,
              heading: t.heading || null,
              category_type: t.category_type || null,
              status: t.status || null,
              updated_at: t.updated_at || null,
              created_at: t.created_at || null,
              updated_by: t.updated_by || null,
            });
          });
        } catch (inner) {
          console.warn(inner);
        }
      }
      setTickets(all);
    } catch (e: any) {
      setTicketsError(e.message || 'Failed to load tickets');
    } finally {
      setTicketsLoading(false);
    }
  };

  // Fetch tickets when AMC details loaded
  useEffect(() => {
    if (amcDetails?.amc_assets?.length) {
      const ids = amcDetails.amc_assets.map((a: any) => a.asset_id).filter((v: any) => !!v);
      fetchTicketsForAssets(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amcDetails?.amc_assets]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAMCDetails(id));
    }
  }, [dispatch, id]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return '—';
    }
  };


  const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return '—';
    return `${localStorage.getItem('currency')}${amount}`;
  };

  const formatPaymentTerm = (term: string | null | undefined): string => {
    if (!term) return '—';
    const formatted = term.replace(/_/g, ' ').toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading AMC details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!amcDetails) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">No AMC details found</div>
        </div>
      </div>
    );
  }

  const hanldeClose = () => {
    setShowAddVisitModal(false);
  };



  return (
    <div className="p-6">
      <div className="mb-6">
        {/* <Button
          variant="ghost"
          onClick={() => navigate('/maintenance/amc')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button> */}
        <button
          onClick={() => navigate('/maintenance/amc')}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AMC List
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AMC Details</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate(`/maintenance/amc/edit/${id}`)}
              variant="outline"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="mask0_107_2076"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="21"
                  height="21"
                >
                  <rect width="21" height="21" fill="#C72030" />
                </mask>
                <g mask="url(#mask0_107_2076)">
                  <path
                    d="M4.375 16.625H5.47881L14.4358 7.66806L13.3319 6.56425L4.375 15.5212V16.625ZM3.0625 17.9375V14.9761L14.6042 3.43941C14.7365 3.31924 14.8825 3.22642 15.0423 3.16094C15.2023 3.09531 15.37 3.0625 15.5455 3.0625C15.7209 3.0625 15.8908 3.09364 16.0552 3.15591C16.2197 3.21818 16.3653 3.3172 16.492 3.45297L17.5606 4.53491C17.6964 4.66164 17.7931 4.80747 17.8509 4.97241C17.9086 5.13734 17.9375 5.30228 17.9375 5.46722C17.9375 5.64324 17.9075 5.81117 17.8474 5.971C17.7873 6.13098 17.6917 6.2771 17.5606 6.40937L6.02394 17.9375H3.0625ZM13.8742 7.12578L13.3319 6.56425L14.4358 7.66806L13.8742 7.12578Z"
                    fill="#C72030"
                  />
                </g>
              </svg>
            </Button>
            <Button
              onClick={() => setShowAddVisitModal(true)}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              Add Visit
            </Button>
            {/* <Button
              onClick={() => navigate(`/maintenance/amc/edit/${id}`)}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button> */}

          </div>
        </div>
      </div>

      <div className="rounded-lg border-r border-b border-gray-200 shadow-sm" style={{ borderTop: 'none', borderLeft: 'none', backgroundColor: 'rgba(250, 250, 250, 1)' }}>
        <style>{`
          .top-level-tabs button[data-state="active"] {
            background-color: rgba(237, 234, 227, 1) !important;
            color: rgba(199, 32, 48, 1) !important;
          }
        `}</style>
        <Tabs defaultValue="amc-information" className="w-full">
          <TabsList className="top-level-tabs w-full flex flex-nowrap rounded-t-lg p-0 overflow-x-auto mb-4" style={{ gap: '0', padding: '0', backgroundColor: 'rgba(246, 247, 247, 1)', height: '50px', marginBottom: '16px' }}>
            {[
              { label: 'AMC Information', value: 'amc-information' },
              { label: 'Supplier Information', value: 'supplier-information' },
              { label: 'Attachments', value: 'attachments' },
              { label: 'Schedule', value: 'schedule' },
              { label: 'Tickets', value: 'tickets' },
              { label: 'Association', value: 'association' },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030]"
                style={{
                  width: '230px',
                  height: '36px',
                  paddingTop: '10px',
                  paddingRight: '20px',
                  paddingBottom: '10px',
                  paddingLeft: '20px',
                  borderRadius: '0',
                  border: 'none',
                  margin: '0',
                  fontFamily: 'Work Sans',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  color: 'rgba(26, 26, 26, 1)',
                  backgroundColor: 'rgba(246, 247, 247, 1)'
                }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* AMC Information */}
          <TabsContent value="amc-information" className="p-0">
            {/* Sub-navigation */}
            <div className="rounded-lg shadow-sm border border-gray-200" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
              <Tabs defaultValue="analytics" className="w-full">
                <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-[36px] p-0 text-sm justify-stretch border-b border-gray-200">
                  <TabsTrigger
                    value="analytics"
                    className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-0 h-[36px] flex items-center gap-2 text-gray-700 data-[state=active]:text-[#C72030] data-[state=active]:border-0 [&_svg]:text-gray-700 data-[state=active]:[&_svg]:text-[#C72030]"
                    style={{ border: '1px solid rgba(217, 217, 217, 1)', borderRight: '1px solid rgba(209, 209, 209, 1)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <mask id="mask0_9547_3931" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_9547_3931)">
                        <path d="M8.66681 13.1106C7.59669 13.0192 6.69719 12.5831 5.96831 11.8024C5.23944 11.0216 4.875 10.0875 4.875 9C4.875 7.85413 5.27606 6.88019 6.07819 6.07819C6.88019 5.27606 7.85413 4.875 9 4.875C10.0875 4.875 11.0216 5.23825 11.8024 5.96475C12.5831 6.69112 13.0192 7.58944 13.1106 8.65969L11.9179 8.30625C11.7557 7.63125 11.4066 7.07812 10.8703 6.64688C10.3342 6.21563 9.71075 6 9 6C8.175 6 7.46875 6.29375 6.88125 6.88125C6.29375 7.46875 6 8.175 6 9C6 9.7125 6.21681 10.3375 6.65044 10.875C7.08406 11.4125 7.636 11.7625 8.30625 11.925L8.66681 13.1106ZM9.56681 16.0946C9.47231 16.1149 9.37788 16.125 9.2835 16.125H9C8.01438 16.125 7.08812 15.938 6.22125 15.564C5.35437 15.19 4.60031 14.6824 3.95906 14.0413C3.31781 13.4002 2.81019 12.6463 2.43619 11.7795C2.06206 10.9128 1.875 9.98669 1.875 9.00131C1.875 8.01581 2.062 7.0895 2.436 6.22237C2.81 5.35525 3.31756 4.601 3.95869 3.95962C4.59981 3.31825 5.35375 2.81044 6.2205 2.43619C7.08725 2.06206 8.01331 1.875 8.99869 1.875C9.98419 1.875 10.9105 2.06206 11.7776 2.43619C12.6448 2.81019 13.399 3.31781 14.0404 3.95906C14.6818 4.60031 15.1896 5.35437 15.5638 6.22125C15.9379 7.08812 16.125 8.01438 16.125 9V9.27975C16.125 9.373 16.1149 9.46631 16.0946 9.55969L15 9.225V9C15 7.325 14.4187 5.90625 13.2563 4.74375C12.0938 3.58125 10.675 3 9 3C7.325 3 5.90625 3.58125 4.74375 4.74375C3.58125 5.90625 3 7.325 3 9C3 10.675 3.58125 12.0938 4.74375 13.2563C5.90625 14.4187 7.325 15 9 15H9.225L9.56681 16.0946ZM15.1052 16.2332L11.7043 12.825L10.8894 15.2884L9 9L15.2884 10.8894L12.825 11.7043L16.2332 15.1052L15.1052 16.2332Z" fill="#C72030"/>
                      </g>
                    </svg>
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="amc-details"
                    className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-0 h-[36px] flex items-center gap-2 text-gray-700 data-[state=active]:text-[#C72030] data-[state=active]:border-0 [&_svg]:text-gray-700 data-[state=active]:[&_svg]:text-[#C72030]"
                    style={{ border: '1px solid rgba(217, 217, 217, 1)' }}
                  >
                    <Settings className="w-4 h-4" />
                    AMC Details
                  </TabsTrigger>
                </TabsList>

                {/* Analytics Sub-tab */}
                <TabsContent value="analytics" className="p-4 sm:p-6" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
                  <AMCAnalyticsTab amc={amcDetails} amcId={amcDetails?.id?.toString() || id || ''} />
                </TabsContent>

                {/* AMC Details Sub-tab */}
                <TabsContent value="amc-details" className="p-4 sm:p-6">
                  <AMCDetailsPreviewTab amc={amcDetails} amcId={amcDetails?.id?.toString() || id || ''} />
                </TabsContent>
              </Tabs>
                  </div>
          </TabsContent>

          {/* Supplier Information */}
          <TabsContent value="supplier-information" className="p-3 sm:p-6" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
            <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
            }}>
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                    <div className="w-6 h-6 mr-2 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="#C72030" strokeWidth="1.5"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="#C72030" strokeWidth="1.5"/>
                      </svg>
                  </div>
                  SUPPLIER INFORMATION
                </CardTitle>
                  <Button
                    className="px-4 py-2 font-medium text-[#C72030] border border-[#C72030] rounded-md hover:bg-[#C72030] hover:text-white transition-colors"
                    style={{
                      backgroundColor: '#F6F4EE',
                      color: '#C72030',
                      border: '1px solid #C72030',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: 500
                    }}
                  >
                    View Supplier
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">Name</div>
                    <div className="text-base text-gray-900 font-semibold">{amcDetails.amc_vendor_name || '—'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">Company Name</div>
                    <div className="text-base text-gray-900 font-semibold">{amcDetails.amc_vendor_name || '—'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">Mobile 1</div>
                    <div className="text-base text-gray-900 font-semibold">{amcDetails.amc_vendor_mobile || '—'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">Email</div>
                    <div className="text-base text-gray-900 font-semibold">{amcDetails.amc_vendor_email || '—'}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">Mobile 2</div>
                    <div className="text-base text-gray-900 font-semibold">—</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments */}
          <TabsContent value="attachments" className="p-3 sm:p-6" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
            <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
            }}>
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center">
                    <Paperclip className="w-5 h-5 text-[#C72030]" />
                  </div>
                  ATTACHMENTS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AMC Contracts Card */}
                  <div className="bg-[#F6F4EE] rounded-lg p-6">
                    <h3 className="text-[#1a1a1a] font-semibold text-base mb-3">AMC Contracts</h3>
                    <div className="flex flex-wrap gap-4">
                      {(() => {
                        const sectionData = (amcData as any)?.amc_contracts || [];
                        const documents = sectionData?.flatMap((item: any) => item.documents || []) || [];
                        
                        if (documents.length === 0) {
                    return (
                            <p className="text-gray-500 text-sm">No AMC contract attachments available</p>
                          );
                        }
                        
                        return documents.map((doc: any) => {
                              const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.document_url);
                              const isPdf = /\.pdf$/i.test(doc.document_url);
                              const isExcel = /\.(xls|xlsx|csv)$/i.test(doc.document_url);
                              const isWord = /\.(doc|docx)$/i.test(doc.document_url);
                              const isDownloadable = isPdf || isExcel || isWord;

                              const handleFileAction = async () => {
                                if (!doc?.attachment_id) {
                                  console.error('Attachment ID is undefined', doc);
                                  return;
                                }

                                try {
                                  const token = localStorage.getItem('token');
                                  const baseUrl = localStorage.getItem('baseUrl');
                                  if (!token) {
                                    console.error('No token found in local storage');
                                    return;
                                  }

                                  const apiUrl = `https://${baseUrl}/attachfiles/${doc.attachment_id}?show_file=true`;

                                  const response = await fetch(apiUrl, {
                                    method: 'GET',
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      'Content-Type': 'application/json',
                                    },
                                  });

                                  if (!response.ok) {
                                    throw new Error('Failed to fetch the file');
                                  }

                                  const blob = await response.blob();
                                  const url = window.URL.createObjectURL(blob);

                                  if (isImage) {
                                    setSelectedDoc({
                                      document_url: url,
                                      document_name: doc.document_name || `document_${doc.attachment_id}`,
                                      blob: blob
                                    });
                                    setIsModalOpen(true);
                                  } else {
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = doc.document_name || `document_${doc.attachment_id}`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    window.URL.revokeObjectURL(url);
                                  }
                                } catch (error) {
                                  console.error('Error handling file:', error);
                                }
                              };

                              return (
                                <div
                                  key={doc.id}
                              className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-white shadow-md"
                                >
                                  {isImage ? (
                                    <>
                                      <button
                                        className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                        title="View"
                                        onClick={handleFileAction}
                                        type="button"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <img
                                        src={doc.document_url}
                                        alt={doc.document_name}
                                        className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                        onClick={handleFileAction}
                                      />
                                    </>
                                  ) : isPdf ? (
                                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                      <FileText className="w-6 h-6" />
                                    </div>
                                  ) : isExcel ? (
                                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                      <FileSpreadsheet className="w-6 h-6" />
                                    </div>
                                  ) : isWord ? (
                                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                                      <FileText className="w-6 h-6" />
                                    </div>
                                  ) : (
                                    <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                      <FileText className="w-6 h-6" />
                                    </div>
                                  )}
                                  <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                    {doc.document_name || `Document_${doc.id}`}
                                  </span>
                                  {isDownloadable && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                      onClick={handleFileAction}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              );
                        });
                      })()}
                            </div>
                        </div>

                  {/* AMC Invoice Card */}
                  <div className="bg-[#F6F4EE] rounded-lg p-6">
                    <h3 className="text-[#1a1a1a] font-semibold text-base mb-3">AMC Invoice</h3>
                    <div className="flex flex-wrap gap-4">
                      {(() => {
                        const sectionData = (amcData as any)?.amc_invoices || [];
                        const documents = sectionData?.flatMap((item: any) => item.documents || []) || [];
                        
                        if (documents.length === 0) {
                          return (
                            <p className="text-gray-500 text-sm">No AMC invoice attachments available</p>
                          );
                        }
                        
                        return documents.map((doc: any) => {
                          const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.document_url);
                          const isPdf = /\.pdf$/i.test(doc.document_url);
                          const isExcel = /\.(xls|xlsx|csv)$/i.test(doc.document_url);
                          const isWord = /\.(doc|docx)$/i.test(doc.document_url);
                          const isDownloadable = isPdf || isExcel || isWord;

                          const handleFileAction = async () => {
                            if (!doc?.attachment_id) {
                              console.error('Attachment ID is undefined', doc);
                              return;
                            }

                            try {
                              const token = localStorage.getItem('token');
                              const baseUrl = localStorage.getItem('baseUrl');
                              if (!token) {
                                console.error('No token found in local storage');
                                return;
                              }

                              const apiUrl = `https://${baseUrl}/attachfiles/${doc.attachment_id}?show_file=true`;

                              const response = await fetch(apiUrl, {
                                method: 'GET',
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  'Content-Type': 'application/json',
                                },
                              });

                              if (!response.ok) {
                                throw new Error('Failed to fetch the file');
                              }

                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);

                              if (isImage) {
                                setSelectedDoc({
                                  document_url: url,
                                  document_name: doc.document_name || `document_${doc.attachment_id}`,
                                  blob: blob
                                });
                                setIsModalOpen(true);
                              } else {
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = doc.document_name || `document_${doc.attachment_id}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              }
                            } catch (error) {
                              console.error('Error handling file:', error);
                            }
                          };

                          return (
                            <div
                              key={doc.id}
                              className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-white shadow-md"
                            >
                              {isImage ? (
                                <>
                                  <button
                                    className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                    title="View"
                                    onClick={handleFileAction}
                                    type="button"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <img
                                    src={doc.document_url}
                                    alt={doc.document_name}
                                    className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                    onClick={handleFileAction}
                                  />
                                </>
                              ) : isPdf ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              ) : isExcel ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                  <FileSpreadsheet className="w-6 h-6" />
                                </div>
                              ) : isWord ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              ) : (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              )}
                              <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                {doc.document_name || `Document_${doc.id}`}
                              </span>
                              {isDownloadable && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                  onClick={handleFileAction}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                      </div>
                    );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="w-full max-w-[90vw] sm:max-w-2xl">
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-black"
                      aria-label="Close"
                      onClick={() => {
                        setIsModalOpen(false);
                        if (selectedDoc?.document_url) {
                          window.URL.revokeObjectURL(selectedDoc.document_url);
                        }
                        setSelectedDoc(null);
                      }}
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <DialogHeader>
                      <DialogTitle className="text-center">{selectedDoc?.document_name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center gap-4">
                      {selectedDoc?.document_url && (
                        <img
                          src={selectedDoc.document_url}
                          alt={selectedDoc.document_name}
                          className="max-w-full max-h-[400px] rounded-md border"
                        />
                      )}
                      <Button
                        onClick={() => {
                          if (selectedDoc?.document_url) {
                            const link = document.createElement('a');
                            link.href = selectedDoc.document_url;
                            link.download = selectedDoc.document_name || 'document';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            setIsModalOpen(false);
                            window.URL.revokeObjectURL(selectedDoc.document_url);
                            setSelectedDoc(null);
                          }
                        }}
                      >
                        <Download className="mr-2 w-4 h-4" />
                        Download
                      </Button>
                      {selectedImage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                          <div className="bg-white rounded-lg p-4 max-w-sm w-full relative">
                            {/* Close Icon */}
                            <button
                              className="absolute top-2 right-2 text-gray-700 hover:text-black"
                              onClick={() => setSelectedImage(null)}
                            >
                              <X className="w-5 h-5" />
                            </button>

                            {/* Image */}
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="w-full h-auto object-contain rounded mb-4"
                            />

                            {/* Download Button */}
                            <a
                              href={selectedImage}
                              download
                              className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      )}

                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="p-3 sm:p-6" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
            <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
            }}>
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                    <Calendar className="w-5 h-5 text-[#C72030]" />
                  </div>
                  SCHEDULE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
                <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <Table>
                    <TableHeader style={{ position: 'sticky', top: 0, backgroundColor: '#F6F4EE', zIndex: 10 }}>
                      <TableRow className="bg-[#F6F4EE]">
                        <TableHead className="font-semibold text-[#1a1a1a]">Asset Period</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Visit No.</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Technician</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Remarks</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Attachment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {amcVisitData.length > 0 ? (
                        amcVisitData.map((visit: any, index: number) => {
                          const fileUrl = visit.attachment?.document || visit.attachment?.document_url;
                          const isImage = fileUrl && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(fileUrl);
                          const isPdf = fileUrl && /\.pdf$/i.test(fileUrl);
                          const isExcel = fileUrl && /\.(xls|xlsx|csv)$/i.test(fileUrl);
                          const isWord = fileUrl && /\.(doc|docx)$/i.test(fileUrl);
                          let icon: React.ReactNode = <FileText className="w-6 h-6 text-gray-600" />;
                          if (isPdf) icon = <FileText className="w-6 h-6 text-red-600" />;
                          else if (isExcel) icon = <FileSpreadsheet className="w-6 h-6 text-green-600" />;
                          else if (isWord) icon = <FileText className="w-6 h-6 text-blue-600" />;
                          return (
                            <TableRow key={visit.id || index} className="border-b border-gray-200">
                              <TableCell className="text-gray-600">{visit.asset_period || '—'}</TableCell>
                              <TableCell className="text-gray-600">{visit.visit_number || '—'}</TableCell>
                              <TableCell className="text-gray-600">{visit.technician ? visit.technician.name : '—'}</TableCell>
                              <TableCell className="text-gray-600">{visit.remarks || '—'}</TableCell>
                              <TableCell>
                                {fileUrl ? (
                                  isImage ? (
                                    <div className="flex relative flex-col items-center bg-[#F6F4EE] border rounded-lg p-2 w-[100px] shadow-sm">
                                      <img
                                        src={fileUrl}
                                        alt={visit.attachment?.document_name || 'Attachment'}
                                        className="w-16 h-16 object-cover rounded border cursor-pointer"
                                        onClick={() => setSelectedImage(fileUrl)}
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className="flex relative flex-col items-center bg-[#F6F4EE] border rounded-lg p-2 w-[100px] shadow-sm cursor-pointer hover:ring-1 hover:ring-[#C72030]"
                                      onClick={async () => {
                                        try {
                                          const attachmentId = visit.attachment?.id;
                                          const token = localStorage.getItem('token');
                                          const baseUrl = localStorage.getItem('baseUrl');
                                          if (attachmentId && token && baseUrl) {
                                            const apiUrl = `https://${baseUrl}/attachfiles/${attachmentId}?show_file=true`;
                                            const response = await fetch(apiUrl, {
                                              method: 'GET',
                                              headers: { Authorization: `Bearer ${token}` },
                                            });
                                            if (!response.ok) throw new Error('Download failed');
                                            const blob = await response.blob();
                                            const url = window.URL.createObjectURL(blob);
                                            const link = document.createElement('a');
                                            link.href = url;
                                            const originalName = visit.attachment?.document_name || 'file';
                                            link.download = originalName;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            window.URL.revokeObjectURL(url);
                                          } else {
                                            // Fallback: open direct URL if available
                                            window.open(fileUrl, '_blank');
                                          }
                                        } catch (e) {
                                          console.error('Attachment download error', e);
                                        }
                                      }}
                                      title="Download file"
                                    >
                                      <div className="w-16 h-16 flex items-center justify-center bg-white rounded border">
                                        {icon}
                                      </div>
                                      <span className="mt-1 text-[10px] text-center break-all px-1">
                                        {/* {(visit.attachment?.document_name || 'File').slice(0, 40)} */}
                                      </span>
                                      {/* <span className="absolute top-1 right-1 text-[9px] text-[#C72030] font-semibold">DL</span> */}
                                    </div>
                                  )
                                ) : (
                                  '—'
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow className="border-b border-gray-200">
                          <TableCell colSpan={5} className="text-center text-gray-600">
                            No AMC visit logs available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>

              {/* Modal */}
              {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                  <div className="bg-white rounded-lg p-4 max-w-sm w-full relative pt-8">
                    {/* Close Icon */}
                    <button
                      className="absolute top-2 right-2 text-gray-700 hover:text-black z-10"
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Image */}
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-auto object-contain rounded mb-4"
                    />

                    {/* Download Button with Loader */}
                    <button
                      className="block text-center bg-[#f6f4ee] text-[#c72030] py-2 rounded w-full flex items-center justify-center"
                      disabled={isDownloading}
                      onClick={async () => {
                        const visit = amcVisitData.find((v: any) => v.attachment?.document === selectedImage);
                        if (!visit?.attachment?.id) {
                          console.error('Attachment ID is undefined for selected image');
                          return;
                        }

                        setIsDownloading(true);
                        try {
                          const token = localStorage.getItem('token');
                          const baseUrl = localStorage.getItem('baseUrl');
                          if (!token || !baseUrl) {
                            console.error('Token or baseUrl not found in local storage');
                            return;
                          }

                          const apiUrl = `https://${baseUrl}/attachfiles/${visit.attachment.id}?show_file=true`;

                          const response = await fetch(apiUrl, {
                            method: 'GET',
                            headers: {
                              Authorization: `Bearer ${token}`,
                              'Content-Type': 'application/json',
                            },
                          });

                          if (!response.ok) {
                            throw new Error(`Failed to fetch the file: ${response.statusText}`);
                          }

                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `attachment_${visit.attachment.id}.png`; // Fallback name
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                          setSelectedImage(null); // Close modal after download
                        } catch (error) {
                          console.error('Error downloading file:', error);
                        } finally {
                          setIsDownloading(false);
                        }
                      }}
                    >
                      {isDownloading ? (
                        <span className="loader mr-2"></span>
                      ) : (
                        <Download className="mr-2 w-4 h-4" />
                      )}
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </button>
                    <style>{`
                  .loader {
                    border: 2px solid #c72030;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                  }
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Tickets */}
          <TabsContent value="tickets" className="p-3 sm:p-6" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
            <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
            }}>
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                    <Ticket className="w-5 h-5 text-[#C72030]" />
                  </div>
                  TICKETS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#EDEAE3]">
                        <TableHead className="font-semibold text-[#1a1a1a]">ID</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Title</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Category</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Updated By</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {ticketsLoading && (
                        <TableRow className="border-b border-gray-200">
                          <TableCell colSpan={6} className="text-center text-gray-600">Loading tickets...</TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading && ticketsError && (
                        <TableRow className="border-b border-gray-200">
                          <TableCell colSpan={6} className="text-center text-red-600">{ticketsError}</TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading && !ticketsError && tickets.length === 0 && (
                        <TableRow className="border-b border-gray-200">
                          <TableCell colSpan={6} className="text-center text-gray-600">No tickets found.</TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading && !ticketsError && tickets.length > 0 && tickets.map(t => (
                        <TableRow key={t.id} className="border-b border-gray-200">
                          <TableCell className="text-gray-900">{t.id}</TableCell>
                          <TableCell className="max-w-[360px] whitespace-normal break-words text-gray-900">{t.heading || '—'}</TableCell>
                          <TableCell className="text-gray-900">{t.category_type || '—'}</TableCell>
                          <TableCell>
                            {t.status ? (
                              <span className={`px-2 py-1 text-xs rounded ${
                                t.status.toLowerCase() === 'open' 
                                  ? 'bg-gray-200 text-gray-900' 
                                  : t.status.toLowerCase() === 'pending'
                                  ? 'bg-[#C72030] text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {t.status}
                              </span>
                            ) : '—'}
                          </TableCell>
                          <TableCell className="text-gray-900">{t.updated_by || '—'}</TableCell>
                          <TableCell className="text-gray-900">{t.created_at ? new Date(t.created_at).toLocaleDateString('en-GB') : '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Asset Information */}
          {amcDetails.amc_type === 'Asset' && (
            <TabsContent value="asset-information" className="p-3 sm:p-6">
              <Card className="border">
                <CardHeader >
                  <CardTitle className="text-lg flex items-center">
                    {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <Boxes className="h-4 w-4" />
                    </div> */}
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                      <Boxes className="w-5 h-5 text-[#C72030]" />
                    </div>
                    ASSET INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px]">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Asset ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Under Warranty</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amcDetails.amc_assets?.length > 0 ? (
                          amcDetails.amc_assets.map((asset) => (
                            <TableRow key={asset.id} className="bg-white">
                              <TableCell>
                                <a
                                  href={`/maintenance/asset/details/${asset.asset_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell>{asset.asset_id || '—'}</TableCell>
                              <TableCell>{asset.asset_name || '—'}</TableCell>
                              <TableCell>
                                {asset.warranty === true
                                  ? 'Yes'
                                  : asset.warranty === false
                                    ? 'No'
                                    : 'NA'}
                              </TableCell>                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${asset.asset_status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                  {asset.asset_status?.replace('_', ' ') || '—'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                              No assets found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {amcDetails.amc_type === 'Service' && (
            <TabsContent value="asset-information" className="p-3 sm:p-6">
              <Card className="border">
                <CardHeader >
                  <CardTitle className="text-lg flex items-center">
                    {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <Boxes className="h-4 w-4" />
                    </div> */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                      <Boxes className="w-5 h-5 text-[#C72030]" />
                    </div>
                    SERVICE INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px]">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Service ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Group ID</TableHead>
                          <TableHead>Sub Group ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amcDetails.amc_services?.length > 0 ? (
                          amcDetails.amc_services.map((svc) => (
                            <TableRow key={svc.id} className="bg-white">
                              <TableCell>
                                <a
                                  href={`/maintenance/service/details/${svc.service_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell>{svc.service_id || '—'}</TableCell>
                              <TableCell>{svc.service_name || '—'}</TableCell>
                              <TableCell>{svc.sset_code || svc.asset_code || '—'}</TableCell>
                              <TableCell>{svc.group_id ?? '—'}</TableCell>
                              <TableCell>{svc.sub_group_id ?? '—'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                              No services found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Association */}
          <TabsContent value="association" className="p-3 sm:p-6" style={{ backgroundColor: 'rgba(250, 250, 250, 1)' }}>
            <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
              borderRadius: '4px',
              background: '#FFF',
              boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
            }}>
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="#C72030" strokeWidth="1.5"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="#C72030" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  ASSET / SERVICE
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#EDEAE3]">
                        {amcDetails.amc_type === 'Service' ? (
                          <>
                            <TableHead className="font-semibold text-[#1a1a1a]">Action</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Service ID</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Name</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Group</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Sub Group</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead className="font-semibold text-[#1a1a1a]">Action</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">ID</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Name</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Under Warranty</TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {amcDetails.amc_type === 'Service' ? (
                        amcDetails.amc_services?.length > 0 ? (
                          amcDetails.amc_services.map((service) => (
                            <TableRow key={service.id} className="border-b border-gray-200">
                              <TableCell>
                                <a
                                  href={`/maintenance/service/details/${service.service_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell className="text-gray-900">{service.service_id || '—'}</TableCell>
                              <TableCell className="text-gray-900">{service.service_name || '—'}</TableCell>
                              <TableCell className="text-gray-900">{service.group_name || '—'}</TableCell>
                              <TableCell className="text-gray-900">{service.sub_group_name || '—'}</TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    service.status === 'Active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {service.status || '—'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="border-b border-gray-200">
                            <TableCell colSpan={6} className="text-center text-sm text-gray-500">
                              No services found
                            </TableCell>
                          </TableRow>
                        )
                      ) : (
                        amcDetails.amc_assets?.length > 0 ? (
                          amcDetails.amc_assets.map((asset) => (
                            <TableRow key={asset.id} className="border-b border-gray-200">
                              <TableCell>
                                <a
                                  href={`/maintenance/asset/details/${asset.asset_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell className="text-gray-900">{asset.asset_id || '—'}</TableCell>
                              <TableCell className="text-gray-900">{asset.asset_name || '—'}</TableCell>
                              <TableCell className="text-gray-900">
                                {asset.warranty === true
                                  ? 'Yes'
                                  : asset.warranty === false
                                    ? 'No'
                                    : '—'}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    asset.asset_status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {asset.asset_status?.replace('_', ' ') || '—'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="border-b border-gray-200">
                            <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                              No assets found
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>

      <AddVisitModal
        isOpen={showAddVisitModal}
        onClose={hanldeClose}
        amcId={amcDetails?.id?.toString() || id || ''}
      />
    </div>
  );
};