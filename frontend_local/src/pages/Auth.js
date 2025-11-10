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
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,58,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-transparent to-slate-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400/60 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-32 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-blue-500/50 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative w-full max-w-md z-10 animate-slide-in-up">
        <div className="card shadow-premium p-6 md:p-8">
          {/* Enhanced Brand Section */}
          <div className="text-center mb-6 md:mb-8">
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-glow animate-pulse-glow"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center border border-blue-400/30">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
              INTELLICAM
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-medium">Advanced Security Intelligence Platform</p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Enhanced Security Features */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
            <div className="group text-center p-3 md:p-4 glass-dark rounded-xl hover:bg-slate-700/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xs md:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors duration-300">AI Detection</span>
            </div>
            <div className="group text-center p-3 md:p-4 glass-dark rounded-xl hover:bg-slate-700/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-green-400 group-hover:text-green-300 transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-xs md:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors duration-300">Live Monitor</span>
            </div>
            <div className="group text-center p-3 md:p-4 glass-dark rounded-xl hover:bg-slate-700/20 transition-all duration-300 transform hover:scale-105">
              <div className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-2 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className="text-xs md:text-sm text-slate-300 font-semibold group-hover:text-white transition-colors duration-300">Smart Alerts</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              {isLogin ? 'Secure Access' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? 'Enter your credentials to access the system' : 'Join the security intelligence platform'}
            </p>
          </div>

          {authError && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-4 mb-4 animate-fade-in">
              <p className="text-sm text-red-300 text-center font-medium">{authError}</p>
            </div>
          )}
          {message && (
            <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4 mb-4 animate-fade-in">
              <p className="text-sm text-green-300 text-center font-medium">{message}</p>
            </div>
          )}

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-semibold text-slate-300">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="input-primary"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-300">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-slate-300">
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
                className="input-primary"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-300">
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
                  className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
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
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300">
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
                    className="w-full px-4 py-3 pr-12 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
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
              className="btn-primary w-full mt-6"
            >
              <span>{isLogin ? 'Access System' : 'Create Account'}</span>
              <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Need an account?" : 'Already registered?'}
            </p>
            <button
              onClick={toggleForm}
              className="mt-2 font-semibold text-blue-400 hover:text-blue-300 transition-all duration-200 hover:underline"
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