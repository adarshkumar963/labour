import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    city: "",
    location: "",
    salaryFrom: "",
    salaryTo: "",
    fixedSalary: "",
    salaryType: "default",
  });

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobPost = async (e) => {
    e.preventDefault();

    // Clear unused salary fields based on salary type
    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      country: formData.country,
      city: formData.city,
      location: formData.location,
    };

    if (formData.salaryType === "Fixed Salary") {
      payload.fixedSalary = formData.fixedSalary;
    } else if (formData.salaryType === "Ranged Salary") {
      payload.salaryFrom = formData.salaryFrom;
      payload.salaryTo = formData.salaryTo;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        category: "",
        country: "",
        city: "",
        location: "",
        salaryFrom: "",
        salaryTo: "",
        fixedSalary: "",
        salaryType: "default",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
    return null;
  }

  return (
    <div className="post-job-container">
      <div className="post-job-card">
        <div className="post-job-header">
          <h2>Post a New Job Opportunity</h2>
          <p>
            Fill in the details to find the perfect candidate for your position
          </p>
        </div>

        <form onSubmit={handleJobPost} className="post-job-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Job Title*</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Skilled Carpenter Needed"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Job Category*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="Mason">Mason</option>
                <option value="Skilled labour">Skilled labour</option>
                <option value="Unskilled labour">Unskilled labour</option>
                <option value="Plumber">Plumber</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Electrician">Electrician</option>
                <option value="Painter">Painter</option>
                <option value="Welder">Welder</option>
                <option value="Concrete Worker">Concrete Worker</option>
                <option value="Roofer">Roofer</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="country">Country*</label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. United States"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City*</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. New York"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Exact Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. 123 Main St, Building A"
              />
            </div>

            <div className="form-group salary-type-group">
              <label htmlFor="salaryType">Salary Type*</label>
              <select
                id="salaryType"
                name="salaryType"
                value={formData.salaryType}
                onChange={handleChange}
                required
              >
                <option value="default">Select salary type</option>
                <option value="Fixed Salary">Fixed Salary</option>
                <option value="Ranged Salary">Ranged Salary</option>
              </select>
            </div>

            {formData.salaryType === "Fixed Salary" && (
              <div className="form-group">
                <label htmlFor="fixedSalary">Fixed Salary*</label>
                <div className="salary-input-container">
                  <span className="currency-symbol">$</span>
                  <input
                    id="fixedSalary"
                    name="fixedSalary"
                    type="number"
                    value={formData.fixedSalary}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    required
                  />
                </div>
              </div>
            )}

            {formData.salaryType === "Ranged Salary" && (
              <div className="form-group ranged-salary-group">
                <label>Salary Range*</label>
                <div className="ranged-salary-inputs">
                  <div className="salary-input-container">
                    <span className="currency-symbol">$</span>
                    <input
                      name="salaryFrom"
                      type="number"
                      value={formData.salaryFrom}
                      onChange={handleChange}
                      placeholder="From"
                      required
                    />
                  </div>
                  <div className="salary-input-container">
                    <span className="currency-symbol">$</span>
                    <input
                      name="salaryTo"
                      type="number"
                      value={formData.salaryTo}
                      onChange={handleChange}
                      placeholder="To"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description*</label>
            <textarea
              id="description"
              name="description"
              rows="6"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities, requirements, and any other important details..."
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Post Job
          </button>
        </form>
      </div>

      <style jsx>{`
        .post-job-container {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .post-job-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 900px;
          padding: 40px;
        }

        .post-job-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .post-job-header h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .post-job-header p {
          color: #666;
          font-size: 16px;
        }

        .post-job-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 14px;
          font-weight: 500;
          color: #333;
        }

        input,
        select,
        textarea {
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
          background-color: #f9fafb;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          background-color: white;
        }

        textarea {
          resize: vertical;
          min-height: 120px;
        }

        .salary-input-container {
          position: relative;
        }

        .currency-symbol {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #666;
        }

        .salary-input-container input {
          padding-left: 30px;
          width: 100%;
        }

        .ranged-salary-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .submit-button {
          background-color: #3b82f6;
          color: white;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 16px;
          align-self: flex-end;
          width: 100%;
          max-width: 200px;
        }

        .submit-button:hover {
          background-color: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        @media (max-width: 768px) {
          .post-job-card {
            padding: 30px 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .ranged-salary-inputs {
            grid-template-columns: 1fr;
          }

          .submit-button {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PostJob;
