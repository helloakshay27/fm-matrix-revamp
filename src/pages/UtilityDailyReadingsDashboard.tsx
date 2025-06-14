
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Download, Filter, Edit } from "lucide-react";

const UtilityDailyReadingsDashboard = () => {
  const mockReadings = [
    {
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
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
      action: "edit",
      id: "1258301",
      assetName: "Diesel Generator 2",
      parameterName: "Diesel Generator KWH",
      opening: "0.0",
      reading: "",
      consumption: "",
      totalConsumption: "",
      customerName: "",
      date: "2023-07-01"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">DAILY READINGS</h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Daily Readings Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
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
              {mockReadings.map((reading) => (
                <TableRow key={reading.id}>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{reading.id}</TableCell>
                  <TableCell>{reading.assetName}</TableCell>
                  <TableCell>{reading.parameterName}</TableCell>
                  <TableCell>{reading.opening}</TableCell>
                  <TableCell>{reading.reading}</TableCell>
                  <TableCell>{reading.consumption}</TableCell>
                  <TableCell>{reading.totalConsumption}</TableCell>
                  <TableCell>{reading.customerName}</TableCell>
                  <TableCell>{reading.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityDailyReadingsDashboard;
