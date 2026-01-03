import { useEffect, useState } from 'react'
import axios from 'axios'

const ProfileBasicInfo = ({ details }) => {
    const baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    const id = JSON.parse(localStorage.getItem('user')).id

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalAction, setModalAction] = useState<'Clone' | 'ReassignTo' | null>(null)
    const [loading, setLoading] = useState(true)

    const [projects, setProjects] = useState([])

    const fetchAssociatedProjects = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`https://${baseUrl}/users/${id}/asssoicated_projects.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            console.log(response.data)
            setProjects(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAssociatedProjects();
    }, [])

    const getInitials = () => {
        return `${details?.firstname?.charAt(0).toUpperCase()}${details?.lastname?.charAt(0).toUpperCase()}`
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    return (
        <div className="flex flex-col gap-5 p-10 text-[14px] bg-gray-100 min-h-screen">
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        <span className="text-gray-600 font-medium">Loading profile data...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Header Section */}
                    <div className="flex justify-between gap-10">
                        <div className="flex justify-start gap-4 w-2/3">
                            {/* User Avatar */}
                            <span className="rounded-full bg-gray-300 w-[65px] h-[65px] flex justify-center items-center text-[25px] font-semibold">
                                {getInitials()}
                            </span>

                            {/* User Info */}
                            <div className="flex flex-col gap-3">
                                <span className="font-semibold text-base">
                                    {`${details?.firstname?.charAt(0)?.toUpperCase()}${details?.firstname?.slice(1)} ${details?.lastname?.charAt(0)?.toUpperCase()}${details?.lastname?.slice(1)}`}
                                </span>
                                <div className="flex justify-between gap-10 text-[12px]">
                                    <span>{`Email Id: ${details.email}`}</span>
                                    <span>{`Role: ${details?.lock_role?.name}`}</span>
                                    <span>{`Reports To: ${details.report_to?.name || "N/A"}`}</span>
                                    <span className={`${details.active ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {details.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats and Projects Section */}
                    <div className="flex justify-between gap-3">
                        {/* Left Column - Stats */}
                        <div className="flex flex-col gap-10 w-1/2">
                            {/* Hours Stats */}
                            <div className="flex justify-center items-center gap-20 h-[120px] bg-white rounded-lg shadow-sm p-4">
                                <div className="text-center">
                                    <h1 className="block mb-4 font-bold text-sm">Planned Hours</h1>
                                    <span className="text-lg font-semibold">00 : 00</span>
                                </div>
                                <span className="border-l-2 border-gray-300 h-[80px]"></span>

                                <div className="text-center">
                                    <h1 className="block mb-4 font-bold text-sm">Actual Hours</h1>
                                    <span className="text-lg font-semibold">00 : 00</span>
                                </div>
                            </div>

                            {/* Milestones and Tasks Stats */}
                            <div className="flex justify-center items-center gap-20 h-[120px] bg-white rounded-lg shadow-sm p-4">
                                <div className="text-center">
                                    <h1 className="block mb-4 font-bold text-sm">Milestones</h1>
                                    <span className="block mb-2 text-sm">Open: {details?.open_milestones_count || 0}</span>
                                    <span className="text-sm">Closed: {details?.completed_milestones_count || 0}</span>
                                </div>
                                <span className="border-l-2 border-gray-300 h-[80px]"></span>
                                <div className="text-center">
                                    <h1 className="block mb-4 font-bold text-sm">Tasks</h1>
                                    <span className="block mb-2 text-sm">Open: {details?.open_tasks_count || 0}</span>
                                    <span className="text-sm">Closed: {details?.completed_tasks_count || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Associated Projects */}
                        <div className="flex flex-col gap-3 w-[40%] bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between gap-20 text-[12px] mb-4">
                                <span className="font-semibold">Associated Projects</span>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(true)
                                            setModalAction('Clone')
                                        }}
                                        className="text-orange-500 hover:text-orange-700 cursor-pointer text-xs"
                                    >
                                        Clone
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsModalOpen(true)
                                            setModalAction('ReassignTo')
                                        }}
                                        className="text-orange-500 hover:text-orange-700 cursor-pointer text-xs"
                                    >
                                        Reassign To
                                    </button>
                                </div>
                            </div>

                            {/* Projects Table */}
                            <div className="overflow-y-auto max-h-[312px]">
                                <table className="w-full border border-gray-200">
                                    <thead className="bg-gray-50 sticky top-0 border border-gray-200">
                                        <tr>
                                            <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-semibold">
                                                Project Title
                                            </th>
                                            <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-semibold">
                                                Project Type
                                            </th>
                                            <th className="border-r border-gray-200 px-4 py-3 text-left text-sm font-semibold">
                                                Created On
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.length > 0 ? (
                                            projects.map((project) => (
                                                <tr key={project?.project_management_id} className="hover:bg-gray-50 border-b border-gray-200">
                                                    <td className="px-4 py-3 flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                                        />
                                                        <span className="text-sm">{project?.project_management_name}</span>
                                                    </td>
                                                    <td className="border-l border-gray-200 px-4 py-3 text-sm">
                                                        {project?.project_management_type?.charAt(0)?.toUpperCase() + project?.project_management_type?.slice(1)}
                                                    </td>
                                                    <td className="border-l border-gray-200 px-4 py-3 text-sm">
                                                        {formatDate(project?.project_management_created_at)}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={3} className="text-center py-4 text-gray-500 text-sm">
                                                    No associated projects
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder for Modal - to be implemented */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
                            <div className="w-[560px] bg-white border border-gray-300 p-6 rounded-lg shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">
                                        {modalAction === 'Clone' ? 'Clone Projects' : 'Reassign To'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mb-6">
                                    {modalAction === 'Clone'
                                        ? 'Select a user to clone and assign all projects to.'
                                        : 'Select a user to reassign projects to.'}
                                </p>
                                <div className="flex gap-4 justify-end">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
                                    >
                                        Cancel
                                    </button>
                                    <button className="px-6 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default ProfileBasicInfo