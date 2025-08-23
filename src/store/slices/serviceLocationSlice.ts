import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL, TOKEN } from '@/config/apiConfig';

// Types
export interface Site {
  id: number;
  name: string;
}

export interface Building {
  id: number;
  name: string;
  has_wing: boolean;
  has_floor: boolean;
  has_area: boolean;
  has_room: boolean;
  available_seats: number | null;
  available_parkings: number | null;
}

export interface Wing {
  id: number;
  name: string;
}

export interface Area {
  id: number;
  name: string;
}

export interface Floor {
  id: number;
  name: string;
}

export interface Room {
  id: number;
  name: string;
}

export interface Group {
  id: number;
  name: string;
}

export interface SubGroup {
  id: number;
  name: string;
}

interface ServiceLocationState {
  sites: Site[];
  buildings: Building[];
  wings: Wing[];
  areas: Area[];
  floors: Floor[];
  rooms: Room[];
  groups: Group[];
  subGroups: SubGroup[];
  selectedSiteId: number | null;
  selectedBuildingId: number | null;
  selectedWingId: number | null;
  selectedAreaId: number | null;
  selectedFloorId: number | null;
  selectedRoomId: number | null;
  selectedGroupId: number | null;
  selectedSubGroupId: number | null;
  loading: {
    sites: boolean;
    buildings: boolean;
    wings: boolean;
    areas: boolean;
    floors: boolean;
    rooms: boolean;
    groups: boolean;
    subGroups: boolean;
  };
  error: string | null;
}

