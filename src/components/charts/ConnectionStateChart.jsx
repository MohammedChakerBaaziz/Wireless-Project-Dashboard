import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSupabase } from '../../hooks/useSupabase';
import { getConnectionStateLabel } from '../../lib/utils';

const ConnectionStateChart = () => {
  const { data: attacks, loading } = useSupabase('network_flows');
  
  const chartData = useMemo(() => {
    if (loading || !attacks.length) return [];
    
    const stateCounts = {};
    attacks.forEach(attack => {
      const state = attack.connection_state || 'Unknown';
      const label = getConnectionStateLabel(state);
      stateCounts[label] = (stateCounts[label] || 0) + 1;
    });
    
    return Object.entries(stateCounts).map(([state, count]) => ({
      name: state,
      count
    }));
  }, [attacks, loading]);
  
  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart data...</div>;
  
  if (!chartData.length) return <div className="h-64 flex items-center justify-center">No connection state data available</div>;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow h-64">
      <h3 className="text-lg font-medium mb-2">Connection States</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConnectionStateChart;