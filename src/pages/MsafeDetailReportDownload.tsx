import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import axios from 'axios';
import { toast } from 'sonner';

const MsafeDetailReportDownload: React.FC = () => {
  const [reports, setReports] = useState({
    masterSSO: false,
    masterSignin: false,
    smt: false,
    lmc: false,
    training: false,
  });
  const [loading, setLoading] = useState(false);

  const anySelected = Object.values(reports).some(Boolean);

  const toggle = (key: keyof typeof reports) =>
    setReports((prev) => ({ ...prev, [key]: !prev[key] }));

  const getBaseUrl = () => {
    const fromLS = localStorage.getItem('baseUrl');
    if (!fromLS) return 'https://live-api.gophygital.work';
    return fromLS.startsWith('http') ? fromLS : `https://${fromLS}`;
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const companyId = localStorage.getItem('selectedCompanyId');
      const token = localStorage.getItem('token');

      if (!companyId) {
        toast.error('Company ID not found. Please select a company.');
        setLoading(false);
        return;
      }

      if (!token) {
        toast.error('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${baseUrl}/krcc_forms/msafe_detail_report_fetch.json?company_id=${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { status, message, download_url: downloadUrl } = response?.data || {};

      // Prefer showing backend-provided message when present
      if (message) {
        if (status === 'completed') toast.success(message);
        else if (status === 'failed' || status === 'error') toast.error(message);
        else toast.info(message);
      }

      if (status === 'completed') {
        if (downloadUrl) {
          window.open(downloadUrl, '_blank');
          if (!message) toast.success('Report download started successfully.');
        } else {
          toast.error('Download URL not found in the response.');
        }
      } else if (!message) {
        // Fallback generic note only if backend didn't provide a message
        toast.info('Report generation is not yet complete. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching report status:', error);
      // If server returned a message, show it; otherwise show generic error
      const anyErr = error as any;
      const serverMsg = anyErr?.response?.data?.message || anyErr?.message;
      if (serverMsg) toast.error(serverMsg);
      else toast.error('Failed to fetch report status. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">MSafe Detail Report Download</h1>
      <p className="text-gray-600 mb-6">
        This report contains downloadable files, including the Master Report SSO, Master Report Sign-in, SMT Report, LMC Report, and Training Report.
      </p>

      {/* <FormGroup className="space-y-6 mb-8">
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
      </FormGroup> */}

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-5 text-base md:text-[16px] rounded-md"
      >
        {loading ? 'Generating...' : 'Download Latest Report'}
      </Button>
      <p></p>
    </div>
  );
};

export default MsafeDetailReportDownload;