import React from 'react';
import { PalaceData, Star, Brightness } from '../types';
import { PALACE_ICONS } from '../constants';

interface HouseCardProps {
  data: PalaceData;
  isSelected: boolean;
  isSanFang: boolean;
  onClick: () => void;
}

const renderStarItem = (star: Star, idx: number) => (
  <div key={idx} className={`flex items-center text-xs leading-none mb-0.5 ${star.type === 'MAJOR' ? 'font-bold' : 'scale-90 origin-left'}`}>
    <span className={`${star.type === 'MAJOR' ? 'text-slate-800' : 'text-slate-500'}`}>
      {star.name}
    </span>
    {star.brightness && (
      <span className="ml-0.5 text-[0.6rem] text-slate-400 scale-75">{star.brightness}</span>
    )}
    {star.siHua && (
      <span 
        className="ml-1 text-[0.6rem] text-white px-0.5 rounded scale-90"
        style={{ backgroundColor: star.color || '#ef4444' }}
      >
        {star.siHua}
      </span>
    )}
  </div>
);

export const HouseCard: React.FC<HouseCardProps> = ({ data, isSelected, isSanFang, onClick }) => {
  // Get Icon based on palace name (simple lookup)
  const iconIdx = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '交友', '官禄', '田宅', '福德', '父母'].indexOf(data.name);
  const icon = PALACE_ICONS[iconIdx] || '';

  return (
    <div 
      onClick={onClick}
      className={`
        relative border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col h-full
        ${isSelected ? 'bg-primary/10 border-primary ring-2 ring-primary/50 z-10' : ''}
        ${isSanFang && !isSelected ? 'bg-yellow-50 border-yellow-300 ring-1 ring-yellow-200' : 'bg-white border-rose-100'}
        hover:shadow-md
      `}
      style={{ minHeight: '100px' }}
    >
      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-5 pointer-events-none grayscale">
        {icon}
      </div>

      {/* Header: Name + GanZhi */}
      <div className={`flex justify-between items-center px-1 py-0.5 text-xs border-b ${isSelected ? 'bg-primary text-white' : 'bg-rose-50 text-rose-800'}`}>
        <span className="font-bold">{data.heavenlyStem}{data.earthlyBranch}</span>
        <span>{data.name}</span>
      </div>

      {/* Stars Container */}
      <div className="flex-1 p-1 flex flex-row">
        {/* Major Stars Column */}
        <div className="flex-1 flex flex-col items-start pr-1 border-r border-dashed border-rose-100">
          {data.majorStars.map((s, i) => renderStarItem(s, i))}
        </div>
        
        {/* Minor Stars Column */}
        <div className="flex-1 flex flex-col items-end pl-1">
          {data.minorStars.map((s, i) => renderStarItem(s, i))}
        </div>
      </div>

      {/* Footer: Age Range */}
      <div className="text-[0.6rem] text-center text-slate-400 pb-0.5 font-mono">
        {data.ageRange}岁
      </div>
    </div>
  );
};