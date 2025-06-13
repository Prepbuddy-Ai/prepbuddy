import React, { useState } from 'react';
import {
  Plus,
  BarChart3,
  BookOpen,
  Menu,
  X,
  Clock,
  Award,
  Activity,
  Users,
  TrendingUp,
} from "lucide-react";
import { StudyPlan } from "../App";
import PlansPage from "./PlansPage";
import AnalyticsPage from "./AnalyticsPage";
import UnifiedInput from "./UnifiedInput";
import StudyPlanGenerator from "./StudyPlanGenerator";
import StreakTracker from "./StreakTracker";
import AchievementSystem from "./AchievementSystem";
import SocialFeatures from "./social/SocialFeatures";

interface DashboardProps {
  studyPlans: StudyPlan[];
  onCreateNew: () => void;
  onViewPlan: (plan: StudyPlan) => void;
  onDeletePlan: (planId: string) => void;
  onPlanGenerated: (plan: StudyPlan) => void;
  incentiveData: {
    currentStreak: number;
    longestStreak: number;
    hasStudiedToday: boolean;
    totalXP: number;
    level: number;
    achievements: string[];
    lastStudyDate: Date | null;
  };
}

const Dashboard: React.FC<DashboardProps> = ({
  studyPlans,
  onViewPlan,
  onDeletePlan,
  onPlanGenerated,
  incentiveData,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "plans" | "create" | "generate" | "analytics" | "social"
  >("overview");
  const [inputData, setInputData] = useState<{
    content: string;
    fileName?: string;
    hasFile: boolean;
  } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Calculate overall statistics from real data
  const totalPlans = studyPlans.length;
  const activePlans = studyPlans.filter(
    (plan) => plan.progress.completedDays < plan.progress.totalDays
  ).length;
  const completedPlans = studyPlans.filter(
    (plan) => plan.progress.completedDays === plan.progress.totalDays
  ).length;

  // Calculate study progress metrics

  // Calculate overall progress from actual completion data
  const overallProgress =
    totalPlans > 0
      ? (studyPlans.reduce((total, plan) => {
          const planProgress =
            plan.progress.totalTasks > 0
              ? plan.progress.completedTasks / plan.progress.totalTasks
              : 0;
          return total + planProgress;
        }, 0) /
          totalPlans) *
        100
      : 0;

  // Get recent plans based on actual creation dates
  const recentPlans = studyPlans
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  // Calculate total completed tasks from real data
  const totalCompletedTasks = studyPlans.reduce(
    (total, plan) => total + plan.progress.completedTasks,
    0
  );

  const handleFormSubmit = (data: {
    content: string;
    fileName?: string;
    hasFile: boolean;
  }) => {
    setInputData(data);
    setActiveTab("generate");
    setSidebarOpen(false); // Close sidebar on mobile after action
  };

  const handlePlanGenerated = (plan: StudyPlan) => {
    const newPlan = {
      ...plan,
      files:
        inputData?.hasFile && inputData?.fileName
          ? [
              {
                id: Date.now().toString(),
                name: inputData.fileName,
                content: inputData.content,
                addedAt: new Date(),
              },
            ]
          : [],
    };

    onPlanGenerated(newPlan);
    setInputData(null);
    setActiveTab("overview");
    setSidebarOpen(false);
  };

  const handleBackToCreate = () => {
    setActiveTab("create");
    setInputData(null);
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after tab change
  };

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      color: "text-green-700 bg-green-100 hover:bg-green-50",
      count: null,
    },
    {
      id: "plans",
      label: "Study Plans",
      icon: BookOpen,
      color: "text-purple-700 bg-purple-100 hover:bg-purple-50",
      count: totalPlans,
    },
    {
      id: "create",
      label: "Create Plan",
      icon: Plus,
      color: "text-blue-700 bg-blue-100 hover:bg-blue-50",
      count: null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      color: "text-orange-700 bg-orange-100 hover:bg-orange-50",
      count: null,
    },
    {
      id: "social",
      label: "Social",
      icon: Users,
      color: "text-pink-700 bg-pink-100 hover:bg-pink-50",
      count: null,
      badge: "Live",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Mobile Menu Button - Fixed Position */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200"
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar Navigation - Fixed */}
      <div
        className={`
        fixed w-64 top-16 bottom-0 left-0 z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Sidebar Header - Fixed */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-600">Manage your learning</p>

          {/* Level Display */}
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Level {incentiveData.level}
              </span>
              <span className="text-xs text-gray-500">
                {incentiveData.totalXP} XP
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${incentiveData.totalXP % 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation Items - Scrollable */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id as typeof activeTab)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 font-medium ${
                activeTab === item.id
                  ? item.color
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== null && (
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
              {item.badge && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.badge === "Live"
                      ? "bg-pink-100 text-pink-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area - Fixed Height with Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64">
        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 pt-8">
            {activeTab === "overview" && (
              <div>
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Welcome back!
                  </h1>
                  <p className="text-gray-600">
                    Here's an overview of your learning progress
                  </p>
                </div>

                {/* Statistics Cards - Using Real Data */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          Total Plans
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {totalPlans}
                        </p>
                      </div>
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg">
                        <BookOpen className="h-4 sm:h-6 w-4 sm:w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          Active Plans
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {activePlans}
                        </p>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg">
                        <Activity className="h-4 sm:h-6 w-4 sm:w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          Completed
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {completedPlans}
                        </p>
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-2 sm:p-3 rounded-lg">
                        <Award className="h-4 sm:h-6 w-4 sm:w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          Study Streak
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {incentiveData.currentStreak}
                        </p>
                      </div>
                      <div className="bg-orange-100 dark:bg-orange-900/30 p-2 sm:p-3 rounded-lg">
                        <Clock className="h-4 sm:h-6 w-4 sm:w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incentive Components - Mobile Stack */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 mb-6 sm:mb-8">
                  <StreakTracker
                    currentStreak={incentiveData.currentStreak}
                    longestStreak={incentiveData.longestStreak}
                    studyGoal={1}
                    completedToday={incentiveData.hasStudiedToday}
                  />

                  <AchievementSystem
                    studyPlans={studyPlans}
                    completedTasks={totalCompletedTasks}
                    currentStreak={incentiveData.currentStreak}
                    longestStreak={incentiveData.longestStreak}
                  />
                </div>

                {/* Progress Overview - Using Real Data */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 mb-6 sm:mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Overall Progress
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Learning Progress
                          </span>
                          <span className="dark:text-gray-300">
                            {Math.round(overallProgress)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                          <div
                            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${overallProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {activePlans}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Active Plans
                          </div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                            {completedPlans}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                            Completed
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Quick Actions
                    </h3>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleTabChange("create")}
                        className="w-full flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 transition-all duration-200"
                      >
                        <Plus className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="font-medium text-blue-700 dark:text-blue-400 text-sm sm:text-base">
                          Create New Study Plan
                        </span>
                      </button>

                      <button
                        onClick={() => handleTabChange("social")}
                        className="w-full flex items-center p-3 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800/30 rounded-lg hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 transition-all duration-200"
                      >
                        <Users className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="font-medium text-pink-700 dark:text-pink-400 text-sm sm:text-base">
                          Connect with Study Buddies
                        </span>
                      </button>

                      <button
                        onClick={() => handleTabChange("analytics")}
                        className="w-full flex items-center p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800/30 rounded-lg hover:from-orange-100 hover:to-yellow-100 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 transition-all duration-200"
                      >
                        <TrendingUp className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="font-medium text-orange-700 dark:text-orange-400 text-sm sm:text-base">
                          View Analytics
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Plans - Using Real Data */}
                {recentPlans.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-0">
                        Recent Study Plans
                      </h3>
                      <button
                        onClick={() => handleTabChange("plans")}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm self-start sm:self-auto"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {recentPlans.map((plan) => {
                        const progressPercentage =
                          plan.progress.totalTasks > 0
                            ? (plan.progress.completedTasks /
                                plan.progress.totalTasks) *
                              100
                            : 0;

                        return (
                          <div
                            key={plan.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                            onClick={() => onViewPlan(plan)}
                          >
                            <div className="mb-3 sm:mb-0">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {plan.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {plan.description ? plan.description.substring(0, 60) + (plan.description.length > 60 ? '...' : '') : ''}
                              </p>
                            </div>

                            <div className="flex items-center space-x-4">
                              <div className="flex-1 max-w-[180px]">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Progress
                                  </span>
                                  <span className="dark:text-gray-300">
                                    {Math.round(progressPercentage)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className="hidden sm:block text-right">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${plan.progress.completedTasks === plan.progress.totalTasks && plan.progress.totalTasks > 0
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                    : plan.progress.completedTasks > 0
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                                    }`}
                                >
                                  {plan.progress.completedTasks === plan.progress.totalTasks && plan.progress.totalTasks > 0 
                                    ? "Completed" 
                                    : plan.progress.completedTasks > 0 
                                    ? "In Progress" 
                                    : "Not Started"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty State - Mobile Responsive */}
                {totalPlans === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-12 text-center transition-colors duration-200">
                    <BookOpen className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Welcome to PrepBuddy!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
                      Create your first AI-powered study plan to get started on
                      your learning journey.
                    </p>
                    <button
                      onClick={() => handleTabChange("create")}
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg px-6 py-3 text-sm sm:text-base font-medium transition-colors"
                    >
                      Create Your First Study Plan
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "plans" && (
              <PlansPage
                studyPlans={studyPlans}
                onCreateNew={() => handleTabChange("create")}
                onViewPlan={onViewPlan}
                onDeletePlan={onDeletePlan}
              />
            )}

            {activeTab === "create" && (
              <div>
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Create New Study Plan
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Transform your content into a personalized AI-powered
                    learning experience
                  </p>
                </div>
                <UnifiedInput onSubmit={handleFormSubmit} />
              </div>
            )}

            {activeTab === "generate" && inputData && (
              <StudyPlanGenerator
                inputData={inputData}
                onPlanGenerated={handlePlanGenerated}
                onBack={handleBackToCreate}
              />
            )}

            {activeTab === "analytics" && (
              <AnalyticsPage studyPlans={studyPlans} />
            )}

            {activeTab === "social" && (
              <SocialFeatures />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
