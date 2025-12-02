import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, FileSpreadsheet, X } from "lucide-react";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from "@mui/material";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { API_CONFIG } from "@/config/apiConfig";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_NUMBERS = Array.from({ length: 31 }, (_, idx) => idx + 1);
const HOUR_VALUES = Array.from({ length: 24 }, (_, idx) => idx);
const MINUTE_VALUES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const WEEKDAY_CODE_TO_NAME: Record<string, string> = {
  "1": "Sunday",
  "2": "Monday",
  "3": "Tuesday",
  "4": "Wednesday",
  "5": "Thursday",
  "6": "Friday",
  "7": "Saturday",
};

type CronConfig = {
  monthMode: "all" | "specific" | "between";
  selectedMonths: string[];
  betweenMonthStart: string;
  betweenMonthEnd: string;
  dayMode: "all" | "weekdays" | "specific";
  selectedWeekdays: string[];
  selectedDays: number[];
  hourMode: "all" | "specific";
  selectedHours: number[];
  minuteMode: "all" | "specific" | "between";
  selectedMinutes: number[];
  betweenMinuteStart: number;
  betweenMinuteEnd: number;
  };

const parseCronExpression = (cron?: string | null): CronConfig => {
  const defaultConfig: CronConfig = {
    monthMode: "all",
    selectedMonths: [...MONTHS],
    betweenMonthStart: "January",
    betweenMonthEnd: "December",
    dayMode: "all",
    selectedWeekdays: [...WEEKDAYS],
    selectedDays: [...DAY_NUMBERS],
    hourMode: "all",
    selectedHours: [...HOUR_VALUES],
    minuteMode: "all",
    selectedMinutes: [...MINUTE_VALUES],
    betweenMinuteStart: 0,
    betweenMinuteEnd: 0,
  };

  if (!cron) {
    return defaultConfig;
  }

  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) {
    return defaultConfig;
  }

  const [minuteField, hourField, dayOfMonthField, monthField, dayOfWeekField] = parts;
  const config: CronConfig = { ...defaultConfig, selectedMonths: [], selectedWeekdays: [], selectedDays: [], selectedHours: [], selectedMinutes: [] };

  // Minutes
  if (minuteField === "*") {
    config.minuteMode = "all";
    config.selectedMinutes = [...MINUTE_VALUES];
  } else if (minuteField.includes("-")) {
    const [startRaw, endRaw] = minuteField.split("-");
    const start = Number(startRaw);
    const end = Number(endRaw);
    config.minuteMode = "between";
    config.betweenMinuteStart = Number.isNaN(start) ? 0 : start;
    config.betweenMinuteEnd = Number.isNaN(end) ? config.betweenMinuteStart : end;
  } else {
    config.minuteMode = "specific";
    config.selectedMinutes = minuteField
      .split(",")
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
  }

  // Hours
  if (hourField === "*") {
    config.hourMode = "all";
    config.selectedHours = [...HOUR_VALUES];
  } else {
    config.hourMode = "specific";
    config.selectedHours = hourField
      .split(",")
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
  }

  // Days
  if (dayOfWeekField !== "?" && dayOfWeekField !== "*") {
    config.dayMode = "weekdays";
    config.selectedWeekdays = dayOfWeekField
      .split(",")
      .map((code) => WEEKDAY_CODE_TO_NAME[code] || "")
      .filter(Boolean);
    config.selectedDays = [];
  } else if (dayOfMonthField !== "?" && dayOfMonthField !== "*") {
    config.dayMode = "specific";
    config.selectedDays = dayOfMonthField
      .split(",")
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));
    config.selectedWeekdays = [];
  } else {
    config.dayMode = "all";
    config.selectedWeekdays = [...WEEKDAYS];
    config.selectedDays = [...DAY_NUMBERS];
  }

  // Months
  if (monthField === "*") {
    config.monthMode = "all";
    config.selectedMonths = [...MONTHS];
  } else if (monthField.includes("-")) {
    const [startRaw, endRaw] = monthField.split("-");
    const startIdx = Number(startRaw) - 1;
    const endIdx = Number(endRaw) - 1;
    config.monthMode = "between";
    config.betweenMonthStart = MONTHS[startIdx] || "January";
    config.betweenMonthEnd = MONTHS[endIdx] || config.betweenMonthStart;

    if (startIdx >= 0 && endIdx >= 0) {
      const minIdx = Math.min(startIdx, endIdx);
      const maxIdx = Math.max(startIdx, endIdx);
      config.selectedMonths = MONTHS.slice(minIdx, maxIdx + 1);
      }
  } else {
    config.monthMode = "specific";
    config.selectedMonths = monthField
      .split(",")
      .map((value) => {
        const idx = Number(value) - 1;
        return MONTHS[idx] || "";
      })
      .filter(Boolean);
    }

  return config;
  };

