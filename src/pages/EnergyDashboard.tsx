import React, { useState, useEffect } from "react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
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
import { AssetDataTable } from "@/components/AssetDataTable";

const transformEnergyAsset = (asset, index, currentPage) => ({
  id: asset.id?.toString() || "",
  name: asset.name || asset.location || "",
  serialNumber: (currentPage - 1) * 15 + index + 1,
  assetNumber: asset.asset_number || asset.id || "",
  status:
    asset.status === "in_use" || asset.status === "in use"
      ? "in_use"
      : asset.status === "breakdown"
        ? "breakdown"
        : asset.status === "disposed"
          ? "disposed"
          : "in_storage",
  siteName: asset.site_name || asset.location?.split(" - ")[0] || "",
  building: typeof asset.building === 'string' ? { name: asset.building } : asset.building || null,
  wing: typeof asset.wing === 'string' ? { name: asset.wing } : asset.wing || null,
  area: typeof asset.area === 'string' ? { name: asset.area } : asset.area || null,
  pmsRoom: typeof asset.room === 'string' ? { name: asset.room } : asset.room || null,
  assetGroup: asset.meter_type || asset.meterType || "",
  assetSubGroup: asset.asset_type || "",
  assetType: false,
  purchaseCost: asset.purchase_cost || asset.cost,
  currentBookValue: asset.current_book_value || null,
  floor: typeof asset.floor === 'string' ? { name: asset.floor } : asset.floor || null,
  category: asset.meter_type || asset.meterType || "Energy Asset",
});

const calculateStats = (energyData = []) => {
  return {
    totalConsumption: energyData.reduce((sum, e) => sum + (e.consumption || 0), 0),
    totalCost: energyData.reduce((sum, e) => sum + (e.cost || 0), 0),
    avgEfficiency: energyData.length ? energyData.reduce((sum, e) => sum + (e.efficiency || 0), 0) / energyData.length : 0,
    highUsageAlerts: energyData.filter(e => e.status === "High" || e.status === "breakdown").length,
    normalUsage: energyData.filter(e => e.status === "Normal" || e.status === "in_use" || e.status === "in use").length,
    totalMeters: energyData.length,
    peakConsumption: Math.max(...energyData.map(e => e.consumption || 0)),
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
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [energyAssets, setEnergyAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      setError("");
      try {
        let baseUrl = localStorage.getItem('baseUrl');
        const token = localStorage.getItem('token');
        if (!baseUrl || !token) {
          throw new Error("Base URL or token not set in localStorage");
        }
        // Ensure protocol is present
        if (!/^https?:\/\//i.test(baseUrl)) {
          baseUrl = `https://${baseUrl}`;
        }
        let url = `${baseUrl}/pms/assets.json?page=${currentPage}&type=Energy`;
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error("Failed to fetch energy assets");
        const data = await response.json();
        setEnergyAssets(data.assets || []);
        setTotalCount(data.total_count || 0);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError(err.message || "Error fetching energy assets");
        setEnergyAssets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [currentPage, searchTerm]);

  const filteredEnergyAssets = energyAssets.filter(asset =>
    (asset.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (asset.id?.toString() || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayAssets = filteredEnergyAssets.map((asset, idx) => transformEnergyAsset(asset, idx, currentPage));
  const stats = calculateStats(filteredEnergyAssets);

  // AssetDataTable handlers
  const visibleColumns = {
    actions: true,
    serialNumber: true,
    assetName: true,
    assetId: true,
    assetNo: true,
    assetStatus: true,
    site: true,
    building: false,
    wing: false,
    floor: false,
    area: false,
    room: false,
    meterType: true,
    assetType: true,
    category: true,
  };

  const handleAddReading = () => {
    navigate('/utility/energy/add-asset?type=energy');
  };
  const handleViewAsset = (assetId: string) => {
    navigate(`/maintenance/asset/details/${assetId}?type=Energy`);
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(displayAssets.map((asset) => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };
  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets((prev) => [...prev, assetId]);
    } else {
      setSelectedAssets((prev) => prev.filter((id) => id !== assetId));
    }
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
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

          {/* <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
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
          </div> */}

          {/* Asset Data Table (like Water/STP) */}
          <div>
            <AssetDataTable
              assets={displayAssets}
              selectedAssets={selectedAssets}
              visibleColumns={visibleColumns}
              onSelectAll={handleSelectAll}
              onSelectAsset={handleSelectAsset}
              onViewAsset={handleViewAsset}
              handleAddAsset={handleAddReading}
              handleAddSchedule={() => { }}
              handleImport={() => { }}
              onFilterOpen={() => { }}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </TabsContent>

        {/* Pagination - same as Water/STP dashboard */}
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setCurrentPage(1)}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              {currentPage > 4 && (
                <PaginationItem>
                  <span className="px-4 py-2">...</span>
                </PaginationItem>
              )}
              {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                .filter((page) => page > 1 && page < totalPages)
                .map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <span className="px-4 py-2">...</span>
                </PaginationItem>
              )}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center mt-2 text-sm text-gray-600">
            Showing page {currentPage} of {totalPages} ({totalCount} total energy assets)
          </div>
        </div>

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