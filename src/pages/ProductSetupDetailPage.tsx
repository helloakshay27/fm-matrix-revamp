import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, FileText, FileSpreadsheet, File, Download } from "lucide-react";
import { useAppDispatch } from '@/store/hooks';
import { fetchMenuDetails } from '@/store/slices/f&bSlice';
import { CustomTabs } from '@/components/CustomTabs';
import { AttachmentPreviewModal } from "@/components/AttachmentPreviewModal";

interface MenuItem {
  id: number;
  name: string;
  description: string;
  sku: string;
  active: number;
  category_id: number;
  category_name: string;
  sub_category_id: number;
  sub_category_name: string;
  restaurant_id: number;
  stock: number;
  display_price: number;
  master_price: number;
  discounted_amount: number;
  discount: number | null;
  cgst_amt: number;
  cgst_rate: number;
  sgst_amt: number;
  sgst_rate: number;
  igst_amt: number | null;
  igst_rate: number | null;
  veg_menu: boolean | null;
  created_at: string;
  updated_at: string;
}

interface Attachment {
  id: number;
  url: string;
  document_name?: string;
  document_file_name?: string;
}

export const ProductSetupDetailPage = () => {
  const { id, mid } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [menuItems, setMenuItems] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("menu_details");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<Attachment>({
    id: 0,
    url: '',
    document_name: '',
    document_file_name: '',
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchMenuDetails({ baseUrl, token, id: Number(id), mid: Number(mid) })).unwrap();
        setMenuItems(response);
        setAttachments(response.images.map((img: any, index: number) => ({
          id: img.id,
          url: img.document,
          document_name: img.document_name || `Image_${index + 1}`,
          document_file_name: img.document_file_name || `image_${index + 1}`,
        })));
      } catch (error) {
        console.error('Error fetching menu items:', error);
        setError('Failed to load menu details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [dispatch, baseUrl, token, id, mid]);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error || !menuItems) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">{error || 'Menu item not found'}</div>;
  }

  const tabs = [
    {
      value: "menu_details",
      label: "Menu Details",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              M
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Menu Details</h3>
          </div>
          <div className="px-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Product Name</span>
                  <span className="font-medium text-16">{menuItems.name}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Display Price</span>
                  <span className="font-medium text-16">{menuItems.display_price}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Category</span>
                  <span className="font-medium text-16">{menuItems.category_name}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">SGST Rate</span>
                  <span className="font-medium text-16">{menuItems.sgst_rate}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">CGST Amount</span>
                  <span className="font-medium text-16">{menuItems.cgst_amt}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">SKU</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.sku}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Stock</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.stock}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Subcategory</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.sub_category_name}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">SGST Amount</span>
                  <span className="font-medium text-16">{menuItems.sgst_amt}</span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">IGST Rate</span>
                  <span className="font-medium text-16">{menuItems.igst_rate}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Master Price</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.master_price}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Active</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.active ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">Description</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.description}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">CGST Rate</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.cgst_rate}
                  </span>
                </div>
                <div className="flex">
                  <span className="text-[#1A1A1A80] w-32 text-14">IGST Amount</span>
                  <span className="font-medium text-16 truncate max-w-[170px] overflow-hidden whitespace-nowrap">
                    {menuItems.igst_amt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      value: 'attachments',
      label: 'Attachments',
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              A
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Attachments</h3>
          </div>
          <div className="px-3">
            {attachments.length > 0 ? (
              <div className="flex items-center flex-wrap gap-4">
                {attachments.map((attachment) => {
                  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(attachment.url);
                  const isPdf = /\.pdf$/i.test(attachment.url);
                  const isExcel = /\.(xls|xlsx|csv)$/i.test(attachment.url);
                  const isWord = /\.(doc|docx)$/i.test(attachment.url);
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
                              setSelectedDoc(attachment);
                              setIsModalOpen(true);
                            }}
                            type="button"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <img
                            src={attachment.url}
                            alt={attachment.document_name}
                            className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                            onClick={() => {
                              setSelectedDoc({
                                id: attachment.id,
                                url: attachment.url
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
                        {attachment.document_name || attachment.document_file_name || `Document_${attachment.id}`}
                      </span>
                      {isDownloadable && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                          onClick={() => {
                            setSelectedDoc(attachment);
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
              <p className="text-gray-600 mt-2">No existing images available.</p>
            )}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => handleBack()}
            className="flex items-center gap-1 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <CustomTabs
            tabs={tabs}
            defaultValue="menu_details"
            onValueChange={setActiveTab}
          />
        </div>

        <AttachmentPreviewModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedDoc={selectedDoc}
          setSelectedDoc={setSelectedDoc}
        />
      </div>
    </div>
  );
};