import React from "react";
import logo from "../../assets/images/logo.png";

import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";

export const AuthModal = ({ isOpen, togglePopup, popupType }) => {
  if (!isOpen) return null;

  const handleSwitch = (switchTo) => {
    togglePopup(switchTo);
  };

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="relative mx-auto px-20 py-6 shadow-lg rounded-2xl bg-white w-1/2">

        {/* Close Button */}
        <button
          onClick={() => togglePopup("")}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 bg-gray-200 rounded-full text-xl"
        >
          &times;
        </button>

        {/* Logo */}
        <img className="w-24 mx-auto mb-2" src={logo} alt="Logo" />

        {/* Subtitle */}
        <p className="text-emerald-700 text-center text-lg font-bold mb-4">
          Join businesses and individuals across Kenya already partnering with us
        </p>

        {/* Conditional Forms */}
        {popupType === "register" ? (
          <RegistrationForm handleSwitch={handleSwitch} />
        ) : (
          <LoginForm handleSwitch={handleSwitch} />
        )}
      </div>
    </div>
  );
};
