import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ScriptGenerator from './components/generator/ScriptGenerator';
import ApiKeyManager from './components/settings/ApiKeyManager';
import LoginButton from './components/auth/LoginButton';

function AppContent() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-3 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              FacelessScriptPro
            </h1>
            <p className="text-sm sm:text-base text-gray-600">AI-Powered Script Generator</p>
          </div>

          <div className="mb-4 sm:mb-6">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 sm:p-5 mb-4 sm:mb-6 border border-indigo-100">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 sm:mb-3 leading-tight">
                Write Up to 100,000 Characters — Ultra-High Quality
              </h3>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                Ultimate Long-Form Script Engine
              </p>
              <p className="text-xs sm:text-sm md:text-base font-medium text-indigo-700 leading-snug">
                The Ultimate AI Story Generator — 10x More Powerful
              </p>
              <p className="text-xs sm:text-sm md:text-base font-medium text-purple-600 mt-1 leading-snug">
                Story Generation Without Limits
              </p>
            </div>
          </div>

          <LoginButton />

          <p className="text-xs text-gray-500 text-center mt-4 sm:mt-6">
            Note: This is a demo login. Discord OAuth will be integrated later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">FacelessScriptPro</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">AI-Powered Script Generator</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                />
              )}
              <div className="text-right">
                <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[100px] sm:max-w-none">{user.username}</div>
                <button
                  onClick={logout}
                  className="text-xs text-gray-600 hover:text-gray-900 whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4 sm:py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          {/* API Key Manager */}
          <ApiKeyManager />

          {/* Script Generator */}
          <ScriptGenerator />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-gray-600">
            &copy; 2025 FacelessScriptPro. All rights reserved.
          </p>
        </div>
      </footer>
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
