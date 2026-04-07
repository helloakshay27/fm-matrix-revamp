import { AddTaskOrIssueDialog } from '@/components/BusinessCompass/AddTaskOrIssueDialog'
import { AdminViewEmulation } from '@/components/AdminViewEmulation'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Info, TrendingUp, LayoutList, TriangleAlert } from 'lucide-react'
import { useState } from 'react'
import TasksDashboard from '@/components/BusinessCompass/TasksDashboard'
import TasksList from '@/components/BusinessCompass/TasksList'
import StuckIssues from '@/components/BusinessCompass/StuckIssues'
import { cn } from '@/lib/utils'

const BusinessCompassTasksAndIssues = () => {
    const [viewType, setViewType] = useState<'self' | 'all'>('self')
    const [addTaskOpen, setAddTaskOpen] = useState(false)

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-[#f6f4ee] px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-7xl space-y-6 font-poppins text-[#1a1a1a]">
                <AddTaskOrIssueDialog open={addTaskOpen} onOpenChange={setAddTaskOpen} />

                {/* Header — System/SOP + WeeklyReports theme */}
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
                                Tasks &amp; Issues
                            </h1>
                            <button
                                type="button"
                                className="rounded-lg p-1 text-neutral-400 hover:bg-[#fef6f4] hover:text-neutral-600"
                                aria-label="About this page"
                            >
                                <Info className="h-5 w-5" />
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 sm:text-base">
                            Manage your tasks and track stuck challenges from daily reports
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div
                            className="inline-flex rounded-full bg-neutral-200/70 p-1"
                            role="group"
                            aria-label="View scope"
                        >
                            <button
                                type="button"
                                onClick={() => setViewType('self')}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                                    viewType === 'self'
                                        ? 'bg-[#fef6f4] text-neutral-900 shadow-sm ring-1 ring-[#DA7756]/20'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                Self
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewType('all')}
                                className={cn(
                                    'rounded-full px-4 py-2 text-sm font-medium transition-all',
                                    viewType === 'all'
                                        ? 'bg-[#fef6f4] text-neutral-900 shadow-sm ring-1 ring-[#DA7756]/20'
                                        : 'text-neutral-600 hover:text-neutral-900'
                                )}
                            >
                                All
                            </button>
                        </div>

                        <Button
                            type="button"
                            onClick={() => setAddTaskOpen(true)}
                            className="h-10 shrink-0 rounded-xl bg-[#DA7756] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#DA7756]/85 sm:px-5"
                        >
                            <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
                            New Task
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue="dashboard" className="w-full">
                    <TabsList className="inline-flex h-auto w-full flex-wrap justify-start gap-1 rounded-full bg-neutral-200/70 p-1">
                        <TabsTrigger
                            value="dashboard"
                            className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600"
                        >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Dashboard
                        </TabsTrigger>
                        <TabsTrigger
                            value="tasks"
                            className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600"
                        >
                            <LayoutList className="mr-2 h-4 w-4" />
                            Tasks
                        </TabsTrigger>
                        <TabsTrigger
                            value="issues"
                            className="rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-[#DA7756] data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-neutral-600"
                        >
                            <TriangleAlert className="mr-2 h-4 w-4" />
                            Stuck Issues
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="dashboard" className="mt-6 space-y-6 outline-none">
                        <TasksDashboard viewType={viewType} />
                    </TabsContent>
                    <TabsContent value="tasks" className="mt-6 space-y-6 outline-none">
                        <TasksList />
                    </TabsContent>
                    <TabsContent value="issues" className="mt-6 space-y-6 outline-none">
                        <StuckIssues />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default BusinessCompassTasksAndIssues