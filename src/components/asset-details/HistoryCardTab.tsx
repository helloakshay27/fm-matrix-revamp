
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
        {/* Basic Asset Info & Acquisition Details - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccordionItem value="basic-info" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Basic Asset Info</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableBody>
                      {basicAssetInfo.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium py-2">{item.label}</TableCell>
                          <TableCell className="py-2">{item.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="acquisition" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Acquisition Details</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableBody>
                      {acquisitionDetails.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium py-2">{item.label}</TableCell>
                          <TableCell className="py-2">{item.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </div>

        {/* Maintenance & Repair History - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccordionItem value="maintenance1" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Maintenance & Repair History</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>From Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceHistory1.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.assignedTo}</TableCell>
                          <TableCell>{item.fromLocation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="maintenance2" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Maintenance & Repair History</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceHistory2.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.performedBy}</TableCell>
                          <TableCell>{item.cost}</TableCell>
                          <TableCell>{item.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </div>

        {/* Cost & Depreciation - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccordionItem value="cost1" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Cost & Depreciation</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Amount Depreciated</TableHead>
                        <TableHead>Net Book Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costDepreciation1.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.year}</TableCell>
                          <TableCell>{item.amountDepreciated}</TableCell>
                          <TableCell>{item.netBookValue}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="cost2" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Cost & Depreciation</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Year</TableHead>
                        <TableHead>Depreciation %</TableHead>
                        <TableHead>Amount Depreciated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costDepreciation2.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.year}</TableCell>
                          <TableCell>{item.depreciationPercent}</TableCell>
                          <TableCell>{item.amountDepreciated}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </div>

        {/* Certification & Compliance and Audit & Inspections - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccordionItem value="certification" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Certification & Compliance</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Certificate No</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificationCompliance.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.certificateNo}</TableCell>
                          <TableCell>{item.expiry}</TableCell>
                          <TableCell>{item.status}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="audit" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Audit & Inspections</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Conducted By</TableHead>
                        <TableHead>Observations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditInspections.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>{item.conductedBy}</TableCell>
                          <TableCell>{item.observations}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </div>

        {/* EBOM Summary and Disposal Details - Side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccordionItem value="ebom" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">EBOM Summary</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ebomSummary.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.component}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.remarks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>

          <AccordionItem value="disposal" className="border rounded-lg">
            <Card>
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <CardTitle className="text-base font-semibold">Disposal / Write-Off Details</CardTitle>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0">
                  <Table>
                    <TableBody>
                      {disposalDetails.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium py-2">{item.label}</TableCell>
                          <TableCell className="py-2">{item.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        </div>
      </Accordion>
    </div>
  );
};
