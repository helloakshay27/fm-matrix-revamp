import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, FileText, QrCode, Box, User, Download, Eye, FileSpreadsheet, File } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_CONFIG } from '@/config/apiConfig';
import { AttachmentGoodsPreviewModal } from '@/components/AttachmentGoodsPreviewModal';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

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
    return <div className="p-6 text-center text-gray-500 text-md">Loading...</div>;
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/security/gate-pass/outwards')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Outward List
        </Button>
      </div>

      {/* Top Info Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4 flex flex-col md:flex-row gap-4">
        {/* Left: Profile image placeholder */}
        {/* <div className="flex-shrink-0 flex flex-col items-center justify-center w-32">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            <User className="w-16 h-16 text-gray-400" />
          </div>
        </div> */}
        {/* Right: Info grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
          <div>
            <div className="text-gray-500 text-md">Employer/Visitor Name:</div>
            <div className="font-medium text-gray-900">{personName}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Company:</div>
            <div className="font-medium text-gray-900">{vendorCompanyName || '--'}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Mobile No.:</div>
            <div className="font-medium text-gray-900">{mobileNo}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Mode of Transport:</div>
            <div className="font-medium text-gray-900">{modeOfTransport}{vehicleNo && ` / ${vehicleNo}`}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Building:</div>
            <div className="font-medium text-gray-900">{buildingName}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Gate Pass Type:</div>
            <div className="font-medium text-gray-900">{gatePassType}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Gate Pass No. :</div>
            <div className="font-medium text-gray-900">{gatePassData.gate_pass_no || '--'}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Gate No:</div>
            <div className="font-medium text-gray-900">{gateNo}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Gate Pass Date:</div>
            <div className="font-medium text-gray-900">{gatePassDate}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Reporting Time:</div>
            <div className="font-medium text-gray-900">{reportingTime}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Goods Type:</div>
            <div className="font-medium text-gray-900">{gatePassData.returnable == true ? 'Returnable' : 'Non-Returnable'}</div>
          </div>
          {
            gatePassData.returnable && <div>
              <div className="text-gray-500 text-md">Expected Return Date:</div>
              <div className="font-medium text-gray-900">{gatePassData.expected_return_date ? new Date(gatePassData.expected_return_date).toLocaleDateString() : '--'}</div>
            </div>
          }
          {remarks && <div>
            <div className="text-gray-500 text-md">Remarks:</div>
            <div className="font-medium text-gray-900">{remarks}</div>
          </div>}

        </div>
      </div>

      {/* Vendor Details */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
        <div className="text-[#C72030] font-semibold text-xl mb-2">Vendor Details</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-md">Vendor Name:</div>
            <div className="font-medium text-gray-900">{supplierName}</div>
          </div>
          <div>
            <div className="text-gray-500 text-md">Mobile No.:</div>
            <div className="font-medium text-gray-900">{mobileNo}</div>
          </div>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-lg  px-4 pb-4 border border-gray-200 shadow-sm">
        <div className="flex items-center pt-4 pb-2">
          <span className="font-semibold text-[#C72030] text-xl mr-4">Item Details</span>
        </div>
        <div className="overflow-x-auto">
          <EnhancedTable
            data={tableData}
            columns={columns}
            renderCell={renderCell}
            storageKey="gate-pass-outwards-details-items"
            pagination={true}
            pageSize={10}
            hideColumnsButton={true}
            hideTableExport={true}
            hideTableSearch={true}
            loading={loading}
          />
        </div>
      </div>

      {/* Attachments Section */}
      <div className="mt-8">
        <div className="shadow-sm border border-border rounded-lg bg-white">
          <div className="pb-4 pt-6 px-6">
            <div className="text-[#C72030] font-semibold text-xl mb-2">Attachments</div>
          </div>
          <div className="pb-6 px-6">
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
          </div>
        </div>
      </div>

      {/* Attachment Preview Modal */}
      <AttachmentPreviewModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedDoc={selectedDoc}
        setSelectedDoc={setSelectedDoc}
        modalTitle={
          selectedDoc?.document_name ||
          selectedDoc?.document_file_name ||
          (selectedDoc?.url ? selectedDoc.url.split('/').pop() : '') ||
          `Document_${selectedDoc?.id || ''}`
        }
      />

      {/* Receive/Handover Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {handoverView[selectedItemIndex ?? -1]
                ? "Material Handover Details"
                : "Return Process"}
            </DialogTitle>
          </DialogHeader>
          {handoverView[selectedItemIndex ?? -1] ? (
            // Show filled/disabled fields
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Handover To</Label>
                <Input
                  value={handoverView[selectedItemIndex ?? -1].handover_to || ''}
                  disabled
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Received Date</Label>
                <Input
                  value={
                    handoverView[selectedItemIndex ?? -1].recieved_date
                      ? new Date(handoverView[selectedItemIndex ?? -1].recieved_date).toLocaleDateString()
                      : ''
                  }
                  disabled
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Remarks</Label>
                <Textarea
                  value={handoverView[selectedItemIndex ?? -1].remarks || ''}
                  disabled
                  className="w-full min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Attachment</Label>
                <div className="flex items-center flex-wrap gap-4">
                  {(handoverView[selectedItemIndex ?? -1].attachments || []).length > 0
                    ? handoverView[selectedItemIndex ?? -1].attachments.map((attachment: any) => {
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
                      })
                    : <span className="text-gray-400">No attachments</span>
                  }
                </div>
              </div>
            </div>
          ) : (
            // Show editable fields for receive
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
          )}
          {!handoverView[selectedItemIndex ?? -1] && (
            <div className="flex justify-center pt-4">
              <Button onClick={handleSubmitReceive} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8">
                Submit
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};