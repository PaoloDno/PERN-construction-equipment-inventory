import React from "react";
import { FaDoorOpen, FaLocationArrow, FaTools, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = (props) => {
  
  const {token, user} = useSelector((s) => s.auth);
  console.log(user);
  if(!user) {
    return ;
  }
  return (
    <div className="relative flex flex-col w-screen min-h-screen py-4 px-2 overflow-hidden bg-background/40 gap-2">
      
      <div className="fixed inset-0 -z-10 min-h-screen w-full bg-gradient-to-br from-blue-300/80 via-indigo-500 to-purple-600 opacity-70" />

      <section className="flex w-full border-white/50 border-2 min-h-[10vh] rounded-md bg-gradient-to-br from-blue-400/40 via-indigo-500/30 to-blue-900/20 p-2">
        <h1 className="flex font-serif items-center justify-center text-3xl">
          Welcome back {`${user.username}`}!
        </h1>

        <div>
          <h3>Inventory Overview</h3>

        </div>

      </section>

      <section className="flex w-full border-white/50 border-2 min-h-[40vh] rounded-md bg-surface">
        <div>
        
        </div>  
      </section>
      
      <div className="flex w-full">

      </div>
      
    </div>
  );
};

export default HomePage;
