import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit, Loader2 } from 'lucide-react';
import { AddSiteModal } from '@/components/AddSiteModal';
import { siteService, SiteData } from '@/services/siteService';

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
  const [sites, setSites] = useState<SiteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteData | null>(null);

  // Fetch sites on component mount
  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setIsLoading(true);
    try {
      const sitesData = await siteService.getSites();
      setSites(sitesData);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSite = () => {
    setEditingSite(null);
    setIsModalOpen(true);
  };

  const handleEditSite = (site: SiteData) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleSiteAdded = () => {
    fetchSites(); // Refresh the list
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSite(null);
  };

  const filteredSites = sites.filter(site =>
    site.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.state?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Button 
          onClick={handleAddSite}
          className="bg-[#C72030] hover:bg-[#A91D2A] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Site
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Site Name</TableHead>
                <TableHead className="font-semibold">Company ID</TableHead>
                <TableHead className="font-semibold">Region ID</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="font-semibold">City</TableHead>
                <TableHead className="font-semibold">State</TableHead>
                <TableHead className="font-semibold">Latitude</TableHead>
                <TableHead className="font-semibold">Longitude</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="mt-2">Loading sites...</p>
                  </TableCell>
                </TableRow>
              ) : filteredSites.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No sites found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSites.map((site, index) => (
                  <TableRow key={site.id || index}>
                    <TableCell>{site.name}</TableCell>
                    <TableCell>{site.company_id}</TableCell>
                    <TableCell>{site.region_id}</TableCell>
                    <TableCell>{site.address || '-'}</TableCell>
                    <TableCell>{site.city || '-'}</TableCell>
                    <TableCell>{site.state || '-'}</TableCell>
                    <TableCell>{site.latitude || '-'}</TableCell>
                    <TableCell>{site.longitude || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSite(site)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddSiteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSiteAdded={handleSiteAdded}
        editingSite={editingSite}
      />
    </div>
  );
};
