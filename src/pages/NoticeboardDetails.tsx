import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";



const NoticeboardDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticeboardData, setNoticeboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);

  const noticeboardId = id;
  console.log("Noticeboard Details Component - ID:", noticeboardId);

  useEffect(() => {
    const fetchNoticeboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        
        if (!token) {
          toast.error("Authentication required. Please login.");
          navigate("/login");
          return;
        }

        console.log("Fetching broadcast details for ID:", noticeboardId);
        console.log("API URL:", `${baseURL}noticeboards/${noticeboardId}.json`);
        
        const response = await axios.get(`${baseURL}noticeboards/${noticeboardId}.json`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.data) {
          console.error("Invalid response structure:", response.data);
          toast.error("Invalid broadcast data received");
          return;
        }

        // The API returns the noticeboard data directly in response.data
        setNoticeboardData(response.data);
        
        // Debug logging to understand the image data structure
        console.log("Broadcast details loaded for ID:", noticeboardId);
        
      } catch (error) {
        console.error("Error fetching noticeboard data", error);
        setError(error.message || "Unknown error occurred");
        
        if (error.response) {
          console.error("Error response:", error.response);
          console.error("Error status:", error.response.status);
          console.error("Error data:", error.response.data);
          
          if (error.response.status === 401) {
            toast.error("Authentication failed. Please login again.");
            navigate("/login");
          } else if (error.response.status === 404) {
            toast.error("Broadcast not found.");
            navigate("/noticeboard-list");
          } else {
            toast.error(`Failed to fetch broadcast details: ${error.response.data?.message || error.message}`);
          }
        } else if (error.request) {
          console.error("Error request:", error.request);
          toast.error("Network error. Please check your connection.");
        } else {
          console.error("Error message:", error.message);
          toast.error(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (noticeboardId) {
      fetchNoticeboardData();
    } else {
      toast.error("Invalid broadcast ID");
      navigate("/noticeboard-list");
    }
  }, [noticeboardId, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const renderReminders = () => {
    if (!noticeboardData?.reminders || noticeboardData.reminders.length === 0) {
      return <p className="text-muted">No reminders set</p>;
    }

    return (
      <div className="row">
        {noticeboardData.reminders.map((reminder, index) => (
          <div key={index} className="col-md-6 mb-2">
            <div className="card bg-light">
              <div className="card-body p-2">
                <small>
                  {reminder.weeks && `${reminder.weeks} weeks `}
                  {reminder.days && `${reminder.days} days `}
                  {reminder.hours && `${reminder.hours} hours `}
                  {reminder.minutes && `${reminder.minutes} minutes `}
                  before
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

if (loading) {
  return (
    <div className="main-content d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading broadcast details...</p>
      </div>
    </div>
  );
}


  

  return (
    <>
      {/* Debug info */}
      <div style={{ display: 'none' }}>
        Debug: ID={noticeboardId}, Loading={loading.toString()}, HasData={!!noticeboardData}
      </div>
      
      <div className="main-content">
        <div className="">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header3">
                  <h3 className="card-title">Broadcast Details</h3>
                  <div className="card-body">
                    <div className="row px-3">
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Notice Heading</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">:</span>
                              <span className="text-black">
                                {" "}
                                {noticeboardData.notice_heading || "N/A"}{" "}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                        <div className="col-6">
                            <label>Notice Type</label>
                        </div>
                        <div className="col-6">
                            <label className="text">
                            <span className="me-3">
                                <span className="text-dark">:</span>
                                <span className="text-dark">
                                {" "}
                                {noticeboardData.notice_type
                                    ? noticeboardData.notice_type.charAt(0).toUpperCase() + noticeboardData.notice_type.slice(1).toLowerCase()
                                    : "General"}
                                </span>
                            </span>
                            </label>
                        </div>
                        </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Project Name</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">:</span>
                              <span className="text-dark">
                                {" "}
                                {noticeboardData.project_name || "N/A"}{" "}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Status</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {noticeboardData.active ? "Active" : "Inactive"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Mark Important</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {noticeboardData.is_important ? "Yes" : "No"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Send Email</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {noticeboardData.email_trigger_enabled ? "Yes" : "No"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Expire Time</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {formatDate(noticeboardData.expire_time)}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Comment</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {noticeboardData.comment || "N/A"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Notice Text */}
                      <div className="col-12 mt-4 row px-3">
                        <div className="col-6">
                          <label>Notice Text</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">:</span>
                            </span>
                          </label>
                        </div>
                        <div className="col-12 mt-2">
                          <div 
                            className="p-3 border rounded"
                            style={{ 
                              backgroundColor: "#f8f9fa",
                              maxHeight: isExpanded ? "none" : "150px",
                              overflow: "hidden",
                              whiteSpace: "pre-wrap"
                            }}
                          >
                            {noticeboardData.notice_text || "N/A"}
                          </div>
                          {noticeboardData.notice_text && noticeboardData.notice_text.length > 200 && (
                            <button 
                              className="btn btn-sm btn-outline-primary mt-2"
                              onClick={() => setIsExpanded(!isExpanded)}
                            >
                              {isExpanded ? "Show Less" : "Show More"}
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              {/* Reminders Section */}
              {noticeboardData?.set_reminders && noticeboardData.set_reminders.length > 0 && (
                <div className="card mt-3 pb-4 mx-4">
                  <div className="card-header3">
                    <h4 className="card-title">Reminders</h4>
                  </div>
                  <div className="card-body">
                    {renderReminders()}
                  </div>
                </div>
              )}

              {/* Broadcast Image */}
              <div className="card mt-3 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Broadcast Image</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12 mt-2">
                      <h5>Cover Images</h5>
                      <div className="mt-4 tbl-container">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>File Name</th>
                              <th>File Type</th>
                              <th>Ratio</th>
                              <th>Image</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              // Handle cover images with ratio-wise support like event details
                              const coverGroups = [
                                { ratio: "1:1", images: noticeboardData.cover_image_1_by_1 },
                                { ratio: "9:16", images: noticeboardData.cover_image_9_by_16 },
                                { ratio: "3:2", images: noticeboardData.cover_image_3_by_2 },
                                { ratio: "16:9", images: noticeboardData.cover_image_16_by_9 },
                              ];

                              // Also handle the general cover_image field
                              if (noticeboardData.cover_image) {
                                const generalCover = Array.isArray(noticeboardData.cover_image) 
                                  ? noticeboardData.cover_image 
                                  : [noticeboardData.cover_image];
                                coverGroups.push({ ratio: "-", images: generalCover });
                              }

                              // Normalize all images from all ratio groups
                              const normalizedImages = [];
                              
                              coverGroups.forEach(({ ratio, images }) => {
                                if (!images) return;
                                
                                const imageArray = Array.isArray(images) ? images : [images];
                                
                                imageArray.forEach((img) => {
                                  if (img) {
                                    const imageUrl = img.document_url || img.url || img.src || img.image_url || img;
                                    if (imageUrl && typeof imageUrl === 'string') {
                                      normalizedImages.push({
                                        ...img,
                                        ratio: img.ratio || ratio,
                                        document_url: imageUrl,
                                        document_file_name: img.document_file_name || img.name || img.filename || `Cover Image`,
                                        document_content_type: img.document_content_type || img.content_type || img.type || "image/*",
                                        document_updated_at: img.document_updated_at || img.updated_at || img.created_at || "N/A"
                                      });
                                    }
                                  }
                                });
                              });

                              return normalizedImages.length > 0 ? (
                                normalizedImages.map((file, index) => {
                                  return (
                                    <tr key={`cover-${index}`}>
                                      <td>{file.document_file_name}</td>
                                      <td>{file.document_content_type}</td>
                                      <td>{file.ratio}</td>
                                      <td>
                                        {file.document_url ? (
                                          <img
                                            src={file.document_url}
                                            alt={`Cover ${index}`}
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              objectFit: "contain",
                                              display: "block",
                                            }}
                                            className="img-fluid rounded"
                                            onError={(e) => {
                                              console.error(`Failed to load cover image: ${file.document_url}`);
                                              try {
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentNode;
                                                const errorDiv = parent.querySelector('.image-error-message');
                                                if (errorDiv) {
                                                  errorDiv.style.display = 'block';
                                                }
                                              } catch (err) {
                                                console.error("Error handling image error:", err);
                                              }
                                            }}
                                            onLoad={() => {
                                              console.log(`Cover image loaded successfully: ${file.document_url}`);
                                            }}
                                          />
                                        ) : null}
                                        <div 
                                          className="image-error-message" 
                                          style={{ 
                                            display: file.document_url ? 'none' : 'block', 
                                            padding: '10px', 
                                            textAlign: 'center', 
                                            backgroundColor: '#f8f9fa', 
                                            fontSize: '12px',
                                            border: '1px dashed #ccc',
                                            borderRadius: '4px'
                                          }}
                                        >
                                          Image not available
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center">
                                    No Cover Images
                                  </td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="col-md-12 mt-4">
                      <h5>Broadcast Images</h5>
                      <div className="mt-4 tbl-container">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>File Name</th>
                              <th>File Type</th>
                              <th>Ratio</th>
                              <th>Image</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              // Handle broadcast images with ratio-wise support
                              const broadcastGroups = [
                                { ratio: "1:1", images: noticeboardData.noticeboard_images_1_by_1 },
                                { ratio: "9:16", images: noticeboardData.noticeboard_images_9_by_16 },
                                { ratio: "3:2", images: noticeboardData.noticeboard_images_3_by_2 },
                                { ratio: "16:9", images: noticeboardData.noticeboard_images_16_by_9 },
                              ];

                              // Also handle the general noticeboard_images field
                              if (noticeboardData.noticeboard_images) {
                                const generalImages = Array.isArray(noticeboardData.noticeboard_images) 
                                  ? noticeboardData.noticeboard_images 
                                  : [noticeboardData.noticeboard_images];
                                broadcastGroups.push({ ratio: "-", images: generalImages });
                              }

                              // Normalize all images from all ratio groups
                              const normalizedImages = [];
                              
                              broadcastGroups.forEach(({ ratio, images }) => {
                                if (!images) return;
                                
                                const imageArray = Array.isArray(images) ? images : [images];
                                
                                imageArray.forEach((img) => {
                                  if (img) {
                                    const imageUrl = img.document_url || img.url || img.src || img.image_url || img;
                                    if (imageUrl && typeof imageUrl === 'string') {
                                      normalizedImages.push({
                                        ...img,
                                        ratio: img.ratio || ratio,
                                        document_url: imageUrl,
                                        document_file_name: img.document_file_name || img.name || img.filename || `Broadcast Image`,
                                        document_content_type: img.document_content_type || img.content_type || img.type || "image/*",
                                        document_updated_at: img.document_updated_at || img.updated_at || img.created_at || "N/A"
                                      });
                                    }
                                  }
                                });
                              });

                              return normalizedImages.length > 0 ? (
                                normalizedImages.map((file, index) => {
                                  return (
                                    <tr key={`broadcast-${index}`}>
                                      <td>{file.document_file_name}</td>
                                      <td>{file.document_content_type}</td>
                                      <td>{file.ratio}</td>
                                      <td>
                                        {file.document_url ? (
                                          <img
                                            src={file.document_url}
                                            alt={`Broadcast ${index}`}
                                            style={{
                                              width: "100px",
                                              height: "100px",
                                              objectFit: "contain",
                                              display: "block",
                                            }}
                                            className="img-fluid rounded"
                                            onError={(e) => {
                                              console.error(`Failed to load broadcast image: ${file.document_url}`);
                                              try {
                                                e.target.style.display = 'none';
                                                const parent = e.target.parentNode;
                                                const errorDiv = parent.querySelector('.image-error-message');
                                                if (errorDiv) {
                                                  errorDiv.style.display = 'block';
                                                }
                                              } catch (err) {
                                                console.error("Error handling image error:", err);
                                              }
                                            }}
                                            onLoad={() => {
                                              console.log(`Broadcast image loaded successfully: ${file.document_url}`);
                                            }}
                                          />
                                        ) : null}
                                        <div 
                                          className="image-error-message" 
                                          style={{ 
                                            display: file.document_url ? 'none' : 'block', 
                                            padding: '10px', 
                                            textAlign: 'center', 
                                            backgroundColor: '#f8f9fa', 
                                            fontSize: '12px',
                                            border: '1px dashed #ccc',
                                            borderRadius: '4px'
                                          }}
                                        >
                                          Image not available
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="5" className="text-center">
                                    No Broadcast Images
                                  </td>
                                </tr>
                              );
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeboardDetails;
