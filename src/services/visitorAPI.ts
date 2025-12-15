import { API_CONFIG } from '@/config/apiConfig';

const API_BASE_URL = API_CONFIG.BASE_URL;

interface AdditionalVisitor {
    name: string;
    mobile: string;
}

interface CreateExpectedVisitorPayload {
    gatekeeper: {
        resource_id: string;
        expected_at?: string;
        guest_name: string;
        guest_number: string;
        guest_from: string;
        guest_vehicle_number: string;
        id_society: string;
        approve: string;
        visit_to: string;
        visit_purpose: string;
        image: string;
        plus_person: string;
        notes: string;
        pass_days: string[];
        additional_visitors_attributes?: AdditionalVisitor[];
    };
}

export interface CreateVisitorFormData {
    visitorName: string;
    mobileNumber: string;
    visitorComingFrom: string;
    vehicleNumber: string;
    visitPurpose: string;
    expectedDate?: string;
    expectedTime?: string;
    remarks: string;
    capturedPhoto?: string;
    additionalVisitors?: Array<{ name: string; mobile: string }>;
}

/**
 * Create an expected visitor using JSON payload
 */
export const createExpectedVisitor = async (
    formData: CreateVisitorFormData,
    resourceId: string
): Promise<any> => {
    try {
        console.log('🔍 createExpectedVisitor called with resourceId:', resourceId);

        const token = API_CONFIG.TOKEN;
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Validate resourceId
        if (!resourceId || resourceId === 'undefined') {
            console.error('❌ Invalid resourceId provided:', resourceId);
            throw new Error('Invalid site ID. Please select a site and try again.');
        }

        // Format expected_at if date and time are provided
        let formattedExpectedAt = '';
        if (formData.expectedDate && formData.expectedTime) {
            const [year, month, day] = formData.expectedDate.split('-');
            formattedExpectedAt = `${day}/${month}/${year}T${formData.expectedTime}`;
        }

        // Build the payload
        const payload: CreateExpectedVisitorPayload = {
            gatekeeper: {
                resource_id: resourceId,
                expected_at: formattedExpectedAt || '',
                guest_name: formData.visitorName,
                guest_number: formData.mobileNumber,
                guest_from: formData.visitorComingFrom || '',
                guest_vehicle_number: formData.vehicleNumber || '',
                id_society: '',
                approve: '1',
                visit_to: '',
                visit_purpose: formData.visitPurpose,
                image: formData.capturedPhoto || '',
                plus_person: formData.additionalVisitors && formData.additionalVisitors.length > 0 ? '1' : '0',
                notes: formData.remarks || '',
                pass_days: [],
                additional_visitors_attributes: formData.additionalVisitors || [],
            },
        };

        console.log('📤 Sending create expected visitor payload:', payload);

        const response = await fetch(`${API_BASE_URL}/pms/visitors/create_expected_visitor.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('❌ API Error:', errorData);
            throw new Error(errorData?.message || 'Failed to create visitor');
        }

        const data = await response.json();
        console.log('✅ Visitor created successfully:', data);
        return data;
    } catch (error) {
        console.error('❌ Error in createExpectedVisitor:', error);
        throw error;
    }
};

/**
 * Get visitor information by mobile number
 */
export const getVisitorByMobile = async (
    resourceId: string,
    mobile: string
): Promise<any> => {
    try {
        console.log('🔍 getVisitorByMobile called with:', { resourceId, mobile });

        const token = API_CONFIG.TOKEN;
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Validate resourceId
        if (!resourceId || resourceId === 'undefined') {
            console.error('❌ Invalid resourceId provided:', resourceId);
            throw new Error('Invalid site ID. Please select a site and try again.');
        }

        const url = `${API_BASE_URL}/pms/visitors/get_visitor_info.json?resource_id=${resourceId}&mobile=${mobile}`;
        console.log('📡 Fetching from URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null; // No visitor found
            }
            throw new Error('Failed to fetch visitor information');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error in getVisitorByMobile:', error);
        throw error;
    }
};
