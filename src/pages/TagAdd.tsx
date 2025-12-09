import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { API_CONFIG } from "@/config/apiConfig";


const TagAdd = () => {
  const [name, setName] = useState("");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();


  // Fetch tags
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${baseURL}tags.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${baseURL}tags.json`, { tag: { tag_type: name } }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setName("");
      fetchTags(); // Refresh tag list
    } catch (error) {
      console.error("Error adding tag:", error);
    }
    setLoading(false);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}tags/${id}.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <div className="main-content">
      <div className="website-content overflow-auto">
        <div className="module-data-section container-fluid">
          <div className="card mt-4 pb-4 mx-4">
            <div className="card-header">
              <h3 className="card-title">Tag Type</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>
                        Name <span style={{ color: "#de7008", fontSize: "16px" }}>*</span>
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="row mt-2 justify-content-center">
                  <div className="col-md-2">
                    <button type="submit" className="purple-btn2 w-100" disabled={loading}>
                      {loading ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                  <div className="col-md-2">
                    <button type="button" className="purple-btn2 w-100" onClick={() => navigate(-1)}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Tag List Table */}
          <div className="card mt-4 pb-4 mx-3">
            <div className="card-header">
              <h3 className="card-title">Tags List</h3>
            </div>
            <div className="card-body">
              <table className="tbl-container mt-3">
                <thead>
                  <tr>
                    <th> Sr. no</th>
                    <th>Tag Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <tr key={tag.id}>
                        <td>{index + 1}</td>
                        <td>{tag.tag_type}</td>
                        <td>  <button className="btn-link" onClick={() => handleDelete(tag.id)}
                          style={{
                            background: "none",
                            border: "none",
                            padding: "0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-trash3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                          </svg>
                        </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No tags available
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
  );
};

export default TagAdd;