
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTestimonialModal = ({ isOpen, onClose }: AddTestimonialModalProps) => {
  const [formData, setFormData] = useState({
    site: '',
    name: '',
    designation: '',
    companyName: '',
    description: '',
    image: null as File | null
  });

  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 250;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxCharacters) {
      setFormData({ ...formData, description: text });
      setCharacterCount(text.length);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add Testimonial</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Site Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="site">
              Site <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.site} onValueChange={(value) => setFormData({ ...formData, site: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select site..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lockated">Lockated</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Designation Field */}
          <div className="space-y-2">
            <Label htmlFor="designation">
              Designation <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designation"
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>

          {/* Company Name Field */}
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              rows={4}
              required
            />
            <div className="text-sm text-gray-500 text-right">
              {maxCharacters - characterCount} characters remaining
            </div>
          </div>

          {/* Upload Image Field */}
          <div className="space-y-2">
            <Label htmlFor="image">
              Upload Image <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
              <input
                id="image"
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="w-full"
                required
              />
            </div>
            <div className="text-xs text-gray-500">
              Accepted file formats: PNG/JPEG (height: 115px, width: 93px) (max 5 mb)
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700 text-white w-full"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
