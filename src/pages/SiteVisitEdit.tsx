import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { API_CONFIG } from "@/config/apiConfig";


const SitevisitEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState([]);

  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    scheduled_at: "",
    selected_slot: "",
    site_schedule_id: "",
    status: "",
  });

  const { id } = useParams(); // Get ID from URL params for editing
  const [projectsType, setProjectsType] = useState([]);
  const [slots, setSlots] = useState([]);
  //const [loading, setLoading] = useState(false)

  const formatDateForApi = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return `${day}-${month}-${year}`;
  };

  const fetchProjects = async () => {
    try {
      const cachedProjects = localStorage.getItem("projects");

      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects));
      }

      const response = await axios.get(
        `${baseURL}projects.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const projectData = response.data.projects || [];

      // ✅ Update cache
      localStorage.setItem("projects", JSON.stringify(projectData));
      setProjects(projectData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchSlots = async (
    selectedDate,
    selectedProjectId,
    existingSiteScheduleId
  ) => {
    if (!selectedDate || !selectedProjectId) {
      console.error("Project ID and date are required to fetch slots.");
      return;
    }

    try {
      const formattedDate = formatDateForApi(selectedDate);
      const response = await axios.get(
        `${baseURL}site_schedule/all_site_schedule_slots.json`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
          params: { project_id: selectedProjectId, date: formattedDate },
        }
      );

      const availableSlots = response.data?.slots || [];
      console.log("Fetched slots:", availableSlots);
      setSlots(availableSlots);

      // ✅ Ensure the selected slot is set correctly after fetching slots
      if (existingSiteScheduleId) {
        const selectedSlot = availableSlots.find(
          (slot) => slot.id === existingSiteScheduleId
        );
        setFormData((prev) => ({
          ...prev,
          selected_slot: selectedSlot ? selectedSlot.id : "",
        }));
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast.error("Failed to fetch slots.");
      setSlots([]);
    }
  };

  const fetchSiteVisits = async () => {
    try {
      const response = await axios.get(
        `${baseURL}site_schedule_requests.json`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const siteVisit = response.data.site_visits || [];
      const selectedVisit = siteVisit.find(
        (visit) => visit.id.toString() === id
      );

      if (!selectedVisit) {
        console.error("No site visit found for ID:", id);
        return;
      }

      setFormData({
        scheduled_at: selectedVisit.scheduled_at,
        project_id: selectedVisit.project_id,
        site_schedule_id: selectedVisit.site_schedule_id,
        selected_slot: "", // Reset slot before fetching
        status: selectedVisit.status,
      });

      fetchSlots(
        selectedVisit.scheduled_at,
        selectedVisit.project_id,
        selectedVisit.site_schedule_id
      );
    } catch (error) {
      setError("Failed to fetch site visits. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchSiteVisits();
  }, []);

  console.log("Respp", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedForm = { ...prev, [name]: value };

      if (name === "project_name") {
        const selectedProject = projects.find((p) => p.id === parseInt(value));
        updatedForm.project_name = selectedProject?.project_name || "";
        updatedForm.project_id = selectedProject?.id || "";
      }

      if (updatedForm.project_id && updatedForm.scheduled_at) {
        fetchSlots(updatedForm.scheduled_at, updatedForm.project_id);
      }

      return updatedForm;
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // if (
    //   !formData.scheduled_at ||
    //   !formData.project_id ||
    //   !formData.selected_slot
    // ) {
    //   toast.error("Please fill all required fields, including a time slot.");
    //   setLoading(false);
    //   return;
    // }

    // Prepare request payload
    const requestData = {
      site_schedule_request: {
        scheduled_at: formData.scheduled_at,
        site_schedule_id: formData.selected_slot,
        // selected_slot: formData.selected_slot,
        project_id: formData.project_id,
        // status: formData.status
      },
    };

    try {
      const response = await axios.put(
        `${baseURL}site_schedule_requests/${id}.json`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success("Site visit updated successfully");
      console.log("Response from API:", response.data);
      navigate("/sitevisit-list");
    } catch (error) {
      console.error("Error updating site visit:", error);
      toast.error(
        `Error updating schedule: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // This navigates back one step in history
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="module-data-section p-3">
            <form onSubmit={handleSubmit}>
              <div className="card mt-4 pb-4 mx-4">
                <div className="card-header3">
                  <h3 className="card-title">Edit Site Visit</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* Project Selection */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Project<span style={{ color: "#de7008" }}> *</span>
                        </label>
                        <SelectBox
                          options={projects.map((proj) => ({
                            label: proj.project_name,
                            value: proj.id,
                          }))}
                          defaultValue={formData.project_id}
                          onChange={(value) =>
                            setFormData({ ...formData, project_id: value })
                          }
                        />
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>
                          Date <span style={{ color: "#de7008" }}> *</span>
                        </label>
                        <input
                          className="form-control"
                          type="date"
                          name="scheduled_at"
                          value={formData.scheduled_at}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Slot Selection */}

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Select Available Slot</label>
                        <SelectBox
                          options={slots.map((slot) => ({
                            label: `${slot.start_time} to ${slot.end_time}`,
                            value: slot.id,
                            disabled: slot.slot_disabled,
                          }))}
                          defaultValue={formData.selected_slot || ""}
                          onChange={(value) => {
                            setFormData({
                              ...formData,
                              selected_slot: value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="row my-4 justify-content-center">
                <div className="col-md-2">
                  <button
                    type="submit"
                    className="purple-btn2 purple-btn2-shadow w-100"
                    disabled={loading}
                  >
                    Submit
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
        </div>
      </div>
    </div>
  );
};

export default SitevisitEdit;
