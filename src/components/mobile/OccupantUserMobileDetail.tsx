import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getUserDetails } from "@/store/slices/fmUserSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  Send,
  Copy,
  Check,
  X,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";
import { PWAHeader } from "./PWAHeader";

interface UserDetail {
  id: number;
  firstname: string;
  lastname: string;
  email?: string;
  mobile?: string;
  gender?: string;
  active: boolean;
  departmentName?: string;
  entity?: string;
  designation?: string;
  sites?: Array<{ name: string } | string>;
  roles?: Array<{ name: string } | string>;
}

export const OccupantUserMobileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

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
  const isOpsConsole = location.pathname.includes("/ops-console/");

  const baseUrl = localStorage.getItem("baseUrl") || "";
  const token = localStorage.getItem("token") || "";

  const loadUserDetails = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const result = await dispatch(
        getUserDetails({ baseUrl, token, id: Number(id) })
      ).unwrap();
      setUserDetails(result);
    } catch (error) {
      console.error("Error loading user details:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, id, baseUrl, token]);

  useEffect(() => {
    loadUserDetails();
  }, [loadUserDetails]);

  // Handle OTP generation
  const handleGenerateOTP = async (email: string) => {
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
            Authorization: `Bearer ${token}`,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading user details...</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">User not found</div>
      </div>
    );
  }

  return (
    <div className="mobile-user-detail min-h-screen bg-gray-50 pb-6">
      {/* PWA Header with Logo and Logout */}
      <PWAHeader />

      {/* Mobile Header */}
      <div className="sticky top-12 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                navigate(
                  isOpsConsole
                    ? "/ops-console/settings/account/user-list-otp"
                    : "/master/user/occupant-users"
                )
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">User Details</h1>
          </div>
          {isOpsConsole && userDetails?.email && (
            <Button
              size="sm"
              onClick={() => handleGenerateOTP(userDetails.email!)}
              disabled={otpLoading}
            >
              <Send className="h-4 w-4 mr-1" />
              Send OTP
            </Button>
          )}
        </div>
      </div>

      {/* User Profile Section */}
      <div className="px-4 py-4">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {userDetails.firstname} {userDetails.lastname}
                </h2>
                <Badge
                  variant={userDetails.active ? "default" : "secondary"}
                  className="mt-1"
                >
                  {userDetails.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-2">
                Contact Information
              </h3>

              {userDetails.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Email</div>
                    <div className="text-sm font-medium">
                      {userDetails.email}
                    </div>
                  </div>
                </div>
              )}

              {userDetails.mobile && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Mobile</div>
                    <div className="text-sm font-medium">
                      {userDetails.mobile}
                    </div>
                  </div>
                </div>
              )}

              {userDetails.gender && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Gender</div>
                    <div className="text-sm font-medium capitalize">
                      {userDetails.gender}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Organization Information */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Organization Details
            </h3>

            <div className="space-y-3">
              {userDetails.departmentName && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Department</div>
                    <div className="text-sm font-medium">
                      {userDetails.departmentName}
                    </div>
                  </div>
                </div>
              )}

              {userDetails.entity && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Entity</div>
                    <div className="text-sm font-medium">
                      {userDetails.entity}
                    </div>
                  </div>
                </div>
              )}

              {userDetails.designation && (
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Designation</div>
                    <div className="text-sm font-medium">
                      {userDetails.designation}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        {userDetails.sites && userDetails.sites.length > 0 && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                Assigned Sites
              </h3>
              <div className="space-y-2">
                {userDetails.sites.map((site, index: number) => (
                  <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                    {typeof site === "string" ? site : site.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {userDetails.roles && userDetails.roles.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {userDetails.roles.map((role, index: number) => (
                  <Badge key={index} variant="outline">
                    {typeof role === "string" ? role : role.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          className="w-full"
          onClick={() =>
            navigate(
              isOpsConsole
                ? "/ops-console/settings/account/user-list-otp"
                : "/master/user/occupant-users"
            )
          }
        >
          Back to List
        </Button>
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
    </div>
  );
};
