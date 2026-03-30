import { AdminViewEmulation } from '@/components/AdminViewEmulation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp } from 'lucide-react'
import TeamPerformance from './TeamPerformance'

const TeamDashboard = () => {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <AdminViewEmulation />
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Team Dashboard</h1>
                    <p className="text-gray-500 mt-1">Performance overview and feedback analytics</p>
                </div>
            </div>

            <Tabs defaultValue="team_performance" className="w-full">
                <TabsList className="w-full rounded-[10px]">
                    <TabsTrigger value="team_performance" className="w-full rounded-[8px]">
                        <TrendingUp className='h-4 w-4 mr-2' />
                        Team Performance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="team_performance">
                    <TeamPerformance />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default TeamDashboard