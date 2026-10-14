import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@mui/material";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, X, Megaphone, FileText, History } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser } from "@/utils/auth";
import { Trash2, Edit2 } from "lucide-react";
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
          setAnnouncements([{ ...item }]);
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


  const updateAnnouncement = (id: string, changes: Partial<Announcement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...changes } : a)));
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      <div className="w-full space-y-6">
        <div className="flex items-center gap-3">
          <Megaphone className="w-6 h-6 text-[var(--color-ink-68)]" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase">
            Announcements Setup
          </h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-[var(--color-ink-68)]" />
            </span>
            <h3 className="text-sm font-semibold uppercase text-[var(--color-text)]">
              Announcement Details
            </h3>
          </div>

          <div className="space-y-6">
            {announcements.map((ann, idx) => (
              <div
                key={ann.id}
                className={idx > 0 ? "pt-6 border-t border-gray-100 space-y-4" : "space-y-4"}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Announcement {idx + 1}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`active-${ann.id}`}
                        checked={ann.isActive}
                        onCheckedChange={(checked) =>
                          updateAnnouncement(ann.id, { isActive: checked === true })
                        }
                      />
                      <Label
                        htmlFor={`active-${ann.id}`}
                        className="text-sm text-gray-600 font-normal cursor-pointer"
                      >
                        Active
                      </Label>
                    </div>
                    {announcements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteAnnouncement(ann.id, ann.dbId)}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label={`Remove announcement ${idx + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    label="Title"
                    value={ann.title}
                    onChange={(e) => updateAnnouncement(ann.id, { title: e.target.value })}
                    placeholder="Announcement title"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <div className="md:col-span-2">
                    <TextField
                      label="Content / Description"
                      value={ann.description}
                      onChange={(e) => updateAnnouncement(ann.id, { description: e.target.value })}
                      placeholder="Enter announcement details..."
                      fullWidth
                      multiline
                      minRows={4}
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setAnnouncements([
                  ...announcements,
                  { id: Math.random().toString(36).substr(2, 9), title: "", description: "", isActive: true },
                ])
              }
              className="fm-action-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Announcement
            </button>
          </div>
        </div>

        <div className="fm-action-bar">
          <button type="button" onClick={() => navigate(-1)} className="fm-action-secondary">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAnnouncementsUpdate}
            disabled={announcementLoading}
            className="fm-action-primary"
          >
            {announcementLoading ? "Saving..." : "Save Announcements"}
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-[var(--color-surface)] flex items-center justify-center shrink-0">
              <History className="w-4 h-4 text-[var(--color-ink-68)]" />
            </span>
            <h3 className="text-sm font-semibold uppercase text-[var(--color-text)]">
              Announcement History
            </h3>
          </div>
          <EnhancedTable
            data={announcementHistory}
            columns={historyColumns}
            renderCell={renderCellHistory}
            renderActions={renderActionsHistory}
            getItemId={(item: Announcement) => item.id}
            enableSearch={true}
            searchTerm={historySearch}
            onSearchChange={setHistorySearch}
            searchPlaceholder="Search history..."
            storageKey="announcement-history-table"
            emptyMessage="No announcements found"
            pagination={true}
            pageSize={5}
            loading={historyLoading}
            rightActions={
              <button
                type="button"
                onClick={handleDeactivateAll}
                disabled={historyLoading || announcementHistory.every((a) => !a.isActive)}
                className="fm-action-secondary"
              >
                Deactivate All
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsSetup;
