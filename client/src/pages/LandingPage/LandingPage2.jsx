import React from "react";
import { Link } from "react-router-dom";
import {
  FaDoorOpen,
  FaLocationArrow,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const LandingPage = () => {
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

  const { token } = useSelector((s) => s.auth);

  return (
    <div className="flex min-h-screen w-full bg-primary">

      {/* LEFT SIDE */}
      <div className="relative flex w-1/2 min-h-screen items-center justify-center overflow-hidden">

        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600" />

        {/* Decorative circles */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-white/10" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-12 text-center">

          {/* Clipart / Photo */}
          <div className="mb-8 flex h-80 w-80 items-center justify-center rounded-3xl bg-white/20 p-6 shadow-2xl backdrop-blur-sm">
            <img
              src="/images/inventory-clipart.png"
              alt="Inventory management"
              className="h-full w-full object-contain"
            />
          </div>

          <h1 className="max-w-lg text-4xl font-bold font-heading text-white">
            Welcome to the Inventory Management System
          </h1>

          <p className="mt-4 max-w-md text-white/80">
            Manage your equipment, projects, and inventory efficiently in one
            place.
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-1/2 flex-col justify-center p-10">

        <p className="mb-8 text-center text-xl font-semibold">
          What do you wish to do?
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {cardsDets.map(({ icon, title, text, to }) => (
            <Link
              key={title}
              to={token ? to : "/login"}
              className="rounded-lg border bg-white p-6 shadow transition duration-200 hover:-translate-y-1 hover:shadow-lg"
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
    </div>
  );
};

export default LandingPage;