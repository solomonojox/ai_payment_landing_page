import React, { useEffect, useState } from "react";
import {
    Home,
    Users,
    User,
    UserPen,
    Settings,
    FileText,
    ChevronLeft,
    ChevronRight,
    Search,
    LogOut,
    Zap,
    MessagesSquare,
    Megaphone,
    NotebookPen,
    Flag,
    Book,
    CalendarCheck,
    HandCoins,
    ClipboardCheck,
    Computer,
    LibraryBig
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth";
// import { ProfileService } from "../services/profileService";
// import LogoutModal from "./modals/LogoutModal";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

interface MenuItem {
    icon: React.ElementType;
    label: string;
    path: string;
    roles: string[];
    badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed,
    setIsCollapsed,
    isSidebarOpen,
    toggleSidebar,
}) => {
    const location = useLocation();
    const [logoutModal, setLogoutModal] = useState<boolean>(false);
    const [logo, setLogo] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const base = user?.role

    const menuItems: MenuItem[] = [
        {
            icon: Home,
            label: "Dashboard",
            path: `/${base}/dashboard`,
            roles: ["admin", "superAdmin", "teacher", "student", "guardian"],
        },
        {
            icon: UserPen,
            label: "Admins",
            path: `/${base}/admins`,
            roles: ["superAdmin"],
        },
        {
            icon: UserPen,
            label: "Teachers",
            path: `/${base}/teachers`,
            roles: ["admin", "superAdmin"],
        },
        {
            icon: User,
            label: "Students",
            path: `/${base}/students`,
            roles: ["admin", "superAdmin", "teacher", "guardian"],
        },
        {
            icon: Users,
            label: "Guardians",
            path: `/${base}/guardians`,
            roles: ["admin", "superAdmin"],
        },
        {
            icon: NotebookPen,
            label: "Records",
            path: `/${base}/records`,
            roles: ["admin", "superAdmin", "teacher", "student", "guardian"],
        },
        {
            icon: Book,
            label: "Assignment",
            path: `/${base}/assignments`,
            roles: ["admin", "superAdmin", "teacher", "student"],
        },
        {
            icon: Computer,
            label: "CBT",
            path: `/${base}/cbt`,
            roles: ["admin", "superAdmin", "teacher", "student"],
        },
        {
            icon: LibraryBig,
            label: "Library",
            path: `/${base}/library`,
            roles: ["admin", "superAdmin", "teacher", "student"],
        },
        {
            icon: ClipboardCheck,
            label: "Attendance",
            path: `/${base}/attendance`,
            roles: ["admin", "superAdmin", "teacher"],
        },
        {
            icon: HandCoins,
            label: "Payment",
            path: `/${base}/payments`,
            roles: ["admin", "superAdmin", "student", "guardian"],
        },
        {
            icon: CalendarCheck,
            label: "Events",
            path: `/${base}/events`,
            roles: ["admin", "superAdmin"],
        },
        {
            icon: Flag,
            label: "Reports",
            path: `/${base}/reports`,
            roles: ["admin", "superAdmin", "teacher", "student", "guardian"],
        },
        {
            icon: MessagesSquare,
            label: "Chats",
            path: `/${base}/chats`,
            roles: ["admin", "superAdmin", "teacher", "student", "guardian"],
        },
        {
            icon: Megaphone,
            label: "Announcements",
            path: `/${base}/announcements`,
            roles: ["admin", "superAdmin"],
        },
        {
            icon: FileText,
            label: "Logs",
            path: `/${base}/logs`,
            roles: ["admin", "superAdmin"],
        },
        {
            icon: Settings,
            label: "Administration",
            path: `/${base}/administration`,
            roles: ["admin", "superAdmin"],
        },
    ];

    const filteredMenuItems = menuItems.filter((item) => {
        if (user?.role && item.roles.includes(user.role)) {
            return item;
        }
    });

    // useEffect(() => {
    //     fetschoolData();
    // }, []);

    // const fetschoolData = async () => {
    //     try {
    //         const response = await ProfileService.getSchoolData();
    //         setLogo(response.logo);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const renderMenuItems = () => (
        <ul className="space-y-2">
            {filteredMenuItems?.map((item) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                    <li key={item.label}>
                        <Link
                            to={item.path}
                            className={`w-full flex items-center px-2.5 py-2 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-primary text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"
                                    } transition-transform group-hover:scale-110`}
                            />

                            {!isCollapsed && (
                                <>
                                    <span className="font-medium">{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[1.25rem] text-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}

                            {isCollapsed && (
                                <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
    const mobileRenderMenuItems = () => (
        <ul className="space-y-2">
            {filteredMenuItems?.map((item) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                    <li key={item.label}>
                        <Link
                            to={item.path}
                            onClick={toggleSidebar}
                            className={`w-full flex items-center px-2.5 py-2 rounded-xl transition-all duration-200 group relative ${isActive
                                ? "bg-primary text-white shadow-lg shadow-blue-500/20"
                                : "text-slate-300 hover:bg-slate-700 hover:text-white"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"
                                    } transition-transform group-hover:scale-110`}
                            />

                            {!isCollapsed && (
                                <>
                                    <span className="font-medium">{item.label}</span>
                                    {item.badge && (
                                        <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[1.25rem] text-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}

                            {isCollapsed && (
                                <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );

    const SidebarContent = () => (
        <div
            className={`z-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out flex flex-col h-screen fixed ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Header */}
            <div className="py-4 px-2 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    <div
                        className={`flex items-center space-x-3 ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <div className="w-8 h-8 bg-white shrink-0 rounded-full p-0.5 flex items-center justify-center overflow-hidden">
                            {/* <Zap className="w-5 h-5 text-white" /> */}
                            <img src={logo} alt="" className="object-cover h-full w-full" />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-md font-bold bg-white bg-clip-text text-transparent">
                                    {user?.schoolName}
                                </h1>
                                <p className="text-xs text-slate-400">
                                    {user?.role
                                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                                        : ""} panel
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            {!isCollapsed && (
                <div className="p-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Scrollable Navigation */}
            <div
                className="flex-1 overflow-y-auto px-3.5 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <nav>{renderMenuItems()}</nav>

                {/* Logout */}
                <div className="mt-auto">
                    <button
                        onClick={() => setLogoutModal(true)}
                        className="w-full flex items-center px-3 py-2 mt-1 rounded-xl text-left text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 group relative"
                    >
                        <LogOut
                            className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"
                                } transition-transform group-hover:scale-110`}
                        />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                        {isCollapsed && (
                            <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* User Profile */}
            <div className="px-4 border-t border-slate-700/50">
                <div
                    className={`flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 ${isCollapsed ? "justify-center" : ""
                        }`}
                >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center cursor-pointer overflow-hidden" onClick={() => navigate(`/${user?.role}/profile`)}>
                        <img src={user?.profilePic} alt="" className="object-cover w-full h-full" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate cursor-pointer" onClick={() => navigate(`/${user?.role}/profile`)}>{user?.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const MobileSidebarContent = () => (
        <div
            className={`z-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 ease-in-out flex flex-col h-[100dvh] fixed ${isCollapsed ? "w-16" : "w-64"
                }`}
        >
            {/* Header */}
            <div className="py-4 px-2 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                    <div
                        className={`flex items-center space-x-3 ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <div className="w-8 h-8 bg-white shrink-0 rounded-full p-0.5 flex items-center justify-center overflow-hidden">
                            {/* <Zap className="w-5 h-5 text-white" /> */}
                            <img src={logo} alt="" className="object-cover h-full w-full" />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-md font-bold bg-white bg-clip-text text-transparent">
                                    {user?.schoolName}
                                </h1>
                                <p className="text-xs text-slate-400">
                                    {user?.role
                                        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                                        : ""} panel
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            {!isCollapsed && (
                <div className="p-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            )}

            {/* Scrollable Navigation */}
            <div
                className="flex-1 overflow-y-auto px-3.5 pb-4 scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <nav>{mobileRenderMenuItems()}</nav>

                {/* Logout */}
                <div className="mt-auto">
                    <button
                        onClick={() => setLogoutModal(true)}
                        className="w-full flex items-center px-3 py-2 mt-1 rounded-xl text-left text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 group relative"
                    >
                        <LogOut
                            className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"
                                } transition-transform group-hover:scale-110`}
                        />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                        {isCollapsed && (
                            <div className="absolute left-16 bg-slate-800 text-white px-2 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* User Profile */}
            <div className="px-4 border-t border-slate-700/50">
                <div
                    className={`flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 ${isCollapsed ? "justify-center" : ""
                        }`}
                >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center cursor-pointer overflow-hidden" onClick={() => navigate(`/${user?.role}/profile`)}>
                        <img src={user?.profilePic} alt="" className="object-cover w-full h-full" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate cursor-pointer" onClick={() => navigate(`/${user?.role}/profile`)}>{user?.fullName}</p>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex z-20">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed z-40 lg:hidden transition-opacity ${isSidebarOpen ? "opacity-100 visible" : "opacity-50 invisible"
                    }`}
            >
                <MobileSidebarContent />
                <div
                    className={`fixed h-screen w-full bg-black/50 z-0 lg:hidden transition-opacity ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible z-0"
                        }`}
                    onClick={toggleSidebar}
                ></div>
            </div>

            {/* <LogoutModal
                onCancel={() => setLogoutModal(false)}
                isOpen={logoutModal}
            /> */}
        </div>
    );
};

export default Sidebar;
