import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';

// Add Asset page (AddAssetPage.tsx) wala section look — same class names rakhe hain
// kyunki theme.css (~line 5652) inhi `border-l-4 border-l-[#DA7756]` selectors ko
// card style mein convert karta hai. Classes badli to look toot jayega.

interface FormSectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  /** Header ke right side (chevron se pehle) — e.g. Custom Field button */
  headerActions?: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export const FormSection = ({
  title,
  icon: Icon,
  children,
  headerActions,
  // Asset page ki tarah har section by default chevron se collapse hota hai
  collapsible = true,
  defaultExpanded = true,
}: FormSectionProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isOpen = !collapsible || expanded;

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div
        onClick={collapsible ? () => setExpanded((prev) => !prev) : undefined}
        className={`border-l-4 border-l-[#DA7756] p-4 sm:p-6 flex justify-between items-center bg-white ${collapsible ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center gap-2 text-[#DA7756] text-sm sm:text-base font-semibold">
          <span className="bg-[#DA7756] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm">
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
          </span>
          {title}
        </div>
        {(headerActions || collapsible) && (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {headerActions}
            {collapsible && (
              <button type="button" onClick={() => setExpanded((prev) => !prev)} aria-label={isOpen ? 'Collapse section' : 'Expand section'}>
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            )}
          </div>
        )}
      </div>
      {isOpen && <div className="p-4 sm:p-6 pt-0 sm:pt-0">{children}</div>}
    </div>
  );
};

// Add Asset page ka MUI field size — har form isi ko use kare, apna naya mat banao
export const assetFieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface FormActionBarProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  /** true ho to submit button type="submit" banega (form ke andar use ke liye) */
  submitAsFormSubmit?: boolean;
}

// Add Asset footer — theme.css (~line 7214) ki fm-action-* classes
export const FormActionBar = ({
  onCancel,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  submitAsFormSubmit = false,
}: FormActionBarProps) => (
  <div className="fm-action-bar pt-4 sm:pt-6">
    <button type="button" onClick={onCancel} className="fm-action-secondary" disabled={isSubmitting}>
      {cancelLabel}
    </button>
    <button
      type={submitAsFormSubmit ? 'submit' : 'button'}
      onClick={submitAsFormSubmit ? undefined : onSubmit}
      className="fm-action-primary"
      disabled={isSubmitting}
    >
      {isSubmitting ? 'Saving...' : submitLabel}
    </button>
  </div>
);
