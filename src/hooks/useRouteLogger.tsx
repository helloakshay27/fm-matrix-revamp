import baseClient from "@/utils/withoutTokenBase";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function useRouteLogger() {
  const location = useLocation();

  useEffect(() => {
    const fullPath = location.pathname + location.search + location.hash
    baseClient
      .post("/api/logs.json", {
        event: "ROUTE_CHANGE",
        path: fullPath,
        message: "this is router logs from front-end by akshay01",
        timestamp: new Date().toISOString(),
      })
      .catch((err) => {
        console.error("Failed to log route change:", err);
      });
  }, [location]);
}

export default useRouteLogger;
