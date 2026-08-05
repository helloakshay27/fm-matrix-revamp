import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from '@mui/material';

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

const fieldStyles = {
  height: { xs: 36, sm: 40, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 14px' },
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
};

// Portals to document.body so the menu anchors under the field instead of
// inheriting any transform that mispositions it.
const selectMenuProps = {
  PaperProps: {
    style: {
      maxHeight: 224,
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
    },
  },
  disablePortal: false,
  disableAutoFocus: true,
  disableEnforceFocus: true,
};

export const LoyaltyRuleEngineDashboard = () => {
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate('/rule-engine/rule-list');
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        Rule Engine &gt; New Rule
      </div>

      {/* Back Button and Page Title */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-[#C72030] hover:bg-[#C72030]/10 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold text-[#C72030]">New Rule</h1>
      </div>

      {/* Rule Name Section */}
      <div className="mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">"New Rule"</h2>
          <div className="max-w-md">
            <TextField
              label="Enter Rule Name"
              variant="outlined"
              fullWidth
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="Enter rule name"
              sx={fieldStyles}
            />
          </div>
        </div>
      </div>

      {/* Set Rule Conditions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#C72030] mb-6">Set Rule Conditions</h2>
        
        {conditions.map((condition, index) => (
          <div key={condition.id} className="mb-6 p-4 border border-[#C72030] rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-[#C72030]">Condition {index + 1}</h3>
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={`master-attribute-${condition.id}`}>Master Attribute *</InputLabel>
                  <MuiSelect
                    labelId={`master-attribute-${condition.id}`}
                    label="Master Attribute *"
                    value={condition.masterAttribute}
                    onChange={(e) => updateCondition(condition.id, 'masterAttribute', e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Master Attribute</em></MenuItem>
                    {masterAttributes.map((attr) => (
                      <MenuItem key={attr} value={attr}>{attr}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>

              <div className="flex justify-center">
                <span className="text-lg font-bold">&</span>
              </div>

              {/* Sub Attribute */}
              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id={`sub-attribute-${condition.id}`}>Sub Attribute *</InputLabel>
                  <MuiSelect
                    labelId={`sub-attribute-${condition.id}`}
                    label="Sub Attribute *"
                    value={condition.subAttribute}
                    onChange={(e) => updateCondition(condition.id, 'subAttribute', e.target.value)}
                    sx={fieldStyles}
                    MenuProps={selectMenuProps}
                  >
                    <MenuItem value=""><em>Select Sub Attribute</em></MenuItem>
                    {subAttributes.map((attr) => (
                      <MenuItem key={attr} value={attr}>{attr}</MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            {/* Operator Section */}
            <div className="mt-6">
              <h4 className="font-medium text-[#C72030] mb-4">Operator</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`master-operator-${condition.id}`}>Master Operator *</InputLabel>
                    <MuiSelect
                      labelId={`master-operator-${condition.id}`}
                      label="Master Operator *"
                      value={condition.masterOperator}
                      onChange={(e) => updateCondition(condition.id, 'masterOperator', e.target.value)}
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value=""><em>Select Master Operator</em></MenuItem>
                      {operators.map((op) => (
                        <MenuItem key={op} value={op}>{op}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>

                <div className="flex justify-center">
                  <span className="text-lg font-bold">&</span>
                </div>

                <div>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`sub-operator-${condition.id}`}>Sub Operator *</InputLabel>
                    <MuiSelect
                      labelId={`sub-operator-${condition.id}`}
                      label="Sub Operator *"
                      value={condition.subOperator}
                      onChange={(e) => updateCondition(condition.id, 'subOperator', e.target.value)}
                      sx={fieldStyles}
                      MenuProps={selectMenuProps}
                    >
                      <MenuItem value=""><em>Select Sub Operator</em></MenuItem>
                      {operators.map((op) => (
                        <MenuItem key={op} value={op}>{op}</MenuItem>
                      ))}
                    </MuiSelect>
                  </FormControl>
                </div>
              </div>
            </div>

            {/* Value Section */}
            <div className="mt-6">
              <h4 className="font-medium text-[#C72030] mb-4">Value</h4>
              <div className="max-w-md">
                <TextField
                  label="Value *"
                  variant="outlined"
                  fullWidth
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                  placeholder="Enter Input Value"
                  sx={fieldStyles}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Additional Condition Button */}
        <Button
          onClick={addCondition}
          variant="ghost"
          className="text-[#C72030] hover:text-[#A01A28]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Additional Condition
        </Button>
      </div>

      {/* THEN Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#C72030] mb-6">THEN</h2>
        <div className="p-4 border border-[#C72030] rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="master-reward-outcome-label">Master Reward Outcome *</InputLabel>
                <MuiSelect
                  labelId="master-reward-outcome-label"
                  label="Master Reward Outcome *"
                  value={rewardOutcome.masterRewardOutcome}
                  onChange={(e) => setRewardOutcome({...rewardOutcome, masterRewardOutcome: e.target.value})}
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Master Reward Outcome</em></MenuItem>
                  {rewardOutcomes.map((outcome) => (
                    <MenuItem key={outcome} value={outcome}>{outcome}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div className="flex justify-center">
              <span className="text-lg font-bold">&</span>
            </div>

            <div>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="sub-reward-outcome-label">Sub Reward Outcome *</InputLabel>
                <MuiSelect
                  labelId="sub-reward-outcome-label"
                  label="Sub Reward Outcome *"
                  value={rewardOutcome.subRewardOutcome}
                  onChange={(e) => setRewardOutcome({...rewardOutcome, subRewardOutcome: e.target.value})}
                  sx={fieldStyles}
                  MenuProps={selectMenuProps}
                >
                  <MenuItem value=""><em>Select Sub Reward Outcome</em></MenuItem>
                  {rewardOutcomes.map((outcome) => (
                    <MenuItem key={outcome} value={outcome}>{outcome}</MenuItem>
                  ))}
                </MuiSelect>
              </FormControl>
            </div>

            <div>
              <TextField
                label="Parameter *"
                variant="outlined"
                fullWidth
                value={rewardOutcome.parameter}
                onChange={(e) => setRewardOutcome({...rewardOutcome, parameter: e.target.value})}
                placeholder="Enter Parameter Value"
                sx={fieldStyles}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleSubmit}
          className="bg-[#C72030] hover:bg-[#A01A28] text-white px-8"
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
