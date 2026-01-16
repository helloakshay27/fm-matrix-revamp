import ExternalSosDirectory from "@/components/ExternalSosDirectory"
import InternalSosDirectory from "@/components/InternalSosDirectory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { SosFilterParams } from "@/components/SosFilterModal"

const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const SOSDirectory = () => {
    const baseUrl = localStorage.getItem('baseUrl')
    const token = localStorage.getItem('token')

    const [internalSos, setInternalSos] = useState([])
    const [internalPagination, setInternalPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 1
    })
    const [internalSearchQuery, setInternalSearchQuery] = useState("")
    const [internalFilters, setInternalFilters] = useState<SosFilterParams>({})
    const [internalLoading, setInternalLoading] = useState(false)

    const [externalSos, setExternalSos] = useState([])
    const [externalPagination, setExternalPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 1
    })
    const [externalSearchQuery, setExternalSearchQuery] = useState("")
    const [externalFilters, setExternalFilters] = useState<SosFilterParams>({})
    const [externalLoading, setExternalLoading] = useState(false)

    const fetchInternalSos = async (page = 1, search = "", filters: SosFilterParams = {}) => {
        setInternalLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('q[directory_type_eq]', 'internal')
            params.append('page', page.toString())

            if (search) {
                params.append('q[title_cont]', search)
            }
            if (filters.created_at) {
                params.append('q[created_at_eq]', filters.created_at)
            }
            if (filters.created_by) {
                params.append('q[created_by_cont]', filters.created_by)
            }
            if (filters.status) {
                params.append('q[status_eq]', filters.status)
            }

            const response = await axios.get(`https://${baseUrl}/sos_directories.json?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setInternalSos(response.data.sos_directories)
            setInternalPagination(response.data.pagination)
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch internal SOS directories")
        } finally {
            setInternalLoading(false)
        }
    }

    const fetchExternalSos = async (page = 1, search = "", filters: SosFilterParams = {}) => {
        setExternalLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('q[directory_type_eq]', 'external')
            params.append('page', page.toString())

            if (search) {
                params.append('q[title_cont]', search)
            }
            if (filters.created_at) {
                params.append('q[created_at_eq]', filters.created_at)
            }
            if (filters.created_by) {
                params.append('q[created_by_eq]', filters.created_by)
            }
            if (filters.status) {
                params.append('q[status_eq]', filters.status)
            }

            const response = await axios.get(`https://${baseUrl}/sos_directories.json?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setExternalSos(response.data.sos_directories)
            setExternalPagination(response.data.pagination)
        } catch (error) {
            console.log(error)
            toast.error("Failed to fetch external SOS directories")
        } finally {
            setExternalLoading(false)
        }
    }

    const handleStatusChange = async (id: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        try {
            const formData = new FormData();
            formData.append("sos_directory[status]", String(newStatus));

            await axios.put(`https://${baseUrl}/sos_directories/${id}.json`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setInternalSos((prev: any) => prev.map((item: any) =>
                item.id === id ? { ...item, status: newStatus } : item
            ));
            setExternalSos((prev: any) => prev.map((item: any) =>
                item.id === id ? { ...item, status: newStatus } : item
            ));
            toast.success("Status updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update status");
        }
    }

    // Internal handlers
    const handleInternalPageChange = async (page: number) => {
        if (page < 1 || page > internalPagination.total_pages || page === internalPagination.current_page || internalLoading) {
            return;
        }
        setInternalPagination(prev => ({ ...prev, current_page: page }))
        await fetchInternalSos(page, internalSearchQuery, internalFilters)
    }

    const debouncedInternalSearch = useCallback(
        debounce((query: string) => {
            setInternalPagination(prev => ({ ...prev, current_page: 1 }))
            fetchInternalSos(1, query, internalFilters)
        }, 500),
        [internalFilters]
    )

    const handleInternalSearchChange = (query: string) => {
        setInternalSearchQuery(query)
        debouncedInternalSearch(query)
    }

    const handleInternalFilterApply = (filters: SosFilterParams) => {
        setInternalFilters(filters)
        setInternalPagination(prev => ({ ...prev, current_page: 1 }))
        fetchInternalSos(1, internalSearchQuery, filters)
    }

    // External handlers
    const handleExternalPageChange = async (page: number) => {
        if (page < 1 || page > externalPagination.total_pages || page === externalPagination.current_page || externalLoading) {
            return;
        }
        setExternalPagination(prev => ({ ...prev, current_page: page }))
        await fetchExternalSos(page, externalSearchQuery, externalFilters)
    }

    const debouncedExternalSearch = useCallback(
        debounce((query: string) => {
            setExternalPagination(prev => ({ ...prev, current_page: 1 }))
            fetchExternalSos(1, query, externalFilters)
        }, 500),
        [externalFilters]
    )

    const handleExternalSearchChange = (query: string) => {
        setExternalSearchQuery(query)
        debouncedExternalSearch(query)
    }

    const handleExternalFilterApply = (filters: SosFilterParams) => {
        setExternalFilters(filters)
        setExternalPagination(prev => ({ ...prev, current_page: 1 }))
        fetchExternalSos(1, externalSearchQuery, filters)
    }

    useEffect(() => {
        fetchInternalSos()
        fetchExternalSos()
    }, [])

    return (
        <div className="p-6">
            <Tabs
                defaultValue="internal"
                className="w-full"
            >
                <TabsList className="w-full bg-white border border-gray-200">
                    <TabsTrigger
                        value="internal"
                        className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        Internal
                    </TabsTrigger>

                    <TabsTrigger
                        value="external"
                        className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        External
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="internal">
                    <InternalSosDirectory
                        internalSos={internalSos}
                        handleStatusChange={handleStatusChange}
                        pagination={internalPagination}
                        onPageChange={handleInternalPageChange}
                        searchQuery={internalSearchQuery}
                        onSearchChange={handleInternalSearchChange}
                        onFilterApply={handleInternalFilterApply}
                        loading={internalLoading}
                    />
                </TabsContent>
                <TabsContent value="external">
                    <ExternalSosDirectory
                        externalSos={externalSos}
                        handleStatusChange={handleStatusChange}
                        pagination={externalPagination}
                        onPageChange={handleExternalPageChange}
                        searchQuery={externalSearchQuery}
                        onSearchChange={handleExternalSearchChange}
                        onFilterApply={handleExternalFilterApply}
                        loading={externalLoading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SOSDirectory