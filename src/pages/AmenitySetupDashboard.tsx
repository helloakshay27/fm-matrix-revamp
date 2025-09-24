import { AddAmenityModal } from "@/components/AddAmenityModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useAppDispatch } from "@/store/hooks";
import { fetchAmenity } from "@/store/slices/amenitySlice";
import { Eye, Edit, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    {
        key: "name",
        label: "Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "icon",
        label: "Icon",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const AmenitySetupDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token')
    const baseUrl = localStorage.getItem('baseUrl')
    const siteId = localStorage.getItem('selectedSiteId')

    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false)
    const [record, setRecord] = useState({})
    const [amenities, setAmenities] = useState([])
    const [loadingData, setLoadingData] = useState(true)

    const fetchData = async () => {
        setLoadingData(true)
        try {
            const response = await dispatch(fetchAmenity({ baseUrl, token, siteId })).unwrap();
            setAmenities(response.amenities)
        } catch (error) {
            console.log(error)
            toast.dismiss();
            toast.error(error);
        } finally {
            setLoadingData(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "icon":
                return (
                    <div className="flex justify-center">
                        <img
                            src={item.document_url}
                            alt=""
                            className="w-14 h-14 object-cover"
                        />
                    </div>
                )
            default:
                return item[columnKey] || "-";
        }
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/settings/community-modules/amenity-setup/${item.id}`)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => {
                        setIsEditing(true)
                        setShowAddModal(true)
                        setRecord(item)
                    }}
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setShowAddModal(true)}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    return (
        <div className="p-6">
            <EnhancedTable
                columns={columns}
                data={amenities}
                renderCell={renderCell}
                renderActions={renderActions}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
                loading={loadingData}
            />

            <AddAmenityModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false)
                    setIsEditing(false)
                    setRecord({})
                }}
                fetchData={fetchData}
                isEditing={isEditing}
                record={record}
            />
        </div>
    )
}

export default AmenitySetupDashboard