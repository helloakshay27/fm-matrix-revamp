import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchMoMs } from "@/store/slices/momSlice";

// Function to generate smooth, light random colors for participant badges
const generateLightColor = (seed: number): string => {
    // Use seed to generate consistent but varied colors
    const hue = (seed * 137.508) % 360; // Golden angle approximation for good distribution
    const saturation = 65 + (seed * 7) % 20; // 65-85% saturation for vibrant but smooth colors
    const lightness = 75 + (seed * 11) % 15; // 75-90% lightness for pastel/light colors

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

interface Participant {
    id: number;
    name: string;
    initials: string;
}

interface MeetingData {
    id: number;
    meetingTitle: string;
    dateOfMeeting: string;
    organizer: string;
    meetingMode: string;
    participants: Participant[];
    agendaItems: string;
    actionItems: string;
}

const columns: ColumnConfig[] = [
    {
        key: 'id',
        label: 'MoM Id',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'meetingTitle',
        label: 'Meeting Title',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'dateOfMeeting',
        label: 'Date Of Meeting',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'organizer',
        label: 'Organizer',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'meetingMode',
        label: 'Meeting Mode',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'participants',
        label: 'Participants',
        sortable: false,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'agendaItems',
        label: 'Agenda Items',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: 'actionItems',
        label: 'Action Items',
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const MinutesOfMeeting = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { data: momsData, loading } = useSelector((state: RootState) => state.fetchMoMs);

    const [meetings, setMeetings] = useState<MeetingData[]>([]);

    useEffect(() => {
        dispatch(fetchMoMs());
    }, [dispatch]);

    useEffect(() => {
        if (momsData && Array.isArray(momsData)) {
            const mappedMeetings = momsData.map((mom: any) => ({
                id: mom.id,
                meetingTitle: mom.title || '-',
                dateOfMeeting: mom.meeting_date || '-',
                organizer: mom.created_by?.full_name || '-', // Assuming created_by object, falling back to name
                meetingMode: mom.meeting_mode || '-',
                participants: (mom.mom_attendees || []).map((att: any) => ({
                    id: att.id,
                    name: att.name || '',
                    initials: (att.name || '').slice(0, 2).toUpperCase()
                })),
                agendaItems: (mom.mom_tasks || []).map((t: any) => t.description).join(', ') || '-', // Mapping tasks as agenda items temporarily? User asked to map "data", assuming tasks are adequate here.
                actionItems: (mom.mom_tasks || []).filter((t: any) => t.save_task).length.toString(), // Example: Count of tasks
            }));
            setMeetings(mappedMeetings);
        }
    }, [momsData]);


    const openAddDialog = () => {
        navigate('/vas/add-mom');
    };

    const renderParticipantBadges = (participants: Participant[]) => {
        if (!participants || participants.length === 0) return "-";
        return (
            <div className="flex gap-1 flex-wrap">
                {participants.slice(0, 3).map((participant, index) => (
                    <div
                        key={participant.id}
                        className="w-7 h-7 rounded-full flex items-center !justify-center text-xs font-semibold text-gray-800"
                        style={{
                            backgroundColor: generateLightColor(participant.id),
                            marginLeft: index > 0 ? '-12px' : '0'
                        }}
                        title={participant.name}
                    >
                        {participant.initials}
                    </div>
                ))}
                {participants.length > 3 && (
                    <div
                        className="w-7 h-7 rounded-full flex items-center !justify-center text-xs font-semibold text-white bg-gray-400"
                        style={{ marginLeft: '-12px' }}
                    >
                        +{participants.length - 3}
                    </div>
                )}
            </div>
        );
    };

    const renderActions = (item: MeetingData) => {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => {/* Edit logic */ }}
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    const renderCell = (item: MeetingData, columnKey: string) => {
        switch (columnKey) {
            case 'participants':
                return renderParticipantBadges(item.participants);
            default:
                return (item as any)[columnKey] || "-";
        }
    }

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={openAddDialog}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Meeting
            </Button>
        </>
    )

    return (
        <div className="p-6">
            <EnhancedTable
                data={meetings}
                columns={columns}
                renderActions={renderActions}
                renderCell={renderCell}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
                loading={loading}
            />
        </div>
    )
}

export default MinutesOfMeeting