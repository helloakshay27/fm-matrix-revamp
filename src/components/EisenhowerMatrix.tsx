import { Card, CardContent } from '@/components/ui/card';
import { useDroppable } from '@dnd-kit/core';

interface QuadrantConfig {
    value: string;
    title: string;
    description: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    icon: string;
}

const QUADRANTS: Record<string, QuadrantConfig> = {
    'P1': {
        value: 'P1',
        title: 'Q1',
        description: 'Urgent & Important',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        textColor: 'text-red-700',
        icon: '🔥'
    },
    'P2': {
        value: 'P2',
        title: 'Q2',
        description: 'Important, Not Urgent',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300',
        textColor: 'text-green-700',
        icon: '🎯'
    },
    'P3': {
        value: 'P3',
        title: 'Q3',
        description: 'Urgent, Not Important',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-700',
        icon: '⚡'
    },
    'P4': {
        value: 'P4',
        title: 'Q4',
        description: 'Not Urgent or Important',
        bgColor: 'bg-gray-200',
        borderColor: 'border-gray-400',
        textColor: 'text-gray-700',
        icon: '🛸'
    }
};

interface EisenhowerMatrixProps {
    dashboardData?: {
        p1_count: number;
        p2_count: number;
        p3_count: number;
        p4_count: number;
    };
    onQuadrantClick?: (priority: string) => void;
    selectedPriority?: string;
}

export const EisenhowerMatrix = ({ dashboardData, onQuadrantClick, selectedPriority }: EisenhowerMatrixProps) => {
    // Use dashboard data from API or default to zeros
    const quadrantCounts = {
        'P1': dashboardData?.p1_count || 0,
        'P2': dashboardData?.p2_count || 0,
        'P3': dashboardData?.p3_count || 0,
        'P4': dashboardData?.p4_count || 0,
    };

    // Component for individual quadrant with droppable zone
    const QuadrantCard = ({ quadrant }: { quadrant: string }) => {
        const { setNodeRef, isOver } = useDroppable({
            id: `priority-${quadrant}`,
        });

        const config = QUADRANTS[quadrant];
        const count = quadrantCounts[quadrant as keyof typeof quadrantCounts];

        return (
            <div
                ref={setNodeRef}
                onClick={() => onQuadrantClick?.(quadrant)}
                className={`${config.bgColor} ${config.borderColor} border-2 rounded-[10px] p-3 flex flex-col items-center justify-center min-h-[70px] cursor-pointer transition-all ${selectedPriority === quadrant ? 'shadow-lg scale-105 ring-offset-1' : ''
                    } ${isOver ? 'opacity-50 ring-4 ring-blue-500' : ''}`}
            >
                <h4 className={`text-[18px] font-bold ${config.textColor} mb-1`}>
                    {config.title}
                </h4>
                <p className={`text-xl font-semibold ${config.textColor} mb-1`}>
                    {count}
                </p>
                <p className={`text-xs text-center ${config.textColor} opacity-75`}>
                    {config.description}
                </p>
            </div>
        );
    };

    return (
        <Card className="shadow-sm border border-blue-200 mb-0 rounded-[10px] bg-blue-50 h-full w-full flex flex-col">
            <h4 className="text-sm font-medium px-3 pt-3">Eisenhower Matrix</h4>
            <CardContent className="p-3 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                    {['P1', 'P2', 'P3', 'P4'].map((quadrant) => (
                        <QuadrantCard key={quadrant} quadrant={quadrant} />
                    ))}
                </div>

                <p className="text-center text-gray-500 text-xs italic mt-2 font-medium">
                    Focus on Q2 for growth
                </p>
            </CardContent>
        </Card>
    );
};

export default EisenhowerMatrix;
