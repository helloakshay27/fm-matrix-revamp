
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export const DepreciationTab = () => {
  const [selectedMonth, setSelectedMonth] = useState('February');
  const [selectedYear, setSelectedYear] = useState('2022');

  const depreciationData = [
    { year: 1, bookValueStart: 100000, depreciation: 16000, date: '01/02/2020', bookValueEnd: 84000 },
    { year: 2, bookValueStart: 84000, depreciation: 16000, date: '01/02/2021', bookValueEnd: 68000 },
    { year: 3, bookValueStart: 68000, depreciation: 16000, date: '01/02/2022', bookValueEnd: 52000 },
    { year: 4, bookValueStart: 52000, depreciation: 16000, date: '01/02/2023', bookValueEnd: 36000 },
    { year: 5, bookValueStart: 36000, depreciation: 16000, date: '01/02/2024', bookValueEnd: 20000 }
  ];

  const chartData = [
    { year: '2020', value: 80000, color: '#FF8C00' },
    { year: '2021', value: 68000, color: '#FF8C00' },
    { year: '2022', value: 48000, color: '#C72030' },
    { year: '2023', value: 35000, color: '#C72030' },
    { year: '2024', value: 19000, color: '#00C896' }
  ];

  const chartConfig = {
    value: {
      label: 'Book Value',
      color: '#C72030'
    }
  };

  const calendarDays = [
    [31, 1, 2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25, 26, 27],
    [28, 1, 2, 3, 4, 5, 6]
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Depreciation Rule */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-[#C72030] text-base sm:text-lg">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
            <span className="text-sm sm:text-base">DEPRECIATION RULE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            <div className="space-y-1">
              <label className="text-xs sm:text-sm text-gray-500">Method Name</label>
              <div className="font-semibold text-sm sm:text-base">Straight Line</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm text-gray-500">Useful Life</label>
              <div className="font-semibold text-sm sm:text-base">5 Years</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs sm:text-sm text-gray-500">Salvage Value</label>
              <div className="font-semibold text-sm sm:text-base">₹20,000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Depreciation Table */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-[#C72030] text-base sm:text-lg">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
                <span className="text-sm sm:text-base">DEPRECIATION TABLE</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <div className="min-w-[600px] px-2 sm:px-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Year</TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Book Value
                          <div className="text-xs text-gray-500 font-normal">(Beginning)</div>
                        </TableHead>
                        <TableHead className="text-xs sm:text-sm">Depreciation</TableHead>
                        <TableHead className="text-xs sm:text-sm">Date</TableHead>
                        <TableHead className="text-xs sm:text-sm">
                          Book Value
                          <div className="text-xs text-gray-500 font-normal">(End)</div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depreciationData.map((row) => (
                        <TableRow key={row.year}>
                          <TableCell className="text-xs sm:text-sm">{row.year}</TableCell>
                          <TableCell className="text-xs sm:text-sm">₹{row.bookValueStart.toLocaleString()}</TableCell>
                          <TableCell className="text-xs sm:text-sm">₹{row.depreciation.toLocaleString()}</TableCell>
                          <TableCell className="text-xs sm:text-sm">{row.date}</TableCell>
                          <TableCell className="text-xs sm:text-sm">₹{row.bookValueEnd.toLocaleString()}</TableCell>
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
        <div>
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-[#C72030] text-base sm:text-lg">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
                <span className="text-sm sm:text-base">ACTUAL COST CALCULATOR</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
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
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Calendar */}
              <div className="bg-gray-50 p-2 sm:p-4 rounded-lg">
                <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm mb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="font-medium text-gray-600 p-1 text-xs">{day}</div>
                  ))}
                </div>
                {calendarDays.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`p-1 sm:p-2 rounded text-xs sm:text-sm ${
                          day === 17 
                            ? 'bg-orange-500 text-white' 
                            : dayIndex === 6 
                              ? 'text-red-500' 
                              : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="text-right space-y-2">
                <div className="text-xs sm:text-sm text-gray-500">
                  Actual Cost Calculator is used to calculate the projected amount you would get for a particular date selected.
                </div>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">ACTUAL COST</div>
                  <div className="text-lg sm:text-2xl font-bold">₹ 00,000</div>
                  <div className="w-full h-1 bg-[#C72030] mt-1"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Book Value Graph */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-[#C72030] text-base sm:text-lg">
            <div className="w-4 h-4 sm:w-6 sm:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
            <span className="text-sm sm:text-base">BOOK VALUE GRAPH</span>
            <span className="text-xs sm:text-sm font-normal">(YEARLY STATS)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-64 sm:h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    domain={[0, 100000]}
                    tickFormatter={(value) => `${value/1000}K`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11 }}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Book Value']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#C72030"
                    strokeWidth={2}
                    dot={{ fill: '#C72030', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#C72030' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-2 sm:mt-4 text-center">
            <div className="text-xs sm:text-sm text-gray-500">Year</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
