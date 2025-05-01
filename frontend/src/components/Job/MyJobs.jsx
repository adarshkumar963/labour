import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  // Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getmyjobs",
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
    return null;
  }

  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/job/update/${jobId}`,
        updatedJob,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setEditingMode(null);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/job/delete/${jobId}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your jobs...</p>
      </div>
    );
  }

  return (
    <div className="my-jobs-container">
      <div className="my-jobs-header">
        <h1>Your Posted Jobs</h1>
        <p>Manage and update your job listings</p>
      </div>

      {myJobs.length > 0 ? (
        <div className="jobs-grid">
          {myJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <div className="job-card-header">
                <div className="job-title">
                  <input
                    type="text"
                    disabled={editingMode !== job._id}
                    value={job.title}
                    onChange={(e) =>
                      handleInputChange(job._id, "title", e.target.value)
                    }
                    className={editingMode === job._id ? "editing" : ""}
                  />
                </div>
                <div className="job-status">
                  <span
                    className={`status-badge ${
                      job.expired ? "expired" : "active"
                    }`}
                  >
                    {job.expired ? "Expired" : "Active"}
                  </span>
                </div>
              </div>

              <div className="job-details">
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <select
                    value={job.category}
                    onChange={(e) =>
                      handleInputChange(job._id, "category", e.target.value)
                    }
                    disabled={editingMode !== job._id}
                    className={editingMode === job._id ? "editing" : ""}
                  >
                    <option value="Mason">Mason</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Painter">Painter</option>
                    <option value="Welder">Welder</option>
                    <option value="Roofer">Roofer</option>
                    <option value="Concrete Worker">Concrete Worker</option>
                  </select>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <div className="location-fields">
                    <input
                      type="text"
                      disabled={editingMode !== job._id}
                      value={job.country}
                      onChange={(e) =>
                        handleInputChange(job._id, "country", e.target.value)
                      }
                      placeholder="Country"
                      className={editingMode === job._id ? "editing" : ""}
                    />
                    <input
                      type="text"
                      disabled={editingMode !== job._id}
                      value={job.city}
                      onChange={(e) =>
                        handleInputChange(job._id, "city", e.target.value)
                      }
                      placeholder="City"
                      className={editingMode === job._id ? "editing" : ""}
                    />
                  </div>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <textarea
                    disabled={editingMode !== job._id}
                    value={job.location}
                    onChange={(e) =>
                      handleInputChange(job._id, "location", e.target.value)
                    }
                    className={editingMode === job._id ? "editing" : ""}
                    rows={2}
                  />
                </div>

                <div className="detail-row">
                  <span className="detail-label">Salary:</span>
                  {job.fixedSalary ? (
                    <div className="salary-field">
                      <span>$</span>
                      <input
                        type="number"
                        disabled={editingMode !== job._id}
                        value={job.fixedSalary}
                        onChange={(e) =>
                          handleInputChange(
                            job._id,
                            "fixedSalary",
                            e.target.value
                          )
                        }
                        className={editingMode === job._id ? "editing" : ""}
                      />
                    </div>
                  ) : (
                    <div className="salary-range-fields">
                      <div className="salary-field">
                        <span>From:</span>
                        <span>$</span>
                        <input
                          type="number"
                          disabled={editingMode !== job._id}
                          value={job.salaryFrom}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "salaryFrom",
                              e.target.value
                            )
                          }
                          className={editingMode === job._id ? "editing" : ""}
                        />
                      </div>
                      <div className="salary-field">
                        <span>To:</span>
                        <span>$</span>
                        <input
                          type="number"
                          disabled={editingMode !== job._id}
                          value={job.salaryTo}
                          onChange={(e) =>
                            handleInputChange(
                              job._id,
                              "salaryTo",
                              e.target.value
                            )
                          }
                          className={editingMode === job._id ? "editing" : ""}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <select
                    value={job.expired}
                    onChange={(e) =>
                      handleInputChange(job._id, "expired", e.target.value)
                    }
                    disabled={editingMode !== job._id}
                    className={editingMode === job._id ? "editing" : ""}
                  >
                    <option value={false}>Active</option>
                    <option value={true}>Expired</option>
                  </select>
                </div>

                <div className="detail-row full-width">
                  <span className="detail-label">Description:</span>
                  <textarea
                    disabled={editingMode !== job._id}
                    value={job.description}
                    onChange={(e) =>
                      handleInputChange(job._id, "description", e.target.value)
                    }
                    className={editingMode === job._id ? "editing" : ""}
                    rows={4}
                  />
                </div>
              </div>

              <div className="job-card-actions">
                {editingMode === job._id ? (
                  <>
                    <button
                      onClick={() => handleUpdateJob(job._id)}
                      className="save-btn"
                    >
                      <FaCheck /> Save
                    </button>
                    <button onClick={handleDisableEdit} className="cancel-btn">
                      <RxCross2 /> Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleEnableEdit(job._id)}
                    className="edit-btn"
                  >
                    <FaEdit /> Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteJob(job._id)}
                  className="delete-btn"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-jobs">
          <img src="/images/no-jobs.svg" alt="No jobs posted" />
          <h3>No Jobs Posted Yet</h3>
          <p>You haven't posted any jobs yet. Create your first job listing!</p>
        </div>
      )}

      <style jsx>{`
        .my-jobs-container {
          padding: 40px 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: "Inter", sans-serif;
        }

        .my-jobs-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .my-jobs-header h1 {
          font-size: 2.2rem;
          color: #1a1a1a;
          margin-bottom: 8px;
          font-weight: 700;
        }

        .my-jobs-header p {
          color: #666;
          font-size: 1rem;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }

        .job-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #eaeaea;
        }

        .job-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .job-card-header {
          padding: 20px;
          border-bottom: 1px solid #f0f0f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
        }

        .job-title input {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a1a1a;
          border: none;
          background: transparent;
          width: 100%;
          padding: 5px;
        }

        .job-title input.editing {
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 8px 12px;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.active {
          background: #e6f7ee;
          color: #10b981;
        }

        .status-badge.expired {
          background: #fee2e2;
          color: #ef4444;
        }

        .job-details {
          padding: 20px;
        }

        .detail-row {
          margin-bottom: 15px;
          display: flex;
          flex-direction: column;
        }

        .detail-row.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 5px;
          font-weight: 500;
        }

        input,
        select,
        textarea {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          background: #f9fafb;
        }

        input:disabled,
        select:disabled,
        textarea:disabled {
          background: transparent;
          border: none;
          padding: 0;
          color: inherit;
        }

        input.editing,
        select.editing,
        textarea.editing {
          background: white;
          border: 1px solid #ccc;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .location-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .salary-field {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .salary-field span:first-child {
          color: #666;
          font-size: 0.9rem;
        }

        .salary-range-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .job-card-actions {
          padding: 15px 20px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          background: #f9fafb;
        }

        button {
          padding: 8px 15px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .edit-btn {
          background: #3b82f6;
          color: white;
        }

        .edit-btn:hover {
          background: #2563eb;
        }

        .save-btn {
          background: #10b981;
          color: white;
        }

        .save-btn:hover {
          background: #059669;
        }

        .cancel-btn {
          background: #f59e0b;
          color: white;
        }

        .cancel-btn:hover {
          background: #d97706;
        }

        .delete-btn {
          background: #ef4444;
          color: white;
        }

        .delete-btn:hover {
          background: #dc2626;
        }

        .no-jobs {
          text-align: center;
          padding: 60px 20px;
        }

        .no-jobs img {
          max-width: 300px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .no-jobs h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        .no-jobs p {
          color: #666;
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3b82f6;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .jobs-grid {
            grid-template-columns: 1fr;
          }

          .location-fields,
          .salary-range-fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MyJobs;
