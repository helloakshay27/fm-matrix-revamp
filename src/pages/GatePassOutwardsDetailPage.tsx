import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, FileText, QrCode, Box, User, Download, Eye, FileSpreadsheet, File } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_CONFIG } from '@/config/apiConfig';
import { AttachmentGoodsPreviewModal } from '@/components/AttachmentGoodsPreviewModal';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

export const GatePassOutwardsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
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
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [handoverView, setHandoverView] = useState<{ [index: number]: any }>({});

  const fetchGatePassData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/gate_passes/${id}.json`, {
        headers: {
          'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setGatePassData(data.gate_pass || data);

      // Pre-populate handoverView for already handed over materials
      const materials = (data.gate_pass || data).gate_pass_materials || [];
      const handoverMap: { [index: number]: any } = {};
      materials.forEach((mat: any, idx: number) => {
        if (mat.recieved_date) {
          handoverMap[idx] = { ...mat, attachments: mat.attachments || [] };
        }
      });
      setHandoverView(handoverMap);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchGatePassData();
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
        // Fetch latest details and update state
        const updatedRes = await fetch(`${API_CONFIG.BASE_URL}/gate_passes/${gatePassData.id}.json`, {
          headers: {
            'Authorization': `Bearer ${API_CONFIG.TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        const updatedData = await updatedRes.json();
        setGatePassData(updatedData.gate_pass || updatedData);

        // Update handoverView with latest material data
        const materials = (updatedData.gate_pass || updatedData).gate_pass_materials || [];
        const handoverMap: { [index: number]: any } = {};
        materials.forEach((mat: any, idx: number) => {
          if (mat.recieved_date) {
            handoverMap[idx] = { ...mat, attachments: mat.attachments || [] };
          }
        });
        setHandoverView(handoverMap);

        setIsReceiveModalOpen(true); // keep modal open to show filled data
        setSelectedItemIndex(selectedItemIndex);
        setHandoverTo('');
        setReceivedDate('');
        setRemarks('');
        setAttachments([]);
        setReceivedItems(prev => [...prev, selectedItemIndex]);
      } else {
        // Handle error
      }
    } catch (err) {
      // Handle error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (!gatePassData) {
    return <div className="p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Entry Not Found</h1>
        <button
          onClick={() => navigate('/security/gate-pass/outwards')}
          className="flex items-center gap-1 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Outward List
        </button>
      </div>
    </div>;
  }

  console.log('Gate Pass Data:', gatePassData);


  // Defensive fallback for missing fields
  const personName = gatePassData.contact_person || '--';
  const companyName = (gatePassData.company && gatePassData.company.name) || '--';
  const buildingName = (gatePassData.building && gatePassData.building.name) || '--';
  const siteName = (gatePassData.site && gatePassData.site.name) || '--';
  const gatePassType = gatePassData.gate_pass_type_name || '--';
  const gateNo = gatePassData.gate_number || '--';
  const gatePassDate = gatePassData.gate_pass_date ? new Date(gatePassData.gate_pass_date).toLocaleDateString() : '--';
  const modeOfTransport = gatePassData.mode_of_transport ? `By ${gatePassData.mode_of_transport.charAt(0).toUpperCase() + gatePassData.mode_of_transport.slice(1)}` : '--';
  const reportingTime = gatePassData.due_at ? new Date(gatePassData.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--';
  const vehicleNo = gatePassData.vehicle_no || '--';
  const mobileNo = gatePassData.contact_person_no || '--';
  const vendorCompanyName = gatePassData.vendor_company_name || '--';
  const supplierName = gatePassData.supplier_name || '--';
  const expectedReturnDate = gatePassData.expected_return_date || '--';
  const returnableStatus = gatePassData.returnable ? 'Returnable' : 'Non-Returnable';
  const status = gatePassData.status || '--';
  const vendorDetails = {
    name: supplierName,
    mobile: mobileNo,
    email: gatePassData.supplier_email || '--'
  };

  // Prepare table data and columns for EnhancedTable
  const tableData =
    (gatePassData.gate_pass_materials || []).map((mat: any, idx: number) => ({
      sNo: String(idx + 1).padStart(2, '0'),
      itemType: mat.material_type || '--',
      itemCategory: mat.item_category == '-1' ? 'Other' : mat.item_category || '--',
      itemName: mat.material || mat.other_material_name || '--',
      unit: mat.unit || '--',
      quantity: mat.gate_pass_qty ?? '--',
      description: mat.other_material_description || mat.remarks || '--',
      updates: idx, // Store index for updates column
    })) || [];

  // Conditionally include 'updates' column only if returnable
  const columns = [
    { key: "itemType", label: "Item Type", sortable: false, defaultVisible: true },
    { key: "itemCategory", label: "Item Category", sortable: false, defaultVisible: true },
    { key: "itemName", label: "Item Name", sortable: false, defaultVisible: true },
    { key: "unit", label: "Unit", sortable: false, defaultVisible: true },
    { key: "quantity", label: "Quantity", sortable: false, defaultVisible: true },
    { key: "description", label: "Description", sortable: false, defaultVisible: true },
    // Only show 'updates' column if returnable
    ...(gatePassData.returnable === true
      ? [{ key: "updates", label: "Updates", sortable: false, defaultVisible: true }]
      : []),
  ];

    // Render cell for EnhancedTable, especially for Updates column
    const getStatusBadgeStyles = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'pending':
        return { backgroundColor: '#f5f2c9', color: '#000' };
      case 'rejected':
        return { backgroundColor: '#f5ccc6', color: '#000' };
      case 'accepted':
      case 'approved':
        return { backgroundColor: '#c7ecd9', color: '#000' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#000' };
    }
  };

  const renderCell = (item: any, columnKey: string) => {
      // Only show receive/handover buttons if returnable
      if (columnKey === "updates" && gatePassData.returnable === true) {
        const idx = item.updates;
        if (handoverView[idx]) {
          return (
            <Button
              size="sm"
              className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
              onClick={() => {
                setSelectedItemIndex(idx);
                setIsReceiveModalOpen(true);
              }}
            >
              View Handover
            </Button>
          );
        }
        return (
          <Button
            size="sm"
            className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
            onClick={() => handleReceiveClick(idx)}
          >
            Receive
          </Button>
        );
      }
      return item[columnKey] ?? "--";
    };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/security/gate-pass/outwards')}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Outward List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                Gate Pass Outward - {gatePassData.gate_pass_no || gatePassData.id}
              </h1>
              {/* <div 
                className="text-base px-4 py-2 rounded-md"
                style={getStatusBadgeStyles(status)}
              >
                {status}
              </div> */}
            </div>

            <div className="text-sm text-gray-600">
              Created by {gatePassData.created_by_name || '--'} • Gate Pass Date: {gatePassData.gate_pass_date ? new Date(gatePassData.gate_pass_date).toLocaleDateString() : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="profile"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Profile
            </TabsTrigger>

            <TabsTrigger
              value="details"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Details
            </TabsTrigger>

            <TabsTrigger
              value="attachments"
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
            >
              Attachments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Gate Pass Information Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Gate Pass Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Employer/Visitor Name</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{personName}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Company</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{vendorCompanyName || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Mobile No.</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{mobileNo}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Mode of Transport</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{gatePassData.mode_of_transport || '--'}{vehicleNo && ` / ${vehicleNo}`}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Building</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{buildingName}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Gate Pass Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{gatePassType}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Gate Pass No.</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{gatePassData.gate_pass_no || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Gate No</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{gatePassData.gate_number || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Gate Pass Date</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{gatePassData.gate_pass_date ? new Date(gatePassData.gate_pass_date).toLocaleDateString() : '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Expected Return Date</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{expectedReturnDate}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Goods Type</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{gatePassData.returnable ? 'Returnable' : 'Non-Returnable'}</span>
                    </div>
                    {gatePassData.remarks && (
                      <div className="flex items-start col-span-2">
                        <span className="text-gray-500 min-w-[140px]">Remarks</span>
                        <span className="text-gray-500 mx-2">:</span>
                        <span className="text-gray-900 font-medium">{gatePassData.remarks || '--'}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vendor Details Card */}
              <Card className="w-full">
                <CardHeader className="pb-4 lg:pb-6">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                      <User className="w-6 h-6" style={{ color: '#C72030' }} />
                    </div>
                    <span className="uppercase tracking-wide">Vendor Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Vendor Name</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{gatePassData.supplier_name || '--'}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 min-w-[140px]">Mobile No.</span>
                      <span className="text-gray-500 mx-2">:</span>
                      <span className="text-gray-900 font-medium">{mobileNo}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-4 sm:p-6">
            {/* Item Details Table */}
            <Card className="w-full">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <Box className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <span className="uppercase tracking-wide">Item Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="overflow-x-auto">
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table className="border-separate">
                      <TableHeader>
                        <TableRow className="hover:bg-gray-50" style={{ backgroundColor: '#e6e2d8' }}>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Item Type</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Item Category</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Item Name</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Unit</TableHead>
                          <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: '#fff' }}>Quantity</TableHead>
                          <TableHead className={`font-semibold text-gray-900 py-3 px-4${gatePassData.returnable === true ? ' border-r' : ''}`} style={{ borderColor: '#fff' }}>Description</TableHead>
                          {gatePassData.returnable === true && (
                            <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: '#fff' }}>Updates</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={gatePassData.returnable === true ? 7 : 6} className="text-center py-8">
                              <div className="flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2">Loading...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : tableData && tableData.length > 0 ? (
                          tableData.map((item, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                              <TableCell className="py-3 px-4 font-medium">{item.itemType}</TableCell>
                              <TableCell className="py-3 px-4">{item.itemCategory}</TableCell>
                              <TableCell className="py-3 px-4">{item.itemName}</TableCell>
                              <TableCell className="py-3 px-4">{item.unit}</TableCell>
                              <TableCell className="py-3 px-4">{item.quantity}</TableCell>
                              <TableCell className="py-3 px-4">{item.description}</TableCell>
                              {gatePassData.returnable === true && (
                                <TableCell className="py-3 px-4">
                                  {handoverView[item.updates] ? (
                                    <Button
                                      size="sm"
                                      className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                                      onClick={() => {
                                        setSelectedItemIndex(item.updates);
                                        setIsReceiveModalOpen(true);
                                      }}
                                    >
                                      View Handover
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      className="bg-[#C72030] text-white hover:bg-[#C72030]/90"
                                      onClick={() => handleReceiveClick(item.updates)}
                                    >
                                      Receive
                                    </Button>
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={gatePassData.returnable === true ? 7 : 6} className="text-center py-8 text-gray-500">
                              No items found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attachments" className="p-4 sm:p-6">
            {/* Attachments Section */}
            <Card className="w-full">
              <CardHeader className="pb-4 lg:pb-6">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-[#1A1A1A]">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
                    <FileText className="w-6 h-6" style={{ color: '#C72030' }} />
                  </div>
                  <span className="uppercase tracking-wide">Attachments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {Array.isArray(gatePassData.attachments) && gatePassData.attachments.length > 0 ? (
                  <div className="flex items-center flex-wrap gap-4">
                    {gatePassData.attachments.map((attachment: any) => {
                      const url = attachment.document || attachment.url;
                      const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
                      const isPdf = /\.pdf$/i.test(url);
                      const isExcel = /\.(xls|xlsx|csv)$/i.test(url);
                      const isWord = /\.(doc|docx)$/i.test(url);
                      const isDownloadable = isPdf || isExcel || isWord;

                      return (
                        <div
                          key={attachment.id}
                          className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-[#F6F4EE] shadow-md"
                        >
                          {isImage ? (
                            <>
                              <button
                                className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                title="View"
                                onClick={() => {
                                  setSelectedDoc({
                                    ...attachment,
                                    url,
                                    type: 'image'
                                  });
                                  setIsModalOpen(true);
                                }}
                                type="button"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <img
                                src={url}
                                alt={attachment.document_name || attachment.document_file_name || `Document_${attachment.id}`}
                                className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedDoc({
                                    ...attachment,
                                    url,
                                    type: 'image'
                                  });
                                  setIsModalOpen(true);
                                }}
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
                              <File className="w-6 h-6" />
                            </div>
                          )}
                          <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                            {attachment.document_name ||
                              attachment.document_file_name ||
                              url.split('/').pop() ||
                              `Document_${attachment.id}`}
                          </span>
                          {isDownloadable && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                              onClick={() => {
                                setSelectedDoc({
                                  ...attachment,
                                  url,
                                  type: isPdf ? 'pdf' : isExcel ? 'excel' : isWord ? 'word' : 'file'
                                });
                                setIsModalOpen(true);
                              }}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No attachments</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Receive Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mark as Received</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="handoverTo">Handover To</Label>
              <Input
                id="handoverTo"
                value={handoverTo}
                onChange={(e) => setHandoverTo(e.target.value)}
                placeholder="Enter person name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Received Date</Label>
              <Input
                id="receivedDate"
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Attachments</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachments(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="attachment-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('attachment-input')?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <span className="text-sm text-gray-500">
                  {attachments.length} file(s) selected
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsReceiveModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Received:', { handoverTo, receivedDate, remarks, attachments });
                setIsReceiveModalOpen(false);
              }}>
                Mark as Received
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <AttachmentPreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
      />

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
}