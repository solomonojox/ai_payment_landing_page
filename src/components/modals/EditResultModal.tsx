/* eslint-disable @typescript-eslint/no-explicit-any */
/*eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { type SingleValue } from "react-select";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { CaExamService } from "../../services/caExamService";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { CaType } from "../../types/caExamType";
import type { AnyListenerPredicate } from "@reduxjs/toolkit";


type OptionType = {
  value: string;
  label: string;
};

type ApproveResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseFetch: () => void;
  type: string;
  editData: any
};

export default function EditResultModal({
  isOpen,
  onClose,
  onCloseFetch,
  type,
  editData,
}: ApproveResultModalProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof any, string>>>({});
  const [formData, setFormData] = useState<any>({
    score: 0,
  });
  const [classId, setClassId] = useState<SingleValue<OptionType>>(null);
  const [session, setSession] = useState<SingleValue<OptionType>>(null);
  const [subject, setSubject] = useState<SingleValue<OptionType>>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const classrooms = useSelector((state: RootState) => state.getClassrooms).recordData;
  const subjects = useSelector((state: RootState) => state.getSubjects).recordData;

  const classOptions = classrooms.map((cls: any) => ({
    value: cls._id,
    label: cls.className,
  }));

  const subjectOptions = subjects.map((sub: any) => ({
    value: sub._id,
    label: sub.subjectName,
    level: sub.level,
  }));

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData });
      setClassId(classOptions.find((cls: any) => cls.value === editData.classId._id) ?? null);
      setSubject(subjectOptions.find((sub: any) => sub.value === editData.subject._id) ?? null);
    }
  }, [editData]);

  const handleApprove = async () => {
    setLoading(true);
    try {
      if (formData.score) {
        if (type === 'CA') {
          await CaExamService.updateCa(editData?._id, formData);
          toast.success("CA updated successfully");
          onCloseFetch();
        } else {
          await CaExamService.updateExam(editData?._id, formData);
          toast.success("Exam updated successfully");
          onCloseFetch();
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof any, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));

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
          <span className="font-semibold">Approve {type}</span>
        </Typography>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Subject</label>
          <Select
            options={subjectOptions}
            value={subject}
            placeholder="Select subject..."
            styles={customStyles}
            isDisabled
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Class</label>
          <Select
            options={classOptions}
            value={classId}
            placeholder="Select class..."
            styles={customStyles}
            isDisabled
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Enter Score</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={formData.score === null ? "" : formData.score}
            onChange={(e) => {
              const value = e.target.value;
              handleChange('score', value === "" ? null : parseFloat(value));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button
          fullWidth
          onClick={handleApprove}
          disabled={loading || !classId}
          sx={{
            mt: 2,
            backgroundColor: (!classId || !subject) ? "#d1d5db" : "#5A38FD",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#4529c2", // darker shade for hover
            },
          }}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin text-white" />
            </span>
          ) : (
            "Edit Result"
          )}
        </Button>
      </Box>
    </Modal>
  );
}