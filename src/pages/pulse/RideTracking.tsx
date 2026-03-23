import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
  Clock,
  Users,
  Car,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";

import carGrayImage from "@/assets/car_gray.png";
import carRedImage from "@/assets/car_red.png";
import carBlackImage from "@/assets/car_black.png";
import carBeigeImage from "@/assets/car_beige.png";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RideCoordinates {
  lat: number;
  lng: number;
}

interface RideVehicle {
  id: number;
  car_model_name: string;
  colour: string;
  seats: number;
  registration_number: string;
  attachments: Array<{ document_url?: string }>;
}

interface RideDriver {
  id: number;
  name: string;
  gender: string;
  profile_image_url: string | null;
  rating: number | null;
}

interface RidePassenger {
  request_id: number;
  joined_at: string;
  status: string;
  user: {
    id: number;
    name: string;
    gender: string | null;
    profile_image_url: string | null;
  };
}

interface Ride {
  id: number;
  status: string;
  regular: boolean;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  gender_preference: string;
  available_seats: number;
  price: number;
  started_at: string | null;
  completed_at: string | null;
  start_coordinates: RideCoordinates;
  end_coordinates: RideCoordinates;
  vehicle: RideVehicle;
  driver: RideDriver;
  passengers: RidePassenger[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const DEFAULT_CENTER: [number, number] = [19.076, 72.8777]; // Mumbai

const STATUS_COLORS: Record<string, string> = {
  started: "bg-green-100 text-green-700 border-green-200",
  open: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const getStatusColor = (status: string) =>
  STATUS_COLORS[status.toLowerCase()] ?? "bg-gray-100 text-gray-700 border-gray-200";

const formatTime = (dateStr: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatETA = (startTime: string) => {
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  if (diffMs <= 0) return "In progress";
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} mins`;
  const hrs = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

// ─── Leaflet Icons ─────────────────────────────────────────────────────────────

// Fix default Leaflet marker icon issue (broken image paths in bundlers)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Pickup marker (green)
const pickupIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="42" viewBox="0 0 28 42">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 28 14 28s14-17.5 14-28C28 6.268 21.732 0 14 0z" fill="#16A34A" stroke="#fff" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="6" fill="#fff"/>
        <text x="14" y="17.5" text-anchor="middle" fill="#16A34A" font-size="10" font-weight="bold">P</text>
      </svg>`
    ),
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

// Drop marker (red)
const dropIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="42" viewBox="0 0 28 42">
        <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 28 14 28s14-17.5 14-28C28 6.268 21.732 0 14 0z" fill="#DC2626" stroke="#fff" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="6" fill="#fff"/>
        <text x="14" y="17.5" text-anchor="middle" fill="#DC2626" font-size="10" font-weight="bold">D</text>
      </svg>`
    ),
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

// Car icon for active (started) rides — pick by vehicle colour
const getCarIcon = (colour: string): L.Icon => {
  const c = (colour || "").toLowerCase();
  let carImg = carGrayImage;
  if (c.includes("red")) carImg = carRedImage;
  else if (c.includes("black")) carImg = carBlackImage;
  else if (c.includes("white") || c.includes("beige") || c.includes("silver"))
    carImg = carBeigeImage;

  return new L.Icon({
    iconUrl: carImg,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

// ─── Coordinate Validation ─────────────────────────────────────────────────────

/** Ensure coordinates are within India bounding box (rough) */
const isValidIndiaCoord = (coord: RideCoordinates | null | undefined): boolean => {
  if (!coord || !coord.lat || !coord.lng) return false;
  // India roughly: lat 6–36, lng 68–98
  return coord.lat >= 6 && coord.lat <= 37 && coord.lng >= 67 && coord.lng <= 98;
};

// ─── Map Fly-To Helper Component ───────────────────────────────────────────────

interface FlyToProps {
  center: [number, number];
  zoom: number;
}

const FlyToLocation: React.FC<FlyToProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [map, center, zoom]);
  return null;
};

// ─── Main Component ─────────────────────────────────────────────────────────────

export const RideTracking: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [rides, setRides] = useState<Ride[]>([]);
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ center: [number, number]; zoom: number } | null>(
    null
  );

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // ── Fetch rides ──────────────────────────────────────────────────────────────
  const fetchRides = useCallback(async () => {
    if (!baseUrl || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const protocol = baseUrl.startsWith("http") ? "" : "https://";
      const response = await axios.get(`${protocol}${baseUrl}/rides/all_rides.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = response.data;
      const rawRides: Ride[] = Array.isArray(data?.rides)
        ? data.rides
        : Array.isArray(data)
        ? data
        : [];

      // Keep all rides with valid India coordinates for map
      const validRides = rawRides.filter(
        (r) => isValidIndiaCoord(r.start_coordinates) && isValidIndiaCoord(r.end_coordinates)
      );
      setAllRides(validRides);

      // Only "started" rides appear in cards
      const startedRides = validRides.filter((r) => r.status === "started");
      setRides(startedRides);
      if (startedRides.length > 0) {
        setSelectedRide(startedRides[0]);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e.response?.data?.error || e.message || "Failed to load rides");
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  // ── When a ride is selected, fly to it ───────────────────────────────────────
  useEffect(() => {
    if (!selectedRide?.start_coordinates) return;
    setFlyTarget({
      center: [selectedRide.start_coordinates.lat, selectedRide.start_coordinates.lng],
      zoom: 13,
    });
  }, [selectedRide]);

  // ── Scroll carousel ─────────────────────────────────────────────────────────
  const scrollCards = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  // ── Map center — average of all rides, or default Mumbai ────────────────────
  const mapCenter: [number, number] = (() => {
    const validStarted = rides.filter((r) => isValidIndiaCoord(r.start_coordinates));
    if (validStarted.length === 0) return DEFAULT_CENTER;
    const avgLat =
      validStarted.reduce((sum, r) => sum + r.start_coordinates.lat, 0) / validStarted.length;
    const avgLng =
      validStarted.reduce((sum, r) => sum + r.start_coordinates.lng, 0) / validStarted.length;
    return [avgLat, avgLng];
  })();

  return (
    <div className="p-4 sm:p-6 max-w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span
          className="cursor-pointer hover:text-[#C72030] transition-colors"
          onClick={() => navigate("/pulse/carpool")}
        >
          Carpool
        </span>
        <span>&gt;</span>
        <span className="text-gray-800 font-medium">Live Tracking</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#C72030] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Live Ride Tracking</h1>
        </div>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={fetchRides}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button> */}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-72 h-52 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="w-full h-[500px] bg-gray-100 rounded-xl animate-pulse" />
        </div>
      )}

