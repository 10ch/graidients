"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface FAQItem {
  question: string;
  answer: string;
  category: "presenter" | "audience" | "general";
}

const faqItems: FAQItem[] = [
  // General Questions
  {
    question: "What is Align on the Line AI Ethics Polling?",
    answer:
      "Align on the Line is an interactive real-time polling app designed for AI ethics presentations. It allows presenters to pose ethical dilemmas about AI use cases and collect audience feedback through a simple voting interface.",
    category: "general",
  },
  {
    question: "How does the voting scale work?",
    answer:
      "We use a 5-point scale: 1) Totally Fine - No ethical concerns, 2) Mostly Okay - Minor concerns, 3) Not Sure - Neutral/undecided, 4) Feels Sketchy - Significant concerns, 5) Crosses Line - Major ethical issues. This helps capture nuanced opinions about AI ethics.",
    category: "general",
  },
  {
    question: "Is the app free to use?",
    answer: "Yes, the app is completely free for both presenters and audience members.",
    category: "general",
  },
  {
    question: "What browsers are supported?",
    answer:
      "The app works on all modern browsers including Chrome, Firefox, Safari, and Edge. Mobile browsers are fully supported for voting.",
    category: "general",
  },

  // Presenter Questions
  {
    question: "How do I start a new polling session?",
    answer:
      "Go to the presenter page (/presenter) and click 'Start New Session'. You'll receive a unique session ID that you can share with your audience.",
    category: "presenter",
  },
  {
    question: "How do I create a new question?",
    answer:
      "In the presenter panel, type your AI use case in the input field (e.g., 'screen job applicants') and click 'Add Question'. The system will automatically format it as 'How do you feel about using AI to [your use case]?'",
    category: "presenter",
  },
  {
    question: "How do I share the voting link with my audience?",
    answer:
      "Each question automatically generates a QR code that appears on the presenter screen. Audience members can scan this code with their phones to access the voting page directly. The QR code includes your logo for easy recognition.",
    category: "presenter",
  },
  {
    question: "Can I see voting results in real-time?",
    answer:
      "Yes! Results update automatically as votes come in. The bar chart shows the distribution of responses across all 5 rating options with both counts and percentages.",
    category: "presenter",
  },
  {
    question: "Can I have multiple questions active at once?",
    answer:
      "No, only one question can be active at a time. When you activate a new question, the previous one automatically closes for voting. This helps maintain focus and prevents confusion.",
    category: "presenter",
  },
  {
    question: "Can I edit questions after creating them?",
    answer:
      "No, questions cannot be edited after creation to maintain voting integrity. If you need to change a question, create a new one instead.",
    category: "presenter",
  },
  {
    question: "How do I view session summaries?",
    answer:
      "Visit /summary/session/[your-session-id] to see all questions and results from a specific session, or /summary/overall for aggregate results across all sessions.",
    category: "presenter",
  },
  {
    question: "Is there a limit on audience size?",
    answer:
      "The app is optimized for audiences up to 500 people. For events expecting more than 200 attendees, contact us to ensure optimal performance.",
    category: "presenter",
  },

  // Audience Questions
  {
    question: "How do I vote on a question?",
    answer:
      "Scan the QR code displayed by the presenter using your phone's camera. This will open the voting page where you can select your response on the 5-point scale.",
    category: "audience",
  },
  {
    question: "Do I need to create an account to vote?",
    answer: "No, voting is completely anonymous. No account or personal information is required.",
    category: "audience",
  },
  {
    question: "Can I change my vote after submitting?",
    answer: "No, votes are final once submitted. This ensures the integrity of the results.",
    category: "audience",
  },
  {
    question: "Can I vote multiple times on the same question?",
    answer:
      "No, the system uses device fingerprinting to prevent duplicate votes. You can only vote once per question per device.",
    category: "audience",
  },
  {
    question: "Will I see the results after voting?",
    answer:
      "After voting, you'll see a confirmation message with your selected response. The presenter controls when and how to share the full results with the audience.",
    category: "audience",
  },
  {
    question: "Is my vote anonymous?",
    answer:
      "Yes, votes are completely anonymous. We don't collect any personal information, only your rating choice and a device fingerprint to prevent duplicates.",
    category: "audience",
  },
  {
    question: "What if I can't scan the QR code?",
    answer:
      "If QR scanning isn't working, you can ask the presenter for the direct voting URL. It follows the format: app.graidients.ai/vote/[question-id]",
    category: "audience",
  },
  {
    question: "Can I vote on past questions?",
    answer:
      "No, you can only vote on questions that are currently active. Once the presenter moves to a new question, voting closes on the previous one.",
    category: "audience",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState<
    "all" | "presenter" | "audience" | "general"
  >("all");

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredItems =
    activeCategory === "all"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-600 mb-8">
        Everything you need to know about using Align on the Line AI Ethics Polling
      </p>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All Questions
        </button>
        <button
          onClick={() => setActiveCategory("presenter")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeCategory === "presenter"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          For Presenters
        </button>
        <button
          onClick={() => setActiveCategory("audience")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeCategory === "audience"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          For Audience
        </button>
        <button
          onClick={() => setActiveCategory("general")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeCategory === "general"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          General
        </button>
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredItems.map((item, _index) => {
          const globalIndex = faqItems.indexOf(item);
          const isOpen = openItems.has(globalIndex);

          return (
            <div key={globalIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleItem(globalIndex)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {isOpen ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-gray-700">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Section */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
        <p className="text-gray-700">
          If you couldn&apos;t find what you&apos;re looking for, please report an issue at{" "}
          <a
            href="https://github.com/anthropics/claude-code/issues"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            our GitHub repository
          </a>
          .
        </p>
      </div>
    </div>
  );
}
