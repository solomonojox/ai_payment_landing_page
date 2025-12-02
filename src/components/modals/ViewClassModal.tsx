/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { UserType } from "../../types/userType";
import AddAffectiveDomainModal from "./AddAffectiveDomain";
import { ClassroomTeacherService } from "../../services/ClassroomTeacherService";
import { toast } from "react-toastify";
import { useAuth } from "../../context/auth/useAuth";
import AddRemarkModal from "./AddRemarkModal";
import type { AffectiveDomain, ExistingAffectiveData, ExistingRemarkData, Student } from "../../types/studentTermlyType";

type ViewClassModalProps = {
    isOpen: boolean;
    onClose: () => void;
    classData: UserType[];
    className: string;
    isClassMaster: boolean;
};

type ActionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    student: Student;
    onAddAffectiveDomain: (student: Student) => void;
    onAddPsychomotorSkill: (student: Student) => void;
    onAddRemarks: (student: Student) => void;
};

// Action Menu Modal Component
function ActionModal({
    isOpen,
    onClose,
    student,
    onAddAffectiveDomain,
    onAddPsychomotorSkill,
    onAddRemarks,
}: ActionModalProps) {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="action-modal-title"
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
                    maxWidth: "400px",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
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

                <Typography id="action-modal-title" variant="h6" component="h2" gutterBottom>
                    Actions for {student.fullName}
                </Typography>

                <div className="flex flex-col gap-3 mt-4">
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                            onAddAffectiveDomain(student);
                            onClose();
                        }}
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
                        Add Affective Domain
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                            onAddPsychomotorSkill(student);
                            onClose();
                        }}
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
                        Add Psychomotor Skill
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => {
                            onAddRemarks(student);
                            onClose();
                        }}
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
                        Add Term's Remark
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}

