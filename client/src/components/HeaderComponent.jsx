import React from "react";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaMapPin,
  FaPen,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  const { token, profile } = useSelector((state) => state.auth);

  const navLinks = [
    { to: "/", label: "HOME", icon: <FaHome /> },
    { to: "/equipments", label: "EQUIPMENTS", icon: <FaTools /> },
    { to: "/projects", label: "PROJECTS", icon: <FaMapPin /> },
  ];

  const adminLinks = [
    { to: "/", label: "HOME", icon: <FaHome /> },
    { to: "/equipments", label: "EQUIPMENTS", icon: <FaTools /> },
    { to: "/projects", label: "PROJECTS", icon: <FaMapPin /> },
    { to: "/profiles", label: "USERS", icon: <FaUser /> },
  ];

  const authNavLinks = [
    { to: "/", label: "HOME", icon: <FaHome /> },
    { to: "/login", label: "LOGIN", icon: <FaUser /> },
    { to: "/signup", label: "SIGNUP", icon: <FaPen /> },
  ];

  const AuthButton = () => {
    let links = authNavLinks;

    if (token) {
      links = profile?.role === "admin" ? adminLinks : navLinks;
    }

    return (
      <div className="flex flex-row gap-2 object-center items-center">
        {links.map(({ to, label, icon }) => (
          <Link key={to} to={to} className="flex flex-row w-20 h-10 hover:bg-primary-hover bg-primary gap-1
            justify-center items-center hover:text-text-hover rounded-md p-2
          ">
            <span>{icon}</span>
            <span>{label}</span>
          </Link>
        ))}

        {token && (
          <button type="button">
            LOGOUT
          </button>
        )}
      </div>
    );
  };

  return (
    <header className="flex flex-row min-h-20 min-w-screen bg-primary">
      <div className="flex flex-row min-w-1/3 h-20 justify-center items-center mx-2">
        <p>INVENTORY MANGEMENT SYSTEM APP</p>
      </div>

      <AuthButton />
    </header>
  );
};

export default HeaderComponent;