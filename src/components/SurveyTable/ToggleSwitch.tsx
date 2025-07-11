
import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  size?: 'small' | 'medium';
}

export const ToggleSwitch = ({ isOn, onToggle, size = 'medium' }: ToggleSwitchProps) => {
  const sizeClasses = size === 'small' 
    ? 'h-5 w-9' 
    : 'h-6 w-11';
  
  const toggleSizeClasses = size === 'small' 
    ? 'w-3 h-3 translate-x-5 translate-x-1' 
    : 'w-4 h-4 translate-x-6 translate-x-1';

  return (
    <div 
      className={`relative inline-flex items-center ${sizeClasses} rounded-full cursor-pointer transition-colors ${
        isOn ? 'bg-green-400' : 'bg-gray-300'
      }`} 
      onClick={onToggle}
    >
      <span 
        className={`inline-block transform bg-white rounded-full transition-transform ${
          isOn ? toggleSizeClasses.split(' ')[2] : toggleSizeClasses.split(' ')[3]
        } ${toggleSizeClasses.split(' ')[0]} ${toggleSizeClasses.split(' ')[1]}`} 
      />
    </div>
  );
};
