import { useNavigate, NavigateOptions, To } from "react-router-dom";
import { useCallback } from "react";
import {
  appendEmbeddedParams,
  hasEmbeddedSession,
  isEmbeddedMode,
} from "@/utils/embeddedMode";

/**
 * Custom navigation hook that automatically appends embedded=true
 * when the app is in embedded mode.
 *
 * This is a drop-in replacement for useNavigate() that ensures
 * embedded mode is preserved across all navigation.
 *
 * Note: The global history interceptor in embeddedMode.ts should handle
 * most cases automatically. This hook is provided for explicit control
 * or when you need to ensure embedded params are added.
 *
 * Usage:
 * ```tsx
 * const navigate = useEmbeddedNavigate();
 * navigate('/some/path'); // Will add ?embedded=true if in embedded mode
 * navigate('/some/path?filter=x'); // Will add &embedded=true if in embedded mode
 * ```
 */
export const useEmbeddedNavigate = () => {
  const navigate = useNavigate();

  const embeddedNavigate = useCallback(
    (to: To | number, options?: NavigateOptions) => {
      // Handle back/forward navigation
      if (typeof to === "number") {
        navigate(to);
        return;
      }

      // Check if we're in embedded mode
      const inEmbeddedMode = hasEmbeddedSession() || isEmbeddedMode();

      if (!inEmbeddedMode) {
        // Not in embedded mode, navigate normally
        if (typeof to === "string") {
          navigate(to, options);
        } else {
          navigate(to, options);
        }
        return;
      }

      // In embedded mode - add embedded=true to the path
      if (typeof to === "string") {
        const modifiedPath = appendEmbeddedParams(to);
        navigate(modifiedPath, options);
      } else if (typeof to === "object" && to !== null) {
        // Handle NavigateOptions object with pathname
        const path = to.pathname || "";
        const search = to.search || "";
        const hash = to.hash || "";

        // Construct full path and add embedded params
        let fullPath = path;
        if (search) {
          fullPath += search.startsWith("?") ? search : `?${search}`;
        }
        if (hash) {
          fullPath += hash.startsWith("#") ? hash : `#${hash}`;
        }

        const modifiedPath = appendEmbeddedParams(fullPath);

        // Parse back into parts
        const url = new URL(modifiedPath, window.location.origin);
        navigate(
          {
            pathname: url.pathname,
            search: url.search,
            hash: url.hash,
          },
          options
        );
      }
    },
    [navigate]
  );

  return embeddedNavigate;
};

export default useEmbeddedNavigate;
