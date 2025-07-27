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
  documents?: Array<{ filename: string; url: string }>;
  qr_code?: string | null;
  associated_assets?: Array<{ name: string; tag: string }>;
}

export const ServiceDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: serviceData, loading, error } = useAppSelector((state) => state.serviceDetails);
  const [showAssociateModal, setShowAssociateModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceDetails(id));
    }
  }, [dispatch, id]);

  // Helper function for formatting date
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

  // Extract data from API response
  const details: ServiceDetailsData | null = serviceData as ServiceDetailsData;
  console.log(details);

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
      {/* Top Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/maintenance/service')}
          className="w-max"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service List
        </Button>

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

      {/* Tab Section with Matching UI */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="location-detail" className="w-full">
          <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm"
          >
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
                {details?.documents?.map((doc: any) => (
                  <div
                    key={doc.id}
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
                        {`Document_${doc.id}.${doc.doctype.split('/')[1] || 'file'}`}
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
                          link.download = `Document_${doc.id || 'unknown'}`;
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
                          link.download = `Document_${doc.id}`; // Use id-based name or adjust as needed
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        } catch (error) {
                          console.error('Error downloading file:', error);
                          // Fallback to direct download on error
                          const fallbackLink = document.createElement('a');
                          fallbackLink.href = doc.document;
                          fallbackLink.download = `Document_${doc.id || 'unknown'}`;
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
                ))}
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
                      onClick={() => {
                        const imgElement = document.getElementById('qrImage') as HTMLImageElement;
                        if (!imgElement) return alert('QR image not found.');

                        const imageURL = imgElement.src;

                        window.open(imageURL, '_blank');
                      }}
                      className="bg-[#C72030] mb-4 text-white hover:bg-[#C72030]/90"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
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
              <div className="flex flex-wrap gap-2 p-4">
                {details.associated_assets?.length > 0 ? (
                  details.associated_assets.map((asset: any, index: number) => (
                    <Button
                      key={index}
                      className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                    >
                      {asset.name || asset.tag}
                    </Button>
                  ))
                ) : (
                  <div className="text-sm text-gray-600">—</div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Associate Service Modal */}
      <AssociateServiceModal
        isOpen={showAssociateModal}
        onClose={() => setShowAssociateModal(false)}
      />
    </div >
  );
};