import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Search } from 'lucide-react';

interface SiteTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  entriesPerPage: string;
  setEntriesPerPage: (entries: string) => void;
}

export const SiteTab: React.FC<SiteTabProps> = ({
  searchQuery,
  setSearchQuery,
  entriesPerPage,
  setEntriesPerPage
}) => {
  // Site state
  const [sites, setSites] = useState([
    { country: 'India', region: 'West', zone: 'Mumbai', site: 'Lockated', latitude: '19.0760', longitude: '72.8777', status: true, qrCode: '/placeholder.svg' },
  ]);

  const handleSiteStatusChange = (index: number, checked: boolean) => {
    const updatedSites = [...sites];
    updatedSites[index].status = checked;
    setSites(updatedSites);
  };

  const filteredSites = sites.filter(site =>
    site.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.site.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="text-sm text-gray-600">entries per page</span>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
            />
          </div>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold">Region</TableHead>
                <TableHead className="font-semibold">Zone</TableHead>
                <TableHead className="font-semibold">Site</TableHead>
                <TableHead className="font-semibold">Latitude</TableHead>
                <TableHead className="font-semibold">Longitude</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No sites found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSites.map((site, index) => (
                  <TableRow key={index}>
                    <TableCell>{site.country}</TableCell>
                    <TableCell>{site.region}</TableCell>
                    <TableCell>{site.zone}</TableCell>
                    <TableCell>{site.site}</TableCell>
                    <TableCell>{site.latitude}</TableCell>
                    <TableCell>{site.longitude}</TableCell>
                    <TableCell>
                      <Switch
                        checked={site.status}
                        onCheckedChange={(checked) => handleSiteStatusChange(index, checked)}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                        <img src={site.qrCode} alt="QR Code" className="w-6 h-6" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
