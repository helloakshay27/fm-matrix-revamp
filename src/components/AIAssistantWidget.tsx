import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Bot,
  Package,
  ClipboardList,
  Ticket,
  Layers,
  RefreshCw,
  Download,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getUser, getToken } from "@/utils/auth";
import ReactMarkdown from "react-markdown";

interface Module {
  id: number;
  key: string;
  name: string;
  submodules: SubModule[];
}

interface SubModule {
  id: number;
  key: string;
  name: string;
}

interface AIResponse {
  request_id: string;
  summary: string;
  module: {
    id: number;
    key: string;
    name: string;
  };
  submodules: Array<{
    id: number;
    key: string;
    name: string;
  }>;
  sites: string[];
  results: any;
}

interface ChatHistory {
  id: string;
  timestamp: Date;
  question: string;
  response: AIResponse;
  module: string;
  submodule: string;
}

interface AIAssistantWidgetProps {
  allowedModuleId?: number; // Optional: filter to specific module (1=assets, 2=tickets, 3=checklist, 4=inventory)
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  allowedModuleId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>("");
  const [selectedSubModuleId, setSelectedSubModuleId] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModules, setIsLoadingModules] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedSheet, setExpandedSheet] = useState<string | null>(null);

  const user = getUser();
  const token = getToken();

  useEffect(() => {
    if (isOpen && modules.length === 0) {
      fetchModules();
    }
  }, [isOpen]);

  const fetchModules = async () => {
    setIsLoadingModules(true);
    setError("");
    try {
      // Use different endpoint based on context
      const apiUrl = allowedModuleId
        ? `https://dashboard.lockated.com/api-fastapi/modules?allowed_module_ids=${allowedModuleId}`
        : "https://dashboard.lockated.com/api-fastapi/modules";

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch modules");
      const data = await response.json();
      const modules = data.modules || [];
      setModules(modules);

      // Auto-select module if only one is available (page-specific view)
      if (modules.length === 1) {
        setSelectedModuleId(modules[0].id.toString());
      }
    } catch (err) {
      setError("Failed to load modules. Please try again.");
      console.error("Error fetching modules:", err);
    } finally {
      setIsLoadingModules(false);
    }
  };

  const handleSubmit = async () => {
    if (!question.trim() || !selectedModuleId) {
      setError("Please select a module and enter a question");
      return;
    }

    if (!user?.id || !token) {
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError("");
    setResponse(null);

    try {
      const response = await fetch(
        "https://dashboard.lockated.com/api-fastapi/ai-process/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.id,
            access_token: token,
            question: question.trim(),
            module_id: parseInt(selectedModuleId),
            sub_module_id:
              selectedSubModuleId && selectedSubModuleId !== "all"
                ? parseInt(selectedSubModuleId)
                : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process AI request");
      }

      const data: AIResponse = await response.json();
      setResponse(data);

      // Add to chat history
      const historyEntry: ChatHistory = {
        id: data.request_id,
        timestamp: new Date(),
        question: question.trim(),
        response: data,
        module: selectedModule?.name || "",
        submodule:
          selectedModule?.submodules.find(
            (s) => s.id.toString() === selectedSubModuleId
          )?.name || "",
      };
      setChatHistory((prev) => [historyEntry, ...prev]);

      setQuestion("");
    } catch (err) {
      setError("Failed to get AI insights. Please try again.");
      console.error("Error processing AI request:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedModule = modules.find(
    (m) => m.id.toString() === selectedModuleId
  );

  const handleReset = () => {
    setResponse(null);
    setQuestion("");
    setSelectedModuleId("");
    setSelectedSubModuleId("");
    setError("");
    setShowHistory(false);
  };

  const downloadAsExcel = (sheetData: any, sheetName: string) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData.sample || []);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${sheetName}_${new Date().getTime()}.xlsx`);
  };

  const downloadAllSheets = (results: any) => {
    const wb = XLSX.utils.book_new();
    Object.entries(results).forEach(([key, data]: [string, any]) => {
      if (data.type === "excel" && data.sheets) {
        Object.entries(data.sheets).forEach(
          ([sheetName, sheetData]: [string, any]) => {
            if (sheetData.sample && sheetData.sample.length > 0) {
              const ws = XLSX.utils.json_to_sheet(sheetData.sample);
              XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
            }
          }
        );
      }
    });
    XLSX.writeFile(wb, `AI_Report_${new Date().getTime()}.xlsx`);
  };

  const loadHistoryItem = (item: ChatHistory) => {
    setResponse(item.response);
    setShowHistory(false);
  };

  // Get icon based on module key
  const getModuleIcon = (key: string) => {
    switch (key) {
      case "assets":
        return <Package className="h-4 w-4" />;
      case "tickets":
        return <Ticket className="h-4 w-4" />;
      case "checklist":
        return <ClipboardList className="h-4 w-4" />;
      case "inventory":
        return <Layers className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  // Check if the current domain is allowed
  const isAllowedDomain = () => {
    const hostname = window.location.hostname;
    return (
      hostname === "lockated.gophygital.work" ||
      hostname === "localhost" ||
      hostname === "127.0.0.1"
    );
  };

  // Don't render if not on allowed domain
  if (!isAllowedDomain()) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-[#DBC2A9] hover:bg-[#C4B89D] z-50 group border-2 border-[#C4B89D]"
          size="icon"
        >
          <Bot className="h-6 w-6 text-[#1A1A1A] group-hover:scale-105 transition-transform" />
        </Button>
      )}

      {/* AI Widget */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[480px] h-[650px] shadow-2xl z-50 flex flex-col bg-white dark:bg-slate-900 border border-[#C4B89D]/40 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="relative bg-[#DBC2A9] px-5 py-4 flex items-center justify-between border-b border-[#C4B89D]">
            <div className="relative flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white/60 flex items-center justify-center shadow-sm">
                <Bot className="h-6 w-6 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-bold text-lg flex items-center gap-2">
                  AI Assistant
                  <Sparkles className="h-4 w-4 text-[#C72030]" />
                </h3>
                <p className="text-[#1A1A1A]/70 text-xs font-medium">
                  Powered by Lockated
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {chatHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(!showHistory)}
                  className="relative text-[#1A1A1A] hover:bg-white/40 rounded-lg transition-all"
                  title="View History"
                >
                  <History className="h-5 w-5" />
                  {chatHistory.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C72030] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {chatHistory.length}
                    </span>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="relative text-[#1A1A1A] hover:bg-white/40 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
            {isLoadingModules ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-[#C72030]" />
                <p className="text-sm text-slate-600">Loading modules...</p>
              </div>
            ) : showHistory ? (
              // Show History
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg flex items-center gap-2 text-[#C72030]">
                    <History className="h-5 w-5" />
                    Chat History
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="text-xs border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                  >
                    Back
                  </Button>
                </div>

                {chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No chat history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-[#C4B89D]/40 hover:border-[#C72030] cursor-pointer transition-all hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <p className="text-xs text-slate-500 mb-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">
                              {item.question}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 text-xs text-slate-600">
                          <span className="bg-[#DBC2A9]/30 px-2 py-1 rounded">
                            {item.module}
                          </span>
                          <span className="bg-[#DBC2A9]/30 px-2 py-1 rounded">
                            {item.submodule}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : response ? (
              // Show Response
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-lg flex items-center gap-2 text-[#C72030]">
                    <Sparkles className="h-5 w-5" />
                    AI Insights
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    New Question
                  </Button>
                </div>

                <div className="space-y-2 text-sm bg-white dark:bg-slate-800 rounded-lg p-4 border border-[#C4B89D]/40">
                  <div className="flex items-center gap-2">
                    {getModuleIcon(response.module.key)}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Module:
                    </span>
                    <span className="text-slate-900 dark:text-white font-medium">
                      {response.module.name}
                    </span>
                  </div>
                  {response.submodules.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-slate-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Sub-module:
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {response.submodules[0].name}
                      </span>
                    </div>
                  )}
                  {response.sites.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        Sites:
                      </span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        {response.sites.join(", ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:from-[#C72030]/10 dark:to-[#C72030]/10 rounded-lg p-5 border border-[#C4B89D]/40 shadow-sm">
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-[#C72030] dark:prose-headings:text-[#d83945] prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-[#C72030] prose-li:text-slate-700 dark:prose-li:text-slate-300">
                    <ReactMarkdown>{response.summary}</ReactMarkdown>
                  </div>
                </div>

                {/* Excel Data Display */}
                {response.results &&
                  Object.keys(response.results).length > 0 && (
                    <div className="space-y-4">
                      {Object.entries(response.results).map(
                        ([key, data]: [string, any]) => {
                          if (data.type === "excel" && data.sheets) {
                            return (
                              <div
                                key={key}
                                className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-[#C4B89D]/40"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h5 className="font-bold text-base text-[#C72030] flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    {key.replace(/_/g, " ").toUpperCase()}
                                  </h5>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      downloadAllSheets(response.results)
                                    }
                                    className="bg-[#C72030] hover:bg-[#a81c29] text-white text-xs"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    Download All
                                  </Button>
                                </div>

                                {/* Sheet Tabs */}
                                <div className="space-y-3">
                                  {Object.entries(data.sheets).map(
                                    ([sheetName, sheetData]: [string, any]) => (
                                      <div
                                        key={sheetName}
                                        className="border border-[#C4B89D]/30 rounded-lg overflow-hidden"
                                      >
                                        <div
                                          onClick={() =>
                                            setExpandedSheet(
                                              expandedSheet === sheetName
                                                ? null
                                                : sheetName
                                            )
                                          }
                                          className="bg-[#DBC2A9]/20 px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-[#DBC2A9]/30 transition-all"
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm text-slate-800">
                                              {sheetName}
                                            </span>
                                            <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded">
                                              {sheetData.rows} rows
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                downloadAsExcel(
                                                  sheetData,
                                                  sheetName
                                                );
                                              }}
                                              className="h-7 text-xs hover:bg-white"
                                            >
                                              <Download className="h-3 w-3 mr-1" />
                                              Excel
                                            </Button>
                                            {expandedSheet === sheetName ? (
                                              <ChevronUp className="h-4 w-4" />
                                            ) : (
                                              <ChevronDown className="h-4 w-4" />
                                            )}
                                          </div>
                                        </div>

                                        {expandedSheet === sheetName &&
                                          sheetData.sample &&
                                          sheetData.sample.length > 0 && (
                                            <div className="overflow-x-auto bg-white">
                                              <table className="w-full text-xs">
                                                <thead className="bg-[#DBC2A9]/40 sticky top-0">
                                                  <tr>
                                                    {sheetData.columns.map(
                                                      (
                                                        col: string,
                                                        idx: number
                                                      ) => (
                                                        <th
                                                          key={idx}
                                                          className="px-3 py-2 text-left font-semibold text-slate-700 border-b border-[#C4B89D]/30 whitespace-nowrap"
                                                        >
                                                          {col}
                                                        </th>
                                                      )
                                                    )}
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {sheetData.sample
                                                    .slice(0, 10)
                                                    .map(
                                                      (
                                                        row: any,
                                                        rowIdx: number
                                                      ) => (
                                                        <tr
                                                          key={rowIdx}
                                                          className="border-b border-slate-200 hover:bg-slate-50"
                                                        >
                                                          {sheetData.columns.map(
                                                            (
                                                              col: string,
                                                              colIdx: number
                                                            ) => (
                                                              <td
                                                                key={colIdx}
                                                                className="px-3 py-2 text-slate-600 whitespace-nowrap"
                                                              >
                                                                {row[col] !==
                                                                  null &&
                                                                row[col] !==
                                                                  undefined
                                                                  ? String(
                                                                      row[col]
                                                                    )
                                                                  : "-"}
                                                              </td>
                                                            )
                                                          )}
                                                        </tr>
                                                      )
                                                    )}
                                                </tbody>
                                              </table>
                                              {sheetData.sample.length > 10 && (
                                                <div className="bg-[#DBC2A9]/10 px-4 py-2 text-center text-xs text-slate-600">
                                                  Showing 10 of{" "}
                                                  {sheetData.sample.length}{" "}
                                                  rows. Download Excel for full
                                                  data.
                                                </div>
                                              )}
                                            </div>
                                          )}

                                        {expandedSheet === sheetName &&
                                          (!sheetData.sample ||
                                            sheetData.sample.length === 0) && (
                                            <div className="bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                              No data available for this sheet
                                            </div>
                                          )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>
                  )}
              </div>
            ) : (
              // Show Form
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Ask me anything about your data
                  </p>
                </div>

                {/* Module Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#C72030]" />
                    Select Module
                  </label>
                  <Select
                    value={selectedModuleId}
                    onValueChange={(value) => {
                      setSelectedModuleId(value);
                      setSelectedSubModuleId("");
                    }}
                  >
                    <SelectTrigger className="w-full border-[#C4B89D]/40 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030]">
                      <SelectValue placeholder="Choose a module..." />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem
                          key={module.id}
                          value={module.id.toString()}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {getModuleIcon(module.key)}
                            <span>{module.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-Module Selection */}
                {selectedModule && selectedModule.submodules.length > 0 && (
                  <div className="space-y-2 animate-in fade-in duration-300">
                    <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#C72030]" />
                      Select Sub-Module{" "}
                      <span className="text-xs text-slate-500">(Optional)</span>
                    </label>
                    <Select
                      value={selectedSubModuleId}
                      onValueChange={setSelectedSubModuleId}
                    >
                      <SelectTrigger className="w-full border-[#C4B89D]/40 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030]">
                        <SelectValue placeholder="All Sub-Modules" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="all"
                          className="cursor-pointer font-semibold"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-[#C72030]" />
                            <span>All Sub-Modules</span>
                          </div>
                        </SelectItem>
                        {selectedModule.submodules.map((submodule) => (
                          <SelectItem
                            key={submodule.id}
                            value={submodule.id.toString()}
                            className="cursor-pointer"
                          >
                            {submodule.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Question Input */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#C72030]" />
                    Your Question
                  </label>
                  <Textarea
                    placeholder="e.g., 'Provide actionable insights on tickets for Pune' or 'Show me asset maintenance trends'"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[110px] resize-none border-[#C4B89D]/40 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030]"
                    disabled={isLoading}
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400 flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !question.trim() || !selectedModuleId}
                  className="w-full h-11  text-white font-semibold shadow-lg hover:shadow-xl transition-all  disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Get AI Insights
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-[#C4B89D]/40 dark:border-slate-700 bg-white dark:from-slate-900 dark:to-slate-800">
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 font-medium">
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
