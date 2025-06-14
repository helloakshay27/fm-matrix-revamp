
import React from 'react';
import { Import, Download, Filter, Edit } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UtilityDailyReadingsDashboard = () => {
  const mockData = [
    {
      id: "1637136",
      assetName: "Diesel Generator",
      parameterName: "Diesel Generator KWH",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1637137",
      assetName: "Diesel Generator",
      parameterName: "DG Voltage ( R )",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1637138",
      assetName: "Diesel Generator",
      parameterName: "DG Voltage ( Y )",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1637139",
      assetName: "Diesel Generator",
      parameterName: "DG Voltage ( B )",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1637140",
      assetName: "Diesel Generator",
      parameterName: "Diesel Generator Running Hours",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1637141",
      assetName: "Diesel Generator",
      parameterName: "Coolant temp.",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1637142",
      assetName: "Diesel Generator",
      parameterName: "DG Start Time",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1637143",
      assetName: "Diesel Generator",
      parameterName: "DG Stop Time",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-09-02"
    },
    {
      id: "1259009",
      assetName: "Diesel Generator",
      parameterName: "Diesel Generator KWH",
      opening: "0.0",
      reading: "1.0",
      consumption: "1.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1259010",
      assetName: "Diesel Generator",
      parameterName: "DG Voltage ( R )",
      opening: "0.0",
      reading: "2.0",
      consumption: "2.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1259011",
      assetName: "Diesel Generator",
      parameterName: "DG Voltage ( Y )",
      opening: "0.0",
      reading: "3.0",
      consumption: "3.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1259012",
      assetName: "Diesel Generator",
      parameterName: "DG Voltage ( B )",
      opening: "0.0",
      reading: "4.0",
      consumption: "4.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1259013",
      assetName: "Diesel Generator",
      parameterName: "Diesel Generator Running Hours",
      opening: "0.0",
      reading: "5.0",
      consumption: "5.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1259014",
      assetName: "Diesel Generator",
      parameterName: "Coolant temp.",
      opening: "0.0",
      reading: "2.0",
      consumption: "2.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1259015",
      assetName: "Diesel Generator",
      parameterName: "DG Start Time",
      opening: "0.0",
      reading: "2.0",
      consumption: "2.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1259016",
      assetName: "Diesel Generator",
      parameterName: "DG Stop Time",
      opening: "0.0",
      reading: "2.0",
      consumption: "2.0",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    },
    {
      id: "1258301",
      assetName: "Diesel Generator 2",
      parameterName: "Diesel Generator KWH",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-03"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <nav className="text-sm text-gray-600 mb-2">
          Home &gt; Utility &gt; Daily Readings
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">DAILY READINGS</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Import className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" className="border-gray-300">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Action</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Asset name</TableHead>
              <TableHead>Parameter Name</TableHead>
              <TableHead>Opening</TableHead>
              <TableHead>Reading</TableHead>
              <TableHead>Consumption</TableHead>
              <TableHead>Total Consumption</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.assetName}</TableCell>
                <TableCell>{item.parameterName}</TableCell>
                <TableCell>{item.opening}</TableCell>
                <TableCell>{item.reading}</TableCell>
                <TableCell>{item.consumption}</TableCell>
                <TableCell>{item.totalConsumption}</TableCell>
                <TableCell>{item.customerName}</TableCell>
                <TableCell>{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UtilityDailyReadingsDashboard;
