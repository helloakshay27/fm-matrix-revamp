
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddBroadcastModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddBroadcastModal = ({ open, onOpenChange }: AddBroadcastModalProps) => {
  const [shareWith, setShareWith] = useState("all");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-sm text-gray-600 mb-2">
            Broadcast List &gt; New Broadcast
          </div>
          <DialogTitle className="text-2xl font-bold">NEW BROADCAST (#3423)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Communication Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                💬
              </div>
              COMMUNICATION INFORMATION
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input id="title" placeholder="Title" />
              </div>
              <div>
                <Label htmlFor="description">Description*</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter Description" 
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-2">Expire on</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">End Date*</Label>
                <Input id="endDate" placeholder="End Date" type="date" />
              </div>
              <div>
                <Label htmlFor="endTime">End Time*</Label>
                <Input id="endTime" placeholder="End Time" type="time" />
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                📎
              </div>
              ATTACHMENTS
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Button variant="outline" className="text-red-600 border-red-600">
                Choose Files
              </Button>
              <span className="ml-2 text-gray-500">No file chosen</span>
            </div>
          </div>

          {/* Share with Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                👥
              </div>
              Share with
            </div>

            <RadioGroup value={shareWith} onValueChange={setShareWith}>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="individuals" id="individuals" />
                  <Label htmlFor="individuals">Individuals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="groups" id="groups" />
                  <Label htmlFor="groups">Groups</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            <Button className="bg-purple-700 hover:bg-purple-800 text-white px-8">
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
