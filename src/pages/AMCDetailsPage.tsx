import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Edit,
  Download,
  Truck,
  Boxes,
  FileTextIcon,
  Paperclip,
  FileText,
  FileSpreadsheet,
  X,
  Ticket,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { AddVisitModal } from "@/components/AddVisitModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAMCDetails } from "@/store/slices/amcDetailsSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye } from "lucide-react";
import { AMCAnalyticsTab } from "@/components/amc-details/AMCAnalyticsTab";
import { AMCDetailsPreviewTab } from "@/components/amc-details/AMCDetailsPreviewTab";

interface AMCDetailsData {
  id: number;
  asset_id: number | null;
  service_id?: number | null; // added optional service_id to fix TS error when referencing amcDetails.service_id
  amc_vendor_name: string | null;
  amc_vendor_mobile: string | null;
  amc_vendor_email: string | null;
  amc_contract: string | null;
  amc_invoice: string | null;
  amc_cost: number;
  amc_start_date: string;
  amc_end_date: string;
  amc_first_service: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  payment_term: string;
  no_of_visits: number;
  remarks: string;
  asset_name?: string;
  amc_type?: string;
  amc_assets?: any[];
  service_name?: string;
  service_code?: string;
  execution_type?: string;
  service_status?: string;
  amc_services?: {
    id: number;
    service_id: number;
    group_id?: number | null;
    sub_group_id?: number | null;
    service_name?: string | null;
    sset_code?: string | null; // keeping backend field name as provided
    asset_code?: string | null; // allow dummy fallback field name
  }[];
}

interface Technician {
  id: number;
  name: string;
  email: string;
}

interface AmcVisitLog {
  id: number;
  visit_number: number;
  visit_date: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  asset_period: string;
  technician: Technician | null;
  // Added optional attachment to align with runtime usage (visit.attachment?.document / id)
  attachment?: {
    id?: number;
    document?: string; // image URL or file URL
    document_url?: string; // sometimes APIs use document_url
    [key: string]: any; // allow extra backend-provided fields
  } | null;
}

interface AMCDetailsDataWithVisits extends AMCDetailsData {
  amc_visit_logs: AmcVisitLog[];
  amc_contracts?: any[];
  amc_invoices?: any[];
}

interface TicketRecord {
  id: number;
  heading: string | null;
  category_type?: string | null;
  status?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  updated_by?: string | null;
}

