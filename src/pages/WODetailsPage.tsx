import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Printer, Rss, ArrowLeft } from 'lucide-react';

export const WODetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const woDetails = {
    id: id,
    status: 'Pending',
    level1Approval: 'Pending',
    // Contact/Vendor details
    vendorName: 'jyoti',
    phone: '7239013238',
    email: 'xtylizzsamerxyz146@gmail.com',
    pan: '86868779796',
    fax: 't78788ugjyfr65r65',
    gst: 'r7gfyy87176657',
    address: 'demo world',
    // Work Order details
    woNumber: '',
    woDate: '02-04-24',
    kindAttention: '',
    subject: '',
    relatedTo: '',
    paymentTenure: '',
    retention: '',
    tds: '',
    qc: '',
    advanceAmount: '',
    description: '',
    referenceNo: '10009',
    woId: '9175',
    contractor: 'MODWIN NETWORKS PVT.LTD',
    contractorAddress: 'Mumbai Maharashtra - India',
    contractorPhone: '9382875928',
    contractorEmail: 'vinod@modwin.com',
    contractorGst: 'NA',
    contractorPan: 'NA',
    workCategory: 'NA'
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-[#fafafa] min-h-screen">
      {/* Breadcrumb */}
      <div className="mb-2 text-sm text-gray-600">
        <span 
          className="cursor-pointer hover:text-[#C72030]" 
          onClick={() => navigate('/finance/wo')}
        >
          Work Order
        </span>
        {' > '}
        <span>Work Order Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="font-work-sans font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 mb-2">
            WORK ORDER DETAILS
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Level 1 Approval:</span>
            <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(woDetails.level1Approval)}`}>
              {woDetails.level1Approval}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
          <span className={`px-4 py-2 rounded text-sm font-medium ${getStatusColor(woDetails.status)}`}>
            Status:- {woDetails.status}
          </span>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" className="border-gray-300">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700">
              <Copy className="w-4 h-4 mr-1" />
              Clone
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300 bg-purple-600 text-white hover:bg-purple-700">
              <Printer className="w-4 h-4 mr-1" />
              Print
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300">
              <Rss className="w-4 h-4 mr-1" />
              Feeds
            </Button>
            <Button size="sm" variant="outline" className="border-gray-300">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Vendor/Contact Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Contact details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <span className="ml-8">: {woDetails.phone}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fax</span>
                <span className="ml-12">: {woDetails.fax}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email</span>
                <span className="ml-8">: {woDetails.email}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">GST</span>
                <span className="ml-11">: {woDetails.gst}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">PAN</span>
                <span className="ml-9">: {woDetails.pan}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Address</span>
                <span className="ml-5">: {woDetails.address}</span>
              </div>
            </div>
          </div>

          {/* Center - Vendor name */}
          <div className="flex flex-col items-center justify-center lg:min-w-[200px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{woDetails.vendorName}</h2>
            <div className="w-16 h-16 bg-gray-200 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-xs text-gray-500">image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Work Order Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
          Work Order ({woDetails.status})
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">WO Number</span>
              <span className="text-sm">: {woDetails.woNumber || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">WO Date</span>
              <span className="text-sm">: {woDetails.woDate}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Kind Attention</span>
              <span className="text-sm">: {woDetails.kindAttention || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Subject</span>
              <span className="text-sm">: {woDetails.subject || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Related To</span>
              <span className="text-sm">: {woDetails.relatedTo || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Payment Tenure(In Days)</span>
              <span className="text-sm">: {woDetails.paymentTenure || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Retention(%)</span>
              <span className="text-sm">: {woDetails.retention || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">TDS(%)</span>
              <span className="text-sm">: {woDetails.tds || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">QC(%)</span>
              <span className="text-sm">: {woDetails.qc || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Advance Amount</span>
              <span className="text-sm">: {woDetails.advanceAmount || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-40">Description</span>
              <span className="text-sm">: {woDetails.description || '-'}</span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Reference No.</span>
              <span className="text-sm">: {woDetails.referenceNo}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">ID</span>
              <span className="text-sm">: {woDetails.woId}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Contractor</span>
              <span className="text-sm">: {woDetails.contractor}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Address</span>
              <span className="text-sm">: {woDetails.contractorAddress}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Phone</span>
              <span className="text-sm">: {woDetails.contractorPhone}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Email</span>
              <span className="text-sm">: {woDetails.contractorEmail}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">GST</span>
              <span className="text-sm">: {woDetails.contractorGst}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">PAN</span>
              <span className="text-sm">: {woDetails.contractorPan}</span>
            </div>
            <div className="flex">
              <span className="text-sm font-medium text-gray-700 w-32">Work Category</span>
              <span className="text-sm">: {woDetails.workCategory}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/finance/wo')}
          className="border-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Work Orders
        </Button>
      </div>
    </div>
  );
};