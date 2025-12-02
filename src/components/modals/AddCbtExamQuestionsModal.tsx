/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useMemo } from "react";
import { Modal, Box, Typography, IconButton, TextField, Button, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FaSpinner } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { CBTExamService } from "../../services/cbtService";

type AddCbtExamQuestionsProps = {
    isOpen: boolean;
    onClose: () => void;
    examId: string;
    examTitle: string;
    subject: string;
    onSubmit: (data: any) => void;
    onUpdate: (id: string, data: any) => void;
    editData?: any | null;
    isSubmitting: boolean;
    refetchQuestions: (examId: string) => void;
};

const AddCbtExamQuestionsModal: React.FC<AddCbtExamQuestionsProps> = ({
    isOpen,
    onClose,
    examId,
    examTitle,
    subject,
    onSubmit,
    onUpdate,
    editData,
    isSubmitting,
    refetchQuestions,
}) => {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState<string[]>(["", ""]);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [marks, setMarks] = useState<number | ''>(1);
    const [type, setType] = useState<"objective" | "theory">("objective");
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    // console.log(examId);

    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setQuestionText(editData.questionText || "");
                setOptions(editData.options || ["", ""]);
                setCorrectAnswer(editData.correctAnswer || "");
                setMarks(editData.marks || 1);
                setType(editData.type || "objective");
                setIsEditMode(true);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editData]);

    const resetForm = () => {
        setQuestionText("");
        setOptions(["", ""]);
        setCorrectAnswer("");
        setMarks(1);
        setType("objective");
        setIsEditMode(false);
    };

    const quillModules = useMemo(
        () => ({
            toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
            ],
        }),
        []
    );

    const handleOptionChange = (index: number, value: string) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const addOption = () => {
        if (options.length < 6) setOptions([...options, ""]);
        else toast.info("You can only add up to 6 options");
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const updatedOptions = options.filter((_, i) => i !== index);
            setOptions(updatedOptions);
        } else {
            toast.info("At least two options are required");
        }
    };

    const handleSubmit = async () => {
        if (!questionText || questionText === "<p><br></p>") {
            toast.error("Question text is required");
            return;
        }
        if (type === "objective") {
            if (options.some((opt) => !opt.trim())) {
                toast.error("Please fill in all options");
                return;
            }
            if (!correctAnswer.trim()) {
                toast.error("Please specify the correct answer");
                return;
            }
            if (!options.includes(correctAnswer)) {
                toast.error("Correct answer must match one of the options");
                return;
            }
        }

        setLoading(true);

        const payload = {
            examId,
            questionText,
            options: type === "objective" ? options : [],
            correctAnswer: type === "objective" ? correctAnswer : "N/A",
            marks,
            type,
        };
        const payloadEdit = {
            // examId,
            questionText,
            options: type === "objective" ? options : [],
            correctAnswer: type === "objective" ? correctAnswer : "N/A",
            marks,
            type,
        };

        try {
            if (isEditMode && editData?._id) {
                await CBTExamService.updateQuestions(editData._id, payloadEdit);
                toast.success("Question updated successfully");
                resetForm();
                onClose();
                refetchQuestions(editData?.examId);
            } else {
                await CBTExamService.addQuestions(payload);
                toast.success("Question added successfully");
                resetForm();
                onClose();
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="add-question-modal-title"
            sx={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                zIndex: "40"
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "700px",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: "90vh",
                    overflowY: "auto",
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

                <Typography variant="h6" component="h2" gutterBottom>
                    {isEditMode ? "Edit" : "Add"} Question for {examTitle} - {subject}
                </Typography>

                <div className="space-y-4 mt-4">
                    {/* Question Text */}
                    <div>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Question Text
                        </Typography>
                        <ReactQuill
                            value={questionText}
                            onChange={setQuestionText}
                            modules={quillModules}
                            theme="snow"
                            placeholder="Type the question here..."
                        />
                    </div>

                    {/* Question Type */}
                    <TextField
                        select
                        fullWidth
                        label="Question Type"
                        value={type}
                        onChange={(e) => setType(e.target.value as "objective" | "theory")}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="objective">Objective</MenuItem>
                        <MenuItem value="theory" disabled>Theory</MenuItem>
                    </TextField>

                    {/* Options for Objective */}
                    {type === "objective" && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                Options
                            </Typography>
                            {options.map((opt, idx) => (
                                <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
                                    <TextField
                                        fullWidth
                                        label={`Option ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    />
                                    <Button
                                        onClick={() => removeOption(idx)}
                                        color="error"
                                        disabled={options.length <= 2}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            ))}
                            <Button onClick={addOption} sx={{ mt: 1 }}>
                                + Add Option
                            </Button>

                            <TextField
                                fullWidth
                                label="Correct Answer"
                                value={correctAnswer}
                                onChange={(e) => setCorrectAnswer(e.target.value)}
                                sx={{ mt: 2 }}
                                placeholder="Enter the exact text of the correct answer"
                            />
                        </Box>
                    )}

                    {/* Marks */}
                    <TextField
                        fullWidth
                        label="Marks"
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(Number(e.target.value) || '')}
                        sx={{ mt: 3 }}
                    />
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
                            "&:hover": { backgroundColor: "#f9fafb", borderColor: "#9ca3af" },
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                            borderRadius: "8px",
                            backgroundColor: loading ? "#d1d5db" : "#5A38FD",
                            color: "white",
                            "&:hover": { backgroundColor: "#4529c2" },
                        }}
                    >
                        {loading ? (
                            <FaSpinner size={20} className="animate-spin text-white" />
                        ) : (
                            `${isEditMode ? "Update" : "Submit"} Question`
                        )}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default AddCbtExamQuestionsModal;