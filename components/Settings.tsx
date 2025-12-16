import React from 'react';
import { User } from '../types';
import { Moon, Sun, LogOut, User as UserIcon, Building } from 'lucide-react';

interface SettingsProps {
  user: User;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, theme, toggleTheme, onLogout }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Profile</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Agent Name</p>
            <p className="font-bold text-slate-800 dark:text-white text-lg">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Company</p>
            <p className="font-bold text-slate-800 dark:text-white text-lg">{user.companyName}</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Appearance</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900/30 text-indigo-400' : 'bg-amber-100 text-amber-600'}`}>
                {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </div>
             <div>
               <p className="font-medium text-slate-800 dark:text-white">Dark Mode</p>
               <p className="text-xs text-slate-500 dark:text-slate-400">
                 {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
               </p>
             </div>
          </div>
          
          <button 
            onClick={toggleTheme}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}
          >
            <span
              className={`${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Account</h3>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Settings;