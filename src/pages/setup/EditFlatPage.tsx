import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function EditFlatPage() {
  const navigate = useNavigate();
  const { flatId } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    possession: true,
    sold: false,
    tower: "FM",
    flat: "Office",
    carpetArea: "",
    builtUpArea: "",
    flatType: "",
    occupied: "No",
    nameOnBill: "",
    dateOfPossession: "",
  });

  const [attachments, setAttachments] = useState<File[]>([]);

  // Load flat data based on flatId (mock data for now)
  useEffect(() => {
    // In a real app, fetch the flat data from API
    // For now, we'll use mock data
    if (flatId) {
      // Mock data - replace with actual API call
      setFormData({
        possession: true,
        sold: false,
        tower: "FM",
        flat: "Office",
        carpetArea: "",
        builtUpArea: "",
        flatType: "",
        occupied: "No",
        nameOnBill: "",
        dateOfPossession: "",
      });
    }
  }, [flatId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleUpdate = () => {
    // Validate required fields
    if (!formData.tower || !formData.flat) {
      toast.error("Please fill in all required fields");
      return;
    }

    // In a real app, send update request to API
    console.log("Updating flat:", { flatId, formData, attachments });
    toast.success("Flat updated successfully!");
    
    // Navigate back to manage flats page
    setTimeout(() => {
      navigate("/setup/manage-flats");
    }, 1000);
  };

  const handleUpload = () => {
    if (attachments.length === 0) {
      toast.error("Please select files to upload");
      return;
    }
    // Handle file upload
    console.log("Uploading files:", attachments);
    toast.success("Files uploaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/setup/manage-flats")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Flat</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Toggles Row */}
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <Label htmlFor="possession" className="text-sm font-medium text-gray-700">
                Possession:
              </Label>
              <Switch
                id="possession"
                checked={formData.possession}
                onCheckedChange={(checked) => handleInputChange("possession", checked)}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="sold" className="text-sm font-medium text-gray-700">
                Sold:
              </Label>
              <Switch
                id="sold"
                checked={formData.sold}
                onCheckedChange={(checked) => handleInputChange("sold", checked)}
                className="data-[state=checked]:bg-red-500"
              />
            </div>
          </div>

          {/* Tower and Flat Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tower" className="text-sm font-medium text-gray-700">
                Tower
              </Label>
              <Select
                value={formData.tower}
                onValueChange={(value) => handleInputChange("tower", value)}
              >
                <SelectTrigger id="tower" className="w-full">
                  <SelectValue placeholder="Select Tower" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FM">FM</SelectItem>
                  <SelectItem value="MLCP1">MLCP1</SelectItem>
                  <SelectItem value="Tower A">Tower A</SelectItem>
                  <SelectItem value="Tower B">Tower B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flat" className="text-sm font-medium text-gray-700">
                Flat
              </Label>
              <Input
                id="flat"
                placeholder="Enter Flat Number"
                value={formData.flat}
                onChange={(e) => handleInputChange("flat", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Carpet Area and Built up Area Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="carpetArea" className="text-sm font-medium text-gray-700">
                Carpet Area
              </Label>
              <Input
                id="carpetArea"
                placeholder="Enter Carpet Area"
                value={formData.carpetArea}
                onChange={(e) => handleInputChange("carpetArea", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="builtUpArea" className="text-sm font-medium text-gray-700">
                Built up Area
              </Label>
              <Input
                id="builtUpArea"
                placeholder="Enter Built up Area"
                value={formData.builtUpArea}
                onChange={(e) => handleInputChange("builtUpArea", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Flat Type and Occupied Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="flatType" className="text-sm font-medium text-gray-700">
                Flat Type
              </Label>
              <Select
                value={formData.flatType}
                onValueChange={(value) => handleInputChange("flatType", value)}
              >
                <SelectTrigger id="flatType" className="w-full">
                  <SelectValue placeholder="Select Flat Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1BHK">1 BHK - Apartment</SelectItem>
                  <SelectItem value="2BHK">2 BHK - Apartment</SelectItem>
                  <SelectItem value="3BHK">3 BHK - Apartment</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Shop">Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupied" className="text-sm font-medium text-gray-700">
                Occupied
              </Label>
              <Select
                value={formData.occupied}
                onValueChange={(value) => handleInputChange("occupied", value)}
              >
                <SelectTrigger id="occupied" className="w-full">
                  <SelectValue placeholder="Select Occupied Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Name on Bill and Date of Possession Row */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nameOnBill" className="text-sm font-medium text-gray-700">
                Name on Bill
              </Label>
              <Input
                id="nameOnBill"
                placeholder="Enter Name"
                value={formData.nameOnBill}
                onChange={(e) => handleInputChange("nameOnBill", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfPossession" className="text-sm font-medium text-gray-700">
                Date of possession
              </Label>
              <Input
                id="dateOfPossession"
                type="text"
                placeholder="Date of Possession"
                value={formData.dateOfPossession}
                onChange={(e) => handleInputChange("dateOfPossession", e.target.value)}
                className="w-full"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => (e.target.type = "text")}
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-start pt-4">
            <Button
              onClick={handleUpdate}
              className="px-8 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
            >
              Update
            </Button>
          </div>

          {/* Attachment Documents Section */}
          <div className="pt-6 border-t">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Attachment Documents
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Input
                  id="fileUpload"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
                {attachments.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      {attachments.length} file(s) selected
                    </p>
                  </div>
                )}
              </div>

              <Button
                onClick={handleUpload}
                variant="outline"
                className="px-6 py-2"
              >
                upload
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
