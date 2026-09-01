import React, { useEffect, useState } from "react";
import {
  FaArrowCircleUp,
  FaDoorOpen,
  FaLocationArrow,
  FaLongArrowAltRight,
  FaRegArrowAltCircleRight,
  FaRegCaretSquareDown,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getDashBoardAction } from "../../store/actions/AuthThunks";
import EquipmentActivityCard from "../../components/cards/EquipmentActivityCard";

const HomePage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user, dashboard } = useSelector((s) => s.auth);
  console.log(user);
  if (!user) {
    return;
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    dispatch(getDashBoardAction());
  }, [dispatch]);

  console.log("Dashboard", dashboard);
  return (
    <div className="relative flex flex-col w-full min-h-screen py-4 px-2 overflow-hidden bg-gradient-to-br from-blue-950/70  via-indigo-500/90 to-black gap-2">
      <section className="flex flex-col shadow-2xl items-start justify-center z-20 w-full border-white/50 border-2 min-h-[10vh] rounded-md bg-primary/90 p-2 gap-4">
        <h1 className="flex font-serif items-center justify-start text-xl md:text-3xl w-full">
          Welcome back {`${user.username}`}!
        </h1>
      </section>

      <div className="flex flex-col md:flex-row lg:w-2/3 gap-2">
        <section className="flex flex-col shadow-2xl z-20 w-full border-white/50 border-2 min-h-[10vh] rounded-md bg-primary/80 p-2 gap-4 pb-6">
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="flex flex-row w-full justify-between items-center p-2">
              <h3 className="mb-2">Equipments Overview</h3>
              <Link
                to={"/equipments"}
                className="flex gap-2 min-w-1/3 w-[130px] mx-2 p-1 px-3 items-center justify-center rounded-xl bg-success shadow-2xl"
              >
                Equipments <FaLongArrowAltRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full text-md">
              {dashboard?.equipmentsCount &&
                Object.entries(dashboard.equipmentsCount).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-row gap-2 items-center justify-start rounded-md bg-white/70 shadow p-1 md:pl-2"
                    >
                      <span className="text-gray-600 capitalize text-[12px]">
                        {key} Equipment
                      </span>
                      <span className="font-bold">{value}</span>
                    </div>
                  ),
                )}
            </div>
          </div>
        </section>

        <section className="flex flex-col shadow-2xl z-20 w-full border-white/50 border-2 min-h-[10vh] rounded-md bg-primary/80 p-2 gap-4 pb-6">
          <div className="flex flex-col items-start justify-center">
            <div className="flex flex-row w-full justify-between items-center p-2">
              <h3 className="mb-2">Projects Overview</h3>
              <Link
                to={"/projects"}
                className="flex gap-2 min-w-1/3 w-[130px] mx-2 p-1 px-3 items-center justify-center rounded-xl bg-success shadow-2xl"
              >
                Projects <FaLongArrowAltRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full text-md">
              {dashboard?.projectsCount &&
                Object.entries(dashboard.projectsCount).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-row gap-2 items-center justify-start rounded-md bg-white/70 shadow p-1 md:pl-2"
                  >
                    <span className="text-gray-600 capitalize text-[12px]">
                      {key} Project
                    </span>
                    <span className="font-bold">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
      <section className="flex flex-col shadow-2xl z-20 w-full border-white/50 border-2 min-h-[10vh] rounded-md bg-primary/80 p-2 gap-4 pb-6">
        <h3 className="mb-2">Recent Equipments Activity</h3>
        <div>
          {dashboard?.equipments?.length === 0 ? (
            <p className="text-center text-gray-500">
              No recent equipment found.
            </p>
          ) : (
            <div className="grid grid-cols-1 w-full gap-4 sm:grid-cols-2 lg:flex lg:flex-row overflow-x-auto p-2">
              {dashboard?.equipments?.map((equipment, index) => (
                <EquipmentActivityCard key={index} equipment={equipment} />
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="flex w-full"></div>
    </div>
  );
};

export default HomePage;
