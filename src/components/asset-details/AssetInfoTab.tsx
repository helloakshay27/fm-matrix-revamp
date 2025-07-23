
import { MapPin, QrCode, Settings, CreditCard, UserCheck, TrendingUp, User, FileText, CheckCircle, Box, Clock, UserIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AssetAnalyticsTab } from './AssetAnalyticsTab';

interface AssetInfoTabProps {
  asset: Asset;
  assetId?: string | number;
}
interface Asset {
  id: number;
  name: string;
  model_number: string;
  serial_number: string;
  purchase_cost: number;
  purchased_on: string;
  warranty: boolean;
  warranty_expiry: string;
  manufacturer: string;
  asset_number: string;
  asset_code: string;
  group: string;
  sub_group: string;
  allocation_type: string;
  depreciation_applicable: boolean;
  depreciation_method: string;
  useful_life: number;
  salvage_value: number;
  status: string;
  current_book_value: number;
  site_name: string;
  commisioning_date: string;
  vendor_name: string;
  warranty_period?: number; // <-- Added property
  supplier_detail?: {
    company_name: string;
    email: string;
    mobile1: string;
  };
  asset_loan_detail?: {
    agrement_from_date: string;
    agrement_to_date: string;
    supplier: string;
  };
  depreciation_details?: {
    period: string;
    book_value_beginning: number;
    depreciation: number;
    book_value_end: number;
  }[];
  asset_amcs?: any[];
  custom_fields?: any;
  floor?: { name: string };
  building?: { name: string };
  wing?: { name: string };
  area?: { name: string };
  pms_room?: { name: string };
  allocated_to?: string[]; // Added property
  asset_move_tos?: {
    from?: { location?: string };
    to?: { location?: string };
  }[];
}

