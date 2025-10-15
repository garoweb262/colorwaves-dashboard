"use client";

import React, { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function TestRichTextEditor() {
  const [content, setContent] = useState("<h1>Test Newsletter</h1><p>This is a <strong>test</strong> newsletter content with <em>rich text</em> formatting.</p><ul><li>Item 1</li><li>Item 2</li></ul>");

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Rich Text Editor Test</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Newsletter Content
          </label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Enter your newsletter content here..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HTML Output
          </label>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
            {content}
          </pre>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div 
            className="border border-gray-200 rounded-md p-4 bg-white"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
}
