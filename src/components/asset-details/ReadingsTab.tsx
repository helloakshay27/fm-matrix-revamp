
// import React, { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { MaterialDatePicker } from '@/components/ui/material-date-picker';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// interface ReadingsTab {
//   asset: Asset;
//   assetId?: string | number;
// }
// interface Asset {
//   id: number;
//   name: string;
//   model_number: string;
//   serial_number: string;
//   purchase_cost: number;
//   purchased_on: string;
//   warranty: boolean;
//   warranty_expiry: string;
//   manufacturer: string;
//   asset_number: string;
//   asset_code: string;
//   group: string;
//   sub_group: string;
//   allocation_type: string;
//   depreciation_applicable: boolean;
//   depreciation_method: string;
//   useful_life: number;
//   salvage_value: number;
//   status: string;
//   current_book_value: number;
//   site_name: string;
//   commisioning_date: string;
//   vendor_name: string;
// }
// export const ReadingsTab: React.FC<ReadingsTab> = ({ asset, assetId }) => {
//   const [fromDate, setFromDate] = useState('2025-05-19');
//   const [toDate, setToDate] = useState('2025-06-17');

//   const handleApply = () => {
//     console.log('Apply date range:', { fromDate, toDate });
//   };

//   const handleReset = () => {
//     setFromDate('');
//     setToDate('');
//   };

//   const tableHeaders = [
//     'Particulars', 'UOM', 'MF', 'Balance',
//     '19 MAY', '20 MAY', '21 MAY', '22 MAY', '23 MAY', '24 MAY', '25 MAY', '26 MAY',
//     '27 MAY', '28 MAY', '29 MAY', '30 MAY', '31 MAY', '01 JUN', '02 JUN', '03 JUN', '04 JUN'
//   ];

//   // Filter Component that will be reused in both tabs
//   const DateRangeFilter = () => (
//     <div className="flex items-center gap-4 mb-6">
//       <div className="flex items-center gap-2">
//         <MaterialDatePicker
//           value={fromDate}
//           onChange={setFromDate}
//           placeholder="From Date"
//           className="w-48"
//         />
//         <span className="text-gray-500">-</span>
//         <MaterialDatePicker
//           value={toDate}
//           onChange={setToDate}
//           placeholder="To Date"
//           className="w-48"
//         />
//       </div>
//       <Button
//         onClick={handleApply}
//         className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
//       >
//         Apply
//       </Button>
//       <Button
//         onClick={handleReset}
//         variant="outline"
//         className="border-gray-300 text-gray-700 hover:bg-gray-50"
//       >
//         Reset
//       </Button>
//     </div>
//   );

//   // Consumption Table Component
//   const ConsumptionTable = () => (
//     <div>
//       <div className="flex items-center gap-2 mb-4">
//         <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
//           <span className="text-white text-xs" style={{ color: "#C72030" }}>✕</span>
//         </div>
//         <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Consumption</h3>
//       </div>

//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 {tableHeaders.map((header, index) => (
//                   <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 last:border-r-0">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-gray-100">
//               {/* Empty row for spacing */}
//               <tr>
//                 <td colSpan={tableHeaders.length} className="h-8"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   // Non Consumption Table Component
//   const NonConsumptionTable = () => (
//     <div>
//       <div className="flex items-center gap-2 mb-4">
//         <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
//           <span className="text-white text-xs" style={{ color: "#C72030" }}>✕</span>
//         </div>
//         <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">Non Consumption</h3>
//       </div>

//       <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 {tableHeaders.map((header, index) => (
//                   <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap border-r border-gray-200 last:border-r-0">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-gray-100">
//               {/* Empty row for spacing */}
//               <tr>
//                 <td colSpan={tableHeaders.length} className="h-8"></td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       <Tabs defaultValue="consumption" style={{ width: "100%" }} className="w-full">
//         <TabsList className="w-full mb-6">
//           <TabsTrigger 
//             value="consumption" 
//             className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
//           >
//             Consumption
//           </TabsTrigger>
//           <TabsTrigger 
//             value="non-consumption" 
//             className="w-full data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black"
//           >
//             Non Consumption
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="consumption" className="space-y-6 mt-6">
//           <DateRangeFilter />
//           <div className="text-sm text-gray-600">
//             (Maximum allowed days are 30)
//           </div>
//           <ConsumptionTable />
//         </TabsContent>

//         <TabsContent value="non-consumption" className="space-y-6 mt-6">
//           <DateRangeFilter />
//           <div className="text-sm text-gray-600">
//             (Maximum allowed days are 30)
//           </div>
//           <NonConsumptionTable />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface ReadingsTab {
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
}

interface ApiResponse {
  start_date: string;
  end_date: string;
  date_headers: { date: string; formatted: string }[];
  consumptions: { name: string; uom: string; data: { [key: string]: number } }[];
  non_consumptions: { name: string; uom: string; data: { [key: string]: number } }[];
}

