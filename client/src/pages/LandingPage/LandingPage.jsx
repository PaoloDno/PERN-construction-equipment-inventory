import React from "react";
import { Link } from "react-router-dom";
import { FaDoorOpen, FaLocationArrow, FaTools, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const cardsDets = {
    visitor: [
      {
        icon: <FaDoorOpen size={30} />,
        title: "Login",
        text: "Sign in securely to access the inventory system.",
        to: "/login",
      },
      {
        icon: <FaUser size={30} />,
        title: "Sign Up",
        text: "Create an account to get started.",
        to: "/register",
      },
      {
        icon: <FaTools size={30} />,
        title: "Equipment",
        text: "Explore the equipment management system.",
        to: "/login",
      },
      {
        icon: <FaLocationArrow size={30} />,
        title: "Projects",
        text: "Explore the construction project management system.",
        to: "/login",
      },
    ],

    user: [
      {
        icon: <FaUser size={30} />,
        title: "Profile",
        text: "Manage your profile and account information.",
        to: "/profile",
      },
      {
        icon: <FaTools size={30} />,
        title: "Equipment",
        text: "Track, manage, and monitor construction equipment.",
        to: "/equipments",
      },
      {
        icon: <FaLocationArrow size={30} />,
        title: "Projects",
        text: "Organize and keep track of your construction projects.",
        to: "/projects",
      },
      {
        icon: <FaDoorOpen size={30} />,
        title: "Account",
        text: "Manage your account and authentication settings.",
        to: "/profile",
      },
    ],

    admin: [
      {
        icon: <FaUser size={30} />,
        title: "Users",
        text: "Manage users, roles, and account information.",
        to: "/users",
      },
      {
        icon: <FaTools size={30} />,
        title: "Equipment",
        text: "Manage equipment, conditions, and availability.",
        to: "/equipments",
      },
      {
        icon: <FaLocationArrow size={30} />,
        title: "Projects",
        text: "Manage projects and monitor equipment usage.",
        to: "/projects",
      },
      {
        icon: <FaDoorOpen size={30} />,
        title: "Administration",
        text: "Manage system settings and administrative functions.",
        to: "/admin",
      },
    ],
  };

  const { token, user } = useSelector((s) => s.auth);

  const mode = !token ? "visitor" : user?.role === "admin" ? "admin" : "user";

  const currentCards = cardsDets[mode];

  return (
    <div className="relative flex min-h-screen w-full flex-col p-4">
      {/* Gradient background */}
      <div className="fixed inset-0 -z-10 min-h-screen w-full bg-gradient-to-br from-blue-300/80 via-indigo-500 to-purple-600 opacity-70" />

      <section className="flex min-h-[40vh] w-full flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-4xl text-3xl font-bold font-heading md:text-5xl">
          WELCOME TO THE
          <br />
          INVENTORY MANAGEMENT SYSTEM
        </h1>

        <p className="mt-4 max-w-2xl text-gray-700">
          Manage equipment, projects, and users all in one place.
        </p>
      </section>

      {/* Main content */}
      <section className="flex flex-col z-20 w-full px-6 pb-12 items-center justify-center">
        <p className="text-center text-xl font-semibold">
          What do you wish to do?
        </p>

        {!token && (
          <div className="flex flex-col md:flex-row gap-2">
            <p className="mt-2 text-center text-lg text-gray-600">
              But first, please login or sign up.
            </p>
            <p className="mt-2 text-center text-lg text-gray-600 gap-6">
              Go to
              <Link
                className="rounded-xl p-2 font-bold w-16 bg-button items-center justify-center px-4 ml-4 mr-2"
                to={"/login"}
              >
                Login
              </Link>
              /
              <Link
                className="rounded-xl p-2 font-bold w-16 bg-button items-center justify-center px-4 ml-2"
                to={"/signup"}
              >
                SignUp
              </Link>
            </p>
          </div>
        )}

        {/* Cards */}
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {currentCards.map(({ icon, title, text, to }) => (
            <Link
              key={title}
              to={token ? to : "/login"}
              className="flex min-h-52 flex-col rounded-lg border bg-white/65 p-6 shadow transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:bg-white"
            >
              <div className="mb-4 flex justify-center text-blue-600">
                {icon}
              </div>

              <h2 className="mb-2 text-center text-lg font-bold">{title}</h2>

              <p className="text-center text-gray-600">{text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
