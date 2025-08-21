import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { Button } from '../components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { ChevronLeft, Calendar, Trash2, Settings } from 'lucide-react';
import { TextField, Card, CardContent } from '@mui/material';
export const EditCrmCustomerPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const {
    setCurrentSection
  } = useLayout();

  // Form state
  const [formData, setFormData] = useState({
    customerName: 'HSBC',
    email: 'hsbc@gmail.com',
    mobile: '1234561231',
    colorCode: '#FFCC00',
    ssid: ''
  });
  const [leases, setLeases] = useState([{
    id: 1,
    leaseStartDate: '2024-07-01',
    leaseEndDate: '2024-09-29',
    freeParking: '10',
    paidParking: '20'
  }]);
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
    setLeases(prev => prev.map(lease => lease.id === leaseId ? {
      ...lease,
      [field]: value
    } : lease));
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
    console.log('Saving customer data:', {
      formData,
      leases
    });
    // Add save logic here
    navigate(`/crm/customers/${id}`);
  };
  const handleBack = () => {
    navigate(`/crm/customers/${id}`);
  };
  return <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Customer</span>
          <span>&gt;</span>
          <span>Customer</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 hover:bg-gray-100">
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
      <Card sx={{
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
        <CardContent sx={{
        p: 4
      }}>
          {/* Basic Details Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-500">BASIC DETAILS</h3>
            </div>

            {/* Customer Information Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <TextField label="Customer Name*" variant="outlined" fullWidth size="small" value={formData.customerName} onChange={e => handleInputChange('customerName', e.target.value)} sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }} />
              </div>
              <div>
                <TextField label="Email" variant="outlined" fullWidth size="small" type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }} />
              </div>
              <div>
                <TextField label="Mobile" variant="outlined" fullWidth size="small" value={formData.mobile} onChange={e => handleInputChange('mobile', e.target.value)} sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }} />
              </div>
              <div>
                <div className="space-y-2">
                  
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div 
                          className="w-10 h-10 rounded border border-gray-300 cursor-pointer flex-shrink-0 hover:border-gray-400 transition-colors" 
                          style={{ backgroundColor: formData.colorCode }}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3" align="start">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Color Code</label>
                          <input
                            type="color"
                            value={formData.colorCode}
                            onChange={(e) => handleInputChange('colorCode', e.target.value)}
                            className="w-full h-10 rounded border border-gray-300 cursor-pointer"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <TextField 
                      variant="outlined" 
                      size="small" 
                      value={formData.colorCode} 
                      onChange={(e) => handleInputChange('colorCode', e.target.value)} 
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          height: '40px'
                        }
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SSID Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <TextField label="SSID" variant="outlined" fullWidth size="small" placeholder="Enter SS" value={formData.ssid} onChange={e => handleInputChange('ssid', e.target.value)} sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }} />
              </div>
            </div>
          </div>

          {/* Lease Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-blue-500">LEASE INFORMATION</h3>
            </div>

            {leases.map((lease, index) => <Card key={lease.id} sx={{
            mb: 3,
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
                <CardContent sx={{
              p: 3
            }}>
                  {index > 0 && <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-medium text-gray-700">Lease {index + 1}</h4>
                    </div>}
                  
                  {/* Lease Dates and Free Parking Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <TextField label="Lease Start Date*" variant="outlined" fullWidth size="small" type="date" value={lease.leaseStartDate} onChange={e => handleLeaseChange(lease.id, 'leaseStartDate', e.target.value)} InputLabelProps={{
                    shrink: true
                  }} sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }} />
                    </div>
                    <div>
                      <TextField label="Lease End Date" variant="outlined" fullWidth size="small" type="date" value={lease.leaseEndDate} onChange={e => handleLeaseChange(lease.id, 'leaseEndDate', e.target.value)} InputLabelProps={{
                    shrink: true
                  }} sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }} />
                    </div>
                    <div>
                      <TextField label="Free Parking*" variant="outlined" fullWidth size="small" type="number" value={lease.freeParking} onChange={e => handleLeaseChange(lease.id, 'freeParking', e.target.value)} sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }} />
                    </div>
                  </div>

                  {/* Paid Parking Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-end gap-2">
                        <TextField label="Paid Parking" variant="outlined" fullWidth size="small" type="number" value={lease.paidParking} onChange={e => handleLeaseChange(lease.id, 'paidParking', e.target.value)} sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }} />
                        <Button variant="destructive" size="sm" className="p-2 h-10" onClick={() => removeLease(lease.id)} disabled={leases.length === 1}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}

            {/* Add Lease Button */}
            <div className="mt-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg" onClick={addNewLease}>
                Add Lease
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};