import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Upload,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import {
  fetchService,
  updateService,
  clearError,
  resetServiceState,
} from "@/store/slices/serviceSlice";
import { clearAllSelections } from "@/store/slices/serviceLocationSlice";
import { LocationSelector } from "@/components/service/LocationSelector";
import { toast } from "sonner";

export const EditServicePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { loading, error, fetchedService, updatedService } = useAppSelector(
    (state) => state.serviceEdit
  );

  const [formData, setFormData] = useState({
    serviceName: "",
    executionType: "",
    uom: "",
    serviceDescription: "",
    siteId: null as number | null,
    buildingId: null as number | null,
    wingId: null as number | null,
    areaId: null as number | null,
    floorId: null as number | null,
    roomId: null as number | null,
    groupId: null as number | null,
    subGroupId: null as number | null,
    description: "",
    serviceCategory: "",
    serviceGroup: "",
    serviceCode: "",
    extCode: "",
    rateContractVendorCode: "",
  });

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<
    { id: number; document: string; doctype: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    serviceName: false,
    buildingId: false,
  });

  // Upload constraints (match Add Service page)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_EXTS = new Set(["pdf", "jpg", "jpeg", "xls", "xlsx"]);
  const getExt = (name: string) => (name.split(".").pop() || "").toLowerCase();
  const formatMB = (bytes: number) =>
    `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  useEffect(() => {
    if (id) {
      dispatch(fetchService(id));
    }
    return () => {
      dispatch(resetServiceState());
      dispatch(clearAllSelections());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (fetchedService) {
      const storedSiteId =
        Number(
          localStorage.getItem("selectedSiteId") ||
            localStorage.getItem("siteId") ||
            "0"
        ) || null;
      const effectiveSiteId = fetchedService.site_id || storedSiteId;

      setFormData((prev) => ({
        ...prev,
        serviceName: fetchedService.service_name || "",
        executionType: fetchedService.execution_type || "",
        uom: fetchedService.base_uom || "",
        serviceDescription: fetchedService.description || "",
        siteId: effectiveSiteId,
        buildingId: fetchedService.building_id || null,
        wingId: fetchedService.wing_id || null,
        areaId: fetchedService.area_id || null,
        floorId: fetchedService.floor_id || null,
        roomId: fetchedService.room_id || null,
        groupId: fetchedService.group_id || null,
        subGroupId: fetchedService.sub_group_id || null,
        description: fetchedService.description || "",
        serviceCategory: fetchedService.service_category || "",
        serviceGroup: fetchedService.service_group || "",
        serviceCode: fetchedService.service_code || "",
        extCode: fetchedService.ext_code || "",
        rateContractVendorCode: fetchedService.rate_contract_vendor_code || "",
      }));

      if (Array.isArray(fetchedService.documents)) {
        setExistingFiles(
          fetchedService.documents.map((doc: any) => ({
            id: doc.id,
            document: doc.document,
            doctype: doc.doctype,
          }))
        );
      }
    }
  }, [fetchedService]);
  useEffect(() => {
    if (error) {
      toast("error");
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  useEffect(() => {
    if (updatedService) {
      toast.success("Service updated successfully!");
      navigate("/maintenance/service/details/" + id);
    }
  }, [updatedService, toast, navigate]);

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "serviceName" && value && String(value).trim() !== "") {
      setErrors((prev) => ({ ...prev, serviceName: false }));
    }
  };

  const handleLocationChange = useCallback(
    (location: {
      siteId: number | null;
      buildingId: number | null;
      wingId: number | null;
      areaId: number | null;
      floorId: number | null;
      roomId: number | null;
      groupId: number | null;
      subGroupId: number | null;
    }) => {
      setFormData((prev) => ({ ...prev, ...location }));
      if (location.buildingId !== null) {
        setErrors((prev) => ({ ...prev, buildingId: false }));
      }
    },
    []
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const incoming = Array.from(files);
      const rejected: string[] = [];

      setSelectedFile((prevFiles) => {
        const existingNames = new Set(prevFiles.map((f) => f.name));
        const accepted: File[] = [];

        for (const f of incoming) {
          const ext = getExt(f.name);
          if (!ALLOWED_EXTS.has(ext)) {
            rejected.push(`${f.name}: unsupported format`);
            continue;
          }
          if (f.size > MAX_FILE_SIZE) {
            rejected.push(
              `${f.name}: too large (${formatMB(f.size)}). Max 10 MB`
            );
            continue;
          }
          if (existingNames.has(f.name)) {
            // skip duplicates by name
            continue;
          }
          accepted.push(f);
        }

        if (rejected.length) {
          toast.error(
            `Some files were not added:\n` +
              rejected.slice(0, 5).join("\n") +
              (rejected.length > 5 ? `\n…and ${rejected.length - 5} more` : ""),
            { duration: 5000 }
          );
        }

        return [...prevFiles, ...accepted];
      });

      // Reset input so same file can be reselected after modifying
      event.target.value = "";
    }
  };

  const handleSubmit = async (action: string) => {
    if (!id || isSubmitting) return;
    setIsSubmitting(true);

    const hasServiceNameError = formData.serviceName.trim() === "";
    const hasBuildingIdError = formData.buildingId === null;

    if (hasServiceNameError || hasBuildingIdError) {
      setErrors({
        serviceName: hasServiceNameError,
        buildingId: hasBuildingIdError,
      });

      const errorFields = [];
      if (hasServiceNameError) errorFields.push("Service Name");
      if (hasBuildingIdError) errorFields.push("Building");

      toast(
        `Please fill in the following required fields: ${errorFields.join(", ")}`
      );

      setIsSubmitting(false);
      return;
    }

    setErrors({
      serviceName: false,
      buildingId: false,
    });

    const sendData = new FormData();
    try {
      sendData.append("pms_service[service_name]", formData.serviceName);
      sendData.append("pms_service[execution_type]", formData.executionType);
      sendData.append("pms_service[base_uom]", formData.uom || "");
      sendData.append(
        "pms_service[site_id]",
        formData.siteId?.toString() || ""
      );
      sendData.append(
        "pms_service[building_id]",
        formData.buildingId?.toString() || ""
      );
      sendData.append(
        "pms_service[wing_id]",
        formData.wingId?.toString() || ""
      );
      sendData.append(
        "pms_service[area_id]",
        formData.areaId?.toString() || ""
      );
      sendData.append(
        "pms_service[floor_id]",
        formData.floorId?.toString() || ""
      );
      sendData.append(
        "pms_service[room_id]",
        formData.roomId?.toString() || ""
      );
      sendData.append(
        "pms_service[pms_asset_group_id]",
        formData.groupId?.toString() || ""
      );
      sendData.append(
        "pms_service[pms_asset_sub_group_id]",
        formData.subGroupId?.toString() || ""
      );
      sendData.append("pms_service[active]", "true");
      sendData.append(
        "pms_service[description]",
        formData.serviceDescription || ""
      );
      sendData.append(
        "pms_service[service_category]",
        formData.serviceCategory || ""
      );
      sendData.append(
        "pms_service[service_group]",
        formData.serviceGroup || ""
      );
      sendData.append("pms_service[service_code]", formData.serviceCode || "");
      sendData.append("pms_service[ext_code]", formData.extCode || "");
      sendData.append(
        "pms_service[rate_contract_vendor_code]",
        formData.rateContractVendorCode || ""
      );
      sendData.append("subaction", "save");

      selectedFile.forEach((file) => {
        sendData.append("attachments[]", file);
      });

      await dispatch(updateService({ id, serviceData: sendData })).unwrap();
    } catch (error) {
      console.error("Error updating service:", error);
      toast("Failed to update service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: { xs: "8px", sm: "10px", md: "12px" },
    },
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading service data...</div>
        </div>
      </div>
    );
  }

  const removeSelectedFile = (index: number) => {
    const updatedFiles = [...selectedFile];
    updatedFiles.splice(index, 1);
    setSelectedFile(updatedFiles);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/maintenance/service")}
            className="p-1 hover:bg-gray-100 mr-2"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT SERVICE</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">
              1
            </span>
            BASIC DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <TextField
              label={
                <>
                  Service Name<span style={{ color: "#C72030" }}>*</span>
                </>
              }
              value={formData.serviceName}
              onChange={(e) => handleInputChange("serviceName", e.target.value)}
              fullWidth
              variant="outlined"
              error={errors.serviceName}
              helperText={errors.serviceName ? "Service Name is required" : ""}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              disabled={isSubmitting}
            />
            <FormControl
              fullWidth
              variant="outlined"
              sx={{ "& .MuiInputBase-root": fieldStyles }}
            >
              <InputLabel shrink>Execution Type</InputLabel>{" "}
              <MuiSelect
                value={formData.executionType}
                onChange={(e) =>
                  handleInputChange("executionType", e.target.value)
                }
                label="Execution Type"
                notched
                displayEmpty
                disabled={isSubmitting}
              >
                <MenuItem value="">Select Execution Type</MenuItem>
                <MenuItem value="internal">Internal</MenuItem>
                <MenuItem value="external">External</MenuItem>
              </MuiSelect>
            </FormControl>
            <TextField
              label="UOM"
              placeholder="Enter UOM"
              value={formData.uom}
              onChange={(e) => handleInputChange("uom", e.target.value)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: fieldStyles }}
              disabled={isSubmitting}
            />
          </div>

          <LocationSelector
            fieldStyles={fieldStyles}
            onLocationChange={handleLocationChange}
            disabled={isSubmitting}
            errors={{ buildingId: errors.buildingId }}
            helperTexts={{
              buildingId: errors.buildingId ? "Building is required" : "",
            }}
            initialValues={{
              siteId: formData.siteId,
              buildingId: formData.buildingId,
              wingId: formData.wingId,
              areaId: formData.areaId,
              floorId: formData.floorId,
              roomId: formData.roomId,
              groupId: formData.groupId,
              subGroupId: formData.subGroupId,
            }}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">
              2
            </span>
            SERVICE DESCRIPTION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TextField
            label="Service Description"
            value={formData.serviceDescription}
            onChange={(e) =>
              handleInputChange("serviceDescription", e.target.value)
            }
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                height: "auto !important",
                padding: "2px !important",
                display: "flex",
              },
              "& .MuiInputBase-input[aria-hidden='true']": {
                flex: 0,
                width: 0,
                height: 0,
                padding: "0 !important",
                margin: 0,
                display: "none",
              },
              "& .MuiInputBase-input": {
                resize: "none !important",
              },
            }}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg text-[#C72030] flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">
              3
            </span>
            FILES UPLOAD
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white flex flex-col items-center justify-center">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.xls,.xlsx"
              multiple
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-[#C72030] font-medium text-sm">
                Choose File
              </span>
              <span className="text-gray-500 text-sm">
                {selectedFile.length > 0
                  ? `${selectedFile.length} file(s) selected`
                  : "No file chosen"}
              </span>
            </div>

            <Button
              type="button"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="!bg-[#f6f4ee] !text-[#C72030] !border-none text-sm flex items-center justify-center"
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload Files
            </Button>

            {/* Upload guidelines (identical to Add Service page) */}
            <div className="mt-4 w-full max-w-[520px]">
              <div className="text-[12px] text-gray-700 border border-gray-200 rounded-md bg-gray-50 px-3 py-2">
                <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                  {/* <span className="font-medium text-gray-800">Upload guidelines:</span> */}
                  <span className="text-gray-600 font-bold">
                    Allowed formats:
                  </span>
                  <span className="text-gray-800">
                    PDF, JPG, JPEG, XLS, XLSX
                  </span>
                  <span className="text-gray-600 font-bold">
                    Max size per file:
                  </span>
                  <span className="text-gray-800">10 MB</span>
                </div>
              </div>
            </div>
          </div>

          {(existingFiles.length > 0 || selectedFile.length > 0) && (
            <div className="flex flex-wrap gap-3 mt-4">
              {/* EXISTING FILES */}
              {existingFiles.map((file) => {
                const fileName = file.document?.split("/").pop() || "";
                const isImage = file.doctype?.startsWith("image");
                const isPdf = fileName.endsWith(".pdf");
                const isExcel =
                  fileName.endsWith(".xlsx") ||
                  fileName.endsWith(".xls") ||
                  fileName.endsWith(".csv");
                const isWord =
                  fileName.endsWith(".doc") || fileName.endsWith(".docx");

                const handleDownload = async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const baseUrl = localStorage.getItem("baseUrl");
                    if (!token || !baseUrl) return;

                    const apiUrl = `https://${baseUrl}/attachfiles/${file.id}?show_file=true`;

                    const response = await fetch(apiUrl, {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    });

                    if (!response.ok) throw new Error("Download failed");

                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `Document_${file.id}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  } catch (error) {
                    const fallbackLink = document.createElement("a");
                    fallbackLink.href = file.document;
                    fallbackLink.download = fileName;
                    document.body.appendChild(fallbackLink);
                    fallbackLink.click();
                    document.body.removeChild(fallbackLink);
                  }
                };

                return (
                  <div
                    key={file.id}
                    className="relative flex flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm hover:shadow-md transition"
                  >
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 text-gray-600 hover:text-black"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* File Icon */}
                    {isImage ? (
                      <img
                        src={file.document}
                        alt="Existing"
                        className="w-[40px] h-[40px] object-cover rounded border mb-1"
                      />
                    ) : isPdf ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : isExcel ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    ) : isWord ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-blue-700 bg-white mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-gray-500 bg-white mb-1">
                        <File className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-[10px] text-center truncate max-w-[100px] mb-1">
                      {fileName}
                    </span>
                  </div>
                );
              })}

              {/* SELECTED FILES */}
              {selectedFile.map((file, index) => {
                const isImage = file.type.startsWith("image");
                const isPdf = file.type === "application/pdf";
                const isExcel =
                  file.name.endsWith(".xlsx") ||
                  file.name.endsWith(".xls") ||
                  file.name.endsWith(".csv");
                const isWord =
                  file.name.endsWith(".doc") || file.name.endsWith(".docx");
                const fileURL = URL.createObjectURL(file);

                return (
                  <div
                    key={`${file.name}-${file.lastModified}`}
                    className="flex relative flex-col items-center border rounded-md pt-6 px-2 pb-3 w-[130px] bg-[#F6F4EE] shadow-sm"
                  >
                    {isImage ? (
                      <img
                        src={fileURL}
                        alt={file.name}
                        className="w-[40px] h-[40px] object-cover rounded border mb-1"
                      />
                    ) : isPdf ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-red-600 bg-white mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : isExcel ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-green-600 bg-white mb-1">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    ) : isWord ? (
                      <div className="w-10 h-10 flex items-center justify-center border rounded text-blue-700 bg-white mb-1">
                        <FileText className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-[40px] h-[40px] flex items-center justify-center bg-gray-100 border rounded text-gray-500 mb-1">
                        <File className="w-4 h-4" />
                      </div>
                    )}
                    <span className="text-[10px] text-center truncate max-w-[100px] mb-1">
                      {file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 h-4 w-4 p-0 text-gray-600"
                      onClick={() => removeSelectedFile(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={() => handleSubmit("updated with details")}
          style={{ backgroundColor: "#C72030" }}
          className="text-white hover:bg-[#C72030]/90"
          disabled={isSubmitting}
        >
          Update Save & Show Details
        </Button>
      </div>
    </div>
  );
};

export default EditServicePage;
