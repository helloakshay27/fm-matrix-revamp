
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Settings } from 'lucide-react';
interface DepreciationTab {
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
}

interface DepreciationTabProps {
  asset: Asset;
}
export const DepreciationTab: React.FC<DepreciationTab> = ({ asset, assetId }) => {
  const currentDate = new Date();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [depreciationData, setDepreciationData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [actualCost, setActualCost] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());

  const chartConfig = {
    value: {
      label: 'Book Value',
      color: '#C72030'
    }
  };

  // Function to get calendar days for the selected month and year
  const getCalendarDays = (month: string, year: string) => {
    const monthIndex = new Date(`${month} 1, 2000`).getMonth();
    const firstDay = new Date(parseInt(year), monthIndex, 1);
    const lastDay = new Date(parseInt(year), monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const weeks = [];
    let currentWeek = [];

    // Add empty cells for days before the first day of the month
    const startDay = startingDay === 0 ? 6 : startingDay - 1; // Convert Sunday (0) to be last (6)
    for (let i = 0; i < startDay; i++) {
      const prevMonth = monthIndex === 0 ? 11 : monthIndex - 1;
      const prevYear = monthIndex === 0 ? parseInt(year) - 1 : parseInt(year);
      const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();
      currentWeek.push({
        day: prevMonthDays - startDay + i + 1,
        isCurrentMonth: false
      });
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day: day,
        isCurrentMonth: true
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill the last week with days from next month
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push({
        day: currentWeek.length - startDay + 1,
        isCurrentMonth: false
      });
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const calendarDays = getCalendarDays(selectedMonth, selectedYear);

  function getApiDate(day: number, month: string, year: string) {
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;
    return `${day.toString().padStart(2, '0')}/${monthIndex.toString().padStart(2, '0')}/${year}`;
  }

  // Fetch depreciation data
  useEffect(() => {
    const fetchDepreciationData = async () => {
      try {
        const monthIndex = new Date(`${selectedMonth} 1, 2000`).getMonth() + 1;
        const formattedDate = `21/${monthIndex.toString().padStart(2, '0')}/${selectedYear}`;
        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/depreciations/calculate`,
          {
            params: {
              id: assetId,
              date: formattedDate,
            },
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );

        const mapped = (response.data.depreciation_details || []).map((row: any) => ({
          year: row.year,
          bookValueStart: row.book_value_beginning,
          depreciation: row.depreciation,
          date: row.date,
          bookValueEnd: row.book_value_end,
        }));

        setDepreciationData(mapped);

        // Set chart data based on bookValueEnd
        setChartData(
          mapped.map((item) => ({
            year: item.year,
            value: item.bookValueEnd,
          }))
        );
      } catch (error) {
        console.error("Error fetching depreciation data:", error);
        setDepreciationData([]);
        setChartData([]);
      }
    };

    if (assetId) {
      fetchDepreciationData();
    }
  }, [assetId, selectedMonth, selectedYear]);

  // Fetch actual cost when day, month, or year changes
  useEffect(() => {
    const fetchActualCost = async () => {
      if (!assetId) return;

      try {
        const apiDate = getApiDate(selectedDay, selectedMonth, selectedYear);
        console.log("Fetching actual cost for date:", apiDate);

        const response = await axios.get(
          `${API_CONFIG.BASE_URL}/pms/depreciation_calculator.json`,
          {
            params: {
              id: assetId,
              date: apiDate,
            },
            headers: {
              Authorization: getAuthHeader(),
            },
          }
        );

        console.log("Actual cost response:", response.data);
        setActualCost(Number(response.data) || 0);
      } catch (error) {
        console.error("Error fetching actual cost:", error);
        setActualCost(0);
      }
    };

    fetchActualCost();
  }, [assetId, selectedDay, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Depreciation Rule */}
      <Card className="w-full">
        <CardHeader className="pb-4 lg:pb-6">
          <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
              <Settings className="w-6 h-6 text-[#C72030]" />
            </div>
            <span>DEPRECIATION RULE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-2">
              <label className="text-sm text-gray-500 font-medium">Method Name</label>
              <div className="font-semibold text-base lg:text-lg">
                {asset.depreciation_method
                  ? asset.depreciation_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                  : '-'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500 font-medium">Useful Life</label>
              <div className="font-semibold text-base lg:text-lg">
                {asset.useful_life ? `${asset.useful_life} Years` : '-'}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500 font-medium">Salvage Value</label>
              <div className="font-semibold text-base lg:text-lg">
                {asset.salvage_value !== undefined && asset.salvage_value !== null
                  ? `${localStorage.getItem('currency')}${asset.salvage_value.toLocaleString()}`
                  : '-'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Depreciation Table */}
        <div className="xl:col-span-2 w-full">
          <Card className="h-full">
            <CardHeader className="pb-4 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
                  <Settings className="w-6 h-6 text-[#C72030]" />
                </div>
                <span>DEPRECIATION TABLE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="w-full overflow-x-auto">
                <div className="min-w-[640px] lg:min-w-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-sm font-semibold">Year</TableHead>
                        <TableHead className="text-sm font-semibold">
                          Book Value
                          <div className="text-xs text-gray-500 font-normal">(Beginning)</div>
                        </TableHead>
                        <TableHead className="text-sm font-semibold">Depreciation</TableHead>
                        <TableHead className="text-sm font-semibold">Date</TableHead>
                        <TableHead className="text-sm font-semibold">
                          Book Value
                          <div className="text-xs text-gray-500 font-normal">(End)</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depreciationData.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="text-sm font-medium">{row.year}</TableCell>
                          <TableCell className="text-sm">{localStorage.getItem('currency')}{row.bookValueStart.toLocaleString()}</TableCell>
                          <TableCell className="text-sm">{localStorage.getItem('currency')}{row.depreciation.toLocaleString()}</TableCell>
                          <TableCell className="text-sm">{row.date}</TableCell>
                          <TableCell className="text-sm">{localStorage.getItem('currency')}{row.bookValueEnd.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actual Cost Calculator */}
        <div className="w-full">
          <Card className="h-full">
            <CardHeader className="pb-4 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
                <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
                  <Settings className="w-6 h-6 text-[#C72030]" />
                </div>
                <span>ACTUAL COST CALCULATOR</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {/* Month and Year Selects */}
                <Select value={selectedMonth} onValueChange={val => { setSelectedMonth(val); setSelectedDay(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="March">March</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="June">June</SelectItem>
                    <SelectItem value="July">July</SelectItem>
                    <SelectItem value="August">August</SelectItem>
                    <SelectItem value="September">September</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                    <SelectItem value="November">November</SelectItem>
                    <SelectItem value="December">December</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={val => { setSelectedYear(val); setSelectedDay(1); }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 21 }, (_, i) => {
                      const year = (2015 + i).toString();
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              <div className="bg-gray-50 p-4 lg:p-5 rounded-lg">
                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="font-medium text-gray-600 p-1 text-xs">{day}</div>
                  ))}
                </div>
                {calendarDays.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1 text-center text-sm">
                    {week.map((dayObj, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`p-2 lg:p-2.5 rounded text-sm cursor-pointer transition-colors ${dayObj.day === selectedDay && dayObj.isCurrentMonth
                          ? 'bg-[#C72030] text-white'
                          : !dayObj.isCurrentMonth
                            ? 'text-gray-300 hover:bg-gray-100'
                            : dayIndex === 6
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-gray-700 hover:bg-gray-200'
                          }`}
                        onClick={() => dayObj.isCurrentMonth && setSelectedDay(dayObj.day)}
                      >
                        {dayObj.day}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="text-sm text-gray-500 leading-relaxed">
                  Actual Cost Calculator is used to calculate the projected amount you would get for a particular date selected.
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">ACTUAL COST</div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {localStorage.getItem('currency')} {actualCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="w-full h-1 bg-[#C72030] mt-2 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Book Value Graph */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-4 lg:pb-6">
          <CardTitle className="flex items-center gap-2 text-[#1A1A1A] text-lg lg:text-xl">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs">
              <Settings className="w-6 h-6 text-[#C72030]" />
            </div>
            <span>BOOK VALUE GRAPH</span>
            <span className="text-sm lg:text-base font-normal text-gray-600">(YEARLY STATS)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-2 sm:px-6">
          <div className="min-h-[320px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 40 }} // reduced margins
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    domain={['auto', 'auto']} // let Y-axis auto-scale
                    tickFormatter={(value) => `${localStorage.getItem('currency')}${(value / 1000).toFixed(0)}K`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    dx={-10}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${localStorage.getItem('currency')}${value.toLocaleString()}`, 'Book Value']}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#C72030"
                    strokeWidth={3}
                    dot={{ fill: '#C72030', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#C72030', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-500 font-medium">Year</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
