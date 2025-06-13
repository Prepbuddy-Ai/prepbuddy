import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  onClose: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToSignIn, onClose }) => {
  const { signUp, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: 'Alex Johnson', // Default for development
    email: 'alex@example.com', // Default for development
    password: 'password123', // Default for development
    confirmPassword: 'password123', // Default for development
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true); // Default checked for development

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    if (!acceptTerms) {
      return;
    }
    
    try {
      await signUp(formData.email, formData.password, formData.name);
      onClose();
    } catch (error) {
      // Error is handled by the auth hook
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.name && formData.email && formData.password && passwordsMatch && acceptTerms;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join PrepBuddy!</h2>
        <p className="text-gray-600">Create your account and start learning with AI</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent ${
                formData.confirmPassword && passwordsMatch
                  ? 'border-green-300 focus:ring-green-500'
                  : formData.confirmPassword && !passwordsMatch
                  ? 'border-red-300 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-green-500'
              }`}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {formData.confirmPassword && !passwordsMatch && (
            <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
          )}
          {formData.confirmPassword && passwordsMatch && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Passwords match
            </p>
          )}
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
          />
          <label className="ml-2 text-sm text-gray-600">
            I agree to the{' '}
            <button type="button" className="text-green-600 hover:text-green-700">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-green-600 hover:text-green-700">
              Privacy Policy
            </button>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToSignIn}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </div>

      {/* Development Note */}
      <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-xs text-center">
          🚀 <strong>Dev Mode:</strong> Form is pre-filled for quick testing. Just click "Create Account"!
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;