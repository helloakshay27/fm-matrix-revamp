import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const getNavItemClass = (path: string) => {
    return `nav-item${location.pathname === path ? ' on' : ''}`;
  };

  return (
    <aside className="sidebar">
      <h1 className="brandmark">
        <span className="bm-full">Pulse</span>
        <span className="bm-mini">PP</span>
      </h1>
      <p className="brandmark-sub">Panchshil Pulse &middot; Community App</p>
      <nav aria-label="Sections">
        <div className="nav-group">
          <div className="nav-label">Layers</div>
          <Link
            to="/pulse/traffic-session"
            className={getNavItemClass('/pulse/traffic-session')}
            data-tip="Traffic &amp; Session"
          >
            <span className="ni-ic">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2.4 12.6 6.6 7.4l3.4 3.1 4.1-5.4 3.5 4.3" />
                <path d="M2.4 16.4h15.2" />
              </svg>
            </span>
            <span className="ni-t">Traffic &amp; Session</span>
          </Link>
          <Link
            to="/pulse/adoption-engagement"
            className={getNavItemClass('/pulse/adoption-engagement')}
            data-tip="Adoption &amp; Engagement"
          >
            <span className="ni-ic">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="7.6" cy="6.8" r="2.9" />
                <path d="M2.6 16.6c0-2.7 2.2-4.6 5-4.6s5 1.9 5 4.6" />
                <path d="M13.4 4.3a2.9 2.9 0 0 1 0 5.4" />
                <path d="M14.6 12.4c1.8.5 3 1.9 3 4.2" />
              </svg>
            </span>
            <span className="ni-t">Adoption &amp; Engagement</span>
          </Link>
          <Link
            to="/pulse/workflow-usage"
            className={getNavItemClass('/pulse/workflow-usage')}
            data-tip="Workflow Usage"
          >
            <span className="ni-ic">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 2.4 17.4 6 10 9.6 2.6 6Z" />
                <path d="M2.6 10 10 13.6 17.4 10" />
                <path d="M2.6 14 10 17.6 17.4 14" />
              </svg>
            </span>
            <span className="ni-t">Workflow Usage</span>
          </Link>
        </div>
      </nav>
    </aside>
  );
};
