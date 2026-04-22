import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { toast } from "sonner";
import { getAuthHeader, getFullUrl } from "@/config/apiConfig";

interface GreUser {
  id: number;
  full_name: string;
}

interface SiteItem {
  id: number;
  name?: string;
  site_name?: string;
}

const fieldStyles = {
  height: "45px",
  backgroundColor: "#fff",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    height: "45px",
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "#C72030" },
    "&.Mui-focused fieldset": { borderColor: "#C72030" },
  },
};

export const AddGreSiteAssignmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [users, setUsers] = useState<GreUser[]>([]);
  const [sites, setSites] = useState<SiteItem[]>([]);
  const [formData, setFormData] = useState({
    user_id: "",
    pms_site_id: "",
  });
  const [initialLoading, setInitialLoading] = useState(false);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch(
        getFullUrl("/pms/users/get_escalate_to_users.json"),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchSites = async () => {
    setLoadingSites(true);
    try {
      const response = await fetch(getFullUrl("/pms/sites.json?all_sites=true"), {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: getAuthHeader(),
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const siteRows = data?.sites || data?.data || [];
      setSites(Array.isArray(siteRows) ? siteRows : []);
    } catch (error) {
      console.error("Failed to fetch sites", error);
      toast.error("Failed to load sites");
      setSites([]);
    } finally {
      setLoadingSites(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSites();
  }, []);

  const fetchAssignmentDetails = async () => {
    if (!id) return;
    setInitialLoading(true);
    try {
      const response = await fetch(
        getFullUrl(`/pms/admin/gre_site_assignments/${id}.json`),
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const row = data?.data || data?.gre_site_assignment || data;
      setFormData({
        user_id: row?.user_id ? String(row.user_id) : "",
        pms_site_id: row?.pms_site_id ? String(row.pms_site_id) : "",
      });
    } catch (error) {
      console.error("Failed to fetch assignment details", error);
      toast.error("Failed to load GRE assignment details");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_id) {
      toast.error("GRE user is required");
      return;
    }
    if (!formData.pms_site_id) {
      toast.error("Site is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(getFullUrl(
        isEditMode
          ? `/pms/admin/gre_site_assignments/${id}.json`
          : "/pms/admin/gre_site_assignments.json"
      ), {
          method: isEditMode ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: getAuthHeader(),
          },
          body: JSON.stringify({
            gre_site_assignment: {
              user_id: Number(formData.user_id),
              pms_site_id: Number(formData.pms_site_id),
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast.success(
        isEditMode
          ? "GRE assignment updated successfully"
          : "GRE assignment created successfully"
      );
      navigate("/pulse/gre-site-assignment-setup");
    } catch (error: any) {
      console.error("Failed to create GRE assignment", error);
      toast.error(
        error.message ||
          (isEditMode
            ? "Failed to update GRE assignment"
            : "Failed to create GRE assignment")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
          <button
            onClick={() => navigate("/pulse/gre-site-assignment-setup")}
            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors mr-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <span>GRE Site Assignment Setup</span>
          <span>{">"}</span>
          <span className="text-gray-900 font-medium">
            {isEditMode ? "Edit" : "Add"}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "EDIT GRE SITE ASSIGNMENT" : "NEW GRE SITE ASSIGNMENT"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Assignment Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>GRE User</InputLabel>
              <Select
                value={formData.user_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, user_id: String(e.target.value) }))
                }
                label="GRE User"
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value="" disabled>
                  <em>
                    {loadingUsers || initialLoading
                      ? "Loading users..."
                      : "Select GRE user"}
                  </em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={String(user.id)}>
                    {user.full_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink>Site</InputLabel>
              <Select
                value={formData.pms_site_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pms_site_id: String(e.target.value),
                  }))
                }
                label="Site"
                displayEmpty
                sx={fieldStyles}
              >
                <MenuItem value="" disabled>
                  <em>
                    {loadingSites || initialLoading
                      ? "Loading sites..."
                      : "Select site"}
                  </em>
                </MenuItem>
                {sites.map((site) => (
                  <MenuItem key={site.id} value={String(site.id)}>
                    {site.name || site.site_name || `Site ${site.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="bg-[#C72030] hover:bg-[#A01828] text-white px-8 py-2"
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/pulse/gre-site-assignment-setup")}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
