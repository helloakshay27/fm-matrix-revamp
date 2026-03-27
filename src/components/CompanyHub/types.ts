import { LucideIcon } from "lucide-react";

export interface Attachment {
  id: number;
  document_content_type: string;
  url: string;
}

export interface QuickLink {
  name: string;
  icon?: any;
  image: string;
  link?: string;
}

export interface Comment {
  id: number;
  body: string;
  commentable_id: number;
  commentable_type: string;
  commentor_id: number;
  active: boolean | null;
  created_at: string;
  updated_at: string;
  commentor_full_name: string;
  commentor_profile_image: string | null;
  commentor_site_name: string;
  attachments: any[];
}

export interface Post {
  id: number;
  title: string | null;
  body: string;
  active: boolean;
  blocked: boolean;
  resource_id: number;
  resource_type: string;
  created_at: string;
  updated_at: string;
  creator_full_name: string;
  creator_site_name: string;
  creator_image_url: string | null;
  resource_name: string;
  total_likes: number;
  likes_with_emoji: Record<string, number>;
  isliked: boolean;
  attachments: Attachment[];
  comments: Comment[];
  poll_options?: any[];
  type?: "post" | "event" | "notice" | "document";
}

export interface CompanyData {
  id: number;
  name: string;
  subdomain?: string;
  logo_url?: string | null;
  other_config?: {
    vision?: { description?: Record<string, { bold: string; text: string }> };
    mission?: { description?: Record<string, { bold: string; text: string }> };
    welcome?: { description?: Record<string, { bold: string; text: string }> };
    ceo_info?: {
      name: string;
      designation: string;
      description: string;
      photo_relation?: string;
      video_relation?: string;
    };
    employee_of_the_month?: {
      userId: string;
      userName: string;
      role: string;
      month: string;
      points: string[];
      profileImage?: string;
    };
  };
  ceo_photo?: { document_url: string };
  ceo_video?: { document_url: string };
  employee_photo?: { document_url: string };
}

export interface UpcomingEvent {
  id: number;
  title?: string;
  event_name?: string;
  image_url: string;
  event_date: string;
  location: string;
}

export interface TaskStats {
  task_count: number;
  todo_count: number;
  in_progress_tasks: number;
  overdue_tasks: number;
  on_hold_tasks: number;
  completed_tasks: number;
  open_tasks: number;
}

export interface LifeCompassStats {
  journaling_consistency: number;
  life_balance_score: number;
  current_streak: number;
  leaderboard_rank: number;
}
