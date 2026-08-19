import React from "react";
import { FaDoorOpen, FaLocationArrow, FaTools, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomePage = (props) => {
  const cardsDets = [
    {
      icon: <FaUser size={30} />,
      title: "Users",
      text: "User-friendly profile management",
      to: "/profile",
    },
    {
      icon: <FaTools size={30} />,
      title: "Equipments",
      text: "Manage and keep track of equipment in real time",
      to: "/equipments",
    },
    {
      icon: <FaLocationArrow size={30} />,
      title: "Projects",
      text: "Real-time tracking of construction projects",
      to: "/projects",
    },
    {
      icon: <FaDoorOpen size={30} />,
      title: "Authentication",
      text: "Already have an account? Login",
      to: "/login",
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen p-4">
      HOMEPAGE
      <div className="flex flex-col"></div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cardsDets.map(({ icon, title, text, to }) => (
            <Link
              key={title}
              to={to}
              className="rounded-lg border bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex justify-center text-blue-600">
                {icon}
              </div>

              <h2 className="mb-2 text-center text-lg font-bold">
                {title}
              </h2>

              <p className="text-center text-gray-600">
                {text}
              </p>
            </Link>
          ))}
        </div>
    </div>
  );
};

export default HomePage;
