import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Shield, Smartphone, Eye, Camera, CheckCircle, ArrowRight, Play } from 'lucide-react';

function Landing() {
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState(8247);
  const [threatsDetected, setThreatsDetected] = useState(15632);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 3));
      setThreatsDetected(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-blue-400" />,
      title: "AI Threat Detection",
      description: "Advanced computer vision instantly identifies weapons, suspicious behavior, and security anomalies with 95%+ accuracy"
    },
    {
      icon: <Smartphone className="w-12 h-12 text-green-400" />,
      title: "Real-Time Mobile Alerts",
      description: "Get instant WhatsApp and SMS notifications the moment a threat is detected—anywhere, anytime"
    },
    {
      icon: <Eye className="w-12 h-12 text-purple-400" />,
      title: "Predictive Analytics",
      description: "Our AI learns normal patterns and flags unusual activity before incidents escalate"
    },
    {
      icon: <Camera className="w-12 h-12 text-cyan-400" />,
      title: "Universal Camera Support",
      description: "Works with any IP camera, smartphone, or existing CCTV system—no expensive hardware required"
    },
    {
      icon: <Shield className="w-12 h-12 text-orange-400" />,
      title: "Cloud-Powered Intelligence",
      description: "Secure cloud processing ensures your AI security system is always updated with the latest threat detection models"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Connect",
      description: "Link your smartphone camera or IP camera to Intellicam in under 2 minutes. No technical expertise required."
    },
    {
      step: "02", 
      title: "Activate",
      description: "Our AI surveillance system immediately begins monitoring your space with advanced threat detection algorithms."
    },
    {
      step: "03",
      title: "Stay Protected",
      description: "Receive instant alerts on your phone when suspicious activity is detected. Review, respond, or share with authorities instantly."
    }
  ];

  const stats = [
    { number: "10x", label: "Faster Response" },
    { number: "95%", label: "Detection Accuracy" },
    { number: "24/7", label: "AI Monitoring" },
    { number: "2min", label: "Setup Time" }
  ];

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Custom Orb Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full opacity-15 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full opacity-25 blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          IntelliCam
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/auth')}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
          >
            View Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center max-w-5xl">
          <div className="mb-6 inline-flex items-center px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-full text-blue-300 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            {activeUsers.toLocaleString()}+ users protecting their spaces right now
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent leading-tight">
            Your Camera Just Got
            <br />
            <span className="text-white">Intelligent</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Transform any smartphone or IP camera into an AI-powered security system that detects threats before they happen. Get instant alerts when suspicious activity, weapons, or anomalies are detected in real-time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Start Protecting Now - Free Demo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="group px-8 py-4 border-2 border-gray-600 hover:border-blue-500 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-gray-800/50 flex items-center justify-center"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Live Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-12">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Works with any camera
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Real-time AI detection
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              Instant mobile alerts
            </div>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
                <div className="text-3xl font-bold text-blue-400 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="relative z-10 py-20 px-4 bg-gray-800/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Future of Security is Predictive, Not Reactive</h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed">
            Traditional CCTV systems only record what happened. Intellicam's AI surveillance system actively monitors your space, using advanced computer vision to identify potential threats the moment they appear. Our predictive security AI doesn't just watch—it thinks, learns, and protects.
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Powered by YOLOv8 deep learning technology, Intellicam transforms ordinary cameras into intelligent guardians that never sleep, never miss, and never stop protecting what matters most to you.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Intelligent Security Features That Set Us Apart</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Advanced AI capabilities that transform any camera into a smart security system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-800/30 backdrop-blur-sm rounded-xl p-8 hover:bg-gray-800/50 transition-all duration-300 border border-gray-700/50 hover:border-blue-500/30">
                <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 py-20 px-4 bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Three Simple Steps to Intelligent Security</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started with AI-powered surveillance in minutes, not hours
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Value Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Trusted by Security-Conscious Individuals Worldwide</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-green-400 mb-2">10x</div>
              <div className="text-lg font-semibold text-white mb-2">Faster Response Time</div>
              <div className="text-sm text-gray-400">Get alerted to threats in seconds, not minutes</div>
            </div>
            <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-lg font-semibold text-white mb-2">Threat Detection Accuracy</div>
              <div className="text-sm text-gray-400">Advanced AI that learns and improves continuously</div>
            </div>
            <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-lg font-semibold text-white mb-2">Intelligent Monitoring</div>
              <div className="text-sm text-gray-400">Your AI security guard never takes a break</div>
            </div>
            <div className="text-center bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <div className="text-3xl font-bold text-cyan-400 mb-2">50%</div>
              <div className="text-lg font-semibold text-white mb-2">Cost Savings</div>
              <div className="text-sm text-gray-400">Transform existing cameras instead of buying expensive systems</div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Enterprise-grade AI technology
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Secure cloud infrastructure
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Privacy-first design
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                Real-time processing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="relative z-10 py-12 px-4 bg-gray-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-center mb-4">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
              <span className="text-lg font-semibold text-white">Live Activity</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-2">{threatsDetected.toLocaleString()}</div>
            <div className="text-gray-400">Threats detected and prevented this month</div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Experience Intelligent Security?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Join thousands who've upgraded from passive CCTV to predictive AI surveillance. Start your free demo today and see the future of security in action.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/demo')}
              className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              Start Live Demo Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="px-10 py-4 border-2 border-gray-600 hover:border-blue-500 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-gray-800/50"
            >
              Sign Up for Full Access
            </button>
          </div>

          <div className="text-sm text-gray-500">
            No credit card required • 5-minute setup • Works with any camera
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Intellicam
          </div>
          <p className="text-gray-400 mb-4">
            Your Camera Just Got Intelligent
          </p>
          <p className="text-sm text-gray-500">
            © 2024 Intellicam. AI-powered predictive surveillance for smarter security.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
