export const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

export const hasContent = (obj: any) => {
  if (!obj) return false;
  const desc = obj.description;
  if (!desc) return false;
  return Object.values(desc).some(
    (p: any) => p && (p as any).text && (p as any).text.trim().length > 0
  );
};

export const extractText = (obj: unknown): string => {
  if (!obj || typeof obj !== "object") return "";
  const rec = obj as Record<string, any>;
  if (rec.description) {
    return Object.values(rec.description)
      .map((v: any) => v?.text || "")
      .filter(Boolean)
      .join(" ");
  }
  return "";
};

export const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};
