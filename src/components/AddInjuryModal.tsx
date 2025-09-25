
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface AddInjuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

interface InjuryData {
  id: string;
  injuryType: string;
  whoGotInjured: string;
  name: string;
  mobile: string;
  companyName: string;
}

interface InjuredType {
  id: number;
  name: string;
}

export const AddInjuryModal: React.FC<AddInjuryModalProps> = ({
  isOpen,
  onClose,
  incidentId
}) => {
  const [injuries, setInjuries] = useState<InjuryData[]>([{
    id: '1',
    injuryType: '',
    whoGotInjured: '',
    name: '',
    mobile: '',
    companyName: ''
  }]);
  const [whoGotInjured, setWhoGotInjured] = useState<InjuredType[]>([]);
  const [loading, setLoading] = useState(false);

  // Get baseUrl and token from localStorage
  const getApiConfig = () => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    return { baseUrl, token };
  };

  // Fetch InjuredType data from API
  const fetchWhoGotInjured = async () => {
    try {
      setLoading(true);
      const { baseUrl, token } = getApiConfig();

      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const injuredTypes = result.data
          .filter((item: any) => item.tag_type === 'InjuredType')
          .map(({ id, name }: { id: number; name: string }) => ({ id, name }));
        setWhoGotInjured(injuredTypes);
      } else {
        console.error('Failed to fetch injured types');
      }
    } catch (error) {
      console.error('Error fetching injured types:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchWhoGotInjured();
    }
  }, [isOpen]);

  const handleInputChange = (injuryId: string, field: string, value: string) => {
    // Handle mobile field validation
    if (field === 'mobile') {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setInjuries(prev => prev.map(injury =>
        injury.id === injuryId
          ? { ...injury, [field]: numericValue }
          : injury
      ));
    } else {
      setInjuries(prev => prev.map(injury =>
        injury.id === injuryId
          ? { ...injury, [field]: value }
          : injury
      ));
    }
  };

  const handleAddInjury = async () => {
    // Validate all injuries
    for (const injury of injuries) {
      if (!injury.injuryType) {
        toast.error('Please select an injury type for all entries');
        return;
      }
      if (!injury.whoGotInjured) {
        toast.error('Please select who got injured for all entries');
        return;
      }
      if (!injury.name.trim()) {
        toast.error('Please enter the name for all entries');
        return;
      }
      // Validate mobile number if provided
      if (injury.mobile && injury.mobile.length !== 10) {
        toast.error('Mobile number must be exactly 10 digits');
        return;
      }
    }

    try {
      setLoading(true);
      const { baseUrl, token } = getApiConfig();

      const payload = {
        incident_id: parseInt(incidentId),
        injuries: injuries.map(injury => ({
          injury_type: injury.injuryType,
          who_got_injured_id: injury.whoGotInjured,
          name: injury.name,
          mobile: injury.mobile,
          company_name: injury.companyName
        }))
      };

      const response = await fetch(`${baseUrl}/pms/incidents/add_injury.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Injuries added successfully:', result);
        toast.success('Injuries added successfully');
        // Reset form
        setInjuries([{
          id: '1',
          injuryType: '',
          whoGotInjured: '',
          name: '',
          mobile: '',
          companyName: ''
        }]);
        onClose();
      } else {
        console.error('Failed to add injuries');
        toast.error('Failed to add injuries. Please try again.');
      }
    } catch (error) {
      console.error('Error adding injuries:', error);
      toast.error('Error occurred while adding injuries. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    const newId = (injuries.length + 1).toString();
    setInjuries(prev => [...prev, {
      id: newId,
      injuryType: '',
      whoGotInjured: '',
      name: '',
      mobile: '',
      companyName: ''
    }]);
  };

  const handleDeleteInjury = (injuryId: string) => {
    if (injuries.length > 1) {
      setInjuries(prev => prev.filter(injury => injury.id !== injuryId));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Add Injury</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-auto p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {injuries.map((injury, index) => (
            <div key={injury.id} className="space-y-4 p-4 border rounded-lg">
              {index > 0 && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => handleDeleteInjury(injury.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>Injury Type</Label>
                <Select
                  value={injury.injuryType}
                  onValueChange={(value) => handleInputChange(injury.id, 'injuryType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Head">Head</SelectItem>
                    <SelectItem value="Neck">Neck</SelectItem>
                    <SelectItem value="Nose">Nose</SelectItem>
                    <SelectItem value="Tongue">Tongue</SelectItem>
                    <SelectItem value="Arms">Arms</SelectItem>
                    <SelectItem value="Legs">Legs</SelectItem>
                    <SelectItem value="Eyes">Eyes</SelectItem>
                    <SelectItem value="Ears">Ears</SelectItem>
                    <SelectItem value="Skin">Skin</SelectItem>
                    <SelectItem value="Mouth">Mouth</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Who got injured</Label>
                <Select
                  value={injury.whoGotInjured}
                  onValueChange={(value) => handleInputChange(injury.id, 'whoGotInjured', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loading ? "Loading..." : "Select"} />
                  </SelectTrigger>
                  <SelectContent>
                    {whoGotInjured.map((injured) => (
                      <SelectItem key={injured.id} value={injured.id.toString()}>
                        {injured.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={injury.name}
                    onChange={(e) => handleInputChange(injury.id, 'name', e.target.value)}
                    placeholder=""
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mobile</Label>
                  <Input
                    type="tel"
                    value={injury.mobile}
                    onChange={(e) => handleInputChange(injury.id, 'mobile', e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={injury.companyName}
                    onChange={(e) => handleInputChange(injury.id, 'companyName', e.target.value)}
                    placeholder=""
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handleAddMore}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90"
            >
              Add More
            </Button>

            <Button
              onClick={handleAddInjury}
              disabled={loading}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
