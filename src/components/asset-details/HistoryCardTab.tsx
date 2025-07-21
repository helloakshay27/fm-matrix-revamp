
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        {basicAssetInfo.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center font-medium text-gray-700">{item.label}</TableCell>
                            <TableCell className="p-4 text-center text-gray-900">{item.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        {acquisitionDetails.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center font-medium text-gray-700">{item.label}</TableCell>
                            <TableCell className="p-4 text-center text-gray-900">{item.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#f6f4ee] text-center">Date</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Assigned To</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">From Location</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {maintenanceHistory1.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center">{item.date}</TableCell>
                            <TableCell className="p-4 text-center">{item.assignedTo}</TableCell>
                            <TableCell className="p-4 text-center">{item.fromLocation}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#f6f4ee] text-center">Date</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Performed By</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Cost</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {maintenanceHistory2.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center">{item.date}</TableCell>
                            <TableCell className="p-4 text-center">{item.performedBy}</TableCell>
                            <TableCell className="p-4 text-center">{item.cost}</TableCell>
                            <TableCell className="p-4 text-center">{item.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#f6f4ee] text-center">Year</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Amount Depreciated</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Net Book Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costDepreciation1.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center">{item.year}</TableCell>
                            <TableCell className="p-4 text-center">{item.amountDepreciated}</TableCell>
                            <TableCell className="p-4 text-center">{item.netBookValue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#f6f4ee] text-center">Year</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Depreciation %</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Amount Depreciated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {costDepreciation2.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center">{item.year}</TableCell>
                            <TableCell className="p-4 text-center">{item.depreciationPercent}</TableCell>
                            <TableCell className="p-4 text-center">{item.amountDepreciated}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#f6f4ee] text-center">Type</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Certificate No</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Expiry</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {certificationCompliance.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center">{item.type}</TableCell>
                            <TableCell className="p-4 text-center">{item.certificateNo}</TableCell>
                            <TableCell className="p-4 text-center">{item.expiry}</TableCell>
                            <TableCell className="p-4 text-center">{item.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#f6f4ee] text-center">Date</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Conducted By</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Observations</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {auditInspections.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center">{item.date}</TableCell>
                            <TableCell className="p-4 text-center">{item.conductedBy}</TableCell>
                            <TableCell className="p-4 text-center">{item.observations}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="bg-[#f6f4ee] text-center">Component</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Quantity</TableHead>
                          <TableHead className="bg-[#f6f4ee] text-center">Remarks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ebomSummary.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center">{item.component}</TableCell>
                            <TableCell className="p-4 text-center">{item.quantity}</TableCell>
                            <TableCell className="p-4 text-center">{item.remarks}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                <div className="bg-white rounded-lg border border-[#D5DbDB] overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        {disposalDetails.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="p-4 text-center font-medium text-gray-700">{item.label}</TableCell>
                            <TableCell className="p-4 text-center text-gray-900">{item.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
