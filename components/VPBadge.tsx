import React from 'react';

interface VPBadgeProps {
  vps: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function VPBadge({ 
  vps, 
  showLabel = true,
  size = 'md',
  className = ''
}: VPBadgeProps) {
  
  // Define size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };
  
  // Color based on point tiers
  const getBadgeColor = (points: number) => {
    if (points >= 10) return 'bg-amber-500 text-white';
    if (points >= 5) return 'bg-amber-400 text-amber-900';
    return 'bg-amber-300 text-amber-800';
  };
  
  const colorClass = getBadgeColor(vps);
  const sizeClass = sizeClasses[size];
  
  return (
    <div className={`flex items-center rounded-full font-medium ${colorClass} ${sizeClass} ${className}`}>
      {showLabel && <span className="mr-1">VPs</span>}
      <span>{vps}</span>
    </div>
  );
} 