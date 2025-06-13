import React, { useState } from 'react';
import { User, Settings, Bell, Clock, Target, Award, Edit3, Save, X, Camera, Mail, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface UserProfileProps {
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user, updateProfile, updatePreferences } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'stats'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    bio: user?.profile.bio || '',
    learningGoals: user?.profile.learningGoals || [],
    preferredStudyTime: user?.profile.preferredStudyTime || 'evening',
    studyLevel: user?.profile.studyLevel || 'intermediate',
  });

  const [preferences, setPreferences] = useState({
    notifications: user?.preferences.notifications || true,
    studyReminders: user?.preferences.studyReminders || true,
    weeklyReports: user?.preferences.weeklyReports || true,
    theme: user?.preferences.theme || 'light',
  });

  if (!user) return null;

  const handleSaveProfile = () => {
    updateProfile({
      bio: editData.bio,
      learningGoals: editData.learningGoals,
      preferredStudyTime: editData.preferredStudyTime,
      studyLevel: editData.studyLevel,
    });
    setIsEditing(false);
  };

  const handleSavePreferences = () => {
    updatePreferences(preferences);
  };

  const addLearningGoal = () => {
    setEditData(prev => ({
      ...prev,
      learningGoals: [...prev.learningGoals, '']
    }));
  };

  const updateLearningGoal = (index: number, value: string) => {
    setEditData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.map((goal, i) => i === index ? value : goal)
    }));
  };

  const removeLearningGoal = (index: number) => {
    setEditData(prev => ({
      ...prev,
      learningGoals: prev.learningGoals.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-1 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                </p>
                <p className="text-blue-100 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Member since {user.createdAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'preferences', label: 'Preferences', icon: Settings },
              { id: 'stats', label: 'Statistics', icon: Award },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Information</h3>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    isEditing
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Study Level
                  </label>
                  <select
                    value={editData.studyLevel}
                    onChange={(e) => setEditData(prev => ({ ...prev, studyLevel: e.target.value as any }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Study Time
                  </label>
                  <select
                    value={editData.preferredStudyTime}
                    onChange={(e) => setEditData(prev => ({ ...prev, preferredStudyTime: e.target.value as any }))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="morning">Morning (6AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 6PM)</option>
                    <option value="evening">Evening (6PM - 10PM)</option>
                    <option value="night">Night (10PM - 6AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={user.profile.timezone}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                  placeholder="Tell us about yourself and your learning goals..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Learning Goals
                  </label>
                  {isEditing && (
                    <button
                      onClick={addLearningGoal}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Add Goal
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {editData.learningGoals.map((goal, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => updateLearningGoal(index, e.target.value)}
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-700 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter a learning goal..."
                      />
                      {isEditing && (
                        <button
                          onClick={() => removeLearningGoal(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preferences</h3>
                <button
                  onClick={handleSavePreferences}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-blue-600" />
                    Notifications
                  </h4>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">General Notifications</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your learning progress</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.notifications}
                        onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Study Reminders</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get reminded when it's time to study</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.studyReminders}
                        onChange={(e) => setPreferences(prev => ({ ...prev, studyReminders: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Weekly Reports</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive weekly progress summaries</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.weeklyReports}
                        onChange={(e) => setPreferences(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-blue-600" />
                    Appearance
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Theme</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
                      </div>
                      <ThemeToggle showLabel />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Learning Statistics</h3>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{user.stats.level}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Level</div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{user.stats.totalXP}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{user.stats.currentStreak}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Streak</div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{user.stats.plansCompleted}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Plans Completed</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Learning Progress
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Level Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user.stats.totalXP % 100}/100 XP</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(user.stats.totalXP % 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white dark:bg-gray-800 bg-opacity-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{user.stats.longestStreak}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</div>
                    </div>
                    <div className="text-center p-3 bg-white dark:bg-gray-800 bg-opacity-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{user.stats.totalStudyTime}h</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Study Time</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Recent Achievements
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center p-3 bg-white dark:bg-gray-800 bg-opacity-50 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Welcome to PrepBuddy!</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Created your account</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;