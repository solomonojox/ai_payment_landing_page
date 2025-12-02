/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { type SingleValue } from "react-select";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { ReportRespondType } from "../../types/reportsType";

type OptionType = {
  value: string;
  label: string;
};

type RespondModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ReportRespondType) => Promise<void>; // pass in API handler
};

export default function ReportResponseModal({ isOpen, onClose, onSubmit }: RespondModalProps) {
  const [responseText, setResponseText] = useState<string>("");
  const [status, setStatus] = useState<SingleValue<OptionType>>(null);
  const [loading, setLoading] = useState(false);

  const statusOptions: OptionType[] = [
    { value: "Resolved", label: "Resolved" },
    { value: "In Progress", label: "In Progress" },
    { value: "Pending", label: "Pending" },
  ];

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: "#d1d5db",
      padding: "0rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#5A38FD",
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#5A38FD" : state.isFocused ? "#eff6ff" : "white",
      color: state.isSelected ? "white" : "#1f2937",
    }),
  };

  const handleSubmit = async () => {
    if (!status || !responseText.trim()) {
      toast.error("Please enter a response and select a status");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        response: responseText,
        status: status.value,
      };
      await onSubmit(payload);
      // Clear the form after submission
      setResponseText("");
      setStatus(null);
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="respond-modal-title"
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
          width: "100%",
          maxWidth: "600px",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <IconButton
          onClick={onClose}
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

        <Typography id="respond-modal-title" variant="h6" component="h2" gutterBottom>
          Respond to Report
        </Typography>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Response</label>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Write your response..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            rows={4}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Status</label>
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select status..."
            styles={customStyles}
          />
        </div>

        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            mt: 2,
            backgroundColor: loading ? "#d1d5db" : "#5A38FD",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#4529c2",
            },
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin text-white" />
            </span>
          ) : (
            "Submit Response"
          )}
        </Button>
      </Box>
    </Modal>
  );
}
