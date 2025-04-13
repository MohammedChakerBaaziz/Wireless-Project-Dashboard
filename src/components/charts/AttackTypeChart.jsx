import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useSupabase } from '../../hooks/useSupabase';
import { getAttackTypeColor } from '../../lib/utils';

const AttackTypeChart = () => {
  const { data: attacks, loading } = useSupabase('network_flows');

  const chartData = useMemo(() => {
    if (loading || !attacks.length) return [];

    const attackCounts = {};
    attacks.forEach(attack => {
      const type = attack.attack_type || 'Unknown';
      attackCounts[type] = (attackCounts[type] || 0) + 1;
    });

    return Object.entries(attackCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));
  }, [attacks, loading]);

  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart data...</div>;

  if (!chartData.length) return <div className="h-64 flex items-center justify-center">No attack data available</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow h-64">
      <h3 className="text-lg font-medium mb-2">Attack Types Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getAttackTypeColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [`${value}`, `${name}`]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttackTypeChart;