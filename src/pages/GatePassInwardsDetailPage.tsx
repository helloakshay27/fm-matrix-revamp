import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, QrCode, Box, User, Download, Eye, FileSpreadsheet, File } from 'lucide-react';
import { API_CONFIG } from '@/config/apiConfig';
import { AttachmentGoodsPreviewModal } from '@/components/AttachmentGoodsPreviewModal';
import { AttachmentPreviewModal } from '@/components/AttachmentPreviewModal';
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


export const GatePassInwardsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gatePassData, setGatePassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

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

  // Preview modal state
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  const personName = selectedEntry.contact_person || '--';
  const category = selectedEntry.gate_pass_type_name || selectedEntry.gate_pass_category || '--';
  const vendorCompanyName = gatePassData.vendor_company_name || '--';
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
      )
    };
  });

  console.log(gatePassData.attachments.map);
  

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
      updates: '', // Placeholder for updates/actions
    })) || [];

  const columns = [
    { key: "itemType", label: "Item Type", sortable: false, defaultVisible: true },
    { key: "itemCategory", label: "Item Category", sortable: false, defaultVisible: true },
    { key: "itemName", label: "Item Name", sortable: false, defaultVisible: true },
    { key: "unit", label: "Unit", sortable: false, defaultVisible: true },
    { key: "quantity", label: "Quantity", sortable: false, defaultVisible: true },
    { key: "description", label: "Description", sortable: false, defaultVisible: true },
  ];

  const renderCell = (item: any, columnKey: string) => {
    return item[columnKey] ?? "--";
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/security/gate-pass/inwards')}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Inward List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                Gate Pass Inward - {gatePassData.gate_pass_no || gatePassData.id}
              </h1>
              <div className="text-base px-4 py-2 bg-green-100 text-green-800 rounded-md">
                {status}
              </div>
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
            {/* Gate Pass Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-4">
              <div className="text-[#C72030] font-semibold text-xl mb-4">Gate Pass Information</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Employer/Visitor Name:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{personName}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Company:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{vendorCompanyName}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Mobile No.:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{selectedEntry.contact_person_no || '--'}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Mode of Transport:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{gatePassData.mode_of_transport || '--'}{vehicleNo && ` / ${vehicleNo}`}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Building:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{buildingName}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Gate Pass Type:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{category}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Gate Pass No. :</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{gatePassData.gate_pass_no || '--'}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Gate No:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{gatePassData.gate_number || '--'}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Gate Pass Date:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{gatePassData.gate_pass_date ? new Date(gatePassData.gate_pass_date).toLocaleDateString() : '--'}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Reporting Time:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{gatePassData.due_at ? new Date(gatePassData.due_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</div>
                </div>
                {gatePassData.remarks && (
                  <div className="col-span-2">
                    <div className="text-gray-500" style={{ fontSize:'12px'}}>Remarks:</div>
                    <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{gatePassData.remarks || '--'}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Vendor Details */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="text-[#C72030] font-semibold text-xl mb-4">Vendor Details</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Vendor Name:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{gatePassData.supplier_name || '--'}</div>
                </div>
                <div>
                  <div className="text-gray-500" style={{ fontSize:'12px'}}>Mobile No.:</div>
                  <div className="font-medium text-gray-900" style={{ fontSize:'16px'}} >{selectedEntry.contact_person_no || '--'}</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="p-4 sm:p-6">
            {/* Item Details Table */}
            <div className="bg-white rounded-lg px-4 pb-4 border border-gray-200 shadow-sm">
              <div className="flex items-center pt-4 pb-2">
                <span className="font-semibold text-[#C72030] text-xl mr-4">Item Details</span>
              </div>
              <div className="overflow-x-auto">
                <EnhancedTable
                  data={tableData}
                  columns={columns}
                  renderCell={renderCell}
                  storageKey="gate-pass-inwards-details-items"
                  pagination={true}
                  pageSize={10}
                  hideColumnsButton={true}
                  hideTableExport={true}
                  hideTableSearch={true}
                  loading={loading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attachments" className="p-4 sm:p-6">
            {/* Attachments Section */}
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
          </TabsContent>
        </Tabs>
      </div>

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
};