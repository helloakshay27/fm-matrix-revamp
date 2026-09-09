import { apiClient } from "@/utils/apiClient";

export interface AudienceCommunity {
  id: number;
  name: string;
}

export interface AudienceSite {
  id: number;
  name: string;
}

export interface AudienceUser {
  id: number;
  full_name: string;
}

export async function fetchAudienceCommunities(): Promise<AudienceCommunity[]> {
  const { data } = await apiClient.get<{ communities: AudienceCommunity[] }>(
    "/communities.json"
  );
  return data.communities;
}

export async function fetchAudienceSites(userId: number): Promise<AudienceSite[]> {
  const { data } = await apiClient.get<{ sites: AudienceSite[] }>(
    "/pms/sites/allowed_sites.json",
    { params: { user_id: userId } }
  );
  return data.sites;
}

export async function fetchAudienceUsers(): Promise<AudienceUser[]> {
  const { data } = await apiClient.get<{ users: AudienceUser[] }>(
    "/pms/users/get_escalate_to_users.json"
  );
  return data.users;
}
