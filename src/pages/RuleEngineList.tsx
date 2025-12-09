import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const RuleEngineList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const navigate = useNavigate();
  const [ruleEngine, setRuleEngine] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("rule_engine_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  useEffect(() => {
    fetchRuleEngine();
  }, []);

  const fetchRuleEngine = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/rule_engine/rules.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      // Ensure we always have an array
      let rulesData = [];
      if (Array.isArray(response.data)) {
        rulesData = response.data;
      } else if (response.data?.rules && Array.isArray(response.data.rules)) {
        rulesData = response.data.rules;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        rulesData = response.data.data;
      }

      setRuleEngine(rulesData);
      setPagination({
        current_page: getPageFromStorage(),
        total_count: rulesData.length,
        total_pages: Math.ceil(rulesData.length / pageSize),
      });
    } catch (error) {
      console.error("Error fetching rule engine:", error);
      toast.error("Failed to load rules");
      setRuleEngine([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchQuery(term);

    if (term.trim() && Array.isArray(ruleEngine)) {
      const filtered = ruleEngine.filter((rule) => {
        const searchLower = term.toLowerCase();
        
        const ruleMatch = [
          rule.name,
          rule.description,
          rule.id?.toString(),
          rule.active ? 'active' : 'inactive'
        ].some(field => 
          field && field.toString().toLowerCase().includes(searchLower)
        );

        const conditionsMatch = rule.conditions?.some(condition => 
          [
            condition.condition_attribute,
            condition.condition_attribute_display_name,
            condition.operator,
            condition.compare_value,
          ].some(field => 
            field && field.toString().toLowerCase().includes(searchLower)
          )
        );

        return ruleMatch || conditionsMatch;
      });

      setSuggestions(filtered.slice(0, 10));
      setSelectedIndex(-1);
      setPagination((prev) => ({ ...prev, current_page: 1 }));
    } else {
      setSuggestions([]);
      setPagination((prev) => ({ ...prev, current_page: 1 }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const selectedItem = suggestions[selectedIndex];
        setSearchQuery(selectedItem.name);
        setSuggestions([]);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (rule) => {
    setSearchQuery(rule.name);
    setSuggestions([]);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("rule_engine_currentPage", pageNumber);
  };

  const handleToggle = async (id, isActive) => {
    try {
      await axios.patch(
        `${baseURL}/rule_engine/rules/${id}.json`,
        { rule_engine_rule: { active: isActive } },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setRuleEngine((prevRules) =>
        Array.isArray(prevRules) 
          ? prevRules.map((rule) =>
              rule.id === id ? { ...rule, active: isActive } : rule
            )
          : []
      );

      toast.success("Status updated successfully!");
    } catch (error) {
      console.error("Error updating rule:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredRules = Array.isArray(ruleEngine) 
    ? ruleEngine.filter((rule) => {
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        const ruleMatch = [
          rule.name,
          rule.description,
          rule.id?.toString(),
        ].some(field => field && field.toString().toLowerCase().includes(q));

        const conditionsMatch = rule.conditions?.some(condition => 
          [
            condition.condition_attribute_display_name,
            condition.operator,
            condition.compare_value,
          ].some(field => field && field.toString().toLowerCase().includes(q))
        );

        return ruleMatch || conditionsMatch;
      })
    : [];

  const totalFiltered = filteredRules.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedRules = filteredRules.slice(
    startIndex,
    startIndex + pageSize
  );

  const formatFieldName = (fieldName) => {
    if (!fieldName) return "";
    return fieldName
      .replace(/_/g, " ")
      .replace(/::/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const snakeToCapitalized = (str) => {
    if (!str) return "";
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 max-w-full h-[calc(100vh-50px)] overflow-y-auto">
        {/* Header with Back Button and Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-[#C72030] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Setup Member</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-400">Loyalty</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#C72030] font-medium">Rule Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">RULE ENGINE</h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80 relative">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleKeyDown}
              />
              <button type="button" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 transition-colors">
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.66927 13.939C3.9026 13.939 0.835938 11.064 0.835938 7.53271C0.835938 4.00146 3.9026 1.12646 7.66927 1.12646C11.4359 1.12646 14.5026 4.00146 14.5026 7.53271C14.5026 11.064 11.4359 13.939 7.66927 13.939ZM7.66927 2.06396C4.44927 2.06396 1.83594 4.52021 1.83594 7.53271C1.83594 10.5452 4.44927 13.0015 7.66927 13.0015C10.8893 13.0015 13.5026 10.5452 13.5026 7.53271C13.5026 4.52021 10.8893 2.06396 7.66927 2.06396Z" fill="#8B0203"/>
                  <path d="M14.6676 14.5644C14.5409 14.5644 14.4143 14.5206 14.3143 14.4269L12.9809 13.1769C12.7876 12.9956 12.7876 12.6956 12.9809 12.5144C13.1743 12.3331 13.4943 12.3331 13.6876 12.5144L15.0209 13.7644C15.2143 13.9456 15.2143 14.2456 15.0209 14.4269C14.9209 14.5206 14.7943 14.5644 14.6676 14.5644Z" fill="#8B0203"/>
                </svg>
              </button>
            </div>
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((rule, index) => (
                  <li
                    key={rule.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSuggestionClick(rule)}
                  >
                    {rule.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
            onClick={() => navigate("/setup-member/create-rule-engine")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
            </svg>
            <span>New Rule</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Rules List</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#8B0203] rounded-full animate-spin" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table className="border-separate">
                    <TableHeader>
                      <TableRow className="hover:bg-gray-50" style={{ backgroundColor: "#e6e2d8" }}>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "180px" }}>Rule Name</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "150px" }}>Attribute</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Condition</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Action</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "120px" }}>Outcome</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "100px" }}>Reward</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r text-center" style={{ borderColor: "#fff", width: "100px" }}>Status</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center" style={{ borderColor: "#fff", width: "80px" }}>View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedRules.length > 0 ? (
                        displayedRules.map((rule) => {
                          const conditions = rule.conditions || [];
                          const actions = rule.actions || [];
                          
                          if (conditions.length === 0) {
                            return (
                              <TableRow key={rule.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="py-3 px-4 font-medium">{rule.name}</TableCell>
                                <TableCell className="py-3 px-4">-</TableCell>
                                <TableCell className="py-3 px-4">-</TableCell>
                                <TableCell className="py-3 px-4">-</TableCell>
                                <TableCell className="py-3 px-4">
                                  {actions[0] ? formatFieldName(actions[0].action_method) : "-"}
                                </TableCell>
                                <TableCell className="py-3 px-4">
                                  {actions[0]?.parameters ? `${actions[0].parameters}${actions[0].action_method === "credit_points" ? " pts" : actions[0].action_method === "percentage_credit" ? " %" : ""}` : "-"}
                                </TableCell>
                                <TableCell className="py-3 px-4">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => handleToggle(rule.id, !rule.active)}
                                      className="text-gray-600 hover:opacity-80 transition-opacity"
                                    >
                                      {rule.active ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#28a745" viewBox="0 0 16 16">
                                          <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                        </svg>
                                      ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#6c757d" viewBox="0 0 16 16">
                                          <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zM5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                                        </svg>
                                      )}
                                    </button>
                                  </div>
                                </TableCell>
                                <TableCell className="py-3 px-4">
                                  <div className="flex justify-center">
                                    <button
                                      onClick={() => navigate(`/setup-member/view-rule-engine/${rule.id}`)}
                                      className="text-gray-600 hover:text-[#8B0203] transition-colors"
                                    >
                                      <Eye className="w-5 h-5" />
                                    </button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          }

                          return conditions.map((condition, index) => (
                            <TableRow key={`${rule.id}-${index}`} className="hover:bg-gray-50 transition-colors">
                              {index === 0 && (
                                <TableCell rowSpan={conditions.length} className="py-3 px-4 font-medium">
                                  {rule.name}
                                </TableCell>
                              )}
                              <TableCell className="py-3 px-4">
                                {condition.condition_attribute_display_name || "-"}
                              </TableCell>
                              <TableCell className="py-3 px-4">
                                {snakeToCapitalized(condition.operator) || "-"}
                              </TableCell>
                              <TableCell className="py-3 px-4">
                                {snakeToCapitalized(condition.compare_value) || "-"}
                              </TableCell>
                              {index === 0 && (
                                <>
                                  <TableCell rowSpan={conditions.length} className="py-3 px-4">
                                    {actions[0] ? formatFieldName(actions[0].action_method) : "-"}
                                  </TableCell>
                                  <TableCell rowSpan={conditions.length} className="py-3 px-4">
                                    {actions[0]?.parameters ? `${actions[0].parameters}${actions[0].action_method === "credit_points" ? " pts" : actions[0].action_method === "percentage_credit" ? " %" : ""}` : "-"}
                                  </TableCell>
                                  <TableCell rowSpan={conditions.length} className="py-3 px-4">
                                    <div className="flex justify-center">
                                      <button
                                        onClick={() => handleToggle(rule.id, !rule.active)}
                                        className="text-gray-600 hover:opacity-80 transition-opacity"
                                      >
                                        {rule.active ? (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#28a745" viewBox="0 0 16 16">
                                            <path d="M5 3a5 5 0 0 0 0 10h6a5 5 0 0 0 0-10zm6 9a4 4 0 1 1 0-8 4 4 0 0 1 0 8" />
                                          </svg>
                                        ) : (
                                          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="24" fill="#6c757d" viewBox="0 0 16 16">
                                            <path d="M11 4a4 4 0 0 1 0 8H8a5 5 0 0 0 2-4 5 5 0 0 0-2-4zM5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8M0 8a5 5 0 0 0 5 5h6a5 5 0 0 0 0-10H5a5 5 0 0 0-5 5" />
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                  </TableCell>
                                  <TableCell rowSpan={conditions.length} className="py-3 px-4">
                                    <div className="flex justify-center">
                                      <button
                                        onClick={() => navigate(`/setup-member/view-rule-engine/${rule.id}`)}
                                        className="text-gray-600 hover:text-[#8B0203] transition-colors"
                                      >
                                        <Eye className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ));
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No rules found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No rules found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedRules.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code similar to other lists... */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RuleEngineList;
