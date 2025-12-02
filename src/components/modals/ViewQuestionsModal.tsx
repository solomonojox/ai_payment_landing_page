import React from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
    IconButton,
    Divider,
    Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ViewCBTQuestionType } from "../../types/cbtTypes";

interface ViewQuestionsModalProps {
    open: boolean;
    handleClose: () => void;
    questions: ViewCBTQuestionType[];
    onEdit?: (data: ViewCBTQuestionType) => void;
    onDelete?: (id: string) => void;
}

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 3,
    p: 3,
    maxHeight: "90vh",
    overflowY: "auto",
};

const ViewQuestionsModal: React.FC<ViewQuestionsModalProps> = ({
    open,
    handleClose,
    questions,
    onEdit,
    onDelete,
}) => {
    const handleAdd = () => {
        console.log("Add new question");
    };

    const handleEdit = (data: ViewCBTQuestionType) => {
        // console.log("Edit question with ID:", data);
        if (onEdit) {
            onEdit(data);
        }
    };

    const handleDelete = (id: string) => {
        if (onDelete) {
            onDelete(id)
        }
    };

    return (
        <Modal open={open} onClose={handleClose} sx={{zIndex: "30"}}>
            <Box sx={style}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                        Exam Questions
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* <Box textAlign="right" mb={2}>
                    <Button variant="contained" color="primary" onClick={handleAdd}>
                        Add Question
                    </Button>
                </Box> */}

                {questions.length === 0 ? (
                    <Typography variant="body1" color="text.secondary">
                        No questions available.
                    </Typography>
                ) : (
                    questions.map((q, index) => (
                        <Box
                            key={q._id}
                            mb={3}
                            p={2}
                            border="1px solid #ddd"
                            borderRadius={2}
                            boxShadow={1}
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                dangerouslySetInnerHTML={{ __html: `${index + 1}. ${q.questionText}` }}
                            />

                            <Box mt={1} ml={2}>
                                {q.options.map((opt, i) => (
                                    <Typography key={i} variant="body2">
                                        {String.fromCharCode(65 + i)}. {opt}
                                    </Typography>
                                ))}
                            </Box>

                            <Typography mt={1} variant="body2" color="green">
                                ✅ Correct Answer: {q.correctAnswer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Marks: {q.marks}
                            </Typography>

                            <Stack direction="row" spacing={1} mt={2}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleEdit(q)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => handleDelete(q._id)}
                                >
                                    Delete
                                </Button>
                            </Stack>
                        </Box>
                    ))
                )}
            </Box>
        </Modal>
    );
};

export default ViewQuestionsModal;