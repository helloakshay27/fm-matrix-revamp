import { apiClient } from '@/utils/apiClient';

export interface PermitTag {
  id: number;
  name: string;
  tag_type: string;
  parent_id?: number | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PermitTagsResponse {
  permit_tags: PermitTag[];
  total_count?: number;
}

export interface CreatePermitTagRequest {
  name: string;
  tag_type: string;
  parent_id?: number | null;
  active?: boolean;
}

export interface UpdatePermitTagRequest {
  name?: string;
  tag_type?: string;
  parent_id?: number | null;
  active?: boolean;
}

export const permitTagsAPI = {
  /**
   * Get all permit tags
   */
  async getPermitTags(): Promise<PermitTag[]> {
    try {
      const response = await apiClient.get<PermitTagsResponse>('/permit_tags.json');
      return response.data.permit_tags || [];
    } catch (error) {
      console.error('Error fetching permit tags:', error);
      throw error;
    }
  },

  /**
   * Get permit tags by type
   */
  async getPermitTagsByType(tagType: string): Promise<PermitTag[]> {
    try {
      const response = await apiClient.get<PermitTagsResponse>(`/permit_tags.json?tag_type=${tagType}`);
      return response.data.permit_tags || [];
    } catch (error) {
      console.error('Error fetching permit tags by type:', error);
      throw error;
    }
  },

  /**
   * Get a specific permit tag by ID
   */
  async getPermitTag(id: number): Promise<PermitTag> {
    try {
      const response = await apiClient.get<{ permit_tag: PermitTag }>(`/permit_tags/${id}.json`);
      return response.data.permit_tag;
    } catch (error) {
      console.error('Error fetching permit tag:', error);
      throw error;
    }
  },

  /**
   * Create a new permit tag
   */
  async createPermitTag(data: CreatePermitTagRequest): Promise<PermitTag> {
    try {
      const payload = {
        permit_tag: {
          name: data.name,
          tag_type: data.tag_type,
          parent_id: data.parent_id,
          active: data.active !== false, // Default to true
        }
      };
      
      const response = await apiClient.post<{ permit_tag: PermitTag }>('/permit_tags.json', payload);
      return response.data.permit_tag;
    } catch (error) {
      console.error('Error creating permit tag:', error);
      throw error;
    }
  },

  /**
   * Update an existing permit tag
   */
  async updatePermitTag(id: number, data: UpdatePermitTagRequest): Promise<PermitTag> {
    try {
      const payload = {
        permit_tag: {
          ...(data.name && { name: data.name }),
          ...(data.tag_type && { tag_type: data.tag_type }),
          ...(data.parent_id !== undefined && { parent_id: data.parent_id }),
          ...(data.active !== undefined && { active: data.active }),
        }
      };
      
      const response = await apiClient.put<{ permit_tag: PermitTag }>(`/permit_tags/${id}.json`, payload);
      return response.data.permit_tag;
    } catch (error) {
      console.error('Error updating permit tag:', error);
      throw error;
    }
  },

  /**
   * Delete a permit tag
   */
  async deletePermitTag(id: number): Promise<void> {
    try {
      await apiClient.delete(`/permit_tags/${id}.json`);
    } catch (error) {
      console.error('Error deleting permit tag:', error);
      throw error;
    }
  },

  /**
   * Get permit tags by parent ID
   */
  async getPermitTagsByParent(parentId: number): Promise<PermitTag[]> {
    try {
      const response = await apiClient.get<PermitTagsResponse>(`/permit_tags.json?parent_id=${parentId}`);
      return response.data.permit_tags || [];
    } catch (error) {
      console.error('Error fetching permit tags by parent:', error);
      throw error;
    }
  },

  /**
   * Search permit tags by name
   */
  async searchPermitTags(searchTerm: string): Promise<PermitTag[]> {
    try {
      const response = await apiClient.get<PermitTagsResponse>(`/permit_tags.json?search=${encodeURIComponent(searchTerm)}`);
      return response.data.permit_tags || [];
    } catch (error) {
      console.error('Error searching permit tags:', error);
      throw error;
    }
  }
};

export default permitTagsAPI;
