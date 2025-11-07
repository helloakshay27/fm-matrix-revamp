import React, { useEffect, useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox as MuiCheckbox,
  Button as MuiButton,
  Typography,
  Box,
  FormLabel,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import { Button } from "@/components/ui/button";
import { AttachFile, ArrowBack, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { fetchUserGroups } from "@/store/slices/userGroupSlice";
import { createEvent } from "@/store/slices/eventSlice";

export const AddEventPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    venue: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    markAsImportant: false,
    sendEmail: false,
    shareWith: "all",
    rsvpEnabled: true,
    selectedIndividuals: [],
    selectedGroups: [],
  });
  const [attachemnts, setAttachemnts] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(fetchFMUsers()).unwrap();
        setUsers(response.users);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users")
      }
    }

    const fetchGroups = async () => {
      try {
        const response = await dispatch(fetchUserGroups({ baseUrl, token })).unwrap();
        setGroups(response);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
        toast.error("Failed to fetch groups")
      }
    }

    fetchUsers();
    fetchGroups();
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title) {
      toast.error("Title is required")
      return false
    }
    else if (!formData.venue) {
      toast.error("Venue is required")
      return false
    }
    else if (!formData.startDate) {
      toast.error("Start date is required")
      return false
    }
    else if (!formData.endDate) {
      toast.error("End date is required")
      return false
    }
    else if (!formData.startTime) {
      toast.error("Start time is required")
      return false
    }
    else if (!formData.endTime) {
      toast.error("End time is required")
      return false
    }
    else if (!formData.description) {
      toast.error("Description is required")
      return false
    }
    return true
  }

  const formatDateTime = (date, time) => {
    if (!date || !time) return null;

    const formattedDate = format(date, "yyyy-MM-dd"); // formats in local timezone
    return `${formattedDate}T${time}`; // Combine with provided time
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const start_datetime = formatDateTime(formData.startDate, formData.startTime);
      const end_datetime = formatDateTime(formData.endDate, formData.endTime);

      const formDataToSend = new FormData();

      formDataToSend.append('event[event_name]', formData.title);
      formDataToSend.append("event[event_at]", formData.venue);
      formDataToSend.append("event[from_time]", start_datetime);
      formDataToSend.append("event[to_time]", end_datetime);
      formDataToSend.append("event[description]", formData.description);
      formDataToSend.append("event[rsvp_action]", formData.rsvpEnabled ? "1" : "0");
      formDataToSend.append("event[shared]", formData.shareWith === "all" ? "0" : "1");
      formDataToSend.append("event[is_important]", formData.markAsImportant);
      formDataToSend.append("event[email_trigger_enabled]", formData.sendEmail);
      formDataToSend.append('event[of_phase]', 'pms');
      formDataToSend.append('event[of_atype]', 'Pms::Site');
      formDataToSend.append('event[of_atype_id]', localStorage.getItem("selectedSiteId"));

      if (formData.shareWith === 'individuals') {
        formDataToSend.append("event[swusers]", formData.selectedIndividuals);
      }

      if (formData.shareWith === 'groups') {
        formDataToSend.append("event[group_id]", formData.selectedGroups);
      }

      attachemnts.forEach((file) => {
        formDataToSend.append("noticeboard[files_attached][]", file);
      })

      await dispatch(createEvent({ baseUrl, token, data: formDataToSend })).unwrap();

      toast.success("Event created successfully");
      navigate(-1);
    } catch (error) {
      console.log(error);
      toast.error(error.message || error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachemnts(prev => [...prev, ...Array.from(files)])
      const newPreviews = Array.from(files)
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => URL.createObjectURL(file));

      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setAttachemnts((prev) => prev.filter((_, i) => i !== index));
  };

  const fieldStyles = {
    height: {
      xs: 28,
      sm: 36,
      md: 45,
    },
    "& .MuiInputBase-input, & .MuiSelect-select": {
      padding: {
        xs: "8px",
        sm: "10px",
        md: "12px",
      },
    },
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <MuiButton
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            color: "#666",
            textTransform: "none",
          }}
        >
          Back to Events
        </MuiButton>
      </Box>

      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Event Information Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 4,
            mb: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              1
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "black",
              }}
            >
              Event Information
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  flex: "1 1 300px",
                }}
              >
                <TextField
                  label={<span>Title<span className="text-red-500">*</span></span>}
                  placeholder="Title"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={fieldStyles}
                />
              </Box>
              <Box
                sx={{
                  flex: "1 1 300px",
                }}
              >
                <TextField
                  label={<span>Venue<span className="text-red-500">*</span></span>}
                  placeholder="Enter Venue"
                  fullWidth
                  variant="outlined"
                  value={formData.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={fieldStyles}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  flex: "1 1 200px",
                }}
              >
                <TextField
                  label={<span>Start date<span className="text-red-500">*</span></span>}
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={formData.startDate}
                  onChange={(e) =>
                    handleInputChange("startDate", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={fieldStyles}
                />
              </Box>
              <Box
                sx={{
                  flex: "1 1 200px",
                }}
              >
                <TextField
                  label={<span>End date<span className="text-red-500">*</span></span>}
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={fieldStyles}
                />
              </Box>
              <Box
                sx={{
                  flex: "1 1 200px",
                }}
              >
                <TextField
                  label={<span>Start Time<span className="text-red-500">*</span></span>}
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.startTime}
                  onChange={(e) =>
                    handleInputChange("startTime", e.target.value)
                  }
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={fieldStyles}
                />
              </Box>
              <Box
                sx={{
                  flex: "1 1 200px",
                }}
              >
                <TextField
                  label={<span>End Time<span className="text-red-500">*</span></span>}
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={fieldStyles}
                />
              </Box>
            </Box>

            <Box>
              <TextField
                label="Description"
                placeholder="Enter Description"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{
                  mt: 1,
                  "& .MuiOutlinedInput-root": {
                    height: "auto !important",
                    padding: "2px !important",
                    display: "flex",
                  },
                  "& .MuiInputBase-input[aria-hidden='true']": {
                    flex: 0,
                    width: 0,
                    height: 0,
                    padding: "0 !important",
                    margin: 0,
                    display: "none",
                  },
                  "& .MuiInputBase-input": {
                    resize: "none !important",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Event Settings Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 4,
            mb: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              2
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "black",
              }}
            >
              Event Settings
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <FormLabel component="legend" sx={{ minWidth: "80px" }}>
                RSVP
              </FormLabel>
              <RadioGroup
                row
                value={formData.rsvpEnabled ? "yes" : "no"}
                onChange={(e) =>
                  handleInputChange("rsvpEnabled", e.target.value === "yes")
                }
              >
                <FormControlLabel value="yes" control={<Radio />} label="YES" />
                <FormControlLabel value="no" control={<Radio />} label="NO" />
              </RadioGroup>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <FormLabel component="legend" sx={{ minWidth: "80px" }}>
                Share with
              </FormLabel>
              <RadioGroup
                row
                value={formData.shareWith}
                onChange={(e) => handleInputChange("shareWith", e.target.value)}
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="individuals"
                  control={<Radio />}
                  label="Individuals"
                />
                <FormControlLabel
                  value="groups"
                  control={<Radio />}
                  label="Groups"
                />
              </RadioGroup>
            </Box>

            {formData.shareWith === "individuals" && (
              <Box>
                <FormControl fullWidth sx={{ maxWidth: 400 }}>
                  <InputLabel>Select Individuals</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedIndividuals}
                    onChange={(e) =>
                      handleInputChange("selectedIndividuals", e.target.value)
                    }
                    label="Select Individuals"
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#999",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                      },
                    }}
                  >
                    <MenuItem value="Select" disabled>Select Users</MenuItem>
                    {
                      users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.full_name}
                        </MenuItem>
                      ))
                    }
                  </MuiSelect>
                </FormControl>
              </Box>
            )}

            {formData.shareWith === "groups" && (
              <Box>
                <FormControl fullWidth sx={{ maxWidth: 400 }}>
                  <InputLabel>Select Groups</InputLabel>
                  <MuiSelect
                    multiple
                    value={formData.selectedGroups}
                    onChange={(e) =>
                      handleInputChange("selectedGroups", e.target.value)
                    }
                    label="Select Groups"
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ccc",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#999",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#000",
                      },
                    }}
                  >
                    <MenuItem value="Select" disabled>Select Groups</MenuItem>
                    {
                      groups.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.name}
                        </MenuItem>
                      ))
                    }
                  </MuiSelect>
                </FormControl>
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                gap: 4,
              }}
            >
              <FormControlLabel
                control={
                  <MuiCheckbox
                    checked={formData.markAsImportant}
                    onChange={(e) =>
                      handleInputChange("markAsImportant", e.target.checked)
                    }
                  />
                }
                label="Mark as Important"
              />
              <FormControlLabel
                control={
                  <MuiCheckbox
                    checked={formData.sendEmail}
                    onChange={(e) =>
                      handleInputChange("sendEmail", e.target.checked)
                    }
                  />
                }
                label="Send Email"
              />
            </Box>
          </Box>
        </Box>

        {/* Attachments Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 4,
            mb: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              3
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "black",
              }}
            >
              Attachments
            </Typography>
          </Box>

          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                borderColor: "#999",
              },
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: "none" }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <AttachFile
                  sx={{
                    fontSize: 48,
                    color: "#ccc",
                    mb: 2,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Click to choose images
                </Typography>
              </Box>
            </label>
          </Box>

          {attachemnts.length > 0 && (
            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
              {attachemnts.map((file, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 150,
                    position: "relative",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="100"
                    image={URL.createObjectURL(file)}
                    alt={file.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "rgba(255,255,255,0.7)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <Delete color="error" />
                  </IconButton>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      p: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {file.name}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Submit Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Button onClick={handleSubmit} className="px-8 py-3 text-base">
            Create Event
          </Button>
        </Box>
      </Box>
    </Box>
  );
};