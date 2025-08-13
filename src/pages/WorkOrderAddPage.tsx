import React, { useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ResponsiveDatePicker } from '@/components/ui/responsive-date-picker';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const WorkOrderAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractor: '',
    plantDetail: '',
    woDate: new Date(),
    billingAddress: '',
    retention: '',
    tds: '',
    qc: '',
    paymentTenure: '',
    advanceAmount: '',
    relatedTo: ''
  });

  const handleInputChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Work Order Data:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">WORK ORDER DETAILS</h1>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* First Row */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Select Contractor<span className="text-red-500">*</span>
            </Label>
            <Select value={formData.contractor} onValueChange={(value) => handleInputChange('contractor', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Contractor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modwin-mumbai">MODWIN NETWORKS PVT.LTD --Mumbai</SelectItem>
                <SelectItem value="contractor-2">ABC CONTRACTORS --Delhi</SelectItem>
                <SelectItem value="contractor-3">XYZ SERVICES --Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Plant Detail<span className="text-red-500">*</span>
            </Label>
            <Select value={formData.plantDetail} onValueChange={(value) => handleInputChange('plantDetail', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Plant Id" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plant-1">Plant A - Mumbai</SelectItem>
                <SelectItem value="plant-2">Plant B - Delhi</SelectItem>
                <SelectItem value="plant-3">Plant C - Bangalore</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Select WO Date<span className="text-red-500">*</span>
            </Label>
            <ResponsiveDatePicker
              value={formData.woDate}
              onChange={(date) => handleInputChange('woDate', date)}
              placeholder="Select work order date"
              className="w-full"
            />
          </div>

          {/* Second Row */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Select Billing Address<span className="text-red-500">*</span>
            </Label>
            <Select value={formData.billingAddress} onValueChange={(value) => handleInputChange('billingAddress', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Billing Address" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demo">demo</SelectItem>
                <SelectItem value="address-1">Main Office - Mumbai</SelectItem>
                <SelectItem value="address-2">Branch Office - Delhi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Retention(%)</Label>
            <Input
              placeholder="Retention"
              value={formData.retention}
              onChange={(e) => handleInputChange('retention', e.target.value)}
              type="number"
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">TDS(%)</Label>
            <Input
              placeholder="TDS"
              value={formData.tds}
              onChange={(e) => handleInputChange('tds', e.target.value)}
              type="number"
              min="0"
              max="100"
            />
          </div>

          {/* Third Row */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">QC(%)</Label>
            <Input
              placeholder="QC"
              value={formData.qc}
              onChange={(e) => handleInputChange('qc', e.target.value)}
              type="number"
              min="0"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Payment Tenure(In Days)</Label>
            <Input
              placeholder="Payment Tenure"
              value={formData.paymentTenure}
              onChange={(e) => handleInputChange('paymentTenure', e.target.value)}
              type="number"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">Advance Amount</Label>
            <Input
              placeholder="Advance Amount"
              value={formData.advanceAmount}
              onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
              type="number"
              min="0"
            />
          </div>

          {/* Full Width Field */}
          <div className="md:col-span-3 space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Related To<span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Related To"
              value={formData.relatedTo}
              onChange={(e) => handleInputChange('relatedTo', e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            Save Work Order
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-8"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderAddPage;