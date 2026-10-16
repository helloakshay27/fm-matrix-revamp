import React from "react";

// Section card + field styles shared by the Class Purchase / Class Booking add, edit and
// details pages. Markup mirrors AddAssetPage's section cards; theme.css restyles the
// border-l-[#DA7756] header into the current card design.

export const ClassFormSection = ({
  title,
  icon,
  actions,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow-sm rounded-lg overflow-hidden">
    <div className="border-l-4 border-l-[#DA7756] p-4 sm:p-6 flex justify-between items-center bg-white">
      <div className="flex items-center gap-2 text-[#DA7756] text-sm sm:text-base font-semibold uppercase">
        <span className="bg-[#DA7756] text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs sm:text-sm [&_svg]:w-3 [&_svg]:h-3 sm:[&_svg]:w-4 sm:[&_svg]:h-4">
          {icon}
        </span>
        {title}
      </div>
      {actions}
    </div>
    <div className="p-4 sm:p-6">{children}</div>
  </div>
);

// Same as AddAssetPage's fieldStyles.
export const classFieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  "& .MuiInputBase-input, & .MuiSelect-select": {
    padding: { xs: "8px", sm: "10px", md: "12px" },
  },
};

// Label with a required star in the label colour (not the theme red fm-required-mark).
export const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <span>
    {children}
    <span className="ml-0.5">*</span>
  </span>
);
