import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "../enhanced-table/EnhancedTable";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

interface CommunityReportsTabProps {
    communityId?: string;
}

const columns: ColumnConfig[] = [
    {
        key: "action",
        label: "Actions",
        sortable: false,
        hideable: false,
        draggable: false,
        defaultVisible: true,
    },
    {
        key: "access_card_no",
        label: "Access Card No.",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "name",
        label: "Name",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "against",
        label: "Against",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "mobile",
        label: "Mobile Number",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "email",
        label: "Email Address",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "gender",
        label: "Gender",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "company",
        label: "Company Name",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "designation",
        label: "Designation",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "correspondence_address",
        label: "Correspondence Address",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
]

const CommunityReportsTab = ({ communityId }: CommunityReportsTabProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")

    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        try {
            const resourceType = searchParams.get("resourceType");
            const resourceId = searchParams.get("resourceId");

            let url = `https://${baseUrl}/communities/${communityId}/reports.json`;

            // Add query parameters if provided
            if (resourceType && resourceId) {
                url = `${url}?q[community_reports_resource_type_eq]=${resourceType}&q[community_reports_resource_id_eq]=${resourceId}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setReports(response.data.reports)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [searchParams])

    const renderActions = (item: any) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/pulse/community/${communityId}/user/${item.id}`)}
        >
            <Eye className="w-4 h-4" />
        </Button>
    )

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "action":
                return renderActions(item)
            case "company":
                return item.organization || "-"
            case "correspondence_address":
                return item.address || "-"
            default:
                return item[columnKey] || "-"
        }
    }

    return (
        <div className="">
            <EnhancedTable
                data={reports}
                columns={columns}
                renderCell={renderCell}
                hideTableSearch={true}
                hideColumnsButton={true}
                getItemId={(item: any) => String(item.id)}
            />
        </div>
    );
};

export default CommunityReportsTab;
