
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

const AccountSetup = () => {
  const [activeTab, setActiveTab] = useState("organization");

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Setup</span>
          <span>&gt;</span>
          <span>Account</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">ACCOUNT</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="organization" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Organization
              </TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="country">Country</TabsTrigger>
              <TabsTrigger value="region">Region</TabsTrigger>
              <TabsTrigger value="zone">Zone</TabsTrigger>
              <TabsTrigger value="site">Site</TabsTrigger>
              <TabsTrigger value="entity">Entity</TabsTrigger>
            </TabsList>

            <TabsContent value="organization" className="mt-6">
              <div className="flex justify-center">
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <CardTitle className="text-xl font-semibold">Lockated H.O</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input id="orgName" placeholder="Enter organization name" />
                    </div>
                    <div>
                      <Label htmlFor="orgCode">Organization Code</Label>
                      <Input id="orgCode" placeholder="Enter organization code" />
                    </div>
                    <div>
                      <Label htmlFor="logo">Logo</Label>
                      <div className="flex items-center gap-2">
                        <Input id="logo" type="file" accept="image/*" className="hidden" />
                        <Button 
                          variant="outline" 
                          onClick={() => document.getElementById('logo')?.click()}
                          className="w-full"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company Setup</CardTitle>
                  <CardDescription>Configure company information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Company configuration will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="country" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Country Setup</CardTitle>
                  <CardDescription>Configure country information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Country configuration will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="region" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Region Setup</CardTitle>
                  <CardDescription>Configure region information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Region configuration will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="zone" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Zone Setup</CardTitle>
                  <CardDescription>Configure zone information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Zone configuration will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="site" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Setup</CardTitle>
                  <CardDescription>Configure site information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Site configuration will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="entity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entity Setup</CardTitle>
                  <CardDescription>Configure entity information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Entity configuration will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SetupLayout>
  );
};

export default AccountSetup;
