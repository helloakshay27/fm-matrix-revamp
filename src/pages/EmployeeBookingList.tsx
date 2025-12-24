import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EmployeeBookingListDashboard from "./EmployeeBookingListDashboard"
import EmployeeBookingCalenderView from "./EmployeeBookingCalenderView"

const EmployeeBookingList = () => {
    return (
        <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
            <Tabs
                defaultValue="calender"
                className="w-full"
            >
                <TabsList className="w-full bg-white border border-gray-200">
                    <TabsTrigger
                        value="calender"
                        className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        Calendar View
                    </TabsTrigger>

                    <TabsTrigger
                        value="list"
                        className="group w-full flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        List
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="calender">
                    <EmployeeBookingCalenderView />
                </TabsContent>
                <TabsContent value="list">
                    <EmployeeBookingListDashboard />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default EmployeeBookingList