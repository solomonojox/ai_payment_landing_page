import React, { useState } from 'react';
import {
    Search,
    Bell,
    MessageSquare,
    Settings,
    User,
    ChevronDown,
    Moon,
    Sun,
    Globe,
    LogOut,
    UserCircle,
    CreditCard,
    HelpCircle,
    Menu
} from 'lucide-react';

interface NavbarProps {
    sidebarCollapsed?: boolean;
    onMenuClick?: () => void;
}

const Navbar2: React.FC<NavbarProps> = ({ onMenuClick }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const notifications = [
        {
            id: 1,
            title: "New user registered",
            message: "John Smith joined your team",
            time: "2 min ago",
            unread: true
        },
        {
            id: 2,
            title: "Project completed",
            message: "Website redesign project finished",
            time: "1 hour ago",
            unread: true
        },
        {
            id: 3,
            title: "Payment received",
            message: "$2,500 payment from client",
            time: "3 hours ago",
            unread: false
        }
    ];

    const profileMenuItems = [
        { icon: UserCircle, label: 'Profile', action: () => console.log('Profile') },
        { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
        { icon: CreditCard, label: 'Billing', action: () => console.log('Billing') },
        { icon: HelpCircle, label: 'Help', action: () => console.log('Help') },
        { icon: LogOut, label: 'Logout', action: () => console.log('Logout') },
    ];

    return (
        <nav
            className={`bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 transition-all duration-300 `}
        >
            <div className="flex items-center justify-between">

                {/* Left Section */}
                <div className="flex items-center space-x-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>

                    {/* Page Title & Breadcrumb */}
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                            <span>Home</span>
                            <span>/</span>
                            <span className="text-blue-600 font-medium">Dashboard</span>
                        </div>
                    </div>
                </div>

                {/* Center Section - Search */}
                <div className="hidden md:flex flex-1 max-w-lg mx-8">
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:bg-white"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <kbd className="px-2 py-1 text-xs bg-slate-200 text-slate-500 rounded font-mono">⌘K</kbd>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-2">

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors group"
                        title="Toggle theme"
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                        )}
                    </button>

                    {/* Language Selector */}
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors group" title="Language">
                        <Globe className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                    </button>

                    {/* Messages */}
                    <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors group relative" title="Messages">
                        <MessageSquare className="w-5 h-5 text-slate-600 group-hover:text-green-500 transition-colors" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors group relative"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                2
                            </span>
                        </button>

                        {/* Notifications Dropdown */}
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                                    <p className="text-sm text-slate-500">You have 2 unread messages</p>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${notification.unread ? 'bg-blue-50/50' : ''
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-slate-300'
                                                    }`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-slate-900 text-sm">{notification.title}</p>
                                                    <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                                                    <p className="text-xs text-slate-400 mt-2">{notification.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 border-t border-slate-100">
                                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="w-px h-8 bg-slate-200 mx-2"></div>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-colors group"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-slate-900">John Doe</p>
                                <p className="text-xs text-slate-500">Administrator</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                                <div className="p-4 border-b border-slate-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">John Doe</p>
                                            <p className="text-sm text-slate-500">john@example.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-2">
                                    {profileMenuItems.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={item.action}
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-slate-50 transition-colors group"
                                        >
                                            <item.icon className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
                                            <span className="text-sm text-slate-700 group-hover:text-slate-900">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside handlers */}
            {(isProfileOpen || isNotificationsOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsProfileOpen(false);
                        setIsNotificationsOpen(false);
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar2;