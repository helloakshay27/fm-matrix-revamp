import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setToken, clearTokenFromStore } from "@/api/client";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string | null;
  organizationId?: number | null;
  lockatedAccessToken?: string | null;
}

const MANAGE_ROLES = ["supervisor", "org_admin", "platform_admin"];
const ADMIN_ROLES = ["org_admin", "platform_admin"];

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isPlatformAdmin: boolean;
  isAdmin: boolean; // org_admin or platform_admin — can access Settings
  canManage: boolean; // supervisor or above — can create/edit/delete settings
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isPlatformAdmin: false,
      isAdmin: false,
      canManage: false,

      login: (user, token) => {
        setToken(token);
        set({
          user,
          token,
          isLoggedIn: true,
          isPlatformAdmin: user.role === "platform_admin",
          isAdmin: !!user.role && ADMIN_ROLES.includes(user.role),
          canManage: !!user.role && MANAGE_ROLES.includes(user.role),
        });
      },

      logout: () => {
        clearTokenFromStore();
        set({
          user: null,
          token: null,
          isLoggedIn: false,
          isPlatformAdmin: false,
          isAdmin: false,
          canManage: false,
        });
      },
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setToken(state.token);
      },
    }
  )
);
