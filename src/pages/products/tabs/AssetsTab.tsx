import React from "react";
import {
  ExternalLink,
  FileText,
  Image,
  Key,
  Link,
  Presentation,
  User,
  Video,
} from "lucide-react";
import { ProductData } from "../types";

interface AssetsTabProps {
  productData: ProductData;
}

const getAssetIcon = (asset: ProductData["assets"][number]) => {
  const type = `${asset.type} ${asset.title}`.toLowerCase();
  if (type.includes("video") || type.includes("demo")) {
    return <Video className="w-5 h-5" />;
  }
  if (type.includes("image")) {
    return <Image className="w-5 h-5" />;
  }
  if (
    type.includes("presentation") ||
    type.includes("deck") ||
    type.includes("ppt")
  ) {
    return <Presentation className="w-5 h-5" />;
  }
  if (type.includes("document") || type.includes("pdf")) {
    return <FileText className="w-5 h-5" />;
  }
  return asset.icon || <Link className="w-5 h-5" />;
};

const AssetsTab: React.FC<AssetsTabProps> = ({ productData }) => {
  const assets = productData.assets || [];
  const credentials = productData.credentials || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white text-[#2C2C2C] border border-[#C4B89D] p-6 rounded-t-xl border-l-4 border-l-[#DA7756]">
        <h2 className="text-xl font-semibold font-poppins">
          {productData.name} - Assets & Credentials
        </h2>
      </div>

      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Sales & Marketing Assets
        </h3>
        {assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assets.map((asset, i) => {
              const isLink = asset.url && asset.url !== "#";
              const card = (
                <>
                  <div className="p-2 bg-[#DA7756]/10 rounded-lg text-[#DA7756]">
                    {getAssetIcon(asset)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#2C2C2C] font-poppins break-words">
                      {asset.title}
                    </p>
                    <p className="text-xs text-[#2C2C2C]/60 font-poppins">
                      {asset.type}
                    </p>
                  </div>
                  {isLink && (
                    <ExternalLink className="w-4 h-4 text-[#DA7756] flex-shrink-0" />
                  )}
                </>
              );

              return isLink ? (
                <a
                  key={i}
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[#F6F4EE] rounded-lg border border-[#C4B89D] hover:border-[#DA7756] hover:bg-[#DA7756]/5 transition-all"
                >
                  {card}
                </a>
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-[#F6F4EE] rounded-lg border border-[#C4B89D]"
                >
                  {card}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 bg-[#F6F4EE] rounded-lg border border-[#C4B89D] text-sm text-[#2C2C2C]/60 font-poppins">
            No sales or marketing assets available.
          </div>
        )}
      </div>

      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Demo Credentials
        </h3>
        {credentials.length > 0 ? (
          <div className="space-y-4">
            {credentials.map((cred, i) => (
              <div
                key={i}
                className="p-4 bg-[#F6F4EE] rounded-lg border border-[#C4B89D]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-[#DA7756]/10 rounded-lg text-[#DA7756]">
                    {cred.icon || <Key className="w-5 h-5" />}
                  </div>
                  <p className="font-semibold text-[#2C2C2C] font-poppins">
                    {cred.title}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div className="min-w-0">
                    <span className="text-[#2C2C2C]/60 font-poppins">
                      URL:{" "}
                    </span>
                    {cred.url && cred.url !== "#" ? (
                      <a
                        href={cred.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#DA7756] hover:underline font-poppins break-words"
                      >
                        {cred.url}
                      </a>
                    ) : (
                      <span className="text-[#2C2C2C] font-medium font-poppins break-words">
                        {cred.url}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[#2C2C2C]/60 font-poppins">
                      ID:{" "}
                    </span>
                    <span className="text-[#2C2C2C] font-medium font-poppins break-words">
                      {cred.id}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[#2C2C2C]/60 font-poppins">
                      Password:{" "}
                    </span>
                    <span className="text-[#2C2C2C] font-medium font-poppins break-words">
                      {cred.pass}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-[#F6F4EE] rounded-lg border border-[#C4B89D] text-sm text-[#2C2C2C]/60 font-poppins">
            No demo credentials available.
          </div>
        )}
      </div>

      <div className="bg-white border border-[#C4B89D] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[#2C2C2C] mb-4 font-poppins">
          Product Owner
        </h3>
        <div className="flex items-center gap-4">
          {productData.ownerImage ? (
            <img
              src={productData.ownerImage}
              alt={productData.owner}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#DA7756]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-[#DA7756] bg-[#DA7756]/10 flex items-center justify-center text-[#DA7756]">
              <User className="w-7 h-7" />
            </div>
          )}
          <div>
            <p className="font-semibold text-[#2C2C2C] font-poppins">
              {productData.owner || "Product Owner"}
            </p>
            <p className="text-sm text-[#2C2C2C]/60 font-poppins">
              Product Owner - {productData.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetsTab;
