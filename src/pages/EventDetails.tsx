import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";


const EventDetails = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const eventId = id;
  console.log("ID", eventData);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${baseURL}events/${eventId}}.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        setEventData(response.data);
      } catch (error) {
        //console.error("Error fetching event data", error);
      }
    };

    fetchEventData();
  }, [eventId]);

  // If event data is not yet loaded, show a loading state
  if (!eventData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="main-content">
        <div className="">
          <div className="module-data-section container-fluid">
            <div className="module-data-section p-3">
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header3">
                  <h3 className="card-title">Event Details</h3>
                  <div className="card-body">
                    <div className="row px-3">
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event Name</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">:</span>
                              <span className="text-black">
                                {" "}
                                {eventData.event_name}{" "}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event Type</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">:</span>
                              <span className="text-dark">
                                {" "}
                                {eventData.event_type || "N/A"}{" "}
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
                                {eventData.project_name || "N/A"}{" "}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event At</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {eventData.event_at}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event From</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                :{" "}
                                {new Date(eventData.from_time).toLocaleString()}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event To</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {new Date(eventData.to_time).toLocaleString()}
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
                                : {eventData.is_important || "N/A"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>RSVP Action</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {eventData.rsvp_action || "N/A"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Conditionally render RSVP Name and RSVP Number if RSVP Action is "yes" */}
                      {eventData.rsvp_action === "yes" && (
                        <>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                            <div className="col-6">
                              <label>RSVP Name</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">
                                  <span className="text-dark">
                                    : {eventData.rsvp_name || "N/A"}
                                  </span>
                                </span>
                              </label>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                            <div className="col-6">
                              <label>RSVP Number</label>
                            </div>
                            <div className="col-6">
                              <label className="text">
                                <span className="me-3">
                                  <span className="text-dark">
                                    : {eventData.rsvp_number || "N/A"}
                                  </span>
                                </span>
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Add more fields as required */}
                      {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event Publish</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {eventData.publish}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div> */}
                      {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event User ID</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {eventData.user_id}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div> */}
                      {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event Comment</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {eventData.comment}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div> */}
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event Shared</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {eventData.shared}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>
                      {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6 ">
                          <label>Event Share Groups</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                : {eventData.share_groups}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div> */}
                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                        <div className="col-6">
                          <label>Event Description</label>
                        </div>
                        <div className="col-6">
                          <div
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: isExpanded ? "unset" : 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "normal",
                            }}
                          >
                            <span className="text-dark">
                              : {eventData.description}
                            </span>
                          </div>
                          {eventData.description &&
                            eventData.description.length > 50 && (
                              <span
                                style={{
                                  color: "#007bff",
                                  cursor: "pointer",
                                  fontWeight: "500",
                                  display: "inline-block",
                                  marginTop: "4px",
                                }}
                                onClick={() => setIsExpanded(!isExpanded)}
                              >
                                {isExpanded ? "Show Less" : "Show More"}
                              </span>
                            )}
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6">
                          <label>Send Email</label>
                        </div>
                        <div className="col-6">
                          <label className="text">
                            <span className="me-3">
                              <span className="text-dark">
                                :{" "}
                                {eventData.email_trigger_enabled === true
                                  ? "Yes"
                                  : eventData.email_trigger_enabled === false
                                  ? "No"
                                  : "N/A"}
                              </span>
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                        <div className="col-6">
                          <label>Set Reminders</label>
                        </div>
                        <div className="col-6">
                          {eventData.reminders &&
                          eventData.reminders.length > 0 ? (
                            eventData.reminders.map((reminder, index) => (
                              <div key={index}>
                                <label className="text">
                                  <span className="me-3">
                                    <span className="text-dark">
                                      : Days: {reminder.days || "0"}, Hours:{" "}
                                      {reminder.hours || "0"}, Minutes:{" "}
                                      {reminder.minutes || "0"}
                                    </span>
                                  </span>
                                </label>
                              </div>
                            ))
                          ) : (
                            <label className="text">
                              <span className="text-dark">N/A</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Event Image */}
              <div className="card mt-3 pb-4 mx-4">
                <div className="card-header">
                  <h3 className="card-title">Event Image</h3>
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
                              <th>Updated At</th>
                              <th>Image</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const coverGroups = [
                                eventData.cover_image_1_by_1,
                                eventData.cover_image_9_by_16,
                                eventData.cover_image_3_by_2,
                                eventData.cover_image_16_by_9,
                              ];

                              // Normalize: convert each group into an array (if it's an object or array)
                              const normalizedImages = coverGroups
                                .map((group) =>
                                  Array.isArray(group)
                                    ? group
                                    : group && typeof group === "object"
                                    ? [group]
                                    : []
                                )
                                .flat()
                                .filter((img) => img?.document_url);

                              return normalizedImages.length > 0 ? (
                                normalizedImages.map((file, index) => (
                                  <tr key={`cover-${index}`}>
                                    <td>{file.document_file_name}</td>
                                    <td>{file.document_content_type}</td>
                                    <td>{file.document_updated_at}</td>
                                    <td>
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
                                      />
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
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
                      <h5>Event Images</h5>
                      <div className="mt-4 tbl-container">
                        <table className="w-100">
                          <thead>
                            <tr>
                              <th>File Name</th>
                              <th>File Type</th>
                              <th>Updated At</th>
                              <th>Image</th>
                              {/* <th>Download</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {(() => {
                              const eventGroups = [
                                eventData.event_images_1_by_1,
                                eventData.event_images_9_by_16,
                                eventData.event_images_3_by_2,
                                eventData.event_images_16_by_9,
                              ];

                              const allEventImages = eventGroups
                                .filter(
                                  (group) =>
                                    Array.isArray(group) && group.length > 0
                                )
                                .flat()
                                .filter((img) => img?.document_url);

                              return allEventImages.length > 0 ? (
                                allEventImages.map((file, index) => (
                                  <tr key={`event-${index}`}>
                                    <td>{file.document_file_name}</td>
                                    <td>{file.document_content_type}</td>
                                    <td>{file.document_updated_at}</td>
                                    <td>
                                      <img
                                        src={file.document_url}
                                        alt={`Event ${index}`}
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          objectFit: "contain",
                                          display: "block",
                                        }}
                                        className="img-fluid rounded"
                                      />
                                    </td>
                                    {/* <td>
                                <a href={`${file.document_url}`}>
                                  {" "}
                                  <svg
                                    width="15"
                                    height="16"
                                    viewBox="0 0 22 23"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M20.8468 22.9744H1.1545C0.662189 22.9744 0.333984 22.6462 0.333984 22.1538V15.5897C0.333984 15.0974 0.662189 14.7692 1.1545 14.7692C1.6468 14.7692 1.97501 15.0974 1.97501 15.5897V21.3333H20.0263V15.5897C20.0263 15.0974 20.3545 14.7692 20.8468 14.7692C21.3391 14.7692 21.6673 15.0974 21.6673 15.5897V22.1538C21.6673 22.6462 21.3391 22.9744 20.8468 22.9744ZM11.0007 18.0513C10.9186 18.0513 10.7545 18.0513 10.6724 17.9692C10.5904 17.9692 10.5083 17.8872 10.4263 17.8051L3.86219 11.241C3.53398 10.9128 3.53398 10.4205 3.86219 10.0923C4.19039 9.7641 4.6827 9.7641 5.01091 10.0923L10.1801 15.2615V0.820513C10.1801 0.328205 10.5083 0 11.0007 0C11.493 0 11.8212 0.328205 11.8212 0.820513V15.2615L16.9904 10.0923C17.3186 9.7641 17.8109 9.7641 18.1391 10.0923C18.4673 10.4205 18.4673 10.9128 18.1391 11.241L11.575 17.8051C11.493 17.8872 11.4109 17.9692 11.3289 17.9692C11.2468 18.0513 11.0827 18.0513 11.0007 18.0513Z"
                                      fill="#8B0203"
                                    ></path>
                                  </svg>
                                </a>
                              </td> */}
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    No Event Images
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

export default EventDetails;
