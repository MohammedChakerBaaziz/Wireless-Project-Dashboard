import React from 'react';
import Header from './Header';
import StatsOverview from './StatsOverview';
import AttackTypeChart from './charts/AttackTypeChart';
import ConnectionStateChart from './charts/ConnectionStateChart';
import TimelineChart from './charts/TimelineChart';
import RecentAttacks from './RecentAttacks';
import AttacksList from './AttacksList';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <StatsOverview />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AttackTypeChart />
          <ConnectionStateChart />
          <TimelineChart />
        </div>
        
        <div className="mb-8">
          <RecentAttacks />
        </div>
        
        <div>
          <AttacksList />
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Network Security Monitoring Dashboard &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Dashboard;