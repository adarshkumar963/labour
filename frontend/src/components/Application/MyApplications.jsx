import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileAlt,
  FaTrash,
} from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import ResumeModal from "./ResumeModal";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const endpoint =
          user?.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";

        const { data } = await axios.get(endpoint, { withCredentials: true });
        setApplications(data.applications);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Error fetching applications"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthorized) fetchApplications();
  }, [isAuthorized, user?.role]);

  if (!isAuthorized) {
    navigateTo("/");
    return null;
  }

  const deleteApplication = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?"))
      return;

    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error deleting application"
      );
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="applications-container">
      <div className="applications-header">
        <h1>
          {user?.role === "Job Seeker"
            ? "My Applications"
            : "Applications From Job Seekers"}
        </h1>
        <p>
          {user?.role === "Job Seeker"
            ? "Track all your job applications in one place"
            : "Review applications for your job postings"}
        </p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <img src="/images/no-applications.svg" alt="No applications" />
          <h3>No Applications Found</h3>
          <p>
            {user?.role === "Job Seeker"
              ? "You haven't applied to any jobs yet"
              : "No one has applied to your jobs yet"}
          </p>
        </div>
      ) : (
        <div className="applications-grid">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              userRole={user?.role}
              onDelete={deleteApplication}
              onViewResume={openModal}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}

      <style jsx>{`
        .applications-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: "Inter", sans-serif;
        }

        .applications-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .applications-header h1 {
          font-size: 2.2rem;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        .applications-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .loading-state {
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

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-state img {
          max-width: 300px;
          margin-bottom: 20px;
          opacity: 0.7;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: #666;
          font-size: 1rem;
        }

        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
        }

        @media (max-width: 768px) {
          .applications-header h1 {
            font-size: 1.8rem;
          }

          .applications-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

const ApplicationCard = ({ application, userRole, onDelete, onViewResume }) => {
  return (
    <div className="application-card">
      <div className="card-header">
        <h2>{application.job?.title || "Job Title Not Available"}</h2>
        {userRole === "Job Seeker" && (
          <span className={`status-badge ${application.status.toLowerCase()}`}>
            {application.status}
          </span>
        )}
      </div>

      <div className="applicant-info">
        <div className="info-item">
          <FaUser className="icon" />
          <span>{application.name}</span>
        </div>

        <div className="info-item">
          <FaEnvelope className="icon" />
          <span>{application.email}</span>
        </div>

        <div className="info-item">
          <FaPhone className="icon" />
          <span>{application.phone || "Not provided"}</span>
        </div>

        <div className="info-item">
          <FaMapMarkerAlt className="icon" />
          <span>{application.address || "Not provided"}</span>
        </div>
      </div>

      {application.coverLetter && (
        <div className="cover-letter">
          <h3>
            <FaFileAlt className="icon" /> Cover Letter
          </h3>
          <p>{application.coverLetter}</p>
        </div>
      )}

      <div className="resume-section">
        <div
          className="resume-thumbnail"
          onClick={() => onViewResume(application.resume.url)}
        >
          <img src={application.resume.url} alt="Resume thumbnail" />
          <div className="view-overlay">
            <FiExternalLink className="view-icon" />
            <span>View Resume</span>
          </div>
        </div>
      </div>

      {userRole === "Job Seeker" && (
        <button
          onClick={() => onDelete(application._id)}
          className="delete-btn"
        >
          <FaTrash className="icon" /> Delete Application
        </button>
      )}

      <style jsx>{`
        .application-card {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .application-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .card-header h2 {
          font-size: 1.3rem;
          color: #1a1a1a;
          margin: 0;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #d97706;
        }

        .status-badge.accepted {
          background: #d1fae5;
          color: #059669;
        }

        .status-badge.rejected {
          background: #fee2e2;
          color: #dc2626;
        }

        .applicant-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 10px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.95rem;
          color: #444;
        }

        .icon {
          color: #64748b;
          font-size: 0.9rem;
        }

        .cover-letter {
          margin-top: 10px;
        }

        .cover-letter h3 {
          font-size: 1rem;
          color: #64748b;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cover-letter p {
          font-size: 0.95rem;
          color: #444;
          line-height: 1.6;
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
        }

        .resume-section {
          margin-top: 15px;
        }

        .resume-thumbnail {
          position: relative;
          height: 120px;
          border: 1px dashed #ddd;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s;
        }

        .resume-thumbnail:hover {
          border-color: #3b82f6;
        }

        .resume-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .view-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(59, 130, 246, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .resume-thumbnail:hover .view-overlay {
          opacity: 1;
        }

        .view-icon {
          font-size: 1.5rem;
          margin-bottom: 5px;
        }

        .delete-btn {
          margin-top: 15px;
          padding: 10px 15px;
          background: #fee2e2;
          color: #dc2626;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .delete-btn:hover {
          background: #fecaca;
        }

        @media (max-width: 500px) {
          .applicant-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MyApplications;
