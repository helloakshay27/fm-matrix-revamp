import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { AppDispatch, RootState } from '@/store/store';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { FMUserDropdown } from '@/types/escalationMatrix';
import ReactSelect from 'react-select';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

interface EscalationLevel {
  level: string;
  escalationTo: number[];
  days: string;
  hours: string;
  minutes: string;
}

interface EscalationRule {
  level: string;
  escalationTo: string;
  timing: string;
}

interface ExecutiveEscalationPayload {
  complaint_worker: {
    of_phase: string;
  };
  escalation_matrix: {
    [key: string]: {
      esc_type: string;
      name: string;
      escalate_to_users?: string[];
      p1?: string;
    };
  };
}

interface ExecutiveEscalationResponse {
  escalations: {
    id: number;
    society_id: number;
    name: string;
    after_days: number | null;
    escalate_to_users: string[];
    created_at: string;
    updated_at: string;
    complaint_status_id: number | null;
    active: number | null;
    p1: number | null;
    p2: number | null;
    p3: number | null;
    p4: number | null;
    p5: number | null;
    cw_id: number | null;
    esc_type: string;
    resource_id: number | null;
    resource_type: string | null;
    copy_to: string | null;
    escalate_to_users_details: {
      id: number;
      name: string;
      email: string;
      mobile: string;
    }[];
  }[];
}

