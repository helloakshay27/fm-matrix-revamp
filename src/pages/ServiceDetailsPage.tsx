import React, { useState, useEffect } from 'react';
import qrCodePlaceholder from '@/assets/qr-code-placeholder.png';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Settings,
  FileText,
  QrCode,
  Box,
  Download,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AssociateServiceModal } from '@/components/AssociateServiceModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchServiceDetails } from '@/store/slices/serviceDetailsSlice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

interface ServiceDetailsData {
  id: number;
  service_name: string;
  service_code: string;
  site: string | null;
  building: string | null;
  wing: string | null;
  area: string | null;
  floor: string | null;
  room: string | null;
  created_at: string;
  created_by: string | null;
  documents?: Array<{ id?: string; filename: string; url: string; document: string; doctype: string }>;
  qr_code?: string | null;
  group_id?: string;
  document_type?: string;
  document: string;
  qr_code_id?: number;
}

interface AssetNode {
  id: string;
  name: string;
  type?: string;
  breakdown?: boolean;
  children: AssetNode[];
}

export const ServiceDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { data: serviceData, loading, error } = useAppSelector((state) => state.serviceDetails);
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<{ id: string; name: string } | null>(null);
  const [assetHierarchy, setAssetHierarchy] = useState<AssetNode | null>(null);
  const [downloadingQR, setDownloadingQR] = useState(false);

  // Fetch service details and asset hierarchy
  useEffect(() => {
    if (id) {
      dispatch(fetchServiceDetails(id));
      fetchAssetHierarchy();
    }
  }, [dispatch, id]);

  // Fetch asset hierarchy
  const fetchAssetHierarchy = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    if (!baseUrl || !token || !id) {
      toast({
        title: 'Error',
        description: 'Missing base URL, token, or service ID',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await axios.get(
        `https://${baseUrl}/pms/services/${id}/hierarchy.json`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Hierarchy API response:', response.data);
      setAssetHierarchy(response.data || null);
    } catch (error) {
      console.error('Failed to fetch asset hierarchy:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch asset hierarchy',
        variant: 'destructive',
      });
      setAssetHierarchy(null);
    }
  };

  // Fetch hierarchy after modal closes
  const handleModalClose = () => {
    setShowAssociateModal(false);
    if (id) {
      dispatch(fetchServiceDetails(id)); // Refresh service details
      fetchAssetHierarchy(); // Fetch updated hierarchy
    }
  };

  // Format date helper
  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  // Render asset node recursively
  const renderAssetNode = (node: AssetNode, level: number = 0) => {
    const isBreakdown = level === 0 ? true : node.breakdown === true; // Force red for root node


    return (
      <div key={node.id} className="flex flex-col items-center relative w-full">
        <div className="flex flex-col items-center w-full">
          <div
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer 
              min-w-[150px] max-w-[200px] w-full text-center transition-all
              ${isBreakdown
                ? 'bg-red-500 text-white shadow-red-200'
                : 'bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-xl'
              } border border-gray-200 shadow-lg
            `}
            onClick={() => openModal(node.id, node.name)}
          >
            <span className="font-semibold text-sm break-words">{node.name ?? ''}</span>
          </div>

          {node.children && node.children.length > 0 && (
            <div className="w-0.5 h-4 bg-gray-300" />
          )}
        </div>

        {node.children && node.children.length > 0 && (
          <div className="relative w-full">
            <div className="w-full h-0.5 bg-gray-300" /> {/* Horizontal line spanning the grid */}
            <div className="flex flex-col items-center mt-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 justify-center w-full">
                {node.children.map((child, index) => (
                  <div key={child.id} className="flex flex-col items-center relative">
                    {renderAssetNode(child, level + 1)}
                    {index < node.children.length - 1 && (
                      <div className="w-0.5 h-4 bg-gray-300 mx-auto mt-2" />
                    )}
                    {child.children && child.children.length > 0 && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0.5 h-4 bg-gray-300" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Updated "Associated Assets" Tab Content
  <TabsContent value="associated-assets" className="p-4 sm:p-6">
    <div className="border border-[#D9D9D9] bg-[#F6F7F7] rounded-lg">
      <div className="flex items-center mb-2 bg-[#F6F4EE] p-4">
        <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
          <Box className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-[700]">ASSOCIATED ASSETS</h2>
      </div>
      <div className="p-4 max-w-4xl mx-auto overflow-x-auto">
        {assetHierarchy ? (
          <div className="flex flex-col items-center w-full">
            {renderAssetNode(assetHierarchy)}
          </div>
        ) : (
          <div className="text-sm text-gray-600">No associated assets</div>
        )}
      </div>
    </div>
  </TabsContent>

  // Modal open/close handlers
  const openModal = (assetId: string, assetName: string) => {
    setSelectedAsset({ id: assetId, name: assetName });
  };

  const closeModal = () => {
    setSelectedAsset(null);
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading service details...</div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Use serviceData directly
  const details = serviceData as ServiceDetailsData;

  if (!details) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">No service details found</div>
        </div>
      </div>
    );
  }


  const handleEditClick = () => navigate(`/maintenance/service/edit/${id}`);
  const handleAssociateServiceClick = () => setShowAssociateModal(true);

  return (
    <div className="p-4 sm:p-6">
      {/* Service Title */}
      {/* Top Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/maintenance/service')}
            className="w-max pl-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Service List
          </Button>
          <div className="mb-3">
            <h1 className="text-2xl font-bold text-[#1a1a1a] truncate">{details.service_name || 'Service Details'}</h1>
          </div>
        </div>
       <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
            Edit
          </Button>
          <Button
            onClick={handleAssociateServiceClick}
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
          >
            <Settings className="w-4 h-4 mr-2" />
            Associate Service
          </Button>
        </div>
      </div>

      {/* Tab Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="location-detail" className="w-full">
          <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm">
            <TabsTrigger
              value="location-detail"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              LOCATION DETAIL
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              DOCUMENTS
            </TabsTrigger>
            <TabsTrigger
              value="qr-code"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              QR CODE
            </TabsTrigger>
            <TabsTrigger
              value="associated-assets"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              Associated Assets
            </TabsTrigger>
          </TabsList>

          {/* LOCATION DETAIL */}
          <TabsContent value="location-detail" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">LOCATION DETAIL</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6">
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Site</span>
                    <span>: {details.site || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Wing</span>
                    <span>: {details.wing || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Area</span>
                    <span>: {details.area || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Created On</span>
                    <span>: {formatDateTime(details.created_at)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Building</span>
                    <span>: {details.building || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Floor</span>
                    <span>: {details.floor || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Room</span>
                    <span>: {details.room || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Created By</span>
                    <span>: {details.created_by || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* DOCUMENTS */}
          <TabsContent value="documents" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border">
              <div className="flex items-center bg-[#F6F4EE] p-4">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">DOCUMENTS</h2>
              </div>
              <div className="border border-[#D9D9D9] bg-[#F6F7F7]">
                {details?.documents?.length ? (
                  details.documents.map((doc) => (
                    <div
                      key={doc.id || doc.filename}
                      className="flex items-center justify-between p-3 rounded gap-4"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        {doc.doctype.startsWith('image/') ? (
                          <img
                            src={doc.document}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-white border rounded text-gray-500 text-xl">
                            📄
                          </div>
                        )}
                        <span className="text-sm truncate max-w-[180px]">
                          {`Document_${doc.id || doc.filename}.${doc.doctype.split('/')[1] || 'file'}`}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                        onClick={async () => {
                          if (!doc?.id) {
                            console.error('Attachment ID is undefined', doc);
                            const link = document.createElement('a');
                            link.href = doc.document;
                            link.download = `Document_${doc.id || doc.filename || 'unknown'}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            return;
                          }

                          try {
                            const token = localStorage.getItem('token');
                            const baseUrl = localStorage.getItem('baseUrl');
                            if (!token) {
                              console.error('No token found in localStorage');
                              return;
                            }

                            const apiUrl = `https://${baseUrl}/attachfiles/${doc.id}?show_file=true`;

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
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `Document_${doc.id}`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(url);
                          } catch (error) {
                            console.error('Error downloading file:', error);
                            const fallbackLink = document.createElement('a');
                            fallbackLink.href = doc.document;
                            fallbackLink.download = `Document_${doc.id || doc.filename || 'unknown'}`;
                            document.body.appendChild(fallbackLink);
                            fallbackLink.click();
                            document.body.removeChild(fallbackLink);
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-600">No documents available</div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* QR CODE */}
          <TabsContent value="qr-code" className="p-4 sm:p-6">
            <div className="border border-[#D9D9D9] bg-[#F6F7F7] rounded-lg">
              <div className="flex items-center mb-4 bg-[#F6F4EE] p-4">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <QrCode className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">QR CODE</h2>
              </div>
              <div className="text-center">
                {details.qr_code ? (
                  <>
                    <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                      <img
                        id="qrImage"
                        src={details.qr_code}
                        alt="QR Code"
                        className="w-40 h-40 object-contain"
                      />
                    </div>
                    <Button
                      onClick={async () => {
                        if (downloadingQR) return;
                        setDownloadingQR(true);
                        try {
                          if (!details?.id) {
                            console.error('Service ID is undefined', details);
                            return;
                          }
                          const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
                          const token = localStorage.getItem('token');
                          const apiUrl = `https://${baseUrl}/pms/services/service_qr_codes.pdf?service_ids=${details.id}`;
                          const response = await fetch(apiUrl, {
                            method: 'GET',
                            headers: token ? { Authorization: `Bearer ${token}` } : {},
                          });
                          if (!response.ok) {
                            throw new Error('Failed to fetch the QR PDF');
                          }
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `Service_QR_${details.id}.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error('Error downloading QR PDF:', error);
                        } finally {
                          setDownloadingQR(false);
                        }
                      }}
                      className="bg-[#C72030] mb-4 text-white hover:bg-[#C72030]/90"
                      disabled={downloadingQR}
                    >
                      {downloadingQR ? (
                        <svg className="animate-spin h-4 w-4 mr-2 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      ) : (
                        <Download className="w-4 h-4 mr-1" />
                      )}
                      {downloadingQR ? 'Downloading...' : 'Download QR'}
                    </Button>

                  </>
                ) : (
                  <div className="text-sm text-gray-600">No QR code available</div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* ASSOCIATED ASSETS */}
          <TabsContent value="associated-assets" className="p-4 sm:p-6">
            <div className="border border-[#D9D9D9] bg-[#F6F7F7] rounded-lg">
              <div className="flex items-center mb-2 bg-[#F6F4EE] p-4">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">ASSOCIATED ASSETS</h2>
              </div>
              <div className="p-4 max-w-5xl mx-auto overflow-x-auto">
                {assetHierarchy ? (
                  <div className="flex flex-col items-center w-full">
                    {renderAssetNode(assetHierarchy)}
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">No associated assets</div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Associate Service Modal */}
      <AssociateServiceModal
        isOpen={showAssociateModal}
        onClose={handleModalClose}
        serviceId={id || ''}
        assetGroupId={details.group_id || ''}
      />
    </div>
  );
};