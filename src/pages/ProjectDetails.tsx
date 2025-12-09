import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

import "../mor.css";
import { useParams } from "react-router-dom";


const ProjectDetails = () => {
  const { id } = useParams();

  console.log("id", id);

  const [isExpanded, setIsExpanded] = useState(false);

  const [formData, setFormData] = useState({
    property_type: "",
    SFDC_Project_Id: "",
    building_type: "",
    status: "",
    configurations: [],
    project_name: "",
    project_address: "",
    project_description: "",
    price: "",
    project_size_sq_mtr: "",
    project_size_sq_ft: "",
    development_area_sqft: "",
    development_area_sqmt: "",
    rera_carpet_area_sq_mtr: "",
    rera_carpet_area_sqft: "",
    Rera_Sellable_Area: "",
    no_of_towers: "",
    no_of_floors: "",
    no_of_apartments: "",
    rera_number_multiple: [],
    amenities: [],
    specifications: [],
    land_area: "",
    land_uom: "",
    project_tag: "",
    virtual_tour_url_multiple: [],
    map_url: "",
    image: [],
    location: {
      address: "",
      addressLine1: "",
      address_line_two: "",
      addressLine3: "",
      city: "",
      state: "",
      pin_code: "",
      country: "",
    },
    brochure: null, // file input for brochure
    two_d_images: [], // array of file inputs for 2D images
    videos: [],
    gallery_image: [],
    fetched_gallery_image: [],
    Project_PPT: [],
    fetched_Project_PPT: [],
    ProjectPPT: [],
    project_creatives: [],
    project_creative_generics: [],
    project_creative_offers: [],
    project_interiors: [],
    project_exteriors: [],
    project_emailer_templetes: [],
    project_layout: [],
    project_sales_type: "",
    order_no: null,
    video_preview_image_url: [],
    enable_enquiry: false,
    rera_url: "",
    isDay: true,
    video_url: "",
  });

  console.log("formdata", formData);

  const [projectsType, setProjectsType] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}get_all_projects.json`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        const projects = response.data.projects;
        console.log("Projects:", projects);

        const selectedProject = projects.find((p) => p.id === Number(id));

        if (selectedProject) {
          setFormData(selectedProject);
        } else {
          setError("Project not found");
        }
      } catch (error) {
        setError("Error fetching project data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {/* <Header /> */}
      <style>
        {`
          .form-disabled input,
          .form-disabled textarea,
          .form-disabled select {
            pointer-events: none;Image

            background-color: #f9f9f9;
            color: #6c757d;
            border: 1px solid #ccc;
            background-image: none;
          }
            .form-disabled input[type="file"] {
            display: none;
            }

          .form-disabled label {
            font-weight: bold;
          }
        `}
      </style>
      <div className="module-data-section p-3">
        <div className="card mt-4 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Project Details</h3>
            <div className="card-body">
              <div className="row px-3">
                {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6">
                    <label>Project Banner Image</label>
                  </div>
                  <div className="col-6 d-flex">
                    <span className="me-2">:</span>
                    <img
                      src={formData.image_url}
                      alt="Image"
                      className="img-fluid"
                      style={{
                        width: "100px",
                        height: "100px",
                        //objectFit: "contain",
                        //display: "block",
                      }}
                    />
                  </div>
                </div> */}
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Type</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.property_type}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Building Type</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.building_type}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Construction Status</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">: {formData.status}</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                  <div className="col-6">
                    <label>Configuration Type</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          :{" "}
                          {formData.configurations?.map((config, index) => (
                            <span key={index}>
                              {config.name}
                              {index !== formData.configurations.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
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
                        <span className="text-dark">
                          : {formData.project_name}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>SFDC Project ID</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.SFDC_Project_Id}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Location</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.project_address}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Tag</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.project_tag}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Description</label>
                  </div>
                  <div className="col-6">
                    <p
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: isExpanded ? "unset" : 1, // Show only 1 line initially
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isExpanded ? "normal" : "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      : {formData.project_description}{" "}
                      {!isExpanded && (
                        <span style={{ color: "black", cursor: "pointer" }}>
                          ...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Price Onwards</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">: {formData.price}</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Size(Sq. Mtr.)</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.project_size_sq_mtr}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Size(Sq.Ft.)</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.project_size_sq_ft}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Development Area (Sq. Mtr.)</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.development_area_sqmt}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Development Area(Sq.Ft.)</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.development_area_sqft}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Rera Carpet Area(Sq. M)</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.rera_carpet_area_sq_mtr}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Rare Carpet Area(Sq. Ft.)</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.rera_carpet_area_sqft}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Rera Sellable Area</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.Rera_Sellable_Area}
                        </span>
                      </span>
                    </label>
                  </div>
                </div> */}
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Number of Towers</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.no_of_towers}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Number of Floors</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.no_of_floors}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Number of Units</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.no_of_apartments}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Specifications</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          :{" "}
                          {formData.specifications?.map((spec, index) => (
                            <span key={index}>
                              {spec.name}
                              {index !== formData.specifications.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                        </span>
                      </span>
                    </label>
                  </div>
                </div> */}

                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Land Area</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.land_area}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Land UOM</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">: {formData.land_uom}</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Project Sales Type</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.project_sales_type}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Order Number</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">: {formData.order_no}</span>
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Disclaimer</label>
                  </div>
                  <div className="col-6">
                    <p
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: isExpanded ? "unset" : 1, // Show only 1 line initially
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isExpanded ? "normal" : "nowrap",
                        cursor: "pointer",
                      }}
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      : {formData.disclaimer}{" "}
                      {!isExpanded && (
                        <span style={{ color: "black", cursor: "pointer" }}>
                          ...
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                  <div className="col-6">
                    <label>Project QR Code Image</label>
                  </div>
                  <div className="col-6 d-flex flex-wrap">
                    <span className="me-2">:</span>
                    {formData?.project_qrcode_images?.length > 0 ? (
                      formData.project_qrcode_images.map((img, index) => (
                        <img
                          key={index}
                          src={img.document_url}
                          alt={`QR Code ${index + 1}`}
                          className="img-fluid me-2 mb-2"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      ))
                    ) : (
                      <span>No QR code images available</span>
                    )}
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                  <div className="col-6 ">
                    <label>Enable Enquiry</label>
                  </div>
                  <div className="col-6">
                    <label className="text">
                      <span className="me-3">
                        <span className="text-dark">
                          : {formData.enable_enquiry ? "Yes" : "No"}
                        </span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                  <div className="col-6">
                    <label>Virtual Tour URL</label>
                  </div>
                  <div className="col-6">
                    <p
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: isExpanded ? "unset" : 1, 
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        cursor: "pointer",
                      }}
                    >
                      {isExpanded ? (
                        <a
                          href={formData.virtual_tour_url_multiple}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-dark"
                          style={{ textDecoration: "none" }}
                        >
                          {formData.virtual_tour_url_multiple}
                        </a>
                      ) : (
                        <>
                          {formData.virtual_tour_url_multiple.substring(0, 30)}{" "}
                         
                          <span
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setIsExpanded(true);
                            }}
                            style={{
                              color: "black",
                              cursor: "pointer",
                              fontWeight: "bold",
                            }}
                          >
                            ...
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">RERA Number</h3>
          </div>
          <div className="card-body">
            <div className="row">
              {/* <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Rera Number</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        :{" "}
                        {formData?.rera_number_multiple?.length > 0
                          ? formData.rera_number_multiple.map((rera, idx) => (
                              <div key={idx}>
                                <strong>{rera.tower_name} :</strong>{" "}
                                {rera.rera_number}
                              </div>
                            ))
                          : ""}
                      </span>
                    </span>
                  </label>
                </div>
              </div> */}
              <div className=" col-sm-12 row px-3">
                <div className="">
                  {formData?.rera_number_multiple?.length > 0 ? (
                    formData.rera_number_multiple.map((rera, idx) => (
                      <div key={idx} className="mb-1">
                        <strong>Tower Name :{rera.tower_name},</strong>{" "}
                        <strong>Rera Number :{rera.rera_number},</strong>{" "}
                        <a
                          href={rera.rera_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-underline"
                        >
                          Rera URL :{rera.rera_url}
                        </a>
                      </div>
                    ))
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Amenities</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Amenities</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        :{" "}
                        {formData.amenities?.map((amenity, index) => (
                          <span key={index}>
                            {amenity.name}
                            {index !== formData.amenities.length - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Address</h3>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Address Section */}
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Address</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        : {formData?.location?.address}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>City</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        : {formData.location?.city}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>State</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        : {formData.location?.state}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Pin Code</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        : {formData.location?.pin_code}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Country</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        : {formData.location?.country}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                <div className="col-6">
                  <label>Map URL</label>
                </div>
                <div className="col-6">
                  <p
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: isExpanded ? "unset" : 1, // Initially show 1 line
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      cursor: "pointer",
                    }}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <a
                      href={formData.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-dark"
                      style={{ textDecoration: "none" }}
                    >
                      : {formData.map_url}
                    </a>
                    {!isExpanded && (
                      <span
                        style={{
                          color: "black",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        ...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
         {(baseURL === "https://dev-panchshil-super-app.lockated.com/" || baseURL === "https://rustomjee-live.lockated.com/") && (
        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Plans</h3>
          </div>
          <div className="card-body pb-2 mb-1 mt-0">
            <div className="row ">
              <div className="col-md-12 mt-4">
                <h5>Project Plans</h5>
                <div className="mt-4 tbl-container">
                  <table className="w-100">
                    <thead>
                      <tr>
                        <th>Plan Name</th>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>Updated At</th>
                        <th>Image</th>
                        {/* <th>Download</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {formData?.plans?.length > 0 ? (
                        formData.plans.map((plan, planIdx) => (
                          <React.Fragment key={`plan-${planIdx}`}>
                            {plan.images?.length > 0 ? (
                              plan.images.map((img, imgIdx) => (
                                <tr key={`plan-${planIdx}-img-${imgIdx}`}>
                                  <td>{plan.name}</td>
                                  <td>{img.document_file_name}</td>
                                  <td>{img.document_content_type}</td>
                                  <td>{img.document_updated_at}</td>
                                  <td>
                                    <img
                                      src={img.document_url}
                                      alt={`Plan Image ${imgIdx}`}
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
                              <tr key={`plan-${planIdx}-no-img`}>
                                <td>{plan.name}</td>
                                <td
                                  colSpan="4"
                                  className="text-center text-muted"
                                >
                                  No images available for this plan.
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No Plans Available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
         )}

        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Document Attachment</h3>
          </div>
          <div className="card-body pb-2 mb-1 mt-0">
            <div className="row ">
              {/* <div className="col-md-12 mt-2">
                <h5 className=" ">Gallery Images</h5>
                {loading ? (
                  <div className="text-center">
                    <div
                      className="spinner-border"
                      role="status"
                      style={{ color: "var(--red)" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 tbl-container">
                    <table className="   w-100">
                      <thead>
                        <tr>
                          <th>Category Type</th>
                          <th>File Name</th>

                          <th>File Type</th>
                          <th>updated at</th>
                          <th>Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.gallery_image?.map((file, index) =>
                          file.attachfiles?.map((attachment, idx) => (
                            <tr key={`fetched-${index}-${idx}`}>
                              <td>{file.gallery_type || "N/A"}</td>
                              <td>{attachment.document_file_name || "N/A"}</td>
                              <td>{attachment.document_content_type}</td>
                              <td>{attachment.document_updated_at}</td>
                              <td>
                                <a href={`${attachment.document_url}`}>
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
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div> */}
              <div className="col-md-12 mt-4">
                <h5>Project Banner Images</h5>
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
                          formData.image_1_by_1,
                          formData.image_9_by_16,
                          formData.image_3_by_2,
                          formData.image_16_by_9,
                        ];

                        const allEventImages = eventGroups
                          .filter((img) => img && img.document_url) // filter out nulls or objects without a URL
                          .map((img) => img); // no need to flatten, since these are single objects

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
                            </tr>
                          ))
                        ) : (
                          <tr>
                            {/* <td colSpan="4" className="text-center">
                              No Event Images
                            </td> */}
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <h5>Project Cover Images</h5>
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
                          formData.cover_images_1_by_1,
                          formData.cover_images_9_by_16,
                          formData.cover_images_3_by_2,
                          formData.cover_images_16_by_9,
                        ];

                        const allEventImages = eventGroups
                          .filter(
                            (group) => Array.isArray(group) && group.length > 0
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
                            {/* <td colSpan="4" className="text-center">
                              No Event Images
                            </td> */}
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <h5>Gallery Images</h5>
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
                          formData.gallery_image_1_by_1,
                          formData.gallery_image_9_by_16,
                          formData.gallery_image_3_by_2,
                          formData.gallery_image_16_by_9,
                        ];

                        const allEventImages = eventGroups
                          .filter(
                            (group) => Array.isArray(group) && group.length > 0
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
                            {/* <td colSpan="4" className="text-center">
                              No Event Images
                            </td> */}
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <h5>Floor Plan</h5>
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
                          formData.project_2d_image_1_by_1,
                          formData.project_2d_image_9_by_16,
                          formData.project_2d_image_3_by_2,
                          formData.project_2d_image_16_by_9,
                        ];

                        const allEventImages = eventGroups
                          .filter(
                            (group) => Array.isArray(group) && group.length > 0
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
                            {/* <td colSpan="4" className="text-center">
                              No Event Images
                            </td> */}
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-12 mt-2">
                <h5 className=" ">Brochure</h5>
                <div className=" tbl-container w-100">
                  <table className=" w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.brochure && (
                        <tr>
                          <td>{formData.brochure?.document_file_name}</td>
                          <td>{formData.brochure?.document_content_type}</td>
                          <td>{formData.brochure?.document_updated_at}</td>
                          <td>
                            <a href={`${formData.brochure?.document_url}`}>
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
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project PPT</h5>
                <div className=" tbl-container w-100">
                  <table className=" w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.ProjectPPT && (
                        <tr>
                          <td>{formData.ProjectPPT?.document_file_name}</td>
                          <td>{formData.ProjectPPT?.document_content_type}</td>
                          <td>{formData.ProjectPPT?.document_updated_at}</td>
                          <td>
                            <a href={`${formData.ProjectPPT?.document_url}`}>
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
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Floor Plan</h5>

                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.two_d_images.length > 0 &&
                        formData.two_d_images.map((file, index) => (
                          <tr key={index}>
                            <td>{file.document_file_name}</td>
                            <td>{file.document_content_type}</td>
                            <td>{file.document_updated_at}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project Layout</h5>

                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.project_layout.length > 0 &&
                        formData.project_layout.map((file, index) => (
                          <tr key={index}>
                            <td>{file.document_file_name}</td>
                            <td>{file.document_content_type}</td>
                            <td>{file.document_updated_at}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project Creatives</h5>

                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.project_creatives.length > 0 &&
                        formData.project_creatives.map((file, index) => (
                          <tr key={index}>
                            <td>{file.document_file_name}</td>
                            <td>{file.document_content_type}</td>
                            <td>{file.document_updated_at}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project Creatives Generics </h5>

                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.project_creative_generics.length > 0 &&
                        formData.project_creative_generics.map(
                          (file, index) => (
                            <tr key={index}>
                              <td>{file.document_file_name}</td>
                              <td>{file.document_content_type}</td>
                              <td>{file.document_updated_at}</td>
                              <td>
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
                              </td>
                            </tr>
                          )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project Creatives Offers</h5>

                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.project_creative_offers.length > 0 &&
                        formData.project_creative_offers.map((file, index) => (
                          <tr key={index}>
                            <td>{file.document_file_name}</td>
                            <td>{file.document_content_type}</td>
                            <td>{file.document_updated_at}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project Interiors</h5>

                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.project_interiors.length > 0 &&
                        formData.project_interiors.map((file, index) => (
                          <tr key={index}>
                            <td>{file.document_file_name}</td>
                            <td>{file.document_content_type}</td>
                            <td>{file.document_updated_at}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project Exteriors</h5>

                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>

                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.project_exteriors.length > 0 &&
                        formData.project_exteriors.map((file, index) => (
                          <tr key={index}>
                            <td>{file.document_file_name}</td>
                            <td>{file.document_content_type}</td>
                            <td>{file.document_updated_at}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Project Emailer Template</h5>
                <div className=" tbl-container w-100">
                  <table className=" w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.project_emailer_templetes &&
                        formData.project_emailer_templetes.map((doc, index) => (
                          <tr key={index}>
                            <td>{doc.document_file_name}</td>
                            <td>{doc.document_content_type}</td>
                            <td>{doc.document_updated_at}</td>
                            <td>
                              <a
                                href={doc.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
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
                                  />
                                </svg>
                              </a>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="col-md-12 mt-2">
                <h5 className=" ">Videos</h5>
                <div className="mt-4 tbl-container">
                  <table className="   w-100">
                    <thead>
                      <tr>
                        <th>File Name</th>
                        <th>File Type</th>
                        <th>updated at</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.videos.length > 0 &&
                        formData.videos.map((file, index) => (
                          <tr key={index}>
                            <td>{file.document_file_name}</td>
                            <td>{file.document_content_type}</td>
                            <td>{file.document_updated_at}</td>
                            <td>
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
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-md-12 mt-2">
                <h5 className="">
                  Video Preview Image Url :{" "}
                  <a
                    href={formData.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark"
                    style={{
                      textDecoration: "underline",
                      fontWeight: "500",
                      color: "var(--red)",
                    }}
                  >
                    Check Here
                  </a>
                </h5>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-3 pb-4 mx-4">
          <div className="card-header3">
            <h3 className="card-title">Virtual Tour</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12 row px-3 ">
                <div className="col-6 ">
                  <label>Country</label>
                </div>
                <div className="col-6">
                  <label className="text">
                    <span className="me-3">
                      <span className="text-dark">
                        :
                        {formData?.virtual_tour_url_multiple?.length > 0
                          ? formData.virtual_tour_url_multiple.map(
                              (virtual, idx) => (
                                <div key={idx}>
                                  <strong>{virtual.virtual_tour_name}:</strong>{" "}
                                  <a
                                    href={virtual.virtual_tour_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {virtual.virtual_tour_url}
                                  </a>
                                </div>
                              )
                            )
                          : "N/A"}
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
