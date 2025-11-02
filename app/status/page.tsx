'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, AlertCircle, XCircle, Activity, Database,
  Wifi, Server, Globe, Bell, Clock, TrendingUp, Calendar
} from 'lucide-react';
import Link from 'next/link';

type ServiceStatus = 'operational' | 'degraded' | 'outage';

interface Service {
  name: string;
  status: ServiceStatus;
  responseTime?: number;
  successRate?: number;
  icon: any;
  details?: string;
}

export default function StatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Update timestamp every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Service statuses
  const services: Service[] = [
    {
      name: 'API Endpoints',
      status: 'operational',
      responseTime: 145,
      successRate: 99.98,
      icon: Server,
      details: 'All API endpoints responding normally'
    },
    {
      name: 'Bitcoin Node',
      status: 'operational',
      icon: Activity,
      details: 'Synced to block 820,450 • 8 peer connections'
    },
    {
      name: 'Database',
      status: 'operational',
      responseTime: 23,
      icon: Database,
      details: 'Query performance optimal'
    },
    {
      name: 'Authentication Service',
      status: 'operational',
      successRate: 99.95,
      icon: Wifi,
      details: 'Wallet connections stable'
    },
    {
      name: 'Website',
      status: 'operational',
      responseTime: 312,
      icon: Globe,
      details: 'CDN delivering content globally'
    },
  ];

  const overallStatus: ServiceStatus = services.some(s => s.status === 'outage')
    ? 'outage'
    : services.some(s => s.status === 'degraded')
    ? 'degraded'
    : 'operational';

  // Uptime data (last 90 days)
  const uptimeData = Array.from({ length: 90 }, (_, i) => ({
    day: i,
    uptime: Math.random() > 0.01 ? 100 : Math.random() * 10 + 90,
  }));

  // Recent incidents
  const incidents = [
    {
      date: '2025-01-15',
      title: 'Database Performance Degradation',
      status: 'Resolved',
      duration: '45 minutes',
      severity: 'Minor',
    },
    {
      date: '2025-01-08',
      title: 'Scheduled Maintenance',
      status: 'Completed',
      duration: '2 hours',
      severity: 'Maintenance',
    },
    {
      date: '2024-12-20',
      title: 'API Rate Limiting Issue',
      status: 'Resolved',
      duration: '1.5 hours',
      severity: 'Moderate',
    },
  ];

  // Performance metrics
  const metrics = {
    uptime24h: 100,
    uptime7d: 99.98,
    uptime30d: 99.95,
    avgResponseTime: 234,
    requestsPerSecond: 1250,
    errorRate: 0.02,
  };

  const getStatusColor = (status: ServiceStatus) => {
    switch (status) {
      case 'operational':
        return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle };
      case 'degraded':
        return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: AlertCircle };
      case 'outage':
        return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle };
    }
  };

  const statusColors = getStatusColor(overallStatus);
  const StatusIcon = statusColors.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-foreground/70 mb-6">
        <Link href="/" className="hover:text-[#FFD700] transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">System Status</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-bold text-gradient-gold mb-2">System Status</h1>
        <p className="text-foreground/70">Real-time status and uptime monitoring</p>
      </motion.div>

      {/* Overall Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${statusColors.bg} border ${statusColors.border} rounded-2xl p-8 mb-8`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatusIcon className={`w-12 h-12 ${statusColors.text}`} />
            <div>
              <h2 className={`text-3xl font-bold ${statusColors.text}`}>
                {overallStatus === 'operational' && 'All Systems Operational'}
                {overallStatus === 'degraded' && 'Partial System Outage'}
                {overallStatus === 'outage' && 'Major Outage'}
              </h2>
              <p className="text-foreground/70 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <button className="px-6 py-3 rounded-lg bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] transition-colors flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Subscribe to Updates
          </button>
        </div>
      </motion.div>

      {/* Service Status Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {services.map((service, index) => {
          const serviceColors = getStatusColor(service.status);
          const ServiceIcon = service.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card-3d p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#FFD700]/10 flex items-center justify-center">
                    <ServiceIcon className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{service.name}</h3>
                    <span className={`text-xs ${serviceColors.text}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${serviceColors.bg} ${serviceColors.border} border-2`} />
              </div>

              <div className="space-y-2 text-sm">
                {service.responseTime && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Response Time</span>
                    <span className="font-semibold text-foreground">{service.responseTime}ms</span>
                  </div>
                )}
                {service.successRate && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Success Rate</span>
                    <span className="font-semibold text-green-400">{service.successRate}%</span>
                  </div>
                )}
                {service.details && (
                  <p className="text-foreground/50 text-xs mt-2">{service.details}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Uptime Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6">Uptime (Last 90 Days)</h2>

        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-foreground/70 mb-2">24 Hours</p>
            <p className="text-3xl font-bold text-green-400">{metrics.uptime24h}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/70 mb-2">7 Days</p>
            <p className="text-3xl font-bold text-green-400">{metrics.uptime7d}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/70 mb-2">30 Days</p>
            <p className="text-3xl font-bold text-green-400">{metrics.uptime30d}%</p>
          </div>
        </div>

        {/* Uptime Bar Chart */}
        <div className="flex items-end gap-1 h-20">
          {uptimeData.map((day, index) => (
            <div
              key={index}
              className="flex-1 rounded-t transition-all hover:opacity-80 cursor-pointer"
              style={{
                height: `${day.uptime}%`,
                backgroundColor: day.uptime === 100 ? '#4CAF50' : day.uptime > 99 ? '#FFD700' : '#FF6B35'
              }}
              title={`Day ${day.day + 1}: ${day.uptime.toFixed(2)}% uptime`}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-foreground/70">100% uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FFD700] rounded" />
            <span className="text-foreground/70">99-99.9% uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#FF6B35] rounded" />
            <span className="text-foreground/70">&lt;99% uptime</span>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Performance Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 glassmorphism rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-[#FFD700]" />
              <p className="text-sm text-foreground/70">Avg Response Time</p>
            </div>
            <p className="text-3xl font-bold text-[#FFD700]">{metrics.avgResponseTime}ms</p>
            <p className="text-sm text-green-400 mt-1">↓ 12% from last week</p>
          </div>

          <div className="p-6 glassmorphism rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-[#FF6B35]" />
              <p className="text-sm text-foreground/70">Requests/Second</p>
            </div>
            <p className="text-3xl font-bold text-[#FF6B35]">{metrics.requestsPerSecond.toLocaleString()}</p>
            <p className="text-sm text-green-400 mt-1">↑ 8% from yesterday</p>
          </div>

          <div className="p-6 glassmorphism rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="w-5 h-5 text-green-400" />
              <p className="text-sm text-foreground/70">Error Rate</p>
            </div>
            <p className="text-3xl font-bold text-green-400">{metrics.errorRate}%</p>
            <p className="text-sm text-foreground/50 mt-1">Well within target</p>
          </div>
        </div>
      </motion.div>

      {/* Recent Incidents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card-3d p-8 mb-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6">Recent Incidents</h2>

        {incidents.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-foreground/70">No incidents in the last 30 days</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <div
                key={index}
                className="p-6 glassmorphism rounded-xl hover:border-[#FFD700]/40 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{incident.title}</h3>
                    <p className="text-sm text-foreground/60">{incident.date} • {incident.duration}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                    {incident.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    incident.severity === 'Minor' ? 'bg-yellow-500/20 text-yellow-400' :
                    incident.severity === 'Moderate' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {incident.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Scheduled Maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card-3d p-8"
      >
        <h2 className="text-2xl font-bold text-gradient-gold mb-6">Scheduled Maintenance</h2>

        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <p className="text-foreground/70">No scheduled maintenance at this time</p>
          <p className="text-sm text-foreground/50 mt-2">
            We'll notify you at least 48 hours before any planned maintenance
          </p>
        </div>
      </motion.div>
    </div>
  );
}
