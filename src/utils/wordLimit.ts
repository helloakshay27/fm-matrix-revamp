// Word limit for the ticket Root Cause / Corrective Action / Preventive Action free-text fields
// (org 63 closed/complete flow) — shared by EditStatusDialog and TicketDetailsPage.
export const RCA_WORD_LIMIT = 500;

export const countWords = (text?: string | null) =>
  text && text.trim() ? text.trim().split(/\s+/).length : 0;

// Keeps the first `limit` words (and the spacing between them) when typing or pasting past the limit.
export const limitWords = (text: string, limit = RCA_WORD_LIMIT) => {
  if (countWords(text) <= limit) return text;
  const match = text.match(new RegExp(`^\\s*(?:\\S+\\s+){${limit - 1}}\\S+`));
  return match ? match[0] : text;
};
