import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/apiClient';

export interface FilterOption {
  id: number;
  name: string;
}

export interface GroupSubGroupData {
  asset_groups: FilterOption[];
  asset_sub_groups: FilterOption[];
}

export const useFilterData = () => {
  // Group and Subgroup data
  const [groups, setGroups] = useState<FilterOption[]>([]);
  const [subgroups, setSubgroups] = useState<FilterOption[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubgroups, setLoadingSubgroups] = useState(false);

  // Location data
  const [sites, setSites] = useState<FilterOption[]>([]);
  const [buildings, setBuildings] = useState<FilterOption[]>([]);
  const [wings, setWings] = useState<FilterOption[]>([]);
  const [areas, setAreas] = useState<FilterOption[]>([]);
  const [floors, setFloors] = useState<FilterOption[]>([]);
  const [rooms, setRooms] = useState<FilterOption[]>([]);

  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Fetch initial groups
  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await apiClient.get<GroupSubGroupData>('/pms/get_asset_group_sub_group.json');
      setGroups(response.data.asset_groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Fetch subgroups based on selected group
  const fetchSubgroups = async (groupId: number) => {
    setLoadingSubgroups(true);
    try {
      const response = await apiClient.get<GroupSubGroupData>(`/pms/get_asset_group_sub_group.json?group_id=${groupId}`);
      setSubgroups(response.data.asset_sub_groups || []);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
      setSubgroups([]);
    } finally {
      setLoadingSubgroups(false);
    }
  };

  // Fetch sites
  const fetchSites = async () => {
    setLoadingSites(true);
    try {
      const response = await apiClient.get<FilterOption[]>('/pms/sites.json');
      setSites(response.data || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoadingSites(false);
    }
  };

  // Fetch buildings based on selected site
  const fetchBuildings = async (siteId: number) => {
    setLoadingBuildings(true);
    try {
      const response = await apiClient.get<FilterOption[]>(`/pms/sites/${siteId}/buildings.json`);
      setBuildings(response.data || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    } finally {
      setLoadingBuildings(false);
    }
  };

  // Fetch wings based on selected building
  const fetchWings = async (buildingId: number) => {
    setLoadingWings(true);
    try {
      const response = await apiClient.get<FilterOption[]>(`/pms/buildings/${buildingId}/wings.json`);
      setWings(response.data || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    } finally {
      setLoadingWings(false);
    }
  };

  // Fetch areas based on selected wing
  const fetchAreas = async (wingId: number) => {
    setLoadingAreas(true);
    try {
      const response = await apiClient.get<FilterOption[]>(`/pms/wings/${wingId}/areas.json`);
      setAreas(response.data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoadingAreas(false);
    }
  };

  // Fetch floors based on selected area
  const fetchFloors = async (areaId: number) => {
    setLoadingFloors(true);
    try {
      const response = await apiClient.get<FilterOption[]>(`/pms/areas/${areaId}/floors.json`);
      setFloors(response.data || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
    } finally {
      setLoadingFloors(false);
    }
  };

  // Fetch rooms based on selected floor
  const fetchRooms = async (floorId: number) => {
    setLoadingRooms(true);
    try {
      const response = await apiClient.get<FilterOption[]>(`/pms/floors/${floorId}/rooms.json`);
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Clear dependent dropdowns
  const clearDependentData = (level: 'group' | 'site' | 'building' | 'wing' | 'area' | 'floor') => {
    switch (level) {
      case 'group':
        setSubgroups([]);
        break;
      case 'site':
        setBuildings([]);
        setWings([]);
        setAreas([]);
        setFloors([]);
        setRooms([]);
        break;
      case 'building':
        setWings([]);
        setAreas([]);
        setFloors([]);
        setRooms([]);
        break;
      case 'wing':
        setAreas([]);
        setFloors([]);
        setRooms([]);
        break;
      case 'area':
        setFloors([]);
        setRooms([]);
        break;
      case 'floor':
        setRooms([]);
        break;
    }
  };

  // Initialize data on mount
  useEffect(() => {
    fetchGroups();
    fetchSites();
  }, []);

  return {
    // Group/Subgroup
    groups,
    subgroups,
    loadingGroups,
    loadingSubgroups,
    fetchSubgroups,
    
    // Location
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loadingSites,
    loadingBuildings,
    loadingWings,
    loadingAreas,
    loadingFloors,
    loadingRooms,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
    clearDependentData,
  };
};