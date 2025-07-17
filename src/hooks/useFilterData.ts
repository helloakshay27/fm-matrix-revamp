import { useState, useEffect } from 'react';
import { apiClient } from '@/utils/apiClient';

// Data types based on API responses
interface Group {
  id: number;
  name: string;
}

interface Subgroup {
  id: number;
  name: string;
}

interface Site {
  id: number;
  name: string;
}

interface Building {
  building: {
    id: number;
    name: string;
    has_wing: boolean;
    has_floor: boolean;
    has_area: boolean;
    has_room: boolean;
    available_seats: number | null;
    available_parkings: number | null;
  };
}

interface Wing {
  wings: {
    id: number;
    name: string;
  };
}

interface Area {
  id: number;
  name: string;
}

interface Floor {
  id: number;
  name: string;
}

interface Room {
  rooms: {
    id: number;
    name: string;
  };
}

interface Department {
  id: number;
  department_name: string;
  site_id: number;
  company_id: number;
  active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  site_name: string;
}

interface User {
  id: number;
  full_name: string;
}

export const useFilterData = () => {
  // Groups and Subgroups
  const [groups, setGroups] = useState<Group[]>([]);
  const [subgroups, setSubgroups] = useState<Subgroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [loadingSubgroups, setLoadingSubgroups] = useState(false);

  // Location hierarchy
  const [sites, setSites] = useState<Site[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [wings, setWings] = useState<Wing[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Loading states
  const [loadingSites, setLoadingSites] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingWings, setLoadingWings] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingFloors, setLoadingFloors] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);

  // Allocated To data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch groups on mount
  useEffect(() => {
    fetchGroups();
    fetchSites();
    fetchDepartments();
    fetchUsers();
  }, []);

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const response = await apiClient.get('/pms/get_asset_group_sub_group.json');
      setGroups(response.data.groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoadingGroups(false);
    }
  };

  const fetchSubgroups = async (groupId: number) => {
    setLoadingSubgroups(true);
    try {
      const response = await apiClient.get(`/pms/get_asset_group_sub_group.json?group_id=${groupId}`);
      setSubgroups(response.data.subgroups || []);
    } catch (error) {
      console.error('Error fetching subgroups:', error);
    } finally {
      setLoadingSubgroups(false);
    }
  };

  const fetchSites = async () => {
    setLoadingSites(true);
    try {
      const response = await apiClient.get('/pms/sites.json');
      setSites(response.data.sites || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoadingSites(false);
    }
  };

  const fetchBuildings = async (siteId: number) => {
    setLoadingBuildings(true);
    try {
      const response = await apiClient.get(`/pms/sites/${siteId}/buildings.json`);
      setBuildings(response.data.buildings || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
    } finally {
      setLoadingBuildings(false);
    }
  };

  const fetchWings = async (buildingId: number) => {
    setLoadingWings(true);
    try {
      const response = await apiClient.get(`/pms/buildings/${buildingId}/wings.json`);
      setWings(response.data || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
    } finally {
      setLoadingWings(false);
    }
  };

  const fetchAreas = async (wingId: number) => {
    setLoadingAreas(true);
    try {
      const response = await apiClient.get(`/pms/wings/${wingId}/areas.json`);
      setAreas(response.data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
    } finally {
      setLoadingAreas(false);
    }
  };

  const fetchFloors = async (areaId: number) => {
    setLoadingFloors(true);
    try {
      const response = await apiClient.get(`/pms/areas/${areaId}/floors.json`);
      setFloors(response.data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
    } finally {
      setLoadingFloors(false);
    }
  };

  const fetchRooms = async (floorId: number) => {
    setLoadingRooms(true);
    try {
      const response = await apiClient.get(`/pms/floors/${floorId}/rooms.json`);
      setRooms(response.data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const response = await apiClient.get('/pms/departments.json');
      setDepartments(response.data.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoadingDepartments(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await apiClient.get('/pms/users/get_escalate_to_users.json');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Reset functions for cascading dropdowns
  const resetLocationFromBuilding = () => {
    setWings([]);
    setAreas([]);
    setFloors([]);
    setRooms([]);
  };

  const resetLocationFromWing = () => {
    setAreas([]);
    setFloors([]);
    setRooms([]);
  };

  const resetLocationFromArea = () => {
    setFloors([]);
    setRooms([]);
  };

  const resetLocationFromFloor = () => {
    setRooms([]);
  };

  return {
    // Groups and Subgroups
    groups,
    subgroups,
    loadingGroups,
    loadingSubgroups,
    fetchSubgroups,

    // Location hierarchy
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
    resetLocationFromBuilding,
    resetLocationFromWing,
    resetLocationFromArea,
    resetLocationFromFloor,

    // Allocated To
    departments,
    users,
    loadingDepartments,
    loadingUsers,
  };
};