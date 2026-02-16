import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { getUserDetails } from "@/store/slices/fmUserSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Mail, Phone, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  const dispatch = useDispatch<AppDispatch>();
  const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

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
      {/* Mobile Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/master/user/occupant-users")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">User Details</h1>
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
          onClick={() => navigate("/master/user/occupant-users")}
        >
          Back to List
        </Button>
      </div>
    </div>
  );
};
