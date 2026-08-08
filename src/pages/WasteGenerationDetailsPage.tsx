import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Package,
  User,
  ShoppingBag,
  History,
  FileCheck,
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

// One category/commodity "section" for the Waste Detail table and the Bag
// Details tab — built either from the newer `categories` breakdown (records
// created with multiple waste entries) or, for older single-category
// records, synthesized from the top-level category/commodity/waste_bag_details.
interface CategoryGroup {
  key: string;
  categoryName: string;
  commodityName: string;
  uom: string;
  totalWeight: number | null;
  bagCount: number;
  bags: { label: string; weight: string }[];
}

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

  const handleCertificate = () => {
    // TODO: wire this up to a real certificate-generation endpoint once the backend exposes one.
    toast.info("Certificate generation is not yet available.");
  };

  // Section-wise category/commodity breakdown, used by both the Waste Detail
  // table and the Bag Details tab. Prefers the newer `categories` array
  // (multi-category records from the create_waste endpoint); falls back to
  // the legacy top-level category/commodity/waste_bag_details for older
  // single-category records.
  const categoryGroups: CategoryGroup[] = useMemo(() => {
    if (!wasteData) return [];

    if (wasteData.categories && wasteData.categories.length > 0) {
      return wasteData.categories.map((entry) => ({
        key: `cat-${entry.id}`,
        categoryName: entry.category?.category_name || "-",
        commodityName: entry.commodity?.category_name || "-",
        uom: entry.uom || "-",
        totalWeight: entry.waste_unit ?? null,
        bagCount: entry.bag_counts ?? entry.waste_bag_details?.length ?? 0,
        bags: (entry.waste_bag_details || []).map((bag, idx) => ({
          label: bag.field_description || `Bag ${idx + 1}`,
          weight: bag.field_value,
        })),
      }));
    }

    if (wasteData.category || wasteData.commodity || (wasteData.waste_bag_details?.length ?? 0) > 0) {
      return [
        {
          key: "legacy",
          categoryName: wasteData.category?.category_name || "-",
          commodityName: wasteData.commodity?.category_name || "-",
          uom: "-",
          totalWeight: wasteData.waste_unit ?? null,
          bagCount: wasteData.bag_counts ?? wasteData.waste_bag_details?.length ?? 0,
          bags: (wasteData.waste_bag_details || []).map((bag, idx) => ({
            label: bag.field_description || `Bag ${idx + 1}`,
            weight: bag.field_value,
          })),
        },
      ];
    }

    return [];
  }, [wasteData]);

  // Logs tab — a best-effort activity history built from real timestamps
  // already on the record. There's no dedicated audit-log API yet, so this
  // isn't a complete history, just what can be honestly derived today.
  // Computed unconditionally (before the loading/error early returns below)
  // so the hook order stays stable across renders.
  const logEntries = useMemo(() => {
    if (!wasteData) return [];
    const dispatchApplicable = hasData(wasteData.vendor?.company_name);
    const entries: { date: string; activity: string; performedBy: string; remarks: string }[] = [];
    if (wasteData.wg_date) {
      const categoryNames = categoryGroups.map((g) => g.categoryName).filter((n) => n !== "-").join(", ");
      entries.push({
        date: new Date(wasteData.wg_date).toLocaleString(),
        activity: "Waste Generated",
        performedBy: wasteData.user_name || wasteData.created_by?.full_name || "-",
        remarks: categoryNames ? `Category: ${categoryNames}` : "-",
      });
    }
    if (wasteData.updated_at && wasteData.updated_at !== wasteData.created_at) {
      entries.push({
        date: new Date(wasteData.updated_at).toLocaleString(),
        activity: "Record Updated",
        performedBy: wasteData.created_by?.full_name || "-",
        remarks: "-",
      });
    }
    if (dispatchApplicable) {
      entries.push({
        date: new Date(wasteData.updated_at || wasteData.wg_date).toLocaleString(),
        activity: `Dispatched to ${wasteData.vendor?.company_name}`,
        performedBy: wasteData.created_by?.full_name || "-",
        remarks: wasteData.waste_unit != null ? `${wasteData.waste_unit} KG` : "-",
      });
    }
    if (wasteData.recycled_unit > 0) {
      entries.push({
        date: new Date(wasteData.updated_at || wasteData.wg_date).toLocaleString(),
        activity: "Recycling Confirmed",
        performedBy: "-",
        remarks: `${wasteData.recycled_unit} KG recycled`,
      });
    }
    return entries;
  }, [wasteData, categoryGroups]);

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

  const recycledPct =
    wasteData.waste_unit > 0
      ? `${Math.round((wasteData.recycled_unit / wasteData.waste_unit) * 100)}%`
      : "0%";

  // Same field set as the Waste Generation list page's columns
  // (UtilityWasteGenerationDashboard.tsx), so this detail view shows
  // everything the list shows for this record.
  const wasteDetailsFields: Field[] = [
    { label: "Generation ID", value: wasteData.id },
    {
      label: "Date & Time",
      value: wasteData.wg_date
        ? `${wasteData.wg_date.split("T")[0]}${wasteData.created_at ? ` ${new Date(wasteData.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : ""}`
        : undefined,
    },
    { label: "Building", value: wasteData.building_name },
    // No dedicated "floor" field on the record — Area is the closest/most
    // granular location field the API returns.
    { label: "Floor", value: wasteData.area_name || wasteData.wing_name },
    {
      label: "Waste Category",
      value: categoryGroups.map((g) => g.categoryName).filter((n) => n !== "-").join(", ") || undefined,
    },
    {
      label: "Total Bags",
      value:
        categoryGroups.length > 0
          ? categoryGroups.reduce((sum, g) => sum + (g.bagCount || 0), 0).toString()
          : wasteData.bag_counts != null
          ? wasteData.bag_counts.toString()
          : undefined,
    },
    { label: "Quantity (Kg)", value: wasteData.waste_unit != null ? wasteData.waste_unit : undefined },
    { label: "Quantity (Ltr)", value: undefined },
    { label: "Recycle %", value: recycledPct },
    { label: "Status", value: wasteData.status },
    { label: "Device Id", value: wasteData.device_id != null ? wasteData.device_id.toString() : undefined },
    { label: "Remarks", value: (wasteData as unknown as Record<string, unknown>).remarks as string | undefined },
    { label: "Location", value: wasteData.location_details },
    { label: "Operational Name", value: wasteData.operational_landlord?.category_name },
    { label: "Agency Name", value: wasteData.agency_name },
    { label: "Reference Number", value: wasteData.reference_number },
  ];

  // "Dispatch" info only exists on this record once it's been sent to a
  // vendor — shown only when that data is actually present.
  const dispatchApplicable = hasData(wasteData.vendor?.company_name);
  const dispatchFields: Field[] = [
    { label: "Vendor / Facility", value: wasteData.vendor?.company_name },
    { label: "Status", value: wasteData.status },
    { label: "Dispatch Weight (Kg)", value: wasteData.waste_unit != null ? wasteData.waste_unit : undefined },
    { label: "Recycled (Kg)", value: wasteData.recycled_unit != null ? wasteData.recycled_unit : undefined },
  ];

  const userDetailsFields: Field[] = [
    { label: "User Type", value: wasteData.user_type },
    { label: "User Name", value: wasteData.user_name || wasteData.created_by?.full_name },
    {
      label: "Client Name",
      value: wasteData.client_name || wasteData.vendor?.company_name || wasteData.agency_name,
    },
    { label: "Email Id", value: wasteData.created_by?.email },
    { label: "Vendor", value: wasteData.vendor?.company_name },
    { label: "Created By", value: wasteData.created_by?.full_name },
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
            <Button
              onClick={handleCertificate}
              variant="outline"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Certificate
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch mb-4">
          {[
            { label: "Waste Details", value: "waste-details", icon: Package },
            { label: "User Details", value: "user-details", icon: User },
            { label: "Bag Details", value: "bag-details", icon: ShoppingBag },
            { label: "Logs", value: "logs", icon: History },
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

          {dispatchApplicable && (
            <DetailCard icon={Package} title="Dispatch Details">
              <FieldColumns fields={dispatchFields} />
            </DetailCard>
          )}

          <DetailCard icon={Package} title="Waste Detail">
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Category</TableHead>
                    <TableHead>Commodity</TableHead>
                    <TableHead>UOM</TableHead>
                    <TableHead>Total Weight</TableHead>
                    <TableHead>No. of Bags</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryGroups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400 py-6">
                        No category breakdown available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categoryGroups.map((group) => (
                      <TableRow key={group.key}>
                        <TableCell className="font-medium text-gray-900">{group.categoryName}</TableCell>
                        <TableCell>{group.commodityName}</TableCell>
                        <TableCell>{group.uom}</TableCell>
                        <TableCell>{group.totalWeight != null ? `${group.totalWeight} ${group.uom !== "-" ? group.uom : "kg"}` : "-"}</TableCell>
                        <TableCell>{group.bagCount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DetailCard>
        </TabsContent>

        <TabsContent value="user-details">
          <DetailCard icon={User} title="User Details">
            <FieldColumns fields={userDetailsFields} />
          </DetailCard>
        </TabsContent>

        <TabsContent value="bag-details">
          {categoryGroups.length === 0 ? (
            <DetailCard icon={ShoppingBag} title="Bag Details">
              <p className="text-sm text-gray-500">No bag details available.</p>
            </DetailCard>
          ) : (
            categoryGroups.map((group, groupIdx) => (
              <DetailCard
                key={group.key}
                icon={ShoppingBag}
                title={`${groupIdx + 1}. ${group.categoryName} — ${group.commodityName}`}
              >
                <FieldColumns
                  fields={[
                    { label: "Category", value: group.categoryName },
                    { label: "Commodity", value: group.commodityName },
                    { label: "UOM", value: group.uom },
                    {
                      label: "Total Weight",
                      value: group.totalWeight != null ? `${group.totalWeight} ${group.uom !== "-" ? group.uom : "kg"}` : undefined,
                    },
                    { label: "No. of Bags", value: group.bagCount },
                  ]}
                />
                <div className="mt-4 border border-gray-200 rounded-md overflow-hidden bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Bag</TableHead>
                        <TableHead>Weight</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.bags.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-gray-400 py-6">
                            No bag entries.
                          </TableCell>
                        </TableRow>
                      ) : (
                        group.bags.map((bag, bagIdx) => (
                          <TableRow key={bagIdx}>
                            <TableCell className="font-medium text-gray-900">{bag.label}</TableCell>
                            <TableCell>{bag.weight} {group.uom !== "-" ? group.uom : ""}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </DetailCard>
            ))
          )}
        </TabsContent>

        <TabsContent value="logs">
          <DetailCard icon={History} title="Logs">
            <div className="border border-gray-200 rounded-md overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-400 py-6">
                        No activity recorded yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logEntries.map((entry, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="whitespace-nowrap">{entry.date}</TableCell>
                        <TableCell className="font-medium text-gray-900">{entry.activity}</TableCell>
                        <TableCell>{entry.performedBy}</TableCell>
                        <TableCell>{entry.remarks}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              This history is derived from the timestamps available on this record. A dedicated
              activity-log endpoint would be needed for a complete audit trail.
            </p>
          </DetailCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasteGenerationDetailsPage;
