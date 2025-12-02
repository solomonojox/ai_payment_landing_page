/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
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
import { NotificationService } from "../../services/NotificationService";


type OptionType = {
  value: string;
  label: string;
};

type ComputeResultModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  mode: string;
};

export default function ComputeResultModal({
  isOpen,
  onClose,
  type,
  mode,
}: ComputeResultModalProps) {
  const [classId, setClassId] = useState<SingleValue<OptionType>>(null);
  const [subjectId, setSubjectId] = useState<SingleValue<OptionType>>(null);
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

  const formatOptionLabel = (option: any) => (
    <div className="flex items-center gap-1">
      <span>{option.label}</span>
      {option.level && <span className="text-xs">({option.level})</span>}
    </div>
  );

  const formatSessionOptionLabel = (option: any) => (
    <div className="flex items-center gap-1">
      <span>{option.label}</span>
      {option.term && <span className="text-xs">({option.term})</span>}
    </div>
  );

  const sessionOptions = sessions.map((sess: any) => ({
    value: sess._id,
    label: sess.academicSession,
    term: sess.term
  }));

  const handleCompute = async () => {
    setSubmitting(true);
    try {
      if (classId && subjectId && session) {
        const payload = {
          classId: classId.value,
          subjectId: subjectId.value,
          sessionTerm: session.value,
        };

        const payload2 = {
          classId: classId.value,
          subject: subjectId.value,
          sessionTerm: session.value,
        };

        const className = classId.label;
        const subjectName = subjectId.label;
        const sessionName = session.label;

        if (type === "CA") {
          const notificationPaylod = {
            title: "CA Submission",
            message: `I have submitted my ${sessionName} ${subjectName} CA result for ${className} class for your review, please check for more information.`,
            type: "direct",
            recipients: "admins",
          };

          await CaExamService.submitCa(payload2);
          await NotificationService.sendNotification(notificationPaylod);
          toast.success("CA Result submitted successfully");
          setClassId(null); setSession(null); setSubjectId(null);
          onClose();
        } else if (type === "Exam") {
          const notificationPaylod = {
            title: "Exam Submission",
            message: `I have submitted my ${sessionName} ${subjectName} Exam result for ${className} class for your review, please check for more information.`,
            type: "direct",
            recipients: "admins",
          };

          await CaExamService.submitExam(payload2);
          await NotificationService.sendNotification(notificationPaylod);
          toast.success("Exam Result submitted successfully");
          setClassId(null); setSession(null); setSubjectId(null);
          onClose();
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message || 'Something went wrong');
      console.log(error);
    } finally {
      setSubmitting(false);
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
      onClose={() => { onClose(); setClassId(null); setSession(null); setSubjectId(null); }}
      aria-labelledby="compute-result-modal-title"
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
          width: '100%',
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
          onClick={() => { onClose(); setClassId(null); setSession(null); setSubjectId(null); }}
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
          <label className="block mb-1 font-medium">Subject</label>
          <Select
            options={subjectOptions}
            value={subjectId}
            formatOptionLabel={formatOptionLabel}
            onChange={setSubjectId}
            placeholder="Select subject..."
            styles={customStyles}
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
          disabled={submitting || !classId || !subjectId || !session}
          sx={{
            mt: 2,
            backgroundColor: (!classId || !subjectId || !session) ? "#d1d5db" : "#5A38FD",
            color: "white",
            textTransform: "none",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: "#4529c2", // darker shade for hover
            },
          }}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <Loader size={18} className="animate-spin text-white" />
            </span>
          ) : (
            <span>
              {mode === "Compute" ? "Compute Result" : "Submit Result"}
            </span>
          )}
        </Button>
      </Box>
    </Modal>
  );
}