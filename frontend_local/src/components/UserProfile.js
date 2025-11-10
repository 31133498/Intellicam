import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Shield, Bell, LogOut } from 'lucide-react';

function UserProfile() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <div className="text-left">
          <div className="text-sm font-medium text-white">{user?.full_name || 'User'}</div>
          <div className="text-xs text-gray-400">{user?.email}</div>
        </div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <div>
                <div className="font-medium text-white">{user?.full_name}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
                <div className="text-xs text-green-400">
                  {user?.is_verified ? '✓ Verified' : '⚠ Unverified'}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              <Shield size={16} />
              <span>Security</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors">
              <Bell size={16} />
              <span>Notifications</span>
            </button>
          </div>

          <div className="p-2 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;