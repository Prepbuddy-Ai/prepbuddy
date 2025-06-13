import React from 'react';
import { ArrowRight, BookOpen, Brain, Target, Clock, Users, Star, CheckCircle, Sparkles, Zap, Award, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PrepBuddy</h1>
              <p className="text-sm text-gray-600">AI Study Assistant</p>
            </div>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Learning Revolution
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Personal
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> AI Study</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Companion</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform any document into a personalized study plan. Upload PDFs, Word docs, or paste your content, 
              and PrepBuddy's AI will create the perfect learning path tailored to your goals and schedule.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Sparkles className="h-6 w-6 mr-2" />
              Start Learning with AI
              <ArrowRight className="h-6 w-6 ml-2" />
            </button>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200">
              Watch Demo
            </button>
          </div>

          {/* Feature Preview */}
          <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-100 to-blue-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Planning</h3>
                  <p className="text-gray-600 text-sm">AI analyzes your content and creates personalized study schedules</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-100 to-green-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Time Optimized</h3>
                  <p className="text-gray-600 text-sm">Efficient learning paths that adapt to your busy lifestyle</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-gradient-to-r from-purple-100 to-purple-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Enhanced</h3>
                  <p className="text-gray-600 text-sm">Advanced algorithms understand and structure your content</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PrepBuddy?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of personalized learning with AI-powered study plans that adapt to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Universal File Support</h3>
              <p className="text-gray-700 mb-4">Upload PDFs, Word docs, text files, and academic formats. PrepBuddy understands them all.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />PDF Documents</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Word Files (DOCX)</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Academic Formats</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real AI Analysis</h3>
              <p className="text-gray-700 mb-4">Advanced AI reads and comprehends your content to create truly personalized plans.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Content Understanding</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Topic Extraction</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Difficulty Adaptation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
              <p className="text-gray-700 mb-4">Monitor your learning journey with detailed analytics and achievement tracking.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Task Completion</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Quiz Results</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Learning Analytics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Flexible Scheduling</h3>
              <p className="text-gray-700 mb-4">Customize study duration and daily time commitment to fit your lifestyle.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />30 min to 3+ hours daily</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />1 week to 1 month plans</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Adaptive pacing</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl border border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Quizzes</h3>
              <p className="text-gray-700 mb-4">Test your knowledge with AI-generated quizzes tailored to your study material.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Content-based questions</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Instant feedback</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Progress tracking</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-8 rounded-2xl border border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="bg-teal-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Dashboard</h3>
              <p className="text-gray-700 mb-4">Manage multiple study plans with comprehensive analytics and insights.</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Multiple plans</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Progress overview</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Performance metrics</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How PrepBuddy Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes with our simple 3-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Upload & Input</h3>
              <p className="text-gray-600">
                Upload your study materials (PDFs, Word docs, etc.) and add any additional notes or context you want included.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your content, identifies key topics, and creates a personalized study plan based on your preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learn & Track</h3>
              <p className="text-gray-600">
                Follow your personalized study plan, complete daily tasks, take quizzes, and track your progress on the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using PrepBuddy to achieve their learning goals faster and more effectively.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Zap className="h-6 w-6 mr-2" />
              Start Your Free Study Plan
              <ArrowRight className="h-6 w-6 ml-2" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">10,000+</div>
              <div className="text-blue-200">Study Plans Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-blue-200">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-blue-200">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">PrepBuddy</h3>
                <p className="text-gray-400 text-sm">AI Study Assistant</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 PrepBuddy. Transforming education with AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;