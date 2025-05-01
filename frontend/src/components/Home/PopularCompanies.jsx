import React from "react";
import { FaMicrosoft, FaApple } from "react-icons/fa";
import { SiTesla } from "react-icons/si";
import { SiRelianceindustrieslimited } from "react-icons/si";
import { SiTata } from "react-icons/si";

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Reliancee Infrastrucute Ltd.",
      location: "Navi Mumbai, Maharashtra, India",
      openPositions: 10,
      icon: <SiRelianceindustrieslimited />,
    },
    {
      id: 2,
      title: "Tata Projects Limited",
      location: "Mumbai, Maharashtra, India",
      openPositions: 5,
      icon: <SiTata />,
    },
    {
      id: 3,
      title: "Adani Constructions",
      location: "Hyderabad, Telangana, India",
      openPositions: 20,
      icon: <FaApple />,
    },
  ];
  return (
    <div className="companies">
      <div className="container">
        <h3>TOP CONSTRUCTION COMPANIES</h3>
        <div className="banner">
          {companies.map((element) => {
            return (
              <div className="card" key={element.id}>
                <div className="content">
                  <div className="icon">{element.icon}</div>
                  <div className="text">
                    <p>{element.title}</p>
                    <p>{element.location}</p>
                  </div>
                </div>
                <button>Jobs Available {element.openPositions}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
