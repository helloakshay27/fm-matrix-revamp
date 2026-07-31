import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading waste generation details...</p>
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

  type Field = { label: string; value: string | number | null | undefined };

  // Card shell matching TicketDetailsPage.tsx's card pattern: icon-badge
  // header bar + bordered body.
  const DetailCard = ({
    icon: Icon,
    title,
    children,
  }: {
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="w-full bg-white rounded-lg shadow-sm border mb-6">
      <div className="flex items-center gap-3 bg-[#F6F4EE] py-3 px-4 border border-[#D9D9D9]">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#E5E0D3]">
          <Icon className="w-5 h-5 text-brand" />
        </div>
        <h3 className="text-lg font-semibold uppercase text-black">{title}</h3>
      </div>
      <div className="bg-[#F6F7F7] border border-t-0 border-[#D9D9D9] p-4">
        {children}
      </div>
    </Card>
  );

  // Renders a field list as two side-by-side columns, matching
  // TicketDetailsPage.tsx's key/value row layout exactly.
  const FieldColumns = ({ fields }: { fields: Field[] }) => {
    const visible = fields.filter((f) => hasData(f.value));
    if (visible.length === 0) {
      return <p className="text-sm text-gray-500">No data available.</p>;
    }
    const midpoint = Math.ceil(visible.length / 2);
    const colA = visible.slice(0, midpoint);
    const colB = visible.slice(midpoint);
    return (
      <div className="flex flex-col sm:flex-row gap-10">
        {[colA, colB].map((col, ci) => (
          <div key={ci} className="flex flex-col gap-4 min-w-[280px] flex-1">
            {col.map((field) => (
              <div key={field.label} className="flex text-[14px] leading-snug min-w-0">
                <div className="w-[180px] flex-shrink-0 text-[#6B6B6B] font-medium">
                  {field.label}
                </div>
                <div className="flex-1 text-[14px] font-semibold text-[#1A1A1A] break-words overflow-wrap-anywhere min-w-0">
                  {String(field.value)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const wasteDetailsFields: Field[] = [
    { label: "Location", value: wasteData.location_details },
    { label: "Operational Name", value: wasteData.operational_landlord?.category_name },
    { label: "Generated Unit", value: `${wasteData.waste_unit} KG` },
    { label: "Recycled Unit", value: `${wasteData.recycled_unit} KG` },
    {
      label: "Recycled %",
      value:
        wasteData.waste_unit > 0
          ? `${Math.round((wasteData.recycled_unit / wasteData.waste_unit) * 100)}%`
          : "0%",
    },
    { label: "Agency Name", value: wasteData.agency_name },
    { label: "Reference Number", value: wasteData.reference_number },
    { label: "Building", value: wasteData.building_name },
    { label: "Wing", value: wasteData.wing_name },
    { label: "Area", value: wasteData.area_name },
  ];

  const userDetailsFields: Field[] = [
    { label: "User Type", value: wasteData.user_type },
    { label: "User Name", value: wasteData.user_name || wasteData.created_by?.full_name },
    {
      label: "Client Name",
      value: wasteData.client_name || wasteData.vendor?.company_name || wasteData.agency_name,
    },
    { label: "Vendor", value: wasteData.vendor?.company_name },
    { label: "Created By", value: wasteData.created_by?.full_name },
    { label: "Creator Email", value: wasteData.created_by?.email },
    {
      label: "Waste Date",
      value: wasteData.wg_date ? new Date(wasteData.wg_date).toLocaleDateString() : undefined,
    },
    {
      label: "Created At",
      value: wasteData.created_at ? new Date(wasteData.created_at).toLocaleString() : undefined,
    },
    {
      label: "Updated At",
      value: wasteData.updated_at ? new Date(wasteData.updated_at).toLocaleString() : undefined,
    },
  ];

  const bagDetailsFields: Field[] = [
    { label: "Category", value: wasteData.commodity?.category_name },
    { label: "Subcategory", value: wasteData.category?.category_name },
    { label: "No. of Bags", value: wasteData.bag_counts != null ? wasteData.bag_counts.toString() : undefined },
    { label: "Device", value: wasteData.device_id != null ? wasteData.device_id.toString() : undefined },
    { label: "Status", value: wasteData.status || undefined },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Waste Generation List
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Waste Generation Details</h1>
          <div className="flex gap-2">
            {shouldShow("Waste Generation", "update") && (
              <Button
                onClick={handleUpdate}
                variant="outline"
                className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch mb-4">
          {[
            { label: "Waste Details", value: "waste-details", icon: Package },
            { label: "User Details", value: "user-details", icon: User },
            { label: "Bag Details", value: "bag-details", icon: ShoppingBag },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-brand border-r border-gray-200 last:border-r-0 flex items-center justify-center gap-2"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="waste-details">
          <DetailCard icon={Package} title="Waste Details">
            <FieldColumns fields={wasteDetailsFields} />
          </DetailCard>
        </TabsContent>

        <TabsContent value="user-details">
          <DetailCard icon={User} title="User Details">
            <FieldColumns fields={userDetailsFields} />
          </DetailCard>
        </TabsContent>

        <TabsContent value="bag-details">
          <DetailCard icon={ShoppingBag} title="Bag Details">
            <FieldColumns fields={bagDetailsFields} />
            {wasteData.waste_bag_details && wasteData.waste_bag_details.length > 0 && (
              <div className="mt-6">
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
          </DetailCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasteGenerationDetailsPage;