export const ExecutiveEscalationTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [escalationData, setEscalationData] = useState<EscalationLevel[]>([
    { level: 'E0', escalationTo: [], days: '', hours: '', minutes: '' },
    { level: 'E1', escalationTo: [], days: '', hours: '', minutes: '' },
    { level: 'E2', escalationTo: [], days: '', hours: '', minutes: '' },
    { level: 'E3', escalationTo: [], days: '', hours: '', minutes: '' }
  ]);

  const [savedRules, setSavedRules] = useState<EscalationRule[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executiveRules, setExecutiveRules] = useState<ExecutiveEscalationResponse['escalations']>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Redux selectors
  const { data: fmUsersData, loading: fmUsersLoading } = useSelector((state: RootState) => state.fmUsers);

  // Process FM Users data for display
  const fmUsers: FMUserDropdown[] = fmUsersData?.fm_users?.map(user => ({
    ...user,
    displayName: `${user.firstname} ${user.lastname}`,
  })) || [];

  // Options for react-select
  const userOptions = fmUsers?.map(user => ({ value: user.id, label: user.displayName })) || [];

  // Fetch FM users on component mount
  useEffect(() => {
    dispatch(fetchFMUsers());
    fetchExecutiveRules();
  }, [dispatch]);

  const fetchExecutiveRules = async () => {
    try {
      setFetchLoading(true);
      const response = await apiClient.get('/executive_escalations.json');
      setExecutiveRules(response.data?.escalations || []);
    } catch (error: any) {
      console.error('Error fetching executive rules:', error);
      toast.error('Failed to fetch executive escalation rules');
    } finally {
      setFetchLoading(false);
    }
  };

  const parseEscalateToUsers = (escalateToUsers: string[]): number[] => {
    if (!escalateToUsers || !Array.isArray(escalateToUsers)) return [];
    return escalateToUsers.map(id => parseInt(id.toString()));
  };

  const getUserNamesFromDetails = (userDetails: { id: number; name: string; email: string; mobile: string }[]): string => {
    if (!userDetails || userDetails.length === 0) return 'No users assigned';
    return userDetails.map(user => user.name).join(', ');
  };

  const formatTiming = (minutes: number | null): string => {
    if (!minutes || minutes === 0) return '';
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;
    return `${days} Day, ${hours} Hour, ${mins} Minute`;
  };

  const handleDeleteRule = async (ruleId: number) => {
    try {
      setDeleteLoading(true);
      await apiClient.delete(`/executive_escalations/${ruleId}.json`);
      toast.success('Executive escalation rule deleted successfully!');
      await fetchExecutiveRules();
    } catch (error: any) {
      console.error('Error deleting executive rule:', error);
      toast.error(error.response?.data?.message || 'Failed to delete executive escalation rule');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Group escalations by their creation context (they should be grouped together as rules)
  const groupedRules = executiveRules.reduce((acc, escalation) => {
    const key = `${escalation.society_id}-${escalation.created_at}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(escalation);
    return acc;
  }, {} as Record<string, typeof executiveRules>);

  const ruleGroups = Object.values(groupedRules);

  const filteredRules = selectedCategoryFilter === 'all' 
    ? ruleGroups 
    : ruleGroups.filter(group => group.some(escalation => escalation.esc_type === selectedCategoryFilter));

  const handleFieldChange = (index: number, field: keyof EscalationLevel, value: string | number[]) => {
    setEscalationData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const getUserNames = (userIds: number[]): string => {
    if (!userIds || userIds.length === 0) return '';
    return userIds.map(id => {
      const user = fmUsers.find(u => u.id === id);
      return user ? user.displayName : 'Unknown User';
    }).join(', ');
  };

  const createExecutiveEscalation = async (payload: ExecutiveEscalationPayload) => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.post('/pms/admin/create_executive_worker.json', payload);
      toast.success('Executive escalation created successfully!');
      return response.data;
    } catch (error: any) {
      console.error('Error creating executive escalation:', error);
      toast.error(error.response?.data?.message || 'Failed to create executive escalation');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertMinutesToP1 = (days: string, hours: string, minutes: string): string => {
    const totalMinutes = 
      (parseInt(days) || 0) * 24 * 60 + 
      (parseInt(hours) || 0) * 60 + 
      (parseInt(minutes) || 0);
    return totalMinutes.toString();
  };

  const handleSubmit = async () => {
    try {
      // Validate that at least one level has users assigned
      const hasUsersAssigned = escalationData.some(item => item.escalationTo && item.escalationTo.length > 0);
      if (!hasUsersAssigned) {
        toast.error('Please assign users to at least one escalation level');
        return;
      }

      // Prepare the payload according to the API structure
      const escalationMatrix: { [key: string]: any } = {};

      escalationData.forEach((item) => {
        const levelKey = item.level.toLowerCase(); // e0, e1, e2, e3
        
        escalationMatrix[levelKey] = {
          esc_type: "Executive Escalation",
          name: item.level,
        };

        // Add escalate_to_users if users are assigned
        if (item.escalationTo && item.escalationTo.length > 0) {
          escalationMatrix[levelKey].escalate_to_users = item.escalationTo.map(id => id.toString());
        }

        // Add p1 timing if any time value is provided (except for E0)
        if (levelKey !== 'e0' && (item.days || item.hours || item.minutes)) {
          escalationMatrix[levelKey].p1 = convertMinutesToP1(item.days, item.hours, item.minutes);
        }
      });

      const payload: ExecutiveEscalationPayload = {
        complaint_worker: {
          of_phase: "pms"
        },
        escalation_matrix: escalationMatrix
      };

      console.log('Executive escalation payload:', payload);

      // Call the API
      await createExecutiveEscalation(payload);

      // Update the rules table with submitted data
      const rules = escalationData
        .filter(item => item.escalationTo && item.escalationTo.length > 0)
        .map(item => ({
          level: item.level,
          escalationTo: getUserNames(item.escalationTo),
          timing: `${item.days || 0} Day, ${item.hours || 0} Hour, ${item.minutes || 0} Minute`
        }));
      
      setSavedRules(rules);
      
      // Clear the form inputs after successful submission
      setEscalationData([
        { level: 'E0', escalationTo: [], days: '', hours: '', minutes: '' },
        { level: 'E1', escalationTo: [], days: '', hours: '', minutes: '' },
        { level: 'E2', escalationTo: [], days: '', hours: '', minutes: '' },
        { level: 'E3', escalationTo: [], days: '', hours: '', minutes: '' }
      ]);
      
      // Refresh the executive rules list
      await fetchExecutiveRules();
      
    } catch (error) {
      console.error('Error submitting executive escalation:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-6">
          {/* Header Row 1 */}
          <div className="grid grid-cols-6 gap-6 font-medium text-gray-700 text-sm border-b border-gray-200 pb-3">
            <div>Levels</div>
            <div className="col-span-2">Escalation To</div>
            <div className="col-span-3 text-center">P1</div>
          </div>

          {/* Header Row 2 */}
          <div className="grid grid-cols-6 gap-6 font-medium text-gray-700 text-sm">
            <div></div>
            <div className="col-span-2"></div>
            <div className="text-center">Days</div>
            <div className="text-center">Hrs</div>
            <div className="text-center">Min</div>
          </div>

          {/* Escalation Levels */}
          {escalationData.map((item, index) => (
            <div key={item.level} className="grid grid-cols-6 gap-6 items-center py-2">
              <div className="bg-gray-100 px-3 py-2 rounded border text-sm font-medium">
                {item.level}
              </div>
              
              <div className="col-span-2">
                <ReactSelect
                  isMulti
                  options={userOptions}
                  onChange={(selected) => {
                    const newUsers = selected ? selected.map(s => s.value) : [];
                    handleFieldChange(index, 'escalationTo', newUsers);
                  }}
                  value={userOptions.filter(option => item.escalationTo.includes(option.value))}
                  placeholder="Select up to 15 users..."
                  isLoading={fmUsersLoading}
                  isDisabled={fmUsersLoading}
                  className="min-w-[250px]"
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '40px',
                      fontSize: '14px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#9ca3af'
                      }
                    }),
                    multiValue: (base) => ({
                      ...base,
                      fontSize: '12px',
                      backgroundColor: '#f3f4f6'
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#374151'
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#6b7280',
                      '&:hover': {
                        backgroundColor: '#ef4444',
                        color: 'white'
                      }
                    })
                  }}
                />
              </div>

              {/* Hide timing inputs for E0 level */}
              {item.level !== 'E0' ? (
                <>
                  <Input
                    type="number"
                    value={item.days}
                    onChange={(e) => handleFieldChange(index, 'days', e.target.value)}
                    placeholder="Days"
                    className="text-center bg-white border-gray-300"
                  />

                  <Input
                    type="number"
                    value={item.hours}
                    onChange={(e) => handleFieldChange(index, 'hours', e.target.value)}
                    placeholder="Hrs"
                    className="text-center bg-white border-gray-300"
                  />

                  <Input
                    type="number"
                    value={item.minutes}
                    onChange={(e) => handleFieldChange(index, 'minutes', e.target.value)}
                    placeholder="Min"
                    className="text-center bg-white border-gray-300"
                  />
                </>
              ) : (
                <>
                  <div></div>
                  <div></div>
                  <div></div>
                </>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || fmUsersLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Rule</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-8 font-medium text-gray-700 text-sm border-b border-gray-200 pb-3">
            <div>Levels</div>
            <div>Escalation To</div>
            <div>P1</div>
          </div>

          {['E0', 'E1', 'E2', 'E3'].map((level) => {
            const rule = savedRules.find(r => r.level === level);
            return (
              <div key={level} className="grid grid-cols-3 gap-8 text-sm py-2">
                <div className="font-medium text-gray-800">{level}</div>
                <div className="text-gray-700">{rule?.escalationTo || ''}</div>
                <div className="text-gray-700">{rule?.timing || ''}</div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Executive Escalation Rules Card */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">Executive Escalation Rules</CardTitle>
            {/* <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="escalation-filter" className="text-sm font-medium text-gray-700">
                  Filter by Type
                </Label>
                <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                  <SelectTrigger className="w-48 border-gray-200 focus:border-[#C72030] focus:ring-[#C72030]">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Executive Escalation">Executive Escalation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="default"
                size="sm" 
                className="bg-[#C72030] hover:bg-[#A61B29] text-white border-none font-semibold px-4"
                onClick={() => setSelectedCategoryFilter('all')}
              >
                Apply
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4"
                onClick={() => setSelectedCategoryFilter('all')}
              >
                Reset
              </Button>
            </div> */}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {fetchLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#C72030]" />
              <span className="ml-2 text-gray-600">Loading executive escalation rules...</span>
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No executive escalation rules found.</p>
              <p className="text-sm mt-1">Create your first rule using the form above.</p>
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {filteredRules.map((ruleGroup, index) => (
                <div key={`rule-group-${index}`} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-semibold text-gray-900">Rule {index + 1}</h3>
                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
                              disabled={deleteLoading}
                            >
                              {/* <Trash2 className="h-4 w-4" /> */}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Rule</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this executive escalation rule? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-300">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteRule(ruleGroup[0].id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                          <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/6">Levels</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-left py-3 px-4">Escalation To</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-left py-3 px-4 w-1/4">P1 Timing</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {['E0', 'E1', 'E2', 'E3'].map((levelName) => {
                          const escalation = ruleGroup.find(esc => esc.name === levelName);
                          return (
                            <TableRow key={levelName} className="border-b border-gray-100 hover:bg-gray-50/50">
                              <TableCell className="py-4 px-4 align-top font-medium text-gray-900">
                                {levelName}
                              </TableCell>
                              <TableCell className="py-4 px-4 align-top text-sm text-gray-700">
                                {escalation ? getUserNamesFromDetails(escalation.escalate_to_users_details) : ''}
                              </TableCell>
                              <TableCell className="py-4 px-4 align-top text-sm text-gray-700">
                                {escalation ? formatTiming(escalation.p1) : ''}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};