import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, RefreshCw, FileText, DollarSign, CreditCard, Building2, RefreshCcw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { API_CONFIG } from '@/config/apiConfig';

interface LockPayment {
  id: number;
  order_number: string;
  payment_of: string;
  payment_of_id: number;
  payment_mode: string | null;
  sub_total: string | null;
  gst: string | null;
  discount: string | null;
  total_amount: string;
  paid_amount: string | null;
  payment_status: string | null;
  pg_state: string | null;
  pg_response_code: string | null;
  pg_response_msg: string | null;
  pg_transaction_id: string | null;
  created_at: string;
  updated_at: string;
  payment_method: string | null;
  card_type: string | null;
  cheque_number: string | null;
  cheque_date: string | null;
  bank_name: string | null;
  ifsc: string | null;
  branch: string | null;
  neft_reference: string | null;
  notes: string | null;
  payment_gateway: string | null;
  user_id: number | null;
  redirect: string;
  payment_type: string | null;
  convenience_charge: string | null;
  refunded_amount: string | null;
  refund_mode: string | null;
  refund_transaction_no: string | null;
  refund_note: string | null;
  refunded_by: string | null;
  refunded_on: string | null;
  receipt_number: string | null;
  created_by_id: number | null;
  updt_balance: string | null;
  recon_status: string | null;
  reconciled_by: string | null;
  reconciled_on: string | null;
  resource_id: number;
  resource_type: string;
  sgst: string | null;
}

