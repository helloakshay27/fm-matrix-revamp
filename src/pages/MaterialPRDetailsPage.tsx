import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from 'react-router-dom';
import { Copy, Printer, Rss, Download } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { getMaterialPRById } from '@/store/slices/materialPRSlice';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'sonner';
import { numberToIndianCurrencyWords } from '@/utils/amountToText';

export const MaterialPRDetailsPage = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');

  const navigate = useNavigate();
  const { id } = useParams();

  const [pr, setPR] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getMaterialPRById({ baseUrl, token, id })).unwrap();
        setPR(response);
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, []);

  const handleSendToSap = async () => {
    try {
      const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}.json?send_sap=yes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send to SAP");
    }
  }

  const handleClone = () => {
    navigate(`/finance/material-pr/clone/${id}`);
  };
  const handleFeeds = () => {
    navigate(`/finance/material-pr/feeds/${id}`);
  };
  const handlePrint = () => {

  };
  return <div className="p-6 mx-auto max-w-7xl">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold">Material PR Details</h1>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {
          pr.show_send_sap_yes && (
            <Button
              size="sm"
              variant="outline"
              className="border-gray-300 bg-purple-600 text-white sap_button"
              onClick={handleSendToSap}
            >
              Send To SAP Team
            </Button>
          )
        }
        <Button variant="outline" size="sm" onClick={handleClone}>
          <Copy className="w-4 h-4 mr-2" />
          Clone
        </Button>
        <Button variant="outline" size="sm" onClick={handleFeeds}>
          <Rss className="w-4 h-4 mr-2" />
          Feeds
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
      </div>
    </div>

    <div className='flex items-start gap-4 my-6'>
      {
        pr?.approval_levels?.map(level => (
          <div className='space-y-3'>
            <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-md font-medium w-max">
              {`${level.name} approved : ${level.status_label}`}
            </div>
            {
              level.approved_by && level.approval_date &&
              <div className='ms-2'>
                {
                  `${level.approved_by} (${level.approval_date})`
                }
              </div>
            }
          </div>
        ))
      }
    </div>

    <div className="space-y-6">
      {/* Contact Information Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex">
                <span className="text-muted-foreground w-24">Phone</span>
                <span className="font-medium">: {pr.billing_address?.phone || 'NA'}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">Email</span>
                <span className="font-medium">: {pr.billing_address?.email}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">PAN</span>
                <span className="font-medium">: {pr.billing_address?.pan_number}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-muted-foreground w-24">Fax</span>
                <span className="font-medium">: {pr.billing_address?.fax}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">GST</span>
                <span className="font-medium">: {pr.billing_address?.gst_number}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-24">Address</span>
                <span className="font-medium">: {pr.billing_address?.address}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Material PR Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Material Purchase Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex">
                <span className="text-muted-foreground w-40">MPR No.</span>
                <span className="font-medium">: {pr.external_id}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">MPR Date</span>
                <span className="font-medium">: {pr?.po_date && format(pr.po_date, 'dd-MM-yyyy')}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Plant Detail</span>
                <span className="font-medium">: {pr.plantDetail}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Address</span>
                <span className="font-medium">: {pr.supplier?.address}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Related To</span>
                <span className="font-medium">: {pr.related_to}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex">
                <span className="text-muted-foreground w-40">Reference No.</span>
                <span className="font-medium">: {pr.reference_number}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">ID</span>
                <span className="font-medium">: {pr.id}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Supplier</span>
                <span className="font-medium">: {pr.supplier?.company_name}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Email</span>
                <span className="font-medium">: {pr.supplier?.email}</span>
              </div>
              <div className="flex">
                <span className="text-muted-foreground w-40">Admin Approval</span>
                <span className="font-medium">: {pr.adminApproval}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Items Table Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Items Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">S No.</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Item</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Availability</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">SAC/HSN Code</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Expected Date</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Product Description</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Quantity</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Unit</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Moving Avg Rate</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Rate</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Amount</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Approved Qty</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Transfer Qty</th>
                  <th className="border border-border px-3 py-2 text-sm text-left font-medium">Wbs Code</th>
                </tr>
              </thead>
              <tbody>
                {pr?.pms_pr_inventories?.map((item, index) => <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                  <td className="border border-border px-3 py-2 text-sm">{index + 1}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.inventory.name}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.availability}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.sacHsnCode}</td>
                  <td className="border border-border px-3 py-2 text-sm">{format(item.expected_date, 'dd-MM-yyyy')}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.prod_desc}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.quantity}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.unit}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.total_value}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.rate}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.total_value}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.approved_qty}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.transfer_qty}</td>
                  <td className="border border-border px-3 py-2 text-sm">{item.wbs_code}</td>
                </tr>)}
              </tbody>
            </table>
          </div>

          {/* Net Amount Summary */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="text-lg font-semibold">Net Amount(INR): ₹{pr.total_amount}</div>
                <div className="text-sm text-muted-foreground">Amount In Words: {numberToIndianCurrencyWords(pr.total_amount)}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attachments Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          {pr.attachments === 'No attachments' ? (
            <p className="text-muted-foreground">{pr.attachments}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {pr?.attachments?.map((file, idx) => {
                const fileUrl = file.url; // or your path from backend
                const fileName = file.name || `Attachment-${idx + 1}`;
                const fileExt = fileUrl.split('.').pop().toLowerCase();

                if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt)) {
                  return (
                    <div key={idx} className="flex flex-col items-start gap-2">
                      <img
                        src={fileUrl}
                        alt={fileName}
                        className="max-h-40 w-40 rounded border"
                      />
                    </div>
                  );
                } else if (fileExt === 'pdf') {
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <iframe
                        src={fileUrl}
                        className="w-40 h-40 border rounded"
                        title={fileName}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <a
                        href={fileUrl}
                        download={fileName}
                        className="text-blue-500 underline text-sm"
                      >
                        {fileName}
                      </a>
                    </div>
                  );
                }
              })}
            </div>
          )}
        </CardContent>
      </Card>


      {/* Terms & Conditions Card */}
      <Card className="shadow-sm border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{pr.terms_conditions}</p>
        </CardContent>
      </Card>

      {/* SAP Response Card */}

    </div>
  </div>;
};