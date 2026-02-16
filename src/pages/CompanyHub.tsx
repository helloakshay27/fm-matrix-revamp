import React, { useRef, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Laptop,
  FileText,
  ClipboardCheck,
  Book,
  Calendar,
  Bell,
  MoreVertical,
  Heart,
  MessageSquare,
  Share2,
  Send,
  Quote,
  Settings,
  Megaphone,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { useNavigate } from "react-router-dom";
import { getUser } from "../utils/auth";
import ceoImage from "../assets/ceo/ceoimage.jpeg";
import employeeImage from "../assets/employee/employee1.jpeg";

import businessPlanIcon from "@/assets/business_plan.png";
import ourGroupIcon from "@/assets/our_group.png";
import productsIcon from "@/assets/products.png";
import documentDriveIcon from "@/assets/document_drive.png";
import hrPoliciesIcon from "@/assets/hr_policies.png";
import directoryIcon from "@/assets/directory.png";
import employeeFaqIcon from "@/assets/employee_faq.png";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface QuickLink {
  name: string;
  icon: React.ElementType;
  image: string;
  link?: string;
}

interface Attachment {
  id: number;
  document_content_type: string;
  url: string;
}

interface Comment {
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
  reports_count?: number;
}

interface Post {
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
  type: "post" | "event" | "notice" | "document";
}

interface CompanyData {
  id: number;
  name: string;
  other_config?: {
    vision?: {
      description?: {
        [key: string]: {
          bold: string;
          text: string;
        };
      };
    };
    mission?: {
      description?: {
        [key: string]: {
          bold: string;
          text: string;
        };
      };
    };
    welcome?: {
      description?: {
        [key: string]: {
          bold: string;
          text: string;
        };
      };
    };
    ceo_info?: {
      name: string;
      description: string;
      designation: string;
      photo_relation?: string;
      video_relation?: string;
    };
  };
  ceo_photo?: {
    document_url: string;
  };
  ceo_video?: {
    document_url: string;
  };
}

interface CompanyHubProps {
  userName?: string;
}

const CompanyHub: React.FC<CompanyHubProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [taskStats, setTaskStats] = useState({
    task_count: 0,
    todo_count: 0,
    open_tasks: 0,
    in_progress_tasks: 0,
    overdue_tasks: 0,
    on_hold_tasks: 0,
    completed_tasks: 0,
  });
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Get user data from localStorage
  const user = React.useMemo(() => getUser(), []);
  const displayName =
    userName || (user ? `${user.firstname} ${user.lastname}`.trim() : "Guest");
  // State for video popup
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const userId = user?.id;
  const companyId = user?.lock_role?.company_id || "116";

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    type: "post" | "comment" | null;
    id: number | string | null;
  }>({ open: false, type: null, id: null });

  // Fetch Company Data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const protocol = baseUrl.startsWith("http") ? "" : "https://";

        const response = await axios.get(
          `${protocol}${baseUrl}/organizations/${companyId}.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("🏢 Company Hub Data:", response.data);
        setCompanyData(response.data);
      } catch (error) {
        console.error("Failed to fetch company data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCompanyData();
    }
  }, [userId, companyId]);

  // Fetch Task Stats
  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl =
          localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
        const protocol = baseUrl.startsWith("http") ? "" : "https://";

        const response = await axios.get(
          `${protocol}${baseUrl}/task_managements/task_todo_counts.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("📊 Task Stats Data:", response.data);
        setTaskStats(response.data);
      } catch (error) {
        console.error("Failed to fetch task stats:", error);
      }
    };

    if (userId) {
      fetchTaskStats();
    }
  }, [userId]);

  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      const response = await axios.get(
        `${protocol}${baseUrl}/communities/${companyId}/posts.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Transform posts to match our interface
      const postsData = response.data.posts.map((post: any) => ({
        ...post,
        type: "post" as const,
      }));

      setPosts(postsData);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [companyId]);

  // Fetch Posts
  useEffect(() => {
    if (userId && companyId) {
      fetchPosts();
    }
  }, [userId, companyId, fetchPosts]);

  // Helper function to extract text from nested description structure
  const getExtractedText = (
    descObj: { description?: { [key: string]: { text: string } } } | undefined,
    defaultText: string
  ) => {
    if (!descObj || !descObj.description) return defaultText;
    const descriptions = descObj.description;
    const texts = Object.values(descriptions)
      .map((item: { text: string }) => item.text)
      .filter((text: string) => text && text.trim() !== "");
    return texts.length > 0 ? texts.join(" ") : defaultText;
  };

  // State for Audio Player
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem("company_hub_audio_playing");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    // Using a placeholder URL initially as requested.
    // User should replace this with the actual file path or URL.
    // Since direct SUNO download links expire, I'm setting a placeholder.
    audioRef.current = new Audio("/company-anthem.mp3");
    audioRef.current.loop = true;

    // Attempt to autoplay if enabled
    if (isPlaying) {
      audioRef.current.play().catch((e) => {
        console.error("Audio autoplay failed:", e);
        setIsPlaying(false); // Update state if autoplay is blocked
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((e) => console.error("Audio play failed:", e));
      }
      const newState = !isPlaying;
      setIsPlaying(newState);
      localStorage.setItem(
        "company_hub_audio_playing",
        JSON.stringify(newState)
      );
    }
  };

  // State for Post Input
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Create Post Modal
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"post" | "poll" | null>(null);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles((prev) => [
        ...prev,
        ...Array.from(e.target.files || []),
      ]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!postText.trim() && selectedFiles.length === 0) return;

    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      const formData = new FormData();
      formData.append("body", postText);
      formData.append("resource_id", String(companyId || ""));
      formData.append("resource_type", "Community");

      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formData.append("attachments[]", file);
        });
      }

      const response = await axios.post(
        `${protocol}${baseUrl}/posts.json`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Post created successfully!");
        setPostText("");
        setSelectedFiles([]);
        fetchPosts(); // Refresh the posts list
      }
    } catch (error) {
      toast.error("Failed to create post. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.id || !deleteConfirmation.type) return;

    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        localStorage.getItem("baseUrl") || "fm-uat-api.lockated.com";
      const protocol = baseUrl.startsWith("http") ? "" : "https://";

      if (deleteConfirmation.type === "post") {
        await axios.delete(
          `${protocol}${baseUrl}/posts/${deleteConfirmation.id}.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Post deleted successfully");
        fetchPosts();
      } else {
        await axios.delete(
          `${protocol}${baseUrl}/comments/${deleteConfirmation.id}.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Comment deleted successfully");
        fetchPosts();
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete. Please try again.");
    } finally {
      setDeleteConfirmation({ open: false, type: null, id: null });
    }
  };

  // State for Comments
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Jessica Taylor",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      time: "2h ago",
      text: "This is really helpful! Thanks for sharing these insights.",
      likes: 12,
      isLiked: false,
      replyLabel: "1 replies",
      hasReplyBadge: false,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      time: "1h ago",
      text: "Great progress! Keep perfectly fit, consistent layout is key.",
      likes: 8,
      isLiked: false,
      replyLabel: "Reply",
      hasReplyBadge: true,
    },
    {
      id: 3,
      name: "Mike Ross",
      image: "https://randomuser.me/api/portraits/men/33.jpg",
      time: "30m ago",
      text: "Looking solid! What's your routine like?",
      likes: 5,
      isLiked: false,
      replyLabel: "Reply",
      hasReplyBadge: false,
    },
    {
      id: 4,
      name: "Emily Doe",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      time: "15m ago",
      text: "Inspiring! 💪",
      likes: 2,
      isLiked: false,
      replyLabel: "Reply",
      hasReplyBadge: false,
    },
  ]);

  const handleLike = (id: number) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === id) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      })
    );
  };

  const handleDelete = (id: number) => {
    // User requested DELETE button not to work
    // console.log("Delete clicked for comment", id);
  };

  // Function to close video
  const closeVideo = () => {
    setIsVideoOpen(false);
    document.body.style.overflow = "auto";
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  // Close video on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isVideoOpen) {
        closeVideo();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "auto";
    };
  }, [isVideoOpen]);
  // Stats data from API
  const stats = [
    {
      label: "Total tasks",
      value: taskStats.task_count.toString().padStart(2, "0"),
      color: "border-blue-600",
    },
    {
      label: "To-Do",
      value: taskStats.todo_count.toString().padStart(2, "0"),
      color: "border-red-500",
    },
    {
      label: "In-progress",
      value: taskStats.in_progress_tasks.toString().padStart(2, "0"),
      color: "border-yellow-500",
    },
    {
      label: "Completed",
      value: taskStats.completed_tasks.toString().padStart(2, "0"),
      color: "border-green-600",
    },
    {
      label: "On Hold",
      value: taskStats.on_hold_tasks.toString().padStart(2, "0"),
      color: "border-orange-400",
    },
  ];

  const quickLinks: QuickLink[] = [
    { name: "Business plan", icon: Users, image: businessPlanIcon },
    { name: "Our Group", icon: Users, image: ourGroupIcon },
    { name: "Products", icon: Laptop, image: productsIcon },
    {
      name: "Document Drive",
      icon: FileText,
      image: documentDriveIcon,
      link: "/vas/documents",
    },
    {
      name: "HR Policies",
      icon: ClipboardCheck,
      image: hrPoliciesIcon,
      link: "/vas/documents",
    },
    { name: "Directory", icon: Book, image: directoryIcon },
    { name: "Eployee FAQ", icon: Book, image: employeeFaqIcon },
  ];

  const samplePollOptions = [
    { label: "Italian", percent: 27 },
    { label: "Chinese", percent: 23 },
    { label: "Indian", percent: 18 },
    { label: "Mexican", percent: 32 },
  ];

  // Helper function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="bg-[#fbf8f4] min-h-screen w-full font-sans text-gray-900">
      {/* --- HEADER SECTION --- */}
      <header className="pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto relative">
        {/* Toggle Audio Button */}
        <button
          onClick={toggleAudio}
          className="fixed top-24 right-6 sm:right-10 p-2 text-gray-700 hover:text-red-500 transition-colors z-50 bg-white/50 backdrop-blur-sm rounded-full shadow-sm"
          title={isPlaying ? "Mute Anthem" : "Play Anthem"}
        >
          {isPlaying ? (
            <Volume2 className="w-6 h-6 sm:w-8 sm:h-8" />
          ) : (
            <VolumeX className="w-6 h-6 sm:w-8 sm:h-8" />
          )}
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 lg:mb-12">
          Welcome, {displayName}!
        </h1>

        <div className="relative">
          <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-red-300 absolute -top-6 sm:-top-8 -left-1 transform -scale-x-100 opacity-50" />
          <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-4 relative z-10 inline-block">
            {getExtractedText(
              companyData?.other_config?.welcome,
              'Taking "Make in India\'s" PropTech products Global,'
            )}
          </h2>
          <p className="text-[#d64545] font-sans font-medium text-base sm:text-[19px] leading-[1.65] tracking-normal">
            {!companyData?.other_config?.welcome && (
              <>
                by transforming every touch point of the real estate journey
                from building, buying, managing to living — and to further spark
                new ventures and entrepreneurs who turn industry challenges into
                breakthrough opportunities.
              </>
            )}
          </p>
        </div>
      </header>

      {/* --- VISION & MISSION --- */}
      <section className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
            {/* Vision */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-200 mb-4">
                Vision
              </h2>
              <p className="text-base sm:text-lg text-gray-700">
                {getExtractedText(
                  companyData?.other_config?.vision,
                  "To build a connected and intelligent real estate world where every journey is seamless, sparks innovation, and every idea has the power to become a breakthrough business."
                )}
              </p>
            </div>

            {/* Mission */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-200 mb-4">
                Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-700">
                {getExtractedText(
                  companyData?.other_config?.mission,
                  "Our mission is to simplify and connect the entire real estate lifecycle through innovative technology, while enabling entrepreneurs and intrapreneurs to create impactful solutions that move the industry forward."
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="bg-white py-8 sm:py-10 lg:py-12 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 sm:gap-8 lg:gap-12">
            {/* Heading */}
            <div className="leading-[1.4] text-2xl sm:text-[32px] font-semibold text-black font-[Work Sans] tracking-[2px] sm:tracking-[3.5px]">
              This <br /> Quarter
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 w-full">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`pl-4 border-l-2 ${stat.color} flex flex-col gap-1`}
                >
                  <p className="text-[13px] text-gray-600 font-semibold">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#C4B89D] w-full py-10 sm:py-14 lg:py-16 flex items-center overflow-x-auto">
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
            {quickLinks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
                onClick={() => {
                  if (item.link) {
                    navigate(item.link);
                  } else {
                    // Navigate to dedicated page for each section
                    const pageName = item.name
                      .toLowerCase()
                      .replace(/\s+/g, "-");
                    // window.location.href = `/${pageName}`;
                    navigate(`/${pageName}`);
                  }
                }}
              >
                <div className="rounded-full bg-white bg-opacity-90 border-2 border-white flex items-center justify-center shadow-md group-hover:bg-white group-hover:scale-110 transition-all duration-300 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-[90%] h-[90%] object-contain p-1"
                    />
                  ) : (
                    <item.icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-gray-700" />
                  )}
                </div>
                <span className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 text-center whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT FEED --- */}
      <main className="w-full max-w-[1920px] mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 sm:gap-8">
        {/* Left Column (Feed) */}
        <div className="space-y-4 sm:space-y-6">
          {/* Create Post Button */}
          <div className="bg-white rounded-lg border border-gray-200 flex items-center justify-end relative shadow-sm w-full max-w-[1173px] p-4 sm:p-6">
            <button
              className="bg-[#C72030] text-white px-8 py-2 rounded text-base font-medium hover:bg-[#a01a26] transition-colors shadow-sm"
              onClick={() => setIsCreatePostModalOpen(true)}
            >
              Create Post
            </button>
          </div>

          {/* Dynamic Posts from API */}
          {isLoadingPosts ? (
            <div className="bg-white w-full max-w-[1173px] rounded-lg border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
              </div>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              const thumbsUpCount = post.likes_with_emoji?.thumbs_up || 0;
              const heartCount = post.likes_with_emoji?.heart || 0;
              const fireCount = post.likes_with_emoji?.fire || 0;
              const clapCount = post.likes_with_emoji?.clap || 0;

              return (
                <div
                  key={post.id}
                  className="bg-white w-full max-w-[1173px] rounded-lg border border-gray-200 p-6 flex flex-col gap-4"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          post.creator_image_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.creator_full_name}`
                        }
                        alt={post.creator_full_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-none">
                          {post.creator_full_name}
                        </h3>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {formatTimestamp(post.created_at)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600 outline-none">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                          onClick={() =>
                            setDeleteConfirmation({
                              open: true,
                              type: "post",
                              id: post.id,
                            })
                          }
                        >
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Post Title */}
                  {post.title && (
                    <h2 className="text-lg font-semibold text-gray-900">
                      {post.title}
                    </h2>
                  )}

                  {/* Post Content */}
                  <p className="text-gray-800 text-sm">{post.body}</p>

                  {/* Post Attachments */}
                  {post.attachments && post.attachments.length > 0 && (
                    <div className="grid gap-2">
                      {post.attachments.map((attachment, index) => (
                        <div
                          key={attachment.id}
                          className="w-full rounded-xl overflow-hidden"
                        >
                          {attachment.document_content_type.startsWith(
                            "image/"
                          ) ? (
                            <img
                              src={attachment.url}
                              alt="Post attachment"
                              className="w-full h-auto max-h-[400px] object-cover"
                            />
                          ) : attachment.document_content_type.startsWith(
                              "video/"
                            ) ? (
                            <video
                              src={attachment.url}
                              controls
                              className="w-full h-auto max-h-[400px] object-cover"
                            />
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600 border-t border-gray-100 pt-4">
                    {thumbsUpCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">👍</span>
                        <span className="font-medium">{thumbsUpCount}</span>
                      </div>
                    )}
                    {heartCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">❤️</span>
                        <span className="font-medium">{heartCount}</span>
                      </div>
                    )}
                    {fireCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🔥</span>
                        <span className="font-medium">{fireCount}</span>
                      </div>
                    )}
                    {clapCount > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">👏</span>
                        <span className="font-medium">{clapCount}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">
                        {post.comments.length} comments
                      </span>
                    </div>
                  </div>

                  {/* Comments List */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="border-t border-gray-100 pt-4 mt-2 space-y-4">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <img
                            src={
                              comment.commentor_profile_image ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.commentor_full_name}`
                            }
                            className="w-8 h-8 rounded-full object-cover"
                            alt={comment.commentor_full_name}
                          />
                          <div className="bg-gray-50 rounded-2xl px-4 py-2 flex-1 relative group">
                            <h4 className="text-sm font-bold text-gray-900">
                              {comment.commentor_full_name}
                            </h4>
                            <p className="text-sm text-gray-700">
                              {comment.body}
                            </p>
                            <button
                              onClick={() =>
                                setDeleteConfirmation({
                                  open: true,
                                  type: "comment",
                                  id: comment.id,
                                })
                              }
                              className="absolute top-2 right-4 text-xs text-red-600 opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white w-full max-w-[1173px] rounded-lg border border-gray-200 p-12 text-center">
              <p className="text-gray-500">
                No posts yet. Be the first to share something!
              </p>
            </div>
          )}

          {/* Old static post - keeping one for reference */}
          {/* Post 1: Gym Image */}

          {/* Post 2: Poll - Favorite Cuisine */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full max-w-[1173px] flex flex-col p-4 sm:p-6 gap-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Admin 3"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Admin 3</h4>
                  <p className="text-xs text-gray-500">6h ago</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 outline-none">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() =>
                      setDeleteConfirmation({
                        open: true,
                        type: "post",
                        id: "static-2",
                      })
                    }
                  >
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Poll Question */}
            <div>
              <p className="text-gray-900 font-medium">
                Quick poll: What's your favorite cuisine?
              </p>
            </div>

            {/* Poll Options */}
            <div className="space-y-3">
              {/* Option 1: Italian */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Italian</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">44 votes</span>
                    <span className="text-xs text-gray-500">27%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-300 rounded-full"
                    style={{ width: "27%" }}
                  ></div>
                </div>
              </div>

              {/* Option 2: Japanese */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Japanese</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">38 votes</span>
                    <span className="text-xs text-gray-500">23%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-300 rounded-full"
                    style={{ width: "23%" }}
                  ></div>
                </div>
              </div>

              {/* Option 3: Mexican */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Mexican</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">29 votes</span>
                    <span className="text-xs text-gray-500">18%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-300 rounded-full"
                    style={{ width: "18%" }}
                  ></div>
                </div>
              </div>

              {/* Option 4: Indian */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-700">Indian</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">52 votes</span>
                    <span className="text-xs text-gray-500">32%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-300 rounded-full"
                    style={{ width: "32%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Footer with reactions and comments */}
            <div className="flex items-center gap-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Heart className="w-4 h-4" />
                <span>16</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>8 comments</span>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <Dialog
            open={deleteConfirmation.open}
            onOpenChange={(open) =>
              !open &&
              setDeleteConfirmation({ ...deleteConfirmation, open: false })
            }
          >
            <DialogContent className="max-w-[400px] p-0 overflow-hidden border-none shadow-2xl rounded-none">
              <div className="bg-white p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  Are you sure you want to Delete <br />
                  {deleteConfirmation.type === "post"
                    ? "this Community Post ?"
                    : "this Comment?"}
                </h3>
              </div>
              <div className="flex w-full">
                <button
                  onClick={() =>
                    setDeleteConfirmation({ open: false, type: null, id: null })
                  }
                  className="flex-1 py-4 bg-[#E8E1D5] text-gray-600 font-bold hover:bg-[#DDD6C8] transition-colors"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-[#C72030] text-white font-bold hover:bg-[#AD1C29] transition-colors"
                >
                  Yes
                </button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Post 3: Video Tutorial */}
          <div
            className="bg-white rounded-lg shadow-sm overflow-hidden w-full max-w-[1173px] flex flex-col p-4 sm:p-6 gap-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Admin 3"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Admin 3</h4>
                  <p className="text-xs text-gray-500">12h ago</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 outline-none">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() =>
                      setDeleteConfirmation({
                        open: true,
                        type: "post",
                        id: "static-3",
                      })
                    }
                  >
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Post Content */}
            <div>
              <p className="text-gray-700">
                Check out this tutorial on building a React app from scratch!
              </p>
            </div>

            {/* Video Thumbnail */}
            <div
              className="relative w-full max-w-[1125px] bg-gray-300 flex items-center justify-center"
              style={{ aspectRatio: "1125 / 384" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500"></div>
              <button className="relative z-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Footer with reactions and comments */}
            <div className="flex items-center gap-4 py-3 border-t border-gray-100">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-base">🔥</span>
                <span>67</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-base">👍</span>
                <span>23</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>34 comments</span>
              </div>
            </div>
          </div>

          {/* Post 4: Cricket Championship 2025 */}
          <div
            className="bg-white rounded-lg shadow-sm w-full max-w-[1173px] flex flex-col p-4 sm:p-6 gap-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Admin 1"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Admin 1</h4>
                  <p className="text-xs text-gray-500">1d ago</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 outline-none">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() =>
                      setDeleteConfirmation({
                        open: true,
                        type: "post",
                        id: "static-4",
                      })
                    }
                  >
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Post Title */}
            <div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">
                Panchshil Cricket Championship 2025
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                🏏 Exciting news! Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book. Lorem Ipsum is simply dummy text of the
                printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s, when an
                unknown printer took a galley of type and scrambled it to make a
                type specimen book.
              </p>
            </div>

            {/* Event Details */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Friday 12th May, 2025 @ 03 - 09 PM</span>
              </div>
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>Cama Assembly Hall, Business Park</span>
              </div>
            </div>

            {/* Cricket Image */}
            <div className="w-full max-w-[1125px]">
              <div
                className="overflow-hidden bg-gray-100 w-full"
                style={{
                  aspectRatio: "1125 / 384",
                  borderTopLeftRadius: "2px",
                  borderTopRightRadius: "2px",
                }}
              >
                <img
                  src="https://lockated-public.s3.ap-south-1.amazonaws.com/attachfiles/documents/8412640/original/1as.jpeg"
                  alt="Cricket Player Batting"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Footer with reactions and comments */}
            <div className="flex items-center gap-4 py-3 border-t border-gray-100 mt-auto">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-base">❤️</span>
                <span>49</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-base">🔥</span>
                <span>56</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span className="text-base">👍</span>
                <span>43</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MessageSquare className="w-4 h-4" />
                <span>47 comments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <aside className="space-y-4 sm:space-y-6 w-full">
          {/* CEO's Message Video Card */}
          <div className="w-full h-[650px] overflow-hidden rounded-xl shadow-xl border-2 border-gray-200 hover:border-red-100 transition-all duration-300 flex flex-col relative bg-[#C72030]">
            {/* Video Thumbnail Section */}
            <div className="relative h-[400px] bg-gray-200 overflow-hidden group">
              <img
                src={
                  companyData?.ceo_photo?.document_url ||
                  "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                }
                alt="CEO's Message"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Overlay - Matching the red fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#C72030] via-[#C72030]/80 to-transparent bottom-0 h-full pointer-events-none" />

              <button
                onClick={() => {
                  setIsVideoOpen(true);
                  document.body.style.overflow = "hidden";
                }}
                className="absolute inset-0 flex items-center justify-center transition-all z-10 pb-20"
                aria-label="Play video"
              >
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 border border-white/40">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-8 h-8 text-red-600 ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Content Section */}
            <div className="absolute bottom-0 left-0 right-0 h-[300px] pointer-events-none">
              {/* CEO Image - Flush to Bottom Left */}
              <div className="absolute bottom-0 left-0 w-[200px] z-20">
                <img
                  src={companyData?.ceo_photo?.document_url || ceoImage}
                  alt={companyData?.other_config?.ceo_info?.name || "CEO"}
                  className="w-full object-bottom drop-shadow-2xl"
                />
              </div>

              {/* Right Side Text container */}
              <div className="absolute bottom-0 right-0 w-[240px] text-white text-right z-20 pb-6 pr-6 flex flex-col items-end">
                <Quote className="text-white/20 w-12 h-12 mb-2 rotate-180" />
                <p className="text-[16px] leading-relaxed font-light opacity-95 mb-6 text-right">
                  {companyData?.other_config?.ceo_info?.description
                    ? `"${companyData.other_config.ceo_info.description}"`
                    : `"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna."`}
                </p>

                <div className="flex flex-col items-end">
                  <h3
                    className="text-4xl font-[Cursive] italic mb-1 font-light tracking-wide"
                    style={{ fontFamily: "Brush Script MT, cursive" }}
                  >
                    {companyData?.other_config?.ceo_info?.name ||
                      "Chetan Bafna"}
                  </h3>
                  <span className="text-white/80 text-xs font-medium uppercase tracking-wider block">
                    {companyData?.other_config?.ceo_info?.designation ||
                      "CEO - Lockated"}
                  </span>
                </div>
              </div>
            </div>

            {/* Video Popup */}
            {isVideoOpen && (
              <div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    closeVideo();
                  }
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeVideo();
                  }}
                  className="absolute top-4 left-4 text-white hover:text-gray-300 transition-colors z-10"
                  aria-label="Close video"
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="w-full max-w-4xl aspect-video">
                  <video
                    ref={videoRef}
                    src={
                      companyData?.ceo_video?.document_url ||
                      "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-laptop-close-up-4986-large.mp4"
                    }
                    controls
                    autoPlay
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Employee of the Month Card */}
          <div className="bg-[#C4B89D] border border-[#C4B89D] rounded-lg p-4 sm:p-6 w-full aspect-square flex flex-col justify-between text-[#1f1f1f] relative">
            {/* Crown Icon + Title */}
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none">👑</span>
              <h3 className="font-bold text-xl leading-none">
                Employee of the Month
              </h3>
            </div>

            {/* Avatar - Aligned Left */}
            <div className="flex-1 flex items-center justify-start pl-2">
              <div className="w-48 h-48 rounded-full border-4 border-white/20 overflow-hidden shadow-sm">
                <img
                  src={employeeImage}
                  alt="Employee"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Footer Info */}
            <div className="flex justify-between items-end w-full pb-2">
              {/* Name & Role */}
              <div className="flex flex-col items-start gap-1">
                <h4 className="text-2xl font-bold leading-tight">Akshay</h4>
                <p className="text-sm font-medium opacity-80 mb-1">
                  Frontend Developer
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm font-semibold text-[#1f1f1f] pb-1">
                <div className="flex items-center gap-1.5 ">
                  <span className="text-lg">🔥</span>
                  <span>32</span>
                </div>
                <div className="flex items-center gap-1.5 ">
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>23 comments</span>
                </div>
              </div>
            </div>
          </div>

          {/* Town Hall Section */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 sm:p-6 w-full h-[220px] flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-4">
              <Megaphone className="w-8 h-8 text-black stroke-[1.5]" />
              <h3 className="font-bold text-2xl text-black tracking-tight">
                Monthly town-halls
              </h3>
            </div>
            <div className="flex-1 relative min-h-0">
              <AutoScrollTownHalls />
            </div>
          </div>

          {/* Announcements */}
          <div
            className="bg-white rounded-lg shadow-sm w-full h-[180px] p-4"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
              <Bell className="w-5 h-5 text-gray-700" />
              <h3 className="font-bold text-gray-800">Announcements</h3>
            </div>
            <div>
              <h4 className="font-bold text-sm">Welcome Deshna Pande</h4>
              <p className="text-xs text-gray-600 mt-1">
                We welcome Deshna to Lockated. Designed as a Senior Data
                Analyst.
              </p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div
            className="bg-white rounded-lg shadow-sm overflow-hidden w-full p-4 flex flex-col h-[600px]"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
              <Calendar className="w-5 h-5 text-gray-700" />
              <h3 className="font-bold text-gray-800">Upcoming Events</h3>
            </div>

            <div className="flex-1 relative min-h-0">
              <AutoScrollEvents />
            </div>
          </div>
        </aside>
      </main>

      {/* Create Post/Poll Modal */}
      <Dialog
        open={isCreatePostModalOpen}
        onOpenChange={setIsCreatePostModalOpen}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {!createMode ? (
            // Initial selection screen
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create</h2>
                <button
                  onClick={() => setIsCreatePostModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setCreateMode("post")}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Create Post</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Share your thoughts with the community
                  </div>
                </button>

                <button
                  onClick={() => setCreateMode("poll")}
                  className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Create Poll</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Get feedback from your community
                  </div>
                </button>
              </div>
            </div>
          ) : createMode === "post" ? (
            // Create Post Form
            <div className="flex flex-col w-full">
              <div className="px-5 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">
                    Create Post
                  </h2>
                  <button
                    onClick={() => {
                      setCreateMode(null);
                      setPostText("");
                      setSelectedFiles([]);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="px-5 py-4 space-y-3">
                {/* Add Media Section */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Add Media
                  </label>
                  <div
                    onClick={handleAttachClick}
                    className="border border-gray-200 rounded p-6 text-center cursor-pointer hover:border-gray-300 transition-colors bg-white"
                  >
                    <p className="text-xs text-gray-400">
                      Choose a file or drag & drop it here
                    </p>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200"
                        >
                          <span className="text-xs text-gray-700 truncate flex-1">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Post Content
                  </label>
                  <textarea
                    placeholder="Write your announcement or message..."
                    className="w-full px-3 py-2 border border-gray-200 rounded text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none"
                    rows={3}
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                </div>
              </div>

              <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setCreateMode(null);
                    setPostText("");
                    setSelectedFiles([]);
                  }}
                  className="px-5 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await handlePublish();
                    setCreateMode(null);
                    setIsCreatePostModalOpen(false);
                    setPostText("");
                    setSelectedFiles([]);
                  }}
                  disabled={!postText.trim() && selectedFiles.length === 0}
                  className="px-5 py-1.5 bg-[#C72030] text-white text-xs font-medium rounded hover:bg-[#a01a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish Post
                </button>
              </div>
            </div>
          ) : (
            // Create Poll Form
            <div className="flex flex-col w-full max-h-[85vh]">
              <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-gray-900">
                    Create Admin Post
                  </h2>
                  <button
                    onClick={() => {
                      setCreateMode(null);
                      setPostText("");
                      setSelectedFiles([]);
                      setPollOptions(["", ""]);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-3 space-y-3 overflow-y-auto flex-1">
                {/* Add Media Section */}
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1.5">
                    Add Media
                  </label>
                  <div
                    onClick={handleAttachClick}
                    className="border-2 border-dashed border-gray-200 rounded-md p-4 text-center cursor-pointer hover:border-gray-300 transition-colors bg-gray-50"
                  >
                    <p className="text-xs text-gray-400">
                      Choose a file or drag & drop it here
                    </p>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    multiple
                    onChange={handleFileChange}
                  />

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200"
                        >
                          <span className="text-xs text-gray-700 truncate flex-1">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Content */}
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1.5">
                    Post Content
                  </label>
                  <textarea
                    placeholder="Write your announcement or message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={3}
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                </div>

                {/* Poll Options */}
                <div>
                  <label className="block text-xs font-medium text-gray-900 mb-1.5">
                    Poll Options
                  </label>
                  <div className="space-y-2">
                    {pollOptions.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...pollOptions];
                          newOptions[index] = e.target.value;
                          setPollOptions(newOptions);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setPollOptions([...pollOptions, ""])}
                    className="mt-2 text-xs text-gray-700 hover:text-gray-900 font-medium underline"
                  >
                    Add Option
                  </button>
                </div>
              </div>

              <div className="px-4 py-3 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setCreateMode(null);
                    setPostText("");
                    setSelectedFiles([]);
                    setPollOptions(["", ""]);
                  }}
                  className="px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    // TODO: Implement poll creation API call
                    toast.success("Poll creation coming soon!");
                    setCreateMode(null);
                    setIsCreatePostModalOpen(false);
                    setPostText("");
                    setSelectedFiles([]);
                    setPollOptions(["", ""]);
                  }}
                  disabled={
                    !postText.trim() ||
                    pollOptions.filter((o) => o.trim()).length < 2
                  }
                  className="px-4 py-1.5 bg-[#C72030] text-white text-xs font-medium rounded-md hover:bg-[#a01a26] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publish Poll
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// AutoScrollTownHalls Component
const AutoScrollTownHalls = () => {
  const cards = [
    {
      title: "Office Management Meet",
      date: "Saturday, Jan 7 at 5:30 pm",
      description:
        "It's all about effectively tracking your sales force and other field teams",
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop",
    },
    {
      title: "Quarterly Review",
      date: "Monday, Jan 15 at 4:00 pm",
      description:
        "Understanding progress, blockers, and next quarter priorities.",
      image:
        "https://images.unsplash.com/photo-1553877615-30c73165327b?q=80&w=2940&auto=format&fit=crop",
    },
    {
      title: "HR Policy Update",
      date: "Friday, Jan 20 at 3:00 pm",
      description: "Latest updates on company policies and compliance.",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop",
    },
    {
      title: "Product Roadmap",
      date: "Wednesday, Jan 25 at 6:00 pm",
      description: "Deep dive into upcoming features and releases.",
      image:
        "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2940&auto=format&fit=crop",
    },
    {
      title: "Leadership AMA",
      date: "Monday, Jan 30 at 5:00 pm",
      description: "Ask leadership anything about company direction.",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2940&auto=format&fit=crop",
    },
    {
      title: "Sales Strategy",
      date: "Thursday, Feb 2 at 4:30 pm",
      description: "Optimizing sales funnels and conversion strategies.",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2940&auto=format&fit=crop",
    },
  ];

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: ".custom-swiper-pagination",
          type: "bullets",
        }}
        effect={"slide"}
        grabCursor={true}
        className="w-full pb-8"
      >
        {cards.map((item, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-stretch"
          >
            <div className="w-full">
              <TownHallCard {...item} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Pagination Container */}
      <div className="custom-swiper-pagination flex justify-end gap-2 absolute bottom-0 right-0 z-10 pr-2 pb-1"></div>

      <style>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          background-color: #d1d5db; /* gray-300 */
          width: 8px;
          height: 8px;
          opacity: 1;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
           background-color: #000;
        }
      `}</style>
    </div>
  );
};

// TownHallCard Component
const TownHallCard = ({
  title,
  date,
  description,
  image,
}: {
  title: string;
  date: string;
  description: string;
  image: string;
}) => {
  return (
    <div className="bg-transparent flex gap-5 h-full items-start pt-2">
      {/* Image Section */}
      <div className="w-[100px] h-[100px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col h-[100px]">
        {/* Date */}
        <p className="text-[#9CA3AF] text-sm mb-1 font-medium">{date}</p>

        {/* Title */}
        <h4 className="font-bold text-xl text-black leading-tight mb-2 line-clamp-2">
          {title}
        </h4>

        {/* Description */}
        <p className="text-[15px] text-[#4B5563] leading-snug line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
};

// AutoScrollEvents Component
const AutoScrollEvents = () => {
  const events = [
    {
      title: "Office Lunch Party",
      date: "Saturday, Jan 8 at 8:30 pm",
      description: "Get together to Party with Colleagues on Jan 8 at 8:30 pm.",
      image:
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop",
      month: "JAN",
      day: "8",
    },
    {
      title: "Wish Ketki Patle",
      date: "Saturday, Jan 8 at 8:30 pm",
      description:
        "Let's rejoin all together tomorrow at 6:30 to celebrate her birthday.",
      image:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
      month: "JAN",
      day: "8",
    },
    {
      title: "Wish Ketki Patle",
      date: "Saturday, Jan 9 at 8:30 pm",
      description:
        "Let's rejoin all together tomorrow at 6:30 to celebrate her birthday.",
      image:
        "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=400&fit=crop",
      month: "JAN",
      day: "9",
    },
    {
      title: "Team Building Workshop",
      date: "Monday, Jan 15 at 2:00 pm",
      description:
        "Join us for an interactive team building session to strengthen collaboration.",
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=400&fit=crop",
      month: "JAN",
      day: "15",
    },
    {
      title: "Product Launch Event",
      date: "Friday, Jan 20 at 6:00 pm",
      description:
        "Celebrate the launch of our new product with the entire team.",
      image:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop",
      month: "JAN",
      day: "20",
    },
  ];

  // Duplicate events for seamless loop
  const duplicatedEvents = [...events, ...events, ...events];

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="animate-scroll-vertical">
        {duplicatedEvents.map((event, index) => (
          <div key={index} className="mb-4">
            <EventCard {...event} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-33.333%);
          }
        }
        
        .animate-scroll-vertical {
          animation: scroll-vertical 20s linear infinite;
          will-change: transform;
        }
        
        .animate-scroll-vertical:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

// EventCard Component
const EventCard = ({
  title,
  date,
  description,
  image,
  month,
  day,
}: {
  title: string;
  date: string;
  description: string;
  image: string;
  month: string;
  day: string;
}) => {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#9CA3AF] text-xs mb-1">{date}</p>
        <h4 className="font-bold text-base text-black leading-tight mb-1">
          {title}
        </h4>
        <p className="text-sm text-[#6B7280] leading-snug line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};

// Types for PostCard component
interface Post {
  id: string;
  creator_image_url?: string;
  creator_full_name: string;
  resource_name: string;
  created_at: string;
  title?: string;
  body: string;
  attachments?: Array<{
    id: string;
    url: string;
    document_content_type: string;
  }>;
  likes_with_emoji?: {
    thumb?: number;
    heart?: number;
    fire?: number;
  };
  comments?: Array<{
    id: string;
    commentor_full_name: string;
    commentor_profile_image?: string;
    created_at: string;
    body: string;
    reports_count?: number;
  }>;
}

// Format timestamp to relative time (e.g., "2 hours ago")
const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const PostCard = ({ post }: { post: Post }) => {
  const [showCommentsForPost, setShowCommentsForPost] = React.useState<
    string | null
  >(null);
  const navigate = {}; // Mock navigate function, replace with actual navigation if needed
  const communityId = "1"; // Mock community ID, replace with actual value if needed

  // Function to handle comment deletion
  const deleteComment = (commentId: string) => {
    try {
      // In a real implementation, this would make an API call to delete the comment
      // For now, we'll just show a success message
      alert(`Comment ${commentId} would be deleted in a real implementation`);
    } catch (error) {
      alert(`Error deleting comment: ${error.message}`);
    }
  };

  // Calculate total reactions from likes_with_emoji
  const thumbsUpCount = post.likes_with_emoji?.thumb || 0;
  const heartCount = post.likes_with_emoji?.heart || 0;
  const fireCount = post.likes_with_emoji?.fire || 0;

  return (
    <div className="bg-white rounded-[10px] border border-gray-200 w-full max-w-[1173px] flex flex-col p-4 sm:p-6 gap-3 sm:gap-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={
              post.creator_image_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.creator_full_name}`
            }
            alt={post.creator_full_name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">
                {post.creator_full_name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{post.resource_name}</span>
              <span>•</span>
              <span>{formatTimestamp(post.created_at)}</span>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Post Title */}
      {post.title && (
        <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
      )}

      {/* Post Content */}
      <p className="text-gray-700">{post.body}</p>

      {/* Gym Image - Responsive */}
      <div className="w-full max-w-[1125px]">
        <div
          className="overflow-hidden rounded-lg bg-gray-100 w-full"
          style={{
            aspectRatio: "1125 / 384",
          }}
        >
          <img
            src="C:/Users/Abcom/.gemini/antigravity/brain/2c832d08-8187-4c29-8aca-83efdfa0ee8d/uploaded_image_1768223350989.png"
            alt="Gym Fitness"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Scrollable Comments Section */}
      <div
        className="flex-1 overflow-y-auto space-y-4 pr-2"
        style={{
          maxHeight: "250px",
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e0 #f7fafc",
        }}
      >
        {/* Sample Comments */}
        {[
          {
            id: "1",
            name: "Jessica Taylor",
            time: "2h ago",
            text: "This is really helpful! Thanks for sharing these insights.",
            likes: 12,
            replies: 1,
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
          },
          {
            id: "2",
            name: "Michael Chen",
            time: "3h ago",
            text: "Great progress! Keep up the amazing work 💪",
            likes: 8,
            replies: 0,
            avatar: "https://randomuser.me/api/portraits/men/2.jpg",
          },
          {
            id: "3",
            name: "Sarah Johnson",
            time: "5h ago",
            text: "Wow, this transformation is incredible! What's your workout routine?",
            likes: 15,
            replies: 2,
            avatar: "https://randomuser.me/api/portraits/women/3.jpg",
          },
          {
            id: "4",
            name: "David Martinez",
            time: "6h ago",
            text: "Consistency is definitely key! Inspiring stuff 🔥",
            likes: 6,
            replies: 0,
            avatar: "https://randomuser.me/api/portraits/men/4.jpg",
          },
          {
            id: "5",
            name: "Emily Brown",
            time: "8h ago",
            text: "Amazing dedication! How long did it take to see these results?",
            likes: 10,
            replies: 1,
            avatar: "https://randomuser.me/api/portraits/women/5.jpg",
          },
          {
            id: "6",
            name: "James Wilson",
            time: "10h ago",
            text: "This is the motivation I needed today. Thank you for sharing!",
            likes: 9,
            replies: 0,
            avatar: "https://randomuser.me/api/portraits/men/6.jpg",
          },
        ].map((comment) => (
          <div
            key={comment.id}
            className="bg-white border-b border-gray-100 pb-4 last:border-b-0"
          >
            <div className="flex items-start gap-3">
              <img
                src={comment.avatar}
                alt={comment.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {comment.name}
                  </h4>
                  <p className="text-xs text-gray-500">{comment.time}</p>
                </div>
                <p className="text-sm text-gray-700 mb-2">{comment.text}</p>

                {/* Actions */}
                <div className="flex items-center gap-4 mb-2">
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-500 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>
                      {comment.replies}{" "}
                      {comment.replies === 1 ? "reply" : "replies"}
                    </span>
                  </button>
                </div>

                {/* Delete Button - Moved to Bottom */}
                <div className="flex justify-end">
                  <button className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* Custom scrollbar styling for Webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>

      {/* Reactions and Comments */}
      <div className="flex items-center gap-6 pt-3 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors">
            👍
            <span className="text-sm font-medium">{thumbsUpCount}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors">
            ❤️
            <span className="text-sm font-medium">{heartCount}</span>
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
            🔥
            <span className="text-sm font-medium">{fireCount}</span>
          </button>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <MessageSquare size={16} />
          <span className="text-sm font-medium">
            {post.comments?.length || 0} comments
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanyHub;
