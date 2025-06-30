
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const EditAMCPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Mock data - in real app this would come from API
  const [formData, setFormData] = useState({
    assetName: 'adani-electric-meter',
    vendor: 'tbs-electrical',
    startDate: '2025-04-01',
    endDate: '2025-05-10',
    cost: '12',
    paymentTerms: 'half-yearly',
    firstService: '2025-04-09',
    remarks: '232e'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated AMC Data:', formData);
    // Handle form submission
    navigate(`/maintenance/amc/details/${id}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/maintenance/amc/details/${id}`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC Details
        </Button>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">EDIT AMC - {id}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030]">AMC Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Asset Name *</label>
                <Select value={formData.assetName} onValueChange={(value) => handleInputChange('assetName', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Asset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adani-electric-meter">Adani Electric Meter</SelectItem>
                    <SelectItem value="laptop-dell">Laptop Dell Vostro</SelectItem>
                    <SelectItem value="samsung">Samsung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Vendor *</label>
                <Select value={formData.vendor} onValueChange={(value) => handleInputChange('vendor', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tbs-electrical">TBS ELECTRICAL</SelectItem>
                    <SelectItem value="modwin-networks">MODWIN NETWORKS PVT.LTD</SelectItem>
                    <SelectItem value="reliance-digital">Reliance Digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <Input 
                  type="date" 
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date *</label>
                <Input 
                  type="date" 
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Cost</label>
                <Input 
                  type="number" 
                  placeholder="Enter cost"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Payment Terms</label>
                <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange('paymentTerms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Payment Terms" />
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
                <label className="block text-sm font-medium mb-2">First Service Date</label>
                <Input 
                  type="date" 
                  value={formData.firstService}
                  onChange={(e) => handleInputChange('firstService', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Remarks</label>
              <Textarea 
                placeholder="Enter remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg text-[#C72030]">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Click to upload files or drag and drop</p>
              <p className="text-gray-400 text-sm">PNG, JPG, PDF up to 10MB</p>
              <input type="file" multiple className="hidden" id="file-upload-edit" />
              <Button 
                type="button" 
                variant="outline" 
                className="mt-4"
                onClick={() => document.getElementById('file-upload-edit')?.click()}
              >
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(`/maintenance/amc/details/${id}`)}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            style={{ backgroundColor: '#C72030' }}
            className="text-white hover:bg-[#C72030]/90"
          >
            Update AMC
          </Button>
        </div>
      </form>
    </div>
  );
};
