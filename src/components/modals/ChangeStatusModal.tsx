/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    Button,
    Stack,
} from '@mui/material';
import { Loader } from 'lucide-react';
import Select from 'react-select';
import { ActionService } from '../../services/actionService';
import { toast } from 'react-toastify';

interface ViewProfileModalProps {
    open: boolean;
    onClose: () => void;
    userId: string;
}

const style = {
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 3,
    height: '50vh',
    maxHeight: '90vh',
    overflowY: 'auto',
};

export default function ChangeStatusModal({
    open,
    onClose,
    userId,
}: ViewProfileModalProps) {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const statusOption = [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'resigned', label: 'Resigned' },
        { value: 'expelled', label: 'Expelled' },
        { value: 'graduated', label: 'Graduated' },
        { value: 'transfered', label: 'Transfered' },
        { value: 'dropout', label: 'Dropout' },
        { value: 'deleted', label: 'Deleted' },
    ];

    const customStyles = {
        control: (provided: any) => ({
            ...provided,
            borderRadius: '8px',
            borderColor: '#d1d5db',
            padding: '0rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#5A38FD',
            },
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? '#5A38FD'
                : state.isFocused
                    ? '#eff6ff'
                    : 'white',
            color: state.isSelected ? 'white' : '#1f2937',
        }),
    };

    const handleChangeStatus = async () => {
        setLoading(true);

        const payload = {
            status: status.value,
        }
        try {
            const res = await ActionService.changeUserStatus(userId, payload);
            toast.success(res.message);
            setStatus(null);
            onClose();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="change-status-title"
            sx={{
                backdropFilter: 'blur(6px)',
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box sx={style}>
                <Typography
                    id="change-status-title"
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                >
                    Change User Status
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Select a status below and click “Change Status” to update the user.
                </Typography>

                <Stack spacing={2}>
                    <Select
                        options={statusOption}
                        value={status}
                        onChange={setStatus}
                        placeholder="Select status..."
                        styles={customStyles}
                        maxMenuHeight={100}
                    // menuPlacement="auto"
                    />

                    <div className="flex items-center gap-2 justify-end">
                        <Button
                            onClick={handleChangeStatus}
                            disabled={loading || !userId}
                            sx={{
                                backgroundColor: !userId ? '#d1d5db' : '#5A38FD',
                                padding: '0.35rem 1rem',
                                color: 'white',
                                textTransform: 'none',
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: '#0f172b',
                                },
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Loader size={18} className="animate-spin text-white" />
                                </span>
                            ) : (
                                'Change Status'
                            )}
                        </Button>

                        <Box textAlign="right">
                            <Button
                                onClick={onClose}
                                variant="outlined"
                                color="inherit"
                                sx={{
                                    borderRadius: '8px',
                                    '&:hover': {
                                        backgroundColor: '#eee',
                                    },
                                }}
                            >
                                Close
                            </Button>
                        </Box>
                    </div>
                </Stack>
            </Box>
        </Modal>
    );
}