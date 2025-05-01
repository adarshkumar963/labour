import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: "Live Job",
      icon: <FaSuitcase size={32} />,
    },
    {
      id: 2,
      title: "91,220",
      subTitle: "Tenant Labours",
      icon: <FaBuilding size={32} />,
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: "Job Seekers",
      icon: <FaUsers size={32} />,
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: "Labours",
      icon: <FaUserPlus size={32} />,
    },
  ];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: "50px 20px",
        minHeight: "100vh",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
        }}
      >
        {/* Left Text */}
        <div style={{ flex: "1 1 500px" }}>
          <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
            Find a job that suits
          </h1>

          {/* Separated Box */}
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "20px",
              padding: "30px",
              backdropFilter: "blur(10px)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <h4
              style={{
                fontSize: "20px",
                color: "#ffcc00",
                marginBottom: "15px",
              }}
            >
              Where skills meet opportunities. Find work. Find workers. Grow
              together.
            </h4>
            <p style={{ lineHeight: "1.7", color: "#ddd", fontSize: "16px" }}>
              Our platform bridges the gap between skilled laborers and those in
              need of their services. We empower workers by providing
              opportunities and make it easy for businesses and individuals to
              find reliable, experienced labor for any task.
            </p>
          </div>
        </div>

        {/* Right Image */}
        <div style={{ flex: "1 1 400px" }}>
          <img
            src="/heroS.jpg"
            alt="hero"
            style={{
              width: "100%",
              borderRadius: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>

      {/* Cards Section */}
      <div
        style={{
          marginTop: "60px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        {details.map((element) => (
          <div
            key={element.id}
            style={{
              background: "linear-gradient(145deg, #1f1f1f, #2e2e2e)",
              padding: "20px 30px",
              borderRadius: "15px",
              minWidth: "220px",
              textAlign: "center",
              boxShadow: "0 8px 15px rgba(0,0,0,0.3)",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-10px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ marginBottom: "15px", color: "#ffcc00" }}>
              {element.icon}
            </div>
            <div>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0" }}>
                {element.title}
              </p>
              <p style={{ fontSize: "16px", color: "#aaa", marginTop: "5px" }}>
                {element.subTitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
