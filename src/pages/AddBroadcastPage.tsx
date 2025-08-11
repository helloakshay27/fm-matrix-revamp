import { useEffect, useState, useRef } from "react";
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
import { useAppDispatch } from "@/store/hooks";
import { fetchFMUsers } from "@/store/slices/fmUserSlice";
import { toast } from "sonner";
import { fetchUserGroups } from "@/store/slices/userGroupSlice";
import { createBroadcast } from "@/store/slices/broadcastSlice";

export const AddBroadcastPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    markAsImportant: false,
    endDate: "",
    endTime: "",
    shareWith: "all",
    selectedIndividuals: [],
    selectedGroups: [],
  });
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(fetchFMUsers()).unwrap();
        setUsers(response.fm_users);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users");
      }
    };

    const fetchGroups = async () => {
      try {
        const response = await dispatch(fetchUserGroups({ baseUrl, token })).unwrap();
        setGroups(response);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        toast.error("Failed to fetch groups");
      }
    };

    fetchUsers();
    fetchGroups();
  }, [dispatch, baseUrl, token]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.title) {
      toast.error("Title is required");
      return false;
    } else if (!formData.endDate) {
      toast.error("End date is required");
      return false;
    } else if (!formData.endTime) {
      toast.error("End Time is required");
      return false;
    } else if (!formData.description) {
      toast.error("Description is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("noticeboard[notice_heading]", formData.title);
      formDataToSend.append(
        "noticeboard[expire_time]",
        `${formData.endDate}T${formData.endTime}`
      );
      formDataToSend.append("noticeboard[notice_text]", formData.description);
      formDataToSend.append("noticeboard[shared]", formData.shareWith === "all" ? "2" : "1");
      formDataToSend.append("noticeboard[of_phase]", "pms");
      formDataToSend.append("noticeboard[of_atype]", "Pms::Site");
      formDataToSend.append("noticeboard[of_atype_id]", localStorage.getItem("selectedSiteId") || "");
      formDataToSend.append("noticeboard[publish]", "1");

      if (formData.shareWith === 'individuals') {
        formDataToSend.append("event[swusers]", formData.selectedIndividuals);
      }

      if (formData.shareWith === 'groups') {
        formDataToSend.append("event[group_id]", formData.selectedGroups);
      }

      attachments.forEach((file) => {
        formDataToSend.append("noticeboard[files_attached][]", file);
      });

      await dispatch(createBroadcast({ data: formDataToSend, baseUrl, token })).unwrap();
      toast.success("Broadcast created successfully");
      navigate("/crm/broadcast");
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setAttachments((prev) => [...prev, ...newFiles]);
      event.target.value = ""; // Reset file input
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <MuiButton
          startIcon={<ArrowBack />}
          onClick={() => navigate("/crm/broadcast")}
          sx={{ color: "#666", textTransform: "none" }}
        >
          Back to Broadcasts
        </MuiButton>
      </Box>

      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Communication Information Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 4,
            mb: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
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
              sx={{ fontWeight: "bold", textTransform: "uppercase", color: "black" }}
            >
              Communication Information
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: "1 1 300px" }}>
                <TextField
                  label="Title*"
                  placeholder="Title"
                  fullWidth
                  variant="outlined"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px" }}>
                <TextField
                  label="End Date"
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={fieldStyles}
                />
              </Box>
              <Box sx={{ flex: "1 1 300px" }}>
                <TextField
                  label="End Time"
                  type="time"
                  fullWidth
                  variant="outlined"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  InputLabelProps={{ shrink: true }}
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
                onChange={(e) => handleInputChange("description", e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        </Box>

        {/* Broadcast Settings Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 4,
            mb: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
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
              sx={{ fontWeight: "bold", textTransform: "uppercase", color: "black" }}
            >
              Broadcast Settings
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
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
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dc2626",
                      },
                    }}
                  >
                    <MenuItem value="Select" disabled>
                      Select Users
                    </MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.firstname + " " + user.lastname}
                      </MenuItem>
                    ))}
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
                    onChange={(e) => handleInputChange("selectedGroups", e.target.value)}
                    label="Select Groups"
                    sx={{
                      bgcolor: "white",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#999" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dc2626",
                      },
                    }}
                  >
                    <MenuItem value="Select" disabled>
                      Select Groups
                    </MenuItem>
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </MuiSelect>
                </FormControl>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 4 }}>
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
            </Box>
          </Box>
        </Box>

        {/* Upload Files Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            p: 4,
            mb: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
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
              sx={{ fontWeight: "bold", textTransform: "uppercase", color: "black" }}
            >
              Attachments
            </Typography>
          </Box>

          <Box
            onClick={handleFileUpload}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { borderColor: "#999" },
            }}
          >
            <AttachFile sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Choose files | {attachments.length > 0 ? `${attachments.length} file(s) chosen` : "No file chosen"}
            </Typography>
          </Box>

          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {attachments.length > 0 && (
            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
              {attachments.map((file, index) => (
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
                    onClick={() => handleRemoveFile(index)}
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
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button onClick={handleSubmit} className="px-8 py-3 text-base">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};