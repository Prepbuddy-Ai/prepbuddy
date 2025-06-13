import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Hero from './components/Hero';
import UnifiedInput from './components/UnifiedInput';
import StudyPlanGenerator from './components/StudyPlanGenerator';
import StudyPlanDisplay from './components/StudyPlanDisplay';
import Dashboard from './components/Dashboard';
import QuizComponent from './components/QuizComponent';
import ProgressCelebration from './components/ProgressCelebration';
import DailyReminder from './components/DailyReminder';
import AuthModal from './components/AuthModal';
import { AuthProvider } from './components/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';
import { useIncentives } from './hooks/useIncentives';

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  topics: string[];
  schedule: Array<{
    day: number;
    title: string;
    tasks: string[];
    estimatedTime: string;
    completed?: boolean;
    quiz?: Quiz;
  }>;
  createdAt: Date;
  files: Array<{
    id: string;
    name: string;
    content: string;
    addedAt: Date;
  }>;
  progress: {
    completedTasks: number;
    totalTasks: number;
    completedDays: number;
    totalDays: number;
  };
}

export interface Quiz {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
  passingScore: number;
}

export interface QuizResult {
  quizId: string;
  score: number;
  answers: number[];
  completedAt: Date;
  passed: boolean;
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'study' | 'quiz'>('landing');
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<{ quiz: Quiz; dayIndex: number; planId: string } | null>(null);
  const [showDailyReminder, setShowDailyReminder] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Initialize incentive system
  const {
    incentiveData,
    showCelebration,
    setShowCelebration,
    triggerCelebration,
    awardXP,
    handleTaskCompletion,
    handlePlanCompletion,
    checkAchievements
  } = useIncentives(studyPlans);

