import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  flatNumber: string;
  status: string;
  mobile: string;
  email: string;
  alternateEmail1: string;
  alternateEmail2: string;
  committeeMember: string;
  designation: string;
  livesHere: string;
  allowFitout: string;
  membershipType: string;
  birthday: string;
  anniversary: string;
  spouseBirthday: string;
  evConnection: string;
  noOfAdultFamilyMembers: string;
  noOfChildrenResiding: string;
  noOfPets: string;
  residentType: string;
  dateOfPossession: string;
  pan: string;
  gst: string;
  intercomNumber: string;
  landlineNumber: string;
  alternateAddress: string;
  phase: string;
  membersList: Array<{
    name: string;
    relation?: string;
  }>;
}

interface ClubDetails {
  clubMembership: boolean;
  accessCardAllocated: boolean;
}

export const ViewManageUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user-info");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfigureDialog, setShowConfigureDialog] = useState(false);
  const [clubDetails, setClubDetails] = useState<ClubDetails>({
    clubMembership: false,
    accessCardAllocated: false,
  });

  useEffect(() => {
    // Simulate fetching user data
    // In real implementation, fetch from API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockData: UserData = {
          id: id || "1",
          name: "Mr. ubaid hashmat",
          flatNumber: "FM/101",
          status: "Approved",
          mobile: "9506288500",
          email: "ubaid.hashmat@lockated.com",
          alternateEmail1: "NA",
          alternateEmail2: "NA",
          committeeMember: "No",
          designation: "",
          livesHere: "yes",
          allowFitout: "No",
          membershipType: "Primary",
          birthday: "NA",
          anniversary: "NA",
          spouseBirthday: "NA",
          evConnection: "",
          noOfAdultFamilyMembers: "",
          noOfChildrenResiding: "",
          noOfPets: "",
          residentType: "owner",
          dateOfPossession: "",
          pan: "NA",
          gst: "NA",
          intercomNumber: "NA",
          landlineNumber: "NA",
          alternateAddress: "worly",
          phase: "Post Possession",
          membersList: [
            { name: "FM/101 -" },
            { name: "FM/101 - Daniel Anson" },
            { name: "FM/101 - Saurabh natu" },
            { name: "FM/101 - Sriram I" },
            { name: "FM/101 - Devesh kumar Jain" },
            { name: "FM/101 - Suneel More" },
            { name: "FM/101 - Jayesh Pandey" },
            { name: "FM/101 - Indira Thakur" },
            { name: "FM/101 - Ravindra Kasurde" },
            { name: "FM/101 - Ashish Singh" },
            { name: "FM/101 - Sameer Shaikh" },
            { name: "FM/101 -" },
            { name: "FM/101 - Deepak Gupta" },
            { name: "FM/101 - Raj Singh" },
          ],
        };
        setUserData(mockData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleEdit = () => {
    navigate(`/setup/manage-users/edit/${id}`);
  };

  const handleAddToAnotherFlat = () => {
    console.log("Add to another flat");
    // Implement add to another flat functionality
  };

  const handleConfigureDetail = () => {
    setShowConfigureDialog(true);
  };

  const handleCloseDialog = () => {
    setShowConfigureDialog(false);
  };

  const handleSubmitClubDetails = () => {
    // In real implementation, save to API
    console.log("Saving club details:", clubDetails);
    toast.success("Club details saved successfully!");
    setShowConfigureDialog(false);
  };

  const handleClubMembershipChange = (checked: boolean) => {
    setClubDetails((prev) => ({ ...prev, clubMembership: checked }));
  };

  const handleAccessCardChange = (checked: boolean) => {
    setClubDetails((prev) => ({ ...prev, accessCardAllocated: checked }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">User not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/setup/manage-users")}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Manage Users
        </Button>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border-b">
            <TabsTrigger
              value="user-info"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              User Info
            </TabsTrigger>
            <TabsTrigger
              value="club-info"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
            >
              Club Info
            </TabsTrigger>
          </TabsList>

          {/* User Info Tab */}
          <TabsContent value="user-info" className="mt-0">
            <div className="bg-gradient-to-b from-[#E8F5E9] to-white rounded-b-lg shadow-sm">
              {/* Header Section with Avatar */}
              <div className="relative pt-8 pb-6 px-6">
                <Button
                  onClick={handleEdit}
                  className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Edit
                </Button>

                <div className="flex flex-col items-center">
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center mb-4">
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="50" cy="35" r="20" fill="#8B7355" />
                      <circle cx="50" cy="30" r="15" fill="#D4A574" />
                      <path
                        d="M 30 55 Q 30 45 50 45 Q 70 45 70 55 L 70 80 Q 70 85 65 85 L 35 85 Q 30 85 30 80 Z"
                        fill="#E6A020"
                      />
                      <path
                        d="M 35 60 Q 35 50 50 50 Q 65 50 65 60 L 65 85 L 35 85 Z"
                        fill="#CC8F1A"
                      />
                    </svg>
                  </div>

                  {/* User Name */}
                  <h1 className="text-2xl font-semibold text-[#1A1A1A] mb-1">
                    {userData.name}
                  </h1>

                  {/* Flat Number */}
                  <p className="text-sm text-gray-600 mb-2">
                    Flat Number - {userData.flatNumber}
                  </p>

                  {/* Status Badge */}
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full mb-4">
                    {userData.status}
                  </span>

                  {/* Add to Another Flat Button */}
                  <Button
                    onClick={handleAddToAnotherFlat}
                    className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
                  >
                    Add to Another Flat
                  </Button>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="bg-white px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Mobile */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Mobile
                    </label>
                    <p className="text-sm text-gray-900">{userData.mobile}</p>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900">{userData.email}</p>
                  </div>

                  {/* Alternate Email-1 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Alternate Email-1
                    </label>
                    <p className="text-sm text-gray-900">{userData.alternateEmail1}</p>
                  </div>

                  {/* Alternate Email-2 */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Alternate Email-2
                    </label>
                    <p className="text-sm text-gray-900">{userData.alternateEmail2}</p>
                  </div>

                  {/* Committee Member */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Committee Member
                    </label>
                    <p className="text-sm text-gray-900">{userData.committeeMember}</p>
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Designation
                    </label>
                    <p className="text-sm text-gray-900">{userData.designation || "-"}</p>
                  </div>

                  {/* Lives Here */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Lives Here
                    </label>
                    <p className="text-sm text-gray-900">{userData.livesHere}</p>
                  </div>

                  {/* Allow Fitout */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Allow Fitout
                    </label>
                    <p className="text-sm text-gray-900">{userData.allowFitout}</p>
                  </div>

                  {/* Membership Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Membership Type
                    </label>
                    <p className="text-sm text-gray-900">{userData.membershipType}</p>
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Birthday
                    </label>
                    <p className="text-sm text-gray-900">{userData.birthday}</p>
                  </div>

                  {/* Anniversary */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Anniversary
                    </label>
                    <p className="text-sm text-gray-900">{userData.anniversary}</p>
                  </div>

                  {/* Spouse Birthday */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Spouse Birthday
                    </label>
                    <p className="text-sm text-gray-900">{userData.spouseBirthday}</p>
                  </div>

                  {/* EV Connection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      EV Connection
                    </label>
                    <p className="text-sm text-gray-900">{userData.evConnection || "-"}</p>
                  </div>

                  {/* No. of Adult Family Members Residing */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      No. of Adult Family Members Residing:
                    </label>
                    <p className="text-sm text-gray-900">
                      {userData.noOfAdultFamilyMembers || "-"}
                    </p>
                  </div>

                  {/* No. of Children Residing */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      No. of Children Residing:
                    </label>
                    <p className="text-sm text-gray-900">
                      {userData.noOfChildrenResiding || "-"}
                    </p>
                  </div>

                  {/* No. of Pets */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      No. of Pets:
                    </label>
                    <p className="text-sm text-gray-900">{userData.noOfPets || "-"}</p>
                  </div>

                  {/* Resident Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Resident Type
                    </label>
                    <p className="text-sm text-gray-900">{userData.residentType}</p>
                  </div>

                  {/* Date of possession */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Date of possession:
                    </label>
                    <p className="text-sm text-gray-900">
                      {userData.dateOfPossession || "-"}
                    </p>
                  </div>

                  {/* PAN */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      PAN
                    </label>
                    <p className="text-sm text-gray-900">{userData.pan}</p>
                  </div>

                  {/* GST */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      GST
                    </label>
                    <p className="text-sm text-gray-900">{userData.gst}</p>
                  </div>

                  {/* Intercom Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Intercom Number
                    </label>
                    <p className="text-sm text-gray-900">{userData.intercomNumber}</p>
                  </div>

                  {/* Landline Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Landline Number
                    </label>
                    <p className="text-sm text-gray-900">{userData.landlineNumber}</p>
                  </div>

                  {/* Alternate Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Alternate Address
                    </label>
                    <p className="text-sm text-gray-900">{userData.alternateAddress}</p>
                  </div>

                  {/* Phase */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phase
                    </label>
                    <p className="text-sm text-gray-900">{userData.phase}</p>
                  </div>
                </div>

                {/* Members List Section */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-[#00BCD4] mb-4">
                    Members List
                  </h3>
                  <div className="space-y-2">
                    {userData.membersList.map((member, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0"
                      >
                        {member.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Club Info Tab */}
          <TabsContent value="club-info" className="mt-0">
            <div className="bg-white rounded-b-lg shadow-sm p-6 min-h-[400px]">
              <div className="flex items-center justify-center h-full">
                <Button
                  onClick={handleConfigureDetail}
                  className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white px-6 py-2"
                >
                  Configure Detail
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Configure Details Dialog */}
        <Dialog open={showConfigureDialog} onOpenChange={setShowConfigureDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Configure Details
                </DialogTitle>
                <button
                  onClick={handleCloseDialog}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Club Membership Checkbox */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="club-membership"
                  checked={clubDetails.clubMembership}
                  onCheckedChange={handleClubMembershipChange}
                  className="h-5 w-5"
                />
                <label
                  htmlFor="club-membership"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Club Membership
                </label>
              </div>

              {/* Access Card Allocated Checkbox */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="access-card"
                  checked={clubDetails.accessCardAllocated}
                  onCheckedChange={handleAccessCardChange}
                  className="h-5 w-5"
                />
                <label
                  htmlFor="access-card"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Access Card Allocated
                </label>
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                onClick={handleSubmitClubDetails}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
