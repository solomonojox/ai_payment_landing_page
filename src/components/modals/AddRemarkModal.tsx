// /* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../context/auth/useAuth";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import type { ExistingRemarkData } from "../../types/studentTermlyType";

type AddRemarkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
  onSubmit: (data: {
    studentId: string;
    sessionTerm: string;
    remark: string;
  }) => void;
  onUpdate: (
    studentId: string,
    sessionTerm: string,
    remark: string
  ) => void;
  isLoadingRemark: boolean;
  existingRemarkData?: ExistingRemarkData | null;
  isCheckingExisting: boolean;
};

export default function AddRemarkModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  onSubmit,
  onUpdate,
  isLoadingRemark,
  existingRemarkData,
  isCheckingExisting,
}: AddRemarkModalProps) {
  const { user } = useAuth();
  const [remark, setRemark] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Reset state when modal opens/closes or student changes
  useEffect(() => {
    if (isOpen) {
      if (existingRemarkData) {
        // Edit mode: populate with existing data
        if (user?.isPrincipal) {
          setRemark(existingRemarkData.principalRemark);
        } else {
          setRemark(existingRemarkData.classTeachersRemark);
        }
        setIsEditMode(true);
      } else {
        // Create mode: start with empty form
        setRemark("");
        setIsEditMode(false);
      }
    }
  }, [isOpen, existingRemarkData, studentId, user?.isPrincipal]);

  const handleSubmit = () => {
    if (!remark.trim()) {
      toast.error("Please enter a remark");
      return;
    }

    const payload = {
      studentId,
      sessionTerm: user?.currentSession._id || "",
      remark: remark.trim(),
    };

    if (isEditMode && existingRemarkData) {
      // Update existing record
      onUpdate(
        existingRemarkData.student._id,
        existingRemarkData.sessionTerm._id,
        remark.trim()
      );
    } else {
      // Create new record
      onSubmit(payload);
    }
  };

  const handleClose = () => {
    setRemark("");
    setIsEditMode(false);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="add-remark-modal-title"
      sx={{
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: '100%',
          maxWidth: "600px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#6b7280",
            "&:hover": { color: "#111827" },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="add-remark-modal-title" variant="h6" component="h2" gutterBottom>
          {isEditMode ? "Edit" : "Add"} Remark for {studentName}
          {isEditMode && existingRemarkData && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {existingRemarkData.sessionTerm.academicSession} - {existingRemarkData.sessionTerm.term}
            </Typography>
          )}
        </Typography>

        {isCheckingExisting ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner size={24} className="animate-spin text-[#5A38FD]" />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Checking existing data...
            </Typography>
          </div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              <Box
                sx={{
                  p: 2,
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: "#fafafa",
                }}
              >
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Student Remark"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter your remark about the student's performance, behavior, or any other observations..."
                  sx={{ mb: 2 }}
                  inputProps={{
                    maxLength: 500,
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "right" }}
                >
                  {remark?.length}/500 characters
                </Typography>
              </Box>

              <div className="bg-blue-50 p-3 rounded-lg">
                <Typography variant="body2" color="text.secondary">
                  <strong>Tip:</strong> Write constructive remarks that highlight the student's strengths,
                  areas for improvement, and overall performance. Be specific and encouraging.
                </Typography>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  borderColor: "#d1d5db",
                  color: "#374151",
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                    borderColor: "#9ca3af",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                onClick={handleSubmit}
                disabled={isLoadingRemark || !remark?.trim()}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  backgroundColor: (!remark?.trim() || isLoadingRemark) ? "#d1d5db" : "#5A38FD",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#4529c2",
                  },
                  "&:disabled": {
                    backgroundColor: "#d1d5db",
                    color: "#9ca3af",
                  },
                }}
              >
                {isLoadingRemark ? (
                  <FaSpinner size={20} className="animate-spin text-white" />
                ) : (
                  `${isEditMode ? "Update" : "Submit"} Remark`
                )}
              </Button>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
}