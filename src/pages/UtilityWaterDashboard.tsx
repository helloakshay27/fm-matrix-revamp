
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, RefreshCw, Download, QrCode, Filter, Search } from "lucide-react";

const UtilityWaterDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const mockAssets = [
    {
      id: "WTR001",
      assetName: "Water Pump Station 1",
      assetCode: "WPS-001",
      assetNo: "001",
      status: "Active",
      equipmentId: "EQ-WTR-001",
      site: "Building A",
      building: "Main Block",
      wing: "North",
      floor: "Ground",
      area: "Utility Room",
      room: "UR-01",
      meterType: "Flow Meter",
      assetType: "Water System"
    },
    {
      id: "WTR002",
      assetName: "Water Tank Monitor",
      assetCode: "WTM-002",
      assetNo: "002",
      status: "In Use",
      equipmentId: "EQ-WTR-002",
      site: "Building B",
      building: "Secondary Block",
      wing: "South",
      floor: "First",
      area: "Tank Room",
      room: "TR-01",
      meterType: "Level Sensor",
      assetType: "Monitoring"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        Assets &gt; Asset List
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold">ASSET LIST</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-500 text-xs font-bold">0</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-90">Total Asset</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-green-500 text-xs font-bold">0</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-90">In Use</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-700 to-red-800 text-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-full">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-red-700 text-xs font-bold">0</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm opacity-90">Breakdown</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
        <Button variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Update
        </Button>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
        <Button variant="outline">
          <QrCode className="w-4 h-4 mr-2" />
          Print QR
        </Button>
        <Button variant="outline" className="bg-gray-600 text-white hover:bg-gray-700">
          In-Active Assets
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <div className="flex items-center space-x-2 ml-auto">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button className="bg-green-600 hover:bg-green-700">
            Go!
          </Button>
        </div>
      </div>

      {/* Assets Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" />
                </TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Asset Name</TableHead>
                <TableHead>Asset ID</TableHead>
                <TableHead>Asset Code</TableHead>
                <TableHead>Asset No.</TableHead>
                <TableHead>Asset Status</TableHead>
                <TableHead>Equipment Id</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Wing</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Meter Type</TableHead>
                <TableHead>Asset Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Search className="w-4 h-4" />
                    </Button>
                  </TableCell>
                  <TableCell>{asset.assetName}</TableCell>
                  <TableCell>{asset.id}</TableCell>
                  <TableCell>{asset.assetCode}</TableCell>
                  <TableCell>{asset.assetNo}</TableCell>
                  <TableCell>
                    <Badge variant={asset.status === "Active" ? "default" : "secondary"}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{asset.equipmentId}</TableCell>
                  <TableCell>{asset.site}</TableCell>
                  <TableCell>{asset.building}</TableCell>
                  <TableCell>{asset.wing}</TableCell>
                  <TableCell>{asset.floor}</TableCell>
                  <TableCell>{asset.area}</TableCell>
                  <TableCell>{asset.room}</TableCell>
                  <TableCell>{asset.meterType}</TableCell>
                  <TableCell>{asset.assetType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UtilityWaterDashboard;
