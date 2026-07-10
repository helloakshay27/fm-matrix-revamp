import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Trash,
  Edit,
  Package,
  User,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  fetchWasteGenerationById,
  WasteGeneration,
} from "../services/wasteGenerationAPI";
import { useDynamicPermissions } from "@/hooks/useDynamicPermissions";

export const WasteGenerationDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const [wasteData, setWasteData] = useState<WasteGeneration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("waste-details");

  const hasData = (value: string | number | null | undefined | object) => {
    if (typeof value === "object" && value !== null) {
      return true;
    }
    return (
      value &&
      value !== null &&
      value !== undefined &&
      value !== "" &&
      value !== "NA" &&
      value !== "N/A"
    );
  };

  useEffect(() => {
    const fetchWasteDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const wasteGeneration = await fetchWasteGenerationById(parseInt(id));

        setWasteData(wasteGeneration);
      } catch (err) {
        console.error("Error fetching waste generation details:", err);
        setError("Failed to fetch waste generation details");
      } finally {
        setLoading(false);
      }
    };

    fetchWasteDetails();
  }, [id]);

  const handleBackToList = () => {
    navigate("/maintenance/waste/generation");
  };

  const handleUpdate = () => {
    navigate(`/maintenance/waste/generation/edit/${id}`, {
      state: {
        from: "details",
        returnTo: `/maintenance/waste/generation/${id}`,
      },
    });
  };

  const handleDelete = () => {
    toast.info("Delete functionality not yet implemented.");
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading waste generation details...</div>
        </div>
      </div>
    );
  }

  if (error || !wasteData) {
    return (
      <div className="p-6 bg-white min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">
            {error || "Waste generation record not found"}
          </div>
        </div>
      </div>
    );
  }

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | number | null | undefined;
  }) =>
    hasData(value) && (
      <div className="flex items-start">
        <span className="text-gray-500 w-40 flex-shrink-0 font-medium">
          {label}
        </span>
        <span className="text-gray-500 mx-3">:</span>
        <span
          className="text-gray-900 font-semibold flex-1 break-words truncate max-w-full"
          style={{
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            minWidth: 0,
            display: "block",
          }}
          title={String(value)}
        >
          {String(value)}
        </span>
      </div>
    );

  const SectionCard = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {children}
    </div>
  );

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      <Button variant="ghost" onClick={handleBackToList} className="mb-2 p-0">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-semibold">WASTE GENERATION DETAILS</h1>
        <div className="flex gap-2 flex-wrap">
          {shouldShow("Waste Generation", "update") && (
            <Button
              size="sm"
              onClick={handleUpdate}
              className="bg-[#6B2C91] hover:bg-[#5A2579] text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
          {/* {shouldShow("Waste Generation", "destroy") && (
            <Button
              size="sm"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )} */}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
            <TabsTrigger
              value="waste-details"
              className="flex-1 bg-white data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] px-3 py-3 border-r border-gray-200 last:border-r-0 flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              Waste Details
            </TabsTrigger>
            <TabsTrigger
              value="user-details"
              className="flex-1 bg-white data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] px-3 py-3 border-r border-gray-200 last:border-r-0 flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              User Details
            </TabsTrigger>
            <TabsTrigger
              value="bag-details"
              className="flex-1 bg-white data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] px-3 py-3 border-r border-gray-200 last:border-r-0 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Bag Details
            </TabsTrigger>
          </TabsList>

          {/* Waste Details Tab */}
          <TabsContent value="waste-details" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <InfoRow label="Location" value={wasteData.location_details} />
                <InfoRow
                  label="Operational Name"
                  value={wasteData.operational_landlord?.category_name}
                />
                <InfoRow
                  label="Generated Unit"
                  value={`${wasteData.waste_unit} KG`}
                />
                <InfoRow
                  label="Recycled Unit"
                  value={`${wasteData.recycled_unit} KG`}
                />
                <InfoRow
                  label="Recycled %"
                  value={
                    wasteData.waste_unit > 0
                      ? `${Math.round((wasteData.recycled_unit / wasteData.waste_unit) * 100)}%`
                      : "0%"
                  }
                />
                <InfoRow label="Agency Name" value={wasteData.agency_name} />
                <InfoRow
                  label="Reference Number"
                  value={wasteData.reference_number}
                />
              </div>
              <div className="space-y-4">
                <InfoRow label="Building" value={wasteData.building_name} />
                <InfoRow label="Wing" value={wasteData.wing_name} />
                <InfoRow label="Area" value={wasteData.area_name} />
              </div>
            </div>
          </TabsContent>

          {/* User Details Tab */}
          <TabsContent value="user-details" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div className="space-y-4">
                <InfoRow label="User Type" value={wasteData.user_type} />
                <InfoRow
                  label="User Name"
                  value={wasteData.user_name || wasteData.created_by?.full_name}
                />
                <InfoRow
                  label="Client Name"
                  value={wasteData.client_name || wasteData.vendor?.company_name || wasteData.agency_name}
                />
                <InfoRow
                  label="Vendor"
                  value={wasteData.vendor?.company_name}
                />
                <InfoRow
                  label="Created By"
                  value={wasteData.created_by?.full_name}
                />
                <InfoRow
                  label="Creator Email"
                  value={wasteData.created_by?.email}
                />
              </div>
              <div className="space-y-4">
                <InfoRow
                  label="Waste Date"
                  value={
                    wasteData.wg_date
                      ? new Date(wasteData.wg_date).toLocaleDateString()
                      : undefined
                  }
                />
                <InfoRow
                  label="Created At"
                  value={
                    wasteData.created_at
                      ? new Date(wasteData.created_at).toLocaleString()
                      : undefined
                  }
                />
                <InfoRow
                  label="Updated At"
                  value={
                    wasteData.updated_at
                      ? new Date(wasteData.updated_at).toLocaleString()
                      : undefined
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* Bag Details Tab */}
          <TabsContent value="bag-details" className="p-6">
            <div className="grid grid-cols-1 gap-8 text-sm">
              <div className="space-y-4">
                <InfoRow
                  label="Category"
                  value={wasteData.commodity?.category_name}
                />
                <InfoRow
                  label="Subcategory"
                  value={wasteData.category?.category_name}
                />
                <InfoRow
                  label="No. of Bags"
                  value={wasteData.bag_counts != null ? wasteData.bag_counts.toString() : undefined}
                />
                {wasteData.waste_bag_details && wasteData.waste_bag_details.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Waste Bag Details
                    </h4>
                    <div className="border border-gray-200 rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead>Bag</TableHead>
                            <TableHead>Weight</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {wasteData.waste_bag_details.map((bag: unknown, idx: number) => {
                            const bagObj = bag as Record<string, unknown>;
                            const weightEntry = Object.entries(bagObj).find(([key]) =>
                              /value|weight/i.test(key)
                            );
                            const weightVal = weightEntry ? weightEntry[1] : undefined;
                            const displayWeight =
                              weightVal !== null && weightVal !== undefined && !isNaN(Number(weightVal))
                                ? `${Number(weightVal)} Kg`
                                : String(weightVal ?? "-");
                            return (
                              <TableRow key={idx}>
                                <TableCell className="font-medium text-gray-900">
                                  Bag {idx + 1}
                                </TableCell>
                                <TableCell className="text-gray-900">
                                  {displayWeight}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
                <InfoRow
                  label="Device"
                  value={wasteData.device_id != null ? wasteData.device_id.toString() : undefined}
                />
                <InfoRow
                  label="Status"
                  value={wasteData.status || undefined}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WasteGenerationDetailsPage;
