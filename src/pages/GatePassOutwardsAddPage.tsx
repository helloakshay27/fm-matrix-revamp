import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextField } from '@mui/material';
import { ArrowLeft, Upload } from 'lucide-react';

export const GatePassOutwardsAddPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'RETURNABLE' | 'NON RETURNABLE'>('RETURNABLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    navigate('/security/gate-pass/outwards');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/security/gate-pass/outwards')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Outward List
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Goods Outwards</span>
          <span>&gt;</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('RETURNABLE')}
            className={`px-4 py-2 border text-sm font-medium ${
              activeTab === 'RETURNABLE'
                ? 'bg-[#C72030] text-white border-[#C72030]'
                : 'bg-white text-[#C72030] border-[#C72030]'
            }`}
          >
            RETURNABLE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('NON RETURNABLE')}
            className={`px-4 py-2 border text-sm font-medium ${
              activeTab === 'NON RETURNABLE'
                ? 'bg-[#C72030] text-white border-[#C72030]'
                : 'bg-white text-[#C72030] border-[#C72030]'
            }`}
          >
            NON RETURNABLE
          </button>
        </div>

        {/* Goods Detail Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#C72030] mb-4">GOODS DETAIL</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {activeTab === 'RETURNABLE' && (
              <div>
                <TextField
                  label="Expected Returnable Date*"
                  type="date"
                  variant="outlined"
                  fullWidth
                  size="medium"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      height: '44px'
                    }
                  }}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Type*
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Item Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Category*
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="machinery">Machinery</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <TextField
                label="Item Name*"
                placeholder="Fill Item Name"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <TextField
                label="Item Quantity*"
                placeholder="01"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
            
            <div>
              <TextField
                label="Unit*"
                placeholder="01"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
            
            <div>
              <TextField
                label="Description*"
                placeholder="Type Here"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
            
            <div>
              <TextField
                label="Attachments*"
                type="file"
                variant="outlined"
                fullWidth
                size="medium"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
              <Button 
                type="button"
                className="mt-2 bg-[#C72030] hover:bg-[#C72030]/90 text-white text-sm px-4 py-2"
              >
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Visitor Detail Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#C72030] mb-4">VISITOR DETAIL</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visitor Name*
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Enter Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="jane">Jane Smith</SelectItem>
                  <SelectItem value="mike">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <TextField
                label="Mobile No.*"
                placeholder="+91-"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
            
            <div>
              <TextField
                label="Company Name*"
                placeholder="Located"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
            
            <div>
              <TextField
                label="Vehicle No.*"
                placeholder="MH04L1109"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Mode Of Transport*
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Type here" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="by-hand">By Hand</SelectItem>
                  <SelectItem value="by-vehicle">By Vehicle</SelectItem>
                  <SelectItem value="by-courier">By Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <TextField
                label="Reporting Time*"
                placeholder="12:24 Pm"
                variant="outlined"
                fullWidth
                size="medium"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    height: '44px'
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button 
            type="submit"
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-12 py-3"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};