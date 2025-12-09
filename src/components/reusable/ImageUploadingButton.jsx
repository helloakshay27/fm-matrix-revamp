import React from "react";
import ImageUploading from "react-images-uploading";

// Helper to extract filename
const extractFilename = (dataURL = "") => {
  if (!dataURL) return "";
  if (dataURL.startsWith("data:")) return "image-preview";
  return dataURL.split("/").pop()?.split("?")[0] || "image-preview";
};

const truncateFileName = (name = "", maxLength = 20) => {
  if (!name || name.length <= maxLength) return name;

  const dotIndex = name.lastIndexOf(".");
  const base = name.slice(0, dotIndex);
  const ext = name.slice(dotIndex);

  const visibleChars = maxLength - ext.length - 3; // leave space for "..."
  return base.slice(0, visibleChars) + "..." + ext;
};



export const ImageUploadingButton = ({
  value,
  onChange,
  variant = "button", // 'button' or 'custom'
  btntext = "Upload Image",
}) => {
  return (
    <ImageUploading
      value={value}
      onChange={onChange}
      acceptType={["jpg", "png", "jpeg", "webp", "gif", "mp4", "webm", "mov", "avi"]}
    >
      {({ onImageUpload, onImageUpdate }) => {
        const handleClick = !value || value.length === 0 ? onImageUpload : () => onImageUpdate(0);

        if (variant === "custom") {
          return (
            <div
            onClick={handleClick}
            role="button"
            className="d-flex align-items-center rounded border"
            style={{
              // width: 'fit-content',
              borderColor: '#c4c4c4',
              fontSize: '14px',
              fontFamily: 'system-ui, sans-serif',
              padding: '0',
              overflow: 'hidden',
              cursor: 'pointer',
              height: '35px',
            }}
          >
            <span
              className="px-3 py-1 text-nowrap text-truncate"
              style={{
                backgroundColor: '#f8f9fa', // very light gray
                borderRight: '1px solid #c4c4c4',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                color: '#212529',
              }}
            >
              Choose file
            </span>
            <span
              className="px-3 py-1 text-nowrap text-truncate"
              title={
                value && value.length > 0
                  ? value[0]?.file?.name || extractFilename(value[0]?.data_url)
                  : 'No file chosen'
              }
              style={{
                maxWidth: '200px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                color: '#212529',
                backgroundColor: '#fff',
              }}
            >
              {value && value.length > 0
                ? truncateFileName(value[0]?.file?.name || extractFilename(value[0]?.data_url))
                : 'No file chosen'}
            </span>
          </div>
          
          

          );
        }

        return (
          <button
            onClick={handleClick}
            className="px-3 py-1 purple-btn2 text-nowrap text-truncate"
            type="button"
            style={{ width: "94px", height: "35px", borderRadius: "8px" }}
          >
            {btntext}
          </button>
        );
      }}
    </ImageUploading>
  );
};