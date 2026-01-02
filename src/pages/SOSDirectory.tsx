import ExternalSosDirectory from "@/components/ExternalSosDirectory"
import InternalSosDirectory from "@/components/InternalSosDirectory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const SOSDirectory = () => {
    const baseUrl = localStorage.getItem('baseUrl')
    const token = localStorage.getItem('token')

    const [internalSos, setInternalSos] = useState([])
    const [internaPagination, setInternaPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 1
    })
    const [externalSos, setExternalSos] = useState([])
    const [externalPagination, setExternalPagination] = useState({
        current_page: 1,
        total_count: 0,
        total_pages: 1
    })

    const fetchInternalSos = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/sos_directories.json?q[directory_type_eq]=internal`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setInternalSos(response.data.sos_directories)
            setInternaPagination(response.data.pagination)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchExternalSos = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/sos_directories.json?q[directory_type_eq]=external`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setExternalSos(response.data.sos_directories)
            setExternalPagination(response.data.pagination)
        } catch (error) {
            console.log(error)
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
                    <InternalSosDirectory internalSos={internalSos} handleStatusChange={handleStatusChange} />
                </TabsContent>
                <TabsContent value="external">
                    <ExternalSosDirectory externalSos={externalSos} handleStatusChange={handleStatusChange} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default SOSDirectory