
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddEventModal = ({ open, onOpenChange }: AddEventModalProps) => {
  const [rsvp, setRsvp] = useState(false);
  const [shareWith, setShareWith] = useState("all");
  const [markAsImportant, setMarkAsImportant] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-sm text-gray-600 mb-2">
            Event List &gt; Create Event
          </div>
          <DialogTitle className="text-2xl font-bold">NEW Event</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-semibold">
              <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">
                📍
              </div>
              EVENT INFORMATION
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input id="title" placeholder="Title" />
              </div>
              <div>
                <Label htmlFor="venue">Venue*</Label>
                <Input id="venue" placeholder="Enter Venue" />
              </div>
              <div>
                <Label htmlFor="startDate">Start date*</Label>
                <Input id="startDate" placeholder="Start Date" type="date" />
              </div>
              <div>
                <Label htmlFor="endDate">End date*</Label>
                <Input id="endDate" placeholder="End Date" type="date" />
              </div>
              <div>
                <Label htmlFor="startTime">Start Time*</Label>
                <Input id="startTime" defaultValue="09:00 PM" />
              </div>
              <div>
                <Label htmlFor="endTime">End Time*</Label>
                <Input id="endTime" placeholder="End Time" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Enter Description" 
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label className="text-base font-medium mb-3 block">RSVP</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span>NO</span>
                    <Switch 
                      checked={rsvp}
                      onCheckedChange={setRsvp}
                    />
                    <span>YES</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Share with</Label>
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
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="markImportant"
                  checked={markAsImportant}
                  onCheckedChange={(checked) => setMarkAsImportant(checked === true)}
                />
                <Label htmlFor="markImportant">Mark as Important</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sendEmail"
                  checked={sendEmail}
                  onCheckedChange={(checked) => setSendEmail(checked === true)}
                />
                <Label htmlFor="sendEmail">Send Email</Label>
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

          {/* Action Button */}
          <div className="flex justify-end">
            <Button className="bg-purple-700 hover:bg-purple-800 text-white px-8">
              Create Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
