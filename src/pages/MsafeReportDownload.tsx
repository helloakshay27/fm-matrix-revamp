import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

const MsafeReportDownload: React.FC = () => {
  const [reports, setReports] = useState({
    masterSSO: false,
    masterSignin: false,
    smt: false,
    lmc: false,
    training: false,
  });

  const anySelected = Object.values(reports).some(Boolean);

  const toggle = (key: keyof typeof reports) =>
    setReports((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleGenerate = () => {
    // Placeholder: wire to your export endpoints as needed
    // Example: call different APIs based on selected checkboxes
    // For now, just log selection
    console.log('Generate reports for:', reports);
  };

  const checkboxSx = {
    '&.Mui-checked': {
      color: 'hsl(var(--primary))',
    },
    '&.MuiCheckbox-root.Mui-checked:hover': {
      backgroundColor: 'hsl(var(--primary) / 0.08)',
    },
  } as const;

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-4xl md:text-4xl font-bold mb-8">Generate Excel Report</h1>

      <FormGroup className="space-y-6 mb-8">
        <FormControlLabel
          control={<Checkbox sx={checkboxSx} checked={reports.masterSSO} onChange={() => toggle('masterSSO')} />}
          label={<span className="text-base md:text-lg">Master Report SSO</span>}
        />
        <FormControlLabel
          control={<Checkbox sx={checkboxSx} checked={reports.masterSignin} onChange={() => toggle('masterSignin')} />}
          label={<span className="text-base md:text-lg">Master Report Signin</span>}
        />
        <FormControlLabel
          control={<Checkbox sx={checkboxSx} checked={reports.smt} onChange={() => toggle('smt')} />}
          label={<span className="text-base md:text-lg">SMT Report</span>}
        />
        <FormControlLabel
          control={<Checkbox sx={checkboxSx} checked={reports.lmc} onChange={() => toggle('lmc')} />}
          label={<span className="text-base md:text-lg">LMC Report</span>}
        />
        <FormControlLabel
          control={<Checkbox sx={checkboxSx} checked={reports.training} onChange={() => toggle('training')} />}
          label={<span className="text-base md:text-lg">Training Report</span>}
        />
      </FormGroup>

      <Button
        onClick={handleGenerate}
        disabled={!anySelected}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-5 text-base md:text-lg rounded-md"
      >
        Generate Report
      </Button>
    </div>
  );
};

export default MsafeReportDownload;