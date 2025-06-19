"use client";

import { useEffect, useState } from "react";
import { VoteSummary } from "@/lib/types";
import { calculatePercentage } from "@/lib/utils";
import { VOTE_OPTIONS } from "@/lib/types";

interface ResultsChartProps {
  results: VoteSummary | null;
  onNewQuestion?: () => void;
  onViewSummary?: () => void;
  isLive?: boolean;
}

export function ResultsChart({ results, onNewQuestion, onViewSummary, isLive = false }: ResultsChartProps) {
  const [animateResults, setAnimateResults] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimateResults(true), 100);
    return () => clearTimeout(timer);
  }, [results]); // Re-trigger when results change

  const ratings = results ? [
    results.rating_1,
    results.rating_2,
    results.rating_3,
    results.rating_4,
    results.rating_5,
  ] : [0, 0, 0, 0, 0];
  
  const totalVotes = results?.total_votes || 0;

  if (!results && isLive) {
    // Show empty state for live view
    return (
      <div className="h-full flex items-end p-4">
        <div className="w-full">
          <div className="flex justify-between items-end h-64">
            {VOTE_OPTIONS.map((option, index) => (
              <div key={option.value} className="w-[15%] flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-t transition-all duration-500" style={{ height: "4px" }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-600">
            {VOTE_OPTIONS.map((option) => (
              <div key={option.value} className="w-[15%] text-center">
                <div>{option.label.split(' ')[0]}</div>
                <div>{option.label.split(' ')[1]}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 text-gray-500">
            Total Votes: 0
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!isLive && results && (
        <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800">
          {results.question_text}
        </h2>
      )}

      <div className="h-full flex flex-col">
        <div className="flex-1 p-6">
          {/* Chart container with fixed height */}
          <div className="h-full flex flex-col">
            {/* Stats above bars */}
            <div className="flex justify-between mb-4">
              {VOTE_OPTIONS.map((option, index) => {
                const count = ratings[index];
                const percentage = calculatePercentage(count, totalVotes);
                
                return (
                  <div key={option.value} className="w-[15%] text-center">
                    <div className="text-lg font-medium">{percentage}%</div>
                    <div className="text-xs text-gray-500">{count} votes</div>
                  </div>
                );
              })}
            </div>
            
            {/* Chart bars */}
            <div className="flex-1 flex items-end mb-4" style={{ height: "300px" }}>
              <div className="w-full flex justify-between items-end h-full gap-4 px-4">
                {VOTE_OPTIONS.map((option, index) => {
                  const count = ratings[index];
                  const maxCount = Math.max(...ratings);
                  const heightPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  
                  // Debug logging
                  if (index === 0) {
                    console.log('Chart data:', { count, maxCount, heightPercentage, animateResults });
                  }
                  
                  return (
                    <div 
                      key={option.value} 
                      className="flex-1 bg-gray-900 rounded-t transition-all duration-700 ease-out"
                      style={{
                        height: animateResults && count > 0 ? `${heightPercentage}%` : "4px",
                        transitionDelay: `${index * 100}ms`,
                        minHeight: count > 0 ? "12px" : "4px",
                      }}
                    />
                  );
                })}
              </div>
            </div>
            
            {/* Labels */}
            <div className="flex justify-between">
              {VOTE_OPTIONS.map((option) => (
                <div key={option.value} className="flex-1 text-center text-xs text-gray-600">
                  <div>{option.label.split(' ')[0]}</div>
                  <div>{option.label.split(' ')[1]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center py-4 border-t border-gray-200">
          <p className="text-lg font-medium">
            Total Votes: {totalVotes}
          </p>
        </div>
      </div>

      {!isLive && onNewQuestion && onViewSummary && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={onNewQuestion}
            className="btn-secondary"
          >
            New Question
          </button>
          
          <button
            onClick={onViewSummary}
            className="btn-secondary"
          >
            View Summary
          </button>
        </div>
      )}
    </div>
  );
}