export default function ViewClassModal({
    isOpen,
    onClose,
    classData,
    className,
    isClassMaster,
}: ViewClassModalProps) {
    const { user } = useAuth()
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [affectiveDomainModalOpen, setAffectiveDomainModalOpen] = useState(false);
    const [selectedStudentForAffective, setSelectedStudentForAffective] = useState<Student | null>(null);
    const [selectedStudentForRemark, setSelectedStudentForRemark] = useState<Student | null>(null);
    const [isLoadingAffective, setIsLoadingAffective] = useState(false);
    const [existingAffectiveData, setExistingAffectiveData] = useState<ExistingAffectiveData | null>(null);
    const [isCheckingExisting, setIsCheckingExisting] = useState(false);
    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [existingRemarkData, setExistingRemarkData] = useState<ExistingRemarkData | null>(null);
    const [isCheckingRemark, setIsCheckingRemark] = useState(false);
    const [dataType, setDataType] = useState<string>("");

    const handleActionClick = (student: Student) => {
        setSelectedStudent(student);
        setActionModalOpen(true);
    };

    const handleCloseActionModal = () => {
        setActionModalOpen(false);
        setSelectedStudent(null);
    };

    const handleAddAffectiveDomain = async (student: Student) => {
        setSelectedStudentForAffective(student);
        setAffectiveDomainModalOpen(true);
        setDataType("affective");
        await checkExistingAffectiveData(student._id);
    };

    const handleAddPsychomotorSkill = async (student: Student) => {
        setSelectedStudentForAffective(student);
        setAffectiveDomainModalOpen(true);
        setDataType("psychomotor");
        await checkExistingPsychomotorData(student._id);
    };

    const handleAddRemarks = async (student: Student) => {
        setSelectedStudentForRemark(student);
        setRemarkModalOpen(true);
        await checkExistingRemarkData(student._id);
        // Implement your remarks logic here
    };

    const checkExistingAffectiveData = async (studentId: string) => {
        setIsCheckingExisting(true);
        try {
            const response = await ClassroomTeacherService.getStudentAffectiveDomain(
                studentId,
                user?.currentSession._id || ""
            );
            // console.log(response)
            setExistingAffectiveData(response);
        } catch (error) {
            // If no data found, set to null
            setExistingAffectiveData(null);
        } finally {
            setIsCheckingExisting(false);
        }
    };

    const checkExistingPsychomotorData = async (studentId: string) => {
        setIsCheckingExisting(true);
        try {
            const response = await ClassroomTeacherService.getStudentPsychomotorSkills(
                studentId,
                user?.currentSession._id || ""
            );
            console.log(response)
            setExistingAffectiveData(response);
        } catch (error) {
            // If no data found, set to null
            setExistingAffectiveData(null);
        } finally {
            setIsCheckingExisting(false);
        }
    };

    const handleAffectiveDomainSubmit = async (data: {
        studentId: string;
        sessionTerm: string;
        affectiveDomains: { name: string; rating: number }[];
    }) => {
        console.log("Affective Domain Data:", data);
        setIsLoadingAffective(true);
        try {
            if (dataType === "affective") {
                const res = await ClassroomTeacherService.createAffectiveDomain(data);
                toast.success(res.message);
                setAffectiveDomainModalOpen(false);
                setSelectedStudentForAffective(null);
            } else if (dataType === "psychomotor") {
                const res = await ClassroomTeacherService.createPsychomotorSkills(data);
                toast.success(res.message);
                setAffectiveDomainModalOpen(false);
                setSelectedStudentForAffective(null);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error.response.data.message || "Something went wrong. Try again.");
        } finally {
            setIsLoadingAffective(false);
        }
    };

    const handleAffectiveDomainUpdate = async (studentId: string, sessionTerm: string, affectiveDomains: AffectiveDomain[]) => {
        setIsLoadingAffective(true);
        try {
            if (dataType === "affective") {
                await ClassroomTeacherService.updateAffectiveDomain(studentId, sessionTerm, affectiveDomains);
                toast.success("Affective domains updated successfully");
            } else if (dataType === "psychomotor") {
                await ClassroomTeacherService.updatePsychomotorSkills(studentId, sessionTerm, affectiveDomains);
                toast.success("Psychomotor skills updated successfully");
            }
            setAffectiveDomainModalOpen(false);
            setSelectedStudentForAffective(null);
            setExistingAffectiveData(null);
        } catch (error: any) {
            toast.error(error.response.data.message || "Something went wrong. Try again.");
        } finally {
            setIsLoadingAffective(false);
        }
    };


    // Remarks
    const checkExistingRemarkData = async (studentId: string) => {
        setIsCheckingRemark(true);
        try {
            const response = await ClassroomTeacherService.getStudentTermRemark(
                studentId,
                user?.currentSession._id || ""
            );

            // console.log(response)
            setExistingRemarkData(response);
        } catch (error) {
            setExistingRemarkData(null);
        } finally {
            setIsCheckingRemark(false);
        }
    };

    // Handle remark submission
    const handleRemarkSubmit = async (data: {
        studentId: string;
        sessionTerm: string;
        remark: string;
    }) => {
        setIsLoadingAffective(true);
        try {
            await ClassroomTeacherService.createTermRemark(data);
            toast.success("Remark added successfully");
            setRemarkModalOpen(false);
            setSelectedStudentForRemark(null);
            setExistingRemarkData(null);
        } catch (error: any) {
            toast.error(error.response.data.message || "Failed to add remark");
        } finally {
            setIsLoadingAffective(false);
        }
    };

    // Handle remark update
    const handleRemarkUpdate = async (studentId: string, sessionTerm: string, remark: string) => {
        setIsLoadingAffective(true);
        try {
            if (user?.isPrincipal) {
                await ClassroomTeacherService.updateTermRemarkPrincipal(studentId, sessionTerm, remark);
            } else {
                await ClassroomTeacherService.updateTermRemark(studentId, sessionTerm, remark);
            }

            toast.success("Remark updated successfully");
            setRemarkModalOpen(false);
            setSelectedStudentForRemark(null);
            setExistingRemarkData(null);
        } catch (error: any) {
            toast.error(error.response.data.message || "Failed to update remark");
        } finally {
            setIsLoadingAffective(false);
        }
    };

    return (
        <>
            <Modal
                open={isOpen}
                onClose={onClose}
                aria-labelledby="view-class-modal-title"
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
                        maxWidth: "900px",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 2,
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

                    <Typography id="view-class-modal-title" variant="h6" component="h2" gutterBottom>
                        <span className="font-semibold">{className} - Students</span>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Total Students: {classData.length}
                        </Typography>
                    </Typography>

                    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="students table">
                            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Reg. No.</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Full Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Email</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151', width: '100px' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classData?.map((student) => {
                                    // Convert UserType to Student, ensuring regNumber is a string
                                    const mappedStudent: Student = {
                                        _id: student._id,
                                        fullName: student.fullName,
                                        email: student.email,
                                        regNumber: student.regNumber ?? "",
                                    };
                                    return (
                                        <TableRow
                                            key={student._id}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { backgroundColor: '#fafafa' }
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {mappedStudent.regNumber}
                                            </TableCell>
                                            <TableCell>{mappedStudent.fullName}</TableCell>
                                            <TableCell>{mappedStudent.email}</TableCell>
                                            <TableCell>
                                                {isClassMaster && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleActionClick(mappedStudent)}
                                                        sx={{
                                                            color: "#6b7280",
                                                            "&:hover": {
                                                                color: "#5A38FD",
                                                                backgroundColor: "rgba(90, 56, 253, 0.04)"
                                                            },
                                                        }}
                                                    >
                                                        <MoreVertIcon />
                                                    </IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {classData.length === 0 && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{
                                textAlign: 'center',
                                py: 4,
                                fontStyle: 'italic'
                            }}
                        >
                            No students found in this class.
                        </Typography>
                    )}
                </Box>
            </Modal>

            {/* Action Modal */}
            {selectedStudent && (
                <ActionModal
                    isOpen={actionModalOpen}
                    onClose={handleCloseActionModal}
                    student={selectedStudent}
                    onAddAffectiveDomain={handleAddAffectiveDomain}
                    onAddPsychomotorSkill={handleAddPsychomotorSkill}
                    onAddRemarks={handleAddRemarks}
                />
            )}

            {selectedStudentForAffective && (
                <AddAffectiveDomainModal
                    isOpen={affectiveDomainModalOpen}
                    onClose={() => {
                        setAffectiveDomainModalOpen(false);
                        setSelectedStudentForAffective(null);
                        setExistingAffectiveData(null);
                    }}
                    studentId={selectedStudentForAffective._id}
                    studentName={selectedStudentForAffective.fullName}
                    onSubmit={handleAffectiveDomainSubmit}
                    onUpdate={handleAffectiveDomainUpdate}
                    isLoadingAffective={isLoadingAffective}
                    existingAffectiveData={existingAffectiveData}
                    isCheckingExisting={isCheckingExisting}
                    dataType={dataType}
                />
            )}

            {selectedStudentForRemark && (
                <AddRemarkModal
                    isOpen={remarkModalOpen}
                    onClose={() => {
                        setRemarkModalOpen(false);
                        setSelectedStudentForRemark(null);
                        setExistingRemarkData(null);
                        setIsLoadingAffective(false)
                    }}
                    studentId={selectedStudentForRemark._id}
                    studentName={selectedStudentForRemark.fullName}
                    onSubmit={handleRemarkSubmit}
                    onUpdate={handleRemarkUpdate}
                    isLoadingRemark={isLoadingAffective}
                    existingRemarkData={existingRemarkData}
                    isCheckingExisting={isCheckingRemark}
                />
            )}
        </>
    );
}