import React from 'react';
import {
    Modal,
    Box,
    Typography,
    Avatar,
    Grid,
    Divider,
    Chip,
    Button
} from '@mui/material';
import { useAuth } from '../context/auth/useAuth';

type Guardian = {
    _id: string;
    fullName: string;
};

type StudentClass = {
    _id: string;
    className: string;
    level: string;
    section: string;
};

type CurrentSession = {
    _id: string;
    academicSession: string;
    term: string;
};

type Student = {
    _id: string;
    fullName: string;
    email: string;
    regNumber: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    address: string;
    schoolName: string;
    role: string;
    profileImage: string;
    guardian: Guardian;
    studentClass: StudentClass;
    isVerified: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    schoolSlug: string;
    verificationCode: string | null;
    currentSession: CurrentSession;
    yearOfAdmission: number;
    isPrincipal?: boolean;
    isFinancialOfficer?: boolean;
};

interface ViewProfileModalProps {
    open: boolean;
    onClose: () => void;
    student: Student;
}

const style = {
    position: 'relative' as const,
    width: '100%',
    maxWidth: "800px",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    maxHeight: '90vh',
    overflowY: 'auto',
};

export default function ViewProfileModal({
    open,
    onClose,
    student
}: ViewProfileModalProps) {
    const { user } = useAuth()

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="view-profile-title"
            sx={{
                backdropFilter: "blur(6px)", // blur background
                backgroundColor: "rgba(0,0,0,0.2)",
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box sx={style}>
                <Grid container spacing={2} alignItems="center">
                    <Grid >
                        <Avatar
                            src={student?.profileImage}
                            alt={student?.fullName}
                            sx={{ width: 80, height: 80 }}
                        />
                    </Grid>
                    <Grid >
                        <Typography id="view-profile-title" variant="h6" fontWeight="bold">
                            {student?.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {student?.role?.toUpperCase()} • {student?.status}
                        </Typography>
                        <Chip
                            label={student?.isVerified ? 'Verified' : 'Not Verified'}
                            color={student?.isVerified ? 'success' : 'warning'}
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />

                {/* Personal Info */}
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Personal Information
                </Typography>
                <Grid container spacing={2}>
                    <Grid >
                        {student?.regNumber && (
                            <Typography variant="body2"><strong>Reg No:</strong> {student?.regNumber}</Typography>
                        )}
                        <Typography variant="body2"><strong>Email:</strong> {student?.email}</Typography>
                        <Typography variant="body2"><strong>Phone:</strong> {student?.phone}</Typography>
                        <Typography variant="body2"><strong>Gender:</strong> {student?.gender}</Typography>
                    </Grid>
                    <Grid >
                        <Typography variant="body2">
                            <strong>Date of Birth:</strong>{' '}
                            {new Date(student?.dateOfBirth).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2"><strong>Address:</strong> {student?.address}</Typography>
                        {user?.role === "student" && (
                            <Typography variant="body2"><strong>Year of Admission:</strong> {student?.yearOfAdmission}</Typography>
                        )}
                        <Typography variant="body2"><strong>School:</strong> {student?.schoolName}</Typography>
                        {student?.isPrincipal && <Typography variant="body2"><strong>Is Principal:</strong> {student?.isPrincipal ? 'Yes' : 'No'}</Typography>}
                        {student?.isFinancialOfficer && <Typography variant="body2"><strong>Is Financial Officer:</strong> {student?.isFinancialOfficer ? 'Yes' : 'No'}</Typography>}
                    </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Class Info */}
                {student?.studentClass && student?.currentSession && (
                    <>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Class Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid>
                                <Typography variant="body2"><strong>Class:</strong> {student?.studentClass?.className}</Typography>
                                <Typography variant="body2"><strong>Level:</strong> {student?.studentClass?.level}</Typography>
                            </Grid>
                            <Grid>
                                <Typography variant="body2"><strong>Section:</strong> {student?.studentClass?.section}</Typography>
                                <Typography variant="body2">
                                    <strong>Current Session:</strong>{' '}
                                    {student?.currentSession?.academicSession} - {student?.currentSession?.term}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 2 }} />
                    </>
                )}


                {/* Guardian Info */}
                {student?.guardian && (
                    <>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Guardian
                        </Typography>
                        <Typography variant="body2"><strong>Name:</strong> {student?.guardian?.fullName}</Typography>
                        <Divider sx={{ my: 2 }} />
                    </>
                )}


                <Box textAlign="right" mt={2}>
                    <button onClick={onClose} className='bg-primary hover:bg-hover text-white py-2 px-6 rounded'>
                        Close
                    </button>
                </Box>
            </Box>
        </Modal>
    );
}