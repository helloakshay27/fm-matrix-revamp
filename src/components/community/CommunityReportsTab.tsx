interface CommunityReportsTabProps {
    communityId?: string;
}

const CommunityReportsTab = ({ communityId }: CommunityReportsTabProps) => {
    return (
        <div className="border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Reports content will be displayed here</p>
        </div>
    );
};

export default CommunityReportsTab;
