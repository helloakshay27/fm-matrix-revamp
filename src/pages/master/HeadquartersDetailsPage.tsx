import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useApiConfig from '@/hooks/useApiConfig';
import { toast } from 'sonner';

interface HeadquartersDetails {
    id: number;
    name: string;
    organization_id: number;
    organization_name: string;
    company_setup_id: number;
    company_setup_name: string;
    country_id: number;
    country_name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

const HeadquartersDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getFullUrl, getAuthHeader } = useApiConfig();
    const [headquarters, setHeadquarters] = useState<HeadquartersDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            navigate('/ops-console/master/location/account');
            return;
        }
        fetchHeadquartersDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchHeadquartersDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${getFullUrl('/headquarters.json')}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader(),
                },
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch headquarters details');
            }

            const data = await response.json();
            setHeadquarters(data);
        } catch (error) {
            console.error('Error fetching headquarters details:', error);
            toast.error('Failed to load headquarters details');
            navigate('/ops-console/master/location/account');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return '-';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[#C72030] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading headquarters details...</p>
                </div>
            </div>
        );
    }

    if (!headquarters) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Headquarters not found</p>
                    <Button
                        variant="outline"
                        onClick={() => navigate('/ops-console/master/location/account')}
                        className="mt-4"
                    >
                        Back to Account Management
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/ops-console/master/location/account')}
                        className="mb-4 flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Account Management
                    </Button>
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Headquarters Details</h1>
                        <div
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${headquarters.status === 'Active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}
                        >
                            {headquarters.status}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Headquarters ID
                                </label>
                                <p className="text-gray-900 font-medium">{headquarters.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Headquarter Name
                                </label>
                                <p className="text-gray-900 font-medium">{headquarters.name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Organization
                                </label>
                                <p className="text-gray-900 font-medium">{headquarters.organization_name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Company
                                </label>
                                <p className="text-gray-900 font-medium">{headquarters.company_setup_name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Country
                                </label>
                                <p className="text-gray-900 font-medium">{headquarters.country_name || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Status
                                </label>
                                <p className="text-gray-900 font-medium">{headquarters.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b">
                            Timeline
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Created At
                                </label>
                                <p className="text-gray-900">{formatDate(headquarters.created_at)}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    Updated At
                                </label>
                                <p className="text-gray-900">{formatDate(headquarters.updated_at)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeadquartersDetailsPage;
