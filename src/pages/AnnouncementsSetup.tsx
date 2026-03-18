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

interface Announcement {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  dbId?: number;
}

const AnnouncementsSetup: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser() as any;
  const companyId = localStorage.getItem("org_id") || user?.lock_role?.company_id || "116";

  const [announcements, setAnnouncements] = useState<Announcement[]>([
    { id: "1", title: "", description: "", isActive: true },
  ]);
  const [announcementLoading, setAnnouncementLoading] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!companyId) return;
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
          setAnnouncements(
            fetchedAnns.map((a: any) => {
              let description = a.field_value || "";
              let isActive = true;
              if (a.field_value && a.field_value.trim().startsWith("{")) {
                try {
                  const parsed = JSON.parse(a.field_value);
                  description = parsed.description || parsed.content || a.field_value;
                  isActive = parsed.isActive !== undefined ? parsed.isActive : true;
                } catch (e) {}
              }
              return {
                id: String(a.id || a.extra_field_id),
                title: a.field_name || "",
                description: description,
                isActive: isActive,
                dbId: a.id || a.extra_field_id
              };
            })
          );
        } else {
          setAnnouncements([{ id: "1", title: "", description: "", isActive: true }]);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [companyId]);


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
      } catch (error) {
        toast.error("Failed to delete announcement");
        return;
      }
    }
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
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
      </div>
    </div>
  );
};

export default AnnouncementsSetup;
