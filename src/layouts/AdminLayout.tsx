import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import NotificationModal from "../components/modals/NotificationModal";
// import type { Notification } from "../types/notificationType";
// import ChangePasswordPrompt from "../pages/Auth/ChangePasswordPrompt";
import { useAuth } from "../context/auth/useAuth";

const AdminLayout: React.FC = () => {
    const { user } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const [open, setOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification>({} as Notification);
    const [openChangePasswordWarningModal, setOpenChangePasswordWarningModal] = useState(false);
    useEffect(() => {
        if (user?.isVerified === false) {
            setOpenChangePasswordWarningModal(true);
        } else {
            setOpenChangePasswordWarningModal(false);
        }
    }, [user]);

    return (
        <div>
            {/* <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            /> */}

            <div
                className={`flex-1 transition-all duration-300 ease-in-out ${isCollapsed ? "lg:ml-16" : "lg:ml-64"
                    }`}
            >
                <div className="sticky top-0 z-10 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <Navbar
                        toggleSidebar={toggleSidebar}
                        setSelectedNotification={setSelectedNotification}
                        setOpen={setOpen}
                    />
                </div>

                <main className="px-2 lg:p-4">
                    <Outlet />
                </main>

                <NotificationModal
                    open={open}
                    setOpen={setOpen}
                    notification={selectedNotification}
                />

                {/* <ChangePasswordPrompt
                    open={openChangePasswordWarningModal}
                    onClose={() => setOpenChangePasswordWarningModal(false)}
                /> */}
            </div>
        </div>
    );
};

export default AdminLayout;
