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
import type { FeePlanType, FeePlanType2 } from "../../types/feePlanType";
import type { BillType } from "../../types/billType";
import { formatCurrency } from "../../utils/utils";
import { Card, CardContent, Grid } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import WarningIcon from "@mui/icons-material/Warning";
import { Loader } from "lucide-react";

type ViewClassModalProps = {
    isOpen: boolean;
    onClose: () => void;
    feePlan: FeePlanType2
    classData: BillType[];
    className: string;
    isClassMaster: boolean;
    loading: boolean;
};

type ActionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    student: Student;
    onAddAffectiveDomain: (student: Student) => void;
    onAddPsychomotorSkill: (student: Student) => void;
    onAddRemarks: (student: Student) => void;
};

// Summary Card Component
function SummaryCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "primary",
    loading = false
}: {
    title: string;
    value: string;
    subtitle?: string;
    icon: any;
    color?: "primary" | "success" | "warning" | "error";
    loading?: boolean;
}) {
    const colorMap = {
        primary: { bg: "#eff6ff", text: "#1e40af", icon: "#3b82f6" },
        success: { bg: "#f0fdf4", text: "#166534", icon: "#22c55e" },
        warning: { bg: "#fffbeb", text: "#92400e", icon: "#f59e0b" },
        error: { bg: "#fef2f2", text: "#991b1b", icon: "#ef4444" }
    };

    const colors = colorMap[color];

    return (
        <Card
            sx={{
                borderRadius: 2,
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                border: '1px solid #e5e7eb',
                height: '100%'
            }}
        >
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                fontWeight: 500,
                                fontSize: '0.875rem',
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>
                        {loading ? (
                            <div style={{ height: '32px', backgroundColor: '#e5e7eb', borderRadius: '4px', animation: 'pulse 2s infinite', width: '75%' }}></div>
                        ) : (
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    color: colors.text,
                                    mb: subtitle ? 0.5 : 0
                                }}
                            >
                                {value}
                            </Typography>
                        )}
                        {subtitle && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: '0.75rem' }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: colors.bg
                        }}
                    >
                        <Icon style={{ color: colors.icon, fontSize: '24px' }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
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

export default function ViewClassModalAdmin({
    isOpen,
    onClose,
    feePlan,
    classData,
    className,
    isClassMaster,
    loading,
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

    // Calculate collection rate for progress
    const collectionRate = feePlan?.summary ?
        (feePlan.summary.collected / feePlan.summary.totalExpected) * 100 : 0;

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
                        maxWidth: "1000px",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 2,
                        borderRadius: 2,
                        maxHeight: "90vh",
                        overflow: "auto",
                    }}
                >
                    {loading && (
                        <Typography
                            sx={{
                                backdropFilter: "blur(6px)",
                                backgroundColor: "rgba(0,0,0,0.8)",
                                padding: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            className="absolute top-0 left-0 w-full bg-black h-full italic text-white"
                        >
                            <Loader size={50} className="animate-spin text-white mb-2" />
                        </Typography>
                    )}
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

                    {/* Fee Plan Summary Cards */}
                    {feePlan && (
                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                                Fee Plan Summary - {feePlan.plan?.sessionTerm?.academicSession} ({feePlan.plan?.sessionTerm?.term})
                            </Typography>

                            <Grid container spacing={3}>
                                {/* Total Expected Revenue */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                                    <SummaryCard
                                        title="Total Expected"
                                        value={formatCurrency(feePlan.summary?.totalExpected || 0)}
                                        subtitle="Expected revenue"
                                        icon={TrendingUpIcon}
                                        color="primary"
                                    />

                                    {/* Amount Collected */}
                                    <SummaryCard
                                        title="Amount Collected"
                                        value={formatCurrency(feePlan.summary?.collected || 0)}
                                        subtitle={`${collectionRate.toFixed(1)}% collected`}
                                        icon={CreditCardIcon}
                                        color="success"
                                    />

                                    {/* Outstanding Balance */}
                                    <SummaryCard
                                        title="Outstanding"
                                        value={formatCurrency(feePlan.summary?.outstanding || 0)}
                                        subtitle="Pending payments"
                                        icon={WarningIcon}
                                        color="warning"
                                    />

                                    {/* Number of Students */}
                                    <SummaryCard
                                        title="Students"
                                        value={feePlan.noOfStudents?.toString() || "0"}
                                        subtitle="Total enrolled"
                                        icon={PeopleIcon}
                                        color="primary"
                                    />
                                </div>

                            </Grid>

                            {/* Additional Fee Plan Details */}
                            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                <Grid container spacing={2}>
                                    <div>
                                        <Typography variant="body2" color="text.secondary">
                                            Fee per Student:
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {formatCurrency(feePlan.plan?.amount || 0)}
                                        </Typography>
                                    </div>
                                    <div >
                                        <Typography variant="body2" color="text.secondary">
                                            Due Date:
                                        </Typography>
                                        <Typography variant="body1" fontWeight="medium">
                                            {feePlan.plan?.dueDate ?
                                                new Date(feePlan.plan.dueDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) :
                                                'Not set'
                                            }
                                        </Typography>
                                    </div>
                                </Grid>
                            </Box>
                        </Box>
                    )}

                    {/* Students Table */}
                    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none', border: '1px solid #e5e7eb' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="students table">
                            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Student Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Total Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Amount Paid</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151', width: '100px' }}>Balance</TableCell>
                                    {isClassMaster && (
                                        <TableCell sx={{ fontWeight: 'bold', color: '#374151', width: '80px' }}>Actions</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {classData?.map((student) => {
                                    return (
                                        <TableRow
                                            key={student._id}
                                            sx={{
                                                '&:last-child td, &:last-child th': { border: 0 },
                                                '&:hover': { backgroundColor: '#fafafa' }
                                            }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {student?.studentId?.fullName}
                                            </TableCell>
                                            <TableCell>{formatCurrency(student.totalAmount || 0)}</TableCell>
                                            <TableCell>{formatCurrency(student.amountPaid || 0)}</TableCell>
                                            <TableCell>{formatCurrency(student.balance || 0)}</TableCell>
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