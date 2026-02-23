
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
import { useNavigate, useLocation, useSearchParams, useParams } from "react-router-dom";
import { saveToken, saveBaseUrl, getOrganizationsByEmailAndAutoSelect, getBaseUrl, getToken } from '@/utils/auth';

const PermitSafetyCheckForm = () => {
    const location = useLocation();
    const { permitId } = useParams<{ permitId: string }>();
    const [searchParams] = useSearchParams();
    const urlToken = searchParams.get("token");
    const email = searchParams.get("email");
    const orgId = searchParams.get("orgId");
    const baseUrlParam = searchParams.get("baseUrl");
    
    const [token, setToken] = useState<string | null>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<
        number,
        { question_id: number; answer_type: string; remarks: string }
    >>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    // Initialize and fetch questions
    useEffect(() => {
        initializeAndFetchQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permitId, urlToken, email, orgId, baseUrlParam]);

    const initializeAndFetchQuestions = async () => {
        if (!permitId) {
            setLoading(false);
            console.warn("❌ No permitId provided");
            return;
        }

        try {
            console.log("🔄 Starting initialization...");
            setLoading(true);

            // Handle email and organization auto-selection
            if (email && orgId) {
                console.log('📧 Processing email and organization:', { email, orgId });
                
                try {
                    const { organizations, selectedOrg } = await getOrganizationsByEmailAndAutoSelect(email, orgId);
                    
                    if (selectedOrg) {
                        console.log('✅ Organization auto-selected:', selectedOrg.name);
                        
                        // Set baseUrl from organization's domain
                        if (selectedOrg.domain || selectedOrg.sub_domain) {
                            const orgBaseUrl = `https://${selectedOrg.sub_domain}.${selectedOrg.domain}`;
                            saveBaseUrl(orgBaseUrl);
                            console.log('✅ Base URL set from organization:', orgBaseUrl);
                        }
                    } else {
                        console.warn('⚠️ Organization not found with ID:', orgId);
                    }
                } catch (orgError) {
                    console.error('❌ Error fetching organizations:', orgError);
                }
            }

            // Set base URL if provided in URL (overrides organization baseUrl)
            if (baseUrlParam) {
                saveBaseUrl(baseUrlParam);
                console.log('✅ Base URL set from URL parameter:', baseUrlParam);
            }

            // Set token if provided in URL
            if (urlToken) {
                saveToken(urlToken);
                sessionStorage.setItem("mobile_token", urlToken);
                setToken(urlToken);
                console.log('✅ Token set from URL parameter');
            }

            // Use token from URL or from auth utils
            const tokenToUse = urlToken || getToken() || sessionStorage.getItem("mobile_token");
            
            if (!tokenToUse) {
                console.error('❌ No authentication token available');
                setErrorMessage("❌ No authentication token provided. Please include token parameter in the URL.");
                setLoading(false);
                return;
            }

            // Fetch questions with the initialized baseUrl
            await fetchQuestions(tokenToUse);
            console.log("✅ Initialization complete");
        } catch (error) {
            console.error("❌ ERROR INITIALIZING:", error);
            setErrorMessage(`Error initializing form: ${error instanceof Error ? error.message : "Unknown error"}`);
            setLoading(false);
        }
    };

    const fetchQuestions = async (tokenToUse: string) => {
        try {
            const baseUrl = getBaseUrl();
            
            if (!baseUrl) {
                throw new Error('Base URL not configured. Please provide baseUrl parameter or select an organization.');
            }

            if (!permitId) return;
            
            const url = `${baseUrl}/pms/permits/${permitId}/safety_checklist_data`;

            console.log("🔍 FETCHING SAFETY CHECKLIST:");
            console.log("  - Base URL:", baseUrl);
            console.log("  - Full URL:", url);
            console.log("  - Permit ID:", permitId);
            console.log("  - Token:", tokenToUse?.substring(0, 20) + "...");

            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenToUse}`,
                    "Content-Type": "application/json",
                },
            });
            const data = res.data;

            console.log("📦 SAFETY CHECKLIST API Response:", data);

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
            console.log("✅ Questions loaded successfully");
            setLoading(false);
        } catch (err) {
            console.error("❌ Failed to fetch questions:", err);
            setErrorMessage(`Failed to load questions: ${err instanceof Error ? err.message : "Unknown error"}`);
            setLoading(false);
        }
    }

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
            const baseUrl = getBaseUrl();
            
            if (!baseUrl) {
                throw new Error('Base URL not configured. Please provide baseUrl parameter or select an organization.');
            }

            if (!permitId || !token) return;
            
            const url = `${baseUrl}/pms/permits/${permitId}/submit_checklist_form.json`;

            console.log("📝 SUBMITTING SAFETY CHECKLIST:");
            console.log("  - Base URL:", baseUrl);
            console.log("  - Full URL:", url);
            console.log("  - Permit ID:", permitId);

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
            console.error("❌ Submit error:", err);
            alert("Error submitting checklist. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            {loading && (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading safety checklist...</p>
                    </div>
                </div>
            )}
            
            {errorMessage && (
                <div className="flex items-center justify-center h-screen">
                    <div className="max-w-md p-6 bg-red-50 border border-red-200 rounded-lg">
                        <h2 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Form</h2>
                        <p className="text-red-700 mb-4">{errorMessage}</p>
                        <p className="text-sm text-red-600 mb-4">
                            ✅ Example URL with parameters:
                        </p>
                        <code className="block bg-red-100 p-2 rounded text-xs text-red-800 mb-4 overflow-auto">
                            /ps/123?token=xxx&email=user@example.com&orgId=13
                        </code>
                        <Button 
                            variant="contained" 
                            onClick={() => window.location.reload()}
                            style={{ backgroundColor: "#C72030" }}
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}
            
            {!loading && !errorMessage && questions.length === 0 && (
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-800 mb-2">No questions found</p>
                        <p className="text-gray-600">Please check the permit ID and try again.</p>
                    </div>
                </div>
            )}
            
            {!loading && !errorMessage && questions.length > 0 && (
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
            )}

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
