import React from 'react';
import questionsData from '../../data/questions.json';
import { AlertCircle, CheckCircle, TrendingUp, AlertTriangle } from 'lucide-react';

const ScoreInterpretationCard = () => {
  const interpretations = questionsData.Scales.GeneralInterpretation;

  const getIcon = (range: string) => {
    const rangeStart = parseFloat(range.split(' - ')[0]);
    if (rangeStart >= 4.6) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (rangeStart >= 3.6) return <TrendingUp className="h-6 w-6 text-blue-600" />;
    if (rangeStart >= 2.6) return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <AlertCircle className="h-6 w-6 text-red-600" />;
  };

  const getColorClass = (range: string) => {
    const rangeStart = parseFloat(range.split(' - ')[0]);
    if (rangeStart >= 4.6) return 'border-green-200 bg-green-50';
    if (rangeStart >= 3.6) return 'border-blue-200 bg-blue-50';
    if (rangeStart >= 2.6) return 'border-yellow-200 bg-yellow-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Interpretation Guide</h3>
      <div className="space-y-3">
        {interpretations.map((item, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-4 rounded-lg border-2 ${getColorClass(item.range)}`}
          >
            <div className="flex-shrink-0 mt-1">
              {getIcon(item.range)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-900">Range: {item.range}</span>
              </div>
              <p className="text-sm text-gray-700">{item.interpretation}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScoreInterpretationCard;