const extractDocuments = (items?: any[]): any[] => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.flatMap((item) => item?.documents || []).filter((doc: any) => doc && doc.document_url);
};

const getServiceNames = (amc_services?: any[]): string[] => {
  if (!Array.isArray(amc_services)) {
    return [];
  }
  return amc_services
    .filter((service: any) => service?.service_name)
    .map((service: any) => service.service_name);
};

const getServiceGroupInfo = (
  amc_services?: any[]
): { groupName: string; subGroupName: string } => {
  if (!Array.isArray(amc_services) || amc_services.length === 0) {
    return { groupName: "", subGroupName: "" };
  }
  // Prefer the first service entry – in current API samples, group/sub-group
  // are the same across services for a given AMC
  const first = amc_services[0] as any;
    return {
    groupName: first?.group_name || "",
    subGroupName: first?.sub_group_name || "",
  };
};

const getGroupNames = (items?: any[], type: 'service' | 'asset' = 'service'): string => {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }
  const groupName = items.find((item: any) => item?.group_name)?.group_name;
  return groupName || '';
};

const getSubGroupNames = (items?: any[], type: 'service' | 'asset' = 'service'): string => {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }
  const subGroupName = items.find((item: any) => item?.sub_group_name)?.sub_group_name;
  return subGroupName || '';
};

interface AMCDetailsPreviewTabProps {
  amc: any;
  amcId?: string | number;
}