// Async Thunks
export const fetchSites = createAsyncThunk<Site[]>(
  'serviceLocation/fetchSites',
  async () => {
    const response = await axios.get(`${BASE_URL}/pms/sites.json`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.data.sites;
  }
);

export const fetchBuildings = createAsyncThunk<Building[], number>(
  'serviceLocation/fetchBuildings',
  async (siteId: number) => {
    const response = await axios.get(`${BASE_URL}/pms/sites/${siteId}/buildings.json`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.data.buildings.map((item: any) => item);
  }
);

export const fetchAllBuildings = createAsyncThunk<Building[], number>(
  'serviceLocation/fetchAllBuildings',
  async (siteId: number) => {
    const response = await axios.get(`${BASE_URL}/pms/sites/${siteId}/buildings.json`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.data.buildings.map((item: any) => item);
  }
);

export const fetchWings = createAsyncThunk<Wing[], number>(
  'serviceLocation/fetchWings',
  async (buildingId: number) => {
    const response = await axios.get(`${BASE_URL}/pms/wings.json?building_id=${buildingId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.data.wings || [];
  }
);

export const fetchAreas = createAsyncThunk<Area[], number>(
  'serviceLocation/fetchAreas',
  async (wingId: number) => {
    const response = await axios.get(`${BASE_URL}/pms/areas.json?wing_id=${wingId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.data.areas;
  }
);

export const fetchFloors = createAsyncThunk<Floor[], number>(
  'serviceLocation/fetchFloors',
  async (areaId: number) => {
    const response = await axios.get(`${BASE_URL}/pms/floors.json?area_id=${areaId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.data.floors;
  }
);

export const fetchGroups = createAsyncThunk<Group[]>(
  'serviceLocation/fetchGroups',
  async () => {
    const response = await axios.get(`${BASE_URL}/pms/assets/get_asset_group_sub_group.json`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('Groups API Response:', response.data);
    // Use asset_groups from response
    return Array.isArray(response.data.asset_groups) ? response.data.asset_groups : [];
  }
);

export const fetchSubGroups = createAsyncThunk<SubGroup[], number>(
  'serviceLocation/fetchSubGroups',
  async (groupId: number) => {
    const response = await axios.get(`${BASE_URL}/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('SubGroups API Response:', response.data);
    // Use asset_groups from response (subgroups should be in the same structure)
    return Array.isArray(response.data.asset_groups) ? response.data.asset_groups : [];
  }
);

export const fetchRooms = createAsyncThunk<Room[], number>(
  'serviceLocation/fetchRooms',
  async (floorId: number) => {
    const response = await axios.get(`${BASE_URL}/pms/rooms.json?floor_id=${floorId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    return response.data || [] ;
  }
);

const initialState: ServiceLocationState = {
  sites: [],
  buildings: [],
  wings: [],
  areas: [],
  floors: [],
  rooms: [],
  groups: [],
  subGroups: [],
  selectedSiteId: null,
  selectedBuildingId: null,
  selectedWingId: null,
  selectedAreaId: null,
  selectedFloorId: null,
  selectedRoomId: null,
  selectedGroupId: null,
  selectedSubGroupId: null,
  loading: {
    sites: false,
    buildings: false,
    wings: false,
    areas: false,
    floors: false,
    rooms: false,
    groups: false,
    subGroups: false,
  },
  error: null,
};

const serviceLocationSlice = createSlice({
  name: 'serviceLocation',
  initialState,
  reducers: {
    setSelectedSite: (state, action: PayloadAction<number | null>) => {
      state.selectedSiteId = action.payload;
      state.selectedBuildingId = null;
      state.selectedWingId = null;
      state.selectedAreaId = null;
      state.selectedFloorId = null;
      state.selectedRoomId = null;
      state.buildings = [];
      state.wings = [];
      state.areas = [];
      state.floors = [];
      state.rooms = [];
    },

    setSelectedBuilding: (state, action: PayloadAction<number | null>) => {
      state.selectedBuildingId = action.payload;
      // Reset dependent selections
      state.selectedWingId = null;
      state.selectedAreaId = null;
      state.selectedFloorId = null;
      state.selectedRoomId = null;
      state.wings = [];
      state.areas = [];
      state.floors = [];
      state.rooms = [];
    },
    setSelectedWing: (state, action: PayloadAction<number | null>) => {
      state.selectedWingId = action.payload;
      // Reset dependent selections
      state.selectedAreaId = null;
      state.selectedFloorId = null;
      state.selectedRoomId = null;
      state.areas = [];
      state.floors = [];
      state.rooms = [];
    },
    setSelectedArea: (state, action: PayloadAction<number | null>) => {
      state.selectedAreaId = action.payload;
      // Reset dependent selections
      state.selectedFloorId = null;
      state.selectedRoomId = null;
      state.floors = [];
      state.rooms = [];
    },
    setSelectedFloor: (state, action: PayloadAction<number | null>) => {
      state.selectedFloorId = action.payload;
      // Reset dependent selections
      state.selectedRoomId = null;
      state.rooms = [];
    },
    setSelectedRoom: (state, action: PayloadAction<number | null>) => {
      state.selectedRoomId = action.payload;
    },
    setSelectedGroup: (state, action: PayloadAction<number | null>) => {
      state.selectedGroupId = action.payload;
      // Reset dependent selections
      state.selectedSubGroupId = null;
      state.subGroups = [];
    },
    setSelectedSubGroup: (state, action: PayloadAction<number | null>) => {
      state.selectedSubGroupId = action.payload;
    },
    clearAllSelections: (state) => {
      state.selectedSiteId = null;
      state.selectedBuildingId = null;
      state.selectedWingId = null;
      state.selectedAreaId = null;
      state.selectedFloorId = null;
      state.selectedRoomId = null;
      state.selectedGroupId = null;
      state.selectedSubGroupId = null;
      state.buildings = [];
      state.wings = [];
      state.areas = [];
      state.floors = [];
      state.rooms = [];
      state.groups = [];
      state.subGroups = [];
    },
  },
  extraReducers: (builder) => {
    // Sites
    builder
      .addCase(fetchSites.pending, (state) => {
        state.loading.sites = true;
        state.error = null;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.loading.sites = false;
        state.sites = action.payload;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.loading.sites = false;
        state.error = action.error.message || 'Failed to fetch sites';
      })
      // Buildings
      .addCase(fetchBuildings.pending, (state) => {
        state.loading.buildings = true;
        state.error = null;
      })
      .addCase(fetchBuildings.fulfilled, (state, action) => {
        state.loading.buildings = false;
        state.buildings = action.payload;
      })
      .addCase(fetchBuildings.rejected, (state, action) => {
        state.loading.buildings = false;
        state.error = action.error.message || 'Failed to fetch buildings';
      })
      // All Buildings
      .addCase(fetchAllBuildings.pending, (state) => {
        state.loading.buildings = true;
        state.error = null;
      })
      .addCase(fetchAllBuildings.fulfilled, (state, action) => {
        state.loading.buildings = false;
        state.buildings = action.payload;
      })
      .addCase(fetchAllBuildings.rejected, (state, action) => {
        state.loading.buildings = false;
        state.error = action.error.message || 'Failed to fetch all buildings';
      })
      // Wings
      .addCase(fetchWings.pending, (state) => {
        state.loading.wings = true;
        state.error = null;
      })
      .addCase(fetchWings.fulfilled, (state, action) => {
        state.loading.wings = false;
        state.wings = action.payload;
      })
      .addCase(fetchWings.rejected, (state, action) => {
        state.loading.wings = false;
        state.error = action.error.message || 'Failed to fetch wings';
      })
      // Areas
      .addCase(fetchAreas.pending, (state) => {
        state.loading.areas = true;
        state.error = null;
      })
      .addCase(fetchAreas.fulfilled, (state, action) => {
        state.loading.areas = false;
        state.areas = action.payload;
      })
      .addCase(fetchAreas.rejected, (state, action) => {
        state.loading.areas = false;
        state.error = action.error.message || 'Failed to fetch areas';
      })
      // Floors
      .addCase(fetchFloors.pending, (state) => {
        state.loading.floors = true;
        state.error = null;
      })
      .addCase(fetchFloors.fulfilled, (state, action) => {
        state.loading.floors = false;
        state.floors = action.payload;
      })
      .addCase(fetchFloors.rejected, (state, action) => {
        state.loading.floors = false;
        state.error = action.error.message || 'Failed to fetch floors';
      })
      // Rooms
      .addCase(fetchRooms.pending, (state) => {
        state.loading.rooms = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading.rooms = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading.rooms = false;
        state.error = action.error.message || 'Failed to fetch rooms';
      })
      // Groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading.groups = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading.groups = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading.groups = false;
        state.error = action.error.message || 'Failed to fetch groups';
      })
      // SubGroups
      .addCase(fetchSubGroups.pending, (state) => {
        state.loading.subGroups = true;
        state.error = null;
      })
      .addCase(fetchSubGroups.fulfilled, (state, action) => {
        state.loading.subGroups = false;
        state.subGroups = action.payload;
      })
      .addCase(fetchSubGroups.rejected, (state, action) => {
        state.loading.subGroups = false;
        state.error = action.error.message || 'Failed to fetch subgroups';
      });
  },
});

export const {
  setSelectedSite,
  setSelectedBuilding,
  setSelectedWing,
  setSelectedArea,
  setSelectedFloor,
  setSelectedRoom,
  setSelectedGroup,
  setSelectedSubGroup,
  clearAllSelections,
} = serviceLocationSlice.actions;

export default serviceLocationSlice.reducer;