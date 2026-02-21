'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DEMO_USERS } from '@/lib/data';
import { Users, UserPlus, Mail, Phone } from 'lucide-react';
import { addNotification } from '@/lib/notificationStore';

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState(DEMO_USERS.filter(u => u.role !== 'patient'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('nurse');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffDepartment, setNewStaffDepartment] = useState('');

  const handleAddStaff = () => {
    if (!newStaffName.trim()) return;

    const newStaff = {
      id: `staff-${Date.now()}`,
      username: newStaffName.toLowerCase().replace(/\s+/g, ''),
      password: 'password123',
      name: newStaffName,
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, '')}@hospital.com`,
      role: newStaffRole as any,
      avatar: '👤',
      department: newStaffDepartment || 'General',
      phone: '+1-555-0000'
    };

    setStaffList([...staffList, newStaff]);
    
    // Add notification to admin
    addNotification('admin', `New staff member added: ${newStaffName} (${newStaffRole})`);
    
    // If adding a nurse, notify them
    if (newStaffRole === 'nurse') {
      addNotification('nurse', `Welcome to CareCommand AI! You have been added as a nurse.`);
    }
    
    setShowAddModal(false);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffDepartment('');
    setNewStaffRole('nurse');
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
      doctor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      nurse: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      technician: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
    };
    return colors[role] || colors.admin;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Staff Management</h1>
          <p className="text-sm text-slate-400">Manage hospital personnel and assignments</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 transition-all duration-200"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
            <CardHeader className="p-0 mb-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold text-white">Add New Staff Member</CardTitle>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Enter staff name"
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="nurse">Nurse</option>
                  <option value="doctor">Doctor</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="email@hospital.com"
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Department (Optional)</label>
                <input
                  type="text"
                  value={newStaffDepartment}
                  onChange={(e) => setNewStaffDepartment(e.target.value)}
                  placeholder="e.g., Emergency, ICU"
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleAddStaff}
                  disabled={!newStaffName.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Add Staff
                </Button>
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Total Staff</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">{staffList.length}</div>
            <p className="text-sm text-slate-400 mt-1">Active personnel</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Doctors</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">{staffList.filter(s => s.role === 'doctor').length}</div>
            <p className="text-sm text-slate-400 mt-1">Physicians</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Nurses</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">{staffList.filter(s => s.role === 'nurse').length}</div>
            <p className="text-sm text-slate-400 mt-1">Nursing staff</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm uppercase tracking-wide text-slate-400">Technicians</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-4xl font-bold text-white">{staffList.filter(s => s.role === 'technician').length}</div>
            <p className="text-sm text-slate-400 mt-1">Technical staff</p>
          </CardContent>
        </Card>
      </div>

      {/* Staff Directory */}
      <Card className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 backdrop-blur-xl shadow-lg shadow-black/30 p-6">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-xl font-semibold text-white">Staff Directory</CardTitle>
          <CardDescription className="text-sm text-slate-400">All hospital personnel</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-3">
            {staffList.map((member) => (
              <div
                key={member.id}
                className="p-4 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-800/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {member.avatar && member.avatar.startsWith('http') ? (
                      <img 
                        src={member.avatar} 
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover border border-blue-500/30"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-xl border border-blue-500/30">
                        {member.avatar || '👤'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge className={getRoleBadgeColor(member.role)}>
                          {member.role}
                        </Badge>
                        {member.department && (
                          <span className="text-xs text-slate-400">{member.department}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
