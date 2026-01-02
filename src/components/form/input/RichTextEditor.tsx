"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, Heading1 } from "lucide-react";

const extensions = [
  StarterKit.configure({
    bulletList: { HTMLAttributes: { class: "list-disc ml-5" } },
    orderedList: { HTMLAttributes: { class: "list-decimal ml-5" } },
  }),
];

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
}

export default function RichTextEditor({ content = "", onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions,
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar simples */}
      <div className="bg-gray-50 border-b p-2 flex gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded ${
            editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded ${
            editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded ${
            editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded ${
            editor.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-200"
          }`}
        >
          <ListOrdered size={18} />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
