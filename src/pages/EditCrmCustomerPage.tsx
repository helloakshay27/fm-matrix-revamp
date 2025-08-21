import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { Button } from '../components/ui/button';
import { ChevronLeft, Calendar, Trash2, Settings } from 'lucide-react';
import { TextField } from '@mui/material';

export const EditCrmCustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();

  // Form state
  const [formData, setFormData] = useState({
    customerName: 'HSBC',
    email: 'hsbc@gmail.com',
    mobile: '1234561231',
    colorCode: '#FFCC00',
    ssid: ''
  });

  const [leases, setLeases] = useState([
    {
      id: 1,
      leaseStartDate: '2024-07-01',
      leaseEndDate: '2024-09-29',
      freeParking: '10',
      paidParking: '20'
    }
  ]);

  useEffect(() => {
    setCurrentSection('CRM');
  }, [setCurrentSection]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeaseChange = (leaseId: number, field: string, value: string) => {
    setLeases(prev => prev.map(lease => 
      lease.id === leaseId 
        ? { ...lease, [field]: value }
        : lease
    ));
  };

  const addNewLease = () => {
    const newLease = {
      id: Date.now(),
      leaseStartDate: '',
      leaseEndDate: '',
      freeParking: '',
      paidParking: ''
    };
    setLeases(prev => [...prev, newLease]);
  };

  const removeLease = (leaseId: number) => {
    if (leases.length > 1) {
      setLeases(prev => prev.filter(lease => lease.id !== leaseId));
    }
  };

  const handleSave = () => {
    console.log('Saving customer data:', { formData, leases });
    // Add save logic here
    navigate(`/crm/customers/${id}`);
  };

  const handleBack = () => {
    navigate(`/crm/customers/${id}`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Customer</span>
          <span>&gt;</span>
          <span>Customer</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="p-2 hover:bg-gray-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Editing Customer</h1>
              <h2 className="text-lg font-medium text-gray-700">Customer</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg p-6">
        {/* Basic Details Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-orange-500">BASIC DETAILS</h3>
          </div>

          {/* First Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <TextField
                label="Customer Name*"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
              />
            </div>
            <div>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                size="small"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
              />
            </div>
            <div>
              <TextField
                label="Mobile"
                variant="outlined"
                fullWidth
                size="small"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Code :</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                  style={{ backgroundColor: formData.colorCode }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = formData.colorCode;
                    input.onchange = (e) => handleInputChange('colorCode', (e.target as HTMLInputElement).value);
                    input.click();
                  }}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  value={formData.colorCode}
                  onChange={(e) => handleInputChange('colorCode', e.target.value)}
                  sx={{ 
                    flex: 1,
                    '& .MuiOutlinedInput-root': { borderRadius: '6px' }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <div>
              <TextField
                label="SSID"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Enter SS"
                value={formData.ssid}
                onChange={(e) => handleInputChange('ssid', e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
              />
            </div>
          </div>

          {/* Lease Details Section */}
          {leases.map((lease, index) => (
            <div key={lease.id} className="mb-6">
              {index > 0 && <hr className="mb-6 border-gray-200" />}
              <div className="grid grid-cols-4 gap-6 mb-6">
                <div>
                  <TextField
                    label="Lease Start Date*"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="date"
                    value={lease.leaseStartDate}
                    onChange={(e) => handleLeaseChange(lease.id, 'leaseStartDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                  />
                </div>
                <div>
                  <TextField
                    label="Lease End Date"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="date"
                    value={lease.leaseEndDate}
                    onChange={(e) => handleLeaseChange(lease.id, 'leaseEndDate', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                  />
                </div>
                <div>
                  <TextField
                    label="Free Parking*"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="number"
                    value={lease.freeParking}
                    onChange={(e) => handleLeaseChange(lease.id, 'freeParking', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '6px' } }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paid Parking</label>
                  <div className="flex items-center gap-2">
                    <TextField
                      variant="outlined"
                      size="small"
                      type="number"
                      value={lease.paidParking}
                      onChange={(e) => handleLeaseChange(lease.id, 'paidParking', e.target.value)}
                      sx={{ 
                        flex: 1,
                        '& .MuiOutlinedInput-root': { borderRadius: '6px' }
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="p-2"
                      onClick={() => removeLease(lease.id)}
                      disabled={leases.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Lease Button */}
          <div className="mb-8">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
              onClick={addNewLease}
            >
              Add Lease
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};