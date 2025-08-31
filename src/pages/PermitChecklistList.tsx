import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye } from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useNavigate } from 'react-router-dom';

interface PermitChecklist {
    id: string;
    name: string;
    status: boolean;
    category: string;
    questionCount: number;
}

export const PermitChecklistList = () => {
    const { setCurrentSection } = useLayout();
    const navigate = useNavigate();

    React.useEffect(() => {
        setCurrentSection('Safety');
    }, [setCurrentSection]);

    const handleAddChecklist = () => {
        navigate('/safety/permit-checklist/add');
    };

    const handleViewDetails = (id: string) => {
        navigate(`/safety/permit/checklist/details/${id}`);
    };

    // Mock data - replace with actual API call
    const mockChecklists: PermitChecklist[] = [
        {
            id: '1',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Loading, Unloading Hazardous Material Work',
            questionCount: 16
        },
        {
            id: '2',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Hot Work',
            questionCount: 18
        },
        {
            id: '3',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Height Work',
            questionCount: 13
        },
        {
            id: '4',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Excavation Work',
            questionCount: 17
        },
        {
            id: '5',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Electrical Work',
            questionCount: 14
        },
        {
            id: '6',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Cold Work',
            questionCount: 14
        },
        {
            id: '7',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Confined Space Work',
            questionCount: 17
        },
        {
            id: '8',
            name: 'Safety Checks + PPE Checks',
            status: true,
            category: 'Radiology Work',
            questionCount: 16
        }
    ];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">PERMIT CHECKLIST</h1>
                <Button
                    onClick={handleAddChecklist}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Checklist
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-4 font-medium text-gray-700">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </th>
                            <th className="text-left p-4 font-medium text-gray-700">Action</th>
                            <th className="text-left p-4 font-medium text-gray-700">Name</th>
                            <th className="text-left p-4 font-medium text-gray-700">Status</th>
                            <th className="text-left p-4 font-medium text-gray-700">Category</th>
                            <th className="text-right p-4 font-medium text-gray-700">No. Of Q.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockChecklists.map((checklist) => (
                            <tr key={checklist.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </td>
                                <td className="p-4">
                                    <Button
                                        onClick={() => handleViewDetails(checklist.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </td>
                                <td className="p-4 text-gray-900">{checklist.name}</td>
                                <td className="p-4">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <span className={checklist.status ? 'text-blue-600' : 'text-gray-500'}>
                                            {checklist.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-900">{checklist.category}</td>
                                <td className="p-4 text-right text-gray-900">{checklist.questionCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PermitChecklistList;
