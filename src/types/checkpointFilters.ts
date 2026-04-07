export interface CheckpointFilters {
  siteId: string;
  buildingId: string;
  wingId: string;
  areaId: string;
  floorId: string;
  roomId: string;
  // name strings for matching against checkpoint table data
  siteName: string;
  buildingName: string;
  wingName: string;
  areaName: string;
  floorName: string;
  roomName: string;
}

export const EMPTY_CP_FILTERS: CheckpointFilters = {
  siteId: "",
  buildingId: "",
  wingId: "",
  areaId: "",
  floorId: "",
  roomId: "",
  siteName: "",
  buildingName: "",
  wingName: "",
  areaName: "",
  floorName: "",
  roomName: "",
};
