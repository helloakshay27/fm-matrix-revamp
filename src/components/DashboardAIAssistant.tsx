import React, { useState, useEffect } from "react";
import {
    X,
    Sparkles,
    Send,
    Loader2,
    Bot,
    RefreshCw,
    Download,
    ChevronDown,
    ChevronUp,
    Mic,
    MicOff,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";  // Import Textarea from UI component
import { useSpeechToText } from "@/hooks/useSpeechToText";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { getUser, getToken } from "@/utils/auth";
import ReactMarkdown from "react-markdown";

interface AvailableModule {
    id: number;
    name: string;
}

interface DashboardAIResponse {
    request_id: string;
    question: string;
    error?: string;
    available_modules?: AvailableModule[];
    user_id?: number;
    access_token?: string;
    modules?: string[];
    sites?: string[];
    answer?: string;
    results?: any;
}

interface ChatMessage {
    id: string;
    type: "user" | "bot";
    content: string;
    timestamp: Date;
    response?: DashboardAIResponse;
}

interface DashboardAIAssistantProps {
    moduleId?: string; // Optional module ID to pass directly (e.g., "1" for assets)
}

export const DashboardAIAssistant: React.FC<DashboardAIAssistantProps> = ({ moduleId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState<DashboardAIResponse | null>(null);
    const [error, setError] = useState<string>("");
    const [selectedModules, setSelectedModules] = useState<number[]>([]);
    const [expandedSheet, setExpandedSheet] = useState<string | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<string>("");

    const user = getUser();
    const token = getToken();

    const { isListening, activeId, transcript, supported, startListening, stopListening } = useSpeechToText();
    const fieldId = "dashboard-assistant-input";
    const isActive = isListening && activeId === fieldId;

    // Update question state when transcript changes
    useEffect(() => {
        if (isActive && transcript) {
            setQuestion(transcript);
        }
    }, [isActive, transcript]);

    const toggleListening = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isActive) {
            stopListening();
        } else {
            startListening(fieldId);
        }
    };

    const handleSubmit = async () => {
        if (!question.trim()) {
            setError("Please enter a question");
            return;
        }

        if (!user?.id || !token) {
            setError("User not authenticated");
            return;
        }

        setIsLoading(true);
        setError("");
        setResponse(null);
        setSelectedModules([]);
        setCurrentQuestion(question.trim());

        // Add user message to chat
        const userMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            type: "user",
            content: question.trim(),
            timestamp: new Date(),
        };
        setChatHistory((prev) => [...prev, userMessage]);

        try {
            const payload: any = {
                user_id: user.id,
                access_token: token,
                question: question.trim(),
                tag: "dashboard-assistance",
            };

            // If moduleId is provided as prop, include it directly in the first request
            if (moduleId) {
                payload.module_id = moduleId;
            }

            const apiResponse = await fetch(
                "https://dashboard.lockated.com/api-fastapi/ai-process/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!apiResponse.ok) {
                throw new Error("Failed to process AI request");
            }

            const data: DashboardAIResponse = await apiResponse.json();
            setResponse(data);

            // Add bot message to chat
            const botMessage: ChatMessage = {
                id: `bot_${Date.now()}`,
                type: "bot",
                content: data.error || data.answer || "Please select module(s) to continue",
                timestamp: new Date(),
                response: data,
            };
            setChatHistory((prev) => [...prev, botMessage]);

            // If available_modules is present, user needs to select modules
            if (data.available_modules && data.available_modules.length > 0) {
                // Do nothing, wait for user to select modules
            }
        } catch (err) {
            setError("Failed to get AI insights. Please try again.");
            console.error("Error processing AI request:", err);
        } finally {
            setIsLoading(false);
            setQuestion("");
        }
    };

    const handleModuleSubmit = async () => {
        if (selectedModules.length === 0) {
            setError("Please select at least one module");
            return;
        }

        if (!user?.id || !token) {
            setError("User not authenticated");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const payload: any = {
                user_id: user.id,
                access_token: token,
                question: currentQuestion || response?.question || "",
                tag: "dashboard-assistance",
                module_id: selectedModules.join(","),
            };

            const apiResponse = await fetch(
                "https://dashboard.lockated.com/api-fastapi/ai-process/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!apiResponse.ok) {
                throw new Error("Failed to process AI request");
            }

            const data: DashboardAIResponse = await apiResponse.json();
            setResponse(data);

            // Add bot response to chat
            const botMessage: ChatMessage = {
                id: `bot_${Date.now()}`,
                type: "bot",
                content: data.answer || "Analysis complete",
                timestamp: new Date(),
                response: data,
            };
            setChatHistory((prev) => [...prev, botMessage]);
        } catch (err) {
            setError("Failed to get AI insights. Please try again.");
            console.error("Error processing AI request:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResponse(null);
        setQuestion("");
        setError("");
        setSelectedModules([]);
        setChatHistory([]);
        setCurrentQuestion("");
    };

    const handleModuleToggle = (moduleId: number) => {
        setSelectedModules((prev) =>
            prev.includes(moduleId)
                ? prev.filter((id) => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const downloadAsExcel = (sheetData: any, sheetName: string) => {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(sheetData.sample || []);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        XLSX.writeFile(wb, `${sheetName}_${new Date().getTime()}.xlsx`);
    };

    const downloadAllSheets = (results: any) => {
        const wb = XLSX.utils.book_new();

        const processSheets = (data: any, prefix = "") => {
            if (data && typeof data === "object") {
                Object.entries(data).forEach(([key, value]: [string, any]) => {
                    if (value && typeof value === "object") {
                        if (value.sample && Array.isArray(value.sample) && value.sample.length > 0) {
                            const ws = XLSX.utils.json_to_sheet(value.sample);
                            const sheetName = `${prefix}${key}`.substring(0, 31);
                            XLSX.utils.book_append_sheet(wb, ws, sheetName);
                        } else if (value.rows !== undefined) {
                            processSheets(value, `${prefix}${key}_`);
                        } else {
                            processSheets(value, prefix);
                        }
                    }
                });
            }
        };

        processSheets(results);
        XLSX.writeFile(wb, `Dashboard_AI_Report_${new Date().getTime()}.xlsx`);
    };

    // Check if the current domain is allowed
    const isAllowedDomain = () => {
        const hostname = window.location.hostname;
        return (
            hostname === "lockated.gophygital.work" ||
            hostname === "dashboard.lockated.com" ||
            hostname === "localhost" ||
            hostname === "127.0.0.1"
        );
    };

    // Don't render if not on allowed domain
    if (!isAllowedDomain()) {
        return null;
    }

    const hasAvailableModules = response?.available_modules && response.available_modules.length > 0;
    const hasAnswer = response?.answer;

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-[#C72030] hover:bg-[#a81c29] z-50 group border-none"
                    size="icon"
                >
                    <Bot className="h-7 w-7 text-white group-hover:scale-110 transition-transform" />
                </Button>
            )}

            {/* AI Widget */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-[420px] h-[650px] shadow-2xl z-50 flex flex-col bg-[#DBC2A9] dark:bg-slate-900 border-none rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="relative bg-[#DBC2A9] px-4 py-3 flex items-center justify-between">
                        <div className="relative flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <Bot className="h-6 w-6 text-[#C72030]" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-base">
                                    Dashboard Assistant
                                </h3>
                                <p className="text-white/80 text-xs">
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="relative text-white hover:bg-white/20 rounded-lg transition-all h-8 w-8"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Chat Content */}
                    <div
                        className="flex-1 overflow-y-auto p-3 space-y-2 bg-gradient-to-br  bg-white/50 "
                    >
                        {chatHistory.length === 0 && !isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center p-6 bg-white/50 rounded-2xl">
                                    <Bot className="h-12 w-12 mx-auto mb-3 text-[#C72030]" />
                                    <p className="text-sm text-slate-600 font-medium">
                                        Welcome{user?.firstname ? `, ${user.firstname}` : ''}!<br />Ask me anything about<br />your dashboard data
                                    </p>
                                </div>
                            </div>
                        )}

                        {chatHistory.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${message.type === "user"
                                        ? "bg-white text-white"
                                        : "bg-white border border-[#DBC2A9]/40"
                                        }`}
                                >
                                    {message.type === "bot" && message.response?.answer ? (
                                        <div className="space-y-2">
                                            <div className="prose prose-sm max-w-none text-slate-800">
                                                <ReactMarkdown>{message.response.answer}</ReactMarkdown>
                                            </div>

                                            {message.response.modules && message.response.modules.length > 0 && (
                                                <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200">
                                                    {message.response.modules.map((module, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-[#DBC2A9]/30 text-[#C72030] px-2 py-0.5 rounded text-xs font-medium"
                                                        >
                                                            {module}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {message.response.results && Object.keys(message.response.results).length > 0 && (
                                                <div className="space-y-2 mt-2 pt-2 border-t border-slate-200">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-semibold text-slate-700">Data Tables</span>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => downloadAllSheets(message.response!.results)}
                                                            className="bg-[#C72030] hover:bg-[#a81c29] text-white text-xs h-6"
                                                        >
                                                            <Download className="h-3 w-3 mr-1" />
                                                            Download All
                                                        </Button>
                                                    </div>
                                                    {Object.entries(message.response.results).map(([moduleKey, moduleData]: [string, any]) => (
                                                        <div key={moduleKey} className="space-y-1">
                                                            {Object.entries(moduleData).map(([timeKey, timeData]: [string, any]) => (
                                                                <div key={timeKey} className="space-y-1">
                                                                    {Object.entries(timeData).map(([tableName, tableData]: [string, any]) => {
                                                                        if (!tableData?.sample || tableData.sample.length === 0) return null;
                                                                        const tableId = `${message.id}_${moduleKey}_${timeKey}_${tableName}`;
                                                                        return (
                                                                            <div key={tableName} className="border border-[#DBC2A9]/40 rounded overflow-hidden">
                                                                                <div
                                                                                    onClick={() => setExpandedSheet(expandedSheet === tableId ? null : tableId)}
                                                                                    className="bg-[#DBC2A9]/20 px-2 py-1.5 flex items-center justify-between cursor-pointer hover:bg-[#DBC2A9]/30 transition-all"
                                                                                >
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <span className="font-semibold text-xs text-slate-800">
                                                                                            {tableName}
                                                                                        </span>
                                                                                        <span className="text-xs text-slate-500 bg-white/50 px-1.5 py-0.5 rounded">
                                                                                            {tableData.rows} rows
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="flex items-center gap-1">
                                                                                        <Button
                                                                                            size="sm"
                                                                                            variant="ghost"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                downloadAsExcel(tableData, tableName);
                                                                                            }}
                                                                                            className="h-6 text-xs hover:bg-white/50 px-2"
                                                                                        >
                                                                                            <Download className="h-3 w-3 mr-1" />
                                                                                            Excel
                                                                                        </Button>
                                                                                        {expandedSheet === tableId ? (
                                                                                            <ChevronUp className="h-3.5 w-3.5" />
                                                                                        ) : (
                                                                                            <ChevronDown className="h-3.5 w-3.5" />
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                                {expandedSheet === tableId && (
                                                                                    <div className="overflow-x-auto bg-white max-h-[200px] overflow-y-auto">
                                                                                        <table className="w-full text-xs">
                                                                                            <thead className="bg-[#DBC2A9]/30 sticky top-0">
                                                                                                <tr>
                                                                                                    {Object.keys(tableData.sample[0]).map((col, idx) => (
                                                                                                        <th
                                                                                                            key={idx}
                                                                                                            className="px-2 py-1.5 text-left font-semibold text-slate-700 border-b border-[#DBC2A9]/30 whitespace-nowrap"
                                                                                                        >
                                                                                                            {col}
                                                                                                        </th>
                                                                                                    ))}
                                                                                                </tr>
                                                                                            </thead>
                                                                                            <tbody>
                                                                                                {tableData.sample.slice(0, 10).map((row: any, rowIdx: number) => (
                                                                                                    <tr
                                                                                                        key={rowIdx}
                                                                                                        className="border-b border-slate-200 hover:bg-slate-50"
                                                                                                    >
                                                                                                        {Object.keys(tableData.sample[0]).map((col, colIdx) => (
                                                                                                            <td
                                                                                                                key={colIdx}
                                                                                                                className="px-2 py-1.5 text-slate-600 whitespace-nowrap"
                                                                                                            >
                                                                                                                {row[col] !== null && row[col] !== undefined
                                                                                                                    ? String(row[col])
                                                                                                                    : "-"}
                                                                                                            </td>
                                                                                                        ))}
                                                                                                    </tr>
                                                                                                ))}
                                                                                            </tbody>
                                                                                        </table>
                                                                                        {tableData.sample.length > 10 && (
                                                                                            <div className="bg-[#DBC2A9]/10 px-2 py-1.5 text-center text-xs text-slate-600">
                                                                                                Showing 10 of {tableData.sample.length} rows. Download Excel for full data.
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-800 whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    )}
                                    <div className={`text-xs mt-1 ${message.type === "user" ? "text-right text-white/80" : "text-slate-500"}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-lg px-4 py-3 shadow-sm border border-[#DBC2A9]/40">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-[#C72030]" />
                                        <span className="text-sm text-slate-600">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {hasAvailableModules && (
                            <div className="flex justify-start">
                                <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%] border border-[#DBC2A9]/40">
                                    <p className="text-sm text-slate-800 mb-3 font-medium">
                                        {response?.error || "Please select module(s):"}
                                    </p>

                                    <div className="space-y-2">
                                        {response?.available_modules?.map((module) => (
                                            <div
                                                key={module.id}
                                                className={`flex items-center space-x-2 p-2 rounded border-2 transition-all cursor-pointer ${selectedModules.includes(module.id)
                                                    ? "border-[#C72030] bg-[#C72030]/5"
                                                    : "border-[#DBC2A9]/40 hover:border-[#C72030]/50"
                                                    }`}
                                                onClick={() => handleModuleToggle(module.id)}
                                            >
                                                <Checkbox
                                                    checked={selectedModules.includes(module.id)}
                                                    onCheckedChange={() => handleModuleToggle(module.id)}
                                                />
                                                <label className="flex-1 text-sm font-medium cursor-pointer">
                                                    {module.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={handleModuleSubmit}
                                        disabled={isLoading || selectedModules.length === 0}
                                        className="w-full mt-3 bg-[#C72030] hover:bg-[#a81c29] text-white text-sm"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Get Insights
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border-t border-[#DBC2A9]/40 px-3 py-2 flex items-center gap-2">
                        <div className="relative flex-1">
                            <Textarea
                                placeholder="Type a message..."
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                                className="w-full min-h-[40px] max-h-[100px] resize-none bg-white border border-[#DBC2A9]/40 rounded-2xl px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-[#C72030] focus:border-[#C72030]"
                                disabled={isLoading}
                            />
                            {supported && (
                                <button
                                    onClick={toggleListening}
                                    className={`absolute right-2 top-2 p-1 rounded-full transition-all ${isActive ? "bg-red-100 text-red-600 animate-pulse" : "text-gray-400 hover:bg-gray-200"
                                        }`}
                                    title={isActive ? "Stop recording" : "Start voice input"}
                                >
                                    {isActive ? <Mic size={20} /> : <MicOff size={20} />}
                                </button>
                            )}
                        </div>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || !question.trim()}
                            className="h-10 w-10 rounded-full bg-[#C72030] hover:bg-[#a81c29] text-white p-0 flex items-center justify-center disabled:opacity-50"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Send className="h-5 w-5" />
                            )}
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2.5 border-t border-[#DBC2A9]/40 bg-white">
                        <p className="text-xs text-center text-slate-600 font-medium">
                            ⚡ Powered by Lockated • Logged in as{" "}
                            <span className="text-[#C72030] font-semibold">
                                {user?.firstname || "User"}
                            </span>
                        </p>
                    </div>
                </Card>
            )}
        </>
    );
};
