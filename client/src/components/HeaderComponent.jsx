import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaGoogleDrive,
  FaHamburger,
  FaHome,
  FaMapPin,
  FaPen,
  FaTimes,
  FaTools,
  FaUser,
} from "react-icons/fa";
import {} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAction } from "../store/reducers/AuthReducers";

const HeaderComponent = () => {
  const { pathname } = useLocation();
  // scroll to top every nav change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [mobileNav, setMobileNav] = useState(false);

  const navLinks = [
    { to: "/", label: "IMS", icon: <FaGoogleDrive /> },
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
    { to: "/", label: "IMS", icon: <FaGoogleDrive /> },
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
      links = user?.role === "admin" ? adminLinks : navLinks;
    }

    return (
      <div className="flex flex-row z-30 gap-3 object-center justify-end w-1/3 md:w-full items-center bg-primary pr-4 md:pr-8 px-2 font-heading">
        <div className="hidden lg:flex flex-row gap-3 object-center justify-end w-full items-center pr-4 md:pr-8 text-[14px]">
          {links.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-row w-42 border-2 border-white/5 h-10 hover:bg-primary-hover hover:text-white bg-white/15 gap-2
              justify-center items-center  rounded-md p-2 transition-all duration-700
            "
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}

          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="h-10 w-24 rounded-md bg-warning px-3 hover:bg-red-600 hover:text-white transition-all duration-700 p-2"
            >
              LOGOUT
            </button>
          )}
        </div>
        <div className="flex w-full justify-end lg:hidden">
          <FaHamburger size={30} onClick={() => setMobileNav(true)} />
        </div>
        {mobileNav && (
          <div className="fixed inset-0 z-50 bg-black/60">
            <div
              className="
                absolute right-0 top-0
                h-full w-72
                bg-slate-700/95
                shadow-xl
                translate-x-0
                animate-[slideIn_0.75s_ease-out]
              "
            >
              <div className="flex justify-end p-4 ">
                <button onClick={() => setMobileNav(false)} className="bg-warning p-2 rounded-full">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2 p-2 pr-4 ">
                {links.map(({ to, label, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileNav(false)}
                    className="flex w-full items-center bg-white/90 gap-3 
                    rounded-md p-3 hover:bg-gray-100"
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                ))}

                {token && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full 
                    rounded-md bg-warning p-3 hover:bg-red-600"
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
    <header className="flex flex-row z-30 px-2 min-h-20 min-w-screen bg-primary">
      <div
        className="flex flex-row lg:min-w-1/3 h-20 justify-center cursor-pointer items-center mx-2 gap-2"
        onClick={() => navigate("/")}
      >
        <FaGoogleDrive size={32} /> <p>INVENTORY MANGEMENT SYSTEM APP</p>
      </div>

      <AuthButton />
    </header>
  );
};

export default HeaderComponent;
