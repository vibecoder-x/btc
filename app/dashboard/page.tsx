'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Key,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  LogOut,
  TrendingUp,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  plan_type: 'free' | 'premium' | 'enterprise';
}

interface ApiKey {
  id: string;
  key_value: string;
  key_prefix: string;
  created_at: string;
  last_used: string | null;
  status: 'active' | 'revoked';
}

interface UsageStats {
  today: number;
  thisMonth: number;
  limit: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [apiKey, setApiKey] = useState<ApiKey | null>(null);
  const [showFullKey, setShowFullKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [usageStats, setUsageStats] = useState<UsageStats>({ today: 0, thisMonth: 0, limit: 1000 });
  const router = useRouter();
  const supabase = createClient();

  const planLimits = {
    free: { daily: 1000, perMinute: 30 },
    premium: { daily: 50000, perMinute: 200 },
    enterprise: { daily: Infinity, perMinute: Infinity },
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser(authUser);

      // Load user profile
      const { data: profileData } = await supabase
        .from('users_profile')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setUsageStats(prev => ({
          ...prev,
          limit: planLimits[profileData.plan_type as keyof typeof planLimits].daily,
        }));
      }

      // Load API key
      const { data: keyData } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', authUser.id)
        .eq('status', 'active')
        .single();

      if (keyData) {
        setApiKey(keyData);
      }

      // Load usage stats
      const today = new Date().toISOString().split('T')[0];
      const { data: todayUsage } = await supabase
        .from('usage_logs')
        .select('requests_count')
        .eq('user_id', authUser.id)
        .eq('date', today)
        .single();

      if (todayUsage) {
        setUsageStats(prev => ({ ...prev, today: todayUsage.requests_count }));
      }

      // Calculate this month's usage
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      const { data: monthUsage } = await supabase
        .from('usage_logs')
        .select('requests_count')
        .eq('user_id', authUser.id)
        .gte('date', firstDayOfMonth.toISOString().split('T')[0]);

      if (monthUsage) {
        const monthTotal = monthUsage.reduce((sum, log) => sum + log.requests_count, 0);
        setUsageStats(prev => ({ ...prev, thisMonth: monthTotal }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      // Generate a random API key
      const newKey = 'btc_' + Array.from({ length: 32 }, () =>
        Math.random().toString(36).charAt(2)
      ).join('');

      const keyPrefix = newKey.substring(0, 12);

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user.id,
          key_value: newKey,
          key_prefix: keyPrefix,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setApiKey(data);
      }
    } catch (error: any) {
      console.error('Error generating API key:', error);
      alert(error.message || 'Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  const regenerateApiKey = async () => {
    if (!apiKey || !user) return;

    const confirmed = confirm(
      'Are you sure you want to regenerate your API key? Your current key will be revoked and cannot be recovered.'
    );

    if (!confirmed) return;

    setGenerating(true);
    try {
      // Revoke old key
      await supabase
        .from('api_keys')
        .update({ status: 'revoked' })
        .eq('id', apiKey.id);

      // Generate new key
      await generateApiKey();
    } catch (error) {
      console.error('Error regenerating API key:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey.key_value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const usagePercentage = Math.min((usageStats.today / usageStats.limit) * 100, 100);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-[#FFD700] text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient-gold mb-2">Dashboard</h1>
          <p className="text-foreground/70">Manage your API keys and usage</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* User Info & Plan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-xl font-bold text-[#FFD700]">Current Plan</h3>
          </div>
          <p className="text-3xl font-bold text-foreground capitalize mb-2">
            {profile?.plan_type || 'Free'}
          </p>
          {profile?.plan_type === 'free' && (
            <Link
              href="/pricing"
              className="text-sm text-[#FFD700] hover:text-[#FF6B35] transition-colors"
            >
              Upgrade Plan →
            </Link>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
            <h3 className="text-xl font-bold text-[#FF6B35]">Requests Today</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            {usageStats.today.toLocaleString()}
          </p>
          <p className="text-sm text-foreground/70">
            of {usageStats.limit === Infinity ? '∞' : usageStats.limit.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="card-3d rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-[#FFD700]" />
            <h3 className="text-xl font-bold text-[#FFD700]">This Month</h3>
          </div>
          <p className="text-3xl font-bold text-foreground mb-2">
            {usageStats.thisMonth.toLocaleString()}
          </p>
          <p className="text-sm text-foreground/70">Total requests</p>
        </motion.div>
      </div>

      {/* Usage Progress Bar */}
      {usageStats.limit !== Infinity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="card-3d rounded-xl p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-bold text-gradient-gold">Daily Usage</h3>
            <span className="text-sm text-foreground/70">
              {usagePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${
                usagePercentage >= 90 ? 'bg-red-500' : usagePercentage >= 70 ? 'bg-orange-500' : 'bg-gradient-to-r from-[#FFD700] to-[#FF6B35]'
              }`}
            />
          </div>
          {usagePercentage >= 90 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-orange-400">
              <AlertCircle className="w-4 h-4" />
              <span>You're approaching your daily limit. Consider upgrading your plan.</span>
            </div>
          )}
        </motion.div>
      )}

      {/* API Key Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="card-3d rounded-xl p-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-8 h-8 text-[#FFD700]" />
            <h2 className="text-2xl font-bold text-gradient-gold">API Key</h2>
          </div>
          {apiKey && (
            <button
              onClick={regenerateApiKey}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          )}
        </div>

        {apiKey ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground/70 mb-2">
                Your API Key
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-black/50 border border-[#FFD700]/30 rounded-lg p-4 font-mono text-sm overflow-hidden">
                  {showFullKey ? apiKey.key_value : `${apiKey.key_prefix}${'•'.repeat(28)}`}
                </div>
                <button
                  onClick={() => setShowFullKey(!showFullKey)}
                  className="px-4 py-3 rounded-lg bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 transition-colors"
                  title={showFullKey ? 'Hide key' : 'Show key'}
                >
                  {showFullKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                  onClick={copyApiKey}
                  className="px-4 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all text-[#0A0A0A]"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-foreground/50 mt-2">
                Keep your API key secure and never share it publicly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#FFD700]/20">
              <div>
                <p className="text-sm text-foreground/70">Created</p>
                <p className="text-foreground font-semibold">{formatDate(apiKey.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-foreground/70">Last Used</p>
                <p className="text-foreground font-semibold">
                  {apiKey.last_used ? formatDate(apiKey.last_used) : 'Never'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-foreground/70 mb-6">
              You don't have an API key yet. Generate one to start using the BTCindexer API.
            </p>
            <button
              onClick={generateApiKey}
              disabled={generating}
              className="px-8 py-3 rounded-lg gradient-gold-orange hover:glow-gold transition-all duration-300 font-semibold text-[#0A0A0A] disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate API Key'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
      >
        <Link
          href="/docs"
          className="card-3d rounded-xl p-6 hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-bold text-gradient-gold mb-2">API Documentation</h3>
          <p className="text-foreground/70">
            Learn how to integrate BTCindexer API into your application
          </p>
        </Link>

        <Link
          href="/pricing"
          className="card-3d rounded-xl p-6 hover:scale-105 transition-transform"
        >
          <h3 className="text-xl font-bold text-gradient-gold mb-2">Upgrade Plan</h3>
          <p className="text-foreground/70">
            Get more requests and advanced features with Premium or Enterprise
          </p>
        </Link>
      </motion.div>
    </div>
  );
}
