import React from "react";
import { Link, NavLink, Route, Router, useLocation } from "react-router-dom";
import { GoDashboard } from "react-icons/go";
import { RiMovie2Fill } from "react-icons/ri";
import { GiPaperBagFolded } from "react-icons/gi";
import { FaUserNinja } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks";

export default function Navbar() {
  const { handleLogout } = useAuth();
  const { pathname } = useLocation();

  return (
    <nav className="relative w-72 min-h-screen bg-secondary">
      <div className="flex flex-col justify-between pl-5 h-screen sticky top-0">
        <ul>
          <li className="mb-8">
            <Link to="/" className="flex items-center space-x-3 mt-5">
              <img className="h-12" src="logo_white.png" />
              <span className="text-2xl text-white ">Restaurant Name</span>
            </Link>
          </li>
          <li>
            <NavItem to="/">
              <GoDashboard color={pathname == '/' ? "#cc5200" : "#FDF2E9"} size={24} />
              <span>Dashboard</span>
            </NavItem>
          </li>
          {/* <li>
            <NavItem to="/actors">
              <GiPaperBagFolded color={pathname == '/actors' ? "#cc5200" : "#FDF2E9"} size={24} />
              <span>Staff</span>
            </NavItem>
          </li> */}
          <li>
            <NavItem to="/menu">
              <img className="h-6" src={pathname == '/menu' ? "menubook_2.png" : "menubook.png"} />
              <span>Menu Book</span>
            </NavItem>
          </li>
          <li>
            <NavItem to="/chef">
              <img className="h-6" src={pathname == '/chef' ? "chef_2.png" : "chef.png"} />
              <span>Chefs</span>
            </NavItem>
          </li>
          <li>
            <NavItem to="/delivery">
              <img className="h-6" src={pathname == '/delivery' ? "deliveryagent_2.png" : "deliveryagent.png"} />
              <span>Delivery Agents</span>
            </NavItem>
          </li>
        </ul>

        <div className="flex flex-col items-start pb-5">
          <span className="font-semibold text-white text-xl">Admin</span>
          <button
            onClick={handleLogout}
            className="flex items-center text-dark-subtle text-sm hover:text-white transition space-x-1"
          >
            <FiLogOut />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ children, to }) => {
  const commonClasses =
    " flex items-center text-lg space-x-2 p-4 ";
  return (
    <NavLink
      className={({ isActive }) =>
        (isActive ? " text-secondary bg-primary rounded-l-full" : "text-primary bg-secondary") + commonClasses
      }
      to={to}
    >
      {children}
    </NavLink>
  );
};
