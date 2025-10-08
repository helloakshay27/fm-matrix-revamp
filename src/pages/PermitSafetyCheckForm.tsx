
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    TextField,
    Button,
    Dialog,
    DialogContent,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const PermitSafetyCheckForm = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const permitId = searchParams.get("id");
    const urlToken = searchParams.get("token");
    // Use token from URL, sessionStorage, or localStorage
    const [token, setToken] = useState(() => urlToken || sessionStorage.getItem("mobile_token") || localStorage.getItem("token"));

    // Store token from URL for future use (mobile pattern)
    useEffect(() => {
        if (urlToken) {
            localStorage.setItem("token", urlToken);
            sessionStorage.setItem("mobile_token", urlToken);
            setToken(urlToken);
        }
    }, [urlToken]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<
        number,
        { question_id: number; answer_type: string; remarks: string }
    >>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    // Fetch questions dynamically
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const baseUrl = localStorage.getItem("baseUrl")?.replace(/\/+$/, "");
                if (!permitId || !token) return;
                const url = `https://${baseUrl}/pms/permits/${permitId}/safety_checklist_data`;

                const res = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = res.data;

                setQuestions(data.questions || []);

                // Pre-fill answers if backend already returned saved answers
                const initialAnswers: typeof answers = {};
                (data.questions || []).forEach((q: any) => {
                    initialAnswers[q.id] = {
                        question_id: q.id,
                        answer_type: data.answers?.[q.id]?.answer_type || "",
                        remarks: data.answers?.[q.id]?.remarks || "",
                    };
                });
                setAnswers(initialAnswers);
            } catch (err) {
                console.error("Failed to fetch questions:", err);
            }
        };
        fetchQuestions();
    }, [permitId, token]);

    const handleChange = (id: number, field: string, value: string) => {
        setAnswers((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value, question_id: id },
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const baseUrl = localStorage.getItem("baseUrl")?.replace(/\/+$/, "");
            if (!permitId || !token) return;
            const url = `https://${baseUrl}/pms/permits/${permitId}/submit_checklist_form.json`;

            const formData = new FormData();

            // Map Yes/No to p/n if needed
            const payload = Object.fromEntries(
                Object.entries(answers).map(([id, q]) => [
                    id,
                    {
                        question_id: q.question_id,
                        answer_type:
                            q.answer_type === "Yes"
                                ? "p"
                                : q.answer_type === "No"
                                    ? "n"
                                    : q.answer_type,
                        remarks: q.remarks || "",
                    },
                ])
            );

            formData.append("question", JSON.stringify(payload));

            if (selectedFile) {
                formData.append("quest_map[image]", selectedFile);
            }

            await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Show success dialog
            setShowDialog(true);
            setTimeout(() => {
                setShowDialog(false);
                // navigate(-1); // go back to previous page
            }, 3000);
        } catch (err) {
            console.error("Submit error:", err);
            alert("Error submitting checklist. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#C72030", mb: 4, textAlign: "center" }}
                >
                    Permit Safety Check Form
                </Typography>

                {questions.map((q, idx) => (
                    <div key={q.id} className="mb-6 pb-4 border-b border-gray-200">
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: "#333" }}>
                            {idx + 1}) {q.text}
                        </Typography>

                        <FormControl component="fieldset">
                            <RadioGroup
                                row
                                value={answers[q.id]?.answer_type || ""}
                                onChange={(e) => handleChange(q.id, "answer_type", e.target.value)}
                            >
                                {q.options?.map((opt: any) => (
                                    <FormControlLabel
                                        key={opt.id}
                                        value={opt.value}
                                        control={<Radio size="small" />}
                                        label={opt.label}
                                        sx={{ mr: 3 }}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            fullWidth
                            placeholder="Remarks"
                            variant="outlined"
                            size="small"
                            value={answers[q.id]?.remarks || ""}
                            onChange={(e) => handleChange(q.id, "remarks", e.target.value)}
                            sx={{
                                mt: 2,
                                "& .MuiOutlinedInput-root": { bgcolor: "white", borderRadius: "8px" },
                            }}
                        />
                    </div>
                ))}

                {/* File upload */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                        variant="contained"
                        component="label"
                        style={{ backgroundColor: "#C72030" }}
                    >
                        Choose a file
                        <input type="file" hidden onChange={handleFileChange} />
                    </Button>
                    <Typography variant="body2" sx={{ color: "#666" }}>
                        {selectedFile ? selectedFile.name : "No file chosen"}
                    </Typography>
                </div>

                <div className="mt-8 text-center">
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ backgroundColor: loading ? "#9ca3af" : "#C72030" }}
                        className="text-white px-8 py-2 rounded-lg font-semibold text-base"
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </div>

            {/* Success dialog */}
            <Dialog open={showDialog} PaperProps={{ sx: { borderRadius: 4, p: 4 } }}>
                <DialogContent sx={{ textAlign: "center" }}>
                    <Typography variant="h5" sx={{ color: "#C72030", fontWeight: "bold", mb: 1 }}>
                        THANK YOU!
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#555" }}>
                        Your safety checklist has been submitted successfully.
                    </Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PermitSafetyCheckForm;
