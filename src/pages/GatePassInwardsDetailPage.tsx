import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, FileText, QrCode, Box, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_CONFIG } from '@/config/apiConfig';
import { AttachmentGoodsPreviewModal } from '@/components/AttachmentGoodsPreviewModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';


export const GatePassInwardsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gatePassData, setGatePassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Attachment/receive modal state
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [receivedItems, setReceivedItems] = useState<number[]>([]);
  // Receive state for modal
  const [handoverTo, setHandoverTo] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_CONFIG.BASE_URL}/gate_passes/${id}.json`, {
      headers: {
        'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        setGatePassData(data.gate_pass || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);


  // Defensive fallback for missing fields
  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }
  if (!gatePassData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Entry Not Found</h1>
          <Button onClick={() => navigate('/security/gate-pass/inwards')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inward List
          </Button>
        </div>
      </div>
    );
  }

  // Use gatePassData for details/profile
  const selectedEntry = gatePassData;

  // Defensive fallback for missing fields
  const personName = selectedEntry.created_by_name || selectedEntry.contact_person || '--';
  const category = selectedEntry.gate_pass_type_name || selectedEntry.gate_pass_category || '--';
  const companyName = (selectedEntry.company && selectedEntry.company.name) || '--';
  const siteName = (selectedEntry.site && selectedEntry.site.name) || '--';
  const buildingName = (selectedEntry.building && selectedEntry.building.name) || '--';
  const vehicleNo = selectedEntry.vehicle_no || '--';
  const status = selectedEntry.status || '--';
  const expectedReturnDate = selectedEntry.expected_return_date || '--';
  const gatePassNo = selectedEntry.gate_pass_no || selectedEntry.id;
  const passDate = selectedEntry.gate_pass_date ? new Date(selectedEntry.gate_pass_date).toLocaleString() : '--';


  // Prepare itemsData from gate_pass_materials, with per-item attachments
  const itemsData = (gatePassData.gate_pass_materials || []).map((mat: any, idx: number) => {
    return {
      sNo: String(idx + 1).padStart(2, '0'),
      itemName: mat.material_type || '--',
      itemCategory: mat.item_category || '--',
      itemNameDetail: mat.material || mat.other_material_name || '--',
      unit: mat.unit || '--',
      quantity: mat.gate_pass_qty ?? '--',
      description: mat.other_material_description || mat.remarks || '--',
      attachment: (
        <button
          className="text-blue-600 underline hover:text-blue-800 font-medium"
          style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          onClick={() => {
            const attachmentsToShow = (mat.attachments && mat.attachments.length > 0)
              ? mat.attachments
              : gatePassData.attachments;
            setSelectedAttachment({
              attachments: attachmentsToShow || [],
              itemIndex: idx,
              itemName: mat.material || mat.other_material_name || '--',
              received: !!mat.recieved_date,
            });
            setIsAttachmentModalOpen(true);
          }}
        >
          View Attachments
        </button>
      ),
      updates: (!mat.recieved_date || mat.recieved_date === '' || mat.recieved_date === null) ? (
        <Button size="sm" variant="outline" onClick={() => {
          const attachmentsToShow = (mat.attachments && mat.attachments.length > 0)
            ? mat.attachments
            : gatePassData.attachments;
          setSelectedAttachment({
            attachments: attachmentsToShow || [],
            itemIndex: idx,
            itemName: mat.material || mat.other_material_name || '--',
            received: !!mat.recieved_date,
          });
          setIsAttachmentModalOpen(true);
        }}>
          Receive
        </Button>
      ) : (
        <span className="text-green-600 text-xs">Received</span>
      ),
    };
  });

  console.log(gatePassData.attachments.map);
  

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/security/gate-pass/inwards')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inward List
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Gate Pass Inward Details</h1>
      </div>


      <div className=" bg-white rounded-lg border border-gray-200 shadow-sm w-full">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm ">
            <TabsTrigger
              value="profile"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              PROFILE
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              DETAILS
            </TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">PROFILE</h2>
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                {/* Profile Section */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-600 font-bold text-xl">{personName && typeof personName === 'string' ? personName.charAt(0).toUpperCase() : '-'}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{personName}</h2>
                  <p className="text-sm text-gray-600">{category}</p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Employee/Visitor Name:</span>
                    <span className="text-sm text-gray-900">{selectedEntry?.contact_person || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Visitor Mobile No.:</span>
                    <span className="text-sm text-gray-900">{selectedEntry.contact_person_no || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Company Name:</span>
                    <span className="text-sm text-gray-900">{gatePassData?.vendor_company_name || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Gate Number:</span>
                    <span className="text-sm text-gray-900">{gatePassData.gate_number || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Gate Pass Type:</span>
                    <span className="text-sm text-gray-900">{gatePassData.gate_pass_type_name || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Gate Pass No:</span>
                    <span className="text-sm text-gray-900">{gatePassData.gate_pass_no || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Gate Pass Date:</span>
                    <span className="text-sm text-gray-900">{selectedEntry.gate_pass_date ? new Date(selectedEntry.gate_pass_date).toLocaleDateString() : '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Reporting Time:</span>
                    <span className="text-sm text-gray-900">{selectedEntry.due_at ? new Date(selectedEntry.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Vendor:</span>
                    <span className="text-sm text-gray-900">{gatePassData.supplier_name || '--'}</span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className="text-sm font-medium text-gray-700">Mode Of Transport:</span>
                    <span className={`text-sm text-gray-900`} style={{textTransform: 'capitalize'}}>{gatePassData.mode_of_transport || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Vehicle Number:</span>
                    <span className="text-sm text-gray-900">{vehicleNo}</span>
                  </div>
                  
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Details */}
          <TabsContent value="details" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">ITEM DETAILS</h2>
              </div>
              <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sr No.</TableHead>
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item category</TableHead>
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</TableHead>
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</TableHead>
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</TableHead>
                      <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700 sticky right-0 bg-white z-10">Attachment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsData.map((item, index) => (
                      <TableRow key={item.sNo} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.sNo}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemName}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemCategory == '-1' ? 'Other' : item.itemCategory}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemNameDetail}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.unit}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.quantity}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.description}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900 sticky right-0 bg-white z-10">{item.attachment}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              <div className="border border-[#D9D9D9] bg-[#F6F7F7] p-3 text-sm text-gray-600">
                No documents available
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
              <div className="text-center p-3 text-sm text-gray-600">
                No QR code available
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
              <div className="p-4 max-w-5xl mx-auto overflow-x-auto text-sm text-gray-600">
                No associated assets
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Attachment Preview Modal */}
      <AttachmentGoodsPreviewModal
        isModalOpen={isAttachmentModalOpen}
        setIsModalOpen={setIsAttachmentModalOpen}
        selectedDoc={selectedAttachment}
        setSelectedDoc={setSelectedAttachment}
        toReceive={(() => {
          if (!selectedAttachment || selectedAttachment.itemIndex === undefined) return false;
          const mat = gatePassData?.gate_pass_materials?.[selectedAttachment.itemIndex];
          return mat && (!mat.recieved_date || mat.recieved_date === '' || mat.recieved_date === null);
        })()}
      />
    </div>
  );
};