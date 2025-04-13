import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSupabase } from '../../hooks/useSupabase';

const TimelineChart = () => {
  const { data: attacks, loading } = useSupabase('network_flows', {
    orderBy: { column: 'timestamp', ascending: true }
  });
  
  const chartData = useMemo(() => {
    if (loading || !attacks.length) return [];
    
    // Group attacks by hour
    const hourlyData = {};
    attacks.forEach(attack => {
      const date = new Date(attack.timestamp);
      const hourKey = date.toISOString().slice(0, 13); // YYYY-MM-DDTHH
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = {
          time: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`,
          count: 0
        };
      }
      
      hourlyData[hourKey].count++;
    });
    
    // Convert to array and sort by time
    return Object.values(hourlyData).sort((a, b) => 
      new Date(a.time) - new Date(b.time)
    );
  }, [attacks, loading]);
  
  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart data...</div>;
  
  if (!chartData.length) return <div className="h-64 flex items-center justify-center">No timeline data available</div>;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow h-64">
      <h3 className="text-lg font-medium mb-2">Attack Timeline</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;