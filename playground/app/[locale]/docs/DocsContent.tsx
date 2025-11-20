"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocsContentProps {
  docs: {
    [key: string]: {
      title: string;
      content: string;
    };
  };
}

export function DocsContent({ docs }: DocsContentProps) {
  const [selectedDoc, setSelectedDoc] = useState<string>(
    Object.keys(docs)[0]
  );

  return (
    <div className="flex h-screen bg-white pt-14">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Documentation
          </h2>
          <nav className="space-y-1">
            {Object.entries(docs).map(([key, doc]) => (
              <button
                key={key}
                onClick={() => setSelectedDoc(key)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDoc === key
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {doc.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <article className="prose prose-slate max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {docs[selectedDoc].content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
