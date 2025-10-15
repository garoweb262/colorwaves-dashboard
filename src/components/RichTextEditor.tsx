"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/amal-ui";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Link, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Enter your content here...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const toolbarButtons = [
    {
      icon: <Bold className="h-4 w-4" />,
      command: "bold",
      title: "Bold"
    },
    {
      icon: <Italic className="h-4 w-4" />,
      command: "italic",
      title: "Italic"
    },
    {
      icon: <Underline className="h-4 w-4" />,
      command: "underline",
      title: "Underline"
    },
    {
      icon: <List className="h-4 w-4" />,
      command: "insertUnorderedList",
      title: "Bullet List"
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      command: "insertOrderedList",
      title: "Numbered List"
    },
    {
      icon: <Quote className="h-4 w-4" />,
      command: "formatBlock",
      value: "blockquote",
      title: "Quote"
    },
    {
      icon: <AlignLeft className="h-4 w-4" />,
      command: "justifyLeft",
      title: "Align Left"
    },
    {
      icon: <AlignCenter className="h-4 w-4" />,
      command: "justifyCenter",
      title: "Align Center"
    },
    {
      icon: <AlignRight className="h-4 w-4" />,
      command: "justifyRight",
      title: "Align Right"
    },
    {
      icon: <AlignJustify className="h-4 w-4" />,
      command: "justifyFull",
      title: "Justify"
    }
  ];

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => execCommand(button.command, button.value)}
            title={button.title}
            className="h-8 w-8 p-0 hover:bg-gray-200"
          >
            {button.icon}
          </Button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertLink}
          title="Insert Link"
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <Link className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={insertImage}
          title="Insert Image"
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[200px] p-4 focus:outline-none ${
          isFocused ? "ring-2 ring-palette-violet ring-opacity-50" : ""
        }`}
        style={{
          minHeight: "200px",
          outline: "none"
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        
        [contenteditable] h1 {
          font-size: 1.875rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.5rem 0;
        }
        
        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        [contenteditable] blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 0.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
