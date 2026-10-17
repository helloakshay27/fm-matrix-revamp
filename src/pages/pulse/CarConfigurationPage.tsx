import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AssetTabsList, AssetTabsTrigger } from "@/components/common/AssetTabBar";
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <AssetTabsList className="grid grid-cols-3">
          <AssetTabsTrigger
            value="brands"
          >
            Vehicle Brands
          </AssetTabsTrigger>
          <AssetTabsTrigger
            value="models"
          >
            Vehicle Models
          </AssetTabsTrigger>
          <AssetTabsTrigger
            value="colours"
          >
            Vehicle Colours
          </AssetTabsTrigger>
        </AssetTabsList>

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
