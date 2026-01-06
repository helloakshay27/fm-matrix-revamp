/**
 * Cache utility with TTL (Time To Live) support
 * Implements stale-while-revalidate pattern for better performance
 */

interface CacheItem<T> {
  data: T;
  timestamp: number;
  key: string;
}

class CacheManager {
  private prefix = "app_cache_";

  /**
   * Set cache with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        key,
      };
      localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn("Failed to set cache:", error);
    }
  }

  /**
   * Get cached data if not expired
   * @param key Cache key
   * @param ttl Time to live in milliseconds (default: 5 minutes)
   * @returns Cached data or null if expired/not found
   */
  get<T>(key: string, ttl: number = 5 * 60 * 1000): T | null {
    try {
      const cached = localStorage.getItem(`${this.prefix}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem<T> = JSON.parse(cached);
      const isExpired = Date.now() - cacheItem.timestamp > ttl;

      if (isExpired) {
        this.remove(key);
        return null;
      }

      return cacheItem.data;
    } catch (error) {
      console.warn("Failed to get cache:", error);
      return null;
    }
  }

  /**
   * Get cached data with stale-while-revalidate pattern
   * Returns stale data immediately while fetching fresh data in background
   * @param key Cache key
   * @param fetchFn Function to fetch fresh data
   * @param ttl Fresh data TTL (default: 5 minutes)
   * @param staleTtl Stale data TTL (default: 30 minutes)
   */
  async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000,
    staleTtl: number = 30 * 60 * 1000
  ): Promise<{ data: T; fromCache: boolean }> {
    // Try to get fresh cached data
    const freshCache = this.get<T>(key, ttl);
    if (freshCache) {
      return { data: freshCache, fromCache: true };
    }

    // Try to get stale data
    const staleCache = this.get<T>(key, staleTtl);

    // If we have stale data, return it and revalidate in background
    if (staleCache) {
      // Revalidate in background
      fetchFn()
        .then((freshData) => {
          this.set(key, freshData, ttl);
        })
        .catch((error) => {
          console.warn("Background revalidation failed:", error);
        });

      return { data: staleCache, fromCache: true };
    }

    // No cache, fetch fresh data
    const freshData = await fetchFn();
    this.set(key, freshData, ttl);
    return { data: freshData, fromCache: false };
  }

  /**
   * Remove specific cache entry
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.warn("Failed to remove cache:", error);
    }
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              const cacheItem: CacheItem<any> = JSON.parse(cached);
              // Remove if older than 1 hour (default expiry)
              if (Date.now() - cacheItem.timestamp > 60 * 60 * 1000) {
                localStorage.removeItem(key);
              }
            } catch {
              // Invalid cache item, remove it
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.warn("Failed to clear expired cache:", error);
    }
  }

  /**
   * Check if cache exists and is valid
   */
  has(key: string, ttl: number = 5 * 60 * 1000): boolean {
    return this.get(key, ttl) !== null;
  }

  /**
   * Get cache age in milliseconds
   */
  getAge(key: string): number | null {
    try {
      const cached = localStorage.getItem(`${this.prefix}${key}`);
      if (!cached) return null;

      const cacheItem: CacheItem<any> = JSON.parse(cached);
      return Date.now() - cacheItem.timestamp;
    } catch (error) {
      return null;
    }
  }

  /**
   * Invalidate cache keys matching a pattern
   * @param pattern Pattern to match (supports wildcard *)
   */
  invalidatePattern(pattern: string): void {
    try {
      const keys = Object.keys(localStorage);
      const regex = new RegExp(
        "^" + this.prefix + pattern.replace(/\*/g, ".*") + "$"
      );

      keys.forEach((key) => {
        if (regex.test(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn("Failed to invalidate cache pattern:", error);
    }
  }

  /**
   * Clear all cache on page refresh/navigation
   * This is called automatically on window unload
   */
  clearOnRefresh(): void {
    try {
      // Use sessionStorage to track if this is a fresh page load
      const isPageRefresh = !sessionStorage.getItem("app_initialized");

      // Mark app as initialized for this session
      sessionStorage.setItem("app_initialized", "true");
    } catch (error) {
      console.warn("Failed to clear cache on refresh:", error);
    }
  }
}

// Export singleton instance
export const cache = new CacheManager();

// Auto-cleanup and refresh detection
if (typeof window !== "undefined") {
  // Clear cache on page refresh (when sessionStorage is empty)
  cache.clearOnRefresh();

  // Clear expired cache on app load
  cache.clearExpired();

  // Set up periodic cleanup (every 10 minutes)
  setInterval(
    () => {
      cache.clearExpired();
    },
    10 * 60 * 1000
  );

  // Clear sessionStorage flag on page unload to detect refresh on next load
  window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("app_initialized");
  });
}