export const AMCDetailsPreviewTab: React.FC<AMCDetailsPreviewTabProps> = ({
  amc,
  amcId,
}) => {
  const [showScheduleSection, setShowScheduleSection] = useState(false);
  const cronExpression = amc?.cron_expression || "";
  const cronConfig = useMemo(() => parseCronExpression(cronExpression), [cronExpression]);
  const contractDocuments = useMemo(
    () => extractDocuments((amc as any)?.amc_contracts),
    [amc?.amc_contracts]
  );
  const invoiceDocuments = useMemo(
    () => extractDocuments((amc as any)?.amc_invoices),
    [amc?.amc_invoices]
  );
  const { groupName: serviceGroupName, subGroupName: serviceSubGroupName } = useMemo(
    () => getServiceGroupInfo((amc as any)?.amc_services),
    [amc?.amc_services]
  );
  const [previewDoc, setPreviewDoc] = useState<{ url: string; name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const normalizedAmcType = (amc?.amc_type || "").toString().toLowerCase();
  const isAssetType =
    normalizedAmcType === "asset" ||
    (!normalizedAmcType && !!amc?.asset_id && !amc?.service_id);
  const isServiceType =
    normalizedAmcType === "service" ||
    (!normalizedAmcType && !!amc?.service_id && !amc?.asset_id);
  const normalizedDetailsType = (amc?.amc_details_type || "").toString().toLowerCase();
  const inferredIndividual = (amc?.amc_assets?.length || 0) <= 1;
  const isIndividualType = normalizedDetailsType
    ? normalizedDetailsType === "individual"
    : inferredIndividual;
  const isGroupType = !isIndividualType;

  const getNormalizedBaseUrl = () => {
    const storedBase = localStorage.getItem("baseUrl");
    const fallback = API_CONFIG.BASE_URL || "";
    const base = storedBase && storedBase.trim().length ? storedBase : fallback;
    if (!base) return "";
    const normalized = base.startsWith("http") ? base : `https://${base}`;
    return normalized.replace(/\/$/, "");
  };

  const fetchAttachmentBlob = async (doc: any) => {
    if (!doc?.attachment_id) {
      console.error("[AMCDetailsPreviewTab] Missing attachment_id", doc);
      return null;
    }
      const token = localStorage.getItem("token");
    if (!token) {
      console.error("[AMCDetailsPreviewTab] Missing auth token");
      return null;
    }
    const baseUrl = getNormalizedBaseUrl();
    if (!baseUrl) {
      console.error("[AMCDetailsPreviewTab] Missing base URL");
      return null;
    }

    const apiUrl = `${baseUrl}/attachfiles/${doc.attachment_id}?show_file=true`;
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
      throw new Error("Failed to fetch attachment");
        }

        const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    return { url };
  };

  const handlePreview = async (doc: any) => {
    try {
      const result = await fetchAttachmentBlob(doc);
      if (!result) return;
      setPreviewDoc({
        url: result.url,
        name: doc.document_name || `document_${doc.attachment_id || doc.id}`,
        });
        setIsModalOpen(true);
    } catch (error) {
      console.error("[AMCDetailsPreviewTab] Failed to preview attachment", error);
    }
  };

  const handleDownload = async (doc: any) => {
    try {
      const result = await fetchAttachmentBlob(doc);
      if (!result) return;
      const downloadName = doc.document_name || `document_${doc.attachment_id || doc.id}`;
        const link = document.createElement("a");
      link.href = result.url;
      link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      window.URL.revokeObjectURL(result.url);
    } catch (error) {
      console.error("[AMCDetailsPreviewTab] Failed to download attachment", error);
    }
  };

  const closePreview = () => {
    if (previewDoc?.url) {
      window.URL.revokeObjectURL(previewDoc.url);
    }
    setPreviewDoc(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    return () => {
      if (previewDoc?.url) {
        window.URL.revokeObjectURL(previewDoc.url);
      }
    };
  }, [previewDoc]);

  const renderAttachmentCards = (documents: any[], emptyMessage: string) => {
    if (!documents.length) {
      return <p className="text-gray-500 text-sm">{emptyMessage}</p>;
    }

    return documents.map((doc: any) => {
      const key = doc.id || doc.attachment_id;
      const docName = doc.document_name || `Document_${key}`;
      const url = doc.document_url || "";
      const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url);
      const isPdf = /\.pdf$/i.test(url);
      const isExcel = /\.(xls|xlsx|csv)$/i.test(url);
      const isWord = /\.(doc|docx)$/i.test(url);
      const isDownloadOnly = !isImage;

      const iconElement = (() => {
        if (isPdf) {
          return (
            <div className="w-14 h-14 flex items-center justify-center border rounded-md text-red-600 bg-white mb-2">
              <FileText className="w-6 h-6" />
            </div>
          );
        }
        if (isExcel) {
          return (
            <div className="w-14 h-14 flex items-center justify-center border rounded-md text-green-600 bg-white mb-2">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
          );
        }
        if (isWord) {
          return (
            <div className="w-14 h-14 flex items-center justify-center border rounded-md text-blue-600 bg-white mb-2">
              <FileText className="w-6 h-6" />
            </div>
          );
        }
        return (
          <div className="w-14 h-14 flex items-center justify-center border rounded-md text-gray-600 bg-white mb-2">
            <FileText className="w-6 h-6" />
          </div>
        );
      })();

            return (
              <div
          key={key}
          className="flex relative flex-col items-center border rounded-lg pt-8 px-3 pb-4 w-full max-w-[150px] bg-white shadow-md"
              >
                {isImage ? (
                  <>
                    <button
                      className="absolute top-2 right-2 z-10 p-1 text-gray-600 hover:text-black rounded-full"
                      title="View"
                onClick={() => handlePreview(doc)}
                      type="button"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <img
                src={url}
                alt={docName}
                      className="w-14 h-14 object-cover rounded-md border mb-2 cursor-pointer"
                onClick={() => handlePreview(doc)}
                    />
                  </>
                ) : (
            iconElement
                )}
          <span className="text-xs text-center truncate max-w-[120px] mb-2 font-medium">{docName}</span>
          {isDownloadOnly && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-5 w-5 p-0 text-gray-600 hover:text-black"
              onClick={() => handleDownload(doc)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
    });
  };

  const isMonthChecked = (month: string) => cronConfig.selectedMonths.includes(month);

  const isWeekdayChecked = (day: string) => {
    if (cronConfig.dayMode === "all") return true;
    if (cronConfig.dayMode === "weekdays") {
      return cronConfig.selectedWeekdays.includes(day);
    }
    return false;
  };

  const isDayNumberChecked = (day: number) => {
    if (cronConfig.dayMode === "all") return true;
    if (cronConfig.dayMode === "specific") {
      return cronConfig.selectedDays.includes(day);
    }
    return false;
  };

  const isHourChecked = (hour: number) => {
    if (cronConfig.hourMode === "all") return true;
    return cronConfig.selectedHours.includes(hour);
  };

  const isMinuteChecked = (minute: number) => {
    if (cronConfig.minuteMode === "all") return true;
    if (cronConfig.minuteMode === "specific") {
      return cronConfig.selectedMinutes.includes(minute);
    }
    const start = cronConfig.betweenMinuteStart;
    const end = cronConfig.betweenMinuteEnd;
    if (start <= end) {
      return minute >= start && minute <= end;
    }
    return minute >= end && minute <= start;
  };

  const betweenMonthStartValue = cronConfig.betweenMonthStart || "January";
  const betweenMonthEndValue = cronConfig.betweenMonthEnd || betweenMonthStartValue;
  const betweenMinuteStartValue = cronConfig.betweenMinuteStart.toString().padStart(2, "0");
  const betweenMinuteEndValue = cronConfig.betweenMinuteEnd.toString().padStart(2, "0");


  // Material-UI field styles to match AddAMCPage
  const fieldStyles = {
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d1d5db',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#C72030',
    },
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "DD/MM/YYYY";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount: number | null): string => {
    if (!amount) return "Enter Cost";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPaymentTerm = (term: string | null | undefined): string => {
    if (!term) return "Select Payment Terms";
    const termMap: { [key: string]: string } = {
      'monthly': 'Monthly',
      'quarterly': 'Quarterly',
      'half-yearly': 'Half Yearly',
      'yearly': 'Yearly',
      'full_payment': 'Full Payment',
      'visit_based_payment': 'Visit Based Payment',
    };
    return termMap[term] || term;
  };

  return (
    <div className="space-y-6">
      {/* AMC Configuration Section */}
      <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
      }}>
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
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
               AMC CONFIGURATION
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
            <div>
              <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Details</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="details"
                    value="Asset"
                    checked={isAssetType}
                    readOnly
                    className="mr-2 w-4 h-4"
                    style={{ accentColor: '#C72030' }}
                  />
                  <span className="text-[#1a1a1a] font-medium">Asset</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="details"
                    value="Service"
                    checked={isServiceType}
                    readOnly
                    className="mr-2 w-4 h-4"
                    style={{ accentColor: '#C72030' }}
                  />
                  <span className="text-[#1a1a1a] font-medium">Service</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-[#1a1a1a]">Type</label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="Individual"
                    checked={isIndividualType}
                    readOnly
                    className="mr-2 w-4 h-4"
                    style={{ accentColor: '#C72030' }}
                  />
                  <span className="text-[#1a1a1a] font-medium">Individual</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value="Group"
                    checked={isGroupType}
                    readOnly
                    className="mr-2 w-4 h-4"
                    style={{ accentColor: '#C72030' }}
                  />
                  <span className="text-[#1a1a1a] font-medium">Group</span>
                </label>
              </div>
            </div>

            {isIndividualType ? (
              <>
                {isAssetType ? (
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Assets <span style={{ color: '#C72030' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Assets"
                      displayEmpty
                      multiple
                      value={Array.isArray(amc?.amc_assets) ? amc.amc_assets.map((asset: any) => asset.asset_name).filter(Boolean) : []}
                      disabled
                    >
                      <MenuItem value=""><em>Select Assets</em></MenuItem>
                      {Array.isArray(amc?.amc_assets) && amc.amc_assets.map((asset: any) => (
                        <MenuItem key={asset.id} value={asset.asset_name}>
                          {asset.asset_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                ) : (
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Service <span style={{ color: '#C72030' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Service"
                      displayEmpty
                      multiple
                      value={getServiceNames(amc?.amc_services)}
                      disabled
                    >
                      <MenuItem value=""><em>Select Services</em></MenuItem>
                      {Array.isArray(amc?.amc_services) && amc.amc_services.map((service: any) => (
                        <MenuItem key={service.id} value={service.service_name}>
                          {service.service_name}
                        </MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                )}

                <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                  <InputLabel shrink>Supplier <span style={{ color: '#C72030' }}>*</span></InputLabel>
                  <MuiSelect
                    label="Supplier"
                    displayEmpty
                    value={amc?.amc_vendor_name || ''}
                    disabled
                  >
                    <MenuItem value=""><em>Select Supplier</em></MenuItem>
                    <MenuItem value={amc?.amc_vendor_name || ''}>{amc?.amc_vendor_name || 'Supplier Selected'}</MenuItem>
                  </MuiSelect>
                </FormControl>

                {/* Group & Sub Group derived from amc_services */}
                {isServiceType && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField
                      disabled
                      label="Group"
                      placeholder="Group"
                      fullWidth
                      value={serviceGroupName || ''}
                      sx={{ mb: 3 }}
                    />
                    <TextField
                      disabled
                      label="Sub Group"
                      placeholder="Sub Group"
                      fullWidth
                      value={serviceSubGroupName || ''}
                      sx={{ mb: 3 }}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Group</InputLabel>
                    <MuiSelect
                      label="Group"
                      displayEmpty
                      value={isAssetType ? getGroupNames(amc?.amc_assets, 'asset') : getGroupNames(amc?.amc_services, 'service')}
                      disabled
                    >
                      <MenuItem value=""><em>Select Group</em></MenuItem>
                      <MenuItem value={isAssetType ? getGroupNames(amc?.amc_assets, 'asset') : getGroupNames(amc?.amc_services, 'service')}>
                        {(isAssetType ? getGroupNames(amc?.amc_assets, 'asset') : getGroupNames(amc?.amc_services, 'service')) || 'Group Selected'}
                      </MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>SubGroup</InputLabel>
                    <MuiSelect
                      label="SubGroup"
                      displayEmpty
                      value={isAssetType ? getSubGroupNames(amc?.amc_assets, 'asset') : getSubGroupNames(amc?.amc_services, 'service')}
                      disabled
                    >
                      <MenuItem value=""><em>Select Sub Group</em></MenuItem>
                      <MenuItem value={isAssetType ? getSubGroupNames(amc?.amc_assets, 'asset') : getSubGroupNames(amc?.amc_services, 'service')}>
                        {(isAssetType ? getSubGroupNames(amc?.amc_assets, 'asset') : getSubGroupNames(amc?.amc_services, 'service')) || 'SubGroup Selected'}
                      </MenuItem>
                    </MuiSelect>
                  </FormControl>

                  <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                    <InputLabel shrink>Supplier <span style={{ color: '#C72030' }}>*</span></InputLabel>
                    <MuiSelect
                      label="Supplier"
                      displayEmpty
                      value={amc?.amc_vendor_name || ''}
                      disabled
                    >
                      <MenuItem value=""><em>Select Supplier</em></MenuItem>
                      <MenuItem value={amc?.amc_vendor_name || ''}>{amc?.amc_vendor_name || 'Supplier Selected'}</MenuItem>
                    </MuiSelect>
                  </FormControl>
                </div>
              </>
            )}
          </CardContent>
        </Card>

      {/* AMC Details Section */}
      <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
      }}>
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
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
               AMC DETAILS
             </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                disabled
                label={<span>Contract Name <span style={{ color: 'red' }}>*</span></span>}
                placeholder="Enter Contract Name"
                fullWidth
                value={amc?.contract_name|| ''}
                sx={{ mb: 3 }}
              />

              <TextField
                disabled
                label={<span>Start Date <span style={{ color: 'red' }}>*</span></span>}
                type="date"
                fullWidth
                value={amc?.amc_start_date || ''}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <TextField
                disabled
                label={<span>End Date <span style={{ color: 'red' }}>*</span></span>}
                type="date"
                fullWidth
                value={amc?.amc_end_date || ''}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <TextField
                disabled
                label={<span>First Service Date <span style={{ color: 'red' }}>*</span></span>}
                type="date"
                fullWidth
                value={amc?.amc_first_service || ''}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth variant="outlined" sx={{ '& .MuiInputBase-root': fieldStyles }}>
                <InputLabel shrink>Payment Terms <span style={{ color: '#C72030' }}>*</span></InputLabel>
                <MuiSelect
                  label="Payment Terms"
                  displayEmpty
                  value={amc?.payment_term || ''}
                  disabled
                >
                  <MenuItem value=""><em>Select Payment Terms</em></MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="quarterly">Quarterly</MenuItem>
                  <MenuItem value="half-yearly">Half Yearly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="full_payment">Full Payment</MenuItem>
                  <MenuItem value="visit_based_payment">Visit Based Payment</MenuItem>
                </MuiSelect>
              </FormControl>

              <TextField
                disabled
                label={<span>Cost <span style={{ color: 'red' }}>*</span></span>}
                placeholder="Enter Cost"
                type="number"
                fullWidth
                value={amc?.amc_cost || ''}
                sx={{ mb: 3 }}
              />

              <TextField
                disabled
                label={<span>No. of Visits <span style={{ color: 'red' }}>*</span></span>}
                placeholder="Enter No. of Visits"
                type="number"
                fullWidth
                value={amc?.no_of_visits || ''}
                sx={{ mb: 3 }}
              />

              <TextField
                disabled
                label="Remarks"
                placeholder="Enter Remarks"
                fullWidth
                value={amc?.remarks || ''}
                sx={{ mb: 3 }}
              />

              <div></div>
            </div>
          </CardContent>
        </Card>

      {/* Schedule Section */}
      <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
      }}>
        <CardHeader className="bg-[#F6F4EE]">
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
              SCHEDULE
            </CardTitle>
            <button
              type="button"
              onClick={() => setShowScheduleSection(!showScheduleSection)}
              className="px-4 py-2 font-medium text-[#C72030] border border-[#C72030] rounded-md hover:bg-[#C72030] hover:text-white transition-colors"
              style={{
                backgroundColor: '#F6F4EE',
                color: '#C72030',
                border: '1px solid #C72030',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Change View
            </button>
          </div>
        </CardHeader>

        {/* Step Content - Schedule */}
        {!showScheduleSection ? (
          <CardContent className="p-0" style={{ backgroundColor: 'rgb(246, 247, 247)' }}>
            <div className="overflow-x-auto" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table className="min-w-full">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#F6F4EE', zIndex: 10 }}>
                  <tr className="border-b border-gray-200" style={{ backgroundColor: '#F6F4EE' }}>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 w-16">Sr. No.</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Schedule Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Schedule Time</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">AMC Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(amc?.amc_visit_logs) && amc.amc_visit_logs.length > 0 ? (
                    amc.amc_visit_logs.map((visit: any, index: number) => (
                      <tr key={visit.id || index} className="border-b border-gray-100">
                        <td className="py-3 px-4">{index + 1}.</td>
                        <td className="py-3 px-4">{visit.scheduled_date || '-'}</td>
                        <td className="py-3 px-4">{visit.scheduled_time || '-'}</td>
                      <td className="py-3 px-4">{amc?.amc_type || '-'}</td>
                        <td className="py-3 px-4">{visit.vendor_name || '-'}</td>
                    </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-100">
                      <td colSpan={5} className="py-3 px-4 text-center text-gray-500">
                        No schedule visits found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {Array.isArray(amc?.amc_visit_logs) && amc.amc_visit_logs.length > 0 && (
              <div style={{ padding: '12px 16px', backgroundColor: '#F6F4EE', borderTop: '1px solid #D9D9D9', fontSize: '12px', color: '#666' }}>
                Total {amc.amc_visit_logs.length} records. Scroll to view all.
              </div>
            )}
          </CardContent>
        ) : (
                <CardContent className="p-0" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
                  <div className="px-6 py-3 text-sm text-gray-600">
                    Cron Expression:{" "}
                    <span className="font-semibold text-[#1a1a1a]">
                      {cronExpression || "N/A"}
                    </span>
                </div>
                  <div style={{
                    background: 'rgba(246, 247, 247, 1)',
                    borderRadius: '4px',
                    padding: '0px 0px 20px 0px'
                  }}>
              {/* Four Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                {/* Month Column */}
                <div style={{
                  border: '1px dashed rgba(11, 10, 10, 0.56)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'rgba(234, 230, 221, 1)',
                    padding: '12px 16px',
                    borderBottom: '1px dashed rgba(11, 10, 10, 0.56)'
                  }}>
                    <h3 className="text-sm font-semibold text-[#1a1a1a]" style={{ background: 'rgba(234, 230, 221, 1)' }}>Month</h3>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(246, 247, 247, 1)' }}>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="monthType"
                          value="placeholder"
                          checked={cronConfig.monthMode !== "between"}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                        />
                        <span className="text-[#1a1a1a] font-medium text-sm">Placeholder</span>
                      </label>
                      
                      <div className="space-y-2 mt-4">
                        <label className="flex items-center text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cronConfig.monthMode === "all"}
                            readOnly
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Select All</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {['January', 'February', 'March', 'April', 'May', 'June', 
                            'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                            <label key={month} className="flex items-center text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isMonthChecked(month)}
                                readOnly
                                className="mr-2 w-4 h-4"
                                style={{ accentColor: '#C72030' }}
                              />
                              <span className="text-[#1a1a1a]">{month.substring(0, 3)}</span>
                            </label>
              ))}
            </div>
                      </div>
                      
                      <label className="flex items-center mt-4 cursor-pointer">
                        <input
                          type="radio"
                          name="monthType"
                          value="between"
                          checked={cronConfig.monthMode === "between"}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                        />
                        <span className="text-[#1a1a1a] font-medium text-sm">Every month between</span>
                      </label>
                      <div className="flex items-center gap-2 mt-3">
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          style={{ minWidth: '100px' }}
                          value={betweenMonthStartValue}
                          onChange={() => {}}
                        >
                          {MONTHS.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-[#1a1a1a]">and</span>
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          style={{ minWidth: '100px' }}
                          value={betweenMonthEndValue}
                          onChange={() => {}}
                        >
                          {MONTHS.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Column */}
                <div style={{
                  border: '1px dashed rgba(11, 10, 10, 0.56)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'rgba(234, 230, 221, 1)',
                    padding: '12px 16px',
                    borderBottom: '1px dashed rgba(11, 10, 10, 0.56)'
                  }}>
                    <h3 className="text-sm font-semibold text-[#1a1a1a]" style={{ background: 'rgba(234, 230, 221, 1)' }}>Day</h3>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(246, 247, 247, 1)' }}>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="dayType"
                          value="placeholder"
                          checked={cronConfig.dayMode !== "specific"}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                        />
                        <span className="text-[#1a1a1a] font-medium text-sm">Placeholder</span>
                      </label>
                      
                      <div className="space-y-2 mt-4">
                        <label className="flex items-center text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cronConfig.dayMode === "all"}
                            readOnly
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Select All</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <label key={day} className="flex items-center text-sm cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isWeekdayChecked(day)}
                                readOnly
                                className="mr-2 w-4 h-4"
                                style={{ accentColor: '#C72030' }}
                              />
                              <span className="text-[#1a1a1a]">{day.substring(0, 3)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <label className="flex items-center mt-4 cursor-pointer">
                        <input
                          type="radio"
                          name="dayType"
                          value="specific"
                          checked={cronConfig.dayMode === "specific"}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                        />
                        <span className="text-[#1a1a1a] font-medium text-sm">Specific date of month (choose one or many)</span>
                      </label>
                      <div className="grid grid-cols-6 gap-1 mt-3">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <label key={day} className="flex items-center text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isDayNumberChecked(day)}
                              readOnly
                              className="mr-1 w-3 h-3"
                              style={{ accentColor: '#C72030' }}
                            />
                            <span className="text-[#1a1a1a]">{day.toString().padStart(2, '0')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hours Column */}
                <div style={{
                  border: '1px dashed rgba(11, 10, 10, 0.56)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'rgba(234, 230, 221, 1)',
                    padding: '12px 16px',
                    borderBottom: '1px dashed rgba(11, 10, 10, 0.56)'
                  }}>
                    <h3 className="text-sm font-semibold text-[#1a1a1a]" style={{ background: 'rgba(234, 230, 221, 1)' }}>Hours</h3>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(246, 247, 247, 1)' }}>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="hourType"
                          value="specific"
                          checked={cronConfig.hourMode !== "all"}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                        />
                        <span className="text-[#1a1a1a] font-medium text-sm">Choose one or more specific hours</span>
                      </label>
                      
                      <div className="space-y-2 mt-4">
                        <label className="flex items-center text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={cronConfig.hourMode === "all"}
                            readOnly
                            className="mr-2 w-4 h-4"
                            style={{ accentColor: '#C72030' }}
                          />
                          <span className="text-[#1a1a1a] font-medium">Select All</span>
                        </label>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: 25 }, (_, i) => i).map((hour) => (
                            <label key={hour} className="flex items-center text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isHourChecked(hour)}
                                readOnly
                                className="mr-1 w-3 h-3"
                                style={{ accentColor: '#C72030' }}
                              />
                              <span className="text-[#1a1a1a]">{hour.toString().padStart(2, '0')}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Minutes Column */}
                <div style={{
                  border: '1px dashed rgba(11, 10, 10, 0.56)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: 'rgba(234, 230, 221, 1)',
                    padding: '12px 16px',
                    borderBottom: '1px dashed rgba(11, 10, 10, 0.56)'
                  }}>
                    <h3 className="text-sm font-semibold text-[#1a1a1a]" style={{ background: 'rgba(234, 230, 221, 1)' }}>Minutes</h3>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(246, 247, 247, 1)' }}>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="minuteType"
                          value="specific"
                          checked={cronConfig.minuteMode !== "between"}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                        />
                        <span className="text-[#1a1a1a] font-medium text-sm">Specific minutes (choose one or many)</span>
                      </label>
                      
                      <div className="grid grid-cols-4 gap-1 mt-4">
                        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((minute) => (
                          <label key={minute} className="flex items-center text-xs cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isMinuteChecked(minute)}
                              readOnly
                              className="mr-1 w-3 h-3"
                              style={{ accentColor: '#C72030' }}
                            />
                            <span className="text-[#1a1a1a]">{minute.toString().padStart(2, '0')} min</span>
                          </label>
                        ))}
                      </div>
                      
                      <label className="flex items-center mt-4 cursor-pointer">
                        <input
                          type="radio"
                          name="minuteType"
                          value="between"
                          checked={cronConfig.minuteMode === "between"}
                          readOnly
                          className="mr-2 w-4 h-4"
                          style={{ accentColor: '#C72030' }}
                        />
                        <span className="text-[#1a1a1a] font-medium text-sm">Every minute between minute</span>
                      </label>
                      <div className="flex items-center gap-2 mt-3">
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          style={{ minWidth: '60px' }}
                          value={betweenMinuteStartValue}
                          onChange={() => {}}
                        >
                          {MINUTE_VALUES.map((minute) => (
                            <option key={minute} value={minute.toString().padStart(2, "0")}>
                              {minute.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-[#1a1a1a]">and minute</span>
                        <select
                          className="px-2 py-1 border border-gray-300 rounded text-sm"
                          style={{ minWidth: '60px' }}
                          value={betweenMinuteEndValue}
                          onChange={() => {}}
                        >
                          {MINUTE_VALUES.map((minute) => (
                            <option key={minute} value={minute.toString().padStart(2, "0")}>
                              {minute.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </CardContent>
        )}
      </Card>

      {/* Attachments Section */}
      <Card className="border-[#D9D9D9] bg-white shadow-sm" style={{
        borderRadius: '4px',
        background: '#FFF',
        boxShadow: '0 4px 14.2px 0 rgba(0, 0, 0, 0.10)'
      }}>
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-300">
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
               ATTACHMENTS
             </CardTitle>
          </CardHeader>
          <CardContent className="p-6" style={{ backgroundColor: 'rgba(246, 247, 247, 1)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F6F4EE] rounded-lg p-6">
                <h3 className="text-[#1a1a1a] font-semibold text-base mb-3">AMC Contracts</h3>
                <div className="flex flex-wrap gap-4">
                  {renderAttachmentCards(contractDocuments, "No AMC contract attachments available")}
            </div>
              </div>

              <div className="bg-[#F6F4EE] rounded-lg p-6">
                <h3 className="text-[#1a1a1a] font-semibold text-base mb-3">AMC Invoice</h3>
                <div className="flex flex-wrap gap-4">
                  {renderAttachmentCards(invoiceDocuments, "No AMC invoice attachments available")}
                </div>
              </div>
            </div>

            <Dialog
              open={isModalOpen}
              onOpenChange={(open) => {
                if (!open) {
                  closePreview();
                } else {
                  setIsModalOpen(true);
                }
              }}
            >
          <DialogContent className="w-full max-w-[90vw] sm:max-w-2xl">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              aria-label="Close"
                  onClick={closePreview}
            >
              <X className="w-5 h-5" />
            </button>
            <DialogHeader>
                  <DialogTitle className="text-center">{previewDoc?.name}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center gap-4">
                  {previewDoc?.url && (
                <img
                      src={previewDoc.url}
                      alt={previewDoc.name}
                  className="max-w-full max-h-[400px] rounded-md border"
                />
              )}
                  {previewDoc?.url && (
              <Button
                onClick={() => {
                        if (!previewDoc?.url) return;
                        const link = document.createElement("a");
                        link.href = previewDoc.url;
                        link.download = previewDoc.name || "document";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}
              >
                <Download className="mr-2 w-4 h-4" />
                Download
              </Button>
                  )}
            </div>
          </DialogContent>
        </Dialog>
          </CardContent>
        </Card>
    </div>
  );
};
