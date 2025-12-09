import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const SMTPSettingsList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [smtpSetting, setSmtpSetting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSMTPSettings();
  }, []);

  const fetchSMTPSettings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/smtp_settings.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      let settingData = data.smtp_setting || data.smtp_settings || data.setting || data;

      if (Array.isArray(settingData) && settingData.length > 0) {
        settingData = settingData[0];
      }

      if (settingData && typeof settingData === "object" && (settingData.address || settingData.email || settingData.port)) {
        setSmtpSetting(settingData);
      } else {
        setSmtpSetting(null);
      }
    } catch (error) {
      console.error("Error fetching SMTP settings:", error);
      toast.error("Failed to fetch SMTP settings");
      setSmtpSetting(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/setup-member/smtp-settings-edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/setup-member/smtp-settings-create");
  };

  const filteredSetting = smtpSetting && (
    smtpSetting.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    smtpSetting.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    smtpSetting.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">SMTP Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SMTP SETTINGS</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search SMTP settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203"/>
                  <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">SMTP Settings List</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#8B0203] rounded-full animate-spin" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : smtpSetting && (!searchQuery || filteredSetting) ? (
              <div className="rounded-lg border border-gray-200 overflow-hidden">
                <Table className="border-separate">
                  <TableHeader>
                    <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Action</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "180px" }}>Address</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Port</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "150px" }}>User Name</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "200px" }}>Email</TableHead>
                      <TableHead className="font-semibold text-gray-900 py-3 px-4" style={{ borderColor: "#fff", minWidth: "180px" }}>Company Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50 transition-colors">
                      <TableCell className="py-3 px-4">
                        <button
                          onClick={() => handleEdit(smtpSetting.id)}
                          className="text-gray-600 hover:text-[#8B0203] transition-colors"
                          title="Edit SMTP Settings"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M13.93 6.46611L8.7982 11.5979C8.68827 11.7078 8.62708 11.862 8.62708 12.0183L8.67694 14.9367C8.68261 15.2495 8.93534 15.5023 9.24815 15.5079L12.1697 15.5578H12.1788C12.3329 15.5578 12.4803 15.4966 12.5879 15.3867L19.2757 8.69895C19.9341 8.0405 19.9341 6.96723 19.2757 6.30879L17.8806 4.91368C17.561 4.59407 17.1349 4.4173 16.6849 4.4173C16.2327 4.4173 15.8089 4.5941 15.4893 4.91368L13.93 6.46611ZM11.9399 14.3912L9.8274 14.3561L9.79227 12.2436L14.3415 7.69443L16.488 9.84091L11.9399 14.3912ZM16.3066 5.73151C16.5072 5.53091 16.8574 5.53091 17.058 5.73151L18.4531 7.12662C18.6593 7.33288 18.6593 7.66948 18.4531 7.87799L17.3096 9.0215L15.1631 6.87502L16.3066 5.73151Z" fill="#667085"/>
                            <path d="M7.42035 20H16.5797C18.4655 20 20 18.4655 20 16.5797V12.0012C20 11.6816 19.7393 11.4209 19.4197 11.4209C19.1001 11.4209 18.8395 11.6816 18.8395 12.0012V16.582C18.8395 17.8264 17.8274 18.8418 16.5797 18.8418H7.42032C6.17593 18.8418 5.16048 17.8298 5.16048 16.582V7.42035C5.16048 6.17596 6.17254 5.16051 7.42032 5.16051H12.2858C12.6054 5.16051 12.866 4.89985 12.866 4.58026C12.866 4.26066 12.6054 4 12.2858 4H7.42032C5.53449 4 4 5.53452 4 7.42032V16.5797C4.00227 18.4677 5.53454 20 7.42035 20Z" fill="#667085"/>
                          </svg>
                        </button>
                      </TableCell>
                      <TableCell className="py-3 px-4">{smtpSetting.address || "-"}</TableCell>
                      <TableCell className="py-3 px-4">{smtpSetting.port || "-"}</TableCell>
                      <TableCell className="py-3 px-4">{smtpSetting.user_name || "-"}</TableCell>
                      <TableCell className="py-3 px-4">{smtpSetting.email || "-"}</TableCell>
                      <TableCell className="py-3 px-4">{smtpSetting.company_name || "-"}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4 inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#9ca3af" viewBox="0 0 16 16">
                    <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z"/>
                    <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708L13.207 12.5l.647-.646a.5.5 0 0 0-.708-.708L12.5 11.793l-.646-.647a.5.5 0 0 0-.708 0"/>
                  </svg>
                </div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">No SMTP Settings Found</h5>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? "Try adjusting your search criteria" : "Configure your SMTP settings to enable email functionality"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMTPSettingsList;
