import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity, Rss } from 'lucide-react';
import { FeedItem } from '../components/FeedItem';
import { Heading } from '../components/ui/heading';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getFeeds } from '@/store/slices/materialPRSlice';
import { format } from 'date-fns';

const formatedFeed = (data) => {
  const baseFeed = {
    date: format(new Date(data.created_at), 'MMM dd, yyyy'),
    time: format(new Date(data.created_at), 'hh:mm a'),
    user: data.user_name || 'Unknown User',
  };

  if (data.auditable_type === 'InvoiceApprovalHistory') {
    if (data.action === 'create') {
      return {
        ...baseFeed,
        description: 'Made below changes',
        type: data.invoice_approval_level || '',
        status: data.audited_changes.approve === null ? 'Pending' : data.audited_changes.approve ? 'Approved' : 'Rejected',
        reason: data.audited_changes.rejection_reason || '',
      };
    } else if (data.action === 'update') {
      let status;
      if (data.audited_changes.approve?.[1] === null) {
        status = 'Pending';
      } else if (data.audited_changes.approve?.[1]) {
        status = 'Approved';
      } else {
        status = 'Rejected';
      }
      return {
        ...baseFeed,
        description: 'Made below changes',
        type: data.invoice_approval_level || '',
        status,
        reason: data.audited_changes.rectify_comments?.[1] || data.audited_changes.rejection_reason?.[1] || '',
      };
    }
  }

  else if (data.auditable_type === 'DebitNote') {
    if (data.action === 'create') {
      return {
        ...baseFeed,
        description: `Created Debit Note ID ${data.auditable_id}`,
        type: data.audited_changes.note_type || 'Debit',
        amount: data.audited_changes.amount || '',
        note: data.audited_changes.note || '',
      };
    } else if (data.action === 'update' && data.audited_changes.approve) {
      return {
        ...baseFeed,
        description: `Approved Debit Note ID ${data.auditable_id}`,
      };
    }
  }

  else if (data.auditable_type === 'PaymentDetail') {
    const amountOf = data.audited_changes.amount_of || 'Payment';
    if (data.action === 'create') {
      return {
        ...baseFeed,
        description: `Created ${amountOf} Payment Entry ID ${data.auditable_id}`,
        amount: data.audited_changes.amount || '',
        paymentMode: data.audited_changes.payment_mode || '',
        transactionNumber: data.audited_changes.transaction_number || '',
        status: data.audited_changes.status || '',
        paymentDate: data.audited_changes.payment_date || '',
        note: data.audited_changes.note || '',
      };
    } else if (data.action === 'update') {
      return {
        ...baseFeed,
        description: `Updated ${amountOf} Payment Entry ID ${data.auditable_id}`,
        amount: data.audited_changes.amount?.[1] || '',
        paymentMode: data.audited_changes.payment_mode?.[1] || '',
        transactionNumber: data.audited_changes.transaction_number?.[1] || '',
        status: data.audited_changes.status?.[1] || '',
        paymentDate: data.audited_changes.payment_date?.[1] || '',
        note: data.audited_changes.note?.[1] || '',
      };
    }
  }

  else if (data.action === 'create') {
    return {
      ...baseFeed,
      description: `${data.auditable_type || 'Item'} Created`,
    };
  }

  return {
    ...baseFeed,
    description: 'Unknown action',
  };
};

export const MaterialPRFeedsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  const navigate = useNavigate();
  const { id } = useParams();
  const [feeds, setFeeds] = useState([]);
   const [apiCalls, setApiCalls] = useState([]);
  const [activeTab, setActiveTab] = useState<'feeds' | 'sap'>('feeds');  // ← new


  useEffect(() => {
    const fetchFeeds = async () => {
      try {
         const response = await dispatch(getFeeds({ baseUrl, token, id })).unwrap();
        setFeeds(response.feeds.map(formatedFeed));
        if (response.api_calls && Array.isArray(response.api_calls)) {
          setApiCalls(response.api_calls);
        }
      } catch (error) {
        console.error('Error fetching feeds:', error);
      }
    };
    fetchFeeds();
  }, [dispatch, baseUrl, token, id]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
   <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header — unchanged */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-1 hover:text-[#C72030] transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <span>•</span>
            <span>Material PR #{id}</span>
            <span>•</span>
            <span>Activity Feeds</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#C72030] rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <Heading level="h1" className="text-2xl font-bold text-gray-900 mb-1">
                Activity Feeds
              </Heading>
              <p className="text-gray-600 text-sm">
                Track all changes and approvals for this Material PR
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('feeds')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'feeds'
                ? 'border-[#C72030] text-[#C72030]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity Feeds
            {feeds.length > 0 && (
              <span className="ml-1 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                {feeds.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('sap')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === 'sap'
                ? 'border-[#C72030] text-[#C72030]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Rss className="w-4 h-4" />
            SAP API Logs
            {apiCalls.length > 0 && (
              <span className="ml-1 bg-gray-100 text-gray-600 text-xs rounded-full px-2 py-0.5">
                {apiCalls.length}
              </span>
            )}
          </button>
        </div>

        {/* Activity Feeds Tab */}
        {activeTab === 'feeds' && (
          <>
            <div className="space-y-4">
              {feeds.map((feed, index) => (
                <FeedItem key={index} feed={feed} index={index} />
              ))}
            </div>
            {feeds.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h3>
                <p className="text-gray-600">
                  Activity feeds will appear here as actions are taken on this Material PR.
                </p>
              </div>
            )}
          </>
        )}

        {/* SAP API Logs Tab */}
        {activeTab === 'sap' && (
          <>
            <div className="space-y-4">
              {apiCalls.map((apiCall, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Provider</p>
                      <p className="text-sm font-medium">{apiCall.api_provider || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">Response Status</p>
                      <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                        apiCall.response_status === 200
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {apiCall.response_status || '-'}
                      </span>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-500 font-semibold">Message</p>
                      <p className="text-sm bg-gray-50 p-2 rounded border border-gray-200 mt-1 font-mono whitespace-pre-wrap break-words">
                        {apiCall.message || '-'}
                      </p>
                    </div>
                    {apiCall.created_at && (
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-400">
                          Created: {new Date(apiCall.created_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {apiCalls.length === 0 && (
              <div className="text-center py-12">
                <Rss className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No SAP API logs yet</h3>
                <p className="text-gray-600">
                  SAP API call logs will appear here after pushing to SAP.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};