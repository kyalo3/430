import React from "react";
import { createPopper } from "@popperjs/core";

const AuthDropDown = ({isOpen, popupType, togglePopup}) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-end",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  const handleSwitch = (switchTo) => {
    setDropdownPopoverShow(false);
    togglePopup(switchTo);
  }
  return (
    <>
      <button
        className="bg-slate-50 text-emerald-800 active:bg-slate-50 border-slate-100 border-1 text-l font-bold uppercase px-4 py-2 mb-4 rounded-full shadow-md hover:shadow-l outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
        type="button"
        ref={btnDropdownRef}
        onClick={() => {
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fa-solid fa-bars"></i>
        <i className="fa-solid fa-circle-user ml-2"></i>
      </button>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-slate-50  text-base z-50 float-right py-2 mt-2 list-none text-left rounded shadow-lg min-w-48"
        }
        style={{ marginTop: "8px" }} 
      >
        <span
          className={
            "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-slate-400"
          }
        >
        </span>
          <button
            onClick={() => handleSwitch('login')}
            className={
              "text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-emerald-800"
            }
          >
            Login
          </button>
          <button
            onClick={() => handleSwitch('register')}
            className={
              "text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-emerald-800"
            }
          >
            Register
          </button>
        <div className="h-0 mx-4 my-2 border border-solid border-slate-100" />
        <span
          className={
            "text-left text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-slate-400"
          }
        >
        </span>
          <button
            className={
              "text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-emerald-800"
            }
          >
            Donate Food Vouchers
          </button>
          <button
            className={
              "text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-emerald-800"
            }
          >
            Host a Food Drive
          </button>
        <div className="h-0 mx-4 my-2 border border-solid border-slate-100" />
        <span
          className={
            "text-left text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-slate-400"
          }
        >
        </span>
          <button
            className={
              "text-left text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-emerald-800"
            }
          >
            Help Center
          </button>
      </div>
    </>
  );
};

export default AuthDropDown;
