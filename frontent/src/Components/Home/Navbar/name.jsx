import React from "react";
import { useNavigate } from "react-router-dom";

export const Name = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center pr-4">
      {/* Brand Logo */}
      <h1
        onClick={() => navigate("/home")}
        className="text-2xl font-bold text-white cursor-pointer select-none hover:opacity-90 transition-opacity"
      >
        SocialFirst
      </h1>
    </div>
  );
};