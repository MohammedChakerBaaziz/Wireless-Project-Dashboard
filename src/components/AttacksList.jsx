// src/components/AttacksList.jsx
import React, { useState } from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { formatTimestamp, formatBytes } from '../lib/utils';

const AttacksList = () => {
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [sort, setSort] = useState({ column: 'timestamp', ascending: false });
  const [filters, setFilters] = useState({
    attackType: '',
    connectionState: ''
  });
  
  const { data: attacks, loading } = useSupabase('network_flows', {
    orderBy: sort,
    filters: [
      ...(filters.attackType ? [{ column: 'attack_type', operator: 'eq', value: filters.attackType }] : []),
      ...(filters.connectionState ? [{ column: 'connection_state', operator: 'eq', value: filters.connectionState }] : [])
    ]
  });
  
  const paginatedAttacks = attacks.slice(page * pageSize, (page + 1) * pageSize);
  const pageCount = Math.ceil(attacks.length / pageSize);
  
  const handleSort = (column) => {
    if (sort.column === column) {
      setSort({ column, ascending: !sort.ascending });
    } else {
      setSort({ column, ascending: true });
    }
  };
  
  const renderSortArrow = (column) => {
    if (sort.column !== column) return null;
    return sort.ascending ? ' ↑' : ' ↓';
  };
  
  // Extract unique attack types and connection states for filters
  const attackTypes = [...new Set(attacks.map(a => a.attack_type).filter(Boolean))];
  const connectionStates = [...new Set(attacks.map(a => a.connection_state).filter(Boolean))];
  
  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Loading attacks data...</div>;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">All Attacks</h2>
      
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Attack Type</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={filters.attackType}
            onChange={(e) => setFilters({ ...filters, attackType: e.target.value })}
          >
            <option value="">All Types</option>
            {attackTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Connection State</label>
          <select
            className="border rounded px-3 py-2 w-full"
            value={filters.connectionState}
            onChange={(e) => setFilters({ ...filters, connectionState: e.target.value })}
          >
            <option value="">All States</option>
            {connectionStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('timestamp')}>
                Time{renderSortArrow('timestamp')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('attack_type')}>
                Type{renderSortArrow('attack_type')}
              </th>
              <th className="px-4 py-2 text-left">Source IP:Port</th>
              <th className="px-4 py-2 text-left">Destination IP:Port</th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('connection_state')}>
                State{renderSortArrow('connection_state')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('connection_duration')}>
                Duration{renderSortArrow('connection_duration')}
              </th>
              <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('bytes_sent_by_origin')}>
                Bytes Sent{renderSortArrow('bytes_sent_by_origin')}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAttacks.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-2 text-center">No attacks found</td>
              </tr>
            ) : (
              paginatedAttacks.map(attack => {
                // Extract source and destination from raw log
                const rawLog = attack.raw_log_entry || '';
                const parts = rawLog.split('\t');
                const sourceIp = parts.length > 2 ? parts[2] : '-';
                const sourcePort = attack.origin_port;
                const destIp = parts.length > 3 ? parts[3] : '-';
                const destPort = attack.destination_port;
                
                return (
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
                    <td className="px-4 py-2">{sourceIp}:{sourcePort}</td>
                    <td className="px-4 py-2">{destIp}:{destPort}</td>
                    <td className="px-4 py-2">{attack.connection_state}</td>
                    <td className="px-4 py-2">{attack.connection_duration?.toFixed(6) || '0'} s</td>
                    <td className="px-4 py-2">{formatBytes(attack.bytes_sent_by_origin || 0)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {pageCount}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
            disabled={page === pageCount - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AttacksList;