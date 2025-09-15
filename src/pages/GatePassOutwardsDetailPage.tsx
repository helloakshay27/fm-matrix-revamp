import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, FileText, QrCode, Box, User, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_CONFIG } from '@/config/apiConfig';
import { AttachmentGoodsPreviewModal } from '@/components/AttachmentGoodsPreviewModal';

export const GatePassOutwardsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [gatePassData, setGatePassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [handoverTo, setHandoverTo] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [receivedItems, setReceivedItems] = useState<number[]>([]);
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
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

  const handleReceiveClick = (itemIndex: number) => {
    setSelectedItemIndex(itemIndex);
    setIsReceiveModalOpen(true);
    setHandoverTo('');
    setReceivedDate('');
    setRemarks('');
    setAttachments([]);
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmitReceive = async () => {
    if (selectedItemIndex === null || !gatePassData) return;
    const material = gatePassData.gate_pass_materials[selectedItemIndex];
    if (!material) return;
    const formData = new FormData();
    formData.append('gate_pass_material[remarks]', remarks);
    formData.append('gate_pass_material[handover_to]', handoverTo);
    formData.append('gate_pass_material[recieved_date]', receivedDate);
    attachments.forEach(file => {
      formData.append('gate_pass_material[attachments][]', file);
    });
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/gate_passes/${gatePassData.id}/gate_pass_materials/${material.id}/update_material`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`
        },
        body: formData
      });
      if (res.ok) {
        setIsReceiveModalOpen(false);
        setSelectedItemIndex(null);
        setHandoverTo('');
        setReceivedDate('');
        setRemarks('');
        setAttachments([]);
        setReceivedItems(prev => [...prev, selectedItemIndex]);
        // Optionally show toast
        // Optionally reload gatePassData
      } else {
        // Handle error
        // Optionally show error toast
      }
    } catch (err) {
      // Handle error
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  if (!gatePassData) {
    return <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Entry Not Found</h1>
          <Button onClick={() => navigate('/security/gate-pass/outwards')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Outward List
          </Button>
        </div>
      </div>;
  }

  console.log('Gate Pass Data:', gatePassData);
  

  // Defensive fallback for missing fields
  const personName = gatePassData.contact_person || '--';
  const returnableNonReturnable = gatePassData.returnable ? 'Returnable' : 'Non Returnable';
  const expectedReturnDate = gatePassData.expected_return_date || '-';
  const category = gatePassData.gate_pass_type_name || gatePassData.gate_pass_category || '--';
  const companyName = (gatePassData.company && gatePassData.company.name) || '--';
  const siteName = (gatePassData.site && gatePassData.site.name) || '--';
  const buildingName = (gatePassData.building && gatePassData.building.name) || '--';
  const vehicleNo = gatePassData.vehicle_no || '--';
  const passDate = gatePassData.gate_pass_date ? new Date(gatePassData.gate_pass_date).toLocaleString() : '--';
  const modeOfTransport = gatePassData.mode_of_transport || vehicleNo;
  const mobileNo = gatePassData.driver_contact_no || gatePassData.contact_person_no || '--';

  console.log('Gate Pass Data:', gatePassData);

  // Prepare itemsData from gatePassData.gate_pass_materials
  const attachmentLinks = (gatePassData.attachments || []).map((att: any) =>
    att.document ? `<a href="${att.document}" target="_blank" rel="noopener noreferrer">📎</a>` : ''
  ).filter(Boolean).join(', ');
  

  console.log('Attachment Links:', gatePassData.attachments )
  // Prepare itemsData from gatePassData.gate_pass_materials
  const itemsData = (gatePassData.gate_pass_materials || []).map((mat: any, idx: number) => ({
    sNo: String(idx + 1).padStart(2, '0'),
    itemName: mat.material_type || '--',
    itemCategory: mat.item_category || '--',
    itemNameDetail: mat.material || mat.other_material_name || '--',
    unit: mat.unit || '--',
    quantity: mat.gate_pass_qty ?? '--',
    description: mat.other_material_description || mat.remarks || '--',
    attachment: attachmentLinks || '--',
    updates: 'Receive',
  }));

  return <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/security/gate-pass/outwards')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Outward List
        </Button>
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Goods Outwards</span>
          <span>&gt;</span>
          <span className="text-[#C72030] font-medium">Details</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm">
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
                    <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-600 font-bold text-lg">{personName.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900">{personName}</h2>
                    <p className="text-xs text-gray-600">{returnableNonReturnable}</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Employee/Visitor Name:</span>
                        <span className="text-sm text-gray-900">{personName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Visitor Mobile No.:</span>
                        <span class-Name="text-sm text-gray-900">{mobileNo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Company Name:</span>
                    <span className="text-sm text-gray-900">{gatePassData?.vendor_company_name || '--'}</span>
                  </div>
                                        <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Vendor:</span>
                        <span className="text-sm text-gray-900">{gatePassData.supplier_name || '--'}</span>
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
                        <span className="text-sm text-gray-900">{gatePassData.gate_pass_date ? new Date(gatePassData.gate_pass_date).toLocaleDateString() : '--'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Reporting Time:</span>
                        <span className="text-sm text-gray-900">{gatePassData.due_at ? new Date(gatePassData.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                    <span className="text-sm font-medium text-gray-700">Mode Of Transport:</span>
                    <span className={`text-sm text-gray-900`} style={{textTransform: 'capitalize'}}>{gatePassData.mode_of_transport || '--'}</span>
                  </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Vehicle Number:</span>
                        <span className="text-sm text-gray-900">{vehicleNo}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Goods Type:</span>
                        <span className="text-sm text-gray-900">{gatePassData.returnable == true ? "Returnable" : "Non-Returnable"}</span>
                    </div>
                    {gatePassData.returnable == true && (
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Expected Return Date:</span>
                            <span className="text-sm text-gray-900">{expectedReturnDate || "-"}</span>
                        </div>
                    )}
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
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sr No.</TableHead>
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item category</TableHead>
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name detail</TableHead>
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</TableHead>
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</TableHead>
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</TableHead>
          <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700 sticky right-0 bg-white z-10">Attachments</TableHead>
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
                        <TableCell className="px-4 py-3 text-sm text-gray-900 sticky right-0 bg-white z-10">
                          {/* Per-item attachments modal button, now also handles receive */}
                          <button
                            className="text-blue-600 underline hover:text-blue-800 font-medium"
                            style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                            onClick={() => {
                              const attachmentsToShow = (gatePassData.gate_pass_materials && gatePassData.gate_pass_materials[index]?.attachments?.length > 0)
                                ? gatePassData.gate_pass_materials[index].attachments
                                : gatePassData.attachments;
                              setSelectedAttachment({
                                attachments: attachmentsToShow || [],
                                itemIndex: index,
                                itemName: item.itemNameDetail,
                                received: receivedItems.includes(index),
                              });
                              setIsAttachmentModalOpen(true);
                            }}
                          >
                            View Attachments
                          </button>
                        </TableCell>
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

      {/* Receive functionality is now inside the AttachmentPreviewModal for each item */}

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
        onReceive={(
          itemIndex: number,
          received: boolean,
          setReceiveModalOpen: (open: boolean) => void,
          receiveState: {
            handoverTo: string,
            setHandoverTo: (v: string) => void,
            receivedDate: string,
            setReceivedDate: (v: string) => void,
            remarks: string,
            setRemarks: (v: string) => void,
            attachments: File[],
            setAttachments: (v: File[]) => void,
            fileInputRef: React.RefObject<HTMLInputElement>,
          },
        ) => {
          // Only show receive UI if not already received
          if (received) return null;
          return (
            <div className="mt-6 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="handover" className="text-sm font-medium text-gray-700">
                  Handover To
                </Label>
                <Input
                  id="handover"
                  placeholder="Enter handover details"
                  className="w-full"
                  value={receiveState.handoverTo}
                  onChange={e => receiveState.setHandoverTo(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="received-date" className="text-sm font-medium text-gray-700">
                  Received Date
                </Label>
                <Input
                  type="date"
                  id="received-date"
                  placeholder="Enter received date"
                  className="w-full"
                  value={receiveState.receivedDate}
                  onChange={e => receiveState.setReceivedDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter remarks"
                  className="w-full min-h-[80px]"
                  value={receiveState.remarks}
                  onChange={e => receiveState.setRemarks(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachment" className="text-sm font-medium text-gray-700">
                  Attachment
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="attachment"
                    type="file"
                    className="w-full"
                    multiple
                    ref={receiveState.fileInputRef}
                    onChange={e => receiveState.setAttachments(Array.from(e.target.files || []))}
                  />
                  <Button size="sm" variant="outline" onClick={() => receiveState.fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center pt-4">
                <Button
                  onClick={async () => {
                    // Submit receive for this item
                    const material = gatePassData.gate_pass_materials[itemIndex];
                    if (!material) return;
                    const formData = new FormData();
                    formData.append('gate_pass_material[remarks]', receiveState.remarks);
                    formData.append('gate_pass_material[handover_to]', receiveState.handoverTo);
                    formData.append('gate_pass_material[recieved_date]', receiveState.receivedDate);
                    receiveState.attachments.forEach(file => {
                      formData.append('gate_pass_material[attachments][]', file);
                    });
                    try {
                      const res = await fetch(`${API_CONFIG.BASE_URL}/gate_passes/${gatePassData.id}/gate_pass_materials/${material.id}/update_material`, {
                        method: 'PUT',
                        headers: {
                          'Authorization': `Bearer ${API_CONFIG.TOKEN}`
                        },
                        body: formData
                      });
                      if (res.ok) {
                        setReceiveModalOpen(false);
                        setReceivedItems(prev => [...prev, itemIndex]);
                      }
                    } catch (err) {}
                  }}
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
                >
                  Submit
                </Button>
              </div>
            </div>
          );
        }}
      />
    </div>;
};