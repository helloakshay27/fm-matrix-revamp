import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  OrganizationTab, 
  CompanyTab, 
  CountryTab, 
  RegionTab, 
  ZoneTab, 
  SiteTab, 
  EntityTab, 
  UserCategoryTab 
} from '@/components/ops-account';

export const OpsAccountPage = () => {
  const [activeTab, setActiveTab] = useState('organization');
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('25');

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ACCOUNT</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-6">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="country">Headquarter</TabsTrigger>
          <TabsTrigger value="region">Region</TabsTrigger>
          {/* <TabsTrigger value="zone">Zone</TabsTrigger> */}
          <TabsTrigger value="site">Site</TabsTrigger>
          {/* <TabsTrigger value="entity">Entity</TabsTrigger>
          <TabsTrigger value="user-category">User Category</TabsTrigger> */}
        </TabsList>

        <TabsContent value="organization" className="space-y-4">
          <OrganizationTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <CompanyTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent>

        <TabsContent value="country" className="space-y-4">
          <CountryTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent>

        <TabsContent value="region" className="space-y-4">
          <RegionTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent>

        {/* <TabsContent value="zone" className="space-y-4">
          <ZoneTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent> */}

        <TabsContent value="site" className="space-y-4">
          <SiteTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent>
{/* 
        <TabsContent value="entity" className="space-y-4">
          <EntityTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent>

        <TabsContent value="user-category" className="space-y-4">
          <UserCategoryTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            entriesPerPage={entriesPerPage}
            setEntriesPerPage={setEntriesPerPage}
          />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};
