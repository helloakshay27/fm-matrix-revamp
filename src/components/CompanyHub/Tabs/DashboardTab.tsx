import React from "react";
import Header from "../Header";
import StrategicSection from "../StrategicSection";
import DashboardGrid from "../DashboardGrid";
import CompassSection from "../CompassSection";
import CommunityFeed from "../CommunitySection/CommunityFeed";
import CEOMessageWidget from "../Sidebar/CEOMessageWidget";
import EmployeeOfMonthWidget from "../Sidebar/EmployeeOfMonthWidget";
import TownHallsWidget from "../Sidebar/TownHallsWidget";
import UpcomingEventsWidget from "../Sidebar/UpcomingEventsWidget";
import { Post, TaskStats, LifeCompassStats } from "../types";

interface DashboardTabProps {
  displayName: string;
  welcomeText: string;
  visionText: string;
  missionText: string;
  taskStats: TaskStats;
  selectedMatrixQuadrant: any;
  setSelectedMatrixQuadrant: (q: any) => void;
  activeTimeView: "hourly" | "weekly" | "monthly";
  setActiveTimeView: (v: "hourly" | "weekly" | "monthly") => void;
  lifeCompassStats: LifeCompassStats;
  setIsCreatePostModalOpen: (open: boolean) => void;
  setCreateMode: (mode: "post" | "poll" | null) => void;
  isLoadingPosts: boolean;
  posts: Post[];
  setDeleteConfirmation: (conf: any) => void;
  setIsVideoOpen: (open: boolean) => void;
  currentEmployee: any;
}

const DashboardTab: React.FC<DashboardTabProps> = ({
  displayName,
  welcomeText,
  visionText,
  missionText,
  taskStats,
  selectedMatrixQuadrant,
  setSelectedMatrixQuadrant,
  activeTimeView,
  setActiveTimeView,
  lifeCompassStats,
  setIsCreatePostModalOpen,
  setCreateMode,
  isLoadingPosts,
  posts,
  setDeleteConfirmation,
  setIsVideoOpen,
  currentEmployee,
}) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <Header displayName={displayName} />

      <StrategicSection
        welcomeText={welcomeText}
        visionText={visionText}
        missionText={missionText}
      />

      <DashboardGrid
        taskStats={taskStats}
        selectedMatrixQuadrant={selectedMatrixQuadrant}
        setSelectedMatrixQuadrant={setSelectedMatrixQuadrant}
        activeTimeView={activeTimeView}
        setActiveTimeView={setActiveTimeView}
      />

      <CompassSection lifeCompassStats={lifeCompassStats} />

      {/* Community Section */}
      <div className="pt-10 space-y-8">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">
          Community Feed
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
          <CommunityFeed
            displayName={displayName}
            setIsCreatePostModalOpen={setIsCreatePostModalOpen}
            setCreateMode={setCreateMode}
            isLoadingPosts={isLoadingPosts}
            posts={posts}
            setDeleteConfirmation={setDeleteConfirmation}
          />

          {/* Sidebar Column */}
          <div className="lg:col-span-4 space-y-8">
            <CEOMessageWidget setIsVideoOpen={setIsVideoOpen} />
            <EmployeeOfMonthWidget currentEmployee={currentEmployee} />
            <div className="space-y-6">
              <TownHallsWidget />
              <UpcomingEventsWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
