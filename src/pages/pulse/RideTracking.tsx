import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
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

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
console.log("Google Maps API Key:", GOOGLE_MAPS_API_KEY); // Debug log to verify the key is loaded

const LIBRARIES: ("geometry" | "places")[] = ["geometry"];

const MAP_CONTAINER_STYLE: React.CSSProperties = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

const DEFAULT_CENTER: RideCoordinates = { lat: 19.076, lng: 72.8777 }; // Mumbai

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

const getCarColourClass = (colour: string) => {
  const c = colour.toLowerCase();
  if (c.includes("white") || c.includes("beige") || c.includes("silver"))
    return "text-gray-400";
  if (c.includes("black")) return "text-gray-900";
  if (c.includes("red")) return "text-red-600";
  if (c.includes("blue")) return "text-blue-600";
  if (c.includes("green")) return "text-green-600";
  return "text-gray-500";
};

// Build Google Maps static marker icon for a car
const buildCarMarkerIcon = (colour: string): google.maps.Icon => {
  const c = colour.toLowerCase();
  let fillColor = "#6B7280"; // gray default
  if (c.includes("white") || c.includes("beige") || c.includes("silver")) fillColor = "#D1D5DB";
  else if (c.includes("black")) fillColor = "#111827";
  else if (c.includes("red")) fillColor = "#DC2626";
  else if (c.includes("blue")) fillColor = "#2563EB";
  else if (c.includes("green")) fillColor = "#16A34A";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <rect x="8" y="16" width="32" height="18" rx="4" fill="${fillColor}" stroke="#fff" stroke-width="1.5"/>
      <rect x="12" y="12" width="24" height="10" rx="3" fill="${fillColor}" opacity="0.8"/>
      <circle cx="15" cy="35" r="4" fill="#1F2937" stroke="#fff" stroke-width="1.5"/>
      <circle cx="33" cy="35" r="4" fill="#1F2937" stroke="#fff" stroke-width="1.5"/>
      <rect x="10" y="20" width="8" height="5" rx="1" fill="#93C5FD" opacity="0.9"/>
      <rect x="30" y="20" width="8" height="5" rx="1" fill="#93C5FD" opacity="0.9"/>
    </svg>`;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(48, 48),
    anchor: new window.google.maps.Point(24, 24),
  };
};

const buildStartMarkerIcon = (): google.maps.Icon => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="12" fill="#F59E0B" stroke="#fff" stroke-width="2"/>
      <text x="16" y="21" text-anchor="middle" fill="white" font-size="14" font-weight="bold">★</text>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(32, 32),
    anchor: new window.google.maps.Point(16, 16),
  };
};

// ─── Main Component ─────────────────────────────────────────────────────────────

export const RideTracking: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState<number | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
    version: "3.58",
  });

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
      const allRides: Ride[] = Array.isArray(data?.rides)
        ? data.rides
        : Array.isArray(data)
        ? data
        : [];
      const startedRides = allRides.filter((r) => r.status === "started");
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

  // ── Fetch directions when a ride is selected ────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !selectedRide) return;
    const { start_coordinates, end_coordinates } = selectedRide;
    if (!start_coordinates || !end_coordinates) return;

    try {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: start_coordinates.lat, lng: start_coordinates.lng },
          destination: { lat: end_coordinates.lat, lng: end_coordinates.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
          } else {
            setDirections(null);
          }
        }
      );
    } catch {
      setDirections(null);
    }
  }, [isLoaded, selectedRide]);

  // ── Pan map to selected ride ─────────────────────────────────────────────────
  useEffect(() => {
    if (!mapRef || !selectedRide?.start_coordinates) return;
    mapRef.panTo({
      lat: selectedRide.start_coordinates.lat,
      lng: selectedRide.start_coordinates.lng,
    });
    mapRef.setZoom(12);
  }, [mapRef, selectedRide]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // ── Scroll carousel ─────────────────────────────────────────────────────────
  const scrollCards = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  // ── Map center ──────────────────────────────────────────────────────────────
  const mapCenter =
    selectedRide?.start_coordinates
      ? { lat: selectedRide.start_coordinates.lat, lng: selectedRide.start_coordinates.lng }
      : DEFAULT_CENTER;

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
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRides}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
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
              <div key={i} className="flex-shrink-0 w-72 h-52 bg-gray-100 rounded-xl animate-pulse" />
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
                  onClick={() => {
                    setSelectedRide(ride);
                    setDirections(null);
                  }}
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
              {(loadError) && (
                <div className="flex items-center justify-center h-[500px] bg-gray-50">
                  <div className="text-center text-gray-500 max-w-sm px-4">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p className="font-semibold text-gray-700 mb-2">Map could not load</p>
                    <p className="text-sm text-gray-500 mb-3">
                      The Google Maps API key is restricted to specific domains.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left text-xs text-amber-800">
                      <p className="font-semibold mb-1">To fix: Add <code>localhost</code> to your API key's allowed referrers:</p>
                      <ol className="list-decimal list-inside space-y-0.5">
                        <li>Go to Google Cloud Console → Credentials</li>
                        <li>Click your API key</li>
                        <li>Under HTTP referrers add: <code>http://localhost:5173/*</code></li>
                        <li>Save and refresh this page</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {!loadError && !isLoaded && (
                <div className="flex items-center justify-center h-[500px] bg-gray-50">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#C72030]" />
                    <p className="text-sm text-gray-500">Loading map…</p>
                  </div>
                </div>
              )}

              {!loadError && isLoaded && (
                <GoogleMap
                  mapContainerStyle={MAP_CONTAINER_STYLE}
                  center={mapCenter}
                  zoom={12}
                  onLoad={onMapLoad}
                  options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                      },
                    ],
                  }}
                >
                  {/* Route directions for selected ride */}
                  {directions && (
                    <DirectionsRenderer
                      directions={directions}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: "#C72030",
                          strokeWeight: 4,
                          strokeOpacity: 0.8,
                        },
                      }}
                    />
                  )}

                  {/* Markers for each ride */}
                  {rides.map((ride) => {
                    const hasCoords =
                      ride.start_coordinates?.lat && ride.start_coordinates?.lng;
                    if (!hasCoords) return null;

                    return (
                      <React.Fragment key={ride.id}>
                        {/* Start / Current position marker (car icon) */}
                        <Marker
                          position={{
                            lat: ride.start_coordinates.lat,
                            lng: ride.start_coordinates.lng,
                          }}
                          icon={buildCarMarkerIcon(ride.vehicle?.colour || "gray")}
                          title={ride.vehicle?.registration_number || `Ride ${ride.id}`}
                          onClick={() => {
                            setSelectedRide(ride);
                            setActiveInfoWindow(ride.id);
                            setDirections(null);
                          }}
                        />

                        {/* Destination marker (star) — only for selected ride */}
                        {selectedRide?.id === ride.id &&
                          ride.end_coordinates?.lat && (
                            <Marker
                              position={{
                                lat: ride.end_coordinates.lat,
                                lng: ride.end_coordinates.lng,
                              }}
                              icon={buildStartMarkerIcon()}
                            />
                          )}

                        {/* Info window for selected / clicked ride */}
                        {activeInfoWindow === ride.id && (
                          <InfoWindow
                            position={{
                              lat: ride.start_coordinates.lat,
                              lng: ride.start_coordinates.lng,
                            }}
                            onCloseClick={() => setActiveInfoWindow(null)}
                          >
                            <div className="min-w-[180px] text-xs">
                              <p className="font-semibold text-gray-900 text-sm mb-1">
                                {ride.vehicle?.registration_number}
                              </p>
                              <p className="text-gray-700 mb-0.5">
                                <strong>Driver:</strong> {ride.driver?.name}
                              </p>
                              <p className="text-gray-700 mb-0.5">
                                <strong>From:</strong> {ride.start_location || "—"}
                              </p>
                              <p className="text-gray-700 mb-0.5">
                                <strong>To:</strong> {ride.end_location || "—"}
                              </p>
                              <p className="text-gray-700 mb-0.5">
                                <strong>Passengers:</strong>{" "}
                                {ride.passengers?.map((p) => p.user.name).join(", ") || "None"}
                              </p>
                              <span
                                className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(ride.status)}`}
                              >
                                {ride.status === "started" ? "ACTIVE" : ride.status.toUpperCase()}
                              </span>
                            </div>
                          </InfoWindow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </GoogleMap>
              )}
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
                    <Car className={`w-4 h-4 flex-shrink-0 ${getCarColourClass(selectedRide.vehicle?.colour || "")}`} />
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
                      {selectedRide.status === "started" ? "ACTIVE" : selectedRide.status.toUpperCase()}
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
        isSelected
          ? "border-[#C72030] shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
   
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 font-medium">
            {ride.vehicle?.registration_number} ({ride.driver?.gender || "—"})
          </p>
          <p className="text-base font-bold text-gray-900 mt-0.5">{ride.driver?.name}</p>
        </div>
        <Badge className={`text-xs border font-semibold ${getStatusColor(ride.status)}`}>
          {ride.status === "started" ? "Active" : ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </Badge>
      </div>


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
