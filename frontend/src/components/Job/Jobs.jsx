import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  return (
    <section className="jobs-section">
      <div className="container">
        <header className="section-header">
          <h1>Available Job Opportunities</h1>
          <p className="subtitle">Find your next career move</p>
        </header>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.jobs && jobs.jobs.length > 0 ? (
              jobs.jobs.map((job) => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="no-jobs">
                <img src="/images/no-jobs.svg" alt="No jobs available" />
                <h3>No jobs available at the moment</h3>
                <p>Check back later or try a different search</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <div className="job-card-content">
        <div className="job-meta">
          <span className="job-category">{job.category}</span>
          <span className="job-location">{job.country}</span>
        </div>
        <h2>{job.title}</h2>
        <div className="job-description">
          {job.description && job.description.substring(0, 100)}...
        </div>
      </div>
      <div className="job-card-footer">
        <Link to={`/job/${job._id}`} className="view-details-btn">
          View Details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path
              fill="currentColor"
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Jobs;

// CSS (can be in a separate file or styled-components)
const styles = `
.jobs-section {
  background: #f8fafc;
  min-height: 100vh;
  padding: 80px 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
  background: linear-gradient(90deg, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.section-header .subtitle {
  color: #64748b;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.job-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.job-card-content {
  padding: 24px;
  flex-grow: 1;
}

.job-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.875rem;
}

.job-category {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.job-location {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
}

.job-location svg {
  margin-right: 4px;
}

.job-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.job-description {
  color: #64748b;
  font-size: 0.9375rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

.job-card-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
}

.view-details-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #3b82f6;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
}

.view-details-btn:hover {
  background: #2563eb;
}

.view-details-btn svg {
  margin-left: 8px;
  transition: transform 0.2s ease;
}

.view-details-btn:hover svg {
  transform: translateX(2px);
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3b82f6;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-jobs {
  text-align: center;
  grid-column: 1 / -1;
  padding: 60px 0;
}

.no-jobs img {
  max-width: 300px;
  margin-bottom: 24px;
  opacity: 0.8;
}

.no-jobs h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.no-jobs p {
  color: #64748b;
  font-size: 1rem;
}
`;

// Inject styles
const styleElement = document.createElement("style");
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);
