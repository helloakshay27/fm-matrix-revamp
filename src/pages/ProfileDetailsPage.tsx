import ProfileBasicInfo from '@/components/ProfileBasicInfo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileRoster from './ProfileRoster'
import ProfileWallet from '@/components/ProfileWallet'
import ProfileAttendance from '@/components/ProfileAttendance'
import ProfileAssets from '@/components/ProfileAssets'
import FaceEnrollmentPanel from '@/components/FaceEnrollmentPanel'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const PROFILE_TABS = ['basic_info', 'face_enroll', 'assets', 'attendance', 'my_roster', 'my_wallet'] as const
type ProfileTab = typeof PROFILE_TABS[number]

const getProfileTab = (tab: string | null): ProfileTab => {
    return PROFILE_TABS.includes(tab as ProfileTab) ? tab as ProfileTab : 'basic_info'
}

const ProfileDetailsPage = () => {
    const navigate = useNavigate()
    const baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    const id = JSON.parse(localStorage.getItem('user')).id

    const [details, setDetails] = useState({})
    const [searchParams, setSearchParams] = useSearchParams()
    const requestedTab = getProfileTab(searchParams.get('tab'))
    const enrollmentReturnTo = searchParams.get('returnTo')
    const [activeTab, setActiveTab] = useState<ProfileTab>(requestedTab)

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/user_details/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            console.log(response)
            setDetails(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUserDetails();
    }, [])

    useEffect(() => {
        setActiveTab(requestedTab)
    }, [requestedTab])

    const handleTabChange = (value: string) => {
        const nextTab = getProfileTab(value)
        const nextParams = new URLSearchParams(searchParams)

        setActiveTab(nextTab)

        if (nextTab === 'basic_info') {
            nextParams.delete('tab')
        } else {
            nextParams.set('tab', nextTab)
        }

        setSearchParams(nextParams, { replace: true })
    }

    const handleFaceEnrollmentSuccess = () => {
        if (enrollmentReturnTo?.startsWith('/') && !enrollmentReturnTo.startsWith('//')) {
            navigate(enrollmentReturnTo, {
                replace: true,
                state: { faceEnrollmentCompletedAt: Date.now() },
            })
        }
    }

    return (
        <div className='p-6'>
            <Tabs value={activeTab} onValueChange={handleTabChange} className='w-full'>
                <TabsList className="w-full bg-white border border-gray-200">
                    <TabsTrigger value='basic_info' className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
                        Basic Info
                    </TabsTrigger>
                    <TabsTrigger value='face_enroll' className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
                        Face Enroll
                    </TabsTrigger>
                    <TabsTrigger value="assets" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
                        Assets
                    </TabsTrigger>
                    <TabsTrigger value="attendance" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
                        Attendance
                    </TabsTrigger>
                    <TabsTrigger value="my_roster" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
                        My Roster
                    </TabsTrigger>
                    <TabsTrigger value="my_wallet" className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
                        My Wallet
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="basic_info">
                    <ProfileBasicInfo details={details} />
                </TabsContent>
                <TabsContent value="face_enroll">
                    <div className="rounded-lg border border-gray-200 bg-[#F6F4EE] p-6">
                        <div className="mb-5">
                            <h2 className="text-xl font-semibold text-[#1A1A1A]">Face Enrollment</h2>
                            <p className="mt-1 text-sm text-[#2C2C2C]/65">
                                Add or update your face profile for secure product access.
                            </p>
                        </div>
                        <FaceEnrollmentPanel onEnrollmentSuccess={handleFaceEnrollmentSuccess} />
                    </div>
                </TabsContent>
                <TabsContent value="assets">
                    <ProfileAssets />
                </TabsContent>
                <TabsContent value="attendance">
                    <ProfileAttendance />
                </TabsContent>
                <TabsContent value="my_roster">
                    <ProfileRoster rosterId={details?.lock_user_permission?.user_roaster_id} />
                </TabsContent>
                <TabsContent value="my_wallet">
                    <ProfileWallet />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default ProfileDetailsPage
