"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const faqItems: FAQItem[] = [
  // General Questions
  {
    question: "What is Align on the Line?",
    answer:
      "Align on the Line is an interactive real-time polling app designed to help you visualize where a group draws the line with using AI. It allows you to pose AI use cases and poll a group of people on how they feel about that use in a simple voting interface.",
    category: "general",
  },
  {
    question: "Is the app free to use?",
    answer: "Yes, the app is completely free.",
    category: "general",
  },
  {
    question: "What do I do?",
    answer:
      "Think of a specific task or scenario or assignment and come up with a handful of potential ways to use AI for it. Then, go to the home page and click the 'Start a Session' button. Enter each way to use AI, one at a time, and vote on it as a group.",
    category: "presenter",
  },
  {
    question: "How do I format a question?",
    answer:
      "The system will automatically format it as 'How do you feel about using AI to [your use case]?'",
    category: "presenter",
  },
  {
    question: "How do I share the voting link with my audience?",
    answer:
      "Each question automatically generates a QR code that appears on the presenter screen. Audience members can scan this code with their phones to access the voting page directly. There is also a url under the QR code if you are using computers instead of phones.",
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
      "Yes and no. Only one question can be active at a time. But, there is a New Question button on the page with the results that allows you to add an additional use to your poll.",
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
    answer: "Click View Summary to see all questions and results from your session.",
    category: "presenter",
  },
  {
    question: "Is there a limit on audience size?",
    answer: "The app works best for audiences from ~5 to ~500 people.",
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
      "Yes, votes are anonymous. We don't collect any personal information. To prevent duplicates, your browser generates a random ID (stored locally on your device) so you can only vote once per question. The ID doesn't identify anything about you or your device, and it doesn't follow you across other websites.",
    category: "audience",
  },
  {
    question: "What if I can't scan the QR code?",
    answer:
      "If QR scanning isn't working, you can type the url under the QR code to access the question.",
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
        Everything you need to know about using Align on the Line
      </p>

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
            href="mailto:beck_tench@harvard.edu"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            beck_tench@harvard.edu
          </a>
          .
        </p>
      </div>
    </div>
  );
}