export const AMCDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const {
    data: amcData,
    loading,
    error,
  } = useAppSelector(
    (state) =>
      state.amcDetails as {
        data: AMCDetailsDataWithVisits;
        loading: boolean;
        error: any;
      }
  );
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const amcDetails: AMCDetailsData | null = amcData as AMCDetailsData;
  const amcVisitData = amcData?.amc_visit_logs?.map((visit) => visit) ?? [];
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("amc-information");
  const [activeSubTab, setActiveSubTab] = useState("analytics");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  // Tickets state
  const [tickets, setTickets] = useState<TicketRecord[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  // History (PPM Occurrences) state
  const [occurrences, setOccurrences] = useState<any[]>([]);
  const [occurrencesLoading, setOccurrencesLoading] = useState(false);
  const [occurrenceStatusFilter, setOccurrenceStatusFilter] = useState("Scheduled");
  const [occurrenceSearch, setOccurrenceSearch] = useState("");
  const [occurrencePage, setOccurrencePage] = useState(1);
  const [occurrenceTotalCount, setOccurrenceTotalCount] = useState(0);
  // AMC Visits History state
  const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
  const [showVisitEditModal, setShowVisitEditModal] = useState(false);
  const [visitEditVisitNumber, setVisitEditVisitNumber] = useState("");
  const [visitEditVisitDate, setVisitEditVisitDate] = useState("");
  const [visitEditActualVisitDate, setVisitEditActualVisitDate] = useState("");
  const [visitEditTechnicianId, setVisitEditTechnicianId] = useState("");
  const [visitEditRemarks, setVisitEditRemarks] = useState("");
  const [visitEditStatus, setVisitEditStatus] = useState("");
  const [visitEditDocument, setVisitEditDocument] = useState<File | null>(null);
  const [visitEditSelectedAssetIds, setVisitEditSelectedAssetIds] = useState<number[]>([]);
  const [visitTechnicians, setVisitTechnicians] = useState<Technician[]>([]);
  const [visitTechniciansLoading, setVisitTechniciansLoading] = useState(false);
  const [visitUpdateLoading, setVisitUpdateLoading] = useState(false);

  const fetchTicketsForAssets = async (assetIds: number[]) => {
    if (!assetIds.length) return;
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (!baseUrl || !token) return;
    setTicketsLoading(true);
    setTicketsError(null);
    try {
      // Manually build query string to preserve brackets exactly as the API expects:
      // q[pms_asset_id_in][]=123&q[pms_asset_id_in][]=456
      const qs = assetIds
        .filter((id) => !!id)
        .map((id) => `q[pms_asset_id_in][]=${id}`)
        .join("&");

      const url = `https://${baseUrl}/pms/assets/assets_tickets?${qs}`;

      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!resp.ok)
        throw new Error(`Tickets fetch failed with status ${resp.status}`);

      const data = await resp.json();

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tickets)
          ? data.tickets
          : [];
      const all: TicketRecord[] = arr.map((t: any) => ({
        id: t.id,
        heading: t.heading || null,
        category_type: t.category_type || null,
        status: t.status || null,
        updated_at: t.updated_at || null,
        created_at: t.created_at || null,
        updated_by: t.updated_by || null,
      }));

      setTickets(all);
    } catch (e: any) {
      console.error("Tickets Error:", e);
      setTicketsError(e.message || "Failed to load tickets");
    } finally {
      setTicketsLoading(false);
    }
  };

  const fetchOccurrences = async (page: number = 1) => {
    const assetIds =
      amcDetails?.amc_assets?.map((a: any) => a.asset_id).filter(Boolean) ?? [];
    if (!assetIds.length) return;
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (!baseUrl || !token) return;
    setOccurrencesLoading(true);
    try {
      const idsQs = assetIds.map((aid: number) => `ids[]=${aid}`).join("&");
      const url = `https://${baseUrl}/pms/asset_amcs/occurrences.json?${idsQs}&access_token=${token}&page=${page}&per_page=20`;
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`Occurrences fetch failed: ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data)
        ? data
        : data.occurrences ?? data.data ?? [];
      const total = data.total_count ?? data.total ?? items.length;
      setOccurrences(items);
      setOccurrenceTotalCount(total);
    } catch (e: any) {
      console.error("Occurrences Error:", e);
    } finally {
      setOccurrencesLoading(false);
    }
  };

  const fetchVisitTechnicians = async () => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (!baseUrl || !token) return;
    setVisitTechniciansLoading(true);
    try {
      const res = await fetch(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.users ?? []);
        // normalise full_name → name so the dropdown label always has a value
        setVisitTechnicians(
          list.map((u: any) => ({ ...u, name: u.full_name || u.name || "" }))
        );
      }
    } catch (e) {
      console.error("Technicians fetch error:", e);
    } finally {
      setVisitTechniciansLoading(false);
    }
  };

  const handleVisitUpdate = async () => {
    if (!selectedVisitId) return;
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");
    if (!baseUrl || !token) return;
    setVisitUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append("id", String(selectedVisitId));
      if (visitEditVisitNumber) formData.append("amc_history[visit_number]", visitEditVisitNumber);
      if (visitEditVisitDate) formData.append("amc_history[visit_date]", visitEditVisitDate);
      if (visitEditActualVisitDate) formData.append("amc_history[actual_visit_date]", visitEditActualVisitDate);
      if (visitEditTechnicianId) formData.append("amc_history[technician_id]", visitEditTechnicianId);
      formData.append("amc_history[remarks]", visitEditRemarks);
      formData.append("amc_history[status]", visitEditStatus);
      visitEditSelectedAssetIds.forEach((assetId) =>
        formData.append("amc_history[asset_ids][]", String(assetId))
      );
      if (visitEditDocument) {
        formData.append("amc_history[document]", visitEditDocument);
      }
      const res = await fetch(
        `https://${baseUrl}/pms/asset_amcs/amc_history_update.json?access_token=${token}`,
        { method: "POST", body: formData }
      );
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      setShowVisitEditModal(false);
      setSelectedVisitId(null);
      if (id) dispatch(fetchAMCDetails(id));
    } catch (e: any) {
      console.error("Visit update error:", e);
    } finally {
      setVisitUpdateLoading(false);
    }
  };

  // Fetch tickets when AMC details loaded
  useEffect(() => {
    if (amcDetails?.amc_assets?.length) {
      const ids = amcDetails.amc_assets
        .map((a: any) => a.asset_id)
        .filter((v: any) => !!v);
      fetchTicketsForAssets(ids);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amcDetails?.amc_assets]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAMCDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (amcDetails?.amc_assets?.length) {
      fetchOccurrences(occurrencePage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amcDetails?.amc_assets, occurrencePage]);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return "—";
    }
  };

  const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "—";
    return `${localStorage.getItem("currency")}${amount}`;
  };

  const formatPaymentTerm = (term: string | null | undefined): string => {
    if (!term) return "—";
    const formatted = term.replace(/_/g, " ").toLowerCase();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mx-auto mb-4"></div>
          <p className="text-gray-700">Loading AMC details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!amcDetails) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">No AMC details found</div>
        </div>
      </div>
    );
  }

  const hanldeClose = () => {
    setShowAddVisitModal(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        {/* <Button
          variant="ghost"
          onClick={() => navigate('/maintenance/amc')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button> */}
        <button
          onClick={() => navigate("/maintenance/amc")}
          className="flex items-center gap-1 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AMC List
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AMC Details</h1>
          <div className="flex gap-2">
            {activeTab === "amc-information" && activeSubTab === "amc-details" && (
              <Button
                onClick={() => navigate(`/maintenance/amc/edit/${id}`)}
                variant="outline"
                className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
              >
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0_107_2076"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="21"
                    height="21"
                  >
                    <rect width="21" height="21" fill="#C72030" />
                  </mask>
                  <g mask="url(#mask0_107_2076)">
                    <path
                      d="M4.375 16.625H5.47881L14.4358 7.66806L13.3319 6.56425L4.375 15.5212V16.625ZM3.0625 17.9375V14.9761L14.6042 3.43941C14.7365 3.31924 14.8825 3.22642 15.0423 3.16094C15.2023 3.09531 15.37 3.0625 15.5455 3.0625C15.7209 3.0625 15.8908 3.09364 16.0552 3.15591C16.2197 3.21818 16.3653 3.3172 16.492 3.45297L17.5606 4.53491C17.6964 4.66164 17.7931 4.80747 17.8509 4.97241C17.9086 5.13734 17.9375 5.30228 17.9375 5.46722C17.9375 5.64324 17.9075 5.81117 17.8474 5.971C17.7873 6.13098 17.6917 6.2771 17.5606 6.40937L6.02394 17.9375H3.0625ZM13.8742 7.12578L13.3319 6.56425L14.4358 7.66806L13.8742 7.12578Z"
                      fill="#C72030"
                    />
                  </g>
                </svg>
              </Button>
            )}
            {/* <Button
              onClick={() => navigate(`/maintenance/amc/edit/${id}`)}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button> */}
          </div>
        </div>
      </div>

      <div
        className="rounded-lg border-r border-b border-gray-200 shadow-sm"
        style={{
          borderTop: "none",
          borderLeft: "none",
          backgroundColor: "rgba(250, 250, 250, 1)",
        }}
      >
        <style>{`
          .top-level-tabs button[data-state="active"] {
            background-color: rgba(237, 234, 227, 1) !important;
            color: rgba(199, 32, 48, 1) !important;
          }
        `}</style>
        <Tabs defaultValue="amc-information" className="w-full" onValueChange={setActiveTab}>
          <TabsList
            className="top-level-tabs w-full flex flex-nowrap rounded-t-lg p-0 overflow-x-auto mb-4"
            style={{
              gap: "0",
              padding: "0",
              backgroundColor: "rgba(246, 247, 247, 1)",
              height: "50px",
              marginBottom: "16px",
            }}
          >
            {[
              { label: "AMC Information", value: "amc-information" },
              { label: "Supplier Information", value: "supplier-information" },
              { label: "Attachments", value: "attachments" },
              { label: "Scheduled Tasks", value: "scheduled-amc" },
              { label: "Tickets", value: "tickets" },
              { label: "AMC Visits History", value: "amc-visits-history" },
              { label: "Association", value: "association" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030]"
                style={{
                  width: "230px",
                  height: "36px",
                  paddingTop: "10px",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                  paddingLeft: "20px",
                  borderRadius: "0",
                  border: "none",
                  margin: "0",
                  fontFamily: "Work Sans",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "rgba(26, 26, 26, 1)",
                  backgroundColor: "rgba(246, 247, 247, 1)",
                }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* AMC Information */}
          <TabsContent value="amc-information" className="p-0">
            {/* Sub-navigation */}
            <div
              className="rounded-lg shadow-sm border border-gray-200"
              style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
            >
              <Tabs defaultValue="analytics" className="w-full" onValueChange={setActiveSubTab}>
                <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-[36px] p-0 text-sm justify-stretch border-b border-gray-200">
                  <TabsTrigger
                    value="analytics"
                    className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-0 h-[36px] flex items-center gap-2 text-gray-700 data-[state=active]:text-[#C72030] data-[state=active]:border-0 [&_svg]:text-gray-700 data-[state=active]:[&_svg]:text-[#C72030]"
                    style={{
                      border: "1px solid rgba(217, 217, 217, 1)",
                      borderRight: "1px solid rgba(209, 209, 209, 1)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <mask
                        id="mask0_9547_3931"
                        style={{ maskType: "alpha" }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="18"
                        height="18"
                      >
                        <rect width="18" height="18" fill="#D9D9D9" />
                      </mask>
                      <g mask="url(#mask0_9547_3931)">
                        <path
                          d="M8.66681 13.1106C7.59669 13.0192 6.69719 12.5831 5.96831 11.8024C5.23944 11.0216 4.875 10.0875 4.875 9C4.875 7.85413 5.27606 6.88019 6.07819 6.07819C6.88019 5.27606 7.85413 4.875 9 4.875C10.0875 4.875 11.0216 5.23825 11.8024 5.96475C12.5831 6.69112 13.0192 7.58944 13.1106 8.65969L11.9179 8.30625C11.7557 7.63125 11.4066 7.07812 10.8703 6.64688C10.3342 6.21563 9.71075 6 9 6C8.175 6 7.46875 6.29375 6.88125 6.88125C6.29375 7.46875 6 8.175 6 9C6 9.7125 6.21681 10.3375 6.65044 10.875C7.08406 11.4125 7.636 11.7625 8.30625 11.925L8.66681 13.1106ZM9.56681 16.0946C9.47231 16.1149 9.37788 16.125 9.2835 16.125H9C8.01438 16.125 7.08812 15.938 6.22125 15.564C5.35437 15.19 4.60031 14.6824 3.95906 14.0413C3.31781 13.4002 2.81019 12.6463 2.43619 11.7795C2.06206 10.9128 1.875 9.98669 1.875 9.00131C1.875 8.01581 2.062 7.0895 2.436 6.22237C2.81 5.35525 3.31756 4.601 3.95869 3.95962C4.59981 3.31825 5.35375 2.81044 6.2205 2.43619C7.08725 2.06206 8.01331 1.875 8.99869 1.875C9.98419 1.875 10.9105 2.06206 11.7776 2.43619C12.6448 2.81019 13.399 3.31781 14.0404 3.95906C14.6818 4.60031 15.1896 5.35437 15.5638 6.22125C15.9379 7.08812 16.125 8.01438 16.125 9V9.27975C16.125 9.373 16.1149 9.46631 16.0946 9.55969L15 9.225V9C15 7.325 14.4187 5.90625 13.2563 4.74375C12.0938 3.58125 10.675 3 9 3C7.325 3 5.90625 3.58125 4.74375 4.74375C3.58125 5.90625 3 7.325 3 9C3 10.675 3.58125 12.0938 4.74375 13.2563C5.90625 14.4187 7.325 15 9 15H9.225L9.56681 16.0946ZM15.1052 16.2332L11.7043 12.825L10.8894 15.2884L9 9L15.2884 10.8894L12.825 11.7043L16.2332 15.1052L15.1052 16.2332Z"
                          fill="#C72030"
                        />
                      </g>
                    </svg>
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger
                    value="amc-details"
                    className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-0 h-[36px] flex items-center gap-2 text-gray-700 data-[state=active]:text-[#C72030] data-[state=active]:border-0 [&_svg]:text-gray-700 data-[state=active]:[&_svg]:text-[#C72030]"
                    style={{ border: "1px solid rgba(217, 217, 217, 1)" }}
                  >
                    <Settings className="w-4 h-4" />
                    AMC Details
                  </TabsTrigger>
                </TabsList>

                {/* Analytics Sub-tab */}
                <TabsContent
                  value="analytics"
                  className="p-4 sm:p-6"
                  style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
                >
                  <AMCAnalyticsTab
                    amc={amcDetails}
                    amcId={amcDetails?.id?.toString() || id || ""}
                  />
                </TabsContent>

                {/* AMC Details Sub-tab */}
                <TabsContent value="amc-details" className="p-4 sm:p-6">
                  <AMCDetailsPreviewTab
                    amc={amcDetails}
                    amcId={amcDetails?.id?.toString() || id || ""}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          {/* Supplier Information */}
          <TabsContent
            value="supplier-information"
            className="p-3 sm:p-6"
            style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
          >
            <Card
              className="border-[#D9D9D9] bg-white shadow-sm"
              style={{
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0 4px 14.2px 0 rgba(0, 0, 0, 0.10)",
              }}
            >
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                    <div className="w-6 h-6 mr-2 flex items-center justify-center">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                          stroke="#C72030"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                          stroke="#C72030"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                    SUPPLIER INFORMATION
                  </CardTitle>
                  <Button
                    className="px-4 py-2 font-medium text-[#C72030] border border-[#C72030] rounded-md hover:bg-[#C72030] hover:text-white transition-colors"
                    style={{
                      backgroundColor: "#F6F4EE",
                      color: "#C72030",
                      border: "1px solid #C72030",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    View Supplier
                  </Button>
                </div>
              </CardHeader>
              <CardContent
                className="p-6"
                style={{ backgroundColor: "rgba(246, 247, 247, 1)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">
                      Name
                    </div>
                    <div className="text-base text-gray-900 font-semibold">
                      {amcDetails.amc_vendor_name || "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">
                      Company Name
                    </div>
                    <div className="text-base text-gray-900 font-semibold">
                      {amcDetails.amc_vendor_name || "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">
                      Mobile 1
                    </div>
                    <div className="text-base text-gray-900 font-semibold">
                      {amcDetails.amc_vendor_mobile || "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">
                      Email
                    </div>
                    <div className="text-base text-gray-900 font-semibold">
                      {amcDetails.amc_vendor_email || "—"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500 font-normal">
                      Mobile 2
                    </div>
                    <div className="text-base text-gray-900 font-semibold">
                      —
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments */}
          <TabsContent
            value="attachments"
            className="p-3 sm:p-6"
            style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
          >
            <Card
              className="border-[#D9D9D9] bg-white shadow-sm"
              style={{
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0 4px 14.2px 0 rgba(0, 0, 0, 0.10)",
              }}
            >
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-6 h-6 mr-2 flex items-center justify-center">
                    <Paperclip className="w-5 h-5 text-[#C72030]" />
                  </div>
                  ATTACHMENTS
                </CardTitle>
              </CardHeader>
              <CardContent
                className="p-6"
                style={{ backgroundColor: "rgba(246, 247, 247, 1)" }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AMC Contracts Card */}
                  <div className="bg-[#F6F4EE] rounded-lg p-6">
                    <h3 className="text-[#1a1a1a] font-semibold text-base mb-3">
                      AMC Contracts
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {(() => {
                        const sectionData =
                          (amcData as any)?.amc_contracts || [];
                        const documents =
                          sectionData?.flatMap(
                            (item: any) => item.documents || []
                          ) || [];

                        if (documents.length === 0) {
                          return (
                            <p className="text-gray-500 text-sm">
                              No AMC contract attachments available
                            </p>
                          );
                        }

                        return documents.map((doc: any) => {
                          const isImage =
                            /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(
                              doc.document_url
                            );
                          const isPdf = /\.pdf$/i.test(doc.document_url);
                          const isExcel = /\.(xls|xlsx|csv)$/i.test(
                            doc.document_url
                          );
                          const isWord = /\.(doc|docx)$/i.test(
                            doc.document_url
                          );
                          const isDownloadable = isPdf || isExcel || isWord;

                          const handleFileAction = async () => {
                            if (!doc?.attachment_id) {
                              console.error("Attachment ID is undefined", doc);
                              return;
                            }

                            try {
                              const token = localStorage.getItem("token");
                              const baseUrl = localStorage.getItem("baseUrl");
                              if (!token) {
                                console.error(
                                  "No token found in local storage"
                                );
                                return;
                              }

                              const apiUrl = `https://${baseUrl}/attachfiles/${doc.attachment_id}?show_file=true`;

                              const response = await fetch(apiUrl, {
                                method: "GET",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                              });

                              if (!response.ok) {
                                throw new Error("Failed to fetch the file");
                              }

                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);

                              if (isImage) {
                                setSelectedDoc({
                                  document_url: url,
                                  document_name:
                                    doc.document_name ||
                                    `document_${doc.attachment_id}`,
                                  blob: blob,
                                });
                                setIsModalOpen(true);
                              } else {
                                const link = document.createElement("a");
                                link.href = url;
                                link.download =
                                  doc.document_name ||
                                  `document_${doc.attachment_id}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              }
                            } catch (error) {
                              console.error("Error handling file:", error);
                            }
                          };

                          return (
                            <div
                              key={doc.id}
                              className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-white shadow-md"
                            >
                              {isImage ? (
                                <>
                                  <button
                                    className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                    title="View"
                                    onClick={handleFileAction}
                                    type="button"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <img
                                    src={doc.document_url}
                                    alt={doc.document_name}
                                    className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                    onClick={handleFileAction}
                                  />
                                </>
                              ) : isPdf ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              ) : isExcel ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                  <FileSpreadsheet className="w-6 h-6" />
                                </div>
                              ) : isWord ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              ) : (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              )}
                              <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                {doc.document_name || `Document_${doc.id}`}
                              </span>
                              {isDownloadable && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                  onClick={handleFileAction}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* AMC Invoice Card */}
                  <div className="bg-[#F6F4EE] rounded-lg p-6">
                    <h3 className="text-[#1a1a1a] font-semibold text-base mb-3">
                      AMC Invoice
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {(() => {
                        const sectionData =
                          (amcData as any)?.amc_invoices || [];
                        const documents =
                          sectionData?.flatMap(
                            (item: any) => item.documents || []
                          ) || [];

                        if (documents.length === 0) {
                          return (
                            <p className="text-gray-500 text-sm">
                              No AMC invoice attachments available
                            </p>
                          );
                        }

                        return documents.map((doc: any) => {
                          const isImage =
                            /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(
                              doc.document_url
                            );
                          const isPdf = /\.pdf$/i.test(doc.document_url);
                          const isExcel = /\.(xls|xlsx|csv)$/i.test(
                            doc.document_url
                          );
                          const isWord = /\.(doc|docx)$/i.test(
                            doc.document_url
                          );
                          const isDownloadable = isPdf || isExcel || isWord;

                          const handleFileAction = async () => {
                            if (!doc?.attachment_id) {
                              console.error("Attachment ID is undefined", doc);
                              return;
                            }

                            try {
                              const token = localStorage.getItem("token");
                              const baseUrl = localStorage.getItem("baseUrl");
                              if (!token) {
                                console.error(
                                  "No token found in local storage"
                                );
                                return;
                              }

                              const apiUrl = `https://${baseUrl}/attachfiles/${doc.attachment_id}?show_file=true`;

                              const response = await fetch(apiUrl, {
                                method: "GET",
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                  "Content-Type": "application/json",
                                },
                              });

                              if (!response.ok) {
                                throw new Error("Failed to fetch the file");
                              }

                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);

                              if (isImage) {
                                setSelectedDoc({
                                  document_url: url,
                                  document_name:
                                    doc.document_name ||
                                    `document_${doc.attachment_id}`,
                                  blob: blob,
                                });
                                setIsModalOpen(true);
                              } else {
                                const link = document.createElement("a");
                                link.href = url;
                                link.download =
                                  doc.document_name ||
                                  `document_${doc.attachment_id}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                              }
                            } catch (error) {
                              console.error("Error handling file:", error);
                            }
                          };

                          return (
                            <div
                              key={doc.id}
                              className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-white shadow-md"
                            >
                              {isImage ? (
                                <>
                                  <button
                                    className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                                    title="View"
                                    onClick={handleFileAction}
                                    type="button"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <img
                                    src={doc.document_url}
                                    alt={doc.document_name}
                                    className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                                    onClick={handleFileAction}
                                  />
                                </>
                              ) : isPdf ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              ) : isExcel ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
                                  <FileSpreadsheet className="w-6 h-6" />
                                </div>
                              ) : isWord ? (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              ) : (
                                <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
                                  <FileText className="w-6 h-6" />
                                </div>
                              )}
                              <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">
                                {doc.document_name || `Document_${doc.id}`}
                              </span>
                              {isDownloadable && (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
                                  onClick={handleFileAction}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="w-full max-w-[90vw] sm:max-w-2xl">
                    <button
                      className="absolute top-3 right-3 text-gray-500 hover:text-black"
                      aria-label="Close"
                      onClick={() => {
                        setIsModalOpen(false);
                        if (selectedDoc?.document_url) {
                          window.URL.revokeObjectURL(selectedDoc.document_url);
                        }
                        setSelectedDoc(null);
                      }}
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <DialogHeader>
                      <DialogTitle className="text-center">
                        {selectedDoc?.document_name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center gap-4">
                      {selectedDoc?.document_url && (
                        <img
                          src={selectedDoc.document_url}
                          alt={selectedDoc.document_name}
                          className="max-w-full max-h-[400px] rounded-md border"
                        />
                      )}
                      <Button
                        onClick={() => {
                          if (selectedDoc?.document_url) {
                            const link = document.createElement("a");
                            link.href = selectedDoc.document_url;
                            link.download =
                              selectedDoc.document_name || "document";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            setIsModalOpen(false);
                            window.URL.revokeObjectURL(
                              selectedDoc.document_url
                            );
                            setSelectedDoc(null);
                          }
                        }}
                      >
                        <Download className="mr-2 w-4 h-4" />
                        Download
                      </Button>
                      {selectedImage && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                          <div className="bg-white rounded-lg p-4 max-w-sm w-full relative">
                            {/* Close Icon */}
                            <button
                              className="absolute top-2 right-2 text-gray-700 hover:text-black"
                              onClick={() => setSelectedImage(null)}
                            >
                              <X className="w-5 h-5" />
                            </button>

                            {/* Image */}
                            <img
                              src={selectedImage}
                              alt="Preview"
                              className="w-full h-auto object-contain rounded mb-4"
                            />

                            {/* Download Button */}
                            <a
                              href={selectedImage}
                              download
                              className="block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scheduled AMC */}
          <TabsContent
            value="scheduled-amc"
            className="p-3 sm:p-6"
            style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
          >
            <Card
              className="border-[#D9D9D9] bg-white shadow-sm"
              style={{
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0 4px 14.2px 0 rgba(0, 0, 0, 0.10)",
              }}
            >
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                    <Calendar className="w-5 h-5 text-[#C72030]" />
                  </div>
                  Scheduled Tasks
                </CardTitle>
              </CardHeader>
              <CardContent
                className="p-6"
                style={{ backgroundColor: "rgba(246, 247, 247, 1)" }}
              >
                {(() => {
                  const statusCards = [
                    { label: "Scheduled", color: "#6366F1" },
                    { label: "Open", color: "#EF4444" },
                    { label: "In Progress", color: "#F59E0B" },
                    { label: "Closed", color: "#10B981" },
                    { label: "Overdue", color: "#C72030" },
                  ];

                  const filtered = occurrences.filter(
                    (o) =>
                      o.task_status === occurrenceStatusFilter &&
                      (
                        (o.checklist_name || "").toLowerCase().includes(occurrenceSearch.toLowerCase()) ||
                        (o.schedule || "").toLowerCase().includes(occurrenceSearch.toLowerCase())
                      )
                  );

                  const totalPages = Math.max(1, Math.ceil(occurrenceTotalCount / 20));

                  return (
                    <div className="space-y-6">
                      {/* Status Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {statusCards.map((card) => {
                          const count = occurrences.filter((o) => o.task_status === card.label).length;
                          return (
                            <div
                              key={card.label}
                              className={`p-4 rounded-lg cursor-pointer ${
                                occurrenceStatusFilter === card.label ? "ring-2 ring-[#C72030]" : ""
                              }`}
                              style={{ backgroundColor: "#F6F4EE" }}
                              onClick={() => {
                                setOccurrenceStatusFilter(card.label);
                                setOccurrencePage(1);
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                  <Calendar className="w-5 h-5" style={{ color: "#C72030" }} />
                                </div>
                                <div>
                                  <div className="text-2xl font-bold text-black">
                                    {count.toString().padStart(2, "0")}
                                  </div>
                                  <div className="text-sm font-medium text-black">{card.label}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Search */}
                      <div className="flex justify-end">
                        <Input
                          placeholder="Search..."
                          value={occurrenceSearch}
                          onChange={(e) => setOccurrenceSearch(e.target.value)}
                          className="pl-3 w-64"
                        />
                      </div>

                      {/* Occurrences Table */}
                      <div className="bg-white rounded-lg border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-[#EDEAE3]">
                              <TableHead className="font-semibold text-[#1a1a1a]">ID</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a]">Checklist</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a]">Type</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a]">Schedule</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a]">Assigned To</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a]">Grace Time</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a]">%</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="bg-white">
                            {occurrencesLoading ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                  Loading...
                                </TableCell>
                              </TableRow>
                            ) : filtered.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                                  No records found.
                                </TableCell>
                              </TableRow>
                            ) : (
                              filtered.map((item: any) => (
                                <TableRow key={item.id} className="border-b border-gray-200">
                                  <TableCell className="font-medium text-gray-900">{item.id}</TableCell>
                                  <TableCell className="text-gray-900">{item.checklist_name || "—"}</TableCell>
                                  <TableCell className="text-gray-900">{item.type || "—"}</TableCell>
                                  <TableCell className="text-gray-900">{item.schedule || "—"}</TableCell>
                                  <TableCell className="text-gray-900">{item.assigned_to || "—"}</TableCell>
                                  <TableCell className="text-gray-900">{item.grace_time || "—"}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#C72030]">
                                        <span className="text-white text-[9px] font-bold">✓</span>
                                      </div>
                                      <span className="font-medium">{item.per ?? 0}%</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-end items-center gap-3 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={occurrencePage <= 1 || occurrencesLoading}
                            onClick={() => setOccurrencePage((p) => p - 1)}
                          >
                            Previous
                          </Button>
                          <span className="text-sm text-gray-600">
                            Page {occurrencePage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={occurrencePage >= totalPages || occurrencesLoading}
                            onClick={() => setOccurrencePage((p) => p + 1)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tickets */}
          <TabsContent
            value="tickets"
            className="p-3 sm:p-6"
            style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
          >
            <Card
              className="border-[#D9D9D9] bg-white shadow-sm"
              style={{
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0 4px 14.2px 0 rgba(0, 0, 0, 0.10)",
              }}
            >
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                    <Ticket className="w-5 h-5 text-[#C72030]" />
                  </div>
                  TICKETS
                </CardTitle>
              </CardHeader>
              <CardContent
                className="p-6"
                style={{ backgroundColor: "rgba(246, 247, 247, 1)" }}
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#EDEAE3]">
                        <TableHead className="font-semibold text-[#1a1a1a]">
                          ID
                        </TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">
                          Title
                        </TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">
                          Category
                        </TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">
                          Updated By
                        </TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">
                          Created At
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {ticketsLoading && (
                        <TableRow className="border-b border-gray-200">
                          <TableCell
                            colSpan={6}
                            className="text-center text-gray-600"
                          >
                            Loading tickets...
                          </TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading && ticketsError && (
                        <TableRow className="border-b border-gray-200">
                          <TableCell
                            colSpan={6}
                            className="text-center text-red-600"
                          >
                            {ticketsError}
                          </TableCell>
                        </TableRow>
                      )}
                      {!ticketsLoading &&
                        !ticketsError &&
                        tickets.length === 0 && (
                          <TableRow className="border-b border-gray-200">
                            <TableCell
                              colSpan={6}
                              className="text-center text-gray-600"
                            >
                              No tickets found.
                            </TableCell>
                          </TableRow>
                        )}
                      {!ticketsLoading &&
                        !ticketsError &&
                        tickets.length > 0 &&
                        tickets.map((t) => (
                          <TableRow
                            key={t.id}
                            className="border-b border-gray-200"
                          >
                            <TableCell className="text-gray-900">
                              {t.id}
                            </TableCell>
                            <TableCell className="max-w-[360px] whitespace-normal break-words text-gray-900">
                              {t.heading || "—"}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {t.category_type || "—"}
                            </TableCell>
                            <TableCell>
                              {t.status ? (
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    t.status.toLowerCase() === "open"
                                      ? "bg-gray-200 text-gray-900"
                                      : t.status.toLowerCase() === "pending"
                                        ? "bg-[#C72030] text-white"
                                        : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {t.status}
                                </span>
                              ) : (
                                "—"
                              )}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {t.updated_by || "—"}
                            </TableCell>
                            <TableCell className="text-gray-900">
                              {t.created_at
                                ? new Date(t.created_at).toLocaleDateString(
                                    "en-GB"
                                  )
                                : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AMC Visits History */}
          <TabsContent
            value="amc-visits-history"
            className="p-3 sm:p-6"
            style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
          >
            <Card
              className="border-[#D9D9D9] bg-white shadow-sm"
              style={{
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0 4px 14.2px 0 rgba(0, 0, 0, 0.10)",
              }}
            >
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                    <Calendar className="w-5 h-5 text-[#C72030]" />
                  </div>
                  AMC VISITS HISTORY
                </CardTitle>
              </CardHeader>
              <CardContent
                className="p-6"
                style={{ backgroundColor: "rgba(246, 247, 247, 1)" }}
              >
                {/* Visits Table */}
                <div className="bg-white rounded-lg border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#EDEAE3]">
                        <TableHead className="w-10" />
                        <TableHead className="font-semibold text-[#1a1a1a]">Visit #</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Visit Date</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Actual Visit Date</TableHead>
                        {/* <TableHead className="font-semibold text-[#1a1a1a]">Asset Period</TableHead> */}
                        <TableHead className="font-semibold text-[#1a1a1a]">Technician</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Remarks</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Status</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Assets Covered</TableHead>
                        <TableHead className="font-semibold text-[#1a1a1a]">Attachment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {amcVisitData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                            No visit history found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        amcVisitData.map((visit) => {
                          const isSelected = selectedVisitId === visit.id;
                          return (
                            <TableRow
                              key={visit.id}
                              className={`border-b border-gray-200 transition-colors ${
                                isSelected ? "bg-[#FFF8F8]" : "hover:bg-gray-50"
                              }`}
                            >
                              <TableCell className="w-10">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() =>
                                    setSelectedVisitId(isSelected ? null : visit.id)
                                  }
                                  className="w-4 h-4 rounded border-gray-300 accent-[#C72030] cursor-pointer"
                                />
                              </TableCell>
                              <TableCell className="font-medium text-gray-900">
                                {visit.visit_number ?? "—"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {visit.visit_date
                                  ? new Date(visit.visit_date).toLocaleDateString("en-GB")
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {(visit as any).actual_visit_date
                                  ? (() => {
                                      const raw = (visit as any).actual_visit_date as string;
                                      if (raw.includes("/")) return raw;
                                      const d = new Date(raw);
                                      return isNaN(d.getTime()) ? raw : d.toLocaleDateString("en-GB");
                                    })()
                                  : "—"}
                              </TableCell>
                              {/* <TableCell className="text-gray-900">
                                {visit.asset_period || "—"}
                              </TableCell> */}
                              <TableCell className="text-gray-900">
                                {visit.technician?.name || "—"}
                              </TableCell>
                              <TableCell className="text-gray-900 max-w-[200px] whitespace-normal break-words">
                                {visit.remarks || "—"}
                              </TableCell>
                              <TableCell>
                                {(visit as any).status ? (
                                  <span
                                    className={`px-2 py-1 text-xs font-medium rounded uppercase tracking-wide ${
                                      (visit as any).status.toLowerCase() === "completed"
                                        ? "bg-green-100 text-green-800"
                                        : (visit as any).status.toLowerCase() === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {((visit as any).status as string).toUpperCase()}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-sm">—</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {(() => {
                                  const ids: any[] = (visit as any).asset_ids || (visit as any).amc_asset_ids || [];
                                  const total = amcDetails?.amc_assets?.length ?? 0;
                                  const covered = ids.length;
                                  return covered > 0 ? (
                                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF0F0] text-[#C72030]">
                                      {covered}{total > 0 ? ` / ${total}` : ""}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 text-sm">—</span>
                                  );
                                })()}
                              </TableCell>
                              <TableCell>
                                {visit.attachment?.document || visit.attachment?.document_url ? (
                                  <a
                                    href={visit.attachment.document || visit.attachment.document_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-[#C72030] hover:underline text-sm"
                                  >
                                    <FileText className="w-4 h-4" />
                                    View
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-sm">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Visit Modal */}
            <Dialog open={showVisitEditModal} onOpenChange={setShowVisitEditModal}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="border-b border-gray-100 pb-3">
                  <DialogTitle className="text-[#1a1a1a] font-semibold text-base uppercase tracking-wide">
                    Add Visit
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-3">
                  {/* Row 1: Visit Number + Visit Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Visit Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={visitEditVisitNumber}
                        onChange={(e) => setVisitEditVisitNumber(e.target.value)}
                        placeholder="Enter Visit Number"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Visit Date</label>
                      <input
                        type="date"
                        value={visitEditVisitDate}
                        onChange={(e) => setVisitEditVisitDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Actual Visit Date + Technician */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Actual Visit Date</label>
                      <input
                        type="date"
                        value={visitEditActualVisitDate}
                        onChange={(e) => setVisitEditActualVisitDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Technician</label>
                      <select
                        value={visitEditTechnicianId}
                        onChange={(e) => setVisitEditTechnicianId(e.target.value)}
                        disabled={visitTechniciansLoading}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030] disabled:bg-gray-50"
                      >
                        <option value="">
                          {visitTechniciansLoading ? "Loading..." : "Select Technician"}
                        </option>
                        {visitTechnicians.map((t) => (
                          <option key={t.id} value={String(t.id)}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Remarks</label>
                    <textarea
                      value={visitEditRemarks}
                      onChange={(e) => setVisitEditRemarks(e.target.value)}
                      rows={3}
                      placeholder="Enter remarks..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                    />
                  </div>

                  {/* Row 3: Status + Attachment */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={visitEditStatus}
                        onChange={(e) => setVisitEditStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C72030]"
                      >
                        <option value="">Select status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Attachment</label>
                      <div
                        className="flex items-center gap-2 border border-dashed border-gray-300 rounded-md px-3 py-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => document.getElementById("visit-doc-input")?.click()}
                      >
                        <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-500 truncate flex-1">
                          {visitEditDocument ? visitEditDocument.name : "Choose File"}
                        </span>
                        {visitEditDocument && (
                          <button
                            className="text-xs text-red-500 hover:underline flex-shrink-0"
                            onClick={(e) => { e.stopPropagation(); setVisitEditDocument(null); }}
                          >
                            Remove
                          </button>
                        )}
                        <input
                          id="visit-doc-input"
                          type="file"
                          className="hidden"
                          onChange={(e) => setVisitEditDocument(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Assets Table */}
                  {amcDetails?.amc_assets && amcDetails.amc_assets.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                          Assets — select completed
                        </label>
                        <span className="text-sm font-semibold text-[#C72030] bg-[#FFF0F0] px-2.5 py-0.5 rounded-full">
                          {visitEditSelectedAssetIds.length} / {amcDetails.amc_assets.length}
                        </span>
                      </div>
                      <div className="border border-gray-200 rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-[#EDEAE3]">
                              <TableHead className="w-10">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 accent-[#C72030] cursor-pointer"
                                  checked={
                                    visitEditSelectedAssetIds.length === amcDetails.amc_assets.length
                                  }
                                  onChange={(e) =>
                                    setVisitEditSelectedAssetIds(
                                      e.target.checked
                                        ? amcDetails.amc_assets.map((a: any) => a.asset_id)
                                        : []
                                    )
                                  }
                                />
                              </TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a] text-xs">Asset Name</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a] text-xs">Asset Code</TableHead>
                              <TableHead className="font-semibold text-[#1a1a1a] text-xs">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="bg-white">
                            {amcDetails.amc_assets.map((asset: any) => {
                              const checked = visitEditSelectedAssetIds.includes(asset.asset_id);
                              return (
                                <TableRow
                                  key={asset.id}
                                  className={`border-b border-gray-100 cursor-pointer transition-colors ${checked ? "bg-[#FFF8F8]" : "hover:bg-gray-50"}`}
                                  onClick={() =>
                                    setVisitEditSelectedAssetIds((prev) =>
                                      checked
                                        ? prev.filter((x) => x !== asset.asset_id)
                                        : [...prev, asset.asset_id]
                                    )
                                  }
                                >
                                  <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 accent-[#C72030] cursor-pointer"
                                      checked={checked}
                                      onChange={() =>
                                        setVisitEditSelectedAssetIds((prev) =>
                                          checked
                                            ? prev.filter((x) => x !== asset.asset_id)
                                            : [...prev, asset.asset_id]
                                        )
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-900 py-2">
                                    {asset.asset_name || "—"}
                                  </TableCell>
                                  <TableCell className="text-sm text-gray-600 py-2">
                                    {asset.asset_code || "—"}
                                  </TableCell>
                                  <TableCell className="py-2">
                                    <span
                                      className={`px-2 py-0.5 text-xs rounded uppercase font-medium ${
                                        asset.asset_status === "active"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-gray-100 text-gray-600"
                                      }`}
                                    >
                                      {asset.asset_status || "—"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center gap-3 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      onClick={() => setShowVisitEditModal(false)}
                      disabled={visitUpdateLoading}
                      className="min-w-[100px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      style={{ backgroundColor: "#C72030" }}
                      className="text-white hover:bg-[#C72030]/90 min-w-[100px]"
                      disabled={visitUpdateLoading}
                      onClick={handleVisitUpdate}
                    >
                      {visitUpdateLoading ? "Saving..." : "Submit"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Asset Information */}
          {amcDetails.amc_type === "Asset" && (
            <TabsContent value="asset-information" className="p-3 sm:p-6">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <Boxes className="h-4 w-4" />
                    </div> */}
                    <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                      <Boxes className="w-5 h-5 text-[#C72030]" />
                    </div>
                    ASSET INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px]">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Asset ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Under Warranty</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amcDetails.amc_assets?.length > 0 ? (
                          amcDetails.amc_assets.map((asset) => (
                            <TableRow key={asset.id} className="bg-white">
                              <TableCell>
                                <a
                                  href={`/maintenance/asset/details/${asset.asset_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell>{asset.asset_id || "—"}</TableCell>
                              <TableCell>{asset.asset_name || "—"}</TableCell>
                              <TableCell>
                                {asset.warranty === true
                                  ? "Yes"
                                  : asset.warranty === false
                                    ? "No"
                                    : "NA"}
                              </TableCell>{" "}
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    asset.asset_status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {asset.asset_status?.replace("_", " ") || "—"}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-sm text-gray-500"
                            >
                              No assets found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {amcDetails.amc_type === "Service" && (
            <TabsContent value="asset-information" className="p-3 sm:p-6">
              <Card className="border">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    {/* <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                      <Boxes className="h-4 w-4" />
                    </div> */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] text-white text-xs mr-3">
                      <Boxes className="w-5 h-5 text-[#C72030]" />
                    </div>
                    SERVICE INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-[15px]">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Service ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Group ID</TableHead>
                          <TableHead>Sub Group ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amcDetails.amc_services?.length > 0 ? (
                          amcDetails.amc_services.map((svc) => (
                            <TableRow key={svc.id} className="bg-white">
                              <TableCell>
                                <a
                                  href={`/maintenance/service/details/${svc.service_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell>{svc.service_id || "—"}</TableCell>
                              <TableCell>{svc.service_name || "—"}</TableCell>
                              <TableCell>
                                {svc.sset_code || svc.asset_code || "—"}
                              </TableCell>
                              <TableCell>{svc.group_id ?? "—"}</TableCell>
                              <TableCell>{svc.sub_group_id ?? "—"}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="text-center text-sm text-gray-500"
                            >
                              No services found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Association */}
          <TabsContent
            value="association"
            className="p-3 sm:p-6"
            style={{ backgroundColor: "rgba(250, 250, 250, 1)" }}
          >
            <Card
              className="border-[#D9D9D9] bg-white shadow-sm"
              style={{
                borderRadius: "4px",
                background: "#FFF",
                boxShadow: "0 4px 14.2px 0 rgba(0, 0, 0, 0.10)",
              }}
            >
              <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
                <CardTitle className="text-[#1a1a1a] font-semibold text-lg flex items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#E5E0D3] mr-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                        stroke="#C72030"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
                        stroke="#C72030"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  ASSET / SERVICE
                </CardTitle>
              </CardHeader>
              <CardContent
                className="p-6"
                style={{ backgroundColor: "rgba(246, 247, 247, 1)" }}
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#EDEAE3]">
                        {amcDetails.amc_type === "Service" ? (
                          <>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Action
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Service ID
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Name
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Group & Sub Group
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Status
                            </TableHead>
                          </>
                        ) : (
                          <>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Action
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Equipment ID
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Asset Name
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Model No.
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Group & Sub Group
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Status
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Criticality
                            </TableHead>
                            <TableHead className="font-semibold text-[#1a1a1a]">
                              Location
                            </TableHead>
                          </>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="bg-white">
                      {amcDetails.amc_type === "Service" ? (
                        amcDetails.amc_services?.length > 0 ? (
                          amcDetails.amc_services.map((service) => (
                            <TableRow
                              key={service.id}
                              className="border-b border-gray-200"
                            >
                              <TableCell>
                                <a
                                  href={`/maintenance/service/details/${service.service_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {service.service_id || "—"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {service.service_name || "—"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {[service.group_name, service.sub_group_name]
                                  .filter(Boolean)
                                  .join(" / ") || "—"}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    (service as any).status === "Active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {(service as any).status || "—"}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow className="border-b border-gray-200">
                            <TableCell
                              colSpan={5}
                              className="text-center text-sm text-gray-500"
                            >
                              No services found
                            </TableCell>
                          </TableRow>
                        )
                      ) : amcDetails.amc_assets?.length > 0 ? (
                        amcDetails.amc_assets.map((asset: any) => {
                          const locationParts = [
                            asset.building_name || asset.building,
                            asset.wing_name || asset.wing,
                            asset.area_name || asset.area,
                            asset.floor_name || asset.floor,
                            asset.room_name || asset.room,
                          ].filter(Boolean);
                          const location =
                            locationParts.length > 0
                              ? locationParts.join(", ")
                              : "—";
                          const groupSubGroup =
                            [asset.group_name, asset.sub_group_name]
                              .filter(Boolean)
                              .join(" / ") || "—";
                          return (
                            <TableRow
                              key={asset.id}
                              className="border-b border-gray-200"
                            >
                              <TableCell>
                                <a
                                  href={`/maintenance/asset/details/${asset.asset_id}`}
                                  className="text-gray-600 hover:text-black"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {asset.equipment_id ||
                                  asset.asset_code ||
                                  asset.asset_id ||
                                  "—"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {asset.asset_name || "—"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {asset.model_no || asset.model_number || "—"}
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {groupSubGroup}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    asset.asset_status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {asset.asset_status?.replace("_", " ") || "—"}
                                </span>
                              </TableCell>
                              <TableCell className="text-gray-900">
                                {asset.criticality || "—"}
                              </TableCell>
                              <TableCell className="text-gray-900 text-sm">
                                {location}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow className="border-b border-gray-200">
                          <TableCell
                            colSpan={8}
                            className="text-center text-sm text-gray-500"
                          >
                            No assets found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed selection panel — mirrors AssetSelectionPanel style */}
      {selectedVisitId !== null && (
        <div
          className="fixed bg-white border border-gray-200 rounded-sm shadow-lg z-50"
          style={{ bottom: "24px", left: "50%", transform: "translateX(-50%)", width: "760px", height: "90px" }}
        >
          <div className="flex items-center justify-between w-full h-full pr-6">
            {/* Left: count badge + visit label */}
            <div className="flex items-center gap-2">
              <div className="text-[#C72030] bg-[#C4B89D] rounded-l-sm w-[44px] h-[90px] flex items-center justify-center text-sm font-bold flex-shrink-0">
                1
              </div>
              <div className="flex flex-col justify-center px-3 py-2">
                <span className="text-[16px] font-semibold text-[#1A1A1A] whitespace-nowrap leading-none">
                  Selection
                </span>
                <span className="text-[12px] font-medium text-[#6B7280] leading-tight">
                  {(() => {
                    const v = amcVisitData.find((x) => x.id === selectedVisitId);
                    return v
                      ? `Visit #${v.visit_number} — ${v.visit_date ? new Date(v.visit_date).toLocaleDateString("en-GB") : ""}`
                      : `Visit ID: ${selectedVisitId}`;
                  })()}
                </span>
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex items-center ml-6">
              {/* Edit */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:bg-gray-100 flex flex-col items-center gap-1 h-auto mr-6"
                onClick={() => {
                  const visit = amcVisitData.find((v) => v.id === selectedVisitId);
                  setVisitEditVisitNumber(String((visit as any)?.visit_number ?? ""));
                  setVisitEditVisitDate((visit as any)?.visit_date ? (() => {
                    const raw = (visit as any).visit_date as string;
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
                      const [d, m, y] = raw.split("/");
                      return `${y}-${m}-${d}`;
                    }
                    return raw.slice(0, 10);
                  })() : "");
                  setVisitEditActualVisitDate((visit as any)?.actual_visit_date ? (() => {
                    const raw = (visit as any).actual_visit_date as string;
                    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
                      const [d, m, y] = raw.split("/");
                      return `${y}-${m}-${d}`;
                    }
                    return raw.slice(0, 10);
                  })() : "");
                  setVisitEditTechnicianId(String(visit?.technician?.id ?? ""));
                  setVisitEditRemarks((visit as any)?.remarks || "");
                  setVisitEditStatus((visit as any)?.status || "");
                  setVisitEditDocument(null);
                  // Pre-select assets that were already covered in this visit
                  const existingAssetIds: number[] = (
                    (visit as any)?.asset_ids ||
                    (visit as any)?.amc_asset_ids ||
                    (visit as any)?.covered_asset_ids ||
                    []
                  ).map(Number).filter(Boolean);
                  setVisitEditSelectedAssetIds(existingAssetIds);
                  fetchVisitTechnicians();
                  setShowVisitEditModal(true);
                }}
              >
                <svg
                  className="w-5 h-5 mt-3"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="visit-sel-edit-mask"
                    style={{ maskType: "alpha" }}
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="21"
                    height="21"
                  >
                    <rect width="21" height="21" fill="#1C1B1F" />
                  </mask>
                  <g mask="url(#visit-sel-edit-mask)">
                    <path
                      d="M4.375 16.625H5.47881L14.4358 7.66806L13.3319 6.56425L4.375 15.5212V16.625ZM3.0625 17.9375V14.9761L14.6042 3.43941C14.7365 3.31924 14.8825 3.22642 15.0423 3.16094C15.2023 3.09531 15.37 3.0625 15.5455 3.0625C15.7209 3.0625 15.8908 3.09364 16.0552 3.15591C16.2197 3.21818 16.3653 3.3172 16.492 3.45297L17.5606 4.53491C17.6964 4.66164 17.7931 4.80747 17.8509 4.97241C17.9086 5.13734 17.9375 5.30228 17.9375 5.46722C17.9375 5.64324 17.9075 5.81117 17.8474 5.971C17.7873 6.13098 17.6917 6.2771 17.5606 6.40937L6.02394 17.9375H3.0625ZM13.8742 7.12578L13.3319 6.56425L14.4358 7.66806L13.8742 7.12578Z"
                      fill="#1C1B1F"
                    />
                  </g>
                </svg>
                <span className="text-xs font-medium">Edit</span>
              </Button>

              <div className="w-px h-8 bg-gray-300 mr-6" />

              {/* Clear */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedVisitId(null)}
                className="text-gray-600 hover:bg-gray-100"
                style={{ width: "44px", height: "44px" }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddVisitModal
        isOpen={showAddVisitModal}
        onClose={hanldeClose}
        amcId={amcDetails?.id?.toString() || id || ""}
      />
    </div>
  );
};
