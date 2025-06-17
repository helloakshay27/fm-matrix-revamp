
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddVisitModal } from '@/components/AddVisitModal';

export const AMCDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);

  // Mock data - in real app this would come from API
  const amcDetails = {
    id: '51015',
    assetName: 'Adani Electric Meter',
    code: 'cA51d3ec1b3a6c0a10',
    underWarranty: 'No',
    status: 'Breakdown',
    cost: '₹12',
    endDate: '10/05/2025',
    paymentTerms: 'Half Yearly',
    remarks: '232e',
    startDate: '01/04/2025',
    firstService: '09/04/2025',
    noOfVisits: '2'
  };

  const supplierInfo = {
    name: 'TBS ELECTRICAL',
    email: 'TBS@GMAIL.COM',
    mobile1: '+1234567890',
    mobile2: '',
    companyName: 'TBS ELECTRICAL'
  };

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
            <div><strong>Name:</strong> {supplierInfo.name}</div>
            <div><strong>Email:</strong> {supplierInfo.email}</div>
            <div><strong>Mobile1:</strong> {supplierInfo.mobile1}</div>
            <div><strong>Mobile2:</strong> {supplierInfo.mobile2}</div>
            <div><strong>Company name:</strong> {supplierInfo.companyName}</div>
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
                <TableCell>{amcDetails.assetName}</TableCell>
                <TableCell>{amcDetails.code}</TableCell>
                <TableCell>{amcDetails.underWarranty}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                    {amcDetails.status}
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
            <div><strong>Status:</strong> Active</div>
            <div><strong>Cost:</strong> {amcDetails.cost}</div>
            <div><strong>Start Date:</strong> {amcDetails.startDate}</div>
            <div><strong>End Date:</strong> {amcDetails.endDate}</div>
            <div><strong>First Service:</strong> {amcDetails.firstService}</div>
            <div><strong>Payment Terms:</strong> {amcDetails.paymentTerms}</div>
            <div><strong>No. of Visits:</strong> {amcDetails.noOfVisits}</div>
            <div className="md:col-span-2"><strong>Remarks:</strong> {amcDetails.remarks}</div>
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
          <div className="space-y-2">
            <div><strong>AMC Contracts:</strong> No attachments</div>
            <div><strong>AMC Invoices:</strong> No attachments</div>
          </div>
        </CardContent>
      </Card>

      <AddVisitModal 
        isOpen={showAddVisitModal}
        onClose={() => setShowAddVisitModal(false)}
        amcId={amcDetails.id}
      />
    </div>
  );
};
