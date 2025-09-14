
import React, { useState, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { SurveyResponseTable } from '../components/SurveyResponseTable';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialDatePicker } from "@/components/ui/material-date-picker";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from '@/utils/apiClient';

interface Survey {
  id: number;
  name: string;
  active: number;
}

interface Site {
  id: number;
  name: string;
}

interface Building {
  id: number;
  name: string;
}

export const SurveyResponseDashboard = () => {
  const { toast } = useToast();
  const [selectedSurvey, setSelectedSurvey] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedWing, setSelectedWing] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  // Data states
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loadingSurveys, setLoadingSurveys] = useState(false);
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  // Initialize date range to today's date range (example: last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    const formatDate = (date: Date) => {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
    setDateRange(`${formatDate(thirtyDaysAgo)} - ${formatDate(today)}`);
  }, []);

  // Fetch surveys
  useEffect(() => {
    fetchSurveys();
    fetchSites();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoadingSurveys(true);
      const siteId = localStorage.getItem('site_id') || '2189';
      const response = await apiClient.get(`/pms/admin/snag_checklists.json?site_id=${siteId}`);
      setSurveys(response.data || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      toast({
        title: "Error",
        description: "Failed to fetch surveys",
        variant: "destructive"
      });
    } finally {
      setLoadingSurveys(false);
    }
  };

  const fetchSites = async () => {
    try {
      setLoadingSites(true);
      const response = await apiClient.get('/sites.json');
      setSites(response.data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoadingSites(false);
    }
  };

  const fetchBuildings = async (siteId: string) => {
    if (!siteId) return;
    
    try {
      setLoadingBuildings(true);
      const response = await apiClient.get('/buildings.json');
      setBuildings(response.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoadingBuildings(false);
    }
  };

  const handleSearch = () => {
    const filters = {
      selectedSurvey,
      dateRange,
      selectedSite,
      selectedBuilding,
      selectedWing,
      selectedArea,
      selectedFloor,
      selectedRoom
    };
    
    console.log('Searching with filters:', filters);
    
    toast({
      title: "Search Initiated",
      description: "Searching survey responses with applied filters",
    });
  };

  const handleReset = () => {
    setSelectedSurvey('');
    setSelectedSite('');
    setSelectedBuilding('');
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    
    // Reset date range to last 30 days
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    const formatDate = (date: Date) => {
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    };
    setDateRange(`${formatDate(thirtyDaysAgo)} - ${formatDate(today)}`);
    
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to default values",
    });
  };

  // Handle site change to fetch buildings
  const handleSiteChange = (siteId: string) => {
    setSelectedSite(siteId);
    setSelectedBuilding(''); // Reset building when site changes
    setSelectedWing('');
    setSelectedArea('');
    setSelectedFloor('');
    setSelectedRoom('');
    
    if (siteId) {
      fetchBuildings(siteId);
    } else {
      setBuildings([]);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Survey Response</h2>
          <p className="text-muted-foreground">
            Survey &gt; Survey Response
          </p>
        </div>
      </div>
      
      {/* Filters Section */}
      <div className="bg-white rounded-lg border border-[#D5DbDB] p-6 space-y-6">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Survey</label>
            <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder={loadingSurveys ? "Loading surveys..." : "Select Survey"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                {surveys.map((survey) => (
                  <SelectItem key={survey.id} value={survey.id.toString()}>
                    {survey.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Date Range</label>
            <MaterialDatePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder="Select date range"
              className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]"
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Site</label>
            <Select value={selectedSite} onValueChange={handleSiteChange}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder={loadingSites ? "Loading sites..." : "Select Site"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id.toString()}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Building</label>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding} disabled={!selectedSite}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder={loadingBuildings ? "Loading buildings..." : "Select Building"} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                {buildings.map((building) => (
                  <SelectItem key={building.id} value={building.id.toString()}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Wing</label>
            <Select value={selectedWing} onValueChange={setSelectedWing}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Wing" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="east-wing">East Wing</SelectItem>
                <SelectItem value="west-wing">West Wing</SelectItem>
                <SelectItem value="north-wing">North Wing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Area</label>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="lobby">Lobby</SelectItem>
                <SelectItem value="workspace">Workspace</SelectItem>
                <SelectItem value="cafeteria">Cafeteria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Third Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Floor</label>
            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="ground">Ground Floor</SelectItem>
                <SelectItem value="first">1st Floor</SelectItem>
                <SelectItem value="second">2nd Floor</SelectItem>
                <SelectItem value="third">3rd Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Select Room</label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="border-[#D5DbDB] focus:ring-[#C72030] focus:border-[#C72030]">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#D5DbDB] z-50">
                <SelectItem value="room-101">Room 101</SelectItem>
                <SelectItem value="room-102">Room 102</SelectItem>
                <SelectItem value="conference-a">Conference Room A</SelectItem>
                <SelectItem value="conference-b">Conference Room B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleSearch}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 rounded flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8 py-2 rounded flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
      
      {/* Survey Response Table */}
      <SurveyResponseTable />
    </div>
  );
};
