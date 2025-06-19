"use client";

import { VoteSummary } from "@/lib/types";
import { calculatePercentage } from "@/lib/utils";
import { VOTE_OPTIONS } from "@/lib/types";

interface SummaryGridProps {
  questions: VoteSummary[];
}

export function SummaryGrid({ questions }: SummaryGridProps) {
  // Display up to 8 questions in a 4x2 grid
  const displayQuestions = questions.slice(0, 8);
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {displayQuestions.map((question) => {
        const ratings = [
          question.rating_1,
          question.rating_2,
          question.rating_3,
          question.rating_4,
          question.rating_5,
        ];
        
        const maxCount = Math.max(...ratings);

        return (
          <div
            key={question.question_id}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h3 className="text-sm font-semibold mb-4 line-clamp-3 text-gray-800 min-h-[3rem]">
              {question.question_text}
            </h3>
            
            <div className="h-40 flex items-end">
              <div className="w-full flex justify-between items-end">
                {ratings.map((count, index) => {
                  const heightPercentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  
                  return (
                    <div
                      key={index}
                      className="w-[15%] bg-blue-300 rounded-t transition-all duration-500"
                      style={{ height: `${heightPercentage}%` }}
                    />
                  );
                })}
              </div>
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-xs text-gray-500">
                <span>TF</span>
                <span>MO</span>
                <span>EW</span>
                <span>FS</span>
                <span>CL</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}