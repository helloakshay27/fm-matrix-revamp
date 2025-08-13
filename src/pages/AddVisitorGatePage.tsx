import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { useLayout } from '../contexts/LayoutContext';

export const AddVisitorGatePage = () => {
  const navigate = useNavigate();
  const { setCurrentSection } = useLayout();
  const [formData, setFormData] = useState({
    site: '',
    user: '',
    tower: '',
    gateName: '',
    gateDevice: ''
  });

  useEffect(() => {
    setCurrentSection('Settings');
  }, [setCurrentSection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.site || !formData.user || !formData.tower || !formData.gateName || !formData.gateDevice) {
      toast.error('Please fill in all fields');
      return;
    }

    // Here you would typically submit to API
    toast.success('Visitor gate added successfully');
    navigate('/security/visitor-management/setup');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        <Button
          onClick={() => navigate('/security/visitor-management/setup')}
          variant="ghost"
          className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to List
        </Button>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Select value={formData.site} onValueChange={(value) => setFormData({...formData, site: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="site1">Site 1</SelectItem>
                <SelectItem value="site2">Site 2</SelectItem>
                <SelectItem value="site3">Site 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select value={formData.user} onValueChange={(value) => setFormData({...formData, user: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">User 1</SelectItem>
                <SelectItem value="user2">User 2</SelectItem>
                <SelectItem value="user3">User 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tower">Tower</Label>
            <Select value={formData.tower} onValueChange={(value) => setFormData({...formData, tower: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Tower" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tower1">Tower 1</SelectItem>
                <SelectItem value="tower2">Tower 2</SelectItem>
                <SelectItem value="tower3">Tower 3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gateName">Gate Name</Label>
            <Input
              id="gateName"
              value={formData.gateName}
              onChange={(e) => setFormData({...formData, gateName: e.target.value})}
              placeholder="Enter gate name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gateDevice">Gate Device</Label>
            <Input
              id="gateDevice"
              value={formData.gateDevice}
              onChange={(e) => setFormData({...formData, gateDevice: e.target.value})}
              placeholder="Enter gate device"
            />
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};