interface CommunityEventsTabProps {
    communityId?: string;
}

const CommunityEventsTab = ({ communityId }: CommunityEventsTabProps) => {
    return (
        <div className="border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-500">Events content will be displayed here</p>
        </div>
    );
};

export default CommunityEventsTab;
