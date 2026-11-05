import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import BookingListDashboard from "./BookingListDashboard"
// import BookingCalenderView from "./BookingCalenderView"
import AmenityBookingClubCalenderView from "./AmenityBookingCalenderView"
import AmenityBookingListClubDashboard from "./AmenityBookingDashboard"
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents"
import { useBackWithFallback } from "@/hooks/useBackWithFallback"

const AmenityBookingListClub = () => {
    // Browser Back goes to the Club Management dashboard when this page was
    // opened directly and there is no earlier entry in the history.
    useBackWithFallback("/club-management/dashboard");
    const cmEvents = useClubManagementEvents();

    // The open tab is kept in the URL (?view=list) so Back from a booking returns to it.
    const [searchParams, setSearchParams] = useSearchParams();
    const view = searchParams.get("view") === "list" ? "list" : "calender";
    const handleViewChange = (next: string) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);
            if (next === "list") params.set("view", "list");
            else params.delete("view");
            return params;
        }, { replace: true });
    };
    const listViewedFired = useRef(false);

    useEffect(() => {
        if (!listViewedFired.current) {
            listViewedFired.current = true;
            cmEvents.listViewed("Amenity Booking", "amenity_booking_list");
        }
    }, [cmEvents]);

    return (
        <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
            <Tabs
                value={view}
                onValueChange={handleViewChange}
                className="w-full"
            >
                <TabsList className="w-full bg-white border border-gray-200">
                    <TabsTrigger
                        value="calender"
                        className="group w-full flex items-center gap-2 data-[state=active]:bg-[#f5f4f0] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        Calendar View
                    </TabsTrigger>

                    <TabsTrigger
                        value="list"
                        className="group w-full flex items-center gap-2 data-[state=active]:bg-[#f5f4f0] data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
                    >
                        List
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="calender">
                    <AmenityBookingClubCalenderView />
                </TabsContent>
                <TabsContent value="list">
                    <AmenityBookingListClubDashboard />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AmenityBookingListClub