  // Load study plans from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('prepbuddy-study-plans');
    if (savedPlans) {
      try {
        const plans = JSON.parse(savedPlans).map((plan: any) => ({
          ...plan,
          createdAt: new Date(plan.createdAt),
          files: plan.files?.map((file: any) => ({
            ...file,
            addedAt: new Date(file.addedAt)
          })) || []
        }));
        setStudyPlans(plans);
      } catch (error) {
        console.error('Failed to load study plans:', error);
      }
    }
  }, []);

  // Save study plans to localStorage whenever they change
  useEffect(() => {
    if (studyPlans.length > 0) {
      localStorage.setItem('prepbuddy-study-plans', JSON.stringify(studyPlans));
    }
  }, [studyPlans]);

  // Check for daily reminder
  useEffect(() => {
    const checkDailyReminder = () => {
      const lastReminderDate = localStorage.getItem('last-reminder-date');
      const today = new Date().toDateString();
      
      if (lastReminderDate !== today && !incentiveData.hasStudiedToday) {
        const hour = new Date().getHours();
        if (hour >= 18 && hour < 23) {
          setShowDailyReminder(true);
        }
      }
    };

    const timer = setTimeout(checkDailyReminder, 2000); // Check after 2 seconds
    return () => clearTimeout(timer);
  }, [incentiveData.hasStudiedToday]);

  // Auto-navigate to dashboard if authenticated and on landing page
  useEffect(() => {
    if (isAuthenticated && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [isAuthenticated, currentView]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
    } else {
      // Show authentication modal instead of navigating
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: 'dashboard' | 'create' | 'generate' | 'study' | 'quiz') => {
    if (!isAuthenticated && view !== 'landing') {
      setShowAuthModal(true);
      return;
    }
    setCurrentView(view);
  };

  const handlePlanGenerated = (plan: StudyPlan) => {
    const newPlan = {
      ...plan,
      progress: {
        completedTasks: 0,
        totalTasks: plan.schedule.reduce((total, day) => total + day.tasks.length, 0),
        completedDays: 0,
        totalDays: plan.schedule.length
      }
    };
    
    setStudyPlans(prev => [newPlan, ...prev]);
    setCurrentPlan(newPlan);
    setCurrentView('study');
    
    // Award XP for creating a plan
    awardXP(25, 'Plan created');
    triggerCelebration('plan', 'Plan Created!', 'Your AI-powered study plan is ready! Time to start learning!');
  };

  const handleViewPlan = (plan: StudyPlan) => {
    setCurrentPlan(plan);
    setCurrentView('study');
  };

  const handleDeletePlan = (planId: string) => {
    setStudyPlans(prev => prev.filter(plan => plan.id !== planId));
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
      setCurrentView('dashboard');
    }
  };

  const handleAddFileToPlan = async (planId: string, file: File, content: string) => {
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      content,
      addedAt: new Date()
    };

    setStudyPlans(prev => prev.map(plan => 
      plan.id === planId 
        ? { ...plan, files: [...plan.files, newFile] }
        : plan
    ));

    if (currentPlan?.id === planId) {
      setCurrentPlan(prev => prev ? { ...prev, files: [...prev.files, newFile] } : null);
    }
  };

  const handleTaskComplete = (planId: string, dayIndex: number, taskIndex: number, completed: boolean) => {
    setStudyPlans(prev => prev.map(plan => {
      if (plan.id !== planId) return plan;

      const updatedSchedule = [...plan.schedule];
      const day = updatedSchedule[dayIndex];
      
      // Update task completion (we'll track this in a separate structure)
      const taskId = `${dayIndex}-${taskIndex}`;
      const completedTasks = new Set(JSON.parse(localStorage.getItem(`completed-tasks-${planId}`) || '[]'));
      
      if (completed) {
        completedTasks.add(taskId);
        // Trigger incentive system
        handleTaskCompletion(planId, dayIndex, taskIndex);
      } else {
        completedTasks.delete(taskId);
      }
      
      localStorage.setItem(`completed-tasks-${planId}`, JSON.stringify([...completedTasks]));

      // Check if all tasks in the day are completed
      const dayTasks = day.tasks.length;
      const dayCompletedTasks = Array.from(completedTasks).filter(id => id.startsWith(`${dayIndex}-`)).length;
      const dayCompleted = dayCompletedTasks === dayTasks;

      updatedSchedule[dayIndex] = { ...day, completed: dayCompleted };

      // Update overall progress
      const totalTasks = plan.schedule.reduce((total, d) => total + d.tasks.length, 0);
      const totalCompletedTasks = completedTasks.size;
      const totalCompletedDays = updatedSchedule.filter(d => d.completed).length;

      // Check if plan is completed
      if (totalCompletedDays === plan.schedule.length && plan.progress.completedDays < plan.schedule.length) {
        handlePlanCompletion(planId);
      }

      return {
        ...plan,
        schedule: updatedSchedule,
        progress: {
          completedTasks: totalCompletedTasks,
          totalTasks,
          completedDays: totalCompletedDays,
          totalDays: plan.schedule.length
        }
      };
    }));

    if (currentPlan?.id === planId) {
      const updatedPlan = studyPlans.find(p => p.id === planId);
      if (updatedPlan) setCurrentPlan(updatedPlan);
    }
  };

  const handleStartQuiz = (quiz: Quiz, dayIndex: number, planId: string) => {
    setCurrentQuiz({ quiz, dayIndex, planId });
    setCurrentView('quiz');
  };

  const handleQuizComplete = (result: QuizResult) => {
    // Save quiz result
    const quizResults = JSON.parse(localStorage.getItem(`quiz-results-${currentQuiz?.planId}`) || '{}');
    quizResults[currentQuiz?.quiz.id || ''] = result;
    localStorage.setItem(`quiz-results-${currentQuiz?.planId}`, JSON.stringify(quizResults));

    // Award XP for quiz completion
    const xpAmount = result.passed ? 50 : 25;
    awardXP(xpAmount, result.passed ? 'Quiz passed' : 'Quiz attempted');
    
    if (result.passed) {
      triggerCelebration('achievement', 'Quiz Passed!', `Great job! You scored ${result.score}%!`);
    }

    // Return to study view
    setCurrentQuiz(null);
    setCurrentView('study');
  };

  const handleStartOver = () => {
    setCurrentView('dashboard');
    setCurrentPlan(null);
  };

  const handleDismissReminder = () => {
    setShowDailyReminder(false);
    localStorage.setItem('last-reminder-date', new Date().toDateString());
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading PrepBuddy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Show header only when authenticated or on protected views */}
      {(isAuthenticated || currentView !== 'landing') && (
        <Header 
          onNavigate={handleNavigate} 
          currentView={currentView}
        />
      )}
      
      {/* Landing page - only show when not authenticated */}
      {!isAuthenticated && currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {/* Protected routes - only show when authenticated */}
      {isAuthenticated && (
        <>
          {currentView === 'dashboard' && (
            <Dashboard
              studyPlans={studyPlans}
              onCreateNew={() => {}} // Not used anymore since create is handled within dashboard
              onViewPlan={handleViewPlan}
              onDeletePlan={handleDeletePlan}
              onPlanGenerated={handlePlanGenerated} // Pass this to dashboard
              incentiveData={incentiveData} // Pass incentive data
            />
          )}

          {currentView === 'study' && currentPlan && (
            <StudyPlanDisplay
              studyPlan={currentPlan}
              onStartOver={handleStartOver}
              onAddFile={handleAddFileToPlan}
              onTaskComplete={handleTaskComplete}
              onStartQuiz={handleStartQuiz}
              incentiveData={incentiveData} // Pass incentive data
            />
          )}

          {currentView === 'quiz' && currentQuiz && (
            <QuizComponent
              quiz={currentQuiz.quiz}
              onComplete={handleQuizComplete}
              onBack={() => {
                setCurrentQuiz(null);
                setCurrentView('study');
              }}
            />
          )}
        </>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
      />

      {/* Progress Celebration Modal */}
      {showCelebration?.show && (
        <ProgressCelebration
          type={showCelebration.type}
          title={showCelebration.title}
          message={showCelebration.message}
          onClose={() => setShowCelebration(null)}
        />
      )}

      {/* Daily Reminder */}
      {showDailyReminder && (
        <DailyReminder
          hasStudiedToday={incentiveData.hasStudiedToday}
          currentStreak={incentiveData.currentStreak}
          onDismiss={handleDismissReminder}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;