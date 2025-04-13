// src/hooks/useSupabase.js - Updated version
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabase = (tableName, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from(tableName)
          .select('*');
        
        // Apply filters if provided
        if (options.filters) {
          options.filters.forEach(filter => {
            query = query.filter(filter.column, filter.operator, filter.value);
          });
        }
        
        // Apply order if provided
        if (options.orderBy) {
          query = query.order(options.orderBy.column, { 
            ascending: options.orderBy.ascending 
          });
        }
        
        // Apply limit if provided
        if (options.limit) {
          query = query.limit(options.limit);
        }
        
        const { data: result, error } = await query;
        
        if (error) throw error;
        
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`${tableName}-changes`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName
      }, (payload) => {
        console.log('Real-time update received:', payload);
        
        // Handle different events
        if (payload.eventType === 'INSERT') {
          setData(current => {
            // For ordered lists, ensure we maintain the order
            let newData = [payload.new, ...current];
            
            if (options.orderBy) {
              const { column, ascending } = options.orderBy;
              newData = newData.sort((a, b) => {
                if (ascending) {
                  return a[column] > b[column] ? 1 : -1;
                } else {
                  return a[column] < b[column] ? 1 : -1;
                }
              });
            }
            
            // Respect the limit if provided
            if (options.limit && newData.length > options.limit) {
              newData = newData.slice(0, options.limit);
            }
            
            return newData;
          });
        } else if (payload.eventType === 'UPDATE') {
          setData(current => 
            current.map(item => item.id === payload.new.id ? payload.new : item)
          );
        } else if (payload.eventType === 'DELETE') {
          setData(current => 
            current.filter(item => item.id !== payload.old.id)
          );
        }
      })
      .subscribe();
    
    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, JSON.stringify(options)]);
  
  return { data, loading, error };
};