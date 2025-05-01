import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBriefcase,
  FaBuilding,
  FaFileAlt,
} from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/v1/job/${id}`, {
          withCredentials: true,
        });
        setJob(res.data.job);
      } catch (error) {
        navigateTo("/notfound");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigateTo]);

  if (!isAuthorized) {
    navigateTo("/login");
    return null;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="job-details-container">
      <div className="job-details-card">
        <header className="job-header">
          <div className="job-title-section">
            <h1>{job.title}</h1>
            <div className="job-category">
              <FaBriefcase className="icon" />
              <span>{job.category}</span>
            </div>
          </div>

          <div className="job-meta">
            <div className="meta-item">
              <FaBuilding className="icon" />
              <span>{job.companyName || "Not specified"}</span>
            </div>
            <div className="meta-item">
              <FaMapMarkerAlt className="icon" />
              <span>
                {job.city}, {job.country}
              </span>
            </div>
            <div className="meta-item">
              <FaCalendarAlt className="icon" />
              <span>Posted on {formatDate(job.jobPostedOn)}</span>
            </div>
          </div>
        </header>

        <div className="job-content">
          <div className="details-section">
            <h2>
              <FaFileAlt className="icon" /> Job Details
            </h2>

            <div className="detail-grid">
              <div className="detail-item">
                <h3>Location</h3>
                <p>{job.location || "Not specified"}</p>
              </div>

              <div className="detail-item">
                <h3>Salary</h3>
                <p className="salary">
                  {job.fixedSalary ? (
                    <span>${job.fixedSalary.toLocaleString()} (Fixed)</span>
                  ) : (
                    <span>
                      ${job.salaryFrom?.toLocaleString()} - $
                      {job.salaryTo?.toLocaleString()}
                    </span>
                  )}
                </p>
              </div>

              <div className="detail-item full-width">
                <h3>Job Description</h3>
                <div className="description-text">
                  {job.description || "No description provided."}
                </div>
              </div>
            </div>
          </div>

          {user && user.role !== "Employer" && (
            <div className="apply-section">
              <Link to={`/application/${job._id}`} className="apply-button">
                Apply Now
              </Link>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .job-details-container {
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .job-details-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 800px;
          overflow: hidden;
        }

        .job-header {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white;
          padding: 40px;
          position: relative;
        }

        .job-title-section {
          margin-bottom: 20px;
        }

        .job-title-section h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .job-category {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 12px;
          border-radius: 20px;
          width: fit-content;
          font-size: 0.9rem;
        }

        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 15px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          opacity: 0.9;
        }

        .icon {
          font-size: 1rem;
        }

        .job-content {
          padding: 40px;
        }

        .details-section h2 {
          font-size: 1.5rem;
          color: #1e293b;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .detail-item {
          margin-bottom: 15px;
        }

        .detail-item h3 {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .detail-item p {
          font-size: 1.1rem;
          color: #1e293b;
          line-height: 1.5;
        }

        .salary {
          font-weight: 600;
          color: #10b981 !important;
        }

        .description-text {
          white-space: pre-line;
          line-height: 1.7;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .apply-section {
          margin-top: 40px;
          text-align: center;
        }

        .apply-button {
          display: inline-block;
          background-color: #3b82f6;
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          transition: all 0.3s;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .apply-button:hover {
          background-color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
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
          .job-header {
            padding: 30px 20px;
          }

          .job-content {
            padding: 30px 20px;
          }

          .job-title-section h1 {
            font-size: 1.8rem;
          }

          .job-meta {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default JobDetails;
