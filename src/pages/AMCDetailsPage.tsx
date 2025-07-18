
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddVisitModal } from '@/components/AddVisitModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';

interface AMCDetailsData {
  id: number;
  asset_id: number | null;
  amc_vendor_name: string | null;
  amc_vendor_mobile: string | null;
  amc_vendor_email: string | null;
  amc_contract: string | null;
  amc_invoice: string | null;
  amc_cost: number;
  amc_start_date: string;
  amc_end_date: string;
  amc_first_service: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  payment_term: string;
  no_of_visits: number;
  remarks: string;
}

export const AMCDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { data: amcData, loading, error } = useAppSelector((state) => state.amcDetails);
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAMCDetails(id));
    }
  }, [dispatch, id]);

  // Helper functions for formatting data
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return '—';
    }
  };

  const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return '—';
    return `₹${amount}`;
  };

  // If loading, show loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading AMC details...</div>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const amcDetails: AMCDetailsData | null = amcData as AMCDetailsData;

  if (!amcDetails) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">No AMC details found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/amc')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to AMC List
        </Button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">AMC Details - {amcDetails.id}</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAddVisitModal(true)}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              + Add Visit
            </Button>
            <Button 
              onClick={() => navigate(`/maintenance/amc/edit/${id}`)}
              variant="outline"
              className="border-[#C72030] text-[#C72030]"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">S</span>
            SUPPLIER INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Name:</strong> {amcDetails.amc_vendor_name || '—'}</div>
            <div><strong>Email:</strong> {amcDetails.amc_vendor_email || '—'}</div>
            <div><strong>Mobile1:</strong> {amcDetails.amc_vendor_mobile || '—'}</div>
            <div><strong>Mobile2:</strong> —</div>
            <div><strong>Company name:</strong> {amcDetails.amc_vendor_name || '—'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">A</span>
            ASSET INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Under Warranty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{amcDetails.asset_id ? `Asset ${amcDetails.asset_id}` : '—'}</TableCell>
                <TableCell>—</TableCell>
                <TableCell>No</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded ${
                    amcDetails.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {amcDetails.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AMC Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">A</span>
            AMC INFORMATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>ID:</strong> {amcDetails.id}</div>
            <div><strong>Cost:</strong> {formatCurrency(amcDetails.amc_cost)}</div>
            <div><strong>Start Date:</strong> {formatDate(amcDetails.amc_start_date)}</div>
            <div><strong>End Date:</strong> {formatDate(amcDetails.amc_end_date)}</div>
            <div><strong>First Service:</strong> {formatDate(amcDetails.amc_first_service)}</div>
            <div><strong>No. of Visits:</strong> {amcDetails.no_of_visits || '—'}</div>
            <div><strong>Payment Terms:</strong> {amcDetails.payment_term || '—'}</div>
            <div className="md:col-span-2"><strong>Remarks:</strong> {amcDetails.remarks || '—'}</div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">A</span>
            ATTACHMENTS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <strong>AMC Contract:</strong>
              {amcDetails.amc_contract ? (
                <Button variant="link" className="ml-2 p-0 h-auto">
                  <Download className="w-4 h-4 mr-1" />
                  Download Contract
                </Button>
              ) : (
                <span className="ml-2">No attachments</span>
              )}
            </div>
            <div>
              <strong>AMC Invoice:</strong>
              {amcDetails.amc_invoice ? (
                <Button variant="link" className="ml-2 p-0 h-auto">
                  <Download className="w-4 h-4 mr-1" />
                  Download Invoice
                </Button>
              ) : (
                <span className="ml-2">No attachments</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AddVisitModal 
        isOpen={showAddVisitModal}
        onClose={() => setShowAddVisitModal(false)}
        amcId={amcDetails?.id?.toString() || id || ''}
      />
    </div>
  );
};
