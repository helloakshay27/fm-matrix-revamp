import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

interface VisitorGateData {
  id: number;
  society: string;
  tower: string;
  gateName: string;
  gateDevice: string;
  userName: string;
  status: boolean;
  active: boolean;
  createdBy: string;
}

export const EditVisitorGatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    site: '',
    user: '',
    tower: '',
    gateName: '',
    gateDevice: '',
    status: true,
    active: true
  });

  // Sample data - in real app, this would come from API
  const sampleData: VisitorGateData[] = [
    {
      id: 1256,
      society: 'Zycus Infotech - Zycus Infotech Pvt Ltd',
      tower: 'GJ 07',
      gateName: 'Main Gate',
      gateDevice: '65e4bb21a04c149',
      userName: 'Security Tab 1',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    },
    {
      id: 1220,
      society: 'Arvog - Arvog Finance',
      tower: 'Trade World',
      gateName: 'Reception',
      gateDevice: '31fc5f03222bf7c5',
      userName: 'Security Tab',
      status: true,
      active: true,
      createdBy: 'Mahendra Lungare'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    const loadData = () => {
      const item = sampleData.find(item => item.id === parseInt(id || '0'));
      if (item) {
        setFormData({
          site: item.society,
          user: item.userName,
          tower: item.tower,
          gateName: item.gateName,
          gateDevice: item.gateDevice,
          status: item.status,
          active: item.active
        });
      }
      setLoading(false);
    };

    setTimeout(loadData, 500); // Simulate API delay
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.site || !formData.user || !formData.tower || !formData.gateName || !formData.gateDevice) {
      toast.error('Please fill in all fields');
      return;
    }

    // Here you would typically submit to API
    toast.success('Visitor gate updated successfully');
    navigate('/security/visitor-management/setup');
  };

  const handleBack = () => {
    navigate('/security/visitor-management/setup');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold">Edit Visitor Gate</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="site">Site</Label>
            <Select value={formData.site} onValueChange={(value) => setFormData({...formData, site: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select Site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Zycus Infotech - Zycus Infotech Pvt Ltd">Zycus Infotech - Zycus Infotech Pvt Ltd</SelectItem>
                <SelectItem value="Arvog - Arvog Finance">Arvog - Arvog Finance</SelectItem>
                <SelectItem value="Lockated - Lockated HO">Lockated - Lockated HO</SelectItem>
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
                <SelectItem value="Security Tab 1">Security Tab 1</SelectItem>
                <SelectItem value="Security Tab">Security Tab</SelectItem>
                <SelectItem value="Tech Secure">Tech Secure</SelectItem>
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
                <SelectItem value="GJ 07">GJ 07</SelectItem>
                <SelectItem value="Trade World">Trade World</SelectItem>
                <SelectItem value="Jyoti Tower">Jyoti Tower</SelectItem>
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="status">Status</Label>
              <Switch
                id="status"
                checked={formData.status}
                onCheckedChange={(checked) => setFormData({...formData, status: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({...formData, active: checked})}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};