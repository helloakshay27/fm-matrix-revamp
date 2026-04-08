import { AdminViewEmulation } from '@/components/AdminViewEmulation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp } from 'lucide-react'
import { TeamPerformance } from './TeamPerformance'

const TeamDashboard = () => {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto bg-[#f6f4ee] rounded-2xl border border-[rgba(218,119,86,0.18)]">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Team Dashboard</h1>
                    <p className="text-neutral-500 mt-1">Performance overview and feedback analytics</p>
                </div>
            </div>

            <Tabs defaultValue="team_performance" className="w-full">
                <TabsList className="w-full rounded-2xl bg-[#DA7756] p-1 h-auto">
                    <TabsTrigger
                        value="team_performance"
                        className="w-full rounded-xl text-sm font-semibold text-white/80 data-[state=active]:bg-white data-[state=active]:text-[#DA7756] data-[state=active]:shadow-sm"
                    >
                        <TrendingUp className='h-4 w-4 mr-2' />
                        Team Performance
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="team_performance" className="mt-5">
                    <TeamPerformance />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default TeamDashboard