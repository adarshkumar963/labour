import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null); // <-- added to track hover

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setIsAuthorized(true);
    }
  };

  const linkStyle = (index) => ({
    textDecoration: hoveredLink === index ? "underline" : "none",
    textDecorationColor: "red", // underline color red
    textUnderlineOffset: "6px", // pushes underline down cleanly
    color: "#ffffff", // text color always white
    fontWeight: "600",
    fontSize: "16px",
    padding: "8px 12px",
    transition: "all 0.3s ease",
    transform: hoveredLink === index ? "translateY(-2px)" : "translateY(0)",
    textShadow: hoveredLink === index ? "0 0 8px red" : "none",
    cursor: "pointer",
  });

  return (
    <nav
      style={{
        display: isAuthorized ? "block" : "none",
        backgroundColor: "black",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        padding: "10px 20px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ flex: "1" }}>
          <img
            src="https://res.cloudinary.com/dpa0sb1tm/image/upload/v1745864713/Screenshot_2025-04-28_235504_q4s7zq.png"
            alt="logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </div>

        {/* Menu Links */}
        <ul
          style={{
            listStyle: "none",
            display: show ? "block" : "flex",
            flex: "2",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
            padding: 0,
            margin: 0,
            textAlign: "right",
          }}
        >
          {[
            { to: "/", label: "HOME" },
            { to: "/job/getall", label: "ALL JOBS" },
            {
              to: "/applications/me",
              label:
                user && user.role === "Employer"
                  ? "APPLICANT'S APPLICATIONS"
                  : "MY APPLICATIONS",
            },
            ...(user && user.role === "Employer"
              ? [
                  { to: "/job/post", label: "POST NEW JOB" },
                  { to: "/job/me", label: "VIEW YOUR JOBS" },
                ]
              : []),
          ].map((item, index) => (
            <li
              key={index}
              style={{ display: "inline-block", margin: "0 5px" }}
            >
              <Link
                to={item.to}
                onClick={() => setShow(false)}
                style={linkStyle(index)}
                onMouseEnter={() => setHoveredLink(index)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {/* Logout Button */}
          <li style={{ display: "inline-block", margin: "0 5px" }}>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ff4d4d",
                color: "#ffffff",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e60000")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff4d4d")}
            >
              LOGOUT
            </button>
          </li>
        </ul>

        {/* Hamburger Icon */}
        <div
          style={{
            display: "none", // currently hidden
            cursor: "pointer",
            marginLeft: "20px",
          }}
        >
          <GiHamburgerMenu
            onClick={() => setShow(!show)}
            size={24}
            color="white"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
