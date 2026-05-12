"use client";

import { useState, useRef } from "react";
import { useAppStore } from "@/lib/store";

interface Props {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

export function EditableField({ value, onSave, className = "", multiline, placeholder }: Props) {
  const editMode = useAppStore((s) => s.editMode);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  if (!editMode) {
    return <span className={className}>{value || placeholder}</span>;
  }

  if (editing) {
    const props = {
      ref: inputRef,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: () => {
        setEditing(false);
        if (draft !== value) onSave(draft);
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !multiline) {
          (e.target as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          setDraft(value);
          setEditing(false);
        }
      },
      autoFocus: true,
      className: `${className} bg-white/10 border border-dashed border-garena-red outline-none rounded px-1`,
      placeholder,
    };
    return multiline ? <textarea {...props} rows={3} /> : <input {...props} />;
  }

  return (
    <span
      className={`${className} relative group cursor-pointer hover:outline-dashed hover:outline-1 hover:outline-garena-red/60 rounded px-1`}
      onClick={() => { setDraft(value); setEditing(true); }}
    >
      {value || <span className="opacity-40">{placeholder}</span>}
      <span className="absolute -top-1 -right-1 text-[10px] opacity-0 group-hover:opacity-100 bg-garena-red text-white rounded px-0.5">✏</span>
    </span>
  );
}
