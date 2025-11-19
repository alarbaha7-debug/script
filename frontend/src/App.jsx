import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ScriptGenerator from './components/generator/ScriptGenerator';
import ApiKeyManager from './components/settings/ApiKeyManager';
import LoginButton from './components/auth/LoginButton';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden flex items-center justify-center p-3 sm:p-6">
        {/* AMAZING ANIMATED BACKGROUND */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Animated gradient orbs */}
          <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/30 rounded-full blur-3xl -top-24 sm:-top-48 -left-24 sm:-left-48 animate-float"></div>
          <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-pink-500/20 rounded-full blur-3xl top-1/4 -right-32 sm:-right-64 animate-float-slow"></div>
          <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-500/25 rounded-full blur-3xl bottom-0 left-1/3 animate-float-slower"></div>
          <div className="absolute w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-cyan-400/20 rounded-full blur-3xl top-1/2 right-1/4 animate-pulse-slow"></div>
          <div className="absolute w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] bg-violet-600/20 rounded-full blur-3xl -bottom-16 sm:-bottom-32 -right-16 sm:-right-32 animate-float"></div>

          {/* Gradient mesh overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/10 via-transparent to-blue-900/10"></div>

          {/* Animated particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute top-40 right-40 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-1000"></div>
          <div className="absolute bottom-40 left-60 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-2000"></div>
          <div className="absolute top-60 right-80 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-3000"></div>
        </div>

        {/* Login Card */}
        <div className="relative max-w-md w-full bg-slate-800/60 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/20 p-6 sm:p-10 border border-purple-500/30 animate-fade-in-up">
          <div className="text-center mb-6 sm:mb-8 animate-fade-in-down">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 animate-spin-slow" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
                FacelessScriptPro
              </h1>
              <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-pink-400 animate-spin-slow-reverse" />
            </div>
          </div>

          <div className="mb-6 sm:mb-8 animate-slide-in-up">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/30 shadow-xl">
              <h3 className="font-bold text-white mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                ✨ Features:
              </h3>
              <ul className="text-xs sm:text-sm text-gray-200 space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3 animate-fade-in delay-100">
                  <span className="text-green-400 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Write Up to 100,000 Characters — Ultra-High Quality</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 animate-fade-in delay-200">
                  <span className="text-green-400 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Ultimate Long-Form Script Engine</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 animate-fade-in delay-300">
                  <span className="text-green-400 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>The Ultimate AI Story Generator — 10x More Powerful</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3 animate-fade-in delay-400">
                  <span className="text-green-400 font-bold text-lg sm:text-xl flex-shrink-0">✓</span>
                  <span>Story Generation Without Limits</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="animate-slide-in-up delay-300">
            <LoginButton />
          </div>

          <p className="text-xs text-gray-400 text-center mt-4 sm:mt-6 animate-fade-in delay-600">
            🔒 Note: This is a demo login. Discord OAuth will be integrated later.
          </p>
        </div>

        {/* CSS ANIMATIONS */}
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(5deg); }
            66% { transform: translate(-20px, 20px) rotate(-5deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, -40px) scale(1.1); }
          }
          @keyframes float-slower {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(40px, -20px) rotate(10deg); }
          }
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-in-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes spin-slow-reverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }

          .animate-float { animation: float 20s ease-in-out infinite; }
          .animate-float-slow { animation: float-slow 25s ease-in-out infinite; }
          .animate-float-slower { animation: float-slower 30s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
          .animate-fade-in { animation: fade-in 0.6s ease-out; }
          .animate-slide-in-up { animation: slide-in-up 0.6s ease-out; }
          .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          .animate-spin-slow-reverse { animation: spin-slow-reverse 8s linear infinite; }

          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .delay-400 { animation-delay: 400ms; }
          .delay-500 { animation-delay: 500ms; }
          .delay-600 { animation-delay: 600ms; }
          .delay-1000 { animation-delay: 1000ms; }
          .delay-2000 { animation-delay: 2000ms; }
          .delay-3000 { animation-delay: 3000ms; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* AMAZING ANIMATED BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-purple-600/20 rounded-full blur-3xl -top-24 sm:-top-48 -left-24 sm:-left-48 animate-float"></div>
        <div className="absolute w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-pink-500/15 rounded-full blur-3xl top-1/3 -right-32 sm:-right-64 animate-float-slow"></div>
        <div className="absolute w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-blue-500/20 rounded-full blur-3xl bottom-0 left-1/4 animate-float-slower"></div>
        <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-cyan-400/15 rounded-full blur-3xl top-2/3 right-1/3 animate-pulse-slow"></div>

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-transparent to-blue-900/5"></div>

        {/* Animated particles */}
        <div className="absolute top-32 left-32 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-48 right-48 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-1500"></div>
        <div className="absolute bottom-48 left-64 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping delay-3000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-slate-800/60 backdrop-blur-2xl shadow-2xl shadow-purple-500/10 border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 animate-spin-slow flex-shrink-0" />
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent truncate">
                  FacelessScriptPro
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 animate-slide-in-left">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border-2 border-purple-500/50 shadow-lg shadow-purple-500/30 flex-shrink-0"
                />
              )}
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[80px] sm:max-w-none">{user.username}</div>
                <button
                  onClick={logout}
                  className="text-xs text-purple-300 hover:text-pink-300 transition-colors duration-300 whitespace-nowrap"
                >
                  Logout →
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* API Key Manager */}
          <ApiKeyManager />

          {/* Script Generator */}
          <ScriptGenerator />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-800/40 backdrop-blur-2xl border-t border-purple-500/30 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 md:py-8">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              &copy; 2025 FacelessScriptPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS ANIMATIONS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -40px) scale(1.1); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(40px, -20px) rotate(10deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-float { animation: float 25s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 30s ease-in-out infinite; }
        .animate-float-slower { animation: float-slower 35s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 5s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }

        .delay-1500 { animation-delay: 1500ms; }
        .delay-3000 { animation-delay: 3000ms; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </AuthProvider>
  );
}
