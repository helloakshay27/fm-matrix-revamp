export interface LogEntry {
    id: string;
    description: string;
    timestamp: string;
}

interface LogsTimelineProps {
    logs: LogEntry[];
    title?: string;
}

export function LogsTimeline({ logs }: LogsTimelineProps) {
    return (
        <div className="relative">
            <div className="space-y-6">
                {logs.map((log, index) => (
                    <div key={log.id} className="relative flex items-start">
                        {index !== logs.length - 1 && (
                            <div className="absolute left-[11px] top-6 -bottom-[25px] w-0.5 bg-primary" />
                        )}

                        <div className="relative z-10 flex-shrink-0">
                            <div className="w-6 h-6 rounded-full bg-primary border-4 border-background" />
                        </div>

                        <div className="ml-6 flex-1 flex justify-between items-start gap-4">
                            <p className="text-foreground leading-relaxed flex-1" style={{ whiteSpace: "pre-line" }}>
                                {log.description}
                            </p>
                            <span className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                                {log.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
}