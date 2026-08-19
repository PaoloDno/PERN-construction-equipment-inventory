import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaHamburger,
  FaHome,
  FaMapPin,
  FaPen,
  FaTimes,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { logoutAction } from "../store/reducers/AuthReducers";

const HeaderComponent = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, profile } = useSelector((state) => state.auth);
  const [mobileNav, setMobileNav] = useState(false);

  const navLinks = [
    { to: "/home", label: "HOME", icon: <FaHome /> },
    { to: "/equipments", label: "EQUIPMENTS", icon: <FaTools /> },
    { to: "/projects", label: "PROJECTS", icon: <FaMapPin /> },
  ];

  const adminLinks = [
    { to: "/home", label: "HOME", icon: <FaHome /> },
    { to: "/equipments", label: "EQUIPMENTS", icon: <FaTools /> },
    { to: "/projects", label: "PROJECTS", icon: <FaMapPin /> },
    { to: "/profiles", label: "USERS", icon: <FaUser /> },
  ];

  const authNavLinks = [
    { to: "/home", label: "HOME", icon: <FaHome /> },
    { to: "/login", label: "LOGIN", icon: <FaUser /> },
    { to: "/signup", label: "SIGNUP", icon: <FaPen /> },
  ];

  const handleLogout = () => {
  dispatch(logoutAction());
  console.log("LOGOUT SUCCESSFUL");
  navigate("/");
};

  const AuthButton = () => {
    let links = authNavLinks;

    if (token) {
      links = profile?.role === "admin" ? adminLinks : navLinks;
    }

    return (
      <div className="flex flex-row gap-3 object-center justify-end w-full items-center bg-yellow-200/10 pr-4 md:pr-8">
        <div className="hidden md:flex flex-row gap-3 object-center justify-end w-full items-center bg-yellow-200/10 pr-4 md:pr-8">
          {links.map(({ to, label, icon }) => (
            <Link key={to} to={to} className="flex flex-row w-32 border-2 border-white/10 h-10 hover:bg-primary-hover bg-primary gap-2
              justify-center items-center hover:text-text-hover rounded-md p-2
            ">
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}

          {token && (
          <button
            type="button"
            onClick={handleLogout}
            className="h-10 rounded-md bg-warning px-3 hover:bg-red-600"
          >
            LOGOUT
          </button>
        )}
      </div>
      <div className="flex md:hidden">
        <FaHamburger size={30} onClick={() => setMobileNav(true)}/>
      </div>
      {mobileNav && (
        <div className="fixed inset-0 z-50 bg-black/60">
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileNav(false)}>
                <FaTimes size={24} />
              </button>
            </div>

            <div className="flex flex-col gap-3 p-4">
              {links.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileNav(false)}
                  className="flex items-center gap-3 rounded-md p-3 hover:bg-gray-100"
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              ))}

              {token && (
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-warning p-3 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      </div>
    );
  };

  return (
    <header className="flex flex-row min-h-20 min-w-screen bg-primary">
      <div className="flex flex-row min-w-1/3 h-20 justify-center items-center mx-2"
        onClick={() => navigate("/")}
      >
        <p>INVENTORY MANGEMENT SYSTEM APP</p>
      </div>

      <AuthButton />
    </header>
  );
};

export default HeaderComponent;