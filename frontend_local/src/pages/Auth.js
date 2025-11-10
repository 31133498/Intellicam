import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [message, setMessage] = useState(null);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleError = (err, defaultMessage = 'An unexpected error occurred.') => {
    let errorMessage = defaultMessage;
    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err.message) {
      errorMessage = err.message;
    }
    setAuthError(errorMessage);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setMessage(null);

    try {
      const { success, error } = await login(formData.email, formData.password);
      if (success) {
        navigate('/dashboard');
      } else {
        setAuthError(error || 'Login failed.');
      }
    } catch (err) {
      handleError(err, 'Login failed. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    try {
      const { fullName, email, phone, password } = formData;
      const { success, error } = await signup({ fullName, email, phone: Number(phone), password });
      if (success) {
        navigate('/dashboard');
      } else {
        setAuthError(error || 'Signup failed.');
      }
    } catch (err) {
      handleError(err, 'Signup failed. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setAuthError(null);
    setMessage(null);
    setFormData({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-3 md:p-4 relative overflow-hidden">
      {/* Security Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/5 via-transparent to-slate-900/10"></div>
      </div>

      {/* Floating Security Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>

      <div className="relative w-full max-w-md z-10">
        <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-2xl">
          {/* Brand Section */}
          <div className="text-center mb-6 md:mb-8">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl mx-auto mb-4 flex items-center justify-center border border-blue-500/30">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              INTELLICAM
            </h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1 font-medium">Advanced Security Intelligence Platform</p>
          </div>

          {/* Security Features */}
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-8">
            <div className="text-center p-2 md:p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 text-blue-400">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs text-slate-300 font-medium">AI Detection</span>
            </div>
            <div className="text-center p-2 md:p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 text-blue-400">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-xs text-slate-300 font-medium">Live Monitor</span>
            </div>
            <div className="text-center p-2 md:p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
              <div className="w-5 h-5 md:w-6 md:h-6 mx-auto mb-1 text-blue-400">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-xs text-slate-300 font-medium">Alerts</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center text-white mb-6">
            {isLogin ? 'Secure Access' : 'Create Account'}
          </h2>

          {authError && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-300 text-center">{authError}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-300 text-center">{message}</p>
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 mt-6 text-white font-semibold bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform hover:scale-[1.01] transition-all duration-200 shadow-lg border border-blue-500/30"
            >
              {isLogin ? 'Access System' : 'Create Account'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Need an account?" : 'Already registered?'}
            </p>
            <button
              onClick={toggleForm}
              className="mt-2 font-semibold text-blue-400 hover:text-blue-300 transition-all duration-200"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;