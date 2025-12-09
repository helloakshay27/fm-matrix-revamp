import React from "react";

import "../mor.css";
import { Link } from "react-router-dom";

const Members = () => {
  return (
    <>
      <div className="main-content">
        {/* <div className="website-content overflow-auto"> */}
          <div className="module-data-section container-fluid">
            <h1>Panchshil Connect App</h1>
            <ul>
              <li>
                <Link to="/project-create">Project Create</Link>
              </li>
              <li>
                <Link to="/project-list">Project List</Link>
              </li>
              <li>
                <Link to="/project-edit/:id">Project Edit</Link>
              </li>
              <li>
                <Link to="/project-details/">Project Details</Link>
              </li>

              <li>
                <Link to="/banner-list">Banner List</Link>
              </li>
              <li>
                <Link to="/banner-add">Banner Add</Link>
              </li>
              <li>
                <Link to="/banner-edit/:id">Banner Edit</Link>
              </li>

              {/* <li>
                <Link to="/amenities">Amenities Setup</Link>
              </li>
              <li>
                <Link to="/amenities-list">Amenities Setup List</Link>
              </li>
              <li>
                <Link to="/edit-amenities">Edit Amenities</Link>
              </li> */}
              <li>
                <Link to="/testimonials">Testimonials</Link>
              </li>
              <li>
                <Link to="/testimonial-list">Testimonial List</Link>
              </li>
              <li>
                <Link to="/testimonial-edit">Testimonial Edit</Link>
              </li>

              {/* <li>
                <Link to="/gallery-details">Gallery Details</Link>
              </li>
              <li>
                <Link to="/new-gallery">New Gallery</Link>
              </li>
              <li>
                <Link to="/gallery-list">Gallery List</Link>
              </li>
              <li>
                <Link to="/edit-gallery">Edit Gallery</Link>
              </li> */}
              {/* <li>
                <Link to="/referral-create">Referral Create</Link>
              </li> */}
              <li>
                <Link to="/referral-list">Referral List</Link>
              </li>
              <li>
                <Link to="/event-list">Event List</Link>
              </li>
              <li>
                <Link to="/event-Create">Event Create</Link>
              </li>
              <li>
                <Link to="/event-details/:id">Event Details</Link>
              </li>
              <li>
                <Link to="/event-edit/:id">Event Edit</Link>
              </li>
              <li>
                <Link to="/specification">Specification</Link>
              </li>
              <li>
                <Link to="/specification-list">Specification List</Link>
              </li>
              <li>
                <Link to="/specification-update/:id">Specification Update</Link>
              </li>
              <li>
                <Link to="/sitevisit-create">Site Visit Create</Link>
              </li>
              <li>
                <Link to="/sitevisit-list">Site Visit List</Link>
              </li>
              <li>
                <Link to="/sitevisit-edit/">Site Visit Edit</Link>
              </li>
              {/* <li>
                <Link to="/siteslot-create">Site Visit Slot Config</Link>
              </li>
              <li>
                <Link to="/siteslot-list">
                  Site Visit Slot Config List
                </Link>
              </li> */}
              <li>
                <Link to="/organization-create">Organization Create</Link>
              </li>
              <li>
                <Link to="/organization-list">Organization List</Link>
              </li>
              <li>
                <Link to="organization-update">Organization Update</Link>
              </li>
              <li>
                <Link to="/company-create">Company Create</Link>
              </li>
              <li>
                <Link to="/company-list">Company List</Link>
              </li>
              <li>
                <Link to="/company-edit">Company Edit</Link>
              </li>
              <li>
                <Link to="/department-create">Department Create</Link>
              </li>
              <li>
                <Link to="/department-list">Department List</Link>
              </li>
              <li>
                <Link to="/department-edit/:id">Department Edit</Link>
              </li>
              <li>
                <Link to="/site-create">Site Create</Link>
              </li>
              <li>
                <Link to="/site-list">Site List</Link>
              </li>
              <li>
                <Link to="/site-edit/:id">Site Edit</Link>
              </li>
              <li>
                <Link to="/support-service-list">Support Service List</Link>
              </li>
              <li>
                <Link to="/pressreleases-create">Press Releases Create</Link>
              </li>
              <li>
                <Link to="/pressreleases-list">Press Releases List</Link>
              </li>
              <li>
                <Link to="/pressreleases-edit/:id">Press Releases Edit</Link>
              </li>
               <li>
                <Link to="/faq-create">FAQ Create</Link>
              </li>
              <li>
                <Link to="/faq-list">FAQ List</Link>
              </li>
              <li>
                <Link to="/faq-edit/:id">FAQ Edit</Link>
              </li>
              {/* <li>
                <Link to="/project-configuration">Project Configuraion</Link>
              </li>
              <li>
                <Link to="/project-config-edit">Project Configuraion Edit</Link>
              </li>
              <li>
                <Link to="/project-configuration-list">
                  Project Configuraion List
                </Link>
              </li>
              <li> */}
                {/* <Link to="/property-type">Property Type</Link>
              </li>
              <li>
                <Link to="/property-type-edit">Property Type Edit</Link>
              </li>
              <li>
                <Link to="/property-type-list">Property Type List</Link>
              </li>
              <li>
                <Link to="/project-building-type">Project Building Type</Link>
              </li>
              <li>
                <Link to="/project-building-type-edit">Project Building Edit</Link>
              </li>
              <li>
                <Link to="/project-building-type-list">Project Building Type List</Link>
              </li> */}
              {/* <li>
                <Link to="/construction-status">
                    Construction Status
                </Link>
              </li>
              <li>
                <Link to="/construction-status-edit">
                    Construction Status Edit
                </Link>
              </li>
              <li>
                <Link to="/construction-status-list">
                    Construction Status List
                </Link>
              </li> */}



              <li>
                <Link to="/enquiry-list">
                    Enquiry List
                </Link>
              </li>

                <li>
                <Link to="/referral-program-list">
                    Referral Program List
                </Link>
              </li>

               <li>
                <Link to="/referral-program-create">
                    Referral Program Create
                </Link>
              </li>

               <li>
                <Link to="/referral-program-edit/:id">
                    Referral Program Edit
                </Link>
              </li>
            
              <li className="pb-5">{/* add above this li */}</li>
            </ul>
          </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default Members;
