import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from "@/config/apiConfig";
import { toast } from "sonner";  // Import Axios
import "../mor.css";


const GalleryDetails = () => {
    const [galleryDetails, setGalleryDetails] = useState(null);

    useEffect(() => {
        const fetchGalleryDetails = async () => {
            try {
                const response = await axios.get(`${baseURL}galleries.json?project_id=1`);
                setGalleryDetails(response.data);  //API returns data in the expected structure
            } catch (error) {
                console.error("Error fetching gallery details:", error);
            }
        };

        fetchGalleryDetails();
    }, []);

    if (!galleryDetails) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="main-content">
                <div className="website-content overflow-auto">
                    <div className="module-data-section container-fluid">
                        <div className="details_page ">
                            <div className="row px-3 mt-4">
                                <div className="col-md-12 mb-3">
                                    <h5>Gallery Details</h5>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Project Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text"><span className="me-3">:-</span>{galleryDetails.project_name}</label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Gallery Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text"><span className="me-3">:-</span>{galleryDetails.gallery_name}</label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Title</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text"><span className="me-3">:-</span>{galleryDetails.title}</label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Name</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text"><span className="me-3">:-</span>{galleryDetails.name}</label>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12 row px-3">
                                    <div className="col-6">
                                        <label>Gallery File</label>
                                    </div>
                                    <div className="col-6">
                                        <label className="text">
                                            <span className="me-3">:-</span>
                                        </label>
                                        <img
                                            src={galleryDetails.gallery_file}
                                            className="img-fluid"
                                            alt="Gallery Image"
                                        />
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

export default GalleryDetails;
