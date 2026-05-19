import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const formatProductName = (slug = "") =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const ProductLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { productSlug } = useParams<{ productSlug: string }>();
  const productName = formatProductName(productSlug);

  return (
    <div className="min-h-screen bg-[#F6F4EE] px-6 py-4 font-poppins text-[#2C2C2C]">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(`/product/${productSlug}`)}
          className="mb-8 flex items-center gap-2 rounded-full border border-[#C4B89D]/50 px-3 py-1.5 text-xs font-semibold transition-all hover:border-[#DA7756]/30 hover:bg-[#DA7756]/10 hover:text-[#DA7756]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="mb-3 rounded-full border border-[#DA7756]/20 bg-[#DA7756]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#DA7756]">
            Product Landing Page
          </p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight lg:text-5xl">
            {productName || "Product"}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#2C2C2C]/70">
            Landing page route is ready. Replace this placeholder with the
            matching landing page component after adding the landing pages
            folder to the project.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductLandingPage;
