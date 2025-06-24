
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from 'lucide-react';

interface Condition {
  id: string;
  masterAttribute: string;
  subAttribute: string;
  masterOperator: string;
  subOperator: string;
  value: string;
}

interface RewardOutcome {
  masterRewardOutcome: string;
  subRewardOutcome: string;
  parameter: string;
}

export const LoyaltyRuleEngineDashboard = () => {
  const [ruleName, setRuleName] = useState('');
  const [conditions, setConditions] = useState<Condition[]>([
    {
      id: '1',
      masterAttribute: '',
      subAttribute: '',
      masterOperator: '',
      subOperator: '',
      value: ''
    }
  ]);
  const [rewardOutcome, setRewardOutcome] = useState<RewardOutcome>({
    masterRewardOutcome: '',
    subRewardOutcome: '',
    parameter: ''
  });

  const masterAttributes = [
    'User Behavior',
    'Transaction Amount', 
    'Purchase Frequency',
    'Account Type',
    'Location'
  ];

  const subAttributes = [
    'Login Count',
    'Page Views',
    'Total Amount',
    'Weekly Purchases',
    'Premium User',
    'City'
  ];

  const operators = [
    'Equals',
    'Greater Than',
    'Less Than',
    'Contains',
    'Not Equals'
  ];

  const rewardOutcomes = [
    'Points',
    'Discount',
    'Cashback',
    'Free Shipping',
    'Bonus'
  ];

  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      masterAttribute: '',
      subAttribute: '',
      masterOperator: '',
      subOperator: '',
      value: ''
    };
    setConditions([...conditions, newCondition]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(condition => condition.id !== id));
    }
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(condition => 
      condition.id === id ? { ...condition, [field]: value } : condition
    ));
  };

  const handleSubmit = () => {
    console.log('Rule Name:', ruleName);
    console.log('Conditions:', conditions);
    console.log('Reward Outcome:', rewardOutcome);
    // Handle form submission logic here
    alert('Rule created successfully!');
  };

  const handleCancel = () => {
    setRuleName('');
    setConditions([{
      id: '1',
      masterAttribute: '',
      subAttribute: '',
      masterOperator: '',
      subOperator: '',
      value: ''
    }]);
    setRewardOutcome({
      masterRewardOutcome: '',
      subRewardOutcome: '',
      parameter: ''
    });
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Rule Engine &gt; New Rule
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-orange-600 mb-6">New Rule</h1>

      {/* Rule Name Section */}
      <div className="mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">"New Rule"</h2>
          <div className="max-w-md">
            <Label className="text-sm font-medium">Enter Rule Name</Label>
            <Input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="mt-1"
              placeholder="Enter rule name"
            />
          </div>
        </div>
      </div>

      {/* Set Rule Conditions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-orange-600 mb-6">Set Rule Conditions</h2>
        
        {conditions.map((condition, index) => (
          <div key={condition.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-orange-600">Condition {index + 1}</h3>
              {conditions.length > 1 && (
                <Button
                  onClick={() => removeCondition(condition.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Master Attribute */}
              <div>
                <Label className="text-sm font-medium text-orange-600">Master Attribute*</Label>
                <Select
                  value={condition.masterAttribute}
                  onValueChange={(value) => updateCondition(condition.id, 'masterAttribute', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Master Attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    {masterAttributes.map((attr) => (
                      <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <span className="text-lg font-bold">&</span>
              </div>

              {/* Sub Attribute */}
              <div>
                <Label className="text-sm font-medium text-orange-600">Sub Attribute*</Label>
                <Select
                  value={condition.subAttribute}
                  onValueChange={(value) => updateCondition(condition.id, 'subAttribute', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Sub Attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    {subAttributes.map((attr) => (
                      <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Operator Section */}
            <div className="mt-6">
              <h4 className="font-medium text-orange-600 mb-4">Operator</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <Label className="text-sm font-medium text-orange-600">Master Operator*</Label>
                  <Select
                    value={condition.masterOperator}
                    onValueChange={(value) => updateCondition(condition.id, 'masterOperator', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Master Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op} value={op}>{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <span className="text-lg font-bold">&</span>
                </div>

                <div>
                  <Label className="text-sm font-medium text-orange-600">Sub Operator*</Label>
                  <Select
                    value={condition.subOperator}
                    onValueChange={(value) => updateCondition(condition.id, 'subOperator', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Sub Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operators.map((op) => (
                        <SelectItem key={op} value={op}>{op}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Value Section */}
            <div className="mt-6">
              <h4 className="font-medium text-orange-600 mb-4">Value</h4>
              <div className="max-w-md">
                <Label className="text-sm font-medium text-orange-600">Value*</Label>
                <Input
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                  className="mt-1"
                  placeholder="Enter Input Value"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Additional Condition Button */}
        <Button
          onClick={addCondition}
          variant="ghost"
          className="text-green-600 hover:text-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Additional Condition
        </Button>
      </div>

      {/* THEN Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-orange-600 mb-6">THEN</h2>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label className="text-sm font-medium text-orange-600">Master Reward Outcome*</Label>
              <Select
                value={rewardOutcome.masterRewardOutcome}
                onValueChange={(value) => setRewardOutcome({...rewardOutcome, masterRewardOutcome: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Master Reward Outcome" />
                </SelectTrigger>
                <SelectContent>
                  {rewardOutcomes.map((outcome) => (
                    <SelectItem key={outcome} value={outcome}>{outcome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <span className="text-lg font-bold">&</span>
            </div>

            <div>
              <Label className="text-sm font-medium text-orange-600">Sub Reward Outcome*</Label>
              <Select
                value={rewardOutcome.subRewardOutcome}
                onValueChange={(value) => setRewardOutcome({...rewardOutcome, subRewardOutcome: value})}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select Sub Reward Outcome" />
                </SelectTrigger>
                <SelectContent>
                  {rewardOutcomes.map((outcome) => (
                    <SelectItem key={outcome} value={outcome}>{outcome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-orange-600">Parameter*</Label>
              <Input
                value={rewardOutcome.parameter}
                onChange={(e) => setRewardOutcome({...rewardOutcome, parameter: e.target.value})}
                className="mt-1"
                placeholder="Enter Parameter Value"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          Submit
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="px-8"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
