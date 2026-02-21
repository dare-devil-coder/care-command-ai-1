'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Shield, Database, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">System Settings</h1>
        <p className="text-sm text-slate-400">Configure hospital system preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">Basic system configuration</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Hospital Name</label>
              <Input 
                defaultValue="CareCommand Medical Center" 
                className="bg-slate-800/50 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">System Timezone</label>
              <Input 
                defaultValue="UTC-5 (Eastern Time)" 
                className="bg-slate-800/50 border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-white mb-2 block">Language</label>
              <Input 
                defaultValue="English (US)" 
                className="bg-slate-800/50 border-white/10 text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">Alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-white">Critical Alerts</p>
                <p className="text-xs text-slate-400">Immediate notifications for critical events</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-white">Task Reminders</p>
                <p className="text-xs text-slate-400">Notifications for pending tasks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-white">Email Notifications</p>
                <p className="text-xs text-slate-400">Send alerts via email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">Access control and security</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400">Require 2FA for all users</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-white">Session Timeout</p>
                <p className="text-xs text-slate-400">Auto-logout after inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-white">Audit Logging</p>
                <p className="text-xs text-slate-400">Track all system activities</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription className="text-sm text-slate-400">Backup and storage settings</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50">
              <div>
                <p className="text-sm font-medium text-white">Auto Backup</p>
                <p className="text-xs text-slate-400">Daily automated backups</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="p-3 rounded-xl bg-slate-800/50">
              <p className="text-sm font-medium text-white mb-2">Last Backup</p>
              <p className="text-xs text-slate-400">Today at 3:00 AM</p>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200">
              Create Backup Now
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Appearance Settings */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription className="text-sm text-slate-400">Customize system appearance</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer">
              <div className="w-full h-20 rounded-lg bg-gradient-to-br from-slate-900 to-slate-800 mb-3" />
              <p className="text-sm font-medium text-white">Dark Theme</p>
              <p className="text-xs text-slate-400">Current theme</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer opacity-50">
              <div className="w-full h-20 rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 mb-3" />
              <p className="text-sm font-medium text-white">Blue Theme</p>
              <p className="text-xs text-slate-400">Coming soon</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/50 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer opacity-50">
              <div className="w-full h-20 rounded-lg bg-gradient-to-br from-purple-900 to-purple-800 mb-3" />
              <p className="text-sm font-medium text-white">Purple Theme</p>
              <p className="text-xs text-slate-400">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="rounded-xl px-6 border-white/20 hover:bg-white/5">
          Cancel
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6 transition-all duration-200">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