export const ReadingsTab: React.FC<ReadingsTab> = ({ asset, assetId }) => {
  const getDefaultDates = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date: Date) => {
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${mm}/${dd}/${yyyy}`;
    };

    return {
      defaultFromDate: formatDate(thirtyDaysAgo),
      defaultToDate: formatDate(today),
    };
  };

  const { defaultFromDate, defaultToDate } = getDefaultDates();
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toDatePickerFormat = (date: string) => {
    if (!date) return '';
    const [mm, dd, yyyy] = date.split('/');
    return `${yyyy}-${mm}-${dd}`;
  };

  const fromDatePickerFormat = (date: string) => {
    if (!date) return '';
    const [yyyy, mm, dd] = date.split('-');
    return `${mm}/${dd}/${yyyy}`;
  };

  const fetchReadings = async () => {
    if (!assetId || !fromDate || !toDate) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl');

      if (!token || !baseUrl) {
        setError('Authentication token or base URL not found');
        setLoading(false);
        return;
      }

      const formatDate = (date: string) => {
        if (!date) return '';
        if (date.includes('-')) {
          const [yyyy, mm, dd] = date.split('-');
          return `${mm}/${dd}/${yyyy}`;
        }
        return date;
      };

      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);

      const url = `https://${baseUrl}/pms/assets/${assetId}/readings_json.json?access_token=${token}&readings_date_range=${formattedFromDate} - ${formattedToDate}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch data');

      const data: ApiResponse = await response.json();
      setApiData(data);
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [assetId, fromDate, toDate]);

  const handleApply = () => {
    fetchReadings();
    console.log('Apply date range:', { fromDate, toDate });
  };

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setApiData(null);
  };

  const tableHeaders = [
    'Particulars',
    'UOM',
    'MF',
    'Balance',
    ...(apiData?.date_headers?.map((header) => header.formatted) || []),
  ];

  const DateRangeFilter = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 min-w-fit">Date Range:</label>
          <input
            type="date"
            value={toDatePickerFormat(fromDate)}
            onChange={(e) => setFromDate(fromDatePickerFormat(e.target.value))}
            className="w-48 h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-gray-700 bg-white"
          />
          <span className="text-gray-500 font-medium">to</span>
          <input
            type="date"
            value={toDatePickerFormat(toDate)}
            onChange={(e) => setToDate(fromDatePickerFormat(e.target.value))}
            className="w-48 h-11 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C72030] focus:border-transparent text-gray-700 bg-white"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleApply} 
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-11 px-6 font-medium"
          >
            Apply
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 h-11 px-6 font-medium"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );

  const TableComponent = ({
    title,
    data,
  }: {
    title: string;
    data: { name: string; uom: string; data: { [key: string]: number } }[];
  }) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3]">
          <span className="text-white text-xs" style={{ color: '#C72030' }}>
            ✕
          </span>
        </div>
        <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">{title}</h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full min-w-max table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="w-48 px-4 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Particulars
                </th>
                <th className="w-20 px-4 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  UOM
                </th>
                <th className="w-16 px-4 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  MF
                </th>
                <th className="w-24 px-4 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Balance
                </th>
                {apiData?.date_headers?.map((header, index) => (
                  <th
                    key={index}
                    className="w-24 px-3 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                  >
                    {header.formatted}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="px-4 py-12 text-center text-gray-500 text-lg">
                    No data available for the selected date range
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200 truncate" title={item.name || '-'}>
                      {item.name || '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-900 border-r border-gray-200">
                      {item.uom || '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-900 border-r border-gray-200">
                      -
                    </td>
                    <td className="px-4 py-4 text-sm text-center text-gray-900 border-r border-gray-200">
                      -
                    </td>
                    {apiData?.date_headers?.map((header, idx) => (
                      <td key={idx} className="px-3 py-4 text-sm text-center text-gray-900 border-r border-gray-200 last:border-r-0">
                        {item.data && header.date ? (
                          <span className={`${item.data[header.date] > 0 ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                            {item.data[header.date] ?? '-'}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    )) || []}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-center text-red-600 font-medium">{error}</div>
        </div>
      )}
      <Tabs defaultValue="consumption" className="w-full">
        <TabsList className="w-full mb-8 h-12">
          <TabsTrigger
            value="consumption"
            className="w-full h-10 text-base data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black font-medium"
          >
            Consumption
          </TabsTrigger>
          <TabsTrigger
            value="non-consumption"
            className="w-full h-10 text-base data-[state=active]:bg-[#EDEAE3] bg-[#FFFFFF] data-[state=active]:text-[#C72030] text-black font-medium"
          >
            Non Consumption
          </TabsTrigger>
        </TabsList>

        <TabsContent value="consumption" className="space-y-6 mt-8">
          <DateRangeFilter />
          {/* <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
            <span className="font-medium">Note:</span> Maximum allowed days are 30
          </div> */}
          <TableComponent title="Consumption" data={apiData?.consumptions || []} />
        </TabsContent>

        <TabsContent value="non-consumption" className="space-y-6 mt-8">
          <DateRangeFilter />
          {/* <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
            <span className="font-medium">Note:</span> Maximum allowed days are 30
          </div> */}
          <TableComponent title="Non Consumption" data={apiData?.non_consumptions || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
