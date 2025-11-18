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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              FacelessScriptPro
            </h1>
            <p className="text-gray-600">AI-Powered Script Generator</p>
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Features:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✅ 20 different niches</li>
                <li>✅ AI-powered script analysis</li>
                <li>✅ Generate 10K-100K character scripts</li>
                <li>✅ Intelligent chunking for long scripts</li>
                <li>✅ Download & copy functionality</li>
              </ul>
            </div>
          </div>

          <LoginButton />

          <p className="text-xs text-gray-500 text-center mt-6">
            Note: This is a demo login. Discord OAuth will be integrated later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FacelessScriptPro</h1>
              <p className="text-sm text-gray-600">AI-Powered Script Generator</p>
            </div>

            <div className="flex items-center gap-4">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{user.username}</div>
                <button
                  onClick={logout}
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* API Key Manager */}
          <ApiKeyManager />

          {/* Script Generator */}
          <ScriptGenerator />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-600">
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
