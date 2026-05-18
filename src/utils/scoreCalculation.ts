/**
 * Automated Daily Score Calculation Utility
 * 
 * Total possible score: 100 points
 * - Daily KPI Achievement: Max 20 points
 * - Accomplishments (Checklist 10 + Accomplishments 10): Max 20 points
 * - Tasks & Issues: Max 20 points
 * - Items Planned for Coming Day: Max 20 points
 * - Report Timing: Max 20 points
 */

export interface DailyScoreBreakdown {
    kpiScore: number;
    checklistScore: number;
    accomplishmentsScore: number;
    tasksIssuesScore: number;
    planningScore: number;
    timingScore: number;
    bonusPoints: number;
    totalScore: number;
    details: {
        kpi: KPIDetails;
        accomplishments: AccomplishmentsDetails;
        tasksIssues: TasksIssuesDetails;
        planning: PlanningDetails;
        timing: TimingDetails;
    };
}

export interface KPIDetails {
    kpis: Array<{ name: string; achievement: number; points: number }>;
    averageAchievement: number;
    points: number;
    maxPoints: number;
    hasKPIs: boolean;
}

export interface AccomplishmentsDetails {
    totalItems: number;
    completedItems: number;
    completionPercentage: number;
    points: number;
    maxPoints: number;
    bonus: number;
}

export interface TasksIssuesDetails {
    closedOnTimeCount: number;
    closedLateCount: number;
    newIssuesCount: number;
    overdueCount: number;
    positivePoints: number;
    penaltyPoints: number;
    points: number;
    maxPoints: number;
}

export interface PlanningDetails {
    regularItems: number;
    starredItems: number;
    totalItems: number;
    points: number;
    maxPoints: number;
}

export interface TimingDetails {
    submissionTime: string;
    points: number;
    maxPoints: number;
}

/**
 * Calculate KPI Achievement Score (Max 20 points)
 * Calculated as: Max Points × (Average Achievement % ÷ 100)
 */
function calculateKPIScore(kpis: any[]): { score: number; details: KPIDetails } {
    const maxPoints = 20;

    if (!kpis || kpis.length === 0) {
        return {
            score: 0,
            details: {
                kpis: [],
                averageAchievement: 0,
                points: 0,
                maxPoints,
                hasKPIs: false,
            },
        };
    }

    const kpiDetails: any[] = [];
    let totalAchievement = 0;

    kpis.forEach((kpi: any) => {
        const target = parseFloat(kpi.target_value) || 0;
        const actual = parseFloat(kpi.actual_value) || 0;

        let achievement = 0;
        if (target === 0 && actual > 0) {
            // If target is 0 but actual is positive, count as 100% achievement
            achievement = 100;
        } else if (target > 0) {
            achievement = (actual / target) * 100;
        }

        // Cap achievement at 100% for calculation
        const cappedAchievement = Math.min(achievement, 100);
        totalAchievement += cappedAchievement;

        kpiDetails.push({
            name: kpi.kpi_name || `KPI ${kpi.kpi_id}`,
            achievement: cappedAchievement,
            points: (maxPoints * cappedAchievement) / 100,
        });
    });

    const averageAchievement = totalAchievement / kpis.length;
    const score = (maxPoints * averageAchievement) / 100;

    return {
        score,
        details: {
            kpis: kpiDetails,
            averageAchievement,
            points: score,
            maxPoints,
            hasKPIs: true,
        },
    };
}

/**
 * Calculate Accomplishments Score (Max 20 points)
 * Combines Daily Checklist (max 10) + Accomplishments (max 10)
 * Points awarded proportionally based on completion percentage
 */
function calculateAccomplishmentsScore(
    accomplishments: any[]
): { score: number; details: AccomplishmentsDetails } {
    const maxPoints = 20; // 10 checklist + 10 accomplishments

    if (!accomplishments || accomplishments.length === 0) {
        return {
            score: 0,
            details: {
                totalItems: 0,
                completedItems: 0,
                completionPercentage: 0,
                points: 0,
                maxPoints,
                bonus: 0,
            },
        };
    }

    const completedItems = accomplishments.filter((a) => a.completed).length;
    const totalItems = accomplishments.length;
    const completionPercentage = (completedItems / totalItems) * 100;
    const score = (maxPoints * completionPercentage) / 100;

    return {
        score,
        details: {
            totalItems,
            completedItems,
            completionPercentage,
            points: score,
            maxPoints,
            bonus: 0,
        },
    };
}

