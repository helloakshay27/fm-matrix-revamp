import React, { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const JodiEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useRef(null);

 const config = useMemo(
  () => ({
    readonly: false,
    placeholder: placeholder || "Enter here...",
    height: 300,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "ul",
      "ol",
      "|",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "eraser",
    ],
    toolbarAdaptive: false,

    // ← ADD THIS: removes dropdown, makes ul/ol single click
    controls: {
      ul: {
        list: undefined,
      },
      ol: {
        list: undefined,
      },
    },

    statusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    style: {
      font: "14px Arial, sans-serif",
      color: "#1f2937",
    },
    toolbarButtonSize: "middle" as const,
    theme: "default",
    removeButtons: ["source", "fullsize", "about", "print"],
    cleanHTML: {
      fillEmptyParagraph: false,
    },
  }),
  [placeholder]
);

  return (
    <div
      style={{
        "--jd-color-border": "#C72030",
        "--jd-color-panel": "#f9fafb",
      } as React.CSSProperties}
    >
      <style>{`
        .jodit-container:not(.jodit_fullsize) {
          border: 1px solid #d1d5db !important;
          border-radius: 6px !important;
          overflow: hidden;
        }
        .jodit-toolbar__box {
          background: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
        .jodit-toolbar-button__button:hover {
          background-color: rgba(199, 32, 48, 0.08) !important;
          color: #C72030 !important;
        }
        .jodit-toolbar-button_activated .jodit-toolbar-button__button {
          background-color: #C72030 !important;
          color: white !important;
        }
        .jodit-wysiwyg table,
        .jodit-wysiwyg td,
        .jodit-wysiwyg th {
          border: 1px solid #d1d5db !important;
          padding: 8px !important;
        }
        .jodit-wysiwyg th {
          background-color: #f3f4f6 !important;
          font-weight: 600 !important;
        }
      `}</style>

      <JoditEditor
        ref={editor}
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)}
      />
    </div>
  );
};

export default JodiEditor;