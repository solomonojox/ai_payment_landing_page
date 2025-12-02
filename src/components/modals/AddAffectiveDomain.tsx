// /* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../context/auth/useAuth";
import { FaSpinner } from "react-icons/fa";
import type { AffectiveDomain, ExistingAffectiveData } from "../../types/studentTermlyType";

type AddAffectiveDomainModalProps = {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    studentName: string;
    onSubmit: (data: {
        studentId: string;
        sessionTerm: string;
        affectiveDomains: AffectiveDomain[];
    }) => void;
    onUpdate: (
        studentId: string,
        sessionTerm: string,
        affectiveDomains: AffectiveDomain[]
    ) => void;
    isLoadingAffective: boolean;
    existingAffectiveData?: ExistingAffectiveData | null;
    isCheckingExisting: boolean;
    dataType?: string;
};

export default function AddAffectiveDomainModal({
    isOpen,
    onClose,
    studentId,
    studentName,
    onSubmit,
    onUpdate,
    isLoadingAffective,
    existingAffectiveData,
    isCheckingExisting,
    dataType,
}: AddAffectiveDomainModalProps) {
    const { user } = useAuth();
    const [affectiveDomains, setAffectiveDomains] = useState<AffectiveDomain[]>([
        { name: "", rating: 1 },
    ]);
    const [isEditMode, setIsEditMode] = useState(false);

    // Reset state when modal opens/closes or student changes
    useEffect(() => {
        if (isOpen) {
            if (existingAffectiveData) {
                // Edit mode: populate with existing data
                if (dataType === "affective") {
                    setAffectiveDomains(existingAffectiveData.affectiveDomains);
                } else if (dataType === "psychomotor") {
                    setAffectiveDomains(existingAffectiveData.psychomotorSkill);
                }
                setIsEditMode(true);
            } else {
                // Create mode: start with empty form
                setAffectiveDomains([{ name: "", rating: 1 }]);
                setIsEditMode(false);
            }
        }
    }, [isOpen, existingAffectiveData, studentId, dataType]);

    const handleAddDomain = () => {
        setAffectiveDomains([...affectiveDomains, { name: "", rating: 1 }]);
    };

    const handleRemoveDomain = (index: number) => {
        if (affectiveDomains.length > 1) {
            const updatedDomains = affectiveDomains.filter((_, i) => i !== index);
            setAffectiveDomains(updatedDomains);
        }
    };

    const handleDomainNameChange = (index: number, value: string) => {
        const updatedDomains = affectiveDomains.map((domain, i) =>
            i === index ? { ...domain, name: value } : domain
        );
        setAffectiveDomains(updatedDomains);
    };

    const handleRatingChange = (index: number, value: number) => {
        const updatedDomains = affectiveDomains.map((domain, i) =>
            i === index ? { ...domain, rating: value } : domain
        );
        setAffectiveDomains(updatedDomains);
    };

    const handleSubmit = () => {
        // Validate that all domains have names
        const hasEmptyNames = affectiveDomains.some(domain => !domain.name.trim());
        if (hasEmptyNames) {
            alert("Please fill in all domain names");
            return;
        }

        const payload = {
            studentId,
            sessionTerm: user?.currentSession._id || "",
            affectiveDomains: affectiveDomains.map(domain => ({
                name: domain.name,
                rating: domain.rating
            })),
        };

        const updatePayload = affectiveDomains.map(domain => ({
            name: domain.name,
            rating: domain.rating
        }))

        if (isEditMode && existingAffectiveData) {
            // Update existing record
            onUpdate(existingAffectiveData.studentId._id, existingAffectiveData.sessionTerm._id, updatePayload);
        } else {
            // Create new record
            onSubmit(payload);
        }
    };

    const handleClose = () => {
        setAffectiveDomains([{ name: "", rating: 1 }]);
        setIsEditMode(false);
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="add-affective-domain-modal-title"
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

                <Typography id="add-affective-domain-modal-title" variant="h6" component="h2" gutterBottom>
                    {isEditMode ? "Edit" : "Add"} Affective Domain for {studentName}
                    {isEditMode && existingAffectiveData && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {existingAffectiveData.sessionTerm.academicSession} - {existingAffectiveData.sessionTerm.term}
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
                            {affectiveDomains.map((domain, index) => (
                                <Box
                                    key={domain._id || index}
                                    sx={{
                                        p: 2,
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                            Domain {index + 1}
                                        </Typography>
                                        {affectiveDomains.length > 1 && (
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveDomain(index)}
                                                sx={{
                                                    color: "#ef4444",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(239, 68, 68, 0.04)",
                                                    },
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </div>

                                    <TextField
                                        fullWidth
                                        label="Domain Name"
                                        value={domain.name}
                                        onChange={(e) => handleDomainNameChange(index, e.target.value)}
                                        placeholder="e.g., Neatness, Punctuality, Cooperation"
                                        sx={{ mb: 2 }}
                                    />

                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Rating</FormLabel>
                                        <RadioGroup
                                            row
                                            value={domain.rating.toString()}
                                            onChange={(e) => handleRatingChange(index, parseInt(e.target.value))}
                                        >
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <FormControlLabel
                                                    key={rating}
                                                    value={rating.toString()}
                                                    control={
                                                        <Radio
                                                            sx={{
                                                                color: "#5A38FD",
                                                                "&.Mui-checked": {
                                                                    color: "#5A38FD",
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label={rating.toString()}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            ))}

                            <Button
                                startIcon={<AddIcon />}
                                onClick={handleAddDomain}
                                variant="outlined"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    borderColor: "#5A38FD",
                                    color: "#5A38FD",
                                    "&:hover": {
                                        backgroundColor: "#eff6ff",
                                        borderColor: "#4529c2",
                                    },
                                }}
                            >
                                Add Another Domain
                            </Button>
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
                                disabled={isLoadingAffective}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    backgroundColor: "#5A38FD",
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
                                {isLoadingAffective ? (
                                    <FaSpinner size={20} className="animate-spin text-white" />
                                ) : (
                                    `${isEditMode ? "Update" : "Submit"}`
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </Box>
        </Modal>
    );
}