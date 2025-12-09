import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, Edit, Eye, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Tier Name is required"),
  exit_points: Yup.number()
    .required("Exit Points are required")
    .positive("Exit Points must be a positive number"),
  multipliers: Yup.number()
    .required("Multipliers are required")
    .positive("Multipliers must be a positive number"),
  welcome_bonus: Yup.number()
    .required("Welcome Bonus is required")
    .positive("Welcome Bonus must be a positive number"),
  point_type: Yup.string()
    .required("Point type is required")
    .oneOf(["lifetime", "yearly"], "Invalid point type"),
});

const LoyaltyTiersList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedTier, setSelectedTier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("loyalty_tiers_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    setLoading(true);
    const storedValue = sessionStorage.getItem("selectedId");
    try {
      const response = await axios.get(
        `${baseURL}/loyalty/tiers.json?q[loyalty_type_id_eq]=${storedValue}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Ensure tiersData is always an array
      let tiersData = [];
      if (Array.isArray(response.data)) {
        tiersData = response.data;
      } else if (response.data?.tiers && Array.isArray(response.data.tiers)) {
        tiersData = response.data.tiers;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        tiersData = response.data.data;
      }

      setTiers(tiersData);
      setPagination({
        current_page: getPageFromStorage(),
        total_count: tiersData.length,
        total_pages: Math.ceil(tiersData.length / pageSize),
      });
    } catch (error) {
      console.error("Error fetching tiers:", error);
      toast.error("Failed to load tiers");
      setTiers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (tier) => {
    setSelectedTier(tier);
    setShowModal(true);
  };

  const handleFormSubmit = async (values) => {
    if (selectedTier) {
      try {
        await axios.put(
          `${baseURL}/loyalty/tiers/${selectedTier.id}.json`,
          { loyalty_tier: values },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Tier updated successfully!");
        await fetchTiers();
        handleCloseModal();
      } catch (error) {
        console.error("Error updating tier:", error);
        toast.error("Failed to update tier");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTier(null);
  };

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchQuery(term);

    if (term.trim()) {
      const filtered = tiers.filter((tier) => {
        const q = term.toLowerCase();
        const multipliersStr =
          tier.multipliers !== undefined && tier.multipliers !== null
            ? String(tier.multipliers) + "x"
            : "";

        return [
          tier.name,
          tier.exit_points,
          multipliersStr,
          tier.multipliers,
          tier.welcome_bonus,
          tier.point_type,
        ]
          .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
          .some((v) => v.includes(q));
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

  const handleSuggestionClick = (tier) => {
    setSearchQuery(tier.name);
    setSuggestions([]);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("loyalty_tiers_currentPage", pageNumber);
  };

  const filteredTiers = useMemo(() => {
    if (!Array.isArray(tiers)) return []; // Safety check
    if (!searchQuery.trim()) return tiers;

    return tiers.filter((tier) => {
      const q = searchQuery.toLowerCase();
      const multipliersStr =
        tier.multipliers !== undefined && tier.multipliers !== null
          ? String(tier.multipliers) + "x"
          : "";

      return [
        tier.name,
        tier.exit_points,
        multipliersStr,
        tier.multipliers,
        tier.welcome_bonus,
        tier.point_type,
      ]
        .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some((v) => v.includes(q));
    });
  }, [tiers, searchQuery]);

  const yearlyTier = Array.isArray(tiers) ? tiers.filter((item) => item.point_type === "yearly").length : 0;
  const lifeTimeTier = Array.isArray(tiers) ? tiers.filter((item) => item.point_type === "lifetime").length : 0;

  const totalFiltered = filteredTiers.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedTiers = filteredTiers.slice(startIndex, startIndex + pageSize);

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
            <span className="text-[#C72030] font-medium">Tiers</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LOYALTY TIERS</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-[#8B0203] to-[#C72030] rounded-lg p-4 text-white">
            <p className="text-3xl font-bold mb-1">{tiers.length}</p>
            <p className="text-sm opacity-90">Total Tiers</p>
          </div>
          <div className="bg-gradient-to-r from-[#8B0203] to-[#C72030] rounded-lg p-4 text-white">
            <p className="text-3xl font-bold mb-1">{yearlyTier}</p>
            <p className="text-sm opacity-90">Rolling Year Tiers</p>
          </div>
          <div className="bg-gradient-to-r from-[#8B0203] to-[#C72030] rounded-lg p-4 text-white">
            <p className="text-3xl font-bold mb-1">{lifeTimeTier}</p>
            <p className="text-sm opacity-90">Life Time Tiers</p>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80 relative">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search by Tier name"
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
                {suggestions.map((tier, index) => (
                  <li
                    key={tier.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSuggestionClick(tier)}
                  >
                    {tier.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors"
            onClick={() => navigate("/setup-member/new-tier")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"></path>
            </svg>
            <span>New Tier</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Tiers List</h3>
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
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", minWidth: "180px" }}>Tier Name</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Exit Points</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Multipliers</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Welcome Bonus</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "140px" }}>Member Count</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center" style={{ borderColor: "#fff", width: "120px" }}>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedTiers.length > 0 ? (
                        displayedTiers.map((tier) => (
                          <TableRow key={tier.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{tier.name}</TableCell>
                            <TableCell className="py-3 px-4">{tier.exit_points}</TableCell>
                            <TableCell className="py-3 px-4">{tier.multipliers}x</TableCell>
                            <TableCell className="py-3 px-4">{tier.welcome_bonus} Points</TableCell>
                            <TableCell className="py-3 px-4">{tier.member_count || 0}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  onClick={() => handleEditClick(tier)}
                                  className="text-gray-600 hover:text-[#8B0203] transition-colors"
                                  title="Edit Tier"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => navigate(`/setup-member/tier-details/${tier.id}`)}
                                  className="text-gray-600 hover:text-[#8B0203] transition-colors"
                                  title="View Tier"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No tiers found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-lg mb-2">No tiers found</p>
                                <p className="text-sm text-gray-400">Create your first tier to get started</p>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedTiers.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code similar to SiteList... */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Edit Tier</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6">
                {selectedTier && (
                  <Formik
                    initialValues={{
                      name: selectedTier.name || "",
                      exit_points: selectedTier.exit_points || 0,
                      multipliers: selectedTier.multipliers || 0,
                      welcome_bonus: selectedTier.welcome_bonus || 0,
                      point_type: selectedTier.point_type || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                  >
                    {({ values, handleChange }) => (
                      <Form>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Tier Name */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Tier Name
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Field
                              type="text"
                              name="name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Exit Points */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Exit Points
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Field
                              type="number"
                              name="exit_points"
                              value={values.exit_points}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                            />
                            <ErrorMessage name="exit_points" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Multipliers */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Multipliers
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Field
                              type="number"
                              name="multipliers"
                              value={values.multipliers}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                            />
                            <ErrorMessage name="multipliers" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Welcome Bonus */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Welcome Bonus
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <Field
                              type="number"
                              name="welcome_bonus"
                              value={values.welcome_bonus}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                            />
                            <ErrorMessage name="welcome_bonus" component="div" className="text-red-500 text-xs mt-1" />
                          </div>

                          {/* Point Type */}
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Point Type
                              <span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                              name="point_type"
                              onChange={handleChange}
                              value={values.point_type}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B0203] focus:border-transparent outline-none transition-all"
                            >
                              <option value="lifetime">Life Time</option>
                              <option value="yearly">Yearly</option>
                            </select>
                            <ErrorMessage name="point_type" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-4 mt-8">
                          <button
                            type="submit"
                            className="px-8 py-2.5 bg-[#8B0203] text-white rounded-lg hover:bg-[#6d0102] transition-colors font-medium"
                          >
                            Submit
                          </button>
                          <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-8 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoyaltyTiersList;
