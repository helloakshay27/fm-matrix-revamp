import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';
import { FeedItem } from '../components/FeedItem';
import { Heading } from '../components/ui/heading';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { format } from 'date-fns';
import { getServiceFeeds } from '@/store/slices/servicePRSlice';

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

export const ServicePRFeedsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  const navigate = useNavigate();
  const { id } = useParams();
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await dispatch(getServiceFeeds({ baseUrl, token, id })).unwrap();
        setFeeds(response.feeds.map(formatedFeed));
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
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
              onClick={handleBack}
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
      </div>
    </div>
  );
};
