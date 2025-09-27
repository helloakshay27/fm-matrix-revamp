import React from "react";
import { NavLink } from "react-router-dom";

const adminLinks = [
  { label: "Private Setup", to: "/ops-console/master/location/account" },
  { label: "FM Users", to: "/ops-console/master/user/fm-users" },
  { label: "Role", to: "/ops-console/settings/roles/role" },
  { label: "Lock Module", to: "/ops-console/settings/account/lock-module" },
  { label: "Lock Function", to: "/ops-console/settings/account/lock-function" },
  { label: "Lock Sub Function", to: "/ops-console/settings/account/lock-sub-function" },
];

export const AdminSidebar = () => (
  <aside className="w-64 bg-white h-full border-r flex flex-col">
    <div className="p-4 font-bold text-lg border-b">Admin Dashboard</div>
    <nav className="flex-1 p-4 space-y-2">
      {adminLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block px-4 py-2 rounded hover:bg-gray-100 ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
