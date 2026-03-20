import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X, Megaphone } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser } from "@/utils/auth";
import { Trash2, Search, Trophy, Edit2 } from "lucide-react";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

interface Announcement {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  dbId?: number;
}

const AnnouncementsSetup: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser() as unknown as { lock_role?: { company_id?: number | string } };
  const companyId = localStorage.getItem("org_id") || user?.lock_role?.company_id || "116";

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: "1", title: "", description: "", isActive: true },
  ]);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [announcementHistory, setAnnouncementHistory] = useState<Announcement[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historySearch, setHistorySearch] = useState("");

  const historyColumns: ColumnConfig[] = [
    { key: "title", label: "Title", sortable: true, draggable: true, hideable: true, defaultVisible: true },
    { key: "description", label: "Description", sortable: true, draggable: true, hideable: true, defaultVisible: true },
    { key: "isActive", label: "Status", sortable: true, draggable: true, hideable: true, defaultVisible: true },
  ];

  const fetchAnnouncements = React.useCallback(async () => {
    if (!companyId) return;
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      const annEndpoint = `${protocol}${baseUrl}/extra_fields?resource_id=${companyId}&resource_type=CompanySetup&group_name=announcement`;
      const response = await axios.get(annEndpoint, { headers: { Authorization: `Bearer ${token}` } });
      
      let fetchedAnns = [];
      if (Array.isArray(response.data)) {
         fetchedAnns = response.data;
      } else if (Array.isArray(response.data?.data)) {
         fetchedAnns = response.data.data;
      } else if (Array.isArray(response.data?.announcement)) {
         fetchedAnns = response.data.announcement;
      }

      if (fetchedAnns.length > 0) {
        const mappedAnns = fetchedAnns.map((a: Record<string, any>) => {
          let description = a.field_value || "";
          let isActive = true;
          if (a.field_value && a.field_value.trim().startsWith("{")) {
            try {
              const parsed = JSON.parse(a.field_value);
              description = parsed.description || parsed.content || a.field_value;
              isActive = parsed.isActive !== undefined ? parsed.isActive : true;
            } catch (e) {
              console.error("Failed to parse announcement data", e);
            }
          }
          return {
            id: String(a.id || a.extra_field_id),
            title: a.field_name || "",
            description: description,
            isActive: isActive,
            dbId: a.id || a.extra_field_id
          };
        });
        setAnnouncementHistory(mappedAnns);
      } else {
        setAnnouncementHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setHistoryLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchAnnouncements();
  }, [companyId, fetchAnnouncements]);


  const handleAnnouncementsUpdate = async () => {
    setAnnouncementLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      for (let i = 0; i < announcements.length; i++) {
        const ann = announcements[i];
        if (!ann.title.trim() && !ann.description.trim()) continue;

        const payload = {
          extra_field: {
            resource_id: parseInt(String(companyId), 10),
            resource_type: "CompanySetup",
            field_name: ann.title,
            field_value: JSON.stringify({
              description: ann.description,
              isActive: ann.isActive
            }),
            group_name: "announcement",
          },
        };

        if (ann.dbId) {
          await axios.put(`${protocol}${baseUrl}/extra_fields/${ann.dbId}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          const response = await axios.post(`${protocol}${baseUrl}/extra_fields`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data?.data?.id) {
            setAnnouncements(prev => {
              const updated = [...prev];
              updated[i] = { ...updated[i], dbId: response.data.data.id, id: String(response.data.data.id) };
              return updated;
            });
          }
        }
      }
      toast.success("Announcements updated successfully");
      fetchAnnouncements();
      setAnnouncements([{ id: String(Math.random()), title: "", description: "", isActive: true }]);
    } catch (error) {
      console.error("Failed to save announcements:", error);
      toast.error("Failed to save some announcements");
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (annId: string, dbId?: number) => {
    if (dbId) {
      if (!window.confirm("Are you sure you want to delete this announcement?")) return;
      try {
        const token = localStorage.getItem("token");
        const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const protocol = baseUrl.startsWith("http") ? "" : "https://";
        await axios.delete(`${protocol}${baseUrl}/extra_fields/${dbId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Announcement deleted successfully");
        fetchAnnouncements();
      } catch (error) {
        toast.error("Failed to delete announcement");
        return;
      }
    }
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
  };

  const renderCellHistory = (item: Announcement, columnKey: string) => {
    switch (columnKey) {
      case "title":
        return <span className="font-medium text-gray-900">{item.title}</span>;
      case "description":
        return <span className="text-gray-600 line-clamp-2">{item.description}</span>;
      case "isActive":
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
            {item.isActive ? "Active" : "Inactive"}
          </span>
        );
      default:
        return null;
    }
  };

  const renderActionsHistory = (item: Announcement) => (
    <div className="flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setAnnouncements([item]);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="text-gray-400 hover:text-blue-500 hover:bg-blue-50"
      >
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleDeleteAnnouncement(item.id, item.dbId)}
        className="text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
  const handleDeactivateAll = async () => {
    if (!window.confirm("Are you sure you want to deactivate all active announcements?")) return;
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl = localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      const activeAnns = announcementHistory.filter(ann => ann.isActive);
      
      for (const ann of activeAnns) {
        if (!ann.dbId) continue;
        const payload = {
          extra_field: {
            resource_id: parseInt(String(companyId), 10),
            resource_type: "CompanySetup",
            field_name: ann.title,
            field_value: JSON.stringify({
              description: ann.description,
              isActive: false
            }),
            group_name: "announcement",
          },
        };

        await axios.put(`${protocol}${baseUrl}/extra_fields/${ann.dbId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      toast.success("All announcements deactivated successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error("Failed to deactivate some announcements:", error);
      toast.error("Failed to deactivate some announcements");
    } finally {
      setHistoryLoading(false);
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Megaphone className="w-6 h-6 text-[#C72030]" />
            <h1 className="text-2xl font-bold text-gray-800">Announcements Setup</h1>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {announcements.map((ann, idx) => (
                <Card key={ann.id} className="border border-red-50 bg-[#fff5f5]/30">
                  <CardContent className="pt-6 relative">
                    <div className="absolute top-2 right-2 flex gap-2 items-center">
                      <Checkbox
                        id={`active-${ann.id}`}
                        checked={ann.isActive}
                        onCheckedChange={(checked) => {
                          const newAnns = [...announcements];
                          newAnns[idx].isActive = checked as boolean;
                          setAnnouncements(newAnns);
                        }}
                        className="border-gray-300 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                      />
                      <Label htmlFor={`active-${ann.id}`} className="text-xs text-gray-500 cursor-pointer mr-4">Active</Label>
                      
                      {announcements.length > 1 && (
                        <button onClick={() => handleDeleteAnnouncement(ann.id, ann.dbId)} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="relative">
                        <span className="absolute -top-2.5 left-4 bg-white px-2 text-xs text-gray-400 z-10">Title</span>
                        <Input
                          value={ann.title}
                          onChange={(e) => {
                            const newAnns = [...announcements];
                            newAnns[idx].title = e.target.value;
                            setAnnouncements(newAnns);
                          }}
                          placeholder="Announcement title"
                          className="border-gray-200"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <span className="absolute -top-2.5 left-4 bg-white px-2 text-xs text-gray-400 z-10">Content / Description</span>
                      <Textarea
                        value={ann.description}
                        onChange={(e) => {
                          const newAnns = [...announcements];
                          newAnns[idx].description = e.target.value;
                          setAnnouncements(newAnns);
                        }}
                        placeholder="Enter announcement details..."
                        className="min-h-[100px] border-gray-200 resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                onClick={() => setAnnouncements([...announcements, { id: Math.random().toString(36).substr(2, 9), title: "", description: "", isActive: true }])}
                className="border-dashed border-red-200 bg-red-50/50 text-[#C72030] hover:bg-red-100/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Announcement
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 pt-6 border-t">
              <Button variant="outline" onClick={() => navigate(-1)} className="border-[#C72030] text-[#C72030] px-8">Cancel</Button>
              <Button onClick={handleAnnouncementsUpdate} disabled={announcementLoading} className="bg-[#C72030] text-white hover:bg-[#a61a28] px-8 font-semibold">
                {announcementLoading ? "Saving..." : "Save Announcements"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-6 h-6 text-[#C72030]" />
            <h2 className="text-2xl font-bold text-gray-800">Announcement History</h2>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200">
            <EnhancedTable
              data={announcementHistory}
              columns={historyColumns}
              renderCell={renderCellHistory}
              renderActions={renderActionsHistory}
              getItemId={(item: Announcement) => item.id}
              searchTerm={historySearch}
              onSearchChange={setHistorySearch}
              hideTableSearch={true}
              // enableExport={true}
              exportFileName="announcements-history"
              pagination={true}
              pageSize={5}
              loading={historyLoading}
              rightActions={
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="pl-10 pr-4 py-2 text-sm border border-gray-210 rounded-md focus:outline-none w-full sm:w-64 h-9"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeactivateAll}
                    disabled={historyLoading || announcementHistory.every(a => !a.isActive)}
                    className="h-9 text-[#C72030] border-[#C72030] hover:bg-red-50 text-xs font-medium"
                  >
                    Deactivate All
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsSetup;
