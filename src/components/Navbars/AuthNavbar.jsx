import AuthDropDown from "../Dropdowns/AuthDropdown";
import { useState } from "react";
import logo from '../../assets/images/logo.png'


export default function Navbar({isOpen, popupType, togglePopup}) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  return (
    <>
      <nav className="sticky bg-slate-100 top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg">
        <div className="container h-16 px-4 mx-auto flex flex-wrap items-center content-center justify-between my-auto">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a href="/"
                className="text-emerald-800 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
              >
                <img className="w-32 h-auto" src={logo} alt="Logo" />
            </a>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-emerald-800 block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="text-emerald-800 fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block rounded shadow-lg" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none mr-auto">
              <li className="flex items-center">
                <a href="/#about" className="lg:text-emerald-800 lg:hover:text-slate-600 text-emerald-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">About</a>
              </li>
              <li className="flex items-center">
                <a href="/#services" className="lg:text-emerald-800 lg:hover:text-slate-600 text-emerald-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">Services</a>
              </li>
              <li className="flex items-center">
                <a href="/#contact" className="lg:text-emerald-800 lg:hover:text-slate-600 text-emerald-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">Contact</a>
              </li>
              <li className="flex items-center">
                <a href="/#contact" className="lg:text-emerald-800 lg:hover:text-slate-600 text-emerald-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold">FAQs</a>
              </li>
            </ul>
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="flex items-center">
                <a
                  className="lg:text-emerald-800 lg:hover:text-slate-600 text-emerald-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-nextjs%2F"
                  target="_blank"
                >
                  <i className="lg:text-emerald-800 text-slate-400 fab fa-facebook text-lg leading-lg " />
                  <span className="lg:hidden inline-block ml-2">Share</span>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  className="lg:text-emerald-800 lg:hover:text-slate-600 text-emerald-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fdemos.creative-tim.com%2Fnotus-nextjs%2F&text=Start%20your%20development%20with%20a%20Free%20Tailwind%20CSS%20and%20NextJS%20UI%20Kit%20and%20Admin.%20Let%20Notus%20NextJS%20amaze%20you%20with%20its%20cool%20features%20and%20build%20tools%20and%20get%20your%20project%20to%20a%20whole%20new%20level."
                  target="_blank"
                >
                  <i className="lg:text-emerald-800 text-slate-400 fab fa-twitter text-lg leading-lg " />
                  <span className="lg:hidden inline-block ml-2">Tweet</span>
                </a>
              </li>

              <li className="flex items-center">
                <a
                  className="lg:text-emerald-800 lg:hover:text-slate-600 text-emerald-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                  href="https://instagram.com/creativetimofficial/notus-nextjs?ref=nnjs-auth-navbar"
                  target="_blank"
                >
                  <i className="lg:text-emerald-800 text-slate-400 fab fa-instagram text-lg leading-lg " />
                  <span className="lg:hidden inline-block ml-2">Star</span>
                </a>
              </li>
              <li className="flex items-center">
                <AuthDropDown isOpen={isOpen} popupType={popupType} togglePopup={togglePopup} />
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
