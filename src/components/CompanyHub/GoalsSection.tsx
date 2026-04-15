import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MoreHorizontal,
  Calendar,
  User,
  ArrowRight
} from "lucide-react";
import { fetchGoals, Goal, GoalsDashboard } from "@/services/goalsService";

interface GoalsSectionProps {
  className?: string;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ className = "" }) => {
  const [goalsData, setGoalsData] = useState<{ dashboard: GoalsDashboard; goals: Goal[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGoals();
        setGoalsData(data);
      } catch (err) {
        setError("Failed to load goals");
        console.error("Goals loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoals();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "achieved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "on_track":
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case "behind":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case "not_started":
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-100 text-green-800 border-green-200";
      case "on_track":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "behind":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "not_started":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-500";
      case "on_track":
        return "bg-blue-500";
      case "behind":
        return "bg-orange-500";
      case "not_started":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateProgress = (current: string, target: string) => {
    const currentVal = parseFloat(current) || 0;
    const targetVal = parseFloat(target) || 1;
    return Math.min((currentVal / targetVal) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Goals
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !goalsData) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">
            Goals
          </h2>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load goals</h3>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { dashboard, goals } = goalsData;
  const displayGoals = goals.slice(0, 5);

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">
          Goals
        </h2>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          View All Goals
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Goals Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{dashboard.total_goals}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achieved</p>
                <p className="text-2xl font-bold text-green-600">{dashboard.achieved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">On Track</p>
                <p className="text-2xl font-bold text-blue-600">{dashboard.on_track}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Behind</p>
                <p className="text-2xl font-bold text-orange-600">{dashboard.behind}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Not Started</p>
                <p className="text-2xl font-bold text-gray-600">{dashboard.not_started}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayGoals.map((goal) => {
          const progress = calculateProgress(goal.current_value, goal.target_value);
          
          return (
            <Card key={goal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-gray-900 mb-2">
                      {goal.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {goal.description}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {goal.current_value} / {goal.target_value} {goal.unit}
                    </span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{progress.toFixed(1)}% complete</span>
                    <span>{goal.progress_percentage}%</span>
                  </div>
                </div>

                {/* Status and Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(goal.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(goal.status)}
                        <span className="text-xs">{goal.status_label}</span>
                      </div>
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {goal.period_label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{goal.owner_name}</span>
                    </div>
                    {goal.target_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(goal.target_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first goal to track progress</p>
            <Button>Create Goal</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalsSection;