      {!loading && rides.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Car className="w-16 h-16 mb-4 opacity-30" />
          <p className="text-lg font-medium">No active rides</p>
          <p className="text-sm mt-1">There are no rides currently in progress to track.</p>
        </div>
      )}

      {!loading && rides.length > 0 && (
        <>
          {/* ── Ride Cards Carousel ─────────────────────────────────────────── */}
          <div className="relative mb-6">
            {/* Left Arrow */}
            <button
              onClick={() => scrollCards("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 -ml-4"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            {/* Scrollable Cards */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto scroll-smooth px-2 pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {rides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  isSelected={selectedRide?.id === ride.id}
                  onClick={() => setSelectedRide(ride)}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scrollCards("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow flex items-center justify-center hover:bg-gray-50 -mr-4"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* ── Map ─────────────────────────────────────────────────────────── */}
          <Card className="border border-gray-200 shadow-sm overflow-hidden rounded-xl">
            <CardContent className="p-0">
              <div style={{ width: "100%", height: "500px", borderRadius: "12px" }}>
                <MapContainer
                  center={mapCenter}
                  zoom={11}
                  scrollWheelZoom={true}
                  style={{ width: "100%", height: "100%", borderRadius: "12px" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Fly to selected ride */}
                  {flyTarget && (
                    <FlyToLocation center={flyTarget.center} zoom={flyTarget.zoom} />
                  )}

                
                  {allRides.map((ride) => {
                    const startValid = isValidIndiaCoord(ride.start_coordinates);
                    const endValid = isValidIndiaCoord(ride.end_coordinates);
                    if (!startValid) return null;

                    const isActive = ride.status === "started";
                    const isSelectedRide = selectedRide?.id === ride.id;
                    const lineColor = isSelectedRide ? "#C72030" : isActive ? "#16A34A" : "#9CA3AF";
                    const lineWeight = isSelectedRide ? 4 : 2;

                    return (
                      <React.Fragment key={ride.id}>
                        
                        <Marker
                          position={[ride.start_coordinates.lat, ride.start_coordinates.lng]}
                          icon={pickupIcon}
                          eventHandlers={{
                            click: () => setSelectedRide(ride),
                          }}
                        >
                          <Popup>
                            <div className="text-xs min-w-[160px]">
                              <p className="font-semibold text-green-700 mb-1">📍 Pickup</p>
                              <p className="text-gray-700">{ride.start_location || "—"}</p>
                              <p className="text-gray-500 mt-1">
                                Driver: {ride.driver?.name}
                              </p>
                              <p className="text-gray-500">
                                Vehicle: {ride.vehicle?.registration_number}
                              </p>
                            </div>
                          </Popup>
                        </Marker>

                      
                        {endValid && (
                          <Marker
                            position={[ride.end_coordinates.lat, ride.end_coordinates.lng]}
                            icon={dropIcon}
                            eventHandlers={{
                              click: () => setSelectedRide(ride),
                            }}
                          >
                            <Popup>
                              <div className="text-xs min-w-[160px]">
                                <p className="font-semibold text-red-700 mb-1">📍 Drop</p>
                                <p className="text-gray-700">{ride.end_location || "—"}</p>
                              </div>
                            </Popup>
                          </Marker>
                        )}

                      
                        {isActive && (
                          <Marker
                            position={[
                              ride.start_coordinates.lat,
                              ride.start_coordinates.lng,
                            ]}
                            icon={getCarIcon(ride.vehicle?.colour || "gray")}
                            zIndexOffset={1000}
                            eventHandlers={{
                              click: () => setSelectedRide(ride),
                            }}
                          >
                            <Popup>
                              <div className="text-xs min-w-[180px]">
                                <p className="font-semibold text-gray-900 text-sm mb-1">
                                  🚗 {ride.driver?.name}
                                </p>
                                <p className="text-gray-700">
                                  {ride.vehicle?.registration_number} •{" "}
                                  {ride.vehicle?.colour}
                                </p>
                                <p className="text-gray-500 mt-1">
                                  {ride.start_location} → {ride.end_location}
                                </p>
                                <p className="text-gray-500 mt-0.5">
                                  Passengers:{" "}
                                  {ride.passengers?.map((p) => p.user.name).join(", ") ||
                                    "None"}
                                </p>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                  ACTIVE
                                </span>
                              </div>
                            </Popup>
                          </Marker>
                        )}

                        {endValid && (
                          <Polyline
                            positions={[
                              [ride.start_coordinates.lat, ride.start_coordinates.lng],
                              [ride.end_coordinates.lat, ride.end_coordinates.lng],
                            ]}
                            pathOptions={{
                              color: lineColor,
                              weight: lineWeight,
                              opacity: isSelectedRide ? 0.9 : 0.5,
                              dashArray: isActive ? undefined : "8 6",
                            }}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* ── Selected Ride Detail Strip ───────────────────────────────────── */}
          {/* {selectedRide && (
            <Card className="mt-4 border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-6 items-center">
              
                  <div className="flex items-center gap-3">
                    {selectedRide.driver?.profile_image_url ? (
                      <img
                        src={selectedRide.driver.profile_image_url}
                        alt={selectedRide.driver.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Driver</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedRide.driver?.name}
                      </p>
                    </div>
                  </div>

                 
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 max-w-[120px] truncate">
                      {selectedRide.start_location || "—"}
                    </span>
                    <Navigation className="w-3 h-3 text-gray-400 mx-1" />
                    <MapPin className="w-4 h-4 text-[#C72030] flex-shrink-0" />
                    <span className="text-gray-700 max-w-[120px] truncate">
                      {selectedRide.end_location || "—"}
                    </span>
                  </div>

            
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-gray-700">
                      {formatTime(selectedRide.start_time)} →{" "}
                      {formatTime(selectedRide.end_time)}
                    </span>
                  </div>

             
                  <div>
                    <p className="text-xs text-gray-500">ETA</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatETA(selectedRide.start_time)}
                    </p>
                  </div>

                
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="w-4 h-4 flex-shrink-0 text-gray-600" />
                    <span className="text-gray-700">
                      {selectedRide.vehicle?.car_model_name} •{" "}
                      {selectedRide.vehicle?.registration_number}
                    </span>
                  </div>

                
                  <div>
                    <p className="text-xs text-gray-500">Passengers</p>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {selectedRide.passengers && selectedRide.passengers.length > 0 ? (
                        selectedRide.passengers.map((p) => (
                          <span
                            key={p.request_id}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full border border-gray-200"
                          >
                            {p.user.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No passengers</span>
                      )}
                    </div>
                  </div>

                 
                  <div className="ml-auto">
                    <Badge
                      className={`border text-xs font-semibold px-3 py-1 ${getStatusColor(selectedRide.status)}`}
                    >
                      {selectedRide.status === "started"
                        ? "ACTIVE"
                        : selectedRide.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}
        </>
      )}
    </div>
  );
};

// ─── Ride Card Sub-component ────────────────────────────────────────────────────

interface RideCardProps {
  ride: Ride;
  isSelected: boolean;
  onClick: () => void;
}

const RideCard: React.FC<RideCardProps> = ({ ride, isSelected, onClick }) => {
  const progress = ride.status === "started" ? 45 : ride.status === "completed" ? 100 : 0;
  const progressColor =
    ride.status === "started"
      ? "bg-[#C72030]"
      : ride.status === "completed"
      ? "bg-green-500"
      : "bg-gray-300";

  return (
    <div
      onClick={onClick}
      className={`flex-shrink-0 w-72 bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-[#C72030] shadow-md" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 font-medium">
            {ride.vehicle?.registration_number} ({ride.driver?.gender || "—"})
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">{ride.driver?.name}</p>
        </div>
        <Badge className={`text-xs border font-semibold ${getStatusColor(ride.status)}`}>
          {ride.status === "started"
            ? "Active"
            : ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </Badge>
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400 leading-none">Route</p>
            <p className="text-xs text-gray-700 font-medium truncate max-w-[210px]">
              {ride.start_location || "—"} → {ride.end_location || "—"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Navigation className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400 leading-none">Current Location</p>
            <p className="text-xs text-gray-700 font-medium">
              {ride.start_coordinates
                ? `${ride.start_coordinates.lat.toFixed(4)}, ${ride.start_coordinates.lng.toFixed(4)}`
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-gray-400 leading-none">ETA</p>
            <p className="text-xs text-gray-700 font-medium">{formatETA(ride.start_time)}</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${progressColor} transition-all`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Passengers */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Passengers</p>
        <div className="flex flex-wrap gap-1">
          {ride.passengers && ride.passengers.length > 0 ? (
            ride.passengers.map((p) => (
              <span
                key={p.request_id}
                className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200"
              >
                {p.user.name}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No passengers</span>
          )}
        </div>
      </div>
    </div>
  );
};
