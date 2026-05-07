import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import your existing components (NO CHANGE inside them)
import TaxSetupMaster from "./TaxSetupMaster";
import SectionMaster from "./SectionMaster";

const TaxConfigurationPage: React.FC = () => {
  return (
    <div className="p-6">

      {/* Header */}
      {/* <h1 className="text-2xl font-bold mb-4">Tax Configuration</h1> */}

      {/* Tabs */}
      <Tabs defaultValue="section" className="w-full">

        {/* Tab Header */}
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-none">

  {/* SECTION TAB */}
          <TabsTrigger
            value="section"
            className="
              data-[state=active]:bg-[#EDEAE3] 
              data-[state=active]:text-[#C72030]
              data-[state=inactive]:bg-white 
              data-[state=inactive]:text-black
              rounded-none font-semibold
            "
          >
            Section Setup
          </TabsTrigger>

          {/* TAX TAB */}
          <TabsTrigger
            value="tax"
            className="
              data-[state=active]:bg-[#EDEAE3] 
              data-[state=active]:text-[#C72030]
              data-[state=inactive]:bg-white 
              data-[state=inactive]:text-black
              rounded-none font-semibold
            "
          >
            Direct Tax Setup
          </TabsTrigger>

        
        </TabsList>

        {/* TAX CONTENT */}
        <TabsContent value="tax">
          <div className="mt-4">
            <TaxSetupMaster />
          </div>
        </TabsContent>

        {/* SECTION CONTENT */}
        <TabsContent value="section">
          <div className="mt-4">
            <SectionMaster/>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default TaxConfigurationPage;