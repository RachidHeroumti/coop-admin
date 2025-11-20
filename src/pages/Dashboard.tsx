import React from "react";
import { Layout } from "../components/Layout";
import AnalyticsBarChart from "../components/charts/AnalyticsBarChart";
import AnalyticsPieChart from "../components/charts/AnalyticsPieChart";
import AnalyticsRadarChart from "../components/charts/AnalyticsRadarChart";
import CategoryLineChart from "../components/charts/CategoryLineChart";
import ScoreInterpretationCard from "../components/charts/ScoreInterpretationCard";
import StatsCard from "../components/charts/StatsCard";
import { FileQuestion, Users, TrendingUp, Target } from "lucide-react";
import questionsData from "../data/questions.json";

export const Dashboard: React.FC = () => {
  // Calculate statistics from questions data
  const totalQuestions = questionsData.Questions.reduce((acc, category) => {
    const categoryName = Object.keys(category)[0];
    const questions = category[categoryName as keyof typeof category] as any[];
    return acc + questions.length;
  }, 0);

  const totalCategories = questionsData.Questions.length;
  const avgQuestionsPerCategory = (totalQuestions / totalCategories).toFixed(1);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="p-6 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-green-100 mt-2">
            Welcome to Cooperatives Diagnostic Management System
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Questions"
            value={totalQuestions}
            icon={FileQuestion}
            description="Across all categories"
            color="green"
          />
          <StatsCard
            title="Diagnostic Categories"
            value={totalCategories}
            icon={Target}
            description="Main assessment areas"
            color="blue"
          />
          <StatsCard
            title="Avg Questions/Category"
            value={avgQuestionsPerCategory}
            icon={TrendingUp}
            description="Distribution balance"
            color="purple"
          />
          <StatsCard
            title="Active Cooperatives"
            value="2"
            icon={Users}
            description="Currently registered"
            color="orange"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg">
            <AnalyticsBarChart />
          </div>
          <div className="bg-white shadow-md rounded-lg p-5">
            <AnalyticsPieChart />
          </div>
        </div>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 gap-6">
          <CategoryLineChart />
        </div>

        {/* Radar and Interpretation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg">
            <AnalyticsRadarChart />
          </div>
          <ScoreInterpretationCard />
        </div>
      </div>
    </Layout>
  );
};
