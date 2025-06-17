
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DesignInsightFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignInsightFilterModal: React.FC<DesignInsightFilterModalProps> = ({ isOpen, onClose }) => {
  const [dateRange, setDateRange] = useState('');
  const [zone, setZone] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [mustHave, setMustHave] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  const handleApply = () => {
    console.log('Filter applied:', { dateRange, zone, category, subCategory, mustHave, createdBy });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 py-4">
          <div>
            <Label htmlFor="dateRange" className="text-sm font-medium">
              Date Range<span className="text-red-500">*</span>
            </Label>
            <Input
              id="dateRange"
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              placeholder="Select Date Range"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="zone" className="text-sm font-medium">
              Zone<span className="text-red-500">*</span>
            </Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="ncr">NCR</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category<span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landscape">Landscape</SelectItem>
                <SelectItem value="facade">Façade</SelectItem>
                <SelectItem value="security">Security & surveillance</SelectItem>
                <SelectItem value="inside-units">Inside Units</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subCategory" className="text-sm font-medium">
              Sub-category<span className="text-red-500">*</span>
            </Label>
            <Select value={subCategory} onValueChange={setSubCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Sub Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="access-control">Access Control</SelectItem>
                <SelectItem value="cctv">CCTV</SelectItem>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="entry-exit">Entry-Exit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mustHave" className="text-sm font-medium">
              Must have<span className="text-red-500">*</span>
            </Label>
            <Select value={mustHave} onValueChange={setMustHave}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="createdBy" className="text-sm font-medium">
              Created by<span className="text-red-500">*</span>
            </Label>
            <Select value={createdBy} onValueChange={setCreatedBy}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sony-bhosle">Sony Bhosle</SelectItem>
                <SelectItem value="robert-day">Robert Day2</SelectItem>
                <SelectItem value="sanket-patil">Sanket Patil</SelectItem>
                <SelectItem value="devesh-jain">Devesh Jain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            onClick={handleApply}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
