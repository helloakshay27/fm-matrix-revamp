import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const ProjectBuildingTypeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buildingType, setBuildingType] = useState("");
  const [loading, setLoading] = useState(false);
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    Property_Type: "",
    Property_Type_ID: null,
    building_type: "",
  });

  useEffect(() => {
    setIsLoading(true);
    
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}property_types.json`);
        // API returns array directly
        const fetchedPropertyTypes = Array.isArray(response.data) ? response.data : [];

        const options = fetchedPropertyTypes.map((item) => ({
          value: item.property_type,
          label: item.property_type,
          id: item.id,
        }));

        setPropertyTypeOptions(options);
        return options;
      } catch (error) {
        console.error("Error fetching property types:", error);
        toast.error("Failed to fetch property types");
        return [];
      }
    };

    const fetchBuildingType = async (options) => {
      try {
        const response = await axios.get(`${baseURL}building_types/${id}.json`);
        const data = response.data;

        // Set the building type name
        setBuildingType(data.building_type);

        // Find the matching property type based on property_type_id
        const matchedPropertyType = options.find(
          (item) => item.id === data.property_type_id
        );

        if (matchedPropertyType) {
          console.log("Found matching property type:", matchedPropertyType);
          
          setFormData({
            Property_Type: matchedPropertyType.value,
            Property_Type_ID: data.property_type_id,
            building_type: data.building_type,
          });
        } else {
          console.warn("No matching property type found for ID:", data.property_type_id);
          
          setFormData({
            Property_Type: "",
            Property_Type_ID: data.property_type_id,
            building_type: data.building_type,
          });
        }
      } catch (error) {
        console.error("Error fetching building type:", error);
        toast.error("Failed to fetch building type");
      } finally {
        setIsLoading(false);
      }
    };

    const initializeData = async () => {
      const options = await fetchPropertyTypes();
      if (options.length > 0) {
        await fetchBuildingType(options);
      } else {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!buildingType.trim()) {
      toast.error("Building type name is required");
      return;
    }

    if (!formData.Property_Type_ID) {
      toast.error("Property type is required");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${baseURL}building_types/${id}.json`, {
        building_type: {
          building_type: buildingType,
          property_type_id: formData.Property_Type_ID,
        },
      });
      toast.success("Building type updated successfully");
      navigate("/setup-member/project-building-type-list");
    } catch (error) {
      console.error("Error updating building type:", error);
      toast.error("Failed to update building type");
    } finally {
      setLoading(false);
    }
  };

  console.log("Property Type Options:", propertyTypeOptions);
  console.log("Current Form Data:", formData);

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Edit Project Building Type</h3>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Property Types <span className="otp-asterisk">{" "}*</span>
                        </label>
                        <SelectBox
                          options={propertyTypeOptions}
                          value={formData.Property_Type}
                          onChange={(value) => {
                            const selected = propertyTypeOptions.find(
                              (opt) => opt.value === value
                            );
                            setFormData((prev) => ({
                              ...prev,
                              Property_Type: value,
                              Property_Type_ID: selected?.id || null,
                            }));
                          }}
                          placeholder="Select Property Type"
                          isSearchable={true}
                          defaultValue={formData.Property_Type}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Name <span className="otp-asterisk">{" "}*</span>
                        </label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Enter name"
                          value={buildingType}
                          onChange={(e) => setBuildingType(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2 justify-content-center">
                    <div className="col-md-2">
                      <button type="submit" className="purple-btn2 w-100" disabled={loading}>
                        {loading ? "Updating..." : "Submit"}
                      </button>
                    </div>
                    <div className="col-md-2">
                      <button
                        type="button"
                        className="purple-btn2 w-100"
                        onClick={() => navigate("/setup-member/project-building-type-list")}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBuildingTypeEdit;