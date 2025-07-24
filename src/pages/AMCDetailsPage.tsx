import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Download, Truck, Boxes, Wrench, History, FileTextIcon, Paperclip, FileText, FileSpreadsheet, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddVisitModal } from '@/components/AddVisitModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


interface AMCDetailsData {
  id: number;
  asset_id: number | null;
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
}

interface AMCDetailsDataWithVisits extends AMCDetailsData {
  amc_visit_logs: AmcVisitLog[];
}


export const AMCDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: amcData, loading, error } = useAppSelector(
    (state) => state.amcDetails as { data: AMCDetailsDataWithVisits; loading: boolean; error: any }
  ); const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const amcDetails: AMCDetailsData | null = amcData as AMCDetailsData;
  const amcVisitData = amcData?.amc_visit_logs?.map((visit) => visit) ?? [];
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


  useEffect(() => {
    if (id) {
      dispatch(fetchAMCDetails(id));
    }
  }, [dispatch, id]);

  // Helper functions for formatting data
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
    return `₹${amount}`;
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading AMC details...</div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Extract data from API response

  const hanldeClose = () => {
    setShowAddVisitModal(false);
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


  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/maintenance/amc')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AMC Details - {amcDetails.id}</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowAddVisitModal(true)}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              + Add Visit
            </Button>
            <Button
              onClick={() => navigate(`/maintenance/amc/edit/${id}`)}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-6'>
          <CardTitle className="text-lg flex items-center ">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
              <Truck className="h-4 w-4" />
            </div>
            SUPPLIER INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Name:</strong> {amcDetails.amc_vendor_name || '—'}</div>
            <div><strong>Email:</strong> {amcDetails.amc_vendor_email || '—'}</div>
            <div><strong>Mobile1:</strong> {amcDetails.amc_vendor_mobile || '—'}</div>
            <div><strong>Mobile2:</strong> —</div>
            <div><strong>Company name:</strong> {amcDetails.amc_vendor_name || '—'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Information */}
      <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-6'>
          <CardTitle className="text-lg flex items-center">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
              <Boxes className="h-4 w-4" />
            </div>            ASSET INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Under Warranty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className='bg-white'>
                <TableCell>{amcDetails.asset_id ? `Asset ${amcDetails.asset_id}` : '—'}</TableCell>
                <TableCell>—</TableCell>
                <TableCell>No</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded ${amcDetails.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {amcDetails.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AMC Information */}
      <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-6'>
          <CardTitle className="text-lg flex items-center">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
              <FileTextIcon className="h-4 w-4" />
            </div>            AMC INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>ID:</strong> {amcDetails.id}</div>
            <div><strong>Cost:</strong> {formatCurrency(amcDetails.amc_cost)}</div>
            <div><strong>Start Date:</strong> {formatDate(amcDetails.amc_start_date)}</div>
            <div><strong>End Date:</strong> {formatDate(amcDetails.amc_end_date)}</div>
            <div><strong>First Service:</strong> {formatDate(amcDetails.amc_first_service)}</div>
            <div><strong>No. of Visits:</strong> {amcDetails.no_of_visits || '—'}</div>
            <div><strong>Payment Terms:</strong> {amcDetails.payment_term || '—'}</div>
            <div className="md:col-span-2"><strong>Remarks:</strong> {amcDetails.remarks || '—'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      {/* Attachments */}
      <Card className="mb-6 border border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className="bg-[#F6F4EE] mb-4">
          <CardTitle className="text-lg flex items-center">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
              <Paperclip className="h-4 w-4" />
            </div>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-6">
            {['amc_contracts', 'amc_invoices'].map((sectionKey) => {
              const sectionTitle = sectionKey === 'amc_contracts' ? 'AMC Contract:' : 'AMC Invoice:';
              const sectionData = (amcData as any)?.[sectionKey] || [];

              return (
                <div key={sectionKey} className="flex-1 min-w-[300px] bg-white rounded-md shadow px-6 py-4">
                  <h2 className="font-semibold text-base mb-4">{sectionTitle}</h2>
                  <div className="flex flex-wrap gap-4">
                    {sectionData?.flatMap((item: any) =>
                      item.documents?.map((doc: any) => {
                        const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.document_url);
                        const isPdf = /\.pdf$/i.test(doc.document_url);
                        const isExcel = /\.(xls|xlsx|csv)$/i.test(doc.document_url);

                        return (
                          <div
                            key={doc.id}
                            className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-[150px] bg-[#F6F4EE] shadow-md"
                          >
                            {/* Preview */}
                            {isImage ? (
                              <img
                                src={doc.document_url}
                                alt={doc.document_name}
                                className="w-14 h-14 object-cover rounded-md border mb-2"
                              />
                            ) : isPdf ? (
                              <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                <FileText className="w-6 h-6" />
                              </div>
                            ) : isExcel ? (
                              <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                <FileSpreadsheet className="w-6 h-6" />
                              </div>
                            ) : (
                              <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                <FileText className="w-6 h-6" />
                              </div>
                            )}

                            {/* File Name */}
                            <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                              {doc.document_name || `Document_${doc.id}`}
                            </span>

                            {/* Download / Open Modal */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                              onClick={() => {
                                if (isExcel) {
                                  // Direct download for Excel
                                  const link = document.createElement('a');
                                  link.href = doc.document_url;
                                  link.download = doc.document_name || 'document';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                } else {
                                  // Open modal for PDF/Image
                                  setSelectedDoc(doc);
                                  setIsModalOpen(true);
                                }
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
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

          {/* Modal for PDF and Images */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-2xl">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
              <DialogHeader>
                <DialogTitle className="text-center">{selectedDoc?.document_name}</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col items-center justify-center gap-4">
                {selectedDoc?.document_url &&
                  /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(selectedDoc.document_url) ? (
                  <img
                    src={selectedDoc.document_url}
                    alt={selectedDoc.document_name}
                    className="max-w-full max-h-[400px] rounded-md border"
                  />
                ) : selectedDoc?.document_url && /\.pdf$/i.test(selectedDoc.document_url) ? (
                  <iframe
                    src={selectedDoc.document_url}
                    className="w-full h-[500px] rounded border"
                    title={selectedDoc.document_name}
                  ></iframe>
                ) : null}

                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedDoc?.document_url;
                    link.download = selectedDoc?.document_name || 'document';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setIsModalOpen(false);
                  }}
                >
                  <Download className="mr-2 w-4 h-4" />
                  Download
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>

      </Card>



      {/* AMC Data Logs */}
      <Card className='border border-[#D9D9D9] bg-[#F6F7F7]'>
        <CardHeader className='bg-[#F6F4EE] mb-6 '>
          <CardTitle className="text-lg flex items-center">
            <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
              <FileTextIcon className="h-4 w-4" />
            </div>                  AMC DATA LOGS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Period</TableHead>
                <TableHead>Visit No</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead>Technician</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='bg-white'>
              {amcVisitData.length > 0 ? (
                amcVisitData.map((visit: any, index: number) => (
                  <TableRow key={visit.id || index} >
                    <TableCell>{visit.asset_period}</TableCell>
                    <TableCell>{visit.visit_number}</TableCell>
                    <TableCell>
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {visit.technician ? visit.technician.name : "Not Assigned"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-600">
                    No AMC visit logs available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


      <AddVisitModal
        isOpen={showAddVisitModal}
        onClose={hanldeClose}
        amcId={amcDetails?.id?.toString() || id || ''}
      />
    </div>
  );
};