import React, { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    IconButton,
    LinearProgress,
    Button,
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { Loader } from 'lucide-react';

export interface UploadUserModalProps {
    open: boolean;
    onClose: () => void;
    // parent gives onUpload that will internally call GuardianService.bulkCreate(formData, onProgress)
    onUpload: (file: File, onProgress: (percent: number) => void) => Promise<void>;
}

const UploadUserModal: React.FC<UploadUserModalProps> = ({
    open,
    onClose,
    onUpload,
}) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFile = (file: File) => {
        const validTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
        ];
        if (validTypes.includes(file.type)) {
            setSelectedFile(file);
        } else {
            alert('Please upload only Excel files (.xlsx or .xls)');
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    };

    const handleBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const startUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setProgress(0);
        try {
            await onUpload(selectedFile, (p) => setProgress(p));
            // finished
            setProgress(100);
            setTimeout(() => {
                setUploading(false);
                setProgress(0);
                setSelectedFile(null);
                onClose();
            }, 700);
        } catch (err) {
            alert('Upload failed');
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    borderRadius: 2,
                    mx: 'auto',
                    mt: '10%',
                    position: 'relative',
                }}
            >
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <Close />
                </IconButton>

                <Typography variant="h6" mb={2}>
                    Upload Users (Excel)
                </Typography>

                <Box
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                    }}
                    onDrop={handleDrop}
                    sx={{
                        border: '2px dashed',
                        borderColor: dragActive ? 'primary.main' : 'grey.400',
                        borderRadius: 2,
                        textAlign: 'center',
                        p: 4,
                        cursor: 'pointer',
                        mb: 2,
                        bgcolor: dragActive ? 'grey.100' : 'transparent',
                    }}
                >
                    <CloudUpload sx={{ fontSize: 40, mb: 1, color: '#5A38FD' }} />
                    <Typography>
                        Drag and drop your Excel file here or click to select
                    </Typography>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleBrowse}
                        style={{ display: 'none' }}
                        id="excel-upload"
                    />
                    <label htmlFor="excel-upload">
                        <Button component="span" sx={{ mt: 1, color: '#5A38FD' }}>
                            Browse File
                        </Button>
                    </label>
                </Box>

                {selectedFile && (
                    <Typography variant="body2" mb={2}>
                        Selected File: <strong>{selectedFile.name}</strong>
                    </Typography>
                )}

                {uploading && (
                    <Box sx={{ width: '100%', mb: 2 }}>
                        <LinearProgress variant="determinate" value={progress} />
                        <Typography variant="body2" textAlign="center">
                            {progress}%
                        </Typography>
                    </Box>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={startUpload}
                    disabled={!selectedFile || uploading}
                    sx={{
                        backgroundColor:
                            !selectedFile || uploading ? '#d1d5db' : '#5A38FD',
                        padding: '0.35rem 1rem',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#0f172b',
                        },
                    }}
                >
                    {uploading ? (
                        <span className="flex items-center gap-2">
                            <Loader size={18} className="animate-spin text-white" />
                        </span>
                    ) : (
                        'Upload File'
                    )}
                </Button>
            </Box>
        </Modal>
    );
};

export default UploadUserModal;