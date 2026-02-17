import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchOccupantUsers } from "@/store/slices/occupantUsersSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Users, Eye, Search, Send, Copy, Check, X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";

interface OccupantUserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  active: boolean;
  departmentName?: string;
  entity?: string;
}

export const OccupantUserMobileList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    users: occupantUsersData,
    pagination: statePagination,
    loading,
  } = useAppSelector((state: RootState) => state.occupantUsers);

  const isOpsConsole = location.pathname.includes("/ops-console/");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [occupantUsers, setOccupantUsers] = useState<OccupantUserData[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });

  // OTP state
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpData, setOtpData] = useState<{
    code: number;
    otp_sent: boolean;
    message: string;
    get_otp?: {
      id: number;
      otp: number;
      email: string;
      mobile: string | null;
      verified: boolean;
      created_at: string;
      updated_at: string;
    };
  } | null>(null);
  const [otpLoading, setOtpLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Handle OTP generation
  const handleGenerateOTP = async (email: string) => {
    const baseUrl = localStorage.getItem("baseUrl");
    if (!baseUrl) {
      toast.error("Base URL not found");
      return;
    }

    try {
      setOtpLoading(true);
      const response = await axios.get(
        `https://${baseUrl}/get_otps/generate_otp.json?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.code === 200 && response.data.otp_sent === true) {
        setOtpData(response.data);
        setOtpDialogOpen(true);
        toast.success(response.data.message || "OTP sent successfully");
      } else {
        toast.error(
          response.data.user_error_msg ||
            response.data.message ||
            "Failed to generate OTP"
        );
      }
    } catch (error) {
      console.error("OTP generation failed:", error);
      toast.error("Failed to generate OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Copy to clipboard handler
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const loadUsers = () => {
    const [firstName = "", lastName = ""] = searchQuery.trim().split(" ");

    dispatch(
      fetchOccupantUsers({
        page: currentPage,
        perPage: 10,
        ...(firstName && { firstname_cont: firstName }),
        ...(lastName && { lastname_cont: lastName }),
      })
    );
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  useEffect(() => {
    if (occupantUsersData && "transformedUsers" in (occupantUsersData as any)) {
      const data = occupantUsersData as any;
      setOccupantUsers(data.transformedUsers);
      setPagination({
        current_page:
          statePagination?.current_page ?? data.pagination?.current_page ?? 1,
        total_count:
          statePagination?.total_count ?? data.pagination?.total_count ?? 0,
        total_pages:
          statePagination?.total_pages ?? data.pagination?.total_pages ?? 0,
      });
    } else if (Array.isArray(occupantUsersData)) {
      setOccupantUsers(occupantUsersData as any);
      setPagination((prev) => ({
        current_page: statePagination?.current_page ?? prev.current_page,
        total_count: statePagination?.total_count ?? prev.total_count,
        total_pages: statePagination?.total_pages ?? prev.total_pages,
      }));
    }
  }, [occupantUsersData, statePagination]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers();
  };

  const handleViewUser = (id: number) => {
    navigate(`/ops-console/settings/account/user-list-otp/detail/${id}`);
  };

  return (
    <div className="mobile-user-list min-h-screen bg-gray-50 pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Occupant Users
          </h1>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 pb-3">
          <div className="text-sm text-gray-600">
            Total: {pagination.total_count} users
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="px-4 py-2 space-y-3">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : occupantUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No users found</div>
        ) : (
          occupantUsers.map((user) => (
            <Card
              key={user.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewUser(user.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {user.firstname} {user.lastname}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <Badge variant={user.active ? "default" : "secondary"}>
                  {user.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Mobile:</span>
                  <span>{user.mobile}</span>
                </div>
                {user.departmentName && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Department:</span>
                    <span>{user.departmentName}</span>
                  </div>
                )}
                {user.entity && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Entity:</span>
                    <span>{user.entity}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewUser(user.id);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                {isOpsConsole && user.email && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateOTP(user.email);
                    }}
                    disabled={otpLoading}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    OTP
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* OTP Dialog */}
      <Dialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent className="p-0 bg-white">
          <div className="px-6 py-3 border-b mb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">OTP Details</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOtpDialogOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {otpData && (
            <div className="px-6 py-4 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">OTP Code</p>
                    <p className="text-3xl font-bold text-green-700">
                      {otpData.get_otp?.otp}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(String(otpData.get_otp?.otp), "otp")
                    }
                    className="flex items-center gap-2"
                  >
                    {copiedField === "otp" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    Copy
                  </Button>
                </div>
              </div>

              {otpData.get_otp?.email && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">
                      {otpData.get_otp.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(otpData.get_otp.email, "email")}
                  >
                    {copiedField === "email" ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}

              {otpData.message && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{otpData.message}</p>
                </div>
              )}

              {otpData.get_otp?.created_at && (
                <div className="text-xs text-gray-500 text-center">
                  Generated at:{" "}
                  {new Date(otpData.get_otp.created_at).toLocaleString()}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile Pagination */}
      {pagination.total_pages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(
                  Math.min(pagination.total_pages, currentPage + 1)
                )
              }
              disabled={currentPage === pagination.total_pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
