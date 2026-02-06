import React, { useEffect, useRef, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  TextField,
  Slide,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { X, Upload, Trash2, Mic, MicOff } from "lucide-react";
import { AppDispatch, RootState } from "../store/store";
import { fetchFMUsers } from "../store/slices/fmUserSlice";
import MuiSelectField from "./MuiSelectField";
import { toast } from "sonner";
import axios from "axios";
import { getFullUrl } from "../config/apiConfig";
import { Mention, MentionsInput } from "react-mentions";
import MuiMultiSelect from "./MuiMultiSelect";
import { AddTagModal } from "./AddTagModal";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { useSpeechToText } from "../hooks/useSpeechToText";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface AddOpportunityModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: fmUsersData } = useSelector(
    (state: RootState) => state.fmUsers
  );

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsiblePerson, setResponsiblePerson] = useState("");
  const [tags, setTags] = useState([]);
  const [observers, setObservers] = useState([])
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prevTags, setPrevTags] = useState([]);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [baseValue, setBaseValue] = useState("");

  const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();

  // Handle STT for Title and Description
  useEffect(() => {
    if (isListening && transcript) {
      if (activeId === "opportunity-title") {
        const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
        setTitle(newValue);
      } else if (activeId === "opportunity-description") {
        const newValue = baseValue ? `${baseValue} ${transcript}` : transcript;
        setDescription(newValue);
        if (quillEditorRef.current) {
          // Wrap in a paragraph if it's empty or doesn't look like HTML
          const formattedValue = newValue.startsWith("<") ? newValue : `<p>${newValue}</p>`;
          quillEditorRef.current.root.innerHTML = formattedValue;
        }
      }
    }
  }, [isListening, transcript, activeId, baseValue]);

  console.log(responsiblePerson);

  // Mention state
  const [mentionUsers, setMentionUsers] = useState<any[]>([]);
  const [mentionTags, setMentionTags] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<HTMLDivElement>(null);
  const quillEditorRef = useRef<Quill | null>(null);

  // Fetch mention users
  const fetchMentionUsers = async () => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://${baseUrl}/pms/users/get_escalate_to_users.json?type=Task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMentionUsers(response.data.users || []);
    } catch (error) {
      console.log("Error fetching mention users:", error);
    }
  };

  // Fetch mention tags
  const fetchMentionTags = async () => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const response = await axios.get(`https://${baseUrl}/company_tags.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMentionTags(response.data || []);
    } catch (error) {
      console.log("Error fetching mention tags:", error);
    }
  };

  // Fetch users and mentions on mount
  useEffect(() => {
    if (open) {
      dispatch(fetchFMUsers());
      fetchMentionUsers();
      fetchMentionTags();

      // Initialize Quill editor with a small delay to ensure DOM is ready
      const initTimer = setTimeout(() => {
        if (quillRef.current) {
          // Clear previous instance if it exists
          if (quillEditorRef.current) {
            quillEditorRef.current = null;
          }

          quillEditorRef.current = new Quill(quillRef.current, {
            theme: "snow",
            placeholder: "Type description...",
            modules: {
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                ["blockquote"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            },
          });

          // Set initial description if exists
          if (description) {
            quillEditorRef.current.root.innerHTML = description;
          }

          // Handle text changes
          quillEditorRef.current.on("text-change", () => {
            const htmlContent = quillEditorRef.current?.root.innerHTML;
            setDescription(htmlContent || "");
          });
        }
      }, 100);

      return () => {
        clearTimeout(initTimer);
      };
    } else {
      // Reset editor ref when modal closes
      if (quillEditorRef.current) {
        quillEditorRef.current = null;
      }
    }
  }, [dispatch, open])

  // Derived User Options
  const usersList =
    (fmUsersData as any)?.users || (fmUsersData as any)?.fm_users || [];
  const userOptions = mentionUsers.map((user: any) => ({
    label: `${user.full_name}`,
    value: user.id,
  }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMultiSelectChange = (field: string, values: any) => {
    if (field === "tags") {
      setTags(values);
    }

    if (field === "observers") {
      setObservers(values);
    }
  };

  const handleSubmit = async () => {
    if (!title) return toast.error("Title is required");
    if (!responsiblePerson)
      return toast.error("Responsible Person is required");

    console.log(description)

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("opportunity[title]", title);
      formData.append("opportunity[description]", description.trim()); // Preserve formatting
      formData.append("opportunity[responsible_person_id]", responsiblePerson);
      formData.append("opportunity[status]", "open"); // Default status

      // Append tags
      tags.forEach((tagId: any) => {
        formData.append("opportunity[tag_ids][]", tagId.value);
      });

      // Append observers
      observers.forEach((observerId: any) => {
        formData.append("opportunity[observer_ids][]", observerId.value);
      });

      // Append attachments
      attachments.forEach((file) => {
        formData.append("attachments[]", file);
      });

      const token = localStorage.getItem("token");
      await axios.post(getFullUrl("/opportunities.json"), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is set automatically for FormData
        },
      });

      toast.success("Opportunity created successfully");
      // Invalidate cache after opportunity creation
      const { cache } = await import("../utils/cacheUtils");
      cache.invalidatePattern("opportunities_*");
      if (onSuccess) onSuccess();
      onClose();

      // Reset form
      setTitle("");
      setDescription("");
      if (quillEditorRef.current) {
        quillEditorRef.current.setContents([]);
      }
      setResponsiblePerson("");
      setTags([]);
      setAttachments([]);
    } catch (error: any) {
      console.error("Error creating opportunity:", error);
      toast.error(
        error.response?.data?.error ||
        error.message ||
        "Failed to create opportunity"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prepare mention data
  const mentionData =
    mentionUsers.length > 0
      ? mentionUsers.map((user: any) => ({
        id: user.id?.toString() || user.user_id?.toString(),
        display: user.full_name || user.name || "Unknown User",
      }))
      : [];

  const tagData =
    mentionTags.length > 0
      ? mentionTags.map((tag: any) => ({
        id: tag.id?.toString(),
        display: tag.name,
      }))
      : [];

  // Mention styles
  const mentionStyles = {
    control: {
      fontSize: 14,
      backgroundColor: "white",
      minHeight: 40,
    },
    highlighter: {
      overflow: "hidden",
    },
    input: {
      margin: 0,
      padding: "8px 14px",
      outline: "none",
      border: "1px solid rgba(0, 0, 0, 0.23)",
      borderRadius: "4px",
    },
    suggestions: {
      list: {
        backgroundColor: "white",
        border: "1px solid #ccc",
        fontSize: 14,
        zIndex: 100,
        maxHeight: "150px",
        overflowY: "auto" as const,
        borderRadius: "4px",
      },
      item: {
        padding: "5px 10px",
        borderBottom: "1px solid #eee",
        cursor: "pointer",
      },
      itemFocused: {
        backgroundColor: "#01569E",
        color: "white",
        fontWeight: "bold",
      },
    },
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        TransitionComponent={Transition}
        fullScreen // Using fullScreen but limiting width with CSS as per example
        PaperProps={{
          style: {
            position: "fixed",
            right: 0,
            top: 0,
            height: "100%",
            width: "40rem", // Fixed width side panel
            margin: 0,
            borderRadius: 0,
            maxWidth: "100%",
          },
        }}
      >
        <DialogContent className="!p-0 flex flex-col h-full bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <Typography variant="h6" className="font-semibold text-center flex-1">
              Add Opportunities
            </Typography>
            <IconButton onClick={onClose} size="small">
              <X size={20} />
            </IconButton>
          </div>

          <div className="border-b border-[#E95420] w-full" />

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Typography variant="subtitle2" className="font-medium">
                  Title <span className="text-red-500">*</span>
                </Typography>
                {supported && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (isListening && activeId === "opportunity-title") {
                        stopListening();
                      } else {
                        setBaseValue(title);
                        startListening("opportunity-title");
                      }
                    }}
                    color={isListening && activeId === "opportunity-title" ? "secondary" : "default"}
                    sx={{ color: isListening && activeId === "opportunity-title" ? "#C72030" : "inherit" }}
                  >
                    {isListening && activeId === "opportunity-title" ? <Mic size={18} /> : <MicOff size={18} />}
                  </IconButton>
                )}
              </div>
              <MentionsInput
                value={title}
                onChange={(e, newValue) => setTitle(newValue)}
                placeholder="Type @ to mention users. Type # to mention tags"
                style={mentionStyles}
                className="mentions-title"
              >
                <Mention
                  trigger="@"
                  data={mentionData}
                  markup="@[__display__](__id__)"
                  displayTransform={(id, display) => `@${display} `}
                  appendSpaceOnAdd
                />
                <Mention
                  trigger="#"
                  data={tagData}
                  markup="#[__display__](__id__)"
                  displayTransform={(id, display) => `#${display} `}
                  appendSpaceOnAdd
                />
              </MentionsInput>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Typography variant="subtitle2" className="font-medium">
                  Description
                </Typography>
                {supported && (
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (isListening && activeId === "opportunity-description") {
                        stopListening();
                      } else {
                        // Extract text from Quill if possible, or just use description state
                        const currentText = quillEditorRef.current ? quillEditorRef.current.root.innerHTML : description;
                        setBaseValue(currentText === "<p><br></p>" ? "" : currentText);
                        startListening("opportunity-description");
                      }
                    }}
                    color={isListening && activeId === "opportunity-description" ? "secondary" : "default"}
                    sx={{ color: isListening && activeId === "opportunity-description" ? "#C72030" : "inherit" }}
                  >
                    {isListening && activeId === "opportunity-description" ? <Mic size={18} /> : <MicOff size={18} />}
                  </IconButton>
                )}
              </div>
              <div
                ref={quillRef}
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "4px",
                  minHeight: "200px",
                }}
              />
            </div>

            {/* Responsible Person */}
            <div>
              <Typography variant="subtitle2" className="mb-2 font-medium">
                Responsible Person <span className="text-red-500">*</span>
              </Typography>
              <MuiSelectField
                options={userOptions}
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value as string)}
                fullWidth
              />
            </div>

            <div>
              <div
                className="text-[12px] text-[red] text-right cursor-pointer mb-2"
                onClick={() => setIsTagModalOpen(true)}
              >
                <i>Create new tag</i>
              </div>
              <MuiMultiSelect
                label="Tags"
                options={mentionTags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                  id: tag.id,
                }))}
                value={tags}
                onChange={(values) => handleMultiSelectChange("tags", values)}
                placeholder="Select Tags"
              />
            </div>

            <div className="!mt-6">
              <MuiMultiSelect
                label={
                  <>
                    Observer<span className="text-red-500">*</span>
                  </>
                }
                options={mentionUsers
                  ?.filter(Boolean)
                  .map((user: any) => ({
                    label: user?.full_name || "Unknown",
                    value: user?.id,
                  }))}
                value={observers}
                placeholder="Select Observer"
                onChange={(values) => handleMultiSelectChange("observers", values)}
              />
            </div>

            {/* Attachments */}
            <div>
              <Typography variant="subtitle2" className="mb-2 font-medium">
                Attachments
              </Typography>
              <div className="border rounded-md p-3 flex items-center justify-between bg-white">
                <span className="text-gray-500 text-sm italic">
                  {attachments.length === 0
                    ? "No Documents Attached"
                    : `${attachments.length} file(s) attached`}
                </span>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    textTransform: "none",
                    bgcolor: "#C72030",
                    "&:hover": { bgcolor: "#A01020" },
                  }}
                >
                  Attach Files
                </Button>
                <input
                  type="file"
                  hidden
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>

              {/* File List */}
              {attachments.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <Trash2
                        size={14}
                        className="cursor-pointer text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveAttachment(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex justify-center">
            <Button
              variant="outlined"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{
                color: "black",
                borderColor: "black",
                borderRadius: 0,
                minWidth: "120px",
                cursor: "pointer",
                textTransform: "none",
                borderWidth: "1px",
                "&:hover": {
                  borderWidth: "1px",
                  borderColor: "black",
                  bgcolor: "rgba(0,0,0,0.05)",
                },
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </DialogContent>
        <AddTagModal
          isOpen={isTagModalOpen}
          onClose={() => setIsTagModalOpen(false)}
          onTagCreated={() => fetchMentionTags()}
        />
      </Dialog>

      <style>{`
        .ql-toolbar {
          border-top: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
          border-radius: 4px 4px 0 0;
          background-color: #fafafa;
        }

        .ql-container {
          border-bottom: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-left: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-right: 1px solid rgba(0, 0, 0, 0.23) !important;
          border-radius: 0 0 4px 4px;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        }

        .ql-editor {
          padding: 12px 14px;
          font-size: 14px;
          line-height: 1.5;
        }

        .ql-editor.ql-blank::before {
          color: rgba(0, 0, 0, 0.6);
          font-style: normal;
        }

        .ql-toolbar button:hover {
          color: #01569E;
        }

        .ql-toolbar button.ql-active {
          color: #01569E;
        }
      `}</style>
    </>
  );
};

export default AddOpportunityModal;
