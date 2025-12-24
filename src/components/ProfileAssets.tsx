import { useEffect, useState } from 'react'
import { EnhancedTable } from './enhanced-table/EnhancedTable'
import { ColumnConfig } from '@/hooks/useEnhancedTable'
import axios from 'axios'

const columns: ColumnConfig[] = [
    {
        key: "name",
        label: "Asset Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "id",
        label: "Asset Id",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "asset_number",
        label: "Asset Number",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "status",
        label: "Asset Status",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "site_name",
        label: "Site Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "building",
        label: "Building",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "wing",
        label: "Wing",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "floor",
        label: "Floor",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "area",
        label: "Area",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "room",
        label: "Room",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "group",
        label: "Group",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "sub_group",
        label: "Sub Group",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "asset_type",
        label: "Asset Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "critical",
        label: "Critical",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "category_type",
        label: "Category Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "allocation_type",
        label: "Allocation Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "allocated_to",
        label: "Allocated To",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "asset_category",
        label: "Asset Category",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },

]

const ProfileAssets = () => {
    const baseUrl = localStorage.getItem('baseUrl') || ''
    const token = localStorage.getItem('token') || ''
    const id = JSON.parse(localStorage.getItem('user') || '{}').id || ''

    const [assets, setAssets] = useState([]);

    const fetchAssets = async () => {
        try {
            const respone = await axios.get(`https://${baseUrl}/pms/assets.json?page=1&q[allocation_type_eq]=users&q[allocation_ids_cont]=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setAssets(respone.data.assets)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAssets()
    }, [])

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "status":
                return item?.status.replace(/_/g, ' ').charAt(0).toUpperCase() + item?.status.replace(/_/g, ' ').slice(1) || '-';
            case "building":
                return item?.building?.name || '-';
            case "wing":
                return item?.wing?.name || '-';
            case "floor":
                return item?.pms_floor?.name || '-';
            case "area":
                return item?.area?.name || '-';
            case "room":
                return item?.pms_room?.name || '-';
            case "group":
                return item?.asset_group || '-';
            case "sub_group":
                return item?.asset_sub_group || '-';
            default:
                return item[columnKey] || '-';
        }

    }

    return (
        <div>
            <EnhancedTable
                data={assets}
                columns={columns}
                renderCell={renderCell}
            />
        </div>
    )
}

export default ProfileAssets