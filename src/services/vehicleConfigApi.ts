import axios from "axios";

const VEHICLE_CONFIG_BASE_URL = `https://${localStorage.getItem("baseUrl")}`;

const vehicleConfigClient = axios.create({ baseURL: VEHICLE_CONFIG_BASE_URL });

vehicleConfigClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface VehicleBrand {
  id: number;
  name: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface VehicleModel {
  id: number;
  name: string;
  vehicle_brand_id: number;
  active: boolean;
  vehicle_brand?: { id: number; name: string };
  created_at?: string;
  updated_at?: string;
}

export interface VehicleColour {
  id: number;
  name: string;
  hex_code: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ── Vehicle Brands ───────────────────────────────────────────────────────────

export const fetchVehicleBrands = async (): Promise<VehicleBrand[]> => {
  const res = await vehicleConfigClient.get("/vehicle_brands.json");
  return res.data?.vehicle_brands ?? (Array.isArray(res.data) ? res.data : []);
};

export const createVehicleBrand = (name: string) =>
  vehicleConfigClient.post("/vehicle_brands.json", { vehicle_brand: { name } });

export const updateVehicleBrand = (id: number, name: string) =>
  vehicleConfigClient.patch(`/vehicle_brands/${id}.json`, { vehicle_brand: { name } });

export const toggleVehicleBrandActive = (id: number) =>
  vehicleConfigClient.patch(`/vehicle_brands/${id}/toggle_active.json`);

// ── Vehicle Models ───────────────────────────────────────────────────────────

export const fetchVehicleModels = async (): Promise<VehicleModel[]> => {
  const res = await vehicleConfigClient.get("/vehicle_models.json");
  return res.data?.vehicle_models ?? (Array.isArray(res.data) ? res.data : []);
};

export const createVehicleModel = (name: string, vehicleBrandId: number) =>
  vehicleConfigClient.post("/vehicle_models.json", {
    vehicle_model: { name, vehicle_brand_id: vehicleBrandId },
  });

export const updateVehicleModel = (id: number, name: string, vehicleBrandId?: number) =>
  vehicleConfigClient.patch(`/vehicle_models/${id}.json`, {
    vehicle_model: vehicleBrandId
      ? { name, vehicle_brand_id: vehicleBrandId }
      : { name },
  });

export const toggleVehicleModelActive = (id: number) =>
  vehicleConfigClient.patch(`/vehicle_models/${id}/toggle_active.json`);

// ── Vehicle Colours ──────────────────────────────────────────────────────────

export const fetchVehicleColours = async (): Promise<VehicleColour[]> => {
  const res = await vehicleConfigClient.get("/vehicle_colours.json");
  return res.data?.vehicle_colours ?? (Array.isArray(res.data) ? res.data : []);
};

export const createVehicleColour = (name: string, hexCode: string) =>
  vehicleConfigClient.post("/vehicle_colours.json", {
    vehicle_colour: { name, hex_code: hexCode },
  });

export const updateVehicleColour = (id: number, name: string, hexCode: string) =>
  vehicleConfigClient.patch(`/vehicle_colours/${id}.json`, {
    vehicle_colour: { name, hex_code: hexCode },
  });

export const toggleVehicleColourActive = (id: number) =>
  vehicleConfigClient.patch(`/vehicle_colours/${id}/toggle_active.json`);
