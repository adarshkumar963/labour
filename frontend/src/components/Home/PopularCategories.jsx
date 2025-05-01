import React from "react";
import {
  MdOutlineDesignServices,
  MdOutlineWebhook,
  MdAccountBalance,
  MdOutlineAnimation,
} from "react-icons/md";
import { TbAppsFilled } from "react-icons/tb";
import { FaReact } from "react-icons/fa";
import { GiArtificialIntelligence } from "react-icons/gi";
import { IoGameController } from "react-icons/io5";

const PopularCategories = () => {
  const categories = [
    {
      id: 1,
      title: "Skilled labour",
      subTitle: "305 Different Location",
      icon: <MdOutlineDesignServices />,
    },
    {
      id: 2,
      title: "Roofer",
      subTitle: "500 Different Location",
      icon: <TbAppsFilled />,
    },
    {
      id: 3,
      title: "Mason",
      subTitle: "200 Different Location",
      icon: <MdOutlineWebhook />,
    },
    {
      id: 4,
      title: "Carpenter",
      subTitle: "1000+ Different Location",
      icon: <FaReact />,
    },
    {
      id: 5,
      title: "Plumber",
      subTitle: "150 Different Location",
      icon: <MdAccountBalance />,
    },
    {
      id: 6,
      title: "Electrician",
      subTitle: "867 Different Location",
      icon: <GiArtificialIntelligence />,
    },
    {
      id: 7,
      title: "Painter",
      subTitle: "50 Different Location",
      icon: <MdOutlineAnimation />,
    },
    {
      id: 8,
      title: "Welder",
      subTitle: "80 Different Location",
      icon: <IoGameController />,
    },
  ];
  return (
    <div className="categories">
      <h3>POPULAR CATEGORIES</h3>
      <div className="banner">
        {categories.map((element) => {
          return (
            <div className="card" key={element.id}>
              <div className="icon">{element.icon}</div>
              <div className="text">
                <p>{element.title}</p>
                <p>{element.subTitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategories;
