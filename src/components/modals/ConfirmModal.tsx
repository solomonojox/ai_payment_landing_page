import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title = "Are you sure?",
    message = "Do you want to continue with this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="confirm-modal-title"
                    aria-describedby="confirm-modal-message"
                >
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-md"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                    >
                        <h3
                            id="confirm-modal-title"
                            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
                        >
                            {title}
                        </h3>
                        <p
                            id="confirm-modal-message"
                            className="mt-2 text-gray-600 dark:text-gray-300"
                        >
                            {message}
                        </p>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-hover"
                            >
                                {loading ? (
                                    <span className="flex gap-2 items-center">
                                        <Loader size={18} className="animate-spin" />
                                        Loading...
                                    </span>
                                ) : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;