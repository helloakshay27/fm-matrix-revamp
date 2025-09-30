import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Star, ClipboardList, HelpCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import {
  ticketManagementAPI,
  CategoryResponse,
} from "@/services/ticketManagementAPI";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
} from "@mui/material";

// --- Interface Definitions ---
interface AnswerOption {
  text: string;
  type: "P" | "N";
}

interface Question {
  id: string;
  text: string;
  answerType: string;
  mandatory: boolean;
  answerOptions?: AnswerOption[];
  additionalFieldOnNegative?: boolean;
  additionalFields?: Array<{
    title: string;
    files: File[];
  }>;
}

interface Category {
  id: number;
  name: string;
}

// --- Field Styles for Material-UI Components ---
const fieldStyles = {
  height: "48px",
  backgroundColor: "#fff",
  borderRadius: "8px",
  "& .MuiOutlinedInput-root": {
    height: "48px",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#C72030",
    },
  },
};

const textareaStyles = {
  ...fieldStyles,
  height: "auto",
  "& .MuiOutlinedInput-root": {
    height: "auto",
    minHeight: "80px",
    padding: "16.5px 14px",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#C72030",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#C72030",
    },
  },
};

export const AddSurveyPage = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [checkType, setCheckType] = useState("");
  const [createTicket, setCreateTicket] = useState(false);
  const [ticketCategory, setTicketCategory] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [ticketCategories, setTicketCategories] = useState<CategoryResponse[]>([]);
  const [fmUsers, setFmUsers] = useState<
    { full_name: string; id: number; firstname: string; lastname: string; email?: string }[]
  >([]);
  const [loadingTicketCategories, setLoadingTicketCategories] = useState(false);
  const [loadingFmUsers, setLoadingFmUsers] = useState(false);
  const [additionalTitle, setAdditionalTitle] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "", answerType: "", mandatory: false },
  ]);
  // File upload state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };
  const removeSelectedFile = (index: number) => {
    setSelectedFiles((files) => files.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/snag_audit_categories.json");
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Load ticket categories when createTicket is enabled
  const loadTicketCategories = useCallback(async () => {
    if (!createTicket) return;

    setLoadingTicketCategories(true);
    try {
      const response = await ticketManagementAPI.getCategories();
      setTicketCategories(response.helpdesk_categories || []);
      console.log("Ticket categories loaded:", response.helpdesk_categories);
    } catch (error) {
      console.error("Error loading ticket categories:", error);
    } finally {
      setLoadingTicketCategories(false);
    }
  }, [createTicket]);

  // Load FM users for assign to dropdown
  const loadFMUsers = useCallback(async () => {
    if (!createTicket) return;

    setLoadingFmUsers(true);
    try {
      const response = await ticketManagementAPI.getEngineers();
      setFmUsers(response.users || response.fm_users || []);
      console.log("FM users loaded:", response.users || response.fm_users);
    } catch (error) {
      console.error("Error loading FM users:", error);
    } finally {
      setLoadingFmUsers(false);
    }
  }, [createTicket]);

  // Load ticket data when createTicket checkbox is checked
  useEffect(() => {
    if (createTicket) {
      loadTicketCategories();
      loadFMUsers();
    } else {
      // Reset selections when unchecked
      setTicketCategory("");
      setAssignTo("");
    }
  }, [createTicket, loadTicketCategories, loadFMUsers]);

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      answerType: "",
      mandatory: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleQuestionChange = (
    id: string,
    field: keyof Question,
    value: string | boolean | number | AnswerOption[]
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const updatedQuestion = { ...q, [field]: value };
          if (
            field === "answerType" &&
            ["multiple-choice", "rating", "emojis"].includes(value as string) &&
            !updatedQuestion.answerOptions
          ) {
            updatedQuestion.answerOptions = [
              { text: "", type: "P" },
              { text: "", type: "P" },
            ];
          } else if (
            field === "answerType" &&
            !["multiple-choice", "rating", "emojis"].includes(value as string)
          ) {
            updatedQuestion.answerOptions = undefined;
          }
          if (
            field === "additionalFieldOnNegative" &&
            value === true &&
            !updatedQuestion.additionalFields
          ) {
            updatedQuestion.additionalFields = [{ title: "", files: [] }];
          }
          return updatedQuestion;
        }
        return q;
      })
    );
  };

  // Additional field handlers
  const handleAddAdditionalField = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: [
                ...(q.additionalFields || []),
                { title: "", files: [] },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveAdditionalField = (
    questionId: string,
    fieldIndex: number
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.filter(
                (_, index) => index !== fieldIndex
              ),
            }
          : q
      )
    );
  };

  const handleAdditionalFieldTitleChange = (
    questionId: string,
    fieldIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.map((field, index) =>
                index === fieldIndex ? { ...field, title: value } : field
              ),
            }
          : q
      )
    );
  };

  const handleAdditionalFieldFilesChange = (
    questionId: string,
    fieldIndex: number,
    files: File[]
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.map((field, index) =>
                index === fieldIndex ? { ...field, files } : field
              ),
            }
          : q
      )
    );
  };

  const removeAdditionalFieldFile = (
    questionId: string,
    fieldIndex: number,
    fileIndex: number
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              additionalFields: q.additionalFields?.map((field, index) =>
                index === fieldIndex
                  ? {
                      ...field,
                      files: field.files.filter((_, i) => i !== fileIndex),
                    }
                  : field
              ),
            }
          : q
      )
    );
  };

  const EMOJIS = ["😞", "😟", "😐", "😊", "😁"];
  const RATINGS = ["1", "2", "3", "4", "5"];
  const RATING_STARS = ["1-star", "2-star", "3-star", "4-star", "5-star"];

  const handleAddAnswerOption = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const currentOptionsCount = question.answerOptions?.length || 0;
    if (currentOptionsCount >= 5) return; // Limit to 5 options

    // Always start with empty text to allow user input for both ratings and emojis
    const newOptionText = "";

    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: [
                ...(q.answerOptions || []),
                { text: newOptionText, type: "P" },
              ],
            }
          : q
      )
    );
  };

  const handleRemoveAnswerOption = (
    questionId: string,
    optionIndex: number
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: q.answerOptions?.filter(
                (_, index) => index !== optionIndex
              ),
            }
          : q
      )
    );
  };

  const handleAnswerOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: q.answerOptions?.map((option, index) =>
                index === optionIndex ? { ...option, text: value } : option
              ),
            }
          : q
      )
    );
  };

  const handleAnswerOptionTypeChange = (
    questionId: string,
    optionIndex: number,
    value: "P" | "N"
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: q.answerOptions?.map((option, index) =>
                index === optionIndex ? { ...option, type: value } : option
              ),
            }
          : q
      )
    );
  };

  const handleCreateSurvey = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Validation Error", {
        description: "Please enter a title for the survey",
        duration: 3000,
      });
      return;
    }
    if (!checkType) {
      toast.error("Validation Error", {
        description: "Please select a check type",
        duration: 3000,
      });
      return;
    }

    // Validate ticket fields if create ticket is checked
    if (createTicket) {
      if (!ticketCategory) {
        toast.error("Validation Error", {
          description: "Please select a ticket category",
          duration: 3000,
        });
        return;
      }
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.text.trim()) {
        toast.error("Validation Error", {
          description: `Please enter text for Question ${i + 1}`,
          duration: 3000,
        });
        return;
      }
      if (!question.answerType) {
        toast.error("Validation Error", {
          description: `Please select an answer type for Question ${i + 1}`,
          duration: 3000,
        });
        return;
      }

      // Check if multiple-choice, rating, or emojis have at least one option with text
      if (["multiple-choice", "rating", "emojis"].includes(question.answerType)) {
        if (!question.answerOptions || question.answerOptions.length === 0) {
          toast.error("Validation Error", {
            description: `Please add at least one option for Question ${i + 1}`,
            duration: 3000,
          });
          return;
        }
        // Check if all options have text
        for (let j = 0; j < question.answerOptions.length; j++) {
          if (!question.answerOptions[j].text.trim()) {
            toast.error("Validation Error", {
              description: `Please enter text for option ${j + 1} in Question ${i + 1}`,
              duration: 3000,
            });
            return;
          }
        }
      }

      // Validate additional fields when "Additional Fields for Negative Selection" is checked
      if (question.additionalFieldOnNegative) {
        if (!question.additionalFields || question.additionalFields.length === 0) {
          toast.error("Validation Error", {
            description: `When "Additional Fields for Negative Selection" is enabled for Question ${i + 1}, at least one additional field is required`,
            duration: 3000,
          });
          return;
        }

        // Check that each additional field has both title and file
        for (let k = 0; k < question.additionalFields.length; k++) {
          const field = question.additionalFields[k];

          if (!field.title || !field.title.trim()) {
            toast.error("Validation Error", {
              description: `Please enter a title for additional field ${k + 1} in Question ${i + 1}`,
              duration: 3000,
            });
            return;
          }

          if (!field.files || field.files.length === 0) {
            toast.error("Validation Error", {
              description: `Please upload at least one file for additional field ${k + 1} in Question ${i + 1}`,
              duration: 3000,
            });
            return;
          }
        }
      }
    }

    try {
      setLoading(true);
      setIsSubmitting(true);

      // Create FormData for multipart/form-data request matching server expectations
      const formData = new FormData();

      // Add basic survey data as individual form fields
      formData.append('snag_checklist[name]', title);
      formData.append('snag_checklist[check_type]', checkType);

      // Add ticket creation fields
      formData.append('create_ticket', createTicket ? 'true' : 'false');
      if (createTicket) {
        formData.append('category_name', ticketCategory);
        formData.append('category_type', assignTo);
      }

      // Process questions with proper FormData structure
      let fileCounter = 0;

      questions.forEach((question, questionIndex) => {
        // Add question basic fields
        formData.append(`question[][descr]`, question.text);

        const qtype = question.answerType === "multiple-choice"
          ? "multiple"
          : question.answerType === "rating"
          ? "rating"
          : question.answerType === "emojis"
          ? "emoji"
          : "description";

        formData.append(`question[][qtype]`, qtype);
        formData.append(`question[][quest_mandatory]`, question.mandatory.toString());
        formData.append(`question[][image_mandatory]`, 'false');

        // Add options for multiple-choice, rating, and emojis
        if (["multiple-choice", "rating", "emojis"].includes(question.answerType) && question.answerOptions) {
          question.answerOptions.forEach((option, optionIndex) => {
            formData.append(`question[][quest_options][][option_name]`, option.text);
            formData.append(`question[][quest_options][][option_type]`, option.type.toLowerCase());
          });
        }

        // Handle additional fields with files (generic_tags)
        if (question.additionalFieldOnNegative && question.additionalFields && question.additionalFields.length > 0) {
          question.additionalFields.forEach((field, fieldIndex) => {
            // Add generic tag metadata
            formData.append(`question[][generic_tags][][category_name]`, field.title);
            formData.append(`question[][generic_tags][][category_type]`, 'questions');
            formData.append(`question[][generic_tags][][tag_type]`, 'not generic');
            formData.append(`question[][generic_tags][][active]`, 'true');

            // Add files as icons array
            if (field.files && field.files.length > 0) {
              field.files.forEach((file, fileIndex) => {
                formData.append(`question[][generic_tags][][icons][]`, file);
                fileCounter++;
              });
            }
          });
        }
      });

      // Add file count for server reference
      formData.append('total_files', fileCounter.toString());

      // Debug logging
      console.log('\n=== FORMDATA STRUCTURE DEBUG ===');
      console.log('1. Survey Basic Fields:');
      console.log('   snag_checklist[name]:', title);
      console.log('   snag_checklist[check_type]:', checkType);
      console.log('   create_ticket:', createTicket ? 'true' : 'false');
      if (createTicket) {
        console.log('   category_name:', ticketCategory);
        console.log('   category_type:', assignTo);
      }

      console.log('\n2. Questions Structure:');
      questions.forEach((question, qIndex) => {
        console.log(`   Question ${qIndex + 1}:`);
        console.log(`   question[][descr]: "${question.text}"`);
        console.log(`   question[][qtype]: ${question.answerType === "multiple-choice" ? "multiple" : question.answerType === "rating" ? "rating" : question.answerType === "emojis" ? "emoji" : "description"}`);
        console.log(`   question[][quest_mandatory]: ${question.mandatory}`);

        if (["multiple-choice", "rating", "emojis"].includes(question.answerType) && question.answerOptions) {
          question.answerOptions.forEach((option, optIndex) => {
            console.log(`   question[][quest_options][][option_name]: "${option.text}"`);
            console.log(`   question[][quest_options][][option_type]: ${option.type.toLowerCase()}`);
          });
        }

        if (question.additionalFieldOnNegative && question.additionalFields) {
          question.additionalFields.forEach((field, fIndex) => {
            console.log(`   question[][generic_tags][][category_name]: "${field.title}"`);
            console.log(`   question[][generic_tags][][category_type]: questions`);
            console.log(`   question[][generic_tags][][tag_type]: not generic`);
            if (field.files && field.files.length > 0) {
              console.log(`   question[][generic_tags][][icons][]: ${field.files.length} files`);
              field.files.forEach((file, fileIndex) => {
                console.log(`     - File ${fileIndex}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
              });
            }
          });
        }
      });

      console.log('\n3. All FormData Keys:');
      const allKeys = Array.from(formData.keys()).sort();
      allKeys.forEach(key => {
        if (key.includes('[icons][]')) {
          console.log(`   ${key}: [File Object]`);
        } else {
          console.log(`   ${key}: ${formData.get(key)}`);
        }
      });

      console.log(`\n4. Summary:`);
      console.log(`   Total FormData fields: ${allKeys.length}`);
      console.log(`   Total files: ${fileCounter}`);
      console.log(`   File keys: ${allKeys.filter(key => key.includes('[icons][]')).length}`);

      console.log(
        "\n5. FormData Request Summary:",
        {
          total_fields: Array.from(formData.keys()).length,
          total_files: fileCounter,
          file_fields: Array.from(formData.keys()).filter(key => key.includes('[icons][]')).length
        }
      );

      const response = await apiClient.post(
        "/pms/admin/snag_checklists.json",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log("Question created successfully:", response.data);

      // Show success toast
      toast.success("Question Created Successfully!", {
        description: "Your Question has been created and is now available.",
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 4000,
      });

      navigate("/master/survey/list");
    } catch (error) {
      console.error("Error creating survey:", error);

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toast.error("Failed to Create Survey", {
          description: error.response.data?.message || error.response.statusText || "Unknown error occurred",
          duration: 5000,
        });
      } else if (error.request) {
        toast.error("Network Error", {
          description: "Unable to connect to server. Please check your connection.",
          duration: 5000,
        });
      } else {
        toast.error("Error", {
          description: error.message || "An unexpected error occurred",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Helper function to check if a string is a valid emoji
  const isValidEmoji = (text: string) => {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Emoji}\u200D]/u;
    return emojiRegex.test(text) && text.length <= 4; // Assuming single emoji or simple combination
  };

  // Helper function to render stars based on number
  const renderStars = (text: string) => {
    const num = parseInt(text, 10);
    if (isNaN(num) || num < 1 || num > 5) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < num ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{num} Star{num !== 1 ? 's' : ''}</span>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Question</h1>
      </div>

      <div className="space-y-6">
        {/* Section 1: Survey Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: "#E5E0D3" }}
              >
                <ClipboardList size={16} color="#C72030" />
              </span>
              Question Setup
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                label="Title"
                placeholder="Enter the title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
                required
                InputLabelProps={{ 
                  shrink: true,
                  sx: { '& .MuiInputLabel-asterisk': { color: '#ef4444' } }
                }}
                InputProps={{ sx: fieldStyles }}
              />

              <FormControl
                fullWidth
                variant="outlined"
                required
                sx={{ 
                  "& .MuiInputBase-root": fieldStyles,
                  "& .MuiInputLabel-asterisk": { color: "#ef4444" }
                }}
              >
                <InputLabel shrink>Check Type</InputLabel>
                <MuiSelect
                  value={checkType}
                  onChange={(e) => setCheckType(e.target.value)}
                  label="Check Type*"
                  notched
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Check Type
                  </MenuItem>
                  <MenuItem value="patrolling">Patrolling</MenuItem>
                  <MenuItem value="survey">Survey</MenuItem>
                </MuiSelect>
              </FormControl>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create-ticket"
                  checked={createTicket}
                  onCheckedChange={(checked) =>
                    setCreateTicket(checked as boolean)
                  }
                />
                <label
                  htmlFor="create-ticket"
                  className="text-sm font-medium text-gray-700"
                >
                  Create Ticket
                </label>
              </div>
            </div>

            {/* Conditional Ticket Dropdowns */}
            {createTicket && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                <FormControl
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ 
                    "& .MuiInputBase-root": fieldStyles,
                    "& .MuiInputLabel-asterisk": { color: "#ef4444" }
                  }}
                >
                  <InputLabel shrink>Ticket Category</InputLabel>
                  <MuiSelect
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    label="Ticket Category*"
                    notched
                    displayEmpty
                    disabled={loadingTicketCategories}
                  >
                    <MenuItem value="">
                      {loadingTicketCategories
                        ? "Loading categories..."
                        : "Select Ticket Category"}
                    </MenuItem>
                    {ticketCategories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Questions */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: "#E5E0D3" }}
              >
                <HelpCircle size={16} color="#C72030" />
              </span>
              Questions
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">No. of Questions:</span>
              <span className="font-medium text-gray-900">
                {questions.length.toString().padStart(1, "0")}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div
              className={`grid gap-6 ${
                questions.length === 1
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50/50"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">Question {index + 1}</h3>
                    {questions.length > 1 && (
                      <Button
                        onClick={() => handleRemoveQuestion(question.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <TextField
                    label="Question Text"
                    placeholder="Enter your Question"
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(question.id, "text", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    required
                    InputLabelProps={{ 
                      shrink: true,
                      sx: { '& .MuiInputLabel-asterisk': { color: '#ef4444' } }
                    }}
                    InputProps={{ sx: textareaStyles }}
                  />

                  <FormControl
                    fullWidth
                    variant="outlined"
                    required
                    sx={{ 
                      "& .MuiInputBase-root": fieldStyles,
                      "& .MuiInputLabel-asterisk": { color: "#ef4444" }
                    }}
                  >
                    <InputLabel shrink>Answer Type</InputLabel>
                    <MuiSelect
                      value={question.answerType}
                      onChange={(e) =>
                        handleQuestionChange(
                          question.id,
                          "answerType",
                          e.target.value
                        )
                      }
                      label="Answer Type"
                      notched
                      displayEmpty
                    >
                      <MenuItem value="">Choose Answer Type</MenuItem>
                      <MenuItem value="multiple-choice">
                        Multiple Choice
                      </MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                      <MenuItem value="emojis">Emojis</MenuItem>
                    </MuiSelect>
                  </FormControl>

                  {["multiple-choice", "rating", "emojis"].includes(question.answerType) && (
                    <div className="space-y-3 pt-2">
                      <label className="text-sm font-medium text-gray-700">
                        {question.answerType === "rating" ? "Rating Options" : 
                         question.answerType === "emojis" ? "Emoji Options" : 
                         "Answer Options"}
                      </label>
                      {(question.answerOptions || []).map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                          {question.answerType === "emojis" ? (
                            <div className="flex items-center justify-center w-12 h-12">
                              <span className="text-3xl">{EMOJIS[index]}</span>
                            </div>
                          ) : question.answerType === "rating" ? (
                            <div className="flex items-center justify-center w-28 h-12">
                              <span className="text-base">{RATING_STARS[index]}</span>
                            </div>
                          ) : (
                            <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                              {question.answerType === "multiple-choice" ? index + 1 : "⭐"}
                            </div>
                          )}
                          <TextField
                            placeholder={
                              question.answerType === "rating" ? `Enter rating description` :
                              question.answerType === "emojis" ? `Enter description for ${EMOJIS[index]}` :
                              `Option ${index + 1}`
                            }
                            value={option.text}
                            onChange={(e) => {
                              const value = e.target.value;
                              handleAnswerOptionChange(question.id, index, value);
                            }}
                            fullWidth
                            variant="outlined"
                            InputProps={{
                              sx: { 
                                ...fieldStyles, 
                                height: "40px",
                                backgroundColor: 'white'
                              },
                            }}
                          />
                          <Select
                            value={option.type}
                            onValueChange={(value) =>
                              handleAnswerOptionTypeChange(
                                question.id,
                                index,
                                value as "P" | "N"
                              )
                            }
                          >
                            <SelectTrigger className="w-28 h-10 border-gray-300 rounded-md">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="P">P</SelectItem>
                              <SelectItem value="N">N</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            onClick={() =>
                              handleRemoveAnswerOption(question.id, index)
                            }
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-red-500 p-1 h-10 w-10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => handleAddAnswerOption(question.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 p-0 h-auto font-medium flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Option
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={`mandatory-${question.id}`}
                      checked={question.mandatory}
                      onCheckedChange={(checked) =>
                        handleQuestionChange(
                          question.id,
                          "mandatory",
                          checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor={`mandatory-${question.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Mandatory
                    </label>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={`additional-negative-${question.id}`}
                      checked={question.additionalFieldOnNegative || false}
                      onCheckedChange={(checked) =>
                        handleQuestionChange(
                          question.id,
                          "additionalFieldOnNegative",
                          checked as boolean
                        )
                      }
                    />
                    <label
                      htmlFor={`additional-negative-${question.id}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      Do you want to open additional field on negative selection
                    </label>
                  </div>

                  {question.additionalFieldOnNegative && (
                    <div className="space-y-3 pt-2 border-t border-gray-200 mt-4 pt-4">
                      <label className="text-sm font-medium text-gray-700">
                        Additional Fields for Negative Selection
                        <span className="text-xs text-gray-500 block mt-1">
                          Both title and file are required for each field
                        </span>
                      </label>

                      <div className="space-y-4">
                        {(question.additionalFields || []).map(
                          (field, fieldIndex) => {
                            const isOnlyField =
                              (question.additionalFields?.length || 0) === 1;
                            return (
                              <div
                                key={fieldIndex}
                                className={`grid gap-3 items-end ${
                                  isOnlyField
                                    ? "grid-cols-1 md:grid-cols-2"
                                    : "grid-cols-1 md:grid-cols-3"
                                }`}
                              >
                                <TextField
                                  label={
                                    <span>
                                      Title
                                      <span className="text-red-500 ml-1">*</span>
                                    </span>
                                  }
                                  placeholder="Enter title"
                                  value={field.title}
                                  onChange={(e) =>
                                    handleAdditionalFieldTitleChange(
                                      question.id,
                                      fieldIndex,
                                      e.target.value
                                    )
                                  }
                                  fullWidth
                                  variant="outlined"
                                  InputLabelProps={{ shrink: true }}
                                  InputProps={{
                                    sx: { ...fieldStyles, height: "36px" },
                                  }}
                                />

                                <div className="relative">
                                  <TextField
                                    label={
                                      <span>
                                        Upload File
                                        <span className="text-red-500 ml-1">*</span>
                                      </span>
                                    }
                                    value={
                                      field.files.length > 0
                                        ? `${field.files.length} file(s) selected`
                                        : "Choose File: No file chosen"
                                    }
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                      sx: {
                                        ...fieldStyles,
                                        height: "36px",
                                        cursor: "pointer",
                                        "& input": {
                                          color:
                                            field.files.length > 0
                                              ? "#C72030"
                                              : "inherit",
                                          fontWeight:
                                            field.files.length > 0
                                              ? "500"
                                              : "normal",
                                          cursor: "pointer",
                                        },
                                      },
                                      readOnly: true,
                                    }}
                                    onClick={() =>
                                      !isSubmitting && document
                                        .getElementById(
                                          `additional-file-${question.id}-${fieldIndex}`
                                        )
                                        ?.click()
                                    }
                                    style={{ cursor: isSubmitting ? "not-allowed" : "pointer" }}
                                  />
                                  <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    id={`additional-file-${question.id}-${fieldIndex}`}
                                    onChange={(e) => {
                                      if (e.target.files && !isSubmitting) {
                                        handleAdditionalFieldFilesChange(
                                          question.id,
                                          fieldIndex,
                                          Array.from(e.target.files)
                                        );
                                      }
                                    }}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv"
                                    disabled={isSubmitting}
                                  />
                                </div>

                                {!isOnlyField && (
                                  <div className="flex items-center justify-center">
                                    <Button
                                      onClick={() =>
                                        handleRemoveAdditionalField(
                                          question.id,
                                          fieldIndex
                                        )
                                      }
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-400 hover:text-red-500 p-1 h-6 w-6"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}

                                {/* File thumbnails and names list */}
                                {field.files.length > 0 && (
                                  <div className="col-span-full space-y-2 mt-2">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                      {field.files.map((file, fileIndex) => {
                                        const isImage = file.type.startsWith('image/');
                                        const isPdf = file.type === 'application/pdf';
                                        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv');
                                        const fileURL = isImage ? URL.createObjectURL(file) : null;
                                        
                                        return (
                                          <div
                                            key={`${file.name}-${file.lastModified}`}
                                            className="relative group border border-gray-200 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition-colors"
                                          >
                                            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2">
                                              {isImage && fileURL ? (
                                                <img
                                                  src={fileURL}
                                                  alt={file.name}
                                                  className="w-full h-full object-cover rounded border"
                                                  onLoad={() => URL.revokeObjectURL(fileURL)}
                                                />
                                              ) : isPdf ? (
                                                <div className="w-full h-full flex items-center justify-center border rounded text-red-600 bg-white">
                                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6c-1.1 0-2 .9-2 2z"/>
                                                    <path d="M14 2v6h6"/>
                                                  </svg>
                                                </div>
                                              ) : isExcel ? (
                                                <div className="w-full h-full flex items-center justify-center border rounded text-green-600 bg-white">
                                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect width="20" height="20" x="2" y="2" rx="2"/>
                                                    <path d="M8 11h8M8 15h8"/>
                                                  </svg>
                                                </div>
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center border rounded text-gray-600 bg-white">
                                                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M4 4v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6H6c-1.1 0-2 .9-2 2z"/>
                                                    <path d="M14 2v6h6"/>
                                                  </svg>
                                                </div>
                                              )}
                                            </div>
                                            
                                            <div className="text-center">
                                              <p className="text-xs text-gray-700 truncate" title={file.name}>
                                                {file.name}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                              </p>
                                            </div>
                                            
                                            <button
                                              type="button"
                                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                              onClick={() => removeAdditionalFieldFile(question.id, fieldIndex, fileIndex)}
                                              disabled={isSubmitting}
                                              title="Remove file"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>

                      <Button
                        onClick={() => handleAddAdditionalField(question.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 p-0 h-auto font-medium flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add More Field
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={handleAddQuestion}
                variant="outline"
                className="border-dashed border-gray-300 hover:border-red-400 hover:text-red-600"
              >
                <Plus className="w-4 h-4 mr-2" /> Add More Questions
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6">
          <Button
            onClick={handleCreateSurvey}
            disabled={loading || isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 h-auto disabled:opacity-50"
          >
            {(loading || isSubmitting) ? "Creating..." : "Create Survey"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={loading || isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-2 h-auto disabled:opacity-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};