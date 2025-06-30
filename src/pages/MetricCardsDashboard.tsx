
import React, { useState } from 'react';
import { MetricCard, MetricCardSkeleton } from '@/components/ui/metric-card';
import { MetricCardGrid } from '@/components/ui/metric-card-grid';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Activity,
  Zap,
  Target
} from 'lucide-react';

export const MetricCardsDashboard = () => {
  const [loading, setLoading] = useState(false);

  const handleCardClick = (title: string, value: string | number) => {
    console.log(`Clicked on ${title} card with value: ${value}`);
  };

  const toggleLoading = () => {
    setLoading(!loading);
  };

  const metricsData = [
    {
      title: "Total Assets",
      value: 10000,
      icon: Building2,
      iconColor: 'red' as const
    },
    {
      title: "Total Count", 
      value: 15000,
      icon: Users,
      iconColor: 'green' as const
    },
    {
      title: "Monthly Revenue",
      value: 247500,
      icon: DollarSign,
      iconColor: 'blue' as const
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      icon: TrendingUp,
      iconColor: 'green' as const
    },
    {
      title: "Active Products",
      value: 1250,
      icon: Package,
      iconColor: 'blue' as const
    },
    {
      title: "System Health",
      value: "99.9%",
      icon: Activity,
      iconColor: 'green' as const
    },
    {
      title: "Energy Usage",
      value: 8750,
      icon: Zap,
      iconColor: 'yellow' as const
    },
    {
      title: "Target Achievement",
      value: "87.2%",
      icon: Target,
      iconColor: 'red' as const
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Metrics</h1>
            <p className="text-gray-600 mt-1">Overview of key performance indicators</p>
          </div>
          <Button 
            onClick={toggleLoading}
            variant="outline"
            className="bg-white"
          >
            {loading ? 'Show Data' : 'Show Loading'}
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricCardGrid>
        {metricsData.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            iconColor={metric.iconColor}
            loading={loading}
            onClick={() => handleCardClick(metric.title, metric.value)}
          />
        ))}
      </MetricCardGrid>

      {/* Additional Examples Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Color Variations</h2>
        <MetricCardGrid>
          <MetricCard
            title="Critical Alerts"
            value={23}
            icon={Activity}
            iconColor="red"
            onClick={() => handleCardClick("Critical Alerts", 23)}
          />
          <MetricCard
            title="Success Rate"
            value="94.8%"
            icon={Target}
            iconColor="green"
            onClick={() => handleCardClick("Success Rate", "94.8%")}
          />
          <MetricCard
            title="Processing Queue"
            value={456}
            icon={Package}
            iconColor="blue"
            onClick={() => handleCardClick("Processing Queue", 456)}
          />
        </MetricCardGrid>
      </div>

      {/* Loading State Example */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Loading States</h2>
        <MetricCardGrid>
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </MetricCardGrid>
      </div>
    </div>
  );
};
