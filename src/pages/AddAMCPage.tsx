
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const AddAMCPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    details: 'Asset',
    type: 'Individual',
    assetName: '',
    vendor: '',
    startDate: '',
    endDate: '',
    cost: '',
    paymentTerms: '',
    firstService: '',
    noOfVisits: '',
    remarks: ''
  });
  const [attachments, setAttachments] = useState({
    contracts: [] as File[],
    invoices: [] as File[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: 'contracts' | 'invoices', files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setAttachments(prev => ({
        ...prev,
        [type]: [...prev[type], ...fileArray]
      }));
    }
  };

  const removeFile = (type: 'contracts' | 'invoices', index: number) => {
    setAttachments(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AMC Data:', formData);
    console.log('Attachments:', attachments);
    
    toast({
      title: "AMC Created",
      description: "AMC has been successfully created.",
    });
    
    navigate('/maintenance/amc');
  };

  const handleSaveAndSchedule = () => {
    console.log('Save & Schedule AMC:', formData);
    console.log('Attachments:', attachments);
    
    toast({
      title: "AMC Saved & Scheduled",
      description: "AMC has been saved and scheduled successfully.",
    });
    
    navigate('/maintenance/amc');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/amc')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">NEW AMC</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* AMC Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
              AMC CONFIGURATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Details</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="details"
                    value="Asset"
                    checked={formData.details === 'Asset'}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    className="mr-2"
                  />
                  Asset
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="details"
                    value="Service"
                    checked={formData.details === 'Service'}
                    onChange={(e) => handleInputChange('details', e.target.value)}
                    className="mr-2"
                  />
                  Service
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Individual"
                    checked={formData.type === 'Individual'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mr-2"
                  />
                  Individual
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Group"
                    checked={formData.type === 'Group'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mr-2"
                  />
                  Group
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Assets*</label>
              <Select onValueChange={(value) => handleInputChange('assetName', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an Option..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adani-electric-meter">Adani Electric Meter</SelectItem>
                  <SelectItem value="laptop-dell">Laptop Dell Vostro</SelectItem>
                  <SelectItem value="samsung">Samsung</SelectItem>
                  <SelectItem value="vinayak-testing-1">Vinayak Testing 1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Supplier</label>
              <Select onValueChange={(value) => handleInputChange('vendor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tbs-electrical">TBS ELECTRICAL</SelectItem>
                  <SelectItem value="modwin-networks">MODWIN NETWORKS PVT.LTD</SelectItem>
                  <SelectItem value="reliance-digital">Reliance Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* AMC Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">2</span>
              AMC DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cost</label>
                <Input 
                  type="number" 
                  placeholder="Enter Cost"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date*</label>
                <Input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">First Service Date*</label>
                <Input 
                  type="date" 
                  value={formData.firstService}
                  onChange={(e) => handleInputChange('firstService', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Terms</label>
                <Select onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="half-yearly">Half Yearly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date*</label>
                <Input 
                  type="date" 
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">No. of Visits</label>
                <Input 
                  type="number" 
                  placeholder="Enter No. of Visit"
                  value={formData.noOfVisits}
                  onChange={(e) => handleInputChange('noOfVisits', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <Textarea 
                placeholder="Enter Remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030] flex items-center">
              <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">3</span>
              ATTACHMENTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* AMC Contracts */}
              <div>
                <label className="block text-sm font-medium mb-2">AMC Contracts</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="contracts-upload"
                    onChange={(e) => handleFileUpload('contracts', e.target.files)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('contracts-upload')?.click()}
                    className="w-full"
                  >
                    Choose File
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">No file chosen</p>
                </div>
                {attachments.contracts.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.contracts.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('contracts', index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AMC Invoice */}
              <div>
                <label className="block text-sm font-medium mb-2">AMC Invoice</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    id="invoices-upload"
                    onChange={(e) => handleFileUpload('invoices', e.target.files)}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('invoices-upload')?.click()}
                    className="w-full"
                  >
                    Choose File
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">No file chosen</p>
                </div>
                {attachments.invoices.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachments.invoices.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                        <span>{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile('invoices', index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="button" 
            onClick={handleSaveAndSchedule}
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Save & Show Details
          </Button>
          <Button 
            type="submit" 
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Save & Schedule AMC
          </Button>
        </div>
      </form>
    </div>
  );
};
