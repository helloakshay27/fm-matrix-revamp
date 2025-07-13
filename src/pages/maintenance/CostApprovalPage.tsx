import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, X } from 'lucide-react';
import { APPROVAL_LEVELS, ACCESS_LEVELS, MOCK_APPROVERS, UNITS, CostApprovalRule, ApprovalLevel } from '@/types/costApproval';

const costApprovalSchema = z.object({
  unit: z.string().min(1, 'Unit is required'),
  accessLevels: z.array(z.string()).min(1, 'At least one access level is required'),
  costRangeMin: z.number().min(0, 'Minimum cost must be 0 or greater'),
  costRangeMax: z.number().min(1, 'Maximum cost must be greater than 0'),
  approvalLevels: z.array(z.object({
    level: z.enum(['L1', 'L2', 'L3', 'L4', 'L5']),
    approvers: z.array(z.string()).max(15, 'Maximum 15 approvers allowed per level'),
  })).length(5),
});

type CostApprovalFormData = z.infer<typeof costApprovalSchema>;

export const CostApprovalPage: React.FC = () => {
  const [rules, setRules] = useState<CostApprovalRule[]>([]);
  const [selectedApprovers, setSelectedApprovers] = useState<{ [key: string]: string[] }>({});

  const createDefaultApprovalLevels = (): ApprovalLevel[] => {
    return APPROVAL_LEVELS.map(level => ({
      level,
      approvers: [],
    }));
  };

  const form = useForm<CostApprovalFormData>({
    resolver: zodResolver(costApprovalSchema),
    defaultValues: {
      unit: '',
      accessLevels: [],
      costRangeMin: 0,
      costRangeMax: 0,
      approvalLevels: createDefaultApprovalLevels() as ApprovalLevel[],
    },
  });

  const handleAccessLevelChange = (accessLevel: string, checked: boolean) => {
    const currentAccessLevels = form.getValues('accessLevels');
    if (checked) {
      form.setValue('accessLevels', [...currentAccessLevels, accessLevel]);
    } else {
      form.setValue('accessLevels', currentAccessLevels.filter(level => level !== accessLevel));
    }
  };

  const handleApproverSelect = (level: string, approver: string) => {
    const currentApprovers = selectedApprovers[level] || [];
    if (!currentApprovers.includes(approver) && currentApprovers.length < 15) {
      const newApprovers = [...currentApprovers, approver];
      setSelectedApprovers(prev => ({ ...prev, [level]: newApprovers }));
      
      // Update form data
      const levelIndex = APPROVAL_LEVELS.indexOf(level as any);
      const currentLevels = form.getValues('approvalLevels');
      currentLevels[levelIndex].approvers = newApprovers;
      form.setValue('approvalLevels', currentLevels);
    }
  };

  const removeApprover = (level: string, approverToRemove: string) => {
    const currentApprovers = selectedApprovers[level] || [];
    const newApprovers = currentApprovers.filter(approver => approver !== approverToRemove);
    setSelectedApprovers(prev => ({ ...prev, [level]: newApprovers }));
    
    // Update form data
    const levelIndex = APPROVAL_LEVELS.indexOf(level as any);
    const currentLevels = form.getValues('approvalLevels');
    currentLevels[levelIndex].approvers = newApprovers;
    form.setValue('approvalLevels', currentLevels);
  };

  const handleSubmit = (data: CostApprovalFormData) => {
    const newRule: CostApprovalRule = {
      id: Date.now().toString(),
      costRange: {
        min: data.costRangeMin,
        max: data.costRangeMax,
      },
      accessLevel: data.accessLevels.join(', ') as any,
      unit: data.unit,
      approvalLevels: data.approvalLevels as ApprovalLevel[],
      createdOn: new Date().toISOString(),
      createdBy: 'Current User',
      active: true,
    };

    setRules(prev => [...prev, newRule]);
    form.reset({
      unit: '',
      accessLevels: [],
      costRangeMin: 0,
      costRangeMax: 0,
      approvalLevels: createDefaultApprovalLevels() as ApprovalLevel[],
    });
    setSelectedApprovers({});
  };

  const deleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Cost Approval</h1>
      </div>

      <Tabs defaultValue="project" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="fm">FM</TabsTrigger>
        </TabsList>
        
        <TabsContent value="project" className="space-y-6">
          {/* Form Section */}
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Top section with Approval Level, Access Level and Unit */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* Left side - Approval Level and Access Level */}
                    <div className="col-span-3 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Approval Level</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Access Level</span>
                            <div className="mt-2 space-y-2">
                              {ACCESS_LEVELS.map(level => (
                                <div key={level} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={level}
                                    checked={form.watch('accessLevels').includes(level)}
                                    onCheckedChange={(checked) => handleAccessLevelChange(level, checked as boolean)}
                                  />
                                  <label htmlFor={level} className="text-sm">{level}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {UNITS.map(unit => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Right side - Levels and Approvers table */}
                    <div className="col-span-9">
                      <div className="border rounded-lg">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="p-3 text-left text-sm font-medium">Levels</th>
                              <th className="p-3 text-left text-sm font-medium">Approvers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {APPROVAL_LEVELS.map((level) => (
                              <tr key={level} className="border-b last:border-b-0">
                                <td className="p-3 text-sm font-medium">{level}</td>
                                <td className="p-3">
                                  <div className="space-y-2">
                                    <Select onValueChange={(value) => handleApproverSelect(level, value)}>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select up to 15 Options..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {MOCK_APPROVERS.filter(approver => 
                                          !(selectedApprovers[level] || []).includes(approver)
                                        ).map(approver => (
                                          <SelectItem key={approver} value={approver}>
                                            {approver}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    
                                    {selectedApprovers[level] && selectedApprovers[level].length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {selectedApprovers[level].map(approver => (
                                          <Badge key={approver} variant="secondary" className="text-xs">
                                            {approver}
                                            <button
                                              type="button"
                                              onClick={() => removeApprover(level, approver)}
                                              className="ml-1 text-xs hover:text-red-500"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Cost Range - moved to bottom */}
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="costRangeMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="costRangeMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10000"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button type="submit" className="px-8">
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Existing Rules */}
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <Card key={rule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Rule {index + 1}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="border rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3 text-left text-sm font-medium">Cost Range</th>
                          <th className="p-3 text-left text-sm font-medium">Access Level</th>
                          <th className="p-3 text-left text-sm font-medium">Levels</th>
                          <th className="p-3 text-left text-sm font-medium">Approvers</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-sm">{rule.costRange.min} - {rule.costRange.max}</td>
                          <td className="p-3 text-sm">{rule.accessLevel}</td>
                          <td className="p-3">
                            <div className="space-y-1 text-sm">
                              {rule.approvalLevels.map(level => (
                                <div key={level.level}>{level.level}</div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1 text-sm">
                              {rule.approvalLevels.map(level => (
                                <div key={level.level}>
                                  {level.approvers.length > 0 ? level.approvers.join(', ') : '-'}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {rules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Please select an item in the list.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="fm">
              <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Top section with Approval Level, Access Level and Unit */}
                  <div className="grid grid-cols-12 gap-6">
                    {/* Left side - Approval Level and Access Level */}
                    <div className="col-span-3 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Approval Level</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Access Level</span>
                            <div className="mt-2 space-y-2">
                              {ACCESS_LEVELS.map(level => (
                                <div key={level} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={level}
                                    checked={form.watch('accessLevels').includes(level)}
                                    onCheckedChange={(checked) => handleAccessLevelChange(level, checked as boolean)}
                                  />
                                  <label htmlFor={level} className="text-sm">{level}</label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select Unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {UNITS.map(unit => (
                                    <SelectItem key={unit} value={unit}>
                                      {unit}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Right side - Levels and Approvers table */}
                    <div className="col-span-9">
                      <div className="border rounded-lg">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b bg-gray-50">
                              <th className="p-3 text-left text-sm font-medium">Levels</th>
                              <th className="p-3 text-left text-sm font-medium">Approvers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {APPROVAL_LEVELS.map((level) => (
                              <tr key={level} className="border-b last:border-b-0">
                                <td className="p-3 text-sm font-medium">{level}</td>
                                <td className="p-3">
                                  <div className="space-y-2">
                                    <Select onValueChange={(value) => handleApproverSelect(level, value)}>
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select up to 15 Options..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {MOCK_APPROVERS.filter(approver => 
                                          !(selectedApprovers[level] || []).includes(approver)
                                        ).map(approver => (
                                          <SelectItem key={approver} value={approver}>
                                            {approver}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    
                                    {selectedApprovers[level] && selectedApprovers[level].length > 0 && (
                                      <div className="flex flex-wrap gap-1">
                                        {selectedApprovers[level].map(approver => (
                                          <Badge key={approver} variant="secondary" className="text-xs">
                                            {approver}
                                            <button
                                              type="button"
                                              onClick={() => removeApprover(level, approver)}
                                              className="ml-1 text-xs hover:text-red-500"
                                            >
                                              <X className="h-3 w-3" />
                                            </button>
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Cost Range - moved to bottom */}
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="costRangeMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="costRangeMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10000"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-center">
                    <Button type="submit" className="px-8">
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Existing Rules */}
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <Card key={rule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Rule {index + 1}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="border rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="p-3 text-left text-sm font-medium">Cost Range</th>
                          <th className="p-3 text-left text-sm font-medium">Access Level</th>
                          <th className="p-3 text-left text-sm font-medium">Levels</th>
                          <th className="p-3 text-left text-sm font-medium">Approvers</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-3 text-sm">{rule.costRange.min} - {rule.costRange.max}</td>
                          <td className="p-3 text-sm">{rule.accessLevel}</td>
                          <td className="p-3">
                            <div className="space-y-1 text-sm">
                              {rule.approvalLevels.map(level => (
                                <div key={level.level}>{level.level}</div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1 text-sm">
                              {rule.approvalLevels.map(level => (
                                <div key={level.level}>
                                  {level.approvers.length > 0 ? level.approvers.join(', ') : '-'}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
