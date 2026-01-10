import React from "react";
import {
  Folder,
  FileText,
  File,
  FileSpreadsheet,
  FileImage,
  FileVideo,
  FileArchive,
} from "lucide-react";

interface FileIconProps {
  fileName: string;
  isFolder?: boolean;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({
  fileName,
  isFolder = false,
  className = "w-6 h-6",
}) => {
  const iconColor = "text-[#C72030]";

  if (isFolder) {
    return <Folder className={`${className} ${iconColor}`} />;
  }

  // Get file extension
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // Return icon based on file type
  switch (extension) {
    case "pdf":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            fill="#C72030"
          />
          <path d="M14 2V8H20" fill="#A01828" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="6"
            fontWeight="bold"
          >
            PDF
          </text>
        </svg>
      );

    case "doc":
    case "docx":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            fill="#C72030"
          />
          <path d="M14 2V8H20" fill="#A01828" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="5"
            fontWeight="bold"
          >
            DOC
          </text>
        </svg>
      );

    case "xls":
    case "xlsx":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            fill="#C72030"
          />
          <path d="M14 2V8H20" fill="#A01828" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="5"
            fontWeight="bold"
          >
            XLS
          </text>
        </svg>
      );

    case "ppt":
    case "pptx":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
            fill="#C72030"
          />
          <path d="M14 2V8H20" fill="#A01828" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fill="white"
            fontSize="5"
            fontWeight="bold"
          >
            PPT
          </text>
        </svg>
      );

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
      return <FileImage className={`${className} ${iconColor}`} />;

    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
    case "mkv":
      return <FileVideo className={`${className} ${iconColor}`} />;

    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return <FileArchive className={`${className} ${iconColor}`} />;

    case "txt":
    case "csv":
      return <FileText className={`${className} ${iconColor}`} />;

    default:
      return <File className={`${className} ${iconColor}`} />;
  }
};
