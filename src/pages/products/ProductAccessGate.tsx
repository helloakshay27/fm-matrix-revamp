import React, { useEffect, useMemo } from "react";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SecurityOverlays } from "./SecurityOverlays";
import { useProductSecurity } from "./useProductSecurity";

type ProductAccessState = {
  productName?: string;
  targetPath?: string;
};

const formatProductName = (slug = "") =>
  slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getSafeTargetPath = (targetPath: unknown, fallback: string) => {
  if (
    typeof targetPath === "string" &&
    targetPath.startsWith("/product/") &&
    !targetPath.endsWith("/access")
  ) {
    return targetPath;
  }

  return fallback;
};

const ProductAccessGate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { productSlug = "" } = useParams<{ productSlug: string }>();
  const routeState = (location.state || {}) as ProductAccessState;
  const security = useProductSecurity();

  const productName = routeState.productName || formatProductName(productSlug);
  const targetPath = useMemo(
    () =>
      getSafeTargetPath(routeState.targetPath, `/product/${productSlug}`),
    [productSlug, routeState.targetPath]
  );
  const accessGranted =
    security.faceAuthStatus === "verified" ||
    security.faceAuthStatus === "api_unavailable";

  useEffect(() => {
    if (!accessGranted) return;

    navigate(targetPath, {
      replace: true,
      state: { faceAuthVerifiedAt: Date.now() },
    });
  }, [accessGranted, navigate, targetPath]);

  return (
    <div className="min-h-screen bg-[#F6F4EE] font-poppins text-[#2C2C2C]">
      <SecurityOverlays security={security} />

      <div
        className={`product-page-wrapper flex min-h-screen flex-col ${
          security.isBlurred ? "security-blurred" : ""
        }`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-6">
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-[#C4B89D]/60 px-3 py-1.5 text-xs font-semibold transition hover:border-[#DA7756]/40 hover:bg-[#DA7756]/10 hover:text-[#DA7756]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </button>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#DA7756]/20 bg-[#DA7756]/10 text-[#DA7756]">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C4B89D]/50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#2C2C2C]/55">
              <Lock className="h-3.5 w-3.5" />
              Product Access
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight lg:text-5xl">
              {productName || "Product Details"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#2C2C2C]/65">
              Verifying your face before opening the product details page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAccessGate;
