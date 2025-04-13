import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center">
        <div className={`mr-4 bg-${color}-100 p-3 rounded-full`}>
          {icon}
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;