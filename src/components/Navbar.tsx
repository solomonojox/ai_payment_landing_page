import React, { useState } from 'react';
import {
    Bell,
    MessageSquare,
    Moon,
    Sun,
    Globe,
    Menu,
    Check,
    Loader
} from 'lucide-react';
import { useAuth } from '../context/auth/useAuth';
import { useNotifications } from '../context/notification/useNotifications';
import { useLocation } from 'react-router-dom';
import type { Notification } from '../types/notificationType';
import { useTheme } from '../context/Theme/useTheme';

interface NavbarProps {
    sidebarCollapsed?: boolean;
    toggleSidebar?: () => void;
    setSelectedNotification: (notification: Notification) => void;
    setOpen: (open: boolean) => void
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, setSelectedNotification, setOpen }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isMessagesOpen, setIsMessagesOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { user } = useAuth();
    const { notifications, unreadCount, markAsRead, isLoading } = useNotifications();
    const { theme, toggleTheme } = useTheme();

    const location = useLocation();
    const navpath = location.pathname;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return date.toLocaleDateString();
    };

    const handleNotificationClick = async (notificationId: string) => {
        await markAsRead(notificationId);
        setIsNotificationsOpen(false);
        // You can add navigation logic here based on notification type
    };

    const markAllAsRead = async () => {
        const unreadNotifications = notifications.filter(notif => notif.unread);
        for (const notif of unreadNotifications) {
            await markAsRead(notif._id);
        }
    };

    const handleNotificationButtonClick = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
        setIsMessagesOpen(false);
    };

    const handleMessagesButtonClick = () => {
        setIsMessagesOpen(!isMessagesOpen);
        setIsNotificationsOpen(false);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-2 lg:px-4 py-3 transition-all duration-300">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center space-x-3 md:space-x-4">
                    {/* Mobile menu button */}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Menu className="w-5 h-5 text-slate-600" />
                    </button>

                    {/* Page Title & Breadcrumb */}
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                            <span>
                                {user?.role
                                    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                                    : ""}
                            </span>
                            {navpath.split("/").length > 2 && (
                                <>
                                    <span>/</span>
                                    <span className="text-primary font-medium">
                                        {navpath
                                            .split("/")
                                            .slice(2)
                                            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                                            .join(" / ")
                                        }
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-1 md:space-x-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => { setIsDarkMode(!isDarkMode); toggleTheme() }}
                        aria-label="Toggle theme"
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors group"
                        title="Toggle theme"
                    >
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-slate-600 group-hover:text-amber-500 transition-colors" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                        )}
                    </button>

                    {/* Language Selector */}
                    {/* <button
                        className="p-1 rounded-xl hover:bg-slate-100 transition-colors group"
                        title="Language"
                    >
                        <Globe className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                    </button> */}

                    {/* Messages 
                    <div className="relative">
                        <button
                            onClick={handleMessagesButtonClick}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors group relative"
                            title="Messages"
                        >
                            <MessageSquare className="w-5 h-5 text-slate-600 group-hover:text-green-500 transition-colors" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                                3
                            </span>
                        </button>

                        {isMessagesOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                                <div className="p-4 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-900">Messages</h3>
                                    <p className="text-sm text-slate-500">Your recent conversations</p>
                                </div>
                                <div className="p-4 text-center text-slate-500">
                                    <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                                    <p>No new messages</p>
                                </div>
                                <div className="p-3 border-t border-slate-100">
                                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View all messages
                                    </button>
                                </div>
                            </div>
                        )}
                    </div> */}

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={handleNotificationButtonClick}
                            className="p-2 rounded-xl hover:bg-slate-100 transition-colors group relative"
                            title="Notifications"
                        >
                            <Bell className="w-5 h-5 text-slate-600 group-hover:text-blue-500 transition-colors" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {isNotificationsOpen && (
                            <div className="absolute right-0 mt-2 w-84 md:w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50">
                                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Notifications</h3>
                                        <p className="text-sm text-slate-500">
                                            {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
                                        </p>
                                    </div>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
                                        >
                                            <Check className="w-3 h-3 mr-1" />
                                            Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-6 text-center text-slate-500">
                                            <Loader className="w-6 h-6 animate-spin mx-auto mb-2" />
                                            <p>Loading notifications...</p>
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-6 text-center text-slate-500">
                                            <Bell className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                                            <p>No notifications yet</p>
                                            <p className="text-sm mt-1">You're all caught up!</p>
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <div
                                                key={notification._id}
                                                onClick={() => { handleNotificationClick(notification._id); setSelectedNotification(notification); setOpen(true); }}
                                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${notification.unread ? "bg-blue-50/50" : ""
                                                    }`}
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.unread ? "bg-blue-500" : "bg-slate-300"
                                                            }`}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <p className="font-medium text-slate-900 text-sm">
                                                                {notification.title}
                                                            </p>
                                                            {notification.type === 'direct' && (
                                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full whitespace-nowrap ml-2">
                                                                    Direct
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <p className="text-xs text-slate-400">
                                                                {formatTime(notification.createdAt)}
                                                            </p>
                                                            {notification.sender && (
                                                                <p className="text-xs text-slate-500">
                                                                    From: {notification.sender.fullName}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {/* <div className="p-3 border-t border-slate-100">
                                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 rounded-md hover:bg-blue-50 transition-colors">
                                        View all notifications
                                    </button>
                                </div> */}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside handlers */}
            {(isNotificationsOpen || isMessagesOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setIsNotificationsOpen(false);
                        setIsMessagesOpen(false);
                    }}
                />
            )}
        </nav>
    );
};

export default Navbar;