
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
    <div className="space-y-6 lg:space-y-8">
      {/* Depreciation Rule */}
      <Card className="w-full">
        <CardHeader className="pb-4 lg:pb-6">
          <CardTitle className="flex items-center gap-2 text-[#C72030] text-lg lg:text-xl">
            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
            <span>DEPRECIATION RULE</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="space-y-2">
              <label className="text-sm text-gray-500 font-medium">Method Name</label>
              <div className="font-semibold text-base lg:text-lg">Straight Line</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500 font-medium">Useful Life</label>
              <div className="font-semibold text-base lg:text-lg">5 Years</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500 font-medium">Salvage Value</label>
              <div className="font-semibold text-base lg:text-lg">₹20,000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Depreciation Table */}
        <div className="xl:col-span-2 w-full">
          <Card className="h-full">
            <CardHeader className="pb-4 lg:pb-6">
              <CardTitle className="flex items-center gap-2 text-[#C72030] text-lg lg:text-xl">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
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
                          <TableCell className="text-sm">₹{row.bookValueStart.toLocaleString()}</TableCell>
                          <TableCell className="text-sm">₹{row.depreciation.toLocaleString()}</TableCell>
                          <TableCell className="text-sm">{row.date}</TableCell>
                          <TableCell className="text-sm">₹{row.bookValueEnd.toLocaleString()}</TableCell>
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
              <CardTitle className="flex items-center gap-2 text-[#C72030] text-lg lg:text-xl">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
                <span className="text-sm lg:text-base">ACTUAL COST CALCULATOR</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="text-sm">
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
                  <SelectTrigger className="text-sm">
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
              <div className="bg-gray-50 p-4 lg:p-5 rounded-lg">
                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="font-medium text-gray-600 p-1 text-xs">{day}</div>
                  ))}
                </div>
                {calendarDays.map((week, weekIndex) => (
                  <div key={weekIndex} className="grid grid-cols-7 gap-1 text-center text-sm">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`p-2 lg:p-2.5 rounded text-sm cursor-pointer transition-colors ${
                          day === 17 
                            ? 'bg-orange-500 text-white font-medium' 
                            : dayIndex === 6 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {day}
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
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900">₹ 00,000</div>
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
          <CardTitle className="flex items-center gap-2 text-[#C72030] text-lg lg:text-xl">
            <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-xs">●</div>
            <span>BOOK VALUE GRAPH</span>
            <span className="text-sm lg:text-base font-normal text-gray-600">(YEARLY STATS)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-2 sm:px-6">
          <div className="h-80 lg:h-96 w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData} 
                  margin={{ 
                    top: 20, 
                    right: 60, 
                    left: 60, 
                    bottom: 40 
                  }}
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
                    domain={[0, 100000]}
                    tickFormatter={(value) => `${value/1000}K`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    dx={-10}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Book Value']}
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
