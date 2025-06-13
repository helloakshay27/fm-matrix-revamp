
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBusinessModal = ({ isOpen, onClose }: AddBusinessModalProps) => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    landline1: "",
    landline2: "",
    primaryEmail: "",
    secondaryEmail: "",
    extInternet: "",
    website: "",
    category: "",
    subCategory: "",
    keyOffering: "",
    address: "",
    description: "",
    profile: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">NEW DIRECTORY</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-orange-600">BUSINESS DETAILS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name*</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person*</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile*</Label>
                <Input
                  id="mobile"
                  value={formData.extInternet}
                  onChange={(e) => handleInputChange("extInternet", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landline1">Landline 1</Label>
                <Input
                  id="landline1"
                  value={formData.landline1}
                  onChange={(e) => handleInputChange("landline1", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="landline2">Landline 2</Label>
                <Input
                  id="landline2"
                  value={formData.landline2}
                  onChange={(e) => handleInputChange("landline2", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryEmail">Primary Email*</Label>
                <Input
                  id="primaryEmail"
                  type="email"
                  value={formData.primaryEmail}
                  onChange={(e) => handleInputChange("primaryEmail", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryEmail">Secondary Email</Label>
                <Input
                  id="secondaryEmail"
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) => handleInputChange("secondaryEmail", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyOffering">Key Offering</Label>
                <Input
                  id="keyOffering"
                  value={formData.keyOffering}
                  onChange={(e) => handleInputChange("keyOffering", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category*</Label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internet-services">Internet Services</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="laptop-repairer">Laptop Repairer</SelectItem>
                    <SelectItem value="print-media">Print & Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subCategory">Sub Category</Label>
                <Select onValueChange={(value) => handleInputChange("subCategory", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sub1">Sub Category 1</SelectItem>
                    <SelectItem value="sub2">Sub Category 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address*</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="min-h-[80px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile">Profile</Label>
                  <Textarea
                    id="profile"
                    value={formData.profile}
                    onChange={(e) => handleInputChange("profile", e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-orange-600">ATTACHMENTS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-blue-500 mb-2">📎</div>
                  <p className="text-sm text-gray-500">Choose File - No file chosen</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Gallery</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-red-500 mb-2">📎</div>
                  <p className="text-sm text-gray-500">Choose File - No file chosen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white px-8">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