export const PaymentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [payment, setPayment] = useState<LockPayment | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch payment details
  useEffect(() => {
    if (id) {
      fetchPaymentDetails(id);
    }
  }, [id]);

  const fetchPaymentDetails = async (paymentId: string) => {
    setLoading(true);
    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      const url = new URL(`${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/lock_payments/${paymentId}.json`);
      url.searchParams.append('access_token', token || '');
      
      console.log('Fetching payment details:', url.toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }
      
      const data = await response.json();
      console.log('Payment details:', data);
      
      setPayment(data);
      toast.success('Payment details loaded');
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast.error('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: string | null) => {
    if (!amount) return '-';
    const num = parseFloat(amount);
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPaymentStatusBadge = (status: string | null) => {
    if (!status) {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-0">
          Pending
        </Badge>
      );
    }
    
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'success' || statusLower === 'paid') {
      return (
        <Badge className="bg-green-100 text-green-800 border-0">
          {status}
        </Badge>
      );
    }
    
    if (statusLower === 'failed' || statusLower === 'rejected') {
      return (
        <Badge className="bg-red-100 text-red-800 border-0">
          {status}
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-gray-100 text-gray-800 border-0">
        {status}
      </Badge>
    );
  };

  const handleGoBack = () => {
    navigate('/club-management/accounting');
  };

  const handleDownloadReceipt = async () => {
    if (!id) {
      toast.error('Payment ID not found');
      return;
    }

    try {
      const baseUrl = API_CONFIG.BASE_URL;
      const token = API_CONFIG.TOKEN;
      
      const url = `${baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`}/pms_facility_bookings/payment_details_pdf?lock_payment_id=${id}`;
      
      toast.loading('Downloading receipt...');
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download receipt');
      }
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create a download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `payment_receipt_${payment?.order_number || id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.dismiss();
      toast.success('Receipt downloaded successfully');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.dismiss();
      toast.error('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C72030]"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">Payment not found</p>
          <Button onClick={handleGoBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payment List
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">Payment Details</h1>
            <p className="text-sm text-gray-500">Order: {payment.order_number}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadReceipt}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              onClick={() => fetchPaymentDetails(id!)}
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <FileText className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Basic Information</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="task-info-enhanced">
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Order Number</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced font-medium">{payment.order_number}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Payment Type</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.payment_of}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Payment Of ID</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.payment_of_id}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Resource Type</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.resource_type}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Resource ID</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.resource_id}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Status</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{renderPaymentStatusBadge(payment.payment_status)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Amount Details */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <DollarSign className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Amount Details</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="task-info-enhanced">
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Sub Total</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatAmount(payment.sub_total)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">GST</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatAmount(payment.gst)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">SGST</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatAmount(payment.sgst)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Discount</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatAmount(payment.discount)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Convenience Charge</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatAmount(payment.convenience_charge)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced font-semibold">Total Amount</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced font-bold text-lg">{formatAmount(payment.total_amount)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced font-semibold">Paid Amount</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced font-semibold text-green-600">{formatAmount(payment.paid_amount)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Payment Method Details */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <CreditCard className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Payment Method</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="task-info-enhanced">
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Payment Method</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.payment_method || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Payment Mode</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.payment_mode || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Payment Gateway</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.payment_gateway || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Card Type</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.card_type || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Receipt Number</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.receipt_number || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">PG Transaction ID</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced font-mono text-sm">{payment.pg_transaction_id || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">PG Response Code</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.pg_response_code || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">PG Response Message</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.pg_response_msg || '-'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Bank Details (if applicable) */}
        {(payment.cheque_number || payment.bank_name || payment.neft_reference) && (
          <Card className="w-full bg-transparent shadow-none border-none">
            <div className="figma-card-header">
              <div className="flex items-center gap-3">
                <div className="figma-card-icon-wrapper">
                  <Building2 className="figma-card-icon" />
                </div>
                <h3 className="figma-card-title">Bank Details</h3>
              </div>
            </div>
            <div className="figma-card-content">
              <div className="task-info-enhanced">
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Bank Name</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.bank_name || '-'}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">IFSC Code</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.ifsc || '-'}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Branch</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.branch || '-'}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Cheque Number</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.cheque_number || '-'}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Cheque Date</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{formatDate(payment.cheque_date)}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">NEFT Reference</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.neft_reference || '-'}</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Refund Details (if applicable) */}
        {payment.refunded_amount && (
          <Card className="w-full bg-transparent shadow-none border-none">
            <div className="figma-card-header">
              <div className="flex items-center gap-3">
                <div className="figma-card-icon-wrapper">
                  <RefreshCcw className="figma-card-icon" />
                </div>
                <h3 className="figma-card-title">Refund Details</h3>
              </div>
            </div>
            <div className="figma-card-content">
              <div className="task-info-enhanced">
                <div className="task-info-row">
                  <span className="task-info-label-enhanced font-semibold">Refunded Amount</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced font-semibold text-red-600">{formatAmount(payment.refunded_amount)}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Refund Mode</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.refund_mode || '-'}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Refund Transaction No</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.refund_transaction_no || '-'}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Refunded By</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{payment.refunded_by || '-'}</span>
                </div>
                <div className="task-info-row">
                  <span className="task-info-label-enhanced">Refunded On</span>
                  <span className="task-info-separator-enhanced">:</span>
                  <span className="task-info-value-enhanced">{formatDate(payment.refunded_on)}</span>
                </div>
                {payment.refund_note && (
                  <div className="task-info-row">
                    <span className="task-info-label-enhanced">Refund Note</span>
                    <span className="task-info-separator-enhanced">:</span>
                    <span className="task-info-value-enhanced">{payment.refund_note}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Reconciliation & Timestamps */}
        <Card className="w-full bg-transparent shadow-none border-none">
          <div className="figma-card-header">
            <div className="flex items-center gap-3">
              <div className="figma-card-icon-wrapper">
                <Clock className="figma-card-icon" />
              </div>
              <h3 className="figma-card-title">Reconciliation & Timestamps</h3>
            </div>
          </div>
          <div className="figma-card-content">
            <div className="task-info-enhanced">
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Reconciliation Status</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.recon_status || 'Not Reconciled'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Reconciled By</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.reconciled_by || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Reconciled On</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatDate(payment.reconciled_on)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Created At</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatDate(payment.created_at)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Updated At</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{formatDate(payment.updated_at)}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">Created By ID</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.created_by_id || '-'}</span>
              </div>
              <div className="task-info-row">
                <span className="task-info-label-enhanced">User ID</span>
                <span className="task-info-separator-enhanced">:</span>
                <span className="task-info-value-enhanced">{payment.user_id || '-'}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes (if applicable) */}
        {payment.notes && (
          <Card className="w-full bg-transparent shadow-none border-none">
            <div className="figma-card-header">
              <div className="flex items-center gap-3">
                <div className="figma-card-icon-wrapper">
                  <FileText className="figma-card-icon" />
                </div>
                <h3 className="figma-card-title">Notes</h3>
              </div>
            </div>
            <div className="figma-card-content">
              <p className="text-base text-gray-900">{payment.notes}</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PaymentDetailPage;
