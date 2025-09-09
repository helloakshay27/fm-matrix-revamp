import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, ArrowLeft, CheckCircle, Upload, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
import { ticketManagementAPI } from "@/services/ticketManagementAPI";
import {
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  FormControlLabel,
  Switch,
  SelectChangeEvent,
} from "@mui/material";

// --- Interface Definitions ---
interface AnswerOption {
  text: string;
  type: "P" | "N";
}

interface Question {
  id?: string;
  text: string;
  answerType: string;
  mandatory: boolean;
  answerOptions?: AnswerOption[];
  rating?: number;
  selectedEmoji?: string;
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

interface CategoryResponse {
  id: number;
  name: string;
  description: string;
  active: boolean;
  tag_created_at: string;
  tag_updated_at: string;
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

export const EditSurveyPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast: hookToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [checkType, setCheckType] = useState("");
  const [createTicket, setCreateTicket] = useState(false);
  const [ticketCategory, setTicketCategory] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [ticketCategories, setTicketCategories] = useState<CategoryResponse[]>(
    []
  );
  const [fmUsers, setFmUsers] = useState<
    { id: number; firstname: string; lastname: string; email?: string }[]
  >([]);
  const [loadingTicketCategories, setLoadingTicketCategories] = useState(false);
  const [loadingFmUsers, setLoadingFmUsers] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", text: "", answerType: "", mandatory: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchSurveyData();
    }
  }, [id]);

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
      setFmUsers(response.fm_users || []);
      console.log("FM users loaded:", response.fm_users);
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

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/snag_audit_categories.json");
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      hookToast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    }
  };

  const fetchSurveyData = async () => {
    try {
      const response = await apiClient.get(
        `/pms/admin/snag_checklists/${id}.json`
      );
      const surveyData = response.data;

      // Populate form fields with fetched data
      setTitle(surveyData.name);
      // Map check_type properly - handle survey and patrolling types
      const mappedCheckType =
        surveyData.check_type === "survey"
          ? "survey"
          : surveyData.check_type === "patrolling"
          ? "patrolling"
          : surveyData.check_type || "";
      setCheckType(mappedCheckType);

      // Check if ticket creation is enabled based on existing data
      const hasTicketConfig = surveyData.snag_questions?.some(
        (q: any) => q.ticket_configs
      );
      setCreateTicket(hasTicketConfig);

      if (hasTicketConfig && surveyData.snag_questions?.[0]?.ticket_configs) {
        const ticketConfig = surveyData.snag_questions[0].ticket_configs;
        setTicketCategory(ticketConfig.category || "");
        setAssignTo(ticketConfig.assigned_to || "");
      }

      // Map snag_questions to component questions format
      const mappedQuestions =
        surveyData.snag_questions?.map((q: any) => ({
          id: q.id.toString(),
          text: q.descr,
          answerType:
            q.qtype === "multiple"
              ? "multiple-choice"
              : q.qtype === "input"
              ? "input-box"
              : q.qtype === "rating"
              ? "rating"
              : q.qtype === "emoji"
              ? "emojis"
              : q.qtype === "text"
              ? "input-box"
              : q.qtype === "description"
              ? "description"
              : "description",
          mandatory: q.quest_mandatory,
          answerOptions:
            q.snag_quest_options?.map((option: any) => ({
              text: option.qname,
              type: option.option_type === "p" ? "P" : "N",
            })) || [],
          rating: q.qtype === "rating" ? q.rating || 5 : undefined,
          selectedEmoji:
            q.qtype === "emoji" ? q.selected_emoji || "😊" : undefined,
        })) || [];

      setQuestions(
        mappedQuestions.length > 0
          ? mappedQuestions
          : [{ id: "1", text: "", answerType: "", mandatory: false }]
      );
      setInitialLoading(false);
    } catch (error) {
      console.error("Error fetching survey data:", error);
      hookToast({
        title: "Error",
        description: "Failed to fetch survey data",
        variant: "destructive",
      });
      setInitialLoading(false);
    }
  };

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
            value === "multiple-choice" &&
            !updatedQuestion.answerOptions
          ) {
            updatedQuestion.answerOptions = [
              { text: "", type: "P" },
              { text: "", type: "P" },
            ];
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

  const handleAddAnswerOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answerOptions: [
                ...(q.answerOptions || []),
                { text: "", type: "P" },
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

  const handleUpdateSurvey = async () => {
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
      if (!assignTo) {
        toast.error("Validation Error", {
          description: "Please select who to assign the ticket to",
          duration: 3000,
        });
        return;
      }
    }

    try {
      setLoading(true);
      setIsSubmitting(true);

      // Create FormData for multipart/form-data request matching server expectations
      const formData = new FormData();

      // Add basic survey data as individual form fields
      formData.append("snag_checklist[name]", title);
      formData.append("snag_checklist[check_type]", checkType);

      // Add ticket creation fields if enabled
      if (createTicket) {
        formData.append("create_ticket", "true");
        formData.append("category_name", ticketCategory);
        formData.append("category_type", assignTo);
      }

      // Process questions with proper FormData structure
      let fileCounter = 0;

      questions.forEach((question, questionIndex) => {
        // Add question basic fields
        formData.append(`question[][descr]`, question.text);

        const qtype =
          question.answerType === "multiple-choice"
            ? "multiple"
            : question.answerType === "input-box"
            ? "input"
            : question.answerType === "rating"
            ? "rating"
            : question.answerType === "emojis"
            ? "emoji"
            : "description";

        formData.append(`question[][qtype]`, qtype);
        formData.append(
          `question[][quest_mandatory]`,
          question.mandatory.toString()
        );
        formData.append(`question[][image_mandatory]`, "false");

        // Add multiple choice options
        if (
          question.answerType === "multiple-choice" &&
          question.answerOptions
        ) {
          question.answerOptions.forEach((option, optionIndex) => {
            formData.append(
              `question[][quest_options][][option_name]`,
              option.text
            );
            formData.append(
              `question[][quest_options][][option_type]`,
              option.type.toLowerCase()
            );
          });
        }

        // Add rating
        if (question.answerType === "rating" && question.rating) {
          formData.append(`question[][rating]`, question.rating.toString());
        }
      });

      console.log(
        "Question updated with FormData:",
        Array.from(formData.entries())
      );

      const response = await apiClient.put(
        `/pms/admin/snag_checklists/${id}.json`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Question updated successfully:", response.data);

      // Show success toast
      toast.success("Question Updated Successfully!", {
        description: "Your Question has been updated.",
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 4000,
      });

      navigate("/master/survey/list");
    } catch (error) {
      console.error("Error updating survey:", error);

      // Show detailed error message
      if (error.response) {
        toast.error("Update Failed", {
          description: `Server error: ${error.response.status} - ${
            error.response.data?.message || "Unknown error"
          }`,
          duration: 5000,
        });
      } else if (error.request) {
        toast.error("Network Error", {
          description: "No response from server. Please check your connection.",
          duration: 5000,
        });
      } else {
        toast.error("Error", {
          description:
            "An unexpected error occurred while updating the survey.",
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleProceed = async () => {
    await handleUpdateSurvey();
  };

  const EMOJIS = ["😞", "😟", "😐", "😊", "😁"];

  if (initialLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <div>Loading survey data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/master/survey/list")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Information Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <TextField
                  label="Title/Question Name"
                  fullWidth
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={fieldStyles}
                />
              </div>

              <div className="space-y-2">
                <FormControl fullWidth sx={fieldStyles}>
                  <InputLabel id="check-type-label">
                    Select Check Type
                  </InputLabel>
                  <MuiSelect
                    labelId="check-type-label"
                    id="checkType"
                    value={checkType}
                    label="Select Check Type"
                    onChange={(e) => setCheckType(e.target.value)}
                  >
                    <MenuItem value="survey">Survey</MenuItem>
                    <MenuItem value="patrolling">Patrolling</MenuItem>
                  </MuiSelect>
                </FormControl>
              </div>
            </div>

            {/* Ticket Creation Configuration */}
            <div className="space-y-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={createTicket}
                    onChange={(e) => setCreateTicket(e.target.checked)}
                    color="primary"
                  />
                }
                label="Create Ticket on Question Response"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "16px",
                    fontWeight: 500,
                  },
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#C72030",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#C72030",
                  },
                }}
              />

              {createTicket && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-2">
                    <FormControl fullWidth sx={fieldStyles}>
                      <InputLabel id="ticket-category-label">
                        Ticket Category
                      </InputLabel>
                      <MuiSelect
                        labelId="ticket-category-label"
                        id="ticketCategory"
                        value={ticketCategory}
                        label="Select Category"
                        onChange={(e) => setTicketCategory(e.target.value)}
                        disabled={loadingTicketCategories}
                      >
                        {ticketCategories.map((category) => (
                          <MenuItem key={category.id} value={category.name}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>

                  <div className="space-y-2">
                    <FormControl fullWidth sx={fieldStyles}>
                      <InputLabel id="assign-to-label">
                       Assign To
                      </InputLabel>
                      <MuiSelect
                        labelId="assign-to-label"
                        id="assignTo"
                        value={assignTo}
                        label="Select Engineer"
                        onChange={(e) => setAssignTo(e.target.value)}
                        disabled={loadingFmUsers}
                      >
                        {fmUsers.map((user) => (
                          <MenuItem
                            key={user.id}
                            value={`${user.firstname} ${user.lastname}`}
                          >
                            {user.firstname} {user.lastname}
                            {user.email && ` (${user.email})`}
                          </MenuItem>
                        ))}
                      </MuiSelect>
                    </FormControl>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Questions Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    Add No. of Questions
                  </span>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded">
                    <span className="text-sm">
                      {questions.length.toString().padStart(2, "0")}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleAddQuestion}
                      className="p-1 h-6 w-6"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm">No. of Questions</span>
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {questions.length}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {questions.map((question, index) => (
                  <Card key={question.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-black">
                          Question {index + 1}
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveQuestion(question.id!)}
                          className="p-1 h-6 w-6"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={question.text}
                        onChange={(e) =>
                          handleQuestionChange(
                            question.id!,
                            "text",
                            e.target.value
                          )
                        }
                        placeholder="Enter your Question"
                        className="min-h-20"
                      />

                      <div className="space-y-2">
                        <Label>Select Answer Type</Label>
                        <Select
                          value={question.answerType}
                          onValueChange={(value) =>
                            handleQuestionChange(
                              question.id!,
                              "answerType",
                              value
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose Answer Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="description">
                              Description Box
                            </SelectItem>
                            <SelectItem value="multiple-choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="input-box">Input Box</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="emojis">Emojis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Multiple Choice Options */}
                      {question.answerType === "multiple-choice" && (
                        <div className="space-y-3">
                          <Label>Answer Options</Label>
                          {question.answerOptions?.map(
                            (option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <Input
                                  value={option.text}
                                  onChange={(e) =>
                                    handleAnswerOptionChange(
                                      question.id!,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter option"
                                  className="flex-1"
                                />
                                <Select
                                  value={option.type}
                                  onValueChange={(value: "P" | "N") =>
                                    handleAnswerOptionTypeChange(
                                      question.id!,
                                      optionIndex,
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-20">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="P">P</SelectItem>
                                    <SelectItem value="N">N</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleRemoveAnswerOption(
                                      question.id!,
                                      optionIndex
                                    )
                                  }
                                  className="p-2"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAddAnswerOption(question.id!)}
                            className="p-0 h-auto font-medium"
                            style={{ color: "#C72030" }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Option
                          </Button>
                        </div>
                      )}

                      {/* Rating */}
                      {question.answerType === "rating" && (
                        <div className="space-y-3">
                          <Label>Rating Scale</Label>
                          <div className="flex items-center gap-2">
                            <Select
                              value={question.rating?.toString() || "5"}
                              onValueChange={(value) =>
                                handleQuestionChange(
                                  question.id!,
                                  "rating",
                                  parseInt(value)
                                )
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3">1-3</SelectItem>
                                <SelectItem value="5">1-5</SelectItem>
                                <SelectItem value="10">1-10</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-1">
                              {Array.from(
                                { length: question.rating || 5 },
                                (_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 text-yellow-400 fill-current"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Emojis */}
                      {question.answerType === "emojis" && (
                        <div className="space-y-3">
                          <Label>Selected Emoji Style</Label>
                          <div className="flex gap-2">
                            {EMOJIS.map((emoji, emojiIndex) => (
                              <button
                                key={emojiIndex}
                                type="button"
                                onClick={() =>
                                  handleQuestionChange(
                                    question.id!,
                                    "selectedEmoji",
                                    emoji
                                  )
                                }
                                className={`text-2xl p-2 rounded border ${
                                  question.selectedEmoji === emoji
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`mandatory-${question.id}`}
                          checked={question.mandatory}
                          onCheckedChange={(checked) =>
                            handleQuestionChange(
                              question.id!,
                              "mandatory",
                              checked
                            )
                          }
                        />
                        <Label
                          htmlFor={`mandatory-${question.id}`}
                          className="text-sm text-black"
                        >
                          Mandatory
                        </Label>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleAddQuestion}
                  variant="outline"
                  className="border-dashed border-red-400 text-red-600 hover:bg-red-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Questions
                </Button>
              </div>

              <div className="flex justify-center gap-4 pt-6">
                <Button
                  onClick={handleUpdateSurvey}
                  disabled={loading || isSubmitting}
                  className="bg-red-600 hover:bg-red-700 text-white px-8"
                >
                  {loading || isSubmitting ? "Updating..." : "Update Question"}
                </Button>
                <Button
                  onClick={() => navigate("/master/survey/list")}
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 px-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
