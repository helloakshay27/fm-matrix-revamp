import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const TdsTutorialEdit = () => {
  const { id } = useParams(); // Get tutorial ID from URL
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [previewModal, setPreviewModal] = useState({
    show: false,
    file: null,
    type: null,
  });

  const [tutorialData, setTutorialData] = useState({
    name: "",
    description: "",
    attachments: [], // This will contain both existing and new files
  });

  console.log("tutorialData", tutorialData);

  const navigate = useNavigate();

  // Fetch tutorial data by ID
  useEffect(() => {
    const fetchTutorial = async () => {
      if (!id) {
        toast.error("Tutorial ID not found");
        navigate("/tds-tutorial-list");
        return;
      }

      try {
        setFetchLoading(true);
        const response = await axios.get(`${baseURL}tds_tutorials/${id}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const tutorial = response.data.tds_tutorial || response.data;

        // Handle multiple attachments from API
        let existingAttachments = [];

        // Check if there's a single attachment
        if (tutorial.attachment && tutorial.attachment.id) {
          existingAttachments = [
            {
              id: tutorial.attachment.id,
              name:
                tutorial.attachment.document_file_name ||
                tutorial.attachment.file_name ||
                "Attachment",
              url: tutorial.attachment.document_url,
              content_type: tutorial.attachment.document_content_type,
              size: tutorial.attachment.document_file_size,
              isExisting: true,
            },
          ];
        }

        // Check if there are multiple attachments
        if (tutorial.attachments && Array.isArray(tutorial.attachments)) {
          existingAttachments = tutorial.attachments.map((attachment) => ({
            id: attachment.id,
            name:
              attachment.document_file_name ||
              attachment.file_name ||
              "Attachment",
            url: attachment.document_url,
            content_type: attachment.document_content_type,
            size: attachment.document_file_size,
            isExisting: true,
          }));
        }

        setTutorialData({
          name: tutorial.name || "",
          description: tutorial.description || "",
          attachments: existingAttachments, // Start with existing files
        });
      } catch (error) {
        console.error("Error fetching tutorial:", error);
        if (error.response?.status === 404) {
          toast.error("Tutorial not found");
        } else {
          toast.error("Failed to load tutorial data");
        }
        navigate("/tds-tutorial-list");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTutorial();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTutorialData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow PDF
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }

    setTutorialData((prev) => ({
      ...prev,
      attachments: [
        {
          file,
          name: file.name,
          url: URL.createObjectURL(file),
          isExisting: false,
          size: file.size,
          content_type: file.type,
        },
      ],
    }));
  };

  const removeFile = (index) => {
    setTutorialData((prev) => {
      const toRemove = prev.attachments[index];
      if (!toRemove.isExisting && toRemove.url) {
        URL.revokeObjectURL(toRemove.url);
      }
      return {
        ...prev,
        attachments: prev.attachments.filter((_, i) => i !== index),
      };
    });
  };

  const validateForm = () => {
    if (!tutorialData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    // if (!tutorialData.description.trim()) {
    //   toast.error("Description is required");
    //   return false;
    // }

    // Check file limits (max 2 files)
    if (tutorialData.attachments.length > 2) {
      toast.error("Maximum 2 files allowed");
      return false;
    }

    // Check file size limits
    for (let attachment of tutorialData.attachments) {
      if (!attachment.isExisting) {
        const fileSizeMB = attachment.size / (1024 * 1024);
        if (attachment.content_type.startsWith("image/") && fileSizeMB > 3) {
          toast.error(`Image file ${attachment.name} exceeds 3MB limit`);
          return false;
        }
        if (
          (attachment.content_type.startsWith("video/") ||
            attachment.content_type === "application/pdf") &&
          fileSizeMB > 10
        ) {
          toast.error(`File ${attachment.name} exceeds 10MB limit`);
          return false;
        }
      }
    }

    return true;
  };

  const getFileIcon = (type) => {
    if (type && type.startsWith("image/")) return "🖼️";
    if (type && type.startsWith("video/")) return "🎬";
    if (type === "application/pdf") return "📄";
    return "📁";
  };

  const getFileTypeFromUrl = (urlOrName) => {
    if (!urlOrName) return "";
    const ext = urlOrName.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
      return "image/" + ext;
    if (["mp4", "webm", "ogg", "mov", "avi"].includes(ext))
      return "video/" + ext;
    if (["pdf"].includes(ext)) return "application/pdf";
    return "";
  };

  const openPreview = (attachment) => {
    let fileType =
      attachment.content_type ||
      getFileTypeFromUrl(attachment.url || attachment.name);

    setPreviewModal({
      show: true,
      file: {
        url: attachment.url,
        name: attachment.name,
        type: fileType,
      },
      type: fileType,
    });
  };

  const closePreview = () => {
    setPreviewModal({ show: false, file: null, type: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    toast.dismiss();

    try {
      const formData = new FormData();
      formData.append("tds_tutorial[name]", tutorialData.name);
      formData.append("tds_tutorial[description]", tutorialData.description);
      formData.append("tds_tutorial[active]", true);

      // Separate existing and new files
      const existingFiles = tutorialData.attachments.filter(
        (att) => att.isExisting
      );
      const newFiles = tutorialData.attachments.filter(
        (att) => !att.isExisting
      );

      // Add new files
      const fileObj = tutorialData.attachments[0];
      if (fileObj && !fileObj.isExisting) {
        formData.append("tds_tutorial[attachment]", fileObj.file);
      }

      // Add existing file IDs
      existingFiles.forEach((attachment) => {
        if (attachment.id) {
          formData.append(
            "tds_tutorial[existing_attachment_ids][]",
            attachment.id
          );
        }
      });

      await axios.put(`${baseURL}tds_tutorials/${id}.json`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("TDS Tutorial updated successfully!");
      navigate("/setup-member/tds-tutorials-list");
    } catch (error) {
      // ...error handling...
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/setup-member/tds-tutorials-list");
  };

  const handleRemoveTdsAttachment = async (index, attachmentId) => {
    // If no attachmentId, just remove locally (newly added, not yet saved)
    if (!attachmentId) {
      setTutorialData((prev) => {
        const updatedAttachments = prev.attachments.filter(
          (_, i) => i !== index
        );
        return {
          ...prev,
          attachments: updatedAttachments,
        };
      });
      toast.success("Attachment removed!");
      return;
    }

    try {
      // Use the correct endpoint for deleting an attachment
      const response = await fetch(
        `${baseURL}tds_tutorials/${attachmentId}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to delete attachment. Server response: ${errorText}`
        );
      }

      // Remove the attachment from the state
      setTutorialData((prev) => {
        const updatedAttachments = prev.attachments.filter(
          (_, i) => i !== index
        );
        return {
          ...prev,
          attachments: updatedAttachments,
        };
      });

      toast.success("Attachment deleted successfully!");
    } catch (error) {
      console.error("Error deleting attachment:", error.message);
      toast.error("Failed to delete attachment. Please try again.");
    }
  };

  // if (fetchLoading) {
  //   return (
  //     <div
  //       className="d-flex justify-content-center align-items-center"
  //       style={{ height: "50vh" }}
  //     >
  //       <div className="spinner-border text-primary" role="status">
  //         <span className="sr-only">Loading...</span>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="">
      <div className="module-data-section p-3">
        <form onSubmit={handleSubmit}>
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Edit TDS Tutorial</h3>
            </div>
            <div className="card-body">
              <div className="row">
                {/* Name Field */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Title <span className="otp-asterisk"> *</span>
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Title"
                      name="name"
                      value={tutorialData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Description Field
                <div className="col-md-4">
                  <div className="form-group">
                    <label>
                      Description <span className="otp-asterisk"> *</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={1}
                      placeholder="Enter Description"
                      name="description"
                      value={tutorialData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div> */}

                {/* Attachments Field */}
                <div className="col-md-3">
                  <div className="form-group">
                    <label>
                      Attachment{" "}
                      <span
                        className="tooltip-container"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                      >
                        [i]
                        {showTooltip && (
                          <span className="tooltip-text">
                            Max 2 files total: Images (3MB), Videos/PDFs (10MB)
                          </span>
                        )}
                      </span>
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      name="attachments"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      multiple={false}
                      // No need for disabled, since only one file is allowed
                    />
                    {tutorialData.attachments.length >= 2 && (
                      <small className="text-warning">
                        Maximum 2 files allowed. Remove a file to add more.
                      </small>
                    )}

                    {/* All Files Preview */}
                    {tutorialData.attachments.length > 0 && (
                      <div className="mt-3">
                        <h6 className="text-muted"></h6>
                        <div className="d-flex flex-wrap gap-2">
                          {tutorialData.attachments.map((attachment, index) => (
                            <div
                              key={`attachment-${index}`}
                              className="position-relative border rounded p-2 bg-light"
                              style={{
                                minWidth: "200px",
                                maxWidth: "250px",
                                cursor: "pointer",
                              }}
                            >
                              <div
                                className="d-flex align-items-center justify-content-center bg-white"
                                style={{ height: "100px" }}
                              >
                                <span style={{ fontSize: "2rem" }}>
                                  {getFileIcon("application/pdf")}
                                </span>
                              </div>
                              {/* <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute"
                                title="Remove file"
                                style={{
                                  top: "-5px",
                                  right: "-5px",
                                  fontSize: "10px",
                                  width: "20px",
                                  height: "20px",
                                  padding: "0px",
                                  borderRadius: "50%",
                                }}
                                onClick={() =>
                                  handleRemoveTdsAttachment(
                                    index,
                                    attachment.id
                                  )
                                }
                              >
                                ×
                              </button> */}
                              <div className="text-center mt-1">
                                <small
                                  className="text-muted"
                                  style={{ fontSize: "11px" }}
                                >
                                  {attachment.name &&
                                  attachment.name.length > 20
                                    ? `${attachment.name.substring(0, 20)}...`
                                    : attachment.name || "File"}
                                </small>
                                <br />
                                {/* <small
                                  className={
                                    attachment.isExisting
                                      ? "text-success"
                                      : "text-info"
                                  }
                                  style={{ fontSize: "10px" }}
                                >
                                  {attachment.isExisting
                                    ? "Existing File"
                                    : "New File"}
                                </small> */}
                                {attachment.size && (
                                  <>
                                    <br />
                                    {/* <small
                                      className="text-muted"
                                      style={{ fontSize: "10px" }}
                                    >
                                      {(
                                        attachment.size /
                                        (1024 * 1024)
                                      ).toFixed(2)}{" "}
                                      MB
                                    </small> */}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="row mt-2 justify-content-center">
            <div className="col-md-2">
              <button
                type="submit"
                className="purple-btn2 purple-btn2-shadow w-100"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="purple-btn2 purple-btn2-shadow w-100"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Full Size Preview Modal */}
      {previewModal.show && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          onClick={closePreview}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{previewModal.file.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closePreview}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-center p-0">
                {previewModal.type &&
                  previewModal.type.startsWith("image/") && (
                    <img
                      src={previewModal.file.url}
                      alt="Preview"
                      className="img-fluid"
                      style={{ maxHeight: "80vh", width: "auto" }}
                    />
                  )}
                {previewModal.type &&
                  previewModal.type.startsWith("video/") && (
                    <video
                      src={previewModal.file.url}
                      controls
                      className="w-100"
                      style={{ maxHeight: "80vh" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                {previewModal.type === "application/pdf" && (
                  <div style={{ height: "80vh" }}>
                    <iframe
                      src={previewModal.file.url}
                      width="100%"
                      height="100%"
                      title="PDF Preview"
                    >
                      <p>
                        Your browser does not support PDFs.
                        <a
                          href={previewModal.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download the PDF
                        </a>
                      </p>
                    </iframe>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  class="purple-btn2 rounded-3"
                  onClick={closePreview}
                >
                  Close
                </button>
                <a
                  href={previewModal.file.url}
                  download={previewModal.file.name}
                  class="purple-btn2 rounded-3"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TdsTutorialEdit;
