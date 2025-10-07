import React, { useState, useEffect } from 'react';
import {
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    TextField,
    Button,
} from '@mui/material';

const PermitSafetyCheckForm = () => {
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchChecklistData = async () => {
            let baseUrl = localStorage.getItem('baseUrl');
            if (!baseUrl) return;
            // Remove 'localhost' if present
            if (baseUrl.includes('localhost')) {
                baseUrl = baseUrl.replace('localhost', '').replace(/\/+$/, '');
            }
            // Remove any trailing slashes
            baseUrl = baseUrl.replace(/\/+$/, '');
            try {
                const token = 'OyGvi3ObQlXrQrfKnFUytBzaaMZBrdrHLKcFu1JYKjI';
                const url = `https://${baseUrl}/pms/permits/13765/safety_checklist_data?token=${token}`;
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch checklist data');
                const data = await response.json();
                setQuestions(data.questions || []);
                setAnswers(data.answers || {});
                // Pre-fill formData with API answers
                const initialFormData = {};
                (data.questions || []).forEach(q => {
                    if (data.answers && data.answers[q.id]) {
                        initialFormData[`q${q.id}_response`] = data.answers[q.id].answer_type;
                        initialFormData[`q${q.id}_remarks`] = data.answers[q.id].remarks || '';
                    }
                });
                setFormData(initialFormData);
            } catch (err) {
                // Optionally handle error
            }
        };
        fetchChecklistData();
    }, []);

    const handleRadioChange = (qid, value) => {
        setFormData(prev => ({
            ...prev,
            [`q${qid}_response`]: value
        }));
    };

    const handleRemarksChange = (qid, value) => {
        setFormData(prev => ({
            ...prev,
            [`q${qid}_remarks`]: value
        }));
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            let baseUrl = localStorage.getItem('baseUrl');
            if (!baseUrl) throw new Error('Base URL not found');

            const token = 'OyGvi3ObQlXrQrfKnFUytBzaaMZBrdrHLKcFu1JYKjI';
            const permitId = 13765; // You may want to make this dynamic
            const url = `https://${baseUrl}/pms/permits/${permitId}/submit_checklist_form.json?token=${token}`;

            // Build question answers object
            const questionPayload = {};
            questions.forEach(q => {
                questionPayload[q.id] = {
                    question_id: q.id,
                    answer_type: formData[`q${q.id}_response`] || '',
                    remarks: formData[`q${q.id}_remarks`] || ''
                };
            });

            // Build FormData for multipart
            const formDataToSend = new FormData();
            formDataToSend.append('question', JSON.stringify(questionPayload));
            if (file) {
                formDataToSend.append('quest_map[image]', file);
            }

            const response = await fetch(url, {
                method: 'POST',
                body: formDataToSend
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to submit checklist form');
            }
            alert('Form submitted successfully!');
        } catch (err) {
            alert('Error submitting form: ' + (err?.message || 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white-50 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#C72030', mb: 4, textAlign: 'center' }}>
                    Permit Safety Check Form
                </Typography>
                {questions.map((question, idx) => (
                    <div key={question.id} className="mb-6 pb-4 border-b border-gray-200">
                        <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: '#333' }}>
                            {idx + 1}) {question.text}
                        </Typography>
                        <div className="flex flex-col gap-2">
                            <div>
                                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                                    Response:
                                </Typography>
                                <FormControl>
                                    <RadioGroup
                                        row
                                        value={formData[`q${question.id}_response`] || ''}
                                        onChange={(e) => handleRadioChange(question.id, e.target.value)}
                                    >
                                        {question.options && question.options.map(opt => (
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
                            </div>
                            <div>
                                <TextField
                                    fullWidth
                                    placeholder="Remarks"
                                    variant="outlined"
                                    size="small"
                                    value={formData[`q${question.id}_remarks`] || ''}
                                    onChange={(e) => handleRemarksChange(question.id, e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            bgcolor: 'white',
                                            borderRadius: '8px',
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                    <Button
                        variant="contained"
                        component="label"
                        style={{ backgroundColor: '#C72030' }}
                        className="text-white hover:bg-[#C72030]/90 flex items-center px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Choose a file...
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        {file ? file.name : 'No file chosen'}
                    </Typography>
                </div>
                <div className="mt-8 text-center">
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{ backgroundColor: isSubmitting ? '#9ca3af' : '#C72030' }}
                        className="text-white hover:bg-[#C72030]/90 flex items-center px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold text-base"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PermitSafetyCheckForm;