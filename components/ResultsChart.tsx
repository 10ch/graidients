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
  }, []);

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
        <div className="flex-1 flex items-end p-4">
          <div className="w-full">
            <div className="flex justify-between items-end h-64">
              {VOTE_OPTIONS.map((option, index) => {
                const count = ratings[index];
                const percentage = calculatePercentage(count, totalVotes);
                const maxCount = Math.max(...ratings);
                const heightPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={option.value} className="w-[15%] flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">{percentage}%</div>
                    <div 
                      className="w-full bg-blue-300 rounded-t transition-all duration-500 ease-out"
                      style={{
                        height: animateResults ? `${heightPercentage}%` : "0%",
                        transitionDelay: `${index * 100}ms`,
                      }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{count} votes</div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-600">
              {VOTE_OPTIONS.map((option) => (
                <div key={option.value} className="w-[15%] text-center">
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