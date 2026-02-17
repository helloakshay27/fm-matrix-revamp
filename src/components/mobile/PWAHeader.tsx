import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const PWAHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get user info from localStorage
  const userFirstName = localStorage.getItem("firstname") || "User";
  const userLastName = localStorage.getItem("lastname") || "";
  const userEmail = localStorage.getItem("email") || "";

  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("baseUrl");
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");
    localStorage.removeItem("userId");

    toast.success("Logged out successfully");

    // Redirect to login page with fm_admin_login parameter
    navigate("/login-page?fm_admin_login", { replace: true });
  };

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/gophygital-logo-min.jpg"
            alt="FM Admin"
            className="h-8 w-auto object-contain"
            onError={(e) => {
              // Fallback if logo doesn't exist
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {userFirstName} {userLastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
