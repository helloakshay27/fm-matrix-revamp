import { useState, useEffect } from 'react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

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

    setLoading(prev => ({ ...prev, buildings: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/sites/${siteId}/buildings.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
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

    setLoading(prev => ({ ...prev, wings: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/buildings/${buildingId}/wings.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setWings(data || []);
    } catch (error) {
      console.error('Error fetching wings:', error);
      setWings([]);
    } finally {
      setLoading(prev => ({ ...prev, wings: false }));
    }
  };

  // Fetch areas
  const fetchAreas = async (wingId: number) => {
    if (!wingId) {
      setAreas([]);
      return;
    }

    setLoading(prev => ({ ...prev, areas: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/wings/${wingId}/areas.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    } finally {
      setLoading(prev => ({ ...prev, areas: false }));
    }
  };

  // Fetch floors
  const fetchFloors = async (areaId: number) => {
    if (!areaId) {
      setFloors([]);
      return;
    }

    setLoading(prev => ({ ...prev, floors: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/areas/${areaId}/floors.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setFloors(data.floors || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
      setFloors([]);
    } finally {
      setLoading(prev => ({ ...prev, floors: false }));
    }
  };

  // Fetch rooms
  const fetchRooms = async (floorId: number) => {
    if (!floorId) {
      setRooms([]);
      return;
    }

    setLoading(prev => ({ ...prev, rooms: true }));
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pms/floors/${floorId}/rooms.json`, {
        headers: {
          'Authorization': getAuthHeader(),
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRooms(data || []);
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