import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface EventFormData {
  title: string;
  venue: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  markAsImportant: boolean;
  sendEmail: boolean;
  shareWith: "all" | "individuals" | "groups";
  rsvp: boolean;
}

const AddEventPage = () => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    venue: "",
    description: "",
    startDate: "",
    startTime: "04:15",
    endDate: "",
    endTime: "04:15",
    markAsImportant: false,
    sendEmail: false,
    shareWith: "all",
    rsvp: true,
  });

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter event title");
      return;
    }
    if (!formData.venue.trim()) {
      toast.error("Please enter venue");
      return;
    }
    if (!formData.startDate) {
      toast.error("Please select start date");
      return;
    }
    if (!formData.endDate) {
      toast.error("Please select end date");
      return;
    }

    // In real implementation, send data to API
    console.log("Event Data:", formData);
    console.log("Attachments:", attachments);
    
    toast.success("Event created successfully!");
    navigate("/communication/events");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/communication/events")}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>

        {/* EVENT INFO Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#1A1A1A] bg-[#C4B89D54] inline-block px-4 py-2 rounded">
              EVENT INFO
            </h2>
          </div>

          <div className="space-y-6">
            {/* Title and Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="venue" className="text-sm font-medium text-gray-700">
                  Venue
                </Label>
                <Input
                  id="venue"
                  placeholder="Enter Venue"
                  value={formData.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full min-h-[100px] resize-none"
              />
            </div>

            {/* Date and Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                  Start Time
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-700">
                  &nbsp;
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                  End Time
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  placeholder="End Date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-700">
                  &nbsp;
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="markAsImportant"
                  checked={formData.markAsImportant}
                  onCheckedChange={(checked) =>
                    handleInputChange("markAsImportant", checked)
                  }
                />
                <label
                  htmlFor="markAsImportant"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Mark as Important
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sendEmail"
                  checked={formData.sendEmail}
                  onCheckedChange={(checked) =>
                    handleInputChange("sendEmail", checked)
                  }
                />
                <label
                  htmlFor="sendEmail"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Send Email
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* UPLOAD FILES Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#1A1A1A] bg-[#C4B89D54] inline-block px-4 py-2 rounded">
              UPLOAD FILES
            </h2>
          </div>

          <div className="flex items-center justify-center">
            <label
              htmlFor="file-upload"
              className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <Plus className="w-8 h-8 text-gray-400" />
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,application/pdf,.doc,.docx"
              />
            </label>
          </div>

          {attachments.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {attachments.length} file(s) selected
              </p>
              <div className="space-y-1">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 py-1 px-2 bg-gray-50 rounded"
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SHARE WITH Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#1A1A1A] bg-[#C4B89D54] inline-block px-4 py-2 rounded">
              SHARE WITH
            </h2>
          </div>

          <RadioGroup
            value={formData.shareWith}
            onValueChange={(value: "all" | "individuals" | "groups") =>
              handleInputChange("shareWith", value)
            }
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="cursor-pointer">
                All
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individuals" id="individuals" />
              <Label htmlFor="individuals" className="cursor-pointer">
                Individuals
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="groups" id="groups" />
              <Label htmlFor="groups" className="cursor-pointer">
                Groups
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* RSVP Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-[#1A1A1A] bg-[#C4B89D54] inline-block px-4 py-2 rounded">
              RSVP
            </h2>
          </div>

          <RadioGroup
            value={formData.rsvp ? "yes" : "no"}
            onValueChange={(value) => handleInputChange("rsvp", value === "yes")}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="rsvp-yes" />
              <Label htmlFor="rsvp-yes" className="cursor-pointer">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="rsvp-no" />
              <Label htmlFor="rsvp-no" className="cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddEventPage;
