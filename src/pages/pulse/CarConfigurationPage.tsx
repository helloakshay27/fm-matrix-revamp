import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleBrandsTab } from "@/components/pulse-carpool/VehicleBrandsTab";
import { VehicleModelsTab } from "@/components/pulse-carpool/VehicleModelsTab";
import { VehicleColoursTab } from "@/components/pulse-carpool/VehicleColoursTab";
import { usePulseEvents } from "@/components/PostHogPulseEvents";

const TAB_VALUES = ["brands", "models", "colours"] as const;

const CarConfigurationPage = () => {
  const pulseEvents = usePulseEvents();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = TAB_VALUES.includes(tabParam as typeof TAB_VALUES[number])
    ? (tabParam as typeof TAB_VALUES[number])
    : "brands";

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  // Pulse Carpool Car Configuration Viewed — fires once on mount
  useEffect(() => {
    pulseEvents.onCarConfigurationViewed(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Car Configuration</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger
            value="brands"
            className="group flex items-center gap-2 data-[state=active]:bg-brand-selected data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Vehicle Brands
          </TabsTrigger>
          <TabsTrigger
            value="models"
            className="group flex items-center gap-2 data-[state=active]:bg-brand-selected data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Vehicle Models
          </TabsTrigger>
          <TabsTrigger
            value="colours"
            className="group flex items-center gap-2 data-[state=active]:bg-brand-selected data-[state=active]:text-brand data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Vehicle Colours
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="mt-6">
          <VehicleBrandsTab />
        </TabsContent>

        <TabsContent value="models" className="mt-6">
          <VehicleModelsTab />
        </TabsContent>

        <TabsContent value="colours" className="mt-6">
          <VehicleColoursTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CarConfigurationPage;
