import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';

const DetailPageSacHsn: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const baseUrl = localStorage.getItem('baseUrl') || 'oig-api.gophygital.work';
        const token = localStorage.getItem('token');
        const url = `https://${baseUrl}/pms/hsns/${encodeURIComponent(id)}.json`;
        const resp = await axios.get(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const payload = resp.data;
        // API might return { pms_hsn: {...} } or the object directly
        let result = null;
        if (!payload) result = null;
        else if (payload.pms_hsn) result = payload.pms_hsn;
        else result = payload;

        setItem(result);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch HSN detail');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const fmtDate = (d?: string) => (d ? new Date(d).toLocaleString('en-GB') : '-');

  const displayVal = (v: any) => {
    if (v === null || v === undefined) return '-';
    if (typeof v === 'string' && v.trim() === '') return '-';
    return v;
  };

  const displayDateField = (raw?: string, iso?: string) => {
    if (raw) return raw;
    if (iso) return fmtDate(iso);
    return '-';
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        {/* <div>
          <div className="text-sm text-muted-foreground">SAC/HSN Setup &gt; SAC/HSN Details</div>
          <h1 className="text-2xl font-bold">SAC/HSN DETAILS</h1>
        </div> */}
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-red-100 text-red-600 p-2">
            <Info className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-red-600">SAC/HSN INFORMATION</h2>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">Error: {error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium text-gray-900">{displayVal(item?.hsn_type ?? item?.type)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">SAC/HSN Code</div>
                <div className="font-medium text-gray-900">{displayVal(item?.code ?? item?.hsn_code)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">SGST Rate</div>
                <div className="font-medium text-gray-900">{displayVal(item?.sgst_rate ?? item?.sgst)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">Created On</div>
                <div className="font-medium text-gray-900">{displayDateField(item?.created_on, item?.created_at || item?.createdAt)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">Created By</div>
                <div className="font-medium text-gray-900">{displayVal(item?.created_by ?? item?.createdBy)}</div>
              </div>
            </div>

            <div>
              <div className="mb-4">
                <div className="text-sm text-gray-500">Category</div>
                <div className="font-medium text-gray-900">{displayVal(item?.category ?? item?.category_name)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">CGST Rate</div>
                <div className="font-medium text-gray-900">{displayVal(item?.cgst_rate ?? item?.cgst)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">IGST Rate</div>
                <div className="font-medium text-gray-900">{displayVal(item?.igst_rate ?? item?.igst)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">Updated On</div>
                <div className="font-medium text-gray-900">{displayDateField(item?.updated_on, item?.updated_at || item?.updatedAt)}</div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500">Active</div>
                <div className="font-medium text-gray-900">{item?.active ? 'Yes' : 'No'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPageSacHsn;