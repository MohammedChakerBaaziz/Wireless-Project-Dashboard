import React from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { formatTimestamp } from '../lib/utils';

const RecentAttacks = () => {
  const { data: attacks, loading } = useSupabase('network_flows', {
    orderBy: { column: 'timestamp', ascending: false },
    limit: 5
  });
  
  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Loading recent attacks...</div>;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Recent Attacks</h3>
      {attacks.length === 0 ? (
        <p>No recent attacks detected</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">State</th>
              </tr>
            </thead>
            <tbody>
              {attacks.map(attack => (
                <tr key={attack.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{formatTimestamp(attack.timestamp)}</td>
                  <td className="px-4 py-2">
                    <span 
                      className="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: attack.attack_type === 'C&C' ? '#ffeeee' : '#fff0dd', 
                              color: attack.attack_type === 'C&C' ? '#ff4d4f' : '#ffaa00' }}
                    >
                      {attack.attack_type || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{attack.connection_state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentAttacks;