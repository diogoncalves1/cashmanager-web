"use client";

import { useEffect } from "react";
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
    content: "", // ⚠️ deixa vazio aqui
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

  // 🔥 SINCRONIZAÇÃO DO CONTEÚDO
  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();
    if (content && content !== current) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 border-b p-2 flex gap-1 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded ${active ? "bg-gray-200" : "hover:bg-gray-200"}`}
    >
      {children}
    </button>
  );
}
