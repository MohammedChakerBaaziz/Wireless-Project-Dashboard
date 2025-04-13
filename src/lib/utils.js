// src/lib/utils.js
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getAttackTypeColor = () => {
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  return randomColor;
};



export const getConnectionStateLabel = (state) => {
  const states = {
    '1': 'Connection Attempt',
    '12': 'Connection Reset',
    'REJ': 'Rejected',
    'RSTRH': 'Reset + Hold',
    'default': 'Unknown'
  };

  return states[state] || states.default;
};