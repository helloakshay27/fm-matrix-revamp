import ProfileBasicInfo from '@/components/ProfileBasicInfo'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfileRoster from './ProfileRoster'
import ProfileWallet from '@/components/ProfileWallet'
import ProfileAttendance from '@/components/ProfileAttendance'
import ProfileAssets from '@/components/ProfileAssets'
import { useEffect, useState } from 'react'
import axios from 'axios'

const ProfileDetailsPage = () => {
    const baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    const id = JSON.parse(localStorage.getItem('user')).id

    const [details, setDetails] = useState({})

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

    return (
        <div className='p-6'>
            <Tabs defaultValue={"basic_info"} className='w-full'>
                <TabsList className="w-full bg-white border border-gray-200">
                    <TabsTrigger value='basic_info' className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold">
                        Basic Info
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