import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarClock,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  UserPlus,
  UserCog,
  Stethoscope,
  FolderSearch2,
  CalendarPlus,
  UserSquare,
  Search,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { BiCross } from "react-icons/bi";
import { LuCross } from "react-icons/lu";

const Sidebar = ({ isExpanded, toggleSidebar, role }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Menus for doctor and admin roles
  const doctorMenu = [
    {
      name: "Dashboard",
      path: "/doctor/dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      name: "My Appointments",
      path: "/doctor/appointments",
      icon: <CalendarClock className="w-6 h-6" />,
    },
    {
      name: "Patient Records",
      path: "/doctor/patients",
      icon: <FolderSearch2 className="w-6 h-6" />,
    },
    {
      name: "My Schedule",
      path: "/doctor/schedule",
      icon: <CalendarPlus className="w-6 h-6" />,
    },
    {
      name: "Settings",
      path: "/doctor/settings",
      icon: <Settings className="w-6 h-6" />,
    },
  ];

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      name: "Doctors",
      icon: <Stethoscope className="w-6 h-6" />,
      subItems: [
        {
          name: "Add Doctor",
          path: "/admin/doctors/add",
          icon: <UserPlus className="w-4 h-4" />,
        },
        {
          name: "Manage Doctors",
          path: "/admin/doctors/manage",
          icon: <UserCog className="w-4 h-4" />,
        },
      ],
    },
    {
      name: "Patients",
      path: "/admin/patients",
      icon: <Users className="w-6 h-6" />,
    },
    {
      name: "Appointments",
      path: "/admin/appointments",
      icon: <CalendarClock className="w-6 h-6" />,
    },
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings className="w-6 h-6" />,
    },
  ];

  const menuItems = role === "doctor" ? doctorMenu : adminMenu;

  // Dummy logout handler — replace with your actual logout logic
  const handleLogout = () => {
    // e.g. clear tokens, redirect to login
    alert("Logged out!");
  };

  return (
    <div
      className={`bg-white text-black h-screen fixed left-0 top-0 p-4 shadow-lg transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? "w-64" : "w-24"
      }`}
    >
      {/* Logo */}
      <Link
        to={menuItems[0]?.path || "/"}
        className="flex items-center justify-center mb-4"
        title="Home"
      >
        {isExpanded && (
          <h1 className="text-2xl font-bold inline-block ml-2">MedPortal</h1>
        )}
        {!isExpanded ? (
          <Menu className="w-8 h-8 text-black  " onClick={toggleSidebar} />
        ) : (
          <X className="w-8 h-8  ml-8 text-black" onClick={toggleSidebar} />
        )}
      </Link>

      {/* Navigation menu */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name} className="relative group">
              {item.subItems ? (
                <>
                  {/* Parent item button */}
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`flex items-center font-semibold ${
                      isExpanded ? "justify-between" : "justify-center"
                    } w-full p-2 rounded-md bg-[#F1F2F5] hover:bg-[#E5E5E5] transition-all`}
                    title={item.name}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {isExpanded && <span className="ml-2">{item.name}</span>}
                    </div>
                    {isExpanded && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown submenu */}
                  {openDropdown === item.name && (
                    <ul className="ml-4 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name} className="my-2">
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center w-full p-2 rounded-md transition-all  
                              ${
                                isActive
                                  ? "bg-black text-white"
                                  : "bg-[#F1F2F5] hover:bg-[#E5E5E5]"
                              } ${
                                isExpanded ? "justify-start" : "justify-center"
                              }`
                            }
                            title={subItem.name}
                          >
                            {subItem.icon}
                            {isExpanded && (
                              <span className="ml-2">{subItem.name}</span>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center ${
                      isExpanded ? "justify-start" : "justify-center"
                    } p-2 rounded-md transition-all ${
                      isActive ? "bg-black text-white" : "hover:bg-[#F1F2F5]"
                    }`
                  }
                  title={item.name}
                >
                  {item.icon}
                  {isExpanded && <span className="ml-2">{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className={`flex items-center p-2 rounded-lg hover:bg-[#F1F2F5] w-full transition-all ${
            isExpanded ? "justify-start" : "justify-center"
          }`}
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
          {isExpanded && <span className="ml-2">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
