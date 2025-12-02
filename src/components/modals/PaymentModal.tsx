/* eslint-disable @typescript-eslint/no-explicit-any */
// /*eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import { DollarSign, Loader } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type ApproveResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sessionTerm: any;
  setAmount: (amount: number | null) => void;
  amount: number | null;
  handleMakePayment: () => void;
  loading: boolean;
};

export default function PaymentModal({
  isOpen,
  onClose,
  sessionTerm,
  setAmount,
  amount,
  loading,
  handleMakePayment
}: ApproveResultModalProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({});


  const handleApprove = () => {
    handleMakePayment();
  };

  const handleChange = (field: keyof any, value: number) => {
    // setAmount((prev: number) => ({
    //   ...prev,
    //   [field]: value
    // }));

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: '8px',
      borderColor: '#d1d5db',
      padding: '0rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#5A38FD'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#5A38FD' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
    })
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="Approve-result-modal-title"
      sx={{
        backdropFilter: "blur(6px)", // blur background
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
            color: "#6b7280", // Tailwind gray-500
            "&:hover": { color: "#111827" }, // Tailwind gray-900
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography id="Approve-result-modal-title" variant="h6" component="h2" gutterBottom>
          <span className="font-semibold">Fee Payment</span>
        </Typography>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Session</label>
          <div className="border p-2 rounded-lg text-gray-400">{sessionTerm?.sessionTerm?.academicSession}</div>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Term</label>
          <div className="border p-2 rounded-lg text-gray-400">{sessionTerm?.sessionTerm?.term}</div>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Enter Amount</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={amount === null ? "" : amount}
            onChange={(e) => {
              const value = e.target.value;
              setAmount(value === '' ? null : parseFloat(value));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          fullWidth
          onClick={handleApprove}
          disabled={loading || !amount}
          sx={{
            mt: 2,
            backgroundColor: (!amount) ? "#d1d5db" : "#5A38FD",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#0f172b", // darker shade for hover
            },
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin text-white" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Make Payment
              <DollarSign size={18} className="text-white" />
            </span>
          )}
        </Button>
      </Box>
    </Modal>
  );
}