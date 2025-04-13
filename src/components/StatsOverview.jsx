import React, { useMemo } from 'react';
import StatCard from './StatCard';
import { useSupabase } from '../hooks/useSupabase';

const StatsOverview = () => {
  const { data: attacks, loading } = useSupabase('network_flows');
  
  const stats = useMemo(() => {
    if (loading || !attacks.length) {
      return {
        totalAttacks: 0,
        uniqueAttackTypes: 0,
        lastDetection: 'N/A',
        activeConnections: 0
      };
    }
    
    const uniqueTypes = new Set(attacks.map(attack => attack.attack_type)).size;
    const lastDetection = new Date(Math.max(...attacks.map(a => new Date(a.detection_timestamp)))).toLocaleString();
    
    // Assuming active connections are those in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeConnections = attacks.filter(a => new Date(a.detection_timestamp) > fiveMinutesAgo).length;
    
    return {
      totalAttacks: attacks.length,
      uniqueAttackTypes: uniqueTypes,
      lastDetection,
      activeConnections
    };
  }, [attacks, loading]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Attacks" 
        value={stats.totalAttacks} 
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
        color="red"
      />
      <StatCard 
        title="Attack Types" 
        value={stats.uniqueAttackTypes} 
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>}
        color="yellow"
      />
      <StatCard 
        title="Last Detection" 
        value={stats.lastDetection} 
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        color="blue"
      />
      <StatCard 
        title="Active Connections" 
        value={stats.activeConnections} 
        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
        color="green"
      />
    </div>
  );
};

export default StatsOverview;