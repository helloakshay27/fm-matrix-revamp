import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SmartsecureIntegrationTab } from "../components/SmartsecureIntegrationTab";
import { EnquiriesTab } from "../components/EnquiriesTab";

const GateIntegration = () => {
    const [activeTab, setActiveTab] = useState("smartsecure-integration");

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900">Quikgate Integration</h1>
            <p className="mt-1 text-sm text-gray-500">
                Manage Quikgate society gates — Society, Society Block, User and Gate Device.
            </p>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                <TabsList className="bg-gray-100">
                    <TabsTrigger
                        value="smartsecure-integration"
                        className="data-[state=active]:bg-brand data-[state=active]:text-white rounded"
                    >
                        Quikgate Integration
                    </TabsTrigger>
                    <TabsTrigger
                        value="enquiries"
                        className="data-[state=active]:bg-brand data-[state=active]:text-white rounded"
                    >
                        Enquiries
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="smartsecure-integration" className="mt-4">
                    <SmartsecureIntegrationTab />
                </TabsContent>

                <TabsContent value="enquiries" className="mt-4">
                    <EnquiriesTab />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default GateIntegration;
