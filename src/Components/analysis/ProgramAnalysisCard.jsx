// Components/analysis/ProgramAnalysisCard.jsx
import React from 'react';

const ProgramAnalysisCard = ({ programData, averageScore }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return 'emerald';
    if (score >= 50) return 'yellow';
    return 'red';
  };

  return (
    <div className="relative overflow-hidden rounded-lg w-64 h-80">
      <img 
        src={programData.Picture} 
        alt={programData.Name || 'Program image'} 
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/img/placeholder-image.jpg';
        }}
      />
      <div className={`absolute inset-0 bg-${getScoreColor(averageScore)}-500/70 flex flex-col justify-end p-6`}>
        <h3 className="text-white text-xl font-bold mb-4">
          {programData.Name || "Unnamed Program"}
        </h3>
        <div className="text-white text-5xl font-bold">
          {Math.round(averageScore)}
        </div>
      </div>
    </div>
  );
};

export default ProgramAnalysisCard;