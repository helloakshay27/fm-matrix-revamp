import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
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

interface EditFormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  alternateEmail1: string;
  alternateEmail2: string;
  birthDate: string;
  anniversary: string;
  spouseBirthDate: string;
  alternateAddress: string;
  category: string;
  differentlyAbled: string;
  committeeMember: string;
  designation: string;
  residentType: string;
  livesHere: string;
  allowFitout: string;
  tower: string;
  flatNumber: string;
  landlineNumber: string;
  intercomNumber: string;
  panNumber: string;
  gstNumber: string;
  membershipType: string;
  phase: string;
  status: string;
  evConnection: string;
  noOfAdultFamilyMembers: string;
  noOfChildrenResiding: string;
  noOfPets: string;
}

export const ViewManageUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user-info");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfigureDialog, setShowConfigureDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddToAnotherFlatDialog, setShowAddToAnotherFlatDialog] = useState(false);
  const [clubDetails, setClubDetails] = useState<ClubDetails>({
    clubMembership: false,
    accessCardAllocated: false,
  });
  const [addToFlatFormData, setAddToFlatFormData] = useState({
    tower: "",
    flatNumber: "",
    residentType: "",
    livesHere: "",
    allowFitout: "",
    status: "",
    isPrimary: "",
    landlineNumber: "",
    intercomNumber: "",
    gstNumber: "",
    panNumber: "",
  });
  const [editFormData, setEditFormData] = useState<EditFormData>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    alternateEmail1: "",
    alternateEmail2: "",
    birthDate: "",
    anniversary: "",
    spouseBirthDate: "",
    alternateAddress: "",
    category: "",
    differentlyAbled: "no",
    committeeMember: "no",
    designation: "",
    residentType: "owner",
    livesHere: "no",
    allowFitout: "no",
    tower: "",
    flatNumber: "",
    landlineNumber: "",
    intercomNumber: "",
    panNumber: "",
    gstNumber: "",
    membershipType: "secondary",
    phase: "",
    status: "",
    evConnection: "",
    noOfAdultFamilyMembers: "",
    noOfChildrenResiding: "",
    noOfPets: "",
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
    // Populate edit form with current user data
    if (userData) {
      setEditFormData({
        title: "",
        firstName: userData.name.split(" ")[1] || "",
        lastName: userData.name.split(" ")[2] || "",
        email: userData.email,
        alternateEmail1: userData.alternateEmail1,
        alternateEmail2: userData.alternateEmail2,
        birthDate: userData.birthday,
        anniversary: userData.anniversary,
        spouseBirthDate: userData.spouseBirthday,
        alternateAddress: userData.alternateAddress,
        category: "",
        differentlyAbled: "no",
        committeeMember: userData.committeeMember.toLowerCase(),
        designation: userData.designation,
        residentType: userData.residentType,
        livesHere: userData.livesHere.toLowerCase(),
        allowFitout: userData.allowFitout.toLowerCase(),
        tower: "",
        flatNumber: userData.flatNumber,
        landlineNumber: userData.landlineNumber,
        intercomNumber: userData.intercomNumber,
        panNumber: userData.pan,
        gstNumber: userData.gst,
        membershipType: userData.membershipType.toLowerCase(),
        phase: userData.phase,
        status: userData.status,
        evConnection: userData.evConnection,
        noOfAdultFamilyMembers: userData.noOfAdultFamilyMembers,
        noOfChildrenResiding: userData.noOfChildrenResiding,
        noOfPets: userData.noOfPets,
      });
    }
    setShowEditDialog(true);
  };

  const handleAddToAnotherFlat = () => {
    console.log("Add to another flat");
    setShowAddToAnotherFlatDialog(true);
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

  const handleEditFormChange = (field: keyof EditFormData, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitEdit = () => {
    // Validation
    if (!editFormData.firstName.trim() || !editFormData.email.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    // In real implementation, save to API
    console.log("Saving edit:", editFormData);
    toast.success("User details updated successfully!");
    setShowEditDialog(false);
    
    // Optionally refresh user data
    // fetchUserData();
  };

  const handleAddToFlatFormChange = (field: string, value: string) => {
    setAddToFlatFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitAddToFlat = () => {
    // Validation
    if (!addToFlatFormData.tower || !addToFlatFormData.flatNumber) {
      toast.error("Please select tower and flat number");
      return;
    }

    // In real implementation, save to API
    console.log("Adding user to another flat:", addToFlatFormData);
    toast.success("User added to another flat successfully!");
    setShowAddToAnotherFlatDialog(false);
    
    // Reset form
    setAddToFlatFormData({
      tower: "",
      flatNumber: "",
      residentType: "",
      livesHere: "",
      allowFitout: "",
      status: "",
      isPrimary: "",
      landlineNumber: "",
      intercomNumber: "",
      gstNumber: "",
      panNumber: "",
    });
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

        {/* Edit Details Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Edit Details
                </DialogTitle>
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Title and First Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Select
                    value={editFormData.title}
                    onValueChange={(value) => handleEditFormChange("title", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editFormData.firstName}
                    onChange={(e) => handleEditFormChange("firstName", e.target.value)}
                  />
                </div>
              </div>

              {/* Last Name and Email Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editFormData.lastName}
                    onChange={(e) => handleEditFormChange("lastName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => handleEditFormChange("email", e.target.value)}
                  />
                </div>
              </div>

              {/* Alternate Emails Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alternateEmail1">Alternate Email-1</Label>
                  <Input
                    id="alternateEmail1"
                    placeholder="Alternate Email-1"
                    value={editFormData.alternateEmail1}
                    onChange={(e) => handleEditFormChange("alternateEmail1", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternateEmail2">Alternate Email-2</Label>
                  <Input
                    id="alternateEmail2"
                    placeholder="Alternate Email-2"
                    value={editFormData.alternateEmail2}
                    onChange={(e) => handleEditFormChange("alternateEmail2", e.target.value)}
                  />
                </div>
              </div>

              {/* Birth Date and Anniversary Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date:</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    placeholder="Birth Date"
                    value={editFormData.birthDate}
                    onChange={(e) => handleEditFormChange("birthDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="anniversary">Anniversary:</Label>
                  <Input
                    id="anniversary"
                    type="date"
                    placeholder="Anniversary Date"
                    value={editFormData.anniversary}
                    onChange={(e) => handleEditFormChange("anniversary", e.target.value)}
                  />
                </div>
              </div>

              {/* Spouse Birth Date and Alternate Address Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseBirthDate">Spouse Birth Date:</Label>
                  <Input
                    id="spouseBirthDate"
                    type="date"
                    placeholder="Spouse Birth Date"
                    value={editFormData.spouseBirthDate}
                    onChange={(e) => handleEditFormChange("spouseBirthDate", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alternateAddress">Alternate Address</Label>
                  <Textarea
                    id="alternateAddress"
                    placeholder="Alternate Address"
                    value={editFormData.alternateAddress}
                    onChange={(e) => handleEditFormChange("alternateAddress", e.target.value)}
                    className="resize-none"
                  />
                </div>
              </div>

              {/* Select Category and Differently Abled */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Select Category</Label>
                  <Select
                    value={editFormData.category}
                    onValueChange={(value) => handleEditFormChange("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="senior">Senior Citizen</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Differently Abled</Label>
                  <RadioGroup
                    value={editFormData.differentlyAbled}
                    onValueChange={(value) => handleEditFormChange("differentlyAbled", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="diff-yes" />
                      <Label htmlFor="diff-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="diff-no" />
                      <Label htmlFor="diff-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Committe Member and Designation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Committe Member</Label>
                  <RadioGroup
                    value={editFormData.committeeMember}
                    onValueChange={(value) => handleEditFormChange("committeeMember", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="comm-yes" />
                      <Label htmlFor="comm-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="comm-no" />
                      <Label htmlFor="comm-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    placeholder="Designation"
                    value={editFormData.designation}
                    onChange={(e) => handleEditFormChange("designation", e.target.value)}
                  />
                </div>
              </div>

              {/* Resident Type */}
              <div className="space-y-2">
                <Label>Resident Type</Label>
                <RadioGroup
                  value={editFormData.residentType}
                  onValueChange={(value) => handleEditFormChange("residentType", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owner" id="owner" />
                    <Label htmlFor="owner">Owner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tenant" id="tenant" />
                    <Label htmlFor="tenant">Tenant</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="builder" id="builder" />
                    <Label htmlFor="builder">Builder</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Lives Here and Allow Fitout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lives Here</Label>
                  <RadioGroup
                    value={editFormData.livesHere}
                    onValueChange={(value) => handleEditFormChange("livesHere", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="lives-yes" />
                      <Label htmlFor="lives-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="lives-no" />
                      <Label htmlFor="lives-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Allow Fitout</Label>
                  <RadioGroup
                    value={editFormData.allowFitout}
                    onValueChange={(value) => handleEditFormChange("allowFitout", value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="fitout-yes" />
                      <Label htmlFor="fitout-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="fitout-no" />
                      <Label htmlFor="fitout-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Select Tower and Flat Number */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tower">Select Tower</Label>
                  <Select
                    value={editFormData.tower}
                    onValueChange={(value) => handleEditFormChange("tower", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="T3" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t1">T1</SelectItem>
                      <SelectItem value="t2">T2</SelectItem>
                      <SelectItem value="t3">T3</SelectItem>
                      <SelectItem value="t4">T4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flatNumber">Flat Number</Label>
                  <Select
                    value={editFormData.flatNumber}
                    onValueChange={(value) => handleEditFormChange("flatNumber", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Flat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">101</SelectItem>
                      <SelectItem value="102">102</SelectItem>
                      <SelectItem value="103">103</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Landline and Intercom Number */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="landlineNumber">Landline Number</Label>
                  <Input
                    id="landlineNumber"
                    placeholder="Landline Number"
                    value={editFormData.landlineNumber}
                    onChange={(e) => handleEditFormChange("landlineNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="intercomNumber">Intercom Number</Label>
                  <Input
                    id="intercomNumber"
                    placeholder="Intercom Number"
                    value={editFormData.intercomNumber}
                    onChange={(e) => handleEditFormChange("intercomNumber", e.target.value)}
                  />
                </div>
              </div>

              {/* PAN and GST Number */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    placeholder="PAN Number"
                    value={editFormData.panNumber}
                    onChange={(e) => handleEditFormChange("panNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    placeholder="GST Number"
                    value={editFormData.gstNumber}
                    onChange={(e) => handleEditFormChange("gstNumber", e.target.value)}
                  />
                </div>
              </div>

              {/* Membership Type */}
              <div className="space-y-2">
                <Label>Membership Type</Label>
                <RadioGroup
                  value={editFormData.membershipType}
                  onValueChange={(value) => handleEditFormChange("membershipType", value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="primary" id="primary" />
                    <Label htmlFor="primary">Primary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="secondary" id="secondary" />
                    <Label htmlFor="secondary">Secondary</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Select Phase and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase">Select Phase</Label>
                  <Select
                    value={editFormData.phase}
                    onValueChange={(value) => handleEditFormChange("phase", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Post Possession" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre">Pre Possession</SelectItem>
                      <SelectItem value="post">Post Possession</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editFormData.status}
                    onValueChange={(value) => handleEditFormChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Approved" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* EV Connection, Adults, Children, Pets */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="evConnection">EV Connection:</Label>
                  <Select
                    value={editFormData.evConnection}
                    onValueChange={(value) => handleEditFormChange("evConnection", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="NA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="na">NA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noOfAdultFamilyMembers">No. of Adult Family Members Residing:</Label>
                  <Input
                    id="noOfAdultFamilyMembers"
                    placeholder="Adults"
                    value={editFormData.noOfAdultFamilyMembers}
                    onChange={(e) => handleEditFormChange("noOfAdultFamilyMembers", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noOfChildrenResiding">No. of Children Residing:</Label>
                  <Input
                    id="noOfChildrenResiding"
                    placeholder="Children"
                    value={editFormData.noOfChildrenResiding}
                    onChange={(e) => handleEditFormChange("noOfChildrenResiding", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noOfPets">No. of Pets:</Label>
                  <Input
                    id="noOfPets"
                    placeholder="pets"
                    value={editFormData.noOfPets}
                    onChange={(e) => handleEditFormChange("noOfPets", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                onClick={handleSubmitEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
              >
                Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add to Another Flat Dialog */}
        <Dialog open={showAddToAnotherFlatDialog} onOpenChange={setShowAddToAnotherFlatDialog}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold">
                  Add to Another Flat
                </DialogTitle>
                <button
                  onClick={() => setShowAddToAnotherFlatDialog(false)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </DialogHeader>

            <div className="py-6 space-y-6">
              {/* Tower and Flat Number */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-tower">Tower</Label>
                  <Select
                    value={addToFlatFormData.tower}
                    onValueChange={(value) => handleAddToFlatFormChange("tower", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Tower" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="t1">T1</SelectItem>
                      <SelectItem value="t2">T2</SelectItem>
                      <SelectItem value="t3">T3</SelectItem>
                      <SelectItem value="t4">T4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-flatNumber">Flat Number</Label>
                  <Select
                    value={addToFlatFormData.flatNumber}
                    onValueChange={(value) => handleAddToFlatFormChange("flatNumber", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Flat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="101">101</SelectItem>
                      <SelectItem value="102">102</SelectItem>
                      <SelectItem value="103">103</SelectItem>
                      <SelectItem value="104">104</SelectItem>
                      <SelectItem value="105">105</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resident Type and Lives Here */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-residentType">Resident Type</Label>
                  <Select
                    value={addToFlatFormData.residentType}
                    onValueChange={(value) => handleAddToFlatFormChange("residentType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="builder">Builder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-livesHere">Lives Here</Label>
                  <Select
                    value={addToFlatFormData.livesHere}
                    onValueChange={(value) => handleAddToFlatFormChange("livesHere", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Allow Fitout and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-allowFitout">Allow Fitout</Label>
                  <Select
                    value={addToFlatFormData.allowFitout}
                    onValueChange={(value) => handleAddToFlatFormChange("allowFitout", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-status">Status</Label>
                  <Select
                    value={addToFlatFormData.status}
                    onValueChange={(value) => handleAddToFlatFormChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Is Primary and Landline Number */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-isPrimary">Is Primary</Label>
                  <Select
                    value={addToFlatFormData.isPrimary}
                    onValueChange={(value) => handleAddToFlatFormChange("isPrimary", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-landlineNumber">Landline Number</Label>
                  <Input
                    id="add-landlineNumber"
                    placeholder="Landline Number"
                    value={addToFlatFormData.landlineNumber}
                    onChange={(e) => handleAddToFlatFormChange("landlineNumber", e.target.value)}
                  />
                </div>
              </div>

              {/* Intercom Number and GST Number */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-intercomNumber">Intercom Number</Label>
                  <Input
                    id="add-intercomNumber"
                    placeholder="Intercom Number"
                    value={addToFlatFormData.intercomNumber}
                    onChange={(e) => handleAddToFlatFormChange("intercomNumber", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-gstNumber">GST Number</Label>
                  <Input
                    id="add-gstNumber"
                    placeholder="Gst Number"
                    value={addToFlatFormData.gstNumber}
                    onChange={(e) => handleAddToFlatFormChange("gstNumber", e.target.value)}
                  />
                </div>
              </div>

              {/* PAN Number */}
              <div className="space-y-2">
                <Label htmlFor="add-panNumber">PAN Number</Label>
                <Input
                  id="add-panNumber"
                  placeholder="Pan Number"
                  value={addToFlatFormData.panNumber}
                  onChange={(e) => handleAddToFlatFormChange("panNumber", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                onClick={handleSubmitAddToFlat}
                className="bg-green-600 hover:bg-green-700 text-white px-8"
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
