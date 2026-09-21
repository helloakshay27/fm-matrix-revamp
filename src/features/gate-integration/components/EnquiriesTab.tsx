import { useMemo, useState } from "react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { useEnquiriesQuery } from "../hooks/useEnquiriesQuery";
import type { EnquiryApiItem } from "../types/enquiry";

interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  societyName: string;
  message: string;
  gateDevice: string;
}

const mapToRow = (item: EnquiryApiItem): EnquiryRow => ({
  id: String(item.id),
  name: item.name || "N/A",
  email: item.email || "N/A",
  phone: item.phone || "N/A",
  societyName: item.society_name || "N/A",
  message: item.message || "N/A",
  gateDevice: item.gate_device || "N/A",
});

const columns: ColumnConfig[] = [
  { key: "name", label: "Name", sortable: true, draggable: true, defaultVisible: true },
  { key: "email", label: "Email", sortable: true, draggable: true, defaultVisible: true },
  { key: "phone", label: "Phone", sortable: true, draggable: true, defaultVisible: true },
  { key: "societyName", label: "Society Name", sortable: true, draggable: true, defaultVisible: true },
  { key: "message", label: "Message", sortable: false, draggable: true, defaultVisible: true },
  { key: "gateDevice", label: "Gate Device", sortable: true, draggable: true, defaultVisible: true },
];

export const EnquiriesTab = () => {
  const { data, isLoading, isError } = useEnquiriesQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const enquiries = useMemo(() => (data ?? []).map(mapToRow), [data]);

  const renderCell = (item: EnquiryRow, columnKey: string) =>
    item[columnKey as keyof EnquiryRow] ?? "N/A";

  return (
    <EnhancedTable
      data={enquiries}
      columns={columns}
      renderCell={renderCell}
      enableSearch
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search"
      emptyMessage={isError ? "Failed to load enquiries. Please try again." : "No enquiries found"}
      loading={isLoading}
      pagination={true}
      pageSize={10}
    />
  );
};

export default EnquiriesTab;
