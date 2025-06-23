
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EventsFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventsFilterModal = ({ open, onOpenChange }: EventsFilterModalProps) => {
  const handleApply = () => {
    console.log("Applying filters...");
    onOpenChange(false);
  };

  const handleReset = () => {
    console.log("Resetting filters...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">OPTIONS</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Category</Label>
            <RadioGroup defaultValue="ppm" className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ppm" id="events-ppm" className="border-red-500 text-red-500" />
                <Label htmlFor="events-ppm" className="text-sm font-medium">PPM</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="audit" id="events-audit" />
                <Label htmlFor="events-audit" className="text-sm font-medium">Audit</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hoto" id="events-hoto" />
                <Label htmlFor="events-hoto" className="text-sm font-medium">Hoto</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amc" id="events-amc" />
                <Label htmlFor="events-amc" className="text-sm font-medium">AMC</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="preparedness" id="events-preparedness" />
                <Label htmlFor="events-preparedness" className="text-sm font-medium">Preparedness</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="routine" id="events-routine" />
                <Label htmlFor="events-routine" className="text-sm font-medium">Routine</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Filters */}
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
