import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Download, Truck, Boxes, FileTextIcon, Paperclip, FileText, FileSpreadsheet, X, Ticket } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddVisitModal } from '@/components/AddVisitModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye } from 'lucide-react';


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
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading AMC details...</div>
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

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="amc-information" className="w-full">
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            {[
              { label: 'AMC Information', value: 'amc-information' },
              { label: 'Supplier Information', value: 'supplier-information' },
              { label: 'Attachments', value: 'attachments' },
              { label: 'AMC Visits', value: 'amc-visits' },
              { label: 'Tickets', value: 'tickets' },
              {
                label: amcDetails.amc_type === "Service" ? "Service Information" : "Asset Information",
                value: "asset-information",
              },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0 text-sm"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* AMC Information */}
          <TabsContent value="amc-information" className="p-3 sm:p-6">
            <Card className="border ">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                    <FileTextIcon className="w-5 h-5 text-[#C72030]" />
                  </div>
                  {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <FileTextIcon className="h-4 w-4" />
                  </div> */}
                  AMC INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className='bg-white text-[15px]'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex text-[15px]">
                    <span className="text-gray-500 w-24">ID</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcDetails.id}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Cost</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{formatCurrency(amcDetails.amc_cost)}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Start Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{formatDate(amcDetails.amc_start_date)}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">End Date</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{formatDate(amcDetails.amc_end_date)}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">First Service</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{formatDate(amcDetails.amc_first_service)}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">No. of Visits</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcDetails.no_of_visits || '—'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Payment Terms</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{formatPaymentTerm(amcDetails.payment_term)}</span>
                  </div>
                  <div className="md:col-span-2 flex">
                    <span className="text-gray-500 w-24">Remarks</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcDetails.remarks || '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplier Information */}
          <TabsContent value="supplier-information" className="p-3 sm:p-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                    <Truck className="w-5 h-5 text-[#C72030]" />
                  </div>
                  {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Truck className="h-4 w-4" />
                  </div> */}
                  SUPPLIER INFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[15px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex">
                    <span className="text-gray-500 w-24">Name</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcDetails.amc_vendor_name || '—'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Email</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcDetails.amc_vendor_email || '—'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Mobile1</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcDetails.amc_vendor_mobile || '—'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Mobile2</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">—</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-24">Company name</span>
                    <span className="text-gray-500 mx-2">:</span>
                    <span className="text-gray-900 font-medium">{amcDetails.amc_vendor_name || '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments */}
          <TabsContent value="attachments" className="p-3 sm:p-6">
            <Card className="border">
              <CardHeader >
                <CardTitle className="text-lg flex items-center">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                    <Paperclip className="w-5 h-5 text-[#C72030]" />
                  </div>
                  {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <Paperclip className="h-4 w-4" />
                  </div> */}
                  ATTACHMENTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-[15px]">
                <div className="flex flex-wrap gap-6">
                  {['amc_contracts', 'amc_invoices'].map((sectionKey) => {
                    const sectionTitle = sectionKey === 'amc_contracts' ? 'AMC Contract:' : 'AMC Invoice:';
                    const sectionData = (amcData as any)?.[sectionKey] || [];

                    return (
                      <div key={sectionKey} className="flex-1 min-w-[280px] max-w-full bg-white rounded-md shadow px-6 py-4">
                        <h2 className="font-semibold text-base mb-4">{sectionTitle}</h2>
                        <div className="flex flex-wrap gap-4">
                          {sectionData?.flatMap((item: any) =>
                            item.documents?.map((doc: any) => {
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
                                  className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                                >
                                  {isImage ? (
                                    <>
                                      {/* Eye icon absolutely at top right, above image */}
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
                            }) ?? []
                          )}
                          {!sectionData?.length && (
                            <div className="p-2 text-gray-500 text-sm">
                              No {sectionTitle.toLowerCase()} attachments available.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
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

          {/* AMC Visits */}
          <TabsContent value="amc-visits" className="p-3 sm:p-6">
            <Card className="border">
              <CardHeader >
                <CardTitle className="text-lg flex items-center">
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                    <FileTextIcon className="w-5 h-5 text-[#C72030]" />
                  </div>
                  AMC VISITS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[15px]">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Period</TableHead>
                        <TableHead>Visit No</TableHead>
                        <TableHead>Visit Date</TableHead>
                        <TableHead>Technician</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Attachment</TableHead>
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
                            <TableRow key={visit.id || index}>
                              <TableCell>{visit.asset_period}</TableCell>
                              <TableCell>{visit.visit_number}</TableCell>
                              <TableCell>{new Date(visit.visit_date).toLocaleDateString()}</TableCell>
                              <TableCell>{visit.technician ? visit.technician.name : 'Not Assigned'}</TableCell>
                              <TableCell>{visit.remarks || '—'}</TableCell>
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
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-600">
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
          <TabsContent value="tickets" className="p-3 sm:p-6">
            <Card className="border">
              <CardHeader className="">
                <CardTitle className="text-lg flex items-center">
                  {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                    <FileTextIcon className="h-4 w-4" />
                  </div> */}
                  <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                    <Ticket className="w-5 h-5 text-[#C72030]" />
                  </div>
                  TICKETS
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[15px]">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#F6F4EE]">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Category</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Updated By</TableHead>
                        <TableHead className="font-semibold">Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {ticketsLoading && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-600">Loading tickets...</TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading && ticketsError && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-red-600">{ticketsError}</TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading && !ticketsError && tickets.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-gray-600">No tickets found.</TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading && !ticketsError && tickets.length > 0 && tickets.map(t => (
                        <TableRow key={t.id} className="hover:bg-[#f6f4ee] transition-colors">
                          <TableCell>{t.id}</TableCell>
                          <TableCell className="max-w-[360px] whitespace-normal break-words">{t.heading || '—'}</TableCell>
                          <TableCell>{t.category_type || '—'}</TableCell>
                          <TableCell>
                            {t.status ? (
                              <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">{t.status}</span>
                            ) : '—'}
                          </TableCell>
                          <TableCell>{t.updated_by || '—'}</TableCell>
                          <TableCell>{t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}</TableCell>
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