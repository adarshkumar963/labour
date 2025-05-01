import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFileUpload,
  FaPaperPlane,
} from "react-icons/fa";

const Application = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverLetter: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }
    formDataToSend.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
    return null;
  }

  return (
    <div className="application-container">
      <div className="application-card">
        <header className="application-header">
          <h1>Job Application</h1>
          <p>Complete the form to apply for this position</p>
        </header>

        <form onSubmit={handleApplication} className="application-form">
          <div className="form-group">
            <label>
              <FaUser className="icon" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaEnvelope className="icon" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaPhone className="icon" /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt className="icon" /> Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St, City"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Cover Letter</label>
            <textarea
              name="coverLetter"
              placeholder="Explain why you're a good fit for this position..."
              value={formData.coverLetter}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaFileUpload className="icon" /> Resume (PDF, JPG, PNG)
            </label>
            <div className="file-upload">
              <input
                type="file"
                id="resume"
                accept=".pdf,.jpg,.png"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="resume" className="file-upload-label">
                {formData.resume ? formData.resume.name : "Choose file"}
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            <FaPaperPlane className="icon" />
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .application-container {
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 60px 20px;
          display: flex;
          justify-content: center;
          font-family: "Inter", sans-serif;
        }

        .application-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 800px;
          padding: 40px;
        }

        .application-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .application-header h1 {
          font-size: 2rem;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .application-header p {
          color: #64748b;
          font-size: 1rem;
        }

        .application-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon {
          font-size: 0.9rem;
          color: #64748b;
        }

        input,
        textarea {
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        input:focus,
        textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .file-upload {
          position: relative;
        }

        .file-upload input {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-upload-label {
          display: block;
          padding: 12px 16px;
          border: 1px dashed #cbd5e1;
          border-radius: 8px;
          background: #f8fafc;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .file-upload-label:hover {
          border-color: #94a3b8;
          background: #f1f5f9;
        }

        .submit-button {
          margin-top: 20px;
          padding: 14px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .submit-button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .application-card {
            padding: 30px 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Application;
