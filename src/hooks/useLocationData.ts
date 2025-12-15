import { useState, useEffect } from 'react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

interface Site {
  id: number;
  name: string;
}

interface Building {
  id: number;
  name: string;
  has_wing?: boolean;
  has_floor?: boolean;
  has_area?: boolean;
  has_room?: boolean;
  available_seats?: number | null;
  available_parkings?: number | null;
}

interface Wing {
  id: number;
  name: string;
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
  id: number;
  name: string;
}

export const useLocationData = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [wings, setWings] = useState<Wing[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState({
    sites: false,
    buildings: false,
    wings: false,
    areas: false,
    floors: false,
    rooms: false,
  });

  // Fetch sites
  const fetchSites = async () => {
    setLoading(prev => ({ ...prev, sites: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/sites.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Sites response data:', data);
      setSites(data.sites || []);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setSites([]);
    } finally {
      setLoading(prev => ({ ...prev, sites: false }));
    }
  };

  // Fetch buildings
  const fetchBuildings = async (siteId: number) => {
    if (!siteId) {
      setBuildings([]);
      return;
    }

    console.log('fetchBuildings called with siteId:', siteId);
    setLoading(prev => ({ ...prev, buildings: true }));
    try {
      const url = `${API_CONFIG.BASE_URL}/pms/sites/${siteId}/buildings.json`;
      console.log('Fetching buildings from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      console.log('Buildings response status:', response.status);
      const data = await response.json();
      console.log('Buildings response data:', data);

      setBuildings(data.buildings || []);
    } catch (error) {
      console.error('Error fetching buildings:', error);
      setBuildings([]);
    } finally {
      setLoading(prev => ({ ...prev, buildings: false }));
    }
  };

  // Fetch wings
  const fetchWings = async (buildingId: number) => {
    if (!buildingId) {
      setWings([]);
      return;
    }

    console.log('fetchWings called with buildingId:', buildingId);
    setLoading(prev => ({ ...prev, wings: true }));
    try {
      const url = `${API_CONFIG.BASE_URL}/pms/wings.json?q[building_id_eq]=${buildingId}`;
      console.log('Fetching wings from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      console.log('Wings response status:', response.status);
      const data = await response.json();
      console.log('Wings response data:', data);
      setWings(data.wings || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    } finally {
      setLoading(prev => ({ ...prev, wings: false }));
    }
  };

  // Fetch areas
  const fetchAreas = async (wingId: number, buildingId?: number) => {
    if (!wingId && !buildingId) {
      setAreas([]);
      return;
    }

    console.log('fetchAreas called with wingId:', wingId, 'buildingId:', buildingId);
    setLoading(prev => ({ ...prev, areas: true }));
    try {
      // Build URL with both wing_id and building_id as query params
      const params = new URLSearchParams();
      if (wingId) params.append('q[wing_id_eq]', wingId.toString());
      if (buildingId) params.append('q[building_id_eq]', buildingId.toString());

      const url = `${API_CONFIG.BASE_URL}/pms/areas.json?${params.toString()}`;
      console.log('Fetching areas from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      console.log('Areas response status:', response.status);
      const data = await response.json();
      console.log('Areas response data:', data);
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoading(prev => ({ ...prev, areas: false }));
    }
  };

  // Fetch floors
  const fetchFloors = async (areaId: number, buildingId?: number, wingId?: number) => {
    if (!areaId && !buildingId) {
      setFloors([]);
      return;
    }

    console.log('fetchFloors called with areaId:', areaId, 'buildingId:', buildingId, 'wingId:', wingId);
    setLoading(prev => ({ ...prev, floors: true }));
    try {
      // Build URL with area_id, building_id, and wing_id as query params
      const params = new URLSearchParams();
      if (areaId) params.append('q[area_id_eq]', areaId.toString());
      if (buildingId) params.append('q[building_id_eq]', buildingId.toString());
      if (wingId) params.append('q[wing_id_eq]', wingId.toString());

      const url = `${API_CONFIG.BASE_URL}/pms/floors.json?${params.toString()}`;
      console.log('Fetching floors from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      console.log('Floors response status:', response.status);
      const data = await response.json();
      console.log('Floors response data:', data);
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
    } finally {
      setLoading(prev => ({ ...prev, floors: false }));
    }
  };

  // Fetch rooms
  const fetchRooms = async (floorId: number, buildingId?: number, wingId?: number, areaId?: number) => {
    if (!floorId && !buildingId) {
      setRooms([]);
      return;
    }

    console.log('fetchRooms called with floorId:', floorId, 'buildingId:', buildingId, 'wingId:', wingId, 'areaId:', areaId);
    setLoading(prev => ({ ...prev, rooms: true }));
    try {
      // Build URL with floor_id, building_id, wing_id, and area_id as query params
      const params = new URLSearchParams();
      if (floorId) params.append('q[floor_id_eq]', floorId.toString());
      if (buildingId) params.append('q[building_id_eq]', buildingId.toString());
      if (wingId) params.append('q[wing_id_eq]', wingId.toString());
      if (areaId) params.append('q[area_id_eq]', areaId.toString());

      const url = `${API_CONFIG.BASE_URL}/pms/rooms.json?${params.toString()}`;
      console.log('Fetching rooms from URL:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });

      console.log('Rooms response status:', response.status);
      const data = await response.json();
      console.log('Rooms response data:', data);

      // Handle both array format and object with rooms property
      if (Array.isArray(data)) {
        setRooms(data);
      } else {
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    } finally {
      setLoading(prev => ({ ...prev, rooms: false }));
    }
  };

  // Load sites on mount
  useEffect(() => {
    fetchSites();
  }, []);

  return {
    sites,
    buildings,
    wings,
    areas,
    floors,
    rooms,
    loading,
    fetchBuildings,
    fetchWings,
    fetchAreas,
    fetchFloors,
    fetchRooms,
  };
};
