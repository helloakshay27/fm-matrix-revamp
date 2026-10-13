import React, { useState } from 'react';
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
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-root': {
    minHeight: '44px',
    backgroundColor: '#fff',
    fontSize: '13.5px',
    fontWeight: 500,
  },
};

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid var(--color-divider)',
  borderRadius: 16,
  padding: '22px 24px',
  boxShadow: 'none',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  lineHeight: 1.4,
  color: 'var(--color-text)',
  margin: 0,
};

const subTitleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--color-ink-48)',
  margin: '0 0 10px',
};

const pairGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0,1fr) 28px minmax(0,1fr)',
  alignItems: 'end',
  gap: 14,
};

const AndMark = () => (
  <div
    className="flex items-center justify-center"
    style={{ height: 44, fontSize: 13, fontWeight: 600, color: 'var(--color-ink-48)' }}
  >
    &amp;
  </div>
);

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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', padding: '24px 32px 48px' }}>
      <button
        type="button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 border-0 bg-transparent p-0 text-[12.5px] font-semibold text-[var(--color-ink-48)] hover:text-[var(--color-text)]"
        style={{ marginBottom: 12 }}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Rule List
      </button>
      <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.2, margin: '0 0 22px', color: 'var(--color-text)' }}>
        New Rule
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Rule Name Section */}
      <section style={cardStyle}>
        <h2 style={{ ...sectionTitleStyle, marginBottom: 16 }}>Rule Details</h2>
        <div style={{ maxWidth: 480 }}>
          <TextField
            label="Rule Name"
            variant="outlined"
            fullWidth
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            placeholder="Enter rule name"
            sx={fieldStyles}
          />
        </div>
      </section>

      {/* Set Rule Conditions */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={sectionTitleStyle}>Set Rule Conditions</h2>

        {conditions.map((condition, index) => (
          <div key={condition.id} style={cardStyle}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <h3 style={sectionTitleStyle}>Condition {index + 1}</h3>
              {conditions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCondition(condition.id)}
                  aria-label={`Remove condition ${index + 1}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent text-[var(--color-ink-48)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <p style={subTitleStyle}>Attribute</p>
            <div style={pairGrid}>
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

              <AndMark />

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
            <div style={{ marginTop: 20 }}>
              <p style={subTitleStyle}>Operator</p>
              <div style={pairGrid}>
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

                <AndMark />

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
            <div style={{ marginTop: 20 }}>
              <p style={subTitleStyle}>Value</p>
              <div style={{ maxWidth: 'calc(50% - 28px)' }}>
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
        <div>
          <button
            type="button"
            onClick={addCondition}
            className="inline-flex h-[42px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[var(--color-line)] bg-white px-[22px] text-[13px] font-semibold leading-none text-[var(--color-ink-68)] hover:border-[rgba(26,26,24,0.28)] hover:text-[var(--color-text)]"
          >
            <Plus className="h-4 w-4" />
            Add Additional Condition
          </button>
        </div>
      </section>

      {/* THEN Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={sectionTitleStyle}>Then</h2>
        <div style={cardStyle}>
          <p style={subTitleStyle}>Reward Outcome</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) 28px minmax(0,1fr) minmax(0,1fr)',
              alignItems: 'end',
              gap: 14,
            }}
          >
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

            <AndMark />

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
      </section>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex h-[42px] w-[160px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[var(--color-line)] bg-white px-[22px] text-[13px] font-semibold leading-none text-[var(--color-ink-68)] hover:border-[rgba(26,26,24,0.28)] hover:text-[var(--color-text)]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex h-[42px] w-[160px] shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-[var(--color-primary)] bg-[var(--color-primary)] px-[22px] text-[13px] font-semibold leading-none text-white hover:bg-[var(--color-primary-hover)]"
          style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff', boxShadow: 'none' }}
        >
          Submit
        </button>
      </div>
      </div>
    </div>
  );
};
