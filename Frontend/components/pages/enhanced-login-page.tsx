'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, Shield, Zap, Users, Moon, Sun, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export function EnhancedLoginPage() {
  const { theme, setTheme } = useTheme();
  const { login: storeLogin, initializeMockData } = useStore();
  const { login: authLogin } = useAuth();
  
  const [role, setRole] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState('');

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    // Initialize mock data on first load
    initializeMockData();
  }, [initializeMockData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('[Login] Form submitted');
    console.log('[Login] Current values:', { role, hospitalId, password });
    
    // Validation
    if (!role) {
      setError('Please select a role');
      toast.error('Please select a role');
      return;
    }
    if (!hospitalId.trim()) {
      setError('Hospital ID is required');
      toast.error('Hospital ID is required');
      return;
    }
    if (!password.trim()) {
      setError('Password is required');
      toast.error('Password is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user based on role
      const roleNames: Record<string, string> = {
        nurse: 'Nurse Emily Rodriguez',
        doctor: 'Dr. Michael Chen',
        admin: 'Admin Sarah Johnson',
        patient: 'Patient Robert Thompson',
      };
      
      const user = {
        id: role === 'nurse' ? 'N001' : role === 'doctor' ? 'D001' : role === 'admin' ? 'A001' : 'P001',
        name: roleNames[role] || 'User',
        role: role as 'nurse' | 'doctor' | 'admin' | 'patient',
        hospitalId,
      };
      
      console.log('[Login] Created user object:', user);
      
      // Login user in both systems
      storeLogin(user);
      
      // Also login to auth context with correct mock email
      const roleEmails: Record<string, string> = {
        nurse: 'emily.rodriguez@hospital.com',
        doctor: 'michael.chen@hospital.com',
        admin: 'sarah.johnson@hospital.com',
        patient: 'robert.thompson@hospital.com',
      };
      
      const mockEmail = roleEmails[role] || 'emily.rodriguez@hospital.com';
      await authLogin(mockEmail, 'password');
      
      console.log('[Login] Login functions called');
      
      // Verify login worked
      const store = useStore.getState();
      console.log('[Login] Store state after login:', {
        isLoggedIn: store.isLoggedIn,
        user: store.user
      });
      
      // Show success toast
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        nurse: '/dashboard/nurse',
        doctor: '/dashboard/doctor',
        admin: '/dashboard/admin',
        patient: '/dashboard/patient',
      };
      
      const redirectPath = roleRoutes[role] || '/dashboard';
      console.log('[Login] Redirecting to:', redirectPath);
      
      // Force redirect with window.location
      window.location.href = redirectPath;
    } catch (error) {
      console.error('[Login] Error during login:', error);
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDemoMode = async () => {
    console.log('[Demo] Demo mode clicked');
    setIsLoading(true);
    
    try {
      // Auto-login as nurse for demo
      const demoUser = {
        id: 'N001',
        name: 'Nurse Emily Rodriguez',
        role: 'nurse' as const,
        hospitalId: 'DEMO-001',
      };
      
      console.log('[Demo] Created demo user:', demoUser);
      
      storeLogin(demoUser);
      
      // Also login to auth context with correct mock email
      await authLogin('emily.rodriguez@hospital.com', 'password');
      
      console.log('[Demo] Login functions called');
      
      // Verify login worked
      const store = useStore.getState();
      console.log('[Demo] Store state after login:', {
        isLoggedIn: store.isLoggedIn,
        user: store.user
      });
      
      toast.success('Demo Mode Activated!');
      
      console.log('[Demo] Redirecting to: /dashboard/nurse');
      
      // Force redirect with window.location
      window.location.href = '/dashboard/nurse';
    } catch (error) {
      console.error('[Demo] Error during demo login:', error);
      toast.error('Demo mode failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated Illustration */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 relative overflow-hidden"
      >
        {/* Animated Background Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="mb-8"
            >
              <Activity className="w-32 h-32 mx-auto text-cyan-300" />
            </motion.div>

            <h1 className="text-5xl font-bold mb-4">
              CARECOMMAND AI
            </h1>
            <p className="text-xl text-cyan-200 mb-8">
              Mission-Control System for Smart Healthcare
            </p>

            {/* Feature Pills */}
            <div className="space-y-4 max-w-md mx-auto">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
              >
                <Shield className="w-6 h-6 text-green-300" />
                <span className="text-sm font-medium">Blockchain-Secured Records</span>
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
              >
                <Zap className="w-6 h-6 text-yellow-300" />
                <span className="text-sm font-medium">AI Predictive Analytics</span>
              </motion.div>

              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
              >
                <Users className="w-6 h-6 text-purple-300" />
                <span className="text-sm font-medium">Real-Time Care Coordination</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950"
      >
        <div className="w-full max-w-md">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-6">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-slate-400 hover:text-white"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-lg p-8 border-2 border-cyan-500/20">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-400">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Role Selector */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white">Select Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger 
                      id="role"
                      className="glass border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500/50 text-white"
                    >
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nurse">👩‍⚕️ Nurse</SelectItem>
                      <SelectItem value="doctor">👨‍⚕️ Doctor</SelectItem>
                      <SelectItem value="admin">👔 Admin</SelectItem>
                      <SelectItem value="patient">🧑 Patient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hospital ID */}
                <div className="space-y-2">
                  <Label htmlFor="hospitalId" className="text-white">Hospital ID</Label>
                  <Input
                    id="hospitalId"
                    type="text"
                    placeholder="Enter your hospital ID"
                    value={hospitalId}
                    onChange={(e) => setHospitalId(e.target.value)}
                    className="glass border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500/50 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass border-cyan-500/30 focus:border-cyan-500 focus:ring-cyan-500/50 text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !role}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-6 rounded-2xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Activity className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    'Login'
                  )}
                </Button>

                {/* Demo Mode Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoMode}
                  disabled={isLoading}
                  className="w-full border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500 font-semibold py-6 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Demo Mode
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                  Secured by blockchain technology
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-8 text-slate-400 text-sm"
          >
            "AI-Driven Care. Blockchain-Secured Trust."
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
