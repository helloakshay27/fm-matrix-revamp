import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  Filter,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  RefreshCw,
  Settings,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data for energy consumption
const mockEnergyData = [
  {
    id: "EN001",
    location: "Building A - Floor 1",
    meterType: "Electric",
    currentReading: 1250.5,
    previousReading: 1200.0,
    consumption: 50.5,
    cost: 505.0,
    date: "2024-01-15",
    status: "Normal",
    peakUsage: 75.2,
    efficiency: 85,
  },
  {
    id: "EN002",
    location: "Building B - HVAC",
    meterType: "Electric",
    currentReading: 2150.8,
    previousReading: 2100.0,
    consumption: 50.8,
    cost: 508.0,
    date: "2024-01-15",
    status: "High",
    peakUsage: 95.5,
    efficiency: 72,
  },
  {
    id: "EN003",
    location: "Parking Garage",
    meterType: "Electric",
    currentReading: 850.2,
    previousReading: 820.0,
    consumption: 30.2,
    cost: 302.0,
    date: "2024-01-15",
    status: "Normal",
    peakUsage: 45.8,
    efficiency: 90,
  },
];

const calculateStats = (energyData: any[]) => {
  return {
    totalConsumption: energyData.reduce((sum, e) => sum + e.consumption, 0),
    totalCost: energyData.reduce((sum, e) => sum + e.cost, 0),
    avgEfficiency: energyData.reduce((sum, e) => sum + e.efficiency, 0) / energyData.length,
    highUsageAlerts: energyData.filter(e => e.status === "High").length,
    normalUsage: energyData.filter(e => e.status === "Normal").length,
    totalMeters: energyData.length,
    peakConsumption: Math.max(...energyData.map(e => e.consumption)),
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Normal": return "bg-green-100 text-green-800";
    case "High": return "bg-red-100 text-red-800";
    case "Low": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getEfficiencyColor = (efficiency: number) => {
  if (efficiency >= 85) return "bg-green-100 text-green-800";
  if (efficiency >= 70) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};

export const EnergyDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = calculateStats(mockEnergyData);
  const filteredEnergyData = mockEnergyData.filter(energy =>
    energy.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    energy.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddReading = () => {
    // navigate("/utility/energy/add-asset");
    navigate('/utility/energy/new-asset?type=energy');
  };

  const handleViewDetails = (energyId: string) => {
    navigate(`/utility/energy/details/${energyId}`);
  };

  const StatCard = ({ icon, label, value }: any) => (
    <div className="bg-[#f6f4ee] p-6 rounded-lg shadow-[0px_2px_18px_rgba(45,45,45,0.1)] flex items-center gap-4">
      <div className="w-14 h-14 bg-[#FBEDEC] rounded-full flex items-center justify-center">
        {React.cloneElement(icon, { className: `w-6 h-6 text-[#C72030]` })}
      </div>
      <div>
        <div className="text-2xl font-bold text-[#C72030]">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Zap className="w-4 h-4" />
            List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Settings className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Zap />} label="Total Consumption" value={`${stats.totalConsumption.toFixed(1)} kWh`} />
            <StatCard icon={<TrendingUp />} label="Total Cost" value={`$${stats.totalCost.toFixed(2)}`} />
            <StatCard icon={<Activity />} label="Avg Efficiency" value={`${stats.avgEfficiency.toFixed(1)}%`} />
            <StatCard icon={<TrendingDown />} label="High Usage Alerts" value={stats.highUsageAlerts} />
            <StatCard icon={<Zap />} label="Total Meters" value={stats.totalMeters} />
            <StatCard icon={<TrendingUp />} label="Peak Consumption" value={`${stats.peakConsumption.toFixed(1)} kWh`} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAddReading}
                className="bg-[#C72030] hover:bg-[#B01D2A] text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Reading
              </Button>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search energy data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meter ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Current Reading</TableHead>
                  <TableHead>Consumption</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Efficiency</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEnergyData.map((energy) => (
                  <TableRow key={energy.id}>
                    <TableCell className="font-medium">{energy.id}</TableCell>
                    <TableCell>{energy.location}</TableCell>
                    <TableCell>{energy.meterType}</TableCell>
                    <TableCell>{energy.currentReading.toFixed(1)} kWh</TableCell>
                    <TableCell>{energy.consumption.toFixed(1)} kWh</TableCell>
                    <TableCell>${energy.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(energy.status)}>
                        {energy.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEfficiencyColor(energy.efficiency)}>
                        {energy.efficiency}%
                      </Badge>
                    </TableCell>
                    <TableCell>{energy.date}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(energy.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Energy Consumption Overview</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Consumption:</span>
                  <span>{stats.totalConsumption.toFixed(1)} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span>${stats.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Efficiency:</span>
                  <span>{stats.avgEfficiency.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Peak Consumption:</span>
                  <span>{stats.peakConsumption.toFixed(1)} kWh</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Usage Status Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Normal Usage: {stats.normalUsage}</span>
                  <span>{((stats.normalUsage / stats.totalMeters) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>High Usage Alerts: {stats.highUsageAlerts}</span>
                  <span>{((stats.highUsageAlerts / stats.totalMeters) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Meters: {stats.totalMeters}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};