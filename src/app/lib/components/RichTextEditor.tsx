"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, Strikethrough } from "lucide-react";

interface RichTextProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichText({ onChange, content }: RichTextProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none focus:ring-0 p-4 border border-blue-200 rounded-sm",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <div className="w-full space-y-2">
      {/* Toolbar */}
      <div className="flex gap-2 rounded border bg-gray-50 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded p-1 ${
            editor.isActive("bold")
              ? "bg-slate-600 text-white"
              : "border bg-white"
          }`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded p-1 ${
            editor.isActive("italic")
              ? "bg-slate-600 text-white"
              : "border bg-white"
          }`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded p-1 ${
            editor.isActive("strike")
              ? "bg-slate-600 text-white"
              : "border bg-white"
          }`}
        >
          <Strikethrough size={16} />
        </button>
        {/* <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`rounded p-1 ${
            editor.isActive("paragraph")
              ? "bg-slate-600 text-white"
              : "border bg-white"
          }`}
        >
          <Pilcrow size={16} />
        </button> */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded p-1 ${
            editor.isActive("bulletList")
              ? "bg-slate-600 text-white"
              : "border bg-white"
          }`}
        >
          <List size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="prose max-w-none rounded border">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
