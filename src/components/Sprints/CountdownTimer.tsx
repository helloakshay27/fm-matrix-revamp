import { useEffect, useState } from "react";

interface CountdownTimerProps {
    startDate: string;
    targetDate: string;
}

const calculateDuration = (start: string, end: string) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Set end date to end of the day
    endDate.setHours(23, 59, 59, 999);

    // Check if task hasn't started yet
    if (now < startDate) {
        return { text: "Not started", isOverdue: false };
    }

    // Calculate time differences (use absolute value to show overdue time)
    const diffMs = endDate.getTime() - now.getTime();
    const absDiffMs = Math.abs(diffMs);
    const isOverdue = diffMs <= 0;

    // Calculate time differences
    const seconds = Math.floor(absDiffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;

    const timeStr = `${days > 0 ? days + "d " : "0d "}${remainingHours > 0 ? remainingHours + "h " : "0h "}${remainingMinutes > 0 ? remainingMinutes + "m" : "0m"}`;

    return {
        text: isOverdue ? `${timeStr}` : timeStr,
        isOverdue: isOverdue,
    };
};

export const CountdownTimer = ({ startDate, targetDate }: CountdownTimerProps) => {
    const [countdown, setCountdown] = useState(calculateDuration(startDate, targetDate));

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(calculateDuration(startDate, targetDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [startDate, targetDate]);

    return (
        <div
            className={`text-left text-[12px] ${countdown.isOverdue ? "text-red-600 font-medium" : ""}`}
        >
            {countdown.text}
        </div>
    );
};
