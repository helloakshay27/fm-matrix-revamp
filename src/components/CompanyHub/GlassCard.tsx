import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const GlassCard = ({
  children,
  className = "",
  style,
  onClick,
}: GlassCardProps) => (
  <div
    style={style}
    onClick={onClick}
    className={`bg-[rgba(255,255,255,1)] border border-[rgba(211,209,199,1)] rounded-2xl shadow-[0px_2px_12px_0px_rgba(0,0,0,0.05)] ${className}`}
  >
    {children}
  </div>
);

export default GlassCard;
