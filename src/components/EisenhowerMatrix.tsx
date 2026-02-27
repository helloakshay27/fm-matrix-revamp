import { Card, CardContent } from '@/components/ui/card';

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
    'Q1': {
        value: 'Q1',
        title: 'Q1',
        description: 'Urgent & Important',
        bgColor: 'bg-red-100',
        borderColor: 'border-red-300',
        textColor: 'text-red-700',
        icon: '🔥'
    },
    'Q2': {
        value: 'Q2',
        title: 'Q2',
        description: 'Important, Not Urgent',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300',
        textColor: 'text-green-700',
        icon: '🎯'
    },
    'Q3': {
        value: 'Q3',
        title: 'Q3',
        description: 'Urgent, Not Important',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300',
        textColor: 'text-yellow-700',
        icon: '⚡'
    },
    'Q4': {
        value: 'Q4',
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
}

export const EisenhowerMatrix = ({ dashboardData }: EisenhowerMatrixProps) => {
    // Use dashboard data from API or default to zeros
    const quadrantCounts = {
        'Q1': dashboardData?.p1_count || 0,
        'Q2': dashboardData?.p2_count || 0,
        'Q3': dashboardData?.p3_count || 0,
        'Q4': dashboardData?.p4_count || 0,
    };

    return (
        <Card className="shadow-sm border border-border mb-6">
            <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-3">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((quadrant) => {
                        const config = QUADRANTS[quadrant];
                        const count = quadrantCounts[quadrant as keyof typeof quadrantCounts];

                        return (
                            <div
                                key={quadrant}
                                className={`${config.bgColor} ${config.borderColor} border-2 rounded-[10px] p-4 flex flex-col items-center justify-center min-h-[90px]`}
                            >
                                <h4 className={`text-xl font-bold ${config.textColor} mb-1`}>
                                    {config.title}
                                </h4>
                                <p className={`text-2xl font-semibold ${config.textColor} mb-2`}>
                                    {count}
                                </p>
                                <p className={`text-sm text-center ${config.textColor} opacity-75`}>
                                    {config.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <p className="text-center text-gray-500 text-xs italic mt-2 font-medium">
                    Focus on Q2 for growth
                </p>
            </CardContent>
        </Card>
    );
};

export default EisenhowerMatrix;