/**
 * Calculate Tasks & Issues Score (Max 20 points)
 * - Closed on time (within target date or no target): +5 points each
 * - Closed late (after target date): +2 points each
 * - New issue on report day: +2 points each (max 10 points)
 * - Overdue: -5 points each (max -15 deduction)
 */
function calculateTasksIssuesScore(
    taskIssues: any[],
    reportDate: string
): { score: number; details: TasksIssuesDetails } {
    const maxPoints = 20;
    const maxNewIssueBonus = 10;
    const maxOverduePenalty = -15;

    if (!taskIssues || taskIssues.length === 0) {
        return {
            score: 0,
            details: {
                closedOnTimeCount: 0,
                closedLateCount: 0,
                newIssuesCount: 0,
                overdueCount: 0,
                positivePoints: 0,
                penaltyPoints: 0,
                points: 0,
                maxPoints,
            },
        };
    }

    let closedOnTimeCount = 0;
    let closedLateCount = 0;
    let newIssuesCount = 0;
    let overdueCount = 0;

    const reportDateTime = new Date(reportDate).getTime();

    taskIssues.forEach((item: any) => {
        const status = item.status?.toLowerCase() || "";
        const createdAt = item.created_at ? new Date(item.created_at).getTime() : 0;
        const targetDate = item.target_date ? new Date(item.target_date).getTime() : 0;

        // Check if task/issue was created on report day
        const createdOnReportDay =
            createdAt > 0 &&
            new Date(createdAt).toLocaleDateString() ===
            new Date(reportDateTime).toLocaleDateString();

        // Check if task/issue was closed on report day
        const closedOnReportDay =
            (status === "closed" || status === "completed") &&
            createdOnReportDay;

        if (closedOnReportDay) {
            if (targetDate === 0 || reportDateTime <= targetDate) {
                closedOnTimeCount++;
            } else {
                closedLateCount++;
            }
        }

        if (createdOnReportDay && (status === "open" || status === "new")) {
            newIssuesCount++;
        }

        if (status === "overdue" || status === "overdued") {
            overdueCount++;
        }
    });

    const closedOnTimePoints = closedOnTimeCount * 5;
    const closedLatePoints = closedLateCount * 2;
    let newIssuePoints = Math.min(newIssuesCount * 2, maxNewIssueBonus);
    const overduePoints = Math.max(overdueCount * -5, maxOverduePenalty);

    // Cap positive score before applying penalties
    let positivePoints = Math.min(
        closedOnTimePoints + closedLatePoints + newIssuePoints,
        maxPoints
    );

    const finalScore = Math.max(positivePoints + overduePoints, 0);

    return {
        score: finalScore,
        details: {
            closedOnTimeCount,
            closedLateCount,
            newIssuesCount,
            overdueCount,
            positivePoints,
            penaltyPoints: overduePoints,
            points: finalScore,
            maxPoints,
        },
    };
}

/**
 * Calculate Planning Score (Max 20 points)
 * - Regular items: +2 points each
 * - Starred items: +4 points each (double points, max 3 stars)
 */
function calculatePlanningScore(
    planningItems: any[]
): { score: number; details: PlanningDetails } {
    const maxPoints = 20;

    // Filter items with actual text content (non-empty strings)
    const validItems = planningItems.filter((p) => p.text && p.text.trim().length > 0);

    if (!validItems || validItems.length === 0) {
        return {
            score: 0,
            details: {
                regularItems: 0,
                starredItems: 0,
                totalItems: 0,
                points: 0,
                maxPoints,
            },
        };
    }

    let regularItems = 0;
    let starredItems = 0;

    // Count starred items, max 3
    starredItems = Math.min(
        validItems.filter((p) => p.starred).length,
        3
    );

    // Regular items = total - starred
    regularItems = validItems.length - starredItems;

    const regularPoints = regularItems * 2;
    const starredPoints = starredItems * 4;
    const score = Math.min(regularPoints + starredPoints, maxPoints);

    return {
        score,
        details: {
            regularItems,
            starredItems,
            totalItems: planningItems.length,
            points: score,
            maxPoints,
        },
    };
}

/**
 * Calculate Submission Timing Score (Max 20 points)
 * - Submitted by 7pm same day: 20 points
 * - Submitted by 11:59pm same day: 15 points
 * - Submitted 12am-7am next day: 10 points
 * - Submitted 7am-9am next day: 5 points
 * - Submitted after 9am next day: 0 points
 */
function calculateTimingScore(submissionTime?: Date): { score: number; details: TimingDetails } {
    const maxPoints = 20;

    // If no submission time provided, assume current time
    const now = submissionTime || new Date();
    const reportDate = new Date();
    reportDate.setHours(0, 0, 0, 0);

    // Create time boundaries
    const same7pm = new Date(reportDate);
    same7pm.setHours(19, 0, 0, 0); // 7pm same day

    const same11_59pm = new Date(reportDate);
    same11_59pm.setHours(23, 59, 59, 999); // 11:59pm same day

    const next7am = new Date(reportDate);
    next7am.setDate(next7am.getDate() + 1);
    next7am.setHours(7, 0, 0, 0); // 7am next day

    const next9am = new Date(reportDate);
    next9am.setDate(next9am.getDate() + 1);
    next9am.setHours(9, 0, 0, 0); // 9am next day

    let score = 0;
    let timingDescription = "";

    if (now <= same7pm) {
        score = maxPoints;
        timingDescription = "By 7pm same day";
    } else if (now <= same11_59pm) {
        score = 15;
        timingDescription = "By 11:59pm same day";
    } else if (now <= next7am) {
        score = 10;
        timingDescription = "12am-7am next day";
    } else if (now <= next9am) {
        score = 5;
        timingDescription = "7am-9am next day";
    } else {
        score = 0;
        timingDescription = "After 9am next day";
    }

    return {
        score,
        details: {
            submissionTime: timingDescription,
            points: score,
            maxPoints,
        },
    };
}

/**
 * Calculate Bonus Points
 * - No Checklist Items: Accomplishments get +10 bonus points (max 20)
 * - No Daily KPIs: Accomplishments, Tasks, Planning, and Timing each get +5 bonus points
 */
function calculateBonusPoints(
    hasKPIs: boolean,
    accomplishmentsScore: number
): number {
    let bonusPoints = 0;

    // No Daily KPIs: +5 bonus to accomplishments, tasks, planning, and timing (20 total)
    if (!hasKPIs) {
        bonusPoints += 5; // Only applied to each category, calculated separately
    }

    return bonusPoints;
}

/**
 * Main function to calculate the complete daily score
 */
export function calculateDailyScore(
    kpis: any[] = [],
    accomplishments: any[] = [],
    taskIssues: any[] = [],
    planningItems: any[] = [],
    reportDate: string = new Date().toISOString().split("T")[0],
    submissionTime?: Date
): DailyScoreBreakdown {
    const kpiResult = calculateKPIScore(kpis);
    const accomplishmentsResult = calculateAccomplishmentsScore(accomplishments);
    const tasksIssuesResult = calculateTasksIssuesScore(taskIssues, reportDate);
    const planningResult = calculatePlanningScore(planningItems);
    const timingResult = calculateTimingScore(submissionTime);

    // Scores are fixed — no dynamic redistribution
    const kpiScore = kpiResult.score;
    const checklistScore = 0; // Checklist is folded into accomplishmentsScore (max 20)
    const accomplishmentsScore = accomplishmentsResult.score;
    const tasksIssuesScore = tasksIssuesResult.score;
    const planningScore = planningResult.score;
    const timingScore = timingResult.score;
    const bonusPoints = 0;

    const totalScore = Math.min(
        kpiScore +
        checklistScore +
        accomplishmentsScore +
        tasksIssuesScore +
        planningScore +
        timingScore,
        100
    );

    return {
        kpiScore: Math.round(kpiScore * 10) / 10,
        checklistScore: Math.round(checklistScore * 10) / 10,
        accomplishmentsScore: Math.round(accomplishmentsScore * 10) / 10,
        tasksIssuesScore: Math.round(tasksIssuesScore * 10) / 10,
        planningScore: Math.round(planningScore * 10) / 10,
        timingScore: Math.round(timingScore * 10) / 10,
        bonusPoints: Math.round(bonusPoints * 10) / 10,
        totalScore: Math.round(totalScore * 10) / 10,
        details: {
            kpi: kpiResult.details,
            accomplishments: accomplishmentsResult.details,
            tasksIssues: tasksIssuesResult.details,
            planning: planningResult.details,
            timing: timingResult.details,
        },
    };
}

/**
 * Live preview scoring — includes real-time timing score based on current time.
 */
export function calculateLivePreviewScore(
    kpis: any[] = [],
    accomplishments: any[] = [],
    taskIssues: any[] = [],
    planningItems: any[] = []
): DailyScoreBreakdown {
    // Pass current time so timing score reflects the current moment
    return calculateDailyScore(
        kpis,
        accomplishments,
        taskIssues,
        planningItems,
        new Date().toISOString().split("T")[0],
        new Date()
    );
}
