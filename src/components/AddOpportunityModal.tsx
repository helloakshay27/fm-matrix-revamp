import React, { useEffect, useRef, useState, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Slide,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
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
import { Button } from "./ui/button";
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
  prefillData?: {
    title?: string;
    description?: string;
    responsible_person?: {
      id: string;
    };
    target_date?: string;
    tags?: Array<{
      company_tag_id: number;
      company_tag: {
        name: string;
      };
    }>;
  };
  isInlineMode?: boolean;
  className?: string;
}

const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({
  open,
  onClose,
  onSuccess,
  prefillData,
  isInlineMode = false,
  className = "",
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

  // Prefill form with data when modal opens
  useEffect(() => {
    if (open && prefillData) {
      if (prefillData.title) {
        setTitle(prefillData.title);
      }
      if (prefillData.description) {
        setDescription(prefillData.description);
        // Update Quill editor with description
        if (quillEditorRef.current) {
          quillEditorRef.current.root.innerHTML = prefillData.description;
        }
      }
      if (prefillData.responsible_person?.id) {
        setResponsiblePerson(prefillData.responsible_person.id);
      }
      if (prefillData.tags && prefillData.tags.length > 0) {
        const selectedTags = prefillData.tags.map((tag: any) => ({
          label: tag.company_tag.name,
          value: tag.company_tag_id,
        }));
        setTags(selectedTags);
      }
    } else if (!open) {
      // Reset form when modal closes
      setTitle("");
      setDescription("");
      setResponsiblePerson("");
      setTags([]);
      setObservers([]);
      setAttachments([]);
    }
  }, [open, prefillData])

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
      {isInlineMode ? (
        // Inline form mode for use within TodoConvertModal
        <div className={`space-y-4 ${className}`}>
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
                renderSuggestion={(
                  suggestion,
                  search,
                  highlightedDisplay,
                  index,
                  focused
                ) => (
                  <div
                    className={`px-3 py-1.5 ${focused ? "bg-orange-200" : "bg-white"
                      }`}
                  >
                    {highlightedDisplay}
                  </div>
                )}
              />
              <Mention
                trigger="#"
                data={tagData}
                renderSuggestion={(
                  suggestion,
                  search,
                  highlightedDisplay,
                  index,
                  focused
                ) => (
                  <div
                    className={`px-3 py-1.5 ${focused ? "bg-orange-200" : "bg-white"
                      }`}
                  >
                    {highlightedDisplay}
                  </div>
                )}
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
                      setBaseValue(description);
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
            <div ref={quillRef} style={{ height: "200px" }} />
          </div>

          {/* Responsible Person */}
          <div>
            <Typography variant="subtitle2" className="font-medium mb-2">
              Responsible Person <span className="text-red-500">*</span>
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                label="Select Responsible Person"
                value={responsiblePerson}
                onChange={(e) => setResponsiblePerson(e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Responsible Person</em>
                </MenuItem>
                {userOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Typography variant="subtitle2" className="font-medium">
                Tags
              </Typography>
              <label
                onClick={() => setIsTagModalOpen(true)}
                className="text-xs text-red-500 cursor-pointer hover:underline"
              >
                Create new tag
              </label>
            </div>
            <MuiMultiSelect
              options={mentionTags.map((tag) => {
                if ('id' in tag && 'name' in tag) {
                  return {
                    value: tag.id,
                    label: tag.name,
                    id: tag.id,
                  };
                }
                return {
                  value: tag.value || tag.id,
                  label: tag.label || tag.name,
                  id: tag.value || tag.id,
                };
              })}
              value={tags}
              onChange={(values) => handleMultiSelectChange("tags", values)}
              placeholder="Select Tags"
            />
          </div>

          {/* Observers */}
          <div>
            <Typography variant="subtitle2" className="font-medium mb-2">
              Observers
            </Typography>
            <MuiMultiSelect
              options={userOptions}
              value={observers}
              onChange={(values) => handleMultiSelectChange("observers", values)}
              placeholder="Select Observers"
            />
          </div>

          {/* Attachments */}
          <div>
            <Typography variant="subtitle2" className="font-medium mb-2">
              Attachments
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload size={18} className="mr-2" />
              Upload Files
            </Button>

            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <span className="text-sm">{file.name}</span>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-red-700 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Opportunity"}
            </Button>
          </div>
        </div>
      ) : (
        // Modal mode for standalone use
        <Dialog
          open={open}
          onClose={onClose}
          TransitionComponent={Transition}
          fullScreen
          PaperProps={{
            style: {
              position: "fixed",
              right: 0,
              top: 0,
              height: "100%",
              width: "40rem",
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
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#C72030] hover:bg-red-700 text-white"
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
            <div className="p-6 pt-0 flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#C72030] hover:bg-red-700 text-white"
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
      )}

      <AddTagModal
        isOpen={isTagModalOpen}
        onClose={() => setIsTagModalOpen(false)}
        onTagCreated={() => fetchMentionTags()}
      />

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
