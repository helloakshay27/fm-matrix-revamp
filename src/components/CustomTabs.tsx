import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ReactNode } from "react";

interface Tab {
    value: string;
    label: string;
    content: ReactNode;
}

interface CustomTabsProps {
    tabs: Tab[];
    defaultValue: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export const CustomTabs = ({ tabs, defaultValue, onValueChange, className = "" }: CustomTabsProps) => {
    return (
        <Tabs defaultValue={defaultValue} onValueChange={onValueChange} className={`w-full ${className}`}>
            <TabsList className="w-full flex flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm justify-stretch">
                {tabs.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="flex-1 min-w-0 bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] border-r border-gray-200 last:border-r-0"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value} className="p-4 sm:p-6 mt-0">
                    {tab.content}
                </TabsContent>
            ))}
        </Tabs>
    );
};