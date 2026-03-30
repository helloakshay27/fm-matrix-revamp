import { AdminViewEmulation } from '@/components/AdminViewEmulation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Info, TrendingUp, LayoutList, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import TasksDashboard from '@/components/BusinessCompass/TasksDashboard'
import TasksList from '@/components/BusinessCompass/TasksList'
import StuckIssues from '@/components/BusinessCompass/StuckIssues'

const BusinessCompassTasksAndIssues = () => {
    const [viewType, setViewType] = useState<'self' | 'all'>('self')

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <AdminViewEmulation />

            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-[#1a1a1a]">Tasks & Issues</h1>
                        <Info className="w-5 h-5 text-gray-400 cursor-pointer" />
                    </div>
                    <p className="text-gray-500 mt-1">Manage your tasks and track stuck challenges from daily reports</p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Self/All Toggle */}
                    <div className="bg-primary p-1 rounded-[10px] flex items-center">
                        <button
                            onClick={() => setViewType('self')}
                            className={`px-4 py-1.5 rounded-[8px] text-sm font-medium transition-all ${viewType === 'self'
                                ? 'bg-white text-[#1a1a1a] shadow-md'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Self
                        </button>
                        <button
                            onClick={() => setViewType('all')}
                            className={`px-4 py-1.5 rounded-[8px] text-sm font-medium transition-all ${viewType === 'all'
                                ? 'bg-white text-[#1a1a1a] shadow-md'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            All
                        </button>
                    </div>

                    {/* New Task Button */}
                    <Button>
                        <Plus className="w-5 h-5" />
                        New Task
                    </Button>
                </div>
            </div>

            <Tabs defaultValue='dashboard' className='w-full'>
                <TabsList className='w-full rounded-[10px] bg-primary flex items-center justify-start'>
                    <TabsTrigger value='dashboard' className='rounded-[8px]'>
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Dashboard
                    </TabsTrigger>
                    <TabsTrigger value='tasks' className='rounded-[8px]'>
                        <LayoutList className="w-4 h-4 mr-2" />
                        Tasks
                    </TabsTrigger>
                    <TabsTrigger value='issues' className='rounded-[8px]'>
                        <TriangleAlert className="w-4 h-4 mr-2" />
                        Stuck Issues
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='dashboard'>
                    <TasksDashboard viewType={viewType} />
                </TabsContent>
                <TabsContent value='tasks'>
                    <TasksList />
                </TabsContent>
                <TabsContent value='issues'>
                    <StuckIssues />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default BusinessCompassTasksAndIssues