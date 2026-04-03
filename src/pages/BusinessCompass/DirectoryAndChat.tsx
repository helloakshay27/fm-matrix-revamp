import { AdminViewEmulation } from '@/components/AdminViewEmulation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TeamChat from '@/components/BusinessCompass/TeamChat';
import TeamDirectory from '@/components/BusinessCompass/TeamDirectory';

const DirectoryAndChat = () => {
    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <AdminViewEmulation />
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Directory and Chat</h1>
                    <p className="text-gray-500 mt-1">Team directory and collaboration</p>
                </div>
            </div>

            <Tabs defaultValue="chat">
                <TabsList className='w-full rounded-[10px] bg-primary'>
                    <TabsTrigger value="chat" className='w-full rounded-[8px]'>Team Chat</TabsTrigger>
                    <TabsTrigger value="directory" className='w-full rounded-[8px]'>Directory</TabsTrigger>
                </TabsList>

                <TabsContent value="directory">
                    <TeamDirectory />
                </TabsContent>
                <TabsContent value="chat">
                    <TeamChat />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default DirectoryAndChat