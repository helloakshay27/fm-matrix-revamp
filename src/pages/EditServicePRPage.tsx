
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';

export const EditServicePRPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [totalAmount, setTotalAmount] = useState(700);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sample data based on the ID - in real app this would come from API
  const [formData, setFormData] = useState({
    contractor: "Harells Corp PAN 1234...",
    plantDetail: "Select Plant Id",
    loiDate: "20/06/2025",
    billingAddress: "Raven Infoline LLP",
    retention: "10.0",
    tds: "10.0",
    qc: "10.0",
    paymentTenure: "7",
    advanceAmount: "Advance Amount",
    relatedTo: "Related To",
    services: [
      {
        service: "Select Service",
        productDescription: "P034",
        quantityArea: "70.0",
        uom: "UOM",
        expectedDate: "Select Expected Date",
        rate: "10.0",
        amount: "700.0",
        totalAmount: "Total Amount"
      }
    ],
    kindAttention: "",
    subject: "",
    description: "",
    termsConditions: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceChange = (index: number, field: string, value: string) => {
    const updatedServices = [...formData.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const addNewService = () => {
    const newService = {
      service: "Select Service",
      productDescription: "Product Description",
      quantityArea: "Quantity",
      uom: "UOM",
      expectedDate: "Select Expected Date",
      rate: "Rate",
      amount: "Amount",
      totalAmount: "Total Amount"
    };
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const removeService = (index: number) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    console.log('Service PR updated:', formData);
    navigate('/finance/service-pr');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/finance/service-pr')}
          className="mb-2 p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Service PR</h1>
        </div>
      </div>

      {/* Work Order Details Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-[#C72030]">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">1</span>
            WORK ORDER DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select Contractor*</Label>
                <Select value={formData.contractor} onValueChange={(value) => handleInputChange('contractor', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Harells Corp PAN 1234...">Harells Corp PAN 1234...</SelectItem>
                    <SelectItem value="contractor2">Contractor 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Select Billing Address*</Label>
                <Select value={formData.billingAddress} onValueChange={(value) => handleInputChange('billingAddress', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Raven Infoline LLP">Raven Infoline LLP</SelectItem>
                    <SelectItem value="address2">Address 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">QC(%)</Label>
                <Input
                  value={formData.qc}
                  onChange={(e) => handleInputChange('qc', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Related To*</Label>
                <Textarea
                  value={formData.relatedTo}
                  onChange={(e) => handleInputChange('relatedTo', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Plant Detail*</Label>
                <Select value={formData.plantDetail} onValueChange={(value) => handleInputChange('plantDetail', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Select Plant Id">Select Plant Id</SelectItem>
                    <SelectItem value="plant1">Plant 1</SelectItem>
                    <SelectItem value="plant2">Plant 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Retention(%)</Label>
                <Input
                  value={formData.retention}
                  onChange={(e) => handleInputChange('retention', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Payment Tenure(In Days)</Label>
                <Input
                  value={formData.paymentTenure}
                  onChange={(e) => handleInputChange('paymentTenure', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Select LOI Date*</Label>
                <Input
                  value={formData.loiDate}
                  onChange={(e) => handleInputChange('loiDate', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">TDS(%)</Label>
                <Input
                  value={formData.tds}
                  onChange={(e) => handleInputChange('tds', e.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Advance Amount</Label>
                <Input
                  value={formData.advanceAmount}
                  onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Details Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-[#C72030]">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">2</span>
            DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.services.map((service, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Select Service*</Label>
                    <Select value={service.service} onValueChange={(value) => handleServiceChange(index, 'service', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Select Service">Select Service</SelectItem>
                        <SelectItem value="service1">Service 1</SelectItem>
                        <SelectItem value="service2">Service 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">UOM</Label>
                    <Input
                      value={service.uom}
                      onChange={(e) => handleServiceChange(index, 'uom', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Amount</Label>
                    <Input
                      value={service.amount}
                      onChange={(e) => handleServiceChange(index, 'amount', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Product Description*</Label>
                    <Input
                      value={service.productDescription}
                      onChange={(e) => handleServiceChange(index, 'productDescription', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Expected Date*</Label>
                    <Input
                      value={service.expectedDate}
                      onChange={(e) => handleServiceChange(index, 'expectedDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <Input
                      value={service.totalAmount}
                      onChange={(e) => handleServiceChange(index, 'totalAmount', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Quantity/Area*</Label>
                    <Input
                      value={service.quantityArea}
                      onChange={(e) => handleServiceChange(index, 'quantityArea', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Rate*</Label>
                    <Input
                      value={service.rate}
                      onChange={(e) => handleServiceChange(index, 'rate', e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => removeService(index)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={addNewService}
            className="bg-[#C72030] hover:bg-[#A01020] text-white mb-4"
          >
            Add Items
          </Button>

          <div className="flex justify-end">
            <div className="bg-[#C72030] text-white px-4 py-2 rounded">
              Total Amount: {totalAmount}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-[#C72030]">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">3</span>
            DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">Kind Attention</Label>
              <Input
                value={formData.kindAttention}
                onChange={(e) => handleInputChange('kindAttention', e.target.value)}
                placeholder="Kind Attention"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">Subject</Label>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Subject"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <div className="border rounded-md p-3 min-h-[120px] bg-gray-50">
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">A</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 font-bold">B</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 italic">I</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 underline">U</Button>
                  <Select>
                    <SelectTrigger className="h-6 w-20">
                      <SelectValue placeholder="system-ui" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-ui">system-ui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter description here..."
                  className="border-0 bg-transparent resize-none min-h-[80px]"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Terms & Conditions</Label>
              <div className="border rounded-md p-3 min-h-[120px] bg-gray-50">
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">A</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 font-bold">B</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 italic">I</Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 underline">U</Button>
                  <Select>
                    <SelectTrigger className="h-6 w-20">
                      <SelectValue placeholder="system-ui" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system-ui">system-ui</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={formData.termsConditions}
                  onChange={(e) => handleInputChange('termsConditions', e.target.value)}
                  placeholder="Enter terms and conditions here..."
                  className="border-0 bg-transparent resize-none min-h-[80px]"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-[#C72030]">
            <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">4</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
            <p className="text-gray-500 mb-2">Drag & Drop or</p>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="service-pr-file-upload"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="service-pr-file-upload"
              className="text-[#C72030] hover:text-[#A01020] cursor-pointer"
            >
              Choose Files
            </label>
            <p className="text-gray-400 text-sm mt-2">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          className="bg-[#C72030] hover:bg-[#A01020] text-white px-8"
        >
          Submit
        </Button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-gray-600">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
