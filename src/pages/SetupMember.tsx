import React from "react";


import "../mor.css";
import { Link } from "react-router-dom";

const SetupMember = () => {
  return (
    <div>
      <>
        <div className="main-content  ">
          {/* <div className="website-content overflow-auto"> */}
          <div className="module-data-section container-fluid">
            <h1>Panchshil Setup Member </h1>
            <ul>
            <li>
                <Link to="/setup-member/user-list">
                  User List
                </Link>
              </li>
            <li>
                <Link to="/setup-member/user-create">
                  User Create
                </Link>
              </li>           
            <li>
                <Link to="/setup-member/user-edit/:id">
                  User Edit
                </Link>
              </li>
              <li>
                <Link to="/setup-member/user-details/:id">
                  User Details
                </Link>
              </li>
            <li>
                <Link to="/setup-member/lock-role-create">
                  Lock Role Create
                </Link>
              </li>

              <li>
                <Link to="/setup-member/lock-role-list">
                  Lock Role List
                </Link>
              </li>

              <li>
                <Link to="/setup-member/lock-function">
                  Lock Function Create
                </Link>
              </li>

              <li>
                <Link to="/setup-member/lock-function-edit/:id">
                  Lock Function Edit{" "}
                </Link>
              </li>

              <li>
                <Link to="/setup-member/lock-function-list">
                  Lock Function List
                </Link>
              </li>
               <li>
                <Link to="/setup-member/tds-tutorials-create">TDS Tutorials Create</Link>
              </li>
              <li>
                <Link to="/setup-member/tds-tutorials-list">TDS Tutorials List</Link>
              </li>
               <li>
                <Link to="/setup-member/tds-tutorials-edit/:id">TDS Tutorials Edit</Link>
              </li>

               <li>
                <Link to="/setup-member/plus-services-list">Plus Services List</Link>
              </li>
               <li>
                <Link to="/setup-member/plus-services-create">Plus Services Create</Link>
              </li>
               <li>
                <Link to="/setup-member/plus-services-edit/:id">Plus Services Edit</Link>
              </li>
              <li>
                <Link to="/setup-member/smtp-settings-list">SMTP Settings List</Link>
              </li>
              <li>
                <Link to="/setup-member/smtp-settings-edit/:id">SMTP Settings Edit</Link>
              </li>
              <li>
                <Link to="/setup-member/user-groups-list">User Groups List</Link>
              </li>
              <li>
                <Link to="/setup-member/user-groups-create">User Groups Create</Link>
              </li>
              <li>
                <Link to="/setup-member/user-groups-edit/:id">User Groups Edit</Link>
              </li>
               <li>
                <Link to="/setup-member/faq-create">FAQ Create</Link>
              </li>
              <li>
                <Link to="/setup-member/faq-list">FAQ List</Link>
              </li>
              <li>
                <Link to="/setup-member/faq-edit/:id">FAQ Edit</Link>
              </li>
               <li>
                <Link to="/setup-member/faq-category-list">Faq Category List</Link>
              </li>
               <li>
                <Link to="/setup-member/faq-category/create">Faq Category Create</Link>
              </li>
              <li>
                <Link to="/setup-member/faq-category/:faqId/edit">Faq Category Edit</Link>
              </li>

               <li>
                <Link to="/setup-member/faq-subcategory-list">FAQ Subcategory List</Link>
              </li>
              <li>
                <Link to="/setup-member/faq-subcategory/create">FAQ Subcategory Create</Link>
              </li>
               <li>
                <Link to="/setup-member/faq-subcategory/:faqSubId/edit">Faq Subcategory Edit</Link>
              </li>

              <li>
                <Link to="category-types">Category Type</Link>
              </li>
              <li>
                <Link to="category-types-list">Category Type List</Link>
              </li>
              <li>
                <Link to="category-types-edit">Category Type Edit</Link>
              </li>
              <li>
                <Link to="property-type">Property Type</Link>
              </li>
              <li>
                <Link to="property-type-edit">Property Type Edit</Link>
              </li>
              <li>
                <Link to="property-type-list">Property Type List</Link>
              </li>
              <li>
                <Link to="project-building-type">Project Building Type</Link>
              </li>
              <li>
                <Link to="project-building-type-edit">
                  Project Building Edit
                </Link>
              </li>
              <li>
                <Link to="project-building-type-list">
                  Project Building Type List
                </Link>
              </li>
              <li>
                <Link to="construction-status">Construction Status</Link>
              </li>
              <li>
                <Link to="construction-status-edit">
                  Construction Status Edit
                </Link>
              </li>
              <li>
                <Link to="construction-status-list">
                  Construction Status List
                </Link>
              </li>
              <li>
                <Link to="project-configuration">Project Configuraion</Link>
              </li>
              <li>
                <Link to="project-config-edit">Project Configuraion Edit</Link>
              </li>
              <li>
                <Link to="project-configuration-list">
                  Project Configuraion List
                </Link>
              </li>

              <li>
                <Link to="amenities">Amenities Setup</Link>
              </li>
              <li>
                <Link to="amenities-list">Amenities Setup List</Link>
              </li>
              <li>
                <Link to="edit-amenities">Edit Amenities</Link>
              </li>

              <li>
                <Link to="siteslot-create">Site Visit Slot Config</Link>
              </li>
              <li>
                <Link to="siteslot-list">Site Visit Slot Config List</Link>
              </li>

             
              <li>
                <Link to="tag-add">Tag</Link>
              </li>

              <li className="pb-5">{/* add above this li */}</li>
            </ul>
          </div>
          {/* </div> */}
        </div>
      </>
    </div>
  );
};

export default SetupMember;