export const AssetInfoTab: React.FC<AssetInfoTabProps> = ({ asset, assetId }) => {
  return <div className="min-h-full ">
    <Tabs defaultValue='analytics' style={{ width: '100%' }}>
      <TabsList className='w-full'>
        <TabsTrigger value="analytics" className='w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black'>Analytics</TabsTrigger>
        <TabsTrigger value="assetDetails" className='w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black'>Asset Details</TabsTrigger>
      </TabsList>

      {/* Asset Details - Full Width */}
      <TabsContent value="assetDetails" className='space-y-6 '>
        <div className="bg-white rounded-lg p-6 shadow-sm border-2">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
              backgroundColor: '#C72030'
            }}>
              {/* <Settings className="w-4 h-4 text-white" /> */}

            </div>
            <h3 className="text-lg font-semibold uppercase" style={{
              color: '#C72030'
            }}>Asset Details</h3>
          </div>

          <div className="space-y-8">
            {/* Main Asset Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-2">Asset No.</div>
                <div className="font-medium text-gray-800">{asset.asset_number || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Model No.</div>
                <div className="font-medium text-gray-800">{asset.model_number || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Serial No.</div>
                <div className="font-medium text-gray-800">{asset.serial_number || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Manufacturer</div>
                <div className="font-medium text-gray-800">{asset.manufacturer || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-2">Group</div>
                <div className="font-medium text-gray-800">{asset.group || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              <div>
                <div className="text-sm text-gray-500 mb-2">Sub Group</div>
                <div className="font-medium text-gray-800">{asset.sub_group || '-'}</div>
              </div>
            </div>

            {/* System Details Section */}
            <div className="border-t pt-6">
              <div className="text-base font-semibold mb-6" style={{
                color: '#C72030'
              }}>System Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                <div>
                  <div className="text-sm text-gray-500 mb-2">OS</div>
                  <div className="font-medium text-gray-800">{asset.custom_fields?.system_details?.os || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Total Memory</div>
                  <div className="font-medium text-gray-800">{asset.custom_fields?.system_details?.memory || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Processor</div>
                  <div className="font-medium text-gray-800">{asset.custom_fields?.system_details?.processor || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">IP Address</div>
                  <div className="font-medium text-gray-800">{asset.custom_fields?.system_details?.['IP Address'] || '-'}</div>
                </div>
              </div>
            </div>

            {/* Hard Disk Details Section */}
            <div className="border-t pt-6">
              <div className="text-base font-semibold mb-6" style={{
                color: '#C72030'
              }}>Hard Disk Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Model</div>
                  <div className="font-medium text-gray-800">{asset.custom_fields?.hardware?.model || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Serial No.</div>
                  <div className="font-medium text-gray-800">{asset.custom_fields?.hardware?.serial_no || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Capacity</div>
                  <div className="font-medium text-gray-800">{asset.custom_fields?.hardware?.capacity || '-'}</div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Commissioning Date</div>
                  <div className="font-medium text-gray-800">{asset.commisioning_date || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Allocation based on</div>
                  <div className="font-medium text-gray-800">{asset.allocation_type || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Department</div>
                  <div className="font-medium text-gray-800">{asset.allocated_to?.join(', ') || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Details - Full Width */}
        <div className="w-full bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
              backgroundColor: '#C72030'
            }}>
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold uppercase" style={{
              color: '#C72030'
            }}>Purchase Details</h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Purchase Cost</div>
                <div className="font-medium">₹ {asset.purchase_cost?.toLocaleString() || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Current Date Cost</div>
                <div className="font-medium">₹ {asset.current_book_value?.toLocaleString() || '-'} ({asset.depreciation_method || '-'})</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Purchase Date</div>
                <div className="font-medium">{asset.purchased_on || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Under Warranty</div>
                <div className="font-medium">{asset.warranty ? 'Yes' : 'No'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Period</div>
                <div className="font-medium">{asset.warranty_period ? `${asset.warranty_period} year(s)` : '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Warranty Expires On</div>
                <div className="font-medium">{asset.warranty_expiry || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Loaned and Vendor Contact Details Side by Side */}
        <div className="flex gap-6">
          {/* Asset Loaned - 50% width */}
          <div className="w-1/2 bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                backgroundColor: '#C72030'
              }}>
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold uppercase" style={{
                color: '#C72030'
              }}>Asset Loaned</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Vendor</div>
                <div className="font-medium">{asset.asset_loan_detail?.supplier || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Agreement From</div>
                <div className="font-medium">{asset.asset_loan_detail?.agrement_from_date || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Agreement To</div>
                <div className="font-medium">{asset.asset_loan_detail?.agrement_to_date || '-'}</div>
              </div>
            </div>
          </div>

          {/* Vendor Contact Details - 50% width */}
          <div className="w-1/2 bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                backgroundColor: '#C72030'
              }}>
                <User className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold uppercase" style={{
                color: '#C72030'
              }}>Vendor Contact Details</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Name</div>
                <div className="font-medium">{asset.supplier_detail?.company_name || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Mobile No.</div>
                <div className="font-medium">{asset.supplier_detail?.mobile1 || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Email ID</div>
                <div className="font-medium">{asset.supplier_detail?.email || '-'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          {/* Location Details - 80% width */}
          <div className="w-full bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                backgroundColor: '#C72030'
              }}>
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold uppercase" style={{
                color: '#C72030'
              }}>Location Details</h3>
            </div>

            {/* Location Timeline - Horizontal Layout */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                {/* Site */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-2" style={{
                    backgroundColor: '#C72030'
                  }}></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Site</div>
                    <div className="text-sm font-medium text-gray-800">{asset.site_name || '-'}</div>
                  </div>
                </div>
                {/* Connecting line */}
                <div className="flex-1 h-0.5 mx-4" style={{
                  backgroundColor: '#C72030'
                }}></div>
                {/* Building */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-2" style={{
                    backgroundColor: '#C72030'
                  }}></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Building</div>
                    <div className="text-sm font-medium text-gray-800">{asset.building?.name || '-'}</div>
                  </div>
                </div>
                {/* Connecting line */}
                <div className="flex-1 h-0.5 mx-4" style={{
                  backgroundColor: '#C72030'
                }}></div>
                {/* Wing */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-2" style={{
                    backgroundColor: '#C72030'
                  }}></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Wing</div>
                    <div className="text-sm font-medium text-gray-800">{asset.wing?.name || '-'}</div>
                  </div>
                </div>
                {/* Connecting line */}
                <div className="flex-1 h-0.5 mx-4" style={{
                  backgroundColor: '#C72030'
                }}></div>
                {/* Floor */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-2" style={{
                    backgroundColor: '#C72030'
                  }}></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Floor</div>
                    <div className="text-sm font-medium text-gray-800">{asset.floor?.name || '-'}</div>
                  </div>
                </div>
                {/* Connecting line */}
                <div className="flex-1 h-0.5 mx-4" style={{
                  backgroundColor: '#C72030'
                }}></div>
                {/* Area */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-2" style={{
                    backgroundColor: '#C72030'
                  }}></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Area</div>
                    <div className="text-sm font-medium text-gray-800">{asset.area?.name || '-'}</div>
                  </div>
                </div>
                {/* Connecting line */}
                <div className="flex-1 h-0.5 mx-4" style={{
                  backgroundColor: '#C72030'
                }}></div>
                {/* Room */}
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-2" style={{
                    backgroundColor: '#C72030'
                  }}></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">Room</div>
                    <div className="text-sm font-medium text-gray-800">{asset.pms_room?.name || '-'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* <div className="flex flex-col lg:flex-row gap-6">
      
      <div className="w-full lg:w-4/5 bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#C72030'
          }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold uppercase" style={{
            color: '#C72030'
          }}>Movement Details</h3>
        </div>

        <div className="space-y-6">
         
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>From Site</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>To Site</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-semibold text-gray-800 mb-8">
            <span>{asset.asset_move_tos?.[0]?.from?.location || '-'}</span>
            <span>{asset.asset_move_tos?.[0]?.to?.location || '-'}</span>
          </div>
        </div>
      </div>

      
      <div className="w-full lg:w-1/5 bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
            backgroundColor: '#C72030'
          }}>
            <User className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-semibold uppercase" style={{
            color: '#C72030'
          }}>Vendor Contact Details</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Name</div>
              <div className="font-medium">{asset.supplier_detail?.company_name || '-'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Mobile No.</div>
              <div className="font-medium">{asset.supplier_detail?.mobile1 || '-'}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Email ID</div>
            <div className="font-medium">{asset.supplier_detail?.email || '-'}</div>
          </div>
        </div>
      </div>
    </div> */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Movement Details */}
          <div className="w-full lg:w-full bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold uppercase" style={{ color: '#C72030' }}>Movement Details</h3>
            </div>

            <div className="space-y-6">
              {/* From Site and To Site */}
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>From Site</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>To Site</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold text-gray-800 mb-8">
                <span>{asset.asset_move_tos?.[0]?.from?.location || '-'}</span>
                <span>{asset.asset_move_tos?.[0]?.to?.location || '-'}</span>
              </div>


              {/* <div className="flex justify-between items-center relative">
       
        <div className="absolute top-6 flex justify-between w-full px-6">
          
          <div
            className="h-0.5 ml-6 mr-6"
            style={{ backgroundColor: '#C72030', width: 'calc(50% - 3rem)' }}
          ></div>
          
          <div
            className="h-0.5 ml-6 mr-6 bg-gray-300"
            style={{ width: 'calc(50% - 3rem)' }}
          ></div>
        </div>

        
        <div className="flex flex-col items-center relative z-10">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#C72030' }}>
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <div className="text-base font-semibold mb-2" style={{ color: '#C72030' }}>Requested</div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span>19/06/2025, 11:00 AM</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span>Abdul Ghaffar</span>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col items-center relative z-10">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#C72030' }}>
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <div className="text-base font-semibold mb-2" style={{ color: '#C72030' }}>Approved</div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span>20/06/2025, 11:10 AM</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <UserIcon className="w-4 h-4" />
              <span>Chetan Bafna</span>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col items-center relative z-10">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mb-4">
            <Box className="w-6 h-6 text-gray-500" />
          </div>
          <div className="text-center">
            <div className="text-base font-semibold text-gray-400 mb-2">Received</div>
            <div className="flex items-center gap-1 text-sm text-gray-400 mb-1">
              <Clock className="w-4 h-4" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <UserIcon className="w-4 h-4" />
              <span>Awaiting</span>
            </div>
          </div>
        </div>
      </div> */}
            </div>
          </div>

          {/* Vendor Contact Details */}

        </div>
      </TabsContent>

      <TabsContent value='analytics'>
        <AssetAnalyticsTab asset={asset} assetId={assetId} />
      </TabsContent>

    </Tabs>
  </div >;
};