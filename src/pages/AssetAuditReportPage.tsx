import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

// Asset Status configuration
const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "in_use":
    case "in use":
      return "#DBC2A9"; // active usage → warm beige
    case "breakdown":
      return "#E4626F"; // breakdown → red/coral
    case "in_storage":
    case "in store":
      return "#C4B89D"; // in store → calm sand
    case "disposed":
      return "#D5DBDB"; // disposed → neutral light gray
    default:
      return "#AAB9C5"; // fallback → soft gray-blue
  }
};

const formatStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case "in_use":
      return "In Use";
    case "in_storage":
      return "In Store";
    case "breakdown":
      return "Breakdown";
    case "disposed":
      return "Disposed";
    default:
      return status;
  }
};

const getStatusStyle = (status: string): React.CSSProperties => {
  return {
    backgroundColor: getStatusColor(status),
    color: '#1A1A1A',
    border: 'none',
    padding: '6px 12px',
    fontWeight: '500',
    display: 'inline-block',
    minWidth: '100px',
    textAlign: 'center',

  };
};

export const AssetAuditReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [auditData, setAuditData] = useState<any>(null);

  useEffect(() => {
    const fetchAuditReport = async () => {
      try {
        setLoading(true);
        const baseUrl = localStorage.getItem('baseUrl') || '';
        const token = localStorage.getItem('token') || '';

        const response = await fetch(`https://${baseUrl}/pms/asset_audits/${id}/view_report.json`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch audit report');
        }

        const data = await response.json();
        console.log('Audit Report data:', data);
        setAuditData(data);
      } catch (error) {
        console.error('Error fetching audit report:', error);
        toast.error('Failed to fetch audit report');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAuditReport();
    }
  }, [id]);

  const handleDownloadReport = async () => {
    try {
      const baseUrl = localStorage.getItem('baseUrl') || '';
      const token = localStorage.getItem('token') || '';

      const response = await fetch(`https://${baseUrl}/pms/asset_audits/${id}/audited_pdf_report`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Audit_Report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Error downloading report:', error);
      toast.error('Failed to download the report');
    }
  };

  const renderAssetsTable = (assets: any[], includeStatus = true) => {
    if (!assets || assets.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No assets available
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-[#ACCEF7]">
            <TableHead className="text-black">Asset Name</TableHead>
            <TableHead className="text-black">Asset Serial No.</TableHead>
            <TableHead className="text-black">Manufacturer</TableHead>
            <TableHead className="text-black">Group</TableHead>
            <TableHead className="text-black">Subgroup</TableHead>
            <TableHead className="text-black">Site</TableHead>
            <TableHead className="text-black">Building</TableHead>
            <TableHead className="text-black">Wing</TableHead>
            <TableHead className="text-black">Floor</TableHead>
            <TableHead className="text-black">Department</TableHead>
            {includeStatus && <TableHead className="text-black">Asset Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset, index) => (
            <TableRow key={index}>
              <TableCell>{asset.name || 'N/A'}</TableCell>
              <TableCell>{asset.serial_number || 'N/A'}</TableCell>
              <TableCell>{asset.manufacturer || 'N/A'}</TableCell>
              <TableCell>{asset.group || 'N/A'}</TableCell>
              <TableCell>{asset.subgroup || 'N/A'}</TableCell>
              <TableCell>{asset.site || 'N/A'}</TableCell>
              <TableCell>{asset.building || 'N/A'}</TableCell>
              <TableCell>{asset.wing || 'N/A'}</TableCell>
              <TableCell>{asset.floor || 'N/A'}</TableCell>
              <TableCell>{asset.department || 'N/A'}</TableCell>
              {includeStatus && (
                <TableCell>
                  <span style={getStatusStyle(asset.status || 'N/A')}>
                    {formatStatusLabel(asset.status || 'N/A')}
                  </span>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading audit report...</div>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">No audit data available</div>
      </div>
    );
  }

  const audit_report = auditData?.audit_report?.audit_details || {};
  const scanned_assets_found = auditData?.audit_report?.scanned_assets_found || {};
  const unscanned_assets_not_found = auditData?.audit_report?.unscanned_assets_not_found || {};
  const unscanned_assets_new = auditData?.audit_report?.unscanned_assets_new || {};
  const formatAuditType = (type) => {
    if (!type) return "N/A";

    switch (type) {
      case "location_based":
        return "Location Based";
      case "asset_based":
        return "Asset Based";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Breadcrumb */}
        <div className="mb-4">
          <span className="text-gray-500 text-sm">Audit</span>
          <span className="text-gray-500 text-sm mx-2">&gt;</span>
          <span className="text-gray-500 text-sm">Audit Details</span>
          <span className="text-gray-500 text-sm mx-2">&gt;</span>
          <span className="text-sm font-medium">Report</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">AUDIT REPORT</h1>
          <Button
            onClick={handleDownloadReport}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Audit Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-gray-700 font-semibold min-w-[150px]">Audit Name</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900">{audit_report?.audit_name || 'N/A'}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-700 font-semibold min-w-[150px]">Period</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900">{audit_report?.period || 'N/A'}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-700 font-semibold min-w-[150px]">Conducted By</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900">{audit_report?.conducted_by || 'N/A'}</span>
            </div>
            <div className="flex items-start">
              <span className="text-gray-700 font-semibold min-w-[150px]">Audit Type</span>
              <span className="text-gray-500 mx-2">:</span>
              {/* <span className="text-gray-900">{audit_report?.audit_type || 'N/A'}</span> */}
              <span className="text-gray-900">
                {formatAuditType(audit_report?.audit_type)}
              </span>


            </div>
          </div>
        </div>

        {/* Scanned & Found Assets */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b text-center">
            <h2 className="text-lg font-semibold text-[#07325f]">Total Assets Scanned & Found</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg h-full" style={{ backgroundColor: '#F4C790' }}>
                <h4 className="text-3xl font-bold text-black-600 mb-2">
                  {scanned_assets_found?.count ?? 0}
                </h4>
                <p className="text-gray-700">Total Scanned & Found</p>
              </div>
              <div className="text-center p-4 rounded-lg h-full" style={{ backgroundColor: '#AAB9C5' }}>
                <h4 className="text-3xl font-bold text-black-600 mb-2">
                  ₹ {typeof scanned_assets_found?.total_cost_in_use === 'number'
                    ? scanned_assets_found.total_cost_in_use.toLocaleString()
                    : '0'}
                </h4>
                <p className="text-gray-700">Total Cost Involved For Assets In Use</p>
              </div>
              <div className="text-center p-4 rounded-lg h-full bg-[#E4626F]">
                <h4 className="text-3xl font-bold text-black-600 mb-2">
                  ₹ {typeof scanned_assets_found?.total_cost_breakdown === "number"
                    ? scanned_assets_found.total_cost_breakdown.toLocaleString()
                    : "0"}
                </h4>
                <p className="text-gray-700">Total Cost Involved For Assets In Breakdown</p>
              </div>

            </div>
            <div className="border rounded-lg overflow-auto">
              {renderAssetsTable(scanned_assets_found?.assets || [])}
            </div>
          </div>
        </div>

        {/* Not Found Assets */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b text-center">
            <h2 className="text-lg font-semibold text-[#07325f]">Total Assets To Be Scanned & Not Found</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-3xl mx-auto">
              <div className="text-center p-4 rounded-lg h-full" style={{ backgroundColor: '#F4C790' }}>
                <h4 className="text-3xl font-bold text-black-600 mb-2">
                  {unscanned_assets_not_found?.count ?? 0}
                </h4>
                <p className="text-gray-700">Total To Be Scanned & Not Found</p>
              </div>
              <div className="text-center p-4 rounded-lg h-full" style={{ backgroundColor: '#AAB9C5' }}>
                <h4 className="text-3xl font-bold text-black-600 mb-2">
                  ₹ {typeof unscanned_assets_not_found?.total_cost === 'number'
                    ? unscanned_assets_not_found.total_cost.toLocaleString()
                    : '0'}
                </h4>
                <p className="text-gray-700">Total Cost Involved</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-auto">
              {renderAssetsTable(unscanned_assets_not_found?.assets || [], false)}
            </div>
          </div>
        </div>

        {/* New Assets */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-4 border-b text-center">
            <h2 className="text-lg font-semibold text-[#07325f]">Total New Assets</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-w-3xl mx-auto">
              <div className="text-center p-4 rounded-lg h-full" style={{ backgroundColor: '#F4C790' }}>
                <h4 className="text-3xl font-bold text-black-600 mb-2">
                  {unscanned_assets_new?.count ?? 0}
                </h4>
                <p className="text-gray-700">Total New</p>
              </div>
              <div className="text-center p-4 rounded-lg h-full" style={{ backgroundColor: '#AAB9C5' }}>
                <h4 className="text-3xl font-bold text-black-600 mb-2">
                  ₹ {typeof unscanned_assets_new?.total_cost === 'number'
                    ? unscanned_assets_new.total_cost.toLocaleString()
                    : '0'}
                </h4>
                <p className="text-gray-700">Total Cost Involved</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-auto">
              {renderAssetsTable(unscanned_assets_new?.assets || [])}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};
