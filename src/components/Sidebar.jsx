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
  User,
  CalendarCheck2,
  FileBarChart2,
  DollarSign,
  Users2, // Added Users2, which was implicitly used
  FilePlus2, // Added FilePlus2, which was implicitly used
} from "lucide-react";
import { useState } from "react";
// Removed BiCross and LuCross as they were not used and were causing import issues.

const Sidebar = ({ isExpanded, toggleSidebar, role }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      name: "Patients",
      icon: <Users2 className="w-6 h-6" />,
      subMenu: [
        {
          name: "Add Patient",
          path: "/admin/patients/add",
          icon: <UserPlus className="w-5 h-5" />,
        },
        {
          name: "Manage Patients",
          path: "/admin/patients/manage",
          icon: <Users2 className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Doctors",
      icon: <Stethoscope className="w-6 h-6" />,
      subMenu: [
        {
          name: "Add Doctor",
          path: "/admin/doctors/add",
          icon: <FilePlus2 className="w-5 h-5" />,
        },
        {
          name: "Manage Doctors",
          path: "/admin/doctors/manage",
          icon: <Stethoscope className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Appointments",
      icon: <CalendarClock className="w-6 h-6" />,
      subMenu: [
        {
          name: "Book Appointment",
          path: "/admin/appointments/book",
          icon: <CalendarCheck2 className="w-5 h-5" />,
        },
        {
          name: "Manage Appointments",
          path: "/admin/appointments/manage",
          icon: <CalendarClock className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Reports",
      icon: <FileBarChart2 className="w-6 h-6" />,
      subMenu: [
        {
          name: "Patient Reports",
          path: "/admin/reports/patients",
          icon: <FileText className="w-5 h-5" />,
        },
        {
          name: "Doctor Reports",
          path: "/admin/reports/doctors",
          icon: <Stethoscope className="w-5 h-5" />,
        },
        {
          name: "Appointment Reports",
          path: "/admin/reports/appointments",
          icon: <CalendarClock className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Fees Payment",
      path: "/admin/fees",
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  const doctorMenu = [
    {
      name: "Dashboard",
      path: "/doctor/dashboard",
      icon: <LayoutDashboard className="w-6 h-6" />,
    },
    {
      name: "Appointments",
      icon: <CalendarClock className="w-6 h-6" />,
      subMenu: [
        {
          name: "View Appointments",
          path: "/doctor/appointments/view",
          icon: <CalendarCheck2 className="w-5 h-5" />,
        },
        {
          name: "Schedule Availability",
          path: "/doctor/appointments/schedule",
          icon: <CalendarPlus className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Patients",
      icon: <Users className="w-6 h-6" />,
      subMenu: [
        {
          name: "My Patients",
          path: "/doctor/patients/my-patients",
          icon: <UserSquare className="w-5 h-5" />,
        },
        {
          name: "Search Patients",
          path: "/doctor/patients/search",
          icon: <Search className="w-5 h-5" />,
        },
      ],
    },
    {
      name: "Reports",
      path: "/doctor/reports",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      name: "Profile Settings",
      path: "/doctor/settings",
      icon: <UserCog className="w-6 h-6" />,
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
          <h1 className="text-2xl font-bold inline-block ml-2">MedList</h1>
        )}
        {!isExpanded ? (
          <Menu className="w-8 h-8 text-black" onClick={toggleSidebar} />
        ) : (
          <X className="w-8 h-8 ml-12 text-black" onClick={toggleSidebar} />
        )}
      </Link>

      {/* Navigation menu */}
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name} className="relative group">
              {item.subMenu ? (
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
                      {item.subMenu.map((subItem) => (
                        <li key={subItem.name} className="my-2">
                          <NavLink
                            to={subItem.path}
                            className={({ isActive }) =>
                              `flex items-center w-full p-2 rounded-md transition-all ${
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
