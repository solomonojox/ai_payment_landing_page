/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { type SingleValue, type MultiValue } from "react-select";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { CaExamService } from "../../services/caExamService";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { NotificationService } from "../../services/NotificationService";

type OptionType = {
  value: string;
  label: string;
  level?: string;
  term?: string;
};

type ComputeResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCloseFetch: () => void;
  type: string;
  mode: string;
};

export default function ComputeSchoolResultModal({
  isOpen,
  onClose,
  onCloseFetch,
  type,
  mode,
}: ComputeResultModalProps) {
  const [classId, setClassId] = useState<SingleValue<OptionType>>(null);
  const [subjectIds, setSubjectIds] = useState<MultiValue<OptionType>>([]);
  const [session, setSession] = useState<SingleValue<OptionType>>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const classrooms = useSelector((state: RootState) => state.getClassrooms).recordData;
  const subjects = useSelector((state: RootState) => state.getSubjects).recordData;
  const sessions = useSelector((state: RootState) => state.getSessions).recordData;

  const classOptions = classrooms.map((cls: any) => ({
    value: cls._id,
    label: cls.className,
  }));

  const subjectOptions = subjects.map((sub: any) => ({
    value: sub._id,
    label: sub.subjectName,
    level: sub.level,
  }));

  const sessionOptions = sessions.map((sess: any) => ({
    value: sess._id,
    label: sess.academicSession,
    term: sess.term,
  }));

  const formatOptionLabel = (option: OptionType) => (
    <div className="flex items-center gap-1">
      <span>{option.label}</span>
      {option.level && <span className="text-xs text-gray-500">({option.level})</span>}
    </div>
  );

  const formatSessionOptionLabel = (option: OptionType) => (
    <div className="flex items-center gap-1">
      <span>{option.label}</span>
      {option.term && <span className="text-xs text-gray-500">({option.term})</span>}
    </div>
  );

  const savedFilters = sessionStorage.getItem('schoolResultFilters')
  const parsedFilters = savedFilters ? JSON.parse(savedFilters) : {}

  const handleCompute = async () => {
    setSubmitting(true);
    try {
      if (classId && subjectIds.length > 0 && session) {
        const payload = {
          classId: classId.value,
          subjectIds: subjectIds.map((s) => s.value), // ✅ send as array
          sessionTerm: session.value,
        };

        const className = classId.label;
        const sessionName = session.label;

        const notificationPayload = {
          title: "Result Computation",
          message: `I have computed my ${sessionName} Result for ${className} class for your review, please check for more information.`,
          type: "direct",
          recipients: "admins",
        };

        const result = await CaExamService.computeResult(payload);
        console.log(result)
        await NotificationService.sendNotification(notificationPayload);
        toast.success(result.message || "Result(s) computed successfully");
        setClassId(null);
        setSession(null);
        setSubjectIds([]);
        if (Object.keys(parsedFilters).length === 0) {
          onClose();
        } else {
          onCloseFetch();
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderRadius: "8px",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#5A38FD" },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#5A38FD"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "#1f2937",
    }),
  };

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        onClose();
        setClassId(null);
        setSession(null);
        setSubjectIds([]);
      }}
      aria-labelledby="compute-result-modal-title"
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
          onClick={() => {
            onClose();
            setClassId(null);
            setSession(null);
            setSubjectIds([]);
          }}
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

        <Typography id="compute-result-modal-title" variant="h6" component="h2" gutterBottom>
          <span className="font-semibold">{mode} {type}</span>
        </Typography>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Class</label>
          <Select
            options={classOptions}
            value={classId}
            onChange={setClassId}
            placeholder="Select class..."
            styles={customStyles}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Subjects</label>
          <Select
            options={subjectOptions}
            value={subjectIds}
            formatOptionLabel={formatOptionLabel}
            onChange={setSubjectIds}
            placeholder="Select subjects..."
            styles={customStyles}
            isMulti
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Session</label>
          <Select
            options={sessionOptions}
            value={session}
            onChange={setSession}
            formatOptionLabel={formatSessionOptionLabel}
            placeholder="Select session..."
            styles={customStyles}
          />
        </div>

        <Button
          fullWidth
          onClick={handleCompute}
          disabled={submitting || !classId || subjectIds.length === 0 || !session}
          sx={{
            mt: 2,
            backgroundColor:
              !classId || subjectIds.length === 0 || !session
                ? "#d1d5db"
                : "#5A38FD",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#4529c2" },
          }}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin text-white" />
            </span>
          ) : (
            <span>{mode === "Compute" ? "Compute Result" : "Submit Result"}</span>
          )}
        </Button>
      </Box>
    </Modal>
  );
}
