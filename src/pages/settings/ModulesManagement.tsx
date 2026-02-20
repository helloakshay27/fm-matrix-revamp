import { useEffect, useState } from "react"
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button"
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Switch } from "@mui/material"
import { toast } from "sonner"
import axios from "axios"
import { RefreshCw, Save } from "lucide-react"

const columns: ColumnConfig[] = [
    {
        key: "name",
        label: "Module Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "isEnabled",
        label: "Is Enable",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const ModulesManagement = () => {
    const baseUrl = localStorage.getItem("baseUrl")
    const token = localStorage.getItem("token")
    const selectedSite = localStorage.getItem("selectedSiteId")

    const [modules, setModules] = useState([])
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchModules = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://${baseUrl}/api/site_configurations/${selectedSite}.json`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            setModules(response.data.configurations)
        } catch (error) {
            console.log(error)
            const message = error.response.data.error ?? "Failed to fetch modules"
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchModules()
    }, [])

    const handleToggle = (name: string) => {
        setModules(prev => prev.map(module =>
            module.feature_name === name
                ? { ...module, enabled: !module.enabled }
                : module
        ))
    }

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true)
            await axios.post(`https://${baseUrl}/api/site_configurations.json`, {
                site_id: selectedSite,
                configurations: modules.map(module => ({
                    feature_name: module.feature_name,
                    enabled: module.enabled
                }))
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            toast.success("Modules updated successfully")
        } catch (error) {
            console.log(error)
            const message = error.response.data.error ?? "Failed to update modules"
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "name":
                const formattedName = item.feature_name
                    ?.replace(/_/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase());

                return <span>{formattedName}</span>;
            case "isEnabled":
                return (
                    <Switch
                        size="small"
                        checked={item.enabled}
                        onChange={() => handleToggle(item.feature_name)}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#04A231',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#04A231',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked)': {
                                color: '#C72030',
                            },
                            '& .MuiSwitch-switchBase:not(.Mui-checked) + .MuiSwitch-track': {
                                backgroundColor: 'rgba(199, 32, 48, 0.5)',
                            },
                        }}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Modules Management</h1>
                    <p className="text-gray-500 mt-1">
                        Manage and enable/disable modules
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        onClick={fetchModules}
                        disabled={loading}
                        className="bg-[#C72030] hover:bg-[#a81c29] text-white"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-[#C72030] hover:bg-[#a81c29] text-white"
                    >
                        <Save className={`w-4 h-4 mr-2`} />
                        Save Changes
                    </Button>
                </div>
            </div>
            <EnhancedTable
                data={modules}
                columns={columns}
                renderCell={renderCell}
                hideColumnsButton={true}
                hideTableSearch={true}
            />
        </div>
    )
}

export default ModulesManagement