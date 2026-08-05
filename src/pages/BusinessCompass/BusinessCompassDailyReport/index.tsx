import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "../BusinessCompass.css";
import { DailyReportProvider, useDailyReport } from "./context/DailyReportContext";
import { PageHeader } from "./components/PageHeader";
import { AiSuggestionsCard } from "./components/AiSuggestionsCard";
import { CalendarCard } from "./components/CalendarCard";
import { KpiCard } from "./components/KpiCard";
import { AccomplishmentsCard } from "./components/AccomplishmentsCard";
import { PlanningCard } from "./components/PlanningCard";
import { LiveScoreCard } from "./components/LiveScoreCard";
import { TasksIssuesCard } from "./components/TasksIssuesCard";
import { ReporteeCard } from "./components/ReporteeCard";
import { AbsenceCard } from "./components/AbsenceCard";
import { SubmitBar } from "./components/SubmitBar";
import { ScoreInfoSection } from "./components/ScoreInfoSection";
import { HistoryView } from "./components/HistoryView";
import { Modals } from "./components/Modals";
import { AiFloatingButton } from "./components/AiFloatingButton";

const SubmitTab = () => {
  const { isAbsent } = useDailyReport();

  return (
    <TabsContent value="submit" className="space-y-6 mt-0">
      <div className="bc-daily-grid">
        <div className="space-y-6">
          <CalendarCard />
          {!isAbsent && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <KpiCard />
              <AccomplishmentsCard />
              <PlanningCard />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {!isAbsent && <LiveScoreCard />}
          <TasksIssuesCard />
        </div>
      </div>
      <ReporteeCard />

      <AbsenceCard />
      <SubmitBar />
      <ScoreInfoSection />
    </TabsContent>
  );
};

const DailyReportPage = () => {
  const { activeTab, setActiveTab } = useDailyReport();

  return (
    <div className="bc-daily-page space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="space-y-6">
        <PageHeader />
        {activeTab === "submit" && <AiSuggestionsCard />}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="hidden">
            <TabsTrigger value="submit">Submit</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <SubmitTab />
          <HistoryView />
        </Tabs>
      </div>

      <Modals />
      <AiFloatingButton />
    </div>
  );
};

const BusinessCompassDailyReport = () => (
  <DailyReportProvider>
    <DailyReportPage />
  </DailyReportProvider>
);

export default BusinessCompassDailyReport;
