
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const HistoryCardTab = () => {
  const basicAssetInfo = [
    { label: 'Asset Name', value: 'CCTV-Server—Parking Lot' },
    { label: 'Asset Code', value: 'AST-CCTV-034' },
    { label: 'Category', value: 'IT Equipment' },
    { label: 'Current Status', value: 'Active' },
    { label: 'Location', value: 'Basement 2: Tower A' },
    { label: 'Responsible Dept.', value: 'IT Infrastructure' }
  ];

  const acquisitionDetails = [
    { label: 'Acquisition Date', value: '15-Feb-2022' },
    { label: 'Vendor', value: 'ABC Tech Pvt Ltd' },
    { label: 'Purchase Order No.', value: 'PO-2022-1043' },
    { label: 'Purchase Cost', value: '₹ 1,50,300' },
    { label: 'Warranty Period', value: '2 Years' },
    { label: 'Under AMC', value: 'Yes' }
  ];

  const maintenanceHistory1 = [
    { date: '01-Mar-2032', assignedTo: 'IT Dept.', fromLocation: 'Store' },
    { date: '01-Apr-2023', assignedTo: 'Mainten.', fromLocation: 'Basement-2 Workshop' }
  ];

  const maintenanceHistory2 = [
    { date: '10-Jun-2023', performedBy: 'TechServe', cost: '₹ 1,000', status: 'Complete' },
    { date: '05-Sep-2023', performedBy: 'Internal Team', cost: '₹ 5,000', status: 'Complete' }
  ];

  const costDepreciation1 = [
    { year: '2022', amountDepreciated: '₹ 22,500', netBookValue: '₹ 1,08,375' }
  ];

  const costDepreciation2 = [
    { year: '2022', depreciationPercent: '15 %', amountDepreciated: '₹ 02,500', netValue: '₹ 1,21,500' },
    { year: '2023', depreciationPercent: '15 %', amountDepreciated: '₹ 19,125', netValue: '₹ 1,0,875' }
  ];

  const certificationCompliance = [
    { type: 'Insurance', certificateNo: 'INS-CCTV-2022', expiry: '15-Feb-2024', status: 'Active' },
    { type: 'Fitness', certificateNo: 'FIT-CCTV-2023', expiry: '15-Feb-2025', status: 'Valid' }
  ];

  const auditInspections = [
    { date: '15-Dec', conductedBy: 'Working fine', observations: 'Working fine' },
    { date: '10-Jun', conductedBy: 'Recommend HDD backup', observations: 'Recommend HDD backup' }
  ];

  const ebomSummary = [
    { component: 'CAT6 Cable', quantity: '150 meters', remarks: 'For parking layout' },
    { component: 'Dome Camera', quantity: '12 units', remarks: 'Linked with this asset' }
  ];

  const disposalDetails = [
    { label: 'Disposal Date', value: '01-Jan-2025' },
    { label: 'Mode', value: 'Write-off' },
    { label: 'Final Status', value: 'Disposed' },
    { label: 'Approved By', value: 'Facility Head' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-5 h-5 text-[#C72030]" />
        <h2 className="text-xl font-bold text-gray-900">History In Details</h2>
      </div>

      <Accordion type="multiple" defaultValue={["basic-info", "acquisition", "maintenance1", "maintenance2", "cost1", "cost2", "certification", "audit", "ebom", "disposal"]} className="space-y-4">
        {/* Basic Asset Info */}
        <AccordionItem value="basic-info" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Basic Asset Info</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {basicAssetInfo.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">{item.label}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Acquisition Details */}
        <AccordionItem value="acquisition" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Acquisition Details</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {acquisitionDetails.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">{item.label}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Maintenance & Repair History 1 */}
        <AccordionItem value="maintenance1" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Maintenance & Repair History</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assigned To</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">From Location</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {maintenanceHistory1.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.assignedTo}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.fromLocation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Maintenance & Repair History 2 */}
        <AccordionItem value="maintenance2" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Maintenance & Repair History</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Performed By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cost</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {maintenanceHistory2.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.performedBy}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.cost}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Cost & Depreciation 1 */}
        <AccordionItem value="cost1" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Cost & Depreciation</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Year</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount Depreciated</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Net Book Value</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {costDepreciation1.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.year}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.amountDepreciated}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.netBookValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Cost & Depreciation 2 */}
        <AccordionItem value="cost2" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Cost & Depreciation</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Year</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Depreciation %</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Amount Depreciated</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {costDepreciation2.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.year}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.depreciationPercent}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.amountDepreciated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Certification & Compliance */}
        <AccordionItem value="certification" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Certification & Compliance</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Certificate No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expiry</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {certificationCompliance.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.type}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.certificateNo}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.expiry}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Audit & Inspections */}
        <AccordionItem value="audit" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Audit & Inspections</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Conducted By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Observations</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditInspections.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.conductedBy}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.observations}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* EBOM Summary */}
        <AccordionItem value="ebom" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">EBOM Summary</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Component</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ebomSummary.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.component}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Disposal / Write-Off Details */}
        <AccordionItem value="disposal" className="border rounded-lg">
          <Card>
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="text-base font-semibold">Disposal / Write-Off Details</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <tbody className="bg-white divide-y divide-gray-200">
                      {disposalDetails.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">{item.label}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
