
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventsFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventsFilterModal = ({ open, onOpenChange }: EventsFilterModalProps) => {
  const handleApply = () => {
    // Handle filter apply logic here
    console.log("Applying filters...");
    onOpenChange(false);
  };

  const handleReset = () => {
    // Handle filter reset logic here
    console.log("Resetting filters...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">FILTER</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit" className="text-sm font-medium">Unit</Label>
              <Input id="unit" placeholder="..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input id="date" placeholder="Select Date Range" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="S..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleApply}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6"
            >
              Apply
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-6"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
