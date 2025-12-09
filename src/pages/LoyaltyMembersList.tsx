import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";
import { ChevronRight, ArrowLeft, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

const LoyaltyMembersList = () => {
  const baseURL = API_CONFIG.BASE_URL;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });
  const navigate = useNavigate();

  const getPageFromStorage = () => {
    return parseInt(localStorage.getItem("loyalty_members_currentPage")) || 1;
  };

  const [pagination, setPagination] = useState({
    current_page: getPageFromStorage(),
    total_count: 0,
    total_pages: 0,
  });

  const pageSize = 10;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/loyalty/members.json`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      });

      const formattedMembers = (response.data || []).map((member) => ({
        ...member,
        tier_validity: formatDate(member.tier_validity),
        last_sign_in: formatDate(member.last_sign_in),
      }));

      setMembers(formattedMembers);
      setPagination({
        current_page: getPageFromStorage(),
        total_count: formattedMembers.length,
        total_pages: Math.ceil(formattedMembers.length / pageSize),
      });
    } catch (error) {
      console.error("Error fetching loyalty members:", error);
      toast.error("Failed to load loyalty members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const term = e.target.value;
    setSearchQuery(term);

    if (term.trim()) {
      const filtered = members.filter((member) => {
        const q = term.toLowerCase();
        return [
          member.id,
          `${member.firstname} ${member.lasttname}`,
          member.member_status?.tier_level,
          member.current_loyalty_points,
          member.last_sign_in,
          member.tier_validity,
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
        setSearchQuery(`${selectedItem.firstname} ${selectedItem.lasttname}`);
        setSuggestions([]);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (member) => {
    setSearchQuery(`${member.firstname} ${member.lasttname}`);
    setSuggestions([]);
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const handlePageChange = (pageNumber) => {
    setPagination((prev) => ({
      ...prev,
      current_page: pageNumber,
    }));
    localStorage.setItem("loyalty_members_currentPage", pageNumber);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setPagination((prev) => ({ ...prev, current_page: 1 }));
  };

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    
    return members.filter((member) => {
      const q = searchQuery.toLowerCase();
      return [
        member.id,
        `${member.firstname} ${member.lasttname}`,
        member.member_status?.tier_level,
        member.current_loyalty_points,
        member.last_sign_in,
        member.tier_validity,
      ]
        .map((v) => (v !== null && v !== undefined ? String(v).toLowerCase() : ""))
        .some((v) => v.includes(q));
    });
  }, [members, searchQuery]);

  const sortedItems = useMemo(() => {
    let sortableItems = [...filteredMembers];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aVal = sortConfig.key === 'id' ? Number(a[sortConfig.key]) : a[sortConfig.key];
        const bVal = sortConfig.key === 'id' ? Number(b[sortConfig.key]) : b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredMembers, sortConfig]);

  const totalFiltered = sortedItems.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const startIndex = (pagination.current_page - 1) * pageSize;

  const displayedMembers = sortedItems.slice(startIndex, startIndex + pageSize);

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
            <span className="text-[#C72030] font-medium">Members</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">LOYALTY MEMBERS</h1>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end items-center gap-3 mb-4">
          <div className="w-80 relative">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                className="flex-1 px-4 py-2 outline-none"
                placeholder="Search by Member Name"
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
                {suggestions.map((member, index) => (
                  <li
                    key={member.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${selectedIndex === index ? 'bg-gray-100' : ''}`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => handleSuggestionClick(member)}
                  >
                    {member.firstname} {member.lasttname}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Loyalty Members List</h3>
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
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer"
                          style={{ borderColor: "#fff", width: "120px" }}
                          onClick={() => requestSort('id')}
                        >
                          Member ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer"
                          style={{ borderColor: "#fff", minWidth: "180px" }}
                          onClick={() => requestSort('firstname')}
                        >
                          Member Name {sortConfig.key === 'firstname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "130px" }}>Tier Level</TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 border-r" style={{ borderColor: "#fff", width: "150px" }}>Current Balance</TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer"
                          style={{ borderColor: "#fff", width: "160px" }}
                          onClick={() => requestSort('last_activity_date')}
                        >
                          Last Activity {sortConfig.key === 'last_activity_date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="font-semibold text-gray-900 py-3 px-4 border-r cursor-pointer"
                          style={{ borderColor: "#fff", width: "130px" }}
                          onClick={() => requestSort('tier_validity')}
                        >
                          Tier Validity {sortConfig.key === 'tier_validity' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 py-3 px-4 text-center" style={{ borderColor: "#fff", width: "80px" }}>View</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedMembers.length > 0 ? (
                        displayedMembers.map((member) => (
                          <TableRow key={member.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="py-3 px-4 font-medium">{member.id}</TableCell>
                            <TableCell className="py-3 px-4">{member.firstname} {member.lasttname}</TableCell>
                            <TableCell className="py-3 px-4">{member.member_status?.tier_level || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{member.current_loyalty_points || '0'}</TableCell>
                            <TableCell className="py-3 px-4">{member.member_status?.last_activity_date || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">{member.member_status?.tier_validity || 'N/A'}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div className="flex justify-center">
                                <Link to={`/setup-member/member-details/${member.id}`}>
                                  <Eye className="w-5 h-5 text-gray-600 hover:text-[#8B0203] transition-colors" />
                                </Link>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                            {searchQuery ? (
                              <div>
                                <p className="text-lg mb-2">No members found</p>
                                <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                              </div>
                            ) : (
                              "No loyalty members found"
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {displayedMembers.length > 0 && totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 px-3">
                    {/* ...existing pagination code similar to SiteList... */}
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

export default LoyaltyMembersList;
