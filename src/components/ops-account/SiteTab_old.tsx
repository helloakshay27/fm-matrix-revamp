import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Plus, Edit, Loader2, MapPin, Clock } from 'lucide-react';
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
    site.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.name_with_zone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.pms_region?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.pms_region?.headquarter?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.pms_zone?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search sites, regions, zones, countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[#C72030]"
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
          <TooltipProvider>
            <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Site Name</TableHead>
                <TableHead className="font-semibold">Region</TableHead>
                <TableHead className="font-semibold">Zone</TableHead>
                <TableHead className="font-semibold">Country</TableHead>
                <TableHead className="font-semibold">Address</TableHead>
                <TableHead className="font-semibold">City</TableHead>
                <TableHead className="font-semibold">State</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
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
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{site.name}</span>
                        {site.name_with_zone && site.name_with_zone !== site.name && (
                          <span className="text-xs text-gray-500">{site.name_with_zone}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{site.pms_region?.name || site.region_id || '-'}</TableCell>
                    <TableCell>{site.pms_zone?.name || '-'}</TableCell>
                    <TableCell>{site.pms_region?.headquarter?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="max-w-32 truncate" title={site.address || '-'}>
                        {site.address || '-'}
                      </div>
                    </TableCell>
                    <TableCell>{site.city || '-'}</TableCell>
                    <TableCell>{site.state || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={site.active ? 'default' : 'destructive'} className="text-xs">
                          {site.active ? 'Active' : 'Inactive'}
                        </Badge>
                        {site.amenities && site.amenities.length > 0 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-xs">
                                  {site.amenities.length} amenities
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="max-w-48">
                                  <p className="font-semibold mb-1">Amenities:</p>
                                  <ul className="text-xs">
                                    {site.amenities.slice(0, 5).map((amenity, i) => (
                                      <li key={i}>• {amenity.name}</li>
                                    ))}
                                    {site.amenities.length > 5 && (
                                      <li>• ... and {site.amenities.length - 5} more</li>
                                    )}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSite(site)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {site.location_url && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(site.location_url, '_blank')}
                                className="h-8 w-8 p-0"
                              >
                                <MapPin className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View on Map</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </TooltipProvider>
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
