
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BroadcastFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BroadcastFilterModal = ({ open, onOpenChange }: BroadcastFilterModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Filter</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Communication Type</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select up to 15 Optio..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select up to 15 Optio..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Date Range</Label>
            <Select>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Reset
            </Button>
            <Button className="bg-purple-700 hover:bg-purple-800 text-white">
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
