import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, FileText, QrCode, Box, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_CONFIG } from '@/config/apiConfig';

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
        // Optionally refresh data
        setIsReceiveModalOpen(false);
        setSelectedItemIndex(null);
        setHandoverTo('');
        setReceivedDate('');
        setRemarks('');
        setAttachments([]);
        // Optionally show toast
        // Optionally reload gatePassData
        // You can add a toast here
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

  // Defensive fallback for missing fields
  const personName = gatePassData.created_by_name || gatePassData.contact_person || '--';
  const returnableNonReturnable = gatePassData.returnable ? 'Returnable' : 'Non Returnable';
  const expectedReturnDate = gatePassData.expected_return_date || '-';
  const category = gatePassData.gate_pass_type_name || gatePassData.gate_pass_category || '--';
  const companyName = (gatePassData.company && gatePassData.company.name) || '--';
  const siteName = (gatePassData.site && gatePassData.site.name) || '--';
  const buildingName = (gatePassData.building && gatePassData.building.name) || '--';
  const vehicleNo = gatePassData.vehicle_no || '--';
  const passDate = gatePassData.gate_pass_date ? new Date(gatePassData.gate_pass_date).toLocaleString() : '--';
  const modeOfTransport = gatePassData.mode_of_transport || vehicleNo;

  // Prepare itemsData from gatePassData.gate_pass_materials
  const itemsData = (gatePassData.gate_pass_materials || []).map((mat: any, idx: number) => ({
    sNo: String(idx + 1).padStart(2, '0'),
    itemName: mat.material_type || '--',
    itemCategory: mat.material_sub_type || '--',
    itemNameDetail: mat.material || mat.other_material_name || '--',
    unit: mat.uom || '--',
    quantity: mat.gate_pass_qty ?? '--',
    description: mat.other_material_description || mat.remarks || '--',
    attachment: mat.attachment ? '📎' : '',
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
          <span className="text-[#C72030] font-medium">Returnable</span>
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
                        <span className="text-sm text-gray-900">086907860</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Department:</span>
                        <span className="text-sm text-gray-900">UI/UX Designer</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Company Name:</span>
                        <span className="text-sm text-gray-900">{companyName}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Date/Time:</span>
                        <span className="text-sm text-gray-900">{passDate}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Mode Of Transport:</span>
                        <span className="text-sm text-gray-900">{modeOfTransport || "By Hand"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Expected Date:</span>
                        <span className="text-sm text-gray-900">{expectedReturnDate || "-"}</span>
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
                    <h2 className="text-lg font-[700]">DETAILS</h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">S No.</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item category</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item name</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unit</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Attachment</TableHead>
                    <TableHead className="px-4 py-3 text-left text-sm font-medium text-gray-700">Updates</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {itemsData.map((item, index) => <TableRow key={item.sNo} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.sNo}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemName}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemCategory}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.itemNameDetail}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.unit}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.quantity}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.description}</TableCell>
                        <TableCell className="px-4 py-3 text-sm text-gray-900">{item.attachment}</TableCell>
                        <TableCell className="px-4 py-3 text-sm">
                        <button className="text-[#C72030] underline hover:text-[#C72030]/80 transition-colors font-medium" onClick={() => handleReceiveClick(index)}>
                            {item.updates}
                        </button>
                        </TableCell>
                    </TableRow>)}
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

      {/* Receive Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">Return Process</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="handover" className="text-sm font-medium text-gray-700">
                Handover To
              </Label>
              <Input
                id="handover"
                placeholder="Enter handover details"
                className="w-full"
                value={handoverTo}
                onChange={e => setHandoverTo(e.target.value)}
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
                value={receivedDate}
                onChange={e => setReceivedDate(e.target.value)}
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
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
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
                  ref={fileInputRef}
                  onChange={handleAttachmentChange}
                />
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center pt-4">
            <Button onClick={handleSubmitReceive} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};