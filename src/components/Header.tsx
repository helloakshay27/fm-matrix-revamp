import React, { useState, useEffect } from "react";
import {
  Bell,
  User,
  MapPin,
  ChevronDown,
  Home,
  Loader2,
  LogOut,
  Settings,
  Mail,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SearchWithSuggestions } from "./SearchWithSuggestions";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchAllowedCompanies,
  changeCompany,
} from "@/store/slices/projectSlice";
import {
  fetchAllowedSites,
  changeSite,
  clearSites,
} from "@/store/slices/siteSlice";
import { getUser, clearAuth } from "@/utils/auth";
import { permissionService } from "@/services/permissionService";
import { is } from "date-fns/locale";
import { OIG_LOGO_CODE } from "@/assets/pdf/oig-logo-code";
import { VI_LOGO_CODE } from "@/assets/vi-logo-code";
import { DEFAULT_LOGO_CODE } from "@/assets/default-logo-code";

export interface Company {
  id: number;
  name: string;
}

export interface Site {
  id: number;
  name: string;
}

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);
  const [userRoleName, setUserRoleName] = useState<string | null>(null);
  // VI account details (for vi-web only)
  const [viAccount, setViAccount] = useState<{ firstname?: string; lastname?: string; email?: string; role_name?: string } | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const currentPath = window.location.pathname;

  // Redux state
  const {
    companies,
    selectedCompany,
    loading: projectLoading,
  } = useSelector((state: RootState) => state.project);
  const {
    sites,
    selectedSite,
    loading: siteLoading,
  } = useSelector((state: RootState) => state.site);

  const hostname = window.location.hostname;

  // Check if it's Oman site
  const isOmanSite = hostname.includes("oig.gophygital.work");
  // Treat vi-web prod and localhost as VI for dev account fetch
  const isViSite = hostname.includes("vi-web.gophygital.work");

  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(3);

  useEffect(() => {
    if (selectedSite) {
      localStorage.setItem("selectedSiteName", selectedSite.name);
    }
  }, [selectedSite])

  // Get user data from localStorage
  const user = getUser() || {
    id: 0,
    firstname: "Guest",
    lastname: "",
    email: "",
  };
  const userId = user.id;

  const assetSuggestions = [
    "sdcdsc",
    "test",
    "asus zenbook",
    "Diesel Generator",
    "A.c",
    "Energy Meter 23",
    "Located",
    "sebc",
    "Hay",
    "ktta",
    "demo",
    "jyoti tower",
    "jyoti",
    "203696",
    "203606",
    "194409",
    "166641",
    "168838",
    "144714",
    "53815",
  ];

  // Load user display name and role name from localStorage
  useEffect(() => {
    const loadUserInfo = () => {
      const displayName = permissionService.getDisplayName();
      const roleName = permissionService.getRoleName();
      setUserDisplayName(displayName);
      setUserRoleName(roleName);
    };

    loadUserInfo();
  }, []);

  // Fetch VI account from baseUrl for vi-web (and localhost for dev)
  useEffect(() => {
    if (!isViSite) return;
    try {
      let token = localStorage.getItem('token');
      if (!token) {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('access_token') || params.get('token');
        if (urlToken) {
          localStorage.setItem('token', urlToken);
          token = urlToken;
        }
      }
      if (!token) return;
      const raw = localStorage.getItem('baseUrl') || 'https://live-api.gophygital.work';
      const base = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      const url = `${base.replace(/\/+$/, '')}/api/users/account.json`;
      fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(data => {
          setViAccount({
            firstname: data?.firstname,
            lastname: data?.lastname,
            email: data?.email,
            role_name: data?.role_name,
          });
        })
        .catch(() => { });
    } catch { /* no-op */ }
  }, [isViSite]);

  useEffect(() => {
    if (selectedCompany) {
      // setCompany(selectedCompany.name)
      localStorage.setItem("selectedCompany", selectedCompany.name);
      localStorage.setItem("selectedCompanyId", selectedCompany.id.toString());
    }
  }, [selectedCompany]);

  const handleSearch = (searchTerm: string) => {
    console.log("Search term:", searchTerm);
  };

  // Load initial data
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        await dispatch(fetchAllowedCompanies()).unwrap();
      } catch (error) {
        console.log(error);
      }
    };

    fetchCompanies();
  }, [dispatch]);

  // Load sites when company changes
  useEffect(() => {
    if (selectedCompany) {
      dispatch(fetchAllowedSites(userId));
    } else {
      dispatch(clearSites());
    }
  }, [selectedCompany, userId, dispatch]);

  // Handle company change
  const handleCompanyChange = async (companyId: number) => {
    try {
      const response = await dispatch(changeCompany(companyId)).unwrap();
      // Reload page smoothly after successful company change
      window.location.reload();
    } catch (error) {
      console.error("Failed to change company:", error);
    }
  };

  // Handle site change
  const handleSiteChange = async (siteId: number) => {
    try {
      await dispatch(changeSite(siteId)).unwrap();
      // Reload page smoothly after successful site change
      window.location.reload();
    } catch (error) {
      console.error("Failed to change site:", error);
    }
  };

  // Compute profile display name (prefer VI account when available)
  const profileDisplayName = (
    (isViSite && viAccount
      ? `${viAccount.firstname || ""} ${viAccount.lastname || ""}`.trim()
      : `${user.firstname || ""} ${user.lastname || ""}`.trim()) ||
    userDisplayName ||
    user.firstname ||
    "User"
  );

  return (
    <header className="h-16 bg-white border-b border-[#D5DbDB] fixed top-0 right-0 left-0 z-10 w-full shadow-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex align-items-center gap-14">
          {isOmanSite ? (
            <div className="flex items-center">
              <div dangerouslySetInnerHTML={{ __html: OIG_LOGO_CODE }} />
            </div>
          ) : isViSite ? (
            <div className="flex items-center">
              <div dangerouslySetInnerHTML={{ __html: VI_LOGO_CODE }} />
            </div>
          ) : (
            <div className="flex items-center">
              <div dangerouslySetInnerHTML={{ __html: DEFAULT_LOGO_CODE }} />
            </div>
          )}

          {/* Dashboard Button */}
          {!isViSite && (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#1a1a1a] hover:text-[#C72030] hover:bg-[#f6f4ee] rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </button>
          )}

          {/* Project Dropdown */}
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
              <Building2 className="w-4 h-4" />

              {projectLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span className="text-sm font-medium">
                  {selectedCompany?.name || "Select Project"}
                </span>
              )}
              <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg max-h-[60vh] overflow-y-auto">
              {companies.map((company) => (
                <DropdownMenuItem
                  key={company.id}
                  onClick={() => handleCompanyChange(company.id)}
                  className={
                    selectedCompany?.id === company.id
                      ? "bg-[#f6f4ee] text-[#C72030]"
                      : ""
                  }
                >
                  {company.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Site Dropdown (hidden for VI and localhost) */}
          {!isViSite && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 text-[#1a1a1a] hover:text-[#C72030] transition-colors">
                <MapPin className="w-4 h-4" />
                {siteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="text-sm font-medium">
                    {selectedSite?.name || "Select Site"}
                  </span>
                )}
                <ChevronDown className="w-3 h-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-white border border-[#D5DbDB] shadow-lg max-h-[60vh] overflow-y-auto">
                {sites.length > 0 ? (
                  sites.map((site) => (
                    <DropdownMenuItem
                      key={site.id}
                      onClick={() => handleSiteChange(site.id)}
                      className={
                        selectedSite?.id === site.id
                          ? "bg-[#f6f4ee] text-[#C72030]"
                          : ""
                      }
                    >
                      {site.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    {selectedCompany
                      ? "No sites available"
                      : "Select a project first"}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="relative">
            <button className="p-2 hover:bg-[#f6f4ee] rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-[#1a1a1a]" />
            </button>
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full">
                {notificationCount}
              </Badge>
            )}
          </div>

          <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DropdownMenuTrigger className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#C4b89D] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#1a1a1a]" />
              </div>
              <div className="hidden md:block">
                <span className="text-sm font-medium text-[#1a1a1a]">{profileDisplayName}</span>
                <ChevronDown className="w-3 h-3 text-[#1a1a1a] inline-block ml-1" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 bg-white border border-[#D5DbDB] shadow-lg p-2">
              <div className="px-2 py-2 mb-2 border-b border-gray-100">
                <p className="font-medium text-sm">
                  {isViSite && viAccount
                    ? `${viAccount.firstname || ''} ${viAccount.lastname || ''}`.trim() || 'User'
                    : `${user.firstname} ${user.lastname}`}
                </p>
                <div className="flex items-center text-gray-600 text-xs mt-1">
                  <Mail className="w-3 h-3 mr-1" />
                  <span>{(isViSite && viAccount ? (viAccount.email || '') : user.email) || ''}</span>
                </div>
                <div className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded mt-2 inline-block">
                  {(isViSite && viAccount ? (viAccount.role_name || '') : (userRoleName || user?.lock_role?.name)) || "No Role"}{" "}
                </div>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/login");

                  permissionService.clearUserData();
                  clearAuth();

                  window.location.reload();
                  // Clear stored user data from permissionService
                }}
                className="flex items-center gap-2 text-red-600 focus:text-red-700 focus:